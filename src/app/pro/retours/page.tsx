"use client";

import Link from "next/link";
import { useState } from "react";
import type { Result } from "@/lib/data";
import { getActivity, resultLabels, summarizeToReview } from "@/lib/data";
import { usePatientsWeek } from "@/lib/store";
import { fmtDate } from "@/lib/dates";
import { Logo, PageHeader, ResultPill } from "@/components/ui";
import { PatientAvatar, SectionTitle, ToReviewList } from "@/components/pro";

const filters: (Result | null)[] = [null, "difficile", "moyen", "reussi"];

export default function Retours() {
  const weeks = usePatientsWeek();
  const [filter, setFilter] = useState<Result | null>(null);

  // Tous les retours des parents, du plus récent au plus ancien.
  const all = weeks
    .flatMap((w) => [...w.weekItems, ...w.patient.history].map((item) => ({ patient: w.patient, item })))
    .sort((a, b) => b.item.feedback.date.localeCompare(a.item.feedback.date));
  const hardest = summarizeToReview(all).slice(0, 5);
  const rows = all.filter(({ item }) => !filter || item.feedback.result === filter);

  const count = (r: Result | null) => (r ? all.filter(({ item }) => item.feedback.result === r).length : all.length);

  return (
    <div>
      <div className="mb-6 md:hidden">
        <Logo />
      </div>
      <PageHeader title="Retours" subtitle="Ce que les parents disent des activités faites à la maison." />

      <section className="mb-10">
        <SectionTitle title="Activités les plus difficiles" />
        <p className="-mt-2 mb-3 text-sm text-muted">
          Le classement de tous vos patients : un retour « difficile » compte double par rapport à un « mitigé ».
        </p>
        <ToReviewList
          items={hardest}
          ranked
          empty="Rien à signaler pour l'instant : toutes les activités ont été réussies."
        />
      </section>

      <SectionTitle title="Tous les retours" />
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((r) => (
          <button
            key={r ?? "tous"}
            type="button"
            aria-pressed={filter === r}
            onClick={() => setFilter(r)}
            className={`rounded-full border-[1.5px] px-3 py-1.5 text-sm font-medium transition ${
              filter === r ? "border-sage bg-sage-soft text-sage" : "border-line text-muted hover:text-ink"
            }`}
          >
            {r ? resultLabels[r] : "Tous"} ({count(r)})
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="card p-5 text-muted">
          {filter
            ? `Aucun retour « ${resultLabels[filter].toLowerCase()} » pour l'instant.`
            : "Aucun retour pour l'instant. Ils apparaîtront ici dès qu'un parent aura terminé une activité."}
        </p>
      ) : (
        <ul className="card divide-y divide-line">
          {rows.map(({ patient, item: { id, feedback } }, i) => (
            <li key={`${patient.id}-${id}-${feedback.date}-${i}`}>
              <Link
                href={`/pro/patients/${patient.id}`}
                className="flex gap-3 p-4 transition hover:bg-sage-soft/40 sm:gap-4"
              >
                <PatientAvatar patient={patient} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-display font-bold">{getActivity(id)?.title ?? "Activité"}</p>
                    <ResultPill result={feedback.result} />
                  </div>
                  <p className="text-sm text-muted">
                    {patient.firstName} · {fmtDate.format(new Date(feedback.date))}
                  </p>
                  {feedback.note && <p className="mt-2 text-sm italic">« {feedback.note} »</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
