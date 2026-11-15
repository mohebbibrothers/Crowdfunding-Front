import { env } from "@/lib/config/env";

import { ApiError, networkError, type ProblemBody } from "./errors";
import { OPERATIONS, type OperationKey } from "./generated/operations";
import type { ApiOperationMap } from "./generated/api-types";

export type ApiOperationId = OperationKey;
export type ApiHeaders = Record<string, string>;

/** گزینه‌های کش سرور برای RSC/Route Handler */
export interface NextFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface RequestOptions<K extends ApiOperationId> {
  /** پارامترهای مسیر مثل { slug: "..." } — وجودشان در زمان کامپایل اجباری است */
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: ApiOperationMap[K] extends { request: infer R } ? R | undefined : never;
  headers?: ApiHeaders;
  signal?: AbortSignal;
  /** کش سرور؛ اگر تعیین شود درخواست از دید Next کش‌پذیر می‌شود */
  next?: NextFetchOptions;
  /** کلید یکتای عملیات مالی؛ تا پایان همان تلاش ثابت بماند */
  idempotencyKey?: string;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

/** ساخت مسیر از الگوی قرارداد با encode کامل و خطای صریح در نبود پارامتر. */
export function buildPath(template: string, params?: Record<string, string>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, rawName: string) => {
    const value = params?.[rawName];
    if (value === undefined || value === "") {
      throw new Error(`پارامتر مسیر «${rawName}» برای ${template} ارسال نشده است.`);
    }
    return encodeURIComponent(value);
  });
}

/** ساخت کوئری با ترتیب پایدار (برای کش و مقایسه‌پذیری) و حذف فقط null/undefined. */
export function buildQuery(query?: RequestOptions<never>["query"]): string {
  if (!query) return "";
  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return entries.length ? `?${entries.join("&")}` : "";
}

async function readProblem(response: Response): Promise<ProblemBody> {
  try {
    const text = await response.text();
    if (!text) return { status: response.status };
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed as ProblemBody;
    return { status: response.status, detail: text.slice(0, 300) };
  } catch {
    return { status: response.status };
  }
}

/**
 * فراخوانی یک عملیات بر اساس operationId.
 * تضمین‌ها: وجود مسیر در قرارداد، تطابق متد، اجباری‌بودن پارامترهای مسیر،
 * و استنتاج نوع پاسخ — همه در زمان کامپایل.
 */
export async function apiRequest<K extends ApiOperationId>(
  operationId: K,
  options: RequestOptions<K> = {},
): Promise<ApiOperationMap[K]["response"]> {
  const descriptor = OPERATIONS[operationId];
  const path = buildPath(descriptor.path, options.params);
  const url = `${env.apiUrl}${path}${buildQuery(options.query)}`;

  const headers: ApiHeaders = { Accept: "application/json", ...options.headers };
  const body = options.body as unknown;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;

  const timeout = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(url, {
      method: descriptor.method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      credentials: "include",
      next: options.next
        ? { revalidate: options.next.revalidate, tags: options.next.tags }
        : undefined,
    });
  } catch (cause) {
    throw networkError(cause);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readProblem(response));
  }

  if (response.status === 204) return undefined as ApiOperationMap[K]["response"];
  return (await response.json()) as ApiOperationMap[K]["response"];
}

/** نسخهٔ امن برای صفحاتی که نباید با قطعی API از کار بیفتند (مثل صفحهٔ اصلی). */
export async function apiRequestSafe<K extends ApiOperationId>(
  operationId: K,
  options: RequestOptions<K> = {},
): Promise<ApiOperationMap[K]["response"] | null> {
  try {
    return await apiRequest(operationId, options);
  } catch (error) {
    if (process.env.NODE_ENV !== "test") {
      const reason = error instanceof ApiError ? `${error.status} ${error.code}` : String(error);
      console.warn(`[api] ${operationId} failed: ${reason}`);
    }
    return null;
  }
}
