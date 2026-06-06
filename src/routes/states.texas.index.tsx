import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Flame,
  Trophy,
  Vote,
  ChevronDown,
  Crown,
  Sparkles,
  Award,
  History,
  Users,
} from "lucide-react";
import { ChatFeed } from "@/components/ChatFeed";
import { DestinationCard } from "@/components/DestinationCard";
import { getState, STATES } from "@/lib/states";
import { getDestinations } from "@/lib/destinations";
import { useStateLobbyChat } from "@/hooks/use-state-lobby-chat";
import texasBanner from "@/assets/texas-lone-star-banner.png.asset.json";

export const Route = createFileRoute("/states/texas/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Texas — National Chat" },
      { name: "description", content: "Walk into Texas. Live citizens, rivalries, town hall debates, and the loudest sports bar in the state." },
    ],
  }),
  component: TexasSpace,
});

const PULSE_FEED = [
  { emoji: "🏛", text: "Town Hall housing proposal hit 1,400 votes" },
  { emoji: "🍺", text: "The Roadhouse Bar reached PACKED status" },
  { emoji: "🤠", text: "37 new citizens just arrived from Austin" },
  { emoji: "🏆", text: "Texas moved to #1 nationally tonight" },
  { emoji: "🎸", text: "Nashville stage is challenging Texas Local Stage" },
  { emoji: "🏛", text: "Town Hall: housing proposal hit 1,400 votes" },
  { emoji: "🍺", text: "BBQ war exploding at The Bar — Franklin vs Snow's" },
  { emoji: "☕", text: "Hill Country Coffee Shop trending: career pivots" },
  { emoji: "⚡", text: "LoneStarMaya pinned a hot take in Town Hall" },
  { emoji: "🗳", text: "Election countdown under 4 days — turnout climbing" },
];

// Destination data now centralized in src/lib/destinations.ts

function useCountdown(targetDays: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = Math.floor(now / 1000) + targetDays * 24 * 60 * 60 - (Math.floor(now / 1000) % 60);
  const remaining = Math.max(0, target - Math.floor(now / 1000));
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return { d, h, m, s };
}

function TexasSpace() {
  const state = getState("texas")!;
  const destinations = getDestinations("texas", state.live);
  const [citizens, setCitizens] = useState(state.live);
  const [pulseIdx, setPulseIdx] = useState(0);
  const [pulseStream, setPulseStream] = useState(PULSE_FEED.slice(0, 4));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const countdown = useCountdown(3);
  const ranking = STATES.findIndex((s) => s.id === state.id) + 1;
  const { messages, ready: chatReady, sendMessage, toggleReaction } = useStateLobbyChat("texas");

  // Live citizens count fluctuates
  useEffect(() => {
    const i = setInterval(() => {
      setCitizens((c) => c + Math.floor(Math.random() * 9) - 3);
    }, 2400);
    return () => clearInterval(i);
  }, []);

  // Pulse feed rotates
  useEffect(() => {
    const i = setInterval(() => {
      setPulseIdx((idx) => {
        const next = (idx + 1) % PULSE_FEED.length;
        setPulseStream((prev) => [PULSE_FEED[next], ...prev].slice(0, 5));
        return next;
      });
    }, 3200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative">
      {/* =================================================== */}
      {/* SECTION 1 — STATE HERO                              */}
      {/* =================================================== */}
      <section className="relative overflow-hidden min-h-[360px] sm:min-h-[440px] md:min-h-[520px] lg:min-h-[580px]">
        {/* Banner image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${texasBanner.url})` }}
        />

        {/* Tonal overlays for readability */}
        <div className={`absolute inset-0 bg-gradient-to-b ${state.gradient} opacity-40 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
        <div className="atm-texas-hero opacity-60" />
        <div className="atm-lone-star opacity-70" />
        <div className="absolute inset-0 particles opacity-50" />
        <div className="grain" />
        <div
          className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[26rem] w-[44rem] rounded-full blur-3xl opacity-30"
          style={{ background: "oklch(0.65 0.24 28)" }}
        />

        <div className="relative px-5 pt-6 pb-10 max-w-2xl mx-auto">
          <Link
            to="/states"
            className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> National Chamber
          </Link>

          <div className="mt-8">
            <div className="text-[10px] uppercase tracking-[0.45em] text-gold/90">
              The Texas Space
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[64px] leading-[0.9] mt-2 text-gradient-gold drop-shadow-[0_2px_30px_oklch(0.70_0.24_28/0.4)]"
            >
              Texas <span className="text-5xl">🤠</span>
            </motion.h1>
            <p className="text-base text-foreground/85 mt-3 italic font-display">
              Everything's louder.
            </p>
          </div>

          {/* Citizens + Ranking + Election countdown row */}
          <div className="mt-7 grid grid-cols-3 gap-2">
            <HeroStat
              icon={<span className="live-dot" />}
              label="citizens live"
              value={citizens.toLocaleString()}
            />
            <HeroStat
              icon={<Trophy className="h-3 w-3 text-gold" />}
              label="ranked tonight"
              value={`#${ranking}`}
              sub="most active"
              accent
            />
            <HeroStat
              icon={<Vote className="h-3 w-3 text-gold" />}
              label="election in"
              value={`${countdown.d}d ${String(countdown.h).padStart(2, "0")}h`}
              sub={`${String(countdown.m).padStart(2, "0")}m ${String(countdown.s).padStart(2, "0")}s`}
            />
          </div>

          {/* Governor + Trending strip */}
          <div className="mt-4 glass-gold rounded-2xl p-4 flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[oklch(0.78_0.18_60)] to-[oklch(0.55_0.20_28)] flex items-center justify-center text-lg shadow-lg">
              <Crown className="h-5 w-5 text-[oklch(0.14_0.04_260)]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-gold/80">Governor</div>
              <div className="text-sm font-medium">LoneStarMaya</div>
              <div className="text-[10px] text-foreground/60">Elected by 4,212 citizens</div>
            </div>
            <button className="text-xs text-gold border border-gold/30 rounded-full px-3 py-1.5 hover:bg-gold/10 transition">
              Salute
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip><Flame className="h-3 w-3 text-gold" /> Trending: <b className="font-medium text-foreground">Cowboys vs Eagles</b></Chip>
            <Chip><Sparkles className="h-3 w-3 text-gold" /> Slogan: <b className="font-medium text-foreground">Don't mess with Texas</b></Chip>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* SECTION 2 — TEXAS PULSE (one living module)         */}
      {/* =================================================== */}
      <section className="max-w-2xl mx-auto px-5 -mt-2">
        <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.70_0.24_28/0.25)] glass">
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.20_0.16_28/0.25)] via-transparent to-[oklch(0.18_0.10_55/0.20)] pointer-events-none" />
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-gold">Texas Pulse</span>
              </div>
              <span className="text-[10px] text-foreground/55">updates live</span>
            </div>

            {/* Featured rotating headline */}
            <div className="mt-4 h-12 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pulseIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center gap-3"
                >
                  <span className="text-2xl">{PULSE_FEED[pulseIdx].emoji}</span>
                  <span className="font-display text-xl leading-tight">
                    {PULSE_FEED[pulseIdx].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 border-t border-white/5 pt-3 space-y-1.5">
              {pulseStream.slice(1).map((item, i) => (
                <motion.div
                  key={`${item.text}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1 - i * 0.18, x: 0 }}
                  className="flex items-center gap-2 text-xs text-foreground/70"
                >
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================== */}
      {/* SECTION 3 — CHAT (the conversation is the product)  */}
      {/* =================================================== */}
      <main className="max-w-2xl mx-auto px-5 mt-5">
        <ChatFeed
          messages={messages}
          liveCount={citizens}
          pinned={`🤠 Texas pinned: Cowboys vs Eagles tonight — The Roadhouse packed`}
          placeholder="Speak up, Texas…"
          accentGlow="oklch(0.70 0.24 28 / 0.5)"
          stateId="texas"
          venueId="general"
          disabled={!chatReady}
          onSend={sendMessage}
          onReact={toggleReaction}
        />
      </main>

      {/* =================================================== */}
      {/* SECTION 4 — FEATURED DESTINATIONS                   */}
      {/* =================================================== */}
      <section className="max-w-2xl mx-auto px-5 mt-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-gold/80">Destinations</div>
            <h2 className="font-display text-2xl mt-1">Where to go in Texas</h2>
          </div>
          <div className="text-[10px] text-foreground/55 flex items-center gap-1.5">
            <Users className="h-3 w-3" /> {destinations.reduce((s, d) => s + d.inside, 0).toLocaleString()} inside
          </div>
        </div>

        <div className="space-y-3">
          {destinations.map((dest, i) => (
            <DestinationCard key={dest.id} dest={dest} stateId="texas" index={i} />
          ))}
        </div>
      </section>

      {/* =================================================== */}
      {/* OPTIONAL — Explore This Room (drawer)               */}
      {/* =================================================== */}
      <section className="max-w-2xl mx-auto px-5 mt-6">
        <button
          onClick={() => setDrawerOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-2xl glass p-4 hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium">Explore This Room</span>
            <span className="text-[10px] text-foreground/55 ml-1">badges · legends · history</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-foreground/60 transition-transform ${drawerOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {drawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                <DrawerBlock title="Texas badges" icon={<Award className="h-3.5 w-3.5 text-gold" />}>
                  <div className="flex flex-wrap gap-2">
                    {["🤠 Native Texan", "🏈 Game Night Loyal", "🏛 Civic Voice", "🍺 Roadhouse Regular", "🎸 Stage Supporter", "☕ Coffee Sage"].map((b) => (
                      <span key={b} className="text-[11px] px-2.5 py-1 rounded-full glass-gold text-gold/90">{b}</span>
                    ))}
                  </div>
                </DrawerBlock>

                <DrawerBlock title="Legends of Texas" icon={<Crown className="h-3.5 w-3.5 text-gold" />}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { name: "LoneStarMaya", role: "Governor · 4.2k votes" },
                      { name: "TailgateKing", role: "Hot Take Champion" },
                      { name: "HillCountryJoe", role: "Coffee Sage · 1.1k" },
                      { name: "AustinNeon", role: "Stage Headliner" },
                    ].map((l) => (
                      <div key={l.name} className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gold/60 to-[oklch(0.55_0.20_28)]" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium truncate">{l.name}</div>
                          <div className="text-[10px] text-foreground/60 truncate">{l.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DrawerBlock>

                <DrawerBlock title="Texas history" icon={<History className="h-3.5 w-3.5 text-gold" />}>
                  <ul className="text-xs space-y-1.5 text-foreground/80">
                    <li>· Reached #1 nationally — 3 nights in a row</li>
                    <li>· Town Hall broke 2,000 concurrent — first state to do so</li>
                    <li>· Town Hall passed 14 community proposals this season</li>
                    <li>· LoneStarMaya elected Governor on a 71% turnout</li>
                  </ul>
                </DrawerBlock>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="h-24" />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function HeroStat({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 border backdrop-blur-md ${accent ? "border-[oklch(0.70_0.24_28/0.4)] bg-[oklch(0.20_0.16_28/0.30)]" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-foreground/65">
        {icon} {label}
      </div>
      <div className={`font-display text-2xl mt-1 leading-none ${accent ? "text-gradient-gold" : ""}`}>{value}</div>
      {sub && <div className="text-[10px] text-foreground/55 mt-0.5">{sub}</div>}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 text-foreground/75">
      {children}
    </span>
  );
}


function DrawerBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl glass p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-widest text-gold">{title}</span>
      </div>
      {children}
    </div>
  );
}
