import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChatFeed } from "@/components/ChatFeed";
import { RoomEntrance } from "@/components/RoomEntrance";
import { VenuePulse } from "@/components/VenuePulse";
import { VenueIntel } from "@/components/VenueIntel";
import { InsideTheRoom } from "@/components/InsideTheRoom";
import { TrendingTopics } from "@/components/TrendingTopics";
import { AIHostFeed } from "@/components/AIHostFeed";
import { Button } from "@/components/ui/button";
import { getState } from "@/lib/states";
import { getVenue } from "@/lib/venues";
import { getVenuePersonality } from "@/lib/venuePersonality";
import { buildChat, VENUE_PROMPTS, TEXAS_VENUE_PROMPTS } from "@/lib/mockChat";
import { ArrowLeft, Users, Activity, DoorOpen } from "lucide-react";
import bigTexBanner from "@/assets/big-tex-sports-bar.png.asset.json";
import mississippiBluesBar from "@/assets/mississippi-blues-bar.png.asset.json";
import mississippiSportsBar from "@/assets/mississippi-sports-bar.png.asset.json";

const VENUE_BANNERS: Record<string, Record<string, string>> = {
  texas: { bar: bigTexBanner.url, "sports-bar": bigTexBanner.url },
  mississippi: { bar: mississippiBluesBar.url, "sports-bar": mississippiSportsBar.url },
};

function VenueNotFound() {
  const { stateId } = Route.useParams();
  const state = getState(stateId);
  const isMississippi = stateId === "mississippi";

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-strong rounded-3xl p-8 text-center"
      >
        <div className="mx-auto h-14 w-14 rounded-2xl glass-gold flex items-center justify-center mb-5">
          <DoorOpen className="h-6 w-6 text-gold" strokeWidth={1.75} />
        </div>
        <h1 className="font-display text-2xl">
          {isMississippi ? "Mississippi Blues is closed right now" : "This room isn't open"}
        </h1>
        <p className="text-sm text-foreground/60 mt-2">
          {isMississippi
            ? "The Blues Lounge isn't live at the moment. Head back to the Mississippi Space."
            : "The venue you’re looking for doesn’t exist or isn’t live yet."}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {state && (
            <Button asChild className="rounded-full px-6 text-sm bg-gold text-navy-deep hover:bg-gold/90">
              <Link to="/states/$stateId" params={{ stateId: state.id }}>
                <ArrowLeft className="h-4 w-4" /> Back to {state.name} Space
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 text-sm border-foreground/15 hover:bg-foreground/5"
          >
            <Link to="/states">All States</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function VenueError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { stateId } = Route.useParams();

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="text-sm text-foreground/60 mt-2">{error.message}</p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full px-6 text-sm bg-gold text-navy-deep hover:bg-gold/90"
          >
            Try again
          </Button>
          {getState(stateId) && (
            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 text-sm border-foreground/15 hover:bg-foreground/5"
            >
              <Link to="/states/$stateId" params={{ stateId }}>
                Back to {getState(stateId)!.name} Space
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/states/$stateId/$venueId")({
  loader: ({ params }) => {
    const state = getState(params.stateId);
    const venue = getVenue(params.venueId);
    if (!state || !venue) throw notFound();
    return { stateId: state.id, venueId: venue.id };
  },
  head: ({ loaderData }) => {
    const state = loaderData ? getState(loaderData.stateId) : undefined;
    const venue = loaderData ? getVenue(loaderData.venueId) : undefined;
    return {
      meta: [
        { title: `${state?.name} ${venue?.name} — National Chat` },
        { name: "description", content: `${venue?.description} Inside the ${state?.name} space.` },
      ],
    };
  },
  notFoundComponent: VenueNotFound,
  errorComponent: VenueError,
  component: VenueRoom,
});

function VenueRoom() {
  const { stateId, venueId } = Route.useLoaderData();
  const state = getState(stateId)!;
  const venue = getVenue(venueId)!;
  const Icon = venue.icon;
  const isTexas = state.id === "texas";
  const personality = getVenuePersonality(state.id, venue.id);

  const venueName = personality.displayName ?? venue.name;
  const venueDescription = personality.description ?? venue.description;
  const venueSubtitle = personality.subtitle;
  const venueTopic = personality.pinned;
  const venueCta = personality.primaryCta;

  const prompts =
    (isTexas ? TEXAS_VENUE_PROMPTS[venue.id] : undefined) ??
    VENUE_PROMPTS[venue.id] ??
    [];
  const messages = buildChat(state.live + venue.id.length, prompts);
  const liveHere = Math.max(40, Math.floor(state.live / 4));

  const atmClass =
    venue.id === "sports-bar" ? "atm-stadium"
    : venue.id === "local-stage" ? "atm-stage"
    : venue.id === "coffee-shop" ? "atm-cafe"
    : "";

  return (
    <motion.div
      key={`${state.id}-${venue.id}`}
      className="relative"
      initial={{ opacity: 0, scale: 1.015, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
    >
      <RoomEntrance glow={venue.glow} label={`${state.name} · ${venueName}`} />
      <section className="relative overflow-hidden min-h-[220px] sm:min-h-[260px] md:min-h-[320px] lg:min-h-[360px]">
        {VENUE_BANNERS[state.id]?.[venue.id] && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${VENUE_BANNERS[state.id][venue.id]})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background/95" />
          </>
        )}
        <div className={`absolute inset-0 bg-gradient-to-b ${venue.gradient} ${VENUE_BANNERS[state.id]?.[venue.id] ? "opacity-40 mix-blend-multiply" : ""}`} />
        {isTexas && <div className="atm-lone-star" />}
        {atmClass && <div className={atmClass} />}
        <div className="absolute inset-0 particles" />
        <div className="grain" />
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[28rem] rounded-full blur-3xl opacity-70"
          style={{ background: venue.glow }}
        />

        <div className="relative px-5 pt-6 pb-7 max-w-2xl mx-auto">
          <Link
            to="/states/$stateId"
            params={{ stateId: state.id }}
            className="inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {state.name}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-center gap-4"
          >
            <div className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center">
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
                {state.name} · {venueSubtitle}
              </div>
              <h1 className="font-display text-3xl leading-none mt-1">{venueName}</h1>
            </div>
          </motion.div>

          <p className="text-sm text-foreground/75 mt-4 max-w-md">{venueDescription}</p>

          {/* Action-verb chips — venue language, not "user posted" */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {personality.postVerbs.map((v) => (
              <span
                key={v}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/75"
              >
                {v}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-gold" />
              <span className="font-medium">{liveHere.toLocaleString()}</span>
              <span className="text-foreground/60">at the {venueName.toLowerCase()}</span>
            </div>
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-gold" />
              <span className="text-foreground/60">Activity</span>
              <span>High</span>
            </div>
          </div>

          {/* Pinned card */}
          <div className="mt-5 glass-gold rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-gold">Pinned tonight</div>
            <div className="text-sm mt-1">{venueTopic}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="text-xs text-gold border border-gold/40 bg-gold/10 rounded-full px-3 py-1.5 hover:bg-gold/20">
                {venueCta}
              </button>
              {personality.ctas.map((c) => (
                <button
                  key={c}
                  className="text-xs text-foreground/80 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/5"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI HOST — speaks first, sets the room */}
      <section className="max-w-2xl mx-auto px-5">
        <AIHostFeed stateId={state.id} venueId={venue.id} />
      </section>

      {/* PRIMARY — chat stays the focus */}
      <main className="max-w-2xl mx-auto px-5 mt-5">
        <ChatFeed
          messages={messages}
          liveCount={liveHere}
          pinned={venueTopic}
          placeholder={personality.placeholder}
          accentGlow={venue.glow}
          stateId={state.id}
          venueId={venue.id}
        />
      </main>

      {/* AI TRENDING TOPICS — curated hourly */}
      <section className="max-w-2xl mx-auto px-5 mt-5">
        <TrendingTopics stateId={state.id} venueId={venue.id} />
      </section>

      {/* SUPPORTING — Room Pulse (always visible, secondary) */}
      <section className="max-w-2xl mx-auto px-5 mt-5">
        <VenuePulse personality={personality} glow={venue.glow} initialActive={liveHere} stateId={state.id} venueId={venue.id} />
      </section>

      {/* TERTIARY — Inside The Room (collapsed by default) */}
      <section className="max-w-2xl mx-auto px-5 mt-5">
        <InsideTheRoom>
          <VenueIntel personality={personality} />
        </InsideTheRoom>
      </section>

      <div className="h-20" />
    </motion.div>
  );
}
