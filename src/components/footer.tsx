import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-lg font-black text-emerald-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs text-white shadow-sm">SB</span>
              SportBook
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">
              La plateforme n°1 pour réserver vos terrains de sport. Football, tennis, basketball, padel — trouvez votre créneau.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Sports</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <span>Football</span>
              <span>Tennis</span>
              <span>Basketball</span>
              <span>Padel</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-2"><Mail size={14} /> contact@sportbook.fr</span>
              <span className="flex items-center gap-2"><Phone size={14} /> +33 6 XX XX XX XX</span>
              <span className="flex items-center gap-2"><MapPin size={14} /> Casablanca, Maroc</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SportBook. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
