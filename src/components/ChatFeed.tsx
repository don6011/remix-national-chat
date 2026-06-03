import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/lib/mockChat";
import { useState } from "react";
import { emitActivity } from "@/lib/activityBus";

const REACTION_EMOJIS = ["🔥", "🇺🇸", "💬", "⚡", "❤️"];

interface Props {
  messages: ChatMessage[];
  liveCount: number;
  pinned?: string;
  placeholder?: string;
  accentGlow?: string;
  stateId?: string;
  venueId?: string;
  simpleHeader?: boolean;
  topic?: string;
  fixedInput?: boolean;
  onSend?: (content: string) => void;
  onReact?: (messageId: string, emoji: string, authorId: string) => void;
}

export function ChatFeed({ messages, liveCount, pinned, placeholder = "Say something to the chamber…", accentGlow, stateId, venueId, simpleHeader, topic, fixedInput, onSend, onReact }: Props) {
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    if (onSend) {
      onSend(draft.trim());
    }
    setDraft("");
    emitActivity({ type: "post", stateId, venueId });
  };

  // When fixedInput, the form must live OUTSIDE the glass div.
  // backdrop-filter (used by .glass) creates a new containing block in most browsers,
  // trapping position:fixed children and preventing them from escaping to the viewport.
  const inputBar = (
    <form
      onSubmit={(e) => { e.preventDefault(); send(); }}
      className={
        fixedInput
          ? "fixed left-0 right-0 z-40 px-3 flex items-center gap-2 bottom-[calc(env(safe-area-inset-bottom)+76px)]"
          : "p-3 border-t border-[rgba(201,168,76,0.2)] flex items-center gap-2 bg-black/20"
      }
    >
      <div className={fixedInput ? "mx-auto max-w-2xl w-full flex items-center gap-2 glass-strong rounded-2xl p-2 shadow-[0_-8px_30px_-10px_rgba(13,27,62,0.8)]" : "contents"}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={placeholder}
          className="flex-1 bg-white/5 border border-[rgba(201,168,76,0.2)] rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 outline-none focus:border-gold/60 focus:bg-white/10 transition"
          style={{ fontFamily: "var(--font-sans)" }}
        />
        <button
          type="submit"
          aria-label="Send"
          className="h-10 w-10 rounded-xl flex items-center justify-center text-[#0D1B3E] hover:scale-105 transition shadow-[0_4px_18px_-4px_rgba(201,168,76,0.55)]"
          style={{ background: "#C9A84C" }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );

  const feedContent = (
    <div className="glass rounded-2xl overflow-hidden flex flex-col">
      {simpleHeader ? (
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg leading-none">🇺🇸</span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.28em] text-gold/90 leading-none">
                America Right Now
              </div>
              <div className="text-[13px] text-foreground/95 font-medium truncate mt-1">
                {topic ?? "What is America talking about right now?"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] text-foreground/70">
            <div className="hidden sm:flex items-center gap-0.5 text-muted-foreground">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
            <span className="live-dot" />
            <span className="tabular-nums">{liveCount.toLocaleString()}</span>
            <span className="text-foreground/50">live</span>
          </div>
        </div>
      ) : (
        <>
          {pinned && (
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span className="text-muted-foreground">Pinned · </span>
              <span className="text-foreground/90">{pinned}</span>
            </div>
          )}

          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="font-medium tracking-wide">LIVE</span>
              <span className="text-muted-foreground">· {liveCount.toLocaleString()} in room</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              <span className="ml-1">3 typing</span>
            </div>
          </div>
        </>
      )}


      <div
        className="px-4 py-4 space-y-4 min-h-[320px] max-h-[420px] overflow-y-auto"
        style={accentGlow ? { boxShadow: `inset 0 -40px 80px -40px ${accentGlow}` } : undefined}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[280px] gap-3 text-center">
            <span className="text-4xl">🇺🇸</span>
            <p className="text-sm text-foreground/50">Be the first to speak up, America.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="h-9 w-9 rounded-full glass-gold flex items-center justify-center text-xs font-semibold text-gold shrink-0">
                  {m.user.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="text-foreground font-medium">{m.user}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] tracking-wider">
                      {m.state}
                    </span>
                    <span className="text-gold/80">· {m.status}</span>
                    <span className="ml-auto">{m.time}</span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed mt-0.5 text-foreground/95">
                    {m.message}
                  </p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    {REACTION_EMOJIS.map((emoji) => {
                      const r = m.reactions?.find((rx) => rx.emoji === emoji);
                      const count = r?.count ?? 0;
                      const active = r?.userReacted ?? false;
                      return (
                        <button
                          key={emoji}
                          onClick={() => {
                            if (onReact) onReact(m.id, emoji, m.authorId ?? "");
                            emitActivity({ type: "reaction", stateId, venueId });
                          }}
                          className={[
                            "text-[11px] px-2 py-0.5 rounded-full border transition",
                            active
                              ? "bg-gold/20 border-gold/40 text-gold"
                              : "bg-white/5 border-white/10 hover:bg-white/10",
                          ].join(" ")}
                        >
                          {emoji}{count > 0 ? ` ${count}` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!fixedInput && inputBar}
    </div>
  );

  return fixedInput ? <>{feedContent}{inputBar}</> : feedContent;
}
