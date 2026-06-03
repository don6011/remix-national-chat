import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATES } from "@/lib/states";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Welcome — National Chamber" }] }),
  component: OnboardingPage,
});

const INTERESTS = ["Sports", "Music", "Business", "Town Hall", "Coffee Shop", "Creator Culture", "Local Events"];

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [homeState, setHomeState] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  async function finish() {
    setBusy(true); setError(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setBusy(false); return; }
    const { error } = await supabase.from("profiles").update({
      display_name: displayName.trim() || null,
      username: username.trim() || null,
      home_state: homeState || null,
      current_state: homeState || null,
      interests,
      onboarded: true,
    }).eq("user_id", u.user.id);
    setBusy(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center gap-1.5 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition ${s <= step ? "bg-gold" : "bg-white/10"}`} />
          ))}
        </div>
        <div className="glass-strong rounded-2xl border border-white/10 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold/90">Step 1 of 3</div>
                <h1 className="font-display text-2xl mt-1">Your identity</h1>
              </div>
              <label className="block">
                <div className="text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">Display name</div>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jordan Reyes"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm border border-white/10 focus:outline-none focus:border-gold/40 bg-black/20" />
              </label>
              <label className="block">
                <div className="text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">Username</div>
                <input value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="jordan"
                  className="w-full glass rounded-xl px-3 py-2.5 text-sm border border-white/10 focus:outline-none focus:border-gold/40 bg-black/20" />
              </label>
              <button onClick={() => setStep(2)} disabled={!displayName.trim() || !username.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
                Continue <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold/90">Step 2 of 3</div>
                <h1 className="font-display text-2xl mt-1">Pick your home state</h1>
              </div>
              <div className="max-h-72 overflow-y-auto rounded-xl glass border border-white/10 divide-y divide-white/5">
                {STATES.map((s) => (
                  <button key={s.id} onClick={() => setHomeState(s.name)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition ${homeState === s.name ? "bg-gold/10" : ""}`}>
                    <span className="text-sm">{s.emoji} {s.name}</span>
                    {homeState === s.name ? <Check className="h-4 w-4 text-gold" strokeWidth={2.5} /> : null}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="glass rounded-xl px-4 py-3 text-sm border border-white/10">Back</button>
                <button onClick={() => setStep(3)} disabled={!homeState}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
                  Continue <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-gold/90">Step 3 of 3</div>
                <h1 className="font-display text-2xl mt-1">What moves you?</h1>
                <p className="text-xs text-muted-foreground mt-1">Pick a few. We'll tune your feed.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => {
                  const on = interests.includes(i);
                  return (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className={`text-xs rounded-full px-3 py-1.5 border transition ${on ? "bg-gold/15 border-gold/40 text-gold" : "glass border-white/10 text-foreground/70"}`}>
                      {i}
                    </button>
                  );
                })}
              </div>
              {error ? <div className="text-[11px] text-rose-300">{error}</div> : null}
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="glass rounded-xl px-4 py-3 text-sm border border-white/10">Back</button>
                <button onClick={finish} disabled={busy}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-gold to-amber-500 text-[var(--navy-deep)] font-display text-sm uppercase tracking-wider disabled:opacity-50">
                  {busy ? "Setting up…" : "Enter the Chamber"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
