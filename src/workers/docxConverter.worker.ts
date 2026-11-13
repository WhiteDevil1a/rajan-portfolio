/**
 * docxConverter.worker.ts
 *
 * Dedicated Web Worker for Word (.docx) document conversion.
 * Keeps heavy XML DOM processing and JSZip archive decompression off the main thread.
 * Enforces 50 MB memory guard and provides progress messages.
 */

import { convertDocx, DocxConversionOptions } from '../lib/nepali/docxConverter';

self.onmessage = async (e: MessageEvent<{ buffer: ArrayBuffer; options: DocxConversionOptions }>) => {
  try {
    const { buffer, options } = e.data;

    if (!buffer || buffer.byteLength === 0) {
      self.postMessage({ type: 'error', error: 'Empty file provided.' });
      return;
    }

    // 50 MB limit guard
    const MAX_SIZE = 50 * 1024 * 1024;
    if (buffer.byteLength > MAX_SIZE) {
      self.postMessage({
        type: 'error',
        error: 'File size exceeds the 50 MB safety limit. Please split the document into smaller parts.',
      });
      return;
    }

    self.postMessage({ type: 'progress', progress: 20, message: 'Unpacking document and reading styles...' });

    const result = await convertDocx(buffer, options);

    self.postMessage({ type: 'progress', progress: 85, message: 'Re-assembling Word document package...' });

    let outputBuffer: ArrayBuffer | null = null;
    if (result.docxArrayBuffer) {
      outputBuffer = result.docxArrayBuffer;
    } else if (result.docxBlob) {
      outputBuffer = await result.docxBlob.arrayBuffer();
    }

    self.postMessage(
      {
        type: 'success',
        outputBuffer,
        plainText: result.plainText,
        stats: result.stats,
      },
      outputBuffer ? [outputBuffer] : [],
    );
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      error: err?.message || 'An error occurred while converting the Word document.',
    });
  }
};
