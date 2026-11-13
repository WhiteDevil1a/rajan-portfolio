import React, { useState, useRef } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Dropzone from '@src/components/brandTools/Dropzone';
import DownloadZip from '@src/components/brandTools/DownloadZip';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['svg-to-png'];

// Sanitize SVG string: strip scripts, inline events, and external hrefs
function sanitizeSvg(svgStr) {
  let clean = svgStr
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/xlink:href=["'](http|https|\/\/)[^"']*["']/gi, '')
    .replace(/href=["'](http|https|\/\/)[^"']*["']/gi, '');
  return clean;
}

// Parse SVG dimensions & viewBox
function parseSvgDimensions(svgText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');
  if (!svgEl) return { width: 300, height: 300 };

  let width = parseFloat(svgEl.getAttribute('width'));
  let height = parseFloat(svgEl.getAttribute('height'));

  if (!width || !height) {
    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        width = parts[2];
        height = parts[3];
      }
    }
  }

  return {
    width: width || 400,
    height: height || 400,
  };
}

function SvgToPngPage() {
  const [svgFiles, setSvgFiles] = useState([]);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState('png'); // 'png' | 'jpeg' | 'webp'
  const [bgColor, setBgColor] = useState('transparent'); // 'transparent' | '#ffffff' | custom
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedItems, setConvertedItems] = useState([]);
  const [pastedSvg, setPastedSvg] = useState('');

  const processSingleSvg = async (svgText, originalName = 'converted') => {
    const sanitized = sanitizeSvg(svgText);
    const { width: origW, height: origH } = parseSvgDimensions(sanitized);

    const outW = Math.round(origW * scale);
    const outH = Math.round(origH * scale);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, outW, outH);
    }

    const blob = new Blob([sanitized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, outW, outH);
        URL.revokeObjectURL(url);

        const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const ext = format === 'jpeg' ? 'jpg' : format;

        canvas.toBlob((outBlob) => {
          if (!outBlob) {
            reject(new Error('Canvas rendering failed'));
            return;
          }
          const dataUrl = canvas.toDataURL(mimeType);
          const baseName = originalName.replace(/\.[^/.]+$/, '');
          resolve({
            name: `${baseName}-${scale}x.${ext}`,
            dataUrl,
            blob: outBlob,
            size: outBlob.size,
            width: outW,
            height: outH,
          });
        }, mimeType, 0.95);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  };

  const handleFilesSelected = async (files) => {
    const fileArr = Array.isArray(files) ? files : [files];
    setSvgFiles(fileArr);
    setIsProcessing(true);

    try {
      const results = [];
      for (const file of fileArr) {
        const text = await file.text();
        const res = await processSingleSvg(text, file.name);
        results.push(res);
      }
      setConvertedItems(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePastedSvgSubmit = async () => {
    if (!pastedSvg.trim()) return;
    setIsProcessing(true);
    try {
      const res = await processSingleSvg(pastedSvg, 'pasted-vector');
      setConvertedItems([res]);
      setSvgFiles([{ name: 'pasted-vector.svg' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (item) => {
    const a = document.createElement('a');
    a.href = item.dataUrl;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout
      toolId="svg-to-png"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Upload or Paste SVG', desc: 'Drag and drop SVG files or paste SVG XML markup code into the editor.' },
        { title: 'Configure Scale & Format', desc: 'Choose output dimensions (1x, 2x, 4x), background fill (transparent or color), and format (PNG, JPG, WebP).' },
        { title: 'Instant Render & Download', desc: 'Your SVG is rendered through an offscreen Canvas and exported as high-DPI raster images or a combined ZIP.' },
      ]}
      features={[
        '100% Client-side offscreen Canvas rendering — zero files uploaded',
        'Automatic SVG script and inline event handler sanitization',
        'Resolves SVGs without width/height via viewBox parsing',
        'Supports 1x, 2x retina, and 4x ultra high-resolution presets',
        'Transparent, white, or custom hex background options',
        'Batch SVG conversion with one-click JSZip packaging',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Scale Preset:</label>
            <div className={styles.scaleButtons}>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={scale === s ? styles.controlBtnActive : styles.controlBtn}
                  onClick={() => setScale(s)}
                >
                  {s}x {s === 2 ? '(Retina)' : s === 4 ? '(Ultra)' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className={styles.selectInput}
            >
              <option value="png">PNG (Lossless &amp; Transparent)</option>
              <option value="jpeg">JPG (Small File Size)</option>
              <option value="webp">WebP (Modern Web)</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Background:</label>
            <select
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className={styles.selectInput}
            >
              <option value="transparent">Transparent</option>
              <option value="#ffffff">Solid White</option>
              <option value="#000000">Solid Black</option>
            </select>
          </div>
        </div>

        {/* Dropzone */}
        <Dropzone
          accept="image/svg+xml,.svg"
          multiple
          title="Drop SVG files here, or click to browse"
          subtitle="Upload single or multiple .svg files. All conversions run locally in your browser."
          onFilesSelected={handleFilesSelected}
        />

        {/* Paste Code Section */}
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
                onClick={handlePastedSvgSubmit}
                disabled={!pastedSvg.trim() || isProcessing}
              >
                Convert Pasted SVG
              </button>
            </div>
          </details>
        </div>

        {/* Loading state */}
        {isProcessing && (
          <div className={styles.processingState}>
            <span>⚡ Rendering SVG via offscreen Canvas...</span>
          </div>
        )}

        {/* Converted Results */}
        {convertedItems.length > 0 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>Converted Files ({convertedItems.length})</h3>
              {convertedItems.length > 1 && (
                <DownloadZip
                  files={convertedItems.map((item) => ({
                    name: item.name,
                    content: item.blob,
                  }))}
                  zipFilename="svg-conversions.zip"
                  label="Download All Converted Files"
                />
              )}
            </div>

            <div className={styles.resultsGrid}>
              {convertedItems.map((item, idx) => (
                <div key={idx} className={styles.resultCard}>
                  <div className={styles.cardPreviewWrap}>
                    <img src={item.dataUrl} alt={item.name} className={styles.cardPreviewImg} />
                  </div>
                  <div className={styles.cardDetails}>
                    <span className={styles.cardName}>{item.name}</span>
                    <span className={styles.cardMeta}>
                      {item.width} × {item.height} px · {Math.round(item.size / 1024)} KB
                    </span>
                    <button
                      type="button"
                      className={styles.downloadBtn}
                      onClick={() => downloadSingle(item)}
                    >
                      Download {format.toUpperCase()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default SvgToPngPage;
