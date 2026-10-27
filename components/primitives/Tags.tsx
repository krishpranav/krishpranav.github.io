import clsx from "clsx";

/* A stack as a run of small printed tags. */
export function Chips({ items, className, label = "Stack" }: { items: string[]; className?: string; label?: string }) {
  return (
    <ul className={clsx("flex flex-wrap gap-2", className)} aria-label={label}>
      {items.map((s) => (
        <li key={s} className="rounded-pill border border-rule px-2 py-1 text-sm leading-5 text-ink-2">
          {s}
        </li>
      ))}
    </ul>
  );
}

/* Two dates joined by a drawn rule; "Now" stands alone. */
export function Period({ from, to, className }: { from: string; to?: string; className?: string }) {
  if (!to) return <span className={clsx("period", className)}>{from}</span>;
  return (
    <span className={clsx("period", className)}>
      {from}
      <i aria-hidden />
      <span className="visually-hidden">to</span>
      {to}
    </span>
  );
}
