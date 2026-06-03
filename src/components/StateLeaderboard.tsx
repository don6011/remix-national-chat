import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, ArrowUp, Minus } from "lucide-react";
import { STATES } from "@/lib/states";

const TREND_ICON = {
  hot: Flame,
  rising: ArrowUp,
  active: Minus,
} as const;

const TREND_TONE = {
  hot: "text-[oklch(0.85_0.20_30)]",
  rising: "text-[oklch(0.85_0.18_140)]",
  active: "text-foreground/55",
} as const;

export function StateLeaderboard() {
  const ranked = [...STATES].sort((a, b) => b.live - a.live).slice(0, 5);

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🇺🇸</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
            State Leaderboard
          </span>
        </div>
        <Link to="/states" className="text-[10px] text-foreground/55 hover:text-gold/90">
          All 50 →
        </Link>
      </div>
      <ol className="p-2 space-y-1">
        {ranked.map((s, i) => {
          const Icon = TREND_ICON[s.trend];
          return (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to="/states/$stateId"
                params={{ stateId: s.id }}
                className="group flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold/40 hover:bg-white/[0.06] px-3 py-2 transition"
              >
                <span className="font-display text-lg text-foreground/40 w-6 tabular-nums">
                  #{i + 1}
                </span>
                <span className="text-xl">{s.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold leading-tight">{s.name}</div>
                  <div className="text-[10px] text-foreground/55 truncate">{s.vibe}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] tabular-nums text-foreground/85">
                    {s.live.toLocaleString()}
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 text-[10px] uppercase tracking-wider ${TREND_TONE[s.trend]}`}
                  >
                    <Icon className="h-3 w-3" />
                    {s.trend}
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
