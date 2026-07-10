import { identity } from "@/lib/resume";

export default function Footer() {
  return (
    <footer className="hairline-t">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-[2px] bg-ink" />
          <span className="font-mono text-[12px] text-mute">
            {identity.name}
          </span>
        </div>
        <div className="flex items-center gap-5 font-mono text-[12px] text-mute">
          <a href={identity.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            github
          </a>
          <a href={identity.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            linkedin
          </a>
          <a href={`mailto:${identity.links.email}`} className="hover:text-ink">
            email
          </a>
          <span className="text-faint">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
