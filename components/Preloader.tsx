"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { identity } from "@/lib/resume";

/* Minimal boot sequence: mono counter runs to 100, curtain lifts. */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    let v = 0;
    const id = setInterval(() => {
      // fast start, brief hesitation near the end — feels like a real boot
      v += v < 70 ? 6 + Math.random() * 9 : 2 + Math.random() * 4;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 260);
      }
      setPct(Math.floor(v));
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
          aria-hidden
        >
          <div className="flex items-center gap-3 font-mono text-[13px] text-mute">
            <span className="inline-block h-2 w-2 rounded-[2px] bg-ink" />
            <span>{identity.links.githubHandle}</span>
          </div>
          <div className="mt-4 font-mono text-[clamp(2.4rem,8vw,4.4rem)] font-normal tracking-tighter text-ink tabular-nums">
            {pct}
            <span className="text-mute">%</span>
          </div>
          <div className="mt-4 h-px w-40 overflow-hidden bg-hairline/15">
            <motion.div
              className="h-full bg-ink"
              style={{ width: `${pct}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
