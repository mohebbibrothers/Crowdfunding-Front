import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

/**
 * سرو کردن چالش ACME برای AutoSSL.
 *
 * چرا لازم است: وقتی اپ Node دامنه را در اختیار می‌گیرد، Passenger همهٔ مسیرها را
 * به Next می‌دهد — از جمله `/.well-known/acme-challenge/<token>`. بنابراین
 * AutoSSL فایل چالش را در docroot می‌نویسد ولی هیچ‌کس آن را سرو نمی‌کند و صدور
 * گواهی Let's Encrypt شکست می‌خورد. این مسیر همان فایل را از docroot می‌خواند.
 *
 * مسیر عمومی از طریق rewrite در next.config به این‌جا نگاشت می‌شود.
 * پوشهٔ جایگزین با متغیر ACME_CHALLENGE_DIR قابل تغییر است.
 */
const CANDIDATE_DIRS: string[] = [
  process.env.ACME_CHALLENGE_DIR,
  process.env.HOME
    ? path.join(process.env.HOME, "public_html", ".well-known", "acme-challenge")
    : undefined,
  process.env.HOME ? path.join(process.env.HOME, ".well-known", "acme-challenge") : undefined,
].filter((dir): dir is string => typeof dir === "string" && dir.length > 0);

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;

  // فقط نام‌های مجاز ACME — جلوگیری از path traversal
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(token)) {
    return new NextResponse("Not Found", { status: 404, headers: { "cache-control": "no-store" } });
  }

  for (const dir of CANDIDATE_DIRS) {
    try {
      const body = await fs.readFile(path.join(dir, token), "utf8");
      return new NextResponse(`${body.trim()}\n`, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        },
      });
    } catch {
      // پوشهٔ بعدی را امتحان کن
    }
  }

  return new NextResponse("Not Found", { status: 404, headers: { "cache-control": "no-store" } });
}
