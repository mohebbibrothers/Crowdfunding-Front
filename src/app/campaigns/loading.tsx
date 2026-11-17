import { CampaignCardSkeleton } from "@/components/home/campaign-card";

/** اسکلت بارگذاری مسیر `/campaigns` — هم‌شکل با شبکهٔ نهایی تا پرش چیدمان نباشد. */
export default function Loading() {
  return (
    <>
      <section className="shell pt-8 pb-10 sm:pt-10">
        <div className="h-3 w-24 animate-pulse rounded-pill bg-surface-2" />
        <div className="mt-6 h-3 w-32 animate-pulse rounded-pill bg-surface-2" />
        <div className="mt-4 h-9 w-[min(90%,26rem)] animate-pulse rounded-xl bg-surface-2" />
        <div className="mt-4 h-3 w-[min(85%,34rem)] animate-pulse rounded-pill bg-surface-2" />
        <div className="mt-7 flex gap-6 border-t border-line pt-5">
          <div className="h-5 w-28 animate-pulse rounded-pill bg-surface-2" />
          <div className="h-5 w-24 animate-pulse rounded-pill bg-surface-2" />
        </div>
      </section>

      <section className="shell pb-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
          <div className="hidden w-[16.5rem] shrink-0 lg:block">
            <div className="rounded-card border border-line bg-surface p-5">
              <div className="h-4 w-20 animate-pulse rounded-pill bg-surface-2" />
              <div className="mt-5 space-y-2">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    className="h-7 animate-pulse rounded-pill bg-surface-2"
                    style={{ animationDelay: `${index * 60}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="h-11 w-full animate-pulse rounded-pill bg-surface-2" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <CampaignCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
