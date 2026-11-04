"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";

const difficulties = [
  "Prononce mal certains sons",
  "Parle peu ou a peu de vocabulaire",
  "Fait des phrases courtes ou mal construites",
  "A du mal à comprendre les consignes",
  "Bégaie ou bute sur les mots",
  "A du mal à raconter",
  "Difficultés en lecture",
  "Difficultés en écriture",
];

const bilanOptions = [
  { value: "fait", label: "Oui, un bilan a été fait" },
  { value: "attente", label: "Je suis sur liste d'attente" },
  { value: "non", label: "Non, pas encore" },
];

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const steps = ["Votre enfant", "Ses difficultés", "Son parcours", "Votre rythme"];

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-2 rounded-2xl border-[1.5px] px-4 py-3 text-left font-medium transition ${
        selected ? "border-sage bg-sage-soft text-sage" : "border-line bg-surface hover:border-sage/50"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] ${
          selected ? "border-sage bg-sage text-on-sage" : "border-line"
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={3} />}
      </span>
      {children}
    </button>
  );
}

export default function Diagnostic() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [bilan, setBilan] = useState("");
  const [chosenDays, setChosenDays] = useState<string[]>(["Lun", "Mer", "Sam"]);
  const [moment, setMoment] = useState("soir");

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const canNext = [
    name.trim() !== "" && age !== "",
    selected.length > 0,
    bilan !== "",
    chosenDays.length > 0,
  ][step];

  const prenom = name.trim() || "votre enfant";

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else router.push("/inscription/abonnement");
  }

  return (
    <div>
      {step === 0 ? (
        <Link href="/inscription" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ChevronLeft className="h-4 w-4" aria-hidden /> Retour
        </Link>
      ) : (
        <button
          onClick={() => setStep(step - 1)}
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Étape précédente
        </button>
      )}

      <div className="mt-5 flex gap-1.5" aria-hidden>
        {steps.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-sage" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-muted">
        Étape {step + 1} sur {steps.length} · {steps[step]}
      </p>

      <div className="mt-6">
        {step === 0 && (
          <>
            <h1 className="text-3xl font-extrabold">Parlez-nous de votre enfant</h1>
            <p className="mt-2 text-muted">Ces informations restent privées.</p>
            <div className="mt-8 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="font-medium">Son prénom</span>
                <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Léo" />
              </label>
              <div className="flex flex-col gap-2">
                <span className="font-medium">Son âge</span>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {["3", "4", "5", "6", "7", "8", "9+"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAge(a)}
                      aria-pressed={age === a}
                      className={`rounded-xl border-[1.5px] py-3 font-display text-lg font-bold transition ${
                        age === a ? "border-sage bg-sage text-on-sage" : "border-line bg-surface hover:border-sage/50"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-muted">ans</span>
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-3xl font-extrabold">Qu&apos;avez-vous remarqué chez {prenom} ?</h1>
            <p className="mt-2 text-muted">Plusieurs réponses possibles.</p>
            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {difficulties.map((d) => (
                <Chip key={d} selected={selected.includes(d)} onClick={() => toggle(selected, setSelected, d)}>
                  {d}
                </Chip>
              ))}
            </div>
            <label className="mt-6 flex flex-col gap-2">
              <span className="font-medium">
                Autre chose à préciser ? <span className="font-normal text-muted">(facultatif)</span>
              </span>
              <textarea
                className="field min-h-24"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Par exemple : il dit « tat » au lieu de « chat »…"
              />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-extrabold">Avez-vous déjà consulté un·e orthophoniste pour {prenom} ?</h1>
            <p className="mt-2 text-muted">Si vous avez un compte rendu de bilan, vous pourrez l&apos;ajouter plus tard.</p>
            <div className="mt-8 flex flex-col gap-2.5">
              {bilanOptions.map((o) => (
                <Chip key={o.value} selected={bilan === o.value} onClick={() => setBilan(o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
            {bilan === "attente" && (
              <p className="mt-6 rounded-2xl bg-honey-soft p-4 text-sm text-ink">
                Bonne nouvelle : les activités Parentons peuvent aider {prenom} à progresser en
                attendant son premier rendez-vous.
              </p>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-3xl font-extrabold">Quand êtes-vous disponible ?</h1>
            <p className="mt-2 text-muted">
              Choisissez 3 jours : nous vous enverrons un petit rappel ces jours-là.
            </p>
            <div className="mt-8 grid grid-cols-7 gap-1.5">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggle(chosenDays, setChosenDays, d)}
                  aria-pressed={chosenDays.includes(d)}
                  className={`rounded-xl border-[1.5px] py-3 text-sm font-semibold transition ${
                    chosenDays.includes(d)
                      ? "border-sage bg-sage text-on-sage"
                      : "border-line bg-surface hover:border-sage/50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-6 font-medium">Plutôt…</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ["matin", "Le matin"],
                ["apres-midi", "L'après-midi"],
                ["soir", "Le soir"],
              ].map(([v, l]) => (
                <Chip key={v} selected={moment === v} onClick={() => setMoment(v)}>
                  {l}
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>

      <button onClick={next} disabled={!canNext} className="btn btn-primary mt-10 w-full sm:w-auto">
        {step === steps.length - 1 ? "Voir les formules" : "Continuer"}
      </button>
    </div>
  );
}
