import { motion } from "framer-motion";
import {
  X,
  Image as ImageIcon,
  Video,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  preview: string;
  isAnalyzing: boolean;
  onClear: () => void;
  onAnalyze: () => void;
}

export function FilePreview({
  file,
  preview,
  isAnalyzing,
  onClear,
  onAnalyze,
}: FilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Preview Card */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <button
          onClick={onClear}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {file.type.startsWith("image/") ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[400px] object-contain"
          />
        ) : (
          <video
            src={preview}
            controls
            className="w-full h-auto max-h-[400px]"
          />
        )}
      </div>

      {/* File Info */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {file.type.startsWith("image/") ? (
              <ImageIcon className="w-5 h-5 text-primary" />
            ) : (
              <Video className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium truncate max-w-[200px] sm:max-w-none">
              {file.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <CheckCircle className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Analyze Button */}
      <Button
        variant="quantum"
        size="xl"
        className="w-full group"
        onClick={onAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <ProcessingAnimation />
        ) : (
          <>
            Analyze Road Surface
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </motion.div>
  );
}

function ProcessingAnimation() {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      />
      <span>Analyzing with quantum-enhanced feature mapping...</span>
    </div>
  );
}
