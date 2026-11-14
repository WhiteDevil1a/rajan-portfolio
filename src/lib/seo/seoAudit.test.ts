import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { TOOLS, TOOLS_BY_ID } from '../../data/tools';

describe('Phase 4: SEO Audit & Technical Compliance', () => {
  it('has unique, high-quality seoTitle and seoDescription for all 21 tools', () => {
    expect(TOOLS.length).toBe(21);

    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const tool of TOOLS) {
      expect(tool.seoTitle, `Tool ${tool.id} is missing seoTitle`).toBeTruthy();
      expect(tool.seoDescription, `Tool ${tool.id} is missing seoDescription`).toBeTruthy();

      // Check uniqueness
      expect(titles.has(tool.seoTitle), `Duplicate seoTitle: ${tool.seoTitle}`).toBe(false);
      expect(descriptions.has(tool.seoDescription), `Duplicate seoDescription: ${tool.seoDescription}`).toBe(false);

      titles.add(tool.seoTitle);
      descriptions.add(tool.seoDescription);

      // Verify lengths: titles should be concise and not truncated in SERPs
      expect(tool.seoTitle.length).toBeGreaterThanOrEqual(25);
      expect(tool.seoTitle.length).toBeLessThanOrEqual(80);

      // Meta descriptions should provide sufficient context without severe truncation
      expect(tool.seoDescription.length).toBeGreaterThanOrEqual(90);
      expect(tool.seoDescription.length).toBeLessThanOrEqual(210);

      // Verify no banned claims
      expect(tool.seoTitle).not.toContain('guaranteed #1');
      expect(tool.seoDescription).not.toContain('guaranteed #1');
      expect(tool.seoTitle).not.toContain('100% accurate');
      expect(tool.seoDescription).not.toContain('100% accurate');
    }
  });

  it('verifies CustomHead outputs og:locale and self-referencing canonical', () => {
    const headPath = path.resolve(__dirname, '../../components/dom/CustomHead.jsx');
    const content = fs.readFileSync(headPath, 'utf8');

    expect(content).toContain('property="og:locale" content="en_US"');
    expect(content).toContain('rel="canonical"');
    expect(content).toContain('property="og:image"');
    expect(content).toContain('name="twitter:card"');
    // Ensure keywords meta tag is not rendered
    expect(content).not.toContain('name="keywords"');
    // Ensure viewport does not disable zoom
    expect(content).not.toContain('user-scalable=no');
    expect(content).not.toContain('maximum-scale=1');
  });

  it('verifies _document preloads font files correctly with crossOrigin', () => {
    const docPath = path.resolve(__dirname, '../../pages/_document.page.jsx');
    const content = fs.readFileSync(docPath, 'utf8');

    expect(content).toContain('rel="preload" href="/fonts/NeueHaasDisplayBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous"');
    expect(content).toContain('rel="preload" href="/fonts/NeueHaasDisplayRoman.woff2" as="font" type="font/woff2" crossOrigin="anonymous"');
  });

  it('verifies legal trust pages have BreadcrumbList schema', () => {
    const pagesDir = path.resolve(__dirname, '../../pages');
    const legalPages = ['privacy.page.jsx', 'terms.page.jsx', 'licenses.page.jsx'];

    for (const pageFile of legalPages) {
      const fullPath = path.join(pagesDir, pageFile);
      const content = fs.readFileSync(fullPath, 'utf8');

      expect(content).toContain('BreadcrumbList');
      expect(content).toContain('application/ld+json');
    }
  });

  it('verifies 404 and 500 error pages exist and do not soft-redirect', () => {
    const page404 = fs.readFileSync(path.resolve(__dirname, '../../pages/404.page.jsx'), 'utf8');
    expect(page404).toContain('404 — Page Not Found');
    expect(page404).toContain('noindex,follow');
    expect(page404).not.toContain('router.push');

    const page500 = fs.readFileSync(path.resolve(__dirname, '../../pages/500.page.jsx'), 'utf8');
    expect(page500).toContain('500 — Server Error');
    expect(page500).toContain('noindex,nofollow');
  });

  it('verifies robots.txt exists and references sitemap.xml', () => {
    const robotsPath = path.resolve(__dirname, '../../../public/robots.txt');
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, 'utf8');
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Sitemap: https://rajanbhatta.com.np/sitemap.xml');
  });
});
