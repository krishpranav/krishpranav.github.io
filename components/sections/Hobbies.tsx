import { siCounterstrike, siFortnite } from "simple-icons";
import { Logo } from "@/components/primitives/Logo";
import { Mark, type MarkKey } from "@/components/primitives/Marks";
import { hobbies } from "@/lib/resume";

const fmt = (n: number) => n.toLocaleString("en-US");
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

/* Off the clock, in order of how much of it there is: trading as the one big tile, then
   sim racing, then the hours in games. */
export default function Hobbies() {
  const [cs, fortnite] = hobbies.games;
  const markets = hobbies.trading.filter((p): p is { mark: string; text: string } => typeof p !== "string");
  const tradeSentence = hobbies.trading.map((p) => (typeof p === "string" ? p : p.text)).join("");

  return (
    <section id="life" aria-labelledby="life-title" className="relative pt-[var(--section-gap-s)]">
      <div className="container">
        <h2 id="life-title" data-reveal className="max-w-[16ch] t-section">
          Off the clock, I trade, race and play.
        </h2>

        <div className="cols mt-16 items-stretch gap-y-12">
          {/* Trading: the big tile. */}
          <article data-reveal className="tile col-span-full flex flex-col justify-between gap-12 p-8 md:col-span-7 md:p-12">
            <h3 className="visually-hidden">Trading</h3>
            <p className="max-w-[16ch] t-statement">{tradeSentence}</p>
            <ul className="flex flex-wrap gap-x-10 gap-y-6 border-t border-paper-3 pt-8">
              {markets.map((m) => (
                <li key={m.text} className="flex items-center gap-3 text-lg">
                  <Mark name={m.mark as MarkKey} size={32} />
                  {cap(m.text)}
                </li>
              ))}
            </ul>
          </article>

          {/* Sim racing, then games. */}
          <div className="col-span-full flex flex-col gap-12 md:col-span-5 md:col-start-8">
            <article data-reveal style={{ "--i": 1 } as React.CSSProperties} className="tile flex flex-1 flex-col justify-between gap-10 p-8 md:p-10">
              <h3 className="visually-hidden">Sim racing</h3>
              <Mark name="wheel" size={44} label="Steering wheel" />
              <p className="t-title font-semibold">
                <Line parts={hobbies.racing} />
              </p>
            </article>

            <article data-reveal style={{ "--i": 2 } as React.CSSProperties} className="tile flex flex-1 flex-col justify-between gap-10 p-8 md:p-10">
              <h3 className="visually-hidden">Games</h3>
              <div className="flex items-center gap-4">
                <GameMark path={siCounterstrike.path} label="Counter-Strike" size={30} />
                <Logo name="csgo" scale={0.74} />
              </div>
              <div>
                <p>
                  <span className="t-title font-semibold tracking-[-0.02em]">{fmt(cs.hours)} hours</span>{" "}
                  <span className="text-ink-2">in {cs.name}</span>
                </p>
                <p className="mt-3 flex items-center gap-3 text-ink-2">
                  <GameMark path={siFortnite.path} label="Fortnite" size={20} />
                  <span>
                    <span className="font-semibold text-ink">{fmt(fortnite.hours)} hours</span> in {fortnite.name}
                  </span>
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
