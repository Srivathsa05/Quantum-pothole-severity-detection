import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = {
  severe: "#ef4444",
  minor: "#f59e0b",
  no_pothole: "#22c55e",
};

export default function Analytics() {
  const [historicalTrends, setHistoricalTrends] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [predictiveMaintenance, setPredictiveMaintenance] = useState<any>(null);
  const [municipalRoads, setMunicipalRoads] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchRealTimeData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [historical, realTime, predictive, roads] = await Promise.all([
        fetch("http://localhost:8000/api/analytics/historical-trends?days=30&group_by=daily").then(res => res.json()),
        fetch("http://localhost:8000/api/analytics/real-time-analytics").then(res => res.json()),
        fetch("http://localhost:8000/api/analytics/predictive-maintenance").then(res => res.json()),
        fetch("http://localhost:8000/api/analytics/municipal-roads?limit=15").then(res => res.json()),
      ]);

      setHistoricalTrends(historical);
      setRealTimeData(realTime);
      setPredictiveMaintenance(predictive);
      setMunicipalRoads(roads);
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/analytics/real-time-analytics");
      const data = await response.json();
      setRealTimeData(data);
    } catch (error) {
      console.error("Failed to fetch real-time data:", error);
    }
  };

  if (loading) {
    return (
      <div className="section-container py-4">
        <p className="section-label">Analytics</p>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-4">
      <p className="section-label">Analytics</p>

      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList className="bg-[#0a1625] border border-[#14304a]">
          <TabsTrigger value="realtime" className="data-[state=active]:bg-[#14304a]">
            Real-Time Dashboard
          </TabsTrigger>
          <TabsTrigger value="historical" className="data-[state=active]:bg-[#14304a]">
            Historical Trends
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-[#14304a]">
            Predictive Maintenance
          </TabsTrigger>
          <TabsTrigger value="municipal" className="data-[state=active]:bg-[#14304a]">
            Municipal Roads
          </TabsTrigger>
        </TabsList>

        {/* Real-Time Dashboard */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Today's Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  {realTimeData?.today?.total_detections || 0}
                </div>
                <div className="text-xs text-slate-400">
                  {realTimeData?.today?.severe_count || 0} severe, {realTimeData?.today?.minor_count || 0} minor
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Avg Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  {(realTimeData?.today?.avg_confidence * 100 || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">Model accuracy</div>
              </CardContent>
            </Card>

            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Pending Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-100">
                  {realTimeData?.pending_maintenance?.length || 0}
                </div>
                <div className="text-xs text-slate-400">Scheduled repairs</div>
              </CardContent>
            </Card>

            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Top Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-slate-100 truncate">
                  {realTimeData?.top_locations?.[0]?.location || "N/A"}
                </div>
                <div className="text-xs text-slate-400">
                  {realTimeData?.top_locations?.[0]?.count || 0} detections
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader>
                <CardTitle className="text-base text-slate-100">Weekly Detection Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={realTimeData?.weekly_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14304a" />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0a1625", border: "1px solid #14304a" }}
                      itemStyle={{ color: "#94a3b8" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#00d4ff" strokeWidth={2} name="Detections" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#0f1e30] bg-[#08101f]">
              <CardHeader>
                <CardTitle className="text-base text-slate-100">Today's Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Severe", value: realTimeData?.today?.severe_count || 0 },
                        { name: "Minor", value: realTimeData?.today?.minor_count || 0 },
                        { name: "No Pothole", value: realTimeData?.today?.no_pothole_count || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      <Cell fill={COLORS.severe} />
                      <Cell fill={COLORS.minor} />
                      <Cell fill={COLORS.no_pothole} />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0a1625", border: "1px solid #14304a" }}
                      itemStyle={{ color: "#94a3b8" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Historical Trends */}
        <TabsContent value="historical" className="space-y-4">
          <Card className="border-[#0f1e30] bg-[#08101f]">
            <CardHeader>
              <CardTitle className="text-base text-slate-100">30-Day Historical Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalTrends?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#14304a" />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1625", border: "1px solid #14304a" }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="severe_count" stroke={COLORS.severe} strokeWidth={2} name="Severe" />
                  <Line type="monotone" dataKey="minor_count" stroke={COLORS.minor} strokeWidth={2} name="Minor" />
                  <Line type="monotone" dataKey="no_pothole_count" stroke={COLORS.no_pothole} strokeWidth={2} name="No Pothole" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#0f1e30] bg-[#08101f]">
            <CardHeader>
              <CardTitle className="text-base text-slate-100">Severity Percentage Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalTrends?.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#14304a" />
                  <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0a1625", border: "1px solid #14304a" }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="severe_percentage" stroke={COLORS.severe} fill={COLORS.severe} fillOpacity={0.3} name="Severe %" />
                  <Area type="monotone" dataKey="minor_percentage" stroke={COLORS.minor} fill={COLORS.minor} fillOpacity={0.3} name="Minor %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Maintenance */}
        <TabsContent value="maintenance" className="space-y-4">
          <Card className="border-[#0f1e30] bg-[#08101f]">
            <CardHeader>
              <CardTitle className="text-base text-slate-100">Predictive Maintenance Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {predictiveMaintenance?.suggestions?.slice(0, 5).map((suggestion: any, index: number) => (
                  <div
                    key={index}
                    className="rounded border border-[#14304a] bg-[#0a1625] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-slate-100">{suggestion.location}</div>
                      <div
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          suggestion.priority === "urgent"
                            ? "bg-red-500/20 text-red-300"
                            : suggestion.priority === "high"
                            ? "bg-orange-500/20 text-orange-300"
                            : suggestion.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {suggestion.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400">Severe Count</div>
                        <div className="text-slate-100">{suggestion.severe_count}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Total Detections</div>
                        <div className="text-slate-100">{suggestion.total_detections}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Confidence</div>
                        <div className="text-slate-100">{(suggestion.avg_confidence * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">{suggestion.recommended_action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Municipal Roads */}
        <TabsContent value="municipal" className="space-y-4">
          <Card className="border-[#0f1e30] bg-[#08101f]">
            <CardHeader>
              <CardTitle className="text-base text-slate-100">Municipal Road Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {municipalRoads?.roads?.map((road: any, index: number) => (
                  <div
                    key={index}
                    className="rounded border border-[#14304a] bg-[#0a1625] p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-slate-100">{road.road_name}</div>
                      <div className="text-xs text-slate-400">{road.segment_name}</div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <div className="text-slate-400">Type</div>
                        <div className="text-slate-100 capitalize">{road.road_type}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Length</div>
                        <div className="text-slate-100">{road.length_km} km</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Municipality</div>
                        <div className="text-slate-100">{road.municipality}</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Zone</div>
                        <div className="text-slate-100">{road.zone || "N/A"}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      Contact: {road.contact_email || road.contact_phone || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
