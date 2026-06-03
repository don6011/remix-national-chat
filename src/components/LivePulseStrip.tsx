import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ITEMS = [
  { icon: "🏛", text: "Texas Town Hall surging" },
  { icon: "🎸", text: "Mississippi Local Stage +38%" },
  { icon: "🏛", text: "Florida Town Hall trending" },
  { icon: "🎤", text: "California Local Stage packed" },
  { icon: "🎸", text: "Tennessee Local Stage buzzing" },
  { icon: "☕", text: "New York Coffee Shop rising" },
];

export function LivePulseStrip() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ITEMS.length), 4200);
    return () => clearInterval(t);
  }, []);
  const item = ITEMS[i];
  return (
    <div className="relative flex items-center justify-center gap-2.5 h-7 text-[12px] text-foreground/85">
      {/* Hairline connectors fading out from the rotating item */}
      <span className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent to-white/15" />
      <span className="live-dot" />
      <div className="relative h-5 overflow-hidden min-w-[220px] max-w-[340px] flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="hidden sm:block h-px w-16 bg-gradient-to-l from-transparent to-white/15" />
    </div>
  );
}
