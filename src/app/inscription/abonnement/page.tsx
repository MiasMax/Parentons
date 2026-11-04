"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft, ShieldCheck } from "lucide-react";
import { planFeatures, plans } from "@/lib/data";
import { useParcours } from "@/lib/store";

export default function Abonnement() {
  const router = useRouter();
  const { setParcours } = useParcours();
  const [plan, setPlan] = useState("annuel");

  function subscribe() {
    setParcours("abonnement");
    router.push("/inscription/preparation?parcours=abonnement");
  }

  return (
    <div>
      <Link href="/inscription/diagnostic" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Retour
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Choisissez votre formule</h1>
      <p className="mt-2 text-muted">7 jours d&apos;essai gratuit. Résiliable à tout moment.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {plans.map((p) => {
          const active = plan === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              aria-pressed={active}
              className={`relative rounded-[1.25rem] border-2 bg-surface p-5 text-left transition ${
                active ? "border-sage" : "border-line hover:border-sage/50"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 right-4 rounded-full bg-honey px-3 py-1 text-xs font-bold text-on-honey">
                  Le plus choisi
                </span>
              )}
              <p className="font-semibold text-muted">{p.name}</p>
              <p className="mt-1">
                <span className="font-display text-3xl font-extrabold">{p.price}</span>
                <span className="text-muted"> {p.period}</span>
              </p>
              <p className="mt-1 text-sm text-muted">{p.note}</p>
            </button>
          );
        })}
      </div>

      <ul className="card mt-6 flex flex-col gap-3 p-5">
        {planFeatures.map((f) => (
          <li key={f} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button onClick={subscribe} className="btn btn-honey mt-8 w-full sm:w-auto">
        Commencer l&apos;essai gratuit
      </button>
      <p className="mt-4 flex items-start gap-2 text-sm text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
        Parentons ne remplace pas un bilan orthophonique. Si vous n&apos;avez pas encore de
        rendez-vous, nous vous conseillons d&apos;en demander un en parallèle.
      </p>
    </div>
  );
}
