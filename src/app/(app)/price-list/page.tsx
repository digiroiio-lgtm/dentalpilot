import { prisma } from "@/lib/prisma";
import { createPriceItemAction, togglePriceItemAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Currency } from "@prisma/client";

export default async function PriceListPage() {
  const priceItems = await prisma.priceItem.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Fiyat listesi</p>
          <h1 className="text-3xl font-semibold text-slate-900">Tedavi kalemleri</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Excel içe aktar</Button>
          <Button variant="secondary">Excel dışa aktar</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">İşlem adı</th>
                <th className="px-4 py-3">Kod</th>
                <th className="px-4 py-3">Para birimi</th>
                <th className="px-4 py-3">Birim fiyat</th>
                <th className="px-4 py-3">Not</th>
                <th className="px-4 py-3">Aktif</th>
              </tr>
            </thead>
            <tbody>
              {priceItems.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.category}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.code || "-"}</td>
                  <td className="px-4 py-3">{item.currency}</td>
                  <td className="px-4 py-3">{item.unitPrice}</td>
                  <td className="px-4 py-3">{item.note || "-"}</td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await togglePriceItemAction(item.id, !item.active);
                      }}
                    >
                      <button type="submit" className="text-sm text-emerald-600">
                        {item.active ? "Aktif" : "Pasif"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {priceItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                    Fiyat bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Yeni işlem ekle</h2>
        <form action={createPriceItemAction} className="grid gap-4 md:grid-cols-2">
          <input name="category" placeholder="Kategori" className="rounded-md border border-slate-200 px-3 py-2" required />
          <input name="name" placeholder="İşlem adı" className="rounded-md border border-slate-200 px-3 py-2" required />
          <input name="code" placeholder="Kod" className="rounded-md border border-slate-200 px-3 py-2" />
          <select name="currency" className="rounded-md border border-slate-200 px-3 py-2">
            {Object.values(Currency).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input name="unitPrice" type="number" min="0" placeholder="Birim fiyat" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="note" placeholder="Not" className="rounded-md border border-slate-200 px-3 py-2" />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
