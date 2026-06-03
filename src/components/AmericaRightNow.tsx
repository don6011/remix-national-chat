import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { subscribeActivity } from "@/lib/activityBus";

type FeedItem = {
  id: number;
  state: string;
  venue: string;
  verb: string;
  heat: "rising" | "hot" | "boiling";
};

const SEED: Omit<FeedItem, "id">[] = [
  { state: "Texas", venue: "Town Hall", verb: "exploding", heat: "boiling" },
  { state: "Mississippi", venue: "Local Stage", verb: "rising", heat: "rising" },
  { state: "California", venue: "Local Stage", verb: "trending", heat: "hot" },
  { state: "Florida", venue: "The Bar", verb: "heating up", heat: "hot" },
  { state: "Tennessee", venue: "Local Stage", verb: "packed", heat: "hot" },
  { state: "New York", venue: "Town Hall", verb: "debating", heat: "rising" },
  { state: "Georgia", venue: "Local Stage", verb: "vibing", heat: "hot" },
  { state: "Illinois", venue: "Coffee Shop", verb: "buzzing", heat: "rising" },
  { state: "Colorado", venue: "The Bar", verb: "lighting up", heat: "rising" },
  { state: "Washington", venue: "Coffee Shop", verb: "brewing", heat: "rising" },
];

const HEAT_DOT: Record<FeedItem["heat"], string> = {
  rising: "bg-[oklch(0.78_0.16_230)]",
  hot: "bg-[oklch(0.78_0.18_60)]",
  boiling: "bg-[oklch(0.70_0.24_28)]",
};

const HEAT_LABEL: Record<FeedItem["heat"], string> = {
  rising: "RISING",
  hot: "HOT",
  boiling: "EXPLODING",
};

export function AmericaRightNow() {
  const [items, setItems] = useState<FeedItem[]>(() =>
    SEED.slice(0, 5).map((s, i) => ({ ...s, id: i }))
  );

  useEffect(() => {
    let counter = 100;
    const id = setInterval(() => {
      setItems((prev) => {
        const next = SEED[Math.floor(Math.random() * SEED.length)];
        return [{ ...next, id: counter++ }, ...prev].slice(0, 6);
      });
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let counter = 5000;
    return subscribeActivity((ev) => {
      const next = SEED[Math.floor(Math.random() * SEED.length)];
      const heat: FeedItem["heat"] = ev.type === "host" ? "boiling" : "hot";
      setItems((prev) =>
        [{ ...next, heat, id: counter++ }, ...prev].slice(0, 6)
      );
    });
  }, []);

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
            America Right Now
          </span>
        </div>
        <span className="text-[10px] text-foreground/55">live national feed</span>
      </div>
      <ul className="p-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2"
            >
              <span className={`relative h-2 w-2 rounded-full ${HEAT_DOT[it.heat]}`}>
                <span
                  className={`absolute inset-0 rounded-full ${HEAT_DOT[it.heat]} opacity-60 animate-ping`}
                />
              </span>
              <span className="text-[10px] tracking-[0.2em] font-bold text-foreground/60 w-[78px] shrink-0">
                {HEAT_LABEL[it.heat]}
              </span>
              <span className="text-[13px] text-foreground/95 leading-tight">
                <span className="font-semibold">{it.state}</span>{" "}
                <span className="text-foreground/70">{it.venue}</span>{" "}
                <span className="text-gold/90 italic">{it.verb}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
