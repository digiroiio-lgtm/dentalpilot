"use client";

import { useMemo, useState } from "react";
import { saveLostReasonAction } from "@/app/actions";
import { LostReasonCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const reasonOptions: Record<LostReasonCategory, { label: string; options: string[] }> = {
  PRICE_FINANCIAL: {
    label: "Fiyat & Finansman",
    options: [
      "Fiyat yüksek geldi",
      "Daha ucuz klinik buldu",
      "Paket pahalı geldi",
      "Pazarlık sonuçsuz",
      "Bütçe yetersiz",
      "Depozito ödeyemedi",
      "Ödeme planı uygun değil"
    ]
  },
  PATIENT_INTEREST: {
    label: "Hasta ilgisi",
    options: [
      "Tedaviden vazgeçti",
      "Korktu / endişelendi",
      "Zaman uygun değil",
      "Ailesi onaylamadı",
      "Kararını erteledi"
    ]
  },
  COMPETITOR: {
    label: "Rakip klinik",
    options: [
      "Başka klinik seçti",
      "Başka doktora güvendi",
      "Daha hızlı dönüş aldı",
      "Ülkesinde yaptıracak"
    ]
  },
  COMMUNICATION: {
    label: "İletişim",
    options: [
      "Yanıt vermedi",
      "Mesaja dönüş yok",
      "Randevuya gelmedi",
      "Fotoğraf göndermedi",
      "Süreç karışık geldi",
      "İletişim kesildi"
    ]
  },
  MEDICAL: {
    label: "Medikal",
    options: [
      "Medikal olarak uygun değil",
      "Planı beğenmedi",
      "Daha az girişimsel istedi",
      "Teknik konusunda ikna olmadı"
    ]
  },
  LOGISTICS: {
    label: "Lojistik",
    options: [
      "Uçuş bulamadı",
      "Tarihler uymadı",
      "Vize sorunu",
      "Seyahat zor geldi"
    ]
  },
  OTHER: {
    label: "Diğer",
    options: ["Diğer"]
  }
};

interface LostReasonModalProps {
  open: boolean;
  onClose: () => void;
  lead: { id: string; name: string } | null;
}

export function LostReasonModal({ open, onClose, lead }: LostReasonModalProps) {
  const [category, setCategory] = useState<LostReasonCategory>(LostReasonCategory.PRICE_FINANCIAL);
  const [reasonKey, setReasonKey] = useState<string>(reasonOptions[LostReasonCategory.PRICE_FINANCIAL].options[0]);

  const options = useMemo(() => reasonOptions[category], [category]);

  if (!open || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        action={async (formData) => {
          await saveLostReasonAction(formData);
          onClose();
        }}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <input type="hidden" name="leadId" value={lead.id} />
        <div className="mb-4">
          <p className="text-xs uppercase text-slate-500">Kayıp nedenini seçin</p>
          <h2 className="text-xl font-semibold text-slate-900">{lead.name}</h2>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-slate-600">Kategori</label>
            <select
              name="category"
              value={category}
              onChange={(event) => {
                const cat = event.target.value as LostReasonCategory;
                setCategory(cat);
                setReasonKey(reasonOptions[cat].options[0]);
              }}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              {Object.entries(reasonOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Neden</label>
            <select
              name="reasonKey"
              value={reasonKey}
              onChange={(event) => setReasonKey(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              {options.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Açıklama</label>
            <Textarea
              name="description"
              placeholder={category === LostReasonCategory.OTHER ? "Kısaca açıklayın" : "İsteğe bağlı"}
              required={category === LostReasonCategory.OTHER}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit">Kaydet</Button>
        </div>
      </form>
    </div>
  );
}
