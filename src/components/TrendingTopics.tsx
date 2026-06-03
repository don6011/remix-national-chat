import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Flame, Sparkles, RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { getTrendingTopics } from "@/lib/ai/trending.functions";
import { subscribeActivity } from "@/lib/activityBus";

const CATEGORY_STYLE: Record<string, string> = {
  news: "from-[oklch(0.45_0.18_240/0.35)] to-[oklch(0.35_0.14_260/0.25)] border-[oklch(0.65_0.18_240/0.5)] text-[oklch(0.82_0.14_240)]",
  sports: "from-[oklch(0.55_0.22_30/0.35)] to-[oklch(0.45_0.18_20/0.25)] border-[oklch(0.70_0.22_30/0.5)] text-[oklch(0.85_0.18_30)]",
  entertainment: "from-[oklch(0.50_0.20_320/0.35)] to-[oklch(0.40_0.16_300/0.25)] border-[oklch(0.70_0.18_320/0.5)] text-[oklch(0.85_0.16_320)]",
  business: "from-[oklch(0.45_0.12_180/0.35)] to-[oklch(0.35_0.10_200/0.25)] border-[oklch(0.65_0.14_180/0.5)] text-[oklch(0.82_0.14_180)]",
  local: "from-[oklch(0.50_0.18_85/0.35)] to-[oklch(0.40_0.14_60/0.25)] border-gold/60 text-gold",
  culture: "from-[oklch(0.45_0.14_290/0.35)] to-[oklch(0.35_0.10_280/0.25)] border-[oklch(0.65_0.16_290/0.5)] text-[oklch(0.82_0.14_290)]",
};

const HEAT_ICON = { rising: "📈", hot: "🔥", boiling: "💥" } as const;

export function TrendingTopics({ stateId, venueId }: { stateId: string; venueId: string }) {
  const fetcher = useServerFn(getTrendingTopics);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["trending-topics", stateId, venueId],
    queryFn: () => fetcher({ data: { stateId, venueId } }),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // Instant refresh when activity arrives (debounced).
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return subscribeActivity(
      () => {
        if (debounce.current) clearTimeout(debounce.current);
        debounce.current = setTimeout(() => refetch(), 800);
      },
      { stateId, venueId },
    );
  }, [stateId, venueId, refetch]);

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest text-gold">AI Trending · refreshed hourly</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-[10px] text-foreground/55 hover:text-foreground flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} /> refresh
          </button>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {data && (
          <div className="grid gap-2 sm:grid-cols-2">
            {data.topics.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${CATEGORY_STYLE[t.category] ?? CATEGORY_STYLE.local} p-3 cursor-pointer hover:scale-[1.01] transition`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.22em] uppercase flex items-center gap-1">
                    {HEAT_ICON[t.heat]} {t.category}
                  </span>
                  <Flame className="h-3 w-3 opacity-60" />
                </div>
                <div className="mt-1.5 text-[13px] text-foreground/95 leading-snug font-medium">{t.title}</div>
                <div className="mt-1 text-[10.5px] text-foreground/60 italic line-clamp-2">"{t.prompt}"</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
