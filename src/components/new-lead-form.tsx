"use client";

import { useState } from "react";
import { createLead } from "@/app/actions";

export function NewLeadForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      action={async (formData) => {
        setIsPending(true);
        setError(null);
        try {
          await createLead(formData);
        } catch (err) {
          console.error(err);
          setError("Lead kaydedilemedi");
        } finally {
          setIsPending(false);
        }
      }}
    >
      <div className="md:col-span-2">
        <label className="text-sm font-medium text-slate-600">Ad soyad</label>
        <input
          name="adSoyad"
          required
          placeholder="Örn. Ali Kaya"
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-600">E-posta</label>
        <input name="email" type="email" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-600">Telefon / WhatsApp</label>
        <input name="telefon" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-600">Ülke</label>
        <input name="ulke" className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-600">Kaynak</label>
        <input name="kaynak" placeholder="Instagram, referans vb." className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2" />
      </div>
      <div className="md:col-span-2 flex items-center justify-between">
        <p className="text-xs text-slate-500">Yeni lead, pipeline'ın "İlk temas" kolonunda görünecek.</p>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Kaydediliyor..." : "Lead ekle"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
