import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck } from "lucide-react";
import type { Activity, Domain, Result } from "@/lib/data";
import { resultLabels } from "@/lib/data";

export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <span className={`inline-flex items-center ${lg ? "gap-3" : "gap-2"} ${className}`}>
      <Image
        src="/logo.png"
        alt=""
        width={lg ? 64 : 36}
        height={lg ? 64 : 36}
        className={lg ? "h-12 w-12 sm:h-16 sm:w-16" : "h-9 w-9"}
        priority
      />
      <span className={`font-logo leading-normal ${lg ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
        <span className="text-sage">Parent</span>
        <span className="text-honey">ons</span>
      </span>
    </span>
  );
}

export function ValidatedBadge({ by }: { by?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-2.5 py-1 text-xs font-medium text-sage">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
      {by ? `Validé par ${by}, orthophoniste` : "Validé par un·e orthophoniste"}
    </span>
  );
}

const domainEmoji: Record<Domain, string> = {
  Articulation: "👄",
  Vocabulaire: "📚",
  "Conscience phonologique": "👂",
  Récit: "🎨",
  Compréhension: "🧠",
  Souffle: "🪶",
};

export function DomainIcon({ domain, size = "md" }: { domain: Domain; size?: "md" | "lg" }) {
  const cls = size === "lg" ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-honey-soft ${cls}`}
      aria-hidden
    >
      {domainEmoji[domain]}
    </span>
  );
}

export function Duration({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted">
      <Clock className="h-3.5 w-3.5" aria-hidden />
      {minutes} min
    </span>
  );
}

const resultStyle: Record<Result, string> = {
  reussi: "bg-sage-soft text-sage",
  moyen: "bg-honey-soft text-honey-ink",
  difficile: "bg-brick-soft text-brick",
};

export function ResultPill({ result }: { result: Result }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${resultStyle[result]}`}>
      {resultLabels[result]}
    </span>
  );
}

export function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="var(--line)" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--honey)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold leading-none">
          {done}/{total}
        </span>
        <span className="text-[11px] text-muted">activités</span>
      </div>
    </div>
  );
}

export function ActivityRow({
  activity,
  right,
  href,
}: {
  activity: Activity;
  right?: React.ReactNode;
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/app/activites/${activity.id}`}
      className="card flex items-center gap-4 p-4 transition hover:border-sage"
    >
      <DomainIcon domain={activity.domain} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{activity.domain}</p>
        <p className="font-display truncate text-lg font-bold">{activity.title}</p>
        <Duration minutes={activity.duration} />
      </div>
      {right}
    </Link>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  );
}
