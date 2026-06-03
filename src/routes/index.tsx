import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
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
import { useNationalChat } from "@/hooks/use-national-chat";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
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
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl glass hover:border-gold/50 transition group">
        <span className="section-label">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-foreground/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function NationalChamber() {
  const { messages, sendMessage, toggleReaction } = useNationalChat();
  const topStates = [...STATES].sort((a, b) => b.live - a.live).slice(0, 6);

  return (
    <div className="relative min-h-screen" style={{ background: "#0D1B3E" }}>
      {/* National ticker */}
      <div className="sticky top-0 z-40 px-3 pt-2 pb-1 backdrop-blur-md border-b border-[rgba(201,168,76,0.2)]" style={{ background: "rgba(13,27,62,0.92)" }}>
        <div className="max-w-2xl mx-auto">
          <NationalTicker />
        </div>
      </div>

      {/* AMBIENT MAP HEADER — max 180px */}
      <section className="relative overflow-hidden" style={{ height: 180 }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(74, 111, 165, 0.28), transparent 72%)" }} />
        <UsaMapGlow className="opacity-65 mix-blend-screen" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 pointer-events-none">
          <div className="section-label flex items-center gap-2">
            <span className="live-dot" />
            National Chamber
          </div>
          <h1 className="font-display text-[1.6rem] sm:text-[2rem] mt-1.5 leading-none" style={{ color: "#F4F1E8" }}>
            50 States. <span style={{ color: "#C9A84C" }}>One Conversation.</span>
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-[11px]" style={{ color: "rgba(244,241,232,0.75)" }}>
            <span className="font-display tabular-nums text-[14px]" style={{ color: "#C9A84C" }}>38,402</span>
            <span className="uppercase tracking-[0.22em] text-[10px]" style={{ color: "rgba(244,241,232,0.55)" }}>Citizens Live</span>
          </div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-3 sm:px-5 pt-3 pb-40 space-y-3 relative">
        <LivePulseStrip />

        {/* PRIMARY — the national chat dominates */}
        <ChatFeed
          messages={messages}
          liveCount={38402}
          simpleHeader
          topic="What's capturing America's attention tonight?"
          placeholder="Speak up, America..."
          stateId="national"
          venueId="chamber"
          fixedInput
          onSend={sendMessage}
          onReact={toggleReaction}
        />

        {/* SUPPORTING — collapsible below */}
        <div className="space-y-2 pt-2">
          <Section label="National Intelligence">
            <NationalIntelBar
              hero={{ state: "Texas", venue: "Town Hall", delta: "+12% this hour" }}
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
              <Link to="/states" className="text-xs flex items-center gap-1" style={{ color: "#C9A84C" }}>
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
