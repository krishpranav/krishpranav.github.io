import { Button } from "@/components/primitives/Button";
import { Portrait } from "@/components/primitives/Portrait";
import { SocialLinks } from "@/components/primitives/Social";
import { identity } from "@/lib/resume";

// The role stays on one line, so the head steps down evenly.
const ROLE = "AI/ML engineer";
const [beforeRole, afterRole] = identity.headline.split(ROLE);

/* Who I am, set bold, beside my portrait shown whole: how long I've been at it, and the
   ways to reach me. */
export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative pb-16 pt-[calc(var(--nav-h)+var(--space-2xl))] md:flex md:min-h-[min(100svh,1000px)] md:items-center md:py-[calc(var(--nav-h)+var(--space-xl))]"
    >
      <div className="container flex flex-col gap-14 md:flex-row md:items-center md:justify-center md:gap-24">
        <div className="min-w-0 md:max-w-[36rem] md:flex-1">
          <h1 className="rise max-w-[17ch] t-intro">
            {afterRole === undefined ? (
              identity.headline
            ) : (
              <>
                {beforeRole}
                <span className="whitespace-nowrap">{ROLE}</span>
                {afterRole}
              </>
            )}
          </h1>
          <p className="rise mt-6 t-lead text-muted" style={{ "--i": 1 } as React.CSSProperties}>
            {identity.statement}
          </p>
          <div
            data-primary-cta
            className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={{ "--i": 2 } as React.CSSProperties}
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
        <div className="rise w-full max-w-[440px] shrink-0 self-center md:w-[min(440px,36vw)]" style={{ "--i": 1 } as React.CSSProperties}>
          <Portrait sizes="(min-width: 60rem) min(36vw, 440px), (min-width: 40rem) 60vw, 88vw" />
        </div>
      </div>
    </section>
  );
}
