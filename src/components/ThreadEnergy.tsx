import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

type Thread = {
  id: string;
  tag: "HOT TAKE" | "GAME THREAD" | "TRENDING" | "BAR TALK" | "LEGENDARY" | "ROOM RECORD";
  tagIcon: string;
  title: string;
  replies: number;
  hourly: number;
  rank: number;
};

const SEED: Thread[] = [
  {
    id: "sec",
    tag: "HOT TAKE",
    tagIcon: "🔥",
    title: "Texas runs the SEC by year two.",
    replies: 842,
    hourly: 124,
    rank: 1,
  },
  {
    id: "dalphi",
    tag: "GAME THREAD",
    tagIcon: "🏈",
    title: "DAL vs PHI · Q2 · Cowboys clawing back",
    replies: 1204,
    hourly: 318,
    rank: 2,
  },
  {
    id: "bbq",
    tag: "LEGENDARY",
    tagIcon: "👑",
    title: "Brisket War: Franklin vs Snow's — pick one.",
    replies: 612,
    hourly: 78,
    rank: 3,
  },
  {
    id: "rivalry",
    tag: "BAR TALK",
    tagIcon: "🍺",
    title: "Longhorns vs Aggies — settle it tonight.",
    replies: 489,
    hourly: 96,
    rank: 4,
  },
];

const TAG_STYLE: Record<Thread["tag"], string> = {
  "HOT TAKE": "from-[oklch(0.65_0.28_18/0.35)] to-[oklch(0.55_0.20_30/0.25)] border-[oklch(0.70_0.24_28/0.5)] text-[oklch(0.85_0.18_30)]",
  "GAME THREAD": "from-[oklch(0.45_0.18_240/0.35)] to-[oklch(0.35_0.14_260/0.25)] border-[oklch(0.65_0.18_240/0.5)] text-[oklch(0.82_0.14_240)]",
  TRENDING: "from-[oklch(0.55_0.22_60/0.35)] to-[oklch(0.45_0.18_50/0.25)] border-[oklch(0.72_0.18_70/0.5)] text-[oklch(0.85_0.16_75)]",
  "BAR TALK": "from-[oklch(0.45_0.12_45/0.35)] to-[oklch(0.35_0.10_30/0.25)] border-[oklch(0.62_0.14_45/0.5)] text-[oklch(0.82_0.12_55)]",
  LEGENDARY: "from-[oklch(0.50_0.18_85/0.35)] to-[oklch(0.40_0.14_60/0.25)] border-gold/60 text-gold",
  "ROOM RECORD": "from-[oklch(0.50_0.18_85/0.40)] to-[oklch(0.45_0.16_30/0.30)] border-gold/70 text-gold",
};

export function ThreadEnergy() {
  const [threads, setThreads] = useState<Thread[]>(SEED.slice(0, 3));

  useEffect(() => {
    const id = setInterval(() => {
      setThreads((prev) =>
        prev.map((t) => ({
          ...t,
          replies: t.replies + Math.floor(Math.random() * 4),
          hourly: Math.max(20, t.hourly + Math.floor(Math.random() * 9) - 4),
        })),
      );
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-gold/85 mb-1">
        <Flame className="h-3 w-3" /> Threads taking over the bar
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {threads.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${TAG_STYLE[t.tag]} p-3 cursor-pointer hover:scale-[1.015] transition`}
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
              style={{ background: "radial-gradient(circle at 30% 0%, oklch(1 0 0 / 0.08), transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-[0.22em] flex items-center gap-1">
                  <span>{t.tagIcon}</span>
                  {t.tag}
                </span>
                <span className="text-[9px] text-foreground/55">#{t.rank}</span>
              </div>
              <div className="mt-2 text-[12.5px] text-foreground/95 leading-snug line-clamp-2 min-h-[2.6em]">
                "{t.title}"
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[10px]">
                <motion.span
                  key={t.replies}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  className="font-display text-base text-foreground/95"
                >
                  {t.replies.toLocaleString()}
                </motion.span>
                <span className="text-foreground/60">
                  replies · <span className="text-gold/90">+{t.hourly}/hr</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
