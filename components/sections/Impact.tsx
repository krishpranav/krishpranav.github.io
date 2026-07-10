"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, Counter } from "@/components/ui";

// Real figures only, framed big.
const impact = [
  { v: "15–20M", u: "requests / day", n: "PayPal C++→Go migration · p99 held steady" },
  { v: "20–25M+", u: "monthly volume (USD)", n: "on-chain trading platform" },
  { v: "~40%", u: "p95 API latency cut", n: "query restructuring · N+1 · Redis" },
  { v: "<300ms", u: "time-to-first-token", n: "streaming inference gateway" },
  { v: "<50ms", u: "p99 vector search", n: "live traffic · in-memory cache" },
  { v: "0.95+", u: "recall@10", n: "~100K-document corpora · HNSW" },
];

export default function Impact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="impact" ref={ref} className="relative overflow-hidden py-28 md:py-44">
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <span className="select-none text-[28vw] font-normal leading-none tracking-tighter text-ink opacity-[0.02]">
          IMPACT
        </span>
      </motion.div>

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <Eyebrow>05 — Numbers that are real</Eyebrow>
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {impact.map((s, i) => (
            <motion.div
              key={s.u}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.7 }}
              className="border-t border-hairline pt-5"
            >
              <Counter
                value={s.v}
                className="block font-mono text-[clamp(2.6rem,7vw,4.6rem)] font-normal leading-none tracking-tighter text-ink"
              />
              <div className="mt-3 text-[14px] font-normal text-body">{s.u}</div>
              <div className="mt-1 font-mono text-[12px] text-faint">{s.n}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
