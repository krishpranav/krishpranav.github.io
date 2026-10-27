import clsx from "clsx";
import { logos, type LogoKey } from "@/lib/resume";

// Inline, a mark stands in for its name inside a sentence: its height in em and the drop
// below the baseline for marks with descenders, so it sits on the line like the word.
// Turing's swoosh would sink below the line, so inline it is the wordmark alone.
const INLINE: Partial<Record<LogoKey, { h: number; drop: number; src?: string; ratio?: number }>> = {
  paypal: { h: 0.98, drop: 0.235 },
  uber: { h: 0.86, drop: 0 },
  turing: { h: 0.7, drop: 0, src: "/logos/turing-word.svg", ratio: 549 / 66 },
};

/* An official mark drawn as a mask in the current text colour, at its optical height
   (scaled by `scale`), so every logo on the page takes the same monochrome treatment. */
export function Logo({
  name,
  scale = 1,
  inline,
  decorative,
  className,
}: {
  name: LogoKey;
  scale?: number;
  inline?: boolean;
  decorative?: boolean; // the name is already written beside it
  className?: string;
}) {
  const l = logos[name];
  const fit = inline ? INLINE[name] : undefined;
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : l.name}
      aria-hidden={decorative || undefined}
      className={clsx("logo", fit && "logo--inline", className)}
      style={
        {
          "--src": `url(${fit?.src ?? l.src})`,
          "--ratio": fit?.ratio ?? l.ratio,
          "--h": fit ? `${fit.h}em` : `${Math.round(l.h * scale)}px`,
          "--drop": fit ? `${-fit.drop}em` : undefined,
        } as React.CSSProperties
      }
    />
  );
}
