/**
 * legacy-fonts.ts
 *
 * Configurable registry of Nepali legacy fonts and detection heuristics.
 * Identifies legacy fonts by font family name and provides statistical detection.
 */

export interface LegacyFontInfo {
  id: string;
  name: string;
  supported: boolean;
  converterId?: 'preeti';
  description?: string;
}

// Configurable registry of legacy fonts
export const LEGACY_FONTS_REGISTRY: Record<string, LegacyFontInfo> = {
  preeti: {
    id: 'preeti',
    name: 'Preeti',
    supported: true,
    converterId: 'preeti',
    description: 'Most common Nepali legacy font by Bhadrakali Mishra',
  },
  'font-preeti': {
    id: 'preeti',
    name: 'Font-Preeti',
    supported: true,
    converterId: 'preeti',
  },
  kantipur: {
    id: 'kantipur',
    name: 'Kantipur',
    supported: false,
    description: 'Kantipur Publications legacy font',
  },
  sagarmatha: {
    id: 'sagarmatha',
    name: 'Sagarmatha',
    supported: false,
  },
  himali: {
    id: 'himali',
    name: 'Himali',
    supported: false,
  },
  kanchan: {
    id: 'kanchan',
    name: 'Kanchan',
    supported: false,
  },
  'pcs nepali': {
    id: 'pcs-nepali',
    name: 'PCS Nepali',
    supported: false,
  },
  chandani: {
    id: 'chandani',
    name: 'Chandani',
    supported: false,
  },
  annapurna: {
    id: 'annapurna',
    name: 'Annapurna',
    supported: false,
  },
};

/**
 * Normalize font family name for robust matching (lowercase, trimmed, strip quotes & suffixes)
 */
export function normalizeFontName(fontName: string): string {
  if (!fontName) return '';
  return fontName
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if a font name is a recognized legacy font
 */
export function identifyLegacyFont(fontName: string): LegacyFontInfo | null {
  if (!fontName) return null;
  const normalized = normalizeFontName(fontName);

  // Exact match
  if (LEGACY_FONTS_REGISTRY[normalized]) {
    return LEGACY_FONTS_REGISTRY[normalized];
  }

  // Prefix or substring matching for font variants (e.g., "Preeti Regular", "Kantipur-Bold")
  for (const [key, info] of Object.entries(LEGACY_FONTS_REGISTRY)) {
    if (normalized.startsWith(key) || normalized.includes(key)) {
      return info;
    }
  }

  return null;
}

/**
 * Statistical Preeti detector:
 * Inspects ASCII text sample to estimate whether it looks like Preeti text
 * even if font names were stripped or replaced with Arial/Times New Roman.
 *
 * Preeti text has an unusually high density of:
 * - Matras: f (ा), l (ि), ] (े), } (ै), ' (ु), " (ू), [ (ृ)
 * - Special glyphs: { (र्), . (।)
 * - Consonants: s, k, d, t, b, r, n, j, z, ;, x, c
 * and lacks standard English stop words ("the", "and", "that", "this", "with", "have").
 */
export function detectPreetiHeuristic(sampleText: string): { isLikelyPreeti: boolean; confidence: number } {
  if (!sampleText || sampleText.length < 15) {
    return { isLikelyPreeti: false, confidence: 0 };
  }

  const clean = sampleText.replace(/\s+/g, ' ');
  const words = clean.split(' ').filter((w) => w.length > 0);
  if (words.length === 0) return { isLikelyPreeti: false, confidence: 0 };

  // Common English words that virtually never appear in pure Preeti
  const englishStopWords = new Set(['the', 'and', 'is', 'in', 'it', 'you', 'that', 'he', 'was', 'for', 'on', 'are', 'with', 'as', 'at', 'be', 'this', 'have', 'from']);
  let englishMatches = 0;
  for (const word of words.slice(0, 50)) {
    if (englishStopWords.has(word.toLowerCase())) {
      englishMatches++;
    }
  }

  if (englishMatches >= 3) {
    return { isLikelyPreeti: false, confidence: 0 };
  }

  // Count characteristic Preeti characters
  const preetiMarkers = /[fl\]\}'"{.]/g;
  const markerMatches = clean.match(preetiMarkers);
  const markerCount = markerMatches ? markerMatches.length : 0;
  const markerRatio = markerCount / clean.length;

  // Typical Nepali written in Preeti has ~12% to 28% matras and markers
  const confidence = Math.min(1, Math.max(0, markerRatio / 0.15));
  const isLikelyPreeti = markerRatio > 0.08 && englishMatches === 0;

  return { isLikelyPreeti, confidence };
}
