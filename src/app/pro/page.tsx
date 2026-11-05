import { redirect } from "next/navigation";

// L'espace orthophoniste s'ouvre sur la liste des patients.
export default function ProHome() {
  redirect("/pro/patients");
}
