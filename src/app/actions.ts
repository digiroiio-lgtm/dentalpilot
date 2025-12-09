"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PipelineStatus } from "@prisma/client";

const leadSchema = z.object({
  adSoyad: z.string().min(2, "Ad soyad gerekli"),
  email: z.string().email().optional().or(z.literal("")),
  telefon: z.string().optional().or(z.literal("")),
  ulke: z.string().optional().or(z.literal("")),
  kaynak: z.string().optional().or(z.literal(""))
});

export async function createLead(formData: FormData) {
  const parsed = leadSchema.parse({
    adSoyad: formData.get("adSoyad")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    telefon: formData.get("telefon")?.toString() ?? "",
    ulke: formData.get("ulke")?.toString() ?? "",
    kaynak: formData.get("kaynak")?.toString() ?? ""
  });

  await prisma.lead.create({
    data: {
      ...parsed,
      email: parsed.email || null,
      telefon: parsed.telefon || null,
      ulke: parsed.ulke || null,
      kaynak: parsed.kaynak || null
    }
  });

  revalidatePath("/");
}

export async function updateLeadStatus(leadId: string, status: PipelineStatus) {
  await prisma.lead.update({
    where: { id: leadId },
    data: { status }
  });
  revalidatePath("/");
  revalidatePath(`/leads/${leadId}`);
}

const taskSchema = z.object({
  leadId: z.string(),
  title: z.string().min(2),
  dueDate: z.string().optional()
});

export async function createTask(formData: FormData) {
  const parsed = taskSchema.parse({
    leadId: formData.get("leadId")?.toString() ?? "",
    title: formData.get("title")?.toString() ?? "",
    dueDate: formData.get("dueDate")?.toString()
  });

  await prisma.task.create({
    data: {
      leadId: parsed.leadId,
      title: parsed.title,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null
    }
  });
  revalidatePath(`/leads/${parsed.leadId}`);
}

export async function toggleTask(taskId: string, leadId: string, completed: boolean) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: completed ? "TAMAMLANDI" : "PENDING" }
  });
  revalidatePath(`/leads/${leadId}`);
}

const activitySchema = z.object({
  leadId: z.string(),
  type: z.string(),
  userName: z.string().optional().or(z.literal("")),
  content: z.string().min(2)
});

export async function logActivity(formData: FormData) {
  const parsed = activitySchema.parse({
    leadId: formData.get("leadId")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "NOTE",
    userName: formData.get("userName")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? ""
  });

  await prisma.activity.create({
    data: {
      leadId: parsed.leadId,
      type: parsed.type as any,
      userName: parsed.userName || null,
      content: parsed.content
    }
  });
  revalidatePath(`/leads/${parsed.leadId}`);
}

const planSchema = z.object({
  leadId: z.string(),
  label: z.string().min(2),
  currency: z.string().length(3)
});

export async function createTreatmentPlan(formData: FormData) {
  const parsed = planSchema.parse({
    leadId: formData.get("leadId")?.toString() ?? "",
    label: formData.get("label")?.toString() ?? "",
    currency: formData.get("currency")?.toString() ?? "EUR"
  });

  await prisma.treatmentPlan.create({
    data: {
      leadId: parsed.leadId,
      label: parsed.label,
      currency: parsed.currency.toUpperCase()
    }
  });
  revalidatePath(`/leads/${parsed.leadId}`);
}

const itemSchema = z.object({
  planId: z.string(),
  leadId: z.string(),
  name: z.string().min(2),
  price: z.string(),
  quantity: z.coerce.number().min(1)
});

export async function addTreatmentItem(formData: FormData) {
  const parsed = itemSchema.parse({
    planId: formData.get("planId")?.toString() ?? "",
    leadId: formData.get("leadId")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    price: formData.get("price")?.toString() ?? "0",
    quantity: formData.get("quantity")?.toString() ?? "1"
  });

  await prisma.treatmentItem.create({
    data: {
      treatmentPlanId: parsed.planId,
      name: parsed.name,
      price: parsed.price,
      quantity: parsed.quantity
    }
  });
  revalidatePath(`/leads/${parsed.leadId}`);
}

export async function updateDealSelection(leadId: string, data: { hotelId?: string | null; transferId?: string | null }) {
  await prisma.deal.upsert({
    where: { leadId },
    update: { ...data },
    create: {
      leadId,
      ...data
    }
  });
  revalidatePath(`/leads/${leadId}`);
}

export async function markDealEmail(leadId: string, payload: { hotelEmailSent?: boolean; transferEmailSent?: boolean }) {
  await prisma.deal.update({
    where: { leadId },
    data: {
      hotelEmailSent: payload.hotelEmailSent,
      transferEmailSent: payload.transferEmailSent
    }
  });
  revalidatePath(`/leads/${leadId}`);
}

export async function confirmDeal(leadId: string) {
  await prisma.deal.upsert({
    where: { leadId },
    update: { confirmedAt: new Date() },
    create: {
      leadId,
      confirmedAt: new Date()
    }
  });
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: PipelineStatus.DEAL_CONFIRMED }
  });
  revalidatePath("/");
  revalidatePath(`/leads/${leadId}`);
  redirect("/");
}

const priceItemSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional().or(z.literal("")),
  price: z.string(),
  currency: z.string().length(3)
});

export async function createPriceItem(formData: FormData) {
  const parsed = priceItemSchema.parse({
    name: formData.get("name")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
    price: formData.get("price")?.toString() ?? "0",
    currency: formData.get("currency")?.toString() ?? "EUR"
  });

  await prisma.priceItem.create({
    data: {
      name: parsed.name,
      category: parsed.category || null,
      price: parsed.price,
      currency: parsed.currency.toUpperCase()
    }
  });
  revalidatePath("/ayarlar");
}

const hotelSchema = z.object({
  name: z.string().min(2),
  city: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal(""))
});

export async function createHotel(formData: FormData) {
  const parsed = hotelSchema.parse({
    name: formData.get("name")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    note: formData.get("note")?.toString() ?? ""
  });

  await prisma.hotel.create({
    data: {
      name: parsed.name,
      city: parsed.city || null,
      note: parsed.note || null
    }
  });
  revalidatePath("/ayarlar");
}

const transferSchema = z.object({
  name: z.string().min(2),
  provider: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal(""))
});

export async function createTransfer(formData: FormData) {
  const parsed = transferSchema.parse({
    name: formData.get("name")?.toString() ?? "",
    provider: formData.get("provider")?.toString() ?? "",
    note: formData.get("note")?.toString() ?? ""
  });

  await prisma.transferOption.create({
    data: {
      name: parsed.name,
      provider: parsed.provider || null,
      note: parsed.note || null
    }
  });
  revalidatePath("/ayarlar");
}

const templateSchema = z.object({
  title: z.string().min(2),
  subject: z.string().min(2),
  body: z.string().min(5),
  type: z.string()
});

export async function createTemplate(formData: FormData) {
  const parsed = templateSchema.parse({
    title: formData.get("title")?.toString() ?? "",
    subject: formData.get("subject")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "GENERIC"
  });

  await prisma.emailTemplate.create({
    data: {
      title: parsed.title,
      subject: parsed.subject,
      body: parsed.body,
      type: parsed.type as any
    }
  });
  revalidatePath("/ayarlar");
}
