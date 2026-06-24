import type { MetadataRoute } from 'next';
import { seo } from '@/lib/site-config';

/** robots.txt gerado automaticamente pelo Next. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}
