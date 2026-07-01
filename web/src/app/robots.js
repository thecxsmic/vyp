export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sign-in', '/sign-up'],
    },
    sitemap: 'https://svay.space/sitemap.xml',
  };
}
