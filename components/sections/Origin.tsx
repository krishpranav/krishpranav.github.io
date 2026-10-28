import { Mark, type MarkKey } from "@/components/primitives/Marks";
import { origin } from "@/lib/resume";

type Part = string | { mark: string; text: string; href?: string };

// The body in my words, where "Scratch" carries its own mark and links out.
function Body({ parts }: { parts: readonly Part[] }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : p.href ? (
          <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap">
            <Mark name={p.mark as MarkKey} size="0.86em" className="mark-inline" />
            {p.text}
          </a>
        ) : (
          <span key={i} className="whitespace-nowrap">
            <Mark name={p.mark as MarkKey} size="0.86em" className="mark-inline" />
            {p.text}
          </span>
        )
      )}
    </>
  );
}

/* How it started: a white-hat hacker in 6th grade whose first language was Scratch, then
   the line from there to here, kept to three real milestones. */
export default function Origin() {
  return (
    <section id="start" aria-labelledby="start-title" className="relative py-[var(--section-gap)]">
      <div className="container">
        <div className="cols gap-y-14">
          <div className="col-span-full md:col-span-6">
            <h2 id="start-title" data-reveal className="max-w-[11ch] t-section">
              {origin.heading}
            </h2>
            <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-7 max-w-[26ch] t-statement">
              {origin.lead}
            </p>
            <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-7 max-w-[44ch] text-lg text-ink-2">
              <Body parts={origin.body} />
            </p>
          </div>

          <ol
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
            className="col-span-full self-center border-t border-rule md:col-span-5 md:col-start-8"
          >
            {origin.milestones.map((m) => (
              <li
                key={m.when}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-x-6 border-b border-rule py-6 md:grid-cols-[7.5rem_minmax(0,1fr)]"
              >
                <span className="text-sm tabular-nums text-muted">{m.when}</span>
                <span className="t-title font-semibold">{m.what}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
