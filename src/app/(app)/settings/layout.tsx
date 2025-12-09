import { ReactNode } from "react";
import { SettingsTabs } from "@/components/settings/tabs";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase text-slate-500">Ayarlar</p>
        <h1 className="text-3xl font-semibold text-slate-900">Klinik ayarları</h1>
      </div>
      <SettingsTabs />
      {children}
    </div>
  );
}
