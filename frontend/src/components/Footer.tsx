import { Atom, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 rounded-lg bg-primary/10"
            >
              <Atom className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <p className="font-semibold text-foreground">
                Quantum Pothole Detection
              </p>
              <p className="text-sm text-muted-foreground">
                Research Project — Smart Cities Initiative
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Github className="w-5 h-5 text-muted-foreground" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Mail className="w-5 h-5 text-muted-foreground" />
            </motion.a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Quantum Pothole Severity Detection System. Built for Smart City Research.
          </p>
        </div>
      </div>
    </footer>
  );
}
