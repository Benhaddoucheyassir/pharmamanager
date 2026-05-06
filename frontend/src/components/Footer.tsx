import { Pill } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-white/5 py-10 mt-20">
    <div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Pill className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-foreground">PharmaStream</span>
        <span className="text-xs ml-2">© 2026 — Crafted in Casablanca.</span>
      </div>
      <div className="flex items-center gap-6 text-xs">
        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);
