import type {
  Currency,
  OptionGroup,
  Product,
  Tier,
} from "./types";

/**
 * Data model ported from the design reference (`Denim Platform UI.dc.html` →
 * logic class). Prices, tiers and MOQ are final and intentional. Treat this file
 * as the source of truth on the client; the server re-derives the same numbers
 * in `pricing.ts` and never trusts a client total.
 */

export const MOQ = 100;
export const SAMPLE_FEE = 70;
/** Per-piece surcharge for a modified block (+4 days pattern work). */
export const BLOCK_FEE = 0.7;

export const PRODUCTS: Product[] = [
  { code: "DA-01", name: "90s Wide-Leg", cn: "90年代阔版牛仔裤", tag: "Best-seller", base: 13.8, photo: "/assets/pd01-wide.png", cnDesc: "90年代宽松版型，脚口 23cm", desc: "Baggy 90s block, 23cm leg opening", sw: ["#2B3A63", "#4A5B84", "#8C99B5", "#1A1F2E"] },
  { code: "DA-02", name: "Vintage Straight", cn: "复古直筒牛仔裤", tag: "Core", base: 12.4, photo: "/assets/pd02-straight.png", cnDesc: "中腰，标准直筒", desc: "Mid rise, true straight leg", sw: ["#31456F", "#5C6E93", "#B0B8C9", "#20263A"] },
  { code: "DA-03", name: "Y2K Flare", cn: "Y2K喇叭牛仔裤", tag: "Trending", base: 14.2, photo: "/assets/pd03-flare.png", cnDesc: "低腰，膝下微喇", desc: "Low rise, flare from knee", sw: ["#3A4C74", "#7080A0", "#C3C9D6", "#232A3E"] },
  { code: "DA-04", name: "Loose Carpenter", cn: "宽松工装牛仔裤", tag: "Workwear", base: 15.6, photo: "/assets/pd04-carpenter.png", cnDesc: "工装口袋，锤环，三线车缝", desc: "Utility pockets, hammer loop, triple stitch", sw: ["#2A3559", "#66759A", "#A9B2C6", "#181D2B"] },
  { code: "DA-05", name: "Distressed Street", cn: "做旧街头风牛仔裤", tag: "Statement", base: 17.2, cnDesc: "手工打磨，膝部修补，毛边裤脚", desc: "Hand-sanded, repaired knees, raw hem", sw: ["#37477A", "#6B7BA3", "#B7BECE", "#1E2333"] },
  { code: "DA-06", name: "Raw Selvedge", cn: "原始赤耳牛仔裤", tag: "Heritage", base: 18.4, cnDesc: "未洗水红边赤耳，链条车缝脚口", desc: "Unwashed red-line selvedge, chain-stitch hem", sw: ["#25315A", "#4E5D86", "#98A3BC", "#151A27"] },
  { code: "DA-07", name: "Washed Black Wide", cn: "水洗黑阔版牛仔裤", tag: "Core", base: 14.8, cnDesc: "成衣水洗黑，阔身版型", desc: "Garment-washed black, wide block", sw: ["#2D3B60", "#63719B", "#ADB5C7", "#1A1F2D"] },
  { code: "DA-08", name: "Women's High-Rise Wide", cn: "女士高腰阔腿裤", tag: "Best-seller", base: 15.0, cnDesc: "高腰，全阔腿，女装版", desc: "High rise, full wide leg, women’s grade", sw: ["#2F3E66", "#5F6E92", "#AFB7C8", "#1B2130"] },
  { code: "DA-09", name: "High-Rise Mom", cn: "高腰妈妈裤", tag: "Core", base: 13.2, photo: "/assets/pd09-mom.png", cnDesc: "锥形妈妈版，可选前褶", desc: "Tapered mom block, pleated front option", sw: ["#34446B", "#68779C", "#BAC1D0", "#1F2434"] },
  { code: "DA-10", name: "High-Rise Straight / Wide", cn: "高腰线直筒/阔版裤", tag: "Core", base: 13.6, cnDesc: "高腰线，直筒或阔版", desc: "High waistline, straight or wide leg", sw: ["#324066", "#606F94", "#B2BACB", "#1C2231"] },
  { code: "DA-11", name: "Barrel Leg", cn: "桶形裤", tag: "New", base: 16.2, photo: "/assets/pd11-barrel.png", cnDesc: "桶形弧线廓形，九分裤脚", desc: "Curved barrel silhouette, cropped hem", sw: ["#2C3A61", "#5A6A90", "#A6AEC2", "#191E2C"] },
  { code: "DA-12", name: "Moto Panelled Skinny", cn: "机车拼接紧身裤", tag: "Statement", base: 18.8, cnDesc: "膝部拼接，机车省道，弹力紧身", desc: "Panelled knees, moto darts, stretch skinny", sw: ["#232E52", "#4F5E88", "#9AA5BE", "#141822"] },
  { code: "DA-13", name: "Mid-Rise Tapered", cn: "中腰锥形裤", tag: "New", base: 12.8, cnDesc: "中腰，膝下收锥", desc: "Mid rise, tapered from knee", sw: ["#2E3C64", "#5D6C90", "#ACB4C6", "#1A1F2E"] },
];

export const GROUPS: OptionGroup[] = [
  {
    step: 2, code: "fabric", name: "Denim quality", control: "swatch", values: [
      { code: "raw12", name: "12oz Raw Indigo", hex: "#25315A", d: 0, desc: "12oz · 100% cotton · base quality" },
      { code: "vint13", name: "13oz Vintage", hex: "#3A4A73", d: 2.4, desc: "13oz · 99% cotton / 1% spandex" },
      { code: "heavy14", name: "14oz Heavyweight", hex: "#1B2440", d: 3.6, desc: "14oz · 100% cotton" },
      { code: "blk11", name: "11oz Stretch Black", hex: "#17181C", d: 2.16, desc: "11oz · 92% cotton / 8% spandex" },
      { code: "rec12", name: "12oz Recycled", hex: "#4C5A7E", d: 4.8, desc: "12oz · 70% recycled / 30% cotton" },
      { code: "emb", name: "Print + Embroidery", hex: "#6A6390", d: 7.2, desc: "Two-process printed & embroidered denim · MOQ 500" },
    ],
  },
  {
    step: 2, code: "wash", name: "Wash process", control: "swatch", values: [
      { code: "none", name: "Raw / unwashed", hex: "#232E52", d: 0, desc: "Base — no wash", cnDesc: "原色未水洗 · 基础" },
      { code: "rinse", name: "Light rinse", hex: "#33436E", d: 0.6, desc: "Single rinse cycle", cnDesc: "轻漂洗" },
      { code: "vint-l", name: "Light vintage", hex: "#4C5F8A", d: 1.6, desc: "Light vintage cast", cnDesc: "浅复古洗水" },
      { code: "vint-m", name: "Medium vintage", hex: "#6C7B9E", d: 2.2, desc: "Medium vintage cast", cnDesc: "中度复古洗水" },
      { code: "vint-h", name: "Heavy vintage", hex: "#8B96B0", d: 3.2, desc: "Heavy vintage cast", cnDesc: "重度复古洗水" },
      { code: "bleach", name: "Bleach wash", hex: "#AEB7C9", d: 3.8, desc: "Bleached, high contrast", cnDesc: "漂白洗水" },
      { code: "snow", name: "Snow / acid wash", hex: "#C2C7D4", d: 4.6, desc: "Acid marbling · price TBC", cnDesc: "雪花洗 · 价格待定" },
    ],
  },
  {
    step: 3, code: "hardware", name: "Buttons & zip", control: "swatch", values: [
      { code: "antique", name: "Antique brass", hex: "#8A6E3C", d: 0 },
      { code: "nickel", name: "Brushed nickel", hex: "#9EA2A8", d: 0.36 },
      { code: "black", name: "Matte black", hex: "#22242A", d: 0.48 },
      { code: "copper", name: "Copper", hex: "#9C5F3C", d: 0.6 },
    ],
  },
  {
    step: 3, code: "thread", name: "Stitch colour", control: "swatch", values: [
      { code: "gold", name: "Gold", hex: "#C9973F", d: 0 },
      { code: "tonal", name: "Tonal indigo", hex: "#2C3A61", d: 0.24 },
      { code: "ecru", name: "Ecru", hex: "#DED4BC", d: 0.24 },
      { code: "red", name: "Rust", hex: "#9A4630", d: 0.36 },
    ],
  },
  {
    step: 3, code: "patch", name: "Waistband patch", control: "row", values: [
      { code: "std", name: "Standard debossed leather", desc: "Veg-tan, your logo die", d: 0 },
      { code: "jacron", name: "Jacron (vegan)", desc: "Printed cellulose patch", d: 0.44 },
      { code: "woven", name: "Woven label", desc: "Damask woven, folded edge", d: 0.7 },
      { code: "none", name: "No patch", desc: "Clean waistband", d: -0.3 },
    ],
  },
  {
    step: 3, code: "pocket", name: "Back pocket art", control: "row", values: [
      { code: "plain", name: "Plain", desc: "No decoration", d: 0 },
      { code: "arc", name: "Arcuate embroidery", desc: "Single-needle, thread colour matched", d: 1.1 },
      { code: "print", name: "Screen print", desc: "One-colour discharge print", d: 1.4 },
      { code: "custom", name: "Print + embroidery", desc: "Two-process artwork, pattern room review", d: 2.8 },
    ],
  },
];

export const CURRENCIES: Currency[] = [
  { code: "USD", sym: "$", rate: 1 },
  { code: "AUD", sym: "A$", rate: 1.52 },
  { code: "EUR", sym: "€", rate: 0.92 },
  { code: "SGD", sym: "S$", rate: 1.34 },
  { code: "NZD", sym: "NZ$", rate: 1.66 },
  { code: "CNY", sym: "¥", rate: 7.18 },
];

export const TIERS: Tier[] = [
  { min: 100, off: 0, label: "100–299 PCS · BASE" },
  { min: 300, off: 0.05, label: "300–999 PCS · −5%" },
  { min: 1000, off: 0.1, label: "1,000–2,499 PCS · −10%" },
  { min: 2500, off: 0.15, label: "2,500+ PCS · −15%" },
];

export const SIZES = ["W28", "W30", "W32", "W34", "W36", "W38"] as const;

export const DEFAULT_RUN = [30, 65, 90, 65, 30, 20];

/** Grade seed for block measurements, keyed by size index. */
export function seedMeasurements() {
  return SIZES.reduce<Record<string, {
    waist: number; hip: number; thigh: number; knee: number; inseam: number; opening: number;
  }>>((acc, s, i) => {
    acc[s] = {
      waist: 82 + i * 5,
      hip: 98 + i * 5,
      thigh: 58 + i * 2,
      knee: 40 + i,
      inseam: 81,
      opening: 16,
    };
    return acc;
  }, {});
}

export const FACTORY_EMAIL =
  process.env.NEXT_PUBLIC_FACTORY_EMAIL || "sales@denimassembly.com";

/**
 * When a real endpoint is wired, submissions POST to it. Left as our own API
 * route; if that route can't deliver, the client falls back to a mailto: draft.
 */
export const FORM_ENDPOINT = "/api/quote";

export const FACTORY_ADDRESS = [
  "Denim Assembly — Manufacturing",
  "Address line — to be supplied",
  "Guangdong, China",
];
