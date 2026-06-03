import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  currentHourTick,
  getIntelligence,
  type ActivityLevel,
  type Mood,
  type StateIntelligence,
} from "@/lib/stateIntelligence";

// Shared in-memory cache so every StateCard reads from the same dataset
// and a single realtime subscription fans out to all subscribers.
const cache = new Map<string, StateIntelligence>();
const listeners = new Set<() => void>();
let bootstrapped = false;
let channel: ReturnType<typeof supabase.channel> | null = null;

type Row = {
  state_code: string;
  primary_topic: string;
  secondary_topic: string | null;
  activity_level: string;
  mood: string;
  rival_state: string | null;
  momentum_score: number;
  trending_reason: string | null;
  top_venue: string | null;
  updated_at: string;
};

function rowToIntel(row: Row): StateIntelligence {
  return {
    stateCode: row.state_code,
    primaryTopic: row.primary_topic,
    secondaryTopic: row.secondary_topic ?? "",
    activityLevel: row.activity_level as ActivityLevel,
    mood: row.mood as Mood,
    rivalState: row.rival_state ?? "",
    momentumScore: row.momentum_score,
    trendingReason: row.trending_reason ?? "",
    topVenue: row.top_venue ?? "",
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

function notify() {
  listeners.forEach((l) => l());
}

async function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;

  const { data, error } = await supabase
    .from("state_intelligence")
    .select("*");

  if (!error && data) {
    for (const row of data as Row[]) {
      cache.set(row.state_code, rowToIntel(row));
    }
    notify();
  }

  channel = supabase
    .channel("state_intelligence_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "state_intelligence" },
      (payload) => {
        const next = (payload.new ?? payload.old) as Row | undefined;
        if (!next?.state_code) return;
        if (payload.eventType === "DELETE") {
          cache.delete(next.state_code);
        } else {
          cache.set(next.state_code, rowToIntel(next));
        }
        notify();
      }
    )
    .subscribe();
}

export function useStateIntelligence(stateId: string): StateIntelligence | null {
  const [intel, setIntel] = useState<StateIntelligence | null>(
    () => cache.get(stateId) ?? getIntelligence(stateId, currentHourTick())
  );

  useEffect(() => {
    bootstrap();
    const listener = () => {
      setIntel(
        cache.get(stateId) ?? getIntelligence(stateId, currentHourTick())
      );
    };
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, [stateId]);

  return intel;
}
