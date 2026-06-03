import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Flame, Trophy, Vote, MessageCircle, Crown, Shield, Star } from "lucide-react";

export const Route = createFileRoute("/explore")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Explore — National Chamber" },
      {
        name: "description",
        content:
          "Trending debates, citizen leaderboards, and live Governor elections across America.",
      },
    ],
  }),
  component: ExplorePage,
});

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

type TrendingTopic = {
  id: string;
  topic: string;
  state: string;
  abbr: string;
  emoji: string;
  replies: number;
};

const TRENDING: TrendingTopic[] = [
  { id: "t1", topic: "Cowboys vs Eagles — who takes it tonight?", state: "Texas", abbr: "TX", emoji: "🤠", replies: 4128 },
  { id: "t2", topic: "Should the state pause new beachfront permits?", state: "Florida", abbr: "FL", emoji: "🏖", replies: 3041 },
  { id: "t3", topic: "Best Delta blues record ever cut — settle it.", state: "Mississippi", abbr: "MS", emoji: "🎷", replies: 2210 },
  { id: "t4", topic: "LA vs SF — which city actually wins 2026?", state: "California", abbr: "CA", emoji: "🎬", replies: 5840 },
  { id: "t5", topic: "Subway closures this weekend — what's the plan?", state: "New York", abbr: "NY", emoji: "💼", replies: 1872 },
];

type CitizenRank = "Citizen" | "Verified" | "Resident" | "Ambassador" | "Governor";

type LeaderRow = {
  rank: number;
  user: string;
  state: string;
  abbr: string;
  emoji: string;
  citizenRank: CitizenRank;
  influence: number;
};

const LEADERS: LeaderRow[] = [
  { rank: 1, user: "LoneStarMaya",   state: "Texas",       abbr: "TX", emoji: "🤠", citizenRank: "Governor",   influence: 18420 },
  { rank: 2, user: "DebateCaptain",  state: "California",  abbr: "CA", emoji: "🎬", citizenRank: "Ambassador", influence: 14280 },
  { rank: 3, user: "BluesBoss",      state: "Mississippi", abbr: "MS", emoji: "🎷", citizenRank: "Ambassador", influence: 9460 },
  { rank: 4, user: "PanhandlePete",  state: "Florida",     abbr: "FL", emoji: "🏖", citizenRank: "Resident",   influence: 6840 },
  { rank: 5, user: "SkylineSam",     state: "New York",    abbr: "NY", emoji: "💼", citizenRank: "Resident",   influence: 5210 },
  { rank: 6, user: "NashvilleNeon",  state: "Tennessee",   abbr: "TN", emoji: "🎸", citizenRank: "Resident",   influence: 4720 },
  { rank: 7, user: "HillCountryJoe", state: "Texas",       abbr: "TX", emoji: "🤠", citizenRank: "Verified",   influence: 4115 },
  { rank: 8, user: "EchoParkAri",    state: "California",  abbr: "CA", emoji: "🎬", citizenRank: "Verified",   influence: 3680 },
  { rank: 9, user: "TailgateKing",   state: "Texas",       abbr: "TX", emoji: "🤠", citizenRank: "Verified",   influence: 3204 },
  { rank: 10, user: "MagnoliaMae",   state: "Mississippi", abbr: "MS", emoji: "🎷", citizenRank: "Citizen",    influence: 2890 },
];

type Election = {
  id: string;
  state: string;
  emoji: string;
  candidates: { user: string; votes: number }[];
  remainingHours: number;
};

const ELECTIONS: Election[] = [
  {
    id: "e1",
    state: "Texas",
    emoji: "🤠",
    candidates: [
      { user: "LoneStarMaya", votes: 4212 },
      { user: "TailgateKing", votes: 3198 },
    ],
    remainingHours: 86,
  },
  {
    id: "e2",
    state: "Mississippi",
    emoji: "🎷",
    candidates: [
      { user: "BluesBoss", votes: 1120 },
      { user: "MagnoliaMae", votes: 982 },
    ],
    remainingHours: 42,
  },
];

const RANK_STYLE: Record<CitizenRank, string> = {
  Citizen:    "text-foreground/70 border-white/15 bg-white/5",
  Verified:   "text-sky-300 border-sky-300/30 bg-sky-300/5",
  Resident:   "text-emerald-300 border-emerald-300/30 bg-emerald-300/5",
  Ambassador: "text-gold border-gold/40 bg-gold/10",
  Governor:   "text-amber-200 border-amber-300/50 bg-amber-300/10",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
}

function timeLeft(h: number): string {
  const d = Math.floor(h / 24);
  const hr = h % 24;
  if (d > 0) return `${d}d ${hr}h left`;
  return `${hr}h left`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function ExplorePage() {
  return (
    <div className="max-w-2xl mx-auto px-5 pt-8 pb-24 space-y-10">
      <header>
        <div className="section-label">Explore</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-1.5">
          The country, right now.
        </h1>
      </header>

      <TrendingNow />
      <Leaderboards />
      <ElectionWatch />
    </div>
  );
}

/* ---------- Trending Now ---------- */

function TrendingNow() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-gold" strokeWidth={2} />
        <h2 className="section-label">Trending Now</h2>
      </div>
      <div className="space-y-2">
        {TRENDING.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-4 flex items-start gap-3"
          >
            <div className="font-display text-2xl text-gold/70 tabular-nums w-6 shrink-0 leading-none pt-0.5">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base leading-snug">{t.topic}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 glass-gold rounded-full px-2 py-0.5 text-gold border border-gold/30">
                  <span>{t.emoji}</span> {t.state}
                </span>
                <span className="inline-flex items-center gap-1 text-foreground/70">
                  <MessageCircle className="h-3 w-3" /> {fmt(t.replies)} replies
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------- State Leaderboards ---------- */

function Leaderboards() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-gold" strokeWidth={2} />
        <h2 className="section-label">State Leaderboards</h2>
      </div>
      <div className="glass-strong rounded-2xl overflow-hidden">
        {LEADERS.map((l) => {
          const rankColor =
            l.rank === 1 ? "text-amber-300" :
            l.rank === 2 ? "text-slate-200" :
            l.rank === 3 ? "text-orange-300" :
            "text-foreground/55";
          const RankIcon = l.rank === 1 ? Crown : l.rank <= 3 ? Star : Shield;
          return (
            <div
              key={l.user}
              className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(201,168,76,0.12)] last:border-b-0"
            >
              <div className="flex items-center gap-1 w-9 shrink-0">
                <RankIcon className={`h-3.5 w-3.5 ${rankColor}`} />
                <span className={`font-display text-base tabular-nums ${rankColor}`}>
                  {l.rank}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">@{l.user}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded-full px-1.5 py-0.5 border bg-white/5 border-white/15">
                    <span>{l.emoji}</span> {l.abbr}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider rounded-full px-1.5 py-0.5 border ${RANK_STYLE[l.citizenRank]}`}>
                    {l.citizenRank}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-base text-gold tabular-nums leading-none">
                  {fmt(l.influence)}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-foreground/50 mt-1">
                  Influence
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Election Watch ---------- */

function ElectionWatch() {
  const active = ELECTIONS;
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Vote className="h-4 w-4 text-gold" strokeWidth={2} />
        <h2 className="section-label">Election Watch</h2>
      </div>

      {active.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-sm text-foreground/70">
            No active elections — next cycle begins soon.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((e) => {
            const total = e.candidates.reduce((s, c) => s + c.votes, 0) || 1;
            return (
              <div key={e.id} className="glass-strong rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{e.emoji}</span>
                    <div>
                      <div className="section-label">Governor Election</div>
                      <div className="font-display text-lg leading-tight">{e.state}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-foreground/65 flex items-center gap-1">
                    <span className="live-dot" /> {timeLeft(e.remainingHours)}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {e.candidates.map((c) => {
                    const pct = Math.round((c.votes / total) * 100);
                    return (
                      <div key={c.user}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-foreground/90">@{c.user}</span>
                          <span className="text-foreground/70 tabular-nums">
                            {fmt(c.votes)} votes · {pct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-[rgba(201,168,76,0.15)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#C9A84C] to-[#B8964A]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/states/$stateId"
                  params={{ stateId: e.state.toLowerCase().replace(/ /g, "-") }}
                  className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-gold hover:text-gold/80 transition"
                >
                  Enter {e.state} →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
