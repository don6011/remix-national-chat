## National Chamber AI Intelligence Engine

Replace mock chat seed users with a real AI intelligence layer that powers trending topics, host announcements, state/venue pulse metrics, and ambient activity — without generating fake humans.

### What the AI does

1. **Trending Topics** — per venue, refreshed hourly. AI takes the venue personality (Texas Sports Bar, Mississippi Blues, etc.) + current date + recent news/sports/entertainment context and returns 5 fresh discussion topics.
2. **AI Room Host** — a system identity ("The Host") that posts announcements, polls, discussion prompts, debate starters, and event reminders into each venue. Clearly badged as `HOST`, not impersonating a citizen.
3. **State Pulse** — computed: most-discussed topic, fastest-growing venue, hottest debate, most active room, citizen activity score.
4. **Venue Pulse** — already exists; will be wired to AI-generated topic feed instead of static seeds.
5. **Ambient Activity** — watching / typing / reactions / applause / poll participation counters driven by real session presence (with graceful fallback to neutral baseline when low traffic).

### Architecture

**Backend (TanStack Start server functions, Lovable AI Gateway)**
- `src/lib/ai-gateway.server.ts` — provider helper (Lovable AI Gateway, `google/gemini-3-flash-preview`).
- `src/lib/ai/trending.functions.ts` — `getTrendingTopics({ stateId, venueId })`, returns 5 topics + categories. Cached 1 hour per venue.
- `src/lib/ai/host.functions.ts` — `getHostBroadcasts({ stateId, venueId })`, returns 3–5 host messages (announcement, poll, debate starter, reminder).
- `src/lib/ai/statePulse.functions.ts` — `getStatePulse({ stateId })`, aggregates venue metadata into a pulse summary.
- All use `Output.object` (zod) for structured JSON.

**Frontend**
- New `src/components/TrendingTopics.tsx` — chips of AI-generated venue topics with category badge, refresh time.
- New `src/components/AIHostFeed.tsx` — host messages styled distinctly (gold ring, "HOST" badge, never avatar-as-human). Polls render with vote bars.
- New `src/components/StatePulsePanel.tsx` — drops into state index page.
- Update `src/routes/states.$stateId.$venueId.tsx` — insert `TrendingTopics` + `AIHostFeed` above the existing chat feed; keep `VenuePulse` as ambient.
- Update `src/routes/states.$stateId.index.tsx` — insert `StatePulsePanel`.
- Update `src/components/ChatFeed.tsx` — remove mock seed users from default props OR clearly label any remaining placeholder messages as "Seed — awaiting first citizen" (no fake names).

**Caching**
- In-memory module-level Map with 1-hour TTL keyed by `${stateId}:${venueId}` for trending topics; 15-minute TTL for host broadcasts. Server-only.

**Secrets**
- Enable Lovable Cloud (provisions `LOVABLE_API_KEY`).

### What does NOT change

- No fake citizen messages introduced.
- `VenuePulse` ambient counters and personality system kept intact.
- Mock chat seeds in `mockChat.ts` will be neutralized to either remove or relabel — confirm in implementation.

### Scope check

Big task. Will land in this order:
1. AI gateway helper + Lovable API key
2. Trending topics function + UI
3. AI Host function + UI
4. State pulse function + UI
5. Wire into venue + state routes
6. Neutralize fake-user seeds