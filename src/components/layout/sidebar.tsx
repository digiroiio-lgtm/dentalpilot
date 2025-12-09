"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leads", label: "Lead'ler" },
  { href: "/price-list", label: "Fiyat Listesi" },
  { href: "/deals", label: "Deal'ler" },
  { href: "/settings", label: "Ayarlar" }
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 flex-none border-r border-slate-200 bg-white/80 backdrop-blur lg:block">
      <div className="px-5 py-6">
        <p className="text-lg font-semibold text-emerald-600">Klinik CRM</p>
      </div>
      <nav className="space-y-1 px-3 pb-6">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center rounded-xl px-4 py-2 text-sm font-medium transition",
                active ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
