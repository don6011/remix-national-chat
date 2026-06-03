import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Video, MessagesSquare, Flag, TrendingUp, Activity } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [users, reports, rooms, flags, activeReports] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        reports: reports.count ?? 0,
        rooms: rooms.count ?? 0,
        flags: flags.count ?? 0,
        activeReports: activeReports.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Total users", value: data?.users ?? "—", icon: Users },
    { label: "Active users (24h)", value: "—", icon: Activity },
    { label: "Reports uploaded", value: data?.reports ?? "—", icon: Video },
    { label: "Approved reports", value: data?.activeReports ?? "—", icon: TrendingUp },
    { label: "Active rooms", value: data?.rooms ?? "—", icon: MessagesSquare },
    { label: "Flagged content", value: data?.flags ?? "—", icon: Flag },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform health at a glance.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-foreground/60">
                <Icon className="h-3.5 w-3.5 text-gold" strokeWidth={2} /> {c.label}
              </div>
              <div className="font-display text-3xl mt-2 tabular-nums">{c.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
