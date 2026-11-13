import React, { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { TOOLS_BY_ID } from '@src/data/tools';
import { extractAndConvertPdf } from '@src/lib/nepali/pdfExtractor';
import { exportTextToDocx } from '@src/lib/docxExporter';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const toolMeta = TOOLS_BY_ID['preeti-pdf-to-unicode'];

export default function PreetiPdfToUnicodePage() {
  const [file, setFile] = useState(null);
  const [manualOverrideAll, setManualOverrideAll] = useState(false);

  // Conversion state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Result state
  const [result, setResult] = useState(null);
  const [activePageTab, setActivePageTab] = useState(0); // 0 = all, 1...n = specific page
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  // Handle PDF file selection
  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setErrorMessage('');
    setResult(null);

    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF (.pdf) file.');
      return;
    }

    setFile(selectedFile);
  }, []);

  // Run PDF conversion
  const handleConvert = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage('');
    setProgress(10);
    setProgressMessage('Reading PDF binary stream...');

    try {
      const buffer = await file.arrayBuffer();

      const res = await extractAndConvertPdf(
        buffer,
        { manualOverrideAll },
        (current, total) => {
          const pct = Math.round((current / total) * 100);
          setProgress(pct);
          setProgressMessage(`Processing page ${current} of ${total}...`);
        },
      );

      setResult(res);
      setActivePageTab(0);
      setProgress(100);
      setProgressMessage('Conversion complete!');
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to extract text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, [file, manualOverrideAll]);

  // Copy text
  const handleCopy = useCallback(() => {
    if (!result?.fullConvertedText) return;
    navigator.clipboard.writeText(result.fullConvertedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  // Download .txt
  const handleDownloadTxt = useCallback(() => {
    if (!result?.fullConvertedText || !file) return;
    const blob = new Blob([result.fullConvertedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.pdf$/i, '')}-unicode.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, file]);

  // Download .docx
  const handleDownloadDocx = useCallback(() => {
    if (!result?.fullConvertedText || !file) return;
    exportTextToDocx(result.fullConvertedText, `${file.name.replace(/\.pdf$/i, '')}-unicode.docx`);
  }, [result, file]);

  const displayedText =
    activePageTab === 0
      ? result?.fullConvertedText || ''
      : result?.pages?.[activePageTab - 1]?.convertedText || '';

  return (
    <ToolLayout
      toolId="preeti-pdf-to-unicode"
      number={toolMeta.number}
      category={toolMeta.category}
      title={toolMeta.title}
      subtitle={toolMeta.tagline}
      seoTitle={toolMeta.seoTitle}
      seoDescription={toolMeta.seoDescription}
      howItWorks={[
        {
          title: 'Upload Selectable Preeti PDF',
          desc: 'Select any PDF document with selectable text typed in Preeti font. All processing runs 100% inside your browser.',
        },
        {
          title: 'Automatic Legacy Font Detection',
          desc: 'The engine inspects internal PDF font dictionaries, detects Preeti text, and extracts characters page by page.',
        },
        {
          title: 'Export to Unicode .txt or Word .docx',
          desc: 'Preview converted Devanagari text, copy to clipboard, download as plain .txt, or export a formatted Microsoft Word (.docx) document.',
        },
      ]}
      features={[
        '100% Client-Side Privacy: Your PDF documents are never uploaded to any cloud server',
        'Extracts and converts legacy Preeti font text to universal Devanagari Unicode',
        'Automatic Scanned PDF Detection: Alerts you immediately if the PDF is a flat scan needing OCR',
        'Multi-page Processing with page-by-page inspection tabs',
        'Export to Microsoft Word (.docx) and plain text (.txt)',
        'Direct integration with Nepali OCR for scanned image PDFs',
      ]}
      longDescription={toolMeta.longDescription || toolMeta.description}
      faqs={toolMeta.faq}
      relatedToolIds={toolMeta.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Scanned PDF warning / info callout */}
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
              ⚠️ Is your PDF a scanned image or photo of paper?
            </strong>
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              This tool converts <strong>selectable digital PDFs</strong>. If your document is a flat image scan, please use our Nepali OCR tool.
            </span>
          </div>
          <Link
            href="/brand-tools/nepali-ocr"
            className={styles.secondaryBtn}
            style={{ textDecoration: 'none', whiteSpace: 'nowrap', padding: '0.5rem 1rem' }}
          >
            Open Nepali OCR Tool →
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
            if (f) handleFileSelect(f);
          }}
          style={{ cursor: 'pointer', textAlign: 'center', padding: '2.5rem 1.5rem' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📑</div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>
            {file ? file.name : 'Select or Drop a Preeti PDF Document'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            Processes selectable text PDFs. 100% in-browser conversion.
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
              marginTop: '1.5rem',
              border: '1px solid #fecaca',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Options & Action Card */}
        {file && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={manualOverrideAll}
                  onChange={(e) => setManualOverrideAll(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem' }}>
                  <strong>Convert all text regardless of font name</strong>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    Use if the PDF author stripped or renamed the Preeti font
                  </div>
                </span>
              </label>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleConvert}
                disabled={isProcessing}
                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
              >
                {isProcessing ? 'Converting PDF...' : '🚀 Convert PDF to Unicode'}
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {isProcessing && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span>{progressMessage || 'Processing PDF...'}</span>
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

        {/* Results view */}
        {result && (
          <div style={{ marginTop: '2rem' }}>
            {/* Scanned warning notice if detected */}
            {result.scannedPagesCount > 0 && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#92400e',
                  marginBottom: '1.5rem',
                }}
              >
                <strong>⚠️ Scanned Pages Detected:</strong> {result.scannedPagesCount} of {result.totalPages} page(s) in this PDF appear to be flat scanned images without selectable text. For those pages, please use our{' '}
                <Link href="/brand-tools/nepali-ocr" style={{ color: '#b45309', fontWeight: 600 }}>
                  Nepali OCR Tool
                </Link>.
              </div>
            )}

            {/* Header & Export controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Converted Nepali Unicode Text</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

            {/* Page navigation tabs */}
            {result.totalPages > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  className={styles.miniBtn}
                  style={{
                    background: activePageTab === 0 ? 'var(--color-primary, #e63946)' : '#eee',
                    color: activePageTab === 0 ? '#fff' : '#111',
                  }}
                  onClick={() => setActivePageTab(0)}
                >
                  All Pages ({result.totalPages})
                </button>
                {result.pages.map((p) => (
                  <button
                    key={p.pageNumber}
                    type="button"
                    className={styles.miniBtn}
                    style={{
                      background: activePageTab === p.pageNumber ? 'var(--color-primary, #e63946)' : '#eee',
                      color: activePageTab === p.pageNumber ? '#fff' : '#111',
                    }}
                    onClick={() => setActivePageTab(p.pageNumber)}
                  >
                    Page {p.pageNumber} {p.isScanned ? '(Scanned)' : ''}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={displayedText}
              readOnly
              rows={12}
              className={styles.nepaliTextArea}
              lang="ne"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', lineHeight: '1.6' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              <span>{displayedText.length} characters</span>
              <span>Note: PDF layout &amp; graphic columns are not preserved</span>
            </div>
          </div>
        )}

        {/* Help & Advice Card */}
        <div className={styles.nepaliHelpCard} style={{ marginTop: '2rem' }}>
          <h4>About Preeti PDF Conversion (जानकारी र सीमाहरू)</h4>
          <p>
            <strong>Selectable Text vs. Flat Scans:</strong> This tool extracts character codes directly from the digital text layer of a PDF. If you cannot select or highlight text with your mouse inside the PDF viewer, the document is an image scan and must be processed using <Link href="/brand-tools/nepali-ocr">Nepali OCR</Link>.
          </p>
          <p>
            <strong>Word Document Alternative:</strong> If you have the original Word document (.docx) instead of a PDF, convert it using our <Link href="/brand-tools/preeti-word-to-unicode">Preeti Word (.docx) to Unicode Converter</Link> to preserve 100% of your tables, font sizes, colors, and margins.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
