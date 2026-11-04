---
name: parentons-frontend
description: Construire ou modifier l'interface du site Parentons (Next.js 15 App Router, React 19, Tailwind 4, lucide-react) en respectant sa charte sauge/miel, ses composants et ses règles d'accessibilité et de perf. À utiliser dès qu'on crée ou retouche une page, un composant, un formulaire, une nav, un état vide ou une mise en page dans parentons/ — espace parent (/app), tunnel (/inscription), espace orthophoniste (/pro) ou landing — même si la demande ne dit pas « design » ou « frontend ».
---

# Frontend Parentons

Parentons aide des parents à faire des activités d'orthophonie à la maison avec leur enfant, et donne aux orthophonistes un espace pour suivre ces patients. Les utilisateurs sont des parents fatigués sur mobile le soir, et des orthophonistes entre deux séances sur desktop. L'interface doit donc rassurer, aller droit au but et ne jamais culpabiliser.

C'est une **démo** de projet entrepreneuriat : pas de backend. Les données fictives vivent dans `src/lib/data.ts`, l'état modifiable dans `src/lib/store.ts` (localStorage). Garder ce modèle : ne pas ajouter d'API, d'ORM ni de lib d'état sans qu'on le demande.

Inspiré de trois skills publics, adaptés au projet :
- `anthropics/skills` → *frontend-design* (direction visuelle, retenue, écriture)
- `vercel-labs/web-interface-guidelines` → règles d'interface (voir `references/interface.md`)
- `vercel-labs/agent-skills` → *react-best-practices* (voir `references/react-next.md`)

## Avant d'écrire du code

1. **Lire l'existant proche.** Ouvrir la page sœur la plus ressemblante (ex. `src/app/app/page.tsx` pour un tableau de bord, `src/app/inscription/*` pour un formulaire) et `src/components/ui.tsx`. Réutiliser plutôt que réinventer : la cohérence entre pages compte plus que l'originalité d'une page.
2. **Nommer le travail principal de l'écran** en une phrase (« voir quel patient a besoin d'attention », « faire l'activité du jour »). Cet élément est en haut et le plus visible ; le reste est discret. C'est le principe « dépenser son audace à un seul endroit ».
3. **Lister les états** : chargement (si besoin), vide, normal, beaucoup de contenu, erreur. Un écran sans état vide pensé est un écran à moitié fini.

## Charte (ne pas dériver)

Les tokens sont dans `src/app/globals.css` et exposés à Tailwind via `@theme inline`. Utiliser **uniquement** ces classes de couleur — jamais d'hex en dur ni de couleurs Tailwind par défaut (`gray-500`, `green-600`…), sinon le mode sombre casse.

| Rôle | Classes |
|---|---|
| Fond / surface / texte | `bg-bg`, `bg-surface`, `text-ink`, `text-muted`, `border-line` |
| Action principale, succès, actif | `sage` (`bg-sage text-on-sage`, `bg-sage-soft text-sage`) |
| Chaleur, mise en avant, progrès | `honey` (`bg-honey-soft text-honey-ink`) |
| Difficulté, destructif | `brick` (`bg-brick-soft text-brick`) — avec parcimonie, jamais pour « échec de l'enfant » |

- **Typo** : Nunito (`font-display`, 700–800) pour titres et chiffres clés, Inter pour le texte. Pas de troisième police.
- **Classes utilitaires maison** : `.btn .btn-primary | .btn-honey | .btn-ghost`, `.card`, `.field`, `.animate-pop`. Les utiliser avant d'empiler des classes Tailwind équivalentes.
- **Composants partagés** (`ui.tsx`) : `Logo`, `PageHeader`, `ValidatedBadge`, `DomainIcon`, `Duration`, `ResultPill`, `ProgressRing`, `ActivityRow`. Si un motif apparaît sur 2 pages ou plus, l'extraire ici.
- **Icônes** : `lucide-react`, `h-4 w-4` / `h-5 w-5`, toujours `aria-hidden` si décoratives. Emojis seulement pour les domaines (déjà dans `DomainIcon`).
- **Formes** : coins très arrondis (`rounded-xl`/`rounded-2xl`, cards 1.25rem, boutons pilule). Bordures fines `border-line`, peu d'ombres.
- **Layout** : conteneur `mx-auto max-w-4xl` dans les espaces connectés, `max-w-6xl` sur la landing ; gouttière `px-4 sm:px-6`. Sidebar `md:` + bottom nav mobile (voir `AppNav.tsx`) ; prévoir `pb-28` en mobile pour ne pas passer sous la nav.

### Espace orthophoniste (`/pro`)

Même charte, ton plus dense et professionnel : plus d'information par écran (tableaux, listes compactes), moins d'illustrations, vocabulaire clinique sobre (« patient », « programme », « retour du parent »). Nav propre (`ProNav.tsx`) calquée sur `AppNav.tsx`. Les alertes utilisent `honey` (à surveiller) avant `brick` (à traiter).

## Écriture (le texte fait partie du design)

- Français, vouvoiement pour les parents, écriture inclusive avec point médian déjà utilisée (`un·e orthophoniste`).
- Ton bienveillant et concret, jamais culpabilisant : « Pas encore fait cette semaine » plutôt que « En retard ».
- Boutons = verbe d'action précis et constant d'une page à l'autre (« Commencer l'activité », « Assigner », « Valider l'activité »).
- États vides et erreurs disent quoi faire ensuite.
- Apostrophes dans le JSX : `&apos;` (règle ESLint du projet) ; points de suspension `…` ; espace insécable avant `:` `?` `!` quand c'est simple.
- Dates et heures via `Intl.DateTimeFormat("fr-FR", …)`.

## Éviter les tics « template IA »

- Pas de dégradés violets/bleus, pas de glassmorphism, pas de hero « gros chiffre + petit label + 3 stats ».
- Pas un mot coloré dans chaque titre (la landing en a un, ça suffit), pas de labels en MAJUSCULES partout (le petit sur-titre de domaine dans `ActivityRow` est l'exception établie).
- Pas de grilles de cards identiques par réflexe : se demander si une liste ou un tableau sert mieux.
- Animation : un seul moment marquant par parcours (ex. `animate-pop` quand une activité est terminée), le reste en transitions de 150 ms.

## Socle qualité (checklist avant de rendre)

Détails et justifications dans `references/interface.md` et `references/react-next.md`. Le minimum :

- [ ] Responsive 375 px → desktop, aucun scroll horizontal, cibles tactiles ≥ 44 px en mobile.
- [ ] Clavier : tout est atteignable, focus visible (déjà global via `:focus-visible`), vrais `<Link>`/`<button>`, jamais de `div onClick`.
- [ ] Formulaires : `<label>` reliés, bons `type`/`autocomplete`/`inputMode`, erreurs en ligne, inputs ≥ 16 px.
- [ ] Info jamais portée par la couleur seule (texte ou icône en plus dans `ResultPill`, alertes…).
- [ ] Mode sombre correct (uniquement des tokens).
- [ ] `"use client"` seulement sur les composants qui en ont besoin (état, effets, localStorage) ; pages en Server Component par défaut.
- [ ] Pas d'erreur d'hydratation : localStorage lu dans un `useEffect` (modèle de `store.ts`), pas de `Date.now()`/`Math.random()` au rendu.
- [ ] `npm run lint` passe et `npx tsc --noEmit` passe.
- [ ] Vérifié dans le navigateur (`npm run dev`, skill `run` ou Chrome) en largeur mobile et desktop.

## Ajouter une donnée ou un état

1. Type + données fictives dans `data.ts` (commentaire « à remplacer par l'API » conservé).
2. Si modifiable par l'utilisateur : hook dans `store.ts` sur le modèle `read`/`write` + `useEffect`, clé préfixée `parentons:`.
3. Les espaces `/app` et `/pro` partagent le même localStorage : c'est voulu, c'est ce qui rend la démo vivante (une action côté orthophoniste se voit côté parent).
