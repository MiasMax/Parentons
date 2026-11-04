"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Check } from "lucide-react";

const messages = {
  abonnement: [
    "Analyse du profil de votre enfant",
    "Sélection dans la bibliothèque d'activités validées",
    "Personnalisation des consignes",
    "Préparation de votre première semaine",
  ],
  suivi: [
    "Connexion avec votre orthophoniste",
    "Récupération des activités choisies pour vous",
    "Préparation de votre première semaine",
  ],
};

function Preparation() {
  const router = useRouter();
  const parcours = useSearchParams().get("parcours") === "abonnement" ? "abonnement" : "suivi";
  const list = messages[parcours];
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done < list.length) {
      const t = setTimeout(() => setDone(done + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => router.push("/app"), 800);
    return () => clearTimeout(t);
  }, [done, list.length, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 animate-ping rounded-full bg-honey-soft" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-honey text-4xl">
          🌱
        </span>
      </div>
      <h1 className="mt-8 text-3xl font-extrabold">On prépare tout pour vous…</h1>
      <ul className="mt-8 flex w-full max-w-sm flex-col gap-3 text-left">
        {list.map((m, i) => (
          <li
            key={m}
            className={`flex items-center gap-3 transition ${i <= done ? "opacity-100" : "opacity-30"}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                i < done ? "bg-sage text-on-sage" : "border-2 border-line"
              }`}
            >
              {i < done && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
            </span>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Preparation />
    </Suspense>
  );
}
