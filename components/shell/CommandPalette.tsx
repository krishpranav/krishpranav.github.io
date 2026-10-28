"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { identity } from "@/lib/resume";
import { getLenis, scrollToTarget } from "@/lib/lenis";

type Command = { id: string; label: string; hint: string; run: () => void | string };

const open = (href: string) => () => void window.open(href, "_blank", "noopener");

export default function CommandPalette({ open: isOpen, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(
    () => [
      { id: "start", label: "How it started", hint: "White-hat hacking, Scratch", run: () => scrollToTarget("#start") },
      { id: "work", label: "Things I’ve built", hint: "Work", run: () => scrollToTarget("#work") },
      { id: "oss", label: "My fixes upstream", hint: "Open source", run: () => scrollToTarget("#open-source") },
      { id: "path", label: "Every role since 2017", hint: "Experience", run: () => scrollToTarget("#path") },
      { id: "principles", label: "What I specialise in", hint: "Production AI systems", run: () => scrollToTarget("#principles") },
      { id: "life", label: "Off the clock", hint: "Games, racing, trading", run: () => scrollToTarget("#life") },
      { id: "cities", label: "Cities I’ve been to", hint: "Singapore, San Francisco", run: () => scrollToTarget("#cities") },
      { id: "contact", label: "Say hello", hint: "Contact", run: () => scrollToTarget("#contact") },
      {
        id: "copy",
        label: "Copy my email address",
        hint: identity.links.email,
        run: () => {
          navigator.clipboard?.writeText(identity.links.email);
          return "Copied to the clipboard";
        },
      },
      { id: "github", label: "Open GitHub", hint: "New tab", run: open(identity.links.github) },
      { id: "linkedin", label: "Open LinkedIn", hint: "New tab", run: open(identity.links.linkedin) },
      { id: "x", label: "Open X", hint: identity.links.xHandle, run: open(identity.links.x) },
      { id: "resume", label: "Open the résumé (PDF)", hint: "New tab", run: open(identity.links.resume) },
      { id: "top", label: "Back to the top", hint: "Top", run: () => scrollToTarget(0) },
    ],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    getLenis()?.stop();
    setQuery("");
    setIndex(0);
    setFlash(null);
    requestAnimationFrame(() => input.current?.focus());
    return () => {
      getLenis()?.start();
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const run = (c: Command | undefined) => {
    if (!c) return;
    getLenis()?.start(); // a glide needs Lenis running before it starts, not after the menu closes
    const msg = c.run();
    if (typeof msg === "string") {
      setFlash(msg);
      setTimeout(onClose, 700);
    } else onClose();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // focus stays in the combobox; arrows move the selection
    }
  };

  return (
    <div
      className="palette-scrim fixed inset-0 flex items-start justify-center px-4 pt-[18dvh]"
      style={{ zIndex: "var(--z-modal)" }}
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="palette w-full max-w-[560px] overflow-hidden rounded-card bg-paper"
        data-lenis-prevent
      >
        <div className="flex h-14 items-center gap-3 border-b border-rule px-5">
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            placeholder="Jump to a section or copy my email"
            aria-label="Command"
            role="combobox"
            aria-expanded="true"
            aria-controls="kp-commands"
            aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
            className="h-full flex-1 bg-transparent text-lg text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="rounded-[6px] bg-paper-2 px-1.5 py-0.5 font-body text-xs text-muted">Esc</kbd>
        </div>
        <ul id="kp-commands" role="listbox" className="max-h-[360px] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-3 text-ink-2">No command matches that.</li>}
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${c.id}`}
              role="option"
              aria-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(c)}
              className={clsx(
                "flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-inner px-3",
                i === index ? "bg-paper-2 text-ink" : "text-ink-2"
              )}
            >
              <span>{flash && i === index ? flash : c.label}</span>
              <span className="text-sm text-muted">{c.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
