import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, ErrorMsg } from "./login";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — National Chamber" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase auto-processes the recovery token from the URL hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/", replace: true });
  }

  return (
    <AuthShell title="Set a new password" subtitle={ready ? "Choose a strong password." : "Waiting for reset link…"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="New password" icon={Lock}>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            disabled={!ready} className="w-full bg-transparent text-sm focus:outline-none" />
        </Field>
        <Field label="Confirm password" icon={Lock}>
          <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)}
            disabled={!ready} className="w-full bg-transparent text-sm focus:outline-none" />
        </Field>
        {error ? <ErrorMsg>{error}</ErrorMsg> : null}
        <button type="submit" disabled={busy || !ready}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
          {busy ? "Updating…" : "Update password"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  );
}
