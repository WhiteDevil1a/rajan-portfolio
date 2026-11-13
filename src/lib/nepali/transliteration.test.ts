import { describe, it, expect } from 'vitest';
import { transliterateText, transliterateWord } from './transliteration';

describe('Nepali Phonetic Transliteration Engine', () => {
  it('correctly transliterates common dictionary words', () => {
    expect(transliterateWord('namaste')).toBe('नमस्ते');
    expect(transliterateWord('nepal')).toBe('नेपाल');
    expect(transliterateWord('mero')).toBe('मेरो');
    expect(transliterateWord('desh')).toBe('देश');
    expect(transliterateWord('dhanyabad')).toBe('धन्यवाद');
    expect(transliterateWord('shanti')).toBe('शान्ति');
  });

  it('correctly preserves punctuation and whitespace in text', () => {
    const input = 'namaste, mero desh nepal ho!';
    const output = transliterateText(input);
    expect(output).toContain('नमस्ते,');
    expect(output).toContain('नेपाल');
  });

  it('converts multi-syllable roman sequences', () => {
    expect(transliterateWord('shree')).toBe('श्री');
    expect(transliterateWord('ksha')).toBe('क्ष');
    expect(transliterateWord('tra')).toBe('त्र');
    expect(transliterateWord('gya')).toBe('ज्ञ');
  });
});
