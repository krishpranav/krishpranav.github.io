"use client";

import { motion } from "framer-motion";
import { Eyebrow, RevealText } from "@/components/ui";
import { workflow } from "@/lib/resume";

export default function Workflow() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <Eyebrow>04 — How the work moves</Eyebrow>
      <RevealText
        as="h2"
        text="Idea to production, owned end-to-end."
        className="mt-6 max-w-[18ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
      />

      <div className="relative mt-16">
        {/* connecting rail */}
        <div className="absolute left-0 right-0 top-[13px] hidden h-px bg-hairline/15 md:block">
          <motion.div
            className="h-full bg-gradient-to-r from-ink via-ink/30 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            style={{ originX: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <ol className="grid gap-8 md:grid-cols-6 md:gap-4">
          {workflow.map((step, i) => (
            <motion.li
              key={step.k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="relative"
            >
              <span
                className={`relative z-10 block h-[26px] w-[26px] rounded-full border ${
                  step.ember
                    ? "border-[#ff7a17] bg-canvas"
                    : "border-ink bg-canvas"
                }`}
              >
                <span
                  className={`absolute inset-[7px] rounded-full ${
                    step.ember ? "bg-[#ff7a17]" : "bg-ink"
                  }`}
                />
              </span>
              <div className="mt-4 font-mono text-[10px] text-faint">
                0{i + 1}
              </div>
              <h3 className="mt-1 text-[15px] font-normal tracking-heading text-ink">
                {step.k}
              </h3>
              <p className="mt-1 text-[13px] leading-snug text-mute">{step.d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
