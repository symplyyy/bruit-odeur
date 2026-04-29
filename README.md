# Le Bruit & L'Odeur — Web App

Plateforme web communautaire pour le média urbain rap **Le Bruit & L'Odeur** (B&O'Z Group). Deux jeux sans friction (zéro compte, juste un pseudo) pour générer de l'engagement hebdomadaire.

> **Vision** : deux expériences, bien faites, plutôt que dix bâclées.

---

## Les deux jeux

### Top de la semaine
Vote hebdomadaire sur 4 à 8 sorties musicales sélectionnées par la rédaction. Mise à jour des scores en temps réel (Supabase Realtime), countdown jusqu'au dimanche 23h59, reveal podium animé avec génération d'image story partageable.

### Hot Take
Vote opinion binaire **FIRE** / **FROID** sur une affirmation tranchée. Renouvelé 2–3× par semaine. Animation de split post-vote, jauge de tension en temps réel, mention "C'EST UNANIME" si > 80%.

Les deux jeux partagent un **système de pseudo persistant** (localStorage) avec profil public `/pseudo/[slug]`, leaderboards et badges de fidélisation.

---

## Stack

**Frontend** — Next.js App Router, TypeScript strict, Tailwind CSS v4, Framer Motion, Zustand, Fabric.js, html2canvas
**Backend** — Next.js API Routes, Prisma ORM, PostgreSQL (Supabase), Supabase Realtime + Storage, NextAuth.js
**Infra** — Vercel

---

## Getting started

```bash
# install
npm install

# variables d'environnement
cp .env.example .env.local   # renseigner DATABASE_URL, NEXTAUTH_SECRET, SUPABASE_*

# base de données
npx prisma migrate dev

# dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Structure

```
app/
  (public)/          # pages publiques (home, top-semaine, hot-take, pseudo/[slug])
  (admin)/           # backoffice (dashboard, CRUD jeux, éditeur stories)
  api/               # routes API (votes, hot-takes, stories)
components/
  games/             # TopSemaine/, HotTake/
  editor/            # Éditeur canvas Fabric.js
  ui/ layout/
lib/                 # db.ts, auth.ts, utils.ts
prisma/schema.prisma
public/fonts/        # Kabel, Capitana
CLAUDE.md            # contexte permanent pour Claude Code
```

---

## Backoffice admin

Interface sécurisée (NextAuth) offrant :

- **Dashboard** — votes de la semaine, pseudos uniques, Hot Take le plus engagé
- **CRUD Top de la semaine** — créer / éditer / clôturer un vote, ajouter sorties (titre, artiste, pochette, embed)
- **CRUD Hot Takes** — rédiger l'affirmation, choisir le visuel de fond, programmer
- **Éditeur stories** — canvas drag & drop type Canva (Fabric.js) avec templates DA, export PNG 9:16
- **Archives** — consultation de tous les résultats passés

---

## Design system

| Usage | Hex |
|---|---|
| Rouge — principale, CTA, accents | `#E52321` |
| Noir — fonds, textes | `#0A0A0A` |
| Blanc — textes sur fond sombre | `#FFFFFF` |
| Gris stone — fond secondaire | `#D4D0C8` |
| Bleu — catégorie sport | `#2088FF` |

**Typo** : Kabel (display) + Capitana (corps). **Style** : brutalisme éditorial, typo oversized, contrastes forts, mobile-first. **Animations** : 200–400ms, easing sharp.

---

## Roadmap

| Phase | Contenu | Durée |
|---|---|---|
| 0 — Setup | Init, DB schema, auth admin, design system | 3–4 j |
| 1 — Hot Take | Vote, split reveal, pseudo localStorage, archives | 1 sem |
| 2 — Top de la semaine | Vote live (Realtime), countdown, podium, partage story | 1–2 sem |
| 3 — Fidélisation | Leaderboard, badges, profil public pseudo | 1 sem |
| 4 — Éditeur stories | Canvas Fabric.js, templates, export PNG | 2 sem |
| 5 — Polish | Animations, mobile tuning, PWA | 1 sem |

---

## Documentation

- [CLAUDE.md](CLAUDE.md) — contexte projet condensé pour Claude Code (chargé automatiquement à chaque session, évite de réexpliquer la stack et les conventions)
- [AGENTS.md](AGENTS.md) — instructions transverses IA / outillage

---

*© 2025-2026 B&O'Z GROUP — Le Bruit & L'Odeur*



juste pour le front coté utilisateur j'aimerai que tu t'inspire de la maquette image (3).png en rendant le site ultea beau et ergonomique et pour le panel admin, fais un dashboard ultra ergonomique. Aussi explique moi mtn les étapes à faire concrètement

