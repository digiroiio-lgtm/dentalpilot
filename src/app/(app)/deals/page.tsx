import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(value);
}

export default async function DealsPage() {
  const deals = await prisma.deal.findMany({
    include: {
      lead: true,
      treatmentPlan: true,
      hotel: true,
      transferCompany: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">Deal yönetimi</p>
          <h1 className="text-3xl font-semibold text-slate-900">Deal'ler</h1>
        </div>
        <Link href="/leads" className="text-sm text-emerald-600">
          Lead seç
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Hasta</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Toplam fiyat</th>
                <th className="px-4 py-3">Tarih aralığı</th>
                <th className="px-4 py-3">Otel</th>
                <th className="px-4 py-3">Transfer</th>
                <th className="px-4 py-3">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {deal.lead.firstName} {deal.lead.lastName}
                  </td>
                  <td className="px-4 py-3">{deal.treatmentPlan?.name || "-"}</td>
                  <td className="px-4 py-3">{deal.totalPrice ? `${deal.totalPrice} ${deal.currency}` : "-"}</td>
                  <td className="px-4 py-3">
                    {formatDate(deal.arrivalDate)} - {formatDate(deal.departureDate)}
                  </td>
                  <td className="px-4 py-3">{deal.hotel?.name || "-"}</td>
                  <td className="px-4 py-3">{deal.transferCompany?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/leads/${deal.leadId}`} className="text-emerald-600 hover:underline">
                      Lead'e git
                    </Link>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                    Deal bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-emerald-300 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">Deal confirmed süreci için seçili lead sayfasından başlatın.</p>
        <Link
          href="/leads"
          className="mt-3 inline-flex items-center rounded-md border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-600 hover:border-emerald-400"
        >
          Lead seç
        </Link>
      </div>
    </div>
  );
}
