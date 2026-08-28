import React, { useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import ColorPickerInput from '@src/components/brandTools/ColorPickerInput';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import {
  generateShades,
  generateTints,
  getContrastRatio,
  getWcagRatings,
} from '@src/lib/colorUtils';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Select Foreground & Background Tokens',
    desc: 'Enter any two HEX color codes or auto-populate your verified Brand Kit Primary and Neutral swatches.',
  },
  {
    title: 'Instant WCAG 2.1 Compliance Audit',
    desc: 'Relative luminance is calculated in real-time against ISO/WCAG standards across AA, AAA, and UI component benchmarks.',
  },
  {
    title: 'Generate 10-Step Tonal Scales',
    desc: 'Inspect full chromatic tint (lightened) and shade (darkened) tonal ranges with one-click clipboard copying.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Universal Accessibility Assurance',
    desc: 'Guarantee high-contrast legibility across digital interfaces, marketing collateral, and editorial print publications.',
  },
  {
    title: 'Rich UI State Systems',
    desc: 'Extract systematically calibrated tints and shades for hover states, focus rings, disabled badges, and card surfaces.',
  },
  {
    title: 'Clear PASS/FAIL Metrics',
    desc: 'Instant visual scorecards eliminate ambiguity regarding legal compliance for normal body copy and large headline typography.',
  },
];

const FAQS = [
  {
    q: 'What is the difference between WCAG AA and AAA accessibility standards?',
    a: 'WCAG AA requires a minimum 4.5:1 contrast ratio for normal body text and 3:1 for large text (18pt+). WCAG AAA is the highest accessibility benchmark, requiring 7:1 for body copy and 4.5:1 for large display text.',
  },
  {
    q: 'What classifies as "Large Text" under WCAG guidelines?',
    a: 'Text sized at least 18pt (24px regular) or 14pt (18.66px bold) is officially categorized as Large Text under WCAG 2.1 criteria.',
  },
  {
    q: 'How are the tonal tints and shades generated?',
    a: 'Tints are mathematically calculated by linearly interpolating the base color with pure white (#FFFFFF), while shades interpolate toward rich deep black (#000000).',
  },
];

function ColorContrastPage() {
  const { brandKit } = useBrandKit();
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [bgColor, setBgColor] = useState(brandKit?.colors?.primary || '#FF2828');
  const [toastMessage, setToastMessage] = useState('');

  const ratio = getContrastRatio(textColor, bgColor);
  const ratings = getWcagRatings(ratio);

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
    setToastMessage('Swapped foreground and background colors!');
  };

  const handleUseBrandKit = () => {
    setTextColor(brandKit.colors?.accent2 || '#F0F4F1');
    setBgColor(brandKit.colors?.primary || '#FF2828');
    setToastMessage('Applied Brand Kit Primary & Neutral colors!');
  };

  const handleCopyHex = (hex) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setToastMessage(`Copied ${hex} to clipboard!`);
    }
  };

  const textTints = generateTints(textColor, 6);
  const textShades = generateShades(textColor, 6);
  const bgTints = generateTints(bgColor, 6);
  const bgShades = generateShades(bgColor, 6);

  return (
    <ToolLayout
      toolId="color-contrast"
      number="04"
      category="Brand Foundation"
      title="WCAG Color Contrast & Tonal Scales"
      subtitle="Audit accessibility contrast ratios against WCAG 2.1 AA and AAA standards in real time. Generate comprehensive tint and shade tonal systems for digital interfaces. 100% free with no login required."
      seoTitle="Free WCAG Color Contrast Checker & Tonal Shades Generator | Brand Tools"
      seoDescription="100% free online WCAG 2.1 AA/AAA color contrast checker by Rajan Bhatta. Calculate contrast ratios, test text readability, and generate tint and shade scales with no login required."
      seoKeywords={[
        'Free WCAG Contrast Checker',
        '100% Free Contrast Tester',
        'Free Color Shade Generator',
        'No Login Contrast Tool',
        'WCAG Color Contrast Checker',
        'Accessibility Contrast Ratio',
        'WCAG 2.1 AA AAA Checker',
        'Color Tints and Shades Generator',
        'Brand Color Accessibility',
        'UI Color Contrast Tester',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'color-palette', 'gradient']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Column */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Contrast Parameters</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleSwap}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem' }}
                title="Swap Foreground & Background"
              >
                ⇄ Swap
              </button>
              <button
                type="button"
                onClick={handleUseBrandKit}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem' }}
              >
                Brand Kit
              </button>
            </div>
          </div>

          <ColorPickerInput
            label="Foreground / Text Color"
            value={textColor}
            onChange={setTextColor}
            id="text-color"
          />

          <ColorPickerInput
            label="Background Color"
            value={bgColor}
            onChange={setBgColor}
            id="bg-color"
          />

          {/* Quick Compliance Summary Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(40, 40, 43, 0.12)',
              borderRadius: '6px',
              padding: '1.1rem',
              marginTop: '1.25rem',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'rgba(40, 40, 43, 0.6)', textTransform: 'uppercase', fontWeight: 650, letterSpacing: '0.05em' }}>
              Contrast Ratio
            </div>
            <div
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                color: ratings.aaNormal ? '#16a34a' : '#dc2626',
                margin: '0.2rem 0',
              }}
            >
              {ratings.scoreText}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(40, 40, 43, 0.8)' }}>
              Overall Rating: <strong style={{ color: 'var(--black)' }}>{ratings.level}</strong>
            </div>
          </div>
        </div>

        {/* Live Preview & WCAG Badges */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>WCAG 2.1 Compliance Matrix</h3>
          </div>

          {/* WCAG Badges Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', width: '100%' }}>
            <div
              style={{
                background: ratings.aaNormal ? 'rgba(22, 163, 74, 0.06)' : 'rgba(220, 38, 38, 0.06)',
                border: `1px solid ${ratings.aaNormal ? '#16a34a' : '#dc2626'}`,
                borderRadius: '6px',
                padding: '0.85rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(40, 40, 43, 0.7)', fontWeight: 600 }}>
                AA Normal Text
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: ratings.aaNormal ? '#16a34a' : '#dc2626', margin: '0.15rem 0' }}>
                {ratings.aaNormal ? '✓ PASS' : '✗ FAIL'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(40, 40, 43, 0.5)' }}>Requires ≥ 4.5:1</div>
            </div>

            <div
              style={{
                background: ratings.aaLarge ? 'rgba(22, 163, 74, 0.06)' : 'rgba(220, 38, 38, 0.06)',
                border: `1px solid ${ratings.aaLarge ? '#16a34a' : '#dc2626'}`,
                borderRadius: '6px',
                padding: '0.85rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(40, 40, 43, 0.7)', fontWeight: 600 }}>
                AA Large Text
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: ratings.aaLarge ? '#16a34a' : '#dc2626', margin: '0.15rem 0' }}>
                {ratings.aaLarge ? '✓ PASS' : '✗ FAIL'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(40, 40, 43, 0.5)' }}>Requires ≥ 3.0:1</div>
            </div>

            <div
              style={{
                background: ratings.aaaNormal ? 'rgba(22, 163, 74, 0.06)' : 'rgba(220, 38, 38, 0.06)',
                border: `1px solid ${ratings.aaaNormal ? '#16a34a' : '#dc2626'}`,
                borderRadius: '6px',
                padding: '0.85rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(40, 40, 43, 0.7)', fontWeight: 600 }}>
                AAA Normal
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: ratings.aaaNormal ? '#16a34a' : '#dc2626', margin: '0.15rem 0' }}>
                {ratings.aaaNormal ? '✓ PASS' : '✗ FAIL'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(40, 40, 43, 0.5)' }}>Requires ≥ 7.0:1</div>
            </div>

            <div
              style={{
                background: ratings.uiComponents ? 'rgba(22, 163, 74, 0.06)' : 'rgba(220, 38, 38, 0.06)',
                border: `1px solid ${ratings.uiComponents ? '#16a34a' : '#dc2626'}`,
                borderRadius: '6px',
                padding: '0.85rem',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(40, 40, 43, 0.7)', fontWeight: 600 }}>
                UI Elements &amp; Icons
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: ratings.uiComponents ? '#16a34a' : '#dc2626', margin: '0.15rem 0' }}>
                {ratings.uiComponents ? '✓ PASS' : '✗ FAIL'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(40, 40, 43, 0.5)' }}>Requires ≥ 3.0:1</div>
            </div>
          </div>

          {/* Live Rendered Test Sample Box */}
          <div
            style={{
              background: bgColor,
              color: textColor,
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(40, 40, 43, 0.12)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: textColor, lineHeight: 1.2 }}>
              Display Headline Specimen (18pt+ / Bold)
            </h2>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem 0', color: textColor }}>
              Subheading &amp; Component Label Specimen
            </h4>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: 0, color: textColor }}>
              Optimal accessibility ensures readability across high-ambient lighting, low-contrast mobile screens, and assistive visual contexts. Test your brand typography across multiple color combinations.
            </p>
          </div>

          {/* Tints & Shades Scale */}
          <div style={{ width: '100%' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--black)' }}>
              Tonal Scales (Click to Copy HEX)
            </h4>

            {/* Background color tints & shades */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(40, 40, 43, 0.65)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Background Tonal Scale ({bgColor}):
              </div>
              <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', height: '32px', border: '1px solid rgba(40,40,43,0.15)', width: '100%' }}>
                {[...bgTints.reverse(), { hex: bgColor }, ...bgShades].map((item) => (
                  <div
                    key={item.hex}
                    onClick={() => handleCopyHex(item.hex)}
                    style={{
                      flex: 1,
                      background: item.hex,
                      cursor: 'pointer',
                    }}
                    title={`Click to copy ${item.hex}`}
                  />
                ))}
              </div>
            </div>

            {/* Text color tints & shades */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(40, 40, 43, 0.65)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Foreground Tonal Scale ({textColor}):
              </div>
              <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', height: '32px', border: '1px solid rgba(40,40,43,0.15)', width: '100%' }}>
                {[...textTints.reverse(), { hex: textColor }, ...textShades].map((item) => (
                  <div
                    key={item.hex}
                    onClick={() => handleCopyHex(item.hex)}
                    style={{
                      flex: 1,
                      background: item.hex,
                      cursor: 'pointer',
                    }}
                    title={`Click to copy ${item.hex}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default ColorContrastPage;
