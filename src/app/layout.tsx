import type { Metadata } from "next";
import { Inter, Nunito, Pacifico } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});
// Réservée au nom « Parentons » dans le logo.
const pacifico = Pacifico({ variable: "--font-pacifico", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Parentons",
  description:
    "Des activités d'orthophonie à faire à la maison, validées par des orthophonistes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${nunito.variable} ${pacifico.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
