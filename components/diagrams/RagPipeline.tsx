"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/* An animated RAG + tool-use pipeline: query → fan-out → vector space →
   HNSW edges → reranker → cited answer. Pure SVG, scrubbed on scroll-in. */
export default function RagPipeline() {
  // Deterministic vector-space points.
  const points = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 46 }, () => ({
      x: 300 + (rand() - 0.5) * 150,
      y: 150 + (rand() - 0.5) * 130,
      r: 1.4 + rand() * 2.2,
      hot: rand() > 0.74,
    }));
  }, []);

  // Nearest-neighbor edges among "hot" points.
  const edges = useMemo(() => {
    const hot = points.filter((p) => p.hot);
    const e: { a: (typeof points)[0]; b: (typeof points)[0] }[] = [];
    for (let i = 0; i < hot.length; i++) {
      for (let j = i + 1; j < hot.length; j++) {
        const d = Math.hypot(hot[i].x - hot[j].x, hot[i].y - hot[j].y);
        if (d < 62) e.push({ a: hot[i], b: hot[j] });
      }
    }
    return e;
  }, [points]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-hairline bg-elevated/30">
      <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent" />
      <svg
        viewBox="0 0 760 300"
        className="w-full"
        role="img"
        aria-label="RAG and tool-use pipeline: a query fans out to tool calls and vector retrieval, connects nearest neighbours, reranks, and returns a cited answer."
      >
        {/* stage labels */}
        {[
          ["query", 60],
          ["tool-use", 175],
          ["vector space", 300],
          ["rerank", 560],
          ["cite", 690],
        ].map(([label, x]) => (
          <text
            key={label as string}
            x={x as number}
            y={288}
            textAnchor="middle"
            className="fill-[rgb(var(--faint))] font-mono"
            fontSize="9"
          >
            {label}
          </text>
        ))}

        {/* query node */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <rect x="26" y="130" width="68" height="40" rx="6" className="fill-none stroke-[rgb(var(--ink))]" strokeOpacity="0.5" />
          <text x="60" y="154" textAnchor="middle" className="fill-[rgb(var(--body))] font-mono" fontSize="10">
            ?query
          </text>
        </motion.g>

        {/* fan-out tool calls */}
        {[110, 150, 190].map((y, i) => (
          <motion.path
            key={y}
            d={`M94 150 C 130 150, 140 ${y}, 175 ${y}`}
            className="fill-none stroke-[rgb(var(--ink))]"
            strokeOpacity="0.28"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
          />
        ))}
        {[110, 150, 190].map((y, i) => (
          <motion.circle
            key={`t${y}`}
            cx="175"
            cy={y}
            r="5"
            className="fill-[#ffffff]"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 + i * 0.12, type: "spring", stiffness: 300 }}
          />
        ))}

        {/* streaming token dot along the top rail */}
        <motion.circle
          r="3"
          className="fill-[#ffffff]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 0.6 }}
        >
          <animateMotion dur="2s" repeatCount="indefinite" path="M175 110 C 230 90, 250 150, 300 150" />
        </motion.circle>

        {/* vector space edges (HNSW) */}
        {edges.map((e, i) => (
          <motion.line
            key={i}
            x1={e.a.x}
            y1={e.a.y}
            x2={e.b.x}
            y2={e.b.y}
            className="stroke-[#ffffff]"
            strokeOpacity="0.35"
            strokeWidth="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.35 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.3 + i * 0.03 }}
          />
        ))}

        {/* vector points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            className={p.hot ? "fill-[#ffffff]" : "fill-[rgb(var(--mute))]"}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: p.hot ? 1 : 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.012, type: "spring", stiffness: 260 }}
          />
        ))}

        {/* retrieval → reranker */}
        <motion.path
          d="M395 150 C 470 150, 480 150, 522 150"
          className="fill-none stroke-[rgb(var(--ink))]"
          strokeOpacity="0.28"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1.8 }}
        />
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <rect x="522" y="128" width="76" height="44" rx="6" className="fill-[rgb(var(--elevated))] stroke-[rgb(var(--ink))]" strokeOpacity="0.4" />
          <text x="560" y="147" textAnchor="middle" className="fill-[rgb(var(--body))] font-mono" fontSize="9">
            re-rank
          </text>
          <text x="560" y="160" textAnchor="middle" className="fill-[rgb(var(--faint))] font-mono" fontSize="8">
            top-k
          </text>
        </motion.g>

        {/* reranker → citation */}
        <motion.path
          d="M598 150 C 640 150, 650 150, 662 150"
          className="fill-none stroke-[rgb(var(--ink))]"
          strokeOpacity="0.28"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 2.3 }}
        />
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2.5, type: "spring", stiffness: 260 }}
        >
          <rect x="662" y="132" width="72" height="36" rx="6" className="fill-none stroke-[#ffffff]" />
          <text x="698" y="154" textAnchor="middle" className="fill-[#ffffff] font-mono" fontSize="10">
            [1] answer
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
