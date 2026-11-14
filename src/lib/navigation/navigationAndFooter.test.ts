import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { TOOLS, TOOLS_BY_CATEGORY, TOOL_CATEGORIES } from '../../data/tools';
import menuLinks from '../../components/dom/navbar/constants/menuLinks';
import footerLinks from '../../components/dom/navbar/constants/footerLinks';

describe('Phase 3: Navigation, Dropdown, Footer Sitemap & Legal Pages', () => {
  it('has all 21 tools registered with unique IDs and working hrefs', () => {
    expect(TOOLS.length).toBe(21);
    const ids = new Set(TOOLS.map((t) => t.id));
    expect(ids.size).toBe(21);

    for (const tool of TOOLS) {
      expect(tool.href).toMatch(/^\/brand-tools\//);
      expect(tool.title).toBeTruthy();
      expect(tool.category).toBeTruthy();
    }
  });

  it('correctly partitions all tools across categories without orphans', () => {
    const totalPartitioned = TOOL_CATEGORIES.reduce(
      (sum, cat) => sum + (TOOLS_BY_CATEGORY[cat]?.length || 0),
      0
    );
    expect(totalPartitioned).toBe(21);

    expect(TOOLS_BY_CATEGORY['Brand Foundation'].length).toBe(4);
    expect(TOOLS_BY_CATEGORY['Branded Assets'].length).toBe(4);
    expect(TOOLS_BY_CATEGORY['Brand Research'].length).toBe(1);
    expect(TOOLS_BY_CATEGORY['Image & SVG Tools'].length).toBe(5);
    expect(TOOLS_BY_CATEGORY['Nepali Tools'].length).toBe(7);
  });

  it('has verified legal trust pages created in pages directory', () => {
    const pagesDir = path.resolve(__dirname, '../../pages');
    const legalPages = ['privacy.page.jsx', 'terms.page.jsx', 'licenses.page.jsx'];

    for (const pageFile of legalPages) {
      const fullPath = path.join(pagesDir, pageFile);
      expect(fs.existsSync(fullPath)).toBe(true);

      const content = fs.readFileSync(fullPath, 'utf8');
      expect(content).toContain('CustomHead');
      expect(content).toContain('breadcrumbs');
      expect(content).toContain('Rajan Bhatta');
    }
  });

  it('guarantees legal pages verify zero uploads and permissive licensing', () => {
    const privacyPath = path.resolve(__dirname, '../../pages/privacy.page.jsx');
    const privacyContent = fs.readFileSync(privacyPath, 'utf8');
    expect(privacyContent).toContain('100% client-side');
    expect(privacyContent).toContain('no bytes are ever transmitted');

    const licensesPath = path.resolve(__dirname, '../../pages/licenses.page.jsx');
    const licensesContent = fs.readFileSync(licensesPath, 'utf8');
    expect(licensesContent).toContain('MIT');
    expect(licensesContent).toContain('Apache-2.0');
    expect(licensesContent).toContain('SIL Open Font License');
  });

  it('has main navigation links and external footer links configured correctly', () => {
    expect(menuLinks.some((l) => l.title === 'Brand Tools' && l.href === '/brand-tools')).toBe(true);
    expect(footerLinks.length).toBeGreaterThanOrEqual(3);
    for (const link of footerLinks) {
      expect(link.href).toMatch(/^https:\/\//);
    }
  });
});
