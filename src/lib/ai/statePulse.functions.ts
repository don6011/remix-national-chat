import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getState } from "@/lib/states";
import { VENUES } from "@/lib/venues";
import { getVenuePersonality } from "@/lib/venuePersonality";

const PulseSchema = z.object({
  mostDiscussed: z.string(),
  hottestDebate: z.string(),
  fastestGrowingVenue: z.string(),
  mostActiveRoom: z.string(),
  activityScore: z.number().min(0).max(100),
  headline: z.string(),
  generatedAt: z.string(),
});

export type StatePulse = z.infer<typeof PulseSchema>;

const cache = new Map<string, { value: StatePulse; expires: number }>();
const TTL_MS = 30 * 60 * 1000;

export const getStatePulse = createServerFn({ method: "POST" })
  .inputValidator(z.object({ stateId: z.string() }))
  .handler(async ({ data }) => {
    const now = Date.now();
    const cached = cache.get(data.stateId);
    if (cached && cached.expires > now) return cached.value;

    const state = getState(data.stateId);
    if (!state) return baseline(data.stateId);

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return baseline(data.stateId);

    const venueSummaries = VENUES.map((v) => {
      const p = getVenuePersonality(data.stateId, v.id);
      return `- ${p.displayName ?? v.name} (${p.subtitle}): trending ${p.intel.trendingTopics[0] ?? "—"}`;
    }).join("\n");

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: PulseSchema }),
        prompt: `You are the State Pulse intelligence layer for National Chamber.
Produce a live pulse summary for the ${state.name} Space.

State vibe: ${state.tagline} · ${state.atmosphere}
Currently trending statewide: ${state.trendingTopic}
Live citizens: ${state.live}

Venues in this state:
${venueSummaries}

Pick ONE of the venues above by display name for fastestGrowingVenue and mostActiveRoom (they may differ).
mostDiscussed = the top conversation topic across the state right now (concrete, current, under 80 chars).
hottestDebate = a two-sided debate phrased as a one-liner (under 100 chars).
activityScore = 0–100 reflecting state energy (use live count as signal: ${state.live}).
headline = one-sentence editorial summary of the state's current pulse (under 120 chars).
generatedAt = ISO timestamp.

Do NOT invent user names. Voice is editorial, not personal.`,
      });

      cache.set(data.stateId, { value: output, expires: now + TTL_MS });
      return output;
    } catch (err) {
      console.error("State pulse generation failed:", err);
      return baseline(data.stateId);
    }
  });

function baseline(stateId: string): StatePulse {
  const state = getState(stateId);
  return {
    mostDiscussed: state?.trendingTopic ?? "Quiet night across the state.",
    hottestDebate: "The room is gathering — debates loading.",
    fastestGrowingVenue: "Local Stage",
    mostActiveRoom: "The Bar",
    activityScore: state ? Math.min(99, Math.round(state.live / 80)) : 30,
    headline: `${state?.name ?? "The state"} is warming up.`,
    generatedAt: new Date().toISOString(),
  };
}
