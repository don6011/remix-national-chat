import { motion } from "framer-motion";
import { Flame, Swords, Heart, Hash, Users, TrendingUp } from "lucide-react";

type Rivalry = {
  icon: typeof Swords;
  label: string;
  a: string;
  b: string;
  note: string;
  tone: "gold" | "cyan" | "violet" | "rose";
};

const TONE: Record<Rivalry["tone"], string> = {
  gold: "border-gold/40 text-gold",
  cyan: "border-[oklch(0.65_0.18_200/0.5)] text-[oklch(0.82_0.14_200)]",
  violet: "border-[oklch(0.65_0.18_290/0.5)] text-[oklch(0.82_0.14_290)]",
  rose: "border-[oklch(0.70_0.20_10/0.5)] text-[oklch(0.85_0.18_10)]",
};

export function NationalIntelBar({
  hero = {
    state: "Texas",
    venue: "Sports Bar",
    delta: "+12% this hour",
  },
  rivalries = [
    { icon: Swords, label: "Headline Rivalry", a: "Texas", b: "Florida", note: "Beach vs Stadium · 2.1k debating", tone: "gold" as const },
    { icon: TrendingUp, label: "Chasing #1", a: "California", b: "Texas", note: "Creators closing the gap +38%", tone: "cyan" as const },
    { icon: Hash, label: "Region Battle", a: "South", b: "West Coast", note: "Culture vs Tech · live now", tone: "violet" as const },
    { icon: Heart, label: "Reactions Tonight", a: "124,802", b: "", note: "Across all 50 states", tone: "rose" as const },
  ],
  liveCitizens = "38,402",
}: {
  hero?: { state: string; venue: string; delta: string };
  rivalries?: Rivalry[];
  liveCitizens?: string;
}) {
  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
            National Intelligence
          </span>
        </div>
        <span className="text-[10px] text-foreground/55 inline-flex items-center gap-1.5">
          <Users className="h-2.5 w-2.5" />
          {liveCitizens} live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
        {/* HERO — Most Active (spans 2 cols on sm+) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:col-span-2 sm:row-span-2 relative overflow-hidden rounded-xl border border-[oklch(0.70_0.24_28/0.55)] bg-gradient-to-br from-[oklch(0.22_0.14_28/0.55)] via-[oklch(0.16_0.10_30/0.4)] to-[oklch(0.12_0.06_260/0.3)] p-4"
        >
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[oklch(0.70_0.24_28)] opacity-25 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-[oklch(0.88_0.18_30)]">
              <Flame className="h-3 w-3" /> Most Active
            </div>
            <div className="mt-3 font-display text-[2.2rem] leading-none text-foreground">
              {hero.state}
            </div>
            <div className="mt-1.5 text-sm text-foreground/75">{hero.venue}</div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.70_0.24_28/0.18)] border border-[oklch(0.70_0.24_28/0.5)] px-2.5 py-1 text-[11px] font-semibold text-[oklch(0.88_0.18_30)]">
              <TrendingUp className="h-3 w-3" />
              {hero.delta}
            </div>
          </div>
        </motion.div>

        {/* Rivalry cards */}
        {rivalries.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.04 }}
            className={`rounded-xl bg-white/[0.04] border p-2.5 ${TONE[r.tone]}`}
          >
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] opacity-80">
              <r.icon className="h-2.5 w-2.5" /> {r.label}
            </div>
            <div className="mt-1 text-[13px] font-semibold text-foreground/95 leading-snug">
              {r.b ? (
                <>
                  {r.a} <span className="text-foreground/45 mx-0.5">vs</span> {r.b}
                </>
              ) : (
                r.a
              )}
            </div>
            <div className="text-[10px] text-foreground/55 mt-0.5 line-clamp-1">{r.note}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
