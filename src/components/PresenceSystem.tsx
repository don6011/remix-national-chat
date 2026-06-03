import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, Mic, Crown, Zap } from "lucide-react";

const REACTIONS = [
  { icon: "🔥", label: "cheering", base: 428 },
  { icon: "👀", label: "watching", base: 152 },
  { icon: "😂", label: "laughing", base: 84 },
  { icon: "🏈", label: "debating", base: 267 },
];

const ENERGY_EVENTS = [
  { icon: "🔥", label: "CROWD SURGE" },
  { icon: "🏈", label: "RIVALRY EXPLODING" },
  { icon: "⚡", label: "ROOM MOMENT" },
  { icon: "🍺", label: "GAME NIGHT PEAKING" },
];

const HOSTS = [
  { emoji: "🎤", name: "SportsHost", role: "Live host", status: "on air" },
  { emoji: "🍺", name: "TailgateKing", role: "Tailgate captain", status: "stirring it up" },
  { emoji: "🔥", name: "LoneStarMaya", role: "Hot take queen", status: "428 cheers" },
  { emoji: "🎙️", name: "DebateCaptain", role: "Rivalry referee", status: "moderating" },
];

const LEGENDS = [
  { trophy: "🏆", title: "Most reactions", name: "LoneStarMaya", value: "1.2k" },
  { trophy: "🏆", title: "Best hot take", name: "DallasDave", value: "892 ↑" },
  { trophy: "🏆", title: "Most active", name: "TailgateKing", value: "318 msgs" },
  { trophy: "🏆", title: "Fastest rising", name: "BrisketBoss", value: "+214/hr" },
];

export function PresenceSystem() {
  const [reactions, setReactions] = useState(REACTIONS.map((r) => r.base));
  const [event, setEvent] = useState<{ icon: string; label: string } | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setReactions((prev) => prev.map((v) => v + Math.floor(Math.random() * 4)));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const evt = ENERGY_EVENTS[Math.floor(Math.random() * ENERGY_EVENTS.length)];
      setEvent(evt);
      setTimeout(() => setEvent(null), 2600);
    }, 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="space-y-4 relative">
      <AnimatePresence>
        {event && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full glass-gold border border-gold/40 shadow-[0_0_40px_oklch(0.70_0.24_28/0.4)] flex items-center gap-2"
          >
            <span className="text-lg">{event.icon}</span>
            <span className="text-[11px] font-bold tracking-[0.25em] text-gradient-gold">
              {event.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl glass p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest text-gold">Crowd reactions</span>
          </div>
          <span className="text-[10px] text-foreground/60">live</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {REACTIONS.map((r, i) => (
            <motion.div
              key={r.label}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
              className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center"
            >
              <div className="text-lg leading-none">{r.icon}</div>
              <div className="font-display text-lg mt-1 text-gradient-gold leading-none">
                {reactions[i].toLocaleString()}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-foreground/60 mt-1">
                {r.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl glass p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="h-3.5 w-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-widest text-gold">
            Hosts & regulars on tonight
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {HOSTS.map((h) => (
            <div
              key={h.name}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="h-9 w-9 rounded-full glass-gold flex items-center justify-center text-base shrink-0">
                {h.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-foreground/95 truncate flex items-center gap-1.5">
                  {h.name}
                  <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
                </div>
                <div className="text-[10px] text-foreground/55 truncate">{h.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl glass border border-gold/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.12_60/0.25)] via-transparent to-transparent pointer-events-none" />
        <div className="relative p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest text-gold">
              Tonight's legends
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LEGENDS.map((l) => (
              <div key={l.title} className="rounded-xl bg-white/5 border border-white/5 p-2.5">
                <div className="text-[9px] uppercase tracking-wider text-foreground/55">
                  {l.trophy} {l.title}
                </div>
                <div className="text-[13px] font-medium text-foreground/95 mt-1 truncate">
                  {l.name}
                </div>
                <div className="text-[10px] text-gold/90 mt-0.5">{l.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/50">
            <Zap className="h-3 w-3" /> updated every minute
          </div>
        </div>
      </div>
    </section>
  );
}
