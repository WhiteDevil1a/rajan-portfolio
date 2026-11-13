/**
 * docxConverter.ts
 *
 * High-fidelity Word (.docx) Preeti to Unicode converter.
 * Reads Word OpenXML documents via JSZip, resolves style inheritance chains,
 * clusters contiguous legacy runs to preserve cross-run conjuncts and matra ordering,
 * and sets proper complex-script (Devanagari) OpenXML attributes.
 *
 * 100% in-browser compatible (DOMParser / XMLSerializer) and works in Web Workers.
 */

import JSZip from 'jszip';
import { identifyLegacyFont, normalizeFontName } from './legacy-fonts';
import { PREETI_CHARS, PREETI_CONJUNCTS } from './preeti';

export interface DocxConversionOptions {
  targetFont?: 'Mangal' | 'Nirmala UI' | 'Noto Sans Devanagari';
  fontSizeDelta?: 0 | 1 | 2; // in points (1 pt = 2 half-points)
  digits?: 'nepali' | 'ascii';
  manualOverrideAll?: boolean;
}

export interface UnmappedCharReport {
  char: string;
  codePoint: number;
  paragraphIndex: number;
}

export interface ConversionStats {
  paragraphsProcessed: number;
  runsConverted: number;
  charactersConverted: number;
  fontsDetected: Record<string, { count: number; converted: boolean }>;
  unmappedCharacters: UnmappedCharReport[];
  legacyFontFound: boolean;
  sampleText: string;
}

export interface DocxConversionResult {
  docxBlob?: Blob;
  docxArrayBuffer?: ArrayBuffer;
  plainText: string;
  stats: ConversionStats;
}

// DOMParser & XMLSerializer helper for universal environment (Browser, Worker, Node/Vitest)
function getDomParser(): DOMParser {
  if (typeof DOMParser !== 'undefined') {
    return new DOMParser();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DOMParser: XmldomParser } = require('@xmldom/xmldom');
  return new XmldomParser();
}

function getXmlSerializer(): XMLSerializer {
  if (typeof XMLSerializer !== 'undefined') {
    return new XMLSerializer();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { XMLSerializer: XmldomSerializer } = require('@xmldom/xmldom');
  return new XmldomSerializer();
}

// Map of Preeti to Unicode mappings and reverse for quick character checking
const PREETI_CONJUNCT_MAP = new Map<string, string>(PREETI_CONJUNCTS);
const PREETI_CHAR_MAP = new Map<string, string>(PREETI_CHARS);

// Devanagari numeral conversions
const ASCII_TO_NEPALI_DIGITS: Record<string, string> = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
};

const NEPALI_TO_ASCII_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

/**
 * Character tagged with its originating run index within a contiguous cluster
 */
interface TaggedChar {
  char: string;
  runIndex: number;
}

/**
 * Convert a contiguous cluster of Preeti text to Unicode while tracking run indices.
 *
 * Handles cross-run choti-ikar (l) and reph ({) boundary alignment:
 * - If 'l' is in Run A and consonant 'k' is in Run B, the resulting 'कि' attaches to Run B.
 * - If consonant 'k' is in Run A and reph '{' is in Run B, the resulting 'र्क' attaches to Run A.
 */
export function convertTaggedPreetiCluster(
  taggedChars: TaggedChar[],
  options: DocxConversionOptions,
  paragraphIndex: number,
  unmappedCollector: UnmappedCharReport[],
): Map<number, string> {
  const result = new Map<number, string>();
  if (!taggedChars || taggedChars.length === 0) return result;

  const chars = [...taggedChars];

  // Pass 1: Handle reph '{' which in Preeti is typed AFTER the consonant.
  // In Unicode Devanagari, reph (र्) is stored BEFORE the consonant.
  // e.g. "k{" -> "{k". Tagged: consonant's run index is preserved.
  for (let i = 0; i < chars.length - 1; i++) {
    if (chars[i + 1].char === '{') {
      const consonant = chars[i];
      const reph = chars[i + 1];
      // Attach reph to consonant's run index
      reph.runIndex = consonant.runIndex;
      // Swap so reph precedes consonant
      chars[i] = reph;
      chars[i + 1] = consonant;
      i++; // skip next
    }
  }

  // Pass 2: Handle choti-ikar 'l' which in Preeti is typed BEFORE the consonant/conjunct.
  // In Unicode Devanagari, 'ि' is stored AFTER the consonant.
  // e.g. "lk" -> "kl". Tagged: 'l' attaches to consonant's run index.
  for (let i = 0; i < chars.length - 1; i++) {
    if (chars[i].char === 'l') {
      const ikar = chars[i];
      // Look ahead to find the full consonant or conjunct following 'l'
      let targetIdx = i + 1;

      // Handle half-consonants preceding the main consonant (e.g. "l:k" -> "स्कि")
      while (
        targetIdx < chars.length - 1 &&
        (chars[targetIdx].char === '\\' || chars[targetIdx].char === ':' || chars[targetIdx].char === 'S' || chars[targetIdx].char === 'T')
      ) {
        targetIdx++;
      }

      // Attach 'l' to the consonant's run
      ikar.runIndex = chars[targetIdx].runIndex;

      // Move 'l' after target consonant
      chars.splice(i, 1);
      chars.splice(targetIdx, 0, ikar);
    }
  }

  // Pass 3: Convert multi-char conjuncts and single characters into Unicode
  const outputChars: TaggedChar[] = [];
  let i = 0;

  while (i < chars.length) {
    let matched = false;

    // Check multi-character conjuncts (ordered descending by length)
    for (const [preetiSeq, unicodeSeq] of PREETI_CONJUNCTS) {
      if (preetiSeq.length <= chars.length - i) {
        let isMatch = true;
        for (let j = 0; j < preetiSeq.length; j++) {
          if (chars[i + j].char !== preetiSeq[j]) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          const runIdx = chars[i].runIndex;
          for (const uChar of unicodeSeq) {
            outputChars.push({ char: uChar, runIndex: runIdx });
          }
          i += preetiSeq.length;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      const currentChar = chars[i].char;
      const runIdx = chars[i].runIndex;

      if (PREETI_CHAR_MAP.has(currentChar)) {
        const uChar = PREETI_CHAR_MAP.get(currentChar)!;
        for (const c of uChar) {
          outputChars.push({ char: c, runIndex: runIdx });
        }
      } else if (/\s/.test(currentChar)) {
        outputChars.push({ char: currentChar, runIndex: runIdx });
      } else {
        // Unmapped character inside legacy run: preserve as-is and record in stats
        outputChars.push({ char: currentChar, runIndex: runIdx });
        unmappedCollector.push({
          char: currentChar,
          codePoint: currentChar.charCodeAt(0),
          paragraphIndex,
        });
      }
      i++;
    }
  }

  // Pass 4: Unicode normalization and digit formatting
  // Group converted characters by runIndex
  const runBuffers = new Map<number, string[]>();

  for (const { char, runIndex } of outputChars) {
    if (!runBuffers.has(runIndex)) {
      runBuffers.set(runIndex, []);
    }
    runBuffers.get(runIndex)!.push(char);
  }

  for (const [runIdx, charList] of runBuffers.entries()) {
    let str = charList.join('');

    // Normalize combined vowels and matras
    str = str
      .replace(/्ा/g, '')
      .replace(/अा/g, 'आ')
      .replace(/ाे/g, 'ो')
      .replace(/ाै/g, 'ौ')
      .normalize('NFC');

    // Handle digit conversions
    if (options.digits === 'nepali') {
      str = str.replace(/[0-9]/g, (d) => ASCII_TO_NEPALI_DIGITS[d] || d);
    } else if (options.digits === 'ascii') {
      str = str.replace(/[०-९]/g, (d) => NEPALI_TO_ASCII_DIGITS[d] || d);
    }

    result.set(runIdx, str);
  }

  return result;
}

/**
 * Style Resolver: parses `word/styles.xml` to resolve style inheritance chains
 */
export interface StyleRegistry {
  docDefaultFont: string;
  styles: Map<string, { basedOn?: string; font?: string }>;
}

export function parseStylesXml(stylesXmlStr: string): StyleRegistry {
  const parser = getDomParser();
  const xml = parser.parseFromString(stylesXmlStr, 'application/xml');

  let docDefaultFont = 'Calibri'; // standard Word default
  const styles = new Map<string, { basedOn?: string; font?: string }>();

  // Extract w:docDefaults -> w:rPrDefault -> w:rPr -> w:rFonts
  const docDefaults = xml.getElementsByTagName('w:docDefaults')[0];
  if (docDefaults) {
    const rFonts = docDefaults.getElementsByTagName('w:rFonts')[0];
    if (rFonts) {
      const ascii = rFonts.getAttribute('w:ascii') || rFonts.getAttribute('w:hAnsi') || rFonts.getAttribute('w:cs');
      if (ascii) docDefaultFont = ascii;
    }
  }

  // Extract individual styles
  const styleElements = xml.getElementsByTagName('w:style');
  for (let i = 0; i < styleElements.length; i++) {
    const styleElem = styleElements[i];
    const styleId = styleElem.getAttribute('w:styleId');
    if (!styleId) continue;

    let basedOn: string | undefined;
    let font: string | undefined;

    const basedOnElem = styleElem.getElementsByTagName('w:basedOn')[0];
    if (basedOnElem) {
      basedOn = basedOnElem.getAttribute('w:val') || undefined;
    }

    const rPr = styleElem.getElementsByTagName('w:rPr')[0];
    if (rPr) {
      const rFonts = rPr.getElementsByTagName('w:rFonts')[0];
      if (rFonts) {
        font =
          rFonts.getAttribute('w:ascii') ||
          rFonts.getAttribute('w:hAnsi') ||
          rFonts.getAttribute('w:cs') ||
          rFonts.getAttribute('w:eastAsia') ||
          undefined;
      }
    }

    styles.set(styleId, { basedOn, font });
  }

  return { docDefaultFont, styles };
}

/**
 * Resolves the effective font for a run <w:r> based on:
 * 1. Run direct rPr/rFonts
 * 2. Character style rStyle
 * 3. Paragraph direct rPr/rFonts
 * 4. Paragraph style pStyle (and its basedOn chain)
 * 5. docDefaults
 */
export function resolveRunFont(
  runNode: Element,
  paragraphNode: Element,
  styleRegistry: StyleRegistry,
): string {
  // 1. Direct run rFonts
  const rPr = runNode.getElementsByTagName('w:rPr')[0];
  if (rPr) {
    const rFonts = rPr.getElementsByTagName('w:rFonts')[0];
    if (rFonts) {
      const font =
        rFonts.getAttribute('w:ascii') ||
        rFonts.getAttribute('w:hAnsi') ||
        rFonts.getAttribute('w:cs') ||
        rFonts.getAttribute('w:eastAsia');
      if (font) return font;
    }

    // 2. Character style
    const rStyle = rPr.getElementsByTagName('w:rStyle')[0];
    if (rStyle) {
      const styleId = rStyle.getAttribute('w:val');
      if (styleId) {
        let curr: string | undefined = styleId;
        const visited = new Set<string>();
        while (curr && !visited.has(curr)) {
          visited.add(curr);
          const style = styleRegistry.styles.get(curr);
          if (style?.font) return style.font;
          curr = style?.basedOn;
        }
      }
    }
  }

  // 3. Paragraph direct rPr
  const pPr = paragraphNode.getElementsByTagName('w:pPr')[0];
  if (pPr) {
    const pRPr = pPr.getElementsByTagName('w:rPr')[0];
    if (pRPr) {
      const rFonts = pRPr.getElementsByTagName('w:rFonts')[0];
      if (rFonts) {
        const font =
          rFonts.getAttribute('w:ascii') ||
          rFonts.getAttribute('w:hAnsi') ||
          rFonts.getAttribute('w:cs') ||
          rFonts.getAttribute('w:eastAsia');
        if (font) return font;
      }
    }

    // 4. Paragraph style
    const pStyle = pPr.getElementsByTagName('w:pStyle')[0];
    if (pStyle) {
      const styleId = pStyle.getAttribute('w:val');
      if (styleId) {
        let curr: string | undefined = styleId;
        const visited = new Set<string>();
        while (curr && !visited.has(curr)) {
          visited.add(curr);
          const style = styleRegistry.styles.get(curr);
          if (style?.font) return style.font;
          curr = style?.basedOn;
        }
      }
    }
  }

  // 5. docDefaults
  return styleRegistry.docDefaultFont;
}

/**
 * Format run's complex script properties (Devanagari):
 * - w:rFonts with ascii, hAnsi, cs set to targetFont and hint="cs"
 * - w:szCs matching w:sz (with font size delta)
 * - w:bCs matching w:b
 * - w:iCs matching w:i
 * - w:lang val="ne-NP" bidi="ne-NP"
 */
function updateRunDevanagariAttributes(
  runElem: Element,
  targetFont: string,
  fontSizeDeltaPt: number,
  doc: Document,
) {
  let rPr = runElem.getElementsByTagName('w:rPr')[0];
  if (!rPr) {
    rPr = doc.createElement('w:rPr');
    runElem.insertBefore(rPr, runElem.firstChild);
  }

  // 1. Update or create w:rFonts
  let rFonts = rPr.getElementsByTagName('w:rFonts')[0];
  if (!rFonts) {
    rFonts = doc.createElement('w:rFonts');
    rPr.appendChild(rFonts);
  }
  rFonts.setAttribute('w:ascii', targetFont);
  rFonts.setAttribute('w:hAnsi', targetFont);
  rFonts.setAttribute('w:cs', targetFont);
  rFonts.setAttribute('w:eastAsia', targetFont);
  rFonts.setAttribute('w:hint', 'cs');

  // 2. Handle font size and font size delta
  const szElem = rPr.getElementsByTagName('w:sz')[0];
  if (szElem) {
    const curVal = parseInt(szElem.getAttribute('w:val') || '24', 10);
    const newVal = Math.max(8, curVal + fontSizeDeltaPt * 2);
    szElem.setAttribute('w:val', newVal.toString());

    let szCsElem = rPr.getElementsByTagName('w:szCs')[0];
    if (!szCsElem) {
      szCsElem = doc.createElement('w:szCs');
      rPr.appendChild(szCsElem);
    }
    szCsElem.setAttribute('w:val', newVal.toString());
  } else if (fontSizeDeltaPt > 0) {
    // Standard default 11pt = 22 half points
    const newVal = 22 + fontSizeDeltaPt * 2;
    const newSz = doc.createElement('w:sz');
    newSz.setAttribute('w:val', newVal.toString());
    rPr.appendChild(newSz);
    const newSzCs = doc.createElement('w:szCs');
    newSzCs.setAttribute('w:val', newVal.toString());
    rPr.appendChild(newSzCs);
  }

  // 3. Mirror bold
  const bElem = rPr.getElementsByTagName('w:b')[0];
  if (bElem) {
    let bCsElem = rPr.getElementsByTagName('w:bCs')[0];
    if (!bCsElem) {
      bCsElem = doc.createElement('w:bCs');
      rPr.appendChild(bCsElem);
    }
  }

  // 4. Mirror italic
  const iElem = rPr.getElementsByTagName('w:i')[0];
  if (iElem) {
    let iCsElem = rPr.getElementsByTagName('w:iCs')[0];
    if (!iCsElem) {
      iCsElem = doc.createElement('w:iCs');
      rPr.appendChild(iCsElem);
    }
  }

  // 5. Language attribute
  let langElem = rPr.getElementsByTagName('w:lang')[0];
  if (!langElem) {
    langElem = doc.createElement('w:lang');
    rPr.appendChild(langElem);
  }
  langElem.setAttribute('w:val', 'ne-NP');
  langElem.setAttribute('w:bidi', 'ne-NP');
}

/**
 * Check if a run node contains field instructions, symbols, or formulas that should not be converted
 */
function shouldSkipRun(runElem: Element): boolean {
  if (runElem.getElementsByTagName('w:instrText').length > 0) return true;
  if (runElem.getElementsByTagName('w:sym').length > 0) return true;
  if (runElem.getElementsByTagName('w:fldChar').length > 0) return true;

  // Check symbol fonts like Wingdings or Symbol
  const rPr = runElem.getElementsByTagName('w:rPr')[0];
  if (rPr) {
    const rFonts = rPr.getElementsByTagName('w:rFonts')[0];
    if (rFonts) {
      const ascii = (rFonts.getAttribute('w:ascii') || '').toLowerCase();
      if (ascii.includes('wingdings') || ascii.includes('symbol') || ascii.includes('webdings')) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Process a Word OpenXML document DOM (e.g. document.xml, headers, footers)
 */
export function processOpenXmlDocument(
  xmlDoc: Document,
  styleRegistry: StyleRegistry,
  options: DocxConversionOptions,
  stats: ConversionStats,
): { modified: boolean; textChunks: string[] } {
  const targetFont = options.targetFont || 'Mangal';
  const fontSizeDelta = options.fontSizeDelta || 0;
  const manualOverride = options.manualOverrideAll || false;

  let modified = false;
  const textChunks: string[] = [];

  // Find all paragraph elements <w:p>
  const paragraphs = xmlDoc.getElementsByTagName('w:p');

// Helper to check if a node has an ancestor with specific tag names (DOM Level 2 safe)
function hasAncestor(node: Node, tagNames: string[]): boolean {
  let curr: Node | null = node.parentNode;
  while (curr) {
    if (curr.nodeType === 1) {
      const el = curr as Element;
      const tagName = (el.tagName || el.nodeName || '').toLowerCase();
      if (tagNames.some((t) => tagName === t || tagName.endsWith(':' + t))) {
        return true;
      }
    }
    curr = curr.parentNode;
  }
  return false;
}

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const pElem = paragraphs[pIdx];
    stats.paragraphsProcessed++;

    // Find all runs <w:r> directly in this paragraph or in hyperlinks/ins/smartTags
    // Exclude deleted text <w:del>
    const childNodes = Array.from(pElem.getElementsByTagName('w:r')).filter(
      (r) => !hasAncestor(r, ['del', 'w:del']),
    );

    // Group contiguous runs that share a legacy font
    interface RunItem {
      runElem: Element;
      textElem: Element;
      rawText: string;
      isLegacy: boolean;
      fontName: string;
    }

    const runItems: RunItem[] = [];

    for (const rElem of childNodes) {
      if (shouldSkipRun(rElem)) continue;

      const tElem = rElem.getElementsByTagName('w:t')[0];
      if (!tElem) continue;

      const rawText = tElem.textContent || '';
      if (!rawText) continue;

      const resolvedFont = resolveRunFont(rElem, pElem, styleRegistry);
      const fontInfo = identifyLegacyFont(resolvedFont);

      // Track font statistics
      const normFont = normalizeFontName(resolvedFont);
      if (!stats.fontsDetected[normFont]) {
        stats.fontsDetected[normFont] = { count: 0, converted: false };
      }
      stats.fontsDetected[normFont].count += rawText.length;

      const isLegacy = manualOverride || (fontInfo !== null && fontInfo.supported);

      if (fontInfo && !fontInfo.supported) {
        // Unsupported legacy font like Kantipur: flag in report
        stats.legacyFontFound = true;
      }

      if (isLegacy) {
        stats.legacyFontFound = true;
        stats.fontsDetected[normFont].converted = true;
      }

      runItems.push({
        runElem: rElem,
        textElem: tElem,
        rawText,
        isLegacy,
        fontName: resolvedFont,
      });
    }

    // Process clusters of contiguous legacy runs
    let i = 0;
    while (i < runItems.length) {
      if (!runItems[i].isLegacy) {
        // Non-legacy run (e.g. Times New Roman, English text) -> keep untouched
        textChunks.push(runItems[i].rawText);
        i++;
        continue;
      }

      // Collect contiguous legacy runs
      const clusterStart = i;
      while (i < runItems.length && runItems[i].isLegacy) {
        i++;
      }
      const clusterEnd = i;
      const cluster = runItems.slice(clusterStart, clusterEnd);

      // Tag every character with its local cluster run index
      const taggedChars: TaggedChar[] = [];
      cluster.forEach((item, localRunIdx) => {
        for (const ch of item.rawText) {
          taggedChars.push({ char: ch, runIndex: localRunIdx });
        }
      });

      // Sample text for stats
      if (stats.sampleText.length < 200) {
        stats.sampleText += cluster.map((c) => c.rawText).join('');
      }

      // Convert the contiguous cluster as one cohesive unit
      const convertedMap = convertTaggedPreetiCluster(
        taggedChars,
        options,
        pIdx,
        stats.unmappedCharacters,
      );

      // Distribute converted text back onto runs
      cluster.forEach((item, localRunIdx) => {
        const convertedText = convertedMap.get(localRunIdx) || '';
        item.textElem.textContent = convertedText;

        // Preserve spaces
        if (convertedText.startsWith(' ') || convertedText.endsWith(' ') || convertedText.includes('  ')) {
          item.textElem.setAttribute('xml:space', 'preserve');
        }

        // Apply complex-script Devanagari attributes to the run
        updateRunDevanagariAttributes(item.runElem, targetFont, fontSizeDelta, xmlDoc);

        stats.runsConverted++;
        stats.charactersConverted += convertedText.length;
        textChunks.push(convertedText);
        modified = true;
      });
    }

    textChunks.push('\n');
  }

  return { modified, textChunks };
}

/**
 * Update styles.xml and numbering.xml to replace legacy font references with target Unicode font
 */
export function updateStylesAndNumbering(
  stylesXmlDoc: Document,
  targetFont: string,
): boolean {
  let changed = false;
  const rFontsList = stylesXmlDoc.getElementsByTagName('w:rFonts');

  for (let i = 0; i < rFontsList.length; i++) {
    const rFonts = rFontsList[i];
    const ascii = rFonts.getAttribute('w:ascii');
    const hAnsi = rFonts.getAttribute('w:hAnsi');
    const cs = rFonts.getAttribute('w:cs');

    const fontToCheck = ascii || hAnsi || cs || '';
    const legacyInfo = identifyLegacyFont(fontToCheck);

    if (legacyInfo && legacyInfo.supported) {
      rFonts.setAttribute('w:ascii', targetFont);
      rFonts.setAttribute('w:hAnsi', targetFont);
      rFonts.setAttribute('w:cs', targetFont);
      rFonts.setAttribute('w:eastAsia', targetFont);
      rFonts.setAttribute('w:hint', 'cs');
      changed = true;
    }
  }

  return changed;
}

/**
 * Convert a .docx file buffer from Preeti to Unicode Devanagari
 */
export async function convertDocx(
  fileData: ArrayBuffer | Uint8Array,
  options: DocxConversionOptions = {},
): Promise<DocxConversionResult> {
  const targetFont = options.targetFont || 'Mangal';

  const stats: ConversionStats = {
    paragraphsProcessed: 0,
    runsConverted: 0,
    charactersConverted: 0,
    fontsDetected: {},
    unmappedCharacters: [],
    legacyFontFound: false,
    sampleText: '',
  };

  const zip = await JSZip.loadAsync(fileData);
  const domParser = getDomParser();
  const serializer = getXmlSerializer();

  // 1. Parse styles.xml if present
  let styleRegistry: StyleRegistry = { docDefaultFont: 'Calibri', styles: new Map() };
  const stylesFile = zip.file('word/styles.xml');
  if (stylesFile) {
    const stylesXmlStr = await stylesFile.async('text');
    styleRegistry = parseStylesXml(stylesXmlStr);

    // Update legacy fonts in styles.xml
    const stylesDoc = domParser.parseFromString(stylesXmlStr, 'application/xml');
    if (updateStylesAndNumbering(stylesDoc, targetFont)) {
      zip.file('word/styles.xml', serializer.serializeToString(stylesDoc));
    }
  }

  // 2. Update numbering.xml if present
  const numberingFile = zip.file('word/numbering.xml');
  if (numberingFile) {
    const numberingXmlStr = await numberingFile.async('text');
    const numberingDoc = domParser.parseFromString(numberingXmlStr, 'application/xml');
    if (updateStylesAndNumbering(numberingDoc, targetFont)) {
      zip.file('word/numbering.xml', serializer.serializeToString(numberingDoc));
    }
  }

  // 3. Find and process all XML content parts
  const xmlPartPatterns = [
    /^word\/document\.xml$/,
    /^word\/header\d*\.xml$/,
    /^word\/footer\d*\.xml$/,
    /^word\/footnotes\.xml$/,
    /^word\/endnotes\.xml$/,
    /^word\/comments\.xml$/,
  ];

  const fullTextPieces: string[] = [];

  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) continue;

    const matches = xmlPartPatterns.some((pattern) => pattern.test(relativePath));
    if (matches) {
      const xmlStr = await zipEntry.async('text');
      const xmlDoc = domParser.parseFromString(xmlStr, 'application/xml');

      const { modified, textChunks } = processOpenXmlDocument(
        xmlDoc,
        styleRegistry,
        options,
        stats,
      );

      if (relativePath === 'word/document.xml') {
        fullTextPieces.push(...textChunks);
      }

      if (modified) {
        const updatedXml = serializer.serializeToString(xmlDoc);
        zip.file(relativePath, updatedXml);
      }
    }
  }

  // 4. Generate modified docx binary
  let docxBlob: Blob | undefined;
  let docxArrayBuffer: ArrayBuffer | undefined;

  if (typeof Blob !== 'undefined') {
    docxBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });
  } else {
    docxArrayBuffer = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });
  }

  return {
    docxBlob,
    docxArrayBuffer,
    plainText: fullTextPieces.join('').trim(),
    stats,
  };
}
