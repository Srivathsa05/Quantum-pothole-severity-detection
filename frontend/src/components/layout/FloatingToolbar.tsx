import { useState, useEffect } from "react";
import { Home, Zap, Map, TrendingUp, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sections = [
  { id: "hero", label: "Home", icon: Home },
  { id: "features", label: "Features", icon: Zap },
  { id: "how-it-works", label: "How It Works", icon: Map },
  { id: "stats", label: "Impact", icon: TrendingUp },
  { id: "cta", label: "Get Started", icon: Mail },
];

export const FloatingToolbar = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show toolbar after scrolling 200px
      setIsVisible(window.scrollY > 200);

      // Determine active section
      const sectionElements = sections.map(({ id }) => ({
        id,
        element: document.getElementById(id),
      }));

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const { id, element } of sectionElements) {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <TooltipProvider>
        <div className="flex flex-col gap-2 bg-card/80 backdrop-blur-lg border border-border rounded-full p-3 shadow-xl">
          {sections.map(({ id, label, icon: Icon }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full h-10 w-10 ${
                    activeSection === id
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => scrollToSection(id)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          <div className="h-px bg-border my-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-primary/10"
                onClick={scrollToTop}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Back to Top</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
