/**
 * Color utility functions for conversions, WCAG 2.1 calculations, tints, and shades.
 */

export const isValidHex = (hex) => {
  if (!hex || typeof hex !== 'string') return false;
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex.trim());
};

export const normalizeHex = (hex) => {
  if (!hex) return '#000000';
  let clean = hex.trim();
  if (!clean.startsWith('#')) clean = `#${clean}`;
  if (clean.length === 4) {
    clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
  }
  return isValidHex(clean) ? clean.toUpperCase() : '#000000';
};

export const hexToRgb = (hex) => {
  const norm = normalizeHex(hex);
  const r = parseInt(norm.slice(1, 3), 16);
  const g = parseInt(norm.slice(3, 5), 16);
  const b = parseInt(norm.slice(5, 7), 16);
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
};

export const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const rgbToCmyk = (r, g, b) => {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const k = 1 - Math.max(rN, gN, bN);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round(((1 - rN - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gN - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bN - k) / (1 - k)) * 100);
  return { c, m, y, k: Math.round(k * 100) };
};

/**
 * Calculates WCAG 2.1 relative luminance for a HEX color.
 */
export const getLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
};

/**
 * Calculates WCAG 2.1 contrast ratio between two colors (1 to 21).
 */
export const getContrastRatio = (hex1, hex2) => {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
};

/**
 * Returns compliance ratings for AA, AAA and UI.
 */
export const getWcagRatings = (ratio) => ({
  ratio,
  scoreText: `${ratio.toFixed(2)}:1`,
  aaNormal: ratio >= 4.5,
  aaLarge: ratio >= 3.0,
  aaaNormal: ratio >= 7.0,
  aaaLarge: ratio >= 4.5,
  uiComponents: ratio >= 3.0,
  level: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3.0 ? 'AA Large Only' : 'Fail',
});

/**
 * Returns '#FFFFFF' or '#111111' depending on background luminance.
 */
export const getOptimalTextColor = (bgHex) => {
  const lum = getLuminance(bgHex);
  return lum > 0.4 ? '#111111' : '#FFFFFF';
};

/**
 * Generates array of tints (moving towards white).
 */
export const generateTints = (hex, count = 10) => {
  const { r, g, b } = hexToRgb(hex);
  const tints = [];
  for (let i = 1; i <= count; i += 1) {
    const factor = i / (count + 1);
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    const tintHex = rgbToHex(newR, newG, newB);
    tints.push({
      hex: tintHex,
      percentage: `${Math.round(factor * 100)}% Light`,
      contrastAgainstWhite: getContrastRatio(tintHex, '#FFFFFF'),
      contrastAgainstDark: getContrastRatio(tintHex, '#111111'),
    });
  }
  return tints;
};

/**
 * Generates array of shades (moving towards black).
 */
export const generateShades = (hex, count = 10) => {
  const { r, g, b } = hexToRgb(hex);
  const shades = [];
  for (let i = 1; i <= count; i += 1) {
    const factor = 1 - i / (count + 1);
    const newR = Math.round(r * factor);
    const newG = Math.round(g * factor);
    const newB = Math.round(b * factor);
    const shadeHex = rgbToHex(newR, newG, newB);
    shades.push({
      hex: shadeHex,
      percentage: `${Math.round((1 - factor) * 100)}% Dark`,
      contrastAgainstWhite: getContrastRatio(shadeHex, '#FFFFFF'),
      contrastAgainstDark: getContrastRatio(shadeHex, '#111111'),
    });
  }
  return shades;
};

export const colorDistance = (rgb1, rgb2) => {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
};
