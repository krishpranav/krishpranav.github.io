import clsx from "clsx";
import { Button } from "@/components/primitives/Button";
import { Logo } from "@/components/primitives/Logo";
import { Stack } from "@/components/primitives/Marks";
import { Period } from "@/components/primitives/Tags";
import { identity, roles, type LogoKey, type Role } from "@/lib/resume";

// One grid for every row, so company, role, dates and the toggle line up down the list.
const ROW =
  "grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 md:grid-cols-12 md:items-baseline md:gap-x-[var(--gap-columns)]";
const COMPANY = "col-start-1 row-start-1 text-lg font-semibold tracking-[-0.015em] md:col-span-4";
const ROLE = "col-start-1 md:col-span-5 md:col-start-5 md:row-start-1";
const WHEN = "col-start-1 text-sm text-muted md:col-span-2 md:col-start-10 md:row-start-1";

// Each mark sized so its capitals match the 14px caps of the 20px names around it.
// Crossing Hurdles' badge carries its name too small to read, so the name sits beside it.
const ROW_MARK: Partial<Record<LogoKey, { scale: number; named?: boolean }>> = {
  turing: { scale: 1.04 },
  uber: { scale: 0.47 },
  paypal: { scale: 0.55 },
  "crossing-hurdles": { scale: 0.52, named: true },
};

function Company({ role: r }: { role: Role }) {
  const mark = r.logo && ROW_MARK[r.logo];
  if (!r.logo || !mark) return <>{r.company}</>;
  if (!mark.named) return <Logo name={r.logo} scale={mark.scale} className="inline-block align-middle" />;
  return (
    <>
      <Logo name={r.logo} scale={mark.scale} decorative className="mr-3 inline-block align-middle" />
      {r.company}
    </>
  );
}

/* Every role, most recent first, each company as its own mark where it has one, ending
   where it started. Each row is a native
   disclosure, so the detail opens without script. */
export default function Path() {
  return (
    <section id="path" aria-labelledby="path-title" className="relative py-[var(--section-gap)]">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <div>
            <h2 id="path-title" data-reveal className="t-section">
              Every role since 2017.
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[30ch] t-lead text-muted">
              8+ years of production systems, 4+ of them in AI/ML.
            </p>
          </div>
          <Button href={identity.links.resume} external>
            Résumé (PDF)
          </Button>
        </div>

        <ol className="mt-16 border-t border-rule">
          {roles.map((r) => (
            <Row key={r.id} role={r} />
          ))}
        </ol>
        <p className={clsx(ROW, "mt-16 md:mt-24")}>
          <span className="col-start-1 row-start-1 t-title font-semibold md:col-span-4">6th grade</span>
          <span className={clsx(ROLE, "t-title text-muted")}>Where it started: my first program.</span>
        </p>
      </div>
    </section>
  );
}

function Row({ role: r }: { role: Role }) {
  return (
    <li className="border-b border-rule">
      <details className="xp group">
        <summary className={clsx(ROW, "py-7")}>
          <span className={COMPANY}>
            <Company role={r} />
          </span>
          <span className={ROLE}>
            <span className="block">{r.title}</span>
            <span className="mt-1 block text-sm text-muted">{r.focus}</span>
          </span>
          <Period from={r.from} to={r.to} className={WHEN} />
          <span aria-hidden className="xp__toggle col-start-2 row-start-1 self-start md:col-start-12 md:justify-self-end">
            <i />
            <i />
          </span>
        </summary>

        <div className="xp__panel cols pb-10">
          <div className="col-span-full md:col-span-7 md:col-start-5">
            <ul className="list-disc space-y-3 pl-5 text-ink-2 marker:text-muted">
              {r.bullets.map((b) => (
                <li key={b} className="max-w-[64ch]">
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
              <Stack items={r.stack} className="text-muted" />
              {r.caseId && (
                <a href={`#case-${r.caseId}`} className="link font-medium">
                  See it in my work
                </a>
              )}
            </div>
          </div>
        </div>
      </details>
    </li>
  );
}
