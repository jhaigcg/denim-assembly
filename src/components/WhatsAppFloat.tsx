"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_LINK } from "@/lib/data";
import { T } from "@/lib/i18n";
import { clsx } from "@/lib/clsx";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Global click-to-chat bubble, bottom-right on every screen. The customiser's
 * own sticky bottom bar (its size-run CTA) sits at the true page bottom below
 * 900px, so this lifts clear of it there rather than risk overlapping it.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const lang = useAppStore((s) => (hydrated ? s.lang : "en"));
  const t = T[lang];
  const liftForStickyBar = pathname.startsWith("/customiser");

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener"
      aria-label={t.whatsappAria}
      title={t.whatsappAria}
      className={clsx(
        "fixed right-4 sm:right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.22)] hover:bg-[#1DA851] transition-colors",
        liftForStickyBar ? "bottom-[104px]" : "bottom-4 sm:bottom-5",
      )}
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
}
