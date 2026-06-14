import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/top-nav";
import { Footer } from "@/components/footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://sportbook.fr";

export const metadata: Metadata = {
  title: {
    default: "SportBook - Réservation de terrains de sport",
    template: "%s | SportBook",
  },
  description:
    "Réservez votre terrain de football, tennis, basketball ou padel en quelques clics. Paiement sécurisé, confirmation instantanée.",
  keywords: ["réservation terrain sport", "football", "tennis", "basketball", "padel", "location terrain"],
  authors: [{ name: "SportBook" }],
  openGraph: {
    title: "SportBook - Réservation de terrains de sport",
    description: "Réservez votre terrain en quelques clics.",
    url: siteUrl,
    siteName: "SportBook",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportBook",
    description: "Réservez votre terrain de sport en quelques clics.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SportBook" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
