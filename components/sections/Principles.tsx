import { Fragment } from "react";
import { Mark, markFor, Stack } from "@/components/primitives/Marks";
import { capabilities, labs, languages, principles } from "@/lib/resume";

// Keeps a compound like "30-second" from breaking at its hyphen.
const keepHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));

// The frontier labs whose teams I work with, each as its own mark. This is the proof.
// The separators sit outside the unbreakable spans, so a phone can wrap between labs.
function Labs() {
  return (
    <>
      {labs.map((lab, i) => (
        <Fragment key={lab}>
          <span className="whitespace-nowrap">
            {markFor(lab) && <Mark name={markFor(lab)!} size="0.82em" className="mark-inline" />}
            {lab}
          </span>
          {i < labs.length - 2 ? ", " : i === labs.length - 2 ? " and " : ""}
        </Fragment>
      ))}
    </>
  );
}

/* What I'm specialised in, said plainly, then backed: the depth in prose, where I go
   deepest as a short list, the frontier-lab teams as proof, and the tools underneath. */
export default function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="relative pb-[var(--section-gap-s)]">
      <div className="container">
        <div className="cols gap-y-12">
          <h2 id="principles-title" data-reveal className="col-span-full max-w-[18ch] t-section">
            {principles.statement}
          </h2>

          <div className="col-span-full space-y-5 text-lg text-ink-2 md:col-span-6">
            {principles.essay.map((p) => (
              <p key={p}>{keepHyphens(p)}</p>
            ))}
            <p className="!mt-8 text-ink">
              I do this for teams at <Labs />.
            </p>
          </div>

          <ul className="col-span-full border-t border-rule md:col-span-5 md:col-start-8">
            {principles.depth.map((line, i) => (
              <li
                key={line}
                data-reveal
                style={{ "--i": i } as React.CSSProperties}
                className="border-b border-rule py-5 t-title font-semibold"
              >
                {keepHyphens(line)}
              </li>
            ))}
          </ul>
        </div>

        {/* The languages across one full row, then the four groups beneath, so neither
            column ends early beside the other. */}
        <div id="craft" className="mt-[var(--section-gap-s)]">
          <h3 className="t-title">Tools I reach for</h3>
          <p className="mt-6 text-muted">I write</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-[var(--gap-columns)] gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {languages.map((l) => (
              <li key={l.name} className="flex min-w-0 items-center gap-3 text-lg font-semibold tracking-[-0.015em] md:text-xl">
                {markFor(l.name) && <Mark name={markFor(l.name)!} size={30} />}
                <span className="min-w-0">{l.name}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-14 grid grid-cols-1 gap-x-[var(--gap-columns)] gap-y-10 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold">{c.title}</dt>
                <dd className="mt-3 text-muted">
                  <Stack items={c.tools.map((t) => t.name)} size={15} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
