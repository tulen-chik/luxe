import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '/*.json$',
      ],
    },
    sitemap: 'https://beauty-platform.com/sitemap.xml',
  }
}
