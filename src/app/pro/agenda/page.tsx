"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import type { Appointment, AppointmentType } from "@/lib/data";
import { DEMO_TODAY, appointmentName, appointmentTypes, getPatient, patients } from "@/lib/data";
import { useAppointments } from "@/lib/store";
import { addDays, fmtDate, fmtDayLong, fmtMonth, isoWeek, parseDay, startOfWeek } from "@/lib/dates";
import { AppointmentRow } from "@/components/pro";
import { AppointmentForm } from "./AppointmentForm";
import { MiniCalendar } from "./MiniCalendar";
import { TimeGrid } from "./TimeGrid";
import { typeTone } from "./tones";

type View = "jour" | "travail" | "semaine" | "liste";

const views: { id: View; label: string }[] = [
  { id: "jour", label: "Jour" },
  { id: "travail", label: "Semaine de travail" },
  { id: "semaine", label: "Semaine" },
  { id: "liste", label: "Liste à venir" },
];

export default function AgendaPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-muted">Chargement…</p>}>
      <Agenda />
    </Suspense>
  );
}

function Agenda() {
  const router = useRouter();
  const params = useSearchParams();
  const patientFilter = params.get("patient") ?? "";

  // Sur mobile, la vue Jour par défaut : 5 colonnes ne tiennent pas sur 375 px.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => setIsMobile(window.matchMedia("(max-width: 767px)").matches), []);
  const rawView = params.get("vue") as View | null;
  const view: View = views.some((v) => v.id === rawView) ? rawView! : isMobile ? "jour" : "travail";

  const { appointments, add, remove } = useAppointments();
  const [anchor, setAnchorState] = useState(DEMO_TODAY);
  const [month, setMonth] = useState(DEMO_TODAY.slice(0, 7));
  const [hiddenTypes, setHiddenTypes] = useState<AppointmentType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<{ date: string; time: string } | null>(
    params.get("nouveau") === "1" ? { date: addDays(DEMO_TODAY, 1), time: "10:00" } : null,
  );
  const [message, setMessage] = useState("");

  const setAnchor = (day: string) => {
    setAnchorState(day);
    setMonth(day.slice(0, 7));
    setSelectedId(null);
  };

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("nouveau");
    router.replace(`/pro/agenda${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const monday = startOfWeek(anchor);
  const days =
    view === "jour"
      ? [anchor]
      : Array.from({ length: view === "semaine" ? 7 : 5 }, (_, i) => addDays(monday, i));

  const visible = appointments.filter(
    (a) => (!patientFilter || a.patientId === patientFilter) && !hiddenTypes.includes(a.type),
  );
  const counts: Record<string, number> = {};
  for (const a of visible) counts[a.start.slice(0, 10)] = (counts[a.start.slice(0, 10)] ?? 0) + 1;
  const inRange = visible.filter((a) => days.some((d) => a.start.startsWith(d)));

  const step = view === "jour" ? 1 : 7;
  const label =
    view === "jour"
      ? fmtDayLong.format(parseDay(anchor))
      : view === "liste"
        ? "Tous les rendez-vous à venir"
        : fmtMonth.format(parseDay(monday));

  const closeForm = useCallback(() => setForm(null), []);

  const cancel = (a: Appointment) => {
    if (window.confirm(`Annuler le rendez-vous de ${appointmentName(a)} le ${fmtDate.format(new Date(a.start))} ?`)) {
      remove(a.id);
      setSelectedId(null);
      setMessage(`Rendez-vous de ${appointmentName(a)} annulé.`);
    }
  };

  const newButton = (className = "") => (
    <button
      type="button"
      className={`btn btn-primary whitespace-nowrap ${className}`}
      onClick={() => setForm({ date: anchor < DEMO_TODAY ? DEMO_TODAY : anchor, time: "10:00" })}
    >
      <CalendarPlus className="h-4 w-4" aria-hidden /> Nouveau RDV
    </button>
  );

  return (
    <div data-wide className="flex gap-6">
      {/* Colonne gauche : mini-calendrier, motifs, filtre */}
      <aside className="hidden w-60 shrink-0 flex-col gap-5 lg:flex">
        {newButton("w-full")}
        <div className="card p-3">
          <MiniCalendar month={month} setMonth={setMonth} selected={days} counts={counts} onPick={setAnchor} />
        </div>
        <div>
          <p className="mb-2 font-display font-bold">Motifs</p>
          <ul className="flex flex-col gap-1">
            {appointmentTypes.map((t) => {
              const hidden = hiddenTypes.includes(t);
              const n = appointments.filter((a) => a.type === t && days.some((d) => a.start.startsWith(d))).length;
              return (
                <li key={t}>
                  <button
                    type="button"
                    aria-pressed={!hidden}
                    onClick={() => setHiddenTypes((prev) => (hidden ? prev.filter((x) => x !== t) : [...prev, t]))}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-sage-soft/50 ${
                      hidden ? "text-muted line-through" : ""
                    }`}
                  >
                    <span className={`h-3.5 w-3.5 rounded ${typeTone[t].swatch} ${hidden ? "opacity-30" : ""}`} aria-hidden />
                    <span className="flex-1">{t}</span>
                    <span className="text-xs text-muted">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 flex items-center gap-2 px-2 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" aria-hidden /> Patient suivi avec Parentons
          </p>
        </div>
        <PatientFilter value={patientFilter} onChange={(v) => setParam("patient", v || null)} />
      </aside>

      <div className="min-w-0 flex-1">
        <h1 className="sr-only">Agenda</h1>

        {/* Barre d'outils */}
        <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
          {view !== "liste" && (
            <>
              <button type="button" className="btn btn-ghost !px-4 !py-2" onClick={() => setAnchor(DEMO_TODAY)}>
                Aujourd&apos;hui
              </button>
              <div className="flex">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-sage-soft hover:text-sage"
                  onClick={() => setAnchor(addDays(anchor, -step))}
                  aria-label={view === "jour" ? "Jour précédent" : "Semaine précédente"}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-sage-soft hover:text-sage"
                  onClick={() => setAnchor(addDays(anchor, step))}
                  aria-label={view === "jour" ? "Jour suivant" : "Semaine suivante"}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </>
          )}
          <p className="min-w-0 font-display text-xl font-extrabold first-letter:uppercase sm:text-2xl" aria-live="polite">
            {label}
            {view !== "jour" && view !== "liste" && (
              <span className="ml-2 font-sans text-sm font-medium text-muted">semaine {isoWeek(monday)}</span>
            )}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label>
              <span className="sr-only">Affichage</span>
              <select
                className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-ink"
                value={view}
                onChange={(e) => setParam("vue", e.target.value)}
              >
                {views.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="lg:hidden">{newButton("!px-4 !py-2")}</span>
          </div>
        </div>

        <div className="mb-4 lg:hidden">
          <PatientFilter value={patientFilter} onChange={(v) => setParam("patient", v || null)} inline />
        </div>

        {message && (
          <p className="mb-4 rounded-xl bg-sage-soft px-4 py-3 text-sm font-semibold text-sage" role="status">
            {message}
          </p>
        )}

        {view === "liste" ? (
          <UpcomingList
            items={visible
              .filter((a) => a.start.slice(0, 10) >= DEMO_TODAY)
              .sort((a, b) => a.start.localeCompare(b.start))}
            onCancel={cancel}
          />
        ) : (
          <>
            <TimeGrid
              days={days}
              appointments={inRange}
              all={appointments}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onCreate={(date, time) => {
                setSelectedId(null);
                setForm({ date: date < DEMO_TODAY ? DEMO_TODAY : date, time: time ?? "10:00" });
              }}
              onCancel={cancel}
            />
            {inRange.length === 0 && (
              <p className="mt-3 text-center text-sm text-muted">
                Aucun rendez-vous sur cette période. Cliquez sur un créneau pour en ajouter un.
              </p>
            )}
          </>
        )}
      </div>

      {form && (
        <AppointmentForm
          existing={appointments}
          initial={{ patientId: patientFilter, ...form }}
          onClose={closeForm}
          onSave={(a) => {
            add(a);
            setForm(null);
            setAnchor(a.start.slice(0, 10));
            setMessage(
              `Rendez-vous ajouté pour ${appointmentName({ ...a, id: "" })}, le ${fmtDate.format(new Date(a.start))} à ${a.start.slice(11, 16)}.`,
            );
          }}
        />
      )}
    </div>
  );
}

function PatientFilter({
  value,
  onChange,
  inline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  inline?: boolean;
}) {
  return (
    <label className={inline ? "flex items-center gap-2 text-sm text-muted" : "block"}>
      <span className={inline ? "" : "mb-2 block font-display font-bold text-ink"}>Patient</span>
      <select
        className={inline ? "rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink" : "field"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Tous les patients</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName}
          </option>
        ))}
      </select>
    </label>
  );
}

function UpcomingList({ items, onCancel }: { items: Appointment[]; onCancel: (a: Appointment) => void }) {
  if (items.length === 0) {
    return <p className="card p-5 text-muted">Aucun rendez-vous à venir. Ajoutez-en un avec « Nouveau RDV ».</p>;
  }
  const byDay = new Map<string, Appointment[]>();
  for (const a of items) {
    const day = a.start.slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), a]);
  }
  return (
    <div className="flex flex-col gap-6">
      {[...byDay].map(([day, list]) => (
        <section key={day}>
          <h2 className="mb-2 flex items-baseline gap-2 text-lg font-bold">
            <span className="first-letter:uppercase">{fmtDayLong.format(parseDay(day))}</span>
            {day === DEMO_TODAY && (
              <span className="rounded-full bg-honey-soft px-2 py-0.5 text-xs font-semibold text-honey-ink">
                Aujourd&apos;hui
              </span>
            )}
            <span className="text-sm font-normal text-muted">· {list.length} RDV</span>
          </h2>
          <div className="card divide-y divide-line">
            {list.map((a) => (
              <AppointmentRow
                key={a.id}
                appointment={a}
                patient={getPatient(a.patientId)}
                action={
                  <button
                    type="button"
                    onClick={() => onCancel(a)}
                    className="flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-semibold text-muted transition hover:bg-brick-soft hover:text-brick"
                  >
                    Annuler
                  </button>
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
