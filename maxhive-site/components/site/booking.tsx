"use client";
import { useState } from "react";
import { WA, services } from "@/lib/content";

const inp = "booking-input mt-2 min-h-12 w-full border border-[#171717]/20 bg-white px-3";

export default function Booking() {
  const [f, setF] = useState({ name: "", business: "", email: "", phone: "+91", service: services[0][0], notes: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = "Please enter a valid email.";
    if (!/^\+?\d{8,15}$/.test(f.phone.replace(/[\s()-]/g, ""))) x.phone = "Please enter a valid phone number with country code.";
    setErr(x);
    if (Object.keys(x).length) return;
    const message = [
      "Hi Maxhive! I’d like to discuss a project.",
      `Name: ${f.name.trim()}`,
      f.business.trim() ? `Business: ${f.business.trim()}` : "",
      `Email: ${f.email.trim()}`,
      `Phone: ${f.phone.trim()}`,
      `Service: ${f.service}`,
      f.notes.trim() ? `Project details: ${f.notes.trim()}` : "",
    ].filter(Boolean).join("\n");
    window.open(`${WA}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }
  return <form onSubmit={submit} noValidate className="booking-form grid gap-5 md:grid-cols-2">
    {([ ["name", "Full name", true], ["business", "Business name (optional)", false], ["email", "Email address", true], ["phone", "Phone with country code", true] ] as const).map(([k, label, required]) => <label key={k} className="booking-field block">{label}
      <input className={inp} type={k === "email" ? "email" : "text"} autoComplete={k === "name" ? "name" : k === "email" ? "email" : k === "phone" ? "tel" : "organization"} required={required} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} />
      {err[k] && <span role="alert" className="mt-1 block text-sm text-red-700">{err[k]}</span>}
    </label>)}
    <label className="booking-field block md:col-span-2">Service you’re interested in
      <select className={inp} value={f.service} onChange={e => setF({ ...f, service: e.target.value })}>{services.map(([s]) => <option key={s}>{s}</option>)}</select>
    </label>
    <label className="booking-field block md:col-span-2">Tell us a little about your goals (optional)
      <textarea className={inp} rows={4} placeholder="What are you looking to improve or build?" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} />
    </label>
    <div className="booking-submit md:col-span-2"><button className="whatsapp-submit" type="submit">Send enquiry on WhatsApp <span aria-hidden="true">↗</span></button><p className="mt-3 text-xs leading-5 text-black/50">WhatsApp will open with your details pre-filled. Press Send in WhatsApp to deliver your enquiry to Maxhive.</p></div>
  </form>;
}
