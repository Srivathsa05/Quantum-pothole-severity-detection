import { useEffect, useState } from "react";

export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted/20 z-50">
      <div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-200"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
