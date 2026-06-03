// Client-side State Intelligence Engine v1 (mock)
// Simulates an hourly AI refresh by rotating topics, moods, momentum and
// venue highlights through deterministic per-state pools.
//
// When Lovable Cloud + AI Gateway is enabled later, swap `getIntelligence`
// to read from the `state_intelligence` table; the shape below is the
// canonical contract.

export type Mood =
  | "electric"
  | "rowdy"
  | "soulful"
  | "buzzing"
  | "sharp"
  | "sunlit"
  | "neon"
  | "smoky";

export type ActivityLevel = "calm" | "warming" | "buzzing" | "packed" | "on fire";

export type StateIntelligence = {
  stateCode: string;
  primaryTopic: string;       // headline trending topic (the 🔥 one)
  secondaryTopic: string;     // softer side-conversation
  activityLevel: ActivityLevel;
  mood: Mood;
  rivalState: string;         // e.g. "Oklahoma"
  momentumScore: number;      // -100..+100
  trendingReason: string;     // short why-string
  topVenue: string;           // descriptor like "Sports Bar packed"
  updatedAt: number;          // ms
};

type Pool = {
  topics: string[];
  secondary: string[];
  reasons: string[];
  venues: string[];
  moods: Mood[];
  rivals: string[];
};

const POOLS: Record<string, Pool> = {
  texas: {
    topics: [
      "Cowboys vs Eagles tonight",
      "Best BBQ in Austin — settle it",
      "Is Houston the new tech capital?",
      "Friday night lights — week 9 picks",
      "Dallas vs Houston, who runs Texas?",
    ],
    secondary: ["Tex-Mex showdown", "Whataburger vs In-N-Out (again)", "SXSW 2026 lineup leaks"],
    reasons: ["NFL Sunday", "Rivalry week", "Late-night sports bar surge"],
    venues: ["Sports Bar packed", "Honky Tonk filling up", "Tailgate Lounge live"],
    moods: ["rowdy", "electric", "smoky"],
    rivals: ["Oklahoma", "California", "Florida"],
  },
  florida: {
    topics: [
      "Best beach in the panhandle?",
      "Hurricane season vibes — who's prepping?",
      "Miami vs Tampa nightlife — verdict?",
      "Spring break early predictions",
      "Is Florida still the #1 move state?",
    ],
    secondary: ["Cuban sandwich rankings", "Disney vs Universal 2026", "Keys road trip planning"],
    reasons: ["Beach weather", "Nightlife peak", "Migration debate"],
    venues: ["Beach Debate live", "Boardwalk Lounge buzzing", "Pool Deck filling"],
    moods: ["sunlit", "neon", "buzzing"],
    rivals: ["California", "Texas", "New York"],
  },
  mississippi: {
    topics: [
      "Delta blues showcase 9pm CT",
      "Best fried catfish in the state",
      "Magnolia State pride — what defines us?",
      "Friday night juke joint roll call",
      "Mississippi music heritage — overlooked?",
    ],
    secondary: ["Gulf Coast weekend plans", "Ole Miss vs State trash talk", "Hometown diner tier list"],
    reasons: ["Blues night", "Local stage spotlight", "Heritage hour"],
    venues: ["Blues Night Live", "Juke Joint filling up", "Front Porch buzzing"],
    moods: ["soulful", "smoky", "warming" as Mood],
    rivals: ["Alabama", "Louisiana", "Tennessee"],
  },
  tennessee: {
    topics: [
      "Nashville artist spotlight tonight",
      "Best honky tonk on Broadway",
      "Memphis BBQ vs Nashville hot chicken",
      "Open mic — who's the next big thing?",
      "Titans bouncing back — for real this time?",
    ],
    secondary: ["Smoky Mountains weekend", "Bluebird Cafe lineup leak", "Beale Street vs Broadway"],
    reasons: ["Live music night", "Songwriter round", "Local stage spotlight"],
    venues: ["Local Stage buzzing", "Honky Tonk packed", "Songwriter Round live"],
    moods: ["electric", "soulful", "buzzing"],
    rivals: ["Kentucky", "Georgia", "Mississippi"],
  },
  california: {
    topics: [
      "Best creator city — LA, SF, or SD?",
      "AI startup grind vs Hollywood grind",
      "Is California still worth the rent?",
      "Sunset District vs Venice — vibes check",
      "Lakers vs Warriors — who owns the coast?",
    ],
    secondary: ["Best taco truck in the state", "PCH road trip stops", "Tech layoffs talk"],
    reasons: ["Creator hour", "Tech debate peak", "Coastal sunset surge"],
    venues: ["Creator District packed", "Sunset Lounge live", "Studio Lot buzzing"],
    moods: ["neon", "sunlit", "electric"],
    rivals: ["Texas", "New York", "Florida"],
  },
  "new-york": {
    topics: [
      "AI replacing jobs — finance edition",
      "Best slice in the five boroughs",
      "Subway closures — what's happening",
      "Brooklyn vs Manhattan nightlife",
      "Is NYC still the financial capital?",
    ],
    secondary: ["Knicks playoff hopes", "Best bagel spot, no debate", "Hamptons weekend recap"],
    reasons: ["Markets close", "Late commute surge", "Nightlife peak"],
    venues: ["Business District active", "Rooftop Lounge live", "Late Train Car buzzing"],
    moods: ["sharp", "electric", "neon"],
    rivals: ["California", "New Jersey", "Massachusetts"],
  },
};

const ACTIVITY_LADDER: ActivityLevel[] = ["calm", "warming", "buzzing", "packed", "on fire"];

// Deterministic pick from a tick — so all clients viewing at the same hour
// see the same intelligence, simulating a shared backend.
function pick<T>(arr: T[], tick: number, offset = 0): T {
  return arr[(tick + offset) % arr.length];
}

/**
 * Current "tick" — advances once per hour. During a session we also expose
 * a faster preview tick via `useStateIntelligence` so the UI feels alive.
 */
export function currentHourTick(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

export function getIntelligence(stateId: string, tick: number): StateIntelligence | null {
  const pool = POOLS[stateId];
  if (!pool) return null;

  const activityIdx = (tick * 7 + stateId.length) % ACTIVITY_LADDER.length;
  // Momentum oscillates -40..+85 with a state-specific phase.
  const phase = stateId.charCodeAt(0);
  const momentum = Math.round(
    Math.sin((tick + phase) / 3) * 55 + 25 + ((tick + phase) % 5)
  );

  return {
    stateCode: stateId,
    primaryTopic: pick(pool.topics, tick),
    secondaryTopic: pick(pool.secondary, tick, 1),
    activityLevel: ACTIVITY_LADDER[activityIdx],
    mood: pick(pool.moods, tick, 2),
    rivalState: pick(pool.rivals, tick, 3),
    momentumScore: momentum,
    trendingReason: pick(pool.reasons, tick),
    topVenue: pick(pool.venues, tick, 1),
    updatedAt: Date.now(),
  };
}
