import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kogito.education'; 

  // Static routes
  const routes = [
    '',
    '/about',
    '/pricing',
    '/tutors',
    '/contact',
    '/auth/login',
    '/auth/register',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
