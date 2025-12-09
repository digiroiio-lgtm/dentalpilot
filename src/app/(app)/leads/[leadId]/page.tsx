import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stageMeta } from "@/lib/stages";
import {
  addPlanItemAction,
  createActivityAction,
  createTaskAction,
  saveTreatmentPlanAction
} from "@/app/actions";
import { LeadStageControl } from "@/components/leads/lead-stage-control";
import { Button } from "@/components/ui/button";

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(value);
}

export default async function LeadDetailPage({ params }: { params: { leadId: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.leadId },
    include: {
      owner: true,
      tasks: { orderBy: { createdAt: "desc" }, include: { assignee: true } },
      activities: { orderBy: { createdAt: "desc" }, include: { performedBy: true } },
      treatmentPlans: { include: { items: { include: { priceItem: true } } }, orderBy: { createdAt: "asc" } },
      files: true,
      lostReason: true,
      deal: { include: { hotel: true, transferCompany: true } }
    }
  });
  if (!lead) {
    notFound();
  }

  const priceItems = await prisma.priceItem.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-slate-500">Lead detayı</p>
          <h1 className="text-3xl font-semibold text-slate-900">
            {lead.firstName} {lead.lastName} ({lead.country})
          </h1>
          <p className="text-sm text-slate-500">
            Kaynak: {lead.source} · {formatDate(lead.leadDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LeadStageControl leadId={lead.id} current={lead.stage} leadName={`${lead.firstName} ${lead.lastName}`} />
          <Link
            href="/deals"
            className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-emerald-500"
          >
            Deal confirmed başlat
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Hasta Bilgileri</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Telefon</dt>
                <dd className="font-medium">{lead.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">E-posta</dt>
                <dd>{lead.email || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">WhatsApp</dt>
                <dd>{lead.whatsappEnabled ? "Evet" : "Hayır"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">İletişim tercihi</dt>
                <dd>{lead.communicationPref || "-"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Referans</dt>
                <dd>{lead.referenceName || "-"}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Lead Bilgileri</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Sorumlu</dt>
                <dd>{lead.owner?.name || "Atanmadı"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Aşama</dt>
                <dd>{stageMeta[lead.stage].label}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Sonraki takip</dt>
                <dd>{formatDate(lead.nextFollowUpDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Durum</dt>
                <dd>{lead.status}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Onam & İzinler</h2>
            <p className="text-sm text-slate-600">KVKK onamı: {lead.consentGiven ? "Var" : "Yok"}</p>
            <p className="text-sm text-slate-600">Onam tarihi: {formatDate(lead.consentDate)}</p>
            <p className="text-sm text-slate-600">Pazarlama izni: {lead.marketingOptIn ? "Evet" : "Hayır"}</p>
            {lead.consentFileUrl && (
              <a href={lead.consentFileUrl} className="text-sm text-emerald-600" target="_blank" rel="noreferrer">
                Onam formu
              </a>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Dosyalar</h2>
            <ul className="space-y-2 text-sm">
              {lead.files.map((file) => (
                <li key={file.id} className="flex items-center justify-between">
                  <span>{file.type}</span>
                  <a href={file.url} className="text-emerald-600" target="_blank" rel="noreferrer">
                    Görüntüle
                  </a>
                </li>
              ))}
              {lead.files.length === 0 && <p className="text-sm text-slate-500">Dosya yok.</p>}
            </ul>
            <form
              action={`/api/leads/${lead.id}/files`}
              method="POST"
              encType="multipart/form-data"
              className="mt-3 space-y-2 text-sm"
            >
              <select name="type" className="w-full rounded-md border border-slate-200 px-3 py-2">
                <option value="PHOTO">Fotoğraf</option>
                <option value="XRAY">Röntgen</option>
                <option value="DOCUMENT">Doküman</option>
              </select>
              <input type="file" name="file" required className="w-full text-sm" />
              <Button type="submit" size="sm">
                Dosya yükle
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tedavi planları</h2>
              <form action={saveTreatmentPlanAction} className="flex gap-2 text-sm">
                <input type="hidden" name="leadId" value={lead.id} />
                <input
                  name="name"
                  placeholder="Yeni plan adı"
                  className="rounded-md border border-slate-200 px-3 py-2"
                  required
                />
                <input type="hidden" name="status" value="DRAFT" />
                <select name="currency" className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="TRY">TRY</option>
                </select>
                <Button type="submit">Plan ekle</Button>
              </form>
            </div>
            <div className="space-y-6">
              {lead.treatmentPlans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Durum: {plan.status}</p>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                    </div>
                    <form action={saveTreatmentPlanAction} className="flex flex-col gap-2 text-sm">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="planId" value={plan.id} />
                      <div className="grid gap-2 md:grid-cols-3">
                        <input name="subtotal" placeholder="Ara toplam" defaultValue={plan.subtotal ?? undefined} className="rounded-md border border-slate-200 px-2 py-1" />
                        <input name="discount" placeholder="İndirim" defaultValue={plan.discount ?? undefined} className="rounded-md border border-slate-200 px-2 py-1" />
                        <input name="total" placeholder="Toplam" defaultValue={plan.total ?? undefined} className="rounded-md border border-slate-200 px-2 py-1" />
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name="includesHotel" defaultChecked={plan.includesHotel} /> Otel dahil
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name="includesTransfer" defaultChecked={plan.includesTransfer} /> Transfer dahil
                        </label>
                        <label className="flex items-center gap-1">
                          <input type="checkbox" name="includesMedications" defaultChecked={plan.includesMedications} /> İlaçlar dahil
                        </label>
                      </div>
                      <textarea
                        name="note"
                        placeholder="Plan notu"
                        defaultValue={plan.note ?? undefined}
                        className="rounded-md border border-slate-200 px-2 py-1"
                      />
                      <div className="flex gap-2">
                        <select name="status" defaultValue={plan.status} className="rounded-md border border-slate-200 px-2 py-1">
                          <option value="DRAFT">Taslak</option>
                          <option value="SENT_TO_PATIENT">Hastaya gönderildi</option>
                          <option value="ACCEPTED">Kabul edildi</option>
                          <option value="REJECTED">Reddedildi</option>
                        </select>
                        <select name="currency" defaultValue={plan.currency} className="rounded-md border border-slate-200 px-2 py-1">
                          <option value="GBP">GBP</option>
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="TRY">TRY</option>
                        </select>
                        <Button type="submit" size="sm">
                          Planı kaydet
                        </Button>
                      </div>
                    </form>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs uppercase text-slate-400">
                        <tr>
                          <th className="py-2">Tedavi kalemi</th>
                          <th className="py-2">Açıklama</th>
                          <th className="py-2">Adet</th>
                          <th className="py-2">Birim fiyat</th>
                          <th className="py-2">Ara toplam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="py-1 font-medium text-slate-900">{item.title}</td>
                            <td className="py-1 text-slate-500">{item.description || "-"}</td>
                            <td className="py-1">{item.quantity}</td>
                            <td className="py-1">{item.unitPrice}</td>
                            <td className="py-1">{item.lineTotal}</td>
                          </tr>
                        ))}
                        {plan.items.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-3 text-center text-sm text-slate-500">
                              Kalem yok.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <form action={addPlanItemAction} className="mt-3 grid gap-3 md:grid-cols-4">
                    <input type="hidden" name="planId" value={plan.id} />
                    <div className="md:col-span-2">
                      <select name="priceItemId" className="mb-2 w-full rounded-md border border-slate-200 px-2 py-1 text-sm">
                        <option value="">Fiyat listesi seç</option>
                        {priceItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.category} - {item.name}
                          </option>
                        ))}
                      </select>
                      <input name="title" placeholder="Tedavi adı" className="w-full rounded-md border border-slate-200 px-2 py-1" required />
                    </div>
                    <div>
                      <input name="quantity" type="number" min="1" defaultValue={1} className="w-full rounded-md border border-slate-200 px-2 py-1" />
                    </div>
                    <div>
                      <input name="unitPrice" type="number" min="0" className="w-full rounded-md border border-slate-200 px-2 py-1" placeholder="Birim fiyat" />
                    </div>
                    <div className="md:col-span-4">
                      <input name="description" placeholder="Açıklama" className="w-full rounded-md border border-slate-200 px-2 py-1" />
                    </div>
                    <Button type="submit" size="sm" className="md:col-span-4 w-fit">
                      Kalem ekle
                    </Button>
                  </form>
                </div>
              ))}
              {lead.treatmentPlans.length === 0 && <p className="text-sm text-slate-500">Plan bulunamadı.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Görevler</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {lead.tasks.map((task) => (
                <li key={task.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.description || "-"}</p>
                  <p className="text-xs text-slate-500">Son tarih: {formatDate(task.dueDate)}</p>
                  <p className="text-xs text-slate-500">Sorumlu: {task.assignee?.name || "Atanmadı"}</p>
                  <span className="text-xs font-semibold">Durum: {task.status}</span>
                </li>
              ))}
              {lead.tasks.length === 0 && <p className="text-sm text-slate-500">Görev yok.</p>}
            </ul>
            <form action={createTaskAction} className="mt-4 space-y-2 text-sm">
              <input type="hidden" name="leadId" value={lead.id} />
              <input name="title" placeholder="Görev başlığı" className="w-full rounded-md border border-slate-200 px-3 py-2" required />
              <textarea name="description" placeholder="Açıklama" className="w-full rounded-md border border-slate-200 px-3 py-2" />
              <div className="grid gap-2 md:grid-cols-2">
                <input type="date" name="dueDate" className="rounded-md border border-slate-200 px-3 py-2" />
                <select name="assigneeId" className="rounded-md border border-slate-200 px-3 py-2">
                  <option value="">Sorumlu seç</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" size="sm">
                Görev ekle
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Aktiviteler</h2>
            </div>
            <ul className="space-y-3 text-sm">
              {lead.activities.map((activity) => (
                <li key={activity.id} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs uppercase text-slate-500">{activity.type}</p>
                  <p className="font-medium">{activity.note || "Not girilmedi"}</p>
                  <p className="text-xs text-slate-500">
                    {activity.performedBy?.name || "Sistem"} · {formatDate(activity.createdAt)}
                  </p>
                </li>
              ))}
              {lead.activities.length === 0 && <p className="text-sm text-slate-500">Aktivite yok.</p>}
            </ul>
            <form action={createActivityAction} className="mt-4 space-y-2 text-sm">
              <input type="hidden" name="leadId" value={lead.id} />
              <select name="type" className="rounded-md border border-slate-200 px-3 py-2">
                <option value="PHONE_CALL">Telefon</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">E-posta</option>
                <option value="IN_PERSON">Yüz yüze</option>
                <option value="VIDEO_CALL">Video</option>
              </select>
              <select name="outcome" className="rounded-md border border-slate-200 px-3 py-2">
                <option value="">Sonuç seç</option>
                <option value="REACHED">Ulaşıldı</option>
                <option value="NOT_REACHED">Ulaşılamadı</option>
                <option value="QUOTE_SENT">Fiyat gönderildi</option>
                <option value="INFO_PROVIDED">Bilgi verildi</option>
                <option value="CALLBACK_REQUESTED">Geri dönüş talebi</option>
              </select>
              <textarea name="note" placeholder="Not" className="w-full rounded-md border border-slate-200 px-3 py-2" />
              <Button type="submit" size="sm">
                Aktivite ekle
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
