"use client";

import { motion } from "framer-motion";
import { Eyebrow, RevealText, Reveal, Counter } from "@/components/ui";
import RagPipeline from "@/components/diagrams/RagPipeline";
import { stats, mlSkills } from "@/lib/resume";

const reasoningStats = stats.slice(0, 4);

export default function Reasoning() {
  return (
    <section id="reasoning" className="relative mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <Eyebrow>01 — What I build</Eyebrow>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <RevealText
          as="h2"
          text="I build the retrieval and reasoning pipelines that agents actually run on."
          className="max-w-[20ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
        />
        <Reveal delay={0.15} className="max-w-[46ch] text-[15px] leading-relaxed text-body">
          Three years of my work lives here: agentic systems — LLM
          orchestration, tool-use &amp; function calling, multi-step reasoning,
          and RAG — that stay fast and cite their sources. Below is one I&apos;ve
          shipped end-to-end, built on Anthropic and OpenAI APIs.
        </Reveal>
      </div>

      <div className="mt-14">
        <RagPipeline />
      </div>

      {/* Real stats */}
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline/[0.06] md:grid-cols-4">
        {reasoningStats.map((s) => (
          <div key={s.label} className="bg-canvas p-6">
            <Counter
              value={s.value}
              className="block font-mono text-[clamp(1.5rem,3vw,2.2rem)] font-normal tracking-tight text-ink"
            />
            <div className="mt-2 font-mono text-[12px] uppercase tracking-wide text-mute">
              {s.label}
            </div>
            {s.note && <div className="mt-1 text-[12px] leading-snug text-faint">{s.note}</div>}
          </div>
        ))}
      </div>

      {/* ML depth — models & inference, not just orchestration */}
      <div className="mt-10">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-wide text-faint">
          also in the toolbox — models &amp; inference
        </div>
        <ul className="flex flex-wrap gap-2">
          {mlSkills.map((skill, i) => (
            <motion.li
              key={skill}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-full border border-hairline bg-elevated/40 px-3.5 py-1.5 font-mono text-[12px] text-body transition-colors hover:border-ink/30 hover:text-ink"
            >
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
