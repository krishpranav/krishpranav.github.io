import { Mark, markFor, Stack } from "@/components/primitives/Marks";
import { capabilities, languages, principles } from "@/lib/resume";

// Keeps a compound like "30-second" from breaking at its hyphen.
const keepHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));

/* How I work, set on the paper: the line I hold to as the head, why beneath it beside
   the three habits it comes down to, then the tools I reach for. */
export default function Principles() {
  return (
    <section id="principles" aria-labelledby="principles-title" className="relative pb-[var(--section-gap-s)]">
      <div className="container">
        <div className="cols gap-y-12">
          <h2 id="principles-title" data-reveal className="col-span-full max-w-[20ch] t-section md:col-span-10">
            {principles.statement}
          </h2>
          <div className="col-span-full space-y-5 text-lg text-ink-2 md:col-span-6">
            {principles.essay.map((p) => (
              <p key={p}>{keepHyphens(p)}</p>
            ))}
          </div>
          <ul className="col-span-full border-t border-rule md:col-span-5 md:col-start-8">
            {principles.tenets.map((t, i) => (
              <li key={t.title} data-reveal style={{ "--i": i } as React.CSSProperties} className="border-b border-rule py-5">
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1 text-muted">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div id="craft" className="cols mt-[var(--section-gap-s)] gap-y-10">
          <div className="col-span-full md:col-span-5">
            <h3 className="t-title">Tools I reach for</h3>
            <p className="mt-6 text-muted">I write</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              {languages.map((l) => (
                <li key={l.name} className="inline-flex items-center gap-3 text-lg font-semibold tracking-[-0.015em]">
                  {markFor(l.name) && <Mark name={markFor(l.name)!} size={26} />}
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
          <dl className="col-span-full grid grid-cols-1 gap-x-[var(--gap-columns)] gap-y-8 sm:grid-cols-2 md:col-span-5 md:col-start-8">
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
