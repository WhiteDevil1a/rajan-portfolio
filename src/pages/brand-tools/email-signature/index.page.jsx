import React, { useEffect, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import Toast from '@src/components/brandTools/Toast';
import useBrandKit from '@src/hooks/useBrandKit';
import styles from '@src/styles/brandTools.module.scss';

const HOW_IT_WORKS = [
  {
    title: 'Sync Identity Credentials',
    desc: 'Company name, verified contact channels, primary brand color, and logos are auto-populated from your Brand Kit.',
  },
  {
    title: 'Select Email Template Structure',
    desc: 'Choose from 4 layout options (Corporate Split, Compact Bar, Modern Badge, Minimal Text) and adjust credentials.',
  },
  {
    title: 'One-Click Client Integration',
    desc: 'Click "Copy Formatted Signature" to copy the rich table directly into Gmail, Apple Mail, Outlook, or Thunderbird settings.',
  },
];

const WHY_USE_IT = [
  {
    title: 'Universal Email Client Fidelity',
    desc: 'Constructed with production-grade inline HTML table layouts to ensure seamless rendering across Outlook (Windows/Mac), Gmail, Apple Mail, and mobile inboxes.',
  },
  {
    title: 'Cohesive Visual Identity',
    desc: 'Reinforces consistent brand typography and signature primary colors across all external organizational email communications.',
  },
  {
    title: 'Zero Plugin or Subscription Fees',
    desc: 'Generates clean, self-contained HTML signatures without tracking pixels, vendor watermarks, or ongoing subscription requirements.',
  },
];

const FAQS = [
  {
    q: 'How do I install this signature into Gmail?',
    a: 'In Gmail, go to Settings (gear icon) > See all settings > General > Signature. Click "+ Create new", then paste with Ctrl+V (or Cmd+V) directly into the signature text box and save.',
  },
  {
    q: 'Why does the generator use HTML tables instead of modern Flexbox/Grid?',
    a: 'Desktop email clients like Microsoft Outlook and Apple Mail use legacy rendering engines that require standard HTML table markups with inline styles for cross-client reliability.',
  },
  {
    q: 'Can I copy the raw HTML source code?',
    a: 'Yes. Click "Copy HTML Source" to copy the raw markup for deployment via company email signatures, CRM templates, or automated mail servers.',
  },
];

const SIGNATURE_STYLES = [
  { id: 'corporate', name: 'Corporate Split' },
  { id: 'compact', name: 'Compact Bar' },
  { id: 'modern', name: 'Modern Badge' },
  { id: 'minimal', name: 'Minimal Text' },
];

function EmailSignaturePage() {
  const { brandKit } = useBrandKit();
  const [sigStyle, setSigStyle] = useState('corporate');
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const [name, setName] = useState('Rajan Bhatta');
  const [title, setTitle] = useState('Brand Designer & Strategist');
  const [company, setCompany] = useState(brandKit?.brandName || 'Rajan Bhatta Design');
  const [phone, setPhone] = useState(brandKit?.phone || '+977 9800000000');
  const [email, setEmail] = useState(brandKit?.email || 'hi@rajanbhatta.com.np');
  const [website, setWebsite] = useState(brandKit?.website || 'https://rajanbhatta.com.np');
  const [address, setAddress] = useState(brandKit?.address || 'Kathmandu, Nepal');
  const [tagline, setTagline] = useState(brandKit?.tagline || 'Crafting meaningful brand identities.');

  useEffect(() => {
    if (brandKit) {
      if (brandKit.brandName) setCompany(brandKit.brandName);
      if (brandKit.phone) setPhone(brandKit.phone);
      if (brandKit.email) setEmail(brandKit.email);
      if (brandKit.website) setWebsite(brandKit.website);
      if (brandKit.address) setAddress(brandKit.address);
      if (brandKit.tagline) setTagline(brandKit.tagline);
    }
  }, [brandKit]);

  const pColor = brandKit?.colors?.primary || '#FF2828';
  const sColor = brandKit?.colors?.secondary || '#28282B';
  const logo = brandKit?.logos?.primary || '';
  const font = brandKit?.fonts?.heading || 'Helvetica, Arial, sans-serif';

  // Build email-client-friendly HTML string
  const getSignatureHtml = () => {
    if (sigStyle === 'compact') {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}, Arial, sans-serif; font-size:13px; line-height:1.4; color:#333333;">
  <tr>
    <td style="padding-bottom:6px;">
      <span style="font-weight:bold; font-size:15px; color:${sColor};">${name}</span>
      <span style="color:${pColor}; font-weight:600;"> — ${title}</span>
    </td>
  </tr>
  <tr>
    <td style="padding-bottom:6px; color:#666666;">
      <strong style="color:${sColor};">${company}</strong> | 📞 <a href="tel:${phone}" style="color:#333; text-decoration:none;">${phone}</a> | ✉️ <a href="mailto:${email}" style="color:#333; text-decoration:none;">${email}</a>
    </td>
  </tr>
  <tr>
    <td style="color:#888888; font-size:11px;">
      🌐 <a href="${website}" style="color:${pColor}; text-decoration:none;">${website}</a> | 📍 ${address}
    </td>
  </tr>
</table>`;
    }

    if (sigStyle === 'minimal') {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}, Arial, sans-serif; font-size:13px; line-height:1.4; color:#333333;">
  <tr>
    <td>
      <div style="font-weight:bold; font-size:16px; color:${sColor}; margin-bottom:2px;">${name}</div>
      <div style="color:${pColor}; font-size:13px; font-weight:600; margin-bottom:8px;">${title} · ${company}</div>
      <div style="color:#555555; font-size:12px; margin-bottom:4px;">
        <a href="tel:${phone}" style="color:#555; text-decoration:none;">${phone}</a> &nbsp;|&nbsp; 
        <a href="mailto:${email}" style="color:#555; text-decoration:none;">${email}</a> &nbsp;|&nbsp; 
        <a href="${website}" style="color:${pColor}; text-decoration:none; font-weight:600;">${website}</a>
      </div>
      <div style="color:#888888; font-size:11px; font-style:italic;">${tagline}</div>
    </td>
  </tr>
</table>`;
    }

    if (sigStyle === 'modern') {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}, Arial, sans-serif; font-size:13px; line-height:1.4; color:#333333; max-width:480px;">
  <tr>
    <td style="border-top:3px solid ${pColor}; padding-top:10px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${
            logo
              ? `<td style="vertical-align:middle; padding-right:14px;"><img src="${logo}" alt="${company}" width="60" style="display:block; border-radius:4px;" /></td>`
              : ''
          }
          <td style="vertical-align:middle;">
            <div style="font-weight:bold; font-size:16px; color:${sColor};">${name}</div>
            <div style="color:${pColor}; font-size:13px; font-weight:600;">${title}</div>
            <div style="color:#777777; font-size:12px;">${company}</div>
          </td>
        </tr>
      </table>
      <div style="margin-top:10px; padding-top:8px; border-top:1px solid #eeeeee; font-size:12px; color:#555555;">
        📞 <a href="tel:${phone}" style="color:#333; text-decoration:none;">${phone}</a> &nbsp;•&nbsp;
        ✉️ <a href="mailto:${email}" style="color:#333; text-decoration:none;">${email}</a> &nbsp;•&nbsp;
        🌐 <a href="${website}" style="color:${pColor}; text-decoration:none;">${website}</a>
      </div>
    </td>
  </tr>
</table>`;
    }

    // Default: Corporate Split
    return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}, Arial, sans-serif; font-size:13px; line-height:1.4; color:#333333;">
  <tr>
    ${
      logo
        ? `<td style="vertical-align:top; padding-right:16px; border-right:2px solid ${pColor};">
      <img src="${logo}" alt="${company}" width="70" style="display:block; max-height:60px; object-fit:contain;" />
    </td>`
        : ''
    }
    <td style="vertical-align:top; ${logo ? 'padding-left:16px;' : ''}">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-weight:bold; font-size:16px; color:${sColor};">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="color:${pColor}; font-size:13px; font-weight:600; padding-bottom:6px;">
            ${title} | ${company}
          </td>
        </tr>
        <tr>
          <td style="color:#555555; font-size:12px; line-height:1.5;">
            📞 <a href="tel:${phone}" style="color:#444; text-decoration:none;">${phone}</a><br />
            ✉️ <a href="mailto:${email}" style="color:#444; text-decoration:none;">${email}</a><br />
            🌐 <a href="${website}" style="color:${pColor}; text-decoration:none; font-weight:600;">${website}</a>
          </td>
        </tr>
        ${
          tagline
            ? `<tr><td style="color:#888888; font-size:11px; padding-top:6px; font-style:italic;">${tagline}</td></tr>`
            : ''
        }
      </table>
    </td>
  </tr>
</table>`;
  };

  const handleCopySignature = async () => {
    const html = getSignatureHtml();
    try {
      if (typeof window !== 'undefined' && window.ClipboardItem && navigator.clipboard) {
        const textBlob = new Blob([name + '\n' + title + '\n' + company + '\n' + email + '\n' + website], {
          type: 'text/plain',
        });
        const htmlBlob = new Blob([html], { type: 'text/html' });
        await navigator.clipboard.write([
          new window.ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob,
          }),
        ]);
        setToastMessage('✓ Formatted email signature copied! Ready to paste into Gmail or Outlook.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(html);
        setToastMessage('✓ Signature HTML copied to clipboard!');
      }
    } catch (err) {
      console.error(err);
      setToastMessage('Error copying formatted signature. Use Copy HTML Source.');
    }
  };

  const handleCopySource = () => {
    const html = getSignatureHtml();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(html);
      setToastMessage('✓ Raw HTML code copied to clipboard!');
    }
  };

  return (
    <ToolLayout
      toolId="email-signature"
      number="06"
      category="Branded Assets"
      title="Brand Email Signature Generator"
      subtitle="Create responsive, email-client-compatible HTML signatures using your verified Brand Kit. Pre-tested for Gmail, Outlook, Apple Mail, and Thunderbird. 100% free with no login required."
      seoTitle="Free HTML Email Signature Generator for Gmail & Outlook | Brand Tools"
      seoDescription="100% free HTML email signature generator by Rajan Bhatta. Generate responsive email signatures for Gmail, Apple Mail, and Outlook with clean inline CSS and no login required."
      seoKeywords={[
        'Free Email Signature Generator',
        '100% Free HTML Signature',
        'Free Gmail Signature Template',
        'No Login Email Signature Maker',
        'HTML Email Signature Generator',
        'Email Signature Creator',
        'Gmail Signature Template',
        'Outlook Email Signature HTML',
        'Corporate Email Signature',
        'Brand Identity Email Signature',
      ]}
      howItWorks={HOW_IT_WORKS}
      whyUseIt={WHY_USE_IT}
      faqs={FAQS}
      relatedToolIds={['brand-kit', 'business-card', 'letterhead']}
    >
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className={styles.workspaceLayout}>
        {/* Controls Column */}
        <div className={styles.controlsPanel}>
          <div className={styles.panelHeader}>
            <h3>Signature Details</h3>
          </div>

          {/* Style Selector */}
          <div className={styles.formGroup}>
            <label>Signature Template</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {SIGNATURE_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSigStyle(st.id)}
                  className={sigStyle === st.id ? styles.btnPrimary : styles.btnSecondary}
                  style={{ padding: '0.45rem', fontSize: '0.75rem', textAlign: 'center' }}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="sig-name">Full Name</label>
              <input
                id="sig-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sig-title">Job Title</label>
              <input
                id="sig-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sig-company">Company</label>
            <input
              id="sig-company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="sig-phone">Phone</label>
              <input
                id="sig-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sig-email">Email</label>
              <input
                id="sig-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="sig-web">Website</label>
              <input
                id="sig-web"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={styles.textInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sig-addr">Location</label>
              <input
                id="sig-addr"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sig-tagline">Brand Tagline</label>
            <input
              id="sig-tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className={styles.textInput}
            />
          </div>
        </div>

        {/* Live Preview Column */}
        <div className={styles.previewPanel}>
          <div className={styles.panelHeader}>
            <h3>Live Signature Preview</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleCopySource} className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}>
                Copy HTML Source
              </button>
              <button type="button" onClick={handleCopySignature} className={styles.btnPrimary} style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}>
                Copy Formatted Signature
              </button>
            </div>
          </div>

          {/* Email Preview Container */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '8px',
              padding: '1.75rem',
              color: '#333333',
              border: '1px solid rgba(40, 40, 43, 0.12)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              marginBottom: '1.25rem',
              minHeight: '160px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              boxSizing: 'border-box',
              overflowX: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: getSignatureHtml() }}
          />

          {/* Raw Code Snippet */}
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
                Generated HTML Table Source
              </span>
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'var(--brandColor)',
                whiteSpace: 'pre-wrap',
                maxHeight: '140px',
                overflowY: 'auto',
                background: 'rgba(40, 40, 43, 0.04)',
                padding: '0.5rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid rgba(40, 40, 43, 0.08)',
              }}
            >
              {getSignatureHtml()}
            </pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

export default EmailSignaturePage;
