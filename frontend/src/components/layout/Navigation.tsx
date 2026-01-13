import { Button } from "@/components/ui/button";
import { Menu, X, Car } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">SafeRoad AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/features"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/features") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Features
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/how-it-works") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/driving-analysis"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/driving-analysis") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Driving Analysis
            </Link>
            <Link
              to="/pothole-detection"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/pothole-detection") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Pothole Detection
            </Link>
            <Link
              to="/pricing"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/pricing") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/about") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              About
            </Link>
            <Link
              to="/blog"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/blog") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`text-sm hover:text-foreground transition-colors ${
                isActive("/contact") ? "text-foreground font-semibold" : "text-foreground/80"
              }`}
            >
              Contact
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/features"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/how-it-works"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/driving-analysis"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Driving Analysis
            </Link>
            <Link
              to="/pothole-detection"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pothole Detection
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/blog"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-3 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
