import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ShoppingBag, PackageCheck, Loader2 } from "lucide-react";
import { Sparkline } from "./Sparkline";
import { formatMAD } from "../lib/utils";
import { useDashboard } from "../hooks/useDashboard";

export const SummaryCards = () => {
  // 1. CONNECT ENGINE
  const { stats, loading, error } = useDashboard();

  // 2. DATA MAPPING (Connecting Django fields to UI visuals)
  const cards = [
    {
      icon: ShoppingBag,
      label: "Total Sales",
      value: stats?.total_sales_count?.toLocaleString("fr-FR") || "0",
      delta: stats?.sales_growth_percentage || 0,
      suffix: "transactions recorded",
      trend: stats?.sales_trend || [0, 0, 0, 0, 0], // Fallback to empty sparkline
      color: "hsl(var(--primary))",
    },
    {
      icon: Wallet,
      label: "Daily Revenue",
      value: formatMAD(stats?.daily_revenue || 0),
      delta: stats?.revenue_growth_percentage || 0,
      suffix: "revenue today",
      trend: stats?.revenue_trend || [0, 0, 0, 0, 0],
      color: "hsl(var(--accent))",
    },
    {
      icon: PackageCheck,
      label: "Stock Health",
      value: `${stats?.stock_health_percentage || 0}%`,
      delta: stats?.stock_change_delta || 0,
      suffix: "of products in stock",
      trend: stats?.stock_trend || [0, 0, 0, 0, 0],
      color: "hsl(var(--warning))",
    },
  ];

  if (loading && !stats) {
    return (
      <div className="grid md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-3xl p-10 flex items-center justify-center border border-white/5">
            <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {cards.map((c, i) => {
        const positive = c.delta >= 0;
        const Icon = c.icon;
        
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group glass rounded-3xl p-6 relative overflow-hidden transition-shadow hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.2)] border border-white/5"
          >
            {/* Background Glow Effect */}
            <div
              className="absolute -top-20 -right-20 w-44 h-44 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl"
              style={{ background: c.color }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  <Icon className="w-3.5 h-3.5" style={{ color: c.color }} />
                  {c.label}
                </div>
                <div className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
                  {c.value}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground italic font-medium">
                  {c.suffix}
                </div>
              </div>

              {/* Growth Badge */}
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full glass border border-white/5 ${
                  positive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(c.delta)}%
              </div>
            </div>

            {/* Live Sparkline */}
            <div className="mt-6 -mx-2 h-12 opacity-80 group-hover:opacity-100 transition-opacity">
              <Sparkline data={c.trend} color={c.color} height={48} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};