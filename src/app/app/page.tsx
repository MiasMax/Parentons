"use client";

import Link from "next/link";
import { CalendarDays, Check, ChevronRight, Lightbulb, MessageCircleHeart, Play, Sparkles } from "lucide-react";
import { DEMO_TODAY, child, getActivity, orthophoniste, parent } from "@/lib/data";
import { useAppointments, useParcours, useProgramme, useProNote, useWeekFeedback } from "@/lib/store";
import { ActivityRow, DomainIcon, Duration, Logo, ProgressRing, ResultPill } from "@/components/ui";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const rdvFmt = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default function Dashboard() {
  const { feedback } = useWeekFeedback();
  const { parcours } = useParcours();
  const { programme } = useProgramme("leo");
  const { note } = useProNote("leo");
  const { appointments } = useAppointments();
  const nextRdv = appointments
    .filter((a) => a.patientId === "leo" && a.start.slice(0, 10) >= DEMO_TODAY)
    .sort((a, b) => a.start.localeCompare(b.start))[0];

  const week = programme.map((w) => ({ ...w, activity: getActivity(w.id)! }));
  const doneCount = week.filter((w) => feedback[w.id]).length;
  const nextUp = week.find((w) => !feedback[w.id]);
  const remaining = week.length - doneCount;

  return (
    <div>
      <div className="mb-6 md:hidden">
        <Logo />
      </div>

      <p className="text-sm font-medium text-muted first-letter:uppercase">{dateFmt.format(new Date())}</p>
      <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Bonjour {parent.firstName} 👋</h1>

      {/* Progression de la semaine */}
      <section className="card mt-6 overflow-hidden">
        <div className="flex items-center gap-5 p-5 sm:p-6">
          <ProgressRing done={doneCount} total={week.length} />
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              {remaining === 0
                ? `Bravo, semaine terminée ! 🎉`
                : `Plus que ${remaining} activité${remaining > 1 ? "s" : ""} cette semaine`}
            </h2>
            <p className="mt-1 text-muted">
              {remaining === 0
                ? `${child.firstName} a fait toutes ses activités. Rendez-vous lundi pour la suite.`
                : `Chaque petite séance aide ${child.firstName} à progresser.`}
            </p>
          </div>
        </div>

        {nextUp && (
          <div className="flex flex-col gap-4 border-t border-line bg-honey-soft/60 p-5 sm:flex-row sm:items-center sm:p-6">
            <DomainIcon domain={nextUp.activity.domain} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-honey-ink">Prochaine activité · {nextUp.day}</p>
              <p className="font-display text-lg font-bold">{nextUp.activity.title}</p>
              <Duration minutes={nextUp.activity.duration} />
            </div>
            <Link href={`/app/activites/${nextUp.id}`} className="btn btn-honey">
              <Play className="h-4 w-4" fill="currentColor" aria-hidden /> Commencer
            </Link>
          </div>
        )}
      </section>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Activités de la semaine */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Cette semaine</h2>
            <Link href="/app/activites" className="text-sm font-semibold text-sage hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {week.map((w) => {
              const fb = feedback[w.id];
              return (
                <ActivityRow
                  key={w.id}
                  activity={w.activity}
                  right={
                    fb ? (
                      <span className="flex flex-col items-end gap-1.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-on-sage">
                          <Check className="h-4 w-4" strokeWidth={3} aria-label="Faite" />
                        </span>
                        <ResultPill result={fb.result} />
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

        {/* Colonne latérale */}
        <aside className="flex flex-col gap-4">
          {parcours === "suivi" ? (
            <div className="card p-5">
              <p className="text-sm font-semibold text-muted">Votre orthophoniste</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage font-display font-bold text-on-sage">
                  {orthophoniste.initials}
                </span>
                <div>
                  <p className="font-bold">{orthophoniste.name}</p>
                  <p className="text-sm text-muted">{orthophoniste.city}</p>
                </div>
              </div>
              {note && (
                <div className="mt-4 rounded-xl bg-honey-soft p-3 text-sm">
                  <p className="flex items-center gap-1.5 font-semibold text-honey-ink">
                    <MessageCircleHeart className="h-4 w-4" aria-hidden /> Un mot de {orthophoniste.firstName}
                  </p>
                  <p className="mt-1 whitespace-pre-line">{note.text}</p>
                </div>
              )}
              {nextRdv && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-sage-soft p-3 text-sm text-sage">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>
                    Prochain rendez-vous{nextRdv.place === "Visio" ? " (visio)" : ""} :<br />
                    <strong>{rdvFmt.format(new Date(nextRdv.start))}</strong>
                  </span>
                </p>
              )}
              <p className="mt-3 text-xs text-muted">
                Vos retours sur chaque activité lui sont transmis automatiquement.
              </p>
            </div>
          ) : (
            <div className="card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-honey-ink">
                <Sparkles className="h-4 w-4" aria-hidden /> Programme personnalisé
              </p>
              <p className="mt-2 text-sm text-muted">
                Les activités de {child.firstName} s&apos;adaptent chaque semaine à vos retours.
              </p>
              <Link href="/app/profil" className="mt-3 inline-block text-sm font-semibold text-sage hover:underline">
                Gérer mon abonnement
              </Link>
            </div>
          )}

          <div className="rounded-[1.25rem] bg-honey-soft p-5">
            <p className="flex items-center gap-2 font-display font-bold text-honey-ink">
              <Lightbulb className="h-4 w-4" aria-hidden /> Astuce du jour
            </p>
            <p className="mt-2 text-sm">
              Quand {child.firstName} se trompe sur un mot, inutile de faire répéter : redites
              simplement le mot correctement, avec le sourire.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
