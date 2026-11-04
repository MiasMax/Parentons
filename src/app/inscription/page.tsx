import Link from "next/link";
import { ChevronRight, KeyRound, Sparkles } from "lucide-react";

const choices = [
  {
    href: "/inscription/suivi",
    icon: KeyRound,
    title: "Mon enfant est suivi par un·e orthophoniste",
    text: "J'ai reçu un code d'invitation. Mes activités sont déjà prêtes.",
    tone: "bg-sage-soft text-sage",
  },
  {
    href: "/inscription/diagnostic",
    icon: Sparkles,
    title: "Mon enfant n'est pas (encore) suivi",
    text: "Je décris ses difficultés et je reçois un programme personnalisé.",
    tone: "bg-honey-soft text-honey-ink",
  },
];

export default function Inscription() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold sm:text-4xl">Bienvenue !</h1>
      <p className="mt-2 text-lg text-muted">Pour commencer, quelle est votre situation ?</p>

      <div className="mt-8 flex flex-col gap-4">
        {choices.map(({ href, icon: Icon, title, text, tone }) => (
          <Link
            key={href}
            href={href}
            className="card group flex items-center gap-4 p-5 transition hover:border-sage sm:p-6"
          >
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="font-display block text-lg font-bold leading-snug">{title}</span>
              <span className="mt-1 block text-muted">{text}</span>
            </span>
            <ChevronRight
              className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-sage"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <p className="mt-8 rounded-2xl bg-surface p-4 text-sm text-muted">
        Vous êtes orthophoniste ?{" "}
        <Link href="/" className="font-semibold text-sage hover:underline">
          Découvrir Parentons pour votre cabinet
        </Link>
      </p>
    </div>
  );
}
