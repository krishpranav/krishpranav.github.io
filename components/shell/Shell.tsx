"use client";

import { useCallback, useEffect, useState } from "react";
import { scrollToTarget } from "@/lib/lenis";
import CommandPalette from "./CommandPalette";
import MobileMenu from "./MobileMenu";
import Nav from "./Nav";
import Reveal from "./Reveal";
import SmoothScroll from "./SmoothScroll";

/* Owns the page chrome and its shared state: ⌘K and the mobile menu. */
export default function Shell() {
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState(false);

  const closePalette = useCallback(() => setPalette(false), []);
  const closeMenu = useCallback(() => setMenu(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };

    // In-page anchors go through Lenis so they glide and clear the bar.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.metaKey || e.ctrlKey) return;
      const hash = a.getAttribute("href")!;
      if (hash === "#main") return;
      e.preventDefault();
      scrollToTarget(hash === "#top" ? 0 : hash);
      history.replaceState(null, "", hash === "#top" ? location.pathname : hash);
    };

    // The footer's "Press ⌘K" button asks for the menu without owning its state.
    const onAsk = () => setPalette(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("kp:palette", onAsk);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kp:palette", onAsk);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <>
      <SmoothScroll />
      <Reveal />
      <Nav onMenu={() => setMenu((m) => !m)} menuOpen={menu} />
      <MobileMenu open={menu} onClose={closeMenu} />
      <CommandPalette open={palette} onClose={closePalette} />
    </>
  );
}
