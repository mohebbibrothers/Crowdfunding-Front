import {
  ALAVI_MARK_PATH,
  ALAVI_MARK_TRANSFORM,
  ALAVI_MARK_VIEWBOX,
} from "@/components/brand/alavi-paths";
import { cn } from "@/lib/utils/cn";

/**
 * نشان‌های برند بنیاد علوی.
 *
 * - نشان (emblem) به‌صورت SVG درون‌خطی است تا با `currentColor` رنگ بگیرد و
 *   در هر دو تم درست دیده شود (بدون درخواست شبکه).
 * - خوشنویسی رسمی از فایل‌های وکتور `public/brand/*-white.svg` خوانده می‌شود؛
 *   برای سطوح تیره (فوتر و پنل پایانی) طراحی شده و کش می‌شود.
 */

/** نشانِ بنیاد، رنگ‌پذیر با currentColor. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={ALAVI_MARK_VIEWBOX}
      aria-hidden
      focusable="false"
      className={cn("h-9 w-auto", className)}
      fill="currentColor"
    >
      <g transform={ALAVI_MARK_TRANSFORM}>
        <path d={ALAVI_MARK_PATH} />
      </g>
    </svg>
  );
}

/**
 * برند هدر: نشان + نام بنیاد با تایپوگرافی زنده.
 * خوشنویسی در ارتفاع هدر ناخوانا می‌شود؛ پس متن با وزیرمتن نوشته می‌شود و
 * خوشنویسی رسمی در امضاهای بزرگ (فوتر، پنل پایانی، OG) به کار می‌رود.
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark className="h-9 shrink-0 text-brand sm:h-10" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-[1.02rem] font-extrabold tracking-tight text-ink">بنیاد علوی</span>
        <span className="mt-1 flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-wide text-muted">
          <span aria-hidden className="h-px w-3 bg-gold" />
          سامانهٔ هم‌سهم
        </span>
      </span>
    </span>
  );
}

/**
 * خوشنویسی افقی رسمی — رنگش با تم عوض می‌شود (سبزِ برند در روز، سپید در شب).
 * به‌جای `<img>` از پس‌زمینهٔ CSS استفاده می‌کنیم تا در یک صفحه دو نسخه
 * دانلود نشود؛ اندازه از طریق `aspect-ratio` و ارتفاعِ کلاس می‌آید.
 */
export function BrandSignatureH({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("brand-sig brand-sig-h block", className)}
      style={{ backgroundSize: "contain" }}
    />
  );
}

/** خوشنویسی عمودی رسمی — مهر/امضا در حاشیهٔ پنل‌ها. */
export function BrandSignatureV({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("brand-sig brand-sig-v block", className)}
      style={{ backgroundSize: "contain" }}
    />
  );
}
