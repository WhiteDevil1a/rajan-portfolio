import React, { useEffect, useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import ColorPickerInput from '@src/components/brandTools/ColorPickerInput';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import { generateQrSvgString, renderQrToCanvas } from '@src/lib/qrCodeGenerator';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Select Payload Type',
    desc: 'Choose from Website URL, vCard 3.0 Contact, WiFi Network, Direct Email, SMS, Phone Number, or Plain Text.',
  },
  {
    title: 'Customize Brand Identity',
    desc: 'Apply your Brand Kit primary color, customize background contrast, set quiet zone margins, and optionally embed your brand icon.',
  },
  {
    title: 'Export Vector & High-Res Assets',
    desc: 'Download scalable vector SVG files for print collateral or high-DPI raster PNGs up to 2048px.',
  },
];

const WHY_USE_IT = [
  {
    title: 'ISO/IEC 18004 Standard Compliance',
    desc: 'Generates robust, direct-encoded QR codes with configurable Reed-Solomon Error Correction (up to Level H 30% recovery).',
  },
  {
    title: 'Centered Brand Logo Embedding',
    desc: 'Automatically integrates your brand logo inside a quiet-zone contrast frame without compromising scanner readability.',
  },
  {
    title: 'Zero Expiration & No Tracking Redirects',
    desc: 'Direct static encoding ensures your QR codes never expire, require no subscription, and operate independently forever.',
  },
];

const FAQS = [
  {
    q: 'Will these branded QR codes ever expire or require a renewal fee?',
    a: 'No. These are static, direct-encoded QR codes conforming to ISO/IEC standards. They contain direct payload data with zero intermediate redirect servers, meaning they remain functional indefinitely.',
  },
  {
    q: 'What Error Correction level should I use when embedding a brand logo?',
    a: 'Level H (High) is recommended when embedding a center logo. It allows up to 30% of the QR matrix to be obscured while maintaining 100% reliable scanning accuracy across iOS and Android camera apps.',
  },
  {
    q: 'Can I use these QR codes for commercial print and outdoor signage?',
    a: 'Yes. Download the vector SVG format for infinite resolution on signage, banners, and packaging, or select 2048px PNG resolution for 300 DPI print collateral.',
  },
];

const QR_TYPES = [
  { id: 'url', name: 'Website URL' },
  { id: 'vcard', name: 'vCard Contact' },
  { id: 'wifi', name: 'WiFi Access' },
  { id: 'email', name: 'Email' },
  { id: 'phone', name: 'Phone' },
  { id: 'sms', name: 'SMS' },
  { id: 'text', name: 'Plain Text' },
];

function QrCodePage() {
  const { brandKit } = useBrandKit();
  const [qrType, setQrType] = useState('url');
  const [toastMessage, setToastMessage] = useState('');

  // Colors & Options
  const [fgColor, setFgColor] = useState(brandKit?.colors?.primary || '#FF2828');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(512);
  const [margin, setMargin] = useState(2);
  const [ecLevel, setEcLevel] = useState('H');
  const [includeLogo, setIncludeLogo] = useState(true);

  // Type specific inputs
  const [url, setUrl] = useState(brandKit?.website || 'https://rajanbhatta.com.np');
  const [text, setText] = useState('Rajan Bhatta — Visual Identity & Brand Design');
  const [phoneNum, setPhoneNum] = useState(brandKit?.phone || '+977 9800000000');
  const [smsMsg, setSmsMsg] = useState('Hello, I would like to inquire about your brand design services.');
  const [emailTo, setEmailTo] = useState(brandKit?.email || 'hi@rajanbhatta.com.np');
  const [emailSubject, setEmailSubject] = useState('Brand Identity Inquiry');
  const [emailBody, setEmailBody] = useState('Hi Rajan,\n\nI would like to discuss a visual identity and design system project.');
  const [wifiSsid, setWifiSsid] = useState('Studio_Guest_WiFi');
  const [wifiPass, setWifiPass] = useState('SecurePass2026');
  const [wifiEnc, setWifiEnc] = useState('WPA');
  const [vName, setVName] = useState('Rajan Bhatta');
  const [vOrg, setVOrg] = useState(brandKit?.brandName || 'Rajan Bhatta Design');
  const [vTitle, setVTitle] = useState('Brand Designer');

  const canvasRef = useRef();

  // Compile formatted payload
  const getPayload = () => {
    switch (qrType) {
      case 'url':
        return url || 'https://rajanbhatta.com.np';
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vName}\nORG:${vOrg}\nTITLE:${vTitle}\nTEL:${phoneNum}\nEMAIL:${emailTo}\nURL:${url}\nEND:VCARD`;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      case 'sms':
        return `sms:${phoneNum}?body=${encodeURIComponent(smsMsg)}`;
      case 'text':
      default:
        return text || 'Rajan Bhatta Brand Design';
    }
  };

  const activeLogo = includeLogo
    ? brandKit?.logos?.icon || brandKit?.logos?.primary || null
    : null;

  // Render QR Code to canvas whenever options change
  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = getPayload();
    renderQrToCanvas(canvasRef.current, payload, {
      foreground: fgColor,
      background: bgColor,
      size: 512,
      margin,
      ecLevel,
      logo: activeLogo,
    });
  }, [qrType, url, text, phoneNum, smsMsg, emailTo, emailSubject, emailBody, wifiSsid, wifiPass, wifiEnc, vName, vOrg, vTitle, fgColor, bgColor, margin, ecLevel, activeLogo]);

  const handleUseBrandKit = () => {
    setFgColor(brandKit.colors?.primary || '#FF2828');
    setBgColor('#FFFFFF');
    if (brandKit.website) setUrl(brandKit.website);
    if (brandKit.email) setEmailTo(brandKit.email);
    if (brandKit.phone) setPhoneNum(brandKit.phone);
    if (brandKit.brandName) setVOrg(brandKit.brandName);
    setToastMessage('Loaded Brand Kit colors and assets!');
  };

  const handleDownloadPNG = async () => {
    const exportCanvas = document.createElement('canvas');
    const payload = getPayload();
    await renderQrToCanvas(exportCanvas, payload, {
      foreground: fgColor,
      background: bgColor,
      size,
      margin,
      ecLevel,
      logo: activeLogo,
    });

    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    a.download = `brand-qr-${qrType}-${size}px.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setToastMessage(`✓ High-resolution ${size}px PNG downloaded!`);
  };

  const handleDownloadSVG = () => {
    const payload = getPayload();
    const svgString = generateQrSvgString(payload, {
      foreground: fgColor,
      background: bgColor,
      size,
      margin,
      ecLevel,
    });

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `brand-qr-${qrType}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob);
    setToastMessage('✓ Scalable Vector SVG downloaded!');
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob && window.ClipboardItem && navigator.clipboard) {
          await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
          setToastMessage('✓ QR code image copied to clipboard!');
        }
      });
    } catch {
      setToastMessage('Failed to copy image. Use PNG download.');
    }
  };

  return (
    <ToolLayout
      toolId="qr-code"
      number="08"
      category="Branded Assets"
      title="Custom Brand QR Code Generator"
      subtitle="Generate professional, print-ready QR codes styled with your brand colors and logo. Supports URLs, vCard contact cards, WiFi configurations, and high-resolution vector SVG/PNG export. 100% free with no login required."
      seoTitle="Free Custom QR Code Generator with Logo & Vector SVG Export | Brand Tools"
      seoDescription="100% free custom QR code generator by Rajan Bhatta. Generate branded QR codes with center logo embedding, custom colors, vCard 3.0, WiFi, and high-DPI SVG/PNG export with no login required."
      seoKeywords={[
        'Free QR Code Generator',
        '100% Free QR Code with Logo',
        'Free Vector SVG QR Code',
        'No Login QR Code Maker',
        'Custom Brand QR Code Generator',
        'QR Code with Logo',
        'Vector SVG QR Code',
        'vCard QR Code Generator',
        'High Resolution QR Code',
        'Brand Identity QR Code',
        'Static QR Code Generator',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'business-card', 'color-palette']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Column */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>QR Configuration</h3>
            <button
              type="button"
              onClick={handleUseBrandKit}
              className={styles.btnSecondary}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
            >
              Use Brand Kit
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className={styles.formGroup}>
            <label>Payload Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '0.35rem' }}>
              {QR_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setQrType(t.id)}
                  className={qrType === t.id ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.45rem 0.2rem', fontSize: '0.75rem', textAlign: 'center' }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Payload Form */}
          {qrType === 'url' && (
            <div className={styles.formGroup}>
              <label htmlFor="qr-url">Website URL</label>
              <input
                id="qr-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={styles.textInput}
                placeholder="https://yourbrand.com"
              />
            </div>
          )}

          {qrType === 'vcard' && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="v-name">Full Name</label>
                <input
                  id="v-name"
                  type="text"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="v-org">Company</label>
                  <input
                    id="v-org"
                    type="text"
                    value={vOrg}
                    onChange={(e) => setVOrg(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="v-title">Title</label>
                  <input
                    id="v-title"
                    type="text"
                    value={vTitle}
                    onChange={(e) => setVTitle(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="v-phone">Phone</label>
                  <input
                    id="v-phone"
                    type="tel"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="v-email">Email</label>
                  <input
                    id="v-email"
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
              </div>
            </div>
          )}

          {qrType === 'wifi' && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="wifi-ssid">Network Name (SSID)</label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="wifi-pass">Password</label>
                  <input
                    id="wifi-pass"
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="wifi-enc">Encryption</label>
                  <select
                    id="wifi-enc"
                    value={wifiEnc}
                    onChange={(e) => setWifiEnc(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {qrType === 'email' && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="em-to">Recipient Email</label>
                <input
                  id="em-to"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="em-sub">Subject</label>
                <input
                  id="em-sub"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="em-body">Message Body</label>
                <textarea
                  id="em-body"
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className={styles.textareaInput}
                />
              </div>
            </div>
          )}

          {qrType === 'phone' && (
            <div className={styles.formGroup}>
              <label htmlFor="phone-num">Phone Number</label>
              <input
                id="phone-num"
                type="tel"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                className={styles.textInput}
              />
            </div>
          )}

          {qrType === 'sms' && (
            <div>
              <div className={styles.formGroup}>
                <label htmlFor="sms-phone">Recipient Phone Number</label>
                <input
                  id="sms-phone"
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className={styles.textInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="sms-msg">SMS Message</label>
                <textarea
                  id="sms-msg"
                  rows={3}
                  value={smsMsg}
                  onChange={(e) => setSmsMsg(e.target.value)}
                  className={styles.textareaInput}
                />
              </div>
            </div>
          )}

          {qrType === 'text' && (
            <div className={styles.formGroup}>
              <label htmlFor="qr-plain-text">Plain Text Content</label>
              <textarea
                id="qr-plain-text"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={styles.textareaInput}
              />
            </div>
          )}

          {/* Color & Logo Controls */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '1rem', marginTop: '1rem' }}>
            <ColorPickerInput
              label="QR / Foreground Color"
              value={fgColor}
              onChange={setFgColor}
              id="qr-fg"
            />

            <ColorPickerInput
              label="Background Color"
              value={bgColor}
              onChange={setBgColor}
              id="qr-bg"
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', color: 'rgba(40,40,43,0.7)', fontWeight: 600 }}>
                  <span>Resolution</span>
                  <span>{size}px</span>
                </div>
                <input
                  type="range"
                  min={256}
                  max={2048}
                  step={64}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brandColor)' }}
                />
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', color: 'rgba(40,40,43,0.7)', fontWeight: 600 }}>
                  <span>Quiet Margin</span>
                  <span>{margin} blocks</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--brandColor)' }}
                />
              </div>
            </div>

            {/* Logo embedding toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', padding: '0.4rem 0' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--black)', margin: 0, textTransform: 'none' }}>
                Embed Brand Logo in Center
              </label>
              <input
                type="checkbox"
                checked={includeLogo}
                onChange={(e) => setIncludeLogo(e.target.checked)}
                style={{ accentColor: 'var(--brandColor)', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Live QR Code Preview</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleCopyClipboard} className={styles.btnSecondary} style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}>
                Copy
              </button>
              <button type="button" onClick={handleDownloadSVG} className={styles.btnSecondary} style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}>
                SVG
              </button>
              <button type="button" onClick={handleDownloadPNG} className={styles.btnPrimary} style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}>
                Download PNG
              </button>
            </div>
          </div>

          {/* QR Canvas — fixed square, never overflows */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                background: bgColor,
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '0.5rem',
                boxSizing: 'border-box',
                overflow: 'hidden',
                lineHeight: 0,
              }}
            >
              <canvas
                ref={canvasRef}
                style={{
                  display: 'block',
                  width: 'min(200px, 72vw)',
                  height: 'min(200px, 72vw)',
                  borderRadius: '3px',
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(40, 40, 43, 0.45)', marginTop: '0.75rem', textAlign: 'center', fontWeight: 550 }}>
              📱 Point your camera to scan this code
            </div>
          </div>

          {/* Encoded Payload Inspector */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(40, 40, 43, 0.1)',
              borderRadius: '6px',
              padding: '0.85rem 1rem',
              fontSize: '0.82rem',
              color: 'rgba(40, 40, 43, 0.7)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ marginBottom: '0.35rem', fontWeight: 650, color: 'var(--black)' }}>
              Encoded Payload:
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'var(--brandColor)',
                wordBreak: 'break-all',
                background: 'rgba(40, 40, 43, 0.04)',
                padding: '0.5rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid rgba(40, 40, 43, 0.08)',
              }}
            >
              {getPayload()}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default QrCodePage;
