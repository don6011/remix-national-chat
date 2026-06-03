import { motion } from "framer-motion";

/**
 * Cinematic full-screen entrance overlay for venue rooms.
 * Layers:
 *  1. Black curtain fades out
 *  2. Venue-colored glow blooms then dissipates
 *  3. Soft white iris/flash sweeps once
 * Pointer-events none after ~200ms so users can interact immediately.
 */
export function RoomEntrance({ glow, label }: { glow: string; label?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
    >
      {/* black curtain */}
      <motion.div
        className="absolute inset-0 bg-[oklch(0.06_0.02_260)]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      />
      {/* venue color bloom */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${glow} 0%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.15, 1.4] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* white iris flash */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, oklch(1 0 0 / 0.18), transparent 40%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      />
      {/* label */}
      {label && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 0], y: [8, 0, -6] }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        >
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.5em] text-foreground/70">
              Entering
            </div>
            <div className="font-display text-3xl mt-2 text-gradient-gold">
              {label}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
