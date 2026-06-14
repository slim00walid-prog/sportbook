"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (res.ok) window.location.href = "/dashboard";
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="animate-pulse h-6 w-32 mx-auto rounded bg-slate-200" />
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <main className="mx-auto flex w-full max-w-md px-4 py-16">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <LogIn size={20} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Connexion</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">Accédez à votre espace réservation.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Mot de passe</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-emerald-700 hover:text-emerald-600">Mot de passe oublié ?</Link>
            </div>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-3 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold text-emerald-700 hover:text-emerald-600">Inscrivez-vous</Link>
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">Comptes de démonstration :</p>
          <p>Admin : <span className="font-mono text-emerald-700">admin@sportbook.local</span> / password123</p>
          <p>Manager : <span className="font-mono text-emerald-700">manager@sportbook.local</span> / password123</p>
          <p>Client : <span className="font-mono text-emerald-700">user@sportbook.local</span> / password123</p>
        </div>
      </section>
    </main>
  );
}
