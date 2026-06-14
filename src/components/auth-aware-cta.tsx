"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AuthAwareHeroCta() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => { setLoggedIn(res.ok); setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  if (checking) return null;

  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-emerald-900 shadow-lg shadow-emerald-900/20 hover:bg-emerald-300 transition-all"
      >
        Mon dashboard
        <ArrowRight size={18} />
      </Link>
    );
  }

  return (
    <Link
      href="/register"
      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
    >
      Créer un compte
      <ArrowRight size={18} />
    </Link>
  );
}

export function AuthAwareBottomCta() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then(async (res) => { setLoggedIn(res.ok); setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  if (checking) return null;

  if (loggedIn) {
    return (
      <Link
        href="/#terrains"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-all"
      >
        Réserver un terrain
        <ArrowRight size={18} />
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/register"
        className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-all"
      >
        Créer un compte gratuit
        <ArrowRight size={18} />
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
      >
        J&apos;ai déjà un compte
      </Link>
    </>
  );
}
