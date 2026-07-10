"use client";

import { motion } from "framer-motion";
import { Eyebrow, RevealText, Reveal } from "@/components/ui";
import { TerminalFrame } from "@/components/Terminal";
import { openSource } from "@/lib/resume";

export default function OpenSource() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <Eyebrow>07 — Open Source</Eyebrow>

      <div className="mt-6 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[13px] text-ink">{openSource.project}</span>
            <span className="font-mono text-[12px] text-faint">{openSource.repo}</span>
          </div>
          <RevealText
            as="h2"
            text={openSource.headline}
            className="mt-4 max-w-[18ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
          />
          <Reveal delay={0.1} className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-body">
            {openSource.role}. A specific, verifiable fix — merged upstream as{" "}
            <span className="font-mono text-ink">{openSource.pr}</span>.
          </Reveal>
        </div>

        {/* the technical story as a terminal diff-like breakdown */}
        <TerminalFrame title="tauri-runtime-wry · leak fix">
          <div className="space-y-3">
            {openSource.steps.map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.14, duration: 0.4 }}
                className="grid grid-cols-[80px_1fr] gap-3"
              >
                <span className="font-mono text-[11px] text-ink">{s.k}</span>
                <span
                  className="text-[12px] leading-relaxed text-body [&_code]:text-ink"
                  dangerouslySetInnerHTML={{
                    __html: s.v
                      .replace(/(Retained::into_raw\(\)|Retained::as_ptr\(\)|WithWebview|Retained)/g, "<code class='font-mono'>$1</code>")
                      .replace(/(116\.5|116\.9)/g, "<code class='font-mono text-[#ff7a17]'>$1</code>"),
                  }}
                />
              </motion.div>
            ))}
          </div>
        </TerminalFrame>
      </div>
    </section>
  );
}
