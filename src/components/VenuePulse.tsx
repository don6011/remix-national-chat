import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, Users } from "lucide-react";
import type { PulseItemSeed, VenuePersonality } from "@/lib/venuePersonality";
import { pulseStage } from "@/lib/venuePersonality";
import { subscribeActivity, type ActivityEvent } from "@/lib/activityBus";

const KIND_LABEL: Record<PulseItemSeed["kind"], string> = {
  arrival: "ARRIVAL",
  moment: "MOMENT",
  trending: "TRENDING",
  action: "ACTION",
  badge: "BADGE",
};

const KIND_COLOR: Record<PulseItemSeed["kind"], string> = {
  arrival: "text-foreground/60",
  moment: "text-gold",
  trending: "text-gold",
  action: "text-foreground/70",
  badge: "text-gold",
};

const EVENT_TO_KIND: Record<ActivityEvent["type"], PulseItemSeed["kind"]> = {
  post: "action",
  reaction: "moment",
  arrival: "arrival",
  host: "trending",
  moment: "moment",
};

type Props = {
  personality: VenuePersonality;
  glow?: string;
  initialActive?: number;
  stateId?: string;
  venueId?: string;
};

export function VenuePulse({ personality, glow, initialActive = 241, stateId, venueId }: Props) {
  const seed = personality.activity;
  const [items, setItems] = useState(() => seed.slice(0, 6).map((s, i) => ({ ...s, id: i })));
  const [active, setActive] = useState(initialActive);
  const [typing, setTyping] = useState(38);
  const [energy, setEnergy] = useState(72);
  const counterRef = useRef(1000);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const next = seed[Math.floor(Math.random() * seed.length)];
        return [{ ...next, id: counterRef.current++ }, ...prev].slice(0, 7);
      });
      setActive((v) => Math.max(60, Math.min(900, v + Math.floor(Math.random() * 13) - 5)));
      setTyping(20 + Math.floor(Math.random() * 28));
      setEnergy((v) => Math.min(99, Math.max(20, v + Math.floor(Math.random() * 9) - 4)));
    }, 2200);
    return () => clearInterval(id);
  }, [seed]);

  // Real-time: push an item instantly when matching activity arrives.
  useEffect(() => {
    return subscribeActivity(
      (ev) => {
        const kind = EVENT_TO_KIND[ev.type];
        const match =
          seed.find((s) => s.kind === kind) ?? seed[Math.floor(Math.random() * seed.length)];
        setItems((prev) => [{ ...match, id: counterRef.current++ }, ...prev].slice(0, 7));
        setActive((v) => Math.min(900, v + (ev.type === "arrival" ? 2 : 1)));
        setTyping((v) => Math.min(60, v + 2));
        setEnergy((v) => Math.min(99, v + (ev.type === "host" ? 6 : 3)));
      },
      { stateId, venueId },
    );
  }, [seed, stateId, venueId]);

  const stage = pulseStage(personality, energy);

  return (
    <section
      className="rounded-2xl glass border border-white/10 overflow-hidden relative"
      style={glow ? { boxShadow: `0 0 0 1px ${glow}30, inset 0 -60px 100px -60px ${glow}40` } : undefined}
    >
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

        {/* Pulse meter strip — venue-specific stage labels */}
        <div className="mb-3">
          <div className="flex justify-between text-[9px] uppercase tracking-wider text-foreground/55">
            {personality.pulseLabels.map((label, i) => (
              <span key={label} className={i === stage.index ? "text-gold" : ""}>
                {label}
              </span>
            ))}
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: glow
                  ? `linear-gradient(90deg, ${glow}80, ${glow})`
                  : "linear-gradient(90deg, oklch(0.78 0.16 60), oklch(0.70 0.24 28))",
              }}
              animate={{ width: `${energy}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-foreground/70">
            Room is <span className="text-gold font-medium">{stage.label}</span>
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
