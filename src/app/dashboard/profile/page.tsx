"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

type Profile = {
  id: string; email: string; firstName: string; lastName: string; phone: string | null; role: string; createdAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { setLoading(false); return; }
        const body = await res.json();
        setProfile(body.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-5 w-64 rounded bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <User size={48} className="mx-auto text-slate-300" />
        <p className="mt-4 text-lg font-semibold text-slate-700">Connectez-vous pour voir votre profil</p>
        <a href="/login" className="mt-4 inline-flex rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white">Connexion</a>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mon profil</h1>
          <p className="text-sm text-slate-600">Informations personnelles</p>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Prénom</label>
              <input defaultValue={profile.firstName} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Nom</label>
              <input defaultValue={profile.lastName} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input defaultValue={profile.email} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Téléphone</label>
            <input defaultValue={profile.phone ?? ""} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Rôle</label>
            <input defaultValue={profile.role} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Membre depuis</label>
            <input defaultValue={new Date(profile.createdAt).toLocaleDateString("fr-FR")} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed" disabled />
          </div>
        </div>
      </section>
    </main>
  );
}
