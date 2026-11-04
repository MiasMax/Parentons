import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardList,
  HeartHandshake,
  KeyRound,
  MessageSquareText,
  Stethoscope,
  Users,
} from "lucide-react";
import { Logo } from "@/components/ui";

// Offre affichée sur la landing : à ajuster selon le modèle économique retenu.
const offer = {
  price: "39,99 €",
  period: "par mois et par orthophoniste",
  trial: "Premier mois offert, sans engagement",
  includes: [
    "Patients et familles illimités",
    "Accès gratuit pour les parents que vous invitez",
    "Bibliothèque d'activités validées + vos propres activités",
    "Agenda et suivi des retours des parents",
  ],
};

const steps = [
  {
    icon: ClipboardList,
    title: "Vous composez le programme",
    text: "Choisissez 3 activités par semaine dans la bibliothèque, ou créez les vôtres en quelques minutes.",
  },
  {
    icon: KeyRound,
    title: "Le parent rejoint avec votre code",
    text: "Vous lui transmettez votre code d'invitation. Il crée son compte gratuitement et retrouve les activités prêtes.",
  },
  {
    icon: MessageSquareText,
    title: "Vous voyez les retours avant la séance",
    text: "Pour chaque activité, le parent indique si c'était réussi, moyen ou difficile, avec un commentaire.",
  },
];

const features = [
  {
    icon: Users,
    title: "Tableau de bord « à surveiller »",
    text: "Les patients qui n'ont rien fait cette semaine ou qui bloquent sur une activité remontent en premier.",
  },
  {
    icon: Stethoscope,
    title: "Fiche patient",
    text: "Programme en cours, historique des retours et notes, au même endroit.",
  },
  {
    icon: BookOpen,
    title: "Bibliothèque d'activités",
    text: "Articulation, vocabulaire, conscience phonologique, récit… Validez ou créez des activités pour vos patients.",
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    text: "Vos rendez-vous de la semaine, reliés aux fiches patients.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Logo size="lg" />
        <nav className="flex items-center gap-4 text-sm font-semibold sm:gap-6">
          <Link href="/parents" className="hidden text-muted hover:text-ink sm:inline">
            Je suis parent
          </Link>
          <Link href="/connexion" className="text-sage hover:underline">
            Se connecter
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 text-sm font-medium text-sage">
              <Stethoscope className="h-4 w-4" aria-hidden />
              Pour les orthophonistes
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Vos patients progressent aussi{" "}
              <span className="text-sage">entre deux séances.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Assignez des activités à faire à la maison, les parents les réalisent avec leur enfant
              et vous retrouvez leurs retours avant le prochain rendez-vous.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pro" className="btn btn-primary">
                Découvrir l&apos;espace pro <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/app" className="btn btn-ghost">
                Voir ce que voit le parent
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              Gratuit pour les familles que vous invitez.
            </p>
          </div>

          <DashboardPreview />
        </section>

        <section className="py-10" aria-labelledby="how">
          <h2 id="how" className="text-2xl font-extrabold sm:text-3xl">
            Comment ça marche
          </h2>
          <ol className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-muted">Étape {i + 1}</p>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_380px]" aria-labelledby="features">
          <div>
            <h2 id="features" className="text-2xl font-extrabold sm:text-3xl">
              Tout votre suivi au même endroit
            </h2>
            <ul className="mt-6 divide-y divide-line">
              {features.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 py-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sage" aria-hidden />
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.25rem] bg-sage p-6 text-on-sage sm:p-8" aria-labelledby="offer">
            <h2 id="offer" className="text-sm font-semibold opacity-80">
              Offre cabinet
            </h2>
            <p className="mt-2 font-display text-4xl font-extrabold">{offer.price}</p>
            <p className="opacity-90">{offer.period}</p>
            <ul className="mt-6 space-y-2">
              {offer.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/pro" className="btn btn-honey mt-8 w-full">
              Essayer gratuitement
            </Link>
            <p className="mt-3 text-center text-sm opacity-80">{offer.trial}</p>
          </div>
        </section>

        <section className="mb-16 mt-6">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-honey-soft text-honey-ink">
              <HeartHandshake className="h-6 w-6" aria-hidden />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold">Vous êtes parent ?</h2>
              <p className="text-muted">
                Votre orthophoniste vous a donné un code : créez votre compte gratuitement, vos
                activités vous attendent.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href="/inscription/suivi" className="btn btn-primary">
                J&apos;ai un code
              </Link>
              <Link href="/parents" className="text-sm font-semibold text-sage hover:underline">
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        <p>
          Parentons ne remplace pas un suivi orthophonique : il le prolonge à la maison.
        </p>
      </footer>
    </div>
  );
}

// Aperçu statique du tableau de bord pro (illustration, pas de données réelles).
function DashboardPreview() {
  const rows = [
    { initials: "IN", name: "Inès, 5 ans", status: "Pas encore commencé cette semaine", done: 0, tone: "honey" },
    { initials: "NO", name: "Noah, 6 ans", status: "Difficile : Le serpent qui siffle", done: 2, tone: "brick" },
    { initials: "LI", name: "Lina, 4 ans", status: "Programme terminé", done: 3, tone: "sage" },
  ] as const;
  const toneCls = {
    honey: "bg-honey-soft text-honey-ink",
    brick: "bg-brick-soft text-brick",
    sage: "bg-sage-soft text-sage",
  };

  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-sage-soft" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-honey-soft" />
      <div className="card relative space-y-3 p-5 shadow-xl shadow-black/5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold">Cette semaine</p>
          <span className="text-xs font-medium text-muted">12 patients suivis</span>
        </div>
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3 rounded-2xl border border-line p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sm font-bold text-sage">
              {r.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{r.name}</span>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${toneCls[r.tone]}`}>
                {r.status}
              </span>
            </span>
            <span className="font-display text-sm font-bold text-muted">{r.done}/3</span>
          </div>
        ))}
        <p className="pt-1 text-xs text-muted">Retours des parents reçus avant la séance</p>
      </div>
    </div>
  );
}
