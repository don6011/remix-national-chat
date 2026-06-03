import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, ShieldCheck } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type AppUser = Tables<"users">;

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: async () => {
      let query = supabase.from("users").select("*").order("created_at", { ascending: false }).limit(100);
      if (q.trim()) query = query.or(`display_name.ilike.%${q}%,username.ilike.%${q}%`);
      const { data } = await query;
      return (data ?? []) as AppUser[];
    },
  });

  const verify = useMutation({
    mutationFn: async (userId: string) => {
      // Mark is_patriot_plus as a stand-in for verified until a dedicated verified column exists
      await supabase.from("users").update({ rank: "verified_citizen" }).eq("id", userId);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions" as never).insert({
        admin_user_id: u.user.id, action_type: "verified", target_type: "user", target_id: userId, details: {},
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-display">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} loaded</p>
      </div>
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/10 max-w-sm">
        <Search className="h-4 w-4 text-gold/80" strokeWidth={2} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or username…"
          className="w-full bg-transparent text-sm focus:outline-none" />
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-[11px] uppercase tracking-wider text-foreground/60">
            <tr>
              <th className="text-left px-3 py-2">User</th>
              <th className="text-left px-3 py-2">Home State</th>
              <th className="text-left px-3 py-2">Rank</th>
              <th className="text-left px-3 py-2">Founding</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.display_name ?? "—"}</div>
                  <div className="text-[11px] text-foreground/60">@{u.username}</div>
                </td>
                <td className="px-3 py-2 text-foreground/70">{u.home_state}</td>
                <td className="px-3 py-2">
                  <span className="text-[11px] rounded-full px-2 py-0.5 bg-gold/10 text-gold border border-gold/30 capitalize">
                    {u.rank}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {u.is_founding_citizen
                    ? <span className="text-[11px] text-gold">⭐ Founding</span>
                    : <span className="text-[11px] text-foreground/40">—</span>}
                </td>
                <td className="px-3 py-2">
                  {u.rank !== "verified_citizen" ? (
                    <button onClick={() => verify.mutate(u.id)}
                      className="inline-flex items-center gap-1 text-[11px] glass-gold rounded-full px-2 py-1 text-gold border border-gold/30">
                      <ShieldCheck className="h-3 w-3" strokeWidth={2} /> Verify
                    </button>
                  ) : <span className="text-[11px] text-gold">Verified</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
