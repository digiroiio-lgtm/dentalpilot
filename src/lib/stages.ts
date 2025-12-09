import { LeadStage } from "@prisma/client";

export const stageMeta: Record<LeadStage, { label: string; color: string }> = {
  [LeadStage.INITIAL_CONTACT]: { label: "İlk temas", color: "bg-slate-100 text-slate-700" },
  [LeadStage.WAITING_PHOTOS]: { label: "Foto bekleniyor", color: "bg-amber-100 text-amber-700" },
  [LeadStage.QUOTE_SENT]: { label: "Fiyat verildi", color: "bg-violet-100 text-violet-700" },
  [LeadStage.POSITIVE]: { label: "Pozitif", color: "bg-emerald-100 text-emerald-700" },
  [LeadStage.DEAL_CONFIRMED]: { label: "Deal confirmed", color: "bg-sky-100 text-sky-700" },
  [LeadStage.LOST]: { label: "Kaybedildi", color: "bg-rose-100 text-rose-700" }
};

export const stageList: LeadStage[] = [
  LeadStage.INITIAL_CONTACT,
  LeadStage.WAITING_PHOTOS,
  LeadStage.QUOTE_SENT,
  LeadStage.POSITIVE,
  LeadStage.DEAL_CONFIRMED,
  LeadStage.LOST
];
