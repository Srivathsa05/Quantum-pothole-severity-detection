import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { ScrollIndicator } from "@/components/layout/ScrollIndicator";
import { FloatingToolbar } from "@/components/layout/FloatingToolbar";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Stats } from "@/components/sections/Stats";
import { CTA } from "@/components/sections/CTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ScrollIndicator />
      <FloatingToolbar />
      <Navigation />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="stats">
          <Stats />
        </section>
        
        {/* Core Features Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Explore Our Core Technologies
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <Brain className="w-16 h-16 text-primary mb-4" />
                <CardTitle className="text-2xl">Driving Analysis</CardTitle>
                <CardDescription className="text-base">
                  AI-powered driver monitoring detects drowsiness and distraction in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Eye tracking and blink analysis</li>
                  <li>• Head position monitoring</li>
                  <li>• Instant fatigue alerts</li>
                  <li>• 99.2% accuracy rate</li>
                </ul>
                <Link to="/driving-analysis">
                  <Button className="w-full group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardHeader>
                <Camera className="w-16 h-16 text-primary mb-4" />
                <CardTitle className="text-2xl">Pothole Detection</CardTitle>
                <CardDescription className="text-base">
                  Computer vision identifies road hazards and builds a community safety map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Real-time pothole identification</li>
                  <li>• Crowdsourced hazard mapping</li>
                  <li>• Proactive warnings</li>
                  <li>• 150K+ hazards mapped</li>
                </ul>
                <Link to="/pothole-detection">
                  <Button className="w-full group">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="cta">
          <CTA />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
