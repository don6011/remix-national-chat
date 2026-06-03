import { useState, type FormEvent } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, ErrorMsg } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — National Chamber" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    if (data.session) {
      navigate({ to: "/onboarding", replace: true });
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="We sent a confirmation link to verify your account.">
        <p className="text-sm text-foreground/75 text-center">
          Click the link in <span className="text-gold">{email}</span> to activate your Citizen account.
        </p>
        <Link to="/login" className="mt-6 block text-center text-[11px] uppercase tracking-wider text-gold/90 hover:text-gold">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Join the Chamber" subtitle="Become a Citizen of National Chamber.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Display name" icon={User}>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="Your name" />
        </Field>
        <Field label="Email" icon={Mail}>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="you@example.com" />
        </Field>
        <Field label="Password" icon={Lock}>
          <input type="password" required autoComplete="new-password" minLength={8} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="At least 8 characters" />
        </Field>
        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
        <button type="submit" disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
          {busy ? "Creating…" : "Create account"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
      <div className="mt-6 text-center text-[11px] text-foreground/70">
        Already a Citizen? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  );
}
