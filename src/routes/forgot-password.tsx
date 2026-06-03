import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, ErrorMsg } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — National Chamber" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) return (
    <AuthShell title="Check your email" subtitle="We sent you a reset link.">
      <p className="text-sm text-foreground/75 text-center">
        If <span className="text-gold">{email}</span> has an account, you'll receive a reset link shortly.
      </p>
      <Link to="/login" className="mt-6 block text-center text-[11px] uppercase tracking-wider text-gold/90 hover:text-gold">
        Back to sign in
      </Link>
    </AuthShell>
  );

  return (
    <AuthShell title="Forgot password" subtitle="Enter your email and we'll send a reset link.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" icon={Mail}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="you@example.com" />
        </Field>
        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
        <button type="submit" disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
          {busy ? "Sending…" : "Send reset link"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
      <div className="mt-6 text-center text-[11px] text-foreground/70">
        <Link to="/login" className="hover:text-gold">← Back to sign in</Link>
      </div>
    </AuthShell>
  );
}
