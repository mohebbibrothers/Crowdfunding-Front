import { Fragment } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * تقسیم یک تیتر به واژه‌های مستقل تا هر واژه با تأخیر کوتاه بالا بیاید.
 * بدون جاوااسکریپت هم متن ساده و کامل دیده می‌شود؛ پویانمایی فقط از
 * طریق والدِ `[data-in]` فعال می‌شود (نگاه کنید به `.word` در globals.css).
 */
export function Words({
  text,
  delay = 0,
  step = 65,
  className,
}: {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
}) {
  const parts = text.split(" ").filter(Boolean);
  return (
    <span className={cn("words", className)}>
      {parts.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            className="word"
            style={{ "--d": `${delay + index * step}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {index < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
