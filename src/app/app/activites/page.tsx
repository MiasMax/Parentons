"use client";

import { Check, ChevronRight } from "lucide-react";
import { getActivity, pastWeeks } from "@/lib/data";
import { useProgramme, useWeekFeedback } from "@/lib/store";
import { ActivityRow, PageHeader, ResultPill } from "@/components/ui";

export default function Activites() {
  const { feedback } = useWeekFeedback();
  const { programme: thisWeek } = useProgramme("leo");

  return (
    <div>
      <PageHeader
        title="Activités"
        subtitle="3 activités par semaine, à faire quand vous voulez."
      />

      <section>
        <h2 className="mb-3 text-xl font-bold">Cette semaine</h2>
        <div className="flex flex-col gap-3">
          {thisWeek.map((w) => {
            const fb = feedback[w.id];
            return (
              <ActivityRow
                key={w.id}
                activity={getActivity(w.id)!}
                right={
                  fb ? (
                    <span className="flex items-center gap-2">
                      <ResultPill result={fb.result} />
                      <Check className="h-5 w-5 text-sage" strokeWidth={3} aria-label="Faite" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-medium text-muted">
                      {w.day} <ChevronRight className="h-4 w-4" aria-hidden />
                    </span>
                  )
                }
              />
            );
          })}
        </div>
      </section>

      {pastWeeks.map((week) => (
        <section key={week.label} className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-muted">{week.label}</h2>
          <div className="flex flex-col gap-3">
            {week.items.map((item) => (
              <ActivityRow
                key={item.id}
                activity={getActivity(item.id)!}
                right={<ResultPill result={item.feedback.result} />}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
