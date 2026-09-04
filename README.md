# Denim Assembly — Customised Jeans Platform (Phase 1)

Customer-facing portal for a Guangdong denim manufacturer selling factory-direct
to overseas wholesale buyers. Built from the design handoff in
`../Design/牛仔裤定制平台设计 (1).zip` (`design_handoff_denim_assembly/`).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand.

## Scope

Phase 1 = the **Customer portal** only, as three screens plus a shared header /
footer:

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Showroom | Trust strip, hero, wired filter row, 13-style grid. SSR for SEO. |
| `/customiser` | Customiser | 4-step wizard, live per-piece + order-total pricing, size run, block adjustment, sampling mode. |
| `/summary` | Specification summary | Commercial document; save-as-PDF via `@media print`; submit to factory. |

The Agent, Admin and Order-tracking portals from the design file are **out of
scope** and were not ported (`PORTALS_ENABLED = false` in the prototype). The
data and copy for them are not in this build; re-derive from the design file when
Phase 2 starts.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3100
npm run build && npm start
```

Optional environment (`.env.local`, see `.env.example`) — with none set, the
summary form falls back to a `mailto:` handoff exactly as the prototype does:

| Var | Purpose |
| --- | --- |
| `FACTORY_EMAIL` | Recipient for submissions (default `sales@denimassembly.com`). |
| `RESEND_API_KEY` / `RESEND_FROM` | Enable automated email from `/api/quote`. |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for metadata / OG tags. |

## How the code maps to the design

| Concern | Location |
| --- | --- |
| Data model (styles, option groups, currencies, tiers, MOQ, sample fee) | `src/lib/data.ts` |
| Pricing maths (`priceLines`, `tierFor`, `money`, `orderTotal`) | `src/lib/pricing.ts` — shared by client and server |
| All UI copy, both languages; `STEPS`, `TAG_CN`, `GROUP_CN`, `OPT_CN` | `src/lib/i18n.ts` |
| Showroom filter → style-code map | `src/lib/filters.ts` |
| Cross-screen state (lang, currency, config, qty, run, measurements, contact) | `src/store/useAppStore.ts` (Zustand + `localStorage`) |
| Screens | `src/components/{Showroom,Customiser,Summary}.tsx` |
| Header / Footer / Logo / placeholder tile | `src/components/` |
| Submission endpoint | `src/app/api/quote/route.ts` |

### Pricing

```
unitGross  = style.base + Σ(selected option.d) + BLOCK_FEE (0.70)
tier       = highest tier where qty >= tier.min      (0 / 5 / 10 / 15 %)
unitPrice  = round2(unitGross * (1 - tier.off))
lineTotal  = unitPrice * qty
orderTotal = lineTotal + SAMPLE_FEE (70, one-off)
```

`/api/quote` **re-derives the whole price server-side** and never trusts the
client total (README → "Pricing Algorithm"). In sampling-only mode the grand
total is the sample fee alone and the size-run / tier rows are suppressed.

### Bilingual + currency

English default. Switching language or currency is instant and non-destructive —
the store keeps the configuration. Currency reprices every figure live off the
demo rates in `data.ts`. **Build note:** those rates are hard-coded; production
needs a daily rates job and the rate frozen onto each saved quote (the sheet
says "valid 30 days").

### Persistence

The Zustand store persists to `localStorage` (`denim-assembly:v1`) so a buyer who
configures on a phone and returns later doesn't start over. It is rehydrated
after mount (`skipHydration`) so SSR markup matches. **Not yet done:** reopening a
quote from its `REF` server-side, and a real quote-ref sequence (currently a
timestamp fragment).

## Assets

`public/assets/` holds the seven client photos from the handoff (hero + 6
styles). The other seven styles render a placeholder tile with the style code —
client to supply photography. Production still needs responsive `srcset`,
AVIF/WebP, and a CDN; `<img>` is used directly for now (see `next.config.mjs`).
Favicon is the DA monogram (`src/app/icon.svg`).

## Submission — remaining build work

`/api/quote` stores each submission as JSON under `data/quotes/` (dev only — swap
for a DB on a serverless host) and emails the factory when `RESEND_API_KEY` is
set. The UI only shows "sent" on a confirmed delivery; otherwise it opens a
`mailto:` draft and says so. Still to do (README → "Submission"): attach a
rendered PDF of the sheet rather than plain text, stronger spam protection, and a
buyer autoresponder.

## Known deltas from the design

- Filter row keyword→style mapping in `src/lib/filters.ts` is a first pass —
  confirm the intended buckets with the client.
- "Save configuration" / "Share link" in the customiser preview are present but
  inert, as in the prototype.
- Footer legal links (`Privacy`, `Terms of sale`, `Responsible sourcing`) and the
  factory address / WhatsApp are still placeholder `#contact` stubs pending copy.
- Size-run imbalance warns but does not block submission (prototype behaviour);
  the open question of whether to hard-block is unresolved.
