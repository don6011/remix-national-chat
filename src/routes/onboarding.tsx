import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Welcome — National Chat" }] }),
  component: OnboardingPage,
});

const RANKS = [
  { title: "Citizen", desc: "Every American starts here. You have a voice." },
  { title: "Verified Citizen", desc: "Active in the conversation. Your identity is known." },
  { title: "Resident", desc: "You've put in time. Your state knows your name." },
  { title: "State Ambassador", desc: "You represent your state across the nation." },
  { title: "Governor", desc: "Elected by citizens. You lead your state's chamber." },
];

const SLIDES = [
  {
    eyebrow: "Welcome to",
    heading: "America's Digital Town Square",
    body: "National Chat is where 50 states meet in one conversation. Every state has its own Chamber — a live space where citizens talk, debate, and represent. This is the front page of America, built by Americans, for Americans.",
    accent: "50 States. One Conversation.",
  },
  {
    eyebrow: "How Ranks Work",
    heading: "Earn Your Place in the Republic",
    body: "Your rank reflects your contribution to the national conversation. The more you engage — post, react, visit rooms, represent your state — the higher you rise.",
    ranks: RANKS,
  },
  {
    eyebrow: "The Path to Power",
    heading: "How to Become Governor",
    body: "Governors are elected by citizens of their state. But first you must qualify. Meet all five requirements, then stand for election.",
    requirements: [
      { num: "01", text: "Send 500 messages across any rooms" },
      { num: "02", text: "Visit all 4 state rooms for 30+ minutes each" },
      { num: "03", text: "Receive 50 reactions from fellow citizens" },
      { num: "04", text: "Refer 3 new citizens to National Chat" },
      { num: "05", text: "File 1 citizen report from your state" },
    ],
  },
];

async function markOnboarded() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("users").update({ onboarded: true }).eq("id", data.user.id);
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const isLast = slide === SLIDES.length - 1;

  async function finish() {
    await markOnboarded();
    navigate({ to: "/", replace: true });
  }

  async function skip() {
    await markOnboarded();
    navigate({ to: "/", replace: true });
  }

  function next() {
    if (isLast) { finish(); return; }
    setSlide((s) => s + 1);
  }

  const current = SLIDES[slide];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12 relative"
      style={{ background: "#080F24" }}
    >
      {/* Skip */}
      <button
        onClick={skip}
        className="absolute top-5 right-5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/40 hover:text-white/70 transition"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        <X className="h-3.5 w-3.5" />
        Skip
      </button>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-10">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === slide ? 24 : 8,
              height: 8,
              background: i === slide ? "#C9A84C" : "rgba(201,168,76,0.25)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg"
        >
          {/* Eyebrow */}
          <div
            className="text-[11px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#C9A84C", fontFamily: "Arial, sans-serif" }}
          >
            {current.eyebrow}
          </div>

          {/* Heading */}
          <h1
            className="text-3xl leading-tight mb-4"
            style={{ color: "#F4F1E8", fontFamily: "Georgia, serif" }}
          >
            {current.heading}
          </h1>

          {/* Body */}
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(244,241,232,0.7)", fontFamily: "Arial, sans-serif" }}
          >
            {current.body}
          </p>

          {/* Slide 1: accent quote */}
          {"accent" in current && (
            <div
              className="rounded-xl px-5 py-4 mb-8 border"
              style={{
                background: "rgba(201,168,76,0.08)",
                borderColor: "rgba(201,168,76,0.25)",
              }}
            >
              <p
                className="text-lg text-center"
                style={{ color: "#C9A84C", fontFamily: "Georgia, serif" }}
              >
                "{current.accent}"
              </p>
            </div>
          )}

          {/* Slide 2: rank ladder */}
          {"ranks" in current && (
            <div className="space-y-2 mb-8">
              {current.ranks.map((r, i) => (
                <div
                  key={r.title}
                  className="flex items-start gap-3 rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-widest mt-0.5 w-5 shrink-0 text-right"
                    style={{ color: "#C9A84C", fontFamily: "Arial, sans-serif", opacity: 0.6 + i * 0.1 }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{ color: "#F4F1E8", fontFamily: "Georgia, serif" }}
                    >
                      {r.title}
                    </div>
                    <div
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(244,241,232,0.55)", fontFamily: "Arial, sans-serif" }}
                    >
                      {r.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide 3: governor requirements */}
          {"requirements" in current && (
            <div className="space-y-2 mb-8">
              {current.requirements.map((req) => (
                <div
                  key={req.num}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="text-[11px] tabular-nums shrink-0"
                    style={{ color: "#C9A84C", fontFamily: "Arial, sans-serif" }}
                  >
                    {req.num}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "#F4F1E8", fontFamily: "Arial, sans-serif" }}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={next}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5"
            style={{
              background: "linear-gradient(to right, #C9A84C, #d4a843)",
              color: "#080F24",
              fontFamily: "Georgia, serif",
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {isLast ? "Enter the Chamber" : "Next"}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
