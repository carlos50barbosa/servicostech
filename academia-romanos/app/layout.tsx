import type { Metadata, Viewport } from 'next'
import { SITE } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default:
      'Academia Romanos — Academia em Carapicuíba (COHAB 2 / COHAB 5) há 20 anos',
    template: '%s | Academia Romanos',
  },
  description:
    'Academia de bairro em Carapicuíba há 20 anos. Musculação, funcional, pilates e jiu-jitsu na COHAB 2 / COHAB 5. Acolhimento ao iniciante, planos acessíveis e estacionamento próprio. Comece pelo WhatsApp.',
  keywords: [
    'academia em Carapicuíba',
    'musculação COHAB 2',
    'academia COHAB 5',
    'academia perto de mim',
    'pilates Carapicuíba',
    'jiu-jitsu Carapicuíba',
    'funcional Carapicuíba',
    'Academia Romanos',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE.url,
    siteName: SITE.name,
    title: 'Academia Romanos — Há 20 anos no seu bairro, em Carapicuíba',
    description:
      'Musculação, funcional, pilates e jiu-jitsu na COHAB 2 / COHAB 5. Você não precisa estar pronto, só precisa começar.',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'Academia Romanos — 20 anos em Carapicuíba',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Academia Romanos — Há 20 anos no seu bairro, em Carapicuíba',
    description:
      'Musculação, funcional, pilates e jiu-jitsu na COHAB 2 / COHAB 5. Comece pelo WhatsApp.',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Dados estruturados LocalBusiness (JSON-LD) para SEO local.
 * Ajustar endereço/geo/horários quando confirmados com o cliente.
 */
function LocalBusinessJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'ExerciseGym', 'LocalBusiness'],
    name: SITE.name,
    description:
      'Academia de bairro em Carapicuíba há 20 anos. Musculação, funcional, pilates e jiu-jitsu.',
    url: SITE.url,
    image: `${SITE.url}/og.svg`,
    logo: `${SITE.url}/logo.svg`,
    telephone: `+${SITE.whatsapp}`,
    priceRange: '$$',
    foundingDate: '2006',
    sameAs: [SITE.instagram],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.postalCode,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: ['Carapicuíba', 'COHAB 2', 'COHAB 5'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '06:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '12:00',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Fontes via <link> (carregam no navegador do cliente / Vercel).
            Para self-hosting/otimização, troque por next/font/google. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Link no layout raiz aplica a todas as rotas (site de página única). */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <LocalBusinessJsonLd />
      </head>
      <body className="font-sans antialiased">
        {/* Marca que há JS antes do primeiro paint: o CSS de scroll-reveal só
            oculta elementos quando .js está no <html> — sem JS, tudo aparece. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
      </body>
    </html>
  )
}
