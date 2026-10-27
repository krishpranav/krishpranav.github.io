import { LinkedinLogo } from "@phosphor-icons/react/ssr";
import clsx from "clsx";
import { siGithub, siX } from "simple-icons";
import { identity } from "@/lib/resume";

// The accounts my GitHub profile links to, plus GitHub itself.
export const SOCIALS = [
  { id: "github", label: "GitHub", handle: identity.links.githubHandle.replace("github.com/", ""), href: identity.links.github },
  { id: "linkedin", label: "LinkedIn", handle: identity.links.linkedinHandle.replace("linkedin.com/in/", ""), href: identity.links.linkedin },
  { id: "x", label: "X", handle: identity.links.xHandle, href: identity.links.x },
] as const;

export type SocialId = (typeof SOCIALS)[number]["id"];

/* Each network's own mark, in the current text colour. GitHub and X are the official
   paths (simple-icons); LinkedIn's "in" comes from Phosphor, whose drawing carries a
   little padding, so it is set a touch larger to match. */
export function SocialMark({ id, size = 20 }: { id: SocialId; size?: number }) {
  if (id === "linkedin") return <LinkedinLogo aria-hidden weight="fill" size={Math.round(size * 1.2)} />;
  const icon = id === "github" ? siGithub : siX;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

/* My accounts as a row of marks, each a 44px target. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul aria-label="Find me on" className={clsx("flex items-center gap-1", className)}>
      {SOCIALS.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="me noopener noreferrer" aria-label={`${s.label}, ${s.handle}`} className="social">
            <SocialMark id={s.id} />
          </a>
        </li>
      ))}
    </ul>
  );
}
