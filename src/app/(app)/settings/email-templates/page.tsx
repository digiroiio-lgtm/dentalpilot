import { prisma } from "@/lib/prisma";
import { saveEmailTemplateAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

const templateLabels: Record<string, string> = {
  transfer_confirmation: "Transfer onayı",
  hotel_booking: "Hotel rezervasyonu",
  patient_deal_confirmation: "Hasta onay maili"
};

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="space-y-6">
      {Object.entries(templateLabels).map(([key, label]) => {
        const template = templates.find((tmpl) => tmpl.key === key);
        return (
          <form key={key} action={saveEmailTemplateAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
            <input type="hidden" name="id" defaultValue={template?.id} />
            <input type="hidden" name="key" value={key} />
            <h2 className="text-lg font-semibold">{label}</h2>
            <div>
              <label className="text-sm text-slate-600">Konu</label>
              <input name="subject" defaultValue={template?.subject} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" required />
            </div>
            <div>
              <label className="text-sm text-slate-600">İçerik</label>
              <textarea
                name="body"
                defaultValue={template?.body}
                rows={6}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                placeholder="Merhaba {{patient_name}}, ..."
                required
              />
            </div>
            <p className="text-xs text-slate-500">Kullanılabilir placeholder'lar: {{patient_name}}, {{arrival_date}}, {{departure_date}}, {{hotel_name}}, {{flight_no}}, {{clinic_name}}, {{treatment_summary}}</p>
            <Button type="submit">Şablonu kaydet</Button>
          </form>
        );
      })}
    </div>
  );
}
