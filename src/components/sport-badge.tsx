import { SPORT_EMOJIS, SPORT_COLORS, SPORT_LABELS } from "@/lib/constants";

export function SportBadge({ sportType }: { sportType: string }) {
  const colorClass = SPORT_COLORS[sportType] ?? "bg-slate-100 text-slate-700 border-slate-300";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
      <span>{SPORT_EMOJIS[sportType] ?? "⚽"}</span>
      {SPORT_LABELS[sportType] ?? sportType}
    </span>
  );
}
