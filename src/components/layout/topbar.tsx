\"use client\";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function TopBar({ userName }: { userName?: string | null }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
      <div>
        <p className="text-sm text-slate-500">Merhaba</p>
        <p className="text-base font-semibold text-slate-900">{userName || "Kullanıcı"}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            await signOut({ callbackUrl: "/login" });
          }}
        >
          Çıkış
        </Button>
      </div>
    </header>
  );
}
