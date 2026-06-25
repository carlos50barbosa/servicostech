import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { BUSINESS, INSTAGRAM, WHATSAPP_NUMBER } from "@/lib/config";

/* Fonte display atlética para headlines */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

/* Fonte de corpo legível */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const TITLE = `${BUSINESS.name} — Personal Trainer em ${BUSINESS.cityFull} | Presencial e Online`;
const DESCRIPTION =
  "Personal trainer em Batalha-AL e online. Acompanhamento individualizado e seguro para emagrecimento, ganho de massa, reabilitação e mais saúde. Licenciado e Bacharel em Educação Física — CREF 003920-G/AL.";

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "personal trainer",
    "personal trainer Batalha AL",
    "personal trainer online",
    "consultoria online treino",
    "emagrecimento",
    "hipertrofia",
    "reabilitação",
    "treino individualizado",
    "Luiz Gustavo personal",
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BUSINESS.siteUrl,
    siteName: `${BUSINESS.name} · Personal Trainer`,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        // TODO: substituir por uma imagem de capa real (1200x630px) com a foto do Luiz.
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — Personal Trainer em ${BUSINESS.cityFull}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};

/* JSON-LD: ajuda o Google a entender o negócio local (SEO local) */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["HealthClub", "LocalBusiness"],
  name: `${BUSINESS.name} — Personal Trainer`,
  description: DESCRIPTION,
  url: BUSINESS.siteUrl,
  image: `${BUSINESS.siteUrl}/og-image.svg`,
  telephone: `+${WHATSAPP_NUMBER}`,
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Batalha", addressRegion: "AL" },
    { "@type": "Country", name: "Brasil (atendimento online)" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Batalha",
    addressRegion: "AL",
    addressCountry: "BR",
  },
  sameAs: [INSTAGRAM],
  founder: {
    "@type": "Person",
    name: BUSINESS.name,
    jobTitle: "Personal Trainer",
    description: `${BUSINESS.formacao} — CREF ${BUSINESS.cref}`,
  },
  makesOffer: [
    { "@type": "Offer", name: "Personal Training Presencial (Batalha-AL)" },
    { "@type": "Offer", name: "Consultoria Online" },
    { "@type": "Offer", name: "Treino para objetivo específico" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {/* SEO: dados estruturados do negócio local */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Link de pular para o conteúdo (acessibilidade) */}
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
