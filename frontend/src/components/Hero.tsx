import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 mesh-bg opacity-80" />
      <div className="absolute inset-0 grid-lines opacity-40" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="lg:col-span-6"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>v2.0 — Now with AI demand forecasting</span>
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
            >
              The pharmacy,<br />
              <span className="text-gradient">re-engineered.</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              PharmaStream unifies inventory, sales, and clinical insights in one breathtaking
              workspace — built for modern pharmacies in Morocco and beyond.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90 shadow-[0_0_30px_hsl(var(--primary)/0.5)] h-12 px-6 rounded-xl">
                Start free trial <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 rounded-xl glass border-white/10 hover:bg-white/5">
                Watch demo
              </Button>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="mt-10 flex items-center gap-6 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-2"><span className="led text-success" />HIPAA-aligned</div>
              <div className="flex items-center gap-2"><span className="led text-accent" />Real-time sync</div>
              <div className="flex items-center gap-2"><span className="led text-primary" />Offline-first</div>
            </motion.div>
          </motion.div>

          {/* Right: floating dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <FloatingMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FloatingMockup = () => {
  return (
    <div className="relative aspect-[4/3.2] [perspective:1800px]">
      {/* Glow orb */}
      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.35),transparent_60%)] blur-2xl" />

      {/* 3D abstract orb */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 w-44 h-44 rounded-full opacity-70"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(252 80% 60%), hsl(var(--primary)))",
          filter: "blur(8px)",
        }}
      />

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative glass-strong rounded-3xl p-5 [transform:rotateY(-8deg)_rotateX(6deg)] shadow-elegant"
        style={{ boxShadow: "0 40px 100px -20px hsl(162 84% 30% / 0.5)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">pharmastream.app/dashboard</div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MockStat icon={<TrendingUp className="w-3.5 h-3.5" />} label="Revenue" value="18 420" suffix="MAD" />
          <MockStat icon={<Activity className="w-3.5 h-3.5" />} label="Sales" value="1 284" suffix="today" />
          <MockStat icon={<Package className="w-3.5 h-3.5" />} label="Stock" value="78%" suffix="health" />
        </div>

        <div className="mt-3 glass rounded-2xl p-4 h-40 relative overflow-hidden">
          <div className="text-xs text-muted-foreground mb-2">Sales velocity · 14d</div>
          <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,80 C40,60 60,70 90,40 C120,15 150,55 180,30 C210,10 240,40 300,15 L300,100 L0,100 Z" fill="url(#hg)" />
            <path d="M0,80 C40,60 60,70 90,40 C120,15 150,55 180,30 C210,10 240,40 300,15" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <span className="led text-success" />
            <span className="text-xs">Doliprane 1000mg</span>
            <span className="ml-auto text-xs font-mono text-muted-foreground">248</span>
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <span className="led text-warning" />
            <span className="text-xs">Amoxicilline</span>
            <span className="ml-auto text-xs font-mono text-muted-foreground">36</span>
          </div>
        </div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-4 bottom-10 glass-strong rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-success to-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">AI suggestion</div>
          <div className="text-xs font-medium">Reorder Ventoline · 24 units</div>
        </div>
      </motion.div>
    </div>
  );
};

const MockStat = ({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix: string }) => (
  <div className="glass rounded-xl p-3">
    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">{icon}{label}</div>
    <div className="mt-1 font-display text-base font-semibold">{value}</div>
    <div className="text-[9px] text-muted-foreground">{suffix}</div>
  </div>
);
