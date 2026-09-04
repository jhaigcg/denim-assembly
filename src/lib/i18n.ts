import type { GroupCode, Lang } from "./types";

/**
 * All UI copy, both languages — ported verbatim from the design reference `const T`.
 * English is the default. Language switching must be instant and non-destructive.
 */

export interface Dict {
  tagline: string;
  contact: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  heroChips: string[];
  heroCta: string;
  heroCta2: string;
  fdBadge: string;
  fdStrip: string[];
  heroBadge: string;
  fobPc: string;
  saveConfig: string;
  shareLink: string;
  baseStyleHead: string;
  fobPer: string;
  sizeRunNote: string;
  blockHead: string;
  qtyHead: string;
  pcs: string;
  tier: string;
  perPc: string;
  belowMoqNote: string;
  samplingOnly: string;
  editSpec: string;
  ref: string;
  valid: string;
  yourSpec: string;
  pricingHead: string;
  yourDetails: string;
  notesLabel: string;
  notesPh: string;
  submitBtn: string;
  savePdf: string;
  slotProduct: string;
  slotPreview: string;
  footerBlurb: string;
  factory: string;
  enquiries: string;
  tradeTerms: string;
  whatsapp: string;
  hours: string;
  termsList: string[];
  copyright: string;
  legal: string[];
  tabs: { showroom: string; customiser: string };
  filters: string[];
  measures: string[];
  included: string;
  summarySpec: string;
  summarySample: string;
  grandTotal: string;
  grandSample: string;
  kBaseStyle: string;
  kQty: string;
  kSampleQty: string;
  kSampleSize: string;
  kBulkQty: string;
  kSizeRun: string;
  kTier: string;
  kUnit: string;
  kLine: string;
  kSampling: string;
  kSealed: string;
  kBulkPrice: string;
  kFreight: string;
  freightVal: string;
  baseUnit: string;
  blockLine: string;
  volDisc: string;
  sampleLine: string;
  ctaMin: string;
  ctaGo: string;
  balanced: string;
  allocated: string;
  of: string;
  fields: [string, string][];
  termsBulk: string;
  days: string;
  pcsLower: string;
}

export const T: Record<Lang, Dict> = {
  en: {
    tagline: "Customised Jeans",
    contact: "Contact",
    heroEyebrow: "FACTORY DIRECT · 13 base styles · MOQ 100 pcs",
    heroTitle: "Your label, cut on our floor.",
    heroBody:
      "Pick a base style. Specify denim quality, wash, hardware and trim, then set your size run. Minimum order 100 pieces per style — FOB from US$12.40 per piece, quoted in USD, AUD, EUR, SGD, NZD or CNY.",
    heroChips: ["MOQ 100 pcs / style", "Tiered price breaks", "~4 week lead time"],
    heroCta: "Build a spec & get pricing →",
    heroCta2: "Talk to our team",
    fdBadge: "FACTORY DIRECT",
    fdStrip: ["Manufacturer, not an agent", "No trading-company markup", "Factory-gate pricing"],
    heroBadge: "12 OZ RAW INDIGO · 100% COTTON",
    fobPc: "FOB /PC @ 100",
    saveConfig: "Save configuration",
    shareLink: "Share link",
    baseStyleHead: "Base style · 13 blocks",
    fobPer: "FOB / pc",
    sizeRunNote:
      "Standard grade W28–W38, L30/32/34. Split the run across sizes — the total must match your order quantity.",
    blockHead: "Block adjustment by size",
    qtyHead: "Order quantity · MOQ 100",
    pcs: "PCS",
    tier: "Tier",
    perPc: "/ pc",
    belowMoqNote:
      "Below minimum. Wholesale orders start at 100 pcs per style — adjust the quantity to continue, or order a sampling run instead.",
    samplingOnly: "Sampling only",
    editSpec: "← Edit specification",
    ref: "REF",
    valid: "VALID 30 DAYS",
    yourSpec: "Your specification",
    pricingHead: "Indicative pricing",
    yourDetails: "Your details",
    notesLabel: "Notes — artwork, labels, packing, target price",
    notesPh: "Anything our pattern room should know",
    submitBtn: "Submit & email to Denim Assembly",
    savePdf: "Save as PDF",
    slotProduct: "Drop product shot",
    slotPreview: "Drop customiser preview render",
    footerBlurb:
      "Vertically integrated denim manufacturing — pattern room, cutting, sewing, in-house wash house and QC under one roof.",
    factory: "Factory",
    enquiries: "Enquiries",
    tradeTerms: "Trade terms",
    whatsapp: "WhatsApp / WeChat — to be supplied",
    hours: "Mon–Sun, 09:00–18:00 GMT+8",
    termsList: [
      "MOQ 100 pcs per style",
      "FOB Shenzhen · CIF on request",
      "Sampling US$70 · ~4 week lead",
      "30% deposit, balance vs. B/L",
    ],
    copyright: "© 2026 Denim Assembly · denimassembly.com",
    legal: ["Privacy", "Terms of sale", "Responsible sourcing"],
    tabs: { showroom: "Showroom", customiser: "Customiser" },
    filters: ["All styles", "Wide leg", "Straight", "Flare", "High rise", "Raw denim", "Stretch", "Women’s"],
    measures: ["Waist", "Hip", "Thigh", "Knee", "Inseam", "Leg opening"],
    included: "included",
    summarySpec: "Specification summary",
    summarySample: "Sampling request",
    grandTotal: "Estimated total",
    grandSample: "Sample cost",
    kBaseStyle: "Base style",
    kQty: "Order quantity",
    kSampleQty: "Sample quantity",
    kSampleSize: "Sample size",
    kBulkQty: "Intended bulk quantity",
    kSizeRun: "Size run",
    kTier: "Price tier",
    kUnit: "Unit price (FOB Shenzhen)",
    kLine: "Line total",
    kSampling: "Sampling fee (one-off)",
    kSealed: "Sealed sample × 1",
    kBulkPrice: "Indicative bulk price at",
    kFreight: "Freight",
    freightVal: "At cost, on request",
    baseUnit: "base unit",
    blockLine: "Modified block (per pc)",
    volDisc: "Volume discount",
    sampleLine: "Sampling fee · one-off",
    ctaMin: "Minimum 100 pcs to continue",
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
    termsBulk:
      "Indicative only. Final pricing is confirmed after fabric availability, artwork review and a sealed sample. Terms: 30% deposit, balance against B/L copy. Lead time approx. 4 weeks after sample approval.",
    days: "DAYS",
    pcsLower: "pcs",
  },
  zh: {
    tagline: "牛仔裤定制",
    contact: "联系我们",
    heroEyebrow: "工厂直销 · 13 款基础版型 · 起订量 100 条",
    heroTitle: "您的品牌，我们的车间。",
    heroBody:
      "选择基础版型，指定面料、洗水、五金与辅料，再设定尺码配比。每款起订 100 条 — FOB 单价 12.40 美元起，可用 USD、AUD、EUR、SGD、NZD 或 CNY 报价。",
    heroChips: ["每款起订 100 条", "阶梯价格优惠", "交期约 4 周"],
    heroCta: "定制并获取报价 →",
    heroCta2: "联系我们的团队",
    fdBadge: "工厂直销",
    fdStrip: ["我们是制衣厂，非代理", "无贸易公司加价", "出厂价直接采购"],
    heroBadge: "12 安士原色靛蓝 · 100% 全棉",
    fobPc: "FOB/条 @100条",
    saveConfig: "保存配置",
    shareLink: "分享链接",
    baseStyleHead: "基础版型 · 13 款",
    fobPer: "FOB 单价",
    sizeRunNote: "标准码 W28–W38，裤长 L30/32/34。按尺码分配数量 — 合计须等于订单数量。",
    blockHead: "按尺码调整版型",
    qtyHead: "订单数量 · 起订 100 条",
    pcs: "条",
    tier: "价格档",
    perPc: "/ 条",
    belowMoqNote: "低于起订量。每款批发订单起订 100 条 — 请调整数量后继续，或改为下单打样。",
    samplingOnly: "仅打样",
    editSpec: "← 修改规格",
    ref: "编号",
    valid: "有效期 30 天",
    yourSpec: "您的定制规格",
    pricingHead: "参考报价",
    yourDetails: "您的联系资料",
    notesLabel: "备注 — 图案、唛头、包装、目标价格",
    notesPh: "任何需要版房了解的信息",
    submitBtn: "提交并发送至 Denim Assembly",
    savePdf: "保存为 PDF",
    slotProduct: "拖入产品图",
    slotPreview: "拖入定制预览图",
    footerBlurb: "垂直一体化牛仔制造 — 版房、裁剪、车缝、自有洗水厂与品质检验一体化生产。",
    factory: "工厂地址",
    enquiries: "业务咨询",
    tradeTerms: "贸易条款",
    whatsapp: "WhatsApp / 微信 — 待提供",
    hours: "周一至周日 09:00–18:00（GMT+8）",
    termsList: [
      "每款起订 100 条",
      "FOB 深圳 · 可询 CIF",
      "打样费 70 美元 · 交期约 4 周",
      "30% 订金，余款凭提单副本",
    ],
    copyright: "© 2026 Denim Assembly · denimassembly.com",
    legal: ["隐私政策", "销售条款", "责任采购"],
    tabs: { showroom: "产品展厅", customiser: "定制配置" },
    filters: ["全部款式", "阔腿", "直筒", "喇叭", "高腰", "原色牛仔", "弹力", "女款"],
    measures: ["腰围", "臀围", "大腿围", "膝围", "内长", "脚口"],
    included: "已包含",
    summarySpec: "定制规格汇总",
    summarySample: "打样申请",
    grandTotal: "预估总额",
    grandSample: "打样费用",
    kBaseStyle: "基础版型",
    kQty: "订单数量",
    kSampleQty: "打样数量",
    kSampleSize: "打样尺码",
    kBulkQty: "预计大货数量",
    kSizeRun: "尺码配比",
    kTier: "价格档",
    kUnit: "单价（FOB 深圳）",
    kLine: "货款小计",
    kSampling: "打样费（一次性）",
    kSealed: "封样 × 1 条",
    kBulkPrice: "大货参考单价 @",
    kFreight: "运费",
    freightVal: "按实际费用，另询",
    baseUnit: "基础单价",
    blockLine: "版型调整（每条）",
    volDisc: "数量折扣",
    sampleLine: "打样费 · 一次性",
    ctaMin: "起订量 100 条",
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
    termsBulk:
      "此为参考报价。最终价格需在确认面料供应、图案审核及封样后确定。付款条款：30% 订金，余款凭提单副本支付。封样确认后交期约 4 周。",
    days: "天",
    pcsLower: "条",
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
};

export const OPT_CN: Record<string, string> = {
  raw12: "12安原色靛蓝", vint13: "13安复古面料", heavy14: "14安厚重面料", blk11: "11安弹力黑", rec12: "12安再生环保", emb: "印花+绣花面料",
  none: "原色未水洗", rinse: "轻漂洗", "vint-l": "浅复古洗水", "vint-m": "中度复古洗水", "vint-h": "重度复古洗水", bleach: "漂白洗水", snow: "雪花洗",
  antique: "古铜色", nickel: "拉丝镍", black: "哑黑", copper: "紫铜",
  gold: "金黄线", tonal: "同色靛蓝线", ecru: "本白线", red: "铁锈红线",
  std: "标准压印皮牌", jacron: "仿皮牌（纯素）", woven: "织唛标", "none-patch": "不加皮牌",
  plain: "素面", arc: "弧线绣花", print: "丝网印花", custom: "印花 + 绣花",
};

export interface Step {
  no: string;
  label: string;
  cnLabel: string;
  title: string;
  cnTitle: string;
  hint: string;
  cnHint: string;
}

export const STEPS: Step[] = [
  { no: "01", cnLabel: "基础版型", cnTitle: "选择基础版型", cnHint: "13 款已出格的生产版型。价格为起订 100 条时的 FOB 单价 — 下方可查看数量折扣。", label: "Base style", title: "Choose your base style", hint: "Thirteen graded production blocks. Prices are FOB per piece at MOQ 100 — volume breaks apply below." },
  { no: "02", cnLabel: "面料与洗水", cnTitle: "面料品质与洗水", cnHint: "面料加价以 12 安原色靛蓝为基准，按条计算。洗水在本厂洗水房于车缝后完成。", label: "Fabric & wash", title: "Denim quality and wash", hint: "Fabric upcharges are per piece against the 12oz raw indigo base. Wash runs in our own wash house after sewing." },
  { no: "03", cnLabel: "细节辅料", cnTitle: "五金与辅料", cnHint: "钮扣、拉链、缝线颜色、皮牌与后袋图案。不兼容的组合会自动禁用。", label: "Detail", title: "Hardware and trim", hint: "Buttons, zip, stitch colour, patch and pocket art. Incompatible pairings are disabled automatically." },
  { no: "04", cnLabel: "尺码与数量", cnTitle: "尺码配比与数量", cnHint: "按标准码分配订单数量，或调整版型以符合您的规格表。", label: "Size run", title: "Size run and quantity", hint: "Split your order across the standard grade, or modify the block to your own spec sheet." },
];

/** Chinese label for a chosen option value, with the patch/"none" remap the design uses. */
export function optLabel(lang: Lang, groupCode: GroupCode, code: string, fallback: string) {
  if (lang !== "zh") return fallback;
  const key = groupCode === "patch" && code === "none" ? "none-patch" : code;
  return OPT_CN[key] || fallback;
}
