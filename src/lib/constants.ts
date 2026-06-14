export const SPORT_LABELS: Record<string, string> = {
  FOOTBALL: "Football",
  TENNIS: "Tennis",
  BASKETBALL: "Basketball",
  PADEL: "Padel",
};

export const SPORT_EMOJIS: Record<string, string> = {
  FOOTBALL: "\u26BD",
  TENNIS: "\uD83C\uDFBE",
  BASKETBALL: "\uD83C\uDFC0",
  PADEL: "\uD83C\uDFD0",
};

export const SPORT_COLORS: Record<string, string> = {
  FOOTBALL: "bg-emerald-100 text-emerald-800 border-emerald-300",
  TENNIS: "bg-amber-100 text-amber-800 border-amber-300",
  BASKETBALL: "bg-orange-100 text-orange-800 border-orange-300",
  PADEL: "bg-blue-100 text-blue-800 border-blue-300",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  REJECTED: "Refusée",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
  REJECTED: "bg-slate-100 text-slate-800 border-slate-300",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-emerald-100 text-emerald-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-slate-100 text-slate-800",
};

export const ROLE_LABELS: Record<string, string> = {
  USER: "Utilisateur",
  MANAGER: "Gestionnaire",
  ADMIN: "Administrateur",
};

export const ROLE_COLORS: Record<string, string> = {
  USER: "bg-slate-100 text-slate-700",
  MANAGER: "bg-amber-100 text-amber-800",
  ADMIN: "bg-purple-100 text-purple-800",
};
