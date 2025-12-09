import { createHotel, createPriceItem, createTemplate, createTransfer } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { currencyFormatter } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const [hotels, transfers, templates, priceItems] = await Promise.all([
    prisma.hotel.findMany({ orderBy: { name: "asc" } }),
    prisma.transferOption.findMany({ orderBy: { name: "asc" } }),
    prisma.emailTemplate.findMany({ orderBy: { type: "asc" } }),
    prisma.priceItem.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase text-slate-500">Ayarlar</p>
        <h1 className="text-3xl font-semibold text-slate-900">DentalPilot katalogları</h1>
        <p className="text-sm text-slate-500">Hotel, transfer ve e-posta şablonu gibi yardımcı verileri yönetin.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Oteller</h2>
            <p className="text-sm text-slate-500">Deal sırasında kullanılacak otel listesini güncelleyin.</p>
          </div>
          <ul className="space-y-2 text-sm">
            {hotels.map((hotel) => (
              <li key={hotel.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">{hotel.name}</p>
                <p className="text-xs text-slate-500">{hotel.city || "Şehir belirtilmedi"}</p>
                {hotel.note && <p className="text-xs text-slate-500">{hotel.note}</p>}
              </li>
            ))}
            {hotels.length === 0 && <p className="text-sm text-slate-500">Henüz otel eklenmedi.</p>}
          </ul>
          <form action={createHotel} className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div>
              <label className="text-xs text-slate-500">Otel adı</label>
              <input name="name" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Şehir</label>
              <input name="city" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Not</label>
              <textarea name="note" rows={2} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <SubmitButton label="Otel ekle" pendingLabel="Kaydediliyor" />
          </form>
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Transfer seçenekleri</h2>
            <p className="text-sm text-slate-500">Havaalanı-hotel transferi sağlayıcılarını kaydedin.</p>
          </div>
          <ul className="space-y-2 text-sm">
            {transfers.map((transfer) => (
              <li key={transfer.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">{transfer.name}</p>
                <p className="text-xs text-slate-500">{transfer.provider || "Operatör belirtilmedi"}</p>
                {transfer.note && <p className="text-xs text-slate-500">{transfer.note}</p>}
              </li>
            ))}
            {transfers.length === 0 && <p className="text-sm text-slate-500">Henüz transfer eklenmedi.</p>}
          </ul>
          <form action={createTransfer} className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div>
              <label className="text-xs text-slate-500">Transfer adı</label>
              <input name="name" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Operatör</label>
              <input name="provider" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Not</label>
              <textarea name="note" rows={2} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <SubmitButton label="Transfer ekle" pendingLabel="Kaydediliyor" />
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Fiyat listesi</h2>
            <p className="text-sm text-slate-500">Tedavi planlarında kolayca kullanmak için işlemleri kaydedin.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">İşlem</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2">Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {priceItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-3 py-2 font-medium text-slate-900">{item.name}</td>
                    <td className="px-3 py-2 text-slate-500">{item.category || "-"}</td>
                    <td className="px-3 py-2">{currencyFormatter(Number(item.price), item.currency)}</td>
                  </tr>
                ))}
                {priceItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-slate-500">
                      Kayıt bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <form action={createPriceItem} className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div>
              <label className="text-xs text-slate-500">İşlem adı</label>
              <input name="name" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Kategori</label>
              <input name="category" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">Fiyat</label>
                <input name="price" type="number" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
              </div>
              <div>
                <label className="text-xs text-slate-500">Para birimi</label>
                <input name="currency" defaultValue="EUR" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1 uppercase" />
              </div>
            </div>
            <SubmitButton label="İşlem ekle" pendingLabel="Kaydediliyor" />
          </form>
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">E-posta şablonları</h2>
            <p className="text-sm text-slate-500">Hotel, transfer ya da teklif maillerini standartlaştırın.</p>
          </div>
          <ul className="space-y-2 text-sm">
            {templates.map((template) => (
              <li key={template.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs uppercase text-slate-500">{template.type}</p>
                <p className="font-semibold text-slate-900">{template.title}</p>
                <p className="text-xs text-slate-500">Konu: {template.subject}</p>
              </li>
            ))}
            {templates.length === 0 && <p className="text-sm text-slate-500">Şablon eklenmedi.</p>}
          </ul>
          <form action={createTemplate} className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
            <div>
              <label className="text-xs text-slate-500">Tip</label>
              <select name="type" className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1">
                <option value="GENERIC">Genel</option>
                <option value="HOTEL">Hotel</option>
                <option value="TRANSFER">Transfer</option>
                <option value="DEAL">Deal</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Başlık</label>
              <input name="title" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Konu</label>
              <input name="subject" required className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <div>
              <label className="text-xs text-slate-500">İçerik</label>
              <textarea name="body" rows={4} className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1" />
            </div>
            <SubmitButton label="Şablon kaydet" pendingLabel="Kaydediliyor" />
          </form>
        </div>
      </section>
    </div>
  );
}
