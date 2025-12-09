import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DentalPilot CRM",
  description: "DentalPilot kliniği için özel CRM"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-semibold text-emerald-600">
              DentalPilot CRM
            </Link>
            <nav className="space-x-4 text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-slate-900">
                Pipeline
              </Link>
              <Link href="/ayarlar" className="text-slate-600 hover:text-slate-900">
                Ayarlar
              </Link>
            </nav>
          </div>
        </div>
        <main className="mx-auto min-h-[calc(100vh-65px)] max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
