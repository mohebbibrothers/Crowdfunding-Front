import { describe, expect, it } from "vitest";

import {
  DEFAULT_ORDER,
  DEFAULT_STATUS,
  activeFilterKeys,
  hasActiveFilters,
  normalizeQuery,
  parseFilters,
  toQueryString,
  withFilter,
} from "./filters";

describe("parseFilters", () => {
  it("با ورودی خالی، مقادیر پیش‌فرض را برمی‌گرداند", () => {
    const f = parseFilters({});
    expect(f.status).toBe(DEFAULT_STATUS);
    expect(f.order).toBe(DEFAULT_ORDER);
    expect(f.matching).toBe(false);
    expect(hasActiveFilters(f)).toBe(false);
  });

  it("مقادیر خارج از enum بک‌اند را نادیده می‌گیرد", () => {
    const f = parseFilters({ status: "funded", order: "progress", urgency: "critical" });
    expect(f.status).toBe("active");
    expect(f.order).toBe("fair");
    expect(f.urgency).toBe("");
  });

  it("مقادیر معتبر را می‌پذیرد", () => {
    const f = parseFilters({
      status: "executing",
      order: "ending_soon",
      urgency: "emergency",
      province: "خراسان رضوی",
      category: "health-care",
      matching: "1",
      q: "  قلب   باز ",
    });
    expect(f).toMatchObject({
      status: "executing",
      order: "ending_soon",
      urgency: "emergency",
      province: "خراسان رضوی",
      category: "health-care",
      matching: true,
      q: "قلب باز",
    });
  });

  it("آرایهٔ پارامترهای تکراری را به اولین مقدار فرو می‌کاهد", () => {
    expect(parseFilters({ status: ["newest", "completed"] as unknown as string[] }).status).toBe(
      "active",
    );
    expect(parseFilters({ order: ["newest", "urgent"] }).order).toBe("newest");
  });

  it("استانِ ناشناخته و نامکِ نامعتبر را دور می‌ریزد", () => {
    const f = parseFilters({ province: "استان جعلی", category: "Health Care!" });
    expect(f.province).toBe("");
    expect(f.category).toBe("");
  });
});

describe("normalizeQuery", () => {
  it("فاصله‌ها را جمع و طول را محدود می‌کند", () => {
    expect(normalizeQuery("  a   b  ")).toBe("a b");
    expect(normalizeQuery("x".repeat(200)).length).toBe(80);
    expect(normalizeQuery("a\u0000b")).toBe("a b");
  });
});

describe("toQueryString", () => {
  it("مقادیر پیش‌فرض را حذف می‌کند", () => {
    expect(toQueryString({ status: "active", order: "fair" })).toBe("");
  });

  it("ترتیب پایدار و کدگذاری درست دارد", () => {
    const qs = toQueryString({ q: "قلب باز", province: "خراسان رضوی", matching: true });
    expect(qs).toBe(
      "?q=%D9%82%D9%84%D8%A8+%D8%A8%D8%A7%D8%B2&province=%D8%AE%D8%B1%D8%A7%D8%B3%D8%A7%D9%86+%D8%B1%D8%B6%D9%88%DB%8C&matching=1",
    );
  });
});

describe("activeFilterKeys / withFilter", () => {
  it("فقط فیلترهای غیرپیش‌فرض را می‌شمارد", () => {
    const f = parseFilters({ order: "newest", q: "قلب" });
    expect(activeFilterKeys(f)).toEqual(["q", "order"]);
  });

  it("حذف یک فیلتر، آدرس بقیه را نگه می‌دارد", () => {
    const f = parseFilters({ q: "قلب", category: "education", order: "newest" });
    expect(withFilter(f, { q: "" })).toBe("/campaigns?category=education&order=newest");
  });
});
