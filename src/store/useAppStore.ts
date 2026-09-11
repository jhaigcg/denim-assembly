"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEFAULT_RUN,
  DEFAULT_SEL,
  FAM_DEFAULTS,
  SIZES,
  seedMeasurements,
} from "@/lib/data";
import { famFor, styleFor } from "@/lib/pricing";
import type {
  ContactDetails,
  CurrencyCode,
  GroupCode,
  Lang,
  Measurements,
  PreviewView,
  Selection,
  SubmitState,
} from "@/lib/types";

interface AppState {
  lang: Lang;
  currency: CurrencyCode;
  step: 1 | 2 | 3 | 4;
  styleCode: string;
  previewView: PreviewView;
  sel: Selection;
  qty: number | string;
  run: (number | string)[];
  blockSize: string;
  m: Record<string, Measurements>;
  sampleOnly: boolean;
  contact: ContactDetails;
  submitState: SubmitState;
  quoteRef: string | null;

  setLang: (l: Lang) => void;
  setCurrency: (c: CurrencyCode) => void;
  setStep: (s: 1 | 2 | 3 | 4) => void;
  /** Change the base style within the customiser (no screen/step jump). */
  setStyle: (code: string) => void;
  /** Jump into the customiser at step 2 with a style pre-selected (showroom card click). */
  openStyle: (code: string) => void;
  toggleView: () => void;
  pick: (group: GroupCode, value: string) => void;
  setQty: (q: number | string) => void;
  /** Set quantity AND rescale the size run proportionally so it stays balanced. */
  setQtyBalanced: (q: number) => void;
  setRun: (i: number, v: number | string) => void;
  /** Rescale the current run proportionally to match the current quantity. */
  balanceRun: () => void;
  /** Spread the current quantity evenly across every size. */
  evenSplitRun: () => void;
  setBlockSize: (s: string) => void;
  setMeasure: (size: string, key: keyof Measurements, v: number | string) => void;
  setSampleOnly: (v: boolean) => void;
  setContact: (patch: Partial<ContactDetails>) => void;
  setSubmitState: (s: SubmitState) => void;
  ensureQuoteRef: () => string;
}

const toNum = (v: number | string) => Number(v) || 0;

/**
 * Distribute `target` pieces across `run.length` sizes, keeping the existing
 * proportions where possible. Falls back to an even split when the run is empty.
 * Always returns whole numbers that sum exactly to `target`.
 */
function rescaleRun(run: (number | string)[], target: number): number[] {
  const n = run.length;
  if (n === 0) return [];
  const t = Math.max(0, Math.round(target));
  if (t === 0) return run.map(() => 0);

  const nums = run.map((v) => Math.max(0, toNum(v)));
  const sum = nums.reduce((a, b) => a + b, 0);

  const raw =
    sum > 0 ? nums.map((v) => (v / sum) * t) : nums.map(() => t / n);
  const out = raw.map((x) => Math.floor(x));
  let remainder = t - out.reduce((a, b) => a + b, 0);

  // Hand the leftover pieces to the sizes with the largest fractional part.
  const order = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; remainder > 0; k++, remainder--) out[order[k % n].i] += 1;

  return out;
}

/** Selecting a style seeds that family's defaults, so switching from e.g. a woven
 * style back to denim restores sensible denim picks rather than leaving woven codes
 * selected against groups that no longer apply. */
function selectionForStyle(prevSel: Selection, styleCode: string): Selection {
  const fam = famFor(styleFor(styleCode));
  return { ...prevSel, ...FAM_DEFAULTS[fam] };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: "en",
      currency: "USD",
      step: 1,
      styleCode: "DA-01",
      previewView: "front",
      sel: { ...DEFAULT_SEL },
      qty: 300,
      run: [...DEFAULT_RUN],
      blockSize: SIZES[0],
      m: seedMeasurements(),
      sampleOnly: false,
      contact: { company: "", name: "", email: "", country: "", notes: "" },
      submitState: "idle",
      quoteRef: null,

      setLang: (lang) => set({ lang }),
      setCurrency: (currency) => set({ currency }),
      setStep: (step) => set({ step }),
      setStyle: (styleCode) =>
        set((s) => ({
          styleCode,
          previewView: "front",
          sel: selectionForStyle(s.sel, styleCode),
        })),
      openStyle: (styleCode) =>
        set((s) => ({
          styleCode,
          step: 2,
          previewView: "front",
          sel: selectionForStyle(s.sel, styleCode),
        })),
      toggleView: () =>
        set((s) => ({ previewView: s.previewView === "back" ? "front" : "back" })),
      pick: (group, value) => set((s) => ({ sel: { ...s.sel, [group]: value } })),
      setQty: (qty) => set({ qty }),
      setQtyBalanced: (qty) =>
        set((s) => ({ qty, run: rescaleRun(s.run, qty) })),
      setRun: (i, v) =>
        set((s) => {
          const run = s.run.slice();
          run[i] = v;
          return { run };
        }),
      balanceRun: () => set((s) => ({ run: rescaleRun(s.run, toNum(s.qty)) })),
      evenSplitRun: () =>
        set((s) => ({ run: rescaleRun(s.run.map(() => 1), toNum(s.qty)) })),
      setBlockSize: (blockSize) => set({ blockSize }),
      setMeasure: (size, key, v) =>
        set((s) => ({
          m: { ...s.m, [size]: { ...s.m[size], [key]: v } },
        })),
      setSampleOnly: (sampleOnly) => set({ sampleOnly }),
      setContact: (patch) => set((s) => ({ contact: { ...s.contact, ...patch } })),
      setSubmitState: (submitState) => set({ submitState }),
      ensureQuoteRef: () => {
        const existing = get().quoteRef;
        if (existing) return existing;
        // Prototype-grade ref. Production needs a real sequence persisted server-side.
        const ref = "DA-Q-" + String(Date.now()).slice(-6);
        set({ quoteRef: ref });
        return ref;
      },
    }),
    {
      // v2: 21-style catalogue with product families (denim/woven/yarndye) replaced
      // the v1 13-style shape — bump the key so a v1 localStorage blob (old MOQ,
      // old option codes) never gets rehydrated into the new state shape.
      name: "denim-assembly:v2",
      storage: createJSONStorage(() => localStorage),
      // Rehydrate manually after mount so SSR and first client render both use
      // the defaults above — no hydration mismatch on prices / language.
      skipHydration: true,
      partialize: (s) => ({
        lang: s.lang,
        currency: s.currency,
        step: s.step,
        styleCode: s.styleCode,
        previewView: s.previewView,
        sel: s.sel,
        qty: s.qty,
        run: s.run,
        blockSize: s.blockSize,
        m: s.m,
        sampleOnly: s.sampleOnly,
        contact: s.contact,
        quoteRef: s.quoteRef,
      }),
    },
  ),
);
