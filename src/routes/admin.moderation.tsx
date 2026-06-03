import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Check, X } from "lucide-react";

type FlagStatus = Database["public"]["Enums"]["flag_status"];

export const Route = createFileRoute("/admin/moderation")({ component: ModerationPage });

function ModerationPage() {
  const qc = useQueryClient();
  const { data: flags = [] } = useQuery({
    queryKey: ["admin-flags"],
    queryFn: async () => (await supabase.from("moderation_flags").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const resolve = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FlagStatus }) => {
      const { data: u } = await supabase.auth.getUser();
      await supabase.from("moderation_flags").update({ status, resolved_by: u.user?.id ?? null }).eq("id", id);
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: `flag_${status}`, target_type: "flag", target_id: id, details: {},
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-flags"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-2xl font-display">Moderation Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">{flags.length} flag(s)</p></div>
      <div className="space-y-2">
        {flags.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-foreground/60">
            Queue is clear. No flagged content.
          </div>
        ) : flags.map((f) => (
          <div key={f.id} className="rounded-xl border border-white/10 bg-black/30 p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-foreground/60">{f.target_type} · {f.status}</div>
              <div className="text-sm mt-0.5 truncate">{f.reason}</div>
              <div className="text-[10px] text-foreground/50 mt-1">Target: {f.target_id}</div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => resolve.mutate({ id: f.id, status: "resolved" })}
                className="inline-flex items-center gap-1 text-[11px] glass rounded-full px-2 py-1 border border-emerald-500/30 text-emerald-300">
                <Check className="h-3 w-3" strokeWidth={2} /> Resolve
              </button>
              <button onClick={() => resolve.mutate({ id: f.id, status: "dismissed" })}
                className="inline-flex items-center gap-1 text-[11px] glass rounded-full px-2 py-1 border border-white/10 text-foreground/70">
                <X className="h-3 w-3" strokeWidth={2} /> Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
