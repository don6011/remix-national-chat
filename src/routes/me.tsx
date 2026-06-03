import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { STATES } from "@/lib/states";
import { RankSystem } from "@/components/RankSystem";
import type { Tables } from "@/integrations/supabase/types";
import {
  Shield, MapPin, Circle, Crown, CheckCircle2, LogOut, LogIn,
} from "lucide-react";

export const Route = createFileRoute("/me")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Citizen Passport — National Chat" },
      { name: "description", content: "Your citizen passport: influence, rank, and path to Governor." },
    ],
  }),
  component: Me,
});

const GOVERNOR_TASKS: { label: string; done: boolean; progress: string }[] = [
  { label: "Messages",             done: true,  progress: "512 of 500 sent" },
  { label: "Rooms Explored",       done: false, progress: "3 of 4 rooms visited (30m+)" },
  { label: "Reactions Received",   done: true,  progress: "84 of 50" },
  { label: "Citizens Referred",    done: false, progress: "1 of 3" },
  { label: "Citizen Report Filed", done: false, progress: "No" },
];

function Me() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const [appUser, setAppUser] = useState<Tables<"users"> | null>(null);
  const [citizenNo, setCitizenNo] = useState<number | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setUserLoading(true);
      const [{ data: row }, { count }] = await Promise.all([
        supabase.from("users").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("users").select("*", { count: "exact", head: true })
          .lte("created_at", user!.created_at ?? new Date().toISOString()),
      ]);
      setAppUser(row ?? null);
      setCitizenNo(count ?? null);
      setUserLoading(false);
    }
    load();
  }, [user]);

  const home = STATES.find((s) =>
    appUser?.home_state
      ? s.name.toLowerCase() === appUser.home_state.toLowerCase() ||
        s.id.toLowerCase() === appUser.home_state.toLowerCase()
      : s.id === "texas"
  ) ?? STATES[0];

  const displayName = appUser?.display_name || appUser?.username || user?.email?.split("@")[0] || "Citizen";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const passportNo = citizenNo != null
    ? String(citizenNo).padStart(6, "0")
    : user?.id.slice(0, 6).toUpperCase() ?? "------";
  const memberYear = appUser?.created_at
    ? new Date(appUser.created_at).getFullYear()
    : new Date().getFullYear();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#080F24" }}>
        <div className="text-center space-y-4">
          <LogIn className="h-10 w-10 text-gold mx-auto" strokeWidth={1.5} />
          <h2 className="font-display text-2xl" style={{ color: "#F4F1E8" }}>Sign in to view your passport</h2>
          <p className="text-sm" style={{ color: "rgba(244,241,232,0.55)" }}>
            Your Citizen Passport is only visible when you're logged in.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm uppercase tracking-wider"
            style={{ background: "linear-gradient(135deg, #C9A84C, #d4a017)", color: "#080F24", fontFamily: "Georgia, serif" }}
          >
            Sign in <LogIn className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-16">
      {/* CITIZEN PASSPORT CARD */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080F24] via-[#0E1A38] to-transparent" />
        <div className="absolute inset-0 particles" />
        <div className="relative max-w-2xl mx-auto px-5 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 relative overflow-hidden border"
            style={{
              background: "linear-gradient(160deg, #080F24 0%, #0E1A38 55%, #141F42 100%)",
              borderColor: "rgba(201,168,76,0.4)",
            }}
          >
            <div
              className="absolute -top-20 -right-16 h-52 w-52 rounded-full blur-3xl opacity-50"
              style={{ background: home.glow }}
            />
            <div className="relative flex items-center justify-between">
              <div className="section-label">Citizen Passport</div>
              <div className="flex items-center gap-3">
                <div
                  className="text-gold tabular-nums font-semibold tracking-[0.2em] text-sm"
                  style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}
                >
                  No. {passportNo}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-foreground/50 hover:text-rose-300 transition"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
                  Sign out
                </button>
              </div>
            </div>

            <div className="relative mt-5 flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl glass-gold flex items-center justify-center text-xl font-bold text-gold">
                  {userLoading ? "…" : initials}
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-[#0E1A38] animate-pulse" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="section-label flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {home.name}
                </div>
                <h1 className="font-display text-2xl leading-none mt-1">
                  {userLoading ? "Loading…" : displayName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                  <span className="text-gold flex items-center gap-1 capitalize">
                    <Shield className="h-3 w-3" /> {appUser?.rank ?? "Citizen"}
                  </span>
                  <span className="text-foreground/60">Citizen since {memberYear}</span>
                  <span className="text-emerald-300 flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" /> Online
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-5 space-y-6 pb-8">
        {/* CURRENT RANK + LADDER */}
        <RankSystem />

        {/* PATH TO GOVERNOR */}
        <section>
          <div className="glass-strong rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-4 w-4 text-gold" strokeWidth={2} />
              <h2 className="font-display text-lg leading-none">Path to Governor</h2>
            </div>
            <ul className="space-y-2">
              {GOVERNOR_TASKS.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-[rgba(201,168,76,0.15)] bg-white/[0.02]"
                >
                  {t.done ? (
                    <CheckCircle2 className="h-4 w-4 text-gold fill-gold/20 shrink-0" strokeWidth={2} />
                  ) : (
                    <Circle className="h-4 w-4 text-foreground/35 shrink-0" strokeWidth={2} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium ${t.done ? "text-foreground" : "text-foreground/75"}`}>
                      {t.label}
                    </div>
                    <div className="text-[11px] text-foreground/55 mt-0.5">{t.progress}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
