# Denim Assembly — Customised Jeans Platform (Phase 1)

Customer-facing portal for a Guangdong denim manufacturer selling factory-direct
to overseas wholesale buyers. Built from the design handoff in
`../DenimAssembly/牛仔裤定制平台设计 (1).zip` (`design_handoff_denim_assembly/`) —
a v2 revision of the original 13-style handoff, expanding the catalogue to 21
styles across three product families.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand.

## Scope

Phase 1 = the **Customer portal** only, as three screens plus a shared header /
footer:

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Showroom | Trust strip, hero, wired filter row, 21-style grid. SSR for SEO. |
| `/customiser` | Customiser | 4-step wizard, family-aware option groups, front/back photo toggle, live per-piece + order-total pricing, size run, block adjustment, sampling mode. |
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
| Data model (styles, families, option groups, currencies, tiers, MOQ, sample fee) | `src/lib/data.ts` |
| Pricing maths (`priceLines`, `groupsFor`, `tierFor`, `money`, `orderTotal`) | `src/lib/pricing.ts` — shared by client and server |
| All UI copy, both languages; `STEPS` + family-aware `stepLabel/stepTitle/stepHint`, `TAG_CN`, `GROUP_CN`, `OPT_CN` | `src/lib/i18n.ts` |
| Showroom filter → style-code map | `src/lib/filters.ts` |
| Cross-screen state (lang, currency, config, previewView, qty, run, measurements, contact) | `src/store/useAppStore.ts` (Zustand + `localStorage`) |
| Screens | `src/components/{Showroom,Customiser,Summary}.tsx` |
| Header / Footer / Logo | `src/components/` |
| Submission endpoint | `src/app/api/quote/route.ts` |

### Product families

Three families exist; a style's `fam` field (absent = `denim`) decides which
option groups apply, so a linen trouser can never be quoted with denim wash
codes. `inFam()`, `FAM_PAIR` (the two groups shown in the preview caption) and
`FAM_DEFAULTS` (seeded on style selection) live in `data.ts`.

| Family | Styles | Fabric group | Finish group |
| --- | --- | --- | --- |
| `denim` (default) | 19 styles | Denim quality | Wash process |
| `woven` | DA-16 Arles | Fabric quality (linen/Tencel/cotton) | Finish |
| `yarndye` | DA-23 Carrie | Yarn-dyed fabric (stripes) | Finish |

Step titles/hints in the customiser panel vary by family too — see
`stepLabel`/`stepTitle`/`stepHint` in `i18n.ts`.

### Pricing

```
unitGross  = style.base + Σ(option.d for groups in the style's family) + BLOCK_FEE (0.70)
tier       = highest tier where qty >= tier.min      (0 / 5 / 10 / 15 %, from MOQ 200)
unitPrice  = round2(unitGross * (1 - tier.off))
lineTotal  = unitPrice * qty
orderTotal = lineTotal + SAMPLE_FEE (35, one-off)
```

`/api/quote` **re-derives the whole price server-side** and never trusts the
client total. In sampling-only mode the grand total is the sample fee alone and
the size-run / tier rows are suppressed.

### Bilingual + currency

English default. Switching language or currency is instant and non-destructive —
the store keeps the configuration. Currency reprices every figure live off the
demo rates in `data.ts`. **Build note:** those rates are hard-coded; production
needs a daily rates job and the rate frozen onto each saved quote (the sheet
says "valid 30 days").

### Persistence

The Zustand store persists to `localStorage` (`denim-assembly:v2` — bumped from
`v1` because the catalogue/option shape changed) so a buyer who configures on a
phone and returns later doesn't start over. It is rehydrated after mount
(`skipHydration`) so SSR markup matches. **Not yet done:** reopening a quote from
its `REF` server-side, and a real quote-ref sequence (currently a timestamp
fragment).

## Assets

`public/assets/` holds all 21 styles' front photography, plus back photos for
every style except DA-03 (Y2K Flare) and DA-09 (High-Rise Mom) — the customiser
preview's bottom-right thumbnail toggles between the two when a back photo
exists. Production still needs responsive `srcset`, AVIF/WebP, and a CDN;
`<img>` is used directly for now (see `next.config.mjs`). Favicon is the DA
monogram (`src/app/icon.svg`).

**Known asset issue (per the handoff):** `pd19-ayla*` (DA-19 Ayla Baggy Jeans)
still shows a faint grey studio backdrop — white-on-white automated keying
couldn't fully separate the garment from the wall/floor. Needs a proper cutout
or reshoot.

## Submission — remaining build work

`/api/quote` stores each submission as JSON under `data/quotes/` (dev only — swap
for a DB on a serverless host) and emails the factory when `RESEND_API_KEY` is
set. The UI only shows "sent" on a confirmed delivery; otherwise it opens a
`mailto:` draft and says so. Still to do (README → "Submission"): attach a
rendered PDF of the sheet rather than plain text, stronger spam protection, and a
buyer autoresponder.

## Known deltas from the design

- Filter row keyword→style mapping in `src/lib/filters.ts` is a curated first
  pass against the new 21-style catalogue — confirm the intended buckets with
  the client, particularly "Raw denim" and "Women's" (no style description in
  this revision explicitly says "raw/unwashed" or is marked women's-specific).
- **DA-17 renamed** from the design reference's "H.D. Jean Pants (Needles)" to
  "H.D. Balloon Leg" — Needles is a trademarked Japanese label; the handoff's own
  "Open Questions" section recommends a neutral public name with Needles kept as
  an internal-only reference.
- "Save configuration" / "Share link" in the customiser preview are present but
  inert, as in the prototype.
- Footer legal links (`Privacy`, `Terms of sale`, `Responsible sourcing`) are
  still placeholder `#contact` stubs pending copy. The factory address is real
  (Jun'an Town, Shunde District, Foshan) but WhatsApp/WeChat contacts were
  removed from this revision pending confirmation.
- Size-run imbalance warns but does not block submission (prototype behaviour);
  the open question of whether to hard-block is unresolved.
- Several option prices are estimates, not confirmed factory numbers — notably
  the entire woven and yarn-dye option sets, and Snow/acid wash and
  Print+Embroidery pricing. See the design handoff's "Open Questions".
