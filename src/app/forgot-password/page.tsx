"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue");
    }
  }

  if (sent) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-4">
        <div className="w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">Email envoyé</h1>
          <p className="mt-2 text-slate-600">
            Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation.
          </p>
          <Link href="/login" className="mt-6 inline-block rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
            Retour à la connexion
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-4">
      <div className="w-full">
        <Link href="/login" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-700 mb-6">
          <ArrowLeft size={16} /> Retour
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-slate-600">Saisissez votre email pour recevoir un lien de réinitialisation.</p>

        {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                placeholder="vous@exemple.fr" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors">
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </main>
  );
}
