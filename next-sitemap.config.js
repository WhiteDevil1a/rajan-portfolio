module.exports = {
  siteUrl: 'https://rajanbhatta.com.np/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // Emit one sitemap entry per brand logo detail page
  additionalPaths: async () => {
    const { getAllIconsMeta } = await import('./src/lib/logoSearch/getIconData.js');
    const icons = getAllIconsMeta();
    return icons.map((icon) => ({
      loc: `/brand-tools/logo/${icon.slug}`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }));
  },
};
