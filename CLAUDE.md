@AGENTS.md

# CLAUDE.md — Le Bruit & L'Odeur

## Projet
App web communautaire pour le média urbain rap **Le Bruit & L'Odeur** (B&O'Z Group).
Deux jeux :
- **Top de la semaine** — vote hebdo sur 4–8 sorties musicales (reveal podium dimanche 23h59)
- **Hot Take** — vote opinion binaire FIRE/FROID sur une affirmation culture urbaine

Pas de compte utilisateur : pseudo libre saisi une fois, stocké en localStorage. Un seul vote par Top / par Hot Take.
Backoffice admin (NextAuth) pour créer les jeux, rédiger les Hot Takes et designer des stories (éditeur canvas type Canva).

## Stack (versions installées)
- **Next.js 16.2.4** App Router (Turbopack) + **React 19** + **TypeScript strict** (pas de `any`)
  - ⚠ `params` et `searchParams` sont des `Promise` — toujours `await`
  - Types globaux `PageProps<'/x/[y]'>` et `RouteContext<'/x/[y]'>` (pas d'import)
- **Tailwind CSS v4** via `@theme inline` dans `globals.css` — pas de librairies UI tierces
- **Prisma 6 + PostgreSQL** (Supabase), **Supabase Realtime** pour votes live (Phase 2)
- **Supabase Storage** pour pochettes / fonds stories
- **Framer Motion** (à installer en Phase 1) pour les animations
- **Zustand 5** — pseudo store `src/lib/pseudo-store.ts` avec persist localStorage
- **Fabric.js** (Phase 4) pour canvas stories, **html2canvas** pour export PNG
- **NextAuth 5 beta** (admin uniquement, session JWT) — handler `src/app/api/auth/[...nextauth]/route.ts`, config `src/lib/auth.ts`
- Déploiement : **Vercel**

## Design System
- **Fonts** : Kabel (display) + Capitana (corps). **Placeholders actuels** : `Archivo_Black` + `Inter` via `next/font/google` dans `src/app/layout.tsx`. Dès que `public/fonts/Kabel-Bold.woff2` + `Capitana-Regular.woff2` sont présents, remplacer par `next/font/local` en conservant les variables `--font-kabel` et `--font-capitana`.
- **Tokens Tailwind v4** (déclarés dans `globals.css` via `@theme inline`) :
  - `bg-brand-red text-brand-red` → `#E52321` (principale, CTA, accents)
  - `bg-brand-black text-brand-black` → `#0A0A0A`
  - `bg-brand-white text-brand-white` → `#FFFFFF`
  - `bg-brand-stone text-brand-stone` → `#D4D0C8`
  - `bg-brand-blue text-brand-blue` → `#2088FF`
  - `font-display` (Kabel) / `font-sans` (Capitana)
  - `ease-[var(--ease-sharp)]` pour les transitions
- **Style** : brutalisme éditorial, compositions asymétriques, typo oversized, contrastes forts noir/rouge/blanc
- **Mobile-first** — l'expérience jeu est pensée pour le pouce, plein écran
- **Border-radius** > 4px interdit sauf exception justifiée (reset global à 0 dans globals.css)
- **Animations** : 200–400ms, easing sharp — jamais de lenteur molle

## Conventions de code
- Composants : PascalCase, un composant par fichier
- API routes : toujours valider les inputs avec **Zod**
- Pas de commentaires évidents — commenter uniquement la logique complexe (le *pourquoi*)
- Nommage : **français** pour contenu / copy utilisateur, **anglais** pour le code

## Contexte métier
- Une "sortie" = son / album / clip rap, avec pochette + lien embed YouTube ou Spotify
- Un "Hot Take" = une phrase affirmation tranchée sur la culture urbaine
- Les votes sont **publics** (pas d'anonymat) — le pseudo est toujours affiché
- Un utilisateur ne vote qu'**une fois** par Top et **une fois** par Hot Take
- Badges : *Voix de la rue* (3 Hot Takes consécutifs), *Jury de la semaine* (4 semaines de vote), *Pionnier* (100 premiers votants sur un Top)

## Structure actuelle (Phase 0 en place)
```
src/app/
  (public)/          # route group — page, top-semaine, hot-take, pseudo/[slug], */archives
  admin/             # URL-visible — dashboard, top-semaine, hot-take, stories (layout protégé par auth())
  login/             # hors admin/ pour éviter la boucle de redirect
  api/
    auth/[...nextauth]/route.ts
    votes/route.ts
    hot-takes/vote/route.ts
  layout.tsx globals.css
src/components/
  games/             # TopSemaine/SortieCard, HotTake/HotTakeCard
  ui/                # Button, Card, Countdown, PseudoInput
  layout/            # Header, Footer
src/lib/             # db.ts, auth.ts, utils.ts, pseudo-store.ts
prisma/schema.prisma
public/fonts/        # à remplir avec Kabel-Bold.woff2 + Capitana-Regular.woff2
```

## Règles importantes
- **Route groups (`(name)`) ne consomment pas d'URL** — donc `(admin)/top-semaine` et `(public)/top-semaine` collisent. L'admin a été mis sous `/admin/*` réel pour cette raison.
- Avant d'écrire du code Next.js, consulter le doc pertinent dans `node_modules/next/dist/docs/` (les APIs 16 diffèrent beaucoup de 14).
- Avant d'utiliser Prisma, rappeler qu'on est en **v6** (en v7 le `url` dans `datasource` a été supprimé).
