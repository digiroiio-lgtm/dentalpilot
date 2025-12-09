"use client";

import { useMemo, useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { stageList, stageMeta } from "@/lib/stages";
import { LeadStage } from "@prisma/client";
import { updateLeadStageAction } from "@/app/actions";
import { LostReasonModal } from "@/components/leads/lost-reason-modal";

interface KanbanLead {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  source: string;
  stage: LeadStage;
  owner?: { name: string } | null;
  activities: { createdAt: string }[];
  treatmentPlans: { total?: number | null }[];
}

export function LeadKanban({ leads }: { leads: KanbanLead[] }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [, startTransition] = useTransition();
  const [lostLead, setLostLead] = useState<{ id: string; name: string } | null>(null);

  const grouped = useMemo(
    () => stageList.map((stage) => ({ stage, leads: leads.filter((lead) => lead.stage === stage) })),
    [leads]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStage = over.id as LeadStage;
    const leadId = active.id as string;
    if (!leadId || !newStage) return;
    if (newStage === LeadStage.LOST) {
      const lead = leads.find((item) => item.id === leadId);
      if (lead) {
        setLostLead({ id: lead.id, name: `${lead.firstName} ${lead.lastName}` });
      }
      return;
    }
    startTransition(async () => {
      await updateLeadStageAction(leadId, newStage);
    });
  };

  return (
    <div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {grouped.map((column) => (
            <KanbanColumn key={column.stage} stage={column.stage} count={column.leads.length}>
              {column.leads.map((lead) => (
                <KanbanCard key={lead.id} lead={lead} />
              ))}
              {column.leads.length === 0 && <p className="text-sm text-slate-400">Lead yok</p>}
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
      <LostReasonModal open={!!lostLead} onClose={() => setLostLead(null)} lead={lostLead} />
    </div>
  );
}

function KanbanColumn({ stage, children, count }: { stage: LeadStage; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={`flex max-h-[70vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 ${isOver ? "ring-2 ring-emerald-400" : ""}`}
    >
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-500">{stageMeta[stage].label}</p>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto">{children}</div>
    </div>
  );
}

function KanbanCard({ lead }: { lead: KanbanLead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition ${isDragging ? "opacity-70" : ""}`}
    >
      <p className="text-sm font-semibold text-slate-900">
        {lead.firstName} {lead.lastName}
      </p>
      <p className="text-xs text-slate-500">{lead.country}</p>
      <p className="text-xs text-slate-500">Kaynak: {lead.source}</p>
      <p className="text-xs text-slate-500">Sorumlu: {lead.owner?.name || "-"}</p>
      <p className="text-xs text-slate-500">
        Son aktivite:{" "}
        {lead.activities[0]?.createdAt
          ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "short" }).format(new Date(lead.activities[0].createdAt))
          : "-"}
      </p>
    </div>
  );
}
