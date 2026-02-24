import { motion } from "framer-motion";
import {
  Camera,
  Cpu,
  Atom,
  BarChart3,
  ArrowRight,
  Zap,
  Brain,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pipelineSteps = [
  {
    icon: Camera,
    title: "Image Acquisition",
    description:
      "High-resolution road surface images are captured and preprocessed for optimal feature extraction.",
    color: "primary",
    details: [
      "Image normalization",
      "Noise reduction",
      "Contrast enhancement",
    ],
  },
  {
    icon: Cpu,
    title: "Classical Preprocessing",
    description:
      "Traditional computer vision techniques extract initial features like edges, textures, and shapes.",
    color: "primary",
    details: [
      "Edge detection (Canny)",
      "Texture analysis (GLCM)",
      "Shape descriptors",
    ],
  },
  {
    icon: Atom,
    title: "Quantum Feature Mapping",
    description:
      "Features are encoded into quantum states using variational circuits for enhanced pattern recognition.",
    color: "quantum-glow",
    details: [
      "Amplitude encoding",
      "Parameterized quantum circuits",
      "Entanglement layers",
    ],
  },
  {
    icon: Brain,
    title: "Hybrid Classification",
    description:
      "A quantum-classical neural network classifies the severity based on the quantum-enhanced features.",
    color: "primary",
    details: [
      "Variational classifier",
      "Gradient-based optimization",
      "Multi-class output",
    ],
  },
  {
    icon: BarChart3,
    title: "Severity Assessment",
    description:
      "Final severity level is determined with confidence scores and maintenance recommendations.",
    color: "primary",
    details: [
      "Low/Medium/High classification",
      "Confidence estimation",
      "Decision support",
    ],
  },
];

const techStack = [
  { name: "PennyLane", description: "Quantum ML framework" },
  { name: "PyTorch", description: "Deep learning backend" },
  { name: "OpenCV", description: "Image processing" },
  { name: "Qiskit", description: "Quantum computing SDK" },
];

export default function Model() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              System Architecture
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            How <span className="quantum-text">Quantum Detection</span> Works
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our hybrid quantum-classical pipeline combines the best of both worlds:
            classical preprocessing with quantum-enhanced feature extraction for
            superior accuracy.
          </p>
        </motion.div>

        {/* Pipeline Visualization */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-quantum-glow to-primary hidden md:block" />

            {pipelineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative mb-8 last:mb-0"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      step.color === "quantum-glow"
                        ? "bg-gradient-to-br from-primary to-quantum-glow quantum-glow"
                        : "bg-primary/10"
                    }`}
                  >
                    <step.icon
                      className={`w-7 h-7 ${
                        step.color === "quantum-glow" ? "text-white" : "text-primary"
                      }`}
                    />
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex-1 glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-primary">
                        Step {index + 1}
                      </span>
                      {step.color === "quantum-glow" && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Quantum
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Arrow */}
                {index < pipelineSteps.length - 1 && (
                  <div className="hidden md:flex justify-center my-4 ml-8">
                    <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quantum Advantage Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 sm:p-12 mb-16"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Quantum Advantage
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Why Quantum Computing?
              </h2>

              <p className="text-muted-foreground mb-6">
                Quantum feature maps can capture complex, high-dimensional patterns
                that are difficult for classical algorithms to detect. This enables
                our system to identify subtle road damage with higher accuracy.
              </p>

              <ul className="space-y-3">
                {[
                  "Exponential feature space exploration",
                  "Superior pattern recognition in noisy data",
                  "Faster convergence in optimization",
                  "Robust to adversarial inputs",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 flex justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="relative w-64 h-64"
              >
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/40" />
                <div className="absolute inset-8 rounded-full border-2 border-dashed border-primary/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-quantum-glow flex items-center justify-center quantum-glow"
                  >
                    <Atom className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">Technology Stack</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="font-semibold text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/detect">
            <Button variant="quantum" size="xl" className="group">
              Try It Yourself
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
