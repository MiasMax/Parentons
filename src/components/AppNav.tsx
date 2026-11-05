"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, Bell, BookOpen, House, TrendingUp, UserRound, type LucideIcon } from "lucide-react";
import { Logo } from "./ui";
import { child } from "@/lib/data";

// `count` : pastille à côté du lien (ex. activités à valider), avec son libellé pour les lecteurs d'écran.
export type NavLink = { href: string; label: string; icon: LucideIcon; count?: number; countLabel?: string };

const parentLinks: NavLink[] = [
  { href: "/app", label: "Accueil", icon: House },
  { href: "/app/activites", label: "Activités", icon: BookOpen },
  { href: "/app/progres", label: "Progrès", icon: TrendingUp },
  { href: "/app/rappels", label: "Rappels", icon: Bell },
  { href: "/app/profil", label: child.firstName, icon: UserRound },
];

function isActive(pathname: string, href: string, home: string) {
  return href === home ? pathname === home : pathname.startsWith(href);
}

const parentAside = (
  <div className="rounded-2xl bg-honey-soft p-4 text-sm">
    <p className="font-display font-bold text-honey-ink">Le saviez-vous ?</p>
    <p className="mt-1 text-ink/80">
      10 minutes régulières valent mieux qu&apos;une longue séance par semaine.
    </p>
  </div>
);

// Passage discret d'un espace à l'autre pour la démo (l'espace courant se déduit de l'URL).
function useOtherSpace() {
  const toPro = !usePathname().startsWith("/pro");
  return toPro
    ? { href: "/pro", label: "Espace orthophoniste" }
    : { href: "/app", label: "Espace parent" };
}

function SpaceSwitch() {
  const { href, label } = useOtherSpace();
  return (
    <Link
      href={href}
      className="flex items-center gap-2 self-end rounded-xl px-3 py-2 text-xs font-medium text-muted transition hover:bg-sage-soft/60 hover:text-ink"
    >
      <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden />
      {label}
    </Link>
  );
}

function SpaceSwitchMobile() {
  const { href, label } = useOtherSpace();
  return (
    <Link
      href={href}
      aria-label={`Aller à : ${label}`}
      title={label}
      className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-sage-soft/60 hover:text-ink md:hidden"
    >
      <ArrowLeftRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}

export function Sidebar({
  links = parentLinks,
  home = "/app",
  badge,
  aside = parentAside,
}: {
  links?: NavLink[];
  home?: string;
  badge?: string;
  aside?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line px-5 py-8 md:flex">
      <Link href={home} className="mb-10 px-2">
        <Logo />
        {badge && (
          <span className="mt-2 block w-fit rounded-full bg-sage-soft px-2.5 py-0.5 text-xs font-semibold text-sage">
            {badge}
          </span>
        )}
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon, count, countLabel }) => {
          const active = isActive(pathname, href, home);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                active ? "bg-sage-soft text-sage" : "text-muted hover:bg-sage-soft/60 hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
              {!!count && (
                <span className="ml-auto rounded-full bg-honey-soft px-2 py-0.5 text-xs font-semibold text-honey-ink">
                  {count}
                  <span className="sr-only"> {countLabel}</span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        {aside}
        <SpaceSwitch />
      </div>
    </aside>
  );
}

export function BottomNav({ links = parentLinks, home = "/app" }: { links?: NavLink[]; home?: string }) {
  const pathname = usePathname();
  return (
    <>
      <SpaceSwitchMobile />
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur md:hidden">
        <ul className="mx-auto flex max-w-md justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {links.map(({ href, label, icon: Icon, count, countLabel }) => {
            const active = isActive(pathname, href, home);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-2.5 text-[11px] font-medium ${
                    active ? "text-sage" : "text-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden strokeWidth={active ? 2.4 : 2} />
                  {label}
                  {!!count && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-honey px-1 text-[10px] font-bold text-on-honey">
                      {count}
                      <span className="sr-only"> {countLabel}</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
