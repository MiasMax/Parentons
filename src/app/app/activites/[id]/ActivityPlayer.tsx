"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Lightbulb,
  Pause,
  Play,
  Target,
  X,
} from "lucide-react";
import type { Activity, Result } from "@/lib/data";
import { child } from "@/lib/data";
import { useWeekFeedback } from "@/lib/store";
import { DomainIcon, Duration, ResultPill, ValidatedBadge } from "@/components/ui";

type Phase = "intro" | "steps" | "feedback" | "done";

const resultChoices: { value: Result; emoji: string; label: string }[] = [
  { value: "reussi", emoji: "😄", label: "Ça s'est bien passé" },
  { value: "moyen", emoji: "🙂", label: "Mitigé" },
  { value: "difficile", emoji: "😕", label: "C'était difficile" },
];

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function ActivityPlayer({ activity }: { activity: Activity }) {
  const { feedback, save } = useWeekFeedback();
  const previous = feedback[activity.id];

  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  function start() {
    setPhase("steps");
    setStep(0);
    setRunning(true);
  }

  function finishSteps() {
    setRunning(false);
    setPhase("feedback");
  }

  function submit() {
    if (!result) return;
    save(activity.id, { result, note: note.trim() || undefined, date: new Date().toISOString() });
    setPhase("done");
  }

  /* ---------- Introduction ---------- */
  if (phase === "intro") {
    return (
      <div>
        <Link href="/app/activites" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" aria-hidden /> Activités
        </Link>

        <div className="mt-5 flex items-start gap-4">
          <DomainIcon domain={activity.domain} size="lg" />
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">{activity.domain}</p>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{activity.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Duration minutes={activity.duration} />
              <ValidatedBadge by={activity.validatedBy} />
            </div>
          </div>
        </div>

        {previous && (
          <p className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-sage-soft p-4 text-sm text-sage">
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            Déjà faite cette semaine <ResultPill result={previous.result} /> Vous pouvez la refaire si vous le souhaitez.
          </p>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Target className="h-5 w-5 text-sage" aria-hidden /> L&apos;objectif
            </h2>
            <p className="mt-2 text-muted">{activity.objective}</p>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold">Ce qu&apos;il vous faut</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {activity.materials.map((m) => {
                const on = checked.includes(m);
                return (
                  <li key={m}>
                    <button
                      onClick={() => setChecked(on ? checked.filter((x) => x !== m) : [...checked, m])}
                      aria-pressed={on}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-[1.5px] transition ${
                          on ? "border-sage bg-sage text-on-sage" : "border-line"
                        }`}
                      >
                        {on && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
                      </span>
                      <span className={on ? "text-muted line-through" : ""}>{m}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className="mt-4">
          <h2 className="mb-3 text-lg font-bold">Les étapes</h2>
          <ol className="flex flex-col gap-2">
            {activity.steps.map((s, i) => (
              <li key={s.title} className="flex items-center gap-3 text-muted">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sm font-bold text-sage">
                  {i + 1}
                </span>
                {s.title}
              </li>
            ))}
          </ol>
        </section>

        <div className="sticky bottom-20 mt-10 md:bottom-6">
          <button onClick={start} className="btn btn-honey w-full shadow-lg shadow-black/10 sm:w-auto">
            <Play className="h-4 w-4" fill="currentColor" aria-hidden /> Commencer avec {child.firstName}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Étapes guidées ---------- */
  if (phase === "steps") {
    const s = activity.steps[step];
    const last = step === activity.steps.length - 1;
    return (
      <div className="flex min-h-[70vh] flex-col">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setRunning(false);
              setPhase("intro");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-sage"
            aria-label="Quitter l'activité"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <p className="font-display truncate font-bold">{activity.title}</p>
          <button
            onClick={() => setRunning(!running)}
            className="flex items-center gap-2 rounded-full bg-surface px-3 py-2 font-mono text-sm tabular-nums ring-1 ring-line"
            aria-label={running ? "Mettre en pause" : "Reprendre"}
          >
            {running ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
            {formatTime(seconds)}
          </button>
        </div>

        <div className="mt-5 flex gap-1.5" aria-hidden>
          {activity.steps.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-sage" : "bg-line"}`} />
          ))}
        </div>

        <div key={step} className="animate-pop flex-1 py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-sage">
            Étape {step + 1} sur {activity.steps.length}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed sm:text-xl">{s.detail}</p>
          {s.tip && (
            <p className="mt-8 flex max-w-2xl items-start gap-3 rounded-2xl bg-honey-soft p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-honey-ink" aria-hidden />
              <span>
                <strong className="text-honey-ink">Astuce · </strong>
                {s.tip}
              </span>
            </p>
          )}
        </div>

        <div className="sticky bottom-20 flex gap-3 md:bottom-6">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="btn btn-ghost bg-surface"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          {last ? (
            <button onClick={finishSteps} className="btn btn-primary flex-1 sm:flex-none">
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> Activité terminée
            </button>
          ) : (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary flex-1 sm:flex-none">
              Étape suivante <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Retour du parent ---------- */
  if (phase === "feedback") {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold">Comment ça s&apos;est passé ?</h1>
        <p className="mt-2 text-muted">
          Votre retour aide à adapter les prochaines activités de {child.firstName}.
          {seconds > 0 && ` Durée : ${formatTime(seconds)}.`}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {resultChoices.map((c) => (
            <button
              key={c.value}
              onClick={() => setResult(c.value)}
              aria-pressed={result === c.value}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-surface px-2 py-5 transition ${
                result === c.value ? "border-sage bg-sage-soft" : "border-line hover:border-sage/50"
              }`}
            >
              <span className="text-4xl" aria-hidden>
                {c.emoji}
              </span>
              <span className="text-center text-sm font-medium leading-tight">{c.label}</span>
            </button>
          ))}
        </div>

        <label className="mt-6 flex flex-col gap-2">
          <span className="font-medium">
            Une remarque ? <span className="font-normal text-muted">(facultatif)</span>
          </span>
          <textarea
            className="field min-h-28"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Par exemple : beaucoup d'enthousiasme au début, de la fatigue à la fin…"
          />
        </label>

        <button onClick={submit} disabled={!result} className="btn btn-primary mt-8 w-full">
          Enregistrer
        </button>
      </div>
    );
  }

  /* ---------- Célébration ---------- */
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="animate-pop flex h-28 w-28 items-center justify-center rounded-full bg-honey text-6xl">
        ⭐
      </span>
      <h1 className="mt-8 text-3xl font-extrabold sm:text-4xl">Bravo à vous deux !</h1>
      <p className="mt-3 max-w-md text-lg text-muted">
        Une activité de plus pour {child.firstName}. Votre retour a bien été enregistré.
      </p>
      <Link href="/app" className="btn btn-primary mt-8">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
