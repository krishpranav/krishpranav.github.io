"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const stages = ["pdf", "chunk", "tag", "store", "rerank", "cite"];

/* A repeating ingestion pulse traveling through the RAG stages. */
export default function IngestFlow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(stages.length - 1);
      return;
    }
    const id = setInterval(() => setActive((a) => (a + 1) % (stages.length + 1)), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[11px] text-mute">
        <span>document ingestion → citation</span>
        <span className="text-sunset">vision-LLM</span>
      </div>
      <div className="mt-4 flex items-center">
        {stages.map((s, i) => {
          const done = i < active;
          const on = i === active;
          return (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: on ? 1.25 : 1,
                    backgroundColor: done || on ? "#ffffff" : "rgba(255,255,255,0.12)",
                  }}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ boxShadow: on ? "0 0 12px #ffffff" : "none" }}
                />
                <span
                  className={`font-mono text-[9px] ${
                    done || on ? "text-body" : "text-faint"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < stages.length - 1 && (
                <div className="mx-1 h-px flex-1 overflow-hidden bg-hairline/15">
                  <motion.div
                    className="h-full bg-ink"
                    animate={{ scaleX: i < active ? 1 : 0 }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
