import { describe, expect, it } from "vitest";

import { buildPath, buildQuery } from "./client";
import { ApiError, PROBLEM_GUIDANCE, networkError } from "./errors";

describe("buildPath", () => {
  it("پارامترهای مسیر را با encode جایگزین می‌کند", () => {
    expect(buildPath("/api/v1/campaigns/{identifier}", { identifier: "heart-surgery" })).toBe(
      "/api/v1/campaigns/heart-surgery",
    );
    expect(buildPath("/api/v1/campaigns/{identifier}", { identifier: "a b/c" })).toBe(
      "/api/v1/campaigns/a%20b%2Fc",
    );
  });

  it("در نبود پارامتر، به‌جای درخواست خراب خطای صریح می‌دهد", () => {
    expect(() => buildPath("/api/v1/campaigns/{identifier}", {})).toThrow(/identifier/);
    expect(() => buildPath("/api/v1/campaigns/{identifier}", { identifier: "" })).toThrow();
  });
});

describe("buildQuery", () => {
  it("ترتیب پایدار دارد تا کلید کش عوض نشود", () => {
    expect(buildQuery({ status: "active", order: "fair" })).toBe("?order=fair&status=active");
    expect(buildQuery({ order: "fair", status: "active" })).toBe("?order=fair&status=active");
  });

  it("undefined و null را حذف می‌کند اما false را نگه می‌دارد", () => {
    expect(buildQuery({ a: undefined, b: null, c: false, d: 0 })).toBe("?c=false&d=0");
    expect(buildQuery({})).toBe("");
    expect(buildQuery(undefined)).toBe("");
  });
});

describe("ApiError", () => {
  it("راهنمای فارسی را از کد ماشینی برمی‌دارد، نه از detail", () => {
    const error = new ApiError(410, { code: "resource_expired", detail: "Gone." });
    expect(error.code).toBe("resource_expired");
    expect(error.guidance.title).toBe(PROBLEM_GUIDANCE.resource_expired?.title);
    expect(error.isValidation).toBe(false);
    expect(error.isAuth).toBe(false);
  });

  it("کد ناشناخته به راهنمای عمومی برمی‌گردد", () => {
    const error = new ApiError(500, { code: "totally_new_code" });
    expect(error.guidance.title).not.toHaveLength(0);
    expect(error.code).toBe("totally_new_code");
  });

  it("خطای شبکه با status صفر شناخته می‌شود", () => {
    const error = networkError();
    expect(error.isNetwork).toBe(true);
    expect(error.status).toBe(0);
  });

  it("خطای اعتبارسنجی، خطاهای فیلد و کد رهگیری را نگه می‌دارد", () => {
    const error = new ApiError(422, {
      code: "validation_error",
      fields: { shares: ["تعداد سهم باید مثبت باشد."] },
      trace_id: "trc_123",
    });
    expect(error.isValidation).toBe(true);
    expect(error.fieldErrors.shares?.[0]).toContain("مثبت");
    expect(error.traceId).toBe("trc_123");
  });
});
