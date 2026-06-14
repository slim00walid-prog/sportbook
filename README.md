# SportBook — Plateforme de Réservation de Terrains de Sport

Conforme au cahier des charges. Développé avec Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, Prisma ORM.

## Démarrage rapide

```bash
npm install
cp .env.example .env
# PostgreSQL doit tourner sur localhost:5432
npm run db:push
npm run db:seed
npm run dev
```

Application : http://localhost:3000

## Comptes de démonstration (seed)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | admin@sportbook.local | password123 |
| Gestionnaire | manager@sportbook.local | password123 |
| Utilisateur | user@sportbook.local | password123 |

L'administrateur est créé automatiquement par le seed. Il peut ensuite promouvoir des utilisateurs en gestionnaires ou administrateurs depuis le panneau d'administration.

## Navigation par rôle

- **Utilisateur** : Accueil → Terrains → Réservation → Dashboard (mes réservations)
- **Gestionnaire** : Accueil → Dashboard → Gestion du complexe (terrains, équipements)
- **Administrateur** : Accueil → Dashboard → Administration (utilisateurs, complexes, stats)

## Fonctionnalités

### Utilisateurs
- Inscription, connexion, déconnexion (JWT + cookie HttpOnly)
- Redirection automatique si déjà connecté
- Recherche de terrains (sport, ville, prix)
- Réservation d'un créneau avec contrôle de disponibilité
- Paiement simulé (mock)
- Dashboard : historique, statut, annulation
- Dépôt d'avis (5 étoiles + commentaire)

### Gestionnaires
- Dashboard dédié avec vue du complexe rattaché
- Liste des terrains avec équipements et horaires

### Administrateurs
- Dashboard avec statistiques globales (utilisateurs, complexes, revenus)
- Gestion des utilisateurs (changement de rôle, suppression)
- Vue des complexes avec managers assignés

## API REST

| Méthode | Route | Accès |
|---------|-------|-------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authentifié |
| GET | /api/me | Authentifié |
| GET | /api/terrains | Public |
| GET | /api/terrains/[id] | Public |
| POST | /api/terrains | MANAGER, ADMIN |
| PATCH | /api/terrains/[id] | MANAGER, ADMIN |
| DELETE | /api/terrains/[id] | MANAGER, ADMIN |
| GET | /api/reservations | Authentifié |
| POST | /api/reservations | USER |
| PATCH | /api/reservations/[id]/cancel | Authentifié |
| POST | /api/reviews | USER |
| GET | /api/admin/stats | ADMIN |
| GET | /api/admin/users | ADMIN |
| PATCH | /api/admin/users/[id] | ADMIN |
| DELETE | /api/admin/users/[id] | ADMIN |
| GET | /api/admin/complexes | ADMIN |
| POST | /api/admin/complexes | ADMIN |

## Architecture

- `prisma/schema.prisma` — Modèle de données
- `src/app/api/` — Routes API (App Router Next.js)
- `src/components/` — Composants React réutilisables
- `src/lib/` — Utilitaires (auth, prisma, http, time)
- `src/app/` — Pages (landing, login, register, terrains, dashboards)

## Stack technique

- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- JWT (jsonwebtoken + bcryptjs)
- Zod (validation)
- Lucide React (icônes)
