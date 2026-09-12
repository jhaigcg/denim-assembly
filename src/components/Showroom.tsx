"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/data";
import { T, TAG_CN } from "@/lib/i18n";
import { FILTER_CODES } from "@/lib/filters";
import { clsx } from "@/lib/clsx";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";

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
  const openStyle = useAppStore((s) => s.openStyle);
  const t = T[lang];
  const zh = lang === "zh";

  const heroSpecs = t.heroSpecLabels.map((label, i) => ({
    label,
    value: t.heroSpecValues[i],
  }));

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
            <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-txt-3 mb-[clamp(26px,3vw,38px)]">
              {t.heroEyebrow2}
            </div>
            <h1 className="font-display font-bold m-0 text-[clamp(40px,6.6vw,78px)] leading-[0.98] tracking-[-0.035em] max-w-[13ch] [text-wrap:balance] keep-all">
              {t.heroTitle}
            </h1>
            <p className="mt-[26px] mb-0 text-[clamp(15px,1.4vw,17px)] leading-[1.7] text-txt-2 max-w-[44ch] [text-wrap:pretty] keep-all">
              {t.heroBody}
            </p>
            <div className="grid gap-x-[26px] gap-y-5 mt-[clamp(28px,3.5vw,44px)] pt-[22px] border-t border-line [grid-template-columns:repeat(auto-fit,minmax(120px,1fr))]">
              {heroSpecs.map((c) => (
                <div key={c.label}>
                  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-txt-3 mb-[7px]">
                    {c.label}
                  </div>
                  <div className="text-[14.5px] font-medium tracking-[-0.005em] text-ink whitespace-nowrap">
                    {c.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[clamp(18px,2.5vw,30px)] mt-[clamp(32px,4vw,46px)] flex-wrap">
            <Link
              href="/customiser"
              className="bg-ink text-paper px-[34px] py-[18px] font-display text-[14.5px] font-bold tracking-[0.01em] rounded whitespace-nowrap hover:bg-indigo transition-colors"
            >
              {t.heroCta}
            </Link>
            <a
              href="#contact"
              className="text-ink font-sans text-[14px] font-medium border-b border-ink pb-[3px] hover:text-indigo hover:border-indigo transition-colors"
            >
              {t.heroCta2}
            </a>
          </div>
        </div>

        <div className="relative h-[clamp(340px,48vw,660px)] min-w-0 overflow-hidden bg-white border-t border-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/pd18-stephanie.png"
            alt="Barrel Denim Jeans"
            className="absolute inset-0 w-full h-full object-contain px-[clamp(18px,3vw,44px)] pt-[clamp(18px,3vw,44px)] pb-[clamp(52px,5vw,72px)]"
          />
          <div className="absolute top-[clamp(18px,3vw,32px)] right-[clamp(18px,3vw,32px)] [writing-mode:vertical-rl] font-mono text-[10.5px] tracking-[0.24em] uppercase text-txt-3 pointer-events-none">
            {t.heroStyleRef}
          </div>
          <div className="absolute left-[clamp(18px,3vw,32px)] right-[clamp(18px,3vw,32px)] bottom-[clamp(18px,3vw,28px)] flex items-center gap-3.5 pointer-events-none">
            <span className="w-[22px] h-px bg-ink shrink-0" />
            <span className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-[#3E3B35] whitespace-nowrap overflow-hidden text-ellipsis">
              {t.heroBadge}
            </span>
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
                "font-mono text-[10px] tracking-[0.18em] uppercase py-[7px] border-b whitespace-nowrap transition-colors",
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.photo}
                alt={zh ? p.cn : p.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain p-[14px] bg-white transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute top-0 left-0 font-mono text-[9px] tracking-[0.16em] uppercase bg-ink text-paper px-2.5 py-1.5 pointer-events-none whitespace-nowrap">
                {zh && TAG_CN[p.tag] ? TAG_CN[p.tag] : p.tag}
              </span>
            </div>

            <div className="pt-4 px-0.5 flex flex-col gap-1.5">
              <div className="flex flex-col gap-0.5">
                <div className="font-display font-medium text-[clamp(16px,1.4vw,18.5px)] tracking-[-0.015em] leading-[1.2] keep-all">
                  {zh ? p.cn : p.name}
                </div>
                {zh && (
                  <div className="text-[11.5px] text-txt-4 tracking-[0.04em] keep-all">
                    {p.name}
                  </div>
                )}
              </div>
              <div className="text-[12.5px] text-txt-3 leading-[1.5] keep-all">
                {zh ? p.cnDesc : p.desc}
              </div>
              <div className="flex gap-[5px] mt-[7px] pt-[9px] border-t border-line">
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
