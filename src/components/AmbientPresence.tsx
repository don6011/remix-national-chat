import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Floating crowd events — appear in a corner, fade away. Not permanent cards.
const CROWD_EVENTS = [
  "🔥 Cowboys thread passed 1,000 replies",
  "🏈 Eagles fans arriving en masse",
  "👑 TailgateKing entered the room",
  "⚡ DebateCaptain started a thread",
  "🔥 BrisketBoss dropped a hot take",
  "👑 LoneStarMaya holding court",
  "🍺 18 fans entered from Dallas",
  "📈 SEC debate spiking +200/hr",
  "🎤 SportsHost went live",
  "⚔️ Longhorn vs Aggie rivalry sparked",
  "🏟️ Section 138 piled in",
  "🍻 BrisketBoss toasted the room",
  "🏆 New Hot Take Champion crowned",
  "⚡ Texas vs Oklahoma poll heating up",
];

// Reaction bursts — subtle, atmospheric pops
const BURSTS = [
  { icon: "🔥", text: "+24 reactions" },
  { icon: "🏈", text: "+18 sports takes" },
  { icon: "😂", text: "crowd laughing" },
  { icon: "👀", text: "+42 watching" },
  { icon: "🍺", text: "cheers ringing out" },
  { icon: "⚡", text: "energy spiking" },
];

type Floater = { id: number; text: string };
type Burst = { id: number; icon: string; text: string; x: number };

export function AmbientPresence() {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    let n = 1;
    const id = setInterval(() => {
      const text = CROWD_EVENTS[Math.floor(Math.random() * CROWD_EVENTS.length)];
      const item = { id: n++, text };
      setFloaters((prev) => [...prev, item].slice(-3));
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== item.id));
      }, 4800);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let n = 1;
    const id = setInterval(() => {
      const b = BURSTS[Math.floor(Math.random() * BURSTS.length)];
      const item = { id: n++, icon: b.icon, text: b.text, x: 12 + Math.random() * 70 };
      setBursts((prev) => [...prev, item].slice(-4));
      setTimeout(() => {
        setBursts((prev) => prev.filter((f) => f.id !== item.id));
      }, 2400);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Ambient motion layer — slow shimmer, never frozen */}
      <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
        <motion.div
          className="absolute -top-1/3 left-1/4 h-[60vh] w-[60vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.70 0.24 28 / 0.10) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 -right-1/4 h-[55vh] w-[55vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.82 0.14 85 / 0.08) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* slow light streaks */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-[40vw]"
            style={{
              top: `${20 + i * 28}%`,
              background:
                "linear-gradient(90deg, transparent, oklch(0.82 0.14 85 / 0.35), transparent)",
            }}
            animate={{ x: ["-50vw", "120vw"] }}
            transition={{
              duration: 14 + i * 4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3,
            }}
          />
        ))}
      </div>

      {/* Floating crowd events — bottom-right stack, above bottom nav */}
      <div className="pointer-events-none fixed bottom-20 right-3 z-30 flex flex-col gap-1.5 items-end max-w-[78vw]">
        <AnimatePresence>
          {floaters.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: 30, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-foreground/90 shadow-[0_4px_20px_oklch(0_0_0/0.4)]"
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction bursts — float up briefly, atmospheric */}
      <div className="pointer-events-none fixed inset-x-0 bottom-32 z-20 h-40">
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: [0, 1, 1, 0], y: -80, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut", times: [0, 0.15, 0.7, 1] }}
              className="absolute"
              style={{ left: `${b.x}%` }}
            >
              <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[oklch(0.22_0.20_28/0.7)] to-[oklch(0.16_0.14_60/0.6)] backdrop-blur-sm border border-gold/30 text-[10.5px] text-gold/95 flex items-center gap-1.5 shadow-[0_0_20px_oklch(0.70_0.24_28/0.35)]">
                <span className="text-sm leading-none">{b.icon}</span>
                <span className="font-medium tracking-wide">{b.text}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
