"use client";

import { useEffect, useState, useTransition } from "react";
import { LeadStage } from "@prisma/client";
import { stageList, stageMeta } from "@/lib/stages";
import { updateLeadStageAction } from "@/app/actions";
import { LostReasonModal } from "@/components/leads/lost-reason-modal";

export function LeadStageControl({ leadId, current, leadName }: { leadId: string; current: LeadStage; leadName: string }) {
  const [value, setValue] = useState(current);
  const [openLost, setOpenLost] = useState(false);
  const [, startTransition] = useTransition();
  useEffect(() => {
    setValue(current);
  }, [current]);

  const handleChange = (next: LeadStage) => {
    if (next === LeadStage.LOST) {
      setValue(next);
      setOpenLost(true);
      return;
    }
    setValue(next);
    startTransition(async () => {
      await updateLeadStageAction(leadId, next);
    });
  };

  return (
    <div>
      <select
        value={value}
        onChange={(event) => handleChange(event.target.value as LeadStage)}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
      >
        {stageList.map((stage) => (
          <option key={stage} value={stage}>
            {stageMeta[stage].label}
          </option>
        ))}
      </select>
      <LostReasonModal
        open={openLost}
        onClose={() => {
          setOpenLost(false);
          setValue(current);
        }}
        lead={{ id: leadId, name: leadName }}
      />
    </div>
  );
}
