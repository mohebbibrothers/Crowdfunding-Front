import type { ProblemCode } from "./generated/api-types";

/**
 * بدنهٔ خطای استاندارد سرویس (RFC 9457 — application/problem+json).
 * هرگز روی `detail` تصمیم نگیرید؛ `code` شناسهٔ ماشینی پایدار است.
 */
export interface ProblemBody {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  code?: ProblemCode | string;
  trace_id?: string;
  fields?: Record<string, string[]>;
  retry_after?: number;
  [key: string]: unknown;
}

/** آنچه کاربر باید ببیند؛ متن فارسی + اقدام پیشنهادی. */
export interface ProblemGuidance {
  title: string;
  action: string;
}

/**
 * نقشهٔ کدهای خطا → راهنمای فارسی.
 * فقط کدهای پرکاربرد در مسیر عمومی و پرداخت اینجا آمده‌اند؛ بقیه به
 * پیام عمومی برمی‌گردند تا هرگز متن خام سرور به کاربر نمایش داده نشود.
 */
export const PROBLEM_GUIDANCE: Record<string, ProblemGuidance> = {
  malformed_request: {
    title: "درخواست نامعتبر",
    action: "صفحه را تازه کنید و دوباره تلاش کنید.",
  },
  authentication_required: {
    title: "برای ادامه وارد شوید",
    action: "با شمارهٔ موبایل خود وارد شوید تا این مرحله انجام شود.",
  },
  permission_denied: {
    title: "دسترسی لازم را ندارید",
    action: "با حسابی دیگر وارد شوید یا با پشتیبانی تماس بگیرید.",
  },
  not_found: {
    title: "این مورد پیدا نشد",
    action: "ممکن است حذف یا آدرس اشتباه شده باشد.",
  },
  resource_expired: {
    title: "زمان رزرو سهم به پایان رسید",
    action: "سهم‌های شما آزاد شدند؛ تعداد سهم را دوباره انتخاب و پرداخت کنید.",
  },
  validation_error: {
    title: "اطلاعات واردشده کامل یا درست نیست",
    action: "فیلدهای مشخص‌شده را اصلاح کنید و دوباره بفرستید.",
  },
  idempotency_conflict: {
    title: "این درخواست پیش‌تر با اطلاعات دیگری ثبت شده",
    action: "صفحه را تازه کنید و از ابتدا اقدام کنید.",
  },
  idempotency_in_progress: {
    title: "درخواست قبلی در حال پردازش است",
    action: "چند لحظه صبر کنید؛ نتیجهٔ همان درخواست نمایش داده می‌شود.",
  },
  rate_limited: {
    title: "تعداد درخواست‌ها زیاد بود",
    action: "کمی صبر کنید و دوباره تلاش کنید.",
  },
  service_overloaded: {
    title: "سامانه در این لحظه شلوغ است",
    action: "چند لحظه دیگر دوباره تلاش کنید.",
  },
  internal_error: {
    title: "خطای غیرمنتظره در سامانه",
    action: "کد رهگیری را برای پشتیبانی بفرستید.",
  },
  feature_disabled: {
    title: "این قابلیت فعلاً غیرفعال است",
    action: "برای اطلاع از زمان فعال‌سازی با پشتیبانی تماس بگیرید.",
  },
  invalid_phone: { title: "شمارهٔ موبایل معتبر نیست", action: "شماره را با ۰۹ شروع کنید." },
  invalid_otp_code: { title: "کد تأیید درست نیست", action: "کد پیامک‌شده را دوباره وارد کنید." },
  otp_expired: { title: "کد تأیید منقضی شده", action: "کد تازه درخواست کنید." },
  otp_attempts_exceeded: {
    title: "تعداد تلاش‌های نادرست زیاد بود",
    action: "چند دقیقه صبر کنید و کد تازه بگیرید.",
  },
  otp_window_exceeded: {
    title: "درخواست‌های کد زیاد بود",
    action: "کمی بعد دوباره درخواست کنید.",
  },
  invalid_mfa_code: {
    title: "کد دومرحله‌ای نادرست است",
    action: "کد تازهٔ برنامهٔ احرازگر را وارد کنید.",
  },
  mfa_required: { title: "تأیید دومرحله‌ای لازم است", action: "کد برنامهٔ احرازگر را وارد کنید." },
  step_up_required: {
    title: "برای این عملیات تأیید دوباره لازم است",
    action: "کد برنامهٔ احرازگر را وارد کنید تا همان درخواست ادامه یابد.",
  },
  invalid_cursor: {
    title: "صفحه منقضی شده",
    action: "فهرست از ابتدا بارگذاری می‌شود.",
  },
  conflict: { title: "این عملیات در وضعیت فعلی ممکن نیست", action: "صفحه را تازه کنید." },
  invalid_sheba: { title: "شمارهٔ شبا معتبر نیست", action: "شبا را با IR و بدون فاصله وارد کنید." },
  invalid_national_code: { title: "کد ملی معتبر نیست", action: "کد ملی ده‌رقمی را بررسی کنید." },
  duplicate_national_code: {
    title: "این کد ملی قبلاً ثبت شده",
    action: "اگر حساب دارید وارد شوید.",
  },
  reason_required: { title: "درج دلیل الزامی است", action: "دلیل انجام این تغییر را بنویسید." },
  sms_budget_exhausted: { title: "سقف ارسال پیامک امروز پر شده", action: "فردا دوباره تلاش کنید." },
};

const FALLBACK: ProblemGuidance = {
  title: "خطایی رخ داد",
  action: "دوباره تلاش کنید؛ اگر ادامه داشت کد رهگیری را به پشتیبانی بدهید.",
};

/** خطای تایپ‌شدهٔ لایهٔ API — تنها شکلی که کامپوننت‌ها می‌بینند. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly problem: ProblemBody;
  readonly traceId?: string;
  readonly fieldErrors: Record<string, string[]>;
  readonly retryAfter?: number;

  constructor(status: number, problem: ProblemBody) {
    const guidance = PROBLEM_GUIDANCE[String(problem.code ?? "")] ?? FALLBACK;
    super(problem.detail ?? guidance.title);
    this.name = "ApiError";
    this.status = status;
    this.code = String(problem.code ?? `http_${status}`);
    this.problem = problem;
    this.traceId = typeof problem.trace_id === "string" ? problem.trace_id : undefined;
    this.fieldErrors = problem.fields ?? {};
    this.retryAfter = typeof problem.retry_after === "number" ? problem.retry_after : undefined;
  }

  /** متن آمادهٔ نمایش به کاربر (هرگز `detail` خام سرور). */
  get guidance(): ProblemGuidance {
    return PROBLEM_GUIDANCE[this.code] ?? FALLBACK;
  }

  get isNetwork(): boolean {
    return this.status === 0;
  }

  get isAuth(): boolean {
    return this.status === 401;
  }

  get isValidation(): boolean {
    return this.status === 422 || this.status === 400;
  }
}

/** خطای اتصال (سرور در دسترس نبود، قطع شبکه، تایم‌اوت). */
export function networkError(cause?: unknown): ApiError {
  return new ApiError(0, {
    code: "network_unreachable",
    status: 0,
    detail: cause instanceof Error ? cause.message : undefined,
  });
}
