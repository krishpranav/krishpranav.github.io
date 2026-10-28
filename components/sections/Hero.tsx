import { HandWaving } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/primitives/Button";
import { Portrait } from "@/components/primitives/Portrait";
import { SocialLinks } from "@/components/primitives/Social";
import { identity } from "@/lib/resume";

// Phrases the head never breaks inside, my name and my role, so it steps down evenly.
// Below 360px my name is wider than the line, and on a phone the role would leave
// "senior" alone, so there each may break. "Turing." holds on to the wave after it.
const TOGETHER = [
  { phrase: `${identity.first} ${identity.last}`, cls: "min-[360px]:whitespace-nowrap" },
  { phrase: "AI/ML engineer", cls: "md:whitespace-nowrap" },
  { phrase: "Turing.", cls: "whitespace-nowrap", wave: true },
];
const pattern = new RegExp(`(${TOGETHER.map((t) => t.phrase.replace(/[/.]/g, "\\$&")).join("|")})`);
const headline = identity.headline.split(pattern).map((part, i) => {
  const keep = TOGETHER.find((t) => t.phrase === part);
  return keep ? (
    <span key={i} className={keep.cls}>
      {part}
      {/* Drawn in strokes near the headline's own weight, so it reads as a hand at size. */}
      {keep.wave && <HandWaving aria-hidden weight="bold" size="0.86em" className="wave" />}
    </span>
  ) : (
    part
  );
});

/* Who I am, set bold, beside my portrait shown whole: how long I've been at it, and the
   ways to reach me. On phones the portrait leads, sized so the head and the action still
   fit on the first screen (globals.css). */
export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative pb-16 pt-[calc(var(--nav-h)+var(--space-xl))] md:flex md:min-h-[min(100svh,1000px)] md:items-center md:py-[calc(var(--nav-h)+var(--space-xl))]"
    >
      {/* From 90rem the head is at full size inside the capped container, so the gap gives
          it the room to keep three even lines. */}
      <div className="container flex flex-col gap-10 md:flex-row md:items-center md:justify-center md:gap-24 xl:gap-[4.5rem]">
        <div className="min-w-0 md:max-w-[44rem] md:flex-1">
          <h1 className="rise max-w-[19ch] t-intro max-md:[text-wrap:pretty]" style={{ "--i": 1 } as React.CSSProperties}>
            {headline}
          </h1>
          <p className="rise mt-6 t-lead text-muted" style={{ "--i": 2 } as React.CSSProperties}>
            {identity.statement}
          </p>
          <div
            data-primary-cta
            className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <Button href={`mailto:${identity.links.email}`} variant="primary">
              Email me
            </Button>
            <a href={identity.links.resume} target="_blank" rel="noopener noreferrer" className="link text-md font-medium">
              My résumé
            </a>
            <SocialLinks className="-mx-2" />
          </div>
        </div>
        <div className="rise hero-portrait shrink-0 max-md:order-first max-md:self-start md:w-[min(440px,36vw)] md:self-center">
          <Portrait sizes="(min-width: 60rem) min(36vw, 440px), (min-width: 40rem) 20rem, 15rem" />
        </div>
      </div>
    </section>
  );
}
