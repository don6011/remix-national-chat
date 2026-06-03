// Lightweight cross-tab + in-tab activity bus used to push instant
// refreshes to Trending Topics, State Pulse, and Venue Pulse when new
// activity arrives (chat post, reaction, host broadcast, etc).

export type ActivityEvent = {
  type: "post" | "reaction" | "arrival" | "host" | "moment";
  stateId?: string;
  venueId?: string;
  at: number;
};

const CHANNEL_NAME = "nc-activity";
const EVENT_NAME = "nc:activity";

let channel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (channel) return channel;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    channel = null;
  }
  return channel;
}

export function emitActivity(ev: Omit<ActivityEvent, "at"> & { at?: number }) {
  if (typeof window === "undefined") return;
  const payload: ActivityEvent = { at: Date.now(), ...ev };
  window.dispatchEvent(new CustomEvent<ActivityEvent>(EVENT_NAME, { detail: payload }));
  getChannel()?.postMessage(payload);
}

export function subscribeActivity(
  handler: (ev: ActivityEvent) => void,
  filter?: { stateId?: string; venueId?: string },
): () => void {
  if (typeof window === "undefined") return () => {};

  const onLocal = (e: Event) => {
    const detail = (e as CustomEvent<ActivityEvent>).detail;
    if (!detail) return;
    if (filter?.stateId && detail.stateId && detail.stateId !== filter.stateId) return;
    if (filter?.venueId && detail.venueId && detail.venueId !== filter.venueId) return;
    handler(detail);
  };
  const onBroadcast = (e: MessageEvent<ActivityEvent>) => {
    const detail = e.data;
    if (!detail) return;
    if (filter?.stateId && detail.stateId && detail.stateId !== filter.stateId) return;
    if (filter?.venueId && detail.venueId && detail.venueId !== filter.venueId) return;
    handler(detail);
  };

  window.addEventListener(EVENT_NAME, onLocal as EventListener);
  const ch = getChannel();
  ch?.addEventListener("message", onBroadcast as EventListener);

  return () => {
    window.removeEventListener(EVENT_NAME, onLocal as EventListener);
    ch?.removeEventListener("message", onBroadcast as EventListener);
  };
}
