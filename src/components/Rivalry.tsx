import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Swords } from "lucide-react";

export function Rivalry() {
  const [tx, setTx] = useState(61);
  const [voters, setVoters] = useState(2412);

  useEffect(() => {
    const id = setInterval(() => {
      setTx((v) => Math.max(48, Math.min(72, v + (Math.random() - 0.5) * 1.5)));
      setVoters((v) => v + Math.floor(Math.random() * 4));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const ok = 100 - tx;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[oklch(0.18_0.10_260/0.5)] via-[oklch(0.14_0.06_30/0.5)] to-[oklch(0.20_0.16_28/0.5)] border border-white/10 p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Swords className="h-3.5 w-3.5 text-gold" />
          <span className="text-[9.5px] uppercase tracking-[0.28em] text-gold">
            Live Rivalry · State War
          </span>
        </div>
        <span className="text-[9.5px] text-foreground/60">
          {voters.toLocaleString()} citizens voted
        </span>
      </div>

      <div className="flex items-center justify-between text-[12px] mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🤠</span>
          <span className="font-medium">Texas</span>
          <motion.span
            key={tx.toFixed(0)}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-lg text-gradient-gold ml-1"
          >
            {tx.toFixed(0)}%
          </motion.span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.span
            key={ok.toFixed(0)}
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-lg text-foreground/80"
          >
            {ok.toFixed(0)}%
          </motion.span>
          <span className="font-medium">Oklahoma</span>
          <span className="text-base">🌾</span>
        </div>
      </div>

      <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.16 60), oklch(0.70 0.24 28))",
            boxShadow: "0 0 20px oklch(0.70 0.24 28 / 0.5)",
          }}
          animate={{ width: `${tx}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <div className="mt-2 text-[10px] text-foreground/55 italic">
        Texas pulling ahead · debate exploding in chat
      </div>
    </div>
  );
}
