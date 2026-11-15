import { describe, expect, it } from "vitest";

import { daysRemaining, formatJalali, formatRemaining, toPersianDigits } from "./date";
import { formatAmount, formatToman, formatTomanCompact } from "./money";
import { clampPercent, formatInt, formatPercent } from "./numbers";

describe("پول", () => {
  it("تومان را با جداکنندهٔ فارسی و یکا نشان می‌دهد", () => {
    expect(formatToman(500_000)).toBe("۵۰۰٬۰۰۰ تومان");
    expect(formatAmount(1_200)).toBe("۱٬۲۰۰");
  });

  it("مقدار نامعتبر را با خط تیره می‌پوشاند، نه NaN", () => {
    expect(formatToman(null)).toBe("—");
    expect(formatToman(undefined)).toBe("—");
    expect(formatToman(Number.NaN)).toBe("—");
    expect(formatToman(Number.POSITIVE_INFINITY)).toBe("—");
  });

  it("مبالغ بزرگ را خوانا خلاصه می‌کند", () => {
    expect(formatTomanCompact(12_500_000)).toBe("۱۲٫۵ میلیون تومان");
    expect(formatTomanCompact(2_400_000_000)).toBe("۲٫۴ میلیارد تومان");
    expect(formatTomanCompact(900_000)).toBe("۹۰۰٬۰۰۰ تومان");
  });
});

describe("عدد و درصد", () => {
  it("درصد را در بازهٔ ۰ تا ۱۰۰ نگه می‌دارد", () => {
    expect(formatPercent(63.6)).toBe("۶۴٪");
    expect(formatPercent(-12)).toBe("۰٪");
    expect(formatPercent(148)).toBe("۱۰۰٪");
    expect(formatPercent(undefined)).toBe("۰٪");
    expect(clampPercent(Number.NaN)).toBe(0);
  });

  it("عدد صحیح را گرد و فارسی می‌کند", () => {
    expect(formatInt(1240)).toBe("۱٬۲۴۰");
    expect(formatInt(1240.7)).toBe("۱٬۲۴۱");
  });
});

describe("تاریخ", () => {
  it("ارقام لاتین را به فارسی تبدیل می‌کند", () => {
    expect(toPersianDigits("1405-08-24")).toBe("۱۴۰۵-۰۸-۲۴");
  });

  it("تاریخ جلالی سرور را بدون تبدیل تقویم نمایش می‌دهد", () => {
    expect(formatJalali("1405-08-24")).toBe("۱۴۰۵/۰۸/۲۴");
    expect(formatJalali(null)).toBe("—");
  });

  it("روزهای باقی‌مانده را با مبنای مشخص می‌شمارد", () => {
    const now = new Date("2026-11-15T00:00:00+03:30");
    expect(daysRemaining("2026-11-22T00:00:00+03:30", now)).toBe(7);
    expect(daysRemaining("2026-11-14T00:00:00+03:30", now)).toBe(-1);
    expect(daysRemaining("not-a-date", now)).toBeNull();
    expect(daysRemaining(null, now)).toBeNull();
  });

  it("متن زمان باقی‌مانده در همهٔ حالت‌ها خواناست", () => {
    const now = new Date("2026-11-15T00:00:00+03:30");
    expect(formatRemaining("2026-11-16T00:00:00+03:30", now)).toBe("آخرین روز");
    expect(formatRemaining("2026-11-19T00:00:00+03:30", now)).toBe("۴ روز مانده");
    expect(formatRemaining("2026-12-06T00:00:00+03:30", now)).toBe("۳ هفته مانده");
    expect(formatRemaining("2027-02-10T00:00:00+03:30", now)).toBe("۲ ماه مانده");
    expect(formatRemaining("2026-11-01T00:00:00+03:30", now)).toBe("مهلت تمام شده");
    expect(formatRemaining(null, now)).toBe("بدون مهلت");
  });
});
