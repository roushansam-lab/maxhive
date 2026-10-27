import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const { SUPABASE_URL: U, SUPABASE_SERVICE_ROLE_KEY: K, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME, OWNER_WHATSAPP = "917905381377" } = process.env;
const db = (path: string, init?: RequestInit) =>
  fetch(`${U}/rest/v1/${path}`, { ...init, headers: { apikey: K!, Authorization: `Bearer ${K}`, "Content-Type": "application/json", Prefer: "return=minimal", ...init?.headers } });
const hits = new Map<string, number[]>(); // per-instance only; use Upstash/Vercel KV for strict limits
const nowIST = () => new Date(Date.now() + 330 * 6e4).toISOString();

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !U || !K) return NextResponse.json({ taken: [] });
  const r = await db(`bookings?select=slot&date=eq.${date}`);
  const rows: { slot: string }[] = r.ok ? await r.json() : [];
  return NextResponse.json({ taken: rows.map((x) => x.slot) });
}

export async function POST(req: Request) {
  if (!U || !K) return NextResponse.json({ error: "Booking is not configured yet. Please WhatsApp or call us." }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  const t = (hits.get(ip) ?? []).filter((n) => Date.now() - n < 6e5);
  if (t.length >= 5) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  hits.set(ip, [...t, Date.now()]);

  const b = await req.json().catch(() => null);
  const s = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
  const d = { name: s(b?.name, 100), business: s(b?.business, 100), email: s(b?.email, 120), phone: s(b?.phone, 20).replace(/\s/g, ""), service: s(b?.service, 80), notes: s(b?.notes, 1000), date: s(b?.date, 10), slot: s(b?.slot, 5) };
  const n = nowIST();
  const ok = d.name.length >= 2 && /^\S+@\S+\.\S+$/.test(d.email) && /^\+\d{8,15}$/.test(d.phone) && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && SLOTS.includes(d.slot)
    && new Date(d.date + "T12:00:00+05:30").getDay() !== 0 && `${d.date}T${d.slot}` > n.slice(0, 16) && d.date <= new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  if (!ok) return NextResponse.json({ error: "Please check your details and choose a valid future slot." }, { status: 400 });

  const ref = "MH-" + randomBytes(3).toString("hex").toUpperCase();
  const ins = await db("bookings", { method: "POST", body: JSON.stringify({ ref, ...d }) });
  if (ins.status === 409) return NextResponse.json({ error: "That slot was just taken. Pick another." }, { status: 409 });
  if (!ins.ok) return NextResponse.json({ error: "Could not save your booking. Nothing was booked." }, { status: 500 });

  // The booking is saved. WhatsApp is best-effort; "sent" means the API accepted it, not that it was read.
  let whatsapp = "not_configured";
  if (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID && WHATSAPP_TEMPLATE_NAME) {
    const p = [ref, d.name, d.business || "-", `${d.phone} / ${d.email}`, d.service, `${d.date} ${d.slot} IST`, d.notes || "-"];
    try {
      const w = await fetch(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST", headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: OWNER_WHATSAPP, type: "template", template: { name: WHATSAPP_TEMPLATE_NAME, language: { code: "en" }, components: [{ type: "body", parameters: p.map((text) => ({ type: "text", text })) }] } }),
      });
      whatsapp = w.ok ? "sent" : "failed";
    } catch { whatsapp = "failed"; }
  }
  return NextResponse.json({ ref, whatsapp });
}
