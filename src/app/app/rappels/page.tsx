"use client";

import { useState } from "react";
import { Bell, Check, Mail, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/ui";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? "bg-sage" : "bg-line"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

export default function Rappels() {
  const [enabled, setEnabled] = useState(true);
  const [chosen, setChosen] = useState(["Lundi", "Mercredi", "Samedi"]);
  const [time, setTime] = useState("18:00");
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [saved, setSaved] = useState(false);

  function touch<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v);
      setSaved(false);
    };
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Rappels" subtitle="Un petit coup de pouce pour garder le rythme." />

      <div className="card flex items-center gap-4 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-honey-soft text-honey-ink">
          <Bell className="h-5 w-5" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-bold">Activer les rappels</p>
          <p className="text-sm text-muted">Les jours où une activité est prévue.</p>
        </div>
        <Toggle on={enabled} onChange={touch(setEnabled)} label="Activer les rappels" />
      </div>

      <fieldset disabled={!enabled} className={`mt-6 flex flex-col gap-6 transition ${enabled ? "" : "opacity-40"}`}>
        <div>
          <p className="mb-2 font-medium">Quels jours ?</p>
          <div className="flex flex-wrap gap-2">
            {days.map((d) => {
              const on = chosen.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => touch(setChosen)(on ? chosen.filter((x) => x !== d) : [...chosen, d])}
                  aria-pressed={on}
                  className={`rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition ${
                    on ? "border-sage bg-sage text-on-sage" : "border-line bg-surface hover:border-sage/50"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          {chosen.length !== 3 && (
            <p className="mt-2 text-sm text-honey-ink">Nous conseillons 3 jours, un par activité.</p>
          )}
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-medium">À quelle heure ?</span>
          <input
            type="time"
            className="field w-40"
            value={time}
            onChange={(e) => touch(setTime)(e.target.value)}
          />
        </label>

        <div className="card divide-y divide-line">
          <div className="flex items-center gap-3 p-4">
            <Smartphone className="h-5 w-5 text-muted" aria-hidden />
            <span className="flex-1 font-medium">Notification sur le téléphone</span>
            <Toggle on={push} onChange={touch(setPush)} label="Notification sur le téléphone" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <Mail className="h-5 w-5 text-muted" aria-hidden />
            <span className="flex-1 font-medium">E-mail</span>
            <Toggle on={email} onChange={touch(setEmail)} label="E-mail" />
          </div>
        </div>
      </fieldset>

      <button onClick={() => setSaved(true)} className="btn btn-primary mt-8">
        {saved ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden /> Enregistré
          </>
        ) : (
          "Enregistrer"
        )}
      </button>
    </div>
  );
}
