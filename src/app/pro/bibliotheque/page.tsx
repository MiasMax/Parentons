"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, MessageSquareWarning, Plus } from "lucide-react";
import type { Activity, Domain } from "@/lib/data";
import { activities, orthophoniste, pendingActivities } from "@/lib/data";
import { useActivityReviews, useCustomActivities } from "@/lib/store";
import { DomainIcon, Duration, PageHeader, ValidatedBadge } from "@/components/ui";

type Tab = "catalogue" | "a-valider" | "creations";

export default function BibliothequePage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-muted">Chargement…</p>}>
      <Bibliotheque />
    </Suspense>
  );
}

function Bibliotheque() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("onglet");
  const tab: Tab = raw === "a-valider" || raw === "creations" ? raw : "catalogue";
  const domain = params.get("domaine") as Domain | null;

  const { reviews, review } = useActivityReviews();
  const { custom } = useCustomActivities();

  const validatedPending = pendingActivities
    .filter((a) => reviews[a.id]?.status === "validee")
    .map((a) => ({ ...a, validatedBy: orthophoniste.name }));
  const catalog = [...activities, ...validatedPending];
  const domains = [...new Set(catalog.map((a) => a.domain))];
  const toValidate = pendingActivities.filter((a) => reviews[a.id]?.status !== "validee");
  const waiting = toValidate.filter((a) => !reviews[a.id]).length;

  const go = (next: Record<string, string | null>) => {
    const q = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    router.replace(`/pro/bibliotheque${q.size ? `?${q}` : ""}`, { scroll: false });
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "catalogue", label: "Catalogue", count: catalog.length },
    { id: "a-valider", label: "À valider", count: waiting },
    { id: "creations", label: "Mes créations", count: custom.length },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title="Activités" subtitle="La bibliothèque que vous pouvez assigner à vos patients." />
        <Link href="/pro/bibliotheque/nouvelle" className="btn btn-primary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> Créer une activité
        </Link>
      </div>

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => go({ onglet: t.id === "catalogue" ? null : t.id, domaine: null })}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${
              tab === t.id ? "border-sage text-sage" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
            {!!t.count && (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  t.id === "a-valider" ? "bg-honey text-on-honey" : "bg-line text-ink"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "catalogue" && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {[null, ...domains].map((d) => (
              <button
                key={d ?? "tous"}
                type="button"
                aria-pressed={domain === d}
                onClick={() => go({ domaine: d })}
                className={`rounded-full border-[1.5px] px-3 py-1.5 text-sm font-medium transition ${
                  domain === d ? "border-sage bg-sage-soft text-sage" : "border-line text-muted hover:text-ink"
                }`}
              >
                {d ?? "Tous les domaines"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {catalog
              .filter((a) => !domain || a.domain === domain)
              .map((a) => (
                <ActivityCard key={a.id} activity={a}>
                  <ValidatedBadge by={a.validatedBy} />
                </ActivityCard>
              ))}
          </div>
        </>
      )}

      {tab === "a-valider" &&
        (toValidate.length === 0 ? (
          <p className="card p-5 text-muted">Tout est relu. Les nouvelles propositions de l&apos;équipe Parentons apparaîtront ici.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {toValidate.map((a) => (
              <ActivityCard key={a.id} activity={a} open>
                <ReviewActions
                  current={reviews[a.id]}
                  onValidate={() => review(a.id, { status: "validee", date: new Date().toISOString() })}
                  onRequest={(comment) => review(a.id, { status: "modif", comment, date: new Date().toISOString() })}
                />
              </ActivityCard>
            ))}
          </div>
        ))}

      {tab === "creations" &&
        (custom.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-muted">Vous n&apos;avez pas encore créé d&apos;activité.</p>
            <Link href="/pro/bibliotheque/nouvelle" className="btn btn-ghost mt-4">
              Créer ma première activité
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {custom.map((a) => (
              <ActivityCard key={a.id} activity={a}>
                <span className="rounded-full bg-honey-soft px-2.5 py-1 text-xs font-semibold text-honey-ink">
                  Envoyée à l&apos;équipe pour mise en forme
                </span>
              </ActivityCard>
            ))}
          </div>
        ))}
    </div>
  );
}

function ActivityCard({ activity, open = false, children }: { activity: Activity; open?: boolean; children?: React.ReactNode }) {
  return (
    <details className="card group" open={open}>
      <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
        <DomainIcon domain={activity.domain} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{activity.domain}</p>
          <p className="font-display text-lg font-bold">{activity.title}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Duration minutes={activity.duration} />
            <span className="text-sm text-muted">{activity.summary}</span>
          </div>
        </div>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="border-t border-line p-4 sm:p-5">
        <p className="text-sm font-semibold text-muted">Objectif</p>
        <p className="mt-1">{activity.objective}</p>
        <p className="mt-4 text-sm font-semibold text-muted">Matériel</p>
        <p className="mt-1">{activity.materials.join(" · ")}</p>
        <p className="mt-4 text-sm font-semibold text-muted">Étapes</p>
        <ol className="mt-2 flex flex-col gap-3">
          {activity.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-sage">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted">{s.detail}</p>
                {s.tip && <p className="mt-1 text-sm text-honey-ink">Astuce : {s.tip}</p>}
              </div>
            </li>
          ))}
        </ol>
        {children && <div className="mt-5 border-t border-line pt-4">{children}</div>}
      </div>
    </details>
  );
}

function ReviewActions({
  current,
  onValidate,
  onRequest,
}: {
  current?: { status: string; comment?: string };
  onValidate: () => void;
  onRequest: (comment: string) => void;
}) {
  const [asking, setAsking] = useState(false);
  const [comment, setComment] = useState("");

  if (current?.status === "modif" && !asking) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-honey-ink">
          <MessageSquareWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Modification demandée : « {current.comment} »
          </span>
        </p>
        <button type="button" className="btn btn-primary" onClick={onValidate}>
          <Check className="h-4 w-4" aria-hidden /> Valider quand même
        </button>
      </div>
    );
  }

  if (asking) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          onRequest(comment.trim());
          setAsking(false);
        }}
      >
        <label htmlFor="review-comment" className="text-sm font-semibold">
          Que faut-il changer ?
        </label>
        <textarea
          id="review-comment"
          className="field mt-1.5 min-h-20"
          placeholder="Ex. : l'étape 2 est trop difficile avant 5 ans…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          autoFocus
        />
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => setAsking(false)}>
            Annuler
          </button>
          <button type="submit" className="btn btn-honey" disabled={!comment.trim()}>
            Envoyer la demande
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button type="button" className="btn btn-ghost" onClick={() => setAsking(true)}>
        Demander une modification…
      </button>
      <button type="button" className="btn btn-primary" onClick={onValidate}>
        <Check className="h-4 w-4" aria-hidden /> Valider l&apos;activité
      </button>
    </div>
  );
}
