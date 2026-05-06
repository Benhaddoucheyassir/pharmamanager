import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="container py-4">
        <div className="glass-strong rounded-2xl flex items-center justify-between px-5 py-3">
          <a href="#" className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Pill className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-semibold tracking-tight text-lg">
              Pharma<span className="text-primary">Stream</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
            <a href="#inventory" className="hover:text-foreground transition-colors">Inventory</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90 shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              Launch app
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
