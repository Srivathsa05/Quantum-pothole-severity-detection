import { motion } from "framer-motion";
import { ArrowRight, Atom, Zap, Shield, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuantumOrbit } from "@/components/QuantumOrbit";
import heroImage from "@/assets/hero-quantum.jpg";
import pothole1 from "@/assets/potholes/pothole1.jpg";
import pothole2 from "@/assets/potholes/pothole2.jpg";
import pothole3 from "@/assets/potholes/pothole3.jpg";


const features = [
  {
    icon: Atom,
    title: "Quantum-Enhanced",
    description: "Leveraging quantum feature mapping for superior pattern recognition",
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Instant severity classification with millisecond response times",
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description: "Research-grade precision for reliable infrastructure assessment",
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description: "Actionable recommendations for maintenance prioritization",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <QuantumOrbit />
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Quantum visualization"
            className="w-full h-full object-cover opacity-10 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="section-container relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Atom className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Smart City Research Project
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-foreground">Quantum </span>
              <span className="quantum-text">Pothole</span>
              <br />
              <span className="text-foreground">Severity Detection</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              A cutting-edge system that combines quantum-inspired algorithms with
              deep learning to accurately detect and classify road surface damage
              for smarter infrastructure maintenance.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/detect">
                <Button variant="quantum" size="xl" className="group">
                  Start Detection
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/model">
                <Button variant="glass" size="lg">
                  Learn About the Model
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50"
            >
              {[
                { value: "99.2%", label: "Detection Accuracy" },
                { value: "<50ms", label: "Processing Time" },
                { value: "3", label: "Severity Levels" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold quantum-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why <span className="quantum-text">Quantum-Enhanced</span> Detection?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our system leverages quantum computing principles to achieve
              unprecedented accuracy in road surface analysis.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Road Conditions Section */}
<section className="py-24">
  <div className="section-container">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Sample <span className="quantum-text">Road Conditions</span>
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Real-world road surface images analyzed by the quantum-enhanced
        pothole severity detection system.
      </p>
    </motion.div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[pothole1, pothole2, pothole3].map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <img
            src={img}
            alt={`Pothole sample ${index + 1}`}
            className="w-full h-56 object-cover"
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl quantum-gradient p-12 sm:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Analyze Road Conditions?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Upload an image or video of a road surface and get instant severity
                classification powered by quantum-enhanced algorithms.
              </p>
              <Link to="/detect">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90 hover:shadow-xl"
                >
                  Start Detection Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
