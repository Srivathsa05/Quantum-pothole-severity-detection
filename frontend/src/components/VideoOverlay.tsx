import React, { useRef, useEffect } from 'react';

interface Prediction {
  severity: string;
  confidence: number;
  lat?: number | null;
  lon?: number | null;
  ts?: string;
}

interface VideoOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  prediction: Prediction | null;
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ videoRef, prediction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (prediction) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 60);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`Severity: ${prediction.severity}`, 20, 30);
        ctx.fillText(`Confidence: ${(prediction.confidence * 100).toFixed(1)}%`, 20, 50);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [prediction]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={480}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};
