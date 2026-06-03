import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage } from "@/lib/mockChat";
import { checkAndUpgradeRank } from "@/lib/rank-utils";

const REACTION_EMOJIS = ["🔥", "🇺🇸", "💬", "⚡", "❤️"];

type DbMessage = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users: {
    username: string;
    display_name: string | null;
    home_state: string;
    rank: string;
  } | null;
};

type DbReaction = {
  id: string;
  message_id: string;
  emoji: string;
  user_id: string;
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function toStateTag(state: string): string {
  const map: Record<string, string> = {
    texas: "TX", florida: "FL", mississippi: "MS", tennessee: "TN", california: "CA",
  };
  return map[state.toLowerCase()] ?? state.slice(0, 2).toUpperCase();
}

function buildChatMessage(
  row: DbMessage,
  reactions: DbReaction[],
  currentUserId: string | null,
): ChatMessage {
  const msgReactions = REACTION_EMOJIS.map((emoji) => {
    const matching = reactions.filter((r) => r.message_id === row.id && r.emoji === emoji);
    const userReacted = currentUserId ? matching.some((r) => r.user_id === currentUserId) : false;
    return { emoji, count: matching.length, userReacted };
  });

  const u = row.users;
  return {
    id: row.id,
    user: u?.display_name || u?.username || "Citizen",
    state: u?.home_state ? toStateTag(u.home_state) : "—",
    status: u?.rank ?? "citizen",
    message: row.content,
    time: timeAgo(row.created_at),
    reactions: msgReactions,
    authorId: row.user_id,
  };
}

export function useNationalChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const reactionsRef = useRef<DbReaction[]>([]);
  const messagesRef = useRef<DbMessage[]>([]);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setCurrentUserId(uid);

      const [{ data: msgRows }, { data: reactionRows }] = await Promise.all([
        supabase
          .from("messages")
          .select("id, content, created_at, user_id, users(username, display_name, home_state, rank)")
          .eq("is_national", true)
          .order("created_at", { ascending: false })
          .limit(50) as Promise<{ data: DbMessage[] | null }>,
        supabase.from("reactions").select("id, message_id, emoji, user_id"),
      ]);

      const rows = (msgRows ?? []).reverse();
      const reactions = reactionRows ?? [];
      messagesRef.current = rows;
      reactionsRef.current = reactions;

      setMessages(rows.map((r) => buildChatMessage(r, reactions, uid)));
      setLoading(false);

      channel = supabase
        .channel("national-chat")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: "is_national=eq.true" },
          async (payload) => {
            const newMsg = payload.new as { id: string; content: string; created_at: string; user_id: string };
            const { data: userData } = await supabase
              .from("users")
              .select("username, display_name, home_state, rank")
              .eq("id", newMsg.user_id)
              .maybeSingle();
            const full: DbMessage = { ...newMsg, users: userData ?? null };
            messagesRef.current = [...messagesRef.current, full];
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "reactions" },
          (payload) => {
            reactionsRef.current = [...reactionsRef.current, payload.new as DbReaction];
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "reactions" },
          (payload) => {
            reactionsRef.current = reactionsRef.current.filter((r) => r.id !== (payload.old as DbReaction).id);
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .subscribe();
    }

    init();
    return () => { channel?.unsubscribe(); };
  }, []);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: userRow } = await supabase
      .from("users")
      .select("home_state, messages_sent")
      .eq("id", session.user.id)
      .maybeSingle();

    await supabase.from("messages").insert({
      content: trimmed,
      user_id: session.user.id,
      is_national: true,
      state: userRow?.home_state ?? "Texas",
    });

    const newCount = (userRow?.messages_sent ?? 0) + 1;
    await supabase.from("users").update({ messages_sent: newCount }).eq("id", session.user.id);
    await checkAndUpgradeRank(session.user.id);
  }

  async function toggleReaction(messageId: string, emoji: string, authorId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const existing = reactionsRef.current.find(
      (r) => r.message_id === messageId && r.emoji === emoji && r.user_id === session.user.id,
    );

    if (existing) {
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("reactions").insert({
        message_id: messageId,
        emoji,
        user_id: session.user.id,
      });
      // Increment author's reactions_received
      if (authorId && authorId !== session.user.id) {
        const { data: authorRow } = await supabase
          .from("users")
          .select("reactions_received")
          .eq("id", authorId)
          .maybeSingle();
        const newCount = (authorRow?.reactions_received ?? 0) + 1;
        await supabase.from("users").update({ reactions_received: newCount }).eq("id", authorId);
        await checkAndUpgradeRank(authorId);
      }
    }
  }

  return { messages, loading, sendMessage, toggleReaction };
}
