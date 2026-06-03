import { motion } from "framer-motion";

const MASCOTS = [
  { emoji: "🏈", name: "TailgateKing", title: "Tailgate Captain", color: "oklch(0.65 0.18 240)" },
  { emoji: "🔥", name: "BrisketBoss", title: "Pit Master", color: "oklch(0.70 0.24 28)" },
  { emoji: "👑", name: "LoneStarMaya", title: "Hot Take Queen", color: "oklch(0.82 0.14 85)" },
  { emoji: "⚡", name: "DebateCaptain", title: "Rivalry Ref", color: "oklch(0.72 0.18 70)" },
];

export function MascotRail() {
  return (
    <div className="rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9.5px] uppercase tracking-[0.28em] text-gold/85">
          🤠 Legends at the bar tonight
        </span>
        <span className="text-[9.5px] text-foreground/55">all here · stirring it up</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {MASCOTS.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="relative group flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold/30 transition cursor-pointer min-w-0"
          >
            <div
              className="relative h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0"
              style={{ background: `radial-gradient(circle, ${m.color}, oklch(0.2 0.05 260))` }}
            >
              {m.emoji}
              <motion.span
                className="absolute -bottom-0 -right-0 h-2 w-2 rounded-full bg-live border border-background"
                animate={{ scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
              />
            </div>
            <div className="min-w-0 hidden sm:block">
              <div className="text-[11px] text-foreground/95 truncate font-medium leading-tight">
                {m.name}
              </div>
              <div className="text-[9px] text-foreground/55 truncate leading-tight">
                {m.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
