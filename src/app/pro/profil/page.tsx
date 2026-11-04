"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { orthophoniste } from "@/lib/data";
import { PageHeader } from "@/components/ui";

export default function ProProfil() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(orthophoniste.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible : le code reste lisible à l'écran
    }
  };

  const resetDemo = () => {
    if (!window.confirm("Remettre la démo à zéro ? Les programmes, messages, rendez-vous et retours ajoutés seront effacés.")) return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("parentons:"))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // stockage indisponible
    }
    window.location.reload();
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profil" />

      <section className="card flex items-center gap-4 p-5">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage font-display text-2xl font-bold text-on-sage">
          {orthophoniste.initials}
        </span>
        <div>
          <p className="font-display text-xl font-bold">{orthophoniste.name}</p>
          <p className="text-muted">Orthophoniste · {orthophoniste.city}</p>
        </div>
      </section>

      <section className="mt-4 rounded-[1.25rem] bg-honey-soft p-5 sm:p-6">
        <h2 className="text-lg font-bold">Votre code d&apos;invitation</h2>
        <p className="mt-1 text-sm">
          Donnez-le aux parents : en le saisissant à l&apos;inscription, ils rejoignent votre suivi et
          retrouvent les activités que vous leur assignez.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="rounded-xl border-[1.5px] border-dashed border-honey bg-surface px-5 py-3 text-center font-display text-2xl font-extrabold tracking-widest">
            {orthophoniste.inviteCode}
          </p>
          <button type="button" className="btn btn-honey" onClick={copy}>
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            <span aria-live="polite">{copied ? "Copié" : "Copier le code"}</span>
          </button>
        </div>
      </section>

      <section className="card mt-4 divide-y divide-line">
        {[
          ["Cabinet", orthophoniste.address],
          ["Téléphone", orthophoniste.phone],
          ["E-mail", orthophoniste.email],
          ["N° RPPS", orthophoniste.rpps],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 p-4 sm:flex-row sm:justify-between">
            <span className="text-sm text-muted">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </section>

      <section className="card mt-4 p-5">
        <h2 className="text-lg font-bold">Démo</h2>
        <p className="mt-1 text-sm text-muted">
          Les deux espaces partagent les mêmes données dans ce navigateur.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/app" className="btn btn-ghost">
            Voir l&apos;espace parent
          </Link>
          <button type="button" className="btn btn-ghost" onClick={resetDemo}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Réinitialiser la démo
          </button>
        </div>
      </section>
    </div>
  );
}
