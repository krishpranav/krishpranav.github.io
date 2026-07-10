"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type LogLine = {
  t?: "cmd" | "ok" | "info" | "dim" | "warn" | "accent";
  text: string;
};

const toneClass: Record<NonNullable<LogLine["t"]>, string> = {
  cmd: "text-ink",
  ok: "text-ink",
  info: "text-body",
  dim: "text-faint",
  warn: "text-sunset",
  accent: "text-ink",
};

export function TerminalFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-hairline bg-[#0c0c0c] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] text-neutral-500">{title}</span>
      </div>
      <div className="p-4 font-mono text-[12px] leading-relaxed md:text-[13px]">
        {children}
      </div>
    </div>
  );
}

export function TerminalLog({ lines }: { lines: LogLine[] }) {
  return (
    <div className="space-y-1">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.35 }}
          className={`${toneClass[l.t ?? "info"]} whitespace-pre-wrap`}
        >
          {l.t === "cmd" && <span className="text-mute">$ </span>}
          {l.text}
        </motion.div>
      ))}
    </div>
  );
}

export type { LogLine };
