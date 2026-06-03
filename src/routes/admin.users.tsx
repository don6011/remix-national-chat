import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Search, ShieldCheck } from "lucide-react";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["user", "verified_user", "host", "state_reporter", "moderator", "admin", "super_admin"];

export const Route = createFileRoute("/admin/users")({ component: UsersPage });

function UsersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users", q],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
      if (q.trim()) query = query.or(`display_name.ilike.%${q}%,username.ilike.%${q}%`);
      const { data } = await query;
      return data ?? [];
    },
  });

  const { data: rolesMap = {} } = useQuery({
    queryKey: ["admin-roles", users.map((u) => u.user_id).join(",")],
    queryFn: async () => {
      if (users.length === 0) return {} as Record<string, AppRole[]>;
      const { data } = await supabase.from("user_roles").select("*").in("user_id", users.map((u) => u.user_id));
      const m: Record<string, AppRole[]> = {};
      (data ?? []).forEach((r) => { (m[r.user_id] ??= []).push(r.role as AppRole); });
      return m;
    },
    enabled: users.length > 0,
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role, on }: { userId: string; role: AppRole; on: boolean }) => {
      if (on) {
        await supabase.from("user_roles").insert({ user_id: userId, role });
      } else {
        await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      }
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
        admin_user_id: u.user.id, action_type: on ? "role_added" : "role_removed",
        target_type: "user", target_id: userId, details: { role },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-roles"] }),
  });

  const verify = useMutation({
    mutationFn: async (userId: string) => {
      await supabase.from("profiles").update({ is_verified: true }).eq("user_id", userId);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) await supabase.from("admin_actions").insert({
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
              <th className="text-left px-3 py-2">Home</th>
              <th className="text-left px-3 py-2">Roles</th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-3 py-2">
                  <div className="font-medium">{u.display_name ?? "—"}</div>
                  <div className="text-[11px] text-foreground/60">@{u.username ?? "—"}</div>
                </td>
                <td className="px-3 py-2 text-foreground/70">{u.home_state ?? "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {ALL_ROLES.map((r) => {
                      const on = (rolesMap[u.user_id] ?? []).includes(r);
                      return (
                        <button key={r} onClick={() => setRole.mutate({ userId: u.user_id, role: r, on: !on })}
                          className={`text-[10px] rounded-full px-2 py-0.5 border transition ${on ? "bg-gold/15 text-gold border-gold/40" : "text-foreground/50 border-white/10 hover:border-gold/30"}`}>
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {!u.is_verified ? (
                    <button onClick={() => verify.mutate(u.user_id)}
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
