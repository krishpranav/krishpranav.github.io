// Single source of truth. Every value here is traceable to the resume PDF.
// Do not invent metrics, employers, or projects.

export const identity = {
  name: "Krisna Pranav",
  role: "Software Engineer",
  focus: "AI/ML & Agentic Systems",
  location: "Coimbatore, India",
  languages: ["Rust", "Go", "C/C++", "Python", "TypeScript"],
  tagline: "I build the systems that make AI agents actually work.",
  summary:
    "Coding since 8th grade. 5+ years professional, 3+ focused on AI/ML — agentic systems, LLM orchestration, ML models & inference (embeddings, ONNX, quantization, YOLO vision), and retrieval-augmented generation — plus the high-performance infra beneath them, in Rust, C++, and Go.",
  links: {
    email: "krisna.pranav@gmail.com",
    github: "https://github.com/krishpranav",
    githubHandle: "github.com/krishpranav",
    linkedin: "https://linkedin.com/in/krishpranav",
    linkedinHandle: "linkedin.com/in/krishpranav",
    resume: "/Krisna_Pranav_Resume.pdf",
  },
};

// ML depth — straight from the resume's Technical Skills section.
export const mlSkills = [
  "embeddings & vector indexing (HNSW, IVF)",
  "ONNX runtime · on-device inference",
  "model quantization",
  "GPU/CPU pipelining",
  "inference optimization",
  "YOLO object detection",
  "vision-LLM extraction",
  "prompt & tool-use evaluation",
  "model deployment & serving",
  "observability & tracing for LLM workflows",
];

export type Stat = {
  value: string;
  label: string;
  note?: string;
  ember?: boolean;
};

// Only real figures pulled from the resume.
export const stats: Stat[] = [
  { value: "0.95+", label: "recall@10", note: "on ~100K-document corpora (HNSW)" },
  { value: "<100ms", label: "context-aware query", note: "on-device semantic answers" },
  { value: "<50ms", label: "p99 vector search", note: "on live traffic" },
  { value: "<300ms", label: "time-to-first-token", note: "streaming gateway under load" },
  { value: "15–20M", label: "requests / day", note: "PayPal tier migrated, p99 held" },
  { value: "20–25M+", label: "monthly volume", note: "on-chain trading, USD" },
  { value: "~40%", label: "p95 latency cut", note: "query + N+1 + Redis hot reads" },
  { value: "<50MB", label: "idle memory", note: "Aether desktop agent" },
];

export type Project = {
  id: string;
  name: string;
  kind: string;
  lang: string;
  ember?: boolean;
  summary: string;
  points: string[];
  metrics: { k: string; v: string }[];
};

export const projects: Project[] = [
  {
    id: "aether",
    name: "Aether",
    kind: "AI Desktop Agent · on-device retrieval",
    lang: "Rust",
    ember: true,
    summary:
      "A privacy-first AI desktop assistant. A local semantic engine indexes files, generates embeddings on-device, and answers context-aware queries in under 100ms — no GPU required.",
    points: [
      "On-device vector store with HNSW retrieval; tuned graph params (M, ef_construction) to reach recall@10 above 0.95 on ~100K-document corpora.",
      "Owned the full stack: indexer, embedding pipeline, vector store, file watcher, IPC layer, and the Tauri UI.",
      "Shipped macOS and Linux binaries that idle under 50MB.",
    ],
    metrics: [
      { k: "recall@10", v: "0.95+" },
      { k: "query", v: "<100ms" },
      { k: "idle mem", v: "<50MB" },
    ],
  },
  {
    id: "legal-rag",
    name: "Legal RAG Platform",
    kind: "Retrieval-augmented legal information system",
    lang: "Python · TS",
    summary:
      "A production RAG system answering procedural, compliance, and legal questions grounded in a curated base of statutes, notifications, circulars, and judgments — every answer returns verifiable source citations.",
    points: [
      "Ingestion end-to-end: PDF parsing → semantic chunking → metadata tagging (section, clause, date, jurisdiction) → hybrid vector + keyword store with reranking.",
      "Multimodal document understanding: forwarded notices and scanned pages parsed via vision-LLM extraction, fed into the same RAG + citation pipeline.",
      "Automated knowledge-base monitoring agent scrapes designated sources on a schedule, detects new orders, and re-indexes without manual intervention.",
    ],
    metrics: [
      { k: "answers", v: "cited" },
      { k: "store", v: "hybrid" },
      { k: "ingest", v: "vision-LLM" },
    ],
  },
];

export type Scene = {
  id: string;
  name: string;
  tag: string;
  line: string;
  detail: string;
};

// Smaller cinematic beats inside the projects section.
export const subScenes: Scene[] = [
  {
    id: "blockstars",
    name: "BlockStars",
    tag: "video → reasoning",
    line: "Video-based LLM parser",
    detail:
      "Live video streams feed YOLO for object detection; structured detections pass to an LLM that reasons about the scene. Written in C++, Rust, and Python — optimized for low-latency frame processing, stream to LLM output.",
  },
  {
    id: "trading",
    name: "Trading Platform",
    tag: "live order book",
    line: "High-throughput on-chain trading",
    detail:
      "Real-time price feeds, sub-second swap execution in Rust, wallet/whale tracking, and live charting. Trade paths optimized for minimal slippage during high network congestion. Next.js/TypeScript order books.",
  },
  {
    id: "paypal",
    name: "PayPal",
    tag: "zero-downtime cutover",
    line: "C++ → Go backend migration",
    detail:
      "Migrated critical services on a tier handling 15–20M requests/day, keeping p99 on par with the legacy system. Goroutines and bounded channels for backpressure; cutover with zero downtime via gradual traffic shifting.",
  },
  {
    id: "crossing-hurdles",
    name: "Crossing Hurdles",
    tag: "token streaming",
    line: "Streaming inference gateway",
    detail:
      "Fans out concurrent LLM calls and streams tokens back over WebSockets/SSE, cutting time-to-first-token under 300ms. In-memory embedding cache + incremental re-indexing keep vector search under 50ms p99. Hardened in Rust with backpressure, request batching, and timeout/retry.",
  },
];

export const workflow = [
  { k: "Idea", d: "the problem, owned end-to-end" },
  { k: "Model / Algorithm", d: "the right retrieval, the right model" },
  { k: "Systems impl", d: "Rust · C++ · Go", ember: true },
  { k: "ML boundary", d: "Python · TypeScript integration" },
  { k: "Production hardening", d: "observability · backpressure · retries" },
  { k: "Shipped", d: "in production, under load" },
];

export type Tool = { name: string; why: string };

export const stack: Tool[] = [
  { name: "Rust", why: "tokio async, lock-free concurrency, zero-copy" },
  { name: "Go", why: "goroutines + bounded channels for backpressure" },
  { name: "C / C++", why: "performance-critical, low-latency frame paths" },
  { name: "Python", why: "the ML boundary — model integration" },
  { name: "TypeScript", why: "product surface, real-time trading UIs" },
  { name: "PostgreSQL", why: "system of record, hybrid stores" },
  { name: "Redis", why: "hot-read cache, embedding cache" },
  { name: "Docker", why: "reproducible builds & serving" },
  { name: "Kubernetes", why: "orchestration for AI workloads" },
  { name: "AWS", why: "distributed systems infra" },
  { name: "gRPC / GraphQL", why: "service + product APIs" },
  { name: "Anthropic / OpenAI", why: "LLM orchestration & tool-use" },
  { name: "ONNX", why: "runtime for on-device inference" },
];

export type Role = {
  company: string;
  title: string;
  when: string;
  context: string;
  line: string;
  current?: boolean;
};

// Reverse-chronological, real roles only.
export const timeline: Role[] = [
  {
    company: "Turing",
    title: "AI/ML Engineer",
    when: "Present",
    context: "Remote · AI/ML & agentic systems for clients incl. Anthropic and OpenAI",
    line: "Building agentic AI/ML systems for frontier labs — LLM orchestration, tool-use & function calling, and multi-step reasoning pipelines, plus inference optimization and the MLOps to ship them. Perf-critical infra in Rust/C++, Python at the ML boundary.",
    current: true,
  },
  {
    company: "Crossing Hurdles",
    title: "AI/ML Engineer",
    when: "Present",
    context: "Remote · production AI for clients incl. Auth0 and Handshake AI",
    line: "Streaming inference gateway with concurrent LLM fan-out; TTFT under 300ms, vector search under 50ms p99, hardened in Rust with backpressure.",
    current: true,
  },
  {
    company: "Legal RAG Platform",
    title: "AI/ML Engineer (Contract)",
    when: "Apr–Jun",
    context: "Remote · retrieval-augmented legal information system",
    line: "PDF → semantic chunking → hybrid vector+keyword store → reranking → cited answers, with vision-LLM ingestion and an autonomous re-indexing agent.",
  },
  {
    company: "BlockStars",
    title: "AI Engineer",
    when: "Apr–Jul",
    context: "Freelance / Remote · computer-vision + LLM reasoning",
    line: "Video-based LLM parser: live video → YOLO detection → structured detections → LLM scene reasoning, in C++/Rust/Python.",
  },
  {
    company: "Aether",
    title: "Senior Rust Engineer",
    when: "Oct–Dec",
    context: "Contract · on-device retrieval & vector search",
    line: "Privacy-first AI desktop agent: local semantic engine, on-device embeddings, HNSW retrieval, macOS/Linux binaries idling under 50MB.",
  },
  {
    company: "PayPal",
    title: "Senior Software Engineer (External Contract)",
    when: "Dec–May",
    context: "High-throughput backend migration",
    line: "Migrated C++ services to Go on a 15–20M req/day tier, p99 held, zero-downtime cutover via gradual traffic shifting.",
  },
  {
    company: "Trading Platform",
    title: "Software Engineer (Confidential)",
    when: "Mar–Oct",
    context: "On-chain trading infrastructure",
    line: "20–25M+ monthly volume: real-time feeds, sub-second Rust swap execution, wallet/whale tracking, Next.js order books.",
  },
  {
    company: "PrivateFirm",
    title: "Senior Full-Stack Engineer",
    when: "Feb–Sep",
    context: "Full-stack web across multiple product surfaces",
    line: "Next.js/React/Go/Python/Node. Cut p95 API latency ~40% via query restructuring, N+1 elimination, and Redis hot-read cache.",
  },
  {
    company: "Earlier",
    title: "~4 years · ~10 contracts",
    when: "Earlier",
    context: "Mobile · full-stack web · blockchain",
    line: "Production mobile (Flutter, React Native), full-stack web (Next.js, React, Node.js), and blockchain systems (Solidity, Solana/Anchor).",
  },
];

export const openSource = {
  project: "Tauri",
  repo: "github.com/tauri-apps/tauri",
  pr: "PR #15224",
  role: "Core contributor — Rust framework for cross-platform desktop apps",
  headline: "A memory leak, fixed at the ObjC boundary.",
  steps: [
    { k: "the leak", v: "tauri-runtime-wry — WithWebview leaked Objective-C retains on macOS/iOS" },
    { k: "the fix", v: "replaced Retained::into_raw() with scoped Retained via Retained::as_ptr()" },
    { k: "why", v: "keeps ObjC retain/release balanced — WebContent processes no longer kept alive for the whole app lifetime" },
    { k: "the proof", v: "RSS stabilized 116.5 → 116.9 MB over a 3-min stress loop" },
    { k: "shipped", v: "PR #15224, merged upstream" },
  ],
};
