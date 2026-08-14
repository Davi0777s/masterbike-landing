import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://masterbike.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Master Bike — Mantenimiento de máquinas de gimnasio en Ibagué",
  description:
    "Mantenimiento, revisión y reparación de máquinas de gimnasio a domicilio en Ibagué y alrededores: caminadoras, elípticas y bicicletas. Agenda en 2 minutos.",
  icons: { icon: "/favicon.png", apple: "/apple-touch-icon.png" },
  openGraph: {
    title: "Master Bike — Tu máquina de gym, siempre lista",
    description: "Servicio técnico a domicilio para máquinas de gimnasio en Ibagué y alrededores.",
    url: SITE_URL,
    siteName: "Master Bike",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "es_CO",
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = { themeColor: "#0b0b0c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Habilita animaciones antes de pintar (sin riesgo de contenido invisible) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js-reveal')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
