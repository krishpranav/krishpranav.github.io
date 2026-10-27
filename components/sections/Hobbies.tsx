import { siCounterstrike, siFortnite } from "simple-icons";
import { Logo } from "@/components/primitives/Logo";
import { Mark, type MarkKey } from "@/components/primitives/Marks";
import { hobbies } from "@/lib/resume";

const fmt = (n: number) => n.toLocaleString("en-US");

type Part = string | { mark: string; text: string };

// A game's own mark (simple-icons), in the current colour.
function GameMark({ path, label, size }: { path: string; label: string; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={label} fill="currentColor" className="shrink-0">
      <path d={path} />
    </svg>
  );
}

// A line in my words, where a word that has a mark carries it inline.
function Line({ parts }: { parts: readonly Part[] }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <span key={i} className="whitespace-nowrap">
            <Mark name={p.mark as MarkKey} size="0.82em" className="mark-inline" />
            {p.text}
          </span>
        )
      )}
    </>
  );
}

/* Off the clock: the hours I've put into games as the one tile, under Counter-Strike's
   marks, with the racing and the trading said beside it, large, in my own words. */
export default function Hobbies() {
  const [cs, fortnite] = hobbies.games;
  return (
    <section id="life" aria-labelledby="life-title" className="relative pt-[var(--section-gap-s)]">
      <div className="container">
        <h2 id="life-title" data-reveal className="max-w-[16ch] t-section">
          Off the clock, I play, race and trade.
        </h2>

        <div className="cols mt-16 gap-y-12">
          <article data-reveal className="tile col-span-full flex flex-col p-8 md:col-span-6 md:p-12">
            <h3 className="visually-hidden">Games</h3>
            <div className="flex items-center gap-5">
              <GameMark path={siCounterstrike.path} label="Counter-Strike" size={44} />
              <Logo name="csgo" scale={0.92} />
            </div>
            <p className="mt-14">
              <span className="block t-figure">{fmt(cs.hours)}</span>
              <span className="mt-3 block text-lg text-ink-2">hours in {cs.name}</span>
            </p>
            <p className="mt-10 flex items-center gap-4 border-t border-paper-3 pt-6 text-lg">
              <GameMark path={siFortnite.path} label="Fortnite" size={26} />
              <span>
                <span className="font-semibold">{fmt(fortnite.hours)} hours</span> <span className="text-ink-2">in {fortnite.name}</span>
              </span>
            </p>
          </article>

          <div className="col-span-full flex flex-col justify-between gap-12 md:col-span-5 md:col-start-8">
            <h3 data-reveal style={{ "--i": 1 } as React.CSSProperties} className="life-line border-t border-rule pt-8">
              <Line parts={hobbies.racing} />
            </h3>
            <h3 data-reveal style={{ "--i": 2 } as React.CSSProperties} className="life-line border-t border-rule pt-8">
              <Line parts={hobbies.trading} />
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
