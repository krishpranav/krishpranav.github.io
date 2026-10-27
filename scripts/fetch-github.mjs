// Refreshes lib/github.generated.json from the GitHub GraphQL API.
// Runs in CI before `next build`; locally: GITHUB_TOKEN=$(gh auth token) npm run github
// Any failure keeps the committed snapshot so the build never breaks on the API.

import { readFile, writeFile } from "node:fs/promises";

const OUT = new URL("../lib/github.generated.json", import.meta.url);
const LOGIN = "krishpranav";
const OWN_REPOS = ["vesper", "socialosint", "nexa"];
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const query = `
query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionLevel } }
      }
    }
    ${OWN_REPOS.map(
      (r, i) => `r${i}: repository(name: "${r}") { name description stargazerCount url primaryLanguage { name } }`
    ).join("\n    ")}
  }
  tauri: repository(owner: "tauri-apps", name: "tauri") {
    nameWithOwner stargazerCount
    pullRequest(number: 15224) { number title additions deletions mergedAt url }
  }
  playwright: repository(owner: "microsoft", name: "playwright") {
    nameWithOwner stargazerCount
    pullRequest(number: 41986) { number title additions deletions mergedAt url }
  }
  rustui: search(query: "repo:rust-ui/ui author:krishpranav is:pr is:merged", type: ISSUE, first: 1) { issueCount }
}`;

async function main() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    console.warn("[github] no token; keeping committed snapshot");
    return;
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors ?? res.status));

  const { user, tauri, playwright, rustui } = json.data;
  const cal = user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w) => w.contributionDays);

  const data = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    login: LOGIN,
    followers: user.followers.totalCount,
    publicRepos: user.repositories.totalCount,
    contributions: {
      total: cal.totalContributions,
      start: days[0].date,
      // One digit (0–4) per day, Sunday-first weeks, oldest first.
      levels: days.map((d) => LEVEL[d.contributionLevel] ?? 0).join(""),
    },
    repos: OWN_REPOS.map((_, i) => user[`r${i}`])
      .filter(Boolean)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazerCount,
        language: r.primaryLanguage?.name ?? null,
        url: r.url,
      })),
    upstream: [tauri, playwright].map((r) => ({
      repo: r.nameWithOwner,
      stars: r.stargazerCount,
      ...r.pullRequest,
      mergedAt: r.pullRequest.mergedAt.slice(0, 10),
    })),
    rustUiMergedPRs: rustui.issueCount,
  };

  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(
    `[github] ${data.contributions.total} contributions · ${data.publicRepos} repos · ` +
      data.upstream.map((u) => `${u.repo} ★${u.stars}`).join(" · ")
  );
}

main().catch(async (err) => {
  console.warn(`[github] fetch failed, keeping snapshot: ${err.message}`);
  // Fail loudly only when there is no snapshot to fall back on.
  await readFile(OUT).catch(() => process.exit(1));
});
