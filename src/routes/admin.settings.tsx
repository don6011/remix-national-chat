import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { data: actions = [] } = useQuery({
    queryKey: ["admin-actions"],
    queryFn: async () => (await supabase.from("admin_actions").select("*").order("created_at", { ascending: false }).limit(50)).data ?? [],
  });

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-display">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">App configuration and audit log.</p></div>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
        <h2 className="font-display text-lg">Brand</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><div className="text-[11px] uppercase text-foreground/60">App name</div><div>National Chamber</div></div>
          <div><div className="text-[11px] uppercase text-foreground/60">Theme</div><div>Navy + Gold (cinematic)</div></div>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-3">
        <h2 className="font-display text-lg">Moderation defaults</h2>
        <ul className="text-sm text-foreground/75 space-y-1 list-disc list-inside">
          <li>New reports start in <span className="text-gold">pending</span> and require approval.</li>
          <li>Messages default to <span className="text-gold">visible</span>; moderators can hide or remove.</li>
          <li>Upload limit: 60 seconds, MP4/MOV.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30">
        <div className="px-4 py-3 border-b border-white/5"><h2 className="font-display text-lg">Audit Log</h2></div>
        <div className="divide-y divide-white/5 max-h-96 overflow-auto">
          {actions.length === 0 ? (
            <div className="p-4 text-sm text-foreground/60">No admin actions yet.</div>
          ) : actions.map((a) => (
            <div key={a.id} className="px-4 py-2 text-sm flex items-center justify-between">
              <div>
                <span className="text-gold">{a.action_type}</span>
                <span className="text-foreground/60"> · {a.target_type} {a.target_id ? `· ${a.target_id.slice(0, 8)}` : ""}</span>
              </div>
              <div className="text-[10px] text-foreground/50">{new Date(a.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
