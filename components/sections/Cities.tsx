"use client";

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import clsx from "clsx";
import { useRef, useState } from "react";
import { cities } from "@/lib/resume";

const N = cities.length;
const THROW = 90; // px of drag that sends the front card to the back

/* The cities I've been to, as a stack of pixel panoramas. The front card can be dragged
   or swiped away, and it flies off and tucks in at the back; the buttons and the city
   names do the same without a pointer. Without script the cards simply sit in a column;
   under reduced motion they swap without flying. */
export default function Cities() {
  const [front, setFront] = useState(0);
  const [motion, setMotion] = useState<{ id: string; kind: "out" | "in"; fly: number } | null>(null);
  const drag = useRef<{ x: number; dx: number } | null>(null);
  const card = useRef<HTMLElement | null>(null);

  const settle = (id: string, kind: "out" | "in", fly: number) => {
    setMotion({ id, kind, fly });
    window.setTimeout(() => setMotion((m) => (m?.id === id ? null : m)), 720);
  };
  const next = (fly = -1) => {
    settle(cities[front].id, "out", fly);
    setFront((f) => (f + 1) % N);
  };
  const prev = () => {
    const to = (front - 1 + N) % N;
    settle(cities[to].id, "in", -1);
    setFront(to);
  };

  const onDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, dx: 0 };
    card.current = e.currentTarget;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.dataset.dragging = "";
  };
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag.current || !card.current) return;
    drag.current.dx = e.clientX - drag.current.x;
    card.current.style.setProperty("--dx", `${drag.current.dx}px`);
    card.current.style.setProperty("--dr", `${(drag.current.dx / 36).toFixed(2)}deg`);
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!card.current) return;
    delete card.current.dataset.dragging;
    card.current.style.removeProperty("--dx");
    card.current.style.removeProperty("--dr");
    if (d && Math.abs(d.dx) > THROW) next(Math.sign(d.dx));
  };

  const current = cities[front];

  return (
    <section id="cities" aria-labelledby="cities-title" className="relative pt-[var(--section-gap)]">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <h2 id="cities-title" data-reveal className="t-section">
              Where I&rsquo;ve been.
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[38ch] t-lead text-muted">
              I&rsquo;m based in Singapore, where I work, and I travel often to Bengaluru. I&rsquo;ve been to San Francisco too.
            </p>
          </div>
        </div>

        <div aria-roledescription="carousel" aria-label="Cities I've been to" className="mt-16">
          <div className="stack" style={{ "--n": N } as React.CSSProperties}>
            {cities.map((c, i) => {
              const p = (i - front + N) % N;
              const m = motion?.id === c.id ? motion : null;
              return (
                <figure
                  key={c.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${N}: ${c.name}`}
                  aria-hidden={p !== 0 || undefined}
                  data-p={Math.min(p, 2)}
                  className={clsx("stack__card", m && `is-${m.kind}`)}
                  style={{ "--fly": m?.fly ?? -1, "--focus": c.focus } as React.CSSProperties}
                  onPointerDown={p === 0 ? onDown : undefined}
                  onPointerMove={p === 0 ? onMove : undefined}
                  onPointerUp={p === 0 ? onUp : undefined}
                  onPointerCancel={p === 0 ? onUp : undefined}
                >
                  <img src={c.src} alt={c.alt} width={1200} height={411} draggable={false} loading="lazy" decoding="async" />
                  <figcaption className="stack__caption glass">
                    <span className="block font-semibold">{c.name}</span>
                    <span className="hidden text-sm text-muted sm:block">{c.note}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          <div className="stack__controls mt-8 flex flex-wrap items-center justify-between gap-6">
            <div role="group" aria-label="Choose a city" className="flex flex-wrap gap-2">
              {cities.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={i === front}
                  onClick={() => i !== front && setFront(i)}
                  className="btn btn--sm stack__tab"
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={prev} aria-label="Previous city" className="stack__arrow">
                <ArrowLeft aria-hidden size={20} />
              </button>
              <button type="button" onClick={() => next()} aria-label="Next city" className="stack__arrow">
                <ArrowRight aria-hidden size={20} />
              </button>
            </div>
          </div>
          <p aria-live="polite" className="visually-hidden">
            {current.name}, {front + 1} of {N}
          </p>
        </div>
      </div>
    </section>
  );
}
