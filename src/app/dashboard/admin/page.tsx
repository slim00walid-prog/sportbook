"use client";

import { useEffect, useState } from "react";
import { Shield, Users, Building2, TrendingUp, Grid3X3, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { ROLE_COLORS, SPORT_LABELS } from "@/lib/constants";

type AdminUser = { id: string; email: string; firstName: string; lastName: string; role: string; phone: string | null; createdAt: string };
type AdminComplex = { id: string; name: string; city: string; district: string; address: string; description: string | null; manager: { id: string; firstName: string; lastName: string; email: string } | null; terrains: { id: string; name: string; sportType: string }[] };
type AdminTerrain = { id: string; name: string; sportType: string; pricePerHourCents: number; openTime: string; closeTime: string; equipment: string[]; complex: { id: string; name: string; city: string } };
type Stats = { users: number; complexes: number; terrains: number; reservations: number; revenue: number };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [complexes, setComplexes] = useState<AdminComplex[]>([]);
  const [terrains, setTerrains] = useState<AdminTerrain[]>([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  const [showNewComplex, setShowNewComplex] = useState(false);
  const [newComplex, setNewComplex] = useState({ name: "", city: "", district: "", address: "", description: "", managerId: "" });

  const [editingComplex, setEditingComplex] = useState<string | null>(null);
  const [editComplex, setEditComplex] = useState({ name: "", city: "", district: "", address: "", description: "", managerId: "" });

  const [showNewTerrain, setShowNewTerrain] = useState(false);
  const [newTerrain, setNewTerrain] = useState({ complexId: "", name: "", sportType: "FOOTBALL", pricePerHourCents: 2000, openTime: "08:00", closeTime: "22:00", equipment: "" });

  const [editingTerrain, setEditingTerrain] = useState<string | null>(null);
  const [editTerrain, setEditTerrain] = useState({ name: "", sportType: "FOOTBALL", pricePerHourCents: 2000, openTime: "08:00", closeTime: "22:00", equipment: "" });

  function loadAll() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stats", { cache: "no-store" }).then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/users", { cache: "no-store" }).then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/complexes", { cache: "no-store" }).then((r) => r.ok ? r.json() : null),
      fetch("/api/terrains", { cache: "no-store" }).then((r) => r.ok ? r.json() : null),
    ]).then(([statsData, usersData, complexData, terrainsData]) => {
      if (statsData) setStats(statsData.stats);
      if (usersData) setUsers(usersData.users);
      if (complexData) setComplexes(complexData.complexes);
      if (terrainsData) setTerrains(terrainsData.terrains ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  async function updateUserRole(userId: string, newRole: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) { alert("Erreur"); return; }
    const data = await res.json();
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: data.user.role } : u));
  }

  async function deleteUser(userId: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error ?? "Erreur"); return; }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  async function createComplex() {
    if (!newComplex.name || !newComplex.city) { alert("Nom et ville requis"); return; }
    const res = await fetch("/api/admin/complexes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newComplex, managerId: newComplex.managerId || undefined }),
    });
    if (!res.ok) { alert("Erreur création"); return; }
    setShowNewComplex(false);
    setNewComplex({ name: "", city: "", district: "", address: "", description: "", managerId: "" });
    loadAll();
  }

  async function createTerrain() {
    if (!newTerrain.complexId || !newTerrain.name) { alert("Complexe et nom requis"); return; }
    const res = await fetch("/api/terrains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTerrain, equipment: newTerrain.equipment ? newTerrain.equipment.split(",").map((s) => s.trim()).filter(Boolean) : [] }),
    });
    if (!res.ok) { alert("Erreur création"); return; }
    setShowNewTerrain(false);
    setNewTerrain({ complexId: "", name: "", sportType: "FOOTBALL", pricePerHourCents: 2000, openTime: "08:00", closeTime: "22:00", equipment: "" });
    loadAll();
  }

  async function saveTerrain(id: string) {
    const res = await fetch(`/api/terrains/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editTerrain, equipment: editTerrain.equipment ? editTerrain.equipment.split(",").map((s) => s.trim()).filter(Boolean) : [] }),
    });
    if (!res.ok) { alert("Erreur modification"); return; }
    setEditingTerrain(null);
    loadAll();
  }

  async function deleteTerrain(id: string) {
    if (!confirm("Supprimer ce terrain ?")) return;
    const res = await fetch(`/api/terrains/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Erreur suppression"); return; }
    loadAll();
  }

  async function updateComplex(id: string) {
    if (!editComplex.name || !editComplex.city) { alert("Nom et ville requis"); return; }
    const res = await fetch(`/api/admin/complexes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editComplex, managerId: editComplex.managerId || null }),
    });
    if (!res.ok) { alert("Erreur modification"); return; }
    setEditingComplex(null);
    loadAll();
  }

  async function deleteComplex(id: string) {
    if (!confirm("Supprimer ce complexe et tous ses terrains ?")) return;
    const res = await fetch(`/api/admin/complexes/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error ?? "Erreur"); return; }
    loadAll();
  }

  function startEditComplex(c: AdminComplex) {
    setEditingComplex(c.id);
    setEditComplex({
      name: c.name,
      city: c.city,
      district: c.district,
      address: c.address ?? "",
      description: c.description ?? "",
      managerId: c.manager?.id ?? "",
    });
  }

  function startEdit(t: AdminTerrain) {
    setEditingTerrain(t.id);
    setEditTerrain({
      name: t.name,
      sportType: t.sportType,
      pricePerHourCents: t.pricePerHourCents,
      openTime: t.openTime,
      closeTime: t.closeTime,
      equipment: t.equipment.join(", "),
    });
  }

  if (loading) {
    return (<main className="mx-auto max-w-6xl px-4 py-12"><div className="animate-pulse space-y-4"><div className="h-8 w-56 rounded-lg bg-slate-200" /><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map((i) => <div key={i} className="h-28 rounded-2xl bg-slate-100" />)}</div></div></main>);
  }

  const defaultStats: Stats = stats ?? { users: 0, complexes: 0, terrains: 0, reservations: 0, revenue: 0 };
  const statCards = [
    { icon: Users, label: "Utilisateurs", value: defaultStats.users, color: "bg-blue-100 text-blue-700" },
    { icon: Building2, label: "Complexes", value: defaultStats.complexes, color: "bg-emerald-100 text-emerald-700" },
    { icon: Grid3X3, label: "Terrains", value: defaultStats.terrains, color: "bg-amber-100 text-amber-700" },
    { icon: TrendingUp, label: "Revenus", value: `${(defaultStats.revenue / 100).toFixed(2)} EUR`, color: "bg-purple-100 text-purple-700" },
  ];

  const tabs = [
    { id: "stats", label: "Statistiques", icon: TrendingUp },
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "complexes", label: "Complexes", icon: Building2 },
    { id: "terrains", label: "Terrains", icon: Grid3X3 },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Administration</h1>
          <p className="text-sm text-slate-600">Gestion complète de la plateforme SportBook.</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {activeTab === "stats" && (
        <div className="grid gap-4 md:grid-cols-4">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={20} /></div>
              <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
              <p className="text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "users" && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><p className="font-semibold text-slate-900 text-sm">{user.firstName} {user.lastName}</p></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <select value={user.role} onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border-0 cursor-pointer outline-none ${ROLE_COLORS[user.role]}`}>
                        <option value="USER">Utilisateur</option>
                        <option value="MANAGER">Gestionnaire</option>
                        <option value="ADMIN">Administrateur</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteUser(user.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "complexes" && (
        <div className="space-y-4">
          <button onClick={() => setShowNewComplex(!showNewComplex)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
            <Plus size={16} /> Nouveau complexe
          </button>

          {showNewComplex && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input value={newComplex.name} onChange={(e) => setNewComplex({...newComplex, name: e.target.value})} placeholder="Nom du complexe" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newComplex.city} onChange={(e) => setNewComplex({...newComplex, city: e.target.value})} placeholder="Ville" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newComplex.district} onChange={(e) => setNewComplex({...newComplex, district: e.target.value})} placeholder="Quartier" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newComplex.address} onChange={(e) => setNewComplex({...newComplex, address: e.target.value})} placeholder="Adresse" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newComplex.description} onChange={(e) => setNewComplex({...newComplex, description: e.target.value})} placeholder="Description (optionnel)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
                <select value={newComplex.managerId} onChange={(e) => setNewComplex({...newComplex, managerId: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  <option value="">Aucun manager</option>
                  {users.filter((u) => u.role === "MANAGER").map((u) => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={createComplex} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"><Save size={16} className="inline mr-1" />Créer</button>
                <button onClick={() => setShowNewComplex(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"><X size={16} className="inline mr-1" />Annuler</button>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {complexes.map((c) =>
              editingComplex === c.id ? (
                <div key={c.id} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3 md:col-span-2">
                  <p className="text-sm font-bold text-emerald-800">Modifier : {c.name}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={editComplex.name} onChange={(e) => setEditComplex({...editComplex, name: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    <input value={editComplex.city} onChange={(e) => setEditComplex({...editComplex, city: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    <input value={editComplex.district} onChange={(e) => setEditComplex({...editComplex, district: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    <input value={editComplex.address} onChange={(e) => setEditComplex({...editComplex, address: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                    <input value={editComplex.description} onChange={(e) => setEditComplex({...editComplex, description: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
                    <select value={editComplex.managerId} onChange={(e) => setEditComplex({...editComplex, managerId: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                      <option value="">Aucun manager</option>
                      {users.filter((u) => u.role === "MANAGER").map((u) => (
                        <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateComplex(c.id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"><Save size={16} className="inline mr-1" />Enregistrer</button>
                    <button onClick={() => setEditingComplex(null)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><X size={16} className="inline mr-1" />Annuler</button>
                  </div>
                </div>
              ) : (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Building2 size={20} /></div>
                      <div><h3 className="font-bold text-slate-900">{c.name}</h3><p className="text-sm text-slate-500">{c.city} — {c.district}</p></div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => startEditComplex(c)} className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => deleteComplex(c.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  {c.manager ? <p className="mt-2 text-sm text-slate-600">Manager : {c.manager.firstName} {c.manager.lastName}</p> : <p className="mt-2 text-sm text-amber-600">Aucun manager assigné</p>}
                  <p className="text-sm text-slate-500 mt-1">{c.terrains.length} terrain{c.terrains.length > 1 ? "s" : ""}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.terrains.map((t) => (<span key={t.id} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{t.name}</span>))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {activeTab === "terrains" && (
        <div className="space-y-4">
          <button onClick={() => setShowNewTerrain(!showNewTerrain)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">
            <Plus size={16} /> Nouveau terrain
          </button>

          {showNewTerrain && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <select value={newTerrain.complexId} onChange={(e) => setNewTerrain({...newTerrain, complexId: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  <option value="">Sélectionner un complexe</option>
                  {complexes.map((c) => (<option key={c.id} value={c.id}>{c.name} — {c.city}</option>))}
                </select>
                <input value={newTerrain.name} onChange={(e) => setNewTerrain({...newTerrain, name: e.target.value})} placeholder="Nom du terrain" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <select value={newTerrain.sportType} onChange={(e) => setNewTerrain({...newTerrain, sportType: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500">
                  {Object.entries(SPORT_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                </select>
                <input value={newTerrain.pricePerHourCents} onChange={(e) => setNewTerrain({...newTerrain, pricePerHourCents: Number(e.target.value)})} type="number" placeholder="Prix (en centimes)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newTerrain.openTime} onChange={(e) => setNewTerrain({...newTerrain, openTime: e.target.value})} placeholder="Ouverture (HH:MM)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newTerrain.closeTime} onChange={(e) => setNewTerrain({...newTerrain, closeTime: e.target.value})} placeholder="Fermeture (HH:MM)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
                <input value={newTerrain.equipment} onChange={(e) => setNewTerrain({...newTerrain, equipment: e.target.value})} placeholder="Équipements (séparés par des virgules)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
              </div>
              <div className="flex gap-2">
                <button onClick={createTerrain} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"><Save size={16} className="inline mr-1" />Créer</button>
                <button onClick={() => setShowNewTerrain(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"><X size={16} className="inline mr-1" />Annuler</button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sport</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Complexe</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Prix/h</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Horaires</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {terrains.map((t) => (
                    editingTerrain === t.id ? (
                      <tr key={t.id} className="bg-emerald-50">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="grid gap-3 md:grid-cols-3">
                            <input value={editTerrain.name} onChange={(e) => setEditTerrain({...editTerrain, name: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none" />
                            <select value={editTerrain.sportType} onChange={(e) => setEditTerrain({...editTerrain, sportType: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none">
                              {Object.entries(SPORT_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                            </select>
                            <input value={editTerrain.pricePerHourCents} onChange={(e) => setEditTerrain({...editTerrain, pricePerHourCents: Number(e.target.value)})} type="number" className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none" />
                            <input value={editTerrain.openTime} onChange={(e) => setEditTerrain({...editTerrain, openTime: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none" />
                            <input value={editTerrain.closeTime} onChange={(e) => setEditTerrain({...editTerrain, closeTime: e.target.value})} className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none" />
                            <input value={editTerrain.equipment} onChange={(e) => setEditTerrain({...editTerrain, equipment: e.target.value})} placeholder="Équipements (virgules)" className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm outline-none" />
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => saveTerrain(t.id)} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"><Save size={14} className="inline mr-1" />Enregistrer</button>
                            <button onClick={() => setEditingTerrain(null)} className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"><X size={14} className="inline mr-1" />Annuler</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900 text-sm">{t.name}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{SPORT_LABELS[t.sportType] ?? t.sportType}</span></td>
                        <td className="px-4 py-3 text-sm text-slate-600">{t.complex.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{(t.pricePerHourCents / 100).toFixed(2)} EUR</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{t.openTime} — {t.closeTime}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => startEdit(t)} className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold mr-3"><Pencil size={14} className="inline mr-0.5" />Modifier</button>
                          <button onClick={() => deleteTerrain(t.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold"><Trash2 size={14} className="inline mr-0.5" />Suppr.</button>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
