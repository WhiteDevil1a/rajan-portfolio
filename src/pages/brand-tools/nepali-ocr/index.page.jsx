import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { TOOLS_BY_ID } from '@src/data/tools';
import { preprocessCanvas } from '@src/lib/ocr/imagePreprocessing';
import { renderPdfPages } from '@src/lib/ocr/pdfToImages';
import { exportTextToDocx } from '@src/lib/docxExporter';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const toolMeta = TOOLS_BY_ID['nepali-ocr'];

export default function NepaliOcrPage() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image' | 'pdf'
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);

  // Pre-processing options
  const [binarize, setBinarize] = useState(true);
  const [contrast, setContrast] = useState(30);
  const [grayscale, setGrayscale] = useState(true);

  // OCR state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const rawCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const activeWorkerRef = useRef(null);

  // Update preview canvas when options or raw canvas change
  const updatePreview = useCallback(
    (sourceCanvas) => {
      const src = sourceCanvas || rawCanvasRef.current;
      if (!src || !previewCanvasRef.current) return;

      const processed = preprocessCanvas(src, {
        binarize,
        contrast: Number(contrast),
        grayscale,
      });

      const pCanvas = previewCanvasRef.current;
      pCanvas.width = processed.width;
      pCanvas.height = processed.height;
      const ctx = pCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(processed, 0, 0);
      }
    },
    [binarize, contrast, grayscale],
  );

  // Handle incoming file (image or PDF)
  const handleFile = useCallback(
    async (selectedFile) => {
      if (!selectedFile) return;

      setErrorMessage('');
      setExtractedText('');
      setProgress(0);
      setPdfPages([]);
      setSelectedPageIndex(0);

      const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
      const isImg = selectedFile.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(selectedFile.name);

      if (!isPdf && !isImg) {
        setErrorMessage('Please select a valid image (.png, .jpg, .webp) or PDF document.');
        return;
      }

      setFile(selectedFile);

      if (isPdf) {
        setFileType('pdf');
        setIsProcessing(true);
        setProgressStatus('Rendering PDF pages in browser...');
        setProgress(20);

        try {
          const buffer = await selectedFile.arrayBuffer();
          const pages = await renderPdfPages(buffer, 2.0, (curr, tot) => {
            setProgress(Math.round((curr / tot) * 50));
            setProgressStatus(`Rendering PDF page ${curr} of ${tot}...`);
          });

          if (pages.length === 0) {
            throw new Error('Unable to render any pages from this PDF.');
          }

          setPdfPages(pages);
          setSelectedPageIndex(0);
          rawCanvasRef.current = pages[0].canvas;
          updatePreview(pages[0].canvas);
        } catch (err) {
          setErrorMessage(err?.message || 'Failed to parse PDF document.');
        } finally {
          setIsProcessing(false);
          setProgress(0);
          setProgressStatus('');
        }
      } else {
        setFileType('image');
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              rawCanvasRef.current = canvas;
              updatePreview(canvas);
            }
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [updatePreview],
  );

  // Run Tesseract OCR on demand
  const handleRunOcr = useCallback(async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setProgress(5);
    setProgressStatus('Initializing Tesseract OCR engine...');

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('nep', 1, {
        logger: (m) => {
          if (m.status === 'loading tesseract core') {
            setProgress(15);
            setProgressStatus('Loading WebAssembly OCR core...');
          } else if (m.status === 'loading language traineddata') {
            const pct = Math.round(15 + (m.progress || 0) * 35);
            setProgress(pct);
            setProgressStatus(`Downloading Nepali language model (nep.traineddata)... ${Math.round((m.progress || 0) * 100)}%`);
          } else if (m.status === 'initializing api') {
            setProgress(55);
            setProgressStatus('Initializing Devanagari recognition engine...');
          } else if (m.status === 'recognizing text') {
            const pct = Math.round(60 + (m.progress || 0) * 35);
            setProgress(pct);
            setProgressStatus(`Recognizing Nepali characters... ${Math.round((m.progress || 0) * 100)}%`);
          }
        },
      });

      activeWorkerRef.current = worker;

      if (fileType === 'pdf' && pdfPages.length > 1) {
        // Multi-page PDF sequential processing
        const allPageTexts = [];
        for (let i = 0; i < pdfPages.length; i++) {
          setProgressStatus(`Processing page ${i + 1} of ${pdfPages.length}...`);
          const preprocessed = preprocessCanvas(pdfPages[i].canvas, {
            binarize,
            contrast: Number(contrast),
            grayscale,
          });
          const res = await worker.recognize(preprocessed);
          allPageTexts.push(`--- Page ${i + 1} ---\n${res.data.text.trim()}`);
        }
        setExtractedText(allPageTexts.join('\n\n'));
      } else {
        // Single image or single PDF page
        const targetCanvas = previewCanvasRef.current || rawCanvasRef.current;
        if (!targetCanvas) throw new Error('No image canvas available to process.');

        const res = await worker.recognize(targetCanvas);
        setExtractedText(res.data.text.trim());
      }

      setProgress(100);
      setProgressStatus('OCR complete!');
      await worker.terminate();
      activeWorkerRef.current = null;
    } catch (err) {
      setErrorMessage(err?.message || 'OCR processing failed. Please check image quality.');
    } finally {
      setIsProcessing(false);
    }
  }, [fileType, pdfPages, binarize, contrast, grayscale]);

  // Cancel OCR run
  const handleCancel = useCallback(async () => {
    if (activeWorkerRef.current) {
      await activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    setIsProcessing(false);
    setProgress(0);
    setProgressStatus('Operation cancelled.');
  }, []);

  // Copy text
  const handleCopy = useCallback(() => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [extractedText]);

  // Download .txt
  const handleDownloadTxt = useCallback(() => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name?.replace(/\.[^/.]+$/, '') || 'nepali-ocr'}-text.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [extractedText, file]);

  // Download .docx
  const handleDownloadDocx = useCallback(() => {
    if (!extractedText) return;
    const base = file?.name?.replace(/\.[^/.]+$/, '') || 'nepali-ocr';
    exportTextToDocx(extractedText, `${base}-text.docx`);
  }, [extractedText, file]);

  return (
    <ToolLayout
      toolId="nepali-ocr"
      number={toolMeta.number}
      category={toolMeta.category}
      title={toolMeta.title}
      subtitle={toolMeta.tagline}
      seoTitle={toolMeta.seoTitle}
      seoDescription={toolMeta.seoDescription}
      howItWorks={[
        {
          title: 'Select an Image or PDF',
          desc: 'Drag and drop any scanned image (PNG, JPG, WebP) or multi-page PDF document. All processing is 100% in-browser.',
        },
        {
          title: 'Optimize Image Preprocessing',
          desc: 'Fine-tune contrast and binarization (black & white thresholding) to sharpen Devanagari matras and conjuncts.',
        },
        {
          title: 'Run OCR & Export Result',
          desc: 'Click "Start Nepali OCR". The Tesseract Devanagari model runs locally in your browser. Copy text, download as .txt, or export to Microsoft Word (.docx).',
        },
      ]}
      features={[
        '100% Client-Side Processing: Your images and PDF documents never touch any server',
        'Powered by Tesseract.js using the official Devanagari/Nepali language model (nep)',
        'Built-in Image Preprocessing: Grayscale, Otsu binarization, and contrast stretching',
        'Multi-Page PDF Support: Renders pages sequentially with live page progress tracking',
        'Export to Microsoft Word (.docx) with Devanagari complex script formatting and plain text (.txt)',
        'Direct integration with Preeti to Unicode converter for legacy font scans',
      ]}
      longDescription={toolMeta.description}
      faqs={toolMeta.faq}
      relatedToolIds={toolMeta.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Cross-Link Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            background: 'rgba(230, 57, 70, 0.05)',
            border: '1px solid rgba(230, 57, 70, 0.2)',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <strong style={{ display: 'block', color: 'var(--color-text, #111)', fontSize: '0.95rem' }}>
              💡 Result looks like English letters or Preeti gibberish?
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              If your original document was typed in legacy Preeti font, use our Preeti to Unicode converter.
            </span>
          </div>
          <Link
            href="/brand-tools/preeti-to-unicode"
            className={styles.secondaryBtn}
            style={{ textDecoration: 'none', whiteSpace: 'nowrap', padding: '0.5rem 1rem' }}
          >
            Preeti to Unicode Converter →
          </Link>
        </div>

        {/* Dropzone */}
        <div
          className={clsx(styles.dropzoneCard, file && styles.dropzoneCardActive)}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          style={{ cursor: 'pointer', textAlign: 'center', padding: '2.5rem 1.5rem' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>
            {file ? file.name : 'Choose an Image or PDF document'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            Supports PNG, JPG, WebP, and multi-page PDF documents. 100% private in-browser OCR.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#991b1b',
              marginTop: '1rem',
              border: '1px solid #fecaca',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Preprocessing & Preview Grid */}
        {file && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Controls */}
              <div style={{ padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Image Preprocessing Options</h4>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={binarize}
                    onChange={(e) => {
                      setBinarize(e.target.checked);
                      setTimeout(() => updatePreview(), 50);
                    }}
                  />
                  <span>
                    <strong>Binarize (Otsu Threshold)</strong>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>Converts image to sharp black &amp; white text</div>
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={grayscale}
                    onChange={(e) => {
                      setGrayscale(e.target.checked);
                      setTimeout(() => updatePreview(), 50);
                    }}
                  />
                  <span>
                    <strong>Grayscale Conversion</strong>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>Removes color artifacts and noise</div>
                  </span>
                </label>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Contrast Stretch</span>
                    <span>+{contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contrast}
                    onChange={(e) => {
                      setContrast(Number(e.target.value));
                      setTimeout(() => updatePreview(), 50);
                    }}
                    style={{ width: '100%' }}
                  />
                </div>

                {fileType === 'pdf' && pdfPages.length > 1 && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                      PDF Pages ({pdfPages.length} total):
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {pdfPages.map((p, idx) => (
                        <button
                          key={p.pageNumber}
                          type="button"
                          className={styles.miniBtn}
                          style={{
                            background: selectedPageIndex === idx ? 'var(--color-primary, #e63946)' : '#eee',
                            color: selectedPageIndex === idx ? '#fff' : '#111',
                          }}
                          onClick={() => {
                            setSelectedPageIndex(idx);
                            rawCanvasRef.current = p.canvas;
                            updatePreview(p.canvas);
                          }}
                        >
                          Page {p.pageNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '1.25rem' }}>
                  {!isProcessing ? (
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={handleRunOcr}
                      style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                    >
                      🔍 Extract Nepali Text (OCR)
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={handleCancel}
                      style={{ width: '100%', padding: '0.75rem', color: '#dc2626' }}
                    >
                      ✕ Cancel Recognition
                    </button>
                  )}
                </div>
              </div>

              {/* Preview canvas */}
              <div style={{ padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>OCR Input Preview</span>
                  <span style={{ fontSize: '0.75rem', color: '#666' }}>Processed for recognition</span>
                </div>
                <div
                  style={{
                    maxHeight: '340px',
                    overflow: 'auto',
                    border: '1px solid #eee',
                    background: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '0.5rem',
                  }}
                >
                  <canvas ref={previewCanvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isProcessing && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span>{progressStatus || 'Processing...'}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'var(--color-primary, #e63946)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Extracted text result */}
        {extractedText && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Recognized Nepali Text</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className={styles.miniBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy Text'}
                </button>
                <button type="button" className={styles.miniBtn} onClick={handleDownloadTxt}>
                  Download .txt
                </button>
                <button type="button" className={styles.miniBtn} onClick={handleDownloadDocx}>
                  Export .docx
                </button>
              </div>
            </div>

            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={12}
              className={styles.nepaliTextArea}
              lang="ne"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', lineHeight: '1.6' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              <span>{extractedText.length} characters · {extractedText.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>Review text before official use (OCR accuracy depends on image clarity)</span>
            </div>
          </div>
        )}

        {/* Limitations & Advice Card */}
        <div className={styles.nepaliHelpCard} style={{ marginTop: '2rem' }}>
          <h4>OCR Tips &amp; Honest Limitations (महत्त्वपूर्ण जानकारी)</h4>
          <p>
            <strong>Printed Text vs. Handwriting:</strong> Tesseract Devanagari is trained on printed typography (official notices, gazettes, typed books, and high-contrast documents). Handwritten Nepali cursive is not supported.
          </p>
          <p>
            <strong>Resolution &amp; Contrast:</strong> For best results, use images with at least 150–300 DPI resolution, even lighting without shadows, and straight orientation. Use the Contrast and Binarization toggles above to clean up noisy backgrounds.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
