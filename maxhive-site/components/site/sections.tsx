"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Btn } from "@/components/ui/btn";
import { EMAIL, PHONE, TEL, WA, pillars, process, services, why, work } from "@/lib/content";

const wrap = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";
const orange = "text-[#FBB040]";
const H = "font-black uppercase leading-[.94] tracking-[-.055em] text-[clamp(2.65rem,6.6vw,6.4rem)]";

function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg aria-hidden="true" className={className} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={diagonal ? "M7 17 17 7M7 7h10v10" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}


function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export const Nav = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  const links = [["Services", "#services"], ["Work", "#work"], ["Our process", "#process"], ["Why Maxhive", "#why"]];
  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50">
      <nav aria-label="Main navigation" className={`${wrap} flex min-h-[76px] items-center justify-between gap-5`}>
        <a href="#top" onClick={() => setOpen(false)} className="brand-mark group inline-flex items-center gap-2.5" aria-label="Maxhive home">
          <img src="/maxhive-logo.png" alt="Maxhive" width="166" height="48" className="h-[42px] w-[166px] object-contain object-left sm:h-[46px] sm:w-[178px]" />
        </a>
        <ul className="hidden items-center gap-8 lg:flex">{links.map(([label, href]) => <li key={href}><a className="nav-link" href={href}>{label}</a></li>)}</ul>
        <div className="hidden lg:block"><a className="nav-cta" href="#book">Let’s talk <Arrow diagonal /></a></div>
        <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)} className="nav-toggle inline-flex h-11 w-11 items-center justify-center lg:hidden"><span className={open ? "is-open" : ""} /><span className={open ? "is-open" : ""} /></button>
      </nav>
      {open && <div className="mobile-menu lg:hidden"><div className={`${wrap} flex flex-col gap-1 pb-6 pt-2`}>{links.map(([label, href], i) => <a key={href} href={href} onClick={() => setOpen(false)} className="mobile-nav-link"><span className="text-xs text-[#FBB040]">0{i + 1}</span>{label}<Arrow diagonal className="ml-auto" /></a>)}<a className="mobile-book" href="#book" onClick={() => setOpen(false)}>Book a consultation <Arrow diagonal /></a></div></div>}
    </header>
  );
};

export const Problem = () => (
  <section className="problem-section relative overflow-hidden py-24 sm:py-32 lg:py-40">
    <div className={`${wrap} relative z-10`}>
      <Reveal><p className="eyebrow"><span className="eyebrow-dot" /> THE DIGITAL WORLD IS LOUD</p></Reveal>
      <Reveal delay={80}><h2 className={`${H} mt-8 max-w-[1100px]`}>Good businesses.<br /><span className="problem-outline">Overlooked</span> <span className={orange}>online.</span></h2></Reveal>
      <div className="mt-10 grid gap-8 border-t border-black/15 pt-6 sm:mt-14 sm:grid-cols-[1fr_1fr] sm:items-end">
        <Reveal delay={130}><p className="max-w-[480px] text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-snug tracking-[-.035em]">Being good at what you do is one thing. Making the right people <span className="text-[#FBB040]">notice</span> is another.</p></Reveal>
        <Reveal delay={180} className="sm:justify-self-end"><p className="max-w-[360px] text-sm leading-6 text-black/60 sm:text-base">Your website, content and campaigns should tell one clear story — why your business is worth choosing.</p><a href="#approach" className="text-link mt-5">Here’s how we approach it <Arrow /></a></Reveal>
      </div>
    </div>
    <div aria-hidden="true" className="problem-orbit">M</div>
  </section>
);

export const Approach = () => (
  <section id="approach" className="approach-section scroll-mt-20 py-24 sm:py-32">
    <div className={wrap}>
      <Reveal><div className="section-topline section-topline-dark"><span>01 — THE MAXHIVE METHOD</span><span>STRATEGY / CREATIVE / GROWTH</span></div></Reveal>
      <div className="grid gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-20">
        <Reveal><h2 className={`${H} max-w-[650px] text-white`}>We don’t just get you seen.<br /><span className={orange}>We get you chosen.</span></h2><p className="mt-8 max-w-[420px] leading-7 text-white/60">A connected digital presence, built around your business — not a collection of disconnected tactics.</p><a href="#services" className="text-link text-link-light mt-8">Explore what we do <Arrow /></a></Reveal>
        <div className="pillar-list">{pillars.map(([title, desc], i) => <Reveal key={title} delay={i * 70}><article className="pillar-card group"><span className="pillar-number">0{i + 1}</span><div className="pillar-copy"><h3>{title}</h3><p>{desc}</p></div><span className="pillar-arrow"><Arrow diagonal /></span></article></Reveal>)}</div>
      </div>
    </div>
  </section>
);

const artClasses = ["work-art-web", "work-art-social", "work-art-performance", "work-art-ai"];
export const Work = () => (
  <section id="work" className="work-section scroll-mt-20 py-24 sm:py-32 lg:py-40">
    <div className={wrap}>
      <Reveal><div className="section-topline"><span>02 — SELECTED DIRECTIONS</span><span>THE WORK SPEAKS</span></div></Reveal>
      <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between"><Reveal><h2 className={H}>Ideas made<br /><span className={orange}>visible.</span></h2></Reveal><Reveal delay={90}><p className="max-w-[350px] pb-1 text-sm leading-6 text-black/60 sm:text-base">A glimpse of the kind of digital experiences we create. These are concept placeholders, not client case studies.</p></Reveal></div>
      <div className="work-grid mt-12 sm:mt-16">{work.map(([title, tag], i) => <Reveal key={title} delay={i * 60} className={i === 0 ? "work-featured" : ""}><article className="work-card group"><div className={`work-art ${artClasses[i % artClasses.length]}`}>
        <span className="work-art-index">0{i + 1} / CONCEPT</span>
        {i === 0 && <div className="mock-browser"><div className="mock-browser-top"><i /><i /><i /><span>yourbrand.co</span></div><div className="mock-browser-body"><small>MAKE YOUR MARK</small><strong>Built to<br /><em>stand out.</em></strong><span className="mock-pill">Explore <Arrow diagonal /></span><div className="mock-sun" /></div></div>}
        {i === 1 && <div className="social-stack"><div className="social-card social-card-back">STAY<br />CURIOUS<span>✳</span></div><div className="social-card social-card-front"><small>YOUR NEXT CHAPTER</small><strong>MAKE<br /><em>NOISE.</em></strong><span>CREATIVE THAT CONNECTS ↗</span></div></div>}
        {i === 2 && <div className="growth-art"><span className="growth-label">ATTENTION → ACTION</span><div className="growth-bars"><i /><i /><i /><i /><i /><i /><i /></div><div className="growth-arrow"><Arrow diagonal /></div></div>}
        {i === 3 && <div className="ai-art"><div className="ai-orb" /><span>IMAGINATION<br />WITHOUT THE<br /><b>BIG PRODUCTION.</b></span><small>AI-ASSISTED CREATIVE</small></div>}
        <span className="work-art-arrow"><Arrow diagonal /></span>
      </div><div className="work-card-meta"><div><span>{tag}</span><h3>{title}</h3></div><span className="work-card-open"><Arrow diagonal /></span></div></article></Reveal>)}</div>
    </div>
  </section>
);

export const Services = () => (
  <section id="services" className="services-section scroll-mt-20 py-24 sm:py-32">
    <div className={wrap}>
      <Reveal><div className="section-topline"><span>03 — WHAT WE DO</span><span>BUILT AROUND YOUR GOALS</span></div></Reveal>
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><Reveal><h2 className={H}>Your next<br />unfair <span className={orange}>advantage.</span></h2><p className="mt-8 max-w-[360px] text-base leading-7 text-black/60">From first impression to first enquiry, we bring the pieces of your digital presence together.</p><div className="service-note mt-10"><span className="service-note-mark">+</span><p>One team. A connected plan. Work that serves a purpose.</p></div></Reveal>
        <div className="service-list">{services.map(([title, desc], i) => <Reveal key={title} delay={i * 35}><a href="#book" className="service-row group"><span className="service-index">0{i + 1}</span><div className="min-w-0"><h3>{title}</h3><p>{desc}</p></div><span className="service-arrow"><Arrow diagonal /></span></a></Reveal>)}</div>
      </div>
    </div>
  </section>
);

export const Process = () => (
  <section id="process" className="process-section scroll-mt-20 py-24 sm:py-32 lg:py-36">
    <div className={wrap}>
      <Reveal><div className="section-topline section-topline-dark"><span>04 — HOW WE WORK</span><span>NO GUESSWORK. JUST A CLEAR PROCESS.</span></div></Reveal>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><Reveal><h2 className={`${H} text-white`}>From first thought<br />to <span className={orange}>real momentum.</span></h2></Reveal><Reveal delay={100}><p className="max-w-[340px] leading-7 text-white/60">Good work comes from asking the right questions, making thoughtful choices and improving as we learn.</p></Reveal></div>
      <div className="process-grid mt-14 sm:mt-20">{process.map(([title, desc], i) => <Reveal key={title} delay={i * 80}><article className="process-step"><span className="process-step-top"><span>0{i + 1}</span><span className="process-step-line" /></span><h3>{title}</h3><p>{desc}</p></article></Reveal>)}</div>
    </div>
  </section>
);

export const Why = () => (
  <section id="why" className="why-section scroll-mt-20 py-24 sm:py-32 lg:py-40">
    <div className={wrap}>
      <Reveal><div className="section-topline"><span>05 — WHY MAXHIVE</span><span>THOUGHTFUL BY DESIGN</span></div></Reveal>
      <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:gap-24"><Reveal><h2 className={H}>Different by<br /><span className={orange}>design.</span></h2><p className="mt-8 max-w-[410px] text-lg leading-7 text-black/60">We focus on the details that make your business easier to understand, remember and choose.</p></Reveal><div className="why-list">{why.map((item, i) => <Reveal key={item} delay={i * 60}><div className="why-item"><span>0{i + 1}</span><p>{item}</p><span className="why-check">↗</span></div></Reveal>)}</div></div>
    </div>
  </section>
);

export const FinalCta = () => (
  <section className="final-cta py-24 sm:py-32 lg:py-40">
    <div className={wrap}><Reveal><div className="final-cta-inner"><div className="final-cta-kicker"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER STARTS HERE</div><h2 className="mt-8 font-black uppercase leading-[.88] tracking-[-.065em] text-[clamp(3rem,9vw,8.8rem)]">Ready to step<br />out of the <span>crowd?</span></h2><div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-[340px] leading-6 text-white/65">Tell us what you’re building. We’ll talk through what could move it forward.</p><div className="flex flex-wrap gap-3"><a className="cta-primary" href="#book">Let’s talk <Arrow diagonal /></a><a className="cta-secondary" href={WA}>WhatsApp <Arrow diagonal /></a></div></div><div aria-hidden="true" className="cta-orbit">M</div></div></Reveal></div>
  </section>
);


export const WhatsAppFloat = () => (
  <a className="whatsapp-float" href={WA} target="_blank" rel="noreferrer" aria-label="Chat with Maxhive on WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true" width="25" height="25" fill="currentColor"><path d="M16.04 3C8.9 3 3.1 8.78 3.1 15.9c0 2.27.6 4.49 1.74 6.45L3 29l6.82-1.79a12.96 12.96 0 0 0 6.2 1.58h.01C23.16 28.79 29 23 29 15.9 29 8.78 23.18 3 16.04 3Zm0 23.6c-1.92 0-3.8-.52-5.43-1.5l-.39-.23-4.05 1.06 1.08-3.95-.26-.41a10.68 10.68 0 0 1-1.65-5.67c0-5.9 4.8-10.69 10.71-10.69 2.86 0 5.55 1.11 7.57 3.13a10.63 10.63 0 0 1 3.14 7.56c0 5.9-4.81 10.7-10.72 10.7Zm5.88-8.01c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.39-.26-.62-.53-.54-.73-.55l-.62-.01c-.22 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.68s1.16 3.11 1.32 3.33c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.53-.08-.14-.29-.22-.61-.38Z"/></svg>
    <span>Chat with us</span>
  </a>
);

export const Footer = () => (
  <footer className="site-footer"><div className={`${wrap} py-10 sm:py-14`}><div className="grid gap-10 md:grid-cols-[1.2fr_.7fr_.8fr] md:gap-12"><div><a href="#top" className="brand-mark inline-flex items-center gap-2.5"><img src="/maxhive-logo.png" alt="Maxhive" width="166" height="48" className="h-[42px] w-[166px] object-contain object-left sm:h-[46px] sm:w-[178px]" /></a><p className="mt-5 max-w-[300px] text-sm leading-6 text-black/55">Helping ambitious businesses build a digital presence that stands out.</p></div><div><p className="footer-heading">EXPLORE</p><div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">{[["Services", "#services"], ["Selected work", "#work"], ["Our process", "#process"], ["Why Maxhive", "#why"], ["Book a call", "#book"]].map(([l, h]) => <a key={h} className="footer-link" href={h}>{l}</a>)}</div></div><div><p className="footer-heading">START A CONVERSATION</p><div className="mt-4 flex flex-col items-start gap-3 text-sm"><a className="footer-link" href={`mailto:${EMAIL}`}>{EMAIL}</a><a className="footer-link" href={TEL}>+91 {PHONE}</a><a className="footer-link" href={WA}>Message us on WhatsApp <Arrow diagonal /></a></div></div></div><div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-5 text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Maxhive Services Private Limited.</span><span>Made to help you stand out. · Hero animation: Skiper UI (Skiper 39).</span></div></div></footer>
);
