"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { identity } from "@/lib/resume";

const links = [
  { label: "Reasoning", href: "#reasoning" },
  { label: "Systems", href: "#systems" },
  { label: "Work", href: "#projects" },
  { label: "Impact", href: "#impact" },
  { label: "Timeline", href: "#timeline" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 transition-all duration-500 md:px-8 ${
          scrolled
            ? "mt-2 rounded-full border border-hairline bg-canvas/70 backdrop-blur-xl md:mx-auto md:max-w-[820px]"
            : ""
        }`}
      >
        <a href="#top" className="group flex items-center gap-2 font-mono text-[13px]">
          <span className="inline-block h-2 w-2 rounded-[2px] bg-ink transition-transform group-hover:scale-125" />
          <span className="font-sans text-[14px] tracking-[-0.03em] text-ink">
            {identity.name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 font-mono text-[12px] uppercase tracking-wide text-mute transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={identity.links.resume}
            className="pill-outline hidden px-4 py-1.5 font-mono text-[12px] sm:inline-flex"
          >
            résumé
          </a>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
