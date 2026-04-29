# 🔴 LE BRUIT & L'ODEUR — Web App Officielle
### Brief Technique & Product — B&O'Z GROUP

---

## 🎯 Vision du projet

Créer une **plateforme web communautaire** pour le média urbain **Le Bruit & L'Odeur**, pensée comme une extension digitale de l'identité Instagram du média. L'objectif est de générer de l'**engagement hebdomadaire récurrent** autour de la culture rap/urbaine — sans friction côté utilisateur (zéro compte, juste un pseudo).

Deux expériences, bien faites, plutôt que dix bâclées.

---

## 🧩 Les deux jeux

---

### 🏆 TOP DE LA SEMAINE

> *"Quelle est la meilleure sortie de la semaine ?"*

Le rendez-vous éditorial hebdomadaire du média. Chaque lundi, les admins publient une sélection de 4 à 8 sorties (sons, albums, clips). Les utilisateurs votent pour leur favori jusqu'au dimanche soir. Le résultat est révélé de façon spectaculaire — podium animé, confettis, partage automatique au format story.

#### Mécanique détaillée
- **Saisie pseudo** — au premier vote, l'utilisateur choisit un pseudo (stocké en localStorage). Il vote une seule fois par semaine.
- **Cards de sorties** — chaque sortie = une card avec pochette, nom de l'artiste, titre du son, catégorie (couleur DA). Tap pour écouter un extrait (embed YouTube/Spotify), tap long ou bouton pour voter.
- **Vote en temps réel** — les pourcentages se mettent à jour en live (Supabase Realtime). La card en tête se détache visuellement (scale, glow rouge).
- **Countdown** — timer visuel qui décompte jusqu'à la clôture du vote dimanche 23h59.
- **Reveal du résultat** — animation de podium (1er, 2e, 3e) déclenchée automatiquement à la clôture. Génération d'une image story partageable (html2canvas) avec le gagnant dans la DA du média.
- **Historique** — archive des tops précédents consultable, avec le gagnant et les scores finaux.

#### Interface
- Fond sombre texturé, cards en plein écran sur mobile (swipe horizontal)
- Couleur dominante = rouge `#E52321`, pulsation sur la card en tête
- Chiffres de votes en très grand, typographie Kabel massive
- Leaderboard pseudo — classement des votants les plus réguliers sur les semaines passées

---

### 🔥 HOT TAKE

> *"T'es d'accord ou pas ?"*

Le format opinion instantané. Les admins publient une affirmation tranchée sur la culture rap/urbaine. Les utilisateurs votent **FIRE** (d'accord) ou **FROID** (pas d'accord) et voient immédiatement comment la communauté se positionne. Renouvelé 2 à 3 fois par semaine pour maintenir le rythme.

#### Mécanique détaillée
- **Format ultra-simple** — une phrase, deux boutons, un résultat. Le vote prend 3 secondes.
- **Pseudo** — même système que Top de la semaine (partagé entre les deux jeux). Un seul vote par Hot Take par pseudo.
- **Révélation dramatique** — après le vote, la répartition s'affiche avec une animation de "split" (la card se divise en deux camps, proportionnelle aux votes). Si > 80% d'un côté : mention "C'EST UNANIME 🔥".
- **Jauge de tension** — barre centrale qui penche du côté majoritaire en temps réel.
- **Archivage** — les Hot Takes passés sont consultables avec leur score final (ex: "73% FIRE").
- **Streak** — si un utilisateur vote sur 3 Hot Takes consécutifs dans la semaine, il reçoit un badge "Voix de la rue".

#### Interface
- Card immersive plein écran, photo ou visuel de fond (uploadé par l'admin)
- Bouton FIRE — rouge `#E52321`, gros, à gauche — bouton FROID — blanc/gris, à droite
- Animation post-vote : vibration/shake + split visuel de la card
- Typographie de l'affirmation : Kabel, très grande, blanche sur fond sombre

---

## 🔗 Ce qui lie les deux jeux : le système de pseudo & fidélisation

Pas de compte, mais une **identité persistante légère** :

- Le pseudo est saisi une fois, stocké en localStorage
- Il apparaît dans les leaderboards des deux jeux
- Un **profil public minimaliste** est accessible via `/pseudo/[nom]` — il affiche l'historique des votes publics et les badges obtenus
- Badges débloquables : *Voix de la rue* (3 Hot Takes de suite), *Jury de la semaine* (voter chaque semaine pendant 4 semaines), *Pionnier* (100 premiers votants sur un Top)

---

## 📲 Éditeur de Stories (Backoffice)

Interface type **Canva** dans le backoffice pour créer des visuels format story (9:16) — utilisés pour annoncer les jeux, révéler les résultats, ou poster du contenu éditorial.

### Fonctionnalités de l'éditeur

| Feature | Détail |
|---|---|
| **Canvas drag & drop** | Blocs repositionnables librement (texte, image, forme, sticker) |
| **Image de fond** | Upload direct ou bibliothèque média interne |
| **Typographie** | Kabel / Capitana / polices custom, taille, couleur, alignement |
| **Formes & overlays** | Rectangles colorés, dégradés, cadres, transparences |
| **Calques** | Panneau latéral pour gérer l'ordre z-index des éléments |
| **Templates** | Bibliothèque de templates pré-DA (annonce Top, révélation résultat, Hot Take…) |
| **Preview mobile** | Aperçu temps réel du rendu 9:16 sur un cadre smartphone |
| **Export PNG** | Export haute résolution en un clic (html2canvas / dom-to-image) |

> **Stack éditeur** : Fabric.js pour le canvas (drag & drop, resize, rotation natifs, export PNG en une ligne). Panneaux UI maison en React/Tailwind.

---

## 🛠️ Backoffice Admin

- **Dashboard** : votes cette semaine, pseudos uniques, Hot Take le plus engagé
- **Top de la semaine** : créer / éditer / clôturer un vote, ajouter les sorties (titre, artiste, pochette, lien embed)
- **Hot Takes** : rédiger l'affirmation, choisir le visuel de fond, programmer la publication
- **Éditeur stories** : créer et exporter des visuels DA
- **Archives** : consulter tous les résultats passés
- **Auth** : NextAuth.js (email + mot de passe), session JWT

---

## 🎨 Design & Direction Artistique

### Palette
| Usage | Hex |
|---|---|
| Rouge — couleur principale, CTA, accents | `#E52321` |
| Noir — fonds, textes | `#0A0A0A` |
| Blanc — textes sur fond sombre | `#FFFFFF` |
| Gris stone — fond secondaire, backgrounds | `#D4D0C8` |
| Bleu — catégorie sport (accent ponctuel) | `#2088FF` |

### Style
- **Typographie** : Kabel (display, titres massifs) + Capitana (corps, labels)
- **Esthétique** : brutalisme éditorial — compositions asymétriques, typographie oversized, contrastes forts noir/rouge/blanc
- **Animations** : rapides et punchées (200–400ms), Framer Motion
- **Mobile-first** — l'expérience jeu est pensée pour le pouce, plein écran

---

## ⚙️ Stack Technique

### Frontend
| Techno | Rôle |
|---|---|
| **Next.js 14+** App Router | Framework principal (SSR, routing, performance) |
| **TypeScript** | Typage strict |
| **Tailwind CSS v4** | Styling utility-first |
| **Framer Motion** | Animations, gestures, transitions |
| **Zustand** | State global (pseudo, votes en cours) |
| **Fabric.js** | Canvas éditeur stories |
| **html2canvas** | Export image partageable |

### Backend & Infra
| Techno | Rôle |
|---|---|
| **Next.js API Routes** | API REST |
| **Prisma ORM** | Accès DB type-safe |
| **PostgreSQL** via Supabase | Base de données + Realtime (votes live) |
| **Supabase Storage** | Upload pochettes, fonds stories |
| **NextAuth.js** | Auth admin uniquement |
| **Vercel** | Hébergement (DX optimale Next.js) |

---

## 📁 Structure du projet

```
bruit-odeur-web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                  # Homepage — jeux en cours
│   │   ├── top-semaine/
│   │   │   ├── page.tsx              # Vote en cours
│   │   │   └── archives/page.tsx     # Historique des tops
│   │   ├── hot-take/
│   │   │   ├── page.tsx              # Hot Take actif
│   │   │   └── archives/page.tsx
│   │   └── pseudo/[slug]/page.tsx    # Profil public du votant
│   ├── (admin)/
│   │   ├── dashboard/page.tsx
│   │   ├── top-semaine/              # CRUD votes
│   │   ├── hot-take/                 # CRUD hot takes
│   │   └── stories/page.tsx          # Éditeur canvas
│   └── api/
│       ├── votes/route.ts
│       ├── hot-takes/route.ts
│       └── stories/route.ts
├── components/
│   ├── games/
│   │   ├── TopSemaine/               # Cards sorties, timer, reveal
│   │   └── HotTake/                  # Card affirmation, split reveal
│   ├── editor/                       # Éditeur stories Fabric.js
│   ├── ui/                           # Boutons, badges, leaderboard
│   └── layout/
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/schema.prisma
├── public/fonts/                     # Kabel, Capitana
├── CLAUDE.md                         # ← Brief permanent IA
└── README.md
```

---

## 📅 Roadmap

| Phase | Contenu | Durée |
|---|---|---|
| **0 — Setup** | Init projet, DB schema, auth admin, design system (fonts, CSS vars, composants de base) | 3–4 jours |
| **1 — Hot Take** | Card vote, split reveal, pseudo localStorage, API vote, archives | 1 semaine |
| **2 — Top de la semaine** | Cards sorties, vote live (Supabase Realtime), countdown, podium reveal, partage story | 1–2 semaines |
| **3 — Fidélisation** | Leaderboard, badges, profil public pseudo | 1 semaine |
| **4 — Éditeur stories** | Canvas Fabric.js, drag & drop, templates DA, export PNG | 2 semaines |
| **5 — Polish** | Animations Framer Motion, mobile tuning, PWA basique | 1 semaine |

---

*Brief réalisé pour B&O'Z GROUP — Le Bruit & L'Odeur © 2025-2026*
