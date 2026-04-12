export function Footer() {
  return (
    <footer
      className="h-10 border-t"
      style={{ backgroundColor: "#040810", borderColor: "#0f1e30" }}
    >
      <div className="section-container flex h-full items-center justify-between gap-3 text-[10px] tracking-wide text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#1c3e52] bg-[#08101f] px-2 py-1">
            <span className="mr-1 text-emerald-400">●</span>MODEL ACTIVE
          </span>
          <span className="rounded-full border border-[#1c3e52] bg-[#08101f] px-2 py-1">
            <span className="mr-1 text-[#00d4ff]">●</span>GPU: RTX 3050
          </span>
          <span className="rounded-full border border-[#1c3e52] bg-[#08101f] px-2 py-1">
            <span className="mr-1 text-amber-400">●</span>TEMP: 52°C
          </span>
        </div>
        <div className="text-slate-500">RoadPulse © 2026</div>
      </div>
    </footer>
  );
}
