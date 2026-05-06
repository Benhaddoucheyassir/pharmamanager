import { motion } from "framer-motion";
import { Brain, ShieldCheck, Zap, BarChart3, Smartphone, Globe2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI demand forecasting",
    desc: "Predict stockouts 14 days in advance with on-device ML.",
    span: "md:col-span-2 md:row-span-2",
    accent: "from-primary/30 to-accent/10",
  },
  { icon: Zap, title: "Lightning POS", desc: "Sub-100ms checkout.", span: "", accent: "from-accent/30 to-transparent" },
  { icon: ShieldCheck, title: "HIPAA-aligned", desc: "End-to-end encryption.", span: "", accent: "from-success/30 to-transparent" },
  { icon: BarChart3, title: "Real-time analytics", desc: "Dashboards that update as you sell.", span: "md:col-span-2", accent: "from-primary/20 to-transparent" },
  { icon: Smartphone, title: "Mobile-first", desc: "Native iOS & Android.", span: "", accent: "from-accent/20 to-transparent" },
  { icon: Globe2, title: "Multi-branch", desc: "Sync inventory across pharmacies.", span: "", accent: "from-primary/20 to-transparent" },
];

export const FeatureBento = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-4">
            Built for the modern apothecary
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
            Everything you need.<br /><span className="text-gradient">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 md:auto-rows-[180px] gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`glass rounded-3xl p-6 relative overflow-hidden group ${f.span}`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${f.accent}`} />
                <div className="relative h-full flex flex-col">
                  <div className="w-11 h-11 rounded-xl glass-strong flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="mt-auto pt-6">
                    <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
