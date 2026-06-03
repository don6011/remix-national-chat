export type ChatMessage = {
  id: string;
  user: string;
  state: string;
  status: string;
  message: string;
  time: string;
  reactions?: { emoji: string; count: number; userReacted?: boolean }[];
  authorId?: string;
};

const NAMES = [
  "Marisol", "Jaylen", "Beau", "Priya", "Devon", "Linnea", "Tomás", "Kenji",
  "Reese", "Ari", "Sloane", "Marcus", "Hattie", "Cyrus", "Imani", "Nico",
];

const STATUSES = [
  "Citizen", "Verified Resident", "Founding Citizen", "State Contributor",
  "State Ambassador", "Patriot Plus", "Patriot Elite",
];

const STATE_TAGS = ["TX", "FL", "CA", "NY", "MS", "TN", "GA", "OH", "MI", "WA"];

function rnd<T>(arr: T[], i: number): T { return arr[i % arr.length]; }

export function buildChat(seed: number, prompts: string[]): ChatMessage[] {
  return prompts.map((message, i) => ({
    id: `${seed}-${i}`,
    user: rnd(NAMES, seed + i),
    state: rnd(STATE_TAGS, seed + i * 3),
    status: rnd(STATUSES, seed + i * 2),
    message,
    time: `${(i + 1) * 2}m`,
    reactions: i % 2 === 0
      ? [{ emoji: "🔥", count: 3 + (i % 7) }, { emoji: "🇺🇸", count: 1 + (i % 4) }]
      : [{ emoji: "💬", count: 2 + (i % 5) }],
  }));
}

export const NATIONAL_PROMPTS = [
  "Anyone else feel like tonight's chamber is electric?",
  "Texas just packed the sports bar — Florida, your move.",
  "Hot take: the best state coffee shop is Tennessee's.",
  "Tuning in from Detroit — what's the trending poll?",
  "California creators are dropping new sets in Local Stage.",
  "Y'all see Mississippi's blues night queue? It's stacked.",
];

export const VENUE_PROMPTS: Record<string, string[]> = {
  "bar": [
    "Pulled up. Bartender, surprise me.",
    "What's everyone drinking tonight?",
    "Friday energy in here is unreal.",
    "Tell me your weirdest road trip story.",
  ],
  "coffee-shop": [
    "Anyone else rethinking their career at 31?",
    "What book are you halfway through right now?",
    "Need advice: long-distance move for a job.",
    "Slow morning. Pour-over and a window seat.",
  ],
  "town-hall": [
    "Property taxes — what are we actually doing here?",
    "Heard from the school board last night. Thoughts?",
    "We need a real housing conversation in this state.",
    "Mic check — anyone from the rural counties?",
  ],
  "sports-bar": [
    "DAK BETTER COOK TONIGHT.",
    "Eagles defense is no joke, gonna be a fight.",
    "Whoever has the remote — turn it UP.",
    "Side bet: over/under on penalties = 12.5.",
  ],
  "business-district": [
    "Anyone hiring senior PMs in Austin?",
    "Just closed our seed. AMA in 20.",
    "Best co-working in Dallas right now?",
    "Looking for a CTO co-founder — fintech.",
  ],
  "local-stage": [
    "Up next: acoustic set from a Houston songwriter.",
    "Drop your SoundCloud — I'm listening to everyone.",
    "That last vocal run was UNREAL.",
    "Open mic sign-ups still open for 30 min.",
  ],
};

/** Texas-flavored overrides — used inside the Texas Space */
export const TEXAS_VENUE_PROMPTS: Record<string, string[]> = {
  "bar": [
    "Honky-tonk or dive bar — what's the move tonight?",
    "Two-stepping at Broken Spoke later, who's in?",
    "Best margarita in the state — go.",
    "Austin vs Dallas nightlife. Settle it.",
  ],
  "coffee-shop": [
    "Moved from Cali to Austin — what should I know?",
    "Best slow-pour spot in Houston?",
    "Career advice: stay corporate or go indie?",
    "Quiet morning in Fort Worth. Anyone else up?",
  ],
  "town-hall": [
    "Property taxes in Travis County — let's talk.",
    "Grid reliability. Real talk, no spin.",
    "School board meeting last night was wild.",
    "Border policy thread — keep it respectful.",
  ],
  "sports-bar": [
    "COWBOYS @ EAGLES tonight. Pull up.",
    "Dak needs 3 TDs or we riot. Civilly.",
    "Astros offseason — who do we sign?",
    "Mavs > Spurs. Fight me, San Antonio.",
    "Longhorns vs Aggies week. The rivalry is BACK.",
  ],
  "business-district": [
    "Austin tech scene — still hot or cooled?",
    "Hiring 4 engineers in Houston energy sector.",
    "Anyone raising Series A in DFW right now?",
    "Best Texas city for a remote founder?",
  ],
  "local-stage": [
    "Live now: singer-songwriter from East Austin.",
    "Red Dirt or outlaw country — pick your fighter.",
    "Open mic at the Continental Club, 9pm CT.",
    "Drop your SoundCloud, Texas. We listening.",
  ],
};
