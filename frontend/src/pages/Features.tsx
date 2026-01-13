import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, AlertTriangle, Map, Shield, Zap, Cloud, Camera, Brain, Bell, Lock } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Driver Drowsiness Detection",
    description: "Real-time monitoring of driver alertness using advanced computer vision to detect signs of fatigue and distraction.",
    details: [
      "Eye movement tracking",
      "Head position analysis",
      "Yawn detection",
      "Attention pattern monitoring",
      "Fatigue level scoring"
    ]
  },
  {
    icon: AlertTriangle,
    title: "Road Hazard Detection",
    description: "Instantly identify potholes, road damage, and hazardous conditions using dashcam or smartphone camera analysis.",
    details: [
      "Pothole detection",
      "Road surface analysis",
      "Debris identification",
      "Weather condition assessment",
      "Construction zone alerts"
    ]
  },
  {
    icon: Map,
    title: "Shared Hazard Map",
    description: "Contribute to and access a community-driven map of road conditions, helping all drivers navigate safely.",
    details: [
      "Real-time hazard mapping",
      "Community contributions",
      "Route optimization",
      "Historical data analysis",
      "Location-based warnings"
    ]
  },
  {
    icon: Shield,
    title: "Instant Alerts",
    description: "Get immediate audio and visual warnings when drowsiness is detected or hazards approach on your route.",
    details: [
      "Audio notifications",
      "Visual dashboard alerts",
      "Haptic feedback support",
      "Customizable alert levels",
      "Emergency contact notification"
    ]
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Sub-100ms detection latency ensures warnings reach you in time to react and avoid potential accidents.",
    details: [
      "Edge computing optimization",
      "Real-time processing",
      "Minimal latency",
      "GPU acceleration",
      "Offline capability"
    ]
  },
  {
    icon: Cloud,
    title: "Cloud Sync & Analytics",
    description: "Your driving patterns and hazard reports sync across devices with detailed safety analytics and insights.",
    details: [
      "Cross-device sync",
      "Driving behavior analysis",
      "Safety score tracking",
      "Trip history",
      "Performance insights"
    ]
  },
  {
    icon: Camera,
    title: "Multi-Camera Support",
    description: "Works with dashcams, smartphone cameras, and built-in vehicle cameras for maximum flexibility.",
    details: [
      "Dashcam integration",
      "Smartphone compatibility",
      "Multi-angle monitoring",
      "4K video support",
      "Night vision capability"
    ]
  },
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Powered by state-of-the-art computer vision and machine learning algorithms trained on millions of hours.",
    details: [
      "Deep learning models",
      "Continuous learning",
      "Model updates",
      "High accuracy rates",
      "Adaptive algorithms"
    ]
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Intelligent notification system that learns your preferences and driving patterns over time.",
    details: [
      "Personalized alerts",
      "Priority filtering",
      "Do not disturb mode",
      "Schedule-based alerts",
      "Context-aware notifications"
    ]
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "On-device processing and encrypted data ensure your privacy is protected while keeping you safe.",
    details: [
      "End-to-end encryption",
      "On-device processing",
      "GDPR compliant",
      "No data selling",
      "Anonymous analytics"
    ]
  },
];

const Features = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Comprehensive Safety Features
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Explore all the powerful features that make SafeRoad AI the most advanced driver assistance system
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
                >
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
