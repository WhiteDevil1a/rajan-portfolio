/**
 * transliteration.ts
 *
 * Client-side Romanized English to Devanagari (Nepali Unicode) phonetic engine.
 * Fast, lightweight, MIT licensed.
 */

// Mapping of roman sequences to devanagari characters (longest prefix first)
const ROMAN_MAP: [string, string][] = [
  // Special conjuncts & multi-vowels
  ['shree', 'श्री'],
  ['shri', 'श्री'],
  ['ksha', 'क्ष'],
  ['chha', 'छ'],
  ['tra', 'त्र'],
  ['gya', 'ज्ञ'],
  ['dha', 'ध'],
  ['bha', 'भ'],
  ['cha', 'च'],
  ['ch', 'च'],
  ['tha', 'थ'],
  ['g实施', ''],
  ['jha', 'झ'],
  ['pha', 'फ'],
  ['kha', 'ख'],
  ['gha', 'घ'],
  ['ng', 'ङ'],
  ['aa', 'आ'],
  ['ee', 'ई'],
  ['oo', 'ऊ'],
  ['ai', 'ऐ'],
  ['au', 'औ'],
  ['am', 'अं'],
  ['ah', 'अः'],
  ['om', 'ॐ'],

  // Consonants with implicit schwa 'a'
  ['ka', 'क'],
  ['kha', 'ख'],
  ['ga', 'ग'],
  ['gha', 'घ'],
  ['nga', 'ङ'],
  ['ca', 'च'],
  ['cha', 'छ'],
  ['ja', 'ज'],
  ['jha', 'झ'],
  ['ta', 'त'],
  ['tha', 'थ'],
  ['da', 'द'],
  ['dha', 'ध'],
  ['na', 'न'],
  ['pa', 'प'],
  ['pha', 'फ'],
  ['fa', 'फ'],
  ['ba', 'ब'],
  ['bha', 'भ'],
  ['ma', 'म'],
  ['ya', 'य'],
  ['ra', 'र'],
  ['la', 'ल'],
  ['wa', 'व'],
  ['va', 'व'],
  ['sha', 'श'],
  ['sa', 'स'],
  ['ha', 'ह'],

  // Pure consonants (with halanta / virama)
  ['k', 'क्'],
  ['kh', 'ख्'],
  ['g', 'ग्'],
  ['gh', 'घ्'],
  ['c', 'च्'],
  ['j', 'ज्'],
  ['jh', 'झ्'],
  ['t', 'त्'],
  ['th', 'थ्'],
  ['d', 'द्'],
  ['dh', 'ध्'],
  ['n', 'न्'],
  ['p', 'प्'],
  ['ph', 'फ्'],
  ['f', 'फ्'],
  ['b', 'ब्'],
  ['bh', 'भ्'],
  ['m', 'म्'],
  ['y', 'य्'],
  ['r', 'र्'],
  ['l', 'ल्'],
  ['w', 'व्'],
  ['v', 'व्'],
  ['s', 'स्'],
  ['sh', 'श्'],
  ['h', 'ह्'],

  // Vowels
  ['a', 'अ'],
  ['i', 'इ'],
  ['u', 'उ'],
  ['e', 'ए'],
  ['o', 'ओ'],

  // Matras on halanta letters
  ['्a', ''],
  ['्aa', 'ा'],
  ['्i', 'ि'],
  ['्ee', 'ी'],
  ['्u', 'ु'],
  ['्oo', 'ू'],
  ['्e', 'े'],
  ['्ai', 'ै'],
  ['्o', 'ो'],
  ['्au', 'ौ'],
  ['्am', 'ं'],
  ['्ah', 'ः'],
];

// Common dictionary words for instant auto-correct / suggestions
export const COMMON_NEPALI_WORDS: Record<string, string> = {
  namaste: 'नमस्ते',
  nepal: 'नेपाल',
  nepali: 'नेपाली',
  mero: 'मेरो',
  desh: 'देश',
  dhanyabad: 'धन्यवाद',
  subhaprabhat: 'शुभप्रभात',
  shanti: 'शान्ति',
  kathmandu: 'काठमाडौँ',
  pokhara: 'पोखरा',
  tapai: 'तपाईं',
  timi: 'तिमी',
  ma: 'म',
  hami: 'हामी',
  kina: 'किन',
  kasari: 'कसरी',
  kahile: 'कहिल्यै',
  pani: 'पानी',
  ramro: 'राम्रो',
  sanchai: 'सञ्चै',
  dhanyavad: 'धन्यवाद',
};

/**
 * Transliterates a single roman word into Devanagari Unicode
 */
export function transliterateWord(word: string): string {
  if (!word) return '';

  const lower = word.toLowerCase();
  if (COMMON_NEPALI_WORDS[lower]) {
    return COMMON_NEPALI_WORDS[lower];
  }

  let result = '';
  let i = 0;
  const len = word.length;

  while (i < len) {
    let matched = false;
    for (const [rom, dev] of ROMAN_MAP) {
      if (word.substring(i, i + rom.length).toLowerCase() === rom) {
        result += dev;
        i += rom.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += word[i];
      i += 1;
    }
  }

  // Combine consonant + virama + matra
  result = result.replace(/्([ािीुूेैोौौंः])/g, '$1');

  return result;
}

/**
 * Transliterates full text preserving whitespace, punctuation, and newlines
 */
export function transliterateText(text: string): string {
  if (!text) return '';

  // Match words and non-words separately
  return text.replace(/[a-zA-Z]+/g, (match) => transliterateWord(match));
}
