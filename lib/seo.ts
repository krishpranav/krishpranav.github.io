// Everything search engines and AI systems read about me, built from lib/resume.ts so the
// structured data, the sitemap and llms.txt never drift from what the page says.
// Facts only: nothing here that the page, the résumé or GitHub does not state.

import { capabilities, cities, github, hobbies, identity, labs, languages, principles, repoNotes, roles, upstreamFixes, work } from "@/lib/resume";

// The root URL in the one form Next.js renders for the canonical (no trailing slash),
// used by the canonical, og:url, the sitemap and the structured data alike.
export const SITE = identity.links.site; // https://krishpranav.github.io
export const BUILT = new Date().toISOString();
const abs = (path: string) => new URL(path, `${SITE}/`).href;

export const seoTitle = `${identity.name}, Senior AI/ML Engineer in Singapore`;
export const seoDescription =
  "I’m Krisna Pranav, a senior AI/ML engineer at Turing in Singapore, building agent infrastructure for frontier AI labs. Coding since 6th grade.";

const SAME_AS = [identity.links.github, identity.links.linkedin, identity.links.x];
const KNOWS_ABOUT = [
  "Agentic AI",
  "Agent infrastructure",
  "LLM orchestration",
  "Large language models",
  "Retrieval-augmented generation",
  "Model evaluation",
  "Distributed systems",
  "MLOps",
  "Rust",
  "Go",
  "Python",
  "TypeScript",
  "Open source",
];

// One linked graph: the site, this page as my profile page, and me.
export function structuredData() {
  const person = `${SITE}/#person`;
  const portrait = `${SITE}/#portrait`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: identity.name,
        alternateName: "krishpranav",
        inLanguage: "en",
        publisher: { "@id": person },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/#profile`,
        url: SITE,
        name: seoTitle,
        description: seoDescription,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE}/#website` },
        dateModified: BUILT,
        mainEntity: { "@id": person },
        primaryImageOfPage: { "@id": portrait },
      },
      {
        "@type": "Person",
        "@id": person,
        name: identity.name,
        givenName: identity.first,
        familyName: identity.last,
        alternateName: "krishpranav",
        url: SITE,
        email: `mailto:${identity.links.email}`,
        description: seoDescription,
        image: {
          "@type": "ImageObject",
          "@id": portrait,
          url: abs("/me/illustrated-1200.jpg"),
          width: 1200,
          height: 1607,
          caption: `${identity.name}, illustrated`,
        },
        jobTitle: "Senior AI/ML Engineer",
        worksFor: { "@type": "Organization", name: "Turing", url: "https://www.turing.com" },
        address: { "@type": "PostalAddress", addressLocality: "Singapore", addressCountry: "SG" },
        homeLocation: { "@type": "Place", name: "Singapore" },
        knowsAbout: KNOWS_ABOUT,
        sameAs: SAME_AS,
      },
    ],
  };
}

// ---------------------------------------------------------------- llms.txt
// The llmstxt.org shape: a title, a one-line summary, then sections of links. The summary
// names me, so a model quoting it attributes the facts; the rest is in my own voice.
export function llmsTxt() {
  const fixes = upstreamFixes
    .map((f) => {
      const meta = github.upstream.find((u) => u.number === f.number);
      return `- [${f.repo} #${f.number}](${meta?.url ?? `https://github.com/${f.repo}/pull/${f.number}`}): ${f.summary}`;
    })
    .join("\n");
  const repos = github.repos.map((r) => `- [${r.name}](${r.url}): ${repoNotes[r.name] ?? r.description}`).join("\n");
  return `# ${identity.name}

> ${identity.name} is a senior AI/ML engineer at Turing, based in Singapore, building agent infrastructure and working directly with teams at ${labs.slice(0, -1).join(", ")} and ${labs.at(-1)}. Coding since 6th grade.

I have 8+ years of production systems and 4+ years in AI/ML, across Turing, Crossing Hurdles, a stealth AI startup (as founding engineer), Uber's AI labs and PayPal. My username everywhere is krishpranav.

## Profile

- [Portfolio](${abs("/")}): who I am, the systems I've built, my open source work and every role since 2017
- [Full profile for language models](${abs("/llms-full.txt")}): the same facts as plain Markdown, in full
- [Résumé (PDF)](${abs(identity.links.resume)})

## Elsewhere

- [GitHub](${identity.links.github}): krishpranav
- [LinkedIn](${identity.links.linkedin}): krishpranav
- [X](${identity.links.x}): ${identity.links.xHandle}
- Email: ${identity.links.email}

## Merged upstream

${fixes}

## Own projects

${repos}
`;
}

// ---------------------------------------------------------------- llms-full.txt
export function llmsFullTxt() {
  const roleBlocks = roles
    .map((r) => {
      const when = r.to ? `${r.from} to ${r.to}` : `${r.from}, current`;
      return `### ${r.title}, ${r.company} (${when})

${r.focus}.

${r.bullets.map((b) => `- ${b}`).join("\n")}

Stack: ${r.stack.join(", ")}.`;
    })
    .join("\n\n");
  const workBlocks = work
    .map((w) => {
      const r = roles.find((x) => x.id === w.role)!;
      return `- **${r.company}: ${w.headline}** ${w.figure ? `${w.figure.value} ${w.figure.caption}. ` : ""}${w.body}`;
    })
    .join("\n");
  const fixes = upstreamFixes
    .map((f) => {
      const meta = github.upstream.find((u) => u.number === f.number);
      return `- **${f.repo} #${f.number}** (${meta?.url ?? ""}): ${f.summary}`;
    })
    .join("\n");
  const [cs, fortnite] = hobbies.games;
  const say = (parts: readonly (string | { text: string })[]) => parts.map((p) => (typeof p === "string" ? p : p.text)).join("");
  return `# ${identity.name}

Senior AI/ML engineer at Turing, based in Singapore. Coding since 6th grade.

Website: ${abs("/")}
Email: ${identity.links.email}
GitHub: ${identity.links.github}
LinkedIn: ${identity.links.linkedin}
X: ${identity.links.x}
Résumé: ${abs(identity.links.resume)}

## Summary

I'm ${identity.name} (krishpranav), a software engineer with 8+ years of production systems and 4+ years in AI/ML. At Turing I build agent infrastructure: agentic workflows and LLM orchestration on Anthropic models, with durable state, so long-running agents resume after a failure instead of starting over. There I work directly with teams at ${labs.slice(0, -1).join(", ")} and ${labs.at(-1)}. Before Turing I was forward deployed at Crossing Hurdles, the first engineer at a VC-backed AI startup, worked in Uber's AI labs on work used to train frontier AI models, and moved PayPal services handling 15 to 20 million requests a day from C++ to Go with no downtime.

I'm based in Singapore, where I work, and I travel often to Bengaluru, India. I've also been to San Francisco.

## Selected work

${workBlocks}

## Experience

${roleBlocks}

## Open source

Fixes merged upstream:

${fixes}

Own projects:

${github.repos.map((r) => `- [${r.name}](${r.url}): ${repoNotes[r.name] ?? r.description} (${r.stars} stars)`).join("\n")}
- rust-ui/ui: ${github.rustUiMergedPRs} merged PRs, Rust ports of UI components plus fixes.

In the last year: ${github.contributions.total.toLocaleString("en-US")} contributions on GitHub, across ${github.publicRepos} public repositories.

## How I work

${principles.statement}

${principles.essay.join(" ")}

${principles.tenets.map((t) => `- ${t.title}: ${t.body}`).join("\n")}

## Skills

Languages: ${languages.map((l) => l.name).join(", ")}.

${capabilities.map((c) => `- ${c.title}: ${c.tools.map((t) => t.name).join(", ")}.`).join("\n")}

## Off the clock

- ${cs.hours.toLocaleString("en-US")} hours in ${cs.name}, and ${fortnite.hours.toLocaleString("en-US")} hours in ${fortnite.name}.
- ${say(hobbies.racing)}
- ${say(hobbies.trading)}

## Cities

${cities.map((c) => `- ${c.name}: ${c.note}.`).join("\n")}

Last updated: ${BUILT.slice(0, 10)}.
`;
}
