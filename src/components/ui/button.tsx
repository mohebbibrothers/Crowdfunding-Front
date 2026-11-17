import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-[background-color,color,box-shadow,transform] duration-200 ease-out-soft select-none whitespace-nowrap disabled:pointer-events-none disabled:opacity-55 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "sheen bg-brand text-on-brand shadow-e2 hover:bg-brand-soft focus-visible:outline-brand",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-brand-soft hover:text-accent shadow-e1",
  ghost: "text-ink-soft hover:text-accent hover:bg-brand-tint",
  gold: "sheen bg-gold text-[#241a05] shadow-e2 hover:brightness-110 dark:text-[#1a1405]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.82rem]",
  md: "h-11 px-5 text-[0.92rem]",
  lg: "h-13 px-7 text-[0.98rem]",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & ButtonStyleProps & { children: ReactNode }) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
