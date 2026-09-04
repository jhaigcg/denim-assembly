import { BLOCK_FEE, CURRENCIES, GROUPS, PRODUCTS, SAMPLE_FEE, TIERS } from "./data";
import { GROUP_CN, optLabel, T } from "./i18n";
import type { CurrencyCode, Lang, Selection, Tier } from "./types";

const round2 = (n: number) => Math.round(n * 100) / 100;

export function currency(code: CurrencyCode) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

/**
 * Format a USD figure into the active currency.
 * - 2 dp under 100, 0 dp at/above 100 (unless `dp` is forced)
 * - thousands separators
 * - negative renders as `−$1.23`
 */
export function money(usd: number, code: CurrencyCode, dp?: number) {
  const c = currency(code);
  const v = usd * c.rate;
  const d = dp === undefined ? (Math.abs(v) < 100 ? 2 : 0) : dp;
  const s = Math.abs(v).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
  return (usd < 0 ? "−" : "") + c.sym + s;
}

export function tierFor(qty: number): Tier {
  let t = TIERS[0];
  for (const x of TIERS) if (qty >= x.min) t = x;
  return t;
}

export function styleFor(code: string) {
  return PRODUCTS.find((p) => p.code === code) || PRODUCTS[0];
}

export interface BreakdownLine {
  label: string;
  /** USD amount (unformatted). */
  amount: number;
}

export interface PriceResult {
  /** Ordered breakdown: base, non-zero options, modified block, volume discount. */
  lines: BreakdownLine[];
  /** Rounded per-piece FOB price in the active tier, in USD. */
  unit: number;
  blockFee: number;
  tier: Tier;
  unitGross: number;
}

/**
 * Core pricing maths, ported from `priceLines()` in the design reference.
 *
 *   unitGross  = base + Σ(selected option.d) + blockFee
 *   tier       = highest tier where qty >= tier.min
 *   unitPrice  = round2(unitGross * (1 - tier.off))
 */
export function priceLines(
  styleCode: string,
  sel: Selection,
  qty: number,
  lang: Lang,
): PriceResult {
  const sty = styleFor(styleCode);
  const zh = lang === "zh";
  const tt = T[lang] || T.en;
  const base = sty.base;

  const lines: BreakdownLine[] = [
    { label: `${zh ? sty.cn : sty.name} — ${tt.baseUnit}`, amount: base },
  ];

  let extra = 0;
  for (const g of GROUPS) {
    const v = g.values.find((x) => x.code === sel[g.code]);
    if (v && v.d) {
      extra += v.d;
      const groupName = zh && GROUP_CN[g.code] ? GROUP_CN[g.code] : g.name;
      lines.push({
        label: `${groupName} · ${optLabel(lang, g.code, v.code, v.name)}`,
        amount: v.d,
      });
    }
  }

  lines.push({ label: tt.blockLine, amount: BLOCK_FEE });

  const gross = base + extra + BLOCK_FEE;
  const t = tierFor(qty);
  if (t.off) {
    lines.push({
      label: `${tt.volDisc} · ${t.label.split("·")[1].trim()}`,
      amount: -round2(gross * t.off),
    });
  }

  const unit = round2(gross * (1 - t.off));
  return { lines, unit, blockFee: BLOCK_FEE, tier: t, unitGross: gross };
}

/** Order total = line total + one-off sampling fee. */
export function orderTotal(unit: number, qty: number) {
  return unit * qty + SAMPLE_FEE;
}

/** Localised volume-tier label. */
export function tierLabel(t: Tier, lang: Lang, withPlus = false) {
  if (lang !== "zh") return t.label;
  let s = t.label.replace("PCS", "条").replace("BASE", "基础价");
  if (withPlus) s = s.replace("+", " 以上");
  return s;
}
