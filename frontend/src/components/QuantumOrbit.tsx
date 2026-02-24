import { motion } from "framer-motion";

export function QuantumOrbit() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20 dark:opacity-30">
      <div className="relative w-[600px] h-[600px]">
        {/* Central glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-quantum-glow blur-sm"
        />
        
        {/* Orbits */}
        {[1, 2, 3].map((ring, i) => (
          <div
            key={ring}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary/20 rounded-full"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8 + i * 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-full h-full relative"
            >
              <div
                className="absolute w-3 h-3 rounded-full bg-primary shadow-lg"
                style={{
                  top: "0%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  boxShadow: "0 0 20px hsl(var(--primary))",
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
