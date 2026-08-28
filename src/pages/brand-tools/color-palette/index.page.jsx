import React, { useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Toast from '@src/components/brandTools/Toast';
import { extractColorsFromImage } from '@src/lib/colorExtractor';
import useBrandKit from '@src/hooks/useBrandKit';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Upload Image or Logo File',
    desc: 'Drag and drop any photograph, illustration, logo, or artwork into the drop zone.',
  },
  {
    title: 'Client-Side Pixel Analysis',
    desc: 'The browser samples pixel frequencies, filters transparency, and clusters dominant and vibrant color tones.',
  },
  {
    title: 'Inspect & Sync to Brand Kit',
    desc: 'Examine precise HEX, RGB, HSL, and CMYK color values. Click to copy or assign directly into your Brand Kit.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Harmonious Palette Extraction',
    desc: 'Extract balanced, cohesive color systems directly from real-world photography, architecture, and artwork.',
  },
  {
    title: '100% Free & Instant Processing',
    desc: 'Extract color codes in milliseconds with zero fees, no account registration, and no watermarks.',
  },
  {
    title: 'Instant Brand Kit Synchronization',
    desc: 'One-click assignment pushes any extracted color into your active Brand Kit to power business cards and letterheads.',
  },
];

const FAQS = [
  {
    q: 'What image formats are supported for color extraction?',
    a: 'PNG, JPEG/JPG, WebP, SVG, and GIF image files are fully supported.',
  },
  {
    q: 'How does the color clustering algorithm work?',
    a: 'The algorithm analyzes pixel frequency alongside chromatic saturation and balanced luminance to surface both dominant foundational neutrals and vibrant accent colors.',
  },
  {
    q: 'Can I export the extracted palette for design software?',
    a: 'Yes. You can copy individual HEX values, copy all HEX codes as a comma-separated array, or save swatches directly to your Brand Kit.',
  },
];

function ColorPalettePage() {
  const { brandKit, save } = useBrandKit();
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [palette, setPalette] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleProcessImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setToastMessage('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    try {
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        const extracted = await extractColorsFromImage(dataUrl, 10);
        setPalette(extracted);
        setIsAnalyzing(false);
        setToastMessage(`Extracted ${extracted.length} dominant colors!`);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsAnalyzing(false);
      setToastMessage('Failed to analyze image colors.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleProcessImage(file);
  };

  const handleCopyHex = (hex) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setToastMessage(`Copied ${hex} to clipboard!`);
    }
  };

  const handleSaveToKit = (hex, role) => {
    const updatedKit = {
      ...brandKit,
      colors: {
        ...brandKit.colors,
        [role]: hex,
      },
    };
    save(updatedKit);
    setToastMessage(`✓ Set ${hex} as Brand ${role.toUpperCase()} in your Brand Kit!`);
  };

  const handleCopyAllHex = () => {
    const all = palette.map((p) => p.hex).join(', ');
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(all);
      setToastMessage('Copied all HEX values to clipboard!');
    }
  };

  return (
    <ToolLayout
      toolId="color-palette"
      number="02"
      category="Brand Foundation"
      title="Color Palette Extractor"
      subtitle="Extract dominant, harmonious color palettes from any logo, photograph, or design asset instantly. Inspect precise HEX, RGB, HSL, and CMYK color values. 100% free with no login required."
      seoTitle="Free Color Palette Generator & Image Color Extractor | Brand Tools"
      seoDescription="100% free online color palette generator by Rajan Bhatta. Extract HEX, RGB, HSL, and CMYK color codes from any image or logo with zero fees and no login required."
      seoKeywords={[
        'Free Color Palette Generator',
        'Extract Colors From Image Free',
        'Online Color Palette Extractor',
        'Image Color Palette Generator',
        'Logo Color Extractor',
        'HEX Color Finder',
        'CMYK Color Converter',
        'Brand Color Palette Creator',
        'No Login Color Picker',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'gradient', 'color-contrast']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Left Column: Image Uploader & Dropzone */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Image Upload &amp; Analysis</h3>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setPalette([]);
                }}
                className={styles.btnGhost}
                style={{ fontSize: '0.75rem', color: '#dc2626', padding: '0.2rem 0.4rem' }}
              >
                Clear Image
              </button>
            )}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? 'var(--brandColor)' : 'rgba(40, 40, 43, 0.2)'}`,
              borderRadius: '8px',
              padding: '2rem 1rem',
              textAlign: 'center',
              background: isDragging ? 'rgba(255, 40, 40, 0.04)' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '1.25rem',
              boxSizing: 'border-box',
              width: '100%',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleProcessImage(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📷</div>
            <div style={{ fontWeight: 650, color: 'var(--black)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
              Drag &amp; drop an image here
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(40, 40, 43, 0.5)' }}>
              or click to browse (PNG, JPG, WebP, SVG)
            </div>
          </div>

          {imagePreview && (
            <div
              style={{
                borderRadius: '6px',
                overflow: 'hidden',
                maxHeight: '280px',
                border: '1px solid rgba(40, 40, 43, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f4f4f2',
                padding: '0.5rem',
                boxSizing: 'border-box',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Source for color extraction"
                style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Right Column: Extracted Palette & Swatches */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Extracted Color Palette</h3>
            {palette.length > 0 && (
              <button
                type="button"
                onClick={handleCopyAllHex}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                Copy All HEX
              </button>
            )}
          </div>

          {isAnalyzing ? (
            <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'rgba(40, 40, 43, 0.6)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analyzing pixel data and clustering dominant color tones...</div>
            </div>
          ) : palette.length === 0 ? (
            <div
              style={{
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                border: '1px dashed rgba(40, 40, 43, 0.15)',
                borderRadius: '6px',
                color: 'rgba(40, 40, 43, 0.55)',
                background: '#ffffff',
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🎨</div>
              <div style={{ fontWeight: 650, color: 'var(--black)', marginBottom: '0.35rem', fontSize: '0.95rem' }}>
                No image loaded yet
              </div>
              <div style={{ fontSize: '0.82rem', maxWidth: '360px', margin: '0 auto', lineHeight: 1.5 }}>
                Upload or drag any brand logo or photograph into the upload box on the left to extract its harmonious color palette.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              {/* Big continuous palette bar */}
              <div
                style={{
                  display: 'flex',
                  height: '44px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(40, 40, 43, 0.15)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  width: '100%',
                }}
              >
                {palette.map((item) => (
                  <div
                    key={item.hex}
                    onClick={() => handleCopyHex(item.hex)}
                    style={{
                      flex: 1,
                      background: item.hex,
                      cursor: 'pointer',
                      transition: 'flex 0.2s ease',
                    }}
                    title={`Click to copy ${item.hex}`}
                  />
                ))}
              </div>

              {/* Swatch detail cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', width: '100%' }}>
                {palette.map((colorItem) => {
                  const { hex, rgb, hsl, cmyk } = colorItem;
                  return (
                    <div
                      key={hex}
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(40, 40, 43, 0.12)',
                        borderRadius: '6px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div>
                        {/* Swatch */}
                        <div
                          onClick={() => handleCopyHex(hex)}
                          style={{
                            height: '48px',
                            background: hex,
                            borderRadius: '4px',
                            marginBottom: '0.65rem',
                            border: '1px solid rgba(40, 40, 43, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Click to copy HEX"
                        >
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: hsl.l > 50 ? '#111111' : '#FFFFFF',
                            }}
                          >
                            {hex}
                          </span>
                        </div>

                        {/* Specs */}
                        <div style={{ fontSize: '0.72rem', color: 'rgba(40, 40, 43, 0.65)', lineHeight: 1.6 }}>
                          <div>
                            <strong>RGB:</strong> {rgb.r}, {rgb.g}, {rgb.b}
                          </div>
                          <div>
                            <strong>HSL:</strong> {hsl.h}°, {hsl.s}%, {hsl.l}%
                          </div>
                          <div>
                            <strong>CMYK:</strong> {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
                          </div>
                        </div>
                      </div>

                      {/* Kit Actions */}
                      <div
                        style={{
                          marginTop: '0.75rem',
                          paddingTop: '0.55rem',
                          borderTop: '1px solid rgba(40, 40, 43, 0.08)',
                          display: 'flex',
                          gap: '0.25rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleSaveToKit(hex, 'primary')}
                          className={styles.btnGhost}
                          style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem', border: '1px solid rgba(40, 40, 43, 0.15)', borderRadius: '3px' }}
                          title="Set as Primary Color in Brand Kit"
                        >
                          + Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveToKit(hex, 'secondary')}
                          className={styles.btnGhost}
                          style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem', border: '1px solid rgba(40, 40, 43, 0.15)', borderRadius: '3px' }}
                          title="Set as Secondary Color in Brand Kit"
                        >
                          + Secondary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveToKit(hex, 'accent')}
                          className={styles.btnGhost}
                          style={{ fontSize: '0.68rem', padding: '0.2rem 0.4rem', border: '1px solid rgba(40, 40, 43, 0.15)', borderRadius: '3px' }}
                          title="Set as Accent Color in Brand Kit"
                        >
                          + Accent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export default ColorPalettePage;
