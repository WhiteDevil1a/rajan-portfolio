import React, { useState, useRef } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Dropzone from '@src/components/brandTools/Dropzone';
import BeforeAfterPreview, { formatBytes } from '@src/components/brandTools/BeforeAfterPreview';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['png-to-svg'];

// ImageTracer presets
const PRESETS = {
  logo: {
    label: 'Logo',
    colorsampling: 2,
    numberofcolors: 6,
    blurradius: 0,
    blurdelta: 20,
    ltres: 1,
    qtres: 1,
    pathomit: 8,
  },
  icon: {
    label: 'Icon (B&W)',
    colorsampling: 0,
    numberofcolors: 2,
    blurradius: 0,
    blurdelta: 10,
    ltres: 0.5,
    qtres: 0.5,
    pathomit: 4,
  },
  illustration: {
    label: 'Illustration',
    colorsampling: 2,
    numberofcolors: 16,
    blurradius: 1,
    blurdelta: 16,
    ltres: 1,
    qtres: 1,
    pathomit: 16,
  },
  photo: {
    label: 'Photo (Simplified)',
    colorsampling: 1,
    numberofcolors: 32,
    blurradius: 2,
    blurdelta: 32,
    ltres: 2,
    qtres: 2,
    pathomit: 32,
  },
};

function PngToSvgPage() {
  const [file, setFile] = useState(null);
  const [originalSrc, setOriginalSrc] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [svgOutput, setSvgOutput] = useState('');
  const [svgDataUrl, setSvgDataUrl] = useState('');
  const [svgSize, setSvgSize] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('logo');
  const [colorCount, setColorCount] = useState(6);
  const [isTracing, setIsTracing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewCode, setViewCode] = useState(false);

  const runTracer = async (imageSrc, presetKey, colors) => {
    setIsTracing(true);
    try {
      // Dynamic import to keep bundle light
      const ImageTracer = (await import('imagetracerjs')).default || (await import('imagetracerjs'));

      const options = {
        ...PRESETS[presetKey],
        numberofcolors: colors,
      };

      ImageTracer.imageToSVG(
        imageSrc,
        (svgString) => {
          setSvgOutput(svgString);
          const blob = new Blob([svgString], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          setSvgDataUrl(url);
          setSvgSize(blob.size);
          setIsTracing(false);
        },
        options
      );
    } catch (err) {
      console.error('Vector trace failed:', err);
      setIsTracing(false);
    }
  };

  const handleFileSelected = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setOriginalSrc(src);
      runTracer(src, selectedPreset, colorCount);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handlePresetChange = (key) => {
    setSelectedPreset(key);
    const newColors = PRESETS[key].numberofcolors;
    setColorCount(newColors);
    if (originalSrc) {
      runTracer(originalSrc, key, newColors);
    }
  };

  const handleColorChange = (count) => {
    setColorCount(count);
    if (originalSrc) {
      runTracer(originalSrc, selectedPreset, count);
    }
  };

  const copySvgCode = () => {
    if (!svgOutput) return;
    navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    if (!svgDataUrl) return;
    const a = document.createElement('a');
    a.href = svgDataUrl;
    a.download = `${file?.name?.replace(/\.[^/.]+$/, '') || 'vectorized'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout
      toolId="png-to-svg"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Upload Raster Image', desc: 'Choose a PNG, JPG, or WebP logo, icon, or simple graphic from your device.' },
        { title: 'Select Tracing Preset', desc: 'Choose from Logo, Icon, Illustration, or Photo presets and fine-tune the color count.' },
        { title: 'Review & Download SVG', desc: 'Inspect side-by-side vector paths, copy raw SVG code, or download the scalable .svg file.' },
      ]}
      features={[
        '100% In-browser vectorization powered by imagetracerjs (Public Domain / Unlicense)',
        'Dedicated modes: Black & white silhouettes, flat brand logos, and posterized illustrations',
        'Interactive color count slider (2 to 32 colors)',
        'Side-by-side before and after visual comparison with file size tracking',
        'One-click SVG code inspection and clipboard copy',
        'Zero server latency and complete privacy guarantee',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Dropzone */}
        {!originalSrc && (
          <Dropzone
            accept="image/png,image/jpeg,image/webp"
            title="Upload PNG, JPG, or WebP to vectorize"
            subtitle="Best results are achieved with high-contrast logos and simple icons with flat colors."
            onFilesSelected={handleFileSelected}
          />
        )}

        {originalSrc && (
          <>
            {/* Controls */}
            <div className={styles.controlsBar}>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Tracing Preset:</label>
                <div className={styles.scaleButtons}>
                  {Object.entries(PRESETS).map(([k, p]) => (
                    <button
                      key={k}
                      type="button"
                      className={selectedPreset === k ? styles.controlBtnActive : styles.controlBtn}
                      onClick={() => handlePresetChange(k)}
                      disabled={isTracing}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Color Count: <strong>{colorCount}</strong></label>
                <input
                  type="range"
                  min="2"
                  max="32"
                  value={colorCount}
                  onChange={(e) => handleColorChange(Number(e.target.value))}
                  disabled={isTracing}
                  className={styles.sliderControl}
                  style={{ width: '130px' }}
                />
              </div>

              <div className={styles.controlGroup}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setOriginalSrc('');
                    setSvgOutput('');
                    setSvgDataUrl('');
                  }}
                >
                  Upload Another Image
                </button>
              </div>
            </div>

            {/* Tracing status */}
            {isTracing && (
              <div className={styles.processingState}>
                <span>⚙️ Tracing raster paths to vector SVG in browser...</span>
              </div>
            )}

            {/* Before After Preview */}
            {svgDataUrl && !isTracing && (
              <BeforeAfterPreview
                originalSrc={originalSrc}
                processedSrc={svgDataUrl}
                originalSize={originalSize}
                processedSize={svgSize}
                originalLabel="Original Raster"
                processedLabel="Vector SVG"
              />
            )}

            {/* Actions */}
            {svgOutput && !isTracing && (
              <div className={styles.actionButtonsRow}>
                <button
                  type="button"
                  className={styles.primaryActionButton}
                  onClick={downloadSvg}
                >
                  Download SVG ({formatBytes(svgSize)})
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={copySvgCode}
                >
                  {copied ? '✓ SVG Copied!' : 'Copy SVG Code'}
                </button>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setViewCode(!viewCode)}
                >
                  {viewCode ? 'Hide Code' : 'View SVG Code'}
                </button>
              </div>
            )}

            {/* SVG Code View */}
            {viewCode && svgOutput && (
              <div className={styles.codeSnippetBox}>
                <pre className={styles.codePre}>{svgOutput}</pre>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}

export default PngToSvgPage;
