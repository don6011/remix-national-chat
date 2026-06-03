import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { STATES } from "@/lib/states";
import { VENUES } from "@/lib/venues";
import { RankSystem } from "@/components/RankSystem";
import {
  Shield, MapPin, Award, Sparkles, Flame, Trophy, Mic2,
  MessageSquare, Hash, Heart, Users, Clock, Compass, CheckCircle2,
  Circle,
} from "lucide-react";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Citizen Passport — National Chat" },
      { name: "description", content: "Your citizen passport: influence, achievements, journey across America." },
    ],
  }),
  component: Me,
});


const STATS = [
  { icon: MessageSquare, label: "Messages", value: "12,847" },
  { icon: Hash, label: "Topics", value: "44" },
  { icon: Heart, label: "Reactions", value: "12,847" },
  { icon: Users, label: "Rooms Joined", value: "22" },
  { icon: Clock, label: "Hours Active", value: "318" },
  { icon: Compass, label: "States Visited", value: "17" },
];

const TIMELINE = [
  { date: "Jan 2026", label: "Joined Texas", icon: "🤠" },
  { date: "Jan 2026", label: "Earned Founding Citizen", icon: "🏛️" },
  { date: "Feb 2026", label: "Started First Debate", icon: "💬" },
  { date: "Mar 2026", label: "Reached State Contributor", icon: "⭐" },
  { date: "Apr 2026", label: "Reached Ambassador", icon: "🛡️" },
  { date: "May 2026", label: "Visited Mississippi", icon: "🎷" },
  { date: "Jun 2026", label: "Hosted First Room", icon: "🎤" },
];

const RARITY: Record<string, { label: string; cls: string }> = {
  legendary: { label: "Legendary", cls: "text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-400/10" },
  epic:      { label: "Epic",      cls: "text-amber-300 border-amber-400/40 bg-amber-400/10" },
  rare:      { label: "Rare",      cls: "text-sky-300 border-sky-400/40 bg-sky-400/10" },
  common:    { label: "Common",    cls: "text-foreground/70 border-white/15 bg-white/5" },
};

const BADGES = [
  { emoji: "🏛️", title: "Founding Citizen",   desc: "Among the first 1,000 citizens",   date: "Jan 2026", rarity: "legendary" },
  { emoji: "⭐",  title: "Top 5% Contributor", desc: "Ranked in top 5% nationally",      date: "May 2026", rarity: "epic" },
  { emoji: "🏈", title: "Sports Bar Champion", desc: "100+ posts in Texas Sports Bar",   date: "Mar 2026", rarity: "epic" },
  { emoji: "📣", title: "Town Hall Voice",    desc: "Hosted a verified debate",          date: "Jun 2026", rarity: "rare" },
  { emoji: "☕", title: "Creator Supporter",  desc: "Backed 10+ creators",               date: "Apr 2026", rarity: "rare" },
  { emoji: "🧳", title: "State Traveler",     desc: "Visited 15+ states",                date: "May 2026", rarity: "rare" },
  { emoji: "🎤", title: "Open Mic Night",     desc: "Performed in Local Stage",          date: "Feb 2026", rarity: "common" },
  { emoji: "🇺🇸", title: "Early Adopter",      desc: "Joined in launch week",             date: "Jan 2026", rarity: "epic" },
];

const ROOM_LEGENDS = [
  { room: "Texas Sports Bar",      state: "Texas",       rank: "Top 10 contributor",  glow: "oklch(0.78 0.16 60)" },
  { room: "Mississippi Blues Room", state: "Mississippi", rank: "Top 25 contributor",  glow: "oklch(0.62 0.18 290)" },
  { room: "Florida Town Hall",     state: "Florida",     rank: "Verified Voice",       glow: "oklch(0.78 0.14 200)" },
];

const FAVORITE_SPACES = [
  { id: "bar",         name: "Sports Bar",  visits: 124, time: "92h", last: "2h ago" },
  { id: "coffee-shop", name: "Coffee Shop", visits: 82,  time: "54h", last: "1d ago" },
  { id: "open-mic",    name: "Local Stage", visits: 53,  time: "31h", last: "3d ago" },
];

function Me() {
  const home = STATES.find((s) => s.id === "texas") ?? STATES[0];
  const favoriteVenues = FAVORITE_SPACES.map((f) => ({
    ...f,
    venue: VENUES.find((v) => v.id === f.id) ?? VENUES[0],
  }));
  

  return (
    <div className="relative pb-16">
      {/* HERO — CITIZEN PASSPORT */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.06_260)] via-[oklch(0.14_0.05_262)] to-transparent" />
        <div className="absolute inset-0 particles" />
        <div className="relative max-w-2xl mx-auto px-5 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold/90">
              Citizen Passport
            </div>
            <div className="text-[10px] uppercase tracking-widest text-foreground/50">
              No. 000482
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 glass-strong rounded-3xl p-5 relative overflow-hidden"
          >
            <div
              className="absolute -top-16 -right-12 h-44 w-44 rounded-full blur-3xl opacity-60"
              style={{ background: home.glow }}
            />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl glass-gold flex items-center justify-center text-2xl text-gold">
                  JR
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-[oklch(0.14_0.05_262)] animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/60">
                  <MapPin className="h-3 w-3" /> {home.name} Citizen
                </div>
                <h1 className="font-display text-2xl leading-none mt-1">Jordan Reyes</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <span className="text-gold flex items-center gap-1">
                    <Shield className="h-3 w-3" /> State Ambassador
                  </span>
                  <span className="text-foreground/60">Citizen since 2026</span>
                  <span className="text-emerald-300 flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" /> Online
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-5 space-y-8">
        <RankSystem />

        {/* CITIZEN IDENTITY */}
        <section>
          <SectionTitle icon={Shield} title="Citizen Identity" />
          <div className="grid grid-cols-2 gap-2">
            {[
              { k: "Home State",        v: "Texas",            sub: "Lone Star" },
              { k: "Current State",     v: "Mississippi",      sub: "Visiting" },
              { k: "Citizen Rank",      v: "Ambassador",       sub: "Tier IV" },
              { k: "Host Status",       v: "Verified",         sub: "Since Jun 2026", icon: CheckCircle2 },
              { k: "Contributor Level", v: "Top 5%",           sub: "National" },
              { k: "Verified Citizen",  v: "Yes",              sub: "ID Confirmed", icon: CheckCircle2 },
            ].map((c) => (
              <div key={c.k} className="glass rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-widest text-foreground/50">{c.k}</div>
                <div className="mt-1 text-sm font-medium flex items-center gap-1">
                  {c.v}
                  {c.icon && <c.icon className="h-3.5 w-3.5 text-emerald-300" />}
                </div>
                <div className="text-[10px] text-foreground/50 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CITIZEN STATS */}
        <section>
          <SectionTitle icon={Sparkles} title="Citizen Stats" />
          <div className="grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-xl p-3 text-center">
                <s.icon className="h-4 w-4 text-gold mx-auto" strokeWidth={1.75} />
                <div className="mt-1.5 font-display text-lg tabular-nums">{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/55">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PASSPORT TIMELINE */}
        <section>
          <SectionTitle icon={Clock} title="Passport Timeline" />
          <div className="relative pl-5">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-gold/40 via-white/10 to-transparent" />
            <ol className="space-y-3">
              {TIMELINE.map((t, i) => (
                <motion.li
                  key={t.label}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="relative"
                >
                  <span className="absolute -left-[18px] top-2 h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_oklch(0.78_0.16_60)]" />
                  <div className="glass rounded-xl p-3 flex items-center gap-3">
                    <div className="text-lg">{t.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">{t.label}</div>
                      <div className="text-[10px] uppercase tracking-widest text-foreground/50">{t.date}</div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* BADGES 2.0 */}
        <section>
          <SectionTitle icon={Award} title="Achievements" />
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((b) => {
              const r = RARITY[b.rarity];
              return (
                <div key={b.title} className={`glass rounded-xl p-3 border ${r.cls.split(" ").slice(1).join(" ")}`}>
                  <div className="flex items-start justify-between">
                    <div className="text-2xl">{b.emoji}</div>
                    <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${r.cls}`}>
                      {r.label}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium">{b.title}</div>
                  <div className="text-[11px] text-foreground/60 mt-0.5 leading-snug">{b.desc}</div>
                  <div className="text-[10px] text-foreground/45 mt-1.5 uppercase tracking-widest">{b.date}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STATE JOURNEY */}
        <section>
          <SectionTitle icon={Compass} title="State Journey" />
          <div className="glass-strong rounded-2xl p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-display text-2xl text-gold tabular-nums">17</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/55">Visited</div>
              </div>
              <div>
                <div className="font-display text-2xl text-gold tabular-nums">6</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/55">Active In</div>
              </div>
              <div>
                <div className="font-display text-2xl text-gold tabular-nums">🤠</div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/55">Most Active</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-foreground/70">
              Favorite room: <span className="text-foreground">Mississippi Blues Room 🎷</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {STATES.map((s) => (
                <Link
                  key={s.id}
                  to="/states/$stateId"
                  params={{ stateId: s.id }}
                  className="glass rounded-full px-2.5 py-1 text-[11px] flex items-center gap-1 hover:bg-white/10 transition"
                >
                  <span>{s.emoji}</span> {s.abbr}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ROOM LEGENDS */}
        <section>
          <SectionTitle icon={Trophy} title="Room Legends" />
          <div className="space-y-2">
            {ROOM_LEGENDS.map((r) => (
              <div key={r.room} className="glass rounded-xl p-3 flex items-center gap-3 relative overflow-hidden">
                <div
                  className="absolute -left-6 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full blur-3xl opacity-50"
                  style={{ background: r.glow }}
                />
                <div className="relative h-10 w-10 rounded-xl glass-gold flex items-center justify-center">
                  <Flame className="h-4 w-4 text-gold" />
                </div>
                <div className="relative flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.room}</div>
                  <div className="text-[11px] text-foreground/55">{r.state}</div>
                </div>
                <div className="relative text-[10px] uppercase tracking-widest text-gold/90 text-right">
                  {r.rank}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAVORITE SPACES */}
        <section>
          <SectionTitle icon={Mic2} title="Favorite Spaces" />
          <div className="space-y-2">
            {favoriteVenues.map(({ venue, ...f }) => {
              const Icon = venue.icon;
              return (
                <div key={f.id} className="glass rounded-xl p-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gold" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-[11px] text-foreground/55">
                      {f.visits} visits · {f.time} · {f.last}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* END OF PROFILE — LIFETIME */}
        <section className="glass-strong rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.78 0.16 60 / 0.25), transparent)" }} />
          <div className="relative">
            <div className="text-center text-[10px] uppercase tracking-[0.3em] text-gold/80">
              Lifetime
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <Lifetime k="Citizen No." v="000482" />
              <Lifetime k="Member Since" v="Jan 2026" />
              <Lifetime k="Reactions" v="12,847" />
              <Lifetime k="Messages" v="38,412" />
              <Lifetime k="Rooms Joined" v="22" />
              <Lifetime k="Hours Active" v="318" />
            </div>
            <div className="mt-5 text-center text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              National Chat · Citizen Passport
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof Shield; title: string }) {
  return (
    <h2 className="font-display text-lg mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-gold" /> {title}
    </h2>
  );
}

function Lifetime({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-lg tabular-nums">{v}</div>
      <div className="text-[10px] uppercase tracking-widest text-foreground/55">{k}</div>
    </div>
  );
}
