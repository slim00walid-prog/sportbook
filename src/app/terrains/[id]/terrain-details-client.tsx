"use client";

import { useEffect, useState } from "react";
import { MapPin, Clock, Euro, Shield, Star } from "lucide-react";
import { SportBadge } from "@/components/sport-badge";
import { ReviewForm } from "@/components/review-form";

type Terrain = {
  id: string;
  name: string;
  sportType: string;
  pricePerHourCents: number;
  openTime: string;
  closeTime: string;
  equipment: string[];
  photos: string[];
  avgRating: number | null;
  complex: { name: string; city: string; district: string; address: string };
  reviews: Array<{ id: string; rating: number; comment: string | null; createdAt: string; user: { firstName: string; lastName: string } }>;
};

export function TerrainDetailsClient({ terrainId }: { terrainId: string }) {
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:00");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch(`/api/terrains/${terrainId}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { setError("Terrain introuvable"); return; }
        const body = await res.json();
        setTerrain(body.terrain);
      })
      .catch(() => setError("Terrain introuvable"));
  }, [terrainId, reloadKey]);

  async function reserve() {
    if (!terrain || !date) { setError("Choisissez une date"); return; }
    setError("");
    const startAt = new Date(`${date}T${startTime}:00`);
    const endAt = new Date(`${date}T${endTime}:00`);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ terrainId: terrain.id, startAt, endAt }),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Réservation impossible");
      return;
    }
    window.location.href = "/dashboard";
  }

  if (!terrain) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded-full bg-slate-200" />
          <div className="h-10 w-72 rounded-lg bg-slate-200" />
          <div className="h-5 w-48 rounded bg-slate-100" />
          <div className="mt-8 h-40 rounded-3xl bg-slate-100" />
        </div>
      </main>
    );
  }

  if (error && !terrain) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-lg font-bold text-slate-700">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <SportBadge sportType={terrain.sportType} />
            <h1 className="mt-3 text-3xl font-black text-slate-900">{terrain.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-slate-600">
              <MapPin size={16} className="shrink-0" />
              {terrain.complex.name} — {terrain.complex.city}, {terrain.complex.district}
            </p>
            <p className="mt-0.5 text-sm text-slate-500 ml-6">{terrain.complex.address}</p>

            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Clock size={16} className="text-emerald-600" />
                {terrain.openTime} — {terrain.closeTime}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Euro size={16} className="text-emerald-600" />
                <span className="font-bold">{(terrain.pricePerHourCents / 100).toFixed(2)} EUR</span>/h
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Shield size={16} className="text-emerald-600" />
                Paiement sécurisé
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">Équipements</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {terrain.equipment.length > 0
                  ? terrain.equipment.map((eq) => (
                      <span key={eq} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                        {eq}
                      </span>
                    ))
                  : <span className="text-sm text-slate-400">Non spécifié</span>
                }
              </div>
            </div>
          </section>

          <ReviewForm terrainId={terrainId} onCreated={() => setReloadKey((k) => k + 1)} />

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Star size={18} className="text-amber-400" />
              Avis ({terrain.reviews.length})
              {terrain.avgRating && <span className="text-sm font-normal text-slate-500">— {terrain.avgRating.toFixed(1)}/5</span>}
            </h2>
            <div className="mt-4 space-y-4">
              {terrain.reviews.length > 0 ? (
                terrain.reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="mt-1.5 text-sm text-slate-600">{review.comment}</p>}
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">Aucun avis pour le moment. Soyez le premier !</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section className="sticky top-24 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Réserver ce terrain</h2>
            <p className="mt-1 text-sm text-slate-500">Choisissez votre créneau</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">Début</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Fin</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            {date && (
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Terrain</span>
                  <span className="font-semibold text-slate-900">{terrain.name}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Créneau</span>
                  <span className="font-semibold text-slate-900">{date} • {startTime} — {endTime}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Prix</span>
                  <span className="font-bold text-emerald-700">{(terrain.pricePerHourCents / 100).toFixed(2)} EUR/h</span>
                </div>
                <hr className="my-2 border-emerald-200" />
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-900">Total estimé</span>
                  <span className="text-lg text-emerald-700">
                    {(terrain.pricePerHourCents / 100).toFixed(2)} EUR
                  </span>
                </div>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <button onClick={reserve}
              className="mt-5 w-full rounded-2xl bg-emerald-600 py-3 font-bold text-white shadow-md hover:bg-emerald-500 transition-colors">
              Payer et confirmer
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">
              Paiement sécurisé par stripe &bull; Annulation gratuite jusqu&apos;à 24h avant
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
