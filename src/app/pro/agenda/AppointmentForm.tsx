"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Appointment, AppointmentType } from "@/lib/data";
import { DEMO_TODAY, appointmentName, appointmentTypes, patients } from "@/lib/data";
import { addMinutes, fmtDayLong, parseDay } from "@/lib/dates";

const OTHER = "__autre";

export function AppointmentForm({
  existing,
  initial,
  onSave,
  onClose,
}: {
  existing: Appointment[];
  initial: { patientId: string; date: string; time: string };
  onSave: (a: Omit<Appointment, "id">) => void;
  onClose: () => void;
}) {
  const [patientId, setPatientId] = useState(initial.patientId);
  const [name, setName] = useState("");
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [duration, setDuration] = useState(45);
  const [type, setType] = useState<AppointmentType>("Séance");
  const [place, setPlace] = useState<Appointment["place"]>("Cabinet");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const firstField = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const start = `${date}T${time}:00`;
  const end = addMinutes(start, duration).getTime();
  const conflict = existing.find((a) => {
    const s = new Date(a.start).getTime();
    return s < end && new Date(start).getTime() < s + a.duration * 60000;
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return setError("Choisissez le patient concerné.");
    if (patientId === OTHER && !name.trim()) return setError("Indiquez le nom du patient.");
    if (!date || date < DEMO_TODAY) return setError("Choisissez une date à partir d'aujourd'hui.");
    onSave({
      patientId: patientId === OTHER ? "" : patientId,
      name: patientId === OTHER ? name.trim() : undefined,
      start,
      duration,
      type,
      place,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fermer" onClick={onClose} />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="rdv-title"
        noValidate
        onSubmit={submit}
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[1.25rem] bg-surface p-5 shadow-xl sm:max-w-lg sm:rounded-[1.25rem] sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="rdv-title" className="text-xl font-extrabold">
              Nouveau rendez-vous
            </h2>
            {date && <p className="text-sm text-muted first-letter:uppercase">{fmtDayLong.format(parseDay(date))}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-sage-soft hover:text-ink"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Patient" htmlFor="rdv-patient" className={patientId === OTHER ? "" : "sm:col-span-2"}>
            <select
              ref={firstField}
              id="rdv-patient"
              className="field"
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                setError("");
              }}
            >
              <option value="">Choisir…</option>
              <optgroup label="Suivis avec Parentons">
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} ({p.age} ans)
                  </option>
                ))}
              </optgroup>
              <option value={OTHER}>Autre patient du cabinet…</option>
            </select>
          </Field>
          {patientId === OTHER && (
            <Field label="Nom du patient" htmlFor="rdv-name">
              <input
                id="rdv-name"
                className="field"
                placeholder="Ex. : Hugo R."
                autoComplete="off"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </Field>
          )}
          <Field label="Date" htmlFor="rdv-date">
            <input
              id="rdv-date"
              type="date"
              className="field"
              min={DEMO_TODAY}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heure" htmlFor="rdv-time">
              <input id="rdv-time" type="time" step={900} className="field" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
            <Field label="Durée" htmlFor="rdv-duration">
              <select id="rdv-duration" className="field" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                {[30, 45, 60, 90].map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Motif" htmlFor="rdv-type">
            <select id="rdv-type" className="field" value={type} onChange={(e) => setType(e.target.value as AppointmentType)}>
              {appointmentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">Lieu</legend>
            <div className="flex gap-2">
              {(["Cabinet", "Visio"] as const).map((p) => (
                <label
                  key={p}
                  className={`flex-1 cursor-pointer rounded-full border-[1.5px] px-4 py-2.5 text-center text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sage ${
                    place === p ? "border-sage bg-sage-soft text-sage" : "border-line text-muted"
                  }`}
                >
                  <input type="radio" name="place" value={p} checked={place === p} onChange={() => setPlace(p)} className="sr-only" />
                  {p}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Note (facultatif)" htmlFor="rdv-note" className="sm:col-span-2">
            <input
              id="rdv-note"
              className="field"
              placeholder="Ex. : apporter le cahier de suivi"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </div>

        {conflict && (
          <p className="mt-4 rounded-xl bg-honey-soft px-4 py-3 text-sm text-honey-ink">
            Ce créneau chevauche le rendez-vous de {appointmentName(conflict)} à {conflict.start.slice(11, 16)}.
          </p>
        )}
        {error && (
          <p className="mt-4 text-sm font-semibold text-brick" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Ajouter le rendez-vous
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
