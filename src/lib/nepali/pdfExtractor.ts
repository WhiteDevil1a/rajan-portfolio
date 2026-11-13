/**
 * pdfExtractor.ts
 *
 * Client-side PDF text extractor and Preeti legacy font converter using pdfjs-dist.
 * Extracts selectable text items from each PDF page, maps font names against the
 * legacy font registry, converts Preeti runs to modern Unicode, and detects scanned pages.
 *
 * 100% in-browser execution.
 */

import { preetiToUnicode } from './preeti';
import { identifyLegacyFont } from './legacy-fonts';

export interface PdfPageConversionResult {
  pageNumber: number;
  isScanned: boolean;
  legacyFontDetected: boolean;
  detectedFonts: string[];
  originalText: string;
  convertedText: string;
}

export interface PdfExtractionResult {
  totalPages: number;
  scannedPagesCount: number;
  legacyPagesCount: number;
  pages: PdfPageConversionResult[];
  fullConvertedText: string;
}

async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
  return pdfjs;
}

export async function extractAndConvertPdf(
  pdfBuffer: ArrayBuffer | Uint8Array,
  options: { manualOverrideAll?: boolean } = {},
  onProgress?: (current: number, total: number) => void,
): Promise<PdfExtractionResult> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: pdfBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const results: PdfPageConversionResult[] = [];
  let scannedPagesCount = 0;
  let legacyPagesCount = 0;

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str?: string; fontName?: string }>;

    const detectedFontsSet = new Set<string>();
    let pageOriginalText = '';
    let pageConvertedText = '';
    let pageHasLegacy = false;

    if (!items || items.length === 0 || items.every((it) => !it.str?.trim())) {
      scannedPagesCount++;
      results.push({
        pageNumber: i,
        isScanned: true,
        legacyFontDetected: false,
        detectedFonts: [],
        originalText: '',
        convertedText: '',
      });
    } else {
      for (const item of items) {
        const textStr = item.str || '';
        const fontName = item.fontName || '';
        if (fontName) detectedFontsSet.add(fontName);

        pageOriginalText += textStr + ' ';

        const legacyStatus = identifyLegacyFont(fontName);
        const shouldConvert = options.manualOverrideAll || legacyStatus.isLegacy;

        if (legacyStatus.isLegacy) {
          pageHasLegacy = true;
        }

        if (shouldConvert) {
          pageConvertedText += preetiToUnicode(textStr) + ' ';
        } else {
          pageConvertedText += textStr + ' ';
        }
      }

      if (pageHasLegacy) {
        legacyPagesCount++;
      }

      results.push({
        pageNumber: i,
        isScanned: false,
        legacyFontDetected: pageHasLegacy,
        detectedFonts: Array.from(detectedFontsSet),
        originalText: pageOriginalText.trim(),
        convertedText: pageConvertedText.trim(),
      });
    }

    if (onProgress) {
      onProgress(i, totalPages);
    }
  }

  const fullConvertedText = results
    .map((p) => {
      if (p.isScanned) {
        return `[Page ${p.pageNumber}: Scanned image - no selectable text found. Use Nepali OCR.]`;
      }
      return `--- Page ${p.pageNumber} ---\n${p.convertedText}`;
    })
    .join('\n\n');

  return {
    totalPages,
    scannedPagesCount,
    legacyPagesCount,
    pages: results,
    fullConvertedText,
  };
}
