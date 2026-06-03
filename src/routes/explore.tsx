import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
  MapPin, Radio, Play, Heart, MessageCircle, Eye, Trophy, Calendar,
  Music, Users, Sparkles, Mic2, Star,
  Video, Upload, X, Share2, Bookmark, Shield, Wand2, Crown,
  GraduationCap, Gamepad2, Award, Zap, ChevronRight,
} from "lucide-react";
import { STATES } from "@/lib/states";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Citizen Reports — National Chamber" },
      {
        name: "description",
        content:
          "Citizen Reports from every corner of America. Upload what's happening in your city, venue, or community.",
      },
    ],
  }),
  component: ExplorePage,
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Mood = "Electric" | "Relaxed" | "Crowded" | "Hyped" | "Soulful" | "Intimate";
type VenueType =
  | "Sports Bar" | "Beach" | "Local Stage" | "Blues Room" | "Creator District"
  | "Festival Grounds" | "Campus" | "Town Hall" | "Tailgate";
type Activity =
  | "Live Music" | "Game Night" | "Open Mic" | "Campus Event" | "Block Party" | "Watch Party";

type ReporterRank =
  | "Citizen" | "Verified Reporter" | "State Reporter"
  | "State Ambassador" | "National Correspondent" | "Legend Reporter";

interface CitizenReport {
  id: string;
  reporter: string;
  avatarTone: string;
  rank: ReporterRank;
  city: string;
  state: string;
  venueType: VenueType;
  mood: Mood;
  activity: Activity;
  caption: string;
  views: number;
  reactions: number;
  discussion: number;
  duration: string;
  postedAgo: string;
  gradient: string;
  isLocal?: boolean;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const MOODS: { label: Mood; icon: string }[] = [
  { label: "Electric", icon: "🔥" },
  { label: "Hyped", icon: "⚡" },
  { label: "Crowded", icon: "👥" },
  { label: "Relaxed", icon: "🌊" },
  { label: "Soulful", icon: "🎷" },
  { label: "Intimate", icon: "🕯" },
];

const ACTIVITIES: { label: Activity; icon: typeof Music }[] = [
  { label: "Live Music", icon: Music },
  { label: "Game Night", icon: Trophy },
  { label: "Open Mic", icon: Mic2 },
  { label: "Campus Event", icon: GraduationCap },
  { label: "Block Party", icon: Users },
  { label: "Watch Party", icon: Gamepad2 },
];

const VENUE_TYPES: VenueType[] = [
  "Sports Bar", "Beach", "Local Stage", "Blues Room",
  "Creator District", "Festival Grounds", "Campus", "Town Hall", "Tailgate",
];

const RANK_LADDER: { rank: ReporterRank; min: number; perk: string }[] = [
  { rank: "Citizen", min: 0, perk: "Upload reports" },
  { rank: "Verified Reporter", min: 500, perk: "Verified badge" },
  { rank: "State Reporter", min: 2500, perk: "State spotlight" },
  { rank: "State Ambassador", min: 10000, perk: "Pin to state feed" },
  { rank: "National Correspondent", min: 50000, perk: "National rotation" },
  { rank: "Legend Reporter", min: 200000, perk: "Hall of Voices" },
];

const RANK_COLOR: Record<ReporterRank, string> = {
  "Citizen": "text-foreground/70 border-white/15",
  "Verified Reporter": "text-sky-300 border-sky-300/30",
  "State Reporter": "text-emerald-300 border-emerald-300/30",
  "State Ambassador": "text-gold border-gold/40",
  "National Correspondent": "text-violet-300 border-violet-300/40",
  "Legend Reporter": "text-rose-300 border-rose-300/50",
};

const MOOD_ICON: Record<Mood, string> = {
  Electric: "🔥", Hyped: "⚡", Crowded: "👥",
  Relaxed: "🌊", Soulful: "🎷", Intimate: "🕯",
};

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const SEED_REPORTS: CitizenReport[] = [
  {
    id: "r1", reporter: "TailgateKing", avatarTone: "from-amber-400 to-rose-500",
    rank: "State Ambassador",
    city: "Arlington", state: "Texas",
    venueType: "Tailgate", mood: "Electric", activity: "Game Night",
    caption: "AT&T Stadium parking lot, 3 hours to kickoff. The grills don't stop.",
    views: 48200, reactions: 3100, discussion: 412, duration: "0:42", postedAgo: "12m",
    gradient: "from-[oklch(0.28_0.16_55)] via-[oklch(0.18_0.10_40)] to-[oklch(0.10_0.05_30)]",
    isLocal: true,
  },
  {
    id: "r2", reporter: "BluesBoss", avatarTone: "from-violet-400 to-indigo-600",
    rank: "State Reporter",
    city: "Clarksdale", state: "Mississippi",
    venueType: "Blues Room", mood: "Soulful", activity: "Live Music",
    caption: "Inside Red's Lounge before doors open. Smell of catfish and amps warming up.",
    views: 12800, reactions: 942, discussion: 188, duration: "1:08", postedAgo: "37m",
    gradient: "from-[oklch(0.22_0.10_320)] via-[oklch(0.16_0.08_300)] to-[oklch(0.10_0.04_280)]",
  },
  {
    id: "r3", reporter: "LoneStarMaya", avatarTone: "from-cyan-300 to-blue-600",
    rank: "Verified Reporter",
    city: "Destin", state: "Florida",
    venueType: "Beach", mood: "Relaxed", activity: "Block Party",
    caption: "Sunset on the panhandle — argue with me. Best beach in the South, full stop.",
    views: 29600, reactions: 2400, discussion: 301, duration: "0:31", postedAgo: "1h",
    gradient: "from-[oklch(0.24_0.14_200)] via-[oklch(0.18_0.10_220)] to-[oklch(0.12_0.06_260)]",
  },
  {
    id: "r4", reporter: "DebateCaptain", avatarTone: "from-fuchsia-400 to-rose-600",
    rank: "National Correspondent",
    city: "Los Angeles", state: "California",
    venueType: "Creator District", mood: "Hyped", activity: "Block Party",
    caption: "Echo Park sunset crowd is unreal tonight. 5k+ and still pouring in.",
    views: 63100, reactions: 4800, discussion: 612, duration: "0:54", postedAgo: "2h",
    gradient: "from-[oklch(0.26_0.14_25)] via-[oklch(0.18_0.10_340)] to-[oklch(0.12_0.06_280)]",
  },
  {
    id: "r5", reporter: "CampusJay", avatarTone: "from-emerald-300 to-teal-600",
    rank: "Verified Reporter",
    city: "Athens", state: "Georgia",
    venueType: "Campus", mood: "Crowded", activity: "Campus Event",
    caption: "Sanford Stadium gameday walk-in. Between the Hedges energy is back.",
    views: 18400, reactions: 1410, discussion: 224, duration: "0:48", postedAgo: "3h",
    gradient: "from-[oklch(0.24_0.12_140)] via-[oklch(0.16_0.08_180)] to-[oklch(0.10_0.04_220)]",
  },
];

const REPORTERS = [
  { rank: 1, name: "TailgateKing", state: "TX", score: 184200, reports: 184, badge: "Top Reporter", metric: "Most Viewed" },
  { rank: 2, name: "DebateCaptain", state: "CA", score: 142800, reports: 142, badge: "Top 1%", metric: "Most Discussed" },
  { rank: 3, name: "BluesBoss", state: "MS", score: 94600, reports: 96, badge: "Rising", metric: "Fastest Growing" },
  { rank: 4, name: "LoneStarMaya", state: "FL", score: 68400, reports: 78, badge: "Verified", metric: "Most Active" },
  { rank: 5, name: "SkylineSam", state: "NY", score: 52100, reports: 61, badge: "Verified", metric: "Most Viewed" },
];

const LEADERBOARD_TABS = ["Most Viewed", "Most Discussed", "Most Active", "Fastest Growing"] as const;

const EVENTS = [
  { id: "e1", name: "Austin City Limits — Weekend 2", type: "Festival", icon: Music, state: "Texas", city: "Austin", date: "Oct 11–13", going: "14.2k" },
  { id: "e2", name: "Cowboys vs Eagles", type: "Sporting Event", icon: Trophy, state: "Texas", city: "Arlington", date: "Tonight · 8:20 ET", going: "8.4k" },
  { id: "e3", name: "Memphis in May — Beale St Block", type: "Concert", icon: Mic2, state: "Tennessee", city: "Memphis", date: "Sat · 7pm CT", going: "3.1k" },
  { id: "e4", name: "Brooklyn Founders Meetup", type: "Meetup", icon: Users, state: "New York", city: "Brooklyn", date: "Thu · 6:30pm ET", going: "412" },
];

const GRADIENTS = [
  "from-[oklch(0.26_0.14_25)] via-[oklch(0.18_0.10_340)] to-[oklch(0.12_0.06_280)]",
  "from-[oklch(0.24_0.14_200)] via-[oklch(0.18_0.10_220)] to-[oklch(0.12_0.06_260)]",
  "from-[oklch(0.22_0.10_320)] via-[oklch(0.16_0.08_300)] to-[oklch(0.10_0.04_280)]",
  "from-[oklch(0.28_0.16_55)] via-[oklch(0.18_0.10_40)] to-[oklch(0.10_0.05_30)]",
  "from-[oklch(0.24_0.12_140)] via-[oklch(0.16_0.08_180)] to-[oklch(0.10_0.04_220)]",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
}

function SectionHeader({
  eyebrow, title, subtitle, icon: Icon, action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-1 flex items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold/90">
          {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2} /> : null}
          {eyebrow}
        </div>
        <h2 className="font-display text-2xl mt-1.5 leading-tight">{title}</h2>
        {subtitle ? <p className="text-xs text-muted-foreground mt-1">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function AiTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] tracking-wide glass rounded-full px-2 py-0.5 text-foreground/80">
      <Sparkles className="h-2.5 w-2.5 text-gold" strokeWidth={2} />
      {children}
    </span>
  );
}

function RankBadge({ rank }: { rank: ReporterRank }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider rounded-full px-1.5 py-0.5 border bg-black/30 backdrop-blur ${RANK_COLOR[rank]}`}>
      {rank === "Legend Reporter" ? <Crown className="h-2.5 w-2.5" strokeWidth={2} /> :
       rank === "National Correspondent" ? <Award className="h-2.5 w-2.5" strokeWidth={2} /> :
       <Shield className="h-2.5 w-2.5" strokeWidth={2} />}
      {rank}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Report card                                                         */
/* ------------------------------------------------------------------ */

function ReportCard({ r, index }: { r: CitizenReport; index: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-white/10"
    >
      {/* Video thumbnail */}
      <div className="relative aspect-[16/10]">
        <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient}`} />
        <div className="absolute inset-0 particles" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="h-14 w-14 rounded-full glass-strong border border-gold/30 flex items-center justify-center hover:scale-105 transition">
            <Play className="h-6 w-6 text-gold fill-gold" strokeWidth={1.5} />
          </button>
        </div>

        {/* Top-left: location */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider">
          <MapPin className="h-3 w-3 text-gold" strokeWidth={2} />
          {r.city}, {r.state}
        </div>

        {/* Top-right: duration */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <div className="glass rounded-full px-2 py-0.5 text-[10px] tabular-nums">{r.duration}</div>
          {r.isLocal ? (
            <div className="inline-flex items-center gap-1 glass-gold rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider text-gold border border-gold/30">
              <Radio className="h-2.5 w-2.5" strokeWidth={2} /> Near you
            </div>
          ) : null}
        </div>

        {/* Bottom: reporter + caption */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full bg-gradient-to-br ${r.avatarTone} border border-white/20 shrink-0`} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-foreground/90 truncate">@{r.reporter}</span>
                <RankBadge rank={r.rank} />
              </div>
              <div className="text-[10px] text-foreground/60">{r.postedAgo} ago</div>
            </div>
          </div>
          <p className="font-display text-base leading-snug mt-2 drop-shadow line-clamp-2">
            {r.caption}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="glass-strong px-4 py-3 space-y-3">
        {/* AI analysis row */}
        <div className="flex flex-wrap gap-1">
          <AiTag>{MOOD_ICON[r.mood]} {r.mood}</AiTag>
          <AiTag>📍 {r.venueType}</AiTag>
          <AiTag>🎯 {r.activity}</AiTag>
          <AiTag>🇺🇸 {r.state}</AiTag>
        </div>

        {/* Stats + actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-foreground/80">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" strokeWidth={2} /> {fmt(r.views)}
            </span>
            <button
              onClick={() => setLiked((v) => !v)}
              className={`inline-flex items-center gap-1 transition ${liked ? "text-[var(--live)]" : "hover:text-[var(--live)]"}`}
            >
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} strokeWidth={2} />
              {fmt(r.reactions + (liked ? 1 : 0))}
            </button>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} /> {fmt(r.discussion)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSaved((v) => !v)}
              className={`h-8 w-8 rounded-full glass border border-white/10 flex items-center justify-center transition ${saved ? "text-gold" : "text-foreground/70"}`}
              aria-label="Save"
            >
              <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} strokeWidth={2} />
            </button>
            <button
              className="h-8 w-8 rounded-full glass border border-white/10 flex items-center justify-center text-foreground/70"
              aria-label="Share"
            >
              <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Primary CTA: Join discussion */}
        <Link
          to="/live"
          className="flex items-center justify-between w-full glass-gold rounded-xl px-3 py-2.5 border border-gold/30 hover:bg-gold/10 transition group"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-gold" strokeWidth={2} />
            <span className="text-[12px] uppercase tracking-wider text-gold">
              Join Discussion
            </span>
            <span className="text-[10px] text-foreground/60">
              {fmt(r.discussion)} citizens talking
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-gold/70 group-hover:translate-x-0.5 transition" strokeWidth={2} />
        </Link>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Upload sheet                                                        */
/* ------------------------------------------------------------------ */

function UploadSheet({
  open, onClose, onPublish,
}: {
  open: boolean;
  onClose: () => void;
  onPublish: (r: CitizenReport) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Texas");
  const [venueType, setVenueType] = useState<VenueType>("Sports Bar");
  const [mood, setMood] = useState<Mood>("Electric");
  const [activity, setActivity] = useState<Activity>("Game Night");
  const [analyzing, setAnalyzing] = useState(false);

  const canPublish = fileName && caption.trim() && city.trim();

  function aiAutoTag() {
    setAnalyzing(true);
    setTimeout(() => {
      const guessMood: Mood[] = ["Electric", "Crowded", "Hyped", "Soulful"];
      const guessVenue: VenueType[] = ["Sports Bar", "Local Stage", "Tailgate", "Beach"];
      setMood(guessMood[Math.floor(Math.random() * guessMood.length)]);
      setVenueType(guessVenue[Math.floor(Math.random() * guessVenue.length)]);
      setAnalyzing(false);
    }, 900);
  }

  function publish() {
    if (!canPublish) return;
    const id = `u_${Date.now()}`;
    onPublish({
      id,
      reporter: "you",
      avatarTone: "from-gold to-amber-600",
      rank: "Citizen",
      city: city.trim(),
      state: stateName,
      venueType,
      mood,
      activity,
      caption: caption.trim(),
      views: 0, reactions: 0, discussion: 0,
      duration: "0:18",
      postedAgo: "now",
      gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      isLocal: true,
    });
    // Reset
    setFileName(null); setCaption(""); setCity("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-t-3xl glass-strong border-t border-white/10 max-h-[88vh] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/30 backdrop-blur">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold/90">New report</div>
                <h3 className="font-display text-xl">File a Citizen Report</h3>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-full glass border border-white/10 flex items-center justify-center">
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* File picker */}
              <button
                onClick={() => fileRef.current?.click()}
                className={`w-full aspect-[16/10] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition ${
                  fileName ? "border-gold/40 bg-gold/5" : "border-white/15 hover:border-gold/40 hover:bg-gold/5"
                }`}
              >
                {fileName ? (
                  <>
                    <Video className="h-8 w-8 text-gold" strokeWidth={1.5} />
                    <div className="text-sm text-foreground/90">{fileName}</div>
                    <div className="text-[11px] text-foreground/60">Tap to replace</div>
                  </>
                ) : (
                  <>
                    <Upload className="h-7 w-7 text-gold/80" strokeWidth={1.5} />
                    <div className="text-sm">Upload a short video</div>
                    <div className="text-[11px] text-foreground/60">MP4 or MOV, under 60 seconds</div>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-foreground/60">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 220))}
                  placeholder="What's happening here?"
                  rows={3}
                  className="w-full glass rounded-xl px-3 py-2 text-sm bg-black/20 border border-white/10 focus:outline-none focus:border-gold/40 resize-none"
                />
                <div className="text-[10px] text-foreground/50 text-right">{caption.length}/220</div>
              </div>

              {/* Location row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-foreground/60">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Dallas"
                    className="w-full glass rounded-xl px-3 py-2 text-sm bg-black/20 border border-white/10 focus:outline-none focus:border-gold/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-foreground/60">State</label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full glass rounded-xl px-3 py-2 text-sm bg-black/30 border border-white/10 focus:outline-none focus:border-gold/40"
                  >
                    {STATES.map((s) => (
                      <option key={s.id} value={s.name} className="bg-[var(--navy-deep)]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* AI auto-tag */}
              <button
                onClick={aiAutoTag}
                disabled={!fileName || analyzing}
                className="w-full inline-flex items-center justify-center gap-2 glass-gold rounded-xl px-3 py-2.5 border border-gold/30 text-gold text-[12px] uppercase tracking-wider disabled:opacity-40 hover:bg-gold/10 transition"
              >
                <Wand2 className={`h-4 w-4 ${analyzing ? "animate-spin" : ""}`} strokeWidth={2} />
                {analyzing ? "Analyzing scene…" : "AI Auto-Tag"}
              </button>

              {/* Venue type */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-foreground/60">Venue type</label>
                <div className="flex flex-wrap gap-1.5">
                  {VENUE_TYPES.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVenueType(v)}
                      className={`text-[11px] rounded-full px-2.5 py-1 border transition ${
                        venueType === v
                          ? "bg-gold/15 border-gold/40 text-gold"
                          : "glass border-white/10 text-foreground/70 hover:border-gold/30"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-foreground/60">Mood</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={`text-[11px] rounded-full px-2.5 py-1 border transition ${
                        mood === m.label
                          ? "bg-gold/15 border-gold/40 text-gold"
                          : "glass border-white/10 text-foreground/70 hover:border-gold/30"
                      }`}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-foreground/60">Activity</label>
                <div className="flex flex-wrap gap-1.5">
                  {ACTIVITIES.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.label}
                        onClick={() => setActivity(a.label)}
                        className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2.5 py-1 border transition ${
                          activity === a.label
                            ? "bg-gold/15 border-gold/40 text-gold"
                            : "glass border-white/10 text-foreground/70 hover:border-gold/30"
                        }`}
                      >
                        <Icon className="h-3 w-3" strokeWidth={2} /> {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Publish */}
              <button
                onClick={publish}
                disabled={!canPublish}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" strokeWidth={2.5} />
                Publish Report
              </button>
              <p className="text-[10px] text-center text-foreground/50">
                Your report creates a discussion thread other citizens can join.
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function ExplorePage() {
  const [reports, setReports] = useState<CitizenReport[]>(SEED_REPORTS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Near You" | Mood>("All");
  const [boardTab, setBoardTab] = useState<typeof LEADERBOARD_TABS[number]>("Most Viewed");

  // Citizen score for the viewer
  const yourScore = 1428;
  const currentRankIdx = RANK_LADDER.findIndex((r) => r.min > yourScore) - 1;
  const currentRank = RANK_LADDER[Math.max(0, currentRankIdx)];
  const nextRank = RANK_LADDER[currentRankIdx + 1];
  const progress = nextRank
    ? Math.min(100, ((yourScore - currentRank.min) / (nextRank.min - currentRank.min)) * 100)
    : 100;

  const filtered = useMemo(() => {
    if (filter === "All") return reports;
    if (filter === "Near You") return reports.filter((r) => r.isLocal);
    return reports.filter((r) => r.mood === filter);
  }, [reports, filter]);

  const sortedReporters = useMemo(() => {
    const copy = [...REPORTERS];
    if (boardTab === "Most Discussed") return copy.sort((a, b) => b.reports - a.reports);
    if (boardTab === "Most Active") return copy.sort((a, b) => b.reports - a.reports);
    if (boardTab === "Fastest Growing") return copy.sort((a, b) => (a.rank === 3 ? -1 : 1));
    return copy.sort((a, b) => b.score - a.score);
  }, [boardTab]);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-8 pb-28 space-y-10">
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.20_0.08_262)] via-[oklch(0.16_0.06_280)] to-[oklch(0.10_0.04_260)]" />
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full blur-3xl opacity-50" style={{ background: "oklch(0.82 0.14 85 / 0.35)" }} />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full blur-3xl opacity-40" style={{ background: "oklch(0.65 0.24 25 / 0.30)" }} />
        <div className="relative p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold/90">
            <Radio className="h-3.5 w-3.5" strokeWidth={2} /> Citizen Reports
          </div>
          <h1 className="font-display text-4xl leading-[1.05] mt-3">
            America, on the ground.
          </h1>
          <p className="text-sm text-foreground/75 mt-3">
            Short videos from real citizens. Every report becomes a discussion. Your eyes, your city, your voice.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <AiTag>AI-tagged location</AiTag>
            <AiTag>Mood detection</AiTag>
            <AiTag>Crowd estimate</AiTag>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2.5 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider shadow-lg shadow-gold/20"
          >
            <Video className="h-4 w-4" strokeWidth={2.5} />
            File a Citizen Report
          </button>
        </div>
      </motion.section>

      {/* YOUR REPORTER STATUS */}
      <section className="relative overflow-hidden rounded-2xl glass-strong border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold/90">Your reporter status</div>
            <div className="font-display text-xl mt-1">{currentRank.rank}</div>
            <div className="text-[11px] text-foreground/65 mt-0.5">
              Citizen Score · <span className="text-gold tabular-nums">{yourScore.toLocaleString()}</span>
            </div>
          </div>
          <RankBadge rank={currentRank.rank} />
        </div>
        {nextRank ? (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] text-foreground/60 mb-1">
              <span>Next: {nextRank.rank}</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-gold to-amber-400"
              />
            </div>
            <div className="text-[10px] text-foreground/50 mt-1.5">
              {(nextRank.min - yourScore).toLocaleString()} more to unlock <span className="text-gold/90">{nextRank.perk}</span>
            </div>
          </div>
        ) : null}
      </section>

      {/* FILTER STRIP */}
      <section className="-mx-5 px-5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {(["All", "Near You", "Electric", "Hyped", "Crowded", "Relaxed", "Soulful"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 text-[11px] uppercase tracking-wider rounded-full px-3 py-1.5 border transition ${
                filter === f
                  ? "bg-gold/15 border-gold/40 text-gold"
                  : "glass border-white/10 text-foreground/70 hover:border-gold/30"
              }`}
            >
              {f === "All" || f === "Near You" ? f : `${MOOD_ICON[f]} ${f}`}
            </button>
          ))}
        </div>
      </section>

      {/* REPORTS FEED */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Citizen Reports"
          title="On-the-ground from every corner."
          subtitle="Auto-tagged by location, venue, mood. Tap any report to join the discussion."
          icon={Play}
        />
        <div className="grid gap-3">
          {filtered.map((r, i) => (
            <ReportCard key={r.id} r={r} index={i} />
          ))}
          {filtered.length === 0 ? (
            <div className="text-center text-sm text-foreground/60 py-10 glass rounded-2xl">
              No reports match this filter yet. Be the first.
            </div>
          ) : null}
        </div>
      </section>

      {/* TOP REPORTERS */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Top reporters"
          title="The eyes on America."
          icon={Trophy}
        />
        <div className="-mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {LEADERBOARD_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setBoardTab(t)}
                className={`shrink-0 text-[11px] uppercase tracking-wider rounded-full px-3 py-1.5 border transition ${
                  boardTab === t
                    ? "bg-gold/15 border-gold/40 text-gold"
                    : "glass border-white/10 text-foreground/70 hover:border-gold/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl glass-strong overflow-hidden">
          {sortedReporters.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-center gap-3 px-4 py-3 ${
                i !== sortedReporters.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-display tabular-nums ${
                  i === 0
                    ? "bg-gradient-to-br from-gold to-amber-500 text-[var(--navy-deep)]"
                    : "glass border border-white/10 text-gold"
                }`}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-display text-base truncate">{p.name}</div>
                  <span className="text-[10px] uppercase tracking-wider text-gold/90">· {p.state}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                  {fmt(p.score)} pts · {p.reports} reports
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wider glass-gold rounded-full px-2 py-0.5 text-gold border border-gold/30 inline-flex items-center gap-1 shrink-0">
                <Star className="h-3 w-3" strokeWidth={2} /> {p.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* RANK LADDER */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Reporter progression"
          title="From Citizen to Legend."
          subtitle="Earn views, reactions, and discussion joins. Climb the ladder."
          icon={Award}
        />
        <div className="rounded-2xl glass-strong overflow-hidden divide-y divide-white/5">
          {RANK_LADDER.map((r, i) => {
            const unlocked = yourScore >= r.min;
            const isCurrent = currentRank.rank === r.rank;
            return (
              <div key={r.rank} className={`flex items-center gap-3 px-4 py-3 ${isCurrent ? "bg-gold/5" : ""}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] tabular-nums shrink-0 ${
                  unlocked ? "bg-gold/20 text-gold border border-gold/40" : "bg-white/5 text-foreground/40 border border-white/10"
                }`}>
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-display ${unlocked ? "text-foreground" : "text-foreground/50"}`}>
                    {r.rank}
                    {isCurrent ? <span className="ml-2 text-[9px] uppercase tracking-wider text-gold">· You are here</span> : null}
                  </div>
                  <div className="text-[10px] text-foreground/55 mt-0.5">
                    {r.min.toLocaleString()}+ pts · {r.perk}
                  </div>
                </div>
                {unlocked ? (
                  <Shield className="h-4 w-4 text-gold shrink-0" strokeWidth={2} />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE EVENTS */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Live events"
          title="Where America is gathering."
          subtitle="Festivals, concerts, sports, meetups, community."
          icon={Calendar}
        />
        <div className="grid gap-2.5">
          {EVENTS.map((e, i) => {
            const Icon = e.icon;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative overflow-hidden rounded-2xl glass p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl glass-strong flex items-center justify-center shrink-0 border border-gold/20">
                    <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gold/90">
                      {e.type} · {e.city}, {e.state}
                    </div>
                    <h3 className="font-display text-lg mt-0.5 leading-tight truncate">{e.name}</h3>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-foreground/75">
                      <span>{e.date}</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" strokeWidth={2} /> {e.going} going
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <div className="pt-2 text-center">
        <Link
          to="/states"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold/90 hover:text-gold transition"
        >
          Explore by state <span aria-hidden>→</span>
        </Link>
        <div className="sr-only">{STATES.length} states tracked</div>
      </div>

      {/* Floating compose button */}
      <button
        onClick={() => setUploadOpen(true)}
        className="fixed bottom-24 right-5 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-gold to-amber-500 text-[var(--navy-deep)] shadow-2xl shadow-gold/30 flex items-center justify-center hover:scale-105 transition"
        aria-label="File a Citizen Report"
      >
        <Video className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <UploadSheet
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onPublish={(r) => setReports((prev) => [r, ...prev])}
      />
    </div>
  );
}
