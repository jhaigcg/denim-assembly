"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GROUPS,
  MOQ,
  PRODUCTS,
  SAMPLE_FEE,
  SIZES,
  seedMeasurements,
} from "@/lib/data";
import { GROUP_CN, STEPS, T, optLabel } from "@/lib/i18n";
import {
  money,
  orderTotal,
  priceLines,
  styleFor,
  tierFor,
  tierLabel,
} from "@/lib/pricing";
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
 * Approximate how each wash reads on the base photograph. The product shots are
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
};

/** Extra filter for fabrics that visibly shift the base indigo (stacked on the wash). */
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
      <div className="font-mono text-[12px] tracking-[0.16em] uppercase text-indigo">
        {label}
      </div>
      <div className="text-[14.5px] text-[#5C5F68] text-right keep-all">{value}</div>
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
    "w-11 shrink-0 grid place-items-center text-[23px] leading-none text-[#4A4E58] select-none hover:bg-paper-raised active:bg-line disabled:opacity-30";
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
        className="w-full min-w-0 text-center font-mono text-[18.5px] text-ink outline-none border-x border-line bg-white"
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
  const currency = hydrated ? s.currency : "USD";
  const zh = lang === "zh";
  const t = T[lang];

  const qty = num(s.qty);
  const style = styleFor(s.styleCode);
  const { lines, unit, blockFee } = useMemo(
    () => priceLines(s.styleCode, s.sel, qty, lang),
    [s.styleCode, s.sel, qty, lang],
  );
  const tier = tierFor(qty);
  const total = orderTotal(unit, qty);
  const belowMoq = qty < MOQ;
  const runTotal = s.run.reduce<number>((a, b) => a + num(b), 0);
  const leadTime = qty >= 1000 ? 42 : 28;

  const fabric = GROUPS[0].values.find((v) => v.code === s.sel.fabric);
  const wash = GROUPS[1].values.find((v) => v.code === s.sel.wash);
  const hardware = GROUPS[2].values.find((v) => v.code === s.sel.hardware);
  const thread = GROUPS[3].values.find((v) => v.code === s.sel.thread);

  const previewFilter = [WASH_FX[s.sel.wash] ?? WASH_FX["vint-l"], FABRIC_FX[s.sel.fabric]]
    .filter(Boolean)
    .join(" ");

  /** The live swatch strip shown over the preview. */
  const specSwatches = [
    { label: zh ? "面料" : "Fabric", hex: fabric?.hex, name: fabric && optLabel(lang, "fabric", fabric.code, fabric.name) },
    { label: zh ? "洗水" : "Wash", hex: wash?.hex, name: wash && optLabel(lang, "wash", wash.code, wash.name) },
    { label: zh ? "五金" : "Hardware", hex: hardware?.hex, name: hardware && optLabel(lang, "hardware", hardware.code, hardware.name) },
    { label: zh ? "缝线" : "Stitch", hex: thread?.hex, name: thread && optLabel(lang, "thread", thread.code, thread.name) },
  ].filter((x) => x.hex && x.name);

  const visibleGroups = GROUPS.filter((g) => g.step === s.step);

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

  const breakdown = [
    ...lines.map((l) => ({ label: l.label, amount: money(l.amount, currency) })),
    { label: t.sampleLine, amount: money(SAMPLE_FEE, currency, 2) },
  ];

  return (
    <div className="flex flex-col min-[900px]:grid min-[900px]:[grid-template-columns:minmax(0,1fr)_clamp(340px,32vw,460px)] min-[900px]:h-[calc(100vh-60px)] min-[900px]:min-h-[560px] min-[900px]:overflow-hidden">
      {/* ── Preview ───────────────────────────────────────────── */}
      <div className="relative bg-[#EDEEF2] flex flex-col h-[clamp(280px,44vh,420px)] shrink-0 min-[900px]:h-auto min-[900px]:min-h-0 min-[900px]:overflow-hidden">
        <div className="flex-1 relative min-h-0 min-w-0 overflow-hidden">
          {style.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={style.photo}
              alt={zh ? style.cn : style.name}
              className="absolute inset-0 w-full h-full object-contain p-[clamp(24px,4vw,48px)] bg-white"
              style={{
                filter: previewFilter,
                objectPosition: "50% 22%",
                transition: "filter .4s ease",
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-white grid place-items-center p-[clamp(24px,5vw,56px)]">
              <div className="flex flex-col items-center gap-3 w-full max-w-[220px]">
                <div
                  className="w-full aspect-[3/4] rounded-[1px] border border-line"
                  style={{
                    background: fabric?.hex ?? "#8C99B5",
                    filter: previewFilter,
                    transition: "filter .4s ease",
                  }}
                />
                <span className="font-mono text-[11.5px] tracking-[0.18em] uppercase text-txt-4 text-center">
                  {style.code} · {zh ? "面料预览" : "fabric preview"}
                </span>
              </div>
            </div>
          )}
          <div className="absolute top-6 left-6 font-mono text-[12px] tracking-[0.16em] uppercase text-paper bg-[rgba(11,13,18,0.72)] px-[11px] py-[7px] pointer-events-none whitespace-nowrap">
            {style.code} · {zh ? style.cn : style.name}
          </div>
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap gap-x-4 gap-y-2 bg-[rgba(11,13,18,0.74)] px-3.5 py-2.5 pointer-events-none">
            {specSwatches.map((sw) => (
              <span key={sw.label} className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[rgba(242,240,236,0.4)] shrink-0"
                  style={{ background: sw.hex }}
                />
                <span className="font-mono text-[11.5px] tracking-[0.06em] text-paper truncate">
                  <span className="text-[rgba(242,240,236,0.55)] uppercase">{sw.label} </span>
                  {sw.name}
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2.5 px-6 py-[18px] bg-paper border-t border-line shrink-0">
          <div className="ml-auto flex items-center gap-[18px] font-mono text-[12px] tracking-[0.12em] uppercase text-[#5C5F68]">
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
                    "flex-1 px-2.5 pt-[9px] pb-2.5 text-[14.5px] font-medium rounded text-left",
                    active ? "bg-ink text-paper" : "bg-[#F2F2EE] text-[#4A4E58]",
                  )}
                >
                  <span className="block font-mono text-[11px] tracking-[0.12em] opacity-60">
                    {step.no}
                  </span>
                  {zh ? step.cnLabel : step.label}
                </button>
              );
            })}
          </div>
          <h2 className="font-serif font-normal m-0 text-[clamp(27.5px,2.88vw,34.5px)] leading-[1.12] tracking-[-0.01em]">
            {zh ? STEPS[s.step - 1].cnTitle : STEPS[s.step - 1].title}
          </h2>
          <p className="mt-2.5 mb-0 text-[15.5px] leading-[1.6] text-txt-3 [text-wrap:pretty] keep-all">
            {zh ? STEPS[s.step - 1].cnHint : STEPS[s.step - 1].hint}
          </p>
        </div>

        {/* Scrolling body */}
        <div className="px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-6 pb-2 flex flex-col gap-8">
          {/* Step 1 — base style picker */}
          {s.step === 1 && (
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-3.5">
                <div className="font-mono text-[12px] tracking-[0.16em] uppercase text-indigo">
                  {t.baseStyleHead}
                </div>
                <div className="text-[14.5px] text-[#5C5F68]">{t.fobPer}</div>
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
                        <div className="text-[16px] font-medium keep-all">
                          {zh ? p.cn : p.name}
                        </div>
                        <div className="text-[14.5px] text-[#4A4E58] mt-0.5 leading-[1.4] keep-all">
                          {zh ? p.cnDesc : p.desc}
                        </div>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <div className="font-mono text-[14.5px]">
                          {money(p.base, currency, 2)} {t.perPc}
                        </div>
                        {zh && (
                          <div className="text-[13px] text-[#5C5F68] mt-[3px]">
                            {p.name}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steps 2 & 3 — option groups */}
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
                      const price =
                        v.d === 0
                          ? t.included
                          : v.d > 0
                            ? `+${money(v.d, currency, 2)} ${t.perPc}`
                            : `${money(v.d, currency, 2)} ${t.perPc}`;
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
                          <div className="text-[14.5px] font-medium leading-[1.25] mt-2 keep-all">
                            {optLabel(lang, g.code as GroupCode, v.code, v.name)}
                          </div>
                          {(zh ? v.cnDesc || v.desc : v.desc) && (
                            <div className="text-[12.5px] text-[#5C5F68] mt-[3px] leading-[1.35] keep-all">
                              {zh ? v.cnDesc || v.desc : v.desc}
                            </div>
                          )}
                          <div className="font-mono text-[12px] text-[#4A4E58] mt-1">
                            {price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {g.values.map((v) => {
                      const on = v.code === cur;
                      const price =
                        v.d === 0
                          ? t.included
                          : v.d > 0
                            ? `+${money(v.d, currency, 2)} ${t.perPc}`
                            : `${money(v.d, currency, 2)} ${t.perPc}`;
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
                            <div className="text-[16px] font-medium keep-all">
                              {optLabel(lang, g.code as GroupCode, v.code, v.name)}
                            </div>
                            <div className="text-[14.5px] text-[#4A4E58] mt-0.5 leading-[1.4] keep-all">
                              {zh ? v.cnDesc || v.desc : v.desc}
                            </div>
                          </div>
                          <div className="font-mono text-[14px] text-[#4A4E58] whitespace-nowrap">
                            {price}
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
                  <div className="font-mono text-[12.5px] tracking-[0.16em] uppercase text-indigo">
                    {zh ? t.kSizeRun : "Size run"}
                  </div>
                  <button
                    type="button"
                    onClick={() => s.evenSplitRun()}
                    className="font-mono text-[12px] tracking-[0.1em] uppercase text-[#4A4E58] border border-line rounded px-3 h-8 hover:border-ink hover:text-ink transition-colors"
                  >
                    {zh ? "平均分配" : "Even split"}
                  </button>
                </div>
                <p className="text-[14.5px] leading-[1.5] text-[#4A4E58] mb-4 keep-all">
                  {t.sizeRunNote}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  {SIZES.map((sz, i) => (
                    <div key={sz} className="flex items-center gap-3">
                      <span className="font-mono text-[15px] tracking-[0.04em] text-[#4A4E58] font-medium w-11 shrink-0">
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
                  <div className="flex items-center justify-between gap-3 px-4 h-12 rounded text-[15.5px] font-medium mb-[34px] bg-info-bg text-indigo">
                    <span>{zh ? "已配平" : "Balanced"}</span>
                    <span className="font-mono">
                      {runTotal} {t.pcsLower}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => s.balanceRun()}
                    className="flex items-center justify-between gap-3 w-full px-4 h-12 rounded text-[15.5px] font-medium mb-[34px] bg-error-bg text-error-tx hover:brightness-95 transition-[filter]"
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
                    <span className="block font-mono text-[12.5px] tracking-[0.16em] uppercase text-indigo">
                      {t.blockHead}
                    </span>
                    <span className="block text-[14px] text-[#5C5F68] mt-1 keep-all">
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
                      "shrink-0 font-mono text-[18.5px] text-[#5C5F68] transition-transform",
                      blockOpen && "rotate-45",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {blockOpen && (
                  <div className="px-4 pb-4 pt-1">
                    <p className="text-[14.5px] leading-[1.5] text-[#4A4E58] mb-3.5 keep-all">
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
                          "h-11 font-mono text-[14px] tracking-[0.02em] rounded border transition-colors",
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
                  <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-[#5C5F68]">
                    {zh ? "正在编辑" : "Editing"}
                  </span>
                  <span className="font-mono text-[15px] font-medium text-ink">
                    {s.blockSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                  {MEASURE_KEYS.map((key, i) => (
                    <label key={key} className="flex flex-col gap-1.5">
                      <span className="text-[15px] text-[#4A4E58] font-medium">
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
                          className="border-0 bg-transparent outline-none font-mono text-[18.5px] w-full min-w-0 text-ink"
                        />
                        <span className="font-mono text-[12.5px] text-[#5C5F68] shrink-0 pl-1">
                          cm
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 bg-[#F0F1F6] px-4 py-3.5 text-[14.5px] leading-[1.55] text-[#3E4250] keep-all">
                  {zh
                    ? `当前编辑 ${s.blockSize} 尺码。版型调整每条加收 ${money(blockFee, currency, 2)}，需额外 4 天版房工作。打样费一次性收取 ${money(SAMPLE_FEE, currency, 2)} — 版房出格、车缝并寄出封样，确认后方可开裁大货。`
                    : `Editing ${s.blockSize}. A modified block adds ${money(blockFee, currency, 2)} per piece and 4 days of pattern work. Sampling is charged once at ${money(SAMPLE_FEE, currency, 2)} — the pattern room grades, sews and ships a sealed sample for your sign-off before bulk cutting.`}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quantity + breakdown block */}
        <div className="border-t border-[#EAEAE6] px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-5 pb-4 bg-paper-raised min-[900px]:shrink-0">
          <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
            <div className="min-w-0 flex-1 basis-[200px]">
              <div className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-[#5C5F68] mb-[7px]">
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
                    className="border-0 outline-none bg-transparent font-mono text-[18.5px] w-[60px] text-ink"
                  />
                  <span className="font-mono text-[12px] text-[#5C5F68] tracking-[0.08em]">
                    {t.pcs}
                  </span>
                </span>
                {[100, 300, 1000, 2500].map((n) => {
                  const on = qty === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => s.setQtyBalanced(n)}
                      className={clsx(
                        "h-10 px-[13px] font-mono text-[13px] tracking-[0.06em] rounded border",
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
            <div className="text-right shrink-0 min-w-0">
              <div className="font-mono text-[11.5px] tracking-[0.16em] uppercase text-[#5C5F68] mb-[7px]">
                {t.tier}
              </div>
              <div className="font-mono text-[14px] text-indigo tracking-[0.04em]">
                {tierLabel(tier, lang, true)}
              </div>
            </div>
          </div>

          {belowMoq && (
            <div className="bg-error-bg text-error-tx px-3.5 py-[11px] text-[14.5px] leading-[1.5] mb-3.5">
              {t.belowMoqNote}
            </div>
          )}

          <div className="flex flex-col gap-[7px] mb-4">
            {breakdown.map((b, i) => (
              <div
                key={i}
                className="flex justify-between text-[14.5px] text-[#5C5F68] gap-4"
              >
                <span className="keep-all">{b.label}</span>
                <span className="font-mono whitespace-nowrap">{b.amount}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-3 pt-3 border-t border-line-soft font-mono text-[12.5px] text-[#5C5F68] flex-wrap">
            <span>
              {zh ? "报价币种 " : "QUOTED IN "}
              {currency} · FOB SHENZHEN
            </span>
            <span>
              {leadTime} {zh ? t.days : "DAYS"} · ~4 WEEKS
            </span>
          </div>
        </div>

        {/* Sticky price bar */}
        <div className="sticky bottom-0 bg-white border-t border-line-soft px-[18px] min-[900px]:px-[clamp(18px,2.2vw,30px)] pt-3.5 pb-4 shrink-0 z-[3] shadow-bar">
          <div className="flex items-baseline justify-between gap-3.5 mb-3 flex-wrap">
            <div className="flex items-baseline gap-2.5 min-w-0">
              <span className="font-sans font-semibold text-[32px] tracking-[-0.01em] leading-none [font-variant-numeric:tabular-nums]">
                {money(unit, currency, 2)}
              </span>
              <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#5C5F68]">
                {t.perPc}
              </span>
            </div>
            <div className="text-[14.5px] text-[#5C5F68] text-right keep-all">
              {zh
                ? `总计 ${money(total, currency)} · ${qty} 条（含 ${money(SAMPLE_FEE, currency, 2)} 打样费）`
                : `Total ${money(total, currency)} · ${qty} pcs incl. ${money(SAMPLE_FEE, currency, 2)} sampling`}
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              disabled={belowMoq}
              onClick={() => goSummary(false)}
              className={clsx(
                "flex-1 px-3.5 py-3.5 font-sans text-[16px] font-medium rounded tracking-[0.01em] whitespace-nowrap",
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
              className="bg-white border border-[#C9CAD2] px-[18px] py-3.5 font-sans text-[15.5px] rounded whitespace-nowrap hover:border-ink transition-colors"
            >
              {t.samplingOnly}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
