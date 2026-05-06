import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ScanLine, Check, Search, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { formatMAD } from "../lib/utils"; // We'll move formatMAD here
import { toast } from "sonner";

// --- ENGINE IMPORTS ---
import { useSales } from "../hooks/useSales"; 
import { useMedicaments } from "../hooks/useMedicaments";

export const SalesTerminal = () => {
  // 1. CONNECT ENGINES
  const { addSale } = useSales();
  const { medicaments, loading: loadingMedics } = useMedicaments();

  // 2. LOCAL UI STATE
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. LOGIC
  const selected = useMemo(() => 
    medicaments.find((m: any) => m.id === selectedId), 
    [selectedId, medicaments]
  );

  const filtered = useMemo(() => 
    query.length > 1 
      ? medicaments.filter((m: any) => m.nom.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
      : [],
    [query, medicaments]
  );

  const total = (selected?.prix_vente ?? 0) * qty;

  // 4. THE BRAIN (The actual API call)
  const handleSale = async () => {
    if (!selectedId || !selected) {
      toast.error("Please select a medicament first");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Connecting to your useSales.js engine
      await addSale({
        medicament: selectedId, // Matches your Django Serializer field
        quantite: qty,          // Matches your Django Serializer field
      });

      // Reset Form
      setQty(1);
      setSelectedId(null);
      setQuery("");
    } catch (error: any) {
      // Error already handled by useSales toast
      console.error('Sale error details:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col relative overflow-hidden border border-white/5">
      <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Quick Checkout</div>
            <div className="font-display text-xl font-semibold mt-0.5">Terminal</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center glow-primary">
            {loadingMedics ? <Loader2 className="w-5 h-5 animate-spin" /> : <ScanLine className="w-5 h-5 text-primary-foreground" />}
          </div>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search medicine..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 glass border-white/10 h-11 rounded-xl focus:ring-primary/50"
          />
        </div>

        {/* SEARCH RESULTS DROPDOWN */}
        <AnimatePresence>
          {query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute z-50 w-full mt-2 glass-strong rounded-xl p-1 shadow-2xl border border-white/10"
            >
              {filtered.length === 0 && <div className="p-3 text-xs text-muted-foreground text-center">No medicine found</div>}
              {filtered.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedId(m.id);
                    setQuery("");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary/20 text-left text-sm transition-colors"
                >
                  <span className="font-medium">{m.nom}</span>
                  <span className="font-mono text-xs text-primary">{m.prix_vente} MAD</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SELECTED ITEM PREVIEW */}
        {selected && (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 glass-strong rounded-2xl p-5 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-primary uppercase font-bold tracking-widest">{selected.categorie_name || 'Medicine'}</div>
                <div className="font-semibold text-lg">{selected.nom}</div>
              </div>
              <div className="font-mono font-bold text-lg text-primary">{selected.prix_vente} <span className="text-xs">MAD</span></div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase">Quantity</span>
              <div className="flex items-center gap-2 glass rounded-xl p-1 border border-white/5">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/10" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span className="w-8 text-center font-mono font-bold">{qty}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/10" onClick={() => setQty(qty + 1)}>
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Total</span>
              <motion.span key={total} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="font-display text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {total.toFixed(2)} MAD
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* SUBMIT BUTTON */}
        <Button
          onClick={handleSale}
          disabled={!selectedId || isSubmitting}
          className="mt-5 w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_hsl(var(--primary)/0.3)] font-bold"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-4 h-4 mr-1.5 stroke-[3px]" /> Confirm Transaction</>}
        </Button>
      </div>
    </div>
  );
};