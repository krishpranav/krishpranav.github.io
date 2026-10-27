"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Button } from "@/components/primitives/Button";
import { SocialLinks } from "@/components/primitives/Social";
import { identity } from "@/lib/resume";
import { getLenis } from "@/lib/lenis";
import { NAV_LINKS } from "./nav-links";

/* A full sheet under the bar; the bar's own toggle closes it. */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = getLenis();
    if (!open) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    ref.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className={clsx(
        "fixed inset-0 flex-col justify-between bg-paper px-[var(--gutter)] pb-10 pt-[calc(var(--nav-h)+var(--space-xl))] md:hidden",
        open && "flex"
      )}
      style={{ zIndex: "var(--z-sticky)" }}
    >
      <nav aria-label="Sections">
        <ul>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} onClick={onClose} className="block py-3 text-[2rem] font-semibold leading-tight tracking-[-0.03em]">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid gap-3">
        <Button href={`mailto:${identity.links.email}`} variant="primary" onClick={onClose}>
          Email me
        </Button>
        <Button href={identity.links.resume} external>
          Résumé (PDF)
        </Button>
        <SocialLinks className="-ml-3 mt-2" />
      </div>
    </div>
  );
}
