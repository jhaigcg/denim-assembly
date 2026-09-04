"use client";

import { FACTORY_ADDRESS, FACTORY_EMAIL } from "@/lib/data";
import { T } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { Logo } from "./Logo";

const MonoLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#6E7691] mb-4">
    {children}
  </div>
);

export function Footer() {
  const hydrated = useHydrated();
  const lang = useAppStore((s) => s.lang);
  const t = T[hydrated ? lang : "en"];

  return (
    <footer
      id="contact"
      className="app-footer bg-ink-warm text-paper px-[clamp(20px,4vw,56px)] pt-[clamp(46px,6.5vw,76px)] pb-8"
    >
      <div className="grid gap-[clamp(32px,4vw,44px)] pb-[clamp(32px,4vw,44px)] border-b border-[rgba(246,246,244,0.16)] [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
        <div>
          <Logo variant="footer" />
          <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#9AA3C8] mt-2">
            {t.tagline}
          </div>
          <p className="font-serif mt-[22px] text-[clamp(16px,1.5vw,19px)] leading-[1.5] text-[#D8D4CB] max-w-[26ch] [text-wrap:pretty]">
            {t.footerBlurb}
          </p>
          <div className="inline-block mt-[18px] font-mono text-[10px] tracking-[0.16em] uppercase border border-[rgba(246,246,244,0.3)] px-[11px] py-[7px]">
            {t.fdBadge}
          </div>
        </div>

        <div>
          <MonoLabel>{t.factory}</MonoLabel>
          <div className="flex flex-col gap-[7px] text-[13.5px] leading-[1.5] text-[#D4D7DE] keep-all">
            {FACTORY_ADDRESS.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>

        <div>
          <MonoLabel>{t.enquiries}</MonoLabel>
          <div className="flex flex-col gap-[9px] text-[13.5px] text-[#D4D7DE]">
            <a href={`mailto:${FACTORY_EMAIL}`} className="text-paper hover:text-white">
              {FACTORY_EMAIL}
            </a>
            <span>{t.whatsapp}</span>
            <span>{t.hours}</span>
          </div>
        </div>

        <div>
          <MonoLabel>{t.tradeTerms}</MonoLabel>
          <div className="flex flex-col gap-[9px] text-[13.5px] text-[#D4D7DE] keep-all">
            {t.termsList.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-5 pt-[22px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-[#6E7691] flex-wrap">
        <span>{t.copyright}</span>
        <span className="flex gap-6 flex-wrap">
          {t.legal.map((x) => (
            <a key={x} href="/#contact" className="text-[#9AA3C8] hover:text-white">
              {x}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
