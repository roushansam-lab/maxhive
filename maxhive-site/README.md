# Maxhive website
Next.js 14 + Tailwind + GSAP hero. Copy lives in `lib/content.ts`.
1. `npm install && npm run dev`
2. Supabase: create a project, run `supabase/schema.sql`, copy `.env.example` to `.env.local` (Vercel: Project Settings > Environment Variables).
3. WhatsApp Cloud API (optional): add token, phone-number ID and an approved template with 7 body variables (ref, name, business, contact, service, time, notes). Without it, the success screen shows a click-to-chat link (user must press Send).
4. Deploy on Vercel; never commit `.env.local`.

## WhatsApp-first enquiries

The consultation form now validates the visitor's details and opens WhatsApp with a pre-filled enquiry addressed to the configured number in `lib/content.ts`. The visitor must press **Send** inside WhatsApp; websites cannot send a WhatsApp message silently on a visitor's behalf. The appointment date/time picker and server booking dependency are no longer used by the form.

The floating WhatsApp shortcut is included on desktop, tablet and mobile. The hero headline has extra top spacing to clear the fixed navigation. The header/footer logo uses `public/maxhive-logo.svg` so it remains crisp on high-density displays.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. Before deploying, test the layout at desktop, tablet and mobile widths and submit a test enquiry to confirm WhatsApp opens with the expected details.
