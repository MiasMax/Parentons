# Règles d'interface

Adapté de `vercel-labs/web-interface-guidelines` (MIT), filtré pour Parentons. À relire quand on construit un formulaire, une nav, une liste ou une animation.

## Clavier et focus
- Tout est utilisable au clavier ; ordre de tabulation logique.
- Focus visible : le style global `:focus-visible` (contour sauge) suffit, ne pas le retirer. Vérifier qu'il n'est pas caché par la bottom nav fixe.
- Modale/drawer : focus piégé dedans, rendu à l'élément déclencheur à la fermeture, `Esc` ferme.

## Cibles et saisie
- Cibles ≥ 24 px desktop, ≥ 44 px mobile (agrandir la zone cliquable avec du padding si l'icône est petite).
- Inputs mobiles ≥ 16 px (sinon iOS zoome). Ne jamais bloquer le zoom.

## Formulaires
- Chaque champ a un `<label>` (ou `aria-label` si visuellement évident).
- `type`, `name`, `autocomplete`, `inputMode` corrects (email, tel, code d'invitation → `inputMode="text" autoCapitalize="characters"`).
- Laisser taper librement, valider ensuite ; erreurs en ligne sous le champ, focus sur la première erreur à la soumission.
- Coller autorisé partout (codes d'invitation notamment). `trim()` des valeurs.
- Bouton de soumission actif jusqu'à l'envoi ; pendant l'envoi il garde son libellé + indicateur.
- Prévenir avant de quitter un formulaire modifié non enregistré (création d'activité côté pro).

## État et navigation
- Filtres, onglets et recherche reflétés dans l'URL (`?domaine=Articulation`, `?onglet=a-valider`) pour que Retour et partage marchent.
- Navigation = `<Link>`, action = `<button>`. Rien de cliquable qui n'en a pas l'air, et inversement.

## Retours utilisateur
- UI optimiste (localStorage est instantané) ; action destructive → confirmation ou « Annuler » pendant quelques secondes.
- Toasts et validations en ligne dans une région `aria-live="polite"`.
- Points de suspension `…` pour les actions qui ouvrent une suite (« Ajouter une activité… ») et les chargements.

## Contenu et accessibilité
- Un seul `<h1>` par page, hiérarchie de titres respectée ; `<title>` qui correspond à la page (export `metadata`).
- Pas d'information par la couleur seule ; boutons icône seuls avec `aria-label`.
- HTML natif avant ARIA (`<button>`, `<dialog>`, `<details>`, `<table>` pour les tableaux de patients).
- Prévoir textes courts, moyens et longs (prénoms longs, notes de parents de 3 lignes) : `truncate`/`line-clamp` + `min-w-0` dans les flex.
- États vides, peu de données, beaucoup de données, erreur : tous conçus.
- Dates/nombres localisés `fr-FR`.

## Animation
- Respecter `prefers-reduced-motion` (déjà global dans `globals.css`).
- Animer seulement `transform` et `opacity` ; jamais `transition: all`.
- Animations interruptibles, courtes (150–450 ms).

## Layout
- Aligner sur une grille ; flex/grid plutôt que mesures JS.
- Tester 375 px, 768 px, 1280 px, très large. Respecter `env(safe-area-inset-bottom)` (déjà dans la bottom nav).
- Listes > 50 éléments : pagination ou virtualisation.

## Images et polices
- `next/image` avec dimensions explicites ; `priority` seulement au-dessus de la ligne de flottaison.
- Polices via `next/font` (déjà fait dans `layout.tsx`), pas de `<link>` Google Fonts.

## Visuel
- Rayons imbriqués concentriques (rayon intérieur = rayon extérieur − padding).
- Bordures et ombres teintées vers le fond, discrètes.
- Contraste suffisant, renforcé au hover/focus/actif. Graphiques : palette lisible par les daltoniens (voir skill `dataviz`).
