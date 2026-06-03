import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { subscribeActivity } from "@/lib/activityBus";

/**
 * America Alive — a premium real-time visualization of the continental US.
 * Silhouette + city hubs that pulse with conversation activity + connection
 * trails + a periodic "America pulse" sweep. No rivalry / betting framing.
 */

type NodeId = "sea" | "la" | "tx" | "chi" | "nsh" | "atl" | "fl" | "ny" | "ms";

export type MapStatus = {
  mostActive?: NodeId;
  fastestGrowing?: NodeId;
  topicLeader?: string;
  pills?: {
    mostActive?: string;
    fastestGrowing?: string;
    topicLeader?: string;
  };
};

// Real continental US silhouette + Alaska, projected with d3-geo Albers USA
// into our 760x460 viewBox (fitExtent [[20,30],[740,430]]). Simplified with
// topojson-simplify (weight 0.5) so the path stays under 2KB while keeping
// the recognizable Great Lakes notch, Florida finger, Texas bulge, Pacific NW,
// and the Alaska shape in the lower-left corner.
const US_PATH =
  "M90.8,36.4L115.2,45.9L114.1,30L255.3,47L395.8,68.7L410,75.9L454.4,81.9L429.1,101.6L446.7,104.6L469.7,89.1L479.4,102.8L505,96.3L521.5,107.6L484.4,113L478.1,154.3L485.9,178.7L494.7,173.9L494.4,129.9L508.6,111.2L523.3,116.1L540.1,150.8L531.2,171L551.4,173.2L578,151.9L576.9,140.8L600.3,136.2L617.7,104.6L653.2,95.9L662.7,79.2L666.7,52.8L683.1,54.3L689.2,74.9L701.8,85.2L671.5,114.9L669.2,133.8L683.9,141.4L645,162.7L625.1,225.1L638.8,251.5L588.7,310.7L580.1,338.9L607.9,393.4L610.4,413.6L598.8,424.6L568.1,386.3L568,370L544.4,354.4L482.1,356L475,372.2L457.7,378.6L442.5,367L412.2,370.9L381,391.4L367.4,407.1L367.6,430L343.3,420.3L338.7,403.8L313.2,367L290.2,377.8L272.2,366.1L267,349.3L248.6,330.2L225.8,334.5L188.2,329.1L143.1,302.5L113.7,295.6L101.3,268.5L78.9,256.2L59.3,177.2L58.2,155.4L66.9,138.7L68,116.1L93.3,60.6Z" +
  "M80.3,366.2L89.3,362.7L90.2,365.7L96.4,365.6L95.2,361L86.2,352.5L87.7,349.8L91.6,350.2L97.1,343.4L104.4,341.4L106.8,339.1L110.7,341.6L115,341.6L128.9,345.1L131.9,343.6L136.6,345.5L146.5,395.3L151.5,395.5L157.7,400.6L161.7,394.5L169.5,400L176.9,408L182.7,408.7L183.6,416.5L175.3,411.4L162.7,397.1L165.3,402.6L161,403.7L149,398.2L138.3,398.5L129.9,393.3L126.7,395.6L128.5,399.3L124.5,400.1L118.5,404.9L118.4,394.7L113.5,406L98.3,419.9L98.1,421.9L77.6,428.1L101.1,413.4L103,406.4L97.5,408.5L94.2,404.6L89.9,407L89.3,398.1L85.5,399.6L81.5,394.8L80.5,389.3L87.4,380.7L89.6,382.2L95.6,379L95.2,372.6L91.9,374.4L83.4,372.7L83.6,368.6Z";

const NODES: Record<NodeId, { x: number; y: number; city: string; short: string; stateId?: string; live?: number; topic?: string }> = {
  sea: { x: 112, y: 90,  city: "Seattle",    short: "SEA" },
  la:  { x: 105, y: 269, city: "California", short: "LA", stateId: "california", live: 6912, topic: "LA vs SF — which city wins 2026?"  },
  tx:  { x: 380, y: 365, city: "Texas",      short: "TX", stateId: "texas",      live: 4823, topic: "Cowboys vs Eagles tonight"  },
  chi: { x: 483, y: 176, city: "Chicago",    short: "CHI" },
  nsh: { x: 502, y: 264, city: "Tennessee",  short: "TN", stateId: "tennessee",  live: 2104, topic: "Open mic Nashville — new artists" },
  ms:  { x: 470, y: 318, city: "Mississippi", short: "MS", stateId: "mississippi", live: 578,  topic: "Delta blues showcase 9pm CT" },
  atl: { x: 536, y: 298, city: "Atlanta",    short: "ATL" },
  fl:  { x: 605, y: 410, city: "Florida",    short: "FL", stateId: "florida",    live: 4448, topic: "Best beach in the panhandle?"  },
  ny:  { x: 642, y: 168, city: "New York",   short: "NY", stateId: "new-york",   live: 5320, topic: "Subway closures — what's happening" },
};

// Map activity stateId → node so live events glow the right hub.
const STATE_TO_NODE: Record<string, NodeId> = {
  washington: "sea",
  california: "la",
  texas: "tx",
  illinois: "chi",
  tennessee: "nsh",
  mississippi: "ms",
  georgia: "atl",
  florida: "fl",
  "new-york": "ny",
  newyork: "ny",
  ny: "ny",
};

// Conversation flow lines — coast-to-coast, north-to-south.
const LINKS: Array<[NodeId, NodeId]> = [
  ["sea", "chi"],
  ["sea", "la"],
  ["la", "tx"],
  ["la", "ny"],
  ["tx", "atl"],
  ["tx", "fl"],
  ["atl", "fl"],
  ["chi", "ny"],
  ["chi", "atl"],
  ["chi", "nsh"],
  ["nsh", "atl"],
  ["ny", "atl"],
];

export function UsaMapGlow({
  className = "",
  status = {
    mostActive: "tx",
    fastestGrowing: "la",
    topicLeader: "Mississippi Blues Rising",
    pills: {
      mostActive: "Texas #1 Tonight",
      fastestGrowing: "California +38%",
      topicLeader: "Mississippi Blues Rising",
    },
  },
}: {
  className?: string;
  status?: MapStatus;
}) {
  const mostActive = status.mostActive;
  const fastest = status.fastestGrowing;

  // Real-time boost — nodes briefly glow when their state sees activity.
  const [boosts, setBoosts] = useState<Partial<Record<NodeId, number>>>({});
  useEffect(() => {
    const unsub = subscribeActivity((ev) => {
      const node = ev.stateId ? STATE_TO_NODE[ev.stateId.toLowerCase()] : undefined;
      if (!node) return;
      const stamp = ev.at;
      setBoosts((b) => ({ ...b, [node]: stamp }));
      const t = setTimeout(() => {
        setBoosts((b) => (b[node] === stamp ? { ...b, [node]: 0 } : b));
      }, 2400);
      return () => clearTimeout(t);
    });
    return unsub;
  }, []);

  // Ambient constellation ripples — auto-fire on the 6 interactive hubs so
  // the map always feels alive, even with no inbound activity.
  const INTERACTIVE: NodeId[] = ["tx", "fl", "la", "ms", "nsh", "ny"];
  const [ambient, setAmbient] = useState<Partial<Record<NodeId, number>>>({});
  useEffect(() => {
    let idx = 0;
    const tick = () => {
      const node = INTERACTIVE[idx % INTERACTIVE.length];
      idx++;
      const stamp = Date.now();
      setAmbient((b) => ({ ...b, [node]: stamp }));
    };
    tick();
    const t = setInterval(tick, 2600);
    return () => clearInterval(t);
  }, []);

  const navigate = useNavigate();
  const [hovered, setHovered] = useState<NodeId | null>(null);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <svg
        viewBox="0 0 760 460"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.92 0.18 230)" stopOpacity="0.95" />
            <stop offset="55%" stopColor="oklch(0.70 0.22 250)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.55 0.20 260)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hubGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.94 0.18 90)" stopOpacity="0.98" />
            <stop offset="55%" stopColor="oklch(0.78 0.18 70)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="oklch(0.55 0.16 60)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="strokeGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.80 0.18 230)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="oklch(0.88 0.16 250)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 290)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="trailGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.96 0.16 230)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.96 0.18 230)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.96 0.16 230)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rivalryGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.94 0.18 90)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.94 0.20 90)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.94 0.18 90)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sweepGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.95 0.16 230)" stopOpacity="0" />
            <stop offset="48%" stopColor="oklch(0.96 0.20 230)" stopOpacity="0.55" />
            <stop offset="52%" stopColor="oklch(0.96 0.20 230)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.95 0.16 230)" stopOpacity="0" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="latDots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1.1" fill="oklch(0.82 0.14 230)" fillOpacity="0.22" />
          </pattern>
          <clipPath id="usClip">
            <path d={US_PATH} />
          </clipPath>
        </defs>

        {/* Dot-grid fill inside silhouette */}
        <g clipPath="url(#usClip)">
          <rect x="0" y="0" width="760" height="460" fill="url(#latDots)" />
          <rect
            x="0"
            y="0"
            width="760"
            height="460"
            fill="oklch(0.55 0.22 250)"
            fillOpacity="0.06"
          />

          {/* AMERICA PULSE — full-shape sweep every ~18s */}
          <motion.rect
            x="-380"
            y="0"
            width="380"
            height="460"
            fill="url(#sweepGrad)"
            initial={{ x: -380 }}
            animate={{ x: 760 }}
            transition={{ duration: 4.2, repeat: Infinity, repeatDelay: 14, ease: "easeInOut" }}
          />
        </g>

        {/* Continental glow outline */}
        <path
          d={US_PATH}
          fill="none"
          stroke="url(#strokeGrad)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          filter="url(#softGlow)"
        />

        {/* Static base connection web */}
        <g stroke="oklch(0.78 0.16 235)" strokeOpacity="0.22" strokeWidth="0.7" fill="none">
          {LINKS.map(([a, b], i) => (
            <line
              key={`base-${i}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
            />
          ))}
        </g>

        {/* Animated light trails along each link */}
        <g filter="url(#softGlow)">
          {LINKS.map(([a, b], i) => {
            const A = NODES[a];
            const B = NODES[b];
            const dx = B.x - A.x;
            const dy = B.y - A.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            return (
              <motion.line
                key={`trail-${i}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="url(#trailGrad)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeDasharray={`${len * 0.18} ${len * 0.82}`}
                initial={{ strokeDashoffset: len }}
                animate={{ strokeDashoffset: -len }}
                transition={{
                  duration: 3.6 + (i % 4) * 0.9,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (i * 0.45) % 3,
                }}
              />
            );
          })}
        </g>

        {/* Activity nodes */}
        {(Object.entries(NODES) as Array<[NodeId, (typeof NODES)[NodeId]]>).map(
          ([id, h], i) => {
            const isMost = id === mostActive;
            const isFast = id === fastest;
            const boostStamp = boosts[id] ?? 0;
            const isBoosted = boostStamp > 0;
            const baseR = isMost ? 28 : isFast ? 22 : 18;
            const dur = isMost ? 2.4 : isFast ? 2.8 : 3.2 + (i % 3) * 0.6;
            const interactive = !!h.stateId;
            return (
              <g
                key={id}
                style={interactive ? { pointerEvents: "auto", cursor: "pointer" } : undefined}
                onMouseEnter={interactive ? () => setHovered(id) : undefined}
                onMouseLeave={interactive ? () => setHovered((p) => (p === id ? null : p)) : undefined}
                onClick={
                  interactive
                    ? () => navigate({ to: "/states/$stateId", params: { stateId: h.stateId! } })
                    : undefined
                }
              >
                {interactive && (
                  <circle cx={h.x} cy={h.y} r={26} fill="transparent" />
                )}
                {/* Soft breathing constellation ring on every interactive hub */}
                {interactive && (
                  <motion.circle
                    cx={h.x}
                    cy={h.y}
                    r={baseR - 4}
                    fill="none"
                    stroke="oklch(0.92 0.14 230)"
                    strokeOpacity={0.22}
                    strokeWidth={0.6}
                    initial={{ scale: 0.8, opacity: 0.35 }}
                    animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.35, 0, 0.35] }}
                    style={{ originX: `${h.x}px`, originY: `${h.y}px` }}
                    transition={{
                      duration: 4.2 + (i % 3) * 0.7,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (i * 0.55) % 3,
                    }}
                  />
                )}
                {/* Ambient auto-ripple — keeps the 6 hubs feeling alive */}
                {interactive && ambient[id] && (
                  <motion.circle
                    key={`amb-${id}-${ambient[id]}`}
                    cx={h.x}
                    cy={h.y}
                    r={baseR - 2}
                    fill="none"
                    stroke="oklch(0.94 0.14 230)"
                    strokeOpacity={0.55}
                    strokeWidth={0.7}
                    initial={{ scale: 0.55, opacity: 0.7 }}
                    animate={{ scale: 2.3, opacity: 0 }}
                    transition={{ duration: 2.4, ease: "easeOut" }}
                    style={{ originX: `${h.x}px`, originY: `${h.y}px` }}
                  />
                )}
                {/* Steady ambient pulse for the most-active node */}
                {isMost && (
                  <motion.circle
                    cx={h.x}
                    cy={h.y}
                    r={baseR}
                    fill="none"
                    stroke="oklch(0.92 0.16 230)"
                    strokeOpacity={0.35}
                    strokeWidth={0.7}
                    initial={{ scale: 0.7, opacity: 0.5 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    style={{ originX: `${h.x}px`, originY: `${h.y}px` }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                {/* Real-time activity ripple — fires once per inbound event */}
                {isBoosted && (
                  <motion.circle
                    key={`boost-${id}-${boostStamp}`}
                    cx={h.x}
                    cy={h.y}
                    r={baseR}
                    fill="none"
                    stroke="oklch(0.95 0.14 230)"
                    strokeOpacity={0.7}
                    strokeWidth={1}
                    initial={{ scale: 0.6, opacity: 0.85 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 2.2, ease: "easeOut" }}
                    style={{ originX: `${h.x}px`, originY: `${h.y}px` }}
                  />
                )}
                <motion.circle
                  cx={h.x}
                  cy={h.y}
                  r={baseR}
                  fill="url(#hubGlow)"
                  initial={{ opacity: 0.3, scale: 0.85 }}
                  animate={{
                    opacity: isMost
                      ? [0.5, 0.95, 0.5]
                      : isBoosted
                      ? [0.55, 0.95, 0.45]
                      : [0.28, 0.78, 0.28],
                    scale: isMost
                      ? [0.95, 1.35, 0.95]
                      : isBoosted
                      ? [0.95, 1.4, 0.95]
                      : [0.85, 1.25, 0.85],
                  }}
                  transition={{
                    duration: isBoosted ? 1.4 : dur,
                    repeat: Infinity,
                    delay: (i * 0.35) % 3,
                    ease: "easeInOut",
                  }}
                />
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={isMost ? 3 : 2.4}
                  fill="oklch(0.96 0.14 230)"
                  opacity={0.98}
                />
                <text
                  x={h.x}
                  y={h.y - (isMost ? 22 : 16)}
                  textAnchor="middle"
                  fontSize={isMost ? 9 : 8}
                  letterSpacing="2"
                  fill="oklch(0.92 0.08 230)"
                  fillOpacity={isMost ? 0.9 : 0.6}
                  style={{ textTransform: "uppercase" }}
                >
                  {h.city}
                </text>
              </g>
            );
          },
        )}
      </svg>

      {/* Hover tooltip for interactive state nodes */}
      {hovered && NODES[hovered]?.stateId && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(NODES[hovered].x / 760) * 100}%`,
            top: `${(NODES[hovered].y / 460) * 100}%`,
            marginTop: -10,
          }}
        >
          <div className="px-2.5 py-1.5 rounded-lg bg-[oklch(0.10_0.04_260/0.95)] border border-white/15 backdrop-blur-md shadow-lg whitespace-nowrap">
            <div className="text-[11px] font-semibold text-foreground/95 leading-tight">
              {NODES[hovered].city}
            </div>
            <div className="text-[9px] text-[oklch(0.85_0.14_230)] tabular-nums">
              {NODES[hovered].live?.toLocaleString()} live
            </div>
            <div className="text-[10px] text-foreground/70 max-w-[200px] truncate">
              {NODES[hovered].topic}
            </div>
          </div>
        </div>
      )}

      {/* Live status pills — overlay corners */}
      {status.pills && (
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute top-2 left-2 right-2 flex flex-wrap items-center justify-between gap-1.5 text-[9px] uppercase tracking-[0.18em]">
            {status.pills.mostActive && (
              <span className="px-2 py-1 rounded-full bg-[oklch(0.18_0.06_60/0.55)] border border-gold/40 text-gold backdrop-blur-sm">
                🔥 {status.pills.mostActive}
              </span>
            )}
            {status.pills.fastestGrowing && (
              <span className="px-2 py-1 rounded-full bg-[oklch(0.15_0.08_240/0.55)] border border-[oklch(0.80_0.18_230/0.5)] text-[oklch(0.92_0.12_230)] backdrop-blur-sm">
                ⚡ {status.pills.fastestGrowing}
              </span>
            )}
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-end gap-1.5 text-[9px] uppercase tracking-[0.18em]">
            {status.pills.topicLeader && (
              <span className="px-2 py-1 rounded-full bg-[oklch(0.15_0.08_240/0.55)] border border-[oklch(0.80_0.18_230/0.5)] text-[oklch(0.92_0.12_230)] backdrop-blur-sm">
                🎵 {status.pills.topicLeader}
              </span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
