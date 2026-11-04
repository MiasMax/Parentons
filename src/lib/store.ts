"use client";

// État local de la démo (localStorage) — à remplacer par l'API.
import { useCallback, useEffect, useState } from "react";
import type { Activity, Appointment, Feedback, HistoryItem, Parcours, Patient } from "./data";
import { appointments as seedAppointments, patients } from "./data";

const FEEDBACK_KEY = "parentons:feedback";
const PARCOURS_KEY = "parentons:parcours";

// Une activité de la semaine est déjà faite pour la démo.
const seed: Record<string, Feedback> = {
  "serpent-qui-siffle": { result: "moyen", note: "Mieux que la semaine dernière !", date: "2026-11-02" },
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible : la démo continue en mémoire
  }
}

export function useWeekFeedback() {
  const [feedback, setFeedback] = usePersisted<Record<string, Feedback>>(FEEDBACK_KEY, seed);

  const save = useCallback(
    (id: string, fb: Feedback) => setFeedback((prev) => ({ ...prev, [id]: fb })),
    [setFeedback],
  );
  const reset = useCallback(() => setFeedback(seed), [setFeedback]);

  return { feedback, save, reset };
}

export function useParcours() {
  const [parcours, setState] = useState<Parcours>("suivi");

  useEffect(() => {
    setState(read<Parcours>(PARCOURS_KEY, "suivi"));
  }, []);

  const setParcours = useCallback((p: Parcours) => {
    write(PARCOURS_KEY, p);
    setState(p);
  }, []);

  return { parcours, setParcours };
}

// ─── Espace orthophoniste ────────────────────────────────────────────────
// /app et /pro partagent ce stockage : une action d'un côté se voit de l'autre,
// y compris d'un onglet à l'autre grâce à l'événement « storage ».

const SYNC_EVENT = "parentons:sync";

function usePersisted<T>(key: string, seed: T) {
  const [value, setValue] = useState<T>(seed);

  useEffect(() => {
    const load = () => setValue(read<T>(key, seed));
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) load();
    };
    const onSync = (e: Event) => {
      if ((e as CustomEvent<string>).detail === key) load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onSync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onSync);
    };
    // seed est une valeur de démo stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        queueMicrotask(() => window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key })));
        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}

export type ProgrammeItem = { id: string; day: string };

const programmeSeed: Record<string, ProgrammeItem[]> = Object.fromEntries(
  patients.map((p) => [p.id, p.programme]),
);

export function useProgrammes() {
  const [programmes, setProgrammes] = usePersisted("parentons:programmes", programmeSeed);
  return { programmes, setProgrammes };
}

export function useProgramme(patientId: string) {
  const { programmes, setProgrammes } = useProgrammes();
  const programme = programmes[patientId] ?? [];
  const setProgramme = useCallback(
    (next: ProgrammeItem[]) => setProgrammes((prev) => ({ ...prev, [patientId]: next })),
    [patientId, setProgrammes],
  );
  return { programme, setProgramme };
}

export type ProNote = { text: string; date: string };

export function useProNote(patientId: string) {
  const [note, setNote] = usePersisted<ProNote | null>(`parentons:note:${patientId}`, null);
  return { note, setNote };
}

export function useAppointments() {
  const [appointments, setAppointments] = usePersisted<Appointment[]>("parentons:rdv:v2", seedAppointments);
  const add = useCallback(
    (a: Omit<Appointment, "id">) =>
      setAppointments((prev) => [...prev, { ...a, id: `r${Date.now()}` }]),
    [setAppointments],
  );
  const remove = useCallback(
    (id: string) => setAppointments((prev) => prev.filter((a) => a.id !== id)),
    [setAppointments],
  );
  return { appointments, add, remove };
}

export type Review = { status: "validee" | "modif"; comment?: string; date: string };

export function useActivityReviews() {
  const [reviews, setReviews] = usePersisted<Record<string, Review>>("parentons:reviews", {});
  const review = useCallback(
    (id: string, r: Review) => setReviews((prev) => ({ ...prev, [id]: r })),
    [setReviews],
  );
  return { reviews, review };
}

export function useCustomActivities() {
  const [custom, setCustom] = usePersisted<Activity[]>("parentons:custom-activities", []);
  const add = useCallback((a: Activity) => setCustom((prev) => [a, ...prev]), [setCustom]);
  return { custom, add };
}

export type PatientWeek = {
  patient: Patient;
  programme: ProgrammeItem[];
  weekFeedback: Record<string, Feedback>;
  weekItems: HistoryItem[];
  doneCount: number;
};

// Semaine de chaque patient : pour Léo, les retours sont ceux saisis par le parent dans /app.
export function usePatientsWeek(): PatientWeek[] {
  const { feedback } = useWeekFeedback();
  const { programmes } = useProgrammes();
  return patients.map((patient) => {
    const programme = programmes[patient.id] ?? [];
    const weekFeedback = patient.id === "leo" ? feedback : patient.weekFeedback;
    const weekItems = programme
      .filter((p) => weekFeedback[p.id])
      .map((p) => ({ id: p.id, feedback: weekFeedback[p.id] }));
    return { patient, programme, weekFeedback, weekItems, doneCount: weekItems.length };
  });
}
