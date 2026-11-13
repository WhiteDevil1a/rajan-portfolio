import React, { useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Dropzone from '@src/components/brandTools/Dropzone';
import BeforeAfterPreview, { formatBytes } from '@src/components/brandTools/BeforeAfterPreview';
import DownloadZip from '@src/components/brandTools/DownloadZip';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['image-compressor'];

function ImageCompressorPage() {
  const [files, setFiles] = useState([]);
  const [compressedItems, setCompressedItems] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Compression Options
  const [quality, setQuality] = useState(80); // 1-100
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1920);
  const [outputFormat, setOutputFormat] = useState('original'); // 'original' | 'image/jpeg' | 'image/png' | 'image/webp'
  const [targetKb, setTargetKb] = useState(''); // Target size mode
  const [useWebWorker, setUseWebWorker] = useState(true);

  const compressSingleFile = async (file) => {
    // Dynamic import to keep bundle light
    const imageCompression = (await import('browser-image-compression')).default;

    const fileType = outputFormat === 'original' ? file.type : outputFormat;

    let targetSizeMB = targetKb ? Number(targetKb) / 1024 : undefined;
    if (targetSizeMB && targetSizeMB <= 0) targetSizeMB = undefined;

    const options = {
      maxSizeMB: targetSizeMB || (file.size / (1024 * 1024)) * (quality / 100),
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker,
      fileType: fileType || 'image/jpeg',
      initialQuality: quality / 100,
    };

    const compressedBlob = await imageCompression(file, options);

    const originalSrc = URL.createObjectURL(file);
    const compressedSrc = URL.createObjectURL(compressedBlob);

    const ext = fileType === 'image/png' ? 'png' : fileType === 'image/webp' ? 'webp' : 'jpg';
    const baseName = file.name.replace(/\.[^/.]+$/, '');

    return {
      name: `${baseName}-compressed.${ext}`,
      originalSrc,
      compressedSrc,
      originalSize: file.size,
      compressedSize: compressedBlob.size,
      blob: compressedBlob,
      savings: Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100)),
    };
  };

  const handleFilesSelected = async (selectedFiles) => {
    const fileArr = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
    setFiles(fileArr);
    setIsCompressing(true);

    try {
      const results = [];
      for (const f of fileArr) {
        const res = await compressSingleFile(f);
        results.push(res);
      }
      setCompressedItems(results);
      setSelectedIdx(0);
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  // Re-compress when options change if files exist
  const handleApplySettings = async () => {
    if (files.length === 0) return;
    setIsCompressing(true);
    try {
      const results = [];
      for (const f of files) {
        const res = await compressSingleFile(f);
        results.push(res);
      }
      setCompressedItems(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCompressing(false);
    }
  };

  const totalOrigSize = compressedItems.reduce((acc, i) => acc + i.originalSize, 0);
  const totalCompSize = compressedItems.reduce((acc, i) => acc + i.compressedSize, 0);
  const totalSavings =
    totalOrigSize > 0 ? Math.max(0, Math.round(((totalOrigSize - totalCompSize) / totalOrigSize) * 100)) : 0;

  const current = compressedItems[selectedIdx];

  return (
    <ToolLayout
      toolId="image-compressor"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Upload JPG, PNG or WebP', desc: 'Drag and drop single or batch images into the browser compressor.' },
        { title: 'Set Quality or Target KB', desc: 'Use the quality slider or enter a target size in KB (e.g. compress to 100KB or 50KB).' },
        { title: 'Instant In-Browser Compression', desc: 'Background Web Worker compresses your files locally without uploading to any server.' },
      ]}
      features={[
        '100% Client-side Web Worker processing via browser-image-compression (MIT)',
        'Target size in KB mode for meeting strict email or upload requirements (50KB, 100KB, etc.)',
        'Interactive before & after slider to visually verify compression quality',
        'Batch compression with total savings summary and ZIP export',
        'Automatic EXIF stripping for privacy and location protection',
        'Zero file uploads, zero watermarks, and zero paywalls',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Controls */}
        <div className={styles.controlsBar}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Quality: <strong>{quality}%</strong></label>
            <input
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={isCompressing}
              className={styles.sliderControl}
              style={{ width: '110px' }}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Format:</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className={styles.selectInput}
              disabled={isCompressing}
            >
              <option value="original">Keep Original</option>
              <option value="image/jpeg">Convert to JPG</option>
              <option value="image/webp">Convert to WebP</option>
              <option value="image/png">Convert to PNG</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Max Dimension:</label>
            <select
              value={maxWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxWidth(val);
                setMaxHeight(val);
              }}
              className={styles.selectInput}
              disabled={isCompressing}
            >
              <option value={3840}>4K (3840px)</option>
              <option value={1920}>Full HD (1920px)</option>
              <option value={1280}>HD (1280px)</option>
              <option value={800}>Small (800px)</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Target Size (KB):</label>
            <input
              type="number"
              placeholder="e.g. 100"
              value={targetKb}
              onChange={(e) => setTargetKb(e.target.value)}
              className={styles.numInput}
              style={{ width: '90px' }}
              disabled={isCompressing}
            />
          </div>

          {files.length > 0 && (
            <div className={styles.controlGroup}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleApplySettings}
                disabled={isCompressing}
              >
                Re-compress
              </button>
            </div>
          )}
        </div>

        {/* Dropzone */}
        <Dropzone
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          title="Drop images here, or click to browse"
          subtitle="Supports JPG, PNG, and WebP. Heavy processing runs in background Web Worker."
          onFilesSelected={handleFilesSelected}
        />

        {/* Compression State */}
        {isCompressing && (
          <div className={styles.processingState}>
            <span>⚡ Compressing images in Web Worker...</span>
          </div>
        )}

        {/* Results */}
        {compressedItems.length > 0 && current && (
          <div className={styles.resultsSection}>
            {/* Batch summary header */}
            <div className={styles.batchSummaryHeader}>
              <div className={styles.batchMetrics}>
                <span>
                  Total Original: <strong>{formatBytes(totalOrigSize)}</strong>
                </span>
                <span>
                  Total Compressed: <strong>{formatBytes(totalCompSize)}</strong>
                </span>
                <span className={styles.metricSavingsBadge}>
                  Overall -{totalSavings}% Saved
                </span>
              </div>
              {compressedItems.length > 1 && (
                <DownloadZip
                  files={compressedItems.map((item) => ({
                    name: item.name,
                    content: item.blob,
                  }))}
                  zipFilename="compressed-images.zip"
                  label="Download All Compressed"
                />
              )}
            </div>

            {/* Batch tabs if multiple files */}
            {compressedItems.length > 1 && (
              <div className={styles.fileTabs}>
                {compressedItems.map((f, i) => (
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
            )}

            {/* Before After Preview */}
            <BeforeAfterPreview
              originalSrc={current.originalSrc}
              processedSrc={current.compressedSrc}
              originalSize={current.originalSize}
              processedSize={current.compressedSize}
              originalLabel="Original Image"
              processedLabel="Compressed Image"
            />

            {/* Download single */}
            <div className={styles.actionButtonsRow}>
              <a
                href={current.compressedSrc}
                download={current.name}
                className={styles.primaryActionButton}
              >
                Download Compressed ({formatBytes(current.compressedSize)})
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default ImageCompressorPage;
