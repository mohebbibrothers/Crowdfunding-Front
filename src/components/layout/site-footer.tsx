import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { brand } from "@/lib/config/brand";
import { site } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="shell grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[0.9rem] leading-8 text-muted">{site.description}</p>
          <p className="mt-5 text-[0.8rem] text-muted">
            {brand.legalName} · {brand.domain}
          </p>
        </div>

        {site.footer.groups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h3 className="text-[0.82rem] font-bold text-ink">{group.title}</h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.86rem] text-muted transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-[0.78rem] text-muted sm:flex-row">
          <p>© {brand.legalName} — همهٔ حقوق محفوظ است.</p>
          <p className="flex items-center gap-4">
            <span>ساخته‌شده با احترام به اعتماد شما</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
