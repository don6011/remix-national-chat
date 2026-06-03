import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { Heart } from "lucide-react";
import { StateCard } from "@/components/StateCard";
import { STATES } from "@/lib/states";
import { useFavoriteStates } from "@/hooks/use-favorites";

export const Route = createFileRoute("/states/")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "States — National Chat" },
      { name: "description", content: "Browse live state spaces. Each state, its own digital atmosphere." },
    ],
  }),
  component: StatesIndex,
});

function StatesIndex() {
  const { favorites } = useFavoriteStates();

  const { favorited, rest } = useMemo(() => {
    const favorited = STATES.filter((s) => favorites.includes(s.id));
    const rest = STATES.filter((s) => !favorites.includes(s.id));
    return { favorited, rest };
  }, [favorites]);

  return (
    <div className="max-w-2xl mx-auto px-5 pt-8 pb-12 space-y-6">
      <header>
        <div className="section-label">Choose Your State</div>
        <h1 className="font-display text-3xl sm:text-4xl mt-1.5">
          America is live.
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
          Each state has its own culture, its own conversations, and its own energy.
        </p>
      </header>

      {favorited.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold/90">
            <Heart className="h-3 w-3" fill="currentColor" /> Your favorites
          </div>
          <div className="grid gap-4 sm:gap-5">
            {favorited.map((s, i) => (
              <StateCard key={s.id} state={s} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        {favorited.length > 0 && (
          <div className="text-[11px] uppercase tracking-[0.25em] text-foreground/60">
            All states
          </div>
        )}
        <div className="grid gap-4 sm:gap-5">
          {rest.map((s, i) => (
            <StateCard key={s.id} state={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
