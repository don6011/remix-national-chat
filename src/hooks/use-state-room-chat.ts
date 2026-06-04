import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage } from "@/lib/mockChat";
import { checkAndUpgradeRank } from "@/lib/rank-utils";
import type { Tables } from "@/integrations/supabase/types";

const REACTION_EMOJIS = ["🔥", "🇺🇸", "💬", "⚡", "❤️"];
const TIME_INTERVAL_MS = 5 * 60 * 1000;

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
  reaction_type: string;
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
    const matching = reactions.filter((r) => r.message_id === row.id && r.reaction_type === emoji);
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

export function useStateRoomChat(stateId: string, venueId: string) {
  const [room, setRoom] = useState<Tables<"rooms"> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false); // true only once room + messages are loaded
  const uidRef = useRef<string | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const reactionsRef = useRef<DbReaction[]>([]);
  const messagesRef = useRef<DbMessage[]>([]);
  const optimisticIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Reset everything for this room so navigation between rooms is clean
    roomIdRef.current = null;
    messagesRef.current = [];
    reactionsRef.current = [];
    optimisticIds.current = new Set();
    setRoom(null);
    setMessages([]);
    setReady(false);

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let timeInterval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false; // guard against setting state after unmount

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      uidRef.current = session?.user?.id ?? null;
      const uid = uidRef.current;

      // Fetch room by state + room_type
      const { data: roomRow, error: roomErr } = await supabase
        .from("rooms")
        .select("*")
        .eq("state", stateId)
        .eq("room_type", venueId)
        .maybeSingle();

      if (cancelled) return;
      if (roomErr || !roomRow) {
        setReady(true); // unblock UI so empty state shows
        return;
      }

      roomIdRef.current = roomRow.id;
      setRoom(roomRow);

      // Subscribe to Realtime before fetching history so no messages are missed
      channel = supabase
        .channel(`room-${roomRow.id}-${Date.now()}`) // unique name prevents stale channel reuse
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomRow.id}` },
          async (payload) => {
            if (cancelled) return;
            const incoming = payload.new as { id: string; content: string; created_at: string; user_id: string };
            if (optimisticIds.current.has(incoming.id)) {
              optimisticIds.current.delete(incoming.id);
              return;
            }
            const { data: userData } = await supabase
              .from("users")
              .select("username, display_name, home_state, rank")
              .eq("id", incoming.user_id)
              .maybeSingle();
            if (cancelled) return;
            const full: DbMessage = { ...incoming, users: userData ?? null };
            messagesRef.current = [...messagesRef.current, full];
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "reactions" },
          (payload) => {
            if (cancelled) return;
            reactionsRef.current = [...reactionsRef.current, payload.new as DbReaction];
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "reactions" },
          (payload) => {
            if (cancelled) return;
            reactionsRef.current = reactionsRef.current.filter((r) => r.id !== (payload.old as DbReaction).id);
            setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uid)));
          },
        )
        .subscribe();

      // Fetch last 50 messages + reactions
      const [{ data: msgRows }, { data: reactionRows }] = await Promise.all([
        supabase
          .from("messages")
          .select("id, content, created_at, user_id, users(username, display_name, home_state, rank)")
          .eq("room_id", roomRow.id)
          .order("created_at", { ascending: false })
          .limit(50) as Promise<{ data: DbMessage[] | null }>,
        supabase
          .from("reactions")
          .select("id, message_id, reaction_type, user_id"),
      ]);

      if (cancelled) return;

      const rows = (msgRows ?? []).reverse();
      const reactions = reactionRows ?? [];
      messagesRef.current = rows;
      reactionsRef.current = reactions;
      setMessages(rows.map((r) => buildChatMessage(r, reactions, uid)));
      setReady(true);

      // Room visit + active_users (fire and forget)
      if (uid) {
        supabase.rpc("increment_room_users", { p_room_id: roomRow.id });
        supabase.from("room_visits").upsert(
          { user_id: uid, room_id: roomRow.id, state: stateId, room_type: venueId, last_visited: new Date().toISOString() },
          { onConflict: "user_id,room_id" },
        );

        timeInterval = setInterval(async () => {
          if (cancelled) return;
          const { data: visitRow } = await supabase
            .from("room_visits")
            .select("id, total_minutes")
            .eq("user_id", uid)
            .eq("room_id", roomRow.id)
            .maybeSingle();
          if (visitRow && !cancelled) {
            supabase
              .from("room_visits")
              .update({ total_minutes: visitRow.total_minutes + 5, last_visited: new Date().toISOString() })
              .eq("id", visitRow.id);
          }
        }, TIME_INTERVAL_MS);
      }
    }

    init();

    return () => {
      cancelled = true;
      channel?.unsubscribe();
      if (timeInterval) clearInterval(timeInterval);
      if (roomIdRef.current) {
        supabase.rpc("decrement_room_users", { p_room_id: roomIdRef.current });
      }
    };
  }, [stateId, venueId]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    // Guard: room must be loaded before we allow sends
    if (!trimmed || !roomIdRef.current || !ready) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Fetch the sender's profile for the optimistic message display
    const { data: meRow } = await supabase
      .from("users")
      .select("username, display_name, home_state, rank, messages_sent")
      .eq("id", session.user.id)
      .maybeSingle();

    // Snapshot roomId in case it changes during the async insert
    const currentRoomId = roomIdRef.current;
    if (!currentRoomId) return;

    // Optimistic update — appears immediately, no waiting for Realtime
    const tempId = `opt-${Date.now()}`;
    const optimisticMsg: DbMessage = {
      id: tempId,
      content: trimmed,
      created_at: new Date().toISOString(),
      user_id: session.user.id,
      users: meRow ? {
        username: meRow.username,
        display_name: meRow.display_name,
        home_state: meRow.home_state,
        rank: meRow.rank,
      } : null,
    };
    messagesRef.current = [...messagesRef.current, optimisticMsg];
    setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uidRef.current)));

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({
        content: trimmed,
        user_id: session.user.id,
        room_id: currentRoomId,
        state: stateId,
        is_national: false,
        topic: "",
        extension: "",
      })
      .select("id")
      .single();

    if (error) {
      // Roll back optimistic on failure
      messagesRef.current = messagesRef.current.filter((m) => m.id !== tempId);
      setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uidRef.current)));
      return;
    }

    // Swap temp ID with real DB ID; register it so Realtime skips the duplicate
    if (inserted?.id) {
      optimisticIds.current.add(inserted.id);
      messagesRef.current = messagesRef.current.map((m) =>
        m.id === tempId ? { ...m, id: inserted.id } : m,
      );
      setMessages(messagesRef.current.map((r) => buildChatMessage(r, reactionsRef.current, uidRef.current)));
    }

    // Stat increments (fire and forget)
    const newCount = (meRow?.messages_sent ?? 0) + 1;
    supabase.from("users").update({ messages_sent: newCount }).eq("id", session.user.id);
    checkAndUpgradeRank(session.user.id);
  }

  async function toggleReaction(messageId: string, emoji: string, authorId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const existing = reactionsRef.current.find(
      (r) => r.message_id === messageId && r.reaction_type === emoji && r.user_id === session.user.id,
    );

    if (existing) {
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("reactions").insert({
        message_id: messageId,
        reaction_type: emoji,
        user_id: session.user.id,
      });
      if (authorId && authorId !== session.user.id) {
        const { data: authorRow } = await supabase
          .from("users")
          .select("reactions_received")
          .eq("id", authorId)
          .maybeSingle();
        const newCount = (authorRow?.reactions_received ?? 0) + 1;
        supabase.from("users").update({ reactions_received: newCount }).eq("id", authorId);
        checkAndUpgradeRank(authorId);
      }
    }
  }

  return { room, messages, ready, sendMessage, toggleReaction };
}
