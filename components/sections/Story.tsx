import { Logo } from "@/components/primitives/Logo";
import { Mark, markFor } from "@/components/primitives/Marks";
import { story } from "@/lib/resume";

/* My story as one statement, with each company set as its own mark at the size of the
   words around it, and each lab I work with beside its mark. While the section is pinned, each line lights from grey to ink
   (globals.css); without scroll timelines it simply reads in full. */
export default function Story() {
  return (
    <section aria-labelledby="story-title" className="story py-[var(--section-gap)]">
      <div className="story__pin container">
        <h2 id="story-title" className="visually-hidden">
          My story
        </h2>
        <p className="t-statement max-w-[19em]">
          {story.map((line, i) => (
            <span key={i} className="story__line">
              {line.map((part, k) =>
                typeof part === "string" ? (
                  part
                ) : "logo" in part ? (
                  <Logo key={k} name={part.logo} inline />
                ) : (
                  <span key={k} className="whitespace-nowrap">
                    {markFor(part.lab) && <Mark name={markFor(part.lab)!} size="0.74em" className="mark-inline" />}
                    {part.lab}
                  </span>
                )
              )}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
