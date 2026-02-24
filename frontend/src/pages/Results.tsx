import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Download,
  Share2,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Simulated result data
const resultData = {
  severity: "medium" as "low" | "medium" | "high",
  confidence: 87.3,
  details: {
    potholeCount: 3,
    avgDepth: "4.2 cm",
    surfaceArea: "0.8 m²",
    location: "Urban Road Segment",
  },
  recommendations: [
    "Schedule maintenance within 2-4 weeks",
    "Monitor for further deterioration",
    "Consider temporary patching for immediate safety",
  ],
};

const severityConfig = {
  low: {
    color: "emerald",
    icon: CheckCircle2,
    label: "Low Severity",
    description: "Minor surface damage detected",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30",
    progressClass: "bg-emerald-500",
  },
  medium: {
    color: "amber",
    icon: AlertTriangle,
    label: "Medium Severity",
    description: "Moderate damage requiring attention",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/30",
    progressClass: "bg-amber-500",
  },
  high: {
    color: "rose",
    icon: AlertCircle,
    label: "High Severity",
    description: "Critical damage requiring immediate action",
    bgClass: "bg-rose-500/10 dark:bg-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    borderClass: "border-rose-500/30",
    progressClass: "bg-rose-500",
  },
};

export default function Results() {
  const config = severityConfig[resultData.severity];
  const SeverityIcon = config.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/detect">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Detection
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Severity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`relative overflow-hidden rounded-3xl border-2 ${config.borderClass} ${config.bgClass} p-8 sm:p-12 mb-8`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <SeverityIcon className="w-full h-full" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${config.bgClass} border ${config.borderClass} mb-6`}
              >
                <SeverityIcon className={`w-6 h-6 ${config.textClass}`} />
                <span className={`text-lg font-semibold ${config.textClass}`}>
                  {config.label}
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Analysis Complete
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                {config.description}. Our quantum-enhanced algorithm has analyzed
                the road surface and identified areas requiring attention.
              </p>
            </div>
          </motion.div>

          {/* Confidence & Stats Grid */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Confidence Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Detection Confidence</h3>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>

              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold quantum-text">
                    {resultData.confidence}
                  </span>
                  <span className="text-2xl text-muted-foreground mb-1">%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{resultData.confidence}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resultData.confidence}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className={`h-full rounded-full ${config.progressClass}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Detection Details Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-semibold mb-4">Detection Details</h3>

              <div className="space-y-4">
                {[
                  { label: "Potholes Detected", value: resultData.details.potholeCount },
                  { label: "Average Depth", value: resultData.details.avgDepth },
                  { label: "Affected Area", value: resultData.details.surfaceArea },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Maintenance Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on severity analysis
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {resultData.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50"
                >
                  <div className={`w-6 h-6 rounded-full ${config.bgClass} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-sm font-semibold ${config.textClass}`}>
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-foreground">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/detect">
              <Button variant="quantum" size="lg" className="w-full sm:w-auto gap-2">
                <RotateCcw className="w-4 h-4" />
                Analyze Another Image
              </Button>
            </Link>
            <Link to="/model">
              <Button variant="glass" size="lg" className="w-full sm:w-auto">
                Learn How It Works
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
