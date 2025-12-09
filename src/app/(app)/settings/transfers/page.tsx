import { prisma } from "@/lib/prisma";
import { createTransferCompanyAction, toggleTransferCompanyAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default async function TransferSettingsPage() {
  const transfers = await prisma.transferCompany.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Firma adı</th>
                <th className="px-4 py-3">E-posta</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Not</th>
                <th className="px-4 py-3">Aktif</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{transfer.name}</td>
                  <td className="px-4 py-3">{transfer.email}</td>
                  <td className="px-4 py-3">{transfer.phone || "-"}</td>
                  <td className="px-4 py-3">{transfer.note || "-"}</td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        "use server";
                        await toggleTransferCompanyAction(transfer.id, !transfer.active);
                      }}
                    >
                      <button type="submit" className="text-sm text-emerald-600">
                        {transfer.active ? "Aktif" : "Pasif"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    Transfer firması yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Yeni transfer firması</h2>
        <form action={createTransferCompanyAction} className="grid gap-4 md:grid-cols-2">
          <input name="name" placeholder="Firma adı" className="rounded-md border border-slate-200 px-3 py-2" required />
          <input name="email" placeholder="E-posta" className="rounded-md border border-slate-200 px-3 py-2" required />
          <input name="phone" placeholder="Telefon" className="rounded-md border border-slate-200 px-3 py-2" />
          <input name="note" placeholder="Not" className="rounded-md border border-slate-200 px-3 py-2" />
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Kaydet</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
