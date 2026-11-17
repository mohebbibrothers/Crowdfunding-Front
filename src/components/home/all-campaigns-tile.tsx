import { ArrowLeft, Layers } from "lucide-react";
import Link from "next/link";

import { formatInt } from "@/lib/format/numbers";

/**
 * کاشی «همهٔ حرکت‌ها» — وقتی کمتر از سه حرکت ویژه داریم، جای خالی گرید را
 * با یک درِ ورودی به فهرست کامل پر می‌کند (به‌جای حفرهٔ خالی در چیدمان).
 */
export function AllCampaignsTile({ count }: { count: number }) {
  return (
    <Link
      href="/campaigns"
      prefetch={false}
      className="group card-lift flex h-full min-h-[22rem] flex-col justify-between rounded-card border border-dashed border-line-strong bg-surface-2/50 p-6 transition-colors hover:border-brand-soft hover:bg-brand-tint/60"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
        <Layers className="size-5" aria-hidden />
      </span>

      <div className="my-auto py-6">
        <h3 className="text-[1.05rem] font-bold text-ink">فهرست حرکت‌های در جریان</h3>
        <p className="mt-2 text-[0.86rem] leading-7 text-muted">
          فهرست کامل، با فیلتر دسته، استان و فوریت — تا حرکتی را پیدا کنی که به آن نزدیک‌تری.
        </p>
        <p className="num mt-3 text-[0.78rem] font-bold text-accent">
          {formatInt(count)} حرکت فعال
        </p>
      </div>

      <span className="inline-flex items-center gap-2 text-[0.84rem] font-bold text-accent transition-colors group-hover:text-brand-soft">
        دیدن فهرست
        <ArrowLeft
          className="size-4 transition-transform duration-300 ease-out-soft group-hover:-translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}
