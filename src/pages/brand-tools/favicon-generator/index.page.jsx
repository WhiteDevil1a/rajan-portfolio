import React, { useState, useRef, useEffect } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Dropzone from '@src/components/brandTools/Dropzone';
import { createAndDownloadZip } from '@src/components/brandTools/DownloadZip';
import { createIcoFile } from '@src/lib/icoEncoder';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['favicon-generator'];

function FaviconGeneratorPage() {
  const [sourceType, setSourceType] = useState('image'); // 'image' | 'text'
  const [imageSrc, setImageSrc] = useState('');
  const [imageName, setImageName] = useState('favicon');
  const [textChar, setTextChar] = useState('R');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#ff2828');
  const [padding, setPadding] = useState(10); // %
  const [borderRadius, setBorderRadius] = useState(20); // %

  const [preview16, setPreview16] = useState('');
  const [preview32, setPreview32] = useState('');
  const [preview180, setPreview180] = useState('');
  const [preview512, setPreview512] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Render a specific size icon to canvas
  const renderIcon = (size, isCircle = false) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Radius for rounded icon
    const rad = (size * borderRadius) / 100;

    // Draw background if not transparent
    if (bgColor !== 'transparent') {
      ctx.save();
      if (isCircle) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
      } else if (rad > 0) {
        ctx.beginPath();
        ctx.moveTo(rad, 0);
        ctx.lineTo(size - rad, 0);
        ctx.quadraticCurveTo(size, 0, size, rad);
        ctx.lineTo(size, size - rad);
        ctx.quadraticCurveTo(size, size, size - rad, size);
        ctx.lineTo(rad, size);
        ctx.quadraticCurveTo(0, size, 0, size - rad);
        ctx.lineTo(0, rad);
        ctx.quadraticCurveTo(0, 0, rad, 0);
        ctx.closePath();
        ctx.clip();
      }
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();
    }

    if (sourceType === 'image' && imageSrc) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const padPx = (size * padding) / 100;
          const drawW = size - padPx * 2;
          const drawH = size - padPx * 2;

          ctx.drawImage(img, padPx, padPx, drawW, drawH);
          canvas.toBlob((blob) => resolve({ size, canvas, blob }));
        };
        img.src = imageSrc;
      });
    }

    // Text / Emoji rendering
    const padPx = (size * padding) / 100;
    const fontSize = Math.round(size * 0.65);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.fillText(textChar || 'A', size / 2, size / 2 + size * 0.04);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve({ size, canvas, blob }));
    });
  };

  // Update preview icons when inputs change
  useEffect(() => {
    let active = true;
    const updatePreviews = async () => {
      try {
        const res32 = await renderIcon(32);
        const res180 = await renderIcon(180);
        const res512 = await renderIcon(512);
        if (active) {
          setPreview32(res32.canvas.toDataURL());
          setPreview180(res180.canvas.toDataURL());
          setPreview512(res512.canvas.toDataURL());
        }
      } catch (err) {
        console.error(err);
      }
    };
    updatePreviews();
    return () => {
      active = false;
    };
  }, [sourceType, imageSrc, textChar, textColor, bgColor, padding, borderRadius]);

  const handleFileSelected = (file) => {
    if (!file) return;
    setImageName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setSourceType('image');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadAll = async () => {
    setIsGenerating(true);
    try {
      const [i16, i32, i48, i180, i192, i512] = await Promise.all([
        renderIcon(16),
        renderIcon(32),
        renderIcon(48),
        renderIcon(180),
        renderIcon(192),
        renderIcon(512),
      ]);

      // Generate multi-size ICO binary in browser
      const icoBlob = await createIcoFile([
        { size: 16, pngBlob: i16.blob },
        { size: 32, pngBlob: i32.blob },
        { size: 48, pngBlob: i48.blob },
      ]);

      // webmanifest JSON
      const manifestObj = {
        name: imageName || 'App',
        short_name: imageName || 'App',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: bgColor === 'transparent' ? '#ffffff' : bgColor,
        background_color: bgColor === 'transparent' ? '#ffffff' : bgColor,
        display: 'standalone',
      };
      const manifestStr = JSON.stringify(manifestObj, null, 2);

      // HTML Head Snippet
      const snippetHtml = `<!-- Favicon & Web App Assets -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${bgColor === 'transparent' ? '#ffffff' : bgColor}">`;

      // Package everything into ZIP
      const zipFiles = [
        { name: 'favicon.ico', content: icoBlob },
        { name: 'favicon-16x16.png', content: i16.blob },
        { name: 'favicon-32x32.png', content: i32.blob },
        { name: 'favicon-48x48.png', content: i48.blob },
        { name: 'apple-touch-icon.png', content: i180.blob },
        { name: 'android-chrome-192x192.png', content: i192.blob },
        { name: 'android-chrome-512x512.png', content: i512.blob },
        { name: 'site.webmanifest', content: manifestStr },
        { name: 'head-snippet.html', content: snippetHtml },
      ];

      await createAndDownloadZip(zipFiles, `${imageName}-favicons.zip`);
    } catch (e) {
      console.error('Failed to generate favicon package:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copySnippet = () => {
    const snippetHtml = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${bgColor === 'transparent' ? '#ffffff' : bgColor}">`;

    navigator.clipboard.writeText(snippetHtml);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <ToolLayout
      toolId="favicon-generator"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Upload or Type Monogram', desc: 'Upload your brand logo (PNG, SVG, JPG) or create a monogram / emoji favicon instantly.' },
        { title: 'Customize Background & Padding', desc: 'Adjust padding, background color, and corner radius for iOS and Android homescreen icons.' },
        { title: 'Download Complete ZIP Bundle', desc: 'Get multi-size favicon.ico, PNGs, apple-touch-icon, webmanifest, and HTML head code.' },
      ]}
      features={[
        '100% In-browser multi-size .ico encoding (16x16, 32x32, 48x48) — no server needed',
        'Complete iOS Apple Touch Icon (180x180) and Android PWA Chrome icons (192, 512)',
        'Monogram & Emoji letter generator with custom colors and typography',
        'Ready-to-use site.webmanifest and copy-paste HTML <head> code snippet',
        'Interactive real-time browser tab and mobile phone home-screen mockups',
        'Instant ZIP download with zero watermark and complete privacy',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Source Toggle */}
        <div className={styles.controlsBar}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Source Type:</label>
            <div className={styles.scaleButtons}>
              <button
                type="button"
                className={sourceType === 'image' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => setSourceType('image')}
              >
                Upload Image / SVG
              </button>
              <button
                type="button"
                className={sourceType === 'text' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => setSourceType('text')}
              >
                Monogram / Emoji
              </button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Background:</label>
            <input
              type="color"
              value={bgColor === 'transparent' ? '#ffffff' : bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className={styles.colorPickerSquare}
            />
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => setBgColor(bgColor === 'transparent' ? '#ff2828' : 'transparent')}
            >
              {bgColor === 'transparent' ? 'Solid Color' : 'Transparent'}
            </button>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Padding: {padding}%</label>
            <input
              type="range"
              min="0"
              max="30"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className={styles.sliderControl}
              style={{ width: '90px' }}
            />
          </div>
        </div>

        {/* Source Inputs */}
        {sourceType === 'image' ? (
          <Dropzone
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            title="Upload Logo (PNG, SVG, JPG)"
            subtitle="Square logos or icons work best. Scaled client-side to all required favicon resolutions."
            onFilesSelected={handleFileSelected}
          />
        ) : (
          <div className={styles.textInputBox}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Letter or Emoji:</label>
              <input
                type="text"
                maxLength={2}
                value={textChar}
                onChange={(e) => setTextChar(e.target.value)}
                className={styles.textCharInput}
              />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Text Color:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className={styles.colorPickerSquare}
              />
            </div>
          </div>
        )}

        {/* Live Mockups */}
        <div className={styles.mockupSection}>
          <h3 className={styles.subHeading}>Live Favicon Preview</h3>
          <div className={styles.mockupGrid}>
            {/* Browser Tab Mockup */}
            <div className={styles.browserMockup}>
              <div className={styles.browserBar}>
                <div className={styles.browserDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.browserTab}>
                  {preview32 && <img src={preview32} alt="Favicon tab" className={styles.tabIcon} />}
                  <span className={styles.tabTitle}>My Great Website — Home</span>
                </div>
              </div>
              <div className={styles.browserContent}>
                <p>Browser Tab View (16×16 &amp; 32×32)</p>
              </div>
            </div>

            {/* Mobile App Icon Mockup */}
            <div className={styles.mobileMockup}>
              <div className={styles.mobileIconWrap}>
                {preview180 && <img src={preview180} alt="App icon" className={styles.mobileAppIcon} />}
                <span className={styles.mobileIconLabel}>{imageName || 'My App'}</span>
              </div>
              <p className={styles.mobileMockupNote}>Apple Touch &amp; Android PWA (180×180 &amp; 192×192)</p>
            </div>
          </div>
        </div>

        {/* Download Action */}
        <div className={styles.actionButtonsRow}>
          <button
            type="button"
            className={styles.primaryActionButton}
            onClick={handleDownloadAll}
            disabled={isGenerating || (sourceType === 'image' && !imageSrc)}
          >
            {isGenerating ? 'Generating Bundle...' : '📦 Download Favicon Package (ZIP)'}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={copySnippet}
          >
            {copiedSnippet ? '✓ HTML Snippet Copied!' : 'Copy HTML <head> Code'}
          </button>
        </div>

        {/* HTML Snippet preview */}
        <div className={styles.codeSnippetBox}>
          <span className={styles.codeSnippetLabel}>HTML code to paste in your &lt;head&gt;:</span>
          <pre className={styles.codePre}>
{`<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${bgColor === 'transparent' ? '#ffffff' : bgColor}">`}
          </pre>
        </div>
      </div>
    </ToolLayout>
  );
}

export default FaviconGeneratorPage;
