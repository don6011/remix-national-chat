import {
  Beer, Coffee, Landmark, Mic2, type LucideIcon,
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
    id: "town-hall",
    name: "Town Hall",
    short: "Community discussion",
    description: "Local issues, state news, civic talk.",
    icon: Landmark,
    gradient: "from-[#16285A] via-[#0D1B3E] to-[#08122A]",
    glow: "#C9A84C",
    pinned: "On the floor: housing affordability.",
    cta: "Take the floor",
  },
  {
    id: "bar",
    name: "The Bar",
    short: "Casual hangout",
    description: "Jokes, daily talk, late-night energy.",
    icon: Beer,
    gradient: "from-[#2A1B3E] via-[#1B1330] to-[#0D0820]",
    glow: "#C9A84C",
    pinned: "Warm lounge tonight — keep it light.",
    cta: "Pull up a stool",
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    short: "Thoughtful talks",
    description: "Advice, careers, relationships, reflection.",
    icon: Coffee,
    gradient: "from-[#2E2418] via-[#1F1810] to-[#120D08]",
    glow: "#C9A84C",
    pinned: "Today's thread: career pivots after 30.",
    cta: "Sit by the window",
  },
  {
    id: "local-stage",
    name: "Local Stage",
    short: "Creators & open mic",
    description: "Music, performers, talent, spotlight.",
    icon: Mic2,
    gradient: "from-[#3A1A40] via-[#241030] to-[#120820]",
    glow: "#C9A84C",
    pinned: "On stage now: local singer-songwriters.",
    cta: "Step into the spotlight",
  },
];

export const getVenue = (id: string) => VENUES.find((v) => v.id === id);
