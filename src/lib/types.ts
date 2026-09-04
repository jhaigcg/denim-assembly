export type Lang = "en" | "zh";

export type CurrencyCode = "USD" | "AUD" | "EUR" | "SGD" | "NZD" | "CNY";

export type GroupCode =
  | "fabric"
  | "wash"
  | "hardware"
  | "thread"
  | "patch"
  | "pocket";

export type ControlType = "swatch" | "row";

export interface Product {
  code: string;
  name: string;
  cn: string;
  tag: string;
  /** FOB per-piece price in USD at MOQ 100. */
  base: number;
  /** Path under /public, or undefined for a placeholder tile. */
  photo?: string;
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

export type Selection = Record<GroupCode, string>;

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
