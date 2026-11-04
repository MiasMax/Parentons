import Link from "next/link";
import { Logo } from "@/components/ui";

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/parents">
          <Logo />
        </Link>
        <Link href="/app" className="text-sm font-semibold text-sage hover:underline">
          Se connecter
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-4 sm:px-6">{children}</main>
    </div>
  );
}
