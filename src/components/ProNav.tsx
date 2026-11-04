"use client";

import Link from "next/link";
import { BookOpen, CalendarDays, LayoutDashboard, UserRound, Users } from "lucide-react";
import { BottomNav, Sidebar, type NavLink } from "./AppNav";

const proLinks: NavLink[] = [
  { href: "/pro", label: "Accueil", icon: LayoutDashboard },
  { href: "/pro/patients", label: "Patients", icon: Users },
  { href: "/pro/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pro/bibliotheque", label: "Activités", icon: BookOpen },
  { href: "/pro/profil", label: "Profil", icon: UserRound },
];

const proAside = (
  <div className="mt-auto rounded-2xl border border-line p-4 text-sm">
    <p className="font-display font-bold">Démo</p>
    <p className="mt-1 text-muted">
      Ouvrez l&apos;espace parent dans un autre onglet : vos changements y apparaissent en direct.
    </p>
    <Link href="/app" className="mt-2 inline-block font-semibold text-sage hover:underline">
      Voir l&apos;espace parent
    </Link>
  </div>
);

export function ProSidebar() {
  return <Sidebar links={proLinks} home="/pro" badge="Espace orthophoniste" aside={proAside} />;
}

export function ProBottomNav() {
  return <BottomNav links={proLinks} home="/pro" />;
}
