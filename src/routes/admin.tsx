import { createFileRoute, Outlet, redirect, Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Map, MessagesSquare, Video, Radio, Shield, Settings, LogOut,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { data: u, error } = await supabase.auth.getUser();
    if (error || !u.user) throw redirect({ to: "/login", search: { redirect: location.href } });
    // Admin role check — reserved for future use
    throw redirect({ to: "/" });
  },
  head: () => ({ meta: [{ title: "Admin — National Chamber" }] }),
  component: AdminLayout,
});

const NAV: ReadonlyArray<{
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/states", label: "States", icon: Map },
  { to: "/admin/rooms", label: "Rooms", icon: MessagesSquare },
  { to: "/admin/reports", label: "Citizen Reports", icon: Video },
  { to: "/admin/live-feed", label: "Live Feed", icon: Radio },
  { to: "/admin/moderation", label: "Moderation Queue", icon: Shield },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex bg-[#0a0e1f] text-foreground">
      <aside className="w-56 shrink-0 border-r border-white/5 bg-black/30 flex flex-col">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold/90">Admin</div>
          <div className="font-display text-lg mt-0.5">National Chamber</div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-gold/15 text-gold" : "text-foreground/70 hover:bg-white/5"}`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-white/5 space-y-0.5">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-white/5">
            <LogOut className="h-4 w-4" strokeWidth={2} /> Back to app
          </Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-300/80 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
