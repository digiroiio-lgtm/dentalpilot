import { prisma } from "@/lib/prisma";
import { saveClinicSettingsAction } from "@/app/actions";
import { Currency } from "@prisma/client";
import { Button } from "@/components/ui/button";

export default async function ClinicSettingsPage() {
  const settings = await prisma.clinicSetting.findFirst();
  return (
    <form action={saveClinicSettingsAction} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-sm text-slate-600">Klinik adı</label>
        <input name="clinicName" defaultValue={settings?.clinicName} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-slate-600">Adres</label>
        <textarea name="address" defaultValue={settings?.address ?? undefined} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" rows={3} />
      </div>
      <div>
        <label className="text-sm text-slate-600">Ana e-posta</label>
        <input name="primaryEmail" defaultValue={settings?.primaryEmail} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required />
      </div>
      <div>
        <label className="text-sm text-slate-600">Varsayılan para birimi</label>
        <select
          name="defaultCurrency"
          defaultValue={settings?.defaultCurrency ?? "GBP"}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
        >
          {Object.values(Currency).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit">Kaydet</Button>
      </div>
    </form>
  );
}
