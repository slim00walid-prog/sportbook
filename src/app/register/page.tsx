"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
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
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Inscription impossible");
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
            <UserPlus size={20} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Créer un compte</h1>
        </div>
        <p className="mt-2 text-sm text-slate-600">Rejoignez SportBook et réservez vos terrains.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Prénom</label>
              <input value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Nom</label>
              <input value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} required
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="email" required autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Téléphone</label>
            <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="tel"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
            <input value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} type="password" required minLength={8} autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
            <p className="mt-1 text-xs text-slate-500">8 caractères minimum</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-3 py-2.5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors">
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-emerald-700 hover:text-emerald-600">Connectez-vous</Link>
        </p>
      </section>
    </main>
  );
}
