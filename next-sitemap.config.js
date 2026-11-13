const toolSlugs = require('./src/data/toolSlugs.js');

module.exports = {
  siteUrl: 'https://rajanbhatta.com.np',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  additionalPaths: async () => {
    const paths = [];

    // All brand tools suite pages
    for (const slug of toolSlugs) {
      paths.push({
        loc: `/brand-tools/${slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    }

    // Logo search icons
    try {
      const { getAllIconsMeta } = await import('./src/lib/logoSearch/getIconData.js');
      const icons = getAllIconsMeta();
      for (const icon of icons) {
        paths.push({
          loc: `/brand-tools/logo/${icon.slug}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: new Date().toISOString(),
        });
      }
    } catch (e) {
      // Fallback silently if icons cannot be loaded at config evaluation time
    }

    return paths;
  },
};
