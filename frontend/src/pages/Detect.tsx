import { useMemo, useRef, useState } from "react";

import { motion } from "framer-motion";

import { UploadCloud } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";



const sampleFeed = [

  { severity: "severe", location: "MG Road", confidence: 0.97, time: "14:22:10" },

  { severity: "minor", location: "Koramangala 5th Block", confidence: 0.91, time: "14:21:44" },

  { severity: "no_pothole", location: "BTM Layout", confidence: 0.83, time: "14:21:18" },

  { severity: "severe", location: "Hebbal Flyover", confidence: 0.95, time: "14:20:59" },

  { severity: "minor", location: "Indiranagar 100ft Road", confidence: 0.9, time: "14:20:20" },

  { severity: "no_pothole", location: "HSR Layout Sector 2", confidence: 0.79, time: "14:19:53" },

];



function severityClasses(severity: string) {

  if (severity === "severe") return "border-red-400/40 bg-red-500/10 text-red-300";

  if (severity === "minor") return "border-amber-400/40 bg-amber-500/10 text-amber-300";

  return "border-emerald-400/40 bg-emerald-500/10 text-emerald-300";

}



export default function Detect() {

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const navigate = useNavigate();



  const feed = useMemo(() => {

    if (!file) return sampleFeed;

    return [

      { severity: "minor", location: "Uploaded Segment", confidence: 0.92, time: new Date().toLocaleTimeString() },

      ...sampleFeed,

    ];

  }, [file]);



  const onFileChange = (selected: File) => {

    setFile(selected);

    setPreview(URL.createObjectURL(selected));

  };



  const onAnalyze = async () => {

    if (!file) return;

    setIsAnalyzing(true);

    try {

      const form = new FormData();

      form.append("file", file, file.name);

      const response = await fetch("http://localhost:8000/predict", { method: "POST", body: form });

      if (!response.ok) {

        const text = await response.text();

        throw new Error(text || "Prediction failed");

      }

      const data = await response.json();

      navigate("/results", { state: { prediction: data, preview } });

    } catch (error) {

      navigate("/results", { state: { error: String(error) } });

    } finally {

      setIsAnalyzing(false);

    }

  };



  return (

    <div className="section-container py-4">

      <Card className="border-[#0f1e30] bg-[#08101f]">

        <CardHeader>

          <p className="section-label">Detection</p>

          <CardTitle className="text-base text-slate-100">File-Based Severity Scanner</CardTitle>

        </CardHeader>

        <CardContent className="space-y-4">

          <div className="relative h-[180px] overflow-hidden rounded-lg border border-[#14304a] bg-[#050b14]">

            <div className="scanline" />

            {preview ? (

              <img src={preview} alt="Preview" className="h-full w-full object-contain opacity-85" />

            ) : (

              <button

                type="button"

                onClick={() => inputRef.current?.click()}

                className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[#1b4360] text-slate-300"

              >

                <UploadCloud className="h-8 w-8 text-[#00d4ff]" />

                <p className="text-sm">Drop image/video or click to upload</p>

              </button>

            )}

            <input

              ref={inputRef}

              type="file"

              className="hidden"

              accept="image/*,video/*"

              onChange={(event) => {

                const selected = event.target.files?.[0];

                if (selected) onFileChange(selected);

              }}

            />

          </div>



          <div className="flex flex-wrap gap-2">

            <Button

              onClick={onAnalyze}

              disabled={!file || isAnalyzing}

              className="bg-[#00d4ff] text-[#03111b] hover:bg-[#40e2ff]"

            >

              {isAnalyzing ? "Analyzing..." : "Run Detection"}

            </Button>

            <Button

              variant="outline"

              onClick={() => {

                setFile(null);

                setPreview(null);

              }}

              className="border-[#1d3c56] bg-transparent"

            >

              Clear

            </Button>

          </div>



          <Card className="border-[#0f1e30] bg-[#060d18]">

            <CardHeader className="pb-3">

              <p className="section-label">Detection Feed</p>

              <CardTitle className="text-sm text-slate-100">Recent Inferences</CardTitle>

            </CardHeader>

            <CardContent>

              <ScrollArea className="h-56 pr-3">

                <motion.div

                  initial="hidden"

                  animate="show"

                  variants={{

                    hidden: {},

                    show: { transition: { staggerChildren: 0.08 } },

                  }}

                  className="space-y-2"

                >

                  {feed.map((entry, index) => (

                    <motion.div

                      key={`${entry.location}-${index}`}

                      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}

                      className="flex items-center justify-between rounded-md border border-[#12263a] bg-[#091321] px-3 py-2 text-xs"

                    >

                      <div className="flex items-center gap-3">

                        <Badge className={`border ${severityClasses(entry.severity)}`}>{entry.severity}</Badge>

                        <span className="text-slate-200">{entry.location}</span>

                      </div>

                      <div className="text-right text-slate-400">

                        <div>{Math.round(entry.confidence * 100)}%</div>

                        <div>{entry.time}</div>

                      </div>

                    </motion.div>

                  ))}

                </motion.div>

              </ScrollArea>

            </CardContent>

          </Card>

        </CardContent>

      </Card>

    </div>

  );

}

