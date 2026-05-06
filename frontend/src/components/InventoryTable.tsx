import { motion } from "framer-motion";
import { MoreHorizontal, Package, Loader2 } from "lucide-react";
import { formatMAD } from "../lib/utils";
import { useMedicaments } from "../hooks/useMedicaments";

// This helper maps your numerical stock to those beautiful glowing LED colors
const getStatusMeta = (stock: number) => {
  if (stock <= 0) return { label: "Out", color: "text-destructive" };
  if (stock <= 5) return { label: "Critical", color: "text-[hsl(20_95%_60%)]" };
  if (stock <= 15) return { label: "Low", color: "text-warning" };
  return { label: "In stock", color: "text-success" };
};

export const InventoryTable = () => {
  // 1. CONNECT ENGINE
  const { medicaments, loading, error } = useMedicaments();

  return (
    <div className="glass rounded-3xl p-6 h-full border border-white/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Package className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Inventory</div>
            <div className="font-display text-xl font-semibold mt-0.5">Live overview</div>
          </div>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all →
        </button>
      </div>

      <div className="overflow-x-auto -mx-2">
        {error ? (
          <div className="p-10 text-center text-sm text-destructive bg-destructive/5 rounded-2xl">
            {error}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left font-normal px-2 py-2">Medicament</th>
                <th className="text-left font-normal px-2 py-2 hidden md:table-cell">Category</th>
                <th className="text-right font-normal px-2 py-2">Price</th>
                <th className="text-right font-normal px-2 py-2">Stock</th>
                <th className="text-left font-normal px-2 py-2">Status</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {medicaments.map((m: any, i: number) => {
                const s = getStatusMeta(m.stock);
                return (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-2 py-3.5">
                      <div className="font-medium group-hover:text-primary transition-colors">{m.nom}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">REF-{m.id}</div>
                    </td>
                    <td className="px-2 py-3.5 text-muted-foreground hidden md:table-cell">
                      {m.categorie_name || "General"}
                    </td>
                    <td className="px-2 py-3.5 text-right font-mono font-medium">
                      {formatMAD(m.prix_vente)}
                    </td>
                    <td className="px-2 py-3.5 text-right font-mono italic">
                      {m.stock} <span className="text-[10px] text-muted-foreground">u</span>
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`led ${s.color}`} />
                        <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3.5 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
        
        {!loading && medicaments.length === 0 && (
            <div className="py-20 text-center text-muted-foreground text-sm italic">
                No medications found in the database.
            </div>
        )}
      </div>
    </div>
  );
};