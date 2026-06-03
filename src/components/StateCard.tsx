import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { StateVibe } from "@/lib/states";
import { useFavoriteStates } from "@/hooks/use-favorites";
import { useStateIntelligence } from "@/hooks/use-state-intelligence";
import { cn } from "@/lib/utils";

export function StateCard({
  state,
  index = 0,
}: {
  state: StateVibe;
  index?: number;
}) {
  const { isFavorite, toggle } = useFavoriteStates();
  const favorited = isFavorite(state.id);
  const navigate = useNavigate();
  const [entering, setEntering] = useState<{ x: number; y: number } | null>(null);
  const intel = useStateIntelligence(state.id);
  const venue = intel?.topVenue ?? state.vibe;
  const topic = intel?.primaryTopic ?? state.trendingTopic;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(state.id);
  };

  const handleEnter = (e: React.MouseEvent) => {
    // Allow modifier clicks / middle-click to behave normally
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setEntering({ x: e.clientX, y: e.clientY });
    window.setTimeout(() => {
      navigate({ to: "/states/$stateId", params: { stateId: state.id } });
    }, 520);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/states/$stateId"
        params={{ stateId: state.id }}
        onClick={handleEnter}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-500"
      >
        {/* Background image */}
        {state.image && (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${state.image})` }}
            />
          </div>
        )}

        {/* Fallback gradient when no image */}
        {!state.image && (
          <div className={`absolute inset-0 bg-gradient-to-br ${state.gradient}`} />
        )}

        {/* Dark cinematic overlay — heavier at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/25 to-transparent" />

        {/* Ambient glow on hover */}
        <div
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl pointer-events-none"
          style={{ background: state.glow }}
        />

        {/* Ambient drifting light + particles (idle life) */}
        <div className="ambient-sheen" />
        <div className="ambient-particles" />

        {/* Cinematic spotlight sweep on hover */}
        <div className="spotlight-sweep" />

        {/* Grain texture */}
        <div className="absolute inset-0 grain pointer-events-none" />

        {/* Content */}
        <div className="relative min-h-[220px] sm:min-h-[260px] flex flex-col justify-between p-5">
          {/* Top row: emoji + live count */}
          <div className="flex items-start justify-between">
            <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center text-xl shrink-0">
              {state.emoji}
            </div>
            <div className="flex items-center gap-2">
              <div className="glass live-pill rounded-full px-3 py-1.5 text-[11px] flex items-center gap-1.5">
                <span className="live-dot" />
                <span className="font-medium tabular-nums">
                  {state.live.toLocaleString()} live
                </span>
              </div>
              <button
                type="button"
                onClick={handleFavorite}
                aria-pressed={favorited}
                aria-label={favorited ? `Remove ${state.name} from favorites` : `Add ${state.name} to favorites`}
                className={cn(
                  "h-8 w-8 rounded-full glass flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/15",
                  favorited && "bg-white/15"
                )}
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    favorited ? "text-gold" : "text-foreground/70"
                  )}
                  fill={favorited ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>


          {/* Bottom row: name, venue, trending topic, CTA */}
          <div>
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-2xl sm:text-3xl leading-tight">
                  {state.name}
                </h3>
                <p className="text-sm text-foreground/80 mt-1 italic truncate">
                  {venue}
                </p>
                <motion.p
                  key={topic}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-foreground/90 max-w-full"
                >
                  <span aria-hidden className="shrink-0">🔥</span>
                  <span className="truncate">{topic}</span>
                </motion.p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold border border-gold/40 rounded-full px-3 py-1.5 bg-black/30 group-hover:bg-gold/15 transition whitespace-nowrap shrink-0">
                Enter <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {entering && (
              <motion.div
                key="state-enter-overlay"
                className="fixed inset-0 z-[100] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {/* Spotlight expanding from click point in the state glow color */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0.0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    background: `radial-gradient(circle at ${entering.x}px ${entering.y}px, ${state.glow} 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.95) 75%)`,
                  }}
                />
                {/* Final cinematic blackout */}
                <motion.div
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32, duration: 0.18, ease: "easeIn" }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  );
}
