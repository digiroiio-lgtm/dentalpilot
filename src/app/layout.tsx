import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dental Klinik CRM",
  description: "Dental turizm klinikleri için mikro CRM"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
