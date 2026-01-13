import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent p-1">
            <div className="bg-card rounded-3xl p-8 md:p-12 lg:p-16 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Start Driving Safer Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of drivers using AI to protect themselves and others on the road. Get started with our free trial.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
