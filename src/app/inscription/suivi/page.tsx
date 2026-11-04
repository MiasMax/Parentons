"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useParcours } from "@/lib/store";

export default function Suivi() {
  const router = useRouter();
  const { setParcours } = useParcours();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const valid = code.trim().length >= 6 && email.includes("@") && password.length >= 8;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setParcours("suivi");
    router.push("/inscription/preparation?parcours=suivi");
  }

  return (
    <div>
      <Link href="/inscription" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Retour
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold">Rejoindre votre orthophoniste</h1>
      <p className="mt-2 text-muted">
        Le code d&apos;invitation figure dans le message envoyé par votre orthophoniste.
      </p>

      <form onSubmit={submit} className="card mt-8 flex flex-col gap-5 p-6">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Code d&apos;invitation</span>
          <input
            className="field font-mono text-lg uppercase tracking-[0.3em]"
            placeholder="ABC-123"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={12}
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Votre e-mail</span>
          <input
            type="email"
            className="field"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Mot de passe</span>
          <input
            type="password"
            className="field"
            placeholder="8 caractères minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="btn btn-primary mt-2" disabled={!valid}>
          Accéder à mes activités
        </button>
      </form>
    </div>
  );
}
