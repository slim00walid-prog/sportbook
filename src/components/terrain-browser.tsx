"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Euro, Search } from "lucide-react";
import { SportBadge } from "@/components/sport-badge";

type Terrain = {
  id: string;
  name: string;
  sportType: string;
  pricePerHourCents: number;
  openTime: string;
  closeTime: string;
  equipment: string[];
  avgRating: number | null;
  complex: { name: string; city: string; district: string };
};

export function TerrainBrowser() {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [sportType, setSportType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (sportType) params.set("sportType", sportType);
    if (maxPrice) params.set("maxPrice", maxPrice);
    return params.toString();
  }, [city, sportType, maxPrice]);

  useEffect(() => {
    fetch(`/api/terrains${query ? `?${query}` : ""}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setTerrains(data.terrains ?? []))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8" id="terrains">
      <div className="rounded-3xl border border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Search size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Trouver un terrain</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Tous les sports</option>
            <option value="FOOTBALL">⚽ Football</option>
            <option value="TENNIS">🎾 Tennis</option>
            <option value="BASKETBALL">🏀 Basketball</option>
            <option value="PADEL">🏐 Padel</option>
          </select>
          <div className="relative">
            <Euro size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Prix max / h"
              type="number"
              min="1"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => { setCity(""); setSportType(""); setMaxPrice(""); }}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-4 w-20 rounded-full bg-slate-200" />
              <div className="mt-3 h-6 w-40 rounded-lg bg-slate-200" />
              <div className="mt-2 h-4 w-32 rounded bg-slate-100" />
              <div className="mt-4 h-4 w-24 rounded bg-slate-100" />
              <div className="mt-4 flex items-end justify-between">
                <div className="h-6 w-20 rounded-lg bg-slate-200" />
                <div className="h-8 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : terrains.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-semibold text-slate-700">Aucun terrain trouvé</p>
          <p className="mt-1 text-sm text-slate-500">Essayez de modifier vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {terrains.map((terrain) => (
            <article key={terrain.id} className="card-hover rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5">
              <div className="flex items-start justify-between">
                <SportBadge sportType={terrain.sportType} />
                <p className="text-xs text-slate-400">
                  {terrain.avgRating ? `★ ${terrain.avgRating.toFixed(1)}` : "Nouveau"}
                </p>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{terrain.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                <MapPin size={14} className="shrink-0 text-slate-400" />
                {terrain.complex.name}, {terrain.complex.city}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {terrain.equipment.slice(0, 3).map((eq) => (
                  <span key={eq} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{eq}</span>
                ))}
                {terrain.equipment.length > 3 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-400">+{terrain.equipment.length - 3}</span>
                )}
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500">À partir de</p>
                  <p className="text-xl font-black text-slate-900">{(terrain.pricePerHourCents / 100).toFixed(2)} <span className="text-sm font-normal text-slate-500">EUR/h</span></p>
                </div>
                <Link
                  href={`/terrains/${terrain.id}`}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                >
                  Réserver
                </Link>
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
