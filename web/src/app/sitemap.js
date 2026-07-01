export default function sitemap() {
  const baseUrl = 'https://svay.space';
  
  // Public static routes to be indexed by search engines
  const routes = [
    '',
    '/docs',
    '/privacy',
    '/terms',
    '/cookies',
    '/refund',
  ];
  
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.5,
  }));
}
