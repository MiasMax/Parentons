import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, HeartHandshake, Stethoscope } from "lucide-react";
import { Logo } from "@/components/ui";

export const metadata: Metadata = { title: "Se connecter · Parentons" };

const spaces = [
  {
    href: "/pro",
    icon: Stethoscope,
    title: "Je suis orthophoniste",
    text: "Mes patients, les retours des parents, mon agenda et la bibliothèque d'activités.",
    tone: "bg-sage-soft text-sage",
  },
  {
    href: "/app",
    icon: HeartHandshake,
    title: "Je suis parent",
    text: "Les activités de la semaine, les rappels et les progrès de mon enfant. Gratuit avec le code de votre orthophoniste.",
    tone: "bg-honey-soft text-honey-ink",
  },
];

export default function Connexion() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-4 py-8 sm:px-6">
      <Link href="/" className="w-fit">
        <Logo />
      </Link>
      <main className="flex flex-1 flex-col justify-center py-10">
        <h1 className="text-3xl font-extrabold">Bon retour parmi nous</h1>
        <p className="mt-2 text-muted">Choisissez votre espace.</p>
        <ul className="mt-8 flex flex-col gap-3">
          {spaces.map(({ href, icon: Icon, title, text, tone }) => (
            <li key={href}>
              <Link href={href} className="card flex items-center gap-4 p-5 transition hover:border-sage">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg font-bold">{title}</span>
                  <span className="block text-sm text-muted">{text}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-muted" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
