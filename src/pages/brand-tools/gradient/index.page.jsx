import React, { useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import ColorPickerInput from '@src/components/brandTools/ColorPickerInput';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Choose Brand Color Tokens',
    desc: 'Select 2 or 3 color stops manually or click "Use Brand Kit Colors" to auto-populate your verified identity palette.',
  },
  {
    title: 'Configure Angles & Positions',
    desc: 'Toggle between Linear and Radial geometry, rotate angles from 0° to 360°, and fine-tune stop percentage distributions.',
  },
  {
    title: 'Copy CSS & Export HD Assets',
    desc: 'Copy production-ready CSS rules directly to your clipboard or download a high-definition 1920×1080 PNG wallpaper.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Harmonious Brand Alignments',
    desc: 'Design seamless backdrop gradients that adhere strictly to your primary, secondary, and accent color ratios.',
  },
  {
    title: 'Zero CSS Preprocessor Bloat',
    desc: 'Outputs clean, vendor-free modern CSS3 syntax optimized for immediate deployment in web and UI codebases.',
  },
  {
    title: 'High-Definition Graphic Export',
    desc: 'Render high-resolution desktop backdrops, social card backgrounds, and hero textures directly from your browser.',
  },
];

const FAQS = [
  {
    q: 'How do I apply this gradient in web development?',
    a: 'Click "Copy CSS" and paste the output directly into your stylesheet. Both a solid color fallback and gradient declaration are included.',
  },
  {
    q: 'What resolution is the downloaded PNG wallpaper?',
    a: 'The PNG file renders at 1920 × 1080 Full HD resolution with uncompressed 32-bit color rendering.',
  },
  {
    q: 'Can I add a third intermediate color stop?',
    a: 'Yes. Click "+ Enable 3rd Color" to introduce a midpoint chromatic stop with its own independent position slider.',
  },
];

const PRESETS = [
  { name: 'Brand Crimson', type: 'linear', angle: 135, c1: '#FF2828', c2: '#28282B', hasC3: true, c3: '#8A2BE2' },
  { name: 'Sunset Amber', type: 'linear', angle: 90, c1: '#FF416C', c2: '#FF4B2B', hasC3: false, c3: '#F2FFBD' },
  { name: 'Deep Electric', type: 'radial', angle: 0, c1: '#3AA0FF', c2: '#18181B', hasC3: false, c3: '#000000' },
  { name: 'Acid Contrast', type: 'linear', angle: 45, c1: '#F2FFBD', c2: '#1D2A1C', hasC3: false, c3: '#000000' },
  { name: 'Monochrome Luxe', type: 'linear', angle: 180, c1: '#28282B', c2: '#18181B', hasC3: false, c3: '#000000' },
  { name: 'Emerald Wave', type: 'linear', angle: 120, c1: '#00F260', c2: '#0575E6', hasC3: false, c3: '#000000' },
];

function GradientGeneratorPage() {
  const { brandKit } = useBrandKit();
  const [gradientType, setGradientType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [color1, setColor1] = useState(brandKit?.colors?.primary || '#FF2828');
  const [color2, setColor2] = useState(brandKit?.colors?.secondary || '#28282B');
  const [hasColor3, setHasColor3] = useState(false);
  const [color3, setColor3] = useState(brandKit?.colors?.accent || '#F2FFBD');
  const [stop1, setStop1] = useState(0);
  const [stop2, setStop2] = useState(100);
  const [stop3, setStop3] = useState(50);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate CSS string
  const cssValue =
    gradientType === 'linear'
      ? hasColor3
        ? `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color3} ${stop3}%, ${color2} ${stop2}%)`
        : `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
      : hasColor3
      ? `radial-gradient(circle at center, ${color1} ${stop1}%, ${color3} ${stop3}%, ${color2} ${stop2}%)`
      : `radial-gradient(circle at center, ${color1} ${stop1}%, ${color2} ${stop2}%)`;

  const handleUseBrandKit = () => {
    setColor1(brandKit.colors?.primary || '#FF2828');
    setColor2(brandKit.colors?.secondary || '#28282B');
    if (brandKit.colors?.accent) {
      setColor3(brandKit.colors.accent);
    }
    setToastMessage('Loaded Brand Kit colors!');
  };

  const handleApplyPreset = (p) => {
    setGradientType(p.type);
    setAngle(p.angle);
    setColor1(p.c1);
    setColor2(p.c2);
    setHasColor3(p.hasC3);
    if (p.c3) setColor3(p.c3);
    setToastMessage(`Applied preset: ${p.name}`);
  };

  const handleCopyCSS = () => {
    const fullCss = `background: ${color1};\nbackground: ${cssValue};`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullCss);
      setToastMessage('✓ CSS Gradient code copied to clipboard!');
    }
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (gradientType === 'linear') {
      const rad = (angle * Math.PI) / 180;
      const x1 = 1920 / 2 - (Math.cos(rad) * 1920) / 2;
      const y1 = 1080 / 2 - (Math.sin(rad) * 1080) / 2;
      const x2 = 1920 / 2 + (Math.cos(rad) * 1920) / 2;
      const y2 = 1080 / 2 + (Math.sin(rad) * 1080) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(stop1 / 100, color1);
      if (hasColor3) grad.addColorStop(stop3 / 100, color3);
      grad.addColorStop(stop2 / 100, color2);
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createRadialGradient(960, 540, 0, 960, 540, 960);
      grad.addColorStop(stop1 / 100, color1);
      if (hasColor3) grad.addColorStop(stop3 / 100, color3);
      grad.addColorStop(stop2 / 100, color2);
      ctx.fillStyle = grad;
    }

    ctx.fillRect(0, 0, 1920, 1080);

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'brand-gradient-1920x1080.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setToastMessage('✓ Gradient PNG downloaded!');
  };

  return (
    <ToolLayout
      toolId="gradient"
      number="03"
      category="Brand Foundation"
      title="Brand Gradient Generator"
      subtitle="Design linear and radial multi-stop gradient systems with live visual feedback. Copy production CSS code or export high-resolution 1920×1080 PNG wallpapers. 100% free with no login required."
      seoTitle="Free CSS Brand Gradient Generator & 1080p Wallpaper Creator | Brand Tools"
      seoDescription="100% free online gradient generator by Rajan Bhatta. Design linear and radial brand gradients, copy clean CSS code, and download 1080p PNGs with no login required."
      seoKeywords={[
        'Free Gradient Generator',
        '100% Free CSS Gradient Creator',
        'Free Gradient Wallpapers',
        'No Login Gradient Tool',
        'Brand Gradient Generator',
        'CSS Gradient Creator',
        'Linear Gradient Generator',
        'Radial Gradient Tool',
        'Design System Gradients',
        'HD Gradient Wallpapers',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'color-palette', 'color-contrast']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Panel */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Gradient Parameters</h3>
            <button
              type="button"
              onClick={handleUseBrandKit}
              className={styles.btnSecondary}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
            >
              Use Brand Kit
            </button>
          </div>

          {/* Mode switch: Linear vs Radial */}
          <div className={styles.formGroup}>
            <label>Geometry Mode</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setGradientType('linear')}
                className={gradientType === 'linear' ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: '0.5rem', fontSize: '0.82rem' }}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => setGradientType('radial')}
                className={gradientType === 'radial' ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: '0.5rem', fontSize: '0.82rem' }}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Angle Slider (for Linear) */}
          {gradientType === 'linear' && (
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label htmlFor="angleSlider" style={{ margin: 0 }}>Rotation Angle</label>
                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 650, color: 'var(--black)' }}>{angle}°</span>
              </div>
              <input
                id="angleSlider"
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brandColor)', cursor: 'pointer' }}
              />
            </div>
          )}

          {/* Color 1 */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
            <ColorPickerInput
              label="Stop 1 Color"
              value={color1}
              onChange={setColor1}
              id="grad-c1"
            />
            <div className={styles.formGroup} style={{ marginTop: '-0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(40,40,43,0.6)', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span>Position</span>
                <span>{stop1}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={stop1}
                onChange={(e) => setStop1(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brandColor)' }}
              />
            </div>
          </div>

          {/* Optional Color 3 */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 650, color: 'rgba(40,40,43,0.75)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Midpoint Stop
              </label>
              <button
                type="button"
                onClick={() => setHasColor3(!hasColor3)}
                className={styles.btnGhost}
                style={{ fontSize: '0.72rem', color: hasColor3 ? '#dc2626' : 'var(--brandColor)', padding: '0.2rem 0.4rem' }}
              >
                {hasColor3 ? '− Remove Stop' : '+ Enable 3rd Color'}
              </button>
            </div>
            {hasColor3 && (
              <>
                <ColorPickerInput value={color3} onChange={setColor3} id="grad-c3" />
                <div className={styles.formGroup} style={{ marginTop: '-0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(40,40,43,0.6)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    <span>Position</span>
                    <span>{stop3}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop3}
                    onChange={(e) => setStop3(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--brandColor)' }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Color 2 */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
            <ColorPickerInput
              label="Ending Stop Color"
              value={color2}
              onChange={setColor2}
              id="grad-c2"
            />
            <div className={styles.formGroup} style={{ marginTop: '-0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(40,40,43,0.6)', fontWeight: 600, marginBottom: '0.2rem' }}>
                <span>Position</span>
                <span>{stop2}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={stop2}
                onChange={(e) => setStop2(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brandColor)' }}
              />
            </div>
          </div>

          {/* Preset Swatches */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: 'rgba(40,40,43,0.75)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Curated Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {PRESETS.map((preset) => {
                const bg =
                  preset.type === 'linear'
                    ? `linear-gradient(${preset.angle}deg, ${preset.c1}, ${preset.c2})`
                    : `radial-gradient(circle, ${preset.c1}, ${preset.c2})`;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      height: '36px',
                      borderRadius: '4px',
                      background: bg,
                      border: '1px solid rgba(40,40,43,0.15)',
                      cursor: 'pointer',
                      fontSize: '0.68rem',
                      fontWeight: 650,
                      color: '#FFF',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      padding: '0.2rem',
                    }}
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Live Canvas Preview</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleCopyCSS} className={styles.btnSecondary} style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}>
                Copy CSS
              </button>
              <button type="button" onClick={handleDownloadPNG} className={styles.btnPrimary} style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}>
                Download PNG
              </button>
            </div>
          </div>

          {/* Visual Container */}
          <div
            style={{
              width: '100%',
              minHeight: '340px',
              borderRadius: '8px',
              background: cssValue,
              border: '1px solid rgba(40, 40, 43, 0.15)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
              padding: '1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(40, 40, 43, 0.12)',
                borderRadius: '6px',
                padding: '1.1rem 1.75rem',
                textAlign: 'center',
                color: 'var(--black)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                maxWidth: '90%',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                {brandKit?.brandName || 'Brand Identity'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(40, 40, 43, 0.65)', fontWeight: 550 }}>
                {gradientType === 'linear' ? `${angle}° Linear Gradient` : 'Radial Geometry Gradient'}
              </div>
            </div>
          </div>

          {/* CSS Code Snippet Display */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(40, 40, 43, 0.12)',
              borderRadius: '6px',
              padding: '0.85rem 1rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(40, 40, 43, 0.6)', fontFamily: 'monospace', fontWeight: 700 }}>
                CSS Output
              </span>
              <button
                type="button"
                onClick={handleCopyCSS}
                className={styles.btnGhost}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.4rem' }}
              >
                Copy Code
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: 'var(--brandColor)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                background: 'rgba(40, 40, 43, 0.04)',
                padding: '0.5rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid rgba(40, 40, 43, 0.08)',
              }}
            >
              {`background: ${color1};\nbackground: ${cssValue};`}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default GradientGeneratorPage;
