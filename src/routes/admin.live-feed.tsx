import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

const SIGNAL_TYPES = ["hot_right_now", "fastest_growing", "trending_topics", "live_hosts"] as const;

export const Route = createFileRoute("/admin/live-feed")({ component: LiveFeedPage });

function LiveFeedPage() {
  const qc = useQueryClient();
  const [type, setType] = useState<typeof SIGNAL_TYPES[number]>("hot_right_now");
  const [label, setLabel] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [metric, setMetric] = useState("");

  const { data: signals = [] } = useQuery({
    queryKey: ["admin-signals", type],
    queryFn: async () => (await supabase.from("live_signals").select("*").eq("signal_type", type).order("sort_order")).data ?? [],
  });
  const add = useMutation({
    mutationFn: async () => {
      const { data: row } = await supabase.from("live_signals")
        .insert({ signal_type: type, label, subtitle: subtitle || null, metric_value: metric || null })
        .select("id").maybeSingle();
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: "signal_added", target_type: "live_signal",
        target_id: row?.id ?? null, details: { signal_type: type, label },
      });
    },
    onSuccess: () => { setLabel(""); setSubtitle(""); setMetric(""); qc.invalidateQueries({ queryKey: ["admin-signals"] }); },
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("live_signals").delete().eq("id", id);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: "signal_removed", target_type: "live_signal", target_id: id, details: {},
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-signals"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div><h1 className="text-2xl font-display">Live Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">Override AI-generated content on the Live tab.</p></div>
      <div className="flex flex-wrap gap-1.5">
        {SIGNAL_TYPES.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`text-[11px] uppercase tracking-wider rounded-full px-3 py-1.5 border ${type === t ? "bg-gold/15 text-gold border-gold/40" : "glass border-white/10 text-foreground/70"}`}>
            {t.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label"
          className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle (optional)"
          className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
        <input value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Metric (e.g. 4,823 live)"
          className="w-full glass rounded-lg px-3 py-2 text-sm bg-black/20 border border-white/10" />
        <button onClick={() => add.mutate()} disabled={!label.trim()}
          className="inline-flex items-center gap-1 text-[11px] rounded-full px-3 py-1.5 bg-gold/15 text-gold border border-gold/40 disabled:opacity-40">
          <Plus className="h-3 w-3" strokeWidth={2} /> Add signal
        </button>
      </div>
      <div className="space-y-2">
        {signals.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 bg-black/30 p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.label}</div>
              <div className="text-[11px] text-foreground/60">{s.subtitle ?? ""} {s.metric_value ? `· ${s.metric_value}` : ""}</div>
            </div>
            <button onClick={() => remove.mutate(s.id)} className="text-[11px] text-rose-300">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
