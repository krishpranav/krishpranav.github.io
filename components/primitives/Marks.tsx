import { ChartLineUp, MicrosoftTeamsLogo, OpenAiLogo, Phone, SteeringWheel } from "@phosphor-icons/react/ssr";
import clsx from "clsx";
import {
  siAnthropic,
  siBitcoin,
  siCplusplus,
  siDocker,
  siDogecoin,
  siFastapi,
  siFlutter,
  siFortnite,
  siGithub,
  siGithubactions,
  siGo,
  siGoogle,
  siGooglemeet,
  siKubernetes,
  siLangchain,
  siLanggraph,
  siMeta,
  siNeo4j,
  siNextdotjs,
  siPostgresql,
  siPython,
  siRedis,
  siRust,
  siSolidity,
  siTauri,
  siTypescript,
  siZoom,
} from "simple-icons";

// Brand marks, all official paths from simple-icons, drawn in the current colour.
const BRANDS = {
  anthropic: siAnthropic,
  bitcoin: siBitcoin,
  cplusplus: siCplusplus,
  docker: siDocker,
  dogecoin: siDogecoin,
  fastapi: siFastapi,
  flutter: siFlutter,
  fortnite: siFortnite,
  github: siGithub,
  githubactions: siGithubactions,
  go: siGo,
  google: siGoogle,
  googlemeet: siGooglemeet,
  kubernetes: siKubernetes,
  langchain: siLangchain,
  langgraph: siLanggraph,
  meta: siMeta,
  neo4j: siNeo4j,
  nextdotjs: siNextdotjs,
  postgresql: siPostgresql,
  python: siPython,
  redis: siRedis,
  rust: siRust,
  solidity: siSolidity,
  tauri: siTauri,
  typescript: siTypescript,
  zoom: siZoom,
} as const;

// Marks simple-icons does not carry (OpenAI, Teams) and plain glyphs, from Phosphor.
const GLYPHS = { openai: OpenAiLogo, teams: MicrosoftTeamsLogo, phone: Phone, chart: ChartLineUp, wheel: SteeringWheel } as const;

export type MarkKey = keyof typeof BRANDS | keyof typeof GLYPHS;

// The names the page uses for tools, mapped to their marks. A tool with no official
// mark (gRPC, AWS, SSE, HNSW) is simply written.
const BY_NAME: Record<string, MarkKey> = {
  Anthropic: "anthropic",
  "Claude / Anthropic": "anthropic",
  OpenAI: "openai",
  Google: "google",
  Meta: "meta",
  Python: "python",
  Go: "go",
  TypeScript: "typescript",
  Rust: "rust",
  "C++": "cplusplus",
  "C / C++": "cplusplus",
  SQL: "postgresql",
  PostgreSQL: "postgresql",
  FastAPI: "fastapi",
  LangGraph: "langgraph",
  LangChain: "langchain",
  Docker: "docker",
  Kubernetes: "kubernetes",
  "GitHub Actions": "githubactions",
  Redis: "redis",
  Neo4j: "neo4j",
  Tauri: "tauri",
  Flutter: "flutter",
  Solidity: "solidity",
  "asyncio / Tokio": "rust",
  PyO3: "rust",
};

export const markFor = (name: string): MarkKey | undefined => BY_NAME[name];

/* One mark at a given size. Phosphor's drawings carry a little padding, so they are set
   a touch larger to sit level with the brand paths. */
export function Mark({
  name,
  size = 16,
  label,
  className,
}: {
  name: MarkKey;
  size?: number | `${number}em`;
  label?: string;
  className?: string;
}) {
  if (name in GLYPHS) {
    const G = GLYPHS[name as keyof typeof GLYPHS];
    const big = typeof size === "number" ? Math.round(size * 1.18) : `${(parseFloat(size) * 1.18).toFixed(3)}em`;
    return (
      <G
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        weight="fill"
        size={big}
        className={clsx("shrink-0", className)}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={clsx("shrink-0", className)}
    >
      <path d={BRANDS[name as keyof typeof BRANDS].path} />
    </svg>
  );
}

/* A stack written as its tools, each with its mark where it has one. */
export function Stack({ items, size = 14, className }: { items: string[]; size?: number; className?: string }) {
  return (
    <ul aria-label="Stack" className={clsx("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {items.map((t) => {
        const m = markFor(t);
        return (
          <li key={t} className="inline-flex items-center gap-1.5">
            {m && <Mark name={m} size={size} />}
            {t}
          </li>
        );
      })}
    </ul>
  );
}
