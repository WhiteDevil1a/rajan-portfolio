import React, { useEffect, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import { jsPDF } from 'jspdf';
import { hexToRgb } from '@src/lib/colorUtils';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Load Official Brand Assets',
    desc: 'Company credentials, vector logo, primary brand color tokens, and typography are automatically loaded from your Brand Kit.',
  },
  {
    title: 'Draft Correspondence & Formatting',
    desc: 'Edit recipient details, issue date, tracking reference number, subject line, body text, and authorized signatory credentials.',
  },
  {
    title: 'Export Vector A4 Deliverables',
    desc: 'Download an international A4 vector PDF or trigger direct print dialog formatted with standardized margins.',
  },
];

const WHY_USE_IT = [
  {
    title: 'International A4 Standardization',
    desc: 'Calibrated to standard 210 × 297 mm A4 dimensions with print-safe margins and high-DPI font rendering.',
  },
  {
    title: 'Official Corporate Communication',
    desc: 'Issue proposals, client agreements, statements of work, invoices, and executive correspondence with visual authority.',
  },
  {
    title: 'Instant Layout Switching',
    desc: 'Switch between Modern Minimal, Bold Header, and Elegant Classic stationery styles without losing drafted text.',
  },
];

const FAQS = [
  {
    q: 'What paper format is used for letterhead exports?',
    a: 'Letterheads adhere to standard international ISO A4 dimensions (210mm × 297mm), compatible with office printers and commercial document presses.',
  },
  {
    q: 'Can I print directly onto physical office stationery?',
    a: 'Yes. Click "Print Document" to open your browser’s print dialog with print-ready margins.',
  },
  {
    q: 'Can I include formal reference tracking numbers?',
    a: 'Yes. The Reference Code field allows you to include official correspondence tracking IDs (e.g. REF: RB-2026-BRAND-01).',
  },
];

const LETTERHEAD_STYLES = [
  { id: 'modern', name: 'Modern Minimal' },
  { id: 'bold', name: 'Bold Header' },
  { id: 'classic', name: 'Elegant Classic' },
];

function LetterheadPage() {
  const { brandKit } = useBrandKit();
  const [styleMode, setStyleMode] = useState('modern');
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [company, setCompany] = useState(brandKit?.brandName || 'Rajan Bhatta Design');
  const [tagline, setTagline] = useState(brandKit?.tagline || 'Brand Strategy & Visual Systems');
  const [phone, setPhone] = useState(brandKit?.phone || '+977 9800000000');
  const [email, setEmail] = useState(brandKit?.email || 'hi@rajanbhatta.com.np');
  const [website, setWebsite] = useState(brandKit?.website || 'https://rajanbhatta.com.np');
  const [address, setAddress] = useState(brandKit?.address || 'Kathmandu, Nepal');

  // Letter contents
  const [recipientName, setRecipientName] = useState('Client Name / Executive Committee');
  const [recipientCompany, setRecipientCompany] = useState('Global Enterprise Partners');
  const [recipientAddress, setRecipientAddress] = useState('456 Enterprise Boulevard, Tech District');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  const [refNo, setRefNo] = useState('REF: RB-2026-BRAND-01');
  const [subject, setSubject] = useState('Brand Identity System & Strategic Guidelines Delivery');
  const [body, setBody] = useState(
    `Dear Partners,\n\nWe are pleased to present the official brand identity system and visual guidelines crafted for your organization. This framework establishes the visual standards, color hierarchy, and typographic rules designed to elevate your market presence.\n\nEvery touchpoint—from digital applications and corporate correspondence to physical branded assets—has been formulated to communicate with distinct intention and clarity. Please review the enclosed documentation and feel free to reach out with any questions regarding brand implementation.\n\nThank you for your ongoing collaboration.`
  );
  const [signOff, setSignOff] = useState('Sincerely,');
  const [signerName, setSignerName] = useState('Rajan Bhatta');
  const [signerTitle, setSignerTitle] = useState('Principal Brand Designer');

  useEffect(() => {
    if (brandKit) {
      if (brandKit.brandName) setCompany(brandKit.brandName);
      if (brandKit.tagline) setTagline(brandKit.tagline);
      if (brandKit.phone) setPhone(brandKit.phone);
      if (brandKit.email) setEmail(brandKit.email);
      if (brandKit.website) setWebsite(brandKit.website);
      if (brandKit.address) setAddress(brandKit.address);
    }
  }, [brandKit]);

  const pColor = brandKit?.colors?.primary || '#FF2828';
  const sColor = brandKit?.colors?.secondary || '#28282B';
  const logo = brandKit?.logos?.primary || '';
  const font = brandKit?.fonts?.body || 'Inter';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentW = pageWidth - margin * 2;
    const pRgb = hexToRgb(pColor);
    const sRgb = hexToRgb(sColor);

    // Header styling based on layout
    if (styleMode === 'bold') {
      doc.setFillColor(sRgb.r, sRgb.g, sRgb.b);
      doc.rect(0, 0, pageWidth, 36, 'F');
      doc.setFillColor(pRgb.r, pRgb.g, pRgb.b);
      doc.rect(0, 36, pageWidth, 2.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(company, margin, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(tagline, margin, 28);
    } else if (styleMode === 'classic') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(sRgb.r, sRgb.g, sRgb.b);
      doc.text(company, pageWidth / 2, 26, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`${address} | ${phone} | ${email} | ${website}`, pageWidth / 2, 33, { align: 'center' });

      doc.setDrawColor(pRgb.r, pRgb.g, pRgb.b);
      doc.setLineWidth(0.8);
      doc.line(margin, 38, pageWidth - margin, 38);
    } else {
      // Modern Minimal
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(sRgb.r, sRgb.g, sRgb.b);
      doc.text(company, margin, 24);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(110, 110, 110);
      doc.text(tagline, margin, 30);

      doc.setDrawColor(pRgb.r, pRgb.g, pRgb.b);
      doc.setLineWidth(1);
      doc.line(margin, 36, margin + 40, 36);
    }

    // Metadata: Date & Ref No
    let currentY = styleMode === 'bold' ? 52 : 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(refNo, margin, currentY);
    doc.text(date, pageWidth - margin, currentY, { align: 'right' });

    // Recipient
    currentY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(sRgb.r, sRgb.g, sRgb.b);
    doc.text(recipientName, margin, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 70, 70);
    if (recipientCompany) {
      currentY += 5.5;
      doc.text(recipientCompany, margin, currentY);
    }
    if (recipientAddress) {
      currentY += 5.5;
      doc.text(recipientAddress, margin, currentY);
    }

    // Subject
    currentY += 12;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
    doc.text(`SUBJECT: ${subject.toUpperCase()}`, margin, currentY);

    // Body text
    currentY += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const splitBody = doc.splitTextToSize(body, contentW);
    doc.text(splitBody, margin, currentY, { lineHeightFactor: 1.45 });

    // Sign off
    currentY += splitBody.length * 5.5 + 14;
    doc.setFont('helvetica', 'normal');
    doc.text(signOff, margin, currentY);

    currentY += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(sRgb.r, sRgb.g, sRgb.b);
    doc.text(signerName, margin, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(signerTitle, margin, currentY);

    // Footer (Modern / Bold layouts)
    if (styleMode !== 'classic') {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`${address}   •   ${phone}   •   ${email}`, margin, pageHeight - 14);
      doc.text(website, pageWidth - margin, pageHeight - 14, { align: 'right' });
    }

    doc.save(`${company.toLowerCase().replace(/[^a-z0-9]/g, '-')}-letterhead.pdf`);
    setToastMessage('✓ Vector Letterhead PDF downloaded!');
  };

  return (
    <ToolLayout
      toolId="letterhead"
      number="07"
      category="Branded Assets"
      title="Brand Letterhead Generator"
      subtitle="Generate official, standardized A4 business correspondence with your Brand Kit assets. Includes live preview, print dialog, and high-fidelity PDF download. 100% free with no login required."
      seoTitle="Free A4 Brand Letterhead Generator & PDF Export | Brand Tools"
      seoDescription="100% free online A4 letterhead generator by Rajan Bhatta. Generate print-ready company letterheads with custom logo, styled headers, and vector PDF download with no login required."
      seoKeywords={[
        'Free Letterhead Generator',
        '100% Free A4 Stationery',
        'Free Company Letterhead Maker',
        'No Login Letterhead Creator',
        'Brand Letterhead Generator',
        'A4 Letterhead PDF',
        'Corporate Letterhead Template',
        'Official Business Stationery',
        'Brand Identity Letterhead',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'email-signature', 'business-card']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Column */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Letterhead Parameters</h3>
          </div>

          <div className={styles.formGroup}>
            <label>Stationery Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              {LETTERHEAD_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStyleMode(st.id)}
                  className={styleMode === st.id ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.45rem 0.2rem', fontSize: '0.72rem', textAlign: 'center' }}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="lh-date">Issue Date</label>
              <input
                id="lh-date"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lh-ref">Reference Code</label>
              <input
                id="lh-ref"
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lh-recip-name">Recipient Name / Title</label>
            <input
              id="lh-recip-name"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="lh-recip-comp">Recipient Company</label>
              <input
                id="lh-recip-comp"
                type="text"
                value={recipientCompany}
                onChange={(e) => setRecipientCompany(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lh-recip-addr">Recipient City / Location</label>
              <input
                id="lh-recip-addr"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lh-subject">Subject Line</label>
            <input
              id="lh-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lh-body">Letter Body</label>
            <textarea
              id="lh-body"
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={styles.textareaInput}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="lh-signer-name">Signer Name</label>
              <input
                id="lh-signer-name"
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lh-signer-title">Signer Title</label>
              <input
                id="lh-signer-title"
                type="text"
                value={signerTitle}
                onChange={(e) => setSignerTitle(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>
        </div>

        {/* Live A4 Preview Column */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Live A4 Sheet Preview</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={handlePrint} className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                🖨️ Print Document
              </button>
              <button type="button" onClick={handleDownloadPDF} className={styles.btnPrimary} style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}>
                Download A4 PDF
              </button>
            </div>
          </div>

          {/* A4 Paper Sheet Preview Container */}
          <div
            style={{
              background: '#FFFFFF',
              color: '#333333',
              borderRadius: '6px',
              padding: '2rem 1.75rem',
              border: '1px solid rgba(40, 40, 43, 0.12)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              minHeight: '560px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: `"${font}", sans-serif`,
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header section */}
            <div>
              {styleMode === 'bold' ? (
                <div
                  style={{
                    background: sColor,
                    margin: '-2rem -1.75rem 1.25rem -1.75rem',
                    padding: '1.25rem 1.75rem',
                    borderBottom: `3px solid ${pColor}`,
                    color: '#FFFFFF',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{company}</div>
                  <div style={{ fontSize: '0.75rem', color: '#CCC', marginTop: '0.15rem' }}>{tagline}</div>
                </div>
              ) : styleMode === 'classic' ? (
                <div style={{ textAlign: 'center', borderBottom: `2px solid ${pColor}`, paddingBottom: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: sColor }}>{company}</div>
                  <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
                    {address} | {phone} | {email} | {website}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EEEEEE', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: sColor }}>{company}</div>
                    <div style={{ fontSize: '0.72rem', color: '#777', marginTop: '0.15rem' }}>{tagline}</div>
                    <div style={{ width: '28px', height: '3px', background: pColor, marginTop: '0.4rem' }} />
                  </div>
                  {logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt={company} style={{ maxHeight: '32px', maxWidth: '100px', objectFit: 'contain' }} />
                  )}
                </div>
              )}

              {/* Metadata */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#777', marginBottom: '1rem', fontWeight: 600 }}>
                <span>{refNo}</span>
                <span>{date}</span>
              </div>

              {/* Recipient */}
              <div style={{ fontSize: '0.82rem', color: '#444', marginBottom: '1rem', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700, color: sColor }}>{recipientName}</div>
                {recipientCompany && <div>{recipientCompany}</div>}
                {recipientAddress && <div>{recipientAddress}</div>}
              </div>

              {/* Subject */}
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: pColor, marginBottom: '0.85rem' }}>
                SUBJECT: {subject.toUpperCase()}
              </div>

              {/* Body */}
              <div style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#333', whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>
                {body}
              </div>

              {/* Sign Off */}
              <div style={{ fontSize: '0.8rem', color: '#333', marginTop: '1.25rem' }}>
                <div>{signOff}</div>
                <div style={{ height: '20px' }} />
                <div style={{ fontWeight: 700, color: sColor }}>{signerName}</div>
                <div style={{ fontSize: '0.72rem', color: '#777' }}>{signerTitle}</div>
              </div>
            </div>

            {/* Footer */}
            {styleMode !== 'classic' && (
              <div
                style={{
                  borderTop: '1px solid #EEEEEE',
                  paddingTop: '0.65rem',
                  fontSize: '0.68rem',
                  color: '#888',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                }}
              >
                <span>{address} • {phone} • {email}</span>
                <span>{website}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default LetterheadPage;
