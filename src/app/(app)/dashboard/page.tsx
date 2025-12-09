import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stageList, stageMeta } from "@/lib/stages";
import { LeadStage } from "@prisma/client";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(value);
}

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [leadsThisMonth, activeLeads, dealsThisMonth, totalLeads, lostLeads] = await Promise.all([
    prisma.lead.count({ where: { leadDate: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { status: "ACTIVE" } }),
    prisma.lead.count({ where: { stage: LeadStage.DEAL_CONFIRMED, updatedAt: { gte: startOfMonth } } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { stage: LeadStage.LOST } })
  ]);

  const conversionRate = totalLeads > 0 ? Math.round((dealsThisMonth / totalLeads) * 100) : 0;

  const pipelineCounts = await prisma.lead.groupBy({
    by: ["stage"],
    _count: { stage: true }
  });

  const tasks = await prisma.task.findMany({
    where: { status: "OPEN" },
    include: { lead: true, assignee: true },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    take: 6
  });

  const activities = await prisma.activity.findMany({
    include: { lead: true, performedBy: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  const stageCountMap = pipelineCounts.reduce<Record<LeadStage, number>>((acc, entry) => {
    acc[entry.stage as LeadStage] = entry._count.stage;
    return acc;
  }, {
    [LeadStage.INITIAL_CONTACT]: 0,
    [LeadStage.WAITING_PHOTOS]: 0,
    [LeadStage.QUOTE_SENT]: 0,
    [LeadStage.POSITIVE]: 0,
    [LeadStage.DEAL_CONFIRMED]: 0,
    [LeadStage.LOST]: 0
  });

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Bu ay gelen lead sayısı</p>
          <p className="mt-2 text-3xl font-semibold">{leadsThisMonth}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Aktif lead sayısı</p>
          <p className="mt-2 text-3xl font-semibold">{activeLeads}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Bu ay Deal confirmed</p>
          <p className="mt-2 text-3xl font-semibold">{dealsThisMonth}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Dönüşüm oranı (%)</p>
          <p className="mt-2 text-3xl font-semibold">%{conversionRate}</p>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Pipeline özeti</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stageList.map((stage) => (
            <Link key={stage} href={`/leads?stage=${stage}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-500">
              <p className="text-sm text-slate-500">{stageMeta[stage].label}</p>
              <p className="mt-2 text-2xl font-semibold">{stageCountMap[stage] ?? 0}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Bugün yapılacaklar</h2>
              <p className="text-sm text-slate-500">Açık görevler</p>
            </div>
            <Link href="/leads" className="text-sm text-emerald-600 hover:underline">
              Tümünü gör
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-400">
                  <th className="py-2">Hasta</th>
                  <th className="py-2">Ülke</th>
                  <th className="py-2">Görev</th>
                  <th className="py-2">Sorumlu</th>
                  <th className="py-2">Son tarih</th>
                  <th className="py-2">Aksiyon</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t text-slate-600">
                    <td className="py-2 font-medium text-slate-900">
                      {task.lead.firstName} {task.lead.lastName}
                    </td>
                    <td className="py-2">{task.lead.country}</td>
                    <td className="py-2">{task.title}</td>
                    <td className="py-2">{task.assignee?.name || "Atanmadı"}</td>
                    <td className="py-2">{formatDate(task.dueDate)}</td>
                    <td className="py-2">
                      <Link href={`/leads/${task.leadId}`} className="text-emerald-600 hover:underline">
                        Detaya git
                      </Link>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-sm text-slate-500">
                      Bugün için görev bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Son aktiviteler</h2>
              <p className="text-sm text-slate-500">En güncel 10 kayıt</p>
            </div>
            <Link href="/leads" className="text-sm text-emerald-600 hover:underline">
              Lead'lere git
            </Link>
          </div>
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-3">
                <Badge variant="info" className="capitalize">
                  {activity.type.toLowerCase()}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {activity.lead.firstName} {activity.lead.lastName}
                  </p>
                  <p className="text-sm text-slate-600">{activity.note || "Not girilmemiş"}</p>
                  <p className="text-xs text-slate-400">
                    {activity.performedBy?.name || "Sistem"} · {formatDate(activity.createdAt)}
                  </p>
                </div>
              </li>
            ))}
            {activities.length === 0 && <p className="text-sm text-slate-500">Aktivite kaydı yok.</p>}
          </ul>
        </Card>
      </section>
    </div>
  );
}
