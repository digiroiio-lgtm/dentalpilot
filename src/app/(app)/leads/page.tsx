import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { stageList, stageMeta } from "@/lib/stages";
import { LeadStage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadKanban } from "@/components/leads/lead-kanban";

interface LeadsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const view = typeof searchParams.view === "string" ? searchParams.view : "table";
  const stageParam = typeof searchParams.stage === "string" ? searchParams.stage : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const source = typeof searchParams.source === "string" ? searchParams.source : undefined;
  const country = typeof searchParams.country === "string" ? searchParams.country : undefined;
  const owner = typeof searchParams.owner === "string" ? searchParams.owner : undefined;

  const where: any = {};

  if (stageParam && Object.values(LeadStage).includes(stageParam as LeadStage)) {
    where.stage = stageParam;
  }
  if (source) {
    where.source = source;
  }
  if (country) {
    where.country = country;
  }
  if (owner) {
    where.ownerId = owner;
  }
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } }
    ];
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      owner: true,
      activities: { orderBy: { createdAt: "desc" }, take: 1 },
      treatmentPlans: true
    },
    orderBy: { updatedAt: "desc" }
  });

  const owners = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-slate-500">Lead yönetimi</p>
          <h1 className="text-3xl font-semibold text-slate-900">Lead'ler</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/leads/new">
            <Button>+ Yeni lead</Button>
          </Link>
          <Link href={view === "table" ? "/leads?view=kanban" : "/leads?view=table"} className="hidden lg:inline-flex">
            <Button variant="secondary">{view === "table" ? "Kanban görünümü" : "Tablo görünümü"}</Button>
          </Link>
        </div>
      </div>

      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-6">
        <input type="hidden" name="view" value={view} />
        <div>
          <label className="text-xs text-slate-500">Arama</label>
          <input name="q" defaultValue={q} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Ad, telefon" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Aşama</label>
          <select name="stage" defaultValue={stageParam} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option value="">Tümü</option>
            {stageList.map((stage) => (
              <option key={stage} value={stage}>
                {stageMeta[stage].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500">Kaynak</label>
          <input name="source" defaultValue={source} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Instagram" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Ülke</label>
          <input name="country" defaultValue={country} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="UK" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Sorumlu</label>
          <select name="owner" defaultValue={owner} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
            <option value="">Tümü</option>
            {owners.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-end">
          <Button type="submit" className="w-full">
            Filtrele
          </Button>
        </div>
      </form>

      {view === "kanban" ? <LeadKanban leads={leads} /> : <LeadTable leads={leads} />}
    </div>
  );
}
