"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* A live-feeling HNSW parameter tuner: adjust M / ef, watch recall + latency
   respond. Illustrative of the on-device tuning done for Aether. */
export default function HnswTuner() {
  const [ef, setEf] = useState(200);
  const [auto, setAuto] = useState(true);
  const dir = useRef(1);

  useEffect(() => {
    if (!auto) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setEf((v) => {
        let n = v + dir.current * 12;
        if (n >= 320) dir.current = -1;
        if (n <= 80) dir.current = 1;
        return Math.max(80, Math.min(320, n));
      });
    }, 900);
    return () => clearInterval(id);
  }, [auto]);

  // Illustrative curves (monotone, saturating).
  const recall = Math.min(0.97, 0.82 + (ef - 80) / 900);
  const latency = 34 + (ef - 80) * 0.16;

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] text-mute">
        <span>hnsw · on-device vector store</span>
        <button
          onClick={() => setAuto((a) => !a)}
          className="rounded border border-hairline px-2 py-0.5 text-[10px] text-body hover:text-ink"
        >
          {auto ? "auto" : "manual"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="w-12 font-mono text-[11px] text-faint">ef_c</span>
        <input
          type="range"
          min={80}
          max={320}
          step={4}
          value={ef}
          onChange={(e) => {
            setAuto(false);
            setEf(parseInt(e.target.value));
          }}
          className="h-1 flex-1 appearance-none rounded-full bg-hairline/20 accent-white"
          aria-label="HNSW ef_construction"
        />
        <span className="w-10 text-right font-mono text-[11px] text-ink">{ef}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Meter label="recall@10" value={recall.toFixed(3)} pct={(recall - 0.8) / 0.18} good />
        <Meter label="query" value={`${latency.toFixed(0)}ms`} pct={1 - (latency - 34) / 60} />
      </div>
    </div>
  );
}

function Meter({
  label,
  value,
  pct,
  good,
}: {
  label: string;
  value: string;
  pct: number;
  good?: boolean;
}) {
  const p = Math.max(0.05, Math.min(1, pct));
  return (
    <div className="rounded-lg border border-hairline bg-canvas/60 p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase text-faint">{label}</span>
        <span className={`font-mono text-[13px] ${good ? "text-ink" : "text-ink"}`}>
          {value}
        </span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-hairline/15">
        <motion.div
          className={good ? "h-full bg-ink" : "h-full bg-mute"}
          animate={{ width: `${p * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
