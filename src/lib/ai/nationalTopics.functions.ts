import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const TopicSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string(),
        flavor: z.enum(["debate", "ranking", "rivalry", "underrated", "culture"]),
        heat: z.enum(["rising", "hot", "boiling"]),
      }),
    )
    .length(6),
  generatedAt: z.string(),
});

export type NationalTopicsPayload = z.infer<typeof TopicSchema>;

let cache: { value: NationalTopicsPayload; expires: number } | null = null;
const TTL_MS = 60 * 60 * 1000; // 1 hour — "fresh debates every few hours"

const FALLBACK: NationalTopicsPayload = {
  topics: [
    { title: "What state has the best food in America?", flavor: "ranking", heat: "hot" },
    { title: "Which city runs culture in 2026?", flavor: "debate", heat: "boiling" },
    { title: "Most underrated state in America?", flavor: "underrated", heat: "rising" },
    { title: "Texas vs California: which state would you actually move to?", flavor: "rivalry", heat: "boiling" },
    { title: "What state deserves more respect?", flavor: "underrated", heat: "rising" },
    { title: "Best college football state — settle it.", flavor: "rivalry", heat: "hot" },
  ],
  generatedAt: new Date().toISOString(),
};

export const getNationalTopics = createServerFn({ method: "POST" })
  .inputValidator(z.object({}).optional())
  .handler(async () => {
    const now = Date.now();
    if (cache && cache.expires > now) return cache.value;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      cache = { value: FALLBACK, expires: now + TTL_MS };
      return FALLBACK;
    }

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    try {
      const gateway = createLovableAiGatewayProvider(apiKey);
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({ schema: TopicSchema }),
        prompt: `You curate the National Chamber — the front page of America. Generate 6 FRESH national debate topics for ${today}.

These are huge, scroll-stopping prompts that millions of Americans would jump on. Examples of the format:
- "What state has the best food?"
- "Which city runs culture in 2026?"
- "Most underrated state in America?"
- "Texas vs California: which state would you move to?"
- "What state deserves more respect?"
- "Best college football state?"

Rules:
- Mix flavors: ranking, debate, rivalry, underrated, culture.
- Reference current cultural moments (sports seasons, music, food trends, real cities/states) when natural.
- Punchy, under 90 chars each.
- No user names. No pretending humans posted.
- generatedAt: ISO timestamp now.`,
      });

      cache = { value: output, expires: now + TTL_MS };
      return output;
    } catch (err) {
      console.error("National topics generation failed:", err);
      return FALLBACK;
    }
  });
