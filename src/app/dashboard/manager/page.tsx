"use client";

import { useEffect, useState } from "react";
import { Building2, Calendar, Clock } from "lucide-react";
import { SportBadge } from "@/components/sport-badge";

type ManagedTerrain = {
  id: string;
  name: string;
  sportType: string;
  pricePerHourCents: number;
  openTime: string;
  closeTime: string;
  equipment: string[];
};

type ManagedComplex = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  description: string | null;
  terrains: ManagedTerrain[];
};

export default function ManagerDashboardPage() {
  const [complex, setComplex] = useState<ManagedComplex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/terrains", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { setLoading(false); return; }
        const data = await res.json();
        if (data?.terrains?.length > 0) {
          const first = data.terrains[0];
          setComplex({
            id: first.complex.id,
            name: first.complex.name,
            city: first.complex.city,
            district: first.complex.district,
            address: first.complex.address,
            description: first.complex.description,
            terrains: data.terrains.map((t: ManagedTerrain & { complex: { id: string } }) => ({
              id: t.id, name: t.name, sportType: t.sportType,
              pricePerHourCents: t.pricePerHourCents, openTime: t.openTime,
              closeTime: t.closeTime, equipment: t.equipment,
            })),
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!complex) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Building2 size={48} className="mx-auto text-amber-400" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Aucun complexe assigné</h1>
          <p className="mt-2 text-slate-600">Votre compte manager n&apos;est pas encore lié à un complexe.</p>
          <p className="mt-1 text-sm text-slate-500">Contactez l&apos;administrateur pour assigner un complexe à votre compte.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Building2 size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mon complexe</h1>
          <p className="text-sm text-slate-500">Gérez vos terrains, horaires et équipements.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase">Complexe</p>
            <h2 className="text-2xl font-black text-slate-900">{complex.name}</h2>
            <p className="mt-1 text-slate-600">{complex.address}, {complex.city} — {complex.district}</p>
            {complex.description && <p className="mt-1 text-sm text-slate-500">{complex.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              {complex.terrains.length} terrain{complex.terrains.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-600" />
            Terrains
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {complex.terrains.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <SportBadge sportType={t.sportType} />
              <h4 className="mt-2 text-lg font-bold text-slate-900">{t.name}</h4>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="flex items-center gap-1"><Clock size={14} /> {t.openTime} — {t.closeTime}</span>
                <span className="font-bold text-emerald-700">{(t.pricePerHourCents / 100).toFixed(2)} EUR/h</span>
              </div>
              {t.equipment.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.equipment.map((eq) => (
                    <span key={eq} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{eq}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <a href={`/terrains/${t.id}`} className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors">
                  Voir & réserver
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
