import type { Family, GroupCode, Lang } from "./types";

/**
 * All UI copy, both languages — ported from the design reference `const T`, then
 * adapted for a request-a-quote flow: no price, discount or fee figure is shown
 * to the buyer anywhere in the customer-facing UI. `pricing.ts` still computes
 * the real numbers server-side, for the factory's own reference in the
 * submission it receives — see `src/app/api/quote/route.ts`.
 * English is the default. Language switching must be instant and non-destructive.
 */

export interface Dict {
  tagline: string;
  contact: string;
  heroEyebrow2: string;
  heroStyleRef: string;
  heroSpecLabels: string[];
  heroSpecValues: string[];
  heroTitle: string;
  heroBody: string;
  heroCta: string;
  heroCta2: string;
  fdBadge: string;
  fdStrip: string[];
  heroBadge: string;
  saveConfig: string;
  shareLink: string;
  baseStyleHead: string;
  sizeRunNote: string;
  blockHead: string;
  qtyHead: string;
  pcs: string;
  belowMoqNote: string;
  samplingOnly: string;
  editSpec: string;
  ref: string;
  yourSpec: string;
  yourDetails: string;
  notesLabel: string;
  notesPh: string;
  submitBtn: string;
  savePdf: string;
  slotProduct: string;
  slotPreview: string;
  backView: string;
  frontView: string;
  footerBlurb: string;
  factory: string;
  enquiries: string;
  tradeTerms: string;
  hours: string;
  termsList: string[];
  copyright: string;
  legal: string[];
  tabs: { showroom: string; customiser: string };
  filters: string[];
  measures: string[];
  summarySpec: string;
  summarySample: string;
  kBaseStyle: string;
  kQty: string;
  kSampleQty: string;
  kSampleSize: string;
  kBulkQty: string;
  kSizeRun: string;
  ctaMin: string;
  ctaGo: string;
  balanced: string;
  allocated: string;
  of: string;
  fields: [string, string][];
  quoteNote: string;
  nextStepsHead: string;
  replyPromise: string;
  sampleTerms: string;
  bulkTerms: string;
  days: string;
  pcsLower: string;
  /** Internal price-breakdown line labels — used by `pricing.ts` for the
   * submission record/email sent to the factory, never rendered to the buyer. */
  baseUnit: string;
  blockLine: string;
  volDisc: string;
  sampleLine: string;
}

export const T: Record<Lang, Dict> = {
  en: {
    tagline: "Customised Jeans",
    contact: "Contact",
    heroEyebrow2: "Thousand base styles",
    heroStyleRef: "DA-18 · Barrel Denim Jeans",
    heroSpecLabels: ["Minimum order", "Turnaround", "Lead time"],
    heroSpecValues: ["200 pcs / style", "1 business day", "~4 weeks"],
    heroTitle: "Your label, cut on our floor.",
    heroBody:
      "Pick a base style. Specify denim quality, wash, hardware and trim, then set your size run. Minimum order 200 pieces per style. Submit your specification and our team will follow up with a formal quotation.",
    heroCta: "Build a spec & request a quote →",
    heroCta2: "Talk to our team",
    fdBadge: "FACTORY DIRECT",
    fdStrip: ["Manufacturer, not an agent", "No trading-company markup", "Factory-gate pricing"],
    heroBadge: "13 OZ WASHED KHAKI · 100% COTTON",
    saveConfig: "Save configuration",
    shareLink: "Share link",
    baseStyleHead: "Base style · 21 blocks",
    sizeRunNote:
      "Standard grade W28–W38, L30/32/34. Split the run across sizes — the total must match your order quantity.",
    blockHead: "Block adjustment by size",
    qtyHead: "Order quantity · MOQ 200",
    pcs: "PCS",
    belowMoqNote:
      "Below minimum. Wholesale orders start at 200 pcs per style — adjust the quantity to continue, or order a sampling run instead.",
    samplingOnly: "Sampling only",
    editSpec: "← Edit specification",
    ref: "REF",
    yourSpec: "Your specification",
    yourDetails: "Your details",
    notesLabel: "Notes — artwork, labels, packing, target price",
    notesPh: "Anything our pattern room should know",
    submitBtn: "Submit & email to Denim Assembly",
    savePdf: "Save as PDF",
    slotProduct: "Drop product shot",
    slotPreview: "Drop customiser preview render",
    backView: "BACK",
    frontView: "FRONT",
    footerBlurb:
      "Vertically integrated denim manufacturing — pattern room, cutting, sewing, in-house wash house and QC under one roof.",
    factory: "Factory",
    enquiries: "Enquiries",
    tradeTerms: "Trade terms",
    hours: "Mon–Sun, 09:00–18:00 GMT+8",
    termsList: [
      "MOQ 200 pcs per style",
      "FOB Guangzhou · CIF on request",
      "Sampling available · ~4 week lead",
      "30% deposit, balance vs. B/L",
    ],
    copyright: "© 2026 Denim Assembly · denimassembly.com",
    legal: ["Privacy", "Terms of sale", "Responsible sourcing"],
    tabs: { showroom: "Showroom", customiser: "Customiser" },
    filters: ["All styles", "Wide leg", "Straight", "Flare", "High rise", "Raw denim", "Stretch", "Women’s"],
    measures: ["Waist", "Hip", "Thigh", "Knee", "Inseam", "Leg opening"],
    summarySpec: "Specification summary",
    summarySample: "Sampling request",
    kBaseStyle: "Base style",
    kQty: "Order quantity",
    kSampleQty: "Sample quantity",
    kSampleSize: "Sample size",
    kBulkQty: "Intended bulk quantity",
    kSizeRun: "Size run",
    ctaMin: "Minimum 200 pcs to continue",
    ctaGo: "Review & submit",
    balanced: "Balanced",
    allocated: "allocated",
    of: "of",
    fields: [
      ["Company / brand", "Registered company name"],
      ["Contact name", "Who we reply to"],
      ["Email", "name@company.com"],
      ["Country / port", "e.g. Australia · Sydney"],
    ],
    quoteNote: "No price is shown here — submit your spec and we'll reply with a formal quotation.",
    nextStepsHead: "What happens next",
    replyPromise: "We reply within 1 business day.",
    sampleTerms:
      "One sealed sample sewn to this specification, plus freight. Approx. 10 days. We'll confirm the sampling fee when we respond, and it's credited against your first bulk order (MOQ 200 pcs).",
    bulkTerms:
      "This specification will be reviewed by our pattern room. We'll reply with a formal quotation confirming pricing, lead time and payment terms. Terms: 30% deposit, balance against B/L copy. Lead time approx. 4 weeks after sample approval.",
    days: "DAYS",
    pcsLower: "pcs",
    baseUnit: "base unit",
    blockLine: "Modified block (per pc)",
    volDisc: "Volume discount",
    sampleLine: "Sampling fee · one-off",
  },
  zh: {
    tagline: "牛仔裤定制",
    contact: "联系我们",
    heroEyebrow2: "千款基础版型",
    heroStyleRef: "DA-18 · 桶形牛仔裤",
    heroSpecLabels: ["最低起订", "回复时效", "交期"],
    heroSpecValues: ["每款 200 条", "1 个工作日", "约 4 周"],
    heroTitle: "您的品牌，我们的车间。",
    heroBody:
      "选择基础版型，指定面料、洗水、五金与辅料，再设定尺码配比。每款起订 200 条。提交您的定制规格，我们的团队将为您回复正式报价。",
    heroCta: "定制并申请报价 →",
    heroCta2: "联系我们的团队",
    fdBadge: "工厂直销",
    fdStrip: ["我们是制衣厂，非代理", "无贸易公司加价", "出厂价直接采购"],
    heroBadge: "13 安士水洗卡其 · 100% 全棉",
    saveConfig: "保存配置",
    shareLink: "分享链接",
    baseStyleHead: "基础版型 · 21 款",
    sizeRunNote: "标准码 W28–W38，裤长 L30/32/34。按尺码分配数量 — 合计须等于订单数量。",
    blockHead: "按尺码调整版型",
    qtyHead: "订单数量 · 起订 200 条",
    pcs: "条",
    belowMoqNote: "低于起订量。每款批发订单起订 200 条 — 请调整数量后继续，或改为下单打样。",
    samplingOnly: "仅打样",
    editSpec: "← 修改规格",
    ref: "编号",
    yourSpec: "您的定制规格",
    yourDetails: "您的联系资料",
    notesLabel: "备注 — 图案、唛头、包装、目标价格",
    notesPh: "任何需要版房了解的信息",
    submitBtn: "提交并发送至 Denim Assembly",
    savePdf: "保存为 PDF",
    slotProduct: "拖入产品图",
    slotPreview: "拖入定制预览图",
    backView: "背面",
    frontView: "正面",
    footerBlurb: "垂直一体化牛仔制造 — 版房、裁剪、车缝、自有洗水厂与品质检验一体化生产。",
    factory: "工厂地址",
    enquiries: "业务咨询",
    tradeTerms: "贸易条款",
    hours: "周一至周日 09:00–18:00（GMT+8）",
    termsList: [
      "每款起订 200 条",
      "FOB 广州 · 可询 CIF",
      "可申请打样 · 交期约 4 周",
      "30% 订金，余款凭提单副本",
    ],
    copyright: "© 2026 Denim Assembly · denimassembly.com",
    legal: ["隐私政策", "销售条款", "责任采购"],
    tabs: { showroom: "产品展厅", customiser: "定制配置" },
    filters: ["全部款式", "阔腿", "直筒", "喇叭", "高腰", "原色牛仔", "弹力", "女款"],
    measures: ["腰围", "臀围", "大腿围", "膝围", "内长", "脚口"],
    summarySpec: "定制规格汇总",
    summarySample: "打样申请",
    kBaseStyle: "基础版型",
    kQty: "订单数量",
    kSampleQty: "打样数量",
    kSampleSize: "打样尺码",
    kBulkQty: "预计大货数量",
    kSizeRun: "尺码配比",
    ctaMin: "起订量 200 条",
    ctaGo: "确认并提交",
    balanced: "已配平",
    allocated: "已分配",
    of: "/",
    fields: [
      ["公司 / 品牌", "公司注册名称"],
      ["联系人", "我们回复的对象"],
      ["电子邮箱", "name@company.com"],
      ["国家 / 港口", "例：澳大利亚 · 悉尼"],
    ],
    quoteNote: "此处不显示价格 — 提交规格后，我们将为您回复正式报价。",
    nextStepsHead: "接下来会发生什么",
    replyPromise: "我们将在 1 个工作日内回复。",
    sampleTerms:
      "按此规格车缝封样一条（另加运费），约需 10 天。打样费将在我们回复时为您确认，该费用可在首个大货订单（起订 200 条）中抵扣。",
    bulkTerms:
      "此规格将由我们的版房审核。我们将回复正式报价，确认价格、交期与付款条款。条款：30% 订金，余款凭提单副本支付。封样确认后交期约 4 周。",
    days: "天",
    pcsLower: "条",
    baseUnit: "基础单价",
    blockLine: "版型调整（每条）",
    volDisc: "数量折扣",
    sampleLine: "打样费 · 一次性",
  },
};

export const TAG_CN: Record<string, string> = {
  "Best-seller": "热销款",
  Core: "基础款",
  Trending: "流行款",
  Workwear: "工装款",
  Statement: "个性款",
  Heritage: "经典款",
  New: "新款",
};

export const GROUP_CN: Record<GroupCode, string> = {
  fabric: "面料品质",
  wash: "洗水工艺",
  hardware: "钮扣与拉链",
  thread: "缝线颜色",
  patch: "腰头皮牌",
  pocket: "后袋图案",
  cloth: "面料品质",
  finish: "整理工艺",
  wpocket: "后袋款式",
  wlabel: "品牌标签",
  stripe: "色织面料",
  sfinish: "整理工艺",
};

export const OPT_CN: Record<string, string> = {
  raw12: "12安原色靛蓝", vint13: "13安复古面料", heavy14: "14安厚重面料", blk11: "11安弹力黑", rec12: "12安再生环保", emb: "印花+绣花面料",
  none: "原色未水洗", rinse: "轻漂洗", "vint-l": "浅复古洗水", "vint-m": "中度复古洗水", "vint-h": "重度复古洗水", bleach: "漂白洗水", snow: "雪花洗",
  antique: "古铜色", nickel: "拉丝镍", black: "哑黑", copper: "紫铜",
  gold: "金黄线", tonal: "同色靛蓝线", ecru: "本白线", red: "铁锈红线",
  std: "标准压印皮牌", jacron: "仿皮牌（纯素）", woven: "织唛标", "none-patch": "不加皮牌",
  plain: "素面", arc: "弧线绣花", print: "丝网印花", custom: "印花 + 绣花",
  "str-multi": "多色条纹", "str-pastel": "柔彩条纹", "str-mono": "本白/黑条纹", "str-wide": "宽幅遮阳条", "str-custom": "按图定织条纹",
  "s-mill": "原布整烫", "s-gmt": "成衣水洗", "s-enzyme": "酵素柔软洗",
  "lin-nat": "亚麻混纺 · 本色", "lin-pure": "全亚麻水洗", "lin-hvy": "厚重亚麻斜纹", "ten-drape": "天丝垂坠", "cot-suit": "棉质西装料",
  mill: "原布整烫", gmt: "成衣水洗", enzyme: "酵素柔软洗", crease: "定型压线",
  welt2: "双开线袋", welt1: "单开线袋", "welt-btn": "开线袋加袢扣", wnone: "不设后袋",
  "wov-in": "织唛内标", "wov-tab": "侧缝织唛", "print-in": "印唛无标签", wnolabel: "不加标签",
};

export interface Step {
  no: string;
  label: string;
  cnLabel: string;
  title: string;
  cnTitle: string;
  hint: string;
  cnHint: string;
  wovenLabel?: string;
  wovenTitle?: string;
  wovenHint?: string;
  cnWovenLabel?: string;
  cnWovenTitle?: string;
  cnWovenHint?: string;
  yarnLabel?: string;
  yarnTitle?: string;
  yarnHint?: string;
  cnYarnLabel?: string;
  cnYarnTitle?: string;
  cnYarnHint?: string;
}

export const STEPS: Step[] = [
  {
    no: "01",
    label: "Base style", cnLabel: "基础版型",
    title: "Choose your base style", cnTitle: "选择基础版型",
    hint: "Twenty-one graded production blocks, ready to spec into a formal quotation.",
    cnHint: "21 款已出格的生产版型，可直接定制并申请正式报价。",
  },
  {
    no: "02",
    label: "Fabric & wash", cnLabel: "面料与洗水",
    title: "Denim quality and wash", cnTitle: "面料品质与洗水",
    hint: "Wash runs in our own wash house after sewing.",
    cnHint: "洗水在本厂洗水房于车缝后完成。",
    wovenLabel: "Fabric & finish", cnWovenLabel: "面料与整理",
    wovenTitle: "Fabric quality and finish", cnWovenTitle: "面料品质与整理工艺",
    wovenHint: "Finishing is applied after sewing in our own finishing room.",
    cnWovenHint: "整理工艺在本厂整理车间于车缝后完成。",
    yarnLabel: "Stripe & finish", cnYarnLabel: "条纹与整理",
    yarnTitle: "Yarn-dyed fabric and finish", cnYarnTitle: "色织面料与整理工艺",
    yarnHint: "Yarn-dyed cloth is woven to colour before cutting — the pattern is in the yarn, not printed on.",
    cnYarnHint: "色织面料在织造前先染纱，条纹织入布身而非印花。",
  },
  {
    no: "03",
    label: "Detail", cnLabel: "细节辅料",
    title: "Hardware and trim", cnTitle: "五金与辅料",
    hint: "Buttons, zip, stitch colour, patch and pocket art. Incompatible pairings are disabled automatically.",
    cnHint: "钮扣、拉链、缝线颜色、皮牌与后袋图案。不兼容的组合会自动禁用。",
    wovenLabel: "Detail", cnWovenLabel: "细节辅料",
    wovenTitle: "Hardware and trim", cnWovenTitle: "五金与辅料",
    wovenHint: "Buttons, zip, stitch colour, back pocket style and branding label. Incompatible pairings are disabled automatically.",
    cnWovenHint: "钮扣、拉链、缝线颜色、后袋款式与品牌标签。不兼容的组合会自动禁用。",
  },
  {
    no: "04",
    label: "Size run", cnLabel: "尺码与数量",
    title: "Size run and quantity", cnTitle: "尺码配比与数量",
    hint: "Split your order across the standard grade, or modify the block to your own spec sheet.",
    cnHint: "按标准码分配订单数量，或调整版型以符合您的规格表。",
  },
];

/** Step tab label, resolved for the style's family (falls back through woven → denim). */
export function stepLabel(step: Step, fam: Family, zh: boolean): string {
  if (fam === "yarndye") return zh ? step.cnYarnLabel || step.cnWovenLabel || step.cnLabel : step.yarnLabel || step.wovenLabel || step.label;
  if (fam === "woven") return zh ? step.cnWovenLabel || step.cnLabel : step.wovenLabel || step.label;
  return zh ? step.cnLabel : step.label;
}

/** Step title, resolved for the style's family. */
export function stepTitle(step: Step, fam: Family, zh: boolean): string {
  if (fam === "yarndye") return zh ? step.cnYarnTitle || step.cnWovenTitle || step.cnTitle : step.yarnTitle || step.wovenTitle || step.title;
  if (fam === "woven") return zh ? step.cnWovenTitle || step.cnTitle : step.wovenTitle || step.title;
  return zh ? step.cnTitle : step.title;
}

/** Step supporting line, resolved for the style's family. */
export function stepHint(step: Step, fam: Family, zh: boolean): string {
  if (fam === "yarndye") return zh ? step.cnYarnHint || step.cnWovenHint || step.cnHint : step.yarnHint || step.wovenHint || step.hint;
  if (fam === "woven") return zh ? step.cnWovenHint || step.cnHint : step.wovenHint || step.hint;
  return zh ? step.cnHint : step.hint;
}

/** Chinese label for a chosen option value, with the patch/"none" remap the design uses. */
export function optLabel(lang: Lang, groupCode: GroupCode, code: string, fallback: string) {
  if (lang !== "zh") return fallback;
  const key = groupCode === "patch" && code === "none" ? "none-patch" : code;
  return OPT_CN[key] || fallback;
}
