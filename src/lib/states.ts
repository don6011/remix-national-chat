import texasBanner from "@/assets/texas-lone-star-banner.png.asset.json";
import floridaBanner from "@/assets/florida-welcome-banner.png.asset.json";
import mississippiBanner from "@/assets/mississippi-welcome-banner.png.asset.json";
import tennesseeBanner from "@/assets/tennessee-welcome-banner.png.asset.json";
import californiaBanner from "@/assets/california-welcome-banner.png.asset.json";
import newYorkBanner from "@/assets/new-york-welcome-banner.png.asset.json";

export type StateVibe = {
  id: string;
  name: string;
  abbr: string;
  tagline: string;
  vibe: string;
  emoji: string;
  live: number;
  trend: "rising" | "active" | "hot";
  trendingTopic: string;
  // Tailwind gradient + glow colors
  gradient: string; // background gradient
  glow: string; // accent ring/glow color (rgba or oklch)
  accent: string; // hex/oklch label
  atmosphere: string; // short atmosphere description
  image?: string; // hero banner image URL
};

export const STATES: StateVibe[] = [
  {
    id: "texas",
    name: "Texas",
    abbr: "TX",
    tagline: "Everything's louder.",
    vibe: "Sports Bar packed",
    emoji: "🤠",
    live: 4823,
    trend: "hot",
    trendingTopic: "Cowboys vs Eagles tonight",
    gradient:
      "from-[oklch(0.22_0.10_55)] via-[oklch(0.18_0.08_40)] to-[oklch(0.12_0.05_30)]",
    glow: "oklch(0.78 0.16 60)",
    accent: "amber",
    atmosphere: "Lone Star, warm amber, stadium energy",
    image: texasBanner.url,
  },
  {
    id: "florida",
    name: "Florida",
    abbr: "FL",
    tagline: "Coastal current.",
    vibe: "Beach Debate live",
    emoji: "🏖",
    live: 4448,
    trend: "active",
    trendingTopic: "Best beach in the panhandle?",
    gradient:
      "from-[oklch(0.22_0.14_200)] via-[oklch(0.18_0.12_320)] to-[oklch(0.14_0.08_280)]",
    glow: "oklch(0.72 0.18 200)",
    accent: "cyan",
    atmosphere: "Neon coast, palm silhouettes, ocean glow",
    image: floridaBanner.url,
  },
  {
    id: "mississippi",
    name: "Mississippi",
    abbr: "MS",
    tagline: "River & Blues.",
    vibe: "Blues Night Live",
    emoji: "🎷",
    live: 578,
    trend: "rising",
    trendingTopic: "Delta blues showcase 9pm CT",
    gradient:
      "from-[oklch(0.20_0.08_320)] via-[oklch(0.16_0.06_300)] to-[oklch(0.12_0.04_280)]",
    glow: "oklch(0.70 0.14 340)",
    accent: "magnolia",
    atmosphere: "Blues club, magnolia warmth, river haze",
    image: mississippiBanner.url,
  },
  {
    id: "tennessee",
    name: "Tennessee",
    abbr: "TN",
    tagline: "Stage lights on.",
    vibe: "Local Stage buzzing",
    emoji: "🎸",
    live: 2104,
    trend: "rising",
    trendingTopic: "Open mic Nashville — new artists",
    gradient:
      "from-[oklch(0.22_0.12_30)] via-[oklch(0.16_0.08_20)] to-[oklch(0.12_0.05_280)]",
    glow: "oklch(0.76 0.18 30)",
    accent: "ember",
    atmosphere: "Nashville lights, guitar silhouettes",
    image: tennesseeBanner.url,
  },
  {
    id: "california",
    name: "California",
    abbr: "CA",
    tagline: "Sunset coast.",
    vibe: "Creator District packed",
    emoji: "🎬",
    live: 6912,
    trend: "hot",
    trendingTopic: "LA vs SF — which city wins 2026?",
    gradient:
      "from-[oklch(0.24_0.14_25)] via-[oklch(0.20_0.12_340)] to-[oklch(0.14_0.08_280)]",
    glow: "oklch(0.78 0.16 30)",
    accent: "sunset",
    atmosphere: "Sunset gradient, coast & creator culture",
    image: californiaBanner.url,
  },
  {
    id: "new-york",
    name: "New York",
    abbr: "NY",
    tagline: "Skyline awake.",
    vibe: "Business District active",
    emoji: "💼",
    live: 5320,
    trend: "active",
    trendingTopic: "Subway closures — what's happening",
    gradient:
      "from-[oklch(0.18_0.06_240)] via-[oklch(0.14_0.04_260)] to-[oklch(0.10_0.03_260)]",
    glow: "oklch(0.72 0.14 240)",
    accent: "steel",
    atmosphere: "Skyline glow, financial district, city pulse",
    image: newYorkBanner.url,
  },
];

export const getState = (id: string) => STATES.find((s) => s.id === id);
