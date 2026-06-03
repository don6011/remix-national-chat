import { supabase } from "@/integrations/supabase/client";

type UserStats = {
  messages_sent: number;
  reactions_received: number;
  display_name: string | null;
  home_state: string | null;
  rank: string;
};

function computeRank(stats: UserStats): string {
  const { messages_sent, reactions_received, display_name, home_state, rank } = stats;

  // Governor is only set via election — never auto-promoted here
  if (rank === "governor") return "governor";

  const profileComplete = !!(display_name && home_state);

  if (messages_sent >= 300 && reactions_received >= 25 && profileComplete) {
    return "state_ambassador";
  }
  if (messages_sent >= 100 && profileComplete) {
    return "resident";
  }
  if (profileComplete) {
    return "verified_citizen";
  }
  return "citizen";
}

export async function checkAndUpgradeRank(userId: string): Promise<void> {
  const { data } = await supabase
    .from("users")
    .select("messages_sent, reactions_received, display_name, home_state, rank")
    .eq("id", userId)
    .maybeSingle();

  if (!data) return;

  const newRank = computeRank(data as UserStats);
  if (newRank !== data.rank) {
    await supabase.from("users").update({ rank: newRank }).eq("id", userId);
  }
}
