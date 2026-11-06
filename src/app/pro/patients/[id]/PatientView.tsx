"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarPlus, Check, Mail, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import {
  DEMO_TODAY,
  activities,
  getActivity,
  getPatient,
  pendingActivities,
  summarizeToReview,
  weekDays,
} from "@/lib/data";
import { useActivityReviews, useAppointments, usePatientsWeek, useProgramme, useProNote } from "@/lib/store";
import { fmtDate, fmtDayLong } from "@/lib/dates";
import { DomainIcon, Duration, ResultPill } from "@/components/ui";
import { AlertBadge, AppointmentRow, PatientAvatar, SectionTitle, ToReviewList, WeekDots, patientAlerts } from "@/components/pro";

export function PatientView({ id }: { id: string }) {
  const patient = getPatient(id)!;
  const week = usePatientsWeek().find((w) => w.patient.id === id)!;
  const { setProgramme } = useProgramme(id);
  const { appointments } = useAppointments();
  const { reviews } = useActivityReviews();

  const { programme, weekFeedback, weekItems, doneCount } = week;
  const alerts = patientAlerts(week);
  const allItems = [...weekItems, ...patient.history].sort((a, b) => b.feedback.date.localeCompare(a.feedback.date));
  const toReview = summarizeToReview(allItems.map((item) => ({ patient, item })));
  const upcoming = appointments
    .filter((a) => a.patientId === id && a.start.slice(0, 10) >= DEMO_TODAY)
    .sort((a, b) => a.start.localeCompare(b.start));

  const assignable = [...activities, ...pendingActivities.filter((a) => reviews[a.id]?.status === "validee")].filter(
    (a) => !programme.some((p) => p.id === a.id),
  );

  return (
    <div>
      <Link href="/pro/patients" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Patients
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PatientAvatar patient={patient} size="lg" />
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold">
            {patient.firstName} <span className="text-xl font-bold text-muted">· {patient.age} ans</span>
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>Parent : {patient.parentName}</span>
            <a href={`mailto:${patient.parentEmail}`} className="inline-flex items-center gap-1 hover:text-sage">
              <Mail className="h-3.5 w-3.5" aria-hidden /> {patient.parentEmail}
            </a>
            <span>Suivi depuis le {fmtDate.format(new Date(patient.since))}</span>
          </p>
          {alerts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {alerts.map((a) => (
                <AlertBadge key={a.text} alert={a} />
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-8">
          {/* Programme de la semaine */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Programme de la semaine</h2>
              <WeekDots done={doneCount} total={programme.length} />
            </div>
            <ul className="card divide-y divide-line">
              {programme.length === 0 && (
                <li className="p-5 text-muted">Aucune activité assignée. Ajoutez-en une ci-dessous.</li>
              )}
              {programme.map((item) => {
                const activity = getActivity(item.id);
                if (!activity) return null;
                const fb = weekFeedback[item.id];
                return (
                  <li key={item.id} className="flex gap-4 p-4">
                    <DomainIcon domain={activity.domain} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display font-bold">{activity.title}</p>
                        {fb ? (
                          <ResultPill result={fb.result} />
                        ) : (
                          <span className="text-xs font-semibold text-muted">Pas encore faite</span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <Duration minutes={activity.duration} />
                        <label className="flex items-center gap-1.5 text-sm text-muted">
                          <span className="sr-only">Jour conseillé pour {activity.title}</span>
                          <select
                            className="rounded-lg border border-line bg-surface px-2 py-1 text-sm text-ink"
                            value={item.day}
                            disabled={!!fb}
                            onChange={(e) =>
                              setProgramme(programme.map((p) => (p.id === item.id ? { ...p, day: e.target.value } : p)))
                            }
                          >
                            {weekDays.map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      {fb?.note && <p className="mt-2 text-sm italic">« {fb.note} »</p>}
                    </div>
                    {!fb && (
                      <button
                        type="button"
                        className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full text-muted transition hover:bg-brick-soft hover:text-brick"
                        aria-label={`Retirer ${activity.title} du programme`}
                        onClick={() => setProgramme(programme.filter((p) => p.id !== item.id))}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            <AddActivity
              options={assignable}
              onAdd={(activityId, day) => setProgramme([...programme, { id: activityId, day }])}
              disabled={programme.length >= 5}
            />
            {id === "leo" && (
              <p className="mt-2 text-xs text-muted">
                Démo : les changements apparaissent tout de suite dans l&apos;espace parent de Sophie.
              </p>
            )}
          </section>

          {/* Résumé des activités non réussies */}
          <section>
            <SectionTitle title="À retravailler" />
            <p className="-mt-2 mb-3 text-sm text-muted">
              Les activités que {patient.firstName} n&apos;a pas réussies, avec la dernière remarque du parent.
            </p>
            <ToReviewList
              items={toReview}
              showPatient={false}
              empty={`${patient.firstName} a réussi toutes ses activités jusqu'ici.`}
            />
          </section>

          {/* Historique */}
          <section>
            <SectionTitle title="Tous les retours du parent" />
            {allItems.length === 0 ? (
              <p className="card p-5 text-muted">Pas encore de retour.</p>
            ) : (
              <ul className="card divide-y divide-line">
                {allItems.map(({ id: activityId, feedback }, i) => {
                  const a = getActivity(activityId);
                  if (!a) return null;
                  return (
                    <li key={`${activityId}-${feedback.date}-${i}`} className="flex items-start gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{a.title}</p>
                        <p className="text-sm text-muted first-letter:uppercase">
                          {fmtDayLong.format(new Date(feedback.date))}
                        </p>
                        {feedback.note && <p className="mt-1 text-sm italic">« {feedback.note} »</p>}
                      </div>
                      <ResultPill result={feedback.result} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="card p-5">
            <h2 className="text-lg font-bold">Diagnostic</h2>
            <p className="mt-2 text-sm">{patient.diagnosis}</p>
            <h3 className="mt-4 text-sm font-semibold text-muted">Difficultés travaillées</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {patient.difficulties.map((d) => (
                <li key={d} className="rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-sage">
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <NoteToParent patientId={id} parentFirstName={patient.parentName.split(" ")[0]} />

          <section>
            <SectionTitle title="Rendez-vous" href={`/pro/agenda?patient=${id}`} linkLabel="Agenda" />
            <div className="card divide-y divide-line">
              {upcoming.length === 0 ? (
                <p className="p-4 text-sm text-muted">Aucun rendez-vous prévu.</p>
              ) : (
                upcoming.map((a) => <AppointmentRow key={a.id} appointment={a} patient={patient} showDay />)
              )}
              <Link
                href={`/pro/agenda?patient=${id}&nouveau=1`}
                className="flex items-center gap-2 p-4 text-sm font-semibold text-sage hover:bg-sage-soft/40"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden /> Planifier un rendez-vous
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function AddActivity({
  options,
  onAdd,
  disabled,
}: {
  options: { id: string; title: string; domain: string }[];
  onAdd: (id: string, day: string) => void;
  disabled: boolean;
}) {
  const [activityId, setActivityId] = useState("");
  const [day, setDay] = useState("Samedi");

  if (disabled) {
    return <p className="mt-3 text-sm text-muted">5 activités maximum par semaine : retirez-en une pour en ajouter.</p>;
  }

  return (
    <form
      className="mt-3 flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        if (!activityId) return;
        onAdd(activityId, day);
        setActivityId("");
      }}
    >
      <label className="flex-1">
        <span className="sr-only">Activité à ajouter</span>
        <select className="field" value={activityId} onChange={(e) => setActivityId(e.target.value)}>
          <option value="">Choisir une activité…</option>
          {options.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} ({a.domain})
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Jour conseillé</span>
        <select className="field sm:w-36" value={day} onChange={(e) => setDay(e.target.value)}>
          {weekDays.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary" disabled={!activityId}>
        <Plus className="h-4 w-4" aria-hidden /> Assigner
      </button>
      <button type="button" className="btn btn-ghost">
        <Sparkles className="h-4 w-4" aria-hidden /> Créer avec l&apos;IA
      </button>
    </form>
  );
}

function NoteToParent({ patientId, parentFirstName }: { patientId: string; parentFirstName: string }) {
  const { note, setNote } = useProNote(patientId);
  const [draft, setDraft] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const text = draft ?? note?.text ?? "";

  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold">Un mot pour {parentFirstName}</h2>
      <p className="mt-1 text-sm text-muted">Affiché sur l&apos;accueil de son espace parent.</p>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          const value = text.trim();
          if (!value) return;
          setNote({ text: value, date: new Date().toISOString() });
          setDraft(null);
          setSent(true);
        }}
      >
        <label htmlFor={`note-${patientId}`} className="sr-only">
          Message au parent
        </label>
        <textarea
          id={`note-${patientId}`}
          className="field min-h-28 resize-y"
          placeholder="Ex. : Bravo pour la régularité ! Cette semaine, insistez sur…"
          value={text}
          onChange={(e) => {
            setDraft(e.target.value);
            setSent(false);
          }}
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted" aria-live="polite">
            {sent ? (
              <span className="inline-flex items-center gap-1 font-semibold text-sage">
                <Check className="h-3.5 w-3.5" aria-hidden /> Envoyé
              </span>
            ) : note ? (
              `Dernier envoi le ${fmtDate.format(new Date(note.date))}`
            ) : null}
          </p>
          <button type="submit" className="btn btn-primary !px-4 !py-2" disabled={!text.trim()}>
            <Send className="h-4 w-4" aria-hidden /> Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}
