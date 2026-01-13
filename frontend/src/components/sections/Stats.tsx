import { TrendingUp, Users, MapPin, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Drivers protected daily",
  },
  {
    icon: MapPin,
    value: "2.5M+",
    label: "Hazards Detected",
    description: "Road dangers identified",
  },
  {
    icon: Clock,
    value: "99.8%",
    label: "Uptime",
    description: "System reliability",
  },
  {
    icon: TrendingUp,
    value: "43%",
    label: "Accident Reduction",
    description: "Among active users",
  },
];

export const Stats = () => {
  return (
    <section id="stats" className="py-20 md:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Making Roads Safer Every Day
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-world impact from our AI-powered safety platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
