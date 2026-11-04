"use client";

import Link from "next/link";
import { CreditCard, FileText, LogOut, RotateCcw, UserRound } from "lucide-react";
import { child, orthophoniste, parent, plans } from "@/lib/data";
import { useParcours, useWeekFeedback } from "@/lib/store";
import { PageHeader } from "@/components/ui";

export default function Profil() {
  const { parcours, setParcours } = useParcours();
  const { reset } = useWeekFeedback();
  const plan = plans.find((p) => p.featured)!;

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Profil de ${child.firstName}`} />

      <section className="card p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-honey text-3xl" aria-hidden>
            🧒
          </span>
          <div>
            <p className="font-display text-2xl font-extrabold">{child.firstName}</p>
            <p className="text-muted">{child.age} ans</p>
          </div>
        </div>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Points travaillés</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {child.difficulties.map((d) => (
            <li key={d} className="rounded-full bg-sage-soft px-3 py-1.5 text-sm font-medium text-sage">
              {d}
            </li>
          ))}
        </ul>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Diagnostic</h2>
        <p className="mt-2 flex items-start gap-2">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
          {child.diagnosis}
        </p>
      </section>

      {parcours === "suivi" ? (
        <section className="card mt-4 flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage font-display font-bold text-on-sage">
            CM
          </span>
          <div className="flex-1">
            <p className="text-sm text-muted">Suivi par</p>
            <p className="font-bold">
              {orthophoniste.name}, orthophoniste · {orthophoniste.city}
            </p>
          </div>
        </section>
      ) : (
        <section className="card mt-4 flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-honey-soft text-honey-ink">
            <CreditCard className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-bold">Formule {plan.name}</p>
            <p className="text-sm text-muted">
              {plan.price} {plan.period} · Essai gratuit jusqu&apos;au 10 novembre
            </p>
          </div>
          <button className="text-sm font-semibold text-sage hover:underline">Gérer</button>
        </section>
      )}

      <section className="card mt-4 flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-soft text-sage">
          <UserRound className="h-5 w-5" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-bold">{parent.firstName}</p>
          <p className="text-sm text-muted">{parent.email}</p>
        </div>
        <Link href="/parents" className="flex items-center gap-1.5 text-sm font-semibold text-brick hover:underline">
          <LogOut className="h-4 w-4" aria-hidden /> Déconnexion
        </Link>
      </section>

      {/* Outils de démonstration */}
      <section className="mt-10 rounded-[1.25rem] border-2 border-dashed border-line p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Mode démo</p>
        <p className="mt-2 font-medium">Parcours affiché</p>
        <div className="mt-2 inline-flex rounded-full bg-surface p-1 ring-1 ring-line">
          {(
            [
              ["suivi", "Enfant suivi"],
              ["abonnement", "Abonnement"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              onClick={() => setParcours(v)}
              aria-pressed={parcours === v}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                parcours === v ? "bg-sage text-on-sage" : "text-muted"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button onClick={reset} className="mt-4 flex items-center gap-2 text-sm font-semibold text-sage hover:underline">
          <RotateCcw className="h-4 w-4" aria-hidden /> Réinitialiser les activités de la semaine
        </button>
      </section>
    </div>
  );
}
