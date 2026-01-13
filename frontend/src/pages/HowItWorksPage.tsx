import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Brain, Bell, Users, Eye, Zap, Shield, Map } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Camera Capture",
    description: "Connect your dashcam, smartphone, or in-vehicle camera to start monitoring.",
    details: "SafeRoad AI works with any camera source. Simply mount your device and launch the app. Our system supports multiple camera angles simultaneously for comprehensive coverage."
  },
  {
    icon: Eye,
    title: "Driver Monitoring",
    description: "Advanced computer vision tracks eye movement, head position, and facial features.",
    details: "Our AI analyzes micro-movements to detect early signs of drowsiness including eye closure rate, blink frequency, head nodding, and facial expressions. All processing happens in real-time with minimal latency."
  },
  {
    icon: Brain,
    title: "Road Analysis",
    description: "Parallel AI processes road conditions, identifying hazards ahead of your vehicle.",
    details: "The system simultaneously scans the road surface for potholes, cracks, debris, and other hazards. Machine learning models trained on millions of road images ensure high accuracy in all conditions."
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Edge computing ensures sub-100ms detection and response times.",
    details: "Processing happens on-device for instant results. Our optimized algorithms run efficiently without draining battery or requiring constant internet connectivity."
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Immediate warnings through audio, visual, and haptic feedback channels.",
    details: "Get alerted the moment drowsiness is detected or a hazard approaches. Customizable alert settings let you choose notification types and sensitivity levels."
  },
  {
    icon: Shield,
    title: "Corrective Actions",
    description: "Actionable recommendations help you respond appropriately to each situation.",
    details: "Beyond just alerting, SafeRoad AI provides context-aware suggestions: take a break for drowsiness, slow down for hazards, or find alternate routes for severe road damage."
  },
  {
    icon: Map,
    title: "Community Mapping",
    description: "Detected hazards are anonymously shared to build a live community road map.",
    details: "Your hazard detections help other drivers. Data is anonymized and aggregated to create a shared safety network without compromising your privacy."
  },
  {
    icon: Users,
    title: "Continuous Improvement",
    description: "Machine learning models improve with each drive, becoming more accurate over time.",
    details: "The more you use SafeRoad AI, the better it gets at understanding your driving patterns and local road conditions. Models are updated regularly with the latest safety research."
  }
];

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              How SafeRoad AI Works
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A comprehensive look at the technology and process behind our intelligent driver assistance system
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden group hover:shadow-xl transition-all"
                >
                  {/* Step Number */}
                  <div className="absolute -left-4 top-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>

                  <CardContent className="pl-20 py-8 pr-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                        <p className="text-lg text-muted-foreground mb-4">{step.description}</p>
                        <p className="text-sm leading-relaxed">{step.details}</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 bottom-0 w-0.5 h-8 bg-gradient-to-b from-primary to-transparent -mb-8 z-10" />
                  )}
                </Card>
              );
            })}
          </div>

          {/* Tech Stack Section */}
          <div className="mt-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Built on Cutting-Edge Technology
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">TensorFlow</div>
                <div className="text-sm text-muted-foreground">AI Framework</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">OpenCV</div>
                <div className="text-sm text-muted-foreground">Computer Vision</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">YOLO v8</div>
                <div className="text-sm text-muted-foreground">Object Detection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">PyTorch</div>
                <div className="text-sm text-muted-foreground">Deep Learning</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
