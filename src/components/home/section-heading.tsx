import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  action,
  actionPlacement = "side",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  action?: ReactNode;
  /** «side»: کنار متن در انتهای بلوک — «below»: ادامهٔ پاراگراف، راست‌چین */
  actionPlacement?: "side" | "below";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        actionPlacement === "below" && "sm:flex-col sm:items-stretch",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow mb-3", align === "center" && "justify-center")}>
            <span aria-hidden className="h-px w-5 bg-gold" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="display-2">{title}</h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-[0.95rem] leading-8 text-muted",
              align === "center" && "mx-auto max-w-xl",
            )}
          >
            {description}
          </p>
        ) : null}
        {action && actionPlacement === "below" ? <div className="mt-4 flex">{action}</div> : null}
      </div>
      {action && actionPlacement !== "below" ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
