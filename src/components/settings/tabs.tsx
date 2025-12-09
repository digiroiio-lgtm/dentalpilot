"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/settings/clinic", label: "Klinik" },
  { href: "/settings/hotels", label: "Oteller" },
  { href: "/settings/transfers", label: "Transfer" },
  { href: "/settings/email-templates", label: "E-posta şablonları" }
];

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${pathname?.startsWith(tab.href) ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
