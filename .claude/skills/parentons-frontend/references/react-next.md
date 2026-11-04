# React 19 / Next.js 15 : bonnes pratiques

Adapté de `vercel-labs/agent-skills` → *react-best-practices* (MIT), réduit à ce qui compte pour une démo Next.js sans backend. Par ordre d'impact.

## 1. Server vs Client Components
- Pages et layouts restent des **Server Components** par défaut. `"use client"` uniquement sur la feuille qui a besoin d'état, d'effets, d'événements ou de localStorage.
- Pattern du projet : la page serveur récupère les données statiques et passe des props à un composant client (`activites/[id]/page.tsx` → `ActivityPlayer.tsx`). Le reproduire pour `/pro/patients/[id]`.
- Ne passer au client que les champs nécessaires, pas des objets entiers inutiles.
- Routes dynamiques : `params` est une `Promise` en Next 15 → `const { id } = await params`. Ajouter `generateStaticParams` pour les données fictives, `notFound()` si l'id est inconnu.

## 2. Taille du bundle
- Imports directs et nommés (`import { Bell } from "lucide-react"`) ; pas d'import global de lib.
- Composant lourd affiché tard (éditeur, graphique) → `next/dynamic`.
- Pas de nouvelle dépendance pour ce que 20 lignes ou une API native font (dates → `Intl`, id → `crypto.randomUUID()`).

## 3. Données côté client (localStorage)
- Toujours lire dans un `useEffect` avec une valeur initiale déterministe (seed) pour éviter l'erreur d'hydratation ; `try/catch` autour de `localStorage` (navigation privée). Modèle : `read`/`write` de `store.ts`.
- Un hook par concept (`useWeekFeedback`, `useProgramme`…), clés préfixées `parentons:`.
- Synchroniser entre onglets si utile avec l'événement `storage`.

## 4. Re-renders
- **Dériver** plutôt que stocker : un compteur « activités faites » se calcule depuis le feedback, pas dans un second `useState`.
- Pas de `useEffect` pour transformer des props en état ; calculer au rendu.
- `useCallback`/`useMemo` seulement quand une référence stable est réellement nécessaire (deps d'effet, enfants mémoïsés), pas par réflexe — React 19 + compilateur éventuel.
- Mises à jour fonctionnelles `setX(prev => …)` quand le nouvel état dépend de l'ancien.
- `key` stable (id), jamais l'index pour une liste réordonnable.

## 5. Rendu
- Pas de `Date.now()`, `new Date()` sans argument, `Math.random()` ni `window` pendant le rendu serveur → décalage d'hydratation. Les dates de démo sont fixes dans `data.ts`.
- Rendu conditionnel avec ternaire explicite si la condition peut valoir `0` (`{n > 0 && …}` et non `{n && …}`).
- SVG inline simple (comme `ProgressRing`) plutôt qu'une lib de graphiques pour 1 ou 2 visuels.

## 6. TypeScript
- Types de domaine dans `data.ts`, réutilisés partout (`Activity`, `Domain`, `Result`…). Unions littérales plutôt que `string`.
- `Record<Domain, …>` pour les correspondances exhaustives : TypeScript signale l'oubli quand on ajoute un domaine.
- Pas de `any` ; `as` seulement sur le résultat de `JSON.parse`.

## 7. Vérifier
- `npm run lint` et `npx tsc --noEmit`.
- `npm run build` avant une démo : attrape les erreurs Server/Client et les pages statiques cassées.
