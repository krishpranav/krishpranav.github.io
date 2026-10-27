import clsx from "clsx";

const W = 1792;
const H = 2400;
const set = (ext: string) => [600, 900, 1200].map((w) => `/me/illustrated-${w}.${ext} ${w}w`).join(", ");

/* My portrait, drawn in a hand-painted anime style, shown whole: the frame takes the
   image's own proportions, so none of it is cropped. AVIF, then WebP, then JPEG. */
export function Portrait({ sizes, className }: { sizes: string; className?: string }) {
  return (
    <picture className={clsx("portrait-frame", className)} style={{ aspectRatio: `${W} / ${H}` }}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src="/me/illustrated-1200.jpg"
        width={W}
        height={H}
        alt="Krisna, drawn in a hand-painted anime style: smiling in a white hoodie with headphones round the neck, at Marina Bay in Singapore, with the Merlion and Marina Bay Sands behind."
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
