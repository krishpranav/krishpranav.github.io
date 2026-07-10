"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow, RevealText } from "@/components/ui";
import { stack } from "@/lib/resume";
import { BrandIcon } from "@/components/BrandIcon";

const CARD_W = 288; // px
const GAP = 16; // px
const STEP = CARD_W + GAP;
const SPEED = 0.55; // px per frame, idle drift

export default function Stack() {
  // A seamless infinite marquee: two copies of the list slide left; the offset
  // wraps by one list-width so it never jumps.
  const [offset, setOffset] = useState(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const last = useRef(0);
  const vel = useRef(-SPEED);

  const half = stack.length * STEP;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const tick = () => {
      if (!dragging.current) {
        setOffset((o) => wrap(o + (reduce ? 0 : vel.current), half));
        // ease inertia toward idle drift — or a standstill while hovered
        const target = hovering.current ? 0 : -SPEED;
        vel.current += (target - vel.current) * 0.05;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [half]);

  const onDown = (x: number) => {
    dragging.current = true;
    last.current = x;
  };
  const onMove = (x: number) => {
    if (!dragging.current) return;
    const dx = x - last.current;
    last.current = x;
    setOffset((o) => wrap(o + dx, half));
    vel.current = dx || -SPEED;
  };
  const onUp = () => {
    dragging.current = false;
    if (Math.abs(vel.current) < 0.05) vel.current = -SPEED;
  };

  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Eyebrow>06 — Toolchain</Eyebrow>
        <RevealText
          as="h2"
          text="Each tool earns its place."
          className="mt-6 max-w-[16ch] text-balance text-[clamp(2.1rem,4.4vw,3.4rem)] font-normal leading-[1.04] tracking-heading text-ink"
        />
      </div>

      <div
        className="relative mt-16 cursor-grab select-none overflow-hidden active:cursor-grabbing"
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onUp}
        onMouseEnter={() => (hovering.current = true)}
        onMouseLeave={() => {
          hovering.current = false;
          onUp();
        }}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
      >
        <div
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${offset}px)`,
            willChange: "transform",
          }}
        >
          {[...stack, ...stack].map((tool, i) => (
            <article
              key={`${tool.name}-${i}`}
              className="group flex h-[132px] shrink-0 flex-col justify-between rounded-xl border border-hairline bg-elevated/60 p-5 transition-colors hover:border-ink/40"
              style={{ width: `${CARD_W}px` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-ink transition-transform duration-300 group-hover:scale-110">
                  <BrandIcon name={tool.name} className="h-6 w-6" />
                </span>
                <span className="font-mono text-[15px] font-normal text-ink">
                  {tool.name}
                </span>
              </div>
              <p className="text-[12px] leading-snug text-mute">{tool.why}</p>
            </article>
          ))}
        </div>

        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-canvas to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-canvas to-transparent md:w-40" />
      </div>

      <p className="mt-8 text-center font-mono text-[11px] text-faint">
        drag to explore
      </p>
    </section>
  );
}

// Keep the offset within (-half, 0] so the two copies loop seamlessly.
function wrap(o: number, half: number) {
  let v = o % half;
  if (v > 0) v -= half;
  return v;
}
