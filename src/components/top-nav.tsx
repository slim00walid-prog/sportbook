"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, User, LayoutDashboard, Shield, Building2, Menu, X } from "lucide-react";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/constants";

type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "MANAGER" | "ADMIN";
};

export function TopNav() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) { setUser(null); setAuthLoaded(true); return; }
        const data = await res.json();
        setUser(data.user);
        setAuthLoaded(true);
      })
      .catch(() => { setUser(null); setAuthLoaded(true); });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-emerald-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-sm text-white shadow-sm">
            SB
          </span>
          SportBook
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/" label="Accueil" />
          {user && (
            <>
              <NavLink href="/dashboard" label="Dashboard" />
              {user.role === "MANAGER" && <NavLink href="/dashboard/manager" label="Gestion" />}
              {user.role === "ADMIN" && <NavLink href="/dashboard/admin" label="Administration" />}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          {user && (
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden rounded-xl p-2 text-slate-600 hover:bg-emerald-50 transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          {user && authLoaded ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <User size={16} />
                {user.firstName}
                <span className={`hidden rounded-full px-2 py-0.5 text-xs font-semibold md:inline-flex ${ROLE_COLORS[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <p className="px-3 py-2 text-xs font-medium text-slate-500">
                      {user.email}
                    </p>
                    <hr className="my-1 border-slate-100" />
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                    >
                      <LayoutDashboard size={16} /> Mon dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                    >
                      <User size={16} /> Mon profil
                    </Link>
                    {user.role === "MANAGER" && (
                      <Link
                        href="/dashboard/manager"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                      >
                        <Building2 size={16} /> Gestion complexe
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                      >
                        <Shield size={16} /> Administration
                      </Link>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : authLoaded && !user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <div className="h-9 w-32 animate-pulse rounded-full bg-slate-200" />
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && user && (
        <div className="border-t border-emerald-100 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className={`text-xs ${ROLE_COLORS[user.role]} rounded-full px-2 py-0.5 inline-block mt-0.5`}>{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
            <MobileNavLink href="/dashboard" label="Dashboard" onClick={() => setMobileOpen(false)} />
            {user.role === "MANAGER" && <MobileNavLink href="/dashboard/manager" label="Gestion" onClick={() => setMobileOpen(false)} />}
            {user.role === "ADMIN" && <MobileNavLink href="/dashboard/admin" label="Administration" onClick={() => setMobileOpen(false)} />}
            <MobileNavLink href="/dashboard/profile" label="Mon profil" onClick={() => setMobileOpen(false)} />
            <button onClick={() => { setMobileOpen(false); logout(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 transition-colors"
    >
      {label}
    </Link>
  );
}
