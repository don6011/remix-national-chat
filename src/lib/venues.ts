import {
  Beer, Coffee, Landmark, Trophy, Briefcase, Mic2, type LucideIcon,
} from "lucide-react";

export type Venue = {
  id: string;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  /** atmosphere gradient used when entering venue */
  gradient: string;
  glow: string;
  pinned: string;
  cta: string;
};

export const VENUES: Venue[] = [
  {
    id: "bar",
    name: "The Bar",
    short: "Casual hangout",
    description: "Jokes, daily talk, late-night energy.",
    icon: Beer,
    gradient: "from-[oklch(0.22_0.08_55)] via-[oklch(0.16_0.06_40)] to-[oklch(0.10_0.04_30)]",
    glow: "oklch(0.78 0.14 60)",
    pinned: "Warm lounge tonight — keep it light.",
    cta: "Pull up a stool",
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    short: "Thoughtful talks",
    description: "Advice, careers, relationships, reflection.",
    icon: Coffee,
    gradient: "from-[oklch(0.22_0.06_55)] via-[oklch(0.18_0.05_40)] to-[oklch(0.14_0.04_50)]",
    glow: "oklch(0.74 0.10 55)",
    pinned: "Today's thread: career pivots after 30.",
    cta: "Sit by the window",
  },
  {
    id: "town-hall",
    name: "Town Hall",
    short: "Community discussion",
    description: "Local issues, state news, civic talk.",
    icon: Landmark,
    gradient: "from-[oklch(0.18_0.05_260)] via-[oklch(0.14_0.04_260)] to-[oklch(0.10_0.03_260)]",
    glow: "oklch(0.82 0.14 85)",
    pinned: "On the floor: housing affordability.",
    cta: "Take the floor",
  },
  {
    id: "sports-bar",
    name: "Sports Bar",
    short: "Game-night energy",
    description: "Rivalries, live games, hot takes.",
    icon: Trophy,
    gradient: "from-[oklch(0.20_0.16_25)] via-[oklch(0.16_0.12_20)] to-[oklch(0.10_0.06_10)]",
    glow: "oklch(0.70 0.22 25)",
    pinned: "Tonight: Cowboys @ Eagles, 8:20 ET.",
    cta: "Grab a seat at the bar",
  },
  {
    id: "business-district",
    name: "Business District",
    short: "Money & networking",
    description: "Entrepreneurs, jobs, deals, ideas.",
    icon: Briefcase,
    gradient: "from-[oklch(0.18_0.06_240)] via-[oklch(0.14_0.05_250)] to-[oklch(0.10_0.04_260)]",
    glow: "oklch(0.74 0.14 230)",
    pinned: "Hiring board: 14 new roles in DFW.",
    cta: "Step onto the floor",
  },
  {
    id: "local-stage",
    name: "Local Stage",
    short: "Creators & open mic",
    description: "Music, performers, talent, spotlight.",
    icon: Mic2,
    gradient: "from-[oklch(0.22_0.14_320)] via-[oklch(0.16_0.10_300)] to-[oklch(0.10_0.06_280)]",
    glow: "oklch(0.74 0.18 320)",
    pinned: "On stage now: Austin singer-songwriters.",
    cta: "Step into the spotlight",
  },
];

export const getVenue = (id: string) => VENUES.find((v) => v.id === id);
