import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// One button for the whole site: white/black at rest, orange on hover.
const cls =
  "inline-flex min-h-11 items-center justify-center border border-[#171717] bg-white px-6 text-sm font-bold uppercase tracking-wide text-[#171717] transition-colors duration-200 ease-out hover:border-[#FBB040] hover:bg-[#FBB040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#171717] disabled:hover:bg-white";

export function Btn({ href, children, ...p }: { href?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (href) {
    const ext = /^(https?:|tel:|mailto:)/.test(href);
    return ext ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
  }
  return <button className={cls} {...p}>{children}</button>;
}
