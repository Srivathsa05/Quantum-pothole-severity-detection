import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const weeklyData = [
  { day: "Mon", detections: 84 },
  { day: "Tue", detections: 109 },
  { day: "Wed", detections: 97 },
  { day: "Thu", detections: 122 },
  { day: "Fri", detections: 141 },
  { day: "Sat", detections: 117 },
  { day: "Sun", detections: 58 },
];

const baseRows = [
  { location: "MG Road", severity: "CRITICAL", confidence: 97, timestamp: "2026-03-13 14:22" },
  { location: "Koramangala", severity: "HIGH", confidence: 91, timestamp: "2026-03-13 14:18" },
  { location: "Whitefield", severity: "MEDIUM", confidence: 84, timestamp: "2026-03-13 14:11" },
  { location: "HSR Layout", severity: "HIGH", confidence: 89, timestamp: "2026-03-13 13:58" },
];

const UPLOAD_RESULTS_STORAGE_KEY = "roadpulse-upload-results-v1";

type ResultRow = {
  location: string;
  severity: string;
  confidence: number;
  timestamp: string;
};

function rowBadgeClass(severity: string) {
  if (severity === "CRITICAL") return "border-red-400/40 bg-red-500/10 text-red-300";
  if (severity === "HIGH") return "border-amber-400/40 bg-amber-500/10 text-amber-300";
  return "border-emerald-400/40 bg-emerald-500/10 text-emerald-300";
}

export default function Results() {
  const location = useLocation();
  const state = (location.state || {}) as { prediction?: { class_name?: string; confidence?: number } };
  const [uploadedRows, setUploadedRows] = useState<ResultRow[]>(() => {
    try {
      const raw = localStorage.getItem(UPLOAD_RESULTS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as ResultRow[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!state.prediction) return;

    const className = state.prediction.class_name ?? "minor";
    const severity = className === "severe" ? "CRITICAL" : className === "minor" ? "HIGH" : "MEDIUM";
    const confidence = Math.round((state.prediction.confidence ?? 0.9) * 100);

    const newRow: ResultRow = {
      location: "Uploaded Segment",
      severity,
      confidence,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setUploadedRows((previous) => {
      const next = [newRow, ...previous].slice(0, 30);
      localStorage.setItem(UPLOAD_RESULTS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [state.prediction]);

  const rows = useMemo(() => {
    return [...uploadedRows, ...baseRows];
  }, [uploadedRows]);

  return (
    <div className="section-container py-4">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card className="border-[#0f1e30] bg-[#08101f]">
          <CardHeader>
            <p className="section-label">Results</p>
            <CardTitle className="text-base text-slate-100">Detection Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#14304a] hover:bg-transparent">
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Confidence</TableHead>
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-right text-slate-300">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={`${row.location}-${index}`} className="border-[#10283f] hover:bg-[#0b1a2c]">
                    <TableCell>{row.location}</TableCell>
                    <TableCell>
                      <Badge className={`border ${rowBadgeClass(row.severity)}`}>{row.severity}</Badge>
                    </TableCell>
                    <TableCell>{row.confidence}%</TableCell>
                    <TableCell>{row.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="border-[#1b415d] bg-transparent">Inspect</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-[#0f1e30] bg-[#08101f]">
          <CardHeader>
            <p className="section-label">Model Health</p>
            <CardTitle className="text-base text-slate-100">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>mAP@50</span><span>94.2%</span>
              </div>
              <Progress value={94.2} className="h-2 bg-[#12263b] [&>div]:bg-[#00d4ff]" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Precision</span><span>96.1%</span>
              </div>
              <Progress value={96.1} className="h-2 bg-[#12263b] [&>div]:bg-[#00d4ff]" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>Recall</span><span>89.4%</span>
              </div>
              <Progress value={89.4} className="h-2 bg-[#12263b] [&>div]:bg-[#00d4ff]" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs">
                <span>F1</span><span>92.6%</span>
              </div>
              <Progress value={92.6} className="h-2 bg-[#12263b] [&>div]:bg-[#00d4ff]" />
            </div>

            <div className="pt-2">
              <p className="section-label mb-2">Weekly Detections</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8ea5bb", fontSize: 11 }} />
                    <Bar dataKey="detections" fill="#00d4ff" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
