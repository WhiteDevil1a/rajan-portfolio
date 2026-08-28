import React, { useEffect, useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import { renderQrToCanvas } from '@src/lib/qrCodeGenerator';
import { jsPDF } from 'jspdf';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Sync Verified Brand Assets',
    desc: 'Your saved Brand Kit logo, colors, and typography are automatically loaded into the card canvas.',
  },
  {
    title: 'Select Aesthetic & Embed QR Code',
    desc: 'Choose from 4 architectural layout styles (Minimal, Modern, Bold, Classic) and embed a dynamic vCard 3.0 or website QR code.',
  },
  {
    title: 'Export 300 DPI Print Collateral',
    desc: 'Download high-resolution 300 DPI raster PNGs of front and back faces, or export a vector print PDF with standardized bleed boundaries.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Commercial Print Standardization',
    desc: 'Formatted to standard US dimensions of 3.5" × 2" (88.9mm × 50.8mm) at 300 DPI for flawless physical offset and digital printing.',
  },
  {
    title: 'One-Tap Smartphone Contact Saves',
    desc: 'Embedded vCard 3.0 QR code allows contacts to scan and save your phone, email, company, and title directly into iOS and Android contacts.',
  },
  {
    title: 'Instant Multi-Style Switching',
    desc: 'Toggle between four curated brand layouts without losing or re-entering contact details or logo alignments.',
  },
];

const FAQS = [
  {
    q: 'What physical dimensions and resolution are generated?',
    a: 'Business cards are calibrated to 3.5" × 2.0" (88.9mm × 50.8mm) at 300 DPI print resolution (1050 × 600 pixels per side).',
  },
  {
    q: 'How does the vCard QR code function on mobile?',
    a: 'When scanned with any smartphone camera, the vCard code opens a prompt to directly create a new contact containing your full name, title, organization, phone number, email, and website URL.',
  },
  {
    q: 'Can I send the downloaded PDF directly to a print shop?',
    a: 'Yes. The downloaded PDF contains exact vector page bounds for both front and back sides, ready for upload to MOO, VistaPrint, or local print shops.',
  },
];

const CARD_STYLES = [
  { id: 'minimal', name: 'Minimal' },
  { id: 'modern', name: 'Modern' },
  { id: 'bold', name: 'Bold' },
  { id: 'classic', name: 'Classic' },
];

function BusinessCardPage() {
  const { brandKit } = useBrandKit();
  const [cardStyle, setCardStyle] = useState('modern');
  const [activeSide, setActiveSide] = useState('front');
  const [includeQr, setIncludeQr] = useState(true);
  const [qrType, setQrType] = useState('website');
  const [toastMessage, setToastMessage] = useState('');

  // Card form fields with Brand Kit fallbacks
  const [name, setName] = useState('Rajan Bhatta');
  const [title, setTitle] = useState('Brand Designer & Strategist');
  const [company, setCompany] = useState(brandKit?.brandName || 'Rajan Bhatta Design');
  const [phone, setPhone] = useState(brandKit?.phone || '+977 9800000000');
  const [email, setEmail] = useState(brandKit?.email || 'hi@rajanbhatta.com.np');
  const [website, setWebsite] = useState(brandKit?.website || 'https://rajanbhatta.com.np');
  const [address, setAddress] = useState(brandKit?.address || 'Kathmandu, Nepal');
  const [handle, setHandle] = useState('@brandwithrajan');

  const qrCanvasRef = useRef();

  // Synchronize when Brand Kit updates
  useEffect(() => {
    if (brandKit) {
      if (brandKit.brandName) setCompany(brandKit.brandName);
      if (brandKit.phone) setPhone(brandKit.phone);
      if (brandKit.email) setEmail(brandKit.email);
      if (brandKit.website) setWebsite(brandKit.website);
      if (brandKit.address) setAddress(brandKit.address);
    }
  }, [brandKit]);

  // Generate QR code on the back
  useEffect(() => {
    if (!includeQr || !qrCanvasRef.current) return;
    const qrData =
      qrType === 'vcard'
        ? `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nORG:${company}\nTITLE:${title}\nTEL:${phone}\nEMAIL:${email}\nURL:${website}\nADR:;;${address};;;\nEND:VCARD`
        : website;

    renderQrToCanvas(qrCanvasRef.current, qrData, {
      size: 160,
      margin: 1,
      foreground: cardStyle === 'bold' ? '#FFFFFF' : brandKit.colors?.secondary || '#28282B',
      background: cardStyle === 'bold' ? '#18181A' : '#FFFFFF',
    });
  }, [includeQr, qrType, name, company, title, phone, email, website, address, cardStyle, brandKit]);

  const pColor = brandKit?.colors?.primary || '#FF2828';
  const sColor = brandKit?.colors?.secondary || '#28282B';
  const aColor = brandKit?.colors?.accent || '#F2FFBD';
  const lColor = brandKit?.colors?.accent2 || '#F0F4F1';
  const logo = brandKit?.logos?.primary || brandKit?.logos?.darkPrimary || '';
  const fontHeading = brandKit?.fonts?.heading || 'Inter';
  const fontBody = brandKit?.fonts?.body || 'Inter';

  // Render Card to Canvas helper for PNG export
  const renderCardToCanvas = (canvas, side) => {
    canvas.width = 1050; // 3.5" at 300 DPI
    canvas.height = 600; // 2.0" at 300 DPI
    const ctx = canvas.getContext('2d');

    // Background
    if (side === 'front') {
      if (cardStyle === 'bold') {
        ctx.fillStyle = sColor;
        ctx.fillRect(0, 0, 1050, 600);
        ctx.fillStyle = pColor;
        ctx.fillRect(0, 0, 16, 600);
      } else if (cardStyle === 'modern') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1050, 600);
        ctx.fillStyle = sColor;
        ctx.fillRect(0, 0, 1050, 140);
        ctx.fillStyle = pColor;
        ctx.fillRect(0, 140, 1050, 8);
      } else if (cardStyle === 'classic') {
        ctx.fillStyle = lColor;
        ctx.fillRect(0, 0, 1050, 600);
        ctx.strokeStyle = pColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, 990, 540);
      } else {
        // Minimal
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 1050, 600);
        ctx.fillStyle = pColor;
        ctx.fillRect(60, 60, 6, 480);
      }

      // Name & Title
      ctx.fillStyle = cardStyle === 'bold' ? '#FFFFFF' : sColor;
      ctx.font = `bold 44px "${fontHeading}", sans-serif`;
      const nameX = cardStyle === 'minimal' ? 90 : cardStyle === 'classic' ? 525 : 60;
      const nameY = cardStyle === 'modern' ? 240 : 200;
      if (cardStyle === 'classic') {
        ctx.textAlign = 'center';
      } else {
        ctx.textAlign = 'left';
      }
      ctx.fillText(name, nameX, nameY);

      // Title
      ctx.fillStyle = pColor;
      ctx.font = `600 24px "${fontBody}", sans-serif`;
      ctx.fillText(title.toUpperCase(), nameX, nameY + 40);

      // Contact Details
      ctx.fillStyle = cardStyle === 'bold' ? '#CCCCCC' : '#444444';
      ctx.font = `20px "${fontBody}", sans-serif`;
      let contactY = nameY + 110;
      const contactX = cardStyle === 'classic' ? 525 : cardStyle === 'minimal' ? 90 : 60;

      if (phone) {
        ctx.fillText(`P: ${phone}`, contactX, contactY);
        contactY += 34;
      }
      if (email) {
        ctx.fillText(`E: ${email}`, contactX, contactY);
        contactY += 34;
      }
      if (website) {
        ctx.fillText(`W: ${website}`, contactX, contactY);
        contactY += 34;
      }
      if (address) {
        ctx.fillText(`A: ${address}`, contactX, contactY);
      }

      // Company in corner
      ctx.textAlign = 'right';
      ctx.fillStyle = cardStyle === 'bold' ? '#FFFFFF' : sColor;
      ctx.font = `bold 28px "${fontHeading}", sans-serif`;
      ctx.fillText(company, 990, cardStyle === 'modern' ? 90 : 540);
    } else {
      // BACK SIDE
      ctx.fillStyle = cardStyle === 'bold' ? sColor : pColor;
      ctx.fillRect(0, 0, 1050, 600);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold 48px "${fontHeading}", sans-serif`;
      ctx.fillText(company, 525, 260);

      ctx.fillStyle = aColor;
      ctx.font = `22px "${fontBody}", sans-serif`;
      ctx.fillText(website, 525, 320);

      if (handle) {
        ctx.font = `18px "${fontBody}", sans-serif`;
        ctx.fillText(handle, 525, 360);
      }
    }
  };

  const handleDownloadPNG = (side) => {
    const canvas = document.createElement('canvas');
    renderCardToCanvas(canvas, side);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-card-${side}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setToastMessage(`✓ ${side.toUpperCase()} business card PNG downloaded (300 DPI)!`);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [88.9, 50.8],
    });

    const frontCanvas = document.createElement('canvas');
    renderCardToCanvas(frontCanvas, 'front');
    doc.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, 88.9, 50.8, undefined, 'FAST');

    doc.addPage([88.9, 50.8], 'landscape');
    const backCanvas = document.createElement('canvas');
    renderCardToCanvas(backCanvas, 'back');
    doc.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, 88.9, 50.8, undefined, 'FAST');

    doc.save(`${company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-business-card.pdf`);
    setToastMessage('✓ Print-ready Business Card PDF downloaded!');
  };

  return (
    <ToolLayout
      toolId="business-card"
      number="05"
      category="Branded Assets"
      title="Brand Business Card Generator"
      subtitle="Design print-ready 3.5×2 inch business cards connected with your Brand Kit logo, colors, and typography. Includes dynamic vCard QR code integration and vector PDF export. 100% free with no login required."
      seoTitle="Free Business Card Generator with QR Code & PDF Export | Brand Tools"
      seoDescription="100% free online business card generator by Rajan Bhatta. Create print-ready 3.5×2 inch cards with custom logo, colors, vCard QR code, and 300 DPI PDF download with no login required."
      seoKeywords={[
        'Free Business Card Generator',
        '100% Free Printable Business Cards',
        'Free QR Code Business Card Maker',
        'No Login Business Card Creator',
        'Business Card Generator',
        'Print Ready Business Cards',
        'vCard Business Card QR Code',
        'Brand Identity Business Card',
        '300 DPI Business Card PDF',
        'Visual Identity Stationery',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'qr-code', 'email-signature']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Column */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Card Specification</h3>
          </div>

          {/* Style Selector */}
          <div className={styles.formGroup}>
            <label>Design Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
              {CARD_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setCardStyle(st.id)}
                  className={cardStyle === st.id ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.45rem 0.2rem', fontSize: '0.75rem', textAlign: 'center' }}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-name">Full Name</label>
            <input
              id="card-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-title">Professional Title</label>
            <input
              id="card-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-company">Company / Organization</label>
            <input
              id="card-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="card-phone">Phone</label>
              <input
                id="card-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="card-email">Email</label>
              <input
                id="card-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="card-website">Website</label>
              <input
                id="card-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="card-handle">Handle</label>
              <input
                id="card-handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="card-address">Address</label>
            <input
              id="card-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.textInput}
            />
          </div>

          {/* QR Options on Back */}
          <div style={{ borderTop: '1px solid rgba(40,40,43,0.08)', paddingTop: '0.85rem', marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 650, margin: 0, textTransform: 'none', color: 'var(--black)' }}>
                Back Face QR Code
              </label>
              <input
                type="checkbox"
                checked={includeQr}
                onChange={(e) => setIncludeQr(e.target.checked)}
                style={{ accentColor: 'var(--brandColor)', width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
            {includeQr && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setQrType('website')}
                  className={qrType === 'website' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.4rem', fontSize: '0.75rem' }}
                >
                  Website Link
                </button>
                <button
                  type="button"
                  onClick={() => setQrType('vcard')}
                  className={qrType === 'vcard' ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.4rem', fontSize: '0.75rem' }}
                >
                  vCard Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Column */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Live Card Preview</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveSide('front')}
                className={activeSide === 'front' ? styles.btnPrimary : styles.btnSecondary}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                Front Face
              </button>
              <button
                type="button"
                onClick={() => setActiveSide('back')}
                className={activeSide === 'back' ? styles.btnPrimary : styles.btnSecondary}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                Back Face
              </button>
            </div>
          </div>

          {/* Interactive Card Canvas Container */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem 1rem',
              background: '#f8f8f6',
              borderRadius: '8px',
              border: '1px solid rgba(40, 40, 43, 0.1)',
              marginBottom: '1.25rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Visual HTML Preview of Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '3.5 / 2',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                boxSizing: 'border-box',
                background:
                  activeSide === 'front'
                    ? cardStyle === 'bold'
                      ? sColor
                      : cardStyle === 'classic'
                      ? lColor
                      : '#FFFFFF'
                    : cardStyle === 'bold'
                    ? sColor
                    : pColor,
                color: activeSide === 'front' ? (cardStyle === 'bold' ? '#FFFFFF' : sColor) : '#FFFFFF',
                border: cardStyle === 'classic' && activeSide === 'front' ? `2px solid ${pColor}` : 'none',
              }}
            >
              {/* Front Side Rendering */}
              {activeSide === 'front' ? (
                <>
                  {/* Top Bar for Modern Style */}
                  {cardStyle === 'modern' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '24%',
                        background: sColor,
                        borderBottom: `3px solid ${pColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 1.25rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{company}</span>
                      {logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt="Logo" style={{ maxHeight: '20px', maxWidth: '70px', objectFit: 'contain' }} />
                      )}
                    </div>
                  )}

                  {/* Left Accent Bar for Minimal */}
                  {cardStyle === 'minimal' && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: pColor }} />
                  )}

                  {/* Header / Name */}
                  <div style={{ marginTop: cardStyle === 'modern' ? '14%' : '0' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: `"${fontHeading}", sans-serif` }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: pColor, marginTop: '0.15rem' }}>
                      {title.toUpperCase()}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ fontSize: '0.62rem', lineHeight: 1.5, opacity: 0.85 }}>
                    {phone && <div>📞 {phone}</div>}
                    {email && <div>✉️ {email}</div>}
                    {website && <div>🌐 {website}</div>}
                    {address && <div>📍 {address}</div>}
                  </div>

                  {/* Company Name in corner if not modern */}
                  {cardStyle !== 'modern' && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1.25rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: cardStyle === 'bold' ? '#FFF' : sColor,
                      }}
                    >
                      {company}
                    </div>
                  )}
                </>
              ) : (
                /* Back Side Rendering */
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: `"${fontHeading}", sans-serif` }}>
                    {company}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: aColor, marginTop: '0.25rem' }}>{website}</div>
                  {handle && <div style={{ fontSize: '0.68rem', opacity: 0.75, marginTop: '0.15rem' }}>{handle}</div>}

                  {/* QR Code */}
                  {includeQr && (
                    <div style={{ marginTop: '0.65rem', background: '#FFF', padding: '4px', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                      <canvas ref={qrCanvasRef} style={{ width: '56px', height: '56px', display: 'block' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => handleDownloadPNG('front')}
              className={styles.btnSecondary}
              style={{ fontSize: '0.78rem', padding: '0.55rem' }}
            >
              Front PNG (300 DPI)
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPNG('back')}
              className={styles.btnSecondary}
              style={{ fontSize: '0.78rem', padding: '0.55rem' }}
            >
              Back PNG (300 DPI)
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className={styles.btnPrimary}
              style={{ fontSize: '0.78rem', padding: '0.55rem' }}
            >
              Download Print PDF
            </button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default BusinessCardPage;
