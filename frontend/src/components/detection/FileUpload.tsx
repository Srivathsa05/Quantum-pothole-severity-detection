import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Video } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File, preview: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    },
    [onFileSelect]
  );

  const processFile = (file: File) => {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
      }`}
    >
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="text-center">
        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center"
        >
          <Upload className="w-10 h-10 text-primary" />
        </motion.div>

        <h3 className="text-xl font-semibold mb-2">Drop your file here</h3>
        <p className="text-muted-foreground mb-6">
          or click to browse from your device
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Images</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>Videos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
