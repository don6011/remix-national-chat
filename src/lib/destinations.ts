import { VENUES } from "@/lib/venues";

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
  "local-stage": "🎸",
};

const OVERRIDES: Record<string, Partial<Destination>[]> = {
  texas: [
    { id: "town-hall", name: "Lone Star Town Hall", inside: 1205, blurb: "Election season heating up." },
    { id: "bar", name: "The Roadhouse Bar", inside: 731, blurb: "Jokes, memes, late-night Texas energy." },
    { id: "coffee-shop", name: "Hill Country Coffee Shop", inside: 964, blurb: "Slow conversations and life advice." },
    { id: "local-stage", name: "Austin Local Stage", inside: 602, blurb: "Unsigned artists performing live." },
  ],
  mississippi: [
    { id: "town-hall", name: "Mississippi Town Hall", inside: 318, blurb: "Delta voices on local matters." },
    { id: "bar", name: "Mississippi Blues", inside: 412, blurb: "Delta blues, neon haze, soul on tap." },
    { id: "coffee-shop", name: "Magnolia Coffee Shop", inside: 197, blurb: "Quiet mornings, deep conversations." },
    { id: "local-stage", name: "Delta Local Stage", inside: 244, blurb: "Blues, soul, and gospel performers." },
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
