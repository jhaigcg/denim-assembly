export type Lang = "en" | "zh";

export type CurrencyCode = "USD" | "AUD" | "EUR" | "SGD" | "NZD" | "CNY";

/**
 * A style's family decides which option groups apply to it. `denim` is the
 * default and covers most of the catalogue; `woven` and `yarndye` swap in a
 * different fabric/finish pair and a different trim set.
 */
export type Family = "denim" | "woven" | "yarndye";

export type GroupCode =
  | "fabric"
  | "wash"
  | "hardware"
  | "thread"
  | "patch"
  | "pocket"
  | "cloth"
  | "finish"
  | "wpocket"
  | "wlabel"
  | "stripe"
  | "sfinish";

export type ControlType = "swatch" | "row";

export interface Product {
  code: string;
  name: string;
  cn: string;
  tag: string;
  /** Which option groups apply. Omitted means "denim". */
  fam?: Family;
  /** FOB per-piece price in USD at MOQ 200. */
  base: number;
  /** Path under /public. Every style has one. */
  photo: string;
  /** Path under /public for the back view, or undefined if none was shot. */
  photoBack?: string;
  desc: string;
  cnDesc: string;
  /** Four hex swatches shown as 14px dots on the card. */
  sw: [string, string, string, string];
}

export interface OptionValue {
  code: string;
  name: string;
  /** Per-piece upcharge in USD. 0 → "included", negative → credit. */
  d: number;
  hex?: string;
  desc?: string;
  cnDesc?: string;
}

export interface OptionGroup {
  step: number;
  code: GroupCode;
  name: string;
  /** Restricts this group to one family or several. Omitted applies to all. */
  fam?: Family | Family[];
  control: ControlType;
  values: OptionValue[];
}

export interface Currency {
  code: CurrencyCode;
  sym: string;
  /** Demo rate against USD. Production needs a real rates source. */
  rate: number;
}

export interface Tier {
  min: number;
  off: number;
  label: string;
}

export interface Measurements {
  waist: number | string;
  hip: number | string;
  thigh: number | string;
  knee: number | string;
  inseam: number | string;
  opening: number | string;
}

/**
 * Spans every group code across all families — the store seeds every key up
 * front (see `FAM_DEFAULTS`) so switching families never loses a prior pick.
 * The family filter decides which keys are actually read for pricing/display.
 */
export type Selection = Record<GroupCode, string>;

export type PreviewView = "front" | "back";

export interface ContactDetails {
  company: string;
  name: string;
  email: string;
  country: string;
  notes: string;
}

export type SubmitState =
  | "idle"
  | "sending"
  | "sent"
  | "failed"
  | "handoff";
