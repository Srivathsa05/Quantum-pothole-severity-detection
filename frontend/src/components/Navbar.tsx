import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/detect", label: "Detection" },
  { path: "/live", label: "Live Detection" },
  { path: "/heatmap", label: "Heatmap" },
  { path: "/results", label: "Results" },
  { path: "/model", label: "About Us" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = useMemo(() => {
    const matched = navLinks.find((item) => item.path === location.pathname);
    return matched?.path ?? "/";
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 h-[52px] border-b"
      style={{ backgroundColor: "#08101f", borderColor: "#112240" }}
    >
      <div className="section-container h-full">
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#00d4ff]/20 text-[#00d4ff]">
              <MapPinned className="h-4 w-4" />
            </span>
            <span className="text-[#e2e8f0] hidden sm:inline">ROAD</span>
            <span className="text-[#00d4ff] hidden sm:inline">PULSE</span>
          </Link>

          <div className="max-w-full overflow-x-auto">
            <Tabs value={activePath}>
              <TabsList className="h-9 border border-[#0f1e30] bg-[#060b14]">
                {navLinks.map((link) => (
                  <TabsTrigger
                    key={link.path}
                    value={link.path}
                    onClick={() => navigate(link.path)}
                    className="whitespace-nowrap px-2 text-[10px] md:px-3 md:text-[11px] data-[state=active]:bg-[#00d4ff]/10 data-[state=active]:text-[#00d4ff]"
                  >
                    {link.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex justify-end">
            <Badge
              className="h-7 rounded-full border border-[#1a3f57] bg-[#091526] px-3 text-[10px] font-medium text-slate-300"
            >
              <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              SYSTEM ONLINE · v2.1
            </Badge>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
