import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "brand" | "gold" | "danger" | "success";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-soft border-line",
  brand: "bg-brand-tint text-accent border-brand/25",
  gold: "bg-gold-tint text-gold border-gold/30",
  danger: "bg-danger/10 text-danger border-danger/25",
  success: "bg-success/10 text-success border-success/25",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[0.72rem] leading-none font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
