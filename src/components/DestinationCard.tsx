import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/lib/destinations";

export function DestinationCard({
  dest,
  stateId,
  index = 0,
}: {
  dest: Destination;
  stateId: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/states/$stateId/$venueId"
        params={{ stateId, venueId: dest.id }}
        className="group relative block overflow-hidden rounded-2xl border border-white/10 hover:border-white/25 transition"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${dest.bg}`} />
        {dest.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-55 transition duration-500"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 particles opacity-50" />
        <div
          className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition duration-500"
          style={{ background: dest.glow }}
        />

        <div className="relative p-5 min-h-[160px] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl glass-strong flex items-center justify-center text-2xl shrink-0">
                {dest.emoji}
              </div>
              <div>
                {dest.flagship && (
                  <div className="text-[9px] uppercase tracking-[0.4em] text-gold mb-0.5">Flagship</div>
                )}
                <h3 className="font-display text-2xl leading-tight">{dest.name}</h3>
              </div>
            </div>
            <div className="glass rounded-full px-2.5 py-1 text-[11px] flex items-center gap-1.5">
              <span className="live-dot" />
              {dest.inside.toLocaleString()} inside
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-sm text-foreground/85 italic max-w-[18rem]">"{dest.blurb}"</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold border border-gold/40 rounded-full px-3 py-1.5 bg-black/30 group-hover:bg-gold/15 transition whitespace-nowrap">
              Enter <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
