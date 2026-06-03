import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Archive } from "lucide-react";

export const Route = createFileRoute("/admin/rooms")({ component: RoomsPage });

function RoomsPage() {
  const qc = useQueryClient();
  const { data: rooms = [] } = useQuery({
    queryKey: ["admin-rooms"],
    queryFn: async () => (await supabase.from("rooms").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      await supabase.from("rooms").update(patch as never).eq("id", id);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: "room_updated", target_type: "room", target_id: id, details: patch as never,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-rooms"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-2xl font-display">Rooms</h1>
        <p className="text-sm text-muted-foreground mt-1">{rooms.length} room(s)</p></div>
      {rooms.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-foreground/60">
          No rooms yet. Hosts can create rooms from the consumer app.
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/40 text-[11px] uppercase tracking-wider text-foreground/60">
              <tr><th className="text-left px-3 py-2">Room</th><th className="text-left px-3 py-2">State</th><th className="text-left px-3 py-2">Actions</th></tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="px-3 py-2">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-[11px] text-foreground/60">{r.venue_type ?? "—"}</div>
                  </td>
                  <td className="px-3 py-2 text-foreground/70">{r.state_code ?? "—"}</td>
                  <td className="px-3 py-2 space-x-1">
                    <button onClick={() => update.mutate({ id: r.id, patch: { is_featured: !r.is_featured } })}
                      className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-1 border ${r.is_featured ? "bg-gold/15 text-gold border-gold/40" : "border-white/10 text-foreground/60"}`}>
                      <Star className="h-3 w-3" strokeWidth={2} /> {r.is_featured ? "Featured" : "Feature"}
                    </button>
                    <button onClick={() => update.mutate({ id: r.id, patch: { is_archived: !r.is_archived } })}
                      className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-1 border ${r.is_archived ? "bg-rose-500/15 text-rose-300 border-rose-500/30" : "border-white/10 text-foreground/60"}`}>
                      <Archive className="h-3 w-3" strokeWidth={2} /> {r.is_archived ? "Archived" : "Archive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
