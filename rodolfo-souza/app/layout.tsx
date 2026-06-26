import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { SITE, CONTATO, ENDERECO, LEGAL } from "@/lib/config";
import { withBasePath } from "@/lib/base-path";

// Fonte de display (titulos) e corpo, com display: swap para performance.
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const description =
  "Transforme o limite do seu cartão em dinheiro na conta via PIX. Crédito facilitado em até 18x, sem consulta ao SPC ou Serasa e sem comprovação de renda. Simule sem compromisso.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — Crédito facilitado com as melhores taxas`,
    template: `%s · ${SITE.nome}`,
  },
  description,
  keywords: [
    "crédito",
    "empréstimo no cartão",
    "dinheiro via PIX",
    "sem consulta SPC Serasa",
    "Batalha Alagoas",
    "crédito para negativado",
    "limite do cartão em dinheiro",
  ],
  authors: [{ name: SITE.nome }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE.url,
    siteName: SITE.nome,
    title: `${SITE.nome} — Crédito facilitado com as melhores taxas`,
    description,
    images: [
      {
        // TODO: para máxima compatibilidade social, gere um PNG 1200x630
        // a partir deste SVG e troque a extensão aqui.
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${SITE.nome} — crédito facilitado via PIX`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.nome} — Crédito facilitado`,
    description,
    images: ["/og-image.svg"],
  },
  icons: {
    // Sob basePath, links diretos a /public precisam do prefixo manual.
    icon: [{ url: withBasePath("/favicon.svg"), type: "image/svg+xml" }],
    apple: withBasePath("/favicon.svg"),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2E0F4F",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD: ajuda o Google a entender o negocio local (FinancialService).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE.nome,
  description,
  url: SITE.url,
  telephone: CONTATO.telefone,
  image: `${SITE.url}/og-image.png`,
  priceRange: "$$",
  areaServed: `${ENDERECO.cidade} e ${ENDERECO.regiao}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: ENDERECO.logradouro,
    addressLocality: ENDERECO.cidade,
    addressRegion: ENDERECO.estado,
    postalCode: ENDERECO.cep,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: ENDERECO.geo.lat,
    longitude: ENDERECO.geo.lng,
  },
  sameAs: [CONTATO.instagramUrl],
  // NOTE: vatID/CNPJ e placeholder — preencher dado real antes de publicar.
  ...(LEGAL.cnpj.startsWith("[") ? {} : { vatID: LEGAL.cnpj }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <body>
        {/* Marca que há JS ANTES do primeiro paint: o CSS de scroll-reveal só
            oculta elementos quando .js está presente — sem JS, tudo aparece. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* Link de pular para o conteudo — acessibilidade por teclado. */}
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
