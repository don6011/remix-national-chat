import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ChatFeed } from "@/components/ChatFeed";
import { DestinationCard } from "@/components/DestinationCard";
import { StatePulsePanel } from "@/components/StatePulsePanel";
import { Button } from "@/components/ui/button";
import { getState, STATES } from "@/lib/states";
import { getDestinations } from "@/lib/destinations";
import { buildChat } from "@/lib/mockChat";
import { ArrowLeft, Trophy, Flame, Users } from "lucide-react";
import floridaBanner from "@/assets/florida-welcome-banner.png.asset.json";
import mississippiBanner from "@/assets/mississippi-welcome-banner.png.asset.json";
import tennesseeBanner from "@/assets/tennessee-welcome-banner.png.asset.json";
import californiaBanner from "@/assets/california-welcome-banner.png.asset.json";
import newYorkBanner from "@/assets/new-york-welcome-banner.png.asset.json";

const STATE_BANNERS: Record<string, string> = {
  florida: floridaBanner.url,
  mississippi: mississippiBanner.url,
  tennessee: tennesseeBanner.url,
  california: californiaBanner.url,
  "new-york": newYorkBanner.url,
};

export const Route = createFileRoute("/states/$stateId/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  loader: ({ params }) => {
    const state = getState(params.stateId);
    if (!state) throw notFound();
    return { state };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.state.name ?? "State"} Space — National Chat` },
      { name: "description", content: `Live ${loaderData?.state.name ?? ""} chat and themed venues. ${loaderData?.state.atmosphere ?? ""}` },
    ],
  }),
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto px-5 pt-16 text-center">
      <h1 className="font-display text-2xl">That state isn't live yet.</h1>
      <Link to="/states" className="text-gold mt-3 inline-block">Back to states →</Link>
    </div>
  ),
  component: StateSpace,
});

function StateSpace() {
  const { state } = Route.useLoaderData();
  const messages = buildChat(state.live, [
    `${state.name} in the building. Who's repping tonight?`,
    state.trendingTopic + " — thoughts?",
    `Just walked into the ${state.name} space. Vibe is unreal.`,
    `Y'all see the ranking? ${state.name} climbing.`,
    `Local question: best diner in ${state.name}?`,
  ]);

  const ranking = STATES.findIndex((s) => s.id === state.id) + 1;

  const isTexas = state.id === "texas";
  const isMississippi = state.id === "mississippi";

  const banner = STATE_BANNERS[state.id];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Cinematic curtain lift on entry */}
      <motion.div
        className="fixed inset-0 z-[90] pointer-events-none bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.div
        className="fixed inset-0 z-[91] pointer-events-none"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ background: `radial-gradient(circle at 50% 35%, ${state.glow} 0%, transparent 60%)` }}
      />
      {/* IMMERSIVE HERO */}
      <section
        className={`relative overflow-hidden ${
          banner
            ? "min-h-[360px] sm:min-h-[440px] md:min-h-[520px] lg:min-h-[580px]"
            : "min-h-[260px] sm:min-h-[320px] md:min-h-[360px]"
        }`}
      >
        {banner && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{ backgroundImage: `url(${banner})` }}
          />
        )}

        <div className={`absolute inset-0 bg-gradient-to-b ${state.gradient} ${banner ? "opacity-40 mix-blend-multiply" : ""}`} />
        {banner && !isMississippi && <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />}
        {isTexas && <div className="atm-texas-hero" />}
        {isTexas && <div className="atm-lone-star" />}
        {isMississippi && (
          <>
            <div className="atm-mississippi-hero" />
            <div className="atm-magnolia-bokeh" />
            <div className="atm-river-haze" />
            <div className="atm-fireflies" />
            <div className="atm-cinema-vignette" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
          </>
        )}
        <div className="absolute inset-0 particles" />
        <div className="grain" />

        <div
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-60"
          style={{ background: state.glow }}
        />
        {isTexas && (
          <div
            className="absolute -bottom-32 left-1/2 -translate-x-1/2 h-80 w-[40rem] rounded-full blur-3xl opacity-40"
            style={{ background: "oklch(0.70 0.20 55)" }}
          />
        )}
        {isMississippi && (
          <div
            className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-96 w-[44rem] rounded-full blur-3xl opacity-25"
            style={{ background: "oklch(0.80 0.16 75)" }}
          />
        )}

        <div className="relative px-5 pt-6 pb-8 max-w-2xl mx-auto">
          <Link
            to="/states"
            className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> States
          </Link>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <div className={`text-[11px] uppercase tracking-[0.3em] ${isMississippi ? "text-foreground/85" : "text-foreground/60"}`}>
                The {state.name} Space
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-[2.4rem] leading-none mt-2"
              >
                {state.name} <span className="text-2xl">{state.emoji}</span>
              </motion.h1>
              <p className={`text-sm mt-2 max-w-sm ${isMississippi ? "text-foreground" : "text-foreground/75"}`}>{state.tagline} {state.atmosphere}.</p>
            </div>
            <div className="glass rounded-2xl p-3 text-right shrink-0">
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="live-dot" />
                <span className="font-medium">{state.live.toLocaleString()}</span>
              </div>
              <div className={`text-[10px] uppercase tracking-wider mt-0.5 ${isMississippi ? "text-foreground/85" : "text-foreground/60"}`}>
                citizens live
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-gold" />
              <span className={`${isMississippi ? "text-foreground/90" : "text-foreground/70"}`}>Trending</span>
              <span>{state.trendingTopic}</span>
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-gold" />
              <span className={`${isMississippi ? "text-foreground/90" : "text-foreground/70"}`}>Rank</span>
              <span>#{ranking} tonight</span>
            </div>
          </div>

          {/* Featured event */}
          <div className="mt-5 glass-gold rounded-2xl p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center text-lg">
              🎟️
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-gold">Featured live</div>
              <div className="text-sm font-medium truncate">{state.trendingTopic}</div>
            </div>
            {isMississippi ? (
              <Button size="sm" className="rounded-full px-4 text-xs bg-gold text-navy-deep hover:bg-gold/90">
                Join
              </Button>
            ) : (
              <button className="text-xs text-gold border border-gold/30 rounded-full px-3 py-1.5 hover:bg-gold/10">
                Join
              </button>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-5 space-y-6">
        {/* AI State Pulse — intelligence layer */}
        <StatePulsePanel stateId={state.id} />

        {/* State chat = priority */}
        <ChatFeed
          messages={messages}
          liveCount={state.live}
          pinned={`${state.name} pinned: ${state.trendingTopic}`}
          placeholder={`Speak up, ${state.name}…`}
          accentGlow={state.glow}
        />



        {/* Destinations */}
        <section>
          {(() => {
            const destinations = getDestinations(state.id, state.live);
            return (
              <>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.35em] text-gold/80">Destinations</div>
                    <h2 className="font-display text-2xl mt-1">Where to go in {state.name}</h2>
                  </div>
                  <div className="text-[10px] text-foreground/55 flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> {destinations.reduce((s, d) => s + d.inside, 0).toLocaleString()} inside
                  </div>
                </div>
                <div className="space-y-3">
                  {destinations.map((dest, i) => (
                    <DestinationCard key={dest.id} dest={dest} stateId={state.id} index={i} />
                  ))}
                </div>
              </>
            );
          })()}
        </section>
      </main>
    </motion.div>
  );
}
