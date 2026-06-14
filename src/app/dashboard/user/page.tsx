"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, XCircle, Star } from "lucide-react";
import { SportBadge } from "@/components/sport-badge";
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from "@/lib/constants";

type Reservation = {
  id: string;
  startAt: string;
  endAt: string;
  totalCents: number;
  status: string;
  paymentStatus: string;
  invoiceUrl: string | null;
  terrain: { id: string; name: string; sportType: string; complex: { name: string; city: string } };
};

export default function UserDashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reservations", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { setError("Impossible de charger les réservations"); setLoading(false); return; }
        const body = await res.json();
        setReservations(body.reservations ?? []);
        setLoading(false);
      })
      .catch(() => { setError("Impossible de charger les réservations"); setLoading(false); });
  }, []);

  async function cancel(id: string) {
    setCancelling(id);
    const res = await fetch(`/api/reservations/${id}/cancel`, { method: "PATCH" });
    if (!res.ok) {
      const body = await res.json();
      alert(body.error ?? "Impossible d'annuler");
      setCancelling(null);
      return;
    }
    setReservations((prev) => prev.map((r) => r.id === id ? { ...r, status: "CANCELLED", paymentStatus: "REFUNDED" } : r));
    setCancelling(null);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 rounded-lg bg-slate-200" />
          <div className="h-5 w-80 rounded bg-slate-100" />
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-100" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Calendar size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Mes réservations</h1>
          <p className="text-sm text-slate-600">Historique et gestion de vos créneaux réservés.</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {reservations.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Calendar size={48} className="mx-auto text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-700">Aucune réservation</p>
          <p className="mt-1 text-sm text-slate-500">Réservez votre premier terrain dès maintenant.</p>
          <Link href="/#terrains" className="mt-4 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
            Voir les terrains
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className="flex items-start justify-between">
                <SportBadge sportType={r.terrain.sportType} />
                <div className="flex gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PAYMENT_STATUS_COLORS[r.paymentStatus]}`}>
                    {PAYMENT_STATUS_LABELS[r.paymentStatus]}
                  </span>
                </div>
              </div>
              <h2 className="mt-3 text-lg font-bold text-slate-900">{r.terrain.name}</h2>
              <p className="text-sm text-slate-600">{r.terrain.complex.name} — {r.terrain.complex.city}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(r.startAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span>
                  {new Date(r.startAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} —{" "}
                  {new Date(r.endAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="font-bold text-emerald-700">{(r.totalCents / 100).toFixed(2)} EUR</span>
              </div>
              {r.status !== "CANCELLED" && r.status !== "REJECTED" && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => cancel(r.id)} disabled={cancelling === r.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
                    <XCircle size={14} />
                    {cancelling === r.id ? "Annulation..." : "Annuler"}
                  </button>
                  <a href={`/terrains/${r.terrain.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <Star size={14} />
                    Laisser un avis
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
