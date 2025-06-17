import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/layout";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: "NYX BDSM Club",
  description:
    "Una comunidad exclusiva dedicada a la educación, seguridad y conexiones significativas en un ambiente sofisticado.",
  keywords: [
    "NYX BDSM Club",
    "BDSM",
    "Shibari",
    "Cinefórum",
    "Conferencias",
    "Madrid",
    "Comunidad",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://clubnyx.net",
    title: "NYX Club - Comunidad de Arte y Educación",
    description:
      "Una comunidad exclusiva dedicada a la educación, seguridad y conexiones significativas en un ambiente sofisticado.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NYX BDSM Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NYX BDSM Club",
    description:
      "Una comunidad exclusiva dedicada a la educación, seguridad y conexiones significativas en un ambiente sofisticado.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="/images/nyx-symbol.png"
          type="image/png"
          sizes="any"
        />
      </head>
      <body
        className={`${inter.className} bg-black text-white`}
        suppressHydrationWarning={true}
      >
        <Layout>{children}</Layout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
