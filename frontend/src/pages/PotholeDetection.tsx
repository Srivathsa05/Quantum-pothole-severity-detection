import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Map, Bell, Database, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { CursorGlow } from "@/components/CursorGlow";

const monthlyDetections = [
  { month: 'Jan', potholes: 18500, alerts: 22000 },
  { month: 'Feb', potholes: 21000, alerts: 25000 },
  { month: 'Mar', potholes: 24500, alerts: 28500 },
  { month: 'Apr', potholes: 28000, alerts: 32000 },
  { month: 'May', potholes: 25000, alerts: 29000 },
  { month: 'Jun', potholes: 27500, alerts: 31500 },
];

const hazardTypes = [
  { name: 'Potholes', value: 58, color: 'hsl(var(--primary))' },
  { name: 'Cracks', value: 22, color: 'hsl(var(--secondary))' },
  { name: 'Debris', value: 12, color: 'hsl(var(--accent))' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted))' },
];

const severityData = [
  { severity: 'Minor', count: 45000 },
  { severity: 'Moderate', count: 72000 },
  { severity: 'Severe', count: 33000 },
];

const communityGrowth = [
  { month: 'Jan', users: 12000, detections: 18500 },
  { month: 'Feb', users: 15500, detections: 21000 },
  { month: 'Mar', users: 19000, detections: 24500 },
  { month: 'Apr', users: 24000, detections: 28000 },
  { month: 'May', users: 28500, detections: 25000 },
  { month: 'Jun', users: 32000, detections: 27500 },
];

const PotholeDetection = () => {
  return (
    <div className="min-h-screen">
      <CursorGlow />
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Advanced Road Analysis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pothole Detection
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time road hazard detection using computer vision. Identify potholes, damaged surfaces, and dangerous road conditions before they cause damage.
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
                <Camera className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Real-Time Detection</CardTitle>
                <CardDescription>
                  Advanced computer vision identifies potholes and road damage in real-time as you drive
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Map className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Live Hazard Map</CardTitle>
                <CardDescription>
                  Crowdsourced road condition data builds a community map of known hazards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Bell className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Proactive Alerts</CardTitle>
                <CardDescription>
                  Get warned about upcoming potholes and road hazards before you reach them
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Database className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Smart Data Collection</CardTitle>
                <CardDescription>
                  Automatically log detected hazards with GPS coordinates and severity ratings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Community Network</CardTitle>
                <CardDescription>
                  Benefit from detections by other SafeRoad AI users in your area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Instant Processing</CardTitle>
                <CardDescription>
                  Edge computing ensures minimal latency and immediate hazard identification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-muted/30 rounded-3xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Pothole Detection Works</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Camera Setup</h3>
                  <p className="text-muted-foreground">
                    Use your dashcam or smartphone camera positioned to capture the road ahead. Works with any forward-facing camera with a clear view.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our computer vision model analyzes the road surface in real-time, identifying potholes, cracks, debris, and other hazards with high accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hazard Classification</h3>
                  <p className="text-muted-foreground">
                    Detected hazards are classified by type and severity. Critical hazards trigger immediate alerts, while minor issues are logged for reference.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community Mapping</h3>
                  <p className="text-muted-foreground">
                    Hazard locations are anonymously shared with the SafeRoad AI community, building a comprehensive map that helps all drivers avoid dangerous spots.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Predictive Warnings</h3>
                  <p className="text-muted-foreground">
                    As you approach known hazards mapped by yourself or other users, you'll receive advance warnings to slow down or change lanes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detection Types */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Detect</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Road Surface Damage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Potholes (small, medium, and large)</li>
                  <li>• Cracks and fissures</li>
                  <li>• Uneven surfaces</li>
                  <li>• Missing manhole covers</li>
                  <li>• Sunken road sections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Road Hazards</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Debris and obstacles</li>
                  <li>• Standing water pools</li>
                  <li>• Ice patches (in cold weather)</li>
                  <li>• Damaged speed bumps</li>
                  <li>• Road construction zones</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Detection Analytics</h2>
          
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Monthly Detections */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Monthly Detection Trends</CardTitle>
                <CardDescription>Potholes detected and alerts sent to community</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyDetections}>
                    <defs>
                      <linearGradient id="colorPotholes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="potholes" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPotholes)" name="Potholes Detected" />
                    <Area type="monotone" dataKey="alerts" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorAlerts)" name="Community Alerts" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hazard Types Distribution */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Hazard Types Distribution</CardTitle>
                <CardDescription>Breakdown of detected road hazards by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={hazardTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {hazardTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severity Distribution */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Hazard Severity Analysis</CardTitle>
                <CardDescription>Distribution of hazards by severity level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="severity" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      name="Hazards Detected"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Community Growth */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Community Growth</CardTitle>
                <CardDescription>Active users contributing to hazard detection network</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={communityGrowth}>
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
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                      name="Active Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="detections" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
                      name="Total Detections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">150K+</div>
              <div className="text-muted-foreground">Hazards Mapped</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">96%</div>
              <div className="text-muted-foreground">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2.3M</div>
              <div className="text-muted-foreground">Miles Analyzed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500ms</div>
              <div className="text-muted-foreground">Early Warning</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Your Vehicle Today</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the community helping to map road hazards and keep everyone safer on the road.
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

export default PotholeDetection;
