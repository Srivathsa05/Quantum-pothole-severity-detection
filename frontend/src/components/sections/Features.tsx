import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, AlertTriangle, Map, Shield, Zap, Cloud } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Driver Drowsiness Detection",
    description: "Real-time monitoring of driver alertness using advanced computer vision to detect signs of fatigue and distraction.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: AlertTriangle,
    title: "Road Hazard Detection",
    description: "Instantly identify potholes, road damage, and hazardous conditions using dashcam or smartphone camera analysis.",
    gradient: "from-secondary to-secondary/60",
  },
  {
    icon: Map,
    title: "Shared Hazard Map",
    description: "Contribute to and access a community-driven map of road conditions, helping all drivers navigate safely.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Shield,
    title: "Instant Alerts",
    description: "Get immediate audio and visual warnings when drowsiness is detected or hazards approach on your route.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Sub-100ms detection latency ensures warnings reach you in time to react and avoid potential accidents.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Cloud,
    title: "Cloud Sync & Analytics",
    description: "Your driving patterns and hazard reports sync across devices with detailed safety analytics and insights.",
    gradient: "from-accent to-primary",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Dual-Purpose Protection
          </h2>
          <p className="text-lg text-muted-foreground">
            Advanced AI technology that keeps both you and your route safe through intelligent monitoring and detection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
