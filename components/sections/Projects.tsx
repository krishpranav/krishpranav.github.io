"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eyebrow, RevealText, Reveal, Counter } from "@/components/ui";
import { TerminalFrame, TerminalLog, LogLine } from "@/components/Terminal";
import { projects, subScenes } from "@/lib/resume";
import HnswTuner from "@/components/diagrams/HnswTuner";
import IngestFlow from "@/components/diagrams/IngestFlow";

const aetherLog: LogLine[] = [
  { t: "cmd", text: "cargo build --release" },
  { t: "dim", text: "   Compiling aether-index v0.4.0" },
  { t: "dim", text: "   Compiling aether-embed v0.4.0 (onnx)" },
  { t: "ok", text: "    Finished release [optimized] in 41.2s" },
  { t: "cmd", text: "aether index ~/vault --watch" },
  { t: "info", text: "  indexed 98,214 docs · hnsw M=16 ef=200" },
  { t: "accent", text: "  recall@10 0.95+ · idle 47MB · query 92ms" },
];

const legalLog: LogLine[] = [
  { t: "cmd", text: "python -m ingest ./corpus --hybrid" },
  { t: "dim", text: "  parsing pdf → semantic chunks" },
  { t: "dim", text: "  tagging: section · clause · date · jurisdiction" },
  { t: "info", text: "  upsert → vector + keyword store" },
  { t: "warn", text: "  vision-LLM: scanned notice → structured" },
  { t: "ok", text: "  ✓ 12,480 chunks · reranker warm" },
  { t: "accent", text: "  answer returned with [3] source citations" },
];

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  // Panels split apart as the section enters.
  const leftX = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const gap = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="projects" className="relative mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <Eyebrow>03 — Featured Work</Eyebrow>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <RevealText
          as="h2"
          text="Two systems I shipped, side by side."
          className="max-w-[20ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
        />
        <Reveal delay={0.15} className="max-w-[46ch] text-[15px] leading-relaxed text-body">
          On the left, an on-device Rust agent I built end-to-end. On the right,
          a production legal RAG platform. Both real, both mine — the same
          terminal, split.
        </Reveal>
      </div>

      {/* Split panels */}
      <div ref={ref} className="mt-14 grid gap-5 lg:grid-cols-2">
        <motion.div style={{ x: leftX }}>
          <ProjectPanel index={0} log={aetherLog}>
            <HnswTuner />
          </ProjectPanel>
        </motion.div>
        <motion.div style={{ x: rightX }}>
          <ProjectPanel index={1} log={legalLog}>
            <IngestFlow />
          </ProjectPanel>
        </motion.div>
      </div>

      {/* Floating metrics between panels */}
      <motion.div
        style={{ opacity: gap }}
        className="mt-6 flex flex-wrap items-center justify-center gap-2"
      >
        {[
          ["recall@10", "0.95+"],
          ["query", "<100ms"],
          ["idle mem", "<50MB"],
          ["retrieval p99", "<50ms"],
          ["answers", "cited"],
        ].map(([k, v]) => (
          <span
            key={k}
            className="rounded-full border border-hairline bg-elevated/40 px-3 py-1.5 font-mono text-[11px] text-body backdrop-blur-sm"
          >
            <span className="text-ink">{v}</span>
            <span className="text-faint"> · {k}</span>
          </span>
        ))}
      </motion.div>

      {/* Merge-back note */}
      <Reveal className="mt-6 text-center font-mono text-[12px] text-faint">
        <span className="text-ink">✓</span> both passing — one engineer, many systems
      </Reveal>

      {/* Sub-scene beats */}
      <div className="mt-24">
        <Eyebrow>03.b — More, in brief</Eyebrow>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {subScenes.map((s, i) => (
            <SubScene key={s.id} scene={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPanel({
  index,
  log,
  children,
}: {
  index: number;
  log: LogLine[];
  children: React.ReactNode;
}) {
  const p = projects[index];
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[18px] font-normal tracking-heading text-ink">
          {p.name}
        </h3>
        <span
          className={`font-mono text-[11px] ${p.ember ? "text-[#ff7a17]" : "text-ink"}`}
        >
          {p.lang}
        </span>
      </div>
      <p className="text-[13px] text-mute">{p.kind}</p>
      <TerminalFrame title={`${p.id} — deploy`}>
        <TerminalLog lines={log} />
      </TerminalFrame>
      <div className="rounded-xl border border-hairline bg-elevated/20 p-4">{children}</div>
      <ul className="space-y-2">
        {p.points.map((pt, i) => (
          <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-body">
            <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-mute" />
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubScene({ scene, index }: { scene: (typeof subScenes)[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl border border-hairline bg-elevated/20 p-6 transition-colors hover:border-ink/30"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wide text-mute">
          {scene.name}
        </span>
        <span className="font-mono text-[11px] text-ink opacity-0 transition-opacity group-hover:opacity-100">
          {scene.tag}
        </span>
      </div>
      <h4 className="mt-3 text-[17px] font-normal tracking-heading text-ink">
        {scene.line}
      </h4>
      <p className="mt-2 text-[13px] leading-relaxed text-body">{scene.detail}</p>
      <div className="mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-ink/40 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </motion.article>
  );
}
