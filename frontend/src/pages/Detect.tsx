import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, Camera, Video } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/detection/FileUpload";
import { FilePreview } from "@/components/detection/FilePreview";
import { CameraCapture } from "@/components/detection/CameraCapture";

export default function Detect() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile: File, previewUrl: string) => {
    setFile(selectedFile);
    setPreview(previewUrl);
  };

  const handleCapture = (capturedFile: File, previewUrl: string) => {
    setFile(capturedFile);
    setPreview(previewUrl);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const form = new FormData();
      form.append("file", file, file.name);

      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Prediction failed");
      }

      const data = await res.json();

      // Navigate to results and pass prediction + preview via state
      navigate("/results", { state: { prediction: data, preview } });
    } catch (err) {
      console.error("Analyze error:", err);
      navigate("/results", { state: { error: String(err) } });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Road Surface <span className="quantum-text">Analysis</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Upload an image, capture a photo, or record video for
              quantum-enhanced pothole detection and severity classification.
            </motion.p>
          </div>

          {/* Input Area */}
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="input-selector"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                {/* Tabs for Upload vs Camera */}
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as "upload" | "camera")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="upload"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger
                      value="camera"
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Camera
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload">
                    <FileUpload onFileSelect={handleFileSelect} />
                  </TabsContent>

                  <TabsContent value="camera">
                    <CameraCapture
                      onCapture={handleCapture}
                      onCancel={() => setActiveTab("upload")}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <FilePreview
                key="preview"
                file={file}
                preview={preview!}
                isAnalyzing={isAnalyzing}
                onClear={clearFile}
                onAnalyze={handleAnalyze}
              />
            )}
          </AnimatePresence>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 glass-card rounded-2xl p-6"
          >
            <h3 className="font-semibold mb-4">
              Best Practices for Accurate Results
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>
                  Capture images in good lighting conditions for optimal
                  analysis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>
                  Ensure the road surface is clearly visible and in focus
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>
                  For video, slowly pan across the damaged area from multiple
                  angles
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>
                  Use the rear camera for best quality when capturing on mobile
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
