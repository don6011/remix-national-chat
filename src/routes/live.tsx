import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Flame,
  Zap,
  Mic2,
  ArrowUpRight,
  TrendingUp,
  Users,
  MessageCircle,
  Radio,
  MapPin,
  Crown,
  Trophy,
} from "lucide-react";
import { STATES } from "@/lib/states";
import { getVenue } from "@/lib/venues";

export const Route = createFileRoute("/live")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Live — America is alive right now" },
      {
        name: "description",
        content:
          "The real-time pulse of America — hot rooms, state intelligence, trending topics, and the hosts driving the conversation tonight.",
      },
    ],
  }),
  component: LivePage,
});

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { icon: "🍺", text: "Texas Roadhouse Bar crossed 5,000 live" },
  { icon: "📈", text: "Mississippi Local Stage +42%" },
  { icon: "🏛", text: "Florida Town Hall hit #1" },
  { icon: "🎤", text: "TailgateKing started a new debate" },
  { icon: "🎤", text: "California Local Stage surging" },
  { icon: "☕", text: "New York Coffee Shop packed" },
  { icon: "⚡", text: "DebateCaptain just hit 1k listeners" },
  { icon: "🎸", text: "Tennessee Local Stage standing room only" },
];

const NATIONAL_STATS = [
  { label: "Citizens Online", value: 184_293, icon: Users, accent: "oklch(0.78 0.16 60)" },
  { label: "Conversations Active", value: 12_847, icon: MessageCircle, accent: "oklch(0.72 0.18 200)" },
  { label: "Rooms Live", value: 1_429, icon: Radio, accent: "oklch(0.70 0.24 28)" },
  { label: "States Trending", value: 38, icon: MapPin, accent: "oklch(0.62 0.16 320)" },
];

const HOT_ROOMS = [
  { stateId: "texas",      venueId: "bar",         topic: "Cowboys vs Eagles exploding",   live: 5124 },
  { stateId: "florida",    venueId: "town-hall",   topic: "Best beach in Florida?",        live: 4448 },
  { stateId: "california", venueId: "local-stage", topic: "LA vs SF creator war",          live: 3912 },
];


const TRENDING_TOPICS = [
  { label: "Texas vs Florida",      talking: 12_400, states: ["TX", "FL"],       delta: 31 },
  { label: "Best Southern Food",    talking: 8_120,  states: ["MS", "TN", "GA"], delta: 18 },
  { label: "Most Underrated State", talking: 6_740,  states: ["MS", "CO", "TN"], delta: 12 },
  { label: "AI Replacing Jobs?",    talking: 5_910,  states: ["CA", "NY", "TX"], delta: 27 },
];

const LIVE_HOSTS = [
  { rank: 1, handle: "TailgateKing",  state: "Texas",       room: "The Bar",     listeners: 1_240, top: true,  accent: "oklch(0.78 0.16 60)" },
  { rank: 2, handle: "DebateCaptain", state: "Florida",     room: "Town Hall",   listeners: 980,   top: true,  accent: "oklch(0.72 0.18 200)" },
  { rank: 3, handle: "BluesBoss",     state: "Mississippi", room: "Local Stage", listeners: 612,   top: false, accent: "oklch(0.62 0.16 320)" },
  { rank: 4, handle: "LoneStarMaya",  state: "Texas",       room: "Coffee Shop", listeners: 487,   top: false, accent: "oklch(0.78 0.16 60)" },
];

// ─────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <div className="text-[11px] uppercase tracking-[0.28em] text-gold/90 flex items-center gap-2">
          <span aria-hidden className="text-base leading-none">{icon}</span>
          {title}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
    </div>
  );
}

function useAnimatedCounter(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function StatCounter({ value, label, Icon, accent, delay }: {
  value: number; label: string; Icon: typeof Users; accent: string; delay: number;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const v = useAnimatedCounter(armed ? value : 0, 1600);
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div
        className="absolute -top-8 -right-8 h-20 w-20 rounded-full blur-2xl opacity-40"
        style={{ background: accent }}
      />
      <div className="relative flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground/60">
        <Icon className="h-3 w-3" style={{ color: accent }} />
        {label}
      </div>
      <div className="relative font-display text-2xl sm:text-3xl tabular-nums mt-1">
        {v.toLocaleString()}
      </div>
    </div>
  );
}

function LiveTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TICKER_ITEMS.length), 4800);
    return () => clearInterval(t);
  }, []);
  const item = TICKER_ITEMS[i];
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 glass">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-[oklch(0.70_0.24_28/0.18)] border border-[oklch(0.70_0.24_28/0.5)] px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-[oklch(0.88_0.18_30)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.22_28)] animate-pulse" />
          Live
        </span>
        <div className="relative h-5 overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-center gap-2 text-[12.5px] text-foreground/90 whitespace-nowrap"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

function LivePage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-8 pb-16 space-y-10">
      {/* HERO */}
      <header>
        <div className="text-[11px] uppercase tracking-[0.28em] text-gold/90 flex items-center gap-2">
          <span className="live-dot" /> Live across America
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-1.5 leading-tight">
          America is alive right now.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          The pulse of every state — what's exploding, who's driving it, and where to jump in tonight.
        </p>
      </header>

      {/* LIVE TICKER */}
      <LiveTicker />

      {/* LIVE ACROSS AMERICA */}
      <section>
        <SectionHeader icon="🇺🇸" title="Live across America" sub="The whole country, in numbers, right now." />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {NATIONAL_STATS.map((s, i) => (
            <StatCounter
              key={s.label}
              value={s.value}
              label={s.label}
              Icon={s.icon}
              accent={s.accent}
              delay={i * 120}
            />
          ))}
        </div>
      </section>

      {/* HOT RIGHT NOW */}
      <section>
        <SectionHeader icon="🔥" title="Hot right now" sub="The biggest rooms on the platform tonight." />
        <div className="space-y-3">
          {HOT_ROOMS.map((r, i) => {
            const state = STATES.find((s) => s.id === r.stateId)!;
            const venue = getVenue(r.venueId)!;
            const Icon = venue.icon;
            return (
              <motion.div
                key={`${r.stateId}-${r.venueId}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to="/states/$stateId/$venueId"
                  params={{ stateId: r.stateId, venueId: r.venueId }}
                  className="group relative block overflow-hidden rounded-2xl border border-white/10 hover:border-gold/40 transition-all duration-500"
                >
                  <div
                    className="absolute -inset-px opacity-40 group-hover:opacity-70 transition duration-700 blur-2xl pointer-events-none"
                    style={{ background: state.glow }}
                  />
                  <div className="relative glass-strong p-4 flex items-center gap-4">
                    <div
                      className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0 border border-white/15"
                      style={{ background: `linear-gradient(135deg, ${state.glow}, transparent)` }}
                    >
                      <Icon className="h-6 w-6 text-foreground" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/60">
                        {state.name} · {venue.name}
                      </div>
                      <div className="text-base sm:text-lg font-display leading-tight mt-0.5 truncate">
                        <Flame className="inline h-4 w-4 mr-1.5 -mt-0.5 text-gold" />
                        {r.topic}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[12px] text-foreground/80">
                        <span className="live-dot" />
                        <span className="tabular-nums font-medium">{r.live.toLocaleString()}</span>
                        <span className="text-muted-foreground">live · joining now</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gold/70 group-hover:text-gold transition shrink-0" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>


      {/* TRENDING TOPICS */}
      <section>
        <SectionHeader icon="⚡" title="Trending topics" sub="Conversations cutting across every state." />
        <div className="grid gap-2">
          {TRENDING_TOPICS.map((t, i) => (
            <motion.button
              key={t.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gold/40 border border-white/10 transition text-left"
            >
              <Zap className="h-4 w-4 text-gold shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{t.label}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="tabular-nums">{t.talking.toLocaleString()} talking</span>
                  <span className="text-foreground/30">·</span>
                  <span className="flex items-center gap-1">
                    {t.states.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-px rounded bg-white/[0.06] border border-white/10 tracking-wider"
                      >
                        {s}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-emerald-400 tabular-nums shrink-0">
                <TrendingUp className="h-3.5 w-3.5" />
                +{t.delta}%
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* LIVE HOSTS */}
      <section>
        <SectionHeader icon="🎤" title="Live hosts" sub="The voices holding the room right now." />
        <div className="grid gap-2">
          {LIVE_HOSTS.map((h, i) => (
            <motion.div
              key={h.handle}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-xl p-3 flex items-center gap-3 group hover:bg-white/[0.06] transition"
            >
              <div className="shrink-0 w-6 text-center font-display text-base text-foreground/60 tabular-nums">
                #{h.rank}
              </div>
              <div
                className="relative h-12 w-12 rounded-full flex items-center justify-center font-display text-base shrink-0 border border-white/20"
                style={{ background: `radial-gradient(circle at 30% 20%, ${h.accent}, oklch(0.18 0.02 280))` }}
              >
                {h.handle.slice(0, 2).toUpperCase()}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Mic2 className="h-3 w-3 text-gold shrink-0" />
                  <span className="text-sm font-medium truncate">{h.handle}</span>
                  {h.top && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded border border-gold/40 text-gold bg-gold/10">
                      <Crown className="h-2.5 w-2.5" /> Top Host
                    </span>
                  )}
                  {h.rank === 1 && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.18em] px-1.5 py-0.5 rounded border border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                      <Trophy className="h-2.5 w-2.5" /> Top 1%
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {h.state} · {h.room}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-medium tabular-nums">{h.listeners.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">listening</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <p className="text-center text-[11px] text-muted-foreground pt-2">
        Updated live · refreshed every minute
      </p>
    </div>
  );
}
