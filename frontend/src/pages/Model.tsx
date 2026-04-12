import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Layers, Linkedin } from "lucide-react";

const modelTech = ["Quantum Simulators", "ResNet-50", "OpenCV", "CUDA"];
const platformTech = ["React", "shadcn/ui", "FastAPI", "react-leaflet"];

const team = [
  { name: "Srivathsa Bhat", role: "ML Engineer and Frontend Developer" },
  { name: "Sourabh Bettad", role: "Backend Engineer" },
];

export default function Model() {
  return (
    <div className="section-container py-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-[#0f1e30] bg-[#08101f]">
          <CardHeader>
            <p className="section-label">About Us</p>
            <CardTitle className="flex items-center gap-2 text-base text-slate-100">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
                <Cpu className="h-4 w-4" />
              </span>
              The Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-slate-300">
              Real-time severity classification trained for urban roads, optimized for fast inference and resilient field conditions.
            </p>
            <div className="flex flex-wrap gap-2">
              {modelTech.map((tech) => (
                <Badge key={tech} className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-200">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#0f1e30] bg-[#08101f]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-slate-100">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                <Layers className="h-4 w-4" />
              </span>
              The Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-slate-300">
              A command-center-grade web platform for ingesting detections, monitoring live feeds, and prioritizing road repairs.
            </p>
            <div className="flex flex-wrap gap-2">
              {platformTech.map((tech) => (
                <Badge key={tech} className="border border-indigo-400/30 bg-indigo-500/10 text-indigo-200">{tech}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 border-[#0f1e30] bg-[#08101f]">
        <CardHeader>
          <CardTitle className="text-base text-slate-100">Core Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-lg border border-[#17364d] bg-[#0a1423] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#00d4ff]/20 text-xs font-semibold text-[#00d4ff]">
                    {member.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <Linkedin className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-100">{member.name}</p>
                <p className="text-xs text-slate-400">{member.role}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-400">
            RoadPulse exists to help cities shift from reactive pothole fixes to predictive maintenance through live detection, map intelligence, and accountable infrastructure analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
