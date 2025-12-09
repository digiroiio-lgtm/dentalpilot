import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-wide text-emerald-600">Dental Klinik CRM</p>
          <h1 className="text-2xl font-semibold text-slate-900">Klinik CRM</h1>
          <p className="text-sm text-slate-500">Lütfen hesabınıza giriş yapın</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
