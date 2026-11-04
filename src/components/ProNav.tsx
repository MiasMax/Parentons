"use client";

import { BookOpen, CalendarDays, LayoutDashboard, UserRound, Users } from "lucide-react";
import { BottomNav, Sidebar, type NavLink } from "./AppNav";

const proLinks: NavLink[] = [
  { href: "/pro", label: "Accueil", icon: LayoutDashboard },
  { href: "/pro/patients", label: "Patients", icon: Users },
  { href: "/pro/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pro/bibliotheque", label: "Activités", icon: BookOpen },
  { href: "/pro/profil", label: "Profil", icon: UserRound },
];

export function ProSidebar() {
  return <Sidebar links={proLinks} home="/pro" badge="Espace orthophoniste" aside={null} />;
}

export function ProBottomNav() {
  return <BottomNav links={proLinks} home="/pro" />;
}
