"use client";

import { getActivity, pastWeeks } from "@/lib/data";
import type { Feedback } from "@/lib/data";
import { child } from "@/lib/data";
import { useProgramme, useWeekFeedback } from "@/lib/store";
import { DomainIcon, PageHeader, ResultPill } from "@/components/ui";

const dayFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export default function Progres() {
  const { feedback } = useWeekFeedback();
  const { programme: thisWeek } = useProgramme("leo");

  const current = {
    label: "Cette semaine",
    items: thisWeek
      .filter((w) => feedback[w.id])
      .map((w) => ({ id: w.id, feedback: feedback[w.id] as Feedback })),
  };
  const weeks = [current, ...pastWeeks];
  const total = weeks.reduce((n, w) => n + w.items.length, 0);
  const fullWeeks = pastWeeks.filter((w) => w.items.length === 3).length + (current.items.length === 3 ? 1 : 0);

  return (
    <div>
      <PageHeader title="Progrès" subtitle={`Le chemin parcouru par ${child.firstName}.`} />

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-5">
          <p className="font-display text-4xl font-extrabold text-sage">{total}</p>
          <p className="mt-1 text-sm text-muted">activités réalisées</p>
        </div>
        <div className="card p-5">
          <p className="font-display text-4xl font-extrabold text-honey-ink">{fullWeeks}</p>
          <p className="mt-1 text-sm text-muted">semaines complètes</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {weeks.map((week) => (
          <section key={week.label}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">{week.label}</h2>
              <span className="flex gap-1" aria-label={`${week.items.length} sur 3`}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ${i < week.items.length ? "bg-honey" : "bg-line"}`}
                  />
                ))}
              </span>
            </div>
            {week.items.length === 0 ? (
              <p className="card p-5 text-muted">Aucune activité faite pour l&apos;instant cette semaine.</p>
            ) : (
              <ul className="card divide-y divide-line">
                {week.items.map(({ id, feedback: fb }) => {
                  const a = getActivity(id)!;
                  return (
                    <li key={id} className="flex gap-4 p-4">
                      <DomainIcon domain={a.domain} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-display font-bold">{a.title}</p>
                          <ResultPill result={fb.result} />
                        </div>
                        <p className="text-sm text-muted first-letter:uppercase">{dayFmt.format(new Date(fb.date))}</p>
                        {fb.note && <p className="mt-2 text-sm italic">« {fb.note} »</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
