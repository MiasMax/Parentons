import type { Metadata } from "next";
import { ProBottomNav, ProSidebar } from "@/components/ProNav";

export const metadata: Metadata = {
  title: { default: "Espace orthophoniste · Parentons", template: "%s · Parentons Pro" },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ProSidebar />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:px-10 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-5xl has-[[data-wide]]:max-w-none">{children}</div>
      </main>
      <ProBottomNav />
    </div>
  );
}
