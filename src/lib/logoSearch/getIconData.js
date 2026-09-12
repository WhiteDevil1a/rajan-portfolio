/**
 * getIconData.js
 * Build-time helper: returns lightweight metadata (slug, title, hex, svg) for all icons.
 */

import * as si from 'simple-icons';

/**
 * getAllIconsMeta — call at build time (getStaticProps / getStaticPaths).
 * Returns an array of { slug, title, hex, svg, hsl }.
 */
export function getAllIconsMeta() {
  function hexToHSL(hex) {
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  const icons = Object.values(si).filter(
    (v) => v && typeof v === 'object' && v.slug && v.title && v.hex,
  );
  return icons
    .map(({ slug, title, hex, svg }) => ({ slug, title, hex, svg, hsl: hexToHSL(hex) }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * getIconBySlug — call at build time (getStaticProps for [slug].page.jsx).
 * Returns full { slug, title, hex, svg } for a single icon.
 */
export function getIconBySlug(slug) {
  const icon = Object.values(si).find(
    (v) => v && typeof v === 'object' && v.slug === slug,
  );
  if (!icon) return null;
  return {
    slug: icon.slug,
    title: icon.title,
    hex: icon.hex,
    svg: icon.svg,
  };
}
