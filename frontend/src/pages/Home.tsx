import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { Separator } from "@/components/ui/separator";



const activity = [

  { day: "Mon", value: 320 },

  { day: "Tue", value: 410 },

  { day: "Wed", value: 395 },

  { day: "Thu", value: 462 },

  { day: "Fri", value: 515 },

  { day: "Sat", value: 488 },

  { day: "Sun", value: 534 },

];



const alertItems = [

  { location: "MG Road", severity: "severe", details: "3 potholes", ago: "2 min ago" },

  { location: "Koramangala", severity: "minor", details: "2 potholes", ago: "6 min ago" },

  { location: "Whitefield", severity: "no_pothole", details: "5 potholes", ago: "9 min ago" },

  { location: "Indiranagar", severity: "minor", details: "1 pothole", ago: "12 min ago" },

  { location: "HSR Layout", severity: "severe", details: "4 potholes", ago: "16 min ago" },

];



const statTargets = [

  { label: "Detected", value: 3847 },

  { label: "Accuracy", value: 94.2, suffix: "%" },

  { label: "Cameras", value: 12 },

  { label: "Scanned", value: 142, suffix: "km" },

];



function severityColor(severity: string) {

  if (severity === "severe") return "#ef4444";

  if (severity === "minor") return "#f59e0b";

  return "#22c55e";

}



export default function Home() {

  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  const [progressValues, setProgressValues] = useState({ severe: 31, minor: 44, no_pothole: 25 });

  // Load severity mix from localStorage and update dynamically
  useEffect(() => {
    const loadSeverityMix = () => {
      try {
        const mix = localStorage.getItem("roadpulse-severity-mix");
        if (mix) {
          const parsed = JSON.parse(mix);
          setProgressValues({
            severe: parsed.severe || 0,
            minor: parsed.minor || 0,
            no_pothole: parsed.no_pothole || 0,
          });
        }
      } catch {
        // Ignore errors
      }
    };

    loadSeverityMix();

    // Poll for updates every 2 seconds (storage events don't work within same tab)
    const interval = setInterval(loadSeverityMix, 2000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {

    const timers = statTargets.map((target, index) => {

      const step = Math.max(target.value / 40, 1);

      return window.setInterval(() => {

        setCounts((previous) => {

          const next = [...previous];

          next[index] = Math.min(next[index] + step, target.value);

          return next;

        });

      }, 30);

    });



    const progressTimer = window.setTimeout(() => {

      setProgressValues({ severe: 31, minor: 44, no_pothole: 25 });

    }, 200);



    return () => {

      timers.forEach((timer) => window.clearInterval(timer));

      window.clearTimeout(progressTimer);

    };

  }, []);



  const tickerSequence = useMemo(() => [...alertItems, ...alertItems], []);



  return (

    <div className="section-container py-4">

      <section className="roadpulse-card relative h-[240px] overflow-hidden">

        <div className="grid-overlay absolute inset-0" />

        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(0,120,200,0.1),transparent_70%)]" />

        <div className="scanline" />



        <div className="relative z-20 grid h-full gap-6 p-6 md:grid-cols-[1.4fr_1fr]">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.6 }}

            className="flex flex-col justify-center"

          >

            <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-cyan-200/80">

              <span className="h-px w-6 bg-[#00d4ff]" />

              AI-POWERED ROAD INTELLIGENCE

              <span className="h-px w-6 bg-[#00d4ff]" />

            </div>

            <h1 className="text-3xl font-semibold leading-tight text-[#e2e8f0] md:text-4xl">

              Detect. Map.

              <br />

              <span className="text-[#00d4ff]">Fix Roads Smarter.</span>

            </h1>

            <p className="mt-3 max-w-xl text-sm text-slate-300">

              Real-time pothole detection using YOLOv8. Upload footage, stream live cameras, or explore Bengaluru&apos;s road health map.

            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <Link to="/detect">

                <Button className="bg-[#00d4ff] text-[#06111d] hover:bg-[#49e4ff]">Start Detection</Button>

              </Link>

              <Link to="/heatmap">

                <Button variant="outline" className="border-[#1a3e57] bg-transparent text-[#d6e8f7] hover:bg-[#0e1a2b]">

                  View Heatmap

                </Button>

              </Link>

            </div>

          </motion.div>



          <div className="grid grid-cols-2 gap-3">

            {statTargets.map((stat, index) => {

              const display = stat.suffix === "%"

                ? `${counts[index].toFixed(1)}${stat.suffix}`

                : `${Math.round(counts[index])}${stat.suffix ?? ""}`;



              return (

                <Card key={stat.label} className="shimmer-card border-[#0f1e30] bg-[#08101f]">

                  <CardContent className="p-4">

                    <p className="text-2xl font-semibold text-[#e2e8f0]">{display}</p>

                    <p className="section-label mt-1">{stat.label}</p>

                  </CardContent>

                </Card>

              );

            })}

          </div>

        </div>

      </section>



      <section

        className="mt-3 flex h-7 items-center overflow-hidden border-y border-[#0f1e30] bg-[#040810]"

      >

        <div className="h-full bg-[#00d4ff] px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#04111d] leading-7">

          Alerts

        </div>

        <div className="overflow-hidden pl-3">

          <div className="ticker-track flex items-center gap-10 text-xs text-slate-300">

            {tickerSequence.map((item, index) => (

              <div key={`${item.location}-${index}`} className="whitespace-nowrap">

                {item.location} · <span style={{ color: severityColor(item.severity) }}>{item.severity}</span> · {item.details} · {item.ago}

              </div>

            ))}

          </div>

        </div>

      </section>



      <section className="mt-4 grid gap-4 lg:grid-cols-2">

        <Card className="border-[#0f1e30] bg-[#08101f]">

          <CardHeader>

            <p className="section-label">Detection Activity</p>

            <CardTitle className="text-base text-slate-100">7-Day Trend</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="h-44">

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={activity}>

                  <defs>

                    <linearGradient id="activityFill" x1="0" x2="0" y1="0" y2="1">

                      <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.25} />

                      <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.05} />

                    </linearGradient>

                  </defs>

                  <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fill="url(#activityFill)" />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>



        <Card className="border-[#0f1e30] bg-[#08101f]">

          <CardHeader>

            <p className="section-label">Severity Mix</p>

            <CardTitle className="text-base text-slate-100">Current Breakdown</CardTitle>

          </CardHeader>

          <CardContent className="space-y-5">

            <div>

              <div className="mb-2 flex items-center justify-between text-xs">

                <span className="text-red-400">Severe</span>

                <span>{progressValues.severe}%</span>

              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                <Progress value={progressValues.severe} className="h-2 bg-[#102133] [&>div]:bg-red-500" />

              </motion.div>

            </div>

            <Separator className="bg-[#12243a]" />

            <div>

              <div className="mb-2 flex items-center justify-between text-xs">

                <span className="text-amber-400">Minor</span>

                <span>{progressValues.minor}%</span>

              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                <Progress value={progressValues.minor} className="h-2 bg-[#102133] [&>div]:bg-amber-500" />

              </motion.div>

            </div>

            <Separator className="bg-[#12243a]" />

            <div>

              <div className="mb-2 flex items-center justify-between text-xs">

                <span className="text-emerald-400">No Pothole</span>

                <span>{progressValues.no_pothole}%</span>

              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                <Progress value={progressValues.no_pothole} className="h-2 bg-[#102133] [&>div]:bg-emerald-500" />

              </motion.div>

            </div>

          </CardContent>

        </Card>

      </section>

    </div>

  );

}

