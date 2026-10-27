"use client";

import { useState } from "react";
import { FilePdf } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/primitives/Button";
import { SOCIALS, SocialMark } from "@/components/primitives/Social";
import LocalClock from "@/components/shell/LocalClock";
import { identity } from "@/lib/resume";

// My accounts, then the résumé: each with its mark, its name and the handle it opens.
const LINKS = [
  ...SOCIALS.map((x) => ({ key: x.id, label: x.label, note: x.handle, href: x.href, mark: <SocialMark id={x.id} /> })),
  { key: "resume", label: "Résumé", note: "PDF", href: identity.links.resume, mark: <FilePdf aria-hidden weight="fill" size={22} /> },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.links.email);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };
  return (
    <button type="button" onClick={copy} className="btn">
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}

/* The close: a big hello, where and when I am, and my address set as the object. */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative pt-[var(--section-gap)]">
      <div className="container">
        <div className="cols items-end gap-y-12">
          <div className="col-span-full md:col-span-6">
            <h2 id="contact-title" data-reveal className="t-hero">
              Say hello.
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[26ch] t-lead text-muted">
              I&rsquo;m in {identity.locationShort}
              <LocalClock before=", where it’s " />. Email is the fastest way to reach me.
            </p>
          </div>
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="col-span-full md:col-span-6 md:col-start-7">
            <a
              href={`mailto:${identity.links.email}`}
              className="link block break-words text-[clamp(1.5rem,1rem+1.9vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em]"
            >
              {identity.links.email}
            </a>
            <div data-primary-cta className="mt-8 flex flex-wrap gap-4">
              <Button href={`mailto:${identity.links.email}`} variant="primary">
                Email me
              </Button>
              <CopyEmail />
            </div>
          </div>
        </div>

        <ul className="mt-[var(--section-gap-s)] grid grid-cols-1 border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map(({ key, label, note, href, mark }) => (
            <li key={key} className="border-b border-rule lg:border-b-0 lg:[&+li]:border-l lg:first:[&>a]:pl-0 lg:last:[&>a]:pr-0">
              <a
                href={href}
                target="_blank"
                rel={key === "resume" ? "noopener noreferrer" : "me noopener noreferrer"}
                className="group flex min-h-20 items-center gap-3 text-lg font-medium sm:pr-6 lg:px-6"
              >
                <span className="text-muted transition-colors duration-[var(--dur-short)] group-hover:text-ink">{mark}</span>
                {label}
                <span className="ml-auto text-sm font-normal text-muted transition-colors duration-[var(--dur-short)] group-hover:text-ink">
                  {note}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-[var(--section-gap-s)] border-t border-rule">
        <div className="container flex flex-col gap-2 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {identity.name}. Designed and built by me.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6">
            <li className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("kp:palette"))}
                className="link inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap hover:text-ink"
              >
                <span>
                  Press <kbd className="font-body">⌘K</kbd> to jump anywhere
                </span>
              </button>
            </li>
            <li>
              <a
                href={identity.links.source}
                target="_blank"
                rel="noopener noreferrer"
                className="link inline-flex min-h-11 items-center hover:text-ink"
              >
                <SocialMark id="github" size={14} />
                <span className="ml-2">Source</span>
              </a>
            </li>
            <li>
              <a href="#top" className="link inline-flex min-h-11 items-center hover:text-ink">
                Back to top
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </section>
  );
}
