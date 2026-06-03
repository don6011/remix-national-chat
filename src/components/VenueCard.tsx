import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Venue } from "@/lib/venues";
import { ArrowUpRight } from "lucide-react";

export function VenueCard({
  venue,
  stateId,
  index = 0,
  liveCount,
}: {
  venue: Venue;
  stateId: string;
  index?: number;
  liveCount: number;
}) {
  const Icon = venue.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to="/states/$stateId/$venueId"
        params={{ stateId, venueId: venue.id }}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 h-44"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${venue.gradient}`} />
        <div className="absolute inset-0 particles opacity-60" />
        <div
          className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition"
          style={{ background: venue.glow }}
        />
        <div className="relative h-full p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center">
              <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-1 text-[11px] glass px-2 py-1 rounded-full">
              <span className="live-dot" />
              {liveCount}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl leading-tight">{venue.name}</h3>
            <p className="text-xs text-foreground/70 mt-1">{venue.description}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-gold/90 uppercase tracking-wider">
              {venue.cta}
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
