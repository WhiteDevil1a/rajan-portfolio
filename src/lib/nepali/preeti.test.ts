import { describe, it, expect } from 'vitest';
import { preetiToUnicode, unicodeToPreeti } from './preeti';

describe('Preeti to Unicode Converter (40+ test pairs)', () => {
  const TEST_PAIRS: [string, string][] = [
    // 1-10: Basic consonants & vowels
    ['s', 'क'],
    ['v', 'ख'],
    ['u', 'ग'],
    ['3', 'घ'],
    ['r', 'च'],
    ['5', 'छ'],
    ['h', 'ज'],
    ['t', 'त'],
    ['d', 'म'],
    ['c', 'अ'],

    // 11-20: Common matras
    ['sf', 'का'],
    ['sL', 'की'],
    ['s\'', 'कु'],
    ['s"', 'कू'],
    ['s]', 'के'],
    ['s}', 'कै'],
    ['sf]', 'को'],
    ['sf}', 'कौ'],
    ['sB', 'कं'],
    ['sM', 'कः'],

    // 21-25: Choti-ikar (typed before consonant in Preeti)
    ['ls', 'कि'],
    ['lv', 'खि'],
    ['lu', 'गि'],
    ['lt', 'ति'],
    ['ld', 'मि'],

    // 26-30: Reph (typed after consonant in Preeti)
    ['s{', 'र्क'],
    ['v{', 'र्ख'],
    ['u{', 'र्ग'],
    ['t{', 'र्त'],
    ['d{', 'र्म'],

    // 31-35: Conjuncts (क्ष, त्र, ज्ञ, श्र, etc.)
    ['I', 'क्ष'],
    ['qm', 'त्र'],
    ['~', 'ज्ञ'],
    ['>', 'श्र'],
    ['0', 'क्त'],

    // 36-40: Numbers in Preeti (!, @, #, $, %, ^, &, *, (, ))
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

    // 41-45: Punctuation and full stops
    ['.', '।'],
    [',', ','],
    ['cflb .', 'आदि ।'],
    ['g]kfn', 'नेपाल'],
    [';a}', 'सबै'],
  ];

  it('converts all 45 test pairs correctly from Preeti to Unicode', () => {
    TEST_PAIRS.forEach(([preeti, expectedUnicode]) => {
      expect(preetiToUnicode(preeti)).toBe(expectedUnicode);
    });
  });

  it('preserves spaces and line breaks', () => {
    const input = 'g]kfn ;a}\nldn]/ sfd u/f}F .';
    const converted = preetiToUnicode(input);
    expect(converted).toContain('\n');
    expect(converted).toContain('नेपाल');
  });

  it('converts common Unicode words back to Preeti', () => {
    expect(unicodeToPreeti('क')).toBe('s');
    expect(unicodeToPreeti('ख')).toBe('v');
    expect(unicodeToPreeti('नेपाल')).toBe('g]kfn');
  });
});
