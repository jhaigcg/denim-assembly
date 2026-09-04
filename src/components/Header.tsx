"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENCIES } from "@/lib/data";
import { T } from "@/lib/i18n";
import { clsx } from "@/lib/clsx";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { Logo } from "./Logo";

const LANGS: { key: "en" | "zh"; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "zh", label: "中文" },
];

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const lang = useAppStore((s) => s.lang);
  const currency = useAppStore((s) => s.currency);
  const setLang = useAppStore((s) => s.setLang);
  const setCurrency = useAppStore((s) => s.setCurrency);

  // Until hydrated, render the default state so SSR markup matches.
  const activeLang = hydrated ? lang : "en";
  const activeCcy = hydrated ? currency : "USD";
  const t = T[activeLang];

  const tabs = [
    { href: "/", label: t.tabs.showroom },
    { href: "/customiser", label: t.tabs.customiser },
  ];

  return (
    <header className="app-header sticky top-0 z-50 bg-ink text-paper flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:py-[9px] sm:min-h-[60px]">
      {/* Row 1 — brand + (mobile) contact */}
      <div className="flex items-center justify-between gap-3 min-w-0 sm:shrink sm:overflow-hidden">
        <Link
          href="/"
          className="flex items-baseline gap-3 min-w-0 shrink-0 text-paper hover:text-paper"
        >
          <Logo variant="header" />
          <span className="hidden sm:inline font-mono text-[10.5px] tracking-[0.16em] text-[#9AA3C8] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
            {t.tagline}
          </span>
        </Link>
        <Link
          href="/#contact"
          className="sm:hidden font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#9AA3C8] hover:text-paper whitespace-nowrap"
        >
          {t.contact}
        </Link>
      </div>

      {/* Row 2 — screen tabs */}
      <nav className="flex gap-0.5 shrink-0">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "flex-1 sm:flex-none text-center min-h-[40px] sm:min-h-0 flex items-center justify-center px-3 py-[9px] font-sans text-[12.5px] font-medium rounded whitespace-nowrap transition-colors",
                active
                  ? "bg-paper text-ink"
                  : "bg-transparent text-[#B9BCC6] hover:text-paper",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Row 3 — currency + language + (desktop) contact */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
        <div className="flex flex-1 sm:flex-none gap-px bg-[rgba(246,246,244,0.14)] p-px rounded">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={clsx(
                "flex-1 sm:flex-none min-h-[36px] sm:min-h-0 px-[7px] py-1.5 font-mono text-[10px] tracking-[0.04em] rounded",
                activeCcy === c.code
                  ? "bg-paper text-ink"
                  : "bg-transparent text-[#9AA3C8]",
              )}
            >
              {c.code}
            </button>
          ))}
        </div>

        <div className="flex gap-px bg-[rgba(246,246,244,0.14)] p-px rounded">
          {LANGS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLang(l.key)}
              className={clsx(
                "min-h-[36px] sm:min-h-0 px-3 sm:px-[9px] py-1.5 font-sans text-[11px] font-medium rounded whitespace-nowrap",
                activeLang === l.key
                  ? "bg-paper text-ink"
                  : "bg-transparent text-[#9AA3C8]",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-[22px] bg-[rgba(246,246,244,0.2)]" />

        <Link
          href="/#contact"
          className="hidden sm:inline font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#9AA3C8] hover:text-paper whitespace-nowrap"
        >
          {t.contact}
        </Link>
      </div>
    </header>
  );
}
