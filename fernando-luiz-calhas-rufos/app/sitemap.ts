import type { MetadataRoute } from 'next';
import { seo } from '@/lib/site-config';

/**
 * Sitemap gerado automaticamente pelo Next.
 * Como é uma landing page de página única, listamos a home e as âncoras principais.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: seo.siteUrl,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${seo.siteUrl}/#servicos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${seo.siteUrl}/#contato`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
