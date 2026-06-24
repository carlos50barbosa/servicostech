import type { Metadata } from "next";
import { Cormorant_Garamond, Mulish, Sacramento } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

/* ---------------------------------------------------------------------------
   FONTES (next/font — carregamento otimizado, sem flash)
   - Títulos: Cormorant Garamond (serifada, elegante)
   - Corpo:   Mulish (leve e acolhedora)
   - Detalhe: Sacramento (cursiva, usada com parcimônia no nome)
--------------------------------------------------------------------------- */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* ---------------------------------------------------------------------------
   METADATA / SEO (App Router)
--------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seo.title,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.nome }],
  creator: site.nome,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: `${site.nome} · ${site.profissao}`,
    title: site.seo.title,
    description: site.seo.description,
    images: [
      {
        url: site.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.nome} — ${site.profissao} (${site.crp})`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [site.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ---------------------------------------------------------------------------
   JSON-LD — dados estruturados (schema Psychologist / MedicalBusiness)
--------------------------------------------------------------------------- */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Psychologist", "MedicalBusiness"],
  name: site.nome,
  description: site.seo.description,
  url: site.url,
  image: `${site.url}${site.seo.ogImage}`,
  telephone: `+${site.contato.whatsappInternacional}`,
  priceRange: "$$",
  medicalSpecialty: "Psychiatric",
  knowsLanguage: "pt-BR",
  identifier: {
    "@type": "PropertyValue",
    name: "CRP",
    value: site.crp,
  },
  areaServed: {
    "@type": "Country",
    name: "Brasil",
  },
  availableService: site.especialidades.itens.map((item) => ({
    "@type": "MedicalTherapy",
    name: item.titulo,
    description: item.texto,
  })),
  sameAs: [site.contato.instagramUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${mulish.variable} ${sacramento.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-creme text-texto">
        {children}

        {/* Dados estruturados para o Google (rich results) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/*
          =====================================================================
          ANALYTICS (desativado — ative quando tiver os IDs)
          =====================================================================
          Recomendado usar o componente <Script> do Next.js:
              import Script from "next/script";

          --- Google Analytics 4 ---------------------------------------------
          Troque G-XXXXXXXXXX pelo seu ID de medição (Admin > Fluxos de dados):

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');`}
          </Script>

          --- Meta Pixel (Facebook/Instagram) --------------------------------
          Troque SEU_PIXEL_ID pelo ID do seu pixel (Gerenciador de Eventos):

          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'SEU_PIXEL_ID');
              fbq('track', 'PageView');`}
          </Script>
          =====================================================================
        */}
      </body>
    </html>
  );
}
