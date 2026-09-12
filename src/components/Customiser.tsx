"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FAM_PAIR,
  GROUPS,
  MOQ,
  PRODUCTS,
  SIZES,
  inFam,
  seedMeasurements,
} from "@/lib/data";
import { GROUP_CN, STEPS, T, optLabel, stepHint, stepLabel, stepTitle } from "@/lib/i18n";
import { famFor, styleFor } from "@/lib/pricing";
import { clsx } from "@/lib/clsx";
import type { GroupCode, Measurements } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";

const MEASURE_KEYS: (keyof Measurements)[] = [
  "waist",
  "hip",
  "thigh",
  "knee",
  "inseam",
  "opening",
];

const num = (v: number | string) => Number(v) || 0;

/**
 * Approximate how each wash/finish reads on the photograph. The product shots are
 * roughly a light-vintage cast, so that is the neutral point; rawer washes darken
 * and saturate, heavier washes lift and desaturate. Applied as a CSS filter with
 * a short transition — a state change, not decoration.
 */
const WASH_FX: Record<string, string> = {
  none: "brightness(0.82) saturate(1.22) contrast(1.07)",
  rinse: "brightness(0.9) saturate(1.12) contrast(1.04)",
  "vint-l": "brightness(1) saturate(1) contrast(1)",
  "vint-m": "brightness(1.07) saturate(0.9) contrast(0.99)",
  "vint-h": "brightness(1.14) saturate(0.78) contrast(0.97)",
  bleach: "brightness(1.24) saturate(0.58) contrast(0.95)",
  snow: "brightness(1.2) saturate(0.5) contrast(1.13)",
  mill: "brightness(0.96) saturate(1.04)",
  gmt: "brightness(1.03) saturate(0.96)",
  enzyme: "brightness(1.08) saturate(0.9)",
  crease: "brightness(0.98) saturate(1.02) contrast(1.03)",
  "s-mill": "brightness(0.96) saturate(1.04)",
  "s-gmt": "brightness(1.03) saturate(0.96)",
  "s-enzyme": "brightness(1.08) saturate(0.9)",
};

/** Extra filter for fabrics that visibly shift the base colour (stacked on the wash/finish). */
const FABRIC_FX: Record<string, string> = {
  blk11: "grayscale(0.82) brightness(0.6) contrast(1.12)",
  heavy14: "brightness(0.92) saturate(1.12)",
  rec12: "hue-rotate(-8deg) saturate(0.92)",
  emb: "saturate(0.9) hue-rotate(6deg)",
};

function GroupHeader({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3.5">
      <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-indigo">
        {label}
      </div>
      <div className="text-[12.5px] text-[#5C5F68] text-right keep-all">{value}</div>
    </div>
  );
}

/** Big, tappable number field with −/+ steppers. */
function Stepper({
  value,
  onChange,
  ariaLabel,
  min = 0,
  step = 1,
  className,
}: {
  value: number | string;
  onChange: (v: string) => void;
  ariaLabel: string;
  min?: number;
  step?: number;
  className?: string;
}) {
  const v = Number(value) || 0;
  const btn =
    "w-11 shrink-0 grid place-items-center text-[20px] leading-none text-[#4A4E58] select-none hover:bg-paper-raised active:bg-line disabled:opacity-30";
  return (
    <div
      className={clsx(
        "flex items-stretch h-11 border border-line rounded bg-white overflow-hidden focus-within:border-ink",
        className,
      )}
    >
      <button
        type="button"
        aria-label={`${ariaLabel} decrease`}
        disabled={v <= min}
        onClick={() => onChange(String(Math.max(min, v - step)))}
        className={btn}
      >
        &minus;
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 text-center font-mono text-[16px] text-ink outline-none border-x border-line bg-white"
      />
      <button
        type="button"
        aria-label={`${ariaLabel} increase`}
        onClick={() => onChange(String(v + step))}
        className={btn}
      >
        +
      </button>
    </div>
  );
}

export function Customiser() {
  const hydrated = useHydrated();
  const router = useRouter();
  const s = useAppStore();

  const lang = hydrated ? s.lang : "en";
  const zh = lang === "zh";
  const t = T[lang];

  const qty = num(s.qty);
  const style = styleFor(s.styleCode);
  const fam = famFor(style);
  const belowMoq = qty < MOQ;
  const runTotal = s.run.reduce<number>((a, b) => a + num(b), 0);
  const leadTime = qty >= 1000 ? 42 : 28;

  // The two groups whose values feed the preview caption / spec strip vary by family.
  const [pairCodeA, pairCodeB] = FAM_PAIR[fam];
  const pairA = GROUPS.find((g) => g.code === pairCodeA)?.values.find((v) => v.code === s.sel[pairCodeA]);
  const pairB = GROUPS.find((g) => g.code === pairCodeB)?.values.find((v) => v.code === s.sel[pairCodeB]);
  const hardwareGroup = GROUPS.find((g) => g.code === "hardware");
  const threadGroup = GROUPS.find((g) => g.code === "thread");
  const hardware = hardwareGroup?.values.find((v) => v.code === s.sel.hardware);
  const thread = threadGroup?.values.find((v) => v.code === s.sel.thread);

  const previewFilter = [WASH_FX[s.sel[pairCodeB]] ?? "", FABRIC_FX[s.sel[pairCodeA]] ?? ""]
    .filter(Boolean)
    .join(" ");

  /** The live swatch strip shown over the preview. */
  const specSwatches = [
    { label: zh ? "面料" : "Fabric", hex: pairA?.hex, name: pairA && optLabel(lang, pairCodeA as GroupCode, pairA.code, pairA.name) },
    { label: zh ? "工艺" : "Finish", hex: pairB?.hex, name: pairB && optLabel(lang, pairCodeB as GroupCode, pairB.code, pairB.name) },
    { label: zh ? "五金" : "Hardware", hex: hardware?.hex, name: hardware && optLabel(lang, "hardware", hardware.code, hardware.name) },
    { label: zh ? "缝线" : "Stitch", hex: thread?.hex, name: thread && optLabel(lang, "thread", thread.code, thread.name) },
  ].filter((x) => x.hex && x.name);

  const previewCaption = [
    zh ? style.cn : style.name,
    pairA ? optLabel(lang, pairCodeA as GroupCode, pairA.code, pairA.name) : "",
    pairB ? optLabel(lang, pairCodeB as GroupCode, pairB.code, pairB.name) : "",
  ]
    .filter(Boolean)
    .join(" · ");

  // Front/back preview toggle.
  const hasBackPhoto = !!style.photoBack;
  const showBack = s.previewView === "back" && hasBackPhoto;
  const mainPhoto = showBack ? style.photoBack! : style.photo;
  const altPhoto = showBack ? style.photo : style.photoBack;
  const altViewLabel = showBack ? t.frontView : t.backView;

  const visibleGroups = GROUPS.filter((g) => g.step === s.step && inFam(g, fam));

  // Block adjustment is advanced: hide it unless the buyer has already tweaked a
  // measurement away from the standard grade. They can always open it manually.
  const blockCustomised = useMemo(() => {
    const seed = seedMeasurements();
    return SIZES.some((sz) =>
      MEASURE_KEYS.some((k) => num(s.m[sz]?.[k]) !== seed[sz][k]),
    );
  }, [s.m]);
  const [blockOpenOverride, setBlockOpenOverride] = useState<boolean | null>(null);
  const blockOpen = blockOpenOverride ?? blockCustomised;

  function goSummary(sampleOnly: boolean) {
    if (!sampleOnly && qty < MOQ) return;
    s.setSampleOnly(sampleOnly);
    router.push("/summary");
  }

  return (
    <div className="flex flex-col min-[900px]:grid min-[900px]:[grid-template-columns:minmax(0,1fr)_clamp(340px,32vw,460px)] min-[900px]:h-[calc(100vh-60px)] min-[900px]:min-h-[560px] min-[900px]:overflow-hidden">
      {/* ── Preview ───────────────────────────────────────────── */}
      <div className="relative bg-[#EDEEF2] flex flex-col h-[clamp(280px,44vh,420px)] shrink-0 min-[900px]:h-auto min-[900px]:min-h-0 min-[900px]:overflow-hidden">
        <div className="flex-1 relative min-h-0 min-w-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={mainPhoto}
            src={mainPhoto}
            alt={zh ? style.cn : style.name}
            className="absolute inset-0 w-full h-full object-contain p-[clamp(24px,4vw,48px)] bg-white"
            style={{
              filter: previewFilter,
              transition: "filter .4s ease",
            }}
          />
          {hasBackPhoto && (
            <button
              type="button"
              onClick={() => s.toggleView()}
              title={altViewLabel}
              className="absolute bottom-4 right-4 w-[clamp(74px,11%,116px)] aspect-[0.68] bg-white border border-ink overflow-hidden hover:border-indigo transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={altPhoto}
                alt={altViewLabel}
                className="w-full h-full object-contain block"
                style={{ filter: previewFilter }}
              />
              <div className="absolute left-0 bottom-0 right-0 py-[3px] text-center font-mono text-[8.5px] tracking-[0.14em] bg-[rgba(11,13,18,.78)] text-paper">
                {altViewLabel}
              </div>
            </button>
          )}
          <div className="absolute top-6 left-6 font-mono text-[10.5px] tracking-[0.16em] uppercase text-paper bg-[rgba(11,13,18,0.72)] px-[11px] py-[7px] pointer-events-none whitespace-nowrap">
            {style.code} · {zh ? style.cn : style.name}
          </div>
          <div className="absolute bottom-5 left-6 font-mono text-[11px] tracking-[0.1em] text-paper bg-[rgba(11,13,18,0.72)] px-3 py-2 pointer-events-none whitespace-nowrap max-w-[calc(100%-48px)] overflow-hidden text-ellipsis">
            {previewCaption}
          </div>
        </div>
        <div className="flex items-center gap-4 px-6 py-[18px] bg-paper border-t border-line shrink-0 flex-wrap">
          {specSwatches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {specSwatches.map((sw) => (
                <span
                  key={sw.label}
                  className="w-3.5 h-3.5 rounded-full border border-[rgba(11,13,18,0.2)] shrink-0"
                  style={{ background: sw.hex }}
                  title={`${sw.label}: ${sw.name}`}
                />
              ))}
            </div>
          )}
          <div className="ml-auto flex items-center gap-[18px] font-mono text-[10.5px] tracking-[0.12em] uppercase text-[#5C5F68]">
            <span
              className="cursor-not-allowed opacity-70"
              title="Not implemented in this build"
            >
              {t.saveConfig}
            </span>
            <span
              className="cursor-not-allowed opacity-70"
              title="Not implemented in this build"
            >
              {t.shareLink}
            </span>
          </div>
        </div>
      </div>

      {/* ── Panel ─────────────────────────────────────────────── */}
      <div className="bg-white border-t border-line min-[900px]:border-t-0 min-[900px]:border-l flex flex-col min-[900px]:min-h-0 min-[900px]:overflow-y-auto">
        {/* Sticky step header */}
        <div className="px-[18px] pt-[22px] pb-[18px] min-[900px]:px-[30px] min-[900px]:pt-[26px] min-[900px]:pb-5 border-b border-[#EAEAE6] bg-white min-[900px]:shrink-0 min-[900px]:sticky min-[900px]:top-0 z-[3]">
          <div className="flex gap-1.5 mb-5 flex-wrap">
            {STEPS.map((step, i) => {
              const n = (i + 1) as 1 | 2 | 3 | 4;
              const active = s.step === n;
              return (
                <button
                  key={step.no}
                  type="button"
                  onClick={() => s.setStep(n)}
                  className={clsx(
                    "flex-1 px-2.5 pt-[9px] pb-2.5 text-[12.5px] font-medium rounded text-left",
                    active ? "bg-ink text-paper" : "bg-[#F2F2EE] text-[#7A7E8A]",
                  )}
                >
                  <span className="block font-mono text-[9.5px] tracking-[0.12em] opacity-60">
                    {step.no}
                  </span>
                  {stepLabel(step, fam, zh)}
                </button>
              );
            })}
          </div>
          <h2 className="font-display font-bold m-0 text-[clamp(22px,2.2vw,27px)] leading-[1.18] tracking-[-0.025em]">
            {stepTitle(STEPS[s.step - 1], fam, zh)}
          </h2>
          <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.6] text-txt-3 [text-wrap:pretty] keep-all">
            {stepHint(STEPS[s.step - 1], fam, zh)}
          </p>
        </div>

        {/* Scrolling body */}
        <div className="px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-6 pb-2 flex flex-col gap-8">
          {/* Step 1 — base style picker */}
          {s.step === 1 && (
            <div>
              <div className="mb-3.5">
                <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-indigo">
                  {t.baseStyleHead}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {PRODUCTS.map((p) => {
                  const on = p.code === s.styleCode;
                  return (
                    <button
                      key={p.code}
                      type="button"
                      onClick={() => s.setStyle(p.code)}
                      className={clsx(
                        "flex justify-between items-center gap-4 text-left px-[15px] py-[13px] border rounded",
                        on ? "border-ink bg-paper-raised" : "border-[#E8E8E4] bg-white",
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-[14px] font-medium keep-all">
                          {zh ? p.cn : p.name}
                        </div>
                        <div className="text-[12.5px] text-[#4A4E58] mt-0.5 leading-[1.4] keep-all">
                          {zh ? p.cnDesc : p.desc}
                        </div>
                      </div>
                      {zh && (
                        <div className="text-[11.5px] text-[#5C5F68] whitespace-nowrap shrink-0">
                          {p.name}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steps 2 & 3 — option groups, filtered to the style's family */}
          {visibleGroups.map((g) => {
            const cur = s.sel[g.code];
            const curVal = g.values.find((v) => v.code === cur);
            return (
              <div key={g.code}>
                <GroupHeader
                  label={zh && GROUP_CN[g.code] ? GROUP_CN[g.code] : g.name}
                  value={
                    curVal
                      ? optLabel(lang, g.code as GroupCode, curVal.code, curVal.name)
                      : "—"
                  }
                />

                {g.control === "swatch" ? (
                  <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,92px),1fr))]">
                    {g.values.map((v) => {
                      const on = v.code === cur;
                      return (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => s.pick(g.code, v.code)}
                          className={clsx(
                            "text-left p-[9px] border rounded",
                            on ? "border-ink bg-paper-raised" : "border-[#E8E8E4] bg-white",
                          )}
                        >
                          <div
                            className="w-full aspect-square rounded-[1px]"
                            style={{
                              background: v.hex || "#8C99B5",
                              boxShadow: on
                                ? "inset 0 0 0 2px #FFF, inset 0 0 0 3px #22307A"
                                : "none",
                            }}
                          />
                          <div className="text-[12.5px] font-medium leading-[1.25] mt-2 keep-all">
                            {optLabel(lang, g.code as GroupCode, v.code, v.name)}
                          </div>
                          {(zh ? v.cnDesc || v.desc : v.desc) && (
                            <div className="text-[11px] text-[#5C5F68] mt-[3px] leading-[1.35] keep-all">
                              {zh ? v.cnDesc || v.desc : v.desc}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {g.values.map((v) => {
                      const on = v.code === cur;
                      return (
                        <button
                          key={v.code}
                          type="button"
                          onClick={() => s.pick(g.code, v.code)}
                          className={clsx(
                            "flex justify-between items-center gap-4 text-left px-4 py-3.5 border rounded",
                            on ? "border-ink bg-paper-raised" : "border-[#E8E8E4] bg-white",
                          )}
                        >
                          <div>
                            <div className="text-[14px] font-medium keep-all">
                              {optLabel(lang, g.code as GroupCode, v.code, v.name)}
                            </div>
                            <div className="text-[12.5px] text-[#4A4E58] mt-0.5 leading-[1.4] keep-all">
                              {zh ? v.cnDesc || v.desc : v.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Step 4 — size run + block adjustment */}
          {s.step === 4 && (
            <>
              {/* ---- Size run allocation ---- */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-indigo">
                    {zh ? t.kSizeRun : "Size run"}
                  </div>
                  <button
                    type="button"
                    onClick={() => s.evenSplitRun()}
                    className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-[#4A4E58] border border-line rounded px-3 h-8 hover:border-ink hover:text-ink transition-colors"
                  >
                    {zh ? "平均分配" : "Even split"}
                  </button>
                </div>
                <p className="text-[12.5px] leading-[1.5] text-[#4A4E58] mb-4 keep-all">
                  {t.sizeRunNote}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  {SIZES.map((sz, i) => (
                    <div key={sz} className="flex items-center gap-3">
                      <span className="font-mono text-[13px] tracking-[0.04em] text-[#4A4E58] font-medium w-11 shrink-0">
                        {sz}
                      </span>
                      <Stepper
                        value={s.run[i] ?? ""}
                        onChange={(v) => s.setRun(i, v)}
                        ariaLabel={`${sz} quantity`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>

                {/* Balance status — prominent; a one-tap fix when it drifts */}
                {runTotal === qty ? (
                  <div className="flex items-center justify-between gap-3 px-4 h-12 rounded text-[13.5px] font-medium mb-[34px] bg-info-bg text-indigo">
                    <span>{zh ? "已配平" : "Balanced"}</span>
                    <span className="font-mono">
                      {runTotal} {t.pcsLower}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => s.balanceRun()}
                    className="flex items-center justify-between gap-3 w-full px-4 h-12 rounded text-[13.5px] font-medium mb-[34px] bg-error-bg text-error-tx hover:brightness-95 transition-[filter]"
                  >
                    <span>
                      {runTotal} {t.of} {qty} {t.pcsLower} ·{" "}
                      {runTotal < qty
                        ? zh
                          ? `还差 ${qty - runTotal}`
                          : `${qty - runTotal} short`
                        : zh
                          ? `超出 ${runTotal - qty}`
                          : `${runTotal - qty} over`}
                    </span>
                    <span className="font-mono underline underline-offset-2 whitespace-nowrap">
                      {zh ? "自动配平" : "Balance"}
                    </span>
                  </button>
                )}
              </div>

              {/* ---- Block adjustment by size (advanced, collapsed by default) ---- */}
              <div className="border border-line rounded">
                <button
                  type="button"
                  onClick={() => setBlockOpenOverride(!blockOpen)}
                  aria-expanded={blockOpen}
                  className="flex items-center justify-between gap-3 w-full px-4 py-3.5 text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[11px] tracking-[0.16em] uppercase text-indigo">
                      {t.blockHead}
                    </span>
                    <span className="block text-[12px] text-[#5C5F68] mt-1 keep-all">
                      {blockCustomised
                        ? zh
                          ? "已调整 — 与标准码不同"
                          : "Adjusted — differs from the standard grade"
                        : zh
                          ? "标准码 W28–W38 · 如需自定义尺寸请展开"
                          : "Standard grade W28–W38 · open to fit your own spec"}
                    </span>
                  </span>
                  <span
                    className={clsx(
                      "shrink-0 font-mono text-[16px] text-[#5C5F68] transition-transform",
                      blockOpen && "rotate-45",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {blockOpen && (
                  <div className="px-4 pb-4 pt-1">
                    <p className="text-[12.5px] leading-[1.5] text-[#4A4E58] mb-3.5 keep-all">
                      {zh
                        ? "选择尺码，编辑该尺码的六个尺寸（厘米）。每个尺码独立保存。"
                        : "Pick a size, then edit its six measurements in cm. Each size is stored on its own."}
                    </p>

                    <div className="grid grid-cols-6 gap-1.5 mb-5">
                      {SIZES.map((sz) => {
                        const on = s.blockSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => s.setBlockSize(sz)}
                            className={clsx(
                              "h-11 font-mono text-[12px] tracking-[0.02em] rounded border transition-colors",
                              on
                                ? "border-ink bg-ink text-paper"
                                : "border-line bg-white text-[#4A4E58] hover:border-ink",
                            )}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-[#5C5F68]">
                        {zh ? "正在编辑" : "Editing"}
                      </span>
                      <span className="font-mono text-[13px] font-medium text-ink">
                        {s.blockSize}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                      {MEASURE_KEYS.map((key, i) => (
                        <label key={key} className="flex flex-col gap-1.5">
                          <span className="text-[13px] text-[#4A4E58] font-medium">
                            {t.measures[i]}
                          </span>
                          <span className="flex items-center border border-line rounded px-3 h-12 bg-white focus-within:border-ink">
                            <input
                              type="number"
                              inputMode="decimal"
                              aria-label={t.measures[i]}
                              value={s.m[s.blockSize]?.[key] ?? ""}
                              onChange={(e) =>
                                s.setMeasure(s.blockSize, key, e.target.value)
                              }
                              className="border-0 bg-transparent outline-none font-mono text-[16px] w-full min-w-0 text-ink"
                            />
                            <span className="font-mono text-[11px] text-[#5C5F68] shrink-0 pl-1">
                              cm
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4 bg-[#F0F1F6] px-4 py-3.5 text-[12.5px] leading-[1.55] text-[#3E4250] keep-all">
                      {zh
                        ? `当前编辑 ${s.blockSize} 尺码。版型调整需额外 4 天版房工作 — 版房出格、车缝并寄出封样，确认后方可开裁大货。`
                        : `Editing ${s.blockSize}. A modified block adds 4 days of pattern work — the pattern room grades, sews and ships a sealed sample for your sign-off before bulk cutting.`}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quantity block */}
        <div className="border-t border-[#EAEAE6] px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-5 pb-4 bg-paper-raised min-[900px]:shrink-0">
          <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
            <div className="min-w-0 flex-1 basis-[200px]">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5C5F68] mb-[7px]">
                {t.qtyHead}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center border border-line bg-white h-10 px-3 rounded focus-within:border-ink">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={s.qty}
                    onChange={(e) => s.setQty(e.target.value)}
                    onBlur={() => s.balanceRun()}
                    className="border-0 outline-none bg-transparent font-mono text-[16px] w-[60px] text-ink"
                  />
                  <span className="font-mono text-[10.5px] text-[#5C5F68] tracking-[0.08em]">
                    {t.pcs}
                  </span>
                </span>
                {[200, 300, 500, 1000, 2500].map((n) => {
                  const on = qty === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => s.setQtyBalanced(n)}
                      className={clsx(
                        "h-10 px-[13px] font-mono text-[11.5px] tracking-[0.06em] rounded border",
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-white text-[#4A4E58]",
                      )}
                    >
                      {n >= 1000 ? `${n / 1000}k` : n}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {belowMoq && (
            <div className="bg-error-bg text-error-tx px-3.5 py-[11px] text-[12.5px] leading-[1.5] mb-3.5">
              {t.belowMoqNote}
            </div>
          )}

          <div className="flex justify-between gap-3 pt-3 border-t border-line-soft font-mono text-[11px] text-[#5C5F68] flex-wrap">
            <span>FOB GUANGZHOU</span>
            <span>
              {leadTime} {zh ? t.days : "DAYS"} · ~4 WEEKS
            </span>
          </div>
        </div>

        {/* Sticky CTA bar */}
        <div className="sticky bottom-0 bg-white border-t border-line-soft px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-3.5 pb-4 shrink-0 z-[3] shadow-bar">
          <div className="mb-3 text-[12.5px] text-[#5C5F68] keep-all">
            {t.quoteNote}
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              disabled={belowMoq}
              onClick={() => goSummary(false)}
              className={clsx(
                "flex-1 px-3.5 py-3.5 font-display text-[14.5px] font-bold rounded tracking-[0.005em] whitespace-nowrap",
                belowMoq
                  ? "bg-[#D8D8D2] text-[#5C5F68] cursor-not-allowed"
                  : "bg-ink text-paper cursor-pointer hover:bg-indigo transition-colors",
              )}
            >
              {belowMoq
                ? t.ctaMin
                : `${t.ctaGo} · ${qty} ${t.pcsLower}`}
            </button>
            <button
              type="button"
              onClick={() => goSummary(true)}
              className="bg-white border border-[#C9CAD2] px-[18px] py-3.5 font-sans text-[13.5px] rounded whitespace-nowrap hover:border-ink transition-colors"
            >
              {t.samplingOnly}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
