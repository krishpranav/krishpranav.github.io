import {
  siRust,
  siGo,
  siCplusplus,
  siPython,
  siTypescript,
  siPostgresql,
  siRedis,
  siDocker,
  siKubernetes,
  siAnthropic,
  siOnnx,
  siGraphql,
} from "simple-icons";

type Icon = { path: string };

// Map each toolchain entry (by its `name` in lib/resume.ts) to a brand mark.
// Combined names use one representative logo; AWS has no simple-icon → monogram.
const MAP: Record<string, Icon | undefined> = {
  Rust: siRust,
  Go: siGo,
  "C / C++": siCplusplus,
  Python: siPython,
  TypeScript: siTypescript,
  PostgreSQL: siPostgresql,
  Redis: siRedis,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  AWS: undefined,
  "gRPC / GraphQL": siGraphql,
  "Anthropic / OpenAI": siAnthropic,
  ONNX: siOnnx,
};

export function BrandIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const icon = MAP[name];
  if (!icon) {
    // Monogram fallback (e.g. AWS): the capitals of the name.
    const mono = name.replace(/[^A-Z]/g, "").slice(0, 3) || name.slice(0, 2);
    return (
      <span
        className={`inline-flex items-center justify-center font-mono text-[11px] font-normal tracking-tight text-ink ${className}`}
        aria-hidden
      >
        {mono}
      </span>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-label={name}
    >
      <path d={icon.path} />
    </svg>
  );
}
