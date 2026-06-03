import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Map, Radio, Compass, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { to: "/", label: "Chat", icon: MessageCircle },
  { to: "/states", label: "States", icon: Map },
  { to: "/live", label: "Live", icon: Radio },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/me", label: "Me", icon: UserCircle2 },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-2xl px-3 pb-3">
        <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-between shadow-[0_-8px_40px_-12px_oklch(0.82_0.14_85/0.25)]">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[10px] tracking-wide uppercase"
              >
                {active && (
                  <motion.span
                    layoutId="navGlow"
                    className="absolute inset-0 rounded-xl glass-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative h-5 w-5 ${active ? "text-gold" : "text-muted-foreground"}`}
                  strokeWidth={1.75}
                />
                <span className={`relative ${active ? "text-gold" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
