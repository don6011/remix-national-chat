import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getVenuePersonality } from "@/lib/venuePersonality";
import { getState } from "@/lib/states";
import { getVenue } from "@/lib/venues";

const BroadcastSchema = z.object({
  broadcasts: z
    .array(
      z.discriminatedUnion("kind", [
        z.object({
          kind: z.literal("announcement"),
          icon: z.string(),
          text: z.string(),
        }),
        z.object({
          kind: z.literal("poll"),
          icon: z.string(),
          question: z.string(),
          options: z.array(z.string()).min(2).max(4),
        }),
        z.object({
          kind: z.literal("prompt"),
          icon: z.string(),
          text: z.string(),
        }),
        z.object({
          kind: z.literal("debate"),
          icon: z.string(),
          text: z.string(),
        }),
        z.object({
          kind: z.literal("reminder"),
          icon: z.string(),
          text: z.string(),
          when: z.string(),
        }),
      ]),
    )
    .min(3)
    .max(5),
  generatedAt: z.string(),
});

export type HostPayload = z.infer<typeof BroadcastSchema>;
export type HostBroadcast = HostPayload["broadcasts"][number];

const cache = new Map<string, { value: HostPayload; expires: number }>();
const TTL_MS = 15 * 60 * 1000;

export const getHostBroadcasts = createServerFn({ method: "POST" })
  .inputValidator(z.object({ stateId: z.string(), venueId: z.string() }))
  .handler(async ({ data }) => {
    const key = `${data.stateId}:${data.venueId}`;
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && cached.expires > now) return cached.value;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return fallback(data.stateId, data.venueId);

    const state = getState(data.stateId);
    const venue = getVenue(data.venueId);
    const personality = getVenuePersonality(data.stateId, data.venueId);
    if (!state || !venue) return fallback(data.stateId, data.venueId);

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: BroadcastSchema }),
        prompt: `You are THE HOST of "${personality.displayName ?? venue.name}" — a ${personality.subtitle} in ${state.name} on National Chamber.

You are an AI host, moderator, curator. You are NOT a citizen. You don't impersonate users.
You post announcements, polls, discussion prompts, debate starters, and event reminders.

Venue culture: ${personality.description ?? venue.description}
Energy stages: ${personality.pulseLabels.join(" → ")}
Action verbs: ${personality.postVerbs.join(", ")}

Generate 3-5 host broadcasts for tonight. Mix kinds:
- announcement: short welcome/state-of-the-room (e.g. "Crowd just hit 1,200. Lounge is live.")
- poll: 2-4 option vote that fits the venue (sports = hot take; blues = song request)
- prompt: open discussion question
- debate: a two-sided spicy debate starter
- reminder: an event or thing happening soon, with "when" (e.g. "9:00 PM CT")

Icons: single emoji per broadcast that fits the moment.
Keep text under 120 chars. Voice is warm, knowing, hosty — NEVER pretend to be a user, NEVER use a person's name.
generatedAt: ISO timestamp.`,
      });

      cache.set(key, { value: output, expires: now + TTL_MS });
      return output;
    } catch (err) {
      console.error("Host broadcast generation failed:", err);
      return fallback(data.stateId, data.venueId);
    }
  });

function fallback(stateId: string, venueId: string): HostPayload {
  const p = getVenuePersonality(stateId, venueId);
  return {
    broadcasts: [
      { kind: "announcement", icon: "📣", text: `Welcome to ${p.displayName ?? p.subtitle}. ${p.pinned}` },
      {
        kind: "poll",
        icon: "🗳️",
        question: `What's defining tonight at the ${p.subtitle.toLowerCase()}?`,
        options: p.moments.slice(0, 3),
      },
      { kind: "prompt", icon: "💬", text: `Open floor — ${p.intel.trendingTopics[0] ?? "what's on your mind?"}` },
      { kind: "debate", icon: "⚔️", text: `Hot debate: ${p.intel.trendingTopics[1] ?? "settle it tonight."}` },
    ],
    generatedAt: new Date().toISOString(),
  };
}
