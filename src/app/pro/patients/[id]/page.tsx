import { notFound } from "next/navigation";
import { getPatient, patients } from "@/lib/data";
import { PatientView } from "./PatientView";

export function generateStaticParams() {
  return patients.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getPatient(id)?.firstName ?? "Patient" };
}

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getPatient(id)) notFound();
  return <PatientView id={id} />;
}
