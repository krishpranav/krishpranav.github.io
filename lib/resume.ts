// Single source of truth. Every value is traceable to the latest résumé
// (public/Krisna_Pranav_Resume.pdf) or GitHub (lib/github.generated.json).
// Do not invent metrics, employers, or projects.

import github from "./github.generated.json";

export type Source = "resume" | "github";

export const identity = {
  name: "Krisna Pranav",
  first: "Krisna",
  last: "Pranav",
  title: "Senior Software Engineer, AI/ML",
  short: "Senior AI/ML engineer",
  location: "Singapore",
  locationShort: "Singapore",
  timeZone: "Asia/Singapore",
  utc: "UTC+08:00",
  headline: "I’m Krisna Pranav, a senior AI/ML engineer at Turing, based in Singapore.",
  statement: "I’ve been coding since 6th grade.",
  links: {
    email: "krisna.pranav@gmail.com",
    github: "https://github.com/krishpranav",
    githubHandle: "github.com/krishpranav",
    linkedin: "https://linkedin.com/in/krishpranav",
    linkedinHandle: "linkedin.com/in/krishpranav",
    x: "https://x.com/krishpranav5",
    xHandle: "@krishpranav5",
    resume: "/Krisna_Pranav_Resume.pdf",
    source: "https://github.com/krishpranav/krishpranav.github.io",
    site: "https://krishpranav.github.io",
  },
};

export type Metric = { value: string; suffix?: string; label: string; source: Source };

const upstreamStars = github.upstream.reduce((sum, u) => sum + u.stars, 0);

export const proof: Metric[] = [
  { value: "8", suffix: "+", label: "Years shipping production systems", source: "resume" },
  { value: "4", suffix: "+", label: "Years in AI/ML", source: "resume" },
  { value: "15 to 20", suffix: "M", label: "Requests a day migrated, zero downtime", source: "resume" },
  {
    value: String(Math.floor(upstreamStars / 1000)),
    suffix: "K",
    label: "Stars on the upstream repos I've patched",
    source: "github",
  },
];

export type CaseId = "notetaker" | "turing" | "gateway" | "paypal" | "uber";

// Official marks in public/logos, drawn monochrome. `h` is the optical height in px at
// which each sits level with the others: wide wordmarks shorter, stacked marks taller.
export type LogoKey = "turing" | "uber" | "paypal" | "crossing-hurdles" | "tauri" | "playwright" | "csgo";
export const logos: Record<LogoKey, { name: string; src: string; ratio: number; h: number }> = {
  turing: { name: "Turing", src: "/logos/turing.svg", ratio: 796 / 125, h: 26 },
  uber: { name: "Uber", src: "/logos/uber.svg", ratio: 24 / 8.06, h: 34 },
  paypal: { name: "PayPal", src: "/logos/paypal.svg", ratio: 1310 / 439.6, h: 34 },
  "crossing-hurdles": { name: "Crossing Hurdles", src: "/logos/crossing-hurdles.png", ratio: 660 / 662, h: 56 },
  tauri: { name: "Tauri", src: "/logos/tauri.svg", ratio: 21.32 / 24, h: 28 },
  playwright: { name: "Playwright", src: "/logos/playwright-mark.svg", ratio: 256 / 192, h: 22 },
  csgo: { name: "Counter-Strike: Global Offensive", src: "/logos/csgo.svg", ratio: 6400 / 680, h: 26 },
};

export type Role = {
  id: string;
  company: string;
  title: string;
  from: string;
  to?: string;
  current?: boolean;
  focus: string;
  bullets: string[];
  stack: string[];
  caseId?: CaseId;
  logo?: LogoKey;
};

// Reverse-chronological, exactly as the latest résumé lists them.
export const roles: Role[] = [
  {
    id: "turing",
    company: "Turing",
    title: "AI/ML Engineer",
    from: "Now",
    current: true,
    focus: "Agentic AI systems, LLM orchestration, production AI infrastructure",
    bullets: [
      "Agentic workflows and LLM orchestration on Anthropic models: multi-step reasoning, tool calling, and durable state that lets long-running agents resume after a failure instead of starting over.",
      "The gRPC/REST layer that routes requests to agents, runs tasks concurrently, and defines the data contracts between services, so new workflows plug in without changes to the core.",
      "Latency-sensitive infrastructure in Rust (async/Tokio) and C++, bridged to Python through PyO3/FFI for model integration and inference serving.",
      "Rubric-based evaluation of model outputs, plus inference tuning, observability, and deployment for frontier-model work delivered to Anthropic, OpenAI, Google, and Meta.",
    ],
    stack: ["Rust", "C++", "Python", "gRPC", "Anthropic"],
    caseId: "turing",
    logo: "turing",
  },
  {
    id: "crossing-hurdles",
    company: "Crossing Hurdles",
    title: "AI/ML Engineer",
    from: "Mar 2026",
    to: "Sep 2026",
    focus: "Forward deployed on production AI for Handshake, Otter, and Snorkel",
    bullets: [
      "Worked inside client engineering teams and closed every scoped task on their real-time inference and orchestration paths, in Python, Rust, C++, and TypeScript.",
      "A streaming inference gateway that fans out concurrent LLM calls and streams tokens back over WebSockets/SSE, keeping time-to-first-token low under concurrent load.",
      "An in-memory embedding cache and incremental re-indexing, so retrieval stayed fast as traffic grew and content updates no longer triggered a full re-index.",
    ],
    stack: ["Python", "Rust", "C++", "TypeScript", "SSE"],
    caseId: "gateway",
    logo: "crossing-hurdles",
  },
  {
    id: "stealth",
    company: "Stealth AI notetaker",
    title: "Founding Engineer (#1)",
    from: "Jan 2025",
    to: "Jul 2026",
    focus: "VC-backed, privacy-first AI meeting assistant, built from zero to one",
    bullets: [
      "Made the architecture calls and shipped the product from the meeting bot to the user-facing app: Python/FastAPI services on PostgreSQL, Dockerized and deployed on AWS.",
      "A bot that joins Zoom, Microsoft Teams, Google Meet, and phone (PSTN) calls on a shared SDK layer. Supporting a new platform meant writing one adapter, not another bot.",
      "Live transcription streams into LangGraph agents that produce structured summaries, action items, and decisions, with sensitive meeting data kept under the user's control.",
      "RAG over each user's meeting history, with Langfuse tracing on every LLM call so latency, token cost, and bad outputs trace to a specific prompt and step.",
      "CI/CD, the automated test suite, and code-review conventions; mentored the engineers who joined next and worked directly with early users.",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "LangGraph", "AWS"],
    caseId: "notetaker",
  },
  {
    id: "uber",
    company: "Uber",
    title: "AI/ML Engineer",
    from: "Mar 2024",
    to: "Aug 2026",
    focus: "AI labs: work used to train frontier AI models",
    bullets: [
      "Worked in Uber's AI labs, on work used to train frontier AI models.",
      "Built and integrated model-driven services that make real-time decisions on high-traffic surfaces, working to tight latency budgets and reliability targets.",
      "Data and inference pipelines behind ML features, and the Go/Python backends that serve predictions, alongside data science, infrastructure, and product teams.",
    ],
    stack: ["Go", "Python"],
    caseId: "uber",
    logo: "uber",
  },
  {
    id: "legal-rag",
    company: "Legal RAG platform",
    title: "AI/ML Engineer (Contract)",
    from: "Jun 2021",
    to: "Jan 2022",
    focus: "Retrieval-augmented legal and compliance information system",
    bullets: [
      "A production RAG system answering procedural, compliance, and legal questions from a curated knowledge base. Every answer cites its source passage, so reviewers can check it.",
      "The ingestion pipeline: PDF parsing, semantic chunking, metadata tagging (source, jurisdiction, document type), and embedding upsert into a hybrid vector + keyword store with reranking. Scanned pages go through vision-LLM extraction.",
      "A scheduled monitoring agent that watches designated sources, detects new rulings, and re-indexes the live knowledge base, which ended manual upkeep of the corpus.",
    ],
    stack: ["Python", "RAG", "Hybrid search", "Vision-LLM"],
  },
  {
    id: "aether",
    company: "Aether, AI desktop agent",
    title: "Senior Rust Engineer (Contract)",
    from: "Sep 2020",
    to: "May 2021",
    focus: "On-device retrieval and vector search",
    bullets: [
      "A privacy-first desktop assistant in Rust: a local semantic engine indexes files, embeds them on-device, and answers context-aware queries with low latency.",
      "The on-device HNSW vector index, for strong recall on large corpora without a GPU; owned packaging and release of the macOS/Linux binaries.",
    ],
    stack: ["Rust", "HNSW", "Tauri"],
  },
  {
    id: "paypal",
    company: "PayPal",
    title: "Senior Software Engineer (External Contract)",
    from: "Aug 2019",
    to: "Jul 2020",
    focus: "High-throughput backend migration from C++ to Go",
    bullets: [
      "Migrated critical C++ services to Go on a tier handling 15 to 20 million requests/day, matching the legacy system's p99 latency while simplifying deploys.",
      "Transaction-processing concurrency on goroutines with bounded channels for backpressure; ran the cutover with zero downtime by shifting traffic over gradually.",
    ],
    stack: ["Go", "C++"],
    caseId: "paypal",
    logo: "paypal",
  },
  {
    id: "earlier",
    company: "Earlier roles",
    title: "Contracts",
    from: "2017",
    to: "2019",
    focus: "Trading infrastructure, full-stack web, mobile and blockchain",
    bullets: [
      "A low-latency on-chain trading platform (Rust, Next.js/TypeScript).",
      "Full-stack web (Next.js, React, Node.js, Python).",
      "Production mobile and blockchain apps (Flutter, React Native, Solidity).",
    ],
    stack: ["Rust", "TypeScript", "Flutter", "Solidity"],
  },
];

export const roleById = (id: string) => roles.find((r) => r.id === id)!;

export type Work = {
  id: CaseId;
  role: string; // roles[].id, for the title and dates
  logo?: LogoKey;
  figure?: { value: string; caption: string };
  headline: string;
  body: string;
  stack: string[];
  labs?: boolean; // the Turing tile names the labs it works with
  platforms?: { mark: string; name: string }[];
};

// The things I've built, in my own words. Every claim is a résumé line.
export const work: Work[] = [
  {
    id: "turing",
    role: "turing",
    logo: "turing",
    headline: "I build agents that pick up where they failed.",
    labs: true,
    body: "Agentic workflows on Anthropic models, with durable state, so a long-running agent resumes after a failure instead of starting over. Underneath sit a gRPC routing layer and hot paths in Rust and C++, bridged to Python.",
    stack: ["Rust", "C++", "Python", "gRPC", "PyO3"],
  },
  {
    id: "notetaker",
    role: "stealth",
    headline: "I was the first engineer, from the first commit.",
    platforms: [
      { mark: "zoom", name: "Zoom" },
      { mark: "teams", name: "Teams" },
      { mark: "googlemeet", name: "Meet" },
      { mark: "phone", name: "Phone" },
    ],
    body: "A VC-backed, privacy-first AI meeting assistant. One bot joins every call, and LangGraph agents turn live transcripts into summaries, action items and decisions.",
    stack: ["Python", "FastAPI", "PostgreSQL", "LangGraph", "AWS"],
  },
  {
    id: "paypal",
    role: "paypal",
    logo: "paypal",
    figure: { value: "15 to 20M", caption: "requests a day, moved from C++ to Go" },
    headline: "Nothing went down.",
    body: "Goroutines with bounded channels for backpressure, and a cutover that shifted traffic over in stages, with p99 latency on par with the legacy system.",
    stack: ["Go", "C++"],
  },
  {
    id: "uber",
    role: "uber",
    logo: "uber",
    headline: "My work at Uber’s AI labs helped train frontier models.",
    body: "Alongside it, model-driven services that make real-time decisions on high-traffic surfaces, held to tight latency budgets, and the Go and Python backends that serve them.",
    stack: ["Go", "Python"],
  },
  {
    id: "gateway",
    role: "crossing-hurdles",
    logo: "crossing-hurdles",
    headline: "I kept first tokens fast, under real load.",
    body: "Forward deployed inside the teams at Handshake, Otter and Snorkel: a streaming gateway over WebSockets and SSE, and an embedding cache that ended full re-indexes.",
    stack: ["Python", "Rust", "TypeScript", "SSE"],
  },
];

// The story, a line at a time. Each line is a résumé fact, told by me; a company is
// set as its own mark where it is named.
export type StoryPart = string | { logo: LogoKey } | { lab: string };
export const story: StoryPart[][] = [
  ["That first program grew into trading platforms, mobile apps and a desktop agent in Rust."],
  ["Then came backends at ", { logo: "paypal" }, ", and AI labs work at ", { logo: "uber" }, " that went into training frontier models."],
  ["Today, at ", { logo: "turing" }, ", I work directly with teams at ", { lab: "Anthropic" }, ", ", { lab: "OpenAI" }, ", ", { lab: "Google" }, " and ", { lab: "Meta" }, "."],
];

// The frontier labs whose teams I work with directly at Turing (the owner, 2026-10-27;
// the résumé: "frontier-model work delivered to Anthropic, OpenAI, Google, and Meta").
export const labs = ["Anthropic", "OpenAI", "Google", "Meta"];

// Cities I've been to, as pixel panoramas in one golden-hour palette. San Francisco is the
// owner's own image; Singapore and Bengaluru are painted to match it by scripts/cities.mjs.
// Singapore is the owner's main place, where they work; they travel to Bengaluru often
// (2026-10-27).
export const cities = [
  {
    id: "singapore",
    name: "Singapore",
    note: "Where I’m based and work",
    src: "/cities/singapore.png",
    focus: "33%", // where a phone's crop holds: Marina Bay Sands
    alt: "Marina Bay in Singapore as pixel art: Marina Bay Sands and its SkyPark, the ArtScience Museum, the skyline and the Supertrees, framed by palms and bougainvillea, under a golden-hour sky.",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    note: "Where I travel often",
    src: "/cities/bengaluru.png",
    focus: "50%", // Vidhana Soudha
    alt: "Bengaluru as pixel art: Vidhana Soudha under its dome and flag, pink and golden trumpet trees in bloom and an auto-rickshaw on the road, under a golden-hour sky.",
  },
  {
    id: "sf",
    name: "San Francisco",
    note: "California",
    src: "/cool-bg.jpg",
    focus: "27%", // the near tower of the bridge
    alt: "The Golden Gate Bridge as pixel art, seen from the headlands over the bay, with sailboats, wildflowers and pink clouds.",
  },
];

// Off the clock, in the owner's own words (2026-10-27). The hours are theirs.
export const hobbies = {
  games: [
    { name: "CS:GO", hours: 5000 },
    { name: "Fortnite", hours: 1250 },
  ],
  // Each line in parts, so the words that have a mark can carry it.
  racing: ["I’m a professional ", { mark: "wheel", text: "sim racer" }, "."],
  trading: ["I trade ", { mark: "bitcoin", text: "crypto" }, ", ", { mark: "dogecoin", text: "meme coins" }, " and ", { mark: "chart", text: "the stock market" }, "."],
};

export type Tool = { name: string; icon?: string };

export const capabilities: { title: string; body: string; tools: Tool[] }[] = [
  {
    title: "AI and agents",
    body: "Multi-agent orchestration, tool calling, and retrieval that cites its sources.",
    tools: [
      { name: "LangGraph", icon: "langgraph" },
      { name: "LangChain", icon: "langchain" },
      { name: "Claude / Anthropic", icon: "anthropic" },
      { name: "OpenAI", icon: "openai" },
      { name: "RAG with hybrid reranking" },
      { name: "FAISS / HNSW" },
    ],
  },
  {
    title: "Distributed systems",
    body: "Services that stay fast under concurrency, and migrations that don't go down.",
    tools: [
      { name: "Concurrency and backpressure" },
      { name: "asyncio / Tokio", icon: "rust" },
      { name: "WebSockets / SSE" },
      { name: "Zero-downtime migrations" },
      { name: "Latency profiling" },
    ],
  },
  {
    title: "Cloud and MLOps",
    body: "Containerized deploys, CI/CD, evals, and tracing on every LLM call.",
    tools: [
      { name: "AWS", icon: "aws" },
      { name: "Azure (AKS / ACI)", icon: "azure" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Langfuse evals", icon: "langfuse" },
    ],
  },
  {
    title: "Backend and data",
    body: "API design, schemas and indexes for read-heavy access patterns.",
    tools: [
      { name: "FastAPI", icon: "fastapi" },
      { name: "gRPC", icon: "grpc" },
      { name: "REST" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Redis", icon: "redis" },
      { name: "Neo4j", icon: "neo4j" },
    ],
  },
];

// Order as the latest résumé lists them.
// GitHub's descriptions, set in sentence case for the page. The generated file keeps the raw text.
export const repoNotes: Record<string, string> = {
  vesper: "A username OSINT tool, in Rust.",
  socialosint: "Finds a target’s emails published on Instagram, LinkedIn and Twitter, and checks them against PwnDB for leaked credentials. In Rust.",
  nexa: "A cross-platform UI framework from one codebase, with reactive signals, streaming SSR and GPU rendering.",
};

export const languages: Tool[] = [
  { name: "Python", icon: "python" },
  { name: "Go", icon: "go" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Rust", icon: "rust" },
  { name: "C / C++", icon: "cplusplus" },
  { name: "SQL", icon: "postgresql" },
];

export type DiffLine = { t: " " | "+" | "-" | "~"; old?: number; new?: number; text: string };

export type UpstreamFix = {
  repo: string;
  number: number;
  title: string;
  summary: string;
  file: string;
  diff: DiffLine[];
};

// Diff excerpts are verbatim from `gh pr diff`; "~" marks elided lines.
export const upstreamFixes: UpstreamFix[] = [
  {
    repo: "tauri-apps/tauri",
    number: 15224,
    title: "Stop leaking ObjC retains in with_webview",
    summary:
      "Scoped Retained::as_ptr() bindings replace Retained::into_raw(), so WebContent processes are freed on macOS and iOS. RSS held flat over a 3-minute stress loop.",
    file: "crates/tauri-runtime-wry/src/lib.rs",
    diff: [
      { t: " ", old: 3905, new: 3905, text: "use wry::WebViewExtMacOS;" },
      { t: "+", new: 3906, text: "let platform_webview = webview.webview();" },
      { t: " ", old: 3906, new: 3909, text: "f(Webview {" },
      { t: "-", old: 3907, text: "  webview: Retained::into_raw(webview.webview()) as *mut objc2::runtime::AnyObject" },
      { t: "-", old: 3908, text: "    as *mut std::ffi::c_void," },
      { t: "+", new: 3910, text: "  webview: Retained::as_ptr(&platform_webview).cast_mut() as *mut std::ffi::c_void," },
      { t: "~", text: "manager and ns_window: same change" },
      { t: " ", old: 3913, new: 3913, text: "});" },
    ],
  },
  {
    repo: "microsoft/playwright",
    number: 41986,
    title: "Refuse WebUI navigations that crash the browser",
    summary:
      "Opening chrome://extensions from a non-persistent CDP context segfaulted Chromium. A per-browser blocklist turns the crash into an actionable error, with 7,800+ tests passing.",
    file: "packages/playwright-core/src/server/chromium/crPage.ts",
    diff: [
      { t: "+", new: 55, text: "const kCrashingWebUIHosts = {" },
      { t: "+", new: 56, text: "  chromium: new Set(['apps', 'extensions', 'help', 'history', 'password-manager', 'settings'])," },
      { t: "+", new: 57, text: "  edge: new Set(['history'])," },
      { t: "+", new: 58, text: "};" },
      { t: "~", text: "webUIHost() canonicalizes chrome:// and edge:// urls" },
      { t: " ", old: 154, new: 170, text: "async navigateFrame(frame: frames.Frame, url: string, referrer: string | undefined) {" },
      { t: "+", new: 171, text: "  this._assertNavigationDoesNotCrashBrowser(url);" },
      { t: " ", old: 155, new: 172, text: "  return this._sessionForFrame(frame)._navigate(frame, url, referrer);" },
    ],
  },
];

export const principles = {
  statement: "Tests, evals and tracing are part of the feature.",
  essay: [
    "A three-line LLM script can look great in a 30-second demo. The engineering starts when it meets real traffic: rate limits, slow tools, outputs that change between runs, thousands of concurrent users.",
    "I build for that part, and I write code other engineers can build on.",
  ],
  tenets: [
    {
      title: "Build the platform side",
      body: "Distributed backends, APIs, and cloud-native services under the model, not just prompts on top.",
    },
    {
      title: "Trace everything",
      body: "Every LLM call traced, so a bad output points to a specific prompt and step.",
    },
    {
      title: "Design for the next engineer",
      body: "Adapters and data contracts, so new work plugs in without touching the core.",
    },
  ],
};

export { github };
