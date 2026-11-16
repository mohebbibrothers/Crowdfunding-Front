import { BadgeCheck, Building2 } from "lucide-react";
import Link from "next/link";

import type { BenefactorCard } from "@/lib/api/schemas";
import { formatInt } from "@/lib/format/numbers";
import { formatTomanCompact } from "@/lib/format/money";

export function BenefactorStrip({ benefactors }: { benefactors: BenefactorCard[] }) {
  if (benefactors.length === 0) return null;

  return (
    <section className="shell py-10">
      <div className="rounded-[1.5rem] border border-line bg-surface-2/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[0.95rem] font-bold text-ink">خیریه‌ها و نهادهای همراه</h2>
          <Link
            href="/charities"
            className="text-[0.82rem] font-semibold text-accent hover:underline"
          >
            مشاهدهٔ همه
          </Link>
        </div>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {benefactors.slice(0, 4).map((benefactor) => (
            <li key={benefactor.id} className="min-w-0">
              <Link
                href={`/charities/${benefactor.slug}`}
                className="flex h-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand-soft"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-accent">
                  <Building2 className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-[0.86rem] font-bold text-ink">
                      {benefactor.name}
                    </span>
                    {benefactor.is_verified ? (
                      <BadgeCheck className="size-4 shrink-0 text-accent" aria-label="تأییدشده" />
                    ) : null}
                  </span>
                  <span className="num mt-1 block text-[0.74rem] text-muted">
                    {formatInt(benefactor.active_campaigns_count)} حرکت فعال ·{" "}
                    {formatTomanCompact(benefactor.total_raised_toman)} جذب‌شده
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
