import Link from "next/link";
import { stageMeta } from "@/lib/stages";
import { LeadStage } from "@prisma/client";

interface LeadTableProps {
  leads: Array<{
    id: string;
    firstName: string;
    lastName: string;
    country: string;
    phone: string;
    leadDate: string;
    source: string;
    owner?: { id: string; name: string } | null;
    stage: LeadStage;
    nextFollowUpDate: string | null;
    totalPlanPrice: number | null;
    activities: { createdAt: string }[];
  }>;
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (!date) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(date);
}

export function LeadTable({ leads }: LeadTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[800px] text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Hasta adı</th>
            <th className="px-4 py-3 text-left">Ülke</th>
            <th className="px-4 py-3 text-left">Telefon</th>
            <th className="px-4 py-3 text-left">Lead tarihi</th>
            <th className="px-4 py-3 text-left">Kaynak</th>
            <th className="px-4 py-3 text-left">Sorumlu</th>
            <th className="px-4 py-3 text-left">Aşama</th>
            <th className="px-4 py-3 text-left">Sonraki takip</th>
            <th className="px-4 py-3 text-left">Toplam plan</th>
            <th className="px-4 py-3 text-left">Son aktivite</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="px-4 py-3 font-medium text-slate-900">
                {lead.firstName} {lead.lastName}
              </td>
              <td className="px-4 py-3 text-slate-600">{lead.country}</td>
              <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
              <td className="px-4 py-3">{formatDate(lead.leadDate)}</td>
              <td className="px-4 py-3">{lead.source}</td>
              <td className="px-4 py-3">{lead.owner?.name || "Atanmadı"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stageMeta[lead.stage].color}`}>
                  {stageMeta[lead.stage].label}
                </span>
              </td>
              <td className="px-4 py-3">{formatDate(lead.nextFollowUpDate)}</td>
              <td className="px-4 py-3">{lead.totalPlanPrice ? Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR" }).format(lead.totalPlanPrice) : "-"}</td>
              <td className="px-4 py-3">{formatDate(lead.activities[0]?.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/leads/${lead.id}`} className="text-emerald-600 hover:underline">
                  Detay
                </Link>
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={11} className="px-4 py-6 text-center text-sm text-slate-500">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
