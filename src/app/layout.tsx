import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Neue Kabel — titres uppercase uniquement (règle DA officielle)
const kabel = localFont({
  variable: "--font-kabel",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/_active/NeueKabel-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/_active/NeueKabel-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
});

// Capitana — corps de texte, citations
const capitana = localFont({
  variable: "--font-capitana",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/_active/Capitana-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/_active/Capitana-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Le Bruit & L'Odeur",
    template: "%s — Le Bruit & L'Odeur",
  },
  description:
    "Le média urbain rap. Deux jeux chaque semaine : Top de la semaine & Hot Take. Vote, partage, gagne ta place dans la rue.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Le Bruit & L'Odeur",
    description: "Le média urbain rap — vote hebdo & opinions tranchées.",
    locale: "fr_FR",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Le Bruit & L'Odeur",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${kabel.variable} ${capitana.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-ink text-chalk" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
