import React, { useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Dropzone from '@src/components/brandTools/Dropzone';
import BeforeAfterPreview, { formatBytes } from '@src/components/brandTools/BeforeAfterPreview';
import DownloadZip from '@src/components/brandTools/DownloadZip';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['svg-optimizer'];

function SvgOptimizerPage() {
  const [files, setFiles] = useState([]);
  const [optimizedFiles, setOptimizedFiles] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pastedSvg, setPastedSvg] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // SVGO Options
  const [multipass, setMultipass] = useState(true);
  const [removeViewBox, setRemoveViewBox] = useState(false);
  const [floatPrecision, setFloatPrecision] = useState(3);
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [removeComments, setRemoveComments] = useState(true);

  const runSvgo = async (svgString, fileName = 'optimized.svg') => {
    // Dynamic import to keep bundle small
    const svgoModule = await import('svgo/browser');
    const optimize = svgoModule.optimize || svgoModule.default?.optimize;

    const plugins = [
      'preset-default',
      removeMetadata && 'removeMetadata',
      removeComments && 'removeComments',
      !removeViewBox && {
        name: 'removeViewBox',
        active: false,
      },
    ].filter(Boolean);

    const result = optimize(svgString, {
      multipass,
      floatPrecision,
      plugins,
    });

    const origSize = new Blob([svgString]).size;
    const optSize = new Blob([result.data]).size;

    const origBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const optBlob = new Blob([result.data], { type: 'image/svg+xml' });

    return {
      name: fileName,
      originalText: svgString,
      originalSrc: URL.createObjectURL(origBlob),
      originalSize: origSize,
      optimizedText: result.data,
      optimizedSrc: URL.createObjectURL(optBlob),
      optimizedSize: optSize,
      optimizedBlob: optBlob,
      savings: Math.max(0, Math.round(((origSize - optSize) / origSize) * 100)),
    };
  };

  const handleFilesSelected = async (selectedFiles) => {
    const fileArr = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    setFiles(fileArr);
    setIsOptimizing(true);

    try {
      const results = [];
      for (const f of fileArr) {
        const text = await f.text();
        const res = await runSvgo(text, f.name);
        results.push(res);
      }
      setOptimizedFiles(results);
      setSelectedIdx(0);
    } catch (e) {
      console.error('SVGO optimization error:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePastedSvg = async () => {
    if (!pastedSvg.trim()) return;
    setIsOptimizing(true);
    try {
      const res = await runSvgo(pastedSvg, 'pasted-vector.svg');
      setOptimizedFiles([res]);
      setSelectedIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyOptimized = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const current = optimizedFiles[selectedIdx];

  return (
    <ToolLayout
      toolId="svg-optimizer"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Upload or Paste SVG', desc: 'Drag and drop SVG files or paste SVG code into the optimizer.' },
        { title: 'Customize SVGO Settings', desc: 'Toggle multipass, precision digits, comment stripping, and keep or remove viewBox.' },
        { title: 'Inspect & Export', desc: 'Compare visual rendering side-by-side, inspect size savings, copy optimized SVG code or download all.' },
      ]}
      features={[
        'Full SVGO engine running 100% in your browser — zero server uploads',
        'Visual before & after comparison slider to confirm identical rendering',
        'Configurable decimal coordinate precision (2 to 5 decimal places)',
        'removeViewBox disabled by default to protect SVG responsiveness',
        'Detailed size reduction metrics and byte-level breakdown',
        'Batch SVG compression with instant ZIP packaging',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Settings Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.controlGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={multipass}
                onChange={(e) => setMultipass(e.target.checked)}
              />
              Multipass (Highest compression)
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={removeViewBox}
                onChange={(e) => setRemoveViewBox(e.target.checked)}
              />
              Remove viewBox (⚠️ May break scaling)
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              Float Precision: <strong>{floatPrecision}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={floatPrecision}
              onChange={(e) => setFloatPrecision(Number(e.target.value))}
              className={styles.sliderControl}
              style={{ width: '100px' }}
            />
          </div>
        </div>

        {/* Dropzone */}
        <Dropzone
          accept="image/svg+xml,.svg"
          multiple
          title="Drop SVG files to optimize, or click to browse"
          subtitle="SVGO processes files instantly in browser. Files never leave your device."
          onFilesSelected={handleFilesSelected}
        />

        {/* Paste Box */}
        <div className={styles.pasteSection}>
          <details className={styles.detailsToggle}>
            <summary className={styles.detailsSummary}>Or paste raw SVG code</summary>
            <div className={styles.pasteBox}>
              <textarea
                value={pastedSvg}
                onChange={(e) => setPastedSvg(e.target.value)}
                placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
                className={styles.textArea}
                rows={4}
              />
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handlePastedSvg}
                disabled={!pastedSvg.trim() || isOptimizing}
              >
                Optimize Pasted SVG
              </button>
            </div>
          </details>
        </div>

        {/* Processing Indicator */}
        {isOptimizing && (
          <div className={styles.processingState}>
            <span>⚡ Optimizing SVG paths with SVGO...</span>
          </div>
        )}

        {/* Results */}
        {optimizedFiles.length > 0 && current && (
          <div className={styles.resultsSection}>
            {/* Batch selector if multiple */}
            {optimizedFiles.length > 1 && (
              <div className={styles.batchSelectorBar}>
                <div className={styles.fileTabs}>
                  {optimizedFiles.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className={selectedIdx === i ? styles.fileTabActive : styles.fileTab}
                      onClick={() => setSelectedIdx(i)}
                    >
                      {f.name} (-{f.savings}%)
                    </button>
                  ))}
                </div>
                <DownloadZip
                  files={optimizedFiles.map((f) => ({
                    name: f.name,
                    content: f.optimizedBlob,
                  }))}
                  zipFilename="optimized-svgs.zip"
                  label="Download All Optimized SVGs"
                />
              </div>
            )}

            {/* Visual comparison */}
            <BeforeAfterPreview
              originalSrc={current.originalSrc}
              processedSrc={current.optimizedSrc}
              originalSize={current.originalSize}
              processedSize={current.optimizedSize}
              originalLabel="Original SVG"
              processedLabel="Optimized SVGO"
            />

            {/* Actions for current file */}
            <div className={styles.actionButtonsRow}>
              <a
                href={current.optimizedSrc}
                download={current.name}
                className={styles.primaryActionButton}
              >
                Download Optimized ({formatBytes(current.optimizedSize)})
              </a>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => copyOptimized(current.optimizedText)}
              >
                {copied ? '✓ Optimized SVG Copied!' : 'Copy Optimized Code'}
              </button>
            </div>

            {/* Code preview */}
            <div className={styles.codeSnippetBox}>
              <pre className={styles.codePre}>{current.optimizedText}</pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default SvgOptimizerPage;
