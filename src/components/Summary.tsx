"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FACTORY_EMAIL,
  FORM_ENDPOINT,
  GROUPS,
  SAMPLE_FEE,
  SIZES,
} from "@/lib/data";
import { GROUP_CN, T, optLabel } from "@/lib/i18n";
import {
  money,
  orderTotal,
  priceLines,
  styleFor,
  tierFor,
  tierLabel,
} from "@/lib/pricing";
import { clsx } from "@/lib/clsx";
import type { ContactDetails, GroupCode } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { Logo } from "./Logo";

const num = (v: number | string) => Number(v) || 0;

const MonoHead = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-indigo mb-4">
    {children}
  </div>
);

export function Summary() {
  const hydrated = useHydrated();
  const router = useRouter();
  const s = useAppStore();
  const [quoteDate, setQuoteDate] = useState("");

  const lang = s.lang;
  const currency = s.currency;
  const zh = lang === "zh";
  const t = T[lang];

  const qty = num(s.qty);
  const style = styleFor(s.styleCode);
  const { unit } = priceLines(s.styleCode, s.sel, qty, lang);
  const tier = tierFor(qty);
  const total = orderTotal(unit, qty);
  const sampleOnly = s.sampleOnly;

  const sampleSize =
    SIZES[
      s.run.reduce<number>(
        (best, v, i, arr) => (num(v) > num(arr[best]) ? i : best),
        0,
      )
    ];

  const ref = s.quoteRef;

  useEffect(() => {
    s.ensureQuoteRef();
    setQuoteDate(
      new Date().toLocaleDateString(zh ? "zh-CN" : "en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zh]);

  const specRows = useMemo(() => {
    const rows: { k: string; v: string }[] = [
      { k: t.kBaseStyle, v: zh ? `${style.cn} · ${style.name}` : style.name },
    ];
    for (const g of GROUPS) {
      const v = g.values.find((x) => x.code === s.sel[g.code]);
      const name = v
        ? optLabel(lang, g.code as GroupCode, v.code, v.name)
        : "—";
      rows.push({
        k: zh && GROUP_CN[g.code] ? GROUP_CN[g.code] : g.name,
        v: v
          ? name +
            (v.d
              ? `  (+${money(v.d, currency, 2)}${zh ? "/条)" : "/pc)"}`
              : "")
          : "—",
      });
    }
    if (sampleOnly) {
      rows.push(
        { k: t.kSampleQty, v: zh ? "封样 1 条" : "1 sealed sample" },
        { k: t.kSampleSize, v: sampleSize },
        {
          k: t.kBulkQty,
          v: `${qty.toLocaleString("en-US")} ${t.pcsLower}${zh ? "（参考）" : " (indicative)"}`,
        },
      );
    } else {
      rows.push(
        { k: t.kQty, v: `${qty.toLocaleString("en-US")} ${t.pcsLower}` },
        {
          k: t.kSizeRun,
          v: SIZES.map((sz, i) => `${sz.replace("W", "")}×${s.run[i] || 0}`).join(
            "  ·  ",
          ),
        },
        { k: t.kTier, v: tierLabel(tier, lang) },
      );
    }
    return rows;
  }, [
    lang,
    zh,
    currency,
    style,
    s.sel,
    s.run,
    qty,
    sampleOnly,
    sampleSize,
    tier,
    t,
  ]);

  const totalRows = sampleOnly
    ? [
        { k: t.kSealed, v: money(SAMPLE_FEE, currency, 2) },
        {
          k: `${t.kBulkPrice} ${qty.toLocaleString("en-US")} ${t.pcsLower}`,
          v: `${money(unit, currency, 2)} ${t.perPc}`,
        },
        { k: t.kFreight, v: t.freightVal },
      ]
    : [
        { k: t.kUnit, v: money(unit, currency, 2) },
        {
          k: `${t.kLine} · ${qty.toLocaleString("en-US")} ${t.pcsLower}`,
          v: money(unit * qty, currency),
        },
        { k: t.kSampling, v: money(SAMPLE_FEE, currency, 2) },
      ];

  const grand = sampleOnly
    ? money(SAMPLE_FEE, currency, 2)
    : money(total, currency);
  const grandLabel = sampleOnly ? t.grandSample : t.grandTotal;

  const summaryTerms = sampleOnly
    ? zh
      ? `按此规格车缝封样一条，费用 ${money(SAMPLE_FEE, currency, 2)}（另加运费），约需 10 天。该费用可在首个大货订单（起订 100 条）中抵扣。`
      : `One sealed sample sewn to this specification, charged at ${money(SAMPLE_FEE, currency, 2)} plus freight. Approx. 10 days. The fee is credited against your first bulk order (MOQ 100 pcs).`
    : t.termsBulk;

  const canSubmit = !!(s.contact.company && s.contact.email);

  async function submitSpec() {
    if (!canSubmit || s.submitState === "sending") return;
    const theRef = s.ensureQuoteRef();
    const subject = `Customisation request ${theRef} — ${s.contact.company}`;

    s.setSubmitState("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ref: theRef,
          lang,
          currency,
          styleCode: s.styleCode,
          sel: s.sel,
          qty,
          run: s.run.map(num),
          sampleOnly,
          contact: s.contact,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; delivered?: boolean }
        | null;

      if (res.ok && data?.ok && data.delivered) {
        s.setSubmitState("sent");
      } else if (res.ok && data?.ok) {
        // Stored but not emailed (no transport configured) — hand off to mail client.
        s.setSubmitState("handoff");
        openMailto(subject);
      } else {
        s.setSubmitState("failed");
      }
    } catch {
      s.setSubmitState("failed");
    }
  }

  function openMailto(subject: string) {
    const body = buildMailBody();
    window.location.href = `mailto:${FACTORY_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  function buildMailBody() {
    const opts = GROUPS.map((g) => {
      const v = g.values.find((x) => x.code === s.sel[g.code]);
      return `${g.name}: ${v ? v.name : "—"}`;
    });
    return [
      `Denim Assembly — customisation request ${s.quoteRef || ""}`,
      "",
      `Company: ${s.contact.company}`,
      `Contact: ${s.contact.name || "—"}  <${s.contact.email}>`,
      `Country / port: ${s.contact.country || "—"}`,
      "",
      `Base style: ${style.name}`,
      ...opts,
      `Quantity: ${qty} pcs`,
      `Size run: ${SIZES.map((sz, i) => `${sz}×${s.run[i] || 0}`).join(", ")}`,
      `Unit price: ${money(unit, currency, 2)} ${currency} FOB`,
      `${sampleOnly ? "Sample cost" : "Order total"}: ${grand} ${currency}`,
      "",
      `Notes: ${s.contact.notes || "—"}`,
    ].join("\n");
  }

  if (!hydrated) {
    return <div className="max-w-sheet mx-auto px-6 py-16" aria-busy />;
  }

  const banner = bannerFor(s.submitState, lang);

  return (
    <div
      id="summary-sheet"
      className="max-w-sheet mx-auto px-[clamp(16px,3.4vw,40px)] pt-[clamp(28px,4vw,56px)] pb-[clamp(56px,7vw,88px)]"
    >
      <div className="no-print flex justify-between items-center gap-4 mb-8 flex-wrap">
        <button
          type="button"
          onClick={() => router.push("/customiser")}
          className="bg-transparent border border-[#C9CAD2] px-[18px] py-[11px] font-sans text-[13px] rounded whitespace-nowrap shrink-0 hover:border-ink transition-colors"
        >
          {t.editSpec}
        </button>
        {banner && (
          <div
            className={clsx(
              "flex items-center gap-2.5 px-4 py-[11px] text-[13px] max-w-[52ch] leading-[1.5]",
              s.submitState === "failed"
                ? "bg-error-bg text-error-tx"
                : "bg-info-bg text-indigo",
            )}
          >
            {banner}
          </div>
        )}
      </div>

      <div className="sheet-card bg-white border border-line">
        {/* Masthead */}
        <div className="flex justify-between items-start gap-x-8 gap-y-6 px-[clamp(20px,3.4vw,40px)] pt-[clamp(24px,3.4vw,36px)] pb-[26px] border-b border-ink flex-wrap">
          <div>
            <Logo variant="sheet" />
            <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-[#5C5F68] mt-1.5">
              {t.tagline} · {t.fdBadge}
            </div>
            <h1 className="font-serif font-normal text-[clamp(30px,4vw,42px)] leading-[1.04] tracking-[-0.015em] mt-6 mb-0">
              {sampleOnly ? t.summarySample : t.summarySpec}
            </h1>
          </div>
          <div className="font-mono text-[11px] leading-[2] text-[#4A4E58] text-right">
            <div>
              {t.ref} {ref || "—"}
            </div>
            <div>{quoteDate}</div>
            <div>
              {zh ? "报价币种 " : "QUOTED IN "}
              {currency}
            </div>
            <div className="text-indigo">{t.valid}</div>
          </div>
        </div>

        {/* Body */}
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr))]">
          <div className="px-[clamp(20px,3.4vw,40px)] pt-7 pb-8 border-r border-line-soft-2">
            <MonoHead>{t.yourSpec}</MonoHead>
            <div className="flex flex-col">
              {specRows.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-5 py-[11px] border-b border-[#F2F2EE] text-[13.5px]"
                >
                  <span className="text-[#4A4E58] whitespace-nowrap keep-all">
                    {r.k}
                  </span>
                  <span className="font-medium text-right keep-all">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-[clamp(20px,3.4vw,40px)] pt-7 pb-8 bg-paper-raised">
            <MonoHead>{t.pricingHead}</MonoHead>
            {totalRows.map((r, i) => (
              <div
                key={i}
                className="flex justify-between gap-4 py-[9px] text-[13.5px] text-[#4A4E58]"
              >
                <span className="keep-all">{r.k}</span>
                <span className="font-mono text-ink whitespace-nowrap">{r.v}</span>
              </div>
            ))}
            <div className="flex justify-between items-baseline gap-4 mt-3.5 pt-3.5 border-t border-line">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#5C5F68]">
                {grandLabel}
              </span>
              <span className="font-serif font-normal text-[clamp(27px,3.2vw,34px)] tracking-[-0.01em]">
                {grand}
              </span>
            </div>
            <div className="mt-[18px] text-[12px] leading-[1.6] text-[#4A4E58] [text-wrap:pretty] keep-all">
              {summaryTerms}
            </div>
          </div>
        </div>

        {/* Details form */}
        <div className="px-[clamp(20px,3.4vw,40px)] pt-7 pb-[34px] border-t border-line-soft-2">
          <MonoHead>{t.yourDetails}</MonoHead>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
            {(["company", "name", "email", "country"] as (keyof ContactDetails)[]).map(
              (key, i) => (
                <label key={key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] text-[#5C5F68]">
                    {t.fields[i][0]}
                    {(key === "company" || key === "email") && (
                      <span className="text-error-tx"> *</span>
                    )}
                  </span>
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={s.contact[key]}
                    onChange={(e) => s.setContact({ [key]: e.target.value })}
                    placeholder={t.fields[i][1]}
                    className="border border-line bg-white rounded h-[46px] px-3 font-sans text-[16px] text-ink outline-none w-full focus:border-ink"
                  />
                </label>
              ),
            )}
          </div>
          <label className="flex flex-col gap-1.5 mt-3.5">
            <span className="text-[12px] text-[#5C5F68]">{t.notesLabel}</span>
            <textarea
              rows={3}
              value={s.contact.notes}
              onChange={(e) => s.setContact({ notes: e.target.value })}
              placeholder={t.notesPh}
              className="border border-line bg-white rounded p-3 font-sans text-[16px] text-ink outline-none w-full resize-y focus:border-ink"
            />
          </label>

          <div className="no-print flex flex-col sm:flex-row gap-2.5 mt-5 sm:flex-wrap">
            <button
              type="button"
              disabled={!canSubmit || s.submitState === "sending"}
              onClick={submitSpec}
              className={clsx(
                "sm:flex-1 px-4 py-4 font-sans text-[14px] font-medium rounded",
                canSubmit
                  ? "bg-ink text-paper cursor-pointer hover:bg-indigo transition-colors"
                  : "bg-[#D8D8D2] text-[#5C5F68] cursor-not-allowed",
              )}
            >
              {s.submitState === "sending"
                ? zh
                  ? "正在发送…"
                  : "Sending…"
                : t.submitBtn}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-white border border-ink px-[22px] py-4 font-sans text-[14px] rounded whitespace-nowrap text-center hover:bg-ink hover:text-paper transition-colors"
            >
              {t.savePdf}
            </button>
          </div>
          <div className="no-print mt-3 text-[12px] text-[#5C5F68] keep-all">
            {zh
              ? `公司名称与邮箱为必填项。提交后将以本汇总发送邮件至 ${FACTORY_EMAIL}，您也可保存 PDF 后自行发送。`
              : `Company and email are required. Submitting sends this summary to ${FACTORY_EMAIL} — or save the PDF and send it yourself.`}
          </div>
        </div>
      </div>
    </div>
  );
}

function bannerFor(
  state: ReturnType<typeof useAppStore.getState>["submitState"],
  lang: "en" | "zh",
) {
  if (state === "idle") return null;
  const zh = lang === "zh";
  switch (state) {
    case "sent":
      return zh
        ? `规格已发送至 ${FACTORY_EMAIL}，我们将在一个工作日内回复。`
        : `Specification sent to ${FACTORY_EMAIL}. We reply within one business day.`;
    case "sending":
      return zh ? "正在发送您的定制规格…" : "Sending your specification…";
    case "failed":
      return zh
        ? `自动发送失败，请将本汇总发送至 ${FACTORY_EMAIL}，或保存 PDF 后作为附件发送。`
        : `We could not send automatically. Please email this summary to ${FACTORY_EMAIL} — or save the PDF and attach it.`;
    case "handoff":
    default:
      return zh
        ? `您的邮件客户端正在打开并已填入本汇总 — 请点击发送。若未打开，请直接发邮件至 ${FACTORY_EMAIL}。`
        : `Your mail client is opening with this summary in a draft — press send to reach us. Not opening? Email ${FACTORY_EMAIL} directly.`;
  }
}
