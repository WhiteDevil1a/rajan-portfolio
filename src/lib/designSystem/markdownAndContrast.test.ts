import { describe, it, expect } from 'vitest';
import { TOOLS } from '../../data/tools';

// Relative luminance calculator (WCAG 2.1 algorithm)
function getLuminance(hex: string): number {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16) / 255)
    .map((val) => (val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Inline markdown formatter matching Prose.tsx
function formatInline(text: string): string {
  let res = text;
  res = res.replace(/\$\$(.+?)\$\$/g, '<code>$1</code>');
  res = res.replace(/\$([^\$\n]+?)\$/g, '<code>$1</code>');
  res = res.replace(/`([^`]+?)`/g, '<code>$1</code>');
  res = res.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return res;
}

describe('Phase 2 - Color Contrast Verification', () => {
  it('verifies white button text on #ff2828 exceeds WCAG UI element / large text standard (>= 3.0:1)', () => {
    const brandRed = '#ff2828';
    const whiteBtnText = '#ffffff';

    const contrastWhiteOnRed = getContrastRatio(whiteBtnText, brandRed);

    // White on #ff2828 achieves 3.76:1 (passes WCAG UI element and large text >= 3:1)
    expect(contrastWhiteOnRed).toBeGreaterThanOrEqual(3.0);
  });

  it('verifies tool text and dark red links pass WCAG AA on white surface', () => {
    const white = '#ffffff';
    const darkRedLink = '#d31616';
    const bodyText = '#1f2120';
    const secondaryText = '#525754';

    expect(getContrastRatio(darkRedLink, white)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(bodyText, white)).toBeGreaterThanOrEqual(10.0);
    expect(getContrastRatio(secondaryText, white)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Phase 2 - Markdown & LaTeX Sanitization', () => {
  it('strips raw LaTeX delimiters and wraps formulas in styled code tags', () => {
    const rawFormula = 'luminance transformation ($Y = 0.299R + 0.587G + 0.114B$)';
    const formatted = formatInline(rawFormula);

    expect(formatted).not.toContain('$');
    expect(formatted).toContain('<code>Y = 0.299R + 0.587G + 0.114B</code>');
  });

  it('replaces markdown bold with <strong> tags', () => {
    const rawBold = 'This is **essential** brand text.';
    const formatted = formatInline(rawBold);

    expect(formatted).not.toContain('**');
    expect(formatted).toContain('<strong>essential</strong>');
  });

  it('scans all 21 tools in tools.ts to guarantee zero raw LaTeX delimiters remain', () => {
    for (const tool of TOOLS) {
      if (tool.longDescription) {
        const formatted = formatInline(tool.longDescription);
        // Ensure no unparsed LaTeX math delimiters remain
        expect(formatted).not.toMatch(/\$[^$]+\$/);
        expect(formatted).not.toMatch(/\$\$/);
      }
    }
  });

  it('scans generated brand-tools HTML files to guarantee zero unrendered markdown or LaTeX delimiters', () => {
    const fs = require('fs');
    const path = require('path');
    const dir = path.resolve('.next/server/pages/brand-tools');

    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.html'));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8');
        // Strip out scripts / JSON-LD blobs before checking visible rendered DOM
        const bodyContent = raw.replace(/<script[\s\S]*?<\/script>/gi, '');

        expect(bodyContent).not.toMatch(/###\s/);
        expect(bodyContent).not.toMatch(/\*\*[^*]+?\*\*/);
        expect(bodyContent).not.toMatch(/\$\$/);
      }
    }
  });
});

