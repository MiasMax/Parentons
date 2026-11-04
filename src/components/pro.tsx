import Link from "next/link";
import { AlertTriangle, ChevronRight, MapPin, Video } from "lucide-react";
import type { Appointment, AppointmentType, Patient, ToReview } from "@/lib/data";
import { DEMO_TODAY, getActivity, resultLabels } from "@/lib/data";
import type { PatientWeek } from "@/lib/store";
import { addMinutes, fmtDate, fmtTime } from "@/lib/dates";
import { DomainIcon } from "./ui";

const avatarColors = ["bg-sage text-on-sage", "bg-honey text-on-honey", "bg-sage-soft text-sage", "bg-honey-soft text-honey-ink"];

export function PatientAvatar({ patient, size = "md" }: { patient: Patient; size?: "sm" | "md" | "lg" }) {
  const i = patient.id.charCodeAt(0) % avatarColors.length;
  const cls = { sm: "h-8 w-8 text-sm", md: "h-11 w-11", lg: "h-16 w-16 text-2xl" }[size];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold ${avatarColors[i]} ${cls}`}
      aria-hidden
    >
      {patient.firstName[0]}
    </span>
  );
}

export function WeekDots({ done, total }: { done: number; total: number }) {
  return (
    <span className="flex items-center gap-2 text-sm text-muted">
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < done ? "bg-honey" : "bg-line"}`} />
        ))}
      </span>
      {done}/{total}
    </span>
  );
}

export type Alert = { level: "brick" | "honey"; text: string };

// Ce qui mérite l'attention de l'orthophoniste pour un patient.
export function patientAlerts({ patient, programme, weekItems }: PatientWeek): Alert[] {
  const alerts: Alert[] = [];
  for (const item of weekItems) {
    if (item.feedback.result === "difficile") {
      const n = strugglesCount(item.id, weekItems, patient.history);
      alerts.push({
        level: "brick",
        text: `Difficile : ${getActivity(item.id)?.title}${n >= 2 ? ` (${n} fois sans réussite)` : ""}`,
      });
    }
  }
  if (programme.length > 0 && weekItems.length === 0) {
    alerts.push({ level: "honey", text: "Aucune activité faite cette semaine" });
  }
  const struggles = new Map<string, number>();
  for (const item of [...weekItems, ...patient.history]) {
    if (item.feedback.result !== "reussi") struggles.set(item.id, (struggles.get(item.id) ?? 0) + 1);
  }
  const hardThisWeek = new Set(weekItems.filter((i) => i.feedback.result === "difficile").map((i) => i.id));
  for (const [id, n] of struggles) {
    if (n >= 2 && !hardThisWeek.has(id)) alerts.push({ level: "honey", text: `${getActivity(id)?.title} : pas réussie ${n} fois` });
  }
  return alerts;
}

function strugglesCount(id: string, ...lists: PatientWeek["weekItems"][]) {
  return lists.flat().filter((i) => i.id === id && i.feedback.result !== "reussi").length;
}

export function AlertBadge({ alert }: { alert: Alert }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        alert.level === "brick" ? "bg-brick-soft text-brick" : "bg-honey-soft text-honey-ink"
      }`}
    >
      <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
      {alert.text}
    </span>
  );
}

// Résumé des activités qui n'ont pas été réussies (mitigé ou difficile), regroupées par activité.
export function ToReviewList({
  items,
  showPatient = true,
  empty = "Rien à retravailler pour l'instant : toutes les activités ont été réussies.",
}: {
  items: ToReview[];
  showPatient?: boolean;
  empty?: string;
}) {
  if (items.length === 0) return <p className="card p-5 text-muted">{empty}</p>;
  return (
    <ul className="card divide-y divide-line">
      {items.map(({ activity, difficile, moyen, entries }) => {
        const lastNote = entries.find((e) => e.feedback.note);
        const names = [...new Set(entries.map((e) => e.patient.firstName))];
        return (
          <li key={activity.id} className="flex gap-4 p-4">
            <DomainIcon domain={activity.domain} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display font-bold">{activity.title}</p>
                <span className="flex gap-1.5">
                  {difficile > 0 && (
                    <span className="rounded-full bg-brick-soft px-2.5 py-1 text-xs font-semibold text-brick">
                      {difficile} × {resultLabels.difficile.toLowerCase()}
                    </span>
                  )}
                  {moyen > 0 && (
                    <span className="rounded-full bg-honey-soft px-2.5 py-1 text-xs font-semibold text-honey-ink">
                      {moyen} × {resultLabels.moyen.toLowerCase()}
                    </span>
                  )}
                </span>
              </div>
              <p className="text-sm text-muted">
                {activity.domain}
                {showPatient && <> · {names.join(", ")}</>}
              </p>
              {lastNote && (
                <p className="mt-2 text-sm">
                  <span className="italic">« {lastNote.feedback.note} »</span>
                  <span className="text-muted">
                    {" "}
                    · {showPatient ? `parent de ${lastNote.patient.firstName}, ` : ""}
                    {fmtDate.format(new Date(lastNote.feedback.date))}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const typeStyle: Record<AppointmentType, string> = {
  Séance: "bg-sage-soft text-sage",
  Bilan: "bg-honey-soft text-honey-ink",
  "Point parent": "border border-line text-ink",
};

export function AppointmentRow({
  appointment,
  patient,
  showDay = false,
  action,
}: {
  appointment: Appointment;
  patient?: Patient;
  showDay?: boolean;
  action?: React.ReactNode;
}) {
  const start = new Date(appointment.start);
  const end = addMinutes(appointment.start, appointment.duration);
  const isToday = appointment.start.slice(0, 10) === DEMO_TODAY;
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="w-14 shrink-0 pt-0.5 text-right">
        <p className="font-display font-bold leading-tight">{fmtTime.format(start)}</p>
        <p className="text-xs text-muted">{fmtTime.format(end)}</p>
      </div>
      <div className="min-w-0 flex-1 border-l-2 border-line pl-3">
        <div className="flex flex-wrap items-center gap-2">
          {patient ? (
            <Link href={`/pro/patients/${patient.id}`} className="font-bold hover:text-sage hover:underline">
              {patient.firstName}
            </Link>
          ) : (
            <span className="font-bold">{appointment.name ?? "Patient"}</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeStyle[appointment.type]}`}>
            {appointment.type}
          </span>
          {showDay && (
            <span className="text-sm text-muted">
              {isToday ? "Aujourd'hui" : fmtDate.format(start)}
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
          {appointment.place === "Visio" ? (
            <Video className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <MapPin className="h-3.5 w-3.5" aria-hidden />
          )}
          {appointment.place} · {appointment.duration} min
        </p>
        {appointment.note && <p className="mt-1 text-sm">{appointment.note}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center text-sm font-semibold text-sage hover:underline">
          {linkLabel} <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
