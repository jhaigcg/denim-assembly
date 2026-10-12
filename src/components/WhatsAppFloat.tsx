"use client";

import { usePathname } from "next/navigation";
import { WHATSAPP_LINK } from "@/lib/data";
import { T } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "./StoreHydration";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Global click-to-chat bubble, bottom-right. Not shown on the customiser: it is
 * a dense form (size-run steppers, swatches) with its own sticky quote bar, and
 * a floating bubble there covers tap targets at every screen size. WhatsApp
 * stays reachable from the header and footer on that page.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const lang = useAppStore((s) => (hydrated ? s.lang : "en"));
  const t = T[lang];

  if (pathname.startsWith("/customiser")) return null;

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener"
      aria-label={t.whatsappAria}
      title={t.whatsappAria}
      className="fixed right-4 sm:right-5 bottom-4 sm:bottom-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.22)] hover:bg-[#1DA851] transition-colors"
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
    </a>
  );
}
