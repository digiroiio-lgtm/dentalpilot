import { prisma } from "@/lib/prisma";
import { stageList, stageMeta } from "@/lib/stages";
import { createLeadAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NewLeadPage() {
  const owners = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Lead oluştur</p>
          <h1 className="text-3xl font-semibold text-slate-900">Yeni lead</h1>
        </div>
        <Link href="/leads" className="text-sm text-slate-500 hover:text-emerald-600">
          Geri dön
        </Link>
      </div>
      <form action={createLeadAction} className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Hasta Bilgileri</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Adı</label>
              <input name="firstName" required className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Soyadı</label>
              <input name="lastName" required className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Cinsiyet</label>
              <select name="gender" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2">
                <option value="">Belirtilmedi</option>
                <option value="Kadın">Kadın</option>
                <option value="Erkek">Erkek</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Doğum tarihi</label>
              <input type="date" name="birthDate" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Ülke</label>
              <input name="country" required className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" placeholder="UK" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Telefon</label>
              <input name="phone" required className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">E-posta</label>
              <input type="email" name="email" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">İletişim tercihi</label>
              <select name="communicationPref" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2">
                <option value="">Belirtilmedi</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="E-posta">E-posta</option>
                <option value="Telefon">Telefon</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="whatsappEnabled" className="h-4 w-4 rounded border-slate-300" />
              Bu numara WhatsApp kullanıyor
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="marketingOptIn" className="h-4 w-4 rounded border-slate-300" />
              Pazarlama izni var
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Lead Detayı</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Lead tarihi</label>
              <input type="date" name="leadDate" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Lead kaynağı</label>
              <select name="source" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required>
                {["WhatsApp", "Instagram", "Google Ads", "Web sitesi", "Referral", "Diğer"].map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Referans adı</label>
              <input name="referenceName" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Referans notu</label>
              <input name="referenceNote" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Sorumlu kişi</label>
              <select name="ownerId" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2">
                <option value="">Belirtilmedi</option>
                {owners.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Aşama</label>
              <select name="stage" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2">
                {stageList.map((stage) => (
                  <option key={stage} value={stage}>
                    {stageMeta[stage].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Sonraki takip tarihi</label>
              <input type="date" name="nextFollowUpDate" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">İlk not</label>
              <textarea name="firstNote" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" rows={3} />
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <Link
            href="/leads"
            className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-emerald-500"
          >
            İptal
          </Link>
          <Button type="submit">Lead oluştur</Button>
        </div>
      </form>
    </div>
  );
}
