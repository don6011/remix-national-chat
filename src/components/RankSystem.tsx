import { motion } from "framer-motion";
import {
  Shield, Crown, Star, Zap, Check, Lock, Sparkles,
  type LucideIcon,
} from "lucide-react";

type Rank = {
  name: string;
  requirement: string;
  benefit: string;
};

const CITIZEN_LADDER: Rank[] = [
  { name: "Citizen",          requirement: "Account created",                                       benefit: "Join any room" },
  { name: "Verified Citizen", requirement: "Profile complete · State selected",                     benefit: "Custom badge" },
  { name: "Resident",         requirement: "100 messages · 2 rooms visited",                        benefit: "Profile flair" },
  { name: "State Ambassador", requirement: "300 messages · all 4 rooms visited · 25 reactions",     benefit: "Featured replies" },
  { name: "Governor",         requirement: "Earned via Path to Governor · Elected by citizens",     benefit: "Run the state" },
];

const CITIZEN_INDEX = 3;   // State Ambassador
const CITIZEN_PCT = 82;
const INFLUENCE = 1428;

export function RankSystem() {
  return (
    <section className="space-y-4">
      {/* HERO RANK CARD */}
      <div className="glass-strong rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-60 bg-gold/30" />
        <div className="relative flex items-start gap-5">
          <ProgressRing pct={CITIZEN_PCT} />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80 flex items-center gap-1.5">
              <Shield className="h-3 w-3" /> Current Rank
            </div>
            <h2 className="font-display text-2xl leading-tight mt-1">
              State Ambassador
            </h2>
            <div className="mt-2 flex items-end gap-2">
              <div className="font-display text-3xl text-gold tabular-nums leading-none">
                {INFLUENCE.toLocaleString()}
              </div>
              <div className="text-[11px] text-foreground/60 pb-0.5 uppercase tracking-widest">
                Influence
              </div>
            </div>
            <div className="mt-2 text-[11px] text-foreground/70">
              Next: <span className="text-foreground">Regional Ambassador</span>
              <span className="text-gold ml-1.5">· {CITIZEN_PCT}% complete</span>
            </div>
          </div>
        </div>

        {/* Standings */}
        <div className="relative mt-5 grid grid-cols-2 gap-2">
          <Standing rank="#14"     scope="Texas"        pct="Top 8%"  icon={Crown} />
          <Standing rank="#1,284"  scope="Nationally"   pct="Top 15%" icon={Star} />
        </div>
      </div>

      {/* CITIZEN LADDER */}
      <div className="grid gap-4">
        <Ladder
          title="Citizen Rank"
          subtitle="Community"
          icon={Sparkles}
          ranks={CITIZEN_LADDER}
          currentIndex={CITIZEN_INDEX}
          pct={CITIZEN_PCT}
        />
      </div>
    </section>
  );
}

function ProgressRing({ pct }: { pct: number }) {
  const size = 84;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#rankgrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="rankgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.14 85)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 60)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Shield className="h-5 w-5 text-gold" />
        <div className="text-[10px] font-medium text-gold tabular-nums mt-0.5">{pct}%</div>
      </div>
    </div>
  );
}

function Standing({
  rank, scope, pct, icon: Icon,
}: { rank: string; scope: string; pct: string; icon: LucideIcon }) {
  return (
    <div className="glass rounded-xl p-2.5 flex items-center gap-2.5">
      <Icon className="h-4 w-4 text-gold shrink-0" />
      <div className="min-w-0">
        <div className="text-sm font-medium tabular-nums leading-none">{rank}</div>
        <div className="text-[10px] uppercase tracking-widest text-foreground/55 mt-1">
          {scope} · {pct}
        </div>
      </div>
    </div>
  );
}

function Ladder({
  title, subtitle, icon: Icon, ranks, currentIndex, pct,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  ranks: Rank[];
  currentIndex: number;
  pct: number;
}) {
  return (
    <div className="glass-strong rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-gold" />
          <h3 className="font-display text-base">{title}</h3>
          <span className="text-[10px] uppercase tracking-widest text-foreground/50">
            {subtitle}
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-gold/80">
          {ranks[currentIndex].name}
        </div>
      </div>

      <ol className="relative pl-5">
        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/8" />
        {ranks.map((r, i) => {
          const completed = i < currentIndex;
          const current = i === currentIndex;
          const locked = i > currentIndex;
          return (
            <li key={r.name} className="relative pb-3 last:pb-0">
              <span
                className={[
                  "absolute -left-[18px] top-1.5 h-3 w-3 rounded-full flex items-center justify-center",
                  completed && "bg-gold shadow-[0_0_8px_oklch(0.78_0.16_60)]",
                  current && "bg-gold ring-4 ring-gold/20 shadow-[0_0_16px_oklch(0.78_0.16_60)]",
                  locked && "bg-white/10",
                ].filter(Boolean).join(" ")}
              >
                {completed && <Check className="h-2 w-2 text-black/80" strokeWidth={3} />}
                {locked && <Lock className="h-2 w-2 text-foreground/40" />}
              </span>

              <div
                className={[
                  "rounded-xl px-3 py-2",
                  current && "bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30",
                  !current && "border border-transparent",
                ].filter(Boolean).join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={[
                      "text-sm font-medium",
                      locked && "text-foreground/45",
                    ].filter(Boolean).join(" ")}
                  >
                    {r.name}
                  </div>
                  {current && (
                    <span className="text-[9px] uppercase tracking-widest text-gold flex items-center gap-1">
                      <Zap className="h-3 w-3" /> You
                    </span>
                  )}
                </div>
                <div className={`text-[11px] mt-0.5 ${locked ? "text-foreground/40" : "text-foreground/65"}`}>
                  {r.requirement}
                </div>
                <div className={`text-[10px] mt-1 uppercase tracking-widest ${locked ? "text-foreground/30" : "text-gold/70"}`}>
                  Perk · {r.benefit}
                </div>

                {current && (
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[oklch(0.82_0.14_85)] to-[oklch(0.72_0.16_60)]"
                      />
                    </div>
                    <div className="text-[10px] text-foreground/55 mt-1 tabular-nums">
                      {pct}% to {ranks[currentIndex + 1]?.name ?? "Max rank"}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
