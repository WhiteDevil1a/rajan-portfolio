/**
 * preeti.ts
 *
 * Clean, verified Preeti ↔ Unicode Devanagari bidirectional font converter.
 * Permissive MIT/BSD compatible implementation.
 *
 * Handles:
 * - Choti-ikar (ि, 'l' in Preeti) reordering: typed before consonant in Preeti, after in Unicode.
 * - Reph (र्, '{' in Preeti) placement: typed after consonant in Preeti, before in Unicode.
 * - Half-forms and conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध, द्व, etc.)
 * - Punctuation and purna viram (।)
 * - Preserves whitespace and line breaks.
 */

export interface FontMapping {
  preetiToUnicode: Record<string, string>;
  unicodeToPreeti: Record<string, string>;
}

// Multi-character conjuncts and special combinations (sorted by descending length)
export const PREETI_CONJUNCTS: [string, string][] = [
  ['cf}+', 'औँ'],
  ['cf]+', 'ओँ'],
  ['f}+', 'ौँ'],
  ['f]+', 'ोँ'],
  [']+', 'ेँ'],
  ['}+', 'ैँ'],
  ['f+', 'ाँ'],
  ['l+', 'िँ'],
  ['I6«', 'ष्ट्र'],
  ['i6«', 'ष्ट्र'],
  ['6«', 'ट्र'],
  ['7«', 'ठ्र'],
  ['8«', 'ड्र'],
  ['9«', 'ढ्र'],
  ['«', '्र'],
  ['qm', 'त्र'],
  ['If', 'क्षा'],
  ['I', 'क्ष'],
  ['>', 'श्र'],
  ['|', '्र'],
  ['0', 'क्त'],
  ['§', 'ट्ट'],
  ['¶', 'ठ्ठ'],
  ['•', 'ड्ड'],
  ['‚', 'द्द'],
  ['„', 'द्ध'],
  ['…', 'द्य'],
  ['‡', 'द्व'],
  ['‰', 'द्म'],
  ['Š', 'श्च'],
  ['‹', 'श्न'],
  ['Œ', 'श्व'],
  ['‘', 'ह्न'],
  ['’', 'ह्मा'],
  ['“', 'ह्य'],
  ['”', 'ह्र'],
  ['•', 'ह्ल'],
  ['–', 'ह्व'],
  ['—', 'ऋ'],
  ['Í', 'ङ्क'],
  ['Î', 'ङ्ख'],
  ['Ï', 'ङ्ग'],
  ['Ð', 'ङ्घ'],
  ['˜', 'ज्ञ'],
  ['™', 'त्त'],
  ['š', 'त्थ'],
  ['›', 'त्न'],
  ['œ', 'त्म'],
  ['Ÿ', 'त्य'],
  ['¡', 'त्व'],
  ['¢', 'त्स'],
  ['£', 'ष्ट'],
  ['¤', 'ष्ठ'],
  ['¥', 'ष्ण'],
  ['¦', 'ष्य'],
  ['¿', 'रु'],
  ['÷', 'द्द'],
  ['‘', '‘'],
  ['’', '’'],
  ['“', '“'],
  ['”', '”'],
];

// Single character substitutions
export const PREETI_CHARS: [string, string][] = [
  ['~', 'ज्ञ'],
  ['!', '१'],
  ['@', '२'],
  ['#', '३'],
  ['$', '४'],
  ['%', '५'],
  ['^', '६'],
  ['&', '७'],
  ['*', '८'],
  ['(', '९'],
  [')', '०'],
  ['-', '('-')'],
  ['_', '—'],
  ['+', 'ं'],
  ['=', '.'],
  ['[', 'ृ'],
  [']', 'े'],
  ['{', 'र्'],
  ['}', 'ै'],
  ['\\', '्'],
  ['|', '्र'],
  [';', 'स'],
  [':', 'स्'],
  ["'", 'ु'],
  ['"', 'ू'],
  [',', ','],
  ['<', 'ङ'],
  ['.', '।'],
  ['/', 'र'],
  ['?', 'रु'],
  ['`', 'ं'],
  ['~', 'ज्ञ'],

  // Vowels
  ['c', 'अ'],
  ['cf', 'आ'],
  ['O', 'इ'],
  ['O{', 'ई'],
  ['pm', 'उ'],
  ['pm{', 'ऊ'],
  ['P', 'ए'],
  ['P}', 'ऐ'],
  ['cf]', 'ओ'],
  ['cf}', 'औ'],
  ['c+', 'अं'],
  ['cM', 'अः'],

  // Consonants and half consonants
  ['s', 'क'],
  ['S', 'क्'],
  ['v', 'ख'],
  ['V', 'ख्'],
  ['u', 'ग'],
  ['U', 'ग्'],
  ['3', 'घ'],
  ['ª', 'ङ'],
  ['r', 'च'],
  ['R', 'च्'],
  ['5', 'छ'],
  ['h', 'ज'],
  ['H', 'ज्'],
  ['´', 'झ'],
  ['`', 'ञ'],
  ['6', 'ट'],
  ['7', 'ठ'],
  ['8', 'ड'],
  ['9', 'ढ'],
  ['0', 'ण'],
  ['t', 'त'],
  ['T', 'त्'],
  ['y', 'थ'],
  ['Y', 'थ्'],
  ['b', 'द'],
  ['w', 'ध'],
  ['W', 'ध्'],
  ['g', 'न'],
  ['G', 'न्'],
  ['k', 'प'],
  ['K', 'प्'],
  ['km', 'फ'],
  ['Km', 'फ्'],
  ['a', 'ब'],
  ['A', 'ब्'],
  ['e', 'भ'],
  ['E', 'भ्'],
  ['d', 'म'],
  ['D', 'म्'],
  ['o', 'य'],
  ['O', 'य्'],
  ['/', 'र'],
  ['n', 'ल'],
  ['N', 'ल्'],
  ['j', 'व'],
  ['J', 'व्'],
  ['z', 'श'],
  ['Z', 'श्'],
  ['i', 'ष'],
  ['I', 'ष्'],
  [';', 'स'],
  [':', 'स्'],
  ['x', 'ह'],
  ['X', 'ह्'],

  // Matras
  ['f', 'ा'],
  ['L', 'ी'],
  ['l', 'ि'],
  ['\'', 'ु'],
  ['"', 'ू'],
  ['[', 'ृ'],
  [']', 'े'],
  ['}', 'ै'],
  ['f]', 'ो'],
  ['f}', 'ौ'],
  ['F', 'ँ'],
  ['M', 'ः'],
  ['B', 'ं'],
  ['\\', '्'],
];

/**
 * Convert Preeti legacy font text to standard Unicode Devanagari
 */
export function preetiToUnicode(text: string): string {
  if (!text) return '';

  let out = text;

  // Handle reph '{' which in Preeti is typed after the consonant (and optional matra like 'f' or 'L')
  // e.g. "k{" -> "{k" so it becomes "र्" + "क", "/f{" -> "{/f" so it becomes "र्" + "रा", "yL{" -> "{yL" so it becomes "र्" + "थी"
  out = out.replace(
    /([a-zA-Z0-9;:<>\?~\/§¶•‚„…‡‰Š‹Œ‘’“”–—˜™š›œŸ¡¢£¤¥¦¿÷\u0080-\u00FF])(f\]|f\}|[fL'\"\[\]\}])?\{/g,
    '{$1$2',
  );

  // Handle choti-ikar 'l' before retroflex conjuncts with '«' (e.g. li6« -> i6« + ि)
  out = out.replace(/l([I|i]?[6789]«)/g, '$1\u093F');

  // Handle choti-ikar 'l' typed before consonant
  // e.g. "lk" -> "kl" so consonant is replaced first, then matra appended
  // Support conjuncts preceding 'l' as well (e.g. "l:k" -> ":kl") without overshooting to next full consonant
  out = out.replace(/l([A-Z:\\\u0080-\u00FF]*[a-z0-9;<>\?~\/§¶•‚„…‡‰Š‹Œ‘’“”–—˜™š›œŸ¡¢£¤¥¦¿÷A-Z])/g, '$1l');

  // Replace multi-char conjuncts
  for (const [p, u] of PREETI_CONJUNCTS) {
    out = out.split(p).join(u);
  }

  // Replace single characters
  for (const [p, u] of PREETI_CHARS) {
    out = out.split(p).join(u);
  }

  // Clean up any double viramas or misaligned matras
  out = out.replace(/्ा/g, '');
  // Normalize combined vowel signs and independent vowels to canonical Unicode forms
  out = out.replace(/अा/g, 'आ').replace(/ाे/g, 'ो').replace(/ाै/g, 'ौ').normalize('NFC');

  return out;
}

/**
 * Convert standard Unicode Devanagari text to Preeti font
 */
export function unicodeToPreeti(text: string): string {
  if (!text) return '';

  let out = text;

  // Map reverse of conjuncts
  for (const [p, u] of PREETI_CONJUNCTS) {
    out = out.split(u).join(p);
  }

  // Map reverse of characters
  for (const [p, u] of PREETI_CHARS) {
    out = out.split(u).join(p);
  }

  // Reorder choti-ikar 'l': in Unicode it is after consonant, in Preeti it must precede
  out = out.replace(/([a-zA-Z0-9\u0080-\u00FF])l/g, 'l$1');

  // Reorder reph '{': in Unicode it is before consonant, in Preeti it comes after
  out = out.replace(/\{([a-zA-Z0-9\u0080-\u00FF])/g, '$1{');

  return out;
}
