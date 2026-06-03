import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Users } from "lucide-react";

type PulseKind = "arrival" | "topic" | "milestone" | "action" | "achievement";

type PulseItem = {
  id: number;
  kind: PulseKind;
  icon: string;
  text: string;
  sub?: string;
};

const SEED: Omit<PulseItem, "id">[] = [
  { kind: "arrival", icon: "🔥", text: "LoneStarMaya walked in", sub: "from Austin" },
  { kind: "topic", icon: "🏈", text: "Cowboys vs Eagles exploding", sub: "+412 replies / 5 min" },
  { kind: "milestone", icon: "⚡", text: "Town Hall hit record attendance", sub: "1,842 inside" },
  { kind: "action", icon: "🎤", text: "SportsHost went live", sub: "412 listening" },
  { kind: "achievement", icon: "🏆", text: "TailgateKing earned Game Night Legend", sub: "just now" },
  { kind: "arrival", icon: "🤠", text: "14 citizens joined from Dallas", sub: "tailgate convoy" },
  { kind: "topic", icon: "🔥", text: "BBQ State War trending", sub: "Texas vs Kansas City" },
  { kind: "action", icon: "⚔️", text: "AggieAlex challenged a Longhorn", sub: "rivalry live" },
  { kind: "arrival", icon: "🏟️", text: "Section 138 just walked in", sub: "Arlington" },
  { kind: "milestone", icon: "📈", text: "Cowboys debate +800 replies", sub: "thread of the night" },
  { kind: "achievement", icon: "👑", text: "DebateCaptain crowned Hot Take Champ", sub: "5 min ago" },
  { kind: "action", icon: "🍻", text: "BrisketBoss toasted the room", sub: "82 reactions" },
  { kind: "arrival", icon: "🎯", text: "Tennessee fan entered", sub: "challenging Texas" },
  { kind: "topic", icon: "🏈", text: "SEC supremacy battle heating up", sub: "+214/hr" },
];

const KIND_LABEL: Record<PulseKind, string> = {
  arrival: "ARRIVAL",
  topic: "TRENDING",
  milestone: "MILESTONE",
  action: "ACTION",
  achievement: "BADGE",
};

const KIND_COLOR: Record<PulseKind, string> = {
  arrival: "text-foreground/60",
  topic: "text-gold",
  milestone: "text-gold",
  action: "text-foreground/70",
  achievement: "text-gold",
};

export function RoomPulse() {
  const [items, setItems] = useState<PulseItem[]>(() =>
    SEED.slice(0, 6).map((s, i) => ({ ...s, id: i })),
  );
  const [active, setActive] = useState(241);
  const [typing, setTyping] = useState(38);

  useEffect(() => {
    let counter = 1000;
    const id = setInterval(() => {
      setItems((prev) => {
        const next = SEED[Math.floor(Math.random() * SEED.length)];
        return [{ ...next, id: counter++ }, ...prev].slice(0, 7);
      });
      setActive((v) => Math.max(180, Math.min(320, v + Math.floor(Math.random() * 11) - 5)));
      setTyping(30 + Math.floor(Math.random() * 18));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="rounded-2xl glass border border-[oklch(0.70_0.24_28/0.25)] overflow-hidden">
      <div className="absolute inset-0 atm-stadium opacity-20 pointer-events-none" />
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest text-gold">Room Pulse</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-foreground/65">
            <span className="flex items-center gap-1.5">
              <span className="live-dot" /> {active} active
            </span>
            <span className="hidden sm:inline">· {typing} typing</span>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence initial={false}>
            <div className="space-y-1.5">
              {items.map((it) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5"
                >
                  <span className="text-base shrink-0">{it.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] text-foreground/95 truncate">{it.text}</div>
                    {it.sub && (
                      <div className="text-[10px] text-foreground/55 truncate">{it.sub}</div>
                    )}
                  </div>
                  <span
                    className={`text-[8.5px] uppercase tracking-[0.18em] shrink-0 ${KIND_COLOR[it.kind]}`}
                  >
                    {KIND_LABEL[it.kind]}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-foreground/55">
          <Users className="h-3 w-3" />
          <span>streaming live · room never sleeps</span>
        </div>
      </div>
    </section>
  );
}
