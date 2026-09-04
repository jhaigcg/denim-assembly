import type { Metadata } from "next";
import "./globals.css";
import { StoreHydration } from "@/components/StoreHydration";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://denimassembly.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Denim Assembly — Customised Jeans, Factory Direct",
    template: "%s · Denim Assembly",
  },
  description:
    "B2B customised denim from a Guangdong manufacturer, factory-direct to overseas wholesale buyers. 13 base styles, deep customisation, live per-piece and order-total pricing in six currencies. MOQ 100 pcs, FOB Shenzhen.",
  keywords: [
    "custom jeans manufacturer",
    "private label denim",
    "wholesale jeans factory",
    "OEM denim China",
    "FOB Shenzhen denim",
  ],
  openGraph: {
    title: "Denim Assembly — Customised Jeans, Factory Direct",
    description:
      "Configure a denim specification and get live wholesale pricing. Manufacturer, not an agent.",
    url: siteUrl,
    siteName: "Denim Assembly",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/**
 * Fonts are loaded from Google Fonts via <link> (as in the design reference)
 * rather than next/font, so a build never depends on outbound network access.
 * The three families each have a strict job — see the brand section of the handoff.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Root-layout <head> applies site-wide (not the pages/_document pitfall the rule warns about). */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-paper text-ink">
        <StoreHydration />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
