"use client";

import { useEffect } from "react";

/**
 * یک شنوندهٔ سراسری برای همهٔ کارت‌های `.glow-card`.
 * به‌جای یک هندلر روی هر کارت، مختصات نشانگر روی نزدیک‌ترین کارت نوشته
 * می‌شود و خودِ CSS هاله را می‌کشد. روی دستگاه لمسی کاری نمی‌کند.
 */
export function PointerGlow() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    let point = { x: 0, y: 0 };

    const paint = () => {
      if (!current) return;
      const rect = current.getBoundingClientRect();
      current.style.setProperty("--mx", `${point.x - rect.left}px`);
      current.style.setProperty("--my", `${point.y - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest?.(".glow-card");
      current = (target as HTMLElement | null) ?? null;
      if (!current) return;
      point = { x: event.clientX, y: event.clientY };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
