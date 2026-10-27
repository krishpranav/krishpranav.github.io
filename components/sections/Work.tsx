import clsx from "clsx";
import { Logo } from "@/components/primitives/Logo";
import { Mark, markFor, Stack, type MarkKey } from "@/components/primitives/Marks";
import { Period } from "@/components/primitives/Tags";
import { labs, roleById, work, type Work as WorkItem } from "@/lib/resume";

// A calm bento: the current work across the row, then two pairs that swap their widths.
const SPAN: Record<string, string> = {
  turing: "md:col-span-12",
  notetaker: "md:col-span-5",
  paypal: "md:col-span-7",
  uber: "md:col-span-7",
  gateway: "md:col-span-5",
};

// The résumé's titles, shortened where a tile footer has to hold them on one line.
const TITLE: Record<string, string> = { paypal: "Senior Software Engineer" };

export default function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-[var(--section-gap)]">
      <div className="container">
        <h2 id="work-title" data-reveal className="max-w-[14ch] t-section">
          Things I&rsquo;ve built.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-12">
          {work.map((w) => (
            <Tile key={w.id} item={w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ item: w }: { item: WorkItem }) {
  const r = roleById(w.role);
  const wide = w.id === "turing";
  return (
    <article
      id={`case-${w.id}`}
      data-reveal
      className={clsx("tile flex flex-col p-8 md:p-12", SPAN[w.id])}
    >
      <div className="flex min-h-14 items-center">
        {w.logo ? <Logo name={w.logo} /> : <span className="text-[1.625rem] font-semibold leading-none tracking-[-0.035em]">{r.company}</span>}
      </div>

      {w.figure && (
        <p className="mt-10">
          <span className="block t-figure">{w.figure.value}</span>
          <span className="mt-3 block text-sm text-muted">{w.figure.caption}</span>
        </p>
      )}

      <div className={clsx("mt-auto pt-10", wide && "md:grid md:grid-cols-12 md:items-end md:gap-x-[var(--gap-columns)]")}>
        <h3 className={clsx("t-title", wide ? "max-w-[16ch] md:col-span-6 md:text-[3rem] md:leading-[1.05]" : "max-w-[22ch]")}>
          {w.headline}
        </h3>
        <p className={clsx("mt-4 max-w-[54ch] text-ink-2", wide && "md:col-span-5 md:col-start-8 md:mt-0")}>{w.body}</p>
      </div>

      {w.labs && (
        <div className="mt-10 border-t border-paper-3 pt-8">
          <p className="text-sm text-muted">I work directly with teams at</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-4">
            {labs.map((l) => (
              <li key={l} className="inline-flex items-center gap-3 text-xl font-semibold tracking-[-0.02em]">
                {markFor(l) && <Mark name={markFor(l)!} size={28} />}
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}

      {w.platforms && (
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-2">
          <span className="text-muted">It joins</span>
          {w.platforms.map((p) => (
            <span key={p.name} className="inline-flex items-center gap-1.5">
              <Mark name={p.mark as MarkKey} size={16} />
              {p.name}
            </span>
          ))}
        </p>
      )}

      <div
        className={clsx(
          "mt-10 flex flex-col gap-2 border-t border-paper-3 pt-5 text-sm",
          wide && "md:flex-row md:items-baseline md:justify-between"
        )}
      >
        <span className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-medium">{TITLE[w.id] ?? r.title}</span>
          <Period from={r.from} to={r.to} className="text-muted" />
        </span>
        <Stack items={w.stack} className="text-muted" />
      </div>
    </article>
  );
}
