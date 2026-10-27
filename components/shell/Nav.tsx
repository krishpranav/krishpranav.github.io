"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { identity } from "@/lib/resume";
import { NAV_LINKS } from "./nav-links";

const BAR_LINKS = NAV_LINKS.filter((l) => l.href !== "#contact");

/* A slim translucent bar: my name, three places to go, and the one action. */
export default function Nav({
  onMenu,
  menuOpen,
}: {
  onMenu: () => void;
  menuOpen: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [night, setNight] = useState(false);
  const [ctaInView, setCtaInView] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Over the dark chapter the bar turns dark with it, judged at the bar's own midline.
    const darks = Array.from(document.querySelectorAll<HTMLElement>(".night"));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        const mid =
          (parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-h",
            ),
          ) || 52) / 2;
        setNight(
          darks.some((el) => {
            const r = el.getBoundingClientRect();
            return r.top <= mid && r.bottom >= mid;
          }),
        );
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The section crossing the middle of the screen is the one I'm in.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const href = `#${e.target.id}`;
          if (e.isIntersecting) setActive(href);
          else setActive((a) => (a === href ? null : a));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });

    // The bar's "Email me" steps back while the page's own one is on screen, so the
    // action is never shown twice at once.
    const seen = new Set<Element>();
    const ctaIo = new IntersectionObserver((entries) => {
      for (const e of entries)
        e.isIntersecting ? seen.add(e.target) : seen.delete(e.target);
      setCtaInView(seen.size > 0);
    });
    document
      .querySelectorAll("[data-primary-cta]")
      .forEach((el) => ctaIo.observe(el));

    // While the pill steps back, the links slide over into its slot, so the bar stays
    // balanced against the wordmark.
    const bar = document.querySelector<HTMLElement>("header.bar");
    const pill = bar?.querySelector<HTMLElement>(".bar__cta");
    const slot = new ResizeObserver(() => {
      if (bar && pill)
        bar.style.setProperty("--cta-slot", `${pill.offsetWidth + 32}px`);
    });
    if (pill) slot.observe(pill);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      ctaIo.disconnect();
      slot.disconnect();
    };
  }, []);

  return (
    <header
      data-tone={night && !menuOpen ? "night" : undefined}
      data-scrolled={scrolled || menuOpen ? "" : undefined}
      data-cta={ctaInView ? undefined : ""}
      className="bar glass fixed inset-x-0 top-0 h-[var(--nav-h)] border-b"
      style={{ zIndex: "var(--z-sticky-nav)" }}
    >
      <div className="container flex h-full items-center justify-between gap-6">
        <a
          href="#top"
          aria-label={`${identity.name}, back to the top`}
          className="text-[17px] font-semibold tracking-[-0.02em]"
        >
          {identity.name}
        </a>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-8 md:flex"
        >
          <span className="bar__links flex items-center gap-8">
            {BAR_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                aria-current={active === href ? "location" : undefined}
                className="bar__link text-sm"
              >
                {label}
              </a>
            ))}
            <a href={identity.links.resume} target="_blank" rel="noopener noreferrer" className="bar__link text-sm">
              Résumé
            </a>
          </span>
          <Button
            href={`mailto:${identity.links.email}`}
            variant="primary"
            size="sm"
            className="bar__cta"
          >
            Email me
          </Button>
        </nav>

        <button
          type="button"
          onClick={onMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="relative -mr-2 flex size-11 items-center justify-center md:hidden"
        >
          <span
            className={clsx(
              "absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-[var(--dur-short)] ease-in-out",
              menuOpen ? "rotate-45" : "-translate-y-[3.5px]",
            )}
          />
          <span
            className={clsx(
              "absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-[var(--dur-short)] ease-in-out",
              menuOpen ? "-rotate-45" : "translate-y-[3.5px]",
            )}
          />
        </button>
      </div>
    </header>
  );
}
