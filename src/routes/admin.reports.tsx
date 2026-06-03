import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Check, X, Star, Trash2 } from "lucide-react";

type ReportStatus = Database["public"]["Enums"]["report_status"];

export const Route = createFileRoute("/admin/reports")({ component: ReportsPage });

function ReportsPage() {
  const qc = useQueryClient();
  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => (await supabase.from("citizen_reports").select("*").order("created_at", { ascending: false }).limit(100)).data ?? [],
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportStatus }) => {
      await supabase.from("citizen_reports").update({ status }).eq("id", id);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: `report_${status}`, target_type: "report", target_id: id, details: {},
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reports"] }),
  });
  const feature = useMutation({
    mutationFn: async ({ id, on }: { id: string; on: boolean }) => {
      await supabase.from("citizen_reports").update({ is_featured: on }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reports"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-2xl font-display">Citizen Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">{reports.length} report(s)</p></div>
      <div className="space-y-2">
        {reports.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-foreground/60">
            No reports uploaded yet.
          </div>
        ) : reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-base truncate">{r.caption}</div>
                <div className="text-[11px] text-foreground/60 mt-1">
                  {r.city ?? "?"}, {r.state_code ?? "?"} · {r.venue_type ?? "—"} · {r.mood ?? "—"} · {r.activity ?? "—"}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(r.ai_tags ?? []).map((t) => (
                    <span key={t} className="text-[10px] rounded-full px-2 py-0.5 bg-white/5 border border-white/10">{t}</span>
                  ))}
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 border ${
                r.status === "approved" ? "text-emerald-300 border-emerald-300/30" :
                r.status === "rejected" || r.status === "removed" ? "text-rose-300 border-rose-300/30" :
                r.status === "flagged" ? "text-amber-300 border-amber-300/30" : "text-foreground/60 border-white/10"
              }`}>{r.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button onClick={() => setStatus.mutate({ id: r.id, status: "approved" })}
                className="inline-flex items-center gap-1 text-[11px] glass rounded-full px-2 py-1 border border-emerald-500/30 text-emerald-300">
                <Check className="h-3 w-3" strokeWidth={2} /> Approve
              </button>
              <button onClick={() => setStatus.mutate({ id: r.id, status: "rejected" })}
                className="inline-flex items-center gap-1 text-[11px] glass rounded-full px-2 py-1 border border-rose-500/30 text-rose-300">
                <X className="h-3 w-3" strokeWidth={2} /> Reject
              </button>
              <button onClick={() => feature.mutate({ id: r.id, on: !r.is_featured })}
                className={`inline-flex items-center gap-1 text-[11px] rounded-full px-2 py-1 border ${r.is_featured ? "bg-gold/15 text-gold border-gold/40" : "border-white/10 text-foreground/60"}`}>
                <Star className="h-3 w-3" strokeWidth={2} /> {r.is_featured ? "Featured" : "Feature"}
              </button>
              <button onClick={() => setStatus.mutate({ id: r.id, status: "removed" })}
                className="inline-flex items-center gap-1 text-[11px] glass rounded-full px-2 py-1 border border-rose-500/30 text-rose-300">
                <Trash2 className="h-3 w-3" strokeWidth={2} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
