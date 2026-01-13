import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Heart, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "Our mission is to eliminate road accidents caused by driver fatigue and poor road conditions."
  },
  {
    icon: Users,
    title: "Community First",
    description: "We believe in the power of shared data to protect entire communities on the road."
  },
  {
    icon: Heart,
    title: "Safety Obsessed",
    description: "Every decision we make is guided by one question: Does this make driving safer?"
  },
  {
    icon: Zap,
    title: "Innovation Led",
    description: "We push the boundaries of AI and computer vision to solve real-world safety challenges."
  }
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former Tesla AI lead with 15+ years in autonomous systems"
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google Brain researcher specializing in computer vision"
  },
  {
    name: "Lisa Park",
    role: "Head of Product",
    bio: "Product veteran from Uber and Waymo with focus on safety tech"
  },
  {
    name: "James Wilson",
    role: "Chief Safety Officer",
    bio: "20+ years in automotive safety standards and regulatory compliance"
  }
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Building the Future of Road Safety
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              SafeRoad AI was founded in 2023 with a simple mission: use artificial intelligence to prevent accidents before they happen.
            </p>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Our journey began when our founders witnessed the devastating impact of preventable road accidents. 
                We realized that modern AI technology could detect both driver fatigue and road hazards in real-time, 
                yet no comprehensive solution existed.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Today, SafeRoad AI protects over 150,000 drivers across 45 countries. Our computer vision algorithms 
                have detected millions of road hazards and prevented countless accidents. But we're just getting started.
              </p>
              <p className="text-lg leading-relaxed">
                Every day, our team works to make roads safer through cutting-edge AI, community collaboration, 
                and an unwavering commitment to driver safety.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center bg-card/50 backdrop-blur border-border/50">
                    <CardContent className="pt-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary mb-4">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our team brings together decades of experience in AI, automotive safety, and product development
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="pt-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                    <p className="text-primary text-center mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground text-center">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">150K+</div>
                <div className="text-muted-foreground">Active Drivers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">2.5M+</div>
                <div className="text-muted-foreground">Hazards Detected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">45</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">43%</div>
                <div className="text-muted-foreground">Accident Reduction</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
