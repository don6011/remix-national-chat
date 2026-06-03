import { Award, Crown, Flame, Sparkles, TrendingUp, History, Users } from "lucide-react";
import type { VenuePersonality } from "@/lib/venuePersonality";

export function VenueIntel({ personality }: { personality: VenuePersonality }) {
  const { intel, badges, moments } = personality;

  return (
    <div className="space-y-3">
      {/* Top contributors */}
      <Card title="Top contributors tonight" icon={Users}>
        <div className="space-y-1.5">
          {intel.topContributors.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="min-w-0">
                <div className="text-[12.5px] text-foreground/95 truncate">{c.name}</div>
                <div className="text-[10px] text-foreground/55">{c.status}</div>
              </div>
              <span className="text-[10px] text-gold/90 shrink-0">{c.score}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Legends / Hall of fame */}
      <Card title="Room legends" icon={Crown}>
        <div className="flex flex-wrap gap-2">
          {intel.legends.map((l) => (
            <span
              key={l.name}
              className="text-[11px] px-2.5 py-1 rounded-full glass-gold text-gold/95"
            >
              👑 {l.name} · <span className="text-foreground/70">{l.title}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* Trending room topics */}
      <Card title="Trending in this room" icon={TrendingUp}>
        <div className="flex flex-wrap gap-1.5">
          {intel.trendingTopics.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/85"
            >
              #{t}
            </span>
          ))}
        </div>
      </Card>

      {/* Room moments */}
      <Card title="Room moments" icon={Sparkles}>
        <div className="flex flex-wrap gap-1.5">
          {moments.map((m) => (
            <span
              key={m}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/85"
            >
              ✨ {m}
            </span>
          ))}
        </div>
      </Card>

      {/* Venue badges */}
      <Card title="Venue badges" icon={Award}>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.label}
              className="text-[11px] px-2.5 py-1 rounded-full glass-gold text-gold/90"
            >
              {b.emoji} {b.label}
            </span>
          ))}
        </div>
      </Card>

      {/* Most reacted + fastest rising */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Card title="Most reacted post" icon={Flame}>
          <div className="text-[12.5px] text-foreground/90">{intel.mostReacted}</div>
        </Card>
        <Card title="Fastest rising member" icon={TrendingUp}>
          <div className="text-[12.5px] text-foreground/90">{intel.fastestRising}</div>
        </Card>
      </div>

      {/* History */}
      <Card title="Venue history" icon={History}>
        <div className="text-[12.5px] text-foreground/85 italic">{intel.history}</div>
      </Card>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl glass border border-white/10 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="h-3.5 w-3.5 text-gold" />
        <span className="text-[10px] uppercase tracking-widest text-gold">{title}</span>
      </div>
      {children}
    </div>
  );
}
