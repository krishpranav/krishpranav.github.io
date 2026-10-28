import clsx from "clsx";
import { github } from "@/lib/resume";

// Night ink by level, from the quiet well of a day off to full ink on the busiest days.
const LEVEL = ["bg-night-2", "bg-night-ink/20", "bg-night-ink/40", "bg-night-ink/65", "bg-night-ink"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 86_400_000;

// The year as weeks of seven days, Sunday first, padded where the first week starts mid-week.
const { levels, start, total } = github.contributions;
const startDate = new Date(`${start}T00:00:00Z`);
const offset = startDate.getUTCDay();
const days = [...Array<number>(offset).fill(-1), ...levels.split("").map(Number)];
const WEEKS: number[][] = [];
for (let i = 0; i < days.length; i += 7) WEEKS.push(days.slice(i, i + 7));

const label = `${total.toLocaleString("en-US")} contributions on GitHub in the last year, one square per day`;

/* The most recent `count` weeks: weeks as columns, days as rows, ink density by level.
   Every column shares the width, so it fills its row with nothing to scroll. */
function Calendar({ count, className }: { count: number; className?: string }) {
  const first = Math.max(0, WEEKS.length - count);
  const weeks = WEEKS.slice(first);

  // A month's name over the first week that starts in it, kept clear of both ends.
  const months: { at: number; name: string }[] = [];
  let last = -1;
  weeks.forEach((_, i) => {
    const d = new Date(startDate.getTime() + ((first + i) * 7 - offset) * DAY);
    if (d.getUTCMonth() === last) return;
    last = d.getUTCMonth();
    if ((i > 0 || d.getUTCDate() <= 7) && i < weeks.length - 2) months.push({ at: i, name: MONTHS[last] });
  });

  return (
    <figure className={clsx("m-0", className)}>
      <div aria-hidden className="relative mb-3 h-4 text-xs text-night-muted">
        {months.map((m) => (
          <span key={m.at} className="absolute top-0" style={{ left: `${(m.at / weeks.length) * 100}%` }}>
            {m.name}
          </span>
        ))}
      </div>
      <div
        role="img"
        aria-label={label}
        className="grid grid-flow-col grid-rows-7 gap-[3px] md:gap-1"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
      >
        {weeks.flat().map((lv, i) =>
          lv < 0 ? (
            <span key={i} className="aspect-square" />
          ) : (
            <span key={i} className={clsx("aspect-square rounded-[2px] md:rounded-[3px]", LEVEL[lv])} />
          )
        )}
      </div>
      <figcaption aria-hidden className="mt-4 flex items-center justify-end gap-2 text-xs text-night-muted">
        Less
        {LEVEL.map((c) => (
          <span key={c} className={clsx("size-3 rounded-[2px]", c)} />
        ))}
        More
      </figcaption>
    </figure>
  );
}

/* My last year on GitHub as a calendar. Phones get the last six months at full width,
   wider screens the whole year; both are drawn on the server and need no script. */
export default function ContributionGrid({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Calendar count={26} className="sm:hidden" />
      <Calendar count={WEEKS.length} className="max-sm:hidden" />
    </div>
  );
}
