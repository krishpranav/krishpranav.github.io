"use client";

import { Eyebrow, RevealText, Reveal, Counter } from "@/components/ui";
import SystemsFlow from "@/components/diagrams/SystemsFlow";

const traits = [
  { k: "tokio async I/O", v: "non-blocking runtime for concurrent agent runs" },
  { k: "lock-free concurrency", v: "goroutines + bounded channels, no contention" },
  { k: "zero-copy serialization", v: "move bytes, don't copy them" },
];

export default function Systems() {
  return (
    <section id="systems" className="relative overflow-hidden py-28 md:py-40">
      {/* ember-tinted band background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff7a17]/[0.03] to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-[1200px] px-5 md:px-8">
        <Eyebrow>02 — Systems Programming Layer</Eyebrow>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <RevealText
            as="h2"
            text="I write the performance-critical layer the AI runs on."
            className="max-w-[18ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
          />
          <Reveal delay={0.15} className="max-w-[46ch] text-[15px] leading-relaxed text-body">
            When an agent has to stay fast under load, I drop into Rust, C++, and
            Go — async task execution, memory profiling, backpressure. Close to
            the metal, so everything above it stays quick.
          </Reveal>
        </div>

        {/* particle pipe network */}
        <div className="mt-14 h-[220px] overflow-hidden rounded-xl border border-hairline bg-elevated/20 md:h-[280px]">
          <SystemsFlow />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <ul className="space-y-px overflow-hidden rounded-xl border border-hairline">
            {traits.map((t) => (
              <li key={t.k} className="flex items-baseline gap-4 bg-canvas p-5">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff7a17]" />
                <div>
                  <div className="font-mono text-[13px] text-ink">{t.k}</div>
                  <div className="mt-1 text-[13px] text-mute">{t.v}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* The Tauri RSS stat — precise, quietly impressive. */}
          <Reveal
            delay={0.1}
            className="rounded-xl border border-hairline bg-elevated/30 p-7"
          >
            <div className="eyebrow mb-4">memory-leak fix · tauri stress loop</div>
            <div className="flex items-end gap-3 font-mono">
              <Counter value="116.5" className="text-[clamp(2rem,5vw,3.4rem)] font-normal text-mute" />
              <span className="pb-2 text-mute">→</span>
              <Counter value="116.9" className="text-[clamp(2rem,5vw,3.4rem)] font-normal text-[#ff7a17]" />
              <span className="pb-2 text-[13px] text-mute">MB RSS</span>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-body">
              RSS held flat across a 3-minute stress loop after balancing an
              Objective-C retain/release leak upstream — the difference between a
              stable long-running app and a slow crash.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
