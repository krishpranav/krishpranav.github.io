"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, ReactNode } from "react";
import clsx from "clsx";

/* Terminal-style scramble-in for short mono labels. */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#";
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let frame = 0;
    const total = 22; // ~0.37s at 60fps
    let raf = 0;
    const tick = () => {
      frame++;
      const locked = Math.floor((frame / total) * text.length);
      let s = text.slice(0, locked);
      for (let i = locked; i < text.length; i++) {
        s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (frame < total) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text]);

  return <span ref={ref}>{out}</span>;
}

/* Section eyebrow — spec-sheet mono label, scrambles in like a terminal */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="eyebrow flex items-center gap-2"
    >
      <span className="inline-block h-1 w-1 rounded-full bg-ink" />
      {typeof children === "string" ? <Scramble text={children} /> : children}
    </motion.div>
  );
}

/* Magnetic hover — element leans toward the cursor, springs back on leave. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 15, mass: 0.4 });
  const y = useSpring(0, { stiffness: 180, damping: 15, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Word-by-word display reveal */
export function RevealText({
  text,
  className,
  delay = 0,
  as = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* Generic reveal wrapper */
export function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* Animated counter that parses a value string like "15–20M", "<50ms", "0.95+" */
export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  // Extract the first number to animate; keep the rest of the string as-is.
  const match = value.match(/[\d.]+/);
  const num = match ? parseFloat(match[0]) : null;

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });
  const decimals = match && match[0].includes(".") ? match[0].split(".")[1].length : 0;
  const display = useTransform(spring, (v) => {
    if (num === null) return value;
    const formatted = v.toFixed(decimals);
    return value.replace(match![0], formatted);
  });

  useEffect(() => {
    if (inView && num !== null) mv.set(num);
  }, [inView, num, mv]);

  if (num === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }
  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}

/* Pointer-tilt wrapper for cards */
export function Tilt({
  children,
  className,
  intensity = 6,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * intensity);
    rx.set(-py * intensity);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={clsx("[transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
