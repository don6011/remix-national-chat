import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChatFeed } from "@/components/ChatFeed";
import { StateCard } from "@/components/StateCard";
import { UsaMapGlow } from "@/components/UsaMapGlow";
import { NationalIntelBar } from "@/components/NationalIntelBar";
import { NationalTicker } from "@/components/NationalTicker";
import { StateLeaderboard } from "@/components/StateLeaderboard";
import { NationalTopics } from "@/components/NationalTopics";
import { LivePulseStrip } from "@/components/LivePulseStrip";
import { AmericaRightNow } from "@/components/AmericaRightNow";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { STATES } from "@/lib/states";
import { buildChat, NATIONAL_PROMPTS } from "@/lib/mockChat";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "National Chamber — 50 States. One Conversation." },
      {
        name: "description",
        content:
          "The front page of America. What every state is talking about right now — live, national, and connected in real time.",
      },
    ],
  }),
  component: NationalChamber,
});

function Section({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-gold/40 transition group">
        <span className="text-[11px] uppercase tracking-[0.28em] text-gold/90">
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-foreground/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function NationalChamber() {
  const messages = buildChat(1, NATIONAL_PROMPTS);
  const topStates = [...STATES].sort((a, b) => b.live - a.live).slice(0, 6);

  return (
    <div className="relative bg-[oklch(0.13_0.05_260)] min-h-screen">
      {/* ESPN-style national ticker */}
      <div className="sticky top-0 z-40 px-3 pt-2 pb-1 bg-[oklch(0.10_0.04_260/0.92)] backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <NationalTicker />
        </div>
      </div>

      {/* TAGLINE — magazine cover hierarchy, sits directly above the map */}
      <section className="relative px-5 pt-5 pb-2 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.32em] text-[oklch(0.85_0.14_230)]">
          <span className="live-dot" />
          National Chamber
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display mt-2 leading-[0.98] tracking-tight whitespace-nowrap"
        >
          <span className="block text-[1.35rem] sm:text-[1.95rem] md:text-[2.3rem] italic font-light text-foreground/85">
            50 States.
          </span>
          <span className="block text-[1.65rem] sm:text-[2.4rem] md:text-[2.85rem] text-gradient-gold font-semibold mt-0.5">
            One Conversation.
          </span>
        </motion.h1>
        <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-foreground/75">
          <span className="live-dot" />
          <span className="font-display text-gold tabular-nums text-[15px]">38,402</span>
          <span className="uppercase tracking-[0.22em] text-foreground/55 text-[10px]">Citizens Live</span>
        </div>
      </section>

      {/* USA MAP — subtle, breathing, source of the conversation */}
      <section className="relative overflow-hidden h-[160px] md:h-[200px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.45_0.18_250/0.22),transparent_72%)]" />
        <UsaMapGlow className="opacity-65 mix-blend-screen" />
      </section>


      <main className="max-w-2xl mx-auto px-5 pt-1 pb-10 space-y-2 relative">
        {/* Live pulse strip — sits flush under the map */}
        <div className="-mt-1">
          <LivePulseStrip />
        </div>


        {/* PRIMARY — the national chat, immediately visible */}
        <ChatFeed
          messages={messages}
          liveCount={38402}
          simpleHeader
          topic="What's capturing America's attention tonight?"
          placeholder="Speak to the nation…"
          stateId="national"
          venueId="chamber"
        />


        {/* SUPPORTING — collapsible by default */}
        <div className="space-y-2 pt-2">
          <Section label="National Intelligence">
            <NationalIntelBar
              hero={{ state: "Texas", venue: "Sports Bar", delta: "+12% this hour" }}
              liveCitizens="38,402"
            />
          </Section>

          <Section label="National Debates">
            <NationalTopics />
          </Section>

          <Section label="State Leaderboard">
            <StateLeaderboard />
          </Section>

          <Section label="America Right Now">
            <AmericaRightNow />
          </Section>

          <Section label="Step into a state">
            <div className="flex items-center justify-end mb-2">
              <Link to="/states" className="text-xs text-gold/90 flex items-center gap-1">
                All 50 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-3">
              {topStates.map((s, i) => (
                <StateCard key={s.id} state={s} index={i} />
              ))}
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
