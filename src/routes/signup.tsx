import { useState, type FormEvent } from "react";
import { Link, useNavigate, createFileRoute } from "@tanstack/react-router";
import { Mail, Lock, User, AtSign, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field, ErrorMsg } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — National Chamber" }] }),
  component: SignupPage,
});

const HOME_STATES = ["Texas", "Florida", "Mississippi", "Tennessee", "California"];

function SignupPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [homeState, setHomeState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!homeState) { setError("Please select your home state."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setBusy(true);

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Pass fields through metadata — DB trigger reads these to populate public.users
        data: {
          username: username.trim().toLowerCase().replace(/\s/g, ""),
          display_name: displayName.trim() || null,
          home_state: homeState,
        },
      },
    });

    setBusy(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Email confirmation is disabled in Supabase — session is always returned on signup.
    // Navigate directly to onboarding. The DB trigger has already created the users row.
    if (data.session) {
      navigate({ to: "/onboarding", replace: true });
    } else {
      // Fallback: session missing means email confirmation is unexpectedly still on.
      // Sign them in explicitly.
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Account created but sign-in failed. Please sign in manually.");
        return;
      }
      navigate({ to: "/onboarding", replace: true });
    }
  }

  return (
    <AuthShell title="Join the Chamber" subtitle="Become a Citizen of National Chat.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Display name" icon={User}>
          <input required value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="Your full name" />
        </Field>
        <Field label="Username" icon={AtSign}>
          <input required value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            className="w-full bg-transparent text-sm focus:outline-none" placeholder="no spaces" />
        </Field>
        <label className="block">
          <div className="text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">Home State</div>
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-gold/40">
            <MapPin className="h-4 w-4 text-gold/80 shrink-0" strokeWidth={2} />
            <select required value={homeState} onChange={(e) => setHomeState(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none appearance-none cursor-pointer text-foreground">
              <option value="" disabled className="bg-[#080F24]">Select your state…</option>
              {HOME_STATES.map((s) => (
                <option key={s} value={s} className="bg-[#080F24]">{s}</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gold/60 shrink-0" strokeWidth={2} />
          </div>
        </label>
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
          {busy ? "Creating…" : "Become a Citizen"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </form>
      <div className="mt-6 text-center text-[11px] text-foreground/70">
        Already a Citizen? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  );
}
