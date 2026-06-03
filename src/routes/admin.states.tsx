import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";

export const Route = createFileRoute("/admin/states")({ component: StatesPage });

function StatesPage() {
  const qc = useQueryClient();
  const { data: states = [] } = useQuery({
    queryKey: ["admin-states"],
    queryFn: async () => (await supabase.from("states").select("*").order("name")).data ?? [],
  });
  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      await supabase.from("states").update(patch as never).eq("id", id);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: "state_updated", target_type: "state", target_id: id, details: patch as never,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-states"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-2xl font-display">States</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage state pages, taglines, and active topics.</p></div>
      {states.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-foreground/60">
          No states in the database yet. Add rows in the <code>states</code> table to manage them here.
        </div>
      ) : (
        <div className="space-y-2">
          {states.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg">{s.name} <span className="text-xs text-foreground/50">({s.code})</span></div>
                <button onClick={() => update.mutate({ id: s.id, patch: { is_featured: !s.is_featured } })}
                  className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-1 border ${s.is_featured ? "bg-gold/15 text-gold border-gold/40" : "border-white/10 text-foreground/60"}`}>
                  <Star className="h-3 w-3" strokeWidth={2} /> {s.is_featured ? "Featured" : "Feature"}
                </button>
              </div>
              <input defaultValue={s.tagline ?? ""} placeholder="Tagline"
                onBlur={(e) => e.target.value !== (s.tagline ?? "") && update.mutate({ id: s.id, patch: { tagline: e.target.value } })}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
              <input defaultValue={s.active_topic ?? ""} placeholder="Active topic"
                onBlur={(e) => e.target.value !== (s.active_topic ?? "") && update.mutate({ id: s.id, patch: { active_topic: e.target.value } })}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
              <input defaultValue={s.hero_image_url ?? ""} placeholder="Hero image URL"
                onBlur={(e) => e.target.value !== (s.hero_image_url ?? "") && update.mutate({ id: s.id, patch: { hero_image_url: e.target.value } })}
                className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
