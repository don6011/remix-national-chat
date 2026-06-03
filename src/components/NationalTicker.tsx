import { useEffect, useState } from "react";
import { subscribeActivity } from "@/lib/activityBus";

type TickerItem = { icon: string; text: string };

const SEED: TickerItem[] = [
  { icon: "🍺", text: "Texas Roadhouse Bar +412" },
  { icon: "🎸", text: "Mississippi Local Stage rising" },
  { icon: "🏛", text: "Florida Town Hall exploding" },
  { icon: "🎤", text: "California Local Stage packed" },
  { icon: "☕", text: "New York Coffee Shop trending" },
  { icon: "🎤", text: "Tennessee Local Stage standing room only" },
  { icon: "🏛", text: "Georgia Town Hall surging" },
  { icon: "☕", text: "Washington Coffee Shop brewing" },
  { icon: "🍺", text: "Colorado Mountain Bar lighting up" },
  { icon: "🏛", text: "Illinois Town Hall buzzing" },
];

export function NationalTicker() {
  const [items, setItems] = useState<TickerItem[]>(SEED);

  useEffect(() => {
    return subscribeActivity(() => {
      // shuffle a fresh item to the front so the ticker visibly reacts
      setItems((prev) => {
        const idx = Math.floor(Math.random() * SEED.length);
        const next = SEED[idx];
        return [next, ...prev.filter((p) => p.text !== next.text)].slice(0, SEED.length);
      });
    });
  }, []);

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[oklch(0.10_0.04_260/0.85)] backdrop-blur-md">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[oklch(0.10_0.04_260)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[oklch(0.10_0.04_260)] to-transparent z-10" />
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-[oklch(0.70_0.24_28/0.18)] border border-[oklch(0.70_0.24_28/0.5)] px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] text-[oklch(0.88_0.18_30)] z-20">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.22_28)] animate-pulse" />
          Live
        </span>
        <div className="overflow-hidden flex-1">
          <div
            className="flex items-center gap-8 whitespace-nowrap"
            style={{
              animation: "nc-ticker 48s linear infinite",
              width: "max-content",
            }}
          >
            {loop.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[12px] text-foreground/85"
              >
                <span>{it.icon}</span>
                <span>{it.text}</span>
                <span className="text-foreground/30 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes nc-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
