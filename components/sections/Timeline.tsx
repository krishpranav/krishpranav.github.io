"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, RevealText } from "@/components/ui";
import { timeline } from "@/lib/resume";

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="timeline" className="relative mx-auto max-w-[1200px] px-5 py-28 md:px-8 md:py-40">
      <Eyebrow>08 — The path here</Eyebrow>
      <RevealText
        as="h2"
        text="Five years, reverse-chronological."
        className="mt-6 max-w-[16ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
      />

      <div ref={ref} className="relative mt-16 pl-8 md:pl-0">
        {/* central rail */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-hairline/12 md:left-[140px]">
          <motion.div className="w-full bg-ink" style={{ height: progress }} />
        </div>

        <ol className="space-y-12">
          {timeline.map((role, i) => (
            <motion.li
              key={role.company + role.when}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="relative grid gap-2 md:grid-cols-[140px_1fr] md:gap-8"
            >
              {/* node */}
              <span
                className={`absolute left-[-25px] top-1.5 h-3.5 w-3.5 rounded-full border-2 md:left-[133px] ${
                  role.current
                    ? "border-ink bg-ink"
                    : "border-mute bg-canvas"
                }`}
              />
              <div className="font-mono text-[12px] text-mute md:pt-0.5">
                <span className={role.current ? "text-ink" : ""}>{role.when}</span>
              </div>
              <div className="md:pl-6">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h3 className="text-[17px] font-normal tracking-heading text-ink">
                    {role.title}
                  </h3>
                  <span className="font-mono text-[13px] text-body">· {role.company}</span>
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-faint">
                  {role.context}
                </div>
                <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-body">
                  {role.line}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
