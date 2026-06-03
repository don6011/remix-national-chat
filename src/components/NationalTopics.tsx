import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Flame, MessageSquare, Sparkles } from "lucide-react";
import { getNationalTopics } from "@/lib/ai/nationalTopics.functions";

const HEAT_TONE = {
  rising: "border-[oklch(0.65_0.18_200/0.5)] text-[oklch(0.82_0.14_200)]",
  hot: "border-[oklch(0.78_0.18_60/0.5)] text-[oklch(0.86_0.16_60)]",
  boiling: "border-[oklch(0.70_0.24_28/0.55)] text-[oklch(0.88_0.18_30)]",
} as const;

const HEAT_ICON = {
  rising: Sparkles,
  hot: MessageSquare,
  boiling: Flame,
} as const;

export function NationalTopics() {
  const fetchTopics = useServerFn(getNationalTopics);
  const { data } = useQuery({
    queryKey: ["national-topics"],
    queryFn: () => fetchTopics({ data: {} }),
    refetchInterval: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const topics = data?.topics ?? [];

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
            Tonight's National Debates
          </span>
        </div>
        <span className="text-[10px] text-foreground/55">AI-curated · refreshes hourly</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
        {topics.map((t, i) => {
          const Icon = HEAT_ICON[t.heat];
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`group text-left rounded-xl bg-white/[0.04] border hover:bg-white/[0.07] transition px-3 py-2.5 ${HEAT_TONE[t.heat]}`}
            >
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] opacity-80">
                <Icon className="h-2.5 w-2.5" />
                {t.flavor}
              </div>
              <div className="mt-1 text-[14px] font-medium leading-snug text-foreground/95">
                {t.title}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
