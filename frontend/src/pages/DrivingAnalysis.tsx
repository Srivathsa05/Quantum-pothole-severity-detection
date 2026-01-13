import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, AlertCircle, Brain, Activity, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CursorGlow } from "@/components/CursorGlow";

const alertsData = [
  { month: 'Jan', alerts: 24, prevented: 22 },
  { month: 'Feb', alerts: 18, prevented: 17 },
  { month: 'Mar', alerts: 32, prevented: 30 },
  { month: 'Apr', alerts: 28, prevented: 27 },
  { month: 'May', alerts: 15, prevented: 15 },
  { month: 'Jun', alerts: 21, prevented: 20 },
];

const drowsinessData = [
  { hour: '6 AM', level: 15 },
  { hour: '9 AM', level: 8 },
  { hour: '12 PM', level: 5 },
  { hour: '3 PM', level: 12 },
  { hour: '6 PM', level: 18 },
  { hour: '9 PM', level: 25 },
  { hour: '12 AM', level: 35 },
];

const accuracyData = [
  { metric: 'Eye Track', accuracy: 99.5 },
  { metric: 'Head Pos', accuracy: 98.8 },
  { metric: 'Attention', accuracy: 99.2 },
  { metric: 'Yawn Det', accuracy: 97.5 },
  { metric: 'Blink Rate', accuracy: 99.0 },
];

const DrivingAnalysis = () => {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Driver Monitoring</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Driving Analysis
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced computer vision technology monitors driver alertness, detects drowsiness, and prevents accidents before they happen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Schedule Demo</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Eye className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Eye Tracking</CardTitle>
                <CardDescription>
                  Monitors eye movement, blink rate, and gaze direction to detect early signs of drowsiness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Activity className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Head Position Analysis</CardTitle>
                <CardDescription>
                  Tracks head movements and posture to identify fatigue and distraction patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Attention Monitoring</CardTitle>
                <CardDescription>
                  Real-time analysis of driver focus and attention to the road ahead
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <AlertCircle className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Instant Alerts</CardTitle>
                <CardDescription>
                  Immediate audio and visual warnings when drowsiness is detected
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Detailed analytics and reports on driving patterns and alertness trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Privacy Protected</CardTitle>
                <CardDescription>
                  All processing happens on-device. Your data stays private and secure
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-muted/30 rounded-3xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Driver Analysis Works</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Camera Setup</h3>
                  <p className="text-muted-foreground">
                    Mount your smartphone or install a dedicated camera on your dashboard facing the driver's seat. The system works with standard webcams and mobile cameras.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI continuously analyzes facial features, eye movements, head position, and attention patterns in real-time with minimal latency (45ms average).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Drowsiness Detection</h3>
                  <p className="text-muted-foreground">
                    Advanced algorithms detect micro-sleep episodes, prolonged eye closure, yawning, and other fatigue indicators with 99.2% accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Immediate Alerts</h3>
                  <p className="text-muted-foreground">
                    When drowsiness is detected, the system triggers audio alerts, vibration (if available), and visual warnings to help the driver regain alertness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data & Insights</h3>
                  <p className="text-muted-foreground">
                    Review your driving sessions, alertness patterns, and safety metrics through detailed analytics dashboards and weekly reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Performance Analytics</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Alerts Over Time */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Drowsiness Alerts & Prevention</CardTitle>
                <CardDescription>Monthly alert statistics and accident prevention rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={alertsData}>
                    <defs>
                      <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrevented" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="alerts" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorAlerts)" name="Total Alerts" />
                    <Area type="monotone" dataKey="prevented" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorPrevented)" name="Accidents Prevented" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Drowsiness by Time */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Drowsiness Patterns by Time</CardTitle>
                <CardDescription>Average drowsiness detection level throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={drowsinessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="level" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      name="Drowsiness Level (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detection Accuracy */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>AI Detection Accuracy by Feature</CardTitle>
              <CardDescription>Real-world accuracy metrics across different monitoring features</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[95, 100]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar 
                    dataKey="accuracy" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                    name="Accuracy (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-4 gap-8 text-center mt-12">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.2%</div>
              <div className="text-muted-foreground">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">45ms</div>
              <div className="text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Continuous Monitoring</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Privacy Protected</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Drive Safer?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start your free trial today and experience the peace of mind that comes with advanced driver monitoring.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">View Pricing</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DrivingAnalysis;
