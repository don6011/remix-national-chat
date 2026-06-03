import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in — National Chamber" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    // Route new users through onboarding; default to Chamber on any DB error
    let dest = redirect ?? "/";
    if (data.user) {
      const { data: appUser } = await supabase
        .from("users").select("onboarded").eq("id", data.user.id).maybeSingle();
      // Only redirect to onboarding when we can confirm onboarded is explicitly false
      if (appUser && appUser.onboarded === false) dest = "/onboarding";
    }
    setBusy(false);
    navigate({ to: dest, replace: true });
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to your Citizen account.">
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email" icon={Mail}>
        <input type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none" placeholder="you@example.com" />
      </Field>
      <Field label="Password" icon={Lock}>
        <input type="password" required autoComplete="current-password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none" placeholder="••••••••" />
      </Field>
      {error ? <ErrorMsg>{error}</ErrorMsg> : null}
      <button type="submit" disabled={busy}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
        {busy ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </form>
    <div className="mt-6 flex items-center justify-between text-[11px] text-foreground/70">
      <Link to="/forgot-password" className="hover:text-gold transition">Forgot password?</Link>
      <Link to="/signup" className="hover:text-gold transition">Create an account →</Link>
    </div>
  </AuthShell>;
}

/* ------------------------- Shared shell ------------------------- */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold/90">National Chamber</div>
          <h1 className="font-display text-3xl mt-2">{title}</h1>
          {subtitle ? <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p> : null}
        </div>
        <div className="glass-strong rounded-2xl border border-white/10 p-6">{children}</div>
      </motion.div>
    </div>
  );
}

export function Field({ label, icon: Icon, children }:
  { label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">{label}</div>
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-gold/40">
        <Icon className="h-4 w-4 text-gold/80" strokeWidth={2} />
        {children}
      </div>
    </label>
  );
}

export function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[11px] text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
      <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" strokeWidth={2} />
      <span>{children}</span>
    </div>
  );
}
