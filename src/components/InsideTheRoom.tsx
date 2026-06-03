import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, DoorOpen } from "lucide-react";

export function InsideTheRoom({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.03] transition"
      >
        <div className="flex items-center gap-2.5">
          <DoorOpen className="h-3.5 w-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-gold">
            Inside The Room
          </span>
          <span className="text-[10.5px] text-foreground/55 hidden sm:inline">
            · badges · hosts · legends · history
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="h-4 w-4 text-foreground/60" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-1 space-y-4 border-t border-white/5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
