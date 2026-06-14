"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, User, Building2, Shield } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";

type CurrentUser = { id: string; firstName: string; lastName: string; email: string; role: "USER" | "MANAGER" | "ADMIN" };

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { window.location.href = "/login"; return; }
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => { window.location.href = "/login"; });
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-10 w-48 rounded-lg bg-slate-200" />
          <div className="mx-auto h-5 w-64 rounded bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  const links = {
    USER: [
      { href: "/dashboard/user", icon: LayoutDashboard, label: "Mes réservations", desc: "Consultez et gérez vos réservations", color: "bg-emerald-100 text-emerald-700" },
      { href: "/dashboard/profile", icon: User, label: "Mon profil", desc: "Modifier mes informations", color: "bg-blue-100 text-blue-700" },
    ],
    MANAGER: [
      { href: "/dashboard/manager", icon: Building2, label: "Mon complexe", desc: "Gérez vos terrains et équipements", color: "bg-amber-100 text-amber-700" },
      { href: "/dashboard/profile", icon: User, label: "Mon profil", desc: "Modifier mes informations", color: "bg-blue-100 text-blue-700" },
    ],
    ADMIN: [
      { href: "/dashboard/admin", icon: Shield, label: "Administration", desc: "Gérer utilisateurs, complexes et terrains", color: "bg-purple-100 text-purple-700" },
      { href: "/dashboard/profile", icon: User, label: "Mon profil", desc: "Mes informations personnelles", color: "bg-blue-100 text-blue-700" },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-emerald-700 uppercase">Tableau de bord</p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-slate-600">{user.email}</p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${ROLE_COLORS[user.role]}`}>
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {links[user.role].map(({ href, icon: Icon, label, desc, color }) => (
          <a key={href} href={href} className="card-hover rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
              <Icon size={28} />
            </div>
            <p className="mt-4 text-lg font-bold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
