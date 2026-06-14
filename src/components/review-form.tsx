"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function ReviewForm({ terrainId, onCreated }: { terrainId: string; onCreated: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (rating === 0) { setError("Choisissez une note"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ terrainId, rating, comment: comment || undefined }),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Erreur lors de l'envoi");
      setLoading(false);
      return;
    }
    setRating(0);
    setComment("");
    setLoading(false);
    onCreated();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold text-slate-900">Laisser un avis</h3>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-colors"
          >
            <Star
              size={28}
              className={star <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience (optionnel)"
        maxLength={500}
        rows={3}
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        onClick={submit}
        disabled={loading}
        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
      >
        {loading ? "Envoi..." : "Publier l'avis"}
      </button>
    </div>
  );
}
