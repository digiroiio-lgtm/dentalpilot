"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard"
    });

    if (result?.error) {
      setError("Bilgiler doğrulanamadı");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">E-posta</label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ornek@klinik.com" />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Şifre</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Giriş yapılıyor" : "Giriş yap"}
      </Button>
      <button type="button" className="w-full text-center text-sm text-slate-500 hover:text-emerald-600">
        Şifremi unuttum
      </button>
    </form>
  );
}
