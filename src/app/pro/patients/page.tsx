"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, ChevronRight, Search } from "lucide-react";
import { DEMO_TODAY } from "@/lib/data";
import { useAppointments, usePatientsWeek } from "@/lib/store";
import { fmtDate } from "@/lib/dates";
import { Logo, PageHeader } from "@/components/ui";
import { AlertBadge, PatientAvatar, WeekDots, patientAlerts } from "@/components/pro";

export default function Patients() {
  const weeks = usePatientsWeek();
  const { appointments } = useAppointments();
  const [query, setQuery] = useState("");

  const assigned = weeks.reduce((n, w) => n + w.programme.length, 0);
  const done = weeks.reduce((n, w) => n + w.doneCount, 0);

  // Les patients à surveiller d'abord : alertes « brick », puis les autres alertes.
  const weight = (alerts: ReturnType<typeof patientAlerts>) =>
    alerts.reduce((n, a) => n + (a.level === "brick" ? 10 : 1), 0);
  const q = query.trim().toLowerCase();
  const rows = weeks
    .filter(
      ({ patient }) =>
        !q || patient.firstName.toLowerCase().includes(q) || patient.parentName.toLowerCase().includes(q),
    )
    .map((week) => ({ week, alerts: patientAlerts(week) }))
    .sort((a, b) => weight(b.alerts) - weight(a.alerts));

  return (
    <div>
      <div className="mb-6 md:hidden">
        <Logo />
      </div>
      <PageHeader
        title="Patients"
        subtitle={`${weeks.length} enfants suivis avec Parentons · ${done}/${assigned} activités faites cette semaine.`}
      />

      <label className="relative mb-4 block">
        <span className="sr-only">Rechercher un patient</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          className="field !pl-10"
          placeholder="Rechercher un enfant ou un parent…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {rows.length === 0 ? (
        <p className="card p-5 text-muted">Aucun patient ne correspond à « {query.trim()} ».</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map(({ week, alerts }) => {
            const { patient, programme, doneCount } = week;
            const next = appointments
              .filter((a) => a.patientId === patient.id && a.start.slice(0, 10) >= DEMO_TODAY)
              .sort((a, b) => a.start.localeCompare(b.start))[0];
            return (
              <li key={patient.id}>
                <Link
                  href={`/pro/patients/${patient.id}`}
                  className="card flex flex-col gap-3 p-4 transition hover:border-sage sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <PatientAvatar patient={patient} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg font-bold">
                        {patient.firstName} <span className="text-base font-normal text-muted">· {patient.age} ans</span>
                      </p>
                      <p className="truncate text-sm text-muted">{patient.diagnosis}</p>
                      {alerts.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {alerts.map((a) => (
                            <AlertBadge key={a.text} alert={a} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-line pt-3 sm:w-56 sm:border-0 sm:pt-0">
                    <div className="flex flex-col gap-1">
                      <WeekDots done={doneCount} total={programme.length} />
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                        {next ? `RDV le ${fmtDate.format(new Date(next.start))}` : "Pas de RDV prévu"}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
