/**
 * pdfToImages.ts
 *
 * Client-side PDF page renderer using pdfjs-dist.
 * Converts multi-page PDFs to HTMLCanvasElement images suitable for OCR or preview.
 *
 * 100% in-browser processing.
 */

export interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Configure pdfjs-dist worker source in browser
 */
async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
  return pdfjs;
}

/**
 * Render all pages of a PDF to canvases sequentially
 */
export async function renderPdfPages(
  pdfData: ArrayBuffer | Uint8Array,
  scale = 2.0, // Scale 2.0 provides ~150-200 DPI for crisp OCR character recognition
  onProgress?: (current: number, total: number) => void,
): Promise<RenderedPage[]> {
  const pdfjs = await getPdfJs();
  const loadingTask = pdfjs.getDocument({ data: pdfData });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  const pages: RenderedPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Paint white background (PDFs default to transparent)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      pages.push({
        pageNumber: i,
        canvas,
        width: viewport.width,
        height: viewport.height,
      });
    }

    if (onProgress) {
      onProgress(i, numPages);
    }
  }

  return pages;
}
