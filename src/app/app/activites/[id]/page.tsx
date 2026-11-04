import { notFound } from "next/navigation";
import { catalog, getActivity } from "@/lib/data";
import { ActivityPlayer } from "./ActivityPlayer";

export function generateStaticParams() {
  return catalog.map((a) => ({ id: a.id }));
}

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = getActivity(id);
  if (!activity) notFound();
  return <ActivityPlayer activity={activity} />;
}
