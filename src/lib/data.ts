import type {
  Currency,
  Family,
  GroupCode,
  OptionGroup,
  Product,
  Selection,
  Tier,
} from "./types";

/**
 * Data model ported from the design reference (`Denim Platform UI.dc.html` →
 * logic class). Prices, tiers and MOQ are final and intentional. Treat this file
 * as the source of truth on the client; the server re-derives the same numbers
 * in `pricing.ts` and never trusts a client total.
 */

export const MOQ = 200;
export const SAMPLE_FEE = 35;
/** Per-piece surcharge for a modified block (+4 days pattern work). */
export const BLOCK_FEE = 0.7;

/**
 * Codes are not contiguous — DA-05…DA-08 and DA-10…DA-13 were earlier styles
 * removed for lacking photography. Treat the code as an opaque identifier.
 *
 * DA-17 is renamed from the design reference's "H.D. Jean Pants (Needles)" —
 * Needles is a trademarked Japanese label, so the public name drops the
 * reference per the handoff's own recommendation (internal ref only).
 */
export const PRODUCTS: Product[] = [
  { code: "DA-01", name: "90s Wide-Leg", cn: "90年代阔版牛仔裤", tag: "Best-seller", base: 13.8, photo: "/assets/pd01-wide.png", photoBack: "/assets/pd01-wide-back.png", cnDesc: "90年代宽松版型，脚口 23cm", desc: "Baggy 90s block, 23cm leg opening", sw: ["#2B3A63", "#4A5B84", "#8C99B5", "#1A1F2E"] },
  { code: "DA-02", name: "Vintage Straight", cn: "复古直筒牛仔裤", tag: "Core", base: 12.4, photo: "/assets/pd02-straight.png", photoBack: "/assets/pd02-straight-back.png", cnDesc: "中腰，标准直筒", desc: "Mid rise, true straight leg", sw: ["#31456F", "#5C6E93", "#B0B8C9", "#20263A"] },
  { code: "DA-03", name: "Y2K Flare", cn: "Y2K喇叭牛仔裤", tag: "Trending", base: 14.2, photo: "/assets/pd03-flare.png", cnDesc: "低腰，膝下微喇", desc: "Low rise, flare from knee", sw: ["#3A4C74", "#7080A0", "#C3C9D6", "#232A3E"] },
  { code: "DA-04", name: "Loose Carpenter", cn: "宽松工装牛仔裤", tag: "Workwear", base: 15.6, photo: "/assets/pd04-carpenter.png", photoBack: "/assets/pd04-carpenter-back.png", cnDesc: "工装口袋，锤环，三线车缝", desc: "Utility pockets, hammer loop, triple stitch", sw: ["#2A3559", "#66759A", "#A9B2C6", "#181D2B"] },
  { code: "DA-09", name: "High-Rise Mom", cn: "高腰妈妈裤", tag: "Core", base: 13.2, photo: "/assets/pd09-mom.png", cnDesc: "锥形妈妈版，可选前褶", desc: "Tapered mom block, pleated front option", sw: ["#34446B", "#68779C", "#BAC1D0", "#1F2434"] },
  { code: "DA-14", name: "Kendall Straight Leg Jeans", cn: "肯达尔直筒牛仔裤", tag: "New", base: 15.4, photo: "/assets/pd14-kendall.png", photoBack: "/assets/pd14-kendall-back.png", desc: "High rise, clean straight leg, acid-washed light indigo", cnDesc: "高腰，利落直筒，浅色酸洗靛蓝", sw: ["#A9C0DA", "#7E9BBE", "#5E7C9F", "#2A3A5C"] },
  { code: "DA-15", name: "Sellie Flared Leg Jeans", cn: "塞莉喇叭牛仔裤", tag: "New", base: 16.8, photo: "/assets/pd15-sellie.png", photoBack: "/assets/pd15-sellie-back.png", desc: "High rise, dark rinse, dramatic wide flare from hip", cnDesc: "高腰，深色漂洗，自胯部起大幅喇叭", sw: ["#2B3A63", "#1F2C4E", "#41537E", "#16203A"] },
  { code: "DA-16", name: "Arles Wide Leg Pants", cn: "阿尔勒阔腿裤", tag: "New", fam: "woven", base: 17.6, photo: "/assets/pd16-arles.png", photoBack: "/assets/pd16-arles-back.png", desc: "Tailored linen-blend, front pleats, welt back pockets", cnDesc: "亚麻混纺西裤版，前打褶，后开袋", sw: ["#E8DFD1", "#D6C9B4", "#BFB49E", "#8E8676"] },
  { code: "DA-17", name: "H.D. Balloon Leg", cn: "H.D. 气球腿牛仔长裤", tag: "Statement", base: 18.2, photo: "/assets/pd17-hd.png", photoBack: "/assets/pd17-hd-back.png", desc: "Faded black, curved balloon leg, pleated front, patch back pockets", cnDesc: "水洗黑，弧形气球裤腿，前打褶，后贴袋", sw: ["#3A3A3C", "#2A2A2C", "#565658", "#161618"] },
  { code: "DA-18", name: "Barrel Denim Jeans", cn: "桶形牛仔裤", tag: "New", base: 16.4, photo: "/assets/pd18-stephanie.png", photoBack: "/assets/pd18-stephanie-back.png", desc: "Washed khaki, high rise, curved barrel leg, five-pocket", cnDesc: "水洗卡其，高腰，弧形桶身裤腿，五袋款", sw: ["#7E7C5E", "#8C8A6C", "#63614A", "#4A4835"] },
  { code: "DA-19", name: "Ayla Baggy Jeans", cn: "艾拉宽松牛仔裤", tag: "New", base: 15.8, photo: "/assets/pd19-ayla.png", photoBack: "/assets/pd19-ayla-back.png", desc: "Optic white, high rise, relaxed baggy leg, five-pocket", cnDesc: "亮白色，高腰，宽松直筒，五袋款", sw: ["#F2EFE8", "#E4DFD4", "#D2CCC0", "#B9B2A4"] },
  { code: "DA-20", name: "Honey Denim Bec Barrel Jeans", cn: "蜜色丹宁 Bec 桶形牛仔裤", tag: "New", base: 16.6, photo: "/assets/pd20-honey.png", photoBack: "/assets/pd20-honey-back.png", desc: "Light blue wash, high rise, rounded barrel leg, cropped hem", cnDesc: "浅蓝洗水，高腰，圆润桶身裤腿，九分裤长", sw: ["#9DB8D6", "#8AA8CB", "#B7CADF", "#6E8CB0"] },
  { code: "DA-21", name: "Mid Rise Wide Leg Jeans", cn: "中腰阔腿牛仔裤", tag: "New", base: 14.6, photo: "/assets/pd21-midwide.png", photoBack: "/assets/pd21-midwide-back.png", desc: "Dark blue wash, mid rise, yoke waistband with zip pockets, full wide leg", cnDesc: "深蓝洗水，中腰，育克腰头配拉链袋，全阔腿", sw: ["#2E415F", "#3A506F", "#22334C", "#4B6183"] },
  { code: "DA-22", name: "Summer High Rise Relaxed Jeans", cn: "夏季高腰宽松牛仔裤", tag: "New", base: 15.2, photo: "/assets/pd22-summer.png", photoBack: "/assets/pd22-summer-back.png", desc: "Dark mid blue wash, high rise, relaxed straight leg, five-pocket", cnDesc: "中深蓝洗水，高腰，宽松直筒，五袋款", sw: ["#2F4A73", "#3D5A85", "#263D60", "#51709B"] },
  { code: "DA-23", name: "Carrie Multi Stripe Low Rise Jeans", cn: "凯莉多色条纹低腰牛仔裤", tag: "Statement", fam: "yarndye", base: 17.8, photo: "/assets/pd23-carrie.png", photoBack: "/assets/pd23-carrie-back.png", desc: "Yarn-dyed multi stripe, low rise, straight wide leg, five-pocket", cnDesc: "色织多色条纹，低腰，直筒阔腿，五袋款", sw: ["#E8DFA8", "#9FC4C0", "#D9A79B", "#7E9B6A"] },
  { code: "DA-24", name: "Low Rise Wide Leg Jeans", cn: "低腰阔腿牛仔裤", tag: "New", base: 15.8, photo: "/assets/pd24-lowrise.png", photoBack: "/assets/pd24-lowrise-back.png", desc: "Mid blue wash, low rise, full wide leg, contrast side seam", cnDesc: "中蓝洗水，低腰，全阔腿，撞色侧缝", sw: ["#8FB4D6", "#7AA3C9", "#A8C4DE", "#5D86AF"] },
  { code: "DA-25", name: "Sneaky Link Celine High Rise Stretch Jean", cn: "席琳高腰弹力牛仔裤（白色）", tag: "New", base: 16.6, photo: "/assets/pd25-celine.png", photoBack: "/assets/pd25-celine-back.png", desc: "Optic white, high rise, relaxed straight leg, stretch denim", cnDesc: "亮白色，高腰，宽松直筒，弹力牛仔", sw: ["#F4F2EC", "#E8E4DA", "#D8D3C6", "#C4BEAE"] },
  { code: "DA-26", name: "Fold Waist Jean Sunday Blue", cn: "折腰牛仔裤 · 周日蓝", tag: "New", base: 17.4, photo: "/assets/pd26-foldwaist.png", photoBack: "/assets/pd26-foldwaist-back.png", desc: "Light stone wash, asymmetric fold waistband, curved wide leg", cnDesc: "浅石洗，不对称折叠腰头，弧形阔腿", sw: ["#A8BDD4", "#8FA9C4", "#C3D2E1", "#6E88A6"] },
  { code: "DA-27", name: "Denim Capris — Light Blue", cn: "牛仔七分裤 · 浅蓝", tag: "New", base: 14.6, photo: "/assets/pd27-capris.png", photoBack: "/assets/pd27-capris-back.png", desc: "Light blue wash, high rise, cropped straight leg with side splits", cnDesc: "浅蓝洗水，高腰，七分直筒，侧开衩", sw: ["#C3D6E8", "#A9C2DA", "#D6E3EF", "#8FA9C4"] },
  { code: "DA-28", name: "Mid Rise Barrel Denim Jeans", cn: "中腰桶形牛仔裤", tag: "New", base: 16.2, photo: "/assets/pd28-midbarrel.png", photoBack: "/assets/pd28-midbarrel-back.png", desc: "Washed blue, mid rise, rounded barrel leg, tapered hem", cnDesc: "蓝色水洗，中腰，圆润桶身裤腿，收口裤脚", sw: ["#A9C1DB", "#8BA7C6", "#C6D7E7", "#6F8CAB"] },
  { code: "DA-29", name: "Cormac Dark Blue Highwaisted Long Jean", cn: "科马克深蓝高腰长牛仔裤", tag: "Core", base: 16.2, photo: "/assets/pd29-cormac.png", photoBack: "/assets/pd29-cormac-back.png", desc: "Dark blue wash, high rise, skinny leg with contrast pocket embroidery", cnDesc: "深蓝洗水，高腰，紧身裤型，撞色后袋绣花", sw: ["#2C4468", "#3A5680", "#22374F", "#4E6C93"] },
];

export const GROUPS: OptionGroup[] = [
  {
    step: 2, code: "fabric", name: "Denim quality", fam: "denim", control: "swatch", values: [
      { code: "raw12", name: "12oz Raw Indigo", hex: "#25315A", d: 0, desc: "12oz · 100% cotton · base quality" },
      { code: "vint13", name: "13oz Vintage", hex: "#3A4A73", d: 2.4, desc: "13oz · 99% cotton / 1% spandex" },
      { code: "heavy14", name: "14oz Heavyweight", hex: "#1B2440", d: 3.6, desc: "14oz · 100% cotton" },
      { code: "blk11", name: "11oz Stretch Black", hex: "#17181C", d: 2.16, desc: "11oz · 92% cotton / 8% spandex" },
      { code: "rec12", name: "12oz Recycled", hex: "#4C5A7E", d: 4.8, desc: "12oz · 70% recycled / 30% cotton" },
      { code: "emb", name: "Print + Embroidery", hex: "#6A6390", d: 7.2, desc: "Two-process printed & embroidered denim · MOQ 500" },
    ],
  },
  {
    step: 2, code: "wash", name: "Wash process", fam: "denim", control: "swatch", values: [
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
    step: 3, code: "patch", name: "Waistband patch", fam: ["denim", "yarndye"], control: "row", values: [
      { code: "std", name: "Standard debossed leather", desc: "Veg-tan, your logo die", d: 0 },
      { code: "jacron", name: "Jacron (vegan)", desc: "Printed cellulose patch", d: 0.44 },
      { code: "woven", name: "Woven label", desc: "Damask woven, folded edge", d: 0.7 },
      { code: "none", name: "No patch", desc: "Clean waistband", d: -0.3 },
    ],
  },
  {
    step: 3, code: "pocket", name: "Back pocket art", fam: ["denim", "yarndye"], control: "row", values: [
      { code: "plain", name: "Plain", desc: "No decoration", d: 0 },
      { code: "arc", name: "Arcuate embroidery", desc: "Single-needle, thread colour matched", d: 1.1 },
      { code: "print", name: "Screen print", desc: "One-colour discharge print", d: 1.4 },
      { code: "custom", name: "Print + embroidery", desc: "Two-process artwork, pattern room review", d: 2.8 },
    ],
  },
  {
    step: 2, code: "cloth", name: "Fabric quality", fam: "woven", control: "swatch", values: [
      { code: "lin-nat", name: "Linen blend — natural", hex: "#E4DACA", d: 0, desc: "55% linen / 45% viscose · base quality" },
      { code: "lin-pure", name: "100% washed linen", hex: "#DCCFB9", d: 3.2, desc: "175gsm · garment washed" },
      { code: "lin-hvy", name: "Heavy linen twill", hex: "#CFC0A6", d: 4.4, desc: "240gsm · 100% linen" },
      { code: "ten-drape", name: "Tencel drape", hex: "#D9D2C6", d: 3.8, desc: "100% Tencel™ lyocell · fluid hand" },
      { code: "cot-suit", name: "Cotton suiting", hex: "#C9C3B4", d: 2.6, desc: "260gsm · 98% cotton / 2% elastane" },
    ],
  },
  {
    step: 2, code: "finish", name: "Finish", fam: "woven", control: "swatch", values: [
      { code: "mill", name: "Mill finish", hex: "#E8DFD1", d: 0, desc: "As-woven, pressed", cnDesc: "原布整烫" },
      { code: "gmt", name: "Garment wash", hex: "#DFD4C2", d: 0.9, desc: "Softened, relaxed hand", cnDesc: "成衣水洗" },
      { code: "enzyme", name: "Enzyme softened", hex: "#D5C9B4", d: 1.4, desc: "Enzyme bath, extra drape", cnDesc: "酵素柔软洗" },
      { code: "crease", name: "Permanent crease", hex: "#CDC0A8", d: 1.8, desc: "Heat-set front crease", cnDesc: "定型压线" },
    ],
  },
  {
    step: 3, code: "wpocket", name: "Back pockets", fam: "woven", control: "row", values: [
      { code: "welt2", name: "Double welt", desc: "Two jetted welt pockets, tailored", d: 0 },
      { code: "welt1", name: "Single welt", desc: "One jetted welt, right side", d: -0.2 },
      { code: "welt-btn", name: "Welt with button tab", desc: "Jetted welt plus closure tab", d: 0.8 },
      { code: "wnone", name: "No back pockets", desc: "Clean seat", d: -0.35 },
    ],
  },
  {
    step: 3, code: "wlabel", name: "Branding label", fam: "woven", control: "row", values: [
      { code: "wov-in", name: "Woven inner label", desc: "Damask woven, centre back", d: 0 },
      { code: "wov-tab", name: "Side seam tab", desc: "Folded woven tab, left hip", d: 0.35 },
      { code: "print-in", name: "Printed inner label", desc: "Heat-transfer, tagless", d: 0.2 },
      { code: "wnolabel", name: "No label", desc: "Unbranded, buyer applies", d: -0.15 },
    ],
  },
  {
    step: 2, code: "stripe", name: "Yarn-dyed fabric", fam: "yarndye", control: "swatch", values: [
      { code: "str-multi", name: "Multi stripe", hex: "#D9CFA0", d: 0, desc: "11oz yarn-dyed cotton · base quality", cnDesc: "11安色织棉 · 基础品质" },
      { code: "str-pastel", name: "Pastel stripe", hex: "#CFD9D2", d: 0.8, desc: "11oz yarn-dyed, softened palette", cnDesc: "11安色织，柔和色系" },
      { code: "str-mono", name: "Ecru / black stripe", hex: "#C6C2B8", d: 0.8, desc: "11oz yarn-dyed, two-tone", cnDesc: "11安色织，双色" },
      { code: "str-wide", name: "Wide awning stripe", hex: "#D3B79C", d: 1.2, desc: "12oz yarn-dyed, broad repeat", cnDesc: "12安色织，宽条循环" },
      { code: "str-custom", name: "Custom stripe to artwork", hex: "#B9A98F", d: 4.2, desc: "Loom set to your repeat · MOQ 500", cnDesc: "按图定织循环 · 起订500条" },
    ],
  },
  {
    step: 2, code: "sfinish", name: "Finish", fam: "yarndye", control: "swatch", values: [
      { code: "s-mill", name: "Mill finish", hex: "#E4DECB", d: 0, desc: "As-woven, pressed", cnDesc: "原布整烫" },
      { code: "s-gmt", name: "Garment wash", hex: "#DAD3BE", d: 0.9, desc: "Softened, slight shrink set", cnDesc: "成衣水洗" },
      { code: "s-enzyme", name: "Enzyme softened", hex: "#D0C8B2", d: 1.4, desc: "Enzyme bath, relaxed hand", cnDesc: "酵素柔软洗" },
    ],
  },
];

/** True when group `g` applies to family `fam`. Groups with no `fam` apply to all. */
export function inFam(g: { fam?: Family | Family[] }, fam: Family): boolean {
  if (!g.fam) return true;
  return Array.isArray(g.fam) ? g.fam.includes(fam) : g.fam === fam;
}

/** The two groups whose values feed the customiser preview caption, per family. */
export const FAM_PAIR: Record<Family, [GroupCode, GroupCode]> = {
  denim: ["fabric", "wash"],
  woven: ["cloth", "finish"],
  yarndye: ["stripe", "sfinish"],
};

/** Seeds the relevant selections when a style's family changes. */
export const FAM_DEFAULTS: Record<Family, Partial<Selection>> = {
  denim: { fabric: "raw12", wash: "vint-l", hardware: "antique", thread: "gold", patch: "std", pocket: "arc" },
  woven: { cloth: "lin-nat", finish: "gmt", hardware: "nickel", thread: "tonal", wpocket: "welt2", wlabel: "wov-in" },
  yarndye: { stripe: "str-multi", sfinish: "s-gmt", hardware: "antique", thread: "ecru", patch: "std", pocket: "plain" },
};

/** Every option key, seeded with the denim defaults — the store's starting `sel`. */
export const DEFAULT_SEL: Selection = {
  fabric: "raw12", wash: "vint-l", hardware: "antique", thread: "gold", patch: "std", pocket: "arc",
  cloth: "lin-nat", finish: "gmt", wpocket: "welt2", wlabel: "wov-in",
  stripe: "str-multi", sfinish: "s-gmt",
};

export const CURRENCIES: Currency[] = [
  { code: "USD", sym: "$", rate: 1 },
  { code: "AUD", sym: "A$", rate: 1.52 },
  { code: "EUR", sym: "€", rate: 0.92 },
  { code: "SGD", sym: "S$", rate: 1.34 },
  { code: "NZD", sym: "NZ$", rate: 1.66 },
  { code: "CNY", sym: "¥", rate: 7.18 },
];

export const TIERS: Tier[] = [
  { min: 200, off: 0, label: "200–299 PCS · BASE" },
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

export const FACTORY_ADDRESS: Record<"en" | "zh", string[]> = {
  en: ["Denim Assembly — Manufacturing", "Jun'an Town, Shunde District", "Foshan City, Guangdong Province, China"],
  zh: ["Denim Assembly 制衣厂", "广东省佛山市顺德区", "均安镇"],
};
