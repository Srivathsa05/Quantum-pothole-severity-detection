import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Video,
  X,
  FlipHorizontal,
  Circle,
  Square,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";

interface CameraCaptureProps {
  onCapture: (file: File, preview: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [recordingTime, setRecordingTime] = useState(0);

  const {
    videoRef,
    isStreaming,
    isRecording,
    error,
    facingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    startRecording,
    stopRecording,
    toggleFacingMode,
  } = useCamera({ facingMode: "environment" });

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCapturePhoto = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      // Convert data URL to File
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file, dataUrl);
        });
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob) {
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "video/webm",
        });
        const dataUrl = URL.createObjectURL(blob);
        onCapture(file, dataUrl);
      }
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <Camera className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Camera Access Denied</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={onCancel}>
          Go Back
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      {/* Camera Preview */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => {
            stopCamera();
            onCancel();
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Flip Camera Button */}
        <button
          onClick={toggleFacingMode}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <FlipHorizontal className="w-5 h-5" />
        </button>

        {/* Recording Indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/90 text-white text-sm font-medium"
            >
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-white"
              />
              {formatTime(recordingTime)}
            </motion.div>
          )}
        </AnimatePresence>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-auto max-h-[400px] object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          }`}
        />

        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 p-1 glass-card rounded-xl w-fit mx-auto">
        <button
          onClick={() => setMode("photo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "photo"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          <Camera className="w-4 h-4" />
          Photo
        </button>
        <button
          onClick={() => setMode("video")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "video"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          <Video className="w-4 h-4" />
          Video
        </button>
      </div>

      {/* Capture Controls */}
      <div className="flex items-center justify-center gap-4">
        {mode === "photo" ? (
          <Button
            variant="quantum"
            size="xl"
            className="w-full max-w-xs group"
            onClick={handleCapturePhoto}
            disabled={!isStreaming}
          >
            <Camera className="w-5 h-5" />
            Capture Photo
          </Button>
        ) : (
          <Button
            variant={isRecording ? "destructive" : "quantum"}
            size="xl"
            className="w-full max-w-xs group"
            onClick={handleToggleRecording}
            disabled={!isStreaming}
          >
            {isRecording ? (
              <>
                <Square className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Circle className="w-5 h-5 fill-current" />
                Start Recording
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tips */}
      <p className="text-center text-sm text-muted-foreground">
        {mode === "photo"
          ? "Position the road surface in frame and capture"
          : isRecording
            ? "Recording... Pan across the damaged area"
            : "Start recording and slowly pan across the road surface"}
      </p>
    </motion.div>
  );
}
