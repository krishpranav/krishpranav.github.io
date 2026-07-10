"use client";

import { useEffect, useRef } from "react";

/* Lightweight canvas particle-pipe network — high-speed async runtime.
   Ember accent is permitted here (and nowhere else). */
export default function SystemsFlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Horizontal "pipes" carrying particles left → right.
    const LANES = 7;
    type P = { lane: number; x: number; speed: number; ember: boolean; size: number };
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const laneY = (i: number) => ((i + 0.5) / LANES) * h;

    const spawn = () => {
      const lane = Math.floor(Math.random() * LANES);
      particles.push({
        lane,
        x: -10,
        speed: 0.8 + Math.random() * 2.4,
        ember: Math.random() > 0.82,
        size: 0.8 + Math.random() * 1.6,
      });
    };

    resize();
    for (let i = 0; i < 90; i++) {
      spawn();
      particles[particles.length - 1].x = Math.random() * w;
    }

    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink") || "237 237 237";

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // faint pipe rails
      ctx.lineWidth = 1;
      for (let i = 0; i < LANES; i++) {
        const y = laneY(i);
        ctx.strokeStyle = `rgba(${ink.trim().split(" ").join(",")}, 0.05)`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      for (const p of particles) {
        if (!reduce) p.x += p.speed;
        const y = laneY(p.lane);
        if (p.ember) {
          ctx.fillStyle = "rgba(255, 107, 74, 0.9)";
          ctx.shadowColor = "rgba(255,107,74,0.8)";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(${ink.trim().split(" ").join(",")}, 0.5)`;
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // motion-blur trail
        ctx.shadowBlur = 0;
        ctx.strokeStyle = p.ember
          ? "rgba(255,107,74,0.25)"
          : `rgba(${ink.trim().split(" ").join(",")}, 0.12)`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, y);
        ctx.lineTo(p.x - p.speed * 6, y);
        ctx.stroke();
      }

      particles = particles.filter((p) => p.x < w + 20);
      while (particles.length < 90) spawn();

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
