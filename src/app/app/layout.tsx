import { BottomNav, Sidebar } from "@/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:px-10 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
