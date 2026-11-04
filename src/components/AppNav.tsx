"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, House, TrendingUp, UserRound, type LucideIcon } from "lucide-react";
import { Logo } from "./ui";
import { child } from "@/lib/data";

export type NavLink = { href: string; label: string; icon: LucideIcon };

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
  <div className="mt-auto rounded-2xl bg-honey-soft p-4 text-sm">
    <p className="font-display font-bold text-honey-ink">Le saviez-vous ?</p>
    <p className="mt-1 text-ink/80">
      10 minutes régulières valent mieux qu&apos;une longue séance par semaine.
    </p>
  </div>
);

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
        {links.map(({ href, label, icon: Icon }) => {
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
            </Link>
          );
        })}
      </nav>
      {aside}
    </aside>
  );
}

export function BottomNav({ links = parentLinks, home = "/app" }: { links?: NavLink[]; home?: string }) {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-md justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href, home);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[11px] font-medium ${
                  active ? "text-sage" : "text-muted"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
