"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { identity } from "@/lib/resume";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 6]);

  // Entrance waits for the preloader curtain (skipped for reduced motion).
  const reduce = useReducedMotion();
  const boot = reduce ? 0 : 1.15;

  // Pointer parallax — the copy drifts gently opposite the cursor.
  const px = useSpring(0, { stiffness: 60, damping: 20 });
  const py = useSpring(0, { stiffness: 60, damping: 20 });
  const onPointer = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set(((e.clientX - r.left) / r.width - 0.5) * -14);
    py.set(((e.clientY - r.top) / r.height - 0.5) * -10);
  };

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex h-[100svh] min-h-[640px] flex-col items-center justify-center overflow-hidden"
    >
      {/* 3D engine */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Grid + vignette backdrop */}
      <div className="backdrop-grid absolute inset-0 z-0" aria-hidden />

      {/* Copy overlay */}
      <motion.div
        style={{
          y,
          opacity,
          x: px,
          translateY: py,
          filter: useTransform(blur, (b) => `blur(${b}px)`),
        }}
        className="relative z-10 mx-auto flex max-w-[1100px] flex-col items-center px-5 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: boot + 0.15 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-hairline bg-canvas/40 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
          <span className="font-mono text-[11px] uppercase tracking-wide text-mute">
            {identity.role} · {identity.focus}
          </span>
        </motion.div>

        <h1 className="max-w-[16ch] text-balance text-[clamp(2.4rem,7vw,5.3rem)] font-normal leading-[0.98] tracking-display text-ink">
          <Line delay={boot + 0.25}>I build the systems</Line>
          <Line delay={boot + 0.37}>that make AI agents</Line>
          <Line delay={boot + 0.49}>
            <span className="text-mute">actually </span>
            <span className="cursor">work</span>
          </Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: boot + 0.75 }}
          className="mt-7 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-body md:text-[16px]"
        >
          Agentic orchestration, LLM tool-use, ML models &amp; inference, and
          on-device retrieval — on a foundation of systems programming in Rust,
          C++, and Go.
        </motion.p>

        {/* Orbiting language tags */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: boot + 0.95 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {identity.languages.map((lang, i) => (
            <motion.li
              key={lang}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: boot + 0.95 + i * 0.08 }}
              className="rounded-full border border-hairline bg-elevated/30 px-3 py-1 font-mono text-[12px] text-body backdrop-blur-sm"
            >
              {lang}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          scroll into the pipeline
        </span>
        <div className="h-9 w-[1px] overflow-hidden bg-hairline">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1/2 w-full bg-ink"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden [perspective:600px]">
      <motion.span
        className="block"
        initial={{ y: "110%", rotateX: -28, filter: "blur(6px)" }}
        animate={{ y: "0%", rotateX: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
