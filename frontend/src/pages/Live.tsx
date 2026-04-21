import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CameraStatus = {
  severity: string;
  confidence: number;
  fps: number;
  latency: number;
  alerts: number;
  connected: boolean;
  allProbabilities?: Record<string, number>;
};

const SEVERITY_MIX_STORAGE_KEY = "roadpulse-severity-mix";
const LIVE_DETECTIONS_STORAGE_KEY = "roadpulse-live-detections";

// Real camera locations in Bengaluru
const cameraLocations: Record<number, { lat: number; lng: number }> = {
  1: { lat: 12.9755, lng: 77.6065 }, // MG Road Junction
  2: { lat: 12.9352, lng: 77.6245 }, // Koramangala 80ft
  3: { lat: 12.9698, lng: 77.7499 }, // Whitefield Main
  4: { lat: 13.0352, lng: 77.597 },  // Hebbal Flyover
};

// User's actual GPS location (will be requested on first detection)
let userLocation: { lat: number; lng: number } | null = null;

const WS_URL = import.meta.env.VITE_BACKEND_WS || "ws://localhost:8000/ws/frame";

const cameras = [
  { id: 1, name: "CAM-01", location: "MG Road Junction", speed: "520ms", intervalMs: 520 },
  { id: 2, name: "CAM-02", location: "Koramangala 80ft", speed: "600ms", intervalMs: 600 },
  { id: 3, name: "CAM-03", location: "Whitefield Main", speed: "680ms", intervalMs: 680 },
  { id: 4, name: "CAM-04", location: "Hebbal Flyover", speed: "760ms", intervalMs: 760 },
];

type VideoDevice = {
  deviceId: string;
  label: string;
};

const defaultStatus: CameraStatus = {
  severity: "no_pothole",
  confidence: 0,
  fps: 0,
  latency: 0,
  alerts: 0,
  connected: false,
};

function severityStroke(severity: string) {
  if (severity === "severe") return "#ef4444";
  if (severity === "minor") return "#f59e0b";
  return "#22c55e";
}

export default function Live() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketsRef = useRef<(WebSocket | null)[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const pendingSentAtRef = useRef<number[]>([]);
  const frameCounterRef = useRef<number[]>([]);
  const fpsWindowStartRef = useRef<number[]>([]);
  const connectingRef = useRef<boolean[]>([]);

  const [statusByCamera, setStatusByCamera] = useState<CameraStatus[]>(
    Array.from({ length: cameras.length }, () => ({ ...defaultStatus }))
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>("");

  // Enumerate available cameras on mount
  useEffect(() => {
    async function enumerateCameras() {
      try {
        // Request permission first
        await navigator.mediaDevices.getUserMedia({ video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices
          .filter(d => d.kind === "videoinput")
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 8)}...` }));

        setVideoDevices(videoInputs);

        // Auto-select OBS Virtual Camera if available
        const obsCamera = videoInputs.find(d =>
          d.label.toLowerCase().includes("obs") ||
          d.label.toLowerCase().includes("virtual")
        );

        if (obsCamera) {
          setSelectedDeviceId(obsCamera.deviceId);
        } else if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      } catch (err) {
        console.error("Failed to enumerate cameras:", err);
      }
    }

    enumerateCameras();
  }, []);

  // Reset camera statuses when component mounts
  useEffect(() => {
    setStatusByCamera(
      Array.from({ length: cameras.length }, () => ({ ...defaultStatus, connected: true }))
    );
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) return;

    let disposed = false;

    async function checkBackendHealth(): Promise<boolean> {
      try {
        const response = await fetch("http://localhost:8000/health", {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        });
        return response.ok;
      } catch {
        return false;
      }
    }

    async function startLiveStreams() {
      try {
        // Check if backend is running before starting streams
        const isBackendHealthy = await checkBackendHealth();
        if (!isBackendHealthy) {
          setCameraError("Backend server is not running. Please start the backend server.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedDeviceId }
          },
          audio: false,
        });
        
        // Get the active camera label
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          setActiveCameraLabel(videoTrack.label);
        }
        
        if (disposed) return;

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        videoRef.current.onloadedmetadata = () => {
          console.log(`Video metadata loaded:`, {
            duration: videoRef.current?.duration,
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight,
          });
          if (videoRef.current) {
            videoRef.current.play();
          }
        };

        videoRef.current.onplay = () => {
          console.log(`Video started playing`);
        };

        videoRef.current.onpause = () => {
          console.log(`Video paused`);
        };

        videoRef.current.onended = () => {
          console.log(`Video ended, restarting`);
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
          }
        };

        videoRef.current.onerror = (e) => {
          console.error(`Video error:`, e);
        };

        cameras.forEach((camera, index) => {
          fpsWindowStartRef.current[index] = Date.now();
          frameCounterRef.current[index] = 0;
          connectingRef.current[index] = false;

          let retryCount = 0;
          const maxRetries = 3;
          const retryDelay = 2000; // 2 seconds

          function connectWebSocket() {
            if (disposed || connectingRef.current[index]) return;

            connectingRef.current[index] = true;
            const ws = new WebSocket(WS_URL);
            socketsRef.current[index] = ws;

            // Optimistically set connected to true when creating connection
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: true };
              return next;
            });

            ws.onopen = () => {
              console.log(`Camera ${index} WebSocket connected`);
              connectingRef.current[index] = false;
              retryCount = 0;
              const timer = window.setInterval(() => {
              if (!videoRef.current || ws.readyState !== WebSocket.OPEN) return;

              // Log video state for debugging
              const video = videoRef.current;
              console.log(`Camera ${index} - Video state:`, {
                readyState: video.readyState,
                currentTime: video.currentTime,
                duration: video.duration,
                paused: video.paused,
                ended: video.ended,
                seeking: video.seeking,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
              });

              const canvas = document.createElement("canvas");
              // Use higher resolution for better model accuracy (800x600)
              canvas.width = 800;
              canvas.height = 600;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;

              // Use better image rendering quality
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = "high";
              ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              pendingSentAtRef.current[index] = Date.now();
              frameCounterRef.current[index] += 1;

              const elapsed = Date.now() - (fpsWindowStartRef.current[index] || Date.now());
              if (elapsed >= 1000) {
                const fpsValue = Math.round((frameCounterRef.current[index] * 1000) / elapsed);
                fpsWindowStartRef.current[index] = Date.now();
                frameCounterRef.current[index] = 0;
                setStatusByCamera((previous) => {
                  const next = [...previous];
                  next[index] = { ...next[index], fps: fpsValue };
                  return next;
                });
              }

              // Maximum JPEG quality for best detection (0.98)
              const payload = {
                frame: canvas.toDataURL("image/jpeg", 0.98),
                ts: new Date().toISOString(),
                lat: userLocation?.lat || cameraLocations[index + 1]?.lat,
                lon: userLocation?.lng || cameraLocations[index + 1]?.lng,
              };
              ws.send(JSON.stringify(payload));
            }, camera.intervalMs);

            intervalsRef.current[index] = timer;
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data) as { 
                severity?: string; 
                confidence?: number;
                all_probabilities?: Record<string, number>;
              };
              const latencyValue = Math.max(0, Date.now() - (pendingSentAtRef.current[index] || Date.now()));
              const isAlert = data.severity === "severe" || data.severity === "minor";

              setStatusByCamera((previous) => {
                const next = [...previous];
                const previousAlerts = next[index].alerts;
                next[index] = {
                  ...next[index],
                  severity: data.severity ?? "no_pothole",
                  confidence: Number(data.confidence ?? 0),
                  latency: latencyValue,
                  alerts: isAlert ? previousAlerts + 1 : previousAlerts,
                  allProbabilities: data.all_probabilities,
                };
                return next;
              });

              // Update severity mix in localStorage for Home.tsx
              if (data.severity) {
                try {
                  const currentMix = JSON.parse(localStorage.getItem(SEVERITY_MIX_STORAGE_KEY) || '{"severe":0,"minor":0,"no_pothole":0}');
                  currentMix[data.severity as keyof typeof currentMix] += 1;
                  const total = currentMix.severe + currentMix.minor + currentMix.no_pothole;
                  if (total > 0) {
                    const percentages = {
                      severe: Math.round((currentMix.severe / total) * 100),
                      minor: Math.round((currentMix.minor / total) * 100),
                      no_pothole: Math.round((currentMix.no_pothole / total) * 100),
                    };
                    localStorage.setItem(SEVERITY_MIX_STORAGE_KEY, JSON.stringify(percentages));
                  }
                } catch {
                  // Ignore storage errors
                }

                // Store location data for heatmap
                let locationData;

                // Request user's GPS location on first detection
                if (!userLocation && navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      };
                    },
                    (error) => {
                      console.warn("Geolocation error:", error);
                      // Fallback to camera location if geolocation fails
                    },
                    { enableHighAccuracy: true, timeout: 5000 }
                  );
                }

                // Use user's actual location if available, otherwise use camera location
                if (userLocation) {
                  locationData = {
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                    severity: data.severity,
                    timestamp: new Date().toISOString(),
                  };
                } else {
                  locationData = {
                    lat: cameraLocations[index + 1].lat,
                    lng: cameraLocations[index + 1].lng,
                    severity: data.severity,
                    timestamp: new Date().toISOString(),
                  };
                }
                try {
                  const liveDetections = JSON.parse(localStorage.getItem(LIVE_DETECTIONS_STORAGE_KEY) || "[]");
                  liveDetections.push(locationData);
                  // Keep only last 100 detections to avoid localStorage overflow
                  if (liveDetections.length > 100) {
                    liveDetections.shift();
                  }
                  localStorage.setItem(LIVE_DETECTIONS_STORAGE_KEY, JSON.stringify(liveDetections));
                } catch {
                  // Ignore storage errors
                }
              }
            } catch {
              // Ignore malformed messages from backend
            }
          };

          ws.onerror = (error) => {
            console.error(`Camera ${index} WebSocket error:`, error);
            connectingRef.current[index] = false;
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: false };
              return next;
            });

            // Retry connection if not disposed and under max retries
            if (!disposed && retryCount < maxRetries) {
              retryCount++;
              console.log(`Camera ${index} Retrying WebSocket connection (${retryCount}/${maxRetries})`);
              setTimeout(connectWebSocket, retryDelay * retryCount);
            }
          };

          ws.onclose = (event) => {
            console.log(`Camera ${index} WebSocket closed:`, event.code, event.reason);
            connectingRef.current[index] = false;
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: false };
              return next;
            });

            // Retry connection if not disposed and under max retries
            if (!disposed && retryCount < maxRetries && event.code !== 1000) {
              retryCount++;
              console.log(`Camera ${index} Retrying WebSocket connection (${retryCount}/${maxRetries})`);
              setTimeout(connectWebSocket, retryDelay * retryCount);
            }
          };
        }

        // Start WebSocket connection
        connectWebSocket();
      });
      } catch {
        setCameraError("Camera permission denied or unavailable. Live cards cannot stream frames.");
      }
    }

    void startLiveStreams();

    return () => {
      disposed = true;

      // Clear all intervals
      intervalsRef.current.forEach((timerId) => window.clearInterval(timerId));
      intervalsRef.current = [];

      // Close all WebSocket connections
      socketsRef.current.forEach((socket) => {
        if (socket) {
          if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close(1000, "Component unmounting");
          }
        }
      });
      socketsRef.current = [];

      // Stop all video tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;

      console.log("Live component cleanup completed");
    };
  }, [selectedDeviceId]);

  return (
    <div className="section-container py-4">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <p className="section-label mb-2">Live Detection</p>
      
      {/* Camera Selector */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-xs text-slate-400">Camera:</label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="rounded border border-[#1d3c56] bg-[#0a1625] px-2 py-1 text-xs text-slate-200"
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        {activeCameraLabel && (
          <span className="text-xs text-emerald-400">
            Active: {activeCameraLabel}
          </span>
        )}
      </div>
      
      {cameraError && <p className="mb-3 text-xs text-red-300">{cameraError}</p>}
      
      {/* Explanation note */}
      <p className="mb-3 text-xs text-slate-500">
        Note: All 4 cameras show the same feed with different processing intervals. 
        Results will be similar since they analyze the same video source.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {cameras.map((camera, index) => {
          const status = statusByCamera[index] || defaultStatus;
          const stroke = severityStroke(status.severity);

          return (
            <Card key={camera.id} className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm text-slate-100">{camera.name}</CardTitle>
                  <p className="text-xs text-slate-400">{camera.location}</p>
                </div>
                <Badge className="border-red-500/40 bg-red-500/10 text-red-300">
                  <span className="mr-1 inline-flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  {status.connected ? "LIVE" : "OFFLINE"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="relative h-[110px] overflow-hidden rounded-md border border-[#14304a] bg-[#050b14]">
                  <div className="scanline" style={{ animationDuration: camera.speed, animationDelay: `${index * 0.2}s` }} />
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-semibold" style={{ color: stroke }}>
                        {status.severity === "no_pothole" ? "NO POTHOLE" : status.severity.toUpperCase()}
                      </div>
                      <div className="text-sm text-slate-400">
                        Confidence: {Math.round(status.confidence * 100)}%
                      </div>
                      {/* Debug: Show all class probabilities */}
                      {status.allProbabilities && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(status.allProbabilities).map(([cls, prob]) => (
                            <div key={cls} className="flex items-center gap-1 text-[10px]">
                              <span className="w-12 text-slate-500">{cls}:</span>
                              <div className="flex-1 h-2 rounded bg-slate-800 overflow-hidden">
                                <div 
                                  className="h-full rounded bg-[#00d4ff]"
                                  style={{ width: `${prob * 100}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-slate-400">{Math.round(prob * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 rounded bg-slate-950/70 px-1.5 py-0.5 text-[10px] uppercase text-slate-200">
                    {status.connected ? "LIVE" : "OFFLINE"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                  <div className="rounded border border-[#17334c] bg-[#06101b] p-2">{status.fps || 0} FPS</div>
                  <div className="rounded border border-[#17334c] bg-[#06101b] p-2">{status.latency || 0} ms</div>
                  <div className="rounded border border-[#17334c] bg-[#06101b] p-2">{status.alerts} alerts</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
