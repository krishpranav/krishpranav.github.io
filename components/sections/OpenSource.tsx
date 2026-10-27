import clsx from "clsx";
import { Logo } from "@/components/primitives/Logo";
import { Mark } from "@/components/primitives/Marks";
import { github, identity, repoNotes, upstreamFixes, type LogoKey, type UpstreamFix } from "@/lib/resume";

const fmtK = (n: number) => (n >= 100_000 ? `${Math.floor(n / 1000)}K` : `${(n / 1000).toFixed(1)}K`);
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`)
  );

// Each fix in my own words, with the project's mark. The diffs are verbatim (lib/resume.ts).
const VOICE: Record<number, { logo: LogoKey; headline: string }> = {
  15224: { logo: "tauri", headline: "I stopped Tauri’s webview from leaking Objective-C retains." },
  41986: { logo: "playwright", headline: "I made Playwright refuse navigations that crash Chromium." },
};

const vesper = github.repos.find((r) => r.name === "vesper");

/* The one dark chapter: code I've landed in projects that aren't mine, then my own. */
export default function OpenSource() {
  return (
    <section id="open-source" aria-labelledby="oss-title" className="night relative pb-[var(--section-gap-s)] pt-[var(--section-gap)]">
      <div className="container">
        <h2 id="oss-title" data-reveal className="max-w-[14ch] t-section">
          I fix things upstream.
        </h2>
        <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-6 max-w-[38ch] t-lead text-night-muted">
          Two of my fixes are merged into Tauri and Playwright, frameworks a lot of engineers build on.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {upstreamFixes.map((fix, i) => (
            <PrCard key={fix.number} fix={fix} i={i} />
          ))}
        </div>

        <p className="mt-24 max-w-[40ch] t-lead text-night-muted">
          In the last year I made <span className="text-night-ink">{github.contributions.total.toLocaleString("en-US")} contributions</span>{" "}
          on GitHub, across <span className="text-night-ink">{github.publicRepos} public repositories</span>.
          {vesper && (
            <>
              {" "}
              My username OSINT tool, vesper, has <span className="text-night-ink">{vesper.stars} stars</span>.
            </>
          )}{" "}
          <a href={identity.links.github} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap text-night-ink">
            <Mark name="github" size="0.8em" className="mark-inline" />
            Everything else is on my GitHub.
          </a>
        </p>

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {github.repos.map((r) => (
            <Project key={r.name} href={r.url} name={r.name} body={repoNotes[r.name] ?? r.description} rust={r.language === "Rust"} />
          ))}
          <Project
            href="https://github.com/rust-ui/ui/pulls?q=is%3Apr+author%3Akrishpranav+is%3Amerged"
            name="rust-ui/ui"
            body={`${github.rustUiMergedPRs} merged PRs: Rust ports of UI components, plus fixes.`}
            rust
          />
        </ul>
      </div>
    </section>
  );
}

function Project({ href, name, body, rust }: { href: string; name: string; body: string; rust?: boolean }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
        <span className="inline-flex items-center gap-2">
          {rust && <Mark name="rust" size={16} label="Rust" />}
          <span className="link font-medium group-hover:decoration-current">{name}</span>
        </span>
        <span className="mt-1 block text-sm text-night-muted">{body}</span>
      </a>
    </li>
  );
}

function PrCard({ fix, i }: { fix: UpstreamFix; i: number }) {
  const meta = github.upstream.find((u) => u.number === fix.number)!;
  const voice = VOICE[fix.number];
  return (
    <article
      data-reveal
      style={{ "--i": i } as React.CSSProperties}
      className="flex min-w-0 flex-col rounded-card bg-night-2 p-8 md:p-10"
    >
      <header className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-inner bg-night-3">
          <Logo name={voice.logo} scale={voice.logo === "tauri" ? 0.86 : 1} />
        </span>
        <span className="min-w-0">
          <span className="block break-words font-medium">
            {meta.repo.split("/")[0]}/<wbr />
            {meta.repo.split("/")[1]}
          </span>
          <span className="block text-sm text-night-muted">{fmtK(meta.stars)} stars</span>
        </span>
        <span className="ml-auto text-sm text-night-muted">#{fix.number}</span>
      </header>

      <h3 className="mt-8 max-w-[24ch] t-title">{voice.headline}</h3>
      <p className="mt-3 text-night-muted">{fix.summary}</p>

      <div className="-mx-8 mt-8 border-y border-night-rule md:-mx-10">
        <p className="truncate border-b border-night-rule px-8 py-3 font-outlier text-xs text-night-muted md:px-10">{fix.file}</p>
        <div
          className="diff-scroll overflow-x-auto"
          data-lenis-prevent
          tabIndex={0}
          role="region"
          aria-label={`Diff excerpt from ${fix.file}, scrollable`}
        >
          <table role="presentation" className="my-2 w-max min-w-full border-collapse font-outlier text-xs leading-6">
            <tbody>
              {fix.diff.map((l, k) =>
                l.t === "~" ? (
                  <tr key={k}>
                    <td colSpan={3} className="px-8 text-night-muted/70 md:px-10">
                      {"…"} {l.text}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={k}
                    className={clsx(
                      l.t === "+" && "bg-night-ink/[0.07] text-night-ink",
                      l.t === "-" && "text-night-muted/70 line-through decoration-night-muted/50",
                      l.t === " " && "text-night-muted"
                    )}
                  >
                    <td className="w-16 select-none pl-8 pr-3 text-right text-night-muted/60 no-underline md:w-[4.5rem] md:pl-10">{l.new ?? l.old ?? ""}</td>
                    <td className="w-5 select-none text-center">{l.t === " " ? "" : l.t === "-" ? "−" : "+"}</td>
                    <td className="whitespace-pre pr-6">{l.text}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8 text-sm">
        <span className="text-night-muted">
          {meta.additions} lines added, {meta.deletions} removed. Merged {fmtDate(meta.mergedAt)}.
        </span>
        <a href={meta.url} target="_blank" rel="noopener noreferrer" className="link font-medium">
          View the pull request
        </a>
      </footer>
    </article>
  );
}
