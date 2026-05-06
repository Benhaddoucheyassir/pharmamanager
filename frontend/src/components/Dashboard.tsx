import { motion } from "framer-motion";
import { SummaryCards } from "./SummaryCards";
import { SalesTerminal } from "./SalesTerminal";
import { InventoryTable } from "./InventoryTable";
import { useDashboard } from "../hooks/useDashboard"; // Importing your dashboard engine
import { Loader2 } from "lucide-react";

export const Dashboard = () => {
  // 1. CONNECT ENGINE
  // We use this to get the "Last Sync" time and check if the whole page is loading
  const { loading, lastSync } = useDashboard(); 

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground mb-3 border border-white/5">
              <span className={`led ${loading ? "animate-pulse bg-warning" : "text-success"}`} /> 
              {loading ? "Syncing..." : "Live"}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Your command center.
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              A bento workspace tuned for clarity — sales, stock, and revenue at a glance.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1 rounded-lg border border-white/5">
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            Last sync · {lastSync || "Just now"}
          </div>
        </motion.div>

        {/* 2. SUMMARY SECTION (Revenue, Sales Count, etc.) */}
        <SummaryCards />

        {/* 3. BENTO GRID SECTION */}
        <div id="inventory" className="mt-6 grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 h-full">
            <InventoryTable />
          </div>
          <div className="lg:col-span-2 h-full">
            <SalesTerminal />
          </div>
        </div>
      </div>
    </section>
  );
};