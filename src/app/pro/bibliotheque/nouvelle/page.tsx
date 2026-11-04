"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Domain, Step } from "@/lib/data";
import { orthophoniste } from "@/lib/data";
import { useCustomActivities } from "@/lib/store";

const domains: Domain[] = ["Articulation", "Vocabulaire", "Conscience phonologique", "Récit", "Compréhension", "Souffle"];

const emptyStep: Step = { title: "", detail: "", tip: "" };

export default function NouvelleActivite() {
  const router = useRouter();
  const { add } = useCustomActivities();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<Domain>("Articulation");
  const [duration, setDuration] = useState(10);
  const [summary, setSummary] = useState("");
  const [objective, setObjective] = useState("");
  const [materials, setMaterials] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ ...emptyStep }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const dirty = !saved && (title || summary || objective || steps.some((s) => s.title || s.detail));

  // Prévenir avant de quitter avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const updateStep = (i: number, patch: Partial<Step>) =>
    setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Donnez un titre à l'activité.";
    if (!objective.trim()) next.objective = "Précisez l'objectif, il guide le parent.";
    const filled = steps.filter((s) => s.title.trim() && s.detail.trim());
    if (filled.length === 0) next.steps = "Ajoutez au moins une étape avec un titre et une explication.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`f-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    add({
      id: `perso-${crypto.randomUUID().slice(0, 8)}`,
      title: title.trim(),
      domain,
      duration,
      summary: summary.trim() || objective.trim(),
      objective: objective.trim(),
      materials: materials
        .split(/\n|,/)
        .map((m) => m.trim())
        .filter(Boolean),
      steps: filled.map((s) => ({ title: s.title.trim(), detail: s.detail.trim(), tip: s.tip?.trim() || undefined })),
      validatedBy: orthophoniste.name,
    });
    setSaved(true);
    router.push("/pro/bibliotheque?onglet=creations");
  };

  return (
    <div className="max-w-2xl">
      <Link href="/pro/bibliotheque" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Activités
      </Link>
      <h1 className="text-3xl font-extrabold">Créer une activité</h1>
      <p className="mt-1 text-muted">
        Écrivez pour le parent : des phrases simples, une action par étape. L&apos;équipe Parentons la met en forme
        avant publication.
      </p>

      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="f-title" className="mb-1.5 block text-sm font-semibold">
            Titre
          </label>
          <input
            id="f-title"
            className="field"
            placeholder="Ex. : Le serpent qui siffle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "e-title" : undefined}
          />
          <FieldError id="e-title" text={errors.title} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="f-domain" className="mb-1.5 block text-sm font-semibold">
              Domaine
            </label>
            <select id="f-domain" className="field" value={domain} onChange={(e) => setDomain(e.target.value as Domain)}>
              {domains.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-duration" className="mb-1.5 block text-sm font-semibold">
              Durée
            </label>
            <select id="f-duration" className="field" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              {[5, 10, 15, 20].map((d) => (
                <option key={d} value={d}>
                  {d} minutes
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="f-summary" className="mb-1.5 block text-sm font-semibold">
            En une phrase <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input
            id="f-summary"
            className="field"
            placeholder="Ce que le parent lit dans la liste"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="f-objective" className="mb-1.5 block text-sm font-semibold">
            Objectif
          </label>
          <textarea
            id="f-objective"
            className="field min-h-20"
            placeholder="Ce que l'activité travaille, expliqué simplement"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            aria-invalid={!!errors.objective}
            aria-describedby={errors.objective ? "e-objective" : undefined}
          />
          <FieldError id="e-objective" text={errors.objective} />
        </div>

        <div>
          <label htmlFor="f-materials" className="mb-1.5 block text-sm font-semibold">
            Matériel <span className="font-normal text-muted">(un par ligne)</span>
          </label>
          <textarea
            id="f-materials"
            className="field min-h-20"
            placeholder={"Un miroir\nDes crayons"}
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">Étapes</legend>
          <ol className="flex flex-col gap-3">
            {steps.map((s, i) => (
              <li key={i} className="card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-sage">Étape {i + 1}</span>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-brick-soft hover:text-brick"
                      onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}
                      aria-label={`Supprimer l'étape ${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
                <input
                  id={i === 0 ? "f-steps" : undefined}
                  className="field"
                  placeholder="Titre de l'étape"
                  aria-label={`Titre de l'étape ${i + 1}`}
                  value={s.title}
                  onChange={(e) => updateStep(i, { title: e.target.value })}
                />
                <textarea
                  className="field mt-2 min-h-16"
                  placeholder="Ce que fait le parent, concrètement"
                  aria-label={`Explication de l'étape ${i + 1}`}
                  value={s.detail}
                  onChange={(e) => updateStep(i, { detail: e.target.value })}
                />
                <input
                  className="field mt-2"
                  placeholder="Astuce (facultatif)"
                  aria-label={`Astuce de l'étape ${i + 1}`}
                  value={s.tip}
                  onChange={(e) => updateStep(i, { tip: e.target.value })}
                />
              </li>
            ))}
          </ol>
          <FieldError id="e-steps" text={errors.steps} />
          <button type="button" className="btn btn-ghost mt-3" onClick={() => setSteps((prev) => [...prev, { ...emptyStep }])}>
            <Plus className="h-4 w-4" aria-hidden /> Ajouter une étape
          </button>
        </fieldset>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
          <Link href="/pro/bibliotheque" className="btn btn-ghost">
            Annuler
          </Link>
          <button type="submit" className="btn btn-primary">
            Enregistrer l&apos;activité
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-semibold text-brick" role="alert">
      {text}
    </p>
  );
}
