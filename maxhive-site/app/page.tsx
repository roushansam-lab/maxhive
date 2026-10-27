import Skiper39Demo from "@/components/demo";
import Booking from "@/components/site/booking";
import { WA } from "@/lib/content";
import { Nav, Problem, Approach, Work, Services, Process, Why, FinalCta, Footer, WhatsAppFloat } from "@/components/site/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Skiper39Demo />
        <Problem />
        <Approach />
        <Work />
        <Services />
        <Process />
        <Why />
        <section id="book" className="booking-section scroll-mt-20 py-24 sm:py-32 lg:py-36">
          <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20 lg:px-12">
            <div className="booking-intro">
              <p className="eyebrow"><span className="eyebrow-dot" /> 06 — LET’S START SOMETHING</p>
              <h2 className="mt-8 font-black uppercase leading-[.92] tracking-[-.055em] text-[clamp(2.8rem,5.5vw,5.7rem)]">Let’s talk about your next <span className="text-[#FBB040]">move.</span></h2>
              <p className="mt-7 max-w-[380px] text-base leading-7 text-black/60">Share a little about your business and what you want to achieve. Share your details and we’ll continue the conversation directly on WhatsApp.</p>
              <div className="booking-contact mt-9"><span className="booking-contact-dot" /><div><p>Prefer a direct conversation?</p><a href={WA}>Message Maxhive on WhatsApp <span>↗</span></a></div></div>
              <p className="mt-10 text-xs font-semibold uppercase tracking-[.12em] text-black/35">Consultations · India Standard Time (IST)</p>
            </div>
            <div className="booking-panel"><div className="booking-panel-head"><div><span>YOUR FIRST STEP</span><h3>Book a consultation</h3></div><span className="booking-panel-mark">↗</span></div><Booking /></div>
          </div>
        </section>
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
