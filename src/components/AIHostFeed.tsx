import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, Vote, MessageSquare, Swords, Clock, Sparkles } from "lucide-react";
import { getHostBroadcasts, type HostBroadcast } from "@/lib/ai/host.functions";

const KIND_META: Record<HostBroadcast["kind"], { label: string; Icon: typeof Mic }> = {
  announcement: { label: "Announcement", Icon: Mic },
  poll: { label: "Poll", Icon: Vote },
  prompt: { label: "Open Floor", Icon: MessageSquare },
  debate: { label: "Debate", Icon: Swords },
  reminder: { label: "Reminder", Icon: Clock },
};

export function AIHostFeed({ stateId, venueId }: { stateId: string; venueId: string }) {
  const fetcher = useServerFn(getHostBroadcasts);
  const { data, isLoading } = useQuery({
    queryKey: ["host-broadcasts", stateId, venueId],
    queryFn: () => fetcher({ data: { stateId, venueId } }),
    staleTime: 15 * 60 * 1000,
  });

  return (
    <section className="rounded-2xl glass-gold border border-gold/30 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold flex items-center gap-2">
              The Host <span className="text-[8px] px-1.5 py-0.5 rounded bg-gold/20 border border-gold/40">AI</span>
            </div>
            <div className="text-[10px] text-foreground/55">moderator · curator · room intelligence</div>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {data && (
          <div className="space-y-2">
            {data.broadcasts.map((b, i) => (
              <Broadcast key={i} b={b} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Broadcast({ b, index }: { b: HostBroadcast; index: number }) {
  const meta = KIND_META[b.kind];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl bg-white/[0.04] border border-white/10 p-3"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base">{b.icon}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gold/80 flex items-center gap-1">
          <meta.Icon className="h-2.5 w-2.5" /> {meta.label}
        </span>
      </div>
      {b.kind === "poll" ? (
        <PollWidget question={b.question} options={b.options} />
      ) : b.kind === "reminder" ? (
        <div>
          <div className="text-[13px] text-foreground/95">{b.text}</div>
          <div className="text-[10px] text-gold mt-1">⏰ {b.when}</div>
        </div>
      ) : (
        <div className="text-[13px] text-foreground/95">{b.text}</div>
      )}
    </motion.div>
  );
}

function PollWidget({ question, options }: { question: string; options: string[] }) {
  const [voted, setVoted] = useState<number | null>(null);
  // Stable pseudo-random distribution that sums to ~100
  const weights = options.map((o) => 15 + (o.length * 7) % 40);
  const total = weights.reduce((a, b) => a + b, 0);
  const pcts = weights.map((w) => Math.round((w / total) * 100));

  return (
    <div>
      <div className="text-[13px] text-foreground/95 font-medium mb-2">{question}</div>
      <div className="space-y-1.5">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setVoted(i)}
            className="w-full text-left group relative overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-gold/40 transition"
          >
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r from-gold/30 to-gold/10 transition-all ${voted === null ? "" : "opacity-100"}`}
              style={{ width: voted !== null ? `${pcts[i]}%` : "0%" }}
            />
            <div className="relative flex items-center justify-between px-3 py-1.5 text-[11.5px]">
              <span>{opt}</span>
              {voted !== null && <span className="text-gold font-medium">{pcts[i]}%</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
