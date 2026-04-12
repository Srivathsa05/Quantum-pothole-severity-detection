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
};

const WS_URL = import.meta.env.VITE_BACKEND_WS || "ws://localhost:8000/ws/frame";

const cameras = [
  { id: 1, name: "CAM-01", location: "MG Road Junction", speed: "2.8s", intervalMs: 520 },
  { id: 2, name: "CAM-02", location: "Koramangala 80ft", speed: "3.6s", intervalMs: 600 },
  { id: 3, name: "CAM-03", location: "Whitefield Main", speed: "4.1s", intervalMs: 680 },
  { id: 4, name: "CAM-04", location: "Hebbal Flyover", speed: "3.2s", intervalMs: 760 },
];

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

  const [statusByCamera, setStatusByCamera] = useState<CameraStatus[]>(
    Array.from({ length: cameras.length }, () => ({ ...defaultStatus }))
  );
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    async function startLiveStreams() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (disposed) return;

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        cameras.forEach((camera, index) => {
          fpsWindowStartRef.current[index] = Date.now();
          frameCounterRef.current[index] = 0;

          const ws = new WebSocket(WS_URL);
          socketsRef.current[index] = ws;

          ws.onopen = () => {
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: true };
              return next;
            });

            const timer = window.setInterval(() => {
              if (!videoRef.current || ws.readyState !== WebSocket.OPEN) return;

              const canvas = document.createElement("canvas");
              canvas.width = 224;
              canvas.height = 224;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;

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

              const payload = {
                frame: canvas.toDataURL("image/jpeg", 0.8),
                ts: new Date().toISOString(),
              };
              ws.send(JSON.stringify(payload));
            }, camera.intervalMs);

            intervalsRef.current[index] = timer;
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data) as { severity?: string; confidence?: number };
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
                };
                return next;
              });
            } catch {
              // Ignore malformed messages from backend
            }
          };

          ws.onerror = () => {
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: false };
              return next;
            });
          };

          ws.onclose = () => {
            setStatusByCamera((previous) => {
              const next = [...previous];
              next[index] = { ...next[index], connected: false };
              return next;
            });
          };
        });
      } catch {
        setCameraError("Camera permission denied or unavailable. Live cards cannot stream frames.");
      }
    }

    void startLiveStreams();

    return () => {
      disposed = true;
      intervalsRef.current.forEach((timerId) => window.clearInterval(timerId));
      intervalsRef.current = [];

      socketsRef.current.forEach((socket) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });
      socketsRef.current = [];

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
    };
  }, []);

  return (
    <div className="section-container py-4">
      <video ref={videoRef} autoPlay muted playsInline className="hidden" />
      <p className="section-label mb-2">Live Detection</p>
      {cameraError && <p className="mb-3 text-xs text-red-300">{cameraError}</p>}

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
                  <svg className="h-full w-full" viewBox="0 0 320 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="70" width="320" height="40" fill="#0b1624" />
                    <path d="M0 80L80 70L160 76L240 68L320 72V110H0V80Z" fill="#16283c" />
                    <rect x="90" y="64" width="34" height="18" stroke={stroke} strokeDasharray="4 2" />
                    <rect x="204" y="61" width="22" height="14" stroke={stroke} strokeDasharray="4 2" />
                  </svg>
                  <div className="absolute right-2 top-2 rounded bg-slate-950/70 px-1.5 py-0.5 text-[10px] uppercase text-slate-200">
                    {status.severity} {Math.round(status.confidence * 100)}%
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
