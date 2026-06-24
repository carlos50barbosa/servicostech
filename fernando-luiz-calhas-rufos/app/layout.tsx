import type { Metadata, Viewport } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import { business, contact, seo, areaAtuacao } from '@/lib/site-config';

/* -------------------------------------------------------------------------- */
/*  FONTES (via next/font — Google Fonts, sem requisições externas em runtime) */
/* -------------------------------------------------------------------------- */

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

/* -------------------------------------------------------------------------- */
/*  METADADOS / SEO                                                            */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: seo.title,
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: business.fullName }],
  creator: business.fullName,
  publisher: business.fullName,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: seo.siteUrl,
    siteName: business.fullName,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${business.fullName} — Campinas e região`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
  category: 'business',
};

export const viewport: Viewport = {
  themeColor: '#0B1E3F',
  width: 'device-width',
  initialScale: 1,
};

/* -------------------------------------------------------------------------- */
/*  JSON-LD — Schema.org LocalBusiness (ajuda o Google a entender o negócio)   */
/* -------------------------------------------------------------------------- */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: business.fullName,
  description: seo.description,
  url: seo.siteUrl,
  telephone: contact.phoneTel,
  image: `${seo.siteUrl}${seo.ogImage}`,
  slogan: business.slogan,
  // TROCAR: ajuste o priceRange e o horário conforme a realidade do negócio.
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: business.city,
    addressRegion: business.state,
    addressCountry: 'BR',
  },
  areaServed: areaAtuacao.cities.map((city) => ({
    '@type': 'City',
    name: city,
  })),
  sameAs: [contact.instagram.url],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '08:00',
      closes: '12:00',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        {/* JSON-LD para SEO local */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
