// Venue Personality Engine — every (state, venue) feels like a real destination.

export type PulseItemSeed = {
  kind: "arrival" | "moment" | "trending" | "action" | "badge";
  icon: string;
  text: string;
  sub?: string;
};

export type IntelContributor = { name: string; status: string; score: string };
export type IntelLegend = { name: string; title: string };

export type VenuePersonality = {
  /** Override the venue display name & subtitle when this place is the state's flagship */
  displayName?: string;
  subtitle: string;
  /** One-line italic flavor description */
  description?: string;
  /** 5 escalating pulse stage names: low → max */
  pulseLabels: [string, string, string, string, string];
  /** Action verb chips users see ("Hot Take Posted", "Song Requested", …) */
  postVerbs: string[];
  /** Featured "room moments" surfaced under the pinned card */
  moments: string[];
  /** Earnable badges */
  badges: { emoji: string; label: string }[];
  /** Primary call-to-action button label on the pinned card */
  primaryCta: string;
  /** Secondary CTA chips */
  ctas: string[];
  /** Pinned headline shown above chat */
  pinned: string;
  /** Chat composer placeholder */
  placeholder: string;
  /** Seeded "Room Pulse" activity items */
  activity: PulseItemSeed[];
  /** Inside The Room — venue intelligence */
  intel: {
    topContributors: IntelContributor[];
    legends: IntelLegend[];
    trendingTopics: string[];
    mostReacted: string;
    fastestRising: string;
    history: string;
  };
};

/* ------------------------------------------------------------------ */
/* Generic per-venue fallbacks (used when no flagship override exists) */
/* ------------------------------------------------------------------ */

const BASE: Record<string, VenuePersonality> = {
  bar: {
    subtitle: "The Bar",
    pulseLabels: ["Quiet", "Warming", "Buzzing", "Packed", "Roaring"],
    postVerbs: ["Round Started", "Toast Raised", "Story Dropped", "Jukebox Pick"],
    moments: ["Late-night thread rising", "Toast going around", "Jukebox war"],
    badges: [
      { emoji: "🍺", label: "Regular" },
      { emoji: "🎶", label: "Jukebox King" },
      { emoji: "🥃", label: "Last Call Legend" },
    ],
    primaryCta: "Pull up a stool",
    ctas: ["Buy the room a round", "Raise a toast"],
    pinned: "Warm lounge tonight — keep it light.",
    placeholder: "Say something at the bar…",
    activity: [
      { kind: "arrival", icon: "🚪", text: "A new regular walked in" },
      { kind: "action", icon: "🥃", text: "Marcus raised a toast", sub: "12 cheers" },
      { kind: "trending", icon: "🎶", text: "Jukebox war heating up" },
    ],
    intel: {
      topContributors: [
        { name: "Marcus", status: "Regular", score: "+42 tonight" },
        { name: "Linnea", status: "Bartender", score: "+38" },
      ],
      legends: [{ name: "BarStarBeau", title: "Last Call Legend" }],
      trendingTopics: ["Best dive bar in town", "Jukebox picks"],
      mostReacted: "“The bartender just gave me life advice.” · 🔥 84",
      fastestRising: "NightOwlNico — joined 12 min ago",
      history: "Opened opening night. 12,481 toasts raised since.",
    },
  },
  "coffee-shop": {
    subtitle: "Coffee Shop",
    pulseLabels: ["Sleepy", "Slow Pour", "Steady", "Full House", "Standing Room"],
    postVerbs: ["Thought Shared", "Question Asked", "Advice Given", "Story Opened"],
    moments: ["Career thread rising", "Quiet morning deep talk", "Book club moment"],
    badges: [
      { emoji: "☕", label: "Morning Regular" },
      { emoji: "📖", label: "Storyteller" },
      { emoji: "🧠", label: "Trusted Voice" },
    ],
    primaryCta: "Sit by the window",
    ctas: ["Order a refill", "Open a thread"],
    pinned: "Today's thread: career pivots after 30.",
    placeholder: "Say something at the coffee shop…",
    activity: [
      { kind: "moment", icon: "☕", text: "Pour-over hour is live", sub: "slow & honest" },
      { kind: "action", icon: "💬", text: "Priya opened a long thread", sub: "career pivots" },
      { kind: "trending", icon: "📖", text: "Book recs trending" },
    ],
    intel: {
      topContributors: [
        { name: "Priya", status: "Trusted Voice", score: "+58" },
        { name: "Devon", status: "Regular", score: "+31" },
      ],
      legends: [{ name: "SlowPourSloane", title: "Storyteller of the Year" }],
      trendingTopics: ["Career pivots after 30", "Reading right now"],
      mostReacted: "“Quit my corporate job. AMA.” · 🔥 212",
      fastestRising: "QuietCyrus — first post 4 min ago",
      history: "5,902 long-form threads opened here.",
    },
  },
  "town-hall": {
    subtitle: "Town Hall",
    pulseLabels: ["Empty Floor", "Gathering", "In Session", "Heated", "On Fire"],
    postVerbs: ["Floor Taken", "Motion Filed", "Question Raised", "Vote Cast"],
    moments: ["Floor debate live", "Public comment open", "Vote tally rising"],
    badges: [
      { emoji: "🏛️", label: "Civic Voice" },
      { emoji: "📜", label: "Policy Wonk" },
      { emoji: "🗳️", label: "Vote Caller" },
    ],
    primaryCta: "Take the floor",
    ctas: ["File a motion", "Cast your vote"],
    pinned: "On the floor: housing affordability.",
    placeholder: "Say something at the town hall…",
    activity: [
      { kind: "action", icon: "🎙️", text: "Hattie took the floor", sub: "schools" },
      { kind: "trending", icon: "🗳️", text: "Housing vote climbing" },
      { kind: "moment", icon: "📜", text: "Motion filed: zoning reform" },
    ],
    intel: {
      topContributors: [
        { name: "Hattie", status: "Civic Voice", score: "+71" },
        { name: "Imani", status: "Policy Wonk", score: "+44" },
      ],
      legends: [{ name: "MayorMarcus", title: "Founding Voice" }],
      trendingTopics: ["Housing", "School board", "Property taxes"],
      mostReacted: "“We need to talk about zoning, for real.” · 🔥 167",
      fastestRising: "NewCouncilNico — 2 hrs in",
      history: "1,204 motions debated on this floor.",
    },
  },
  "sports-bar": {
    subtitle: "Sports Bar",
    pulseLabels: ["Quiet", "Warming", "Buzzing", "Packed", "Exploding"],
    postVerbs: ["Hot Take Posted", "Rivalry Ignited", "Tailgate Started", "Prediction Submitted"],
    moments: ["Rivalry Exploding", "BBQ Debate Trending", "Prediction Contest Live", "Crowd Going Wild"],
    badges: [
      { emoji: "🚙", label: "Tailgate MVP" },
      { emoji: "🔥", label: "Hot Take Champion" },
      { emoji: "⚔️", label: "Rivalry King" },
      { emoji: "🏆", label: "Sports Bar Legend" },
      { emoji: "🎯", label: "Prediction Master" },
    ],
    primaryCta: "Grab a seat at the bar",
    ctas: ["Pull up a stool", "Drop your hot take"],
    pinned: "Game on — pull up and get loud.",
    placeholder: "Shout your take at the bar…",
    activity: [
      { kind: "moment", icon: "🔥", text: "Rivalry exploding", sub: "+412 replies / 5 min" },
      { kind: "action", icon: "🎯", text: "DebateCaptain submitted a prediction" },
      { kind: "badge", icon: "🏆", text: "TailgateKing earned Game Night Legend" },
    ],
    intel: {
      topContributors: [
        { name: "TailgateKing", status: "Sports Bar Legend", score: "+184" },
        { name: "DebateCaptain", status: "Hot Take Champion", score: "+121" },
      ],
      legends: [{ name: "BrisketBoss", title: "Rivalry King" }],
      trendingTopics: ["Tonight's game", "BBQ war", "Refs ruining it"],
      mostReacted: "“DAK BETTER COOK TONIGHT.” · 🔥 304",
      fastestRising: "Section138 — pulled up 6 min ago",
      history: "8,402 hot takes posted. 1,204 rivalries ignited.",
    },
  },
  "business-district": {
    subtitle: "Business District",
    pulseLabels: ["Closed", "Opening Bell", "Active", "Hot Floor", "Bull Run"],
    postVerbs: ["Idea Pitched", "Role Posted", "Deal Floated", "AMA Started"],
    moments: ["Pitch live", "Hiring rush", "Deal of the day"],
    badges: [
      { emoji: "💼", label: "Operator" },
      { emoji: "🚀", label: "Founder" },
      { emoji: "🧭", label: "Connector" },
    ],
    primaryCta: "Step onto the floor",
    ctas: ["Pitch an idea", "Post a role"],
    pinned: "Hiring board: 14 new roles tonight.",
    placeholder: "Say something on the floor…",
    activity: [
      { kind: "action", icon: "🚀", text: "Ari pitched a seed-stage idea" },
      { kind: "trending", icon: "💼", text: "Senior PM roles trending" },
      { kind: "moment", icon: "🤝", text: "Founder AMA at 9pm" },
    ],
    intel: {
      topContributors: [
        { name: "Ari", status: "Founder", score: "+92" },
        { name: "Reese", status: "Operator", score: "+47" },
      ],
      legends: [{ name: "FounderFin", title: "Connector of the Year" }],
      trendingTopics: ["Hiring", "Seed rounds", "Remote vs office"],
      mostReacted: "“Just closed our seed. AMA in 20.” · 🔥 188",
      fastestRising: "PitchPriya — first pitch 8 min ago",
      history: "2,108 ideas pitched. 412 roles filled.",
    },
  },
  "local-stage": {
    subtitle: "Local Stage",
    pulseLabels: ["Tuning Up", "Playing", "Buzzing", "Performing", "Headlining"],
    postVerbs: ["Artist Took Stage", "Open Mic Started", "Crowd Favorite Rising", "New Talent Discovered"],
    moments: ["Encore Requested", "Audience Vote Open", "Performance Of The Night", "Artist Spotlight"],
    badges: [
      { emoji: "🎤", label: "Stage Veteran" },
      { emoji: "🎶", label: "Encore Winner" },
      { emoji: "🎧", label: "Music Scout" },
      { emoji: "✨", label: "Nashville Spotlight" },
    ],
    primaryCta: "Step into the spotlight",
    ctas: ["Take the mic", "Discover new talent"],
    pinned: "On stage now — fresh open mic set.",
    placeholder: "Say something to the crowd…",
    activity: [
      { kind: "moment", icon: "🎤", text: "Artist took the stage", sub: "set #3 tonight" },
      { kind: "action", icon: "🎶", text: "Encore requested", sub: "+82 votes" },
      { kind: "badge", icon: "✨", text: "Kenji earned Encore Winner" },
    ],
    intel: {
      topContributors: [
        { name: "Kenji", status: "Stage Veteran", score: "+118" },
        { name: "Sloane", status: "Music Scout", score: "+74" },
      ],
      legends: [{ name: "NashvilleNico", title: "Spotlight Legend" }],
      trendingTopics: ["Open mic tonight", "New artists", "Songwriter circle"],
      mostReacted: "“That last vocal run was UNREAL.” · 🔥 241",
      fastestRising: "FirstSetFin — first song 3 min ago",
      history: "3,902 sets performed. 47 artists discovered.",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Flagship overrides per (state, venue)                              */
/* ------------------------------------------------------------------ */

const FLAGSHIPS: Record<string, Partial<VenuePersonality>> = {
  "texas:sports-bar": {
    displayName: "Big Tex Sports Bar",
    description: "Rivalries. Live games. Hot takes. Loud-and-proud Texas energy.",
    pinned: "🏈 Cowboys @ Eagles · 8:20 ET · Rivalry night",
    activity: [
      { kind: "arrival", icon: "🤠", text: "14 citizens joined from Dallas", sub: "tailgate convoy" },
      { kind: "trending", icon: "🔥", text: "BBQ State War trending", sub: "Texas vs Kansas City" },
      { kind: "moment", icon: "🏟️", text: "Section 138 just walked in", sub: "Arlington" },
      { kind: "action", icon: "⚔️", text: "AggieAlex challenged a Longhorn", sub: "rivalry live" },
      { kind: "badge", icon: "👑", text: "DebateCaptain crowned Hot Take Champ" },
      { kind: "moment", icon: "📈", text: "Cowboys debate +800 replies", sub: "thread of the night" },
    ],
    intel: {
      topContributors: [
        { name: "TailgateKing", status: "Tailgate MVP", score: "+241 tonight" },
        { name: "BrisketBoss", status: "Rivalry King", score: "+188" },
        { name: "DebateCaptain", status: "Hot Take Champ", score: "+154" },
      ],
      legends: [
        { name: "LonghornMaya", title: "Founding Citizen" },
        { name: "DallasDeacon", title: "Sports Bar Legend" },
      ],
      trendingTopics: ["Cowboys @ Eagles", "BBQ State War", "Longhorns vs Aggies"],
      mostReacted: "“DAK BETTER COOK TONIGHT.” · 🔥 412",
      fastestRising: "Section138 — pulled up 6 min ago",
      history: "Opened week one. 28,402 hot takes. 1,842 rivalries ignited.",
    },
  },
  "mississippi:bar": {
    displayName: "Mississippi Blues",
    subtitle: "Blues Lounge",
    description: "Live blues, cold drinks, and conversation that runs deep into the night.",
    pulseLabels: ["Silent", "Gathering", "Grooving", "Swinging", "Electric"],
    postVerbs: ["Song Requested", "Performer Took Stage", "Story Shared", "Crowd Applauded"],
    moments: ["Standing Ovation", "Blues Session Started", "Crowd Singing Along", "Delta Story Of The Night"],
    badges: [
      { emoji: "🎷", label: "Blues Legend" },
      { emoji: "🌙", label: "Delta Storyteller" },
      { emoji: "🎤", label: "Stage Favorite" },
      { emoji: "💜", label: "Soul Contributor" },
    ],
    primaryCta: "Grab a seat near the stage",
    ctas: ["Tell your story", "Request a song"],
    pinned: "Live blues tonight — pull up close to the stage.",
    placeholder: "Say something at the blues lounge…",
    activity: [
      { kind: "moment", icon: "🎷", text: "Standing ovation erupted", sub: "set #2 tonight" },
      { kind: "action", icon: "🎶", text: "DeltaDevon requested 'Crossroads'", sub: "82 cosigned" },
      { kind: "trending", icon: "🌙", text: "Delta story of the night rising" },
      { kind: "badge", icon: "💜", text: "MagnoliaMaya earned Soul Contributor" },
    ],
    intel: {
      topContributors: [
        { name: "DeltaDevon", status: "Stage Favorite", score: "+96" },
        { name: "MagnoliaMaya", status: "Delta Storyteller", score: "+72" },
      ],
      legends: [{ name: "RiverhouseRoy", title: "Blues Legend" }],
      trendingTopics: ["Tonight's set", "Best Delta record ever", "Story of the night"],
      mostReacted: "“The harmonica solo just stopped time.” · 🔥 188",
      fastestRising: "FirstNightFin — walked in 4 min ago",
      history: "412 nights of live blues. 1,902 stories shared.",
    },
  },
  "tennessee:local-stage": {
    displayName: "Nashville Local Stage",
    description: "Open mics, new artists, encores — the Nashville discovery floor.",
    pinned: "On stage now — open mic, singer-songwriter night.",
    activity: [
      { kind: "moment", icon: "🎤", text: "New artist discovered", sub: "first set ever" },
      { kind: "action", icon: "🎶", text: "Encore requested", sub: "+142 votes" },
      { kind: "trending", icon: "✨", text: "Performance of the night rising" },
      { kind: "badge", icon: "🎧", text: "MusicScoutMaya earned Nashville Spotlight" },
    ],
    intel: {
      topContributors: [
        { name: "NashvilleNico", status: "Stage Veteran", score: "+148" },
        { name: "MusicScoutMaya", status: "Music Scout", score: "+92" },
      ],
      legends: [
        { name: "EncoreEli", title: "Encore Legend" },
        { name: "SongwriterSloane", title: "Nashville Spotlight" },
      ],
      trendingTopics: ["Open mic tonight", "New artists this week", "Best set you've seen"],
      mostReacted: "“That last vocal run was UNREAL.” · 🔥 312",
      fastestRising: "FirstSetFin — first song 3 min ago",
      history: "1,402 open mic sets. 84 artists discovered on this stage.",
    },
  },
  "florida:bar": {
    displayName: "Florida Beach Club",
    subtitle: "Beach Club",
    description: "Sunset crowds, vacation talk, salt-air conversation.",
    pulseLabels: ["Calm", "Breezy", "Sunny", "Crowded", "Beach Party"],
    postVerbs: ["Sunset Conversation", "Vacation Debate", "Beach Topic Rising", "Coastal Check-In"],
    moments: ["Sunset Crowd Peak", "Beach Debate Trending", "Vacation Poll Live", "Tourist Rush"],
    badges: [
      { emoji: "🌴", label: "Beach Regular" },
      { emoji: "🌅", label: "Sunset Speaker" },
      { emoji: "🗺️", label: "Coastal Guide" },
      { emoji: "🐚", label: "Florida Favorite" },
    ],
    primaryCta: "Pull up a beach chair",
    ctas: ["Join the sunset crowd", "Share your favorite beach"],
    pinned: "Sunset crowd peaking — pull up a chair.",
    placeholder: "Say something at the beach club…",
    activity: [
      { kind: "moment", icon: "🌅", text: "Sunset crowd peaked", sub: "1,204 watching the sky" },
      { kind: "trending", icon: "🌴", text: "Best beach in the panhandle?" },
      { kind: "action", icon: "🗺️", text: "CoastalCyrus dropped a hidden spot" },
      { kind: "badge", icon: "🐚", text: "PalmPriya earned Florida Favorite" },
    ],
    intel: {
      topContributors: [
        { name: "CoastalCyrus", status: "Coastal Guide", score: "+88" },
        { name: "PalmPriya", status: "Beach Regular", score: "+61" },
      ],
      legends: [{ name: "SunsetSloane", title: "Sunset Speaker" }],
      trendingTopics: ["Panhandle vs Keys", "Best beach bar", "Snowbird season"],
      mostReacted: "“Destin sunset > everything.” · 🔥 142",
      fastestRising: "SaltAirAri — checked in 5 min ago",
      history: "902 sunset sessions. 4,210 vacation stories shared.",
    },
  },
  "california:business-district": {
    displayName: "California Creator District",
    subtitle: "Creator District",
    description: "Startups, creators, film, founders — the West Coast pitch floor.",
    pulseLabels: ["Planning", "Building", "Launching", "Trending", "Viral"],
    postVerbs: ["Idea Pitched", "Creator AMA Started", "Startup Rising", "Project Showcase"],
    moments: ["Viral Concept", "Founder Spotlight", "Creator Collaboration", "Pitch Battle"],
    badges: [
      { emoji: "🚀", label: "Creator Legend" },
      { emoji: "🎬", label: "Founder Spotlight" },
      { emoji: "📈", label: "Trend Setter" },
      { emoji: "💡", label: "Innovation Leader" },
    ],
    primaryCta: "Pitch an idea",
    ctas: ["Join the creator circle", "Showcase your project"],
    pinned: "Pitch battle tonight — founders vs creators.",
    placeholder: "Say something to the creator floor…",
    activity: [
      { kind: "trending", icon: "🚀", text: "Startup pitch gaining traction", sub: "+412 / hr" },
      { kind: "moment", icon: "🎬", text: "Creator AMA started", sub: "612 listening" },
      { kind: "badge", icon: "📈", text: "TrendTomás earned Trend Setter" },
      { kind: "action", icon: "💡", text: "InnovaImani dropped a viral concept" },
    ],
    intel: {
      topContributors: [
        { name: "FounderFin", status: "Founder Spotlight", score: "+204" },
        { name: "CreatorClio", status: "Creator Legend", score: "+167" },
      ],
      legends: [
        { name: "PitchPriya", title: "Innovation Leader" },
        { name: "ViralVero", title: "Trend Setter" },
      ],
      trendingTopics: ["AI startups", "Creator economy", "LA vs SF for founders"],
      mostReacted: "“Just closed our seed. AMA in 20.” · 🔥 421",
      fastestRising: "FirstPitchFia — pitched 7 min ago",
      history: "4,820 ideas pitched. 612 creators discovered. 84 startups launched.",
    },
  },
};

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function getVenuePersonality(stateId: string, venueId: string): VenuePersonality {
  const base = BASE[venueId] ?? BASE.bar;
  const override = FLAGSHIPS[`${stateId}:${venueId}`];
  if (!override) return base;
  return {
    ...base,
    ...override,
    badges: override.badges ?? base.badges,
    activity: override.activity ?? base.activity,
    intel: { ...base.intel, ...(override.intel ?? {}) },
  };
}

/** Map an energy 0-100 to a pulse stage label. */
export function pulseStage(personality: VenuePersonality, energy: number): { label: string; index: number } {
  const i = Math.min(4, Math.max(0, Math.floor(energy / 20)));
  return { label: personality.pulseLabels[i], index: i };
}
