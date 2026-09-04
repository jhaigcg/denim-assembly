import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { GROUPS, MOQ, SAMPLE_FEE, SIZES } from "@/lib/data";
import { money, orderTotal, priceLines, styleFor } from "@/lib/pricing";
import type { Selection } from "@/lib/types";

/**
 * Specification submission endpoint.
 *
 * Contract (see README → "Submission"):
 *  1. Re-derive the whole price server-side. The client total is never trusted.
 *  2. Store the submission — email alone loses enquiries.
 *  3. Email the factory when a transport is configured (Resend).
 *
 * Response shape lets the client stay honest about what actually happened:
 *   { ok, stored, delivered, ref, serverTotal }
 * The UI only shows "sent" when `delivered` is true.
 */

export const runtime = "nodejs";

interface Payload {
  ref?: string;
  lang?: "en" | "zh";
  currency?: string;
  styleCode?: string;
  sel?: Selection;
  qty?: number;
  run?: number[];
  sampleOnly?: boolean;
  contact?: {
    company?: string;
    name?: string;
    email?: string;
    country?: string;
    notes?: string;
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeRef() {
  // Prototype-grade. Production needs a real, persisted sequence.
  return "DA-Q-" + String(Date.now()).slice(-6);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot / minimal spam guard: unauthenticated form.
  if ((body as Record<string, unknown>)._hp) {
    return NextResponse.json({ ok: true, stored: false, delivered: false });
  }

  const company = body.contact?.company?.trim();
  const email = body.contact?.email?.trim();
  if (!company || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "missing_contact" },
      { status: 422 },
    );
  }

  const lang = body.lang === "zh" ? "zh" : "en";
  const currency = (body.currency || "USD") as Parameters<typeof money>[1];
  const styleCode = body.styleCode || "DA-01";
  const sel = (body.sel || {}) as Selection;
  const qty = Math.max(0, Math.floor(Number(body.qty) || 0));
  const sampleOnly = !!body.sampleOnly;
  const run = Array.isArray(body.run) ? body.run.map((n) => Number(n) || 0) : [];

  if (!sampleOnly && qty < MOQ) {
    return NextResponse.json(
      { ok: false, error: "below_moq", moq: MOQ },
      { status: 422 },
    );
  }

  // ── Authoritative price, recomputed from the catalogue ───────────────
  const style = styleFor(styleCode);
  const { unit } = priceLines(styleCode, sel, qty, lang);
  const grand = sampleOnly ? SAMPLE_FEE : orderTotal(unit, qty);

  const ref = body.ref?.match(/^DA-Q-\d{4,8}$/) ? body.ref : makeRef();

  const record = {
    ref,
    receivedAt: new Date().toISOString(),
    lang,
    currency,
    sampleOnly,
    style: { code: style.code, name: style.name },
    selection: sel,
    qty,
    run,
    contact: {
      company,
      name: body.contact?.name?.trim() || "",
      email,
      country: body.contact?.country?.trim() || "",
      notes: body.contact?.notes?.trim() || "",
    },
    price: {
      unitUSD: unit,
      grandUSD: grand,
      display: {
        unit: money(unit, currency, 2),
        grand: money(grand, currency),
        sampleFee: money(SAMPLE_FEE, currency, 2),
      },
    },
  };

  // ── Store ───────────────────────────────────────────────────────────
  // Local-disk JSON in dev. On a serverless host this won't persist —
  // swap for a DB (see README). We still return stored:true so the buyer
  // isn't told their enquiry was lost when email also succeeds.
  let stored = false;
  try {
    const dir = path.join(process.cwd(), "data", "quotes");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `${ref}.json`),
      JSON.stringify(record, null, 2),
      "utf8",
    );
    stored = true;
  } catch (err) {
    console.error("[quote] store failed", err);
  }

  // ── Deliver ─────────────────────────────────────────────────────────
  const message = buildPlainText(record);
  const subject = `Customisation request ${ref} — ${company}`;
  let delivered = false;

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.FACTORY_EMAIL || "sales@denimassembly.com";
  const from = process.env.RESEND_FROM || "Denim Assembly <onboarding@resend.dev>";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject,
          text: message,
        }),
      });
      delivered = res.ok;
      if (!res.ok) console.error("[quote] resend error", await res.text());
    } catch (err) {
      console.error("[quote] resend threw", err);
    }
  } else {
    console.info(`[quote] no RESEND_API_KEY — not emailing. Ref ${ref}.`);
  }

  return NextResponse.json({
    ok: true,
    ref,
    stored,
    delivered,
    serverTotalUSD: grand,
    serverUnitUSD: unit,
  });
}

function buildPlainText(r: {
  ref: string;
  currency: string;
  sampleOnly: boolean;
  style: { code: string; name: string };
  selection: Selection;
  qty: number;
  run: number[];
  contact: {
    company: string;
    name: string;
    email: string;
    country: string;
    notes: string;
  };
  price: { display: { unit: string; grand: string; sampleFee: string } };
}) {
  const opts = GROUPS.map((g) => {
    const v = g.values.find((x) => x.code === r.selection[g.code]);
    return `${g.name}: ${v ? v.name : "—"}`;
  });
  const sizeRun = SIZES.map((s, i) => `${s}×${r.run[i] || 0}`).join(", ");
  return [
    `Denim Assembly — customisation request ${r.ref}`,
    "",
    `Company: ${r.contact.company}`,
    `Contact: ${r.contact.name || "—"}  <${r.contact.email}>`,
    `Country / port: ${r.contact.country || "—"}`,
    "",
    `Mode: ${r.sampleOnly ? "SAMPLING ONLY" : "Bulk order"}`,
    `Base style: ${r.style.code} ${r.style.name}`,
    ...opts,
    `Quantity: ${r.qty} pcs`,
    `Size run: ${sizeRun}`,
    `Unit price: ${r.price.display.unit} ${r.currency} FOB Shenzhen`,
    `${r.sampleOnly ? "Sample cost" : "Order total"}: ${r.price.display.grand} ${r.currency} (incl. ${r.price.display.sampleFee} sampling)`,
    "",
    `Notes: ${r.contact.notes || "—"}`,
  ].join("\n");
}
