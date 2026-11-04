"use client";

import Link from "next/link";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { DEMO_TODAY, getPatient, orthophoniste, pendingActivities, summarizeToReview } from "@/lib/data";
import { useActivityReviews, useAppointments, usePatientsWeek } from "@/lib/store";
import { addDays, fmtDayLong, parseDay } from "@/lib/dates";
import { Logo } from "@/components/ui";
import { AlertBadge, AppointmentRow, PatientAvatar, SectionTitle, ToReviewList, patientAlerts } from "@/components/pro";

export default function ProDashboard() {
  const weeks = usePatientsWeek();
  const { appointments } = useAppointments();
  const { reviews } = useActivityReviews();

  const assigned = weeks.reduce((n, w) => n + w.programme.length, 0);
  const done = weeks.reduce((n, w) => n + w.doneCount, 0);
  const tomorrow = addDays(DEMO_TODAY, 1);
  const soon = appointments
    .filter((a) => a.start.slice(0, 10) >= DEMO_TODAY && a.start.slice(0, 10) <= tomorrow)
    .sort((a, b) => a.start.localeCompare(b.start));
  const todayCount = soon.filter((a) => a.start.startsWith(DEMO_TODAY)).length;
  const toValidate = pendingActivities.filter((a) => !reviews[a.id]).length;

  const flagged = weeks
    .map((w) => ({ week: w, alerts: patientAlerts(w) }))
    .filter((f) => f.alerts.length > 0)
    .sort((a, b) => b.alerts.filter((x) => x.level === "brick").length - a.alerts.filter((x) => x.level === "brick").length);

  // Résumé des activités non réussies : cette semaine + les deux précédentes, tous patients.
  const threeWeeksAgo = addDays(DEMO_TODAY, -21);
  const toReview = summarizeToReview(
    weeks.flatMap((w) =>
      [...w.weekItems, ...w.patient.history]
        .filter((item) => item.feedback.date.slice(0, 10) >= threeWeeksAgo)
        .map((item) => ({ patient: w.patient, item })),
    ),
  );

  return (
    <div>
      <div className="mb-6 md:hidden">
        <Logo />
      </div>
      <p className="text-sm font-medium text-muted first-letter:uppercase">
        {fmtDayLong.format(parseDay(DEMO_TODAY))}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Bonjour {orthophoniste.firstName}</h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <Stat value={weeks.length} label="patients suivis" />
        <Stat value={`${done}/${assigned}`} label="activités faites cette semaine" tone="honey" />
        <Stat value={todayCount} label={`rendez-vous aujourd'hui`} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-8">
          <section>
            <SectionTitle title="À surveiller" href="/pro/patients" linkLabel="Tous les patients" />
            {flagged.length === 0 ? (
              <p className="card p-5 text-muted">Tout va bien : aucun patient ne demande d&apos;attention particulière.</p>
            ) : (
              <ul className="card divide-y divide-line">
                {flagged.map(({ week, alerts }) => (
                  <li key={week.patient.id}>
                    <Link
                      href={`/pro/patients/${week.patient.id}`}
                      className="flex items-center gap-4 p-4 transition hover:bg-sage-soft/40"
                    >
                      <PatientAvatar patient={week.patient} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">
                          {week.patient.firstName}{" "}
                          <span className="font-normal text-muted">· {week.patient.age} ans</span>
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {alerts.map((a) => (
                            <AlertBadge key={a.text} alert={a} />
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <SectionTitle title="Activités à revoir" />
            <p className="-mt-2 mb-3 text-sm text-muted">
              Les activités notées « mitigé » ou « difficile » par les parents ces trois dernières semaines.
            </p>
            <ToReviewList items={toReview} />
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section>
            <SectionTitle title="Aujourd'hui et demain" href="/pro/agenda" linkLabel="Agenda" />
            {soon.length === 0 ? (
              <p className="card p-5 text-muted">Aucun rendez-vous prévu.</p>
            ) : (
              <div className="card divide-y divide-line">
                {soon.slice(0, 5).map((a) => (
                  <AppointmentRow key={a.id} appointment={a} patient={getPatient(a.patientId)} showDay />
                ))}
                {soon.length > 5 && (
                  <Link href="/pro/agenda" className="block p-4 text-sm font-semibold text-sage hover:bg-sage-soft/40">
                    + {soon.length - 5} autres rendez-vous
                  </Link>
                )}
              </div>
            )}
          </section>

          <Link
            href="/pro/bibliotheque?onglet=a-valider"
            className="flex items-center gap-4 rounded-[1.25rem] bg-honey-soft p-5 transition hover:bg-honey-soft/70"
          >
            <ClipboardCheck className="h-6 w-6 shrink-0 text-honey-ink" aria-hidden />
            <div className="flex-1">
              <p className="font-display font-bold text-honey-ink">
                {toValidate > 0
                  ? `${toValidate} activité${toValidate > 1 ? "s" : ""} à valider`
                  : "Bibliothèque à jour"}
              </p>
              <p className="text-sm">
                {toValidate > 0 ? "Proposées par l'équipe Parentons." : "Toutes les propositions ont été relues."}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-honey-ink" aria-hidden />
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label, tone = "sage" }: { value: number | string; label: string; tone?: "sage" | "honey" }) {
  return (
    <div className="card p-4 sm:p-5">
      <p className={`font-display text-3xl font-extrabold sm:text-4xl ${tone === "sage" ? "text-sage" : "text-honey-ink"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted sm:text-sm">{label}</p>
    </div>
  );
}
