"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { T, TAG_CN } from "@/lib/i18n";
import { FILTER_CODES } from "@/lib/filters";
import { money } from "@/lib/pricing";
import { clsx } from "@/lib/clsx";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { PlaceholderTile } from "./PlaceholderTile";

function TrustStrip({ lang }: { lang: "en" | "zh" }) {
  const t = T[lang];
  return (
    <div className="bg-ink-strip text-paper px-[clamp(18px,4vw,56px)] py-2.5 flex items-center justify-center gap-x-[22px] gap-y-3 flex-wrap font-mono text-[11.5px] tracking-[0.2em] uppercase">
      <span className="font-medium">{t.fdBadge}</span>
      <span className="w-[3px] h-[3px] rounded-full bg-[rgba(242,240,236,0.45)]" />
      {t.fdStrip.map((c) => (
        <span key={c} className="text-[#C3CAE6] whitespace-nowrap keep-all">
          {c}
        </span>
      ))}
    </div>
  );
}

export function Showroom() {
  const hydrated = useHydrated();
  const router = useRouter();
  const lang = useAppStore((s) => (hydrated ? s.lang : "en"));
  const currency = useAppStore((s) => (hydrated ? s.currency : "USD"));
  const openStyle = useAppStore((s) => s.openStyle);
  const t = T[lang];
  const zh = lang === "zh";

  const [filter, setFilter] = useState(0);

  const products = useMemo(() => {
    const codes = FILTER_CODES[filter];
    if (!codes) return PRODUCTS;
    return PRODUCTS.filter((p) => codes.includes(p.code));
  }, [filter]);

  function goToStyle(code: string) {
    openStyle(code);
    router.push("/customiser");
  }

  return (
    <div>
      <TrustStrip lang={lang} />

      {/* Hero */}
      <div className="grid border-b border-ink [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))]">
        <div className="px-[clamp(20px,4vw,56px)] pt-[clamp(40px,6vw,96px)] pb-[clamp(36px,5vw,72px)] flex flex-col justify-between bg-paper min-w-0">
          <div>
            <div className="font-mono text-[12px] tracking-[0.24em] uppercase text-indigo font-medium mb-[26px]">
              {t.heroEyebrow}
            </div>
            <h1 className="font-serif font-normal m-0 text-[clamp(48.5px,8.51vw,101px)] leading-[0.92] tracking-[-0.02em] max-w-[13ch] [text-wrap:balance] keep-all">
              {t.heroTitle}
            </h1>
            <p className="mt-[26px] mb-0 text-[clamp(17px,1.61vw,19.5px)] leading-[1.7] text-txt-2 max-w-[44ch] [text-wrap:pretty] keep-all">
              {t.heroBody}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-[30px] pt-[22px] border-t border-line">
              {t.heroChips.map((c) => (
                <span
                  key={c}
                  className="border border-line rounded px-3 py-2 font-mono text-[12px] tracking-[0.1em] uppercase text-txt-2 keep-all"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-10 flex-wrap">
            <Link
              href="/customiser"
              className="bg-ink text-paper px-[26px] py-4 font-sans text-[16px] font-medium tracking-[0.02em] rounded flex-1 min-w-[200px] text-center whitespace-nowrap hover:bg-indigo hover:text-paper transition-colors"
            >
              {t.heroCta}
            </Link>
            <a
              href="#contact"
              className="bg-transparent text-ink border border-ink px-[26px] py-4 font-sans text-[16px] font-medium rounded inline-flex items-center justify-center flex-1 min-w-[160px] whitespace-nowrap hover:bg-ink hover:text-paper transition-colors"
            >
              {t.heroCta2}
            </a>
          </div>
        </div>

        <div className="relative h-[clamp(320px,46vw,620px)] min-w-0 overflow-hidden border-t border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero-wide.png"
            alt="90s Wide-Leg jeans in 12oz raw indigo"
            className="absolute inset-0 w-full h-full object-cover bg-white"
            style={{ objectPosition: "50% 22%" }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-6 pt-10 pb-[18px] font-mono text-[12px] font-medium tracking-[0.18em] text-paper bg-[linear-gradient(to_top,rgba(11,13,18,0.85),rgba(11,13,18,0.5)_45%,transparent)] pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis">
            {t.heroBadge}
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="px-[clamp(18px,4vw,56px)] pt-[clamp(32px,4.5vw,56px)] pb-[22px] flex items-end justify-between gap-8 flex-wrap">
        <div className="flex gap-x-[26px] gap-y-3 flex-wrap">
          {t.filters.map((f, i) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(i)}
              className={clsx(
                "font-mono text-[11.5px] tracking-[0.18em] uppercase py-[7px] border-b whitespace-nowrap transition-colors",
                i === filter
                  ? "text-ink border-ink"
                  : "text-txt-3 border-[#CFCBC0] hover:text-ink hover:border-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-[clamp(18px,4vw,56px)] pb-[clamp(56px,7vw,96px)] grid gap-x-[clamp(14px,2vw,30px)] gap-y-[clamp(20px,2.6vw,40px)] grid-cols-2 sm:[grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr))]">
        {products.map((p) => (
          <div
            key={p.code}
            role="button"
            tabIndex={0}
            onClick={() => goToStyle(p.code)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToStyle(p.code);
              }
            }}
            className="cursor-pointer bg-transparent group"
          >
            <div className="relative aspect-[3/4] bg-white overflow-hidden">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.photo}
                  alt={zh ? p.cn : p.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain p-[14px] bg-white transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <PlaceholderTile code={p.code} hint={t.slotProduct} />
              )}
              <span className="absolute top-0 left-0 font-mono text-[10.5px] tracking-[0.16em] uppercase bg-ink text-paper px-2.5 py-1.5 pointer-events-none whitespace-nowrap">
                {zh && TAG_CN[p.tag] ? TAG_CN[p.tag] : p.tag}
              </span>
            </div>

            <div className="pt-4 px-0.5 flex flex-col gap-1.5">
              <div className="flex flex-col gap-0.5">
                <div className="font-serif font-normal text-[clamp(19.5px,1.72vw,23px)] tracking-[-0.005em] leading-[1.2] keep-all">
                  {zh ? p.cn : p.name}
                </div>
                {zh && (
                  <div className="text-[13px] text-txt-4 tracking-[0.04em] keep-all">
                    {p.name}
                  </div>
                )}
              </div>
              <div className="text-[14.5px] text-txt-3 leading-[1.5] keep-all">
                {zh ? p.cnDesc : p.desc}
              </div>
              <div className="flex items-baseline justify-between gap-2.5 flex-wrap mt-0.5 pt-[9px] border-t border-line">
                <div className="font-mono text-[14.5px] whitespace-nowrap">
                  {money(p.base, currency, 2)}
                </div>
                <div className="font-mono text-[10.5px] tracking-[0.14em] text-txt-4 whitespace-nowrap">
                  {t.fobPc}
                </div>
              </div>
              <div className="flex gap-[5px] mt-[5px]">
                {p.sw.map((h, i) => (
                  <span
                    key={i}
                    className="w-[14px] h-[14px] rounded-full"
                    style={{ background: h }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
