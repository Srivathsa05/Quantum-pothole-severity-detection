import { motion } from "framer-motion";

export default function Contributions() {
  return (
    <section className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold mb-6">
            Citizen <span className="quantum-text">Contributions</span>
          </h1>
          <p className="text-muted-foreground mb-12">
            Community-contributed road data helps government agencies
            prioritize maintenance and improve urban infrastructure.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { value: "1,248", label: "Reports Submitted" },
              { value: "312", label: "High Severity Alerts" },
              { value: "18", label: "Urban Zones Covered" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-6"
              >
                <p className="text-3xl font-bold quantum-text">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            * Sample data shown for demonstration purposes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
