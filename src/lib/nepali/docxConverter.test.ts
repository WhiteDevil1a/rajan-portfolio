/**
 * docxConverter.test.ts
 *
 * Comprehensive tests for the Preeti to Unicode Word (.docx) converter engine.
 * Tests OpenXML structure manipulation, style resolution, run boundary clustering,
 * complex-script formatting, and 40+ Preeti ↔ Unicode word pairs.
 */

import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import {
  convertDocx,
  convertTaggedPreetiCluster,
  parseStylesXml,
  processOpenXmlDocument,
  resolveRunFont,
} from './docxConverter';
import { preetiToUnicode } from './preeti';

// Helper to construct a minimal valid DOM document
function parseXml(xmlString: string): Document {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DOMParser } = require('@xmldom/xmldom');
  return new DOMParser().parseFromString(xmlString, 'application/xml');
}

describe('Preeti ↔ Unicode Word Pairs (40+ verified pairs)', () => {
  const wordPairs: [string, string][] = [
    ['gfd', 'नाम'],
    ['g]kfn', 'नेपाल'],
    ['sf7df8f}+', 'काठमाडौँ'],
    ['gd:t]', 'नमस्ते'],
    ['sfo{', 'कार्य'],
    ['sd{', 'कर्म'],
    ['k|Zg', 'प्रश्न'],
    ['lsl;d', 'किसिम'],
    ['/fli6«o', 'राष्ट्रिय'],
    ['cGt/f{li6«o', 'अन्तर्राष्ट्रिय'],
    ['k|sfz', 'प्रकाश'],
    ['lj…fyL{', 'विद्यार्थी'],
    ['lj…fno', 'विद्यालय'],
    ['a\'l„', 'बुद्धि'],
    ['z\'„', 'शुद्ध'],
    ['e0', 'भक्त'],
    ['qm', 'त्र'],
    ['qmf;', 'त्रास'],
    ['~fg', 'ज्ञान'],
    ['>L', 'श्री'],
    ['>Ldfg', 'श्रीमान'],
    ['b\'Mv', 'दुःख'],
    [';\'v', 'सुख'],
    [';+ljwfg', 'संविधान'],
    ['rGb|', 'चन्द्र'],
    ['dGqmL', 'मन्त्री'],
    ['k|wfgdGqmL', 'प्रधानमन्त्री'],
    [';+:yfg', 'संस्थान'],
    ['Joj;fo', 'व्यवसाय'],
    ['b[Zo', 'दृश्य'],
    ['cWoI', 'अध्यक्ष'],
    ['k|hftGqm', 'प्रजातन्त्र'],
    ['cfZro{', 'आश्चर्य'],
    ['dWo', 'मध्य'],
    ['j[„', 'वृद्ध'],
    ['tYofÍ', 'तथ्याङ्क'],
    ['lhNnf', 'जिल्ला'],
    ['cEof;', 'अभ्यास'],
    ['hUuf', 'जग्गा'],
    ['zAb', 'शब्द'],
    ['k|To]s', 'प्रत्येक'],
    ['cg\'ej', 'अनुभव'],
    ['wGojfb', 'धन्यवाद'],
  ];

  it('correctly converts 43 essential Preeti words to Unicode', () => {
    for (const [preeti, expectedUnicode] of wordPairs) {
      const converted = preetiToUnicode(preeti);
      expect(converted).toBe(expectedUnicode);
    }
  });
});

describe('Run Boundary Clustering & Cross-Run Alignment', () => {
  it('correctly aligns choti-ikar (l) split across two runs', () => {
    // Run 0 has 'l', Run 1 has 's' -> together "ls" -> "कि"
    // 'l' must attach to consonant 's' in Run 1
    const tagged = [
      { char: 'l', runIndex: 0 },
      { char: 's', runIndex: 1 },
    ];
    const unmapped: any[] = [];
    const result = convertTaggedPreetiCluster(tagged, {}, 0, unmapped);

    expect(result.get(0)).toBeUndefined(); // Run 0 has no characters left
    expect(result.get(1)).toBe('कि'); // Run 1 gets the entire syllable
  });

  it('correctly aligns reph ({) split across two runs', () => {
    // Run 0 has 's', Run 1 has '{' -> together "s{" -> "र्क"
    // Reph '{' must attach to consonant 's' in Run 0
    const tagged = [
      { char: 's', runIndex: 0 },
      { char: '{', runIndex: 1 },
    ];
    const unmapped: any[] = [];
    const result = convertTaggedPreetiCluster(tagged, {}, 0, unmapped);

    expect(result.get(0)).toBe('र्क'); // Run 0 gets the reph + consonant
    expect(result.get(1)).toBeUndefined(); // Run 1 becomes empty
  });

  it('preserves formatting across a word split into 3 runs', () => {
    // "gd:t]" (नमस्ते) split into:
    // Run 0: "g" (bold)
    // Run 1: "d:" (italic)
    // Run 2: "t]" (underline)
    const tagged = [
      { char: 'g', runIndex: 0 },
      { char: 'd', runIndex: 1 },
      { char: ':', runIndex: 1 },
      { char: 't', runIndex: 2 },
      { char: ']', runIndex: 2 },
    ];
    const unmapped: any[] = [];
    const result = convertTaggedPreetiCluster(tagged, {}, 0, unmapped);

    expect(result.get(0)).toBe('न');
    expect(result.get(1)).toBe('मस्');
    expect(result.get(2)).toBe('ते');
  });

  it('handles digits option: nepali numerals vs ascii digits', () => {
    const tagged = [
      { char: '!', runIndex: 0 }, // '!' in Preeti maps to '१'
      { char: '@', runIndex: 0 }, // '@' maps to '२'
    ];
    const unmapped: any[] = [];

    // Digits as Nepali
    const nepaliRes = convertTaggedPreetiCluster(tagged, { digits: 'nepali' }, 0, unmapped);
    expect(nepaliRes.get(0)).toBe('१२');

    // Digits as ASCII
    const asciiRes = convertTaggedPreetiCluster(tagged, { digits: 'ascii' }, 0, unmapped);
    expect(asciiRes.get(0)).toBe('12');
  });
});

describe('Style Inheritance Resolver', () => {
  it('resolves font from basedOn inheritance chain in styles.xml', () => {
    const stylesXml = `
      <w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:docDefaults>
          <w:rPrDefault>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" />
            </w:rPr>
          </w:rPrDefault>
        </w:docDefaults>
        <w:style w:type="paragraph" w:styleId="BaseStyle">
          <w:rPr>
            <w:rFonts w:ascii="Preeti" />
          </w:rPr>
        </w:style>
        <w:style w:type="paragraph" w:styleId="DerivedStyle">
          <w:basedOn w:val="BaseStyle" />
        </w:style>
      </w:styles>
    `;

    const registry = parseStylesXml(stylesXml);
    expect(registry.docDefaultFont).toBe('Calibri');

    const docXml = `
      <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:pPr>
          <w:pStyle w:val="DerivedStyle" />
        </w:pPr>
        <w:r>
          <w:t>gfd</w:t>
        </w:r>
      </w:p>
    `;
    const doc = parseXml(docXml);
    const pElem = doc.getElementsByTagName('w:p')[0];
    const rElem = doc.getElementsByTagName('w:r')[0];

    const resolved = resolveRunFont(rElem, pElem, registry);
    expect(resolved).toBe('Preeti');
  });
});

describe('Full Document OpenXML Processing', () => {
  it('converts Preeti runs while leaving Times New Roman runs untouched', () => {
    const docXml = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p>
            <w:r>
              <w:rPr><w:rFonts w:ascii="Times New Roman"/></w:rPr>
              <w:t>Hello: </w:t>
            </w:r>
            <w:r>
              <w:rPr><w:rFonts w:ascii="Preeti"/></w:rPr>
              <w:t>g]kfn</w:t>
            </w:r>
          </w:p>
        </w:body>
      </w:document>
    `;

    const doc = parseXml(docXml);
    const stats: any = {
      paragraphsProcessed: 0,
      runsConverted: 0,
      charactersConverted: 0,
      fontsDetected: {},
      unmappedCharacters: [],
      legacyFontFound: false,
      sampleText: '',
    };

    const styleRegistry = { docDefaultFont: 'Times New Roman', styles: new Map() };
    const { modified, textChunks } = processOpenXmlDocument(doc, styleRegistry, { targetFont: 'Mangal' }, stats);

    expect(modified).toBe(true);
    expect(stats.runsConverted).toBe(1);

    // Verify DOM changes
    const runs = doc.getElementsByTagName('w:r');
    const englishRun = runs[0];
    const nepaliRun = runs[1];

    expect(englishRun.getElementsByTagName('w:t')[0].textContent).toBe('Hello: ');
    expect(nepaliRun.getElementsByTagName('w:t')[0].textContent).toBe('नेपाल');

    // Verify Devanagari attributes added to converted run
    const rFonts = nepaliRun.getElementsByTagName('w:rFonts')[0];
    expect(rFonts.getAttribute('w:ascii')).toBe('Mangal');
    expect(rFonts.getAttribute('w:hint')).toBe('cs');

    const lang = nepaliRun.getElementsByTagName('w:lang')[0];
    expect(lang.getAttribute('w:val')).toBe('ne-NP');
  });

  it('processes tables and nested structures', () => {
    const docXml = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:tbl>
            <w:tr>
              <w:tc>
                <w:p>
                  <w:r>
                    <w:rPr><w:rFonts w:ascii="Preeti"/></w:rPr>
                    <w:t>gfd</w:t>
                  </w:r>
                </w:p>
              </w:tc>
            </w:tr>
          </w:tbl>
        </w:body>
      </w:document>
    `;

    const doc = parseXml(docXml);
    const stats: any = {
      paragraphsProcessed: 0,
      runsConverted: 0,
      charactersConverted: 0,
      fontsDetected: {},
      unmappedCharacters: [],
      legacyFontFound: false,
      sampleText: '',
    };

    processOpenXmlDocument(doc, { docDefaultFont: 'Calibri', styles: new Map() }, {}, stats);
    const textNode = doc.getElementsByTagName('w:t')[0];
    expect(textNode.textContent).toBe('नाम');
  });

  it('skips field instructions (w:instrText) and symbols', () => {
    const docXml = `
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p>
            <w:r>
              <w:rPr><w:rFonts w:ascii="Preeti"/></w:rPr>
              <w:instrText>PAGE</w:instrText>
            </w:r>
          </w:p>
        </w:body>
      </w:document>
    `;

    const doc = parseXml(docXml);
    const stats: any = {
      paragraphsProcessed: 0,
      runsConverted: 0,
      charactersConverted: 0,
      fontsDetected: {},
      unmappedCharacters: [],
      legacyFontFound: false,
      sampleText: '',
    };

    const { modified } = processOpenXmlDocument(doc, { docDefaultFont: 'Calibri', styles: new Map() }, {}, stats);
    expect(modified).toBe(false);
    expect(stats.runsConverted).toBe(0);
  });
});

describe('Full .docx ZIP Archive Roundtrip', () => {
  it('creates, converts, and re-parses a synthetic .docx archive', async () => {
    const zip = new JSZip();

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p>
            <w:r>
              <w:rPr><w:rFonts w:ascii="Preeti"/></w:rPr>
              <w:t>g]kfn</w:t>
            </w:r>
          </w:p>
        </w:body>
      </w:document>`;

    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:docDefaults>
          <w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri"/></w:rPr></w:rPrDefault>
        </w:docDefaults>
      </w:styles>`;

    zip.file('word/document.xml', documentXml);
    zip.file('word/styles.xml', stylesXml);
    zip.file('[Content_Types].xml', '<?xml version="1.0"?><Types></Types>');

    const inputBuffer = await zip.generateAsync({ type: 'arraybuffer' });

    const result = await convertDocx(inputBuffer, {
      targetFont: 'Noto Sans Devanagari',
      fontSizeDelta: 1,
      digits: 'nepali',
    });

    expect(result.plainText).toBe('नेपाल');
    expect(result.stats.runsConverted).toBe(1);
    expect(result.stats.charactersConverted).toBe(5);

    // Verify the resulting zip can be read back and contains the updated text and font
    const outputBuffer = result.docxArrayBuffer || (await (result.docxBlob as any).arrayBuffer());
    const reloadedZip = await JSZip.loadAsync(outputBuffer);
    const convertedDocXml = await reloadedZip.file('word/document.xml')!.async('text');

    expect(convertedDocXml).toContain('नेपाल');
    expect(convertedDocXml).toContain('Noto Sans Devanagari');
  });
});
