import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Users,
  Flame,
  Trophy,
  Tv,
  Beer,
  Megaphone,
  TrendingUp,
  Award,
  type LucideIcon,
} from "lucide-react";
import { RoomPulse } from "@/components/RoomPulse";
import { ChatFeed } from "@/components/ChatFeed";
import { RoomEntrance } from "@/components/RoomEntrance";
import { PresenceSystem } from "@/components/PresenceSystem";
import { AmbientPresence } from "@/components/AmbientPresence";
import { InsideTheRoom } from "@/components/InsideTheRoom";
import { ThreadEnergy } from "@/components/ThreadEnergy";
import { MascotRail } from "@/components/MascotRail";
import { Rivalry } from "@/components/Rivalry";
import { buildChat } from "@/lib/mockChat";
import bigTexBanner from "@/assets/big-tex-sports-bar.png.asset.json";

const SPORTS_PROMPTS = [
  "COWBOYS BETTER WAKE UP. Second quarter and we're sleepwalking.",
  "Hot take: Texas runs the SEC by year two. Receipts coming.",
  "Refs are auditioning for an Eagles tryout right now.",
  "Whoever just ordered the brisket basket — bless you.",
  "Mavs > Spurs all day. San Antonio, sit down.",
  "Astros need a CF in the offseason. Discuss.",
  "Anyone here actually IN Arlington tonight?? Section pic 👀",
  "DAK with the dime!!! TD TD TD",
  "I'll take Texas -7 and the over. Lock of the night.",
  "BBQ war: Franklin or Snow's? You can only pick one.",
  "Longhorns defense is built different this year.",
  "Eagles fans in the chat — be honest, are you nervous?",
  "Tailgate started at 11am and I'm still standing 🍺",
  "Refs swallowed that whistle and I'm BIG MAD",
  "Aggies fans where you at? Don't go quiet on me now.",
];

const ENERGY_LEVELS = ["Quiet", "Warming Up", "Buzzing", "Packed", "Exploding"] as const;

export function BigTexSportsBarRoom() {
  const messages = buildChat(9911, SPORTS_PROMPTS);
  const [crowd, setCrowd] = useState(1842);
  const [energy, setEnergy] = useState(94);

  useEffect(() => {
    const ticker = setInterval(() => {
      setCrowd((current) => current + Math.floor(Math.random() * 7) - 2);
      setEnergy((current) => Math.min(99, Math.max(80, current + Math.floor(Math.random() * 5) - 2)));
    }, 2200);

    return () => clearInterval(ticker);
  }, []);

  const energyLabel =
    energy >= 92 ? "Exploding" : energy >= 84 ? "Packed" : energy >= 70 ? "Buzzing" : "Warming Up";

  return (
    <motion.div
      key="big-tex-sports-bar"
      className="relative"
      initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
    >
      <RoomEntrance glow="oklch(0.70 0.24 28)" label="Big Tex Sports Bar" />
      <AmbientPresence />

      <section className="relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bigTexBanner.url})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-[oklch(0.07_0.05_12)]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.07_0.05_12)] via-transparent to-transparent" />
        <div className="atm-stadium opacity-60" />
        <div className="atm-sportsbar-field opacity-70" />
        <div className="atm-streaks opacity-60" />
        <div className="grain" />

        <div className="absolute top-0 left-0 right-0 bg-black/60 border-b border-white/10 overflow-hidden z-10">
          <div className="ticker-track flex gap-8 whitespace-nowrap py-1.5 text-[11px] font-mono tracking-wider">
            {Array.from({ length: 2 }).map((_, index) => (
              <span key={index} className="flex gap-8">
                <span className="text-live">● LIVE</span>
                <span>NFL · DAL <b className="text-gold">17</b> — PHI <b className="text-white">14</b> · Q2 4:21</span>
                <span>NCAAF · TEX <b className="text-gold">28</b> — OU <b className="text-white">21</b> · Q3</span>
                <span>NBA · DAL <b>—</b> LAL · 9:30 ET</span>
                <span>MLB · HOU <b>4</b> — NYY <b>2</b> · F</span>
                <span>NCAAF · A&amp;M <b>17</b> — LSU <b>20</b> · Q4 2:11</span>
                <span className="text-gold">⚡ TRENDING: Cowboys vs Eagles</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative px-5 pt-12 pb-8 max-w-2xl mx-auto">
          <Link
            to="/states/$stateId"
            params={{ stateId: "texas" }}
            className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Texas
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-foreground/70">
              <Trophy className="h-3 w-3 text-gold" /> Texas · Flagship Venue
            </div>
            <h1 className="font-display text-[44px] leading-[0.95] mt-3 text-gradient-gold drop-shadow-[0_2px_24px_oklch(0.70_0.24_28/0.35)]">
              Big Tex Sports Bar
            </h1>
            <p className="text-sm text-foreground/80 mt-3 italic">
              Rivalries. Live games. Hot takes.
            </p>
          </motion.div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <VitalCard icon={Users} label="Citizens inside" value={crowd.toLocaleString()} sub="& climbing" />
            <VitalCard icon={Flame} label="Crowd energy" value={`${energy}`} sub={energyLabel} accent />
            <VitalCard icon={Tv} label="Featured" value="DAL vs PHI" sub="Q2 · 4:21" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 relative overflow-hidden rounded-2xl border border-[oklch(0.70_0.24_28/0.35)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.22_0.20_28/0.6)] via-[oklch(0.16_0.14_20/0.5)] to-[oklch(0.10_0.06_260/0.5)]" />
            <div className="absolute inset-0 atm-stadium opacity-50" />
            <div className="relative p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                <span className="text-gold flex items-center gap-1.5">
                  <span className="live-dot" /> Featured Tonight
                </span>
                <span className="text-foreground/60">NFL · Sunday Night</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Team name="Cowboys" abbr="DAL" score={17} accent="oklch(0.78 0.16 240)" />
                <div className="font-display text-2xl text-foreground/50 px-2">vs</div>
                <Team name="Eagles" abbr="PHI" score={14} accent="oklch(0.65 0.18 145)" align="right" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>🔥 1,204 watching together</Pill>
                <Pill>💬 38 typing</Pill>
                <Pill>🍺 Pull a stool</Pill>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* DESTINATION layer — mascots, rivalry, thread energy. Atmospheric, not dashboard. */}
      <div className="max-w-6xl mx-auto px-5 mt-5 space-y-3">
        <div className="grid gap-3 lg:grid-cols-[1fr_1.1fr]">
          <MascotRail />
          <Rivalry />
        </div>
        <ThreadEnergy />
      </div>

      {/* PRIMARY: Chat feed (with Room Pulse as side column on desktop) */}
      <div className="max-w-6xl mx-auto px-5 mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="min-w-0">
          <ChatFeed
            messages={messages}
            liveCount={crowd}
            pinned="🏈 Cowboys vs Eagles · Q2 · Pull up, get loud."
            placeholder="Shout your take at the bar…"
            accentGlow="oklch(0.65 0.26 22 / 0.55)"
          />
          <p className="mt-3 text-center text-[11px] text-foreground/50">
            <Beer className="inline h-3 w-3 mr-1 text-gold" />
            38 citizens typing · reactions flying · keep it loud, keep it civil
          </p>

          {/* Mobile: Room Pulse inline directly under chat */}
          <div className="mt-5 lg:hidden">
            <RoomPulse />
          </div>
        </main>

        {/* Desktop: Room Pulse sticky side column */}
        <aside className="hidden lg:block">
          <div className="sticky top-5">
            <RoomPulse />
          </div>
        </aside>
      </div>

      {/* SUPPORTING — collapsed by default. Conversation stays primary. */}
      <section className="max-w-2xl mx-auto px-5 mt-6">
        <InsideTheRoom>
          <div className="relative overflow-hidden rounded-2xl glass border border-[oklch(0.70_0.24_28/0.25)]">
            <div className="absolute inset-0 atm-sportsbar-field opacity-40 pointer-events-none" />
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] uppercase tracking-widest text-gold">Sports Bar Pulse Meter</span>
                </div>
                <span className="text-[10px] text-foreground/60">updates live</span>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-foreground/60">
                  <span>Quiet</span><span>Warming</span><span>Buzzing</span><span>Packed</span><span className="text-gold">Exploding</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, oklch(0.78 0.16 60), oklch(0.70 0.24 28), oklch(0.65 0.28 18))" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${energy}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] text-foreground/70">
                  Room is <span className="text-gold font-medium">{energyLabel}</span> · {ENERGY_LEVELS.indexOf(energyLabel as (typeof ENERGY_LEVELS)[number]) >= 3 ? "packed shoulder-to-shoulder" : "filling up fast"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-3.5 w-3.5 text-gold" />
              <span className="text-[10px] uppercase tracking-widest text-gold">Room badges</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Sports Bar Regular", emoji: "🍺" },
                { label: "Hot Take Champion", emoji: "🔥" },
                { label: "Rivalry Starter", emoji: "⚔️" },
                { label: "Game Night Legend", emoji: "🏆" },
                { label: "Tailgate MVP", emoji: "🚙" },
              ].map((badge) => (
                <span key={badge.label} className="text-[11px] px-2.5 py-1 rounded-full glass-gold text-gold/90">
                  {badge.emoji} {badge.label}
                </span>
              ))}
            </div>
          </div>

          <PresenceSystem />
        </InsideTheRoom>
      </section>

      <div className="h-24" />

    </motion.div>
  );
}

function VitalCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 border ${accent ? "border-[oklch(0.70_0.24_28/0.4)] bg-[oklch(0.20_0.16_28/0.35)]" : "border-white/10 bg-white/5"} backdrop-blur-md`}>
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-foreground/60">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`font-display text-2xl mt-1 leading-none ${accent ? "text-gradient-gold" : ""}`}>{value}</div>
      <div className="text-[10px] text-foreground/60 mt-0.5">{sub}</div>
    </div>
  );
}

function Team({
  name,
  abbr,
  score,
  accent,
  align = "left",
}: {
  name: string;
  abbr: string;
  score: number;
  accent: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex-1 ${align === "right" ? "text-right" : ""}`}>
      <div className="flex items-center gap-2" style={align === "right" ? { justifyContent: "flex-end" } : undefined}>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[11px] font-bold" style={{ background: accent, color: "white" }}>
          {abbr}
        </div>
        <div className="font-display text-lg">{name}</div>
      </div>
      <div className="font-display text-4xl mt-1 text-gradient-gold">{score}</div>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
      {children}
    </span>
  );
}

function PulseRow({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5">
      <span>{emoji}</span>
      <span className="text-foreground/85 truncate">{label}</span>
    </div>
  );
}
