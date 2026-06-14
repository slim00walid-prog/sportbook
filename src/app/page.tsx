import { TerrainBrowser } from "@/components/terrain-browser";
import { Search, CreditCard, CalendarCheck } from "lucide-react";
import { AuthAwareHeroCta, AuthAwareBottomCta } from "@/components/auth-aware-cta";

export default function Home() {
  return (
    <main>
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-200 uppercase">
              Plateforme officielle
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Réservez votre
              <br />
              <span className="text-emerald-300">terrain de sport</span>
              <br />
              en quelques clics.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-emerald-100/80 leading-relaxed">
              Football, tennis, basketball, padel. Comparez les disponibilités, réservez votre créneau,
              payez en ligne et recevez votre confirmation instantanément.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#terrains"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-emerald-900 shadow-lg shadow-emerald-900/20 hover:bg-emerald-300 transition-all"
              >
                <Search size={18} />
                Trouver un terrain
              </a>
              <AuthAwareHeroCta />
            </div>
          </div>
        </div>
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
      </section>

      <section className="mx-auto -mt-10 max-w-7xl px-4 md:px-8" id="terrains">
        <div className="grid gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-lg backdrop-blur-md md:grid-cols-3">
          {[
            { icon: Search, label: "Recherchez", desc: "Parcourez les terrains disponibles près de chez vous" },
            { icon: CalendarCheck, label: "Réservez", desc: "Choisissez votre créneau et réservez instantanément" },
            { icon: CreditCard, label: "Payez", desc: "Paiement sécurisé en ligne, confirmation immédiate" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Icon size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{label}</p>
                <p className="mt-0.5 text-sm text-slate-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TerrainBrowser />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 md:p-12 text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Prêt à jouer ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Rejoignez des milliers de sportifs qui réservent leurs terrains sur SportBook.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <AuthAwareBottomCta />
          </div>
        </div>
      </section>
    </main>
  );
}
