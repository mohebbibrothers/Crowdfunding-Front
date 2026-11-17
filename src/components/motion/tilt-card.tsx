"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * «میز سهم» کمی از مرکز جابه‌جا می‌شود که نشانگر روی آن است — سه‌بعدیِ بسیار ملایم.
 * رهاسازی: با خروج نشانگر، فنرِ نرم به حالت اول برمی‌گردد.
 * روی دستگاه لمسی و در حالت «کاهش حرکت» هیچ اثری ندارد.
 */
export function TiltCard({
  className,
  children,
  max = 4,
  float = false,
}: {
  className?: string;
  children: ReactNode;
  /** بیشترین زاویه، درجه */
  max?: number;
  /** شناوری آرام و دائمی */
  float?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion !== "on") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };

    const apply = () => {
      el.style.transform = `perspective(1200px) rotateX(${target.y.toFixed(2)}deg) rotateY(${target.x.toFixed(2)}deg)`;
    };

    const onMove = (event: PointerEvent) => {
      el.classList.add("is-tilting");
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      target = { x: px * max * 2, y: -py * max * 2 };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.classList.remove("is-tilting");
      target = { x: 0, y: 0 };
      apply();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt-shell", className)}>
      {float ? <div className="float-soft">{children}</div> : children}
    </div>
  );
}
