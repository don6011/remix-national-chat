import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Swords, Flame, Users, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { getStatePulse } from "@/lib/ai/statePulse.functions";
import { subscribeActivity } from "@/lib/activityBus";

export function StatePulsePanel({ stateId }: { stateId: string }) {
  const fetcher = useServerFn(getStatePulse);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["state-pulse", stateId],
    queryFn: () => fetcher({ data: { stateId } }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return subscribeActivity(
      () => {
        if (debounce.current) clearTimeout(debounce.current);
        debounce.current = setTimeout(() => refetch(), 600);
      },
      { stateId },
    );
  }, [stateId, refetch]);

  return (
    <section className="rounded-2xl glass border border-white/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest text-gold">State Pulse · AI Intelligence</span>
          </div>
          {data && (
            <span className="text-[10px] text-foreground/55">activity {data.activityScore}/100</span>
          )}
        </div>

        {isLoading && <div className="h-40 rounded-xl bg-white/5 animate-pulse" />}

        {data && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[13px] text-foreground/90 italic mb-3"
            >
              "{data.headline}"
            </motion.p>

            <div className="grid gap-2 sm:grid-cols-2">
              <PulseTile
                Icon={Flame}
                label="Most discussed"
                value={data.mostDiscussed}
                tone="gold"
              />
              <PulseTile
                Icon={Swords}
                label="Hottest debate"
                value={data.hottestDebate}
                tone="ember"
              />
              <PulseTile
                Icon={TrendingUp}
                label="Fastest growing"
                value={data.fastestGrowingVenue}
                tone="cyan"
              />
              <PulseTile
                Icon={Users}
                label="Most active room"
                value={data.mostActiveRoom}
                tone="violet"
              />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-foreground/60 mb-1">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Citizen activity
                </span>
                <span className="text-gold">{data.activityScore}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.activityScore}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[oklch(0.78_0.16_60)] to-[oklch(0.70_0.24_28)]"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

const TONE: Record<string, string> = {
  gold: "border-gold/40 text-gold",
  ember: "border-[oklch(0.70_0.22_28/0.5)] text-[oklch(0.85_0.18_30)]",
  cyan: "border-[oklch(0.65_0.18_200/0.5)] text-[oklch(0.82_0.14_200)]",
  violet: "border-[oklch(0.65_0.18_290/0.5)] text-[oklch(0.82_0.14_290)]",
};

function PulseTile({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: typeof Activity;
  label: string;
  value: string;
  tone: keyof typeof TONE;
}) {
  return (
    <div className={`rounded-xl bg-white/[0.04] border p-3 ${TONE[tone]}`}>
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em]">
        <Icon className="h-2.5 w-2.5" /> {label}
      </div>
      <div className="mt-1 text-[12.5px] text-foreground/95 leading-snug line-clamp-2">{value}</div>
    </div>
  );
}
