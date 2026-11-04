import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Bell, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui";

export const metadata: Metadata = { title: "Espace parent · Parentons" };

const features = [
  {
    icon: CalendarCheck,
    title: "3 activités par semaine",
    text: "Des fiches courtes et guidées pas à pas, à faire à la maison avec votre enfant.",
  },
  {
    icon: ShieldCheck,
    title: "Validées par des orthophonistes",
    text: "Chaque activité est relue et approuvée par un·e professionnel·le de santé.",
  },
  {
    icon: Bell,
    title: "Des rappels bienveillants",
    text: "Une notification au bon moment pour garder le rythme, sans pression.",
  },
];

export default function Parents() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/parents">
          <Logo />
        </Link>
        <Link href="/connexion" className="text-sm font-semibold text-sage hover:underline">
          Se connecter
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-honey-soft px-3 py-1 text-sm font-medium text-honey-ink">
              <Sparkles className="h-4 w-4" aria-hidden />
              L&apos;orthophonie, aussi à la maison
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Accompagnez le langage de votre enfant,{" "}
              <span className="text-sage">même sans attendre.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Des activités ludiques et personnalisées, validées par des orthophonistes, pour
              progresser ensemble entre deux séances ou en attendant un rendez-vous.
            </p>
            <p className="mt-3 max-w-lg font-medium text-sage">
              Gratuit pour les parents dont l&apos;orthophoniste utilise Parentons.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/inscription/suivi" className="btn btn-primary">
                J&apos;ai un code de mon orthophoniste <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/app" className="btn btn-ghost">
                Voir la démo
              </Link>
            </div>
          </div>

          <HeroIllustration />
        </section>

        <section className="grid gap-4 pb-12 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-soft text-sage">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-1 text-muted">{text}</p>
            </div>
          ))}
        </section>

        <section className="mb-16 grid gap-4 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-sage">
              Votre enfant est suivi · gratuit
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">Votre orthophoniste vous invite</h2>
            <p className="mt-2 text-muted">
              Entrez le code transmis par votre orthophoniste : les activités qu&apos;il ou elle a
              choisies vous attendent déjà. Vous n&apos;avez rien à payer.
            </p>
            <Link href="/inscription/suivi" className="btn btn-ghost mt-6">
              J&apos;ai un code
            </Link>
          </div>
          <div className="rounded-[1.25rem] bg-sage p-6 text-on-sage sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
              Pas encore de suivi
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">Des activités faites pour lui</h2>
            <p className="mt-2 opacity-90">
              Décrivez les difficultés de votre enfant : nous préparons un programme
              personnalisé à partir d&apos;activités validées par des orthophonistes.
            </p>
            <Link href="/inscription/diagnostic" className="btn btn-honey mt-6">
              Créer son programme
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        <p>
          Vous êtes orthophoniste ?{" "}
          <Link href="/" className="font-semibold text-sage hover:underline">
            Découvrir Parentons pour votre cabinet
          </Link>
        </p>
        <p className="mt-2">
          Parentons ne remplace pas un suivi orthophonique. En cas de doute, parlez-en à votre
          médecin.
        </p>
      </footer>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -right-4 -top-4 h-40 w-40 rounded-full bg-honey-soft" aria-hidden />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage-soft" aria-hidden />
      <div className="card relative space-y-3 p-5 shadow-xl shadow-black/5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold">Cette semaine</p>
          <span className="rounded-full bg-honey-soft px-2.5 py-1 text-xs font-semibold text-honey-ink">
            2/3 faites
          </span>
        </div>
        {[
          ["👄", "Le serpent qui siffle", true],
          ["👂", "La boîte à rimes", true],
          ["🎨", "Raconte-moi ton dessin", false],
        ].map(([emoji, title, done]) => (
          <div
            key={title as string}
            className="flex items-center gap-3 rounded-2xl border border-line p-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey-soft text-xl">
              {emoji}
            </span>
            <span className="flex-1 font-medium">{title}</span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                done ? "bg-sage text-on-sage" : "border-2 border-line"
              }`}
            >
              {done ? "✓" : ""}
            </span>
          </div>
        ))}
        <p className="flex items-center gap-1.5 pt-1 text-xs text-sage">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Validé par Claire Martin,
          orthophoniste
        </p>
      </div>
    </div>
  );
}
