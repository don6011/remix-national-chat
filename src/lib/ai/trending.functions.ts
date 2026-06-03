import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getVenuePersonality } from "@/lib/venuePersonality";
import { getState } from "@/lib/states";
import { getVenue } from "@/lib/venues";

const TopicSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string(),
        category: z.enum(["news", "sports", "entertainment", "business", "local", "culture"]),
        heat: z.enum(["rising", "hot", "boiling"]),
        prompt: z.string(),
      }),
    )
    .length(5),
  generatedAt: z.string(),
});

export type TrendingPayload = z.infer<typeof TopicSchema>;

const cache = new Map<string, { value: TrendingPayload; expires: number }>();
const TTL_MS = 60 * 60 * 1000; // 1 hour

export const getTrendingTopics = createServerFn({ method: "POST" })
  .inputValidator(z.object({ stateId: z.string(), venueId: z.string() }))
  .handler(async ({ data }) => {
    const key = `${data.stateId}:${data.venueId}`;
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now) return cached.value;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return fallback(data.stateId, data.venueId);
    }

    const state = getState(data.stateId);
    const venue = getVenue(data.venueId);
    const personality = getVenuePersonality(data.stateId, data.venueId);
    if (!state || !venue) return fallback(data.stateId, data.venueId);

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: TopicSchema }),
        prompt: `You are the curation engine for National Chamber, a live social platform with state-themed venues.

Generate 5 FRESH trending discussion topics for the "${personality.displayName ?? venue.name}" — a ${personality.subtitle} in ${state.name}.

Venue culture: ${personality.description ?? venue.description}
Pulse vibe: ${personality.pulseLabels.join(" / ")}
Existing themes (for tone reference, DO NOT repeat verbatim): ${personality.intel.trendingTopics.join("; ")}

Today is ${today}.

Rules:
- Topics must feel CURRENT — reference real ongoing sports seasons, news cycles, entertainment, business stories, and cultural moments relevant to ${state.name} and this venue type.
- Mix categories (news, sports, entertainment, business, local, culture).
- Each topic should be punchy (under 70 chars title) and provoke discussion.
- "prompt" is a one-line discussion starter (under 120 chars) that the AI Host would post.
- Match the venue's energy — a sports bar gets hot takes; a blues lounge gets cultural reflection; a town hall gets civic debate.
- Do NOT mention specific user names. Do NOT pretend humans have already posted.
- generatedAt: ISO timestamp for now.`,
      });

      cache.set(key, { value: output, expires: now + TTL_MS });
      return output;
    } catch (err) {
      console.error("Trending topics generation failed:", err);
      return fallback(data.stateId, data.venueId);
    }
  });

function fallback(stateId: string, venueId: string): TrendingPayload {
  const personality = getVenuePersonality(stateId, venueId);
  const seed = personality.intel.trendingTopics.slice(0, 5);
  const titles = seed.length >= 5 ? seed : [...seed, ...personality.moments].slice(0, 5);
  const categories: TrendingPayload["topics"][number]["category"][] = [
    "local",
    "culture",
    "news",
    "sports",
    "entertainment",
  ];
  return {
    topics: titles.map((title, i) => ({
      title,
      category: categories[i % categories.length],
      heat: i === 0 ? "boiling" : i < 3 ? "hot" : "rising",
      prompt: `What's your take on: ${title}?`,
    })),
    generatedAt: new Date().toISOString(),
  };
}
