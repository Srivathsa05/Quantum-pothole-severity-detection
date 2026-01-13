import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Personal",
    description: "For individual drivers",
    price: "$9.99",
    period: "/month",
    features: [
      "Driver drowsiness detection",
      "Basic road hazard alerts",
      "Mobile app access",
      "30-day hazard history",
      "Email support",
      "Single device"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    description: "For frequent drivers",
    price: "$49.99",
    period: "/month",
    features: [
      "All Personal features",
      "Advanced road analysis",
      "Priority alerts",
      "6-month hazard history",
      "Weekly safety reports",
      "API access",
      "Up to 3 devices",
      "Priority support"
    ],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For fleet operations",
    price: "Custom",
    period: "pricing",
    features: [
      "All Professional features",
      "Unlimited vehicles",
      "Real-time fleet dashboard",
      "Custom integrations",
      "24/7 phone support",
      "Advanced analytics",
      "Dedicated account manager",
      "SLA guarantee"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Choose the plan that fits your needs. All plans include a 7-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-xl scale-105"
                    : "border-border/50"
                } bg-card/50 backdrop-blur`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base mb-6">
                    {plan.description}
                  </CardDescription>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold">
                      {plan.price}
                      {plan.price !== "Custom" && (
                        <span className="text-lg font-normal text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    {plan.price === "Custom" && (
                      <div className="text-lg text-muted-foreground">{plan.period}</div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  What's included in the free trial?
                </h3>
                <p className="text-muted-foreground">
                  All plans include a 7-day free trial with full access to all features. No credit card required.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Can I change plans anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Is there a setup fee?
                </h3>
                <p className="text-muted-foreground">
                  No setup fees. Pay only for what you use with transparent monthly billing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
