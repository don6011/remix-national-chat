import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Send } from "lucide-react";
import { ChatFeed } from "@/components/ChatFeed";
import { UsaMapGlow } from "@/components/UsaMapGlow";
import { NationalTicker } from "@/components/NationalTicker";
import { LivePulseStrip } from "@/components/LivePulseStrip";
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

function NationalChamber() {
  const { messages, sendMessage, toggleReaction } = useNationalChat();
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) return;
    sendMessage(draft.trim());
    setDraft("");
  }

  return (
    <div className="relative min-h-screen" style={{ background: "#0D1B3E" }}>
      {/* Fixed input — rendered at root level to avoid any stacking-context traps */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="fixed left-0 right-0 z-40 px-3 flex items-center gap-2 bottom-[calc(env(safe-area-inset-bottom)+76px)]"
      >
        <div className="mx-auto max-w-2xl w-full flex items-center gap-2 glass-strong rounded-2xl p-2 shadow-[0_-8px_30px_-10px_rgba(13,27,62,0.8)]">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Speak up, America..."
            className="flex-1 bg-white/5 border border-[rgba(201,168,76,0.2)] rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 outline-none focus:border-gold/60 focus:bg-white/10 transition"
            style={{ fontFamily: "var(--font-sans)" }}
          />
          <button
            type="submit"
            aria-label="Send"
            className="h-10 w-10 rounded-xl flex items-center justify-center text-[#0D1B3E] hover:scale-105 transition shadow-[0_4px_18px_-4px_rgba(201,168,76,0.55)]"
            style={{ background: "#C9A84C" }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

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

        <ChatFeed
          messages={messages}
          liveCount={38402}
          simpleHeader
          topic="What's capturing America's attention tonight?"
          stateId="national"
          venueId="chamber"
          fixedInput
          onReact={toggleReaction}
        />
      </main>
    </div>
  );
}
