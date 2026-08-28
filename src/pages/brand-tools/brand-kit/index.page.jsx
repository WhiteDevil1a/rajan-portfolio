import React, { useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import ColorPickerInput from '@src/components/brandTools/ColorPickerInput';
import Toast from '@src/components/brandTools/Toast';
import { CURATED_FONTS, loadGoogleFont } from '@src/constants/brandFonts';
import useBrandKit from '@src/hooks/useBrandKit';
import {
  exportBrandKitJSON,
  generateCSSVariables,
  importBrandKitJSON,
  optimizeImageUpload,
} from '@src/lib/brandKitStorage';
import { extractColorsFromImage } from '@src/lib/colorExtractor';
import { generateBrandGuidelinesPDF } from '@src/lib/pdfGuidelinesGenerator';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Establish Brand Parameters',
    desc: 'Enter your company name, website, verified contact channels, core brand voice, and messaging guidelines.',
  },
  {
    title: 'Upload Vector Logos & Set Colors',
    desc: 'Upload multi-variant logos, extract dominant color tokens from your mark, and configure your typography system.',
  },
  {
    title: 'Deploy Across All Generators',
    desc: 'Saved Brand Kit assets immediately populate Business Cards, Letterheads, Email Signatures, Gradients, and Guidelines.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Single Source of Brand Truth',
    desc: 'Centralize approved logomarks, typography rules, color tokens, and messaging principles in one permanent dashboard.',
  },
  {
    title: 'Real-Time Cross-Tool Sync',
    desc: 'Updates made to your Brand Kit instantly synchronize with every generator across the Brand Tools ecosystem.',
  },
  {
    title: 'Executive PDF & Code Deliverables',
    desc: 'Export production-ready CSS variables for engineering teams or download an executive multi-page Brand Guidelines PDF.',
  },
];

const FAQS = [
  {
    q: 'Where are my uploaded logos and brand data stored?',
    a: 'All logos, color palettes, and brand parameters are compressed and stored client-side in your browser localStorage. No data is ever transmitted to an external database.',
  },
  {
    q: 'What is included in the Brand Guidelines PDF book?',
    a: 'The generator compiles an executive multi-page vector PDF containing your cover page, brand mission statement, logo clear-space rules, full color swatch specifications (HEX, RGB, CMYK), and typography scales.',
  },
  {
    q: 'How do I transfer my Brand Kit to another team member or device?',
    a: 'Click "Export JSON" to download your complete brand system file, then share it with your team. They can use "Import JSON" to instantly load your exact configuration.',
  },
];

const LOGO_SLOTS = [
  { key: 'primary', label: 'Primary Logo (Light BG)', desc: 'Main logo for light/neutral backgrounds' },
  { key: 'darkPrimary', label: 'Dark Mode Primary Logo', desc: 'White/reversed logo for dark backgrounds' },
  { key: 'icon', label: 'Icon / Symbol Mark', desc: 'Standalone brandmark without wordmark' },
  { key: 'darkIcon', label: 'Dark Mode Icon Mark', desc: 'Reversed symbol mark for dark media' },
  { key: 'alternate1', label: 'Alternate Lockup 1', desc: 'Secondary approved lockup (e.g. horizontal)' },
  { key: 'alternate2', label: 'Alternate Lockup 2', desc: 'Secondary approved lockup (e.g. badge/stacked)' },
];

function BrandKitPage() {
  const { brandKit, save, reset, isCustom } = useBrandKit();
  const [formData, setFormData] = useState(brandKit);
  const [toastMessage, setToastMessage] = useState('');
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [cssCopied, setCssCopied] = useState(false);

  // Keep local form in sync with kit when loaded
  React.useEffect(() => {
    if (brandKit) setFormData(brandKit);
  }, [brandKit]);

  const handleTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleColorChange = (colorKey, value) => {
    setFormData((prev) => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value },
    }));
  };

  const handleFontChange = (fontKey, value) => {
    loadGoogleFont(value);
    setFormData((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [fontKey]: value },
    }));
  };

  const handleLogoUpload = async (slotKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await optimizeImageUpload(file, 600);
      setFormData((prev) => ({
        ...prev,
        logos: { ...prev.logos, [slotKey]: dataUrl },
      }));

      // If primary logo uploaded, extract colors automatically
      if (slotKey === 'primary') {
        setIsExtractingColors(true);
        const palette = await extractColorsFromImage(dataUrl, 8);
        setExtractedColors(palette);
        setIsExtractingColors(false);
        setToastMessage('Colors successfully extracted from primary logo!');
      } else {
        setToastMessage(`Logo updated for ${slotKey}. Click "Save Brand Kit" to persist.`);
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Error processing image. Please try another PNG or SVG file.');
    }
  };

  const handleRemoveLogo = (slotKey) => {
    setFormData((prev) => ({
      ...prev,
      logos: { ...prev.logos, [slotKey]: '' },
    }));
    setToastMessage('Logo removed. Click "Save Brand Kit" to apply.');
  };

  const handleManualExtractColors = async () => {
    const logoToAnalyze = formData.logos?.primary || formData.logos?.darkPrimary || formData.logos?.icon;
    if (!logoToAnalyze) {
      setToastMessage('Please upload a Primary Logo first to extract colors.');
      return;
    }

    try {
      setIsExtractingColors(true);
      const palette = await extractColorsFromImage(logoToAnalyze, 8);
      setExtractedColors(palette);
      setIsExtractingColors(false);
      setToastMessage('Dominant colors extracted! Click any color to assign it below.');
    } catch {
      setIsExtractingColors(false);
      setToastMessage('Could not extract colors from this image format.');
    }
  };

  const handleSave = () => {
    if (!formData.brandName?.trim()) {
      setToastMessage('Please enter a Brand or Company Name before saving.');
      return;
    }
    const success = save(formData);
    if (success) {
      setToastMessage('✓ Brand Kit saved locally! All Brand Tools are now updated.');
    } else {
      setToastMessage('Error saving Brand Kit.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your Brand Kit? This will reset all tools to defaults.')) {
      reset();
      setFormData(brandKit);
      setToastMessage('Brand Kit cleared.');
    }
  };

  const handleExportJSON = () => {
    exportBrandKitJSON(formData);
    setToastMessage('Brand Kit exported as JSON download.');
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importBrandKitJSON(file);
      setFormData(imported);
      setToastMessage('✓ Brand Kit JSON successfully imported and saved!');
    } catch {
      setToastMessage('Failed to import JSON file. Ensure it is a valid Brand Kit JSON.');
    }
  };

  const handleCopyCSS = () => {
    const css = generateCSSVariables(formData);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(css);
      setCssCopied(true);
      setToastMessage('✓ CSS Variables copied to clipboard!');
      setTimeout(() => setCssCopied(false), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsPdfGenerating(true);
      setToastMessage('Generating professional Brand Guidelines PDF...');
      await generateBrandGuidelinesPDF(formData);
      setIsPdfGenerating(false);
      setToastMessage('✓ Brand Guidelines PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      setIsPdfGenerating(false);
      setToastMessage('Error generating PDF. Please try again.');
    }
  };

  return (
    <ToolLayout
      toolId="brand-kit"
      number="01"
      category="Brand Foundation"
      title="Brand Kit & Identity Manager"
      subtitle="The central management hub for your brand identity system. Store your approved vector logos, multi-role color system, typographic hierarchy, and messaging rules to power all creative generators. 100% free with no login required."
      seoTitle="Free Brand Kit Generator & Guidelines PDF Creator | Brand Tools"
      seoDescription="100% free online Brand Kit generator by Rajan Bhatta. Build visual identity systems, manage logos, color codes, typography, CSS tokens, and download vector Brand Guidelines PDFs with no login required."
      seoKeywords={[
        'Free Brand Kit Generator',
        '100% Free Brand Identity Manager',
        'Free Brand Guidelines PDF',
        'No Login Brand Manager',
        'Brand Guidelines PDF',
        'Visual Identity Manager',
        'Brand Style Guide Creator',
        'CSS Variables Brand Tokens',
        'Design System Tokens',
        'Brand Asset Manager',
      ]}
      showBrandKitBanner={false}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['color-palette', 'business-card', 'email-signature', 'qr-code']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.1rem 1.25rem',
          background: '#ffffff',
          border: '1px solid rgba(40, 40, 43, 0.12)',
          borderRadius: '8px',
          marginBottom: '1.75rem',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isCustom ? '#16a34a' : 'rgba(40, 40, 43, 0.7)' }}>
            {isCustom ? '✓ Active Custom Brand Kit Loaded' : '💡 Showing template kit. Edit and click Save to store.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleSave} className={styles.btnPrimary} style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}>
            Save Brand Kit
          </button>
          <button type="button" onClick={handleDownloadPDF} disabled={isPdfGenerating} className={styles.btnSecondary} style={{ fontSize: '0.82rem', padding: '0.55rem 0.9rem' }}>
            {isPdfGenerating ? 'Building PDF...' : 'Download PDF Guidelines'}
          </button>
          <button type="button" onClick={handleExportJSON} className={styles.btnSecondary} style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}>
            Export JSON
          </button>
          <label className={styles.btnSecondary} style={{ cursor: 'pointer', margin: 0, fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}>
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>
          <button type="button" onClick={handleCopyCSS} className={styles.btnSecondary} style={{ fontSize: '0.82rem', padding: '0.55rem 0.85rem' }}>
            {cssCopied ? '✓ Copied CSS' : 'Copy CSS'}
          </button>
          {isCustom && (
            <button type="button" onClick={handleReset} className={styles.btnGhost} style={{ color: '#dc2626', fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      <div className={styles.workspaceLayout}>
        {/* Left Column: Essential Info & Logos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
          {/* Section 1: Brand Information */}
          <div className={styles.controlsPanel}>
            <div className={styles.panelHeader}>
              <h3>Brand Organization Details</h3>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="brandName">
                Brand / Company Name <span style={{ color: 'var(--brandColor)' }}>*</span>
              </label>
              <input
                id="brandName"
                type="text"
                value={formData.brandName || ''}
                onChange={(e) => handleTextChange('brandName', e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Rajan Bhatta Design"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tagline">Brand Positioning Tagline</label>
              <input
                id="tagline"
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleTextChange('tagline', e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Crafting meaningful visual identities"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="website">Official Website URL</label>
              <input
                id="website"
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleTextChange('website', e.target.value)}
                className={styles.textInput}
                placeholder="https://yourbrand.com"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Official Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleTextChange('email', e.target.value)}
                  className={styles.textInput}
                  placeholder="contact@brand.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Contact Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleTextChange('phone', e.target.value)}
                  className={styles.textInput}
                  placeholder="+977 9800000000"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Headquarters / Location</label>
              <input
                id="address"
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleTextChange('address', e.target.value)}
                className={styles.textInput}
                placeholder="Kathmandu, Nepal"
              />
            </div>
          </div>

          {/* Section 2: Logo Management */}
          <div className={styles.controlsPanel}>
            <div className={styles.panelHeader}>
              <h3>Approved Logo Assets</h3>
              <span style={{ fontSize: '0.72rem', color: 'rgba(40, 40, 43, 0.5)', fontWeight: 600 }}>
                PNG, SVG, JPG, WebP
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              {LOGO_SLOTS.map((slot) => {
                const logoSrc = formData.logos?.[slot.key];
                return (
                  <div
                    key={slot.key}
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
                      <div style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--black)', marginBottom: '0.2rem' }}>
                        {slot.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(40, 40, 43, 0.55)', marginBottom: '0.65rem' }}>
                        {slot.desc}
                      </div>
                    </div>

                    {/* Logo Preview box */}
                    <div
                      style={{
                        height: '64px',
                        background: slot.key.toLowerCase().includes('dark') ? '#18181b' : '#f4f4f2',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.4rem',
                        marginBottom: '0.65rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(40, 40, 43, 0.1)',
                      }}
                    >
                      {logoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoSrc}
                          alt={slot.label}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: slot.key.toLowerCase().includes('dark') ? '#888' : '#777' }}>
                          No logo
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <label
                        className={styles.btnSecondary}
                        style={{
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.72rem',
                          flex: 1,
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {logoSrc ? 'Replace' : 'Upload'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={(e) => handleLogoUpload(slot.key, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {logoSrc && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo(slot.key)}
                          className={styles.btnGhost}
                          style={{ padding: '0.35rem', color: '#dc2626', fontSize: '0.72rem' }}
                          title="Remove logo"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Color System & Typography & Voice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minWidth: 0 }}>
          {/* Section 3: Color Palette System */}
          <div className={styles.previewPanel}>
            <div className={styles.panelHeader}>
              <h3>Brand Color System</h3>
              <button
                type="button"
                onClick={handleManualExtractColors}
                disabled={isExtractingColors}
                className={styles.btnSecondary}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                {isExtractingColors ? 'Extracting...' : '🔍 Extract from Logo'}
              </button>
            </div>

            {/* Extracted Swatches suggestion */}
            {extractedColors.length > 0 && (
              <div
                style={{
                  background: 'rgba(255, 40, 40, 0.04)',
                  border: '1px solid rgba(255, 40, 40, 0.2)',
                  borderRadius: '6px',
                  padding: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 650, marginBottom: '0.45rem', color: 'var(--black)' }}>
                  Extracted from Logo:
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {extractedColors.map((col) => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => handleColorChange('primary', col.hex)}
                      style={{
                        background: col.hex,
                        border: '1px solid rgba(40, 40, 43, 0.2)',
                        borderRadius: '3px',
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: col.hsl.l > 50 ? '#111' : '#FFF',
                        cursor: 'pointer',
                      }}
                      title="Click to assign as Primary Color"
                    >
                      {col.hex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <ColorPickerInput
                label="Primary Brand Color"
                value={formData.colors?.primary || '#FF2828'}
                onChange={(hex) => handleColorChange('primary', hex)}
                id="color-primary"
              />
              <ColorPickerInput
                label="Secondary / Dark Neutral"
                value={formData.colors?.secondary || '#28282B'}
                onChange={(hex) => handleColorChange('secondary', hex)}
                id="color-secondary"
              />
              <ColorPickerInput
                label="Accent Color"
                value={formData.colors?.accent || '#F2FFBD'}
                onChange={(hex) => handleColorChange('accent', hex)}
                id="color-accent"
              />
              <ColorPickerInput
                label="Accent 2 / Light Neutral"
                value={formData.colors?.accent2 || '#F0F4F1'}
                onChange={(hex) => handleColorChange('accent2', hex)}
                id="color-accent2"
              />
              <ColorPickerInput
                label="Accent 3 (Optional)"
                value={formData.colors?.accent3 || '#8A2BE2'}
                onChange={(hex) => handleColorChange('accent3', hex)}
                id="color-accent3"
              />
              <ColorPickerInput
                label="Accent 4 (Optional)"
                value={formData.colors?.accent4 || '#3AA0FF'}
                onChange={(hex) => handleColorChange('accent4', hex)}
                id="color-accent4"
              />
            </div>
          </div>

          {/* Section 4: Typography System */}
          <div className={styles.previewPanel}>
            <div className={styles.panelHeader}>
              <h3>Typography Hierarchy</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="heading-font">Heading Typeface</label>
                <select
                  id="heading-font"
                  value={formData.fonts?.heading || 'Inter'}
                  onChange={(e) => handleFontChange('heading', e.target.value)}
                  className={styles.selectInput}
                >
                  {CURATED_FONTS.map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="body-font">Body Typeface</label>
                <select
                  id="body-font"
                  value={formData.fonts?.body || 'Inter'}
                  onChange={(e) => handleFontChange('body', e.target.value)}
                  className={styles.selectInput}
                >
                  {CURATED_FONTS.map((font) => (
                    <option key={font.name} value={font.name}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Font Specimen Preview */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(40, 40, 43, 0.12)',
                borderRadius: '6px',
                padding: '1.25rem',
              }}
            >
              <h2
                style={{
                  fontFamily: `"${formData.fonts?.heading || 'Inter'}", sans-serif`,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--black)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                }}
              >
                {formData.brandName || 'Brand Identity'} Headline Specimen
              </h2>
              <p
                style={{
                  fontFamily: `"${formData.fonts?.body || 'Inter'}", sans-serif`,
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'rgba(40, 40, 43, 0.7)',
                  margin: 0,
                }}
              >
                Paired with {formData.fonts?.body || 'Inter'} for crisp body copy across print and digital media.
              </p>
            </div>
          </div>

          {/* Section 5: Voice, Tone & Messaging */}
          <div className={styles.previewPanel}>
            <div className={styles.panelHeader}>
              <h3>Voice, Tone &amp; Messaging</h3>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="personality">Brand Personality Attributes</label>
              <input
                id="personality"
                type="text"
                value={formData.personality || ''}
                onChange={(e) => handleTextChange('personality', e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Modern, Strategic, Minimalist, Authoritative"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="voiceTone">Tone of Voice Directive</label>
              <input
                id="voiceTone"
                type="text"
                value={formData.voiceTone || ''}
                onChange={(e) => handleTextChange('voiceTone', e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Direct, clear, thoughtful, inspiring"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="wordsToUse">✓ Preferred Vocabulary</label>
                <input
                  id="wordsToUse"
                  type="text"
                  value={formData.wordsToUse || ''}
                  onChange={(e) => handleTextChange('wordsToUse', e.target.value)}
                  className={styles.textInput}
                  placeholder="Distinctive, Impactful, Cohesive"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="wordsToAvoid">✗ Excluded Vocabulary</label>
                <input
                  id="wordsToAvoid"
                  type="text"
                  value={formData.wordsToAvoid || ''}
                  onChange={(e) => handleTextChange('wordsToAvoid', e.target.value)}
                  className={styles.textInput}
                  placeholder="Generic, Cluttered, Cheap"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default BrandKitPage;
