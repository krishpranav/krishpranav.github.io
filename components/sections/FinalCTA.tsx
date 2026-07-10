"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/ui";
import { identity } from "@/lib/resume";

const ctas = [
  { label: "View résumé", href: identity.links.resume, primary: true, ext: false },
  { label: "GitHub", href: identity.links.github, sub: identity.links.githubHandle, ext: true },
  { label: "Email", href: `mailto:${identity.links.email}`, sub: identity.links.email, ext: false },
  { label: "LinkedIn", href: identity.links.linkedin, sub: identity.links.linkedinHandle, ext: true },
];

/* Blinking cursor, then the name types out right after it. */
function TypeName({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(text.length);
      return;
    }
    if (!started || count >= text.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), 95);
    return () => clearTimeout(id);
  }, [started, count, text]);

  return (
    <motion.div
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center justify-center gap-3"
    >
      {/* blinking block first — the name appears after it */}
      <span className="cursor" aria-hidden />
      <span className="text-[clamp(2.2rem,7vw,4.6rem)] font-normal leading-none tracking-display text-ink">
        {text.slice(0, count)}
      </span>
    </motion.div>
  );
}

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      <div className="backdrop-grid absolute inset-0" aria-hidden />
      {/* the constellation returns — a soft white bloom */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[900px] px-5 text-center md:px-8">
        {/* Name types out after the blinking cursor */}
        <TypeName text={identity.name} />

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 text-balance text-[clamp(1.5rem,3.6vw,2.4rem)] font-normal leading-[1.1] tracking-heading text-ink"
        >
          Ship the reasoning. <span className="text-mute">Ship the runtime.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mx-auto mt-5 max-w-[42ch] text-[15px] leading-relaxed text-body"
        >
          One engineer. Full stack, down to the systems layer.
        </motion.p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {ctas.map((c) => (
            <Magnetic key={c.label} strength={0.2}>
              <a
                href={c.href}
                {...(c.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${c.primary ? "pill-filled" : "pill-outline"} px-5 py-2.5 text-[14px]`}
              >
                <span>{c.label}</span>
                {c.sub && (
                  <span
                    className={`font-mono text-[11px] ${
                      c.primary ? "opacity-70" : "text-faint"
                    }`}
                  >
                    {c.sub}
                  </span>
                )}
              </a>
            </Magnetic>
          ))}
        </div>
      </div>
    </section>
  );
}
