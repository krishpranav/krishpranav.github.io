import clsx from "clsx";
import type { ReactNode } from "react";

type Common = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
};

type AsLink = Common & { href: string; external?: boolean; onClick?: () => void };
type AsButton = Common & { href?: undefined; onClick?: () => void; type?: "button" | "submit"; ariaLabel?: string };

/* A pill. The ink fill is kept for the one action the page exists for: writing to me. */
export function Button(props: AsLink | AsButton) {
  const { children, variant = "secondary", size = "md", className } = props;
  const cls = clsx("btn", variant === "primary" && "btn--primary", size === "sm" && "btn--sm", className);

  if (props.href !== undefined) {
    const ext = props.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={props.href} className={cls} onClick={props.onClick} {...ext}>
        {children}
      </a>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} aria-label={props.ariaLabel} className={cls}>
      {children}
    </button>
  );
}
