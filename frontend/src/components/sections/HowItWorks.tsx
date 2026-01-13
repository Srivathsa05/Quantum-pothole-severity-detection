import { Camera, Brain, Bell, Users } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Camera Monitoring",
    description: "Connect your dashcam or smartphone to start monitoring both the driver and the road ahead.",
    number: "01",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our computer vision algorithms analyze video feeds in real-time to detect drowsiness and road hazards.",
    number: "02",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Receive immediate warnings through audio, visual, or haptic feedback when risks are detected.",
    number: "03",
  },
  {
    icon: Users,
    title: "Community Sharing",
    description: "Road hazard data is anonymously shared to help other drivers avoid dangerous conditions.",
    number: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How SafeRoad AI Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to safer driving powered by cutting-edge artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connection Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary font-bold">
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
