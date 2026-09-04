"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * The store is persisted with `skipHydration`, so SSR and the first client render
 * both use defaults (en / USD / step 1). This kicks off rehydration once mounted.
 */
export function StoreHydration() {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);
  return null;
}

/**
 * False during SSR and the first client paint, true afterwards. Use it to gate
 * anything whose value depends on persisted state (prices, language) so the
 * markup matches on hydration.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
