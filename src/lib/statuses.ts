export const pipelineStages = [
  {
    id: "ILK_TEMAS",
    label: "İlk temas",
    description: "Yeni lead ile ilk iletişim",
    color: "bg-pipeline-first"
  },
  {
    id: "FOTO_BEKLENIYOR",
    label: "Foto bekleniyor",
    description: "Hastadan foto dokümanı bekleniyor",
    color: "bg-pipeline-waiting"
  },
  {
    id: "FIYAT_VERILDI",
    label: "Fiyat verildi",
    description: "Tedavi fiyatı paylaşıldı",
    color: "bg-pipeline-price"
  },
  {
    id: "POZITIF",
    label: "Pozitif",
    description: "Lead klinikle ilerlemek istiyor",
    color: "bg-pipeline-positive"
  },
  {
    id: "DEAL_CONFIRMED",
    label: "Deal confirmed",
    description: "Rezervasyon detayları tamam",
    color: "bg-pipeline-deal"
  },
  {
    id: "KAYBEDILDI",
    label: "Kaybedildi",
    description: "Lead kaybedildi",
    color: "bg-pipeline-lost"
  }
] as const;

export type PipelineStageId = (typeof pipelineStages)[number]["id"];

export const pipelineStageMap = pipelineStages.reduce(
  (acc, stage) => {
    acc[stage.id] = stage;
    return acc;
  },
  {} as Record<PipelineStageId, (typeof pipelineStages)[number]>
);
