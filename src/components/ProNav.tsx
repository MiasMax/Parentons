"use client";

import { BookOpen, CalendarDays, MessageCircle, UserRound, Users } from "lucide-react";
import { BottomNav, Sidebar, type NavLink } from "./AppNav";
import { pendingActivities } from "@/lib/data";
import { useActivityReviews } from "@/lib/store";

function useProLinks(): NavLink[] {
  const { reviews } = useActivityReviews();
  const toValidate = pendingActivities.filter((a) => !reviews[a.id]).length;
  return [
    { href: "/pro/patients", label: "Patients", icon: Users },
    { href: "/pro/retours", label: "Retours", icon: MessageCircle },
    { href: "/pro/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/pro/bibliotheque", label: "Activités", icon: BookOpen, count: toValidate, countLabel: "à valider" },
    { href: "/pro/profil", label: "Profil", icon: UserRound },
  ];
}

export function ProSidebar() {
  return <Sidebar links={useProLinks()} home="/pro" badge="Espace orthophoniste" aside={null} />;
}

export function ProBottomNav() {
  return <BottomNav links={useProLinks()} home="/pro" />;
}
