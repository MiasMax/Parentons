"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CalendarClock, History, MapPin, Plus, Trash2, Video, X } from "lucide-react";
import type { Appointment } from "@/lib/data";
import { DEMO_TODAY, appointmentName, getPatient } from "@/lib/data";
import { addMinutes, fmtDayLong, fmtTime, fmtWeekday, fmtWeekdayShort, parseDay } from "@/lib/dates";
import { HOUR_END, HOUR_PX, HOUR_START, typeTone } from "./tones";

const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
const gridHeight = (HOUR_END - HOUR_START) * HOUR_PX;

function minutesOf(iso: string) {
  return Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16));
}

// Répartit les RDV qui se chevauchent sur plusieurs colonnes, côte à côte.
function layoutDay(items: Appointment[]) {
  const sorted = [...items].sort((a, b) => a.start.localeCompare(b.start));
  const placed: { a: Appointment; lane: number; lanes: number }[] = [];
  let cluster: typeof placed = [];
  let clusterEnd = -1;
  const laneEnds: number[] = [];

  const flush = () => {
    const lanes = Math.max(1, ...cluster.map((c) => c.lane + 1));
    cluster.forEach((c) => (c.lanes = lanes));
    placed.push(...cluster);
    cluster = [];
    laneEnds.length = 0;
  };

  for (const a of sorted) {
    const start = minutesOf(a.start);
    const end = start + a.duration;
    if (start >= clusterEnd && cluster.length) flush();
    let lane = laneEnds.findIndex((e) => e <= start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = end;
    cluster.push({ a, lane, lanes: 1 });
    clusterEnd = Math.max(clusterEnd, end);
  }
  if (cluster.length) flush();
  return placed;
}

export function TimeGrid({
  days,
  appointments,
  all,
  selectedId,
  onSelect,
  onCreate,
  onCancel,
}: {
  days: string[];
  appointments: Appointment[];
  all: Appointment[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (day: string, time?: string) => void;
  onCancel: (a: Appointment) => void;
}) {
  const compact = days.length > 5;
  const colMin = days.length === 1 ? 0 : compact ? 104 : 140;
  const cols = `56px repeat(${days.length}, minmax(${colMin}px, 1fr))`;

  return (
    <div className="card overflow-hidden">
      {/* La grille défile dans sa carte : les jours restent visibles en haut. */}
      <div className="overflow-auto md:max-h-[calc(100vh-10rem)]">
        <div style={{ minWidth: colMin ? 56 + days.length * colMin : undefined }}>
          {/* En-têtes des jours */}
          <div
            className="sticky top-0 z-30 grid border-b border-line bg-surface"
            style={{ gridTemplateColumns: cols }}
          >
            <div />
            {days.map((day) => {
              const list = appointments.filter((a) => a.start.startsWith(day));
              const isToday = day === DEMO_TODAY;
              const date = parseDay(day);
              return (
                <div
                  key={day}
                  className={`flex items-center gap-2 border-l border-line px-3 py-3 ${isToday ? "bg-honey-soft/60" : ""}`}
                >
                  <span
                    className={`font-display text-3xl font-extrabold leading-none ${isToday ? "text-honey-ink" : ""}`}
                  >
                    {date.getDate()}
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-sm font-semibold first-letter:uppercase">
                      {(compact ? fmtWeekdayShort : fmtWeekday).format(date)}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {list.length} RDV
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onCreate(day)}
                    className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-sage-soft hover:text-sage ${compact ? "hidden" : "flex"}`}
                    aria-label={`Nouveau rendez-vous le ${fmtDayLong.format(date)}`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Grille horaire */}
          <div className="grid" style={{ gridTemplateColumns: cols }}>
            <div className="relative" style={{ height: gridHeight }}>
              {hours.map((h) => (
                <span
                  key={h}
                  className="absolute right-2 -translate-y-1/2 text-xs font-medium text-muted first:translate-y-0"
                  style={{ top: (h - HOUR_START) * HOUR_PX }}
                >
                  {h} h
                </span>
              ))}
            </div>

            {days.map((day, dayIndex) => {
              const isToday = day === DEMO_TODAY;
              const placed = layoutDay(appointments.filter((a) => a.start.startsWith(day)));
              const alignRight = days.length > 2 && dayIndex >= days.length - 2;
              return (
                <div
                  key={day}
                  className={`relative border-l border-line ${isToday ? "bg-honey-soft/25" : ""}`}
                  style={{
                    height: gridHeight,
                    backgroundImage:
                      "linear-gradient(to bottom, var(--line) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--line) 45%, transparent) 1px, transparent 1px)",
                    backgroundSize: `100% ${HOUR_PX}px, 100% ${HOUR_PX / 2}px`,
                  }}
                >
                  {/* Créneaux cliquables (souris) — le bouton « + » et « Nouveau RDV » couvrent le clavier */}
                  {Array.from({ length: (HOUR_END - HOUR_START) * 2 }, (_, i) => {
                    const minutes = HOUR_START * 60 + i * 30;
                    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
                    return (
                      <button
                        key={time}
                        type="button"
                        tabIndex={-1}
                        aria-hidden
                        onClick={() => onCreate(day, time)}
                        className="absolute inset-x-0 hover:bg-sage-soft/50"
                        style={{ top: i * (HOUR_PX / 2), height: HOUR_PX / 2 }}
                      />
                    );
                  })}

                  {placed.map(({ a, lane, lanes }) => {
                    const top = ((minutesOf(a.start) - HOUR_START * 60) / 60) * HOUR_PX;
                    const height = Math.max((a.duration / 60) * HOUR_PX - 6, 26);
                    const width = 100 / lanes;
                    const selected = selectedId === a.id;
                    const name = appointmentName(a);
                    const short = a.duration < 30;
                    return (
                      <div key={a.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(selected ? null : a.id)}
                          aria-expanded={selected}
                          aria-label={`${name}, ${a.type}, ${fmtTime.format(new Date(a.start))}, ${a.duration} minutes`}
                          className={`absolute z-10 overflow-hidden rounded-lg border border-line border-l-4 px-2.5 text-left text-sm leading-tight transition hover:z-20 hover:shadow-md ${short ? "py-0.5" : "py-1"} ${
                            typeTone[a.type].block
                          } ${selected ? "z-20 ring-2 ring-sage" : ""}`}
                          style={{
                            top: top + 3,
                            height,
                            left: `calc(${lane * width}% + 4px)`,
                            width: `calc(${width}% - 8px)`,
                          }}
                        >
                          <span className="flex items-center gap-1">
                            <span className="truncate font-bold">{name}</span>
                            {a.patientId && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage" title="Utilise Parentons" />
                            )}
                            {a.place === "Visio" && <Video className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden />}
                          </span>
                          {!short && (
                            <span className="block truncate text-xs text-muted">
                              {a.start.slice(11, 16)}
                              {/* En vue 7 jours, « Séance » (le cas courant) ne tient pas : la couleur et la fiche le disent. */}
                              {!(compact && a.type === "Séance") && ` · ${a.type}`}
                            </span>
                          )}
                        </button>
                        {selected && (
                          <Popover
                            appointment={a}
                            all={all}
                            position={
                              top + height + 330 > gridHeight
                                ? { bottom: gridHeight - top + 6 }
                                : { top: top + height + 6 }
                            }
                            alignRight={alignRight}
                            onClose={() => onSelect(null)}
                            onCancel={() => onCancel(a)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Popover({
  appointment: a,
  all,
  position,
  alignRight,
  onClose,
  onCancel,
}: {
  appointment: Appointment;
  all: Appointment[];
  position: { top: number } | { bottom: number };
  alignRight: boolean;
  onClose: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // La grille défile : on ramène la fiche dans la zone visible à l'ouverture.
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => dialog.current?.scrollIntoView({ block: "nearest" }), []);

  const patient = getPatient(a.patientId);
  const name = appointmentName(a);
  const same = all
    .filter((x) => (a.patientId ? x.patientId === a.patientId : x.name === a.name))
    .sort((x, y) => x.start.localeCompare(y.start));
  const i = same.findIndex((x) => x.id === a.id);
  const previous = same[i - 1];
  const next = same[i + 1];
  const start = new Date(a.start);
  const end = addMinutes(a.start, a.duration);
  const when = (x: Appointment) => `${fmtDayLong.format(new Date(x.start))} à ${fmtTime.format(new Date(x.start))}`;

  return (
    <>
      <button type="button" className="fixed inset-0 z-30 cursor-default" aria-label="Fermer" onClick={onClose} />
      <div
        ref={dialog}
        role="dialog"
        aria-label={`Rendez-vous de ${name}`}
        className={`absolute z-40 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl ${
          alignRight ? "right-1" : "left-1"
        }`}
        style={position}
      >
        <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${typeTone[a.type].header}`}>
          <p className="truncate font-display font-bold">
            {name} <span className="font-sans text-sm font-medium opacity-80">· {a.type}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-4 text-sm">
          <div>
            <p className="font-semibold first-letter:uppercase">{fmtDayLong.format(start)}</p>
            <p className="flex items-center gap-1.5 text-muted">
              {fmtTime.format(start)} – {fmtTime.format(end)} ·
              {a.place === "Visio" ? <Video className="h-3.5 w-3.5" aria-hidden /> : <MapPin className="h-3.5 w-3.5" aria-hidden />}
              {a.place}
            </p>
            {a.note && <p className="mt-1">{a.note}</p>}
          </div>
          <div className="grid gap-2 border-t border-line pt-3">
            <p className="flex items-start gap-2">
              <History className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
              <span>
                <span className="block text-xs font-semibold text-muted">Dernier RDV</span>
                {previous ? when(previous) : "Premier rendez-vous"}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
              <span>
                <span className="block text-xs font-semibold text-muted">Prochain RDV</span>
                {next ? when(next) : "Aucun de prévu"}
              </span>
            </p>
          </div>
          {!patient && <p className="text-xs text-muted">Patient du cabinet, sans compte Parentons.</p>}
          <div className="flex gap-2 border-t border-line pt-3">
            {patient && (
              <Link href={`/pro/patients/${patient.id}`} className="btn btn-primary flex-1 !px-3 !py-2 !text-sm">
                Fiche patient
              </Link>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost flex-1 !px-3 !py-2 !text-sm hover:!border-brick hover:text-brick"
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Annuler le RDV
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
