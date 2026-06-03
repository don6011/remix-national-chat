import { VENUES } from "@/lib/venues";
import bigTexBanner from "@/assets/big-tex-sports-bar.png.asset.json";
import mississippiBluesBar from "@/assets/mississippi-blues-bar.png.asset.json";
import mississippiSportsBar from "@/assets/mississippi-sports-bar.png.asset.json";

export type Destination = {
  id: string;
  emoji: string;
  name: string;
  inside: number;
  blurb: string;
  bg: string;
  glow: string;
  image?: string;
  flagship?: boolean;
};

const VENUE_EMOJI: Record<string, string> = {
  bar: "🍺",
  "coffee-shop": "☕",
  "town-hall": "🏛",
  "sports-bar": "🏈",
  "business-district": "💼",
  "local-stage": "🎸",
};

const OVERRIDES: Record<string, Partial<Destination>[]> = {
  texas: [
    {
      id: "sports-bar",
      name: "Big Tex Sports Bar",
      inside: 1938,
      blurb: "Grab a seat. Rivalries exploding tonight.",
      bg: "from-[oklch(0.22_0.20_28)] via-[oklch(0.16_0.14_20)] to-[oklch(0.10_0.06_10)]",
      glow: "oklch(0.70 0.24 28)",
      image: bigTexBanner.url,
      flagship: true,
    },
    { id: "coffee-shop", name: "Hill Country Coffee Shop", inside: 964, blurb: "Slow conversations and life advice." },
    { id: "town-hall", name: "Lone Star Town Hall", inside: 1205, blurb: "Election season heating up." },
    { id: "local-stage", name: "Austin Local Stage", inside: 602, blurb: "Unsigned artists performing live." },
    { id: "business-district", name: "Dallas Business District", inside: 488, blurb: "Deals, hiring boards, ambition on tap." },
    { id: "bar", name: "The Roadhouse Bar", inside: 731, blurb: "Jokes, memes, late-night Texas energy." },
  ],
  mississippi: [
    {
      id: "bar",
      name: "Mississippi Blues",
      inside: 412,
      blurb: "Delta blues, neon haze, soul on tap.",
      bg: "from-[oklch(0.22_0.10_320)] via-[oklch(0.16_0.08_300)] to-[oklch(0.10_0.05_280)]",
      glow: "oklch(0.74 0.16 330)",
      image: mississippiBluesBar.url,
      flagship: true,
    },
    {
      id: "sports-bar",
      name: "Mississippi Sports Bar",
      inside: 288,
      blurb: "SEC nights and Delta loyalty.",
      bg: "from-[oklch(0.22_0.16_28)] via-[oklch(0.16_0.12_20)] to-[oklch(0.10_0.06_10)]",
      glow: "oklch(0.70 0.22 28)",
      image: mississippiSportsBar.url,
    },
  ],
};

export function getDestinations(stateId: string, baseLive: number): Destination[] {
  const overrides = OVERRIDES[stateId] ?? [];
  const byId = new Map(overrides.map((o) => [o.id!, o]));

  return VENUES.map((venue, i) => {
    const override = byId.get(venue.id) ?? {};
    return {
      id: venue.id,
      emoji: VENUE_EMOJI[venue.id] ?? "✨",
      name: override.name ?? venue.name,
      inside: override.inside ?? Math.max(40, Math.floor(baseLive / (3 + i))),
      blurb: override.blurb ?? venue.description,
      bg: override.bg ?? venue.gradient,
      glow: override.glow ?? venue.glow,
      image: override.image,
      flagship: override.flagship,
    };
  });
}
