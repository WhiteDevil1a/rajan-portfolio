/**
 * Professional multi-page Brand Guidelines PDF Generator using jsPDF.
 * Generates an executive, high-fidelity brand book dynamically from user's Brand Kit.
 */
import { jsPDF } from 'jspdf';
import { hexToRgb, rgbToCmyk } from './colorUtils';

export const generateBrandGuidelinesPDF = async (brandKit) => {
  const kit = brandKit || {};
  const {
    brandName = 'Brand',
    tagline = 'Brand Identity & Guidelines',
    website = 'https://example.com',
    email = 'hello@example.com',
    phone = '',
    address = '',
    personality = 'Modern, Bold, Distinctive, Purposeful',
    voiceTone = 'Professional, authoritative, thoughtful, and human',
    wordsToUse = 'Identity, Purpose, Crafted, Distinctive, Strategic',
    wordsToAvoid = 'Cheap, Cluttered, Trend-chasing, Generic',
    logos = {},
    colors = {
      primary: '#FF2828',
      secondary: '#28282B',
      accent: '#F2FFBD',
      accent2: '#F0F4F1',
      accent3: '#8A2BE2',
      accent4: '#3AA0FF',
    },
    fonts = {
      heading: 'Inter',
      body: 'Inter',
    },
  } = kit;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Primary color RGB
  const pRgb = hexToRgb(colors.primary || '#FF2828');
  const sRgb = hexToRgb(colors.secondary || '#28282B');
  const aRgb = hexToRgb(colors.accent || '#F2FFBD');

  const addHeaderFooter = (pageNumber, totalPages = '06') => {
    if (pageNumber === 1) return; // No header/footer on cover
    // Header rule
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, 16, pageWidth - margin, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(brandName.toUpperCase(), margin, 12);
    doc.text('BRAND GUIDELINES & IDENTITY SYSTEM', pageWidth - margin, 12, { align: 'right' });

    // Footer rule
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.text(`© ${new Date().getFullYear()} ${brandName} — All Rights Reserved`, margin, pageHeight - 9);
    doc.text(`PAGE ${String(pageNumber).padStart(2, '0')}`, pageWidth - margin, pageHeight - 9, { align: 'right' });
  };

  /* =========================================================================
     PAGE 1: COVER PAGE
     ========================================================================= */
  // Dark luxury cover background
  doc.setFillColor(sRgb.r, sRgb.g, sRgb.b);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent vertical top strip
  doc.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  doc.rect(0, 0, 8, pageHeight, 'F');

  // Top sub-header
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('OFFICIAL BRAND BOOK & DESIGN SYSTEM', margin + 10, 40);

  // Brand Name Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text(brandName, margin + 10, 60);

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(aRgb.r, aRgb.g, aRgb.b);
  const splitTagline = doc.splitTextToSize(tagline, contentWidth - 20);
  doc.text(splitTagline, margin + 10, 72);

  // Accent line
  doc.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  doc.rect(margin + 10, 85, 40, 2, 'F');

  // If primary logo exists, draw logo preview card on cover
  if (logos.primary) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin + 10, 110, 90, 55, 3, 3, 'F');
      doc.addImage(logos.primary, 'PNG', margin + 20, 118, 70, 38, undefined, 'FAST');
    } catch {
      // Image fallback
    }
  }

  // Cover footer information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(`VERSION 1.0`, margin + 10, pageHeight - 35);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}`, margin + 10, pageHeight - 29);
  doc.text(`CONFIDENTIAL & PROPRIETARY`, margin + 10, pageHeight - 23);

  /* =========================================================================
     PAGE 2: SECTION 01 — INTRODUCTION & BRAND VOICE
     ========================================================================= */
  doc.addPage();
  addHeaderFooter(2);

  // Section Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('01 — BRAND FOUNDATION', margin, 30);

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 43);
  doc.text('Brand Mission & Voice', margin, 40);

  // Overview Card
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(margin, 48, contentWidth, 34, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 43);
  doc.text(brandName, margin + 8, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const descText = `${brandName} is dedicated to building distinct, purposeful brand experiences. This guidelines document establishes the foundational visual standards and communication rules to ensure absolute consistency across all touchpoints.`;
  const splitDesc = doc.splitTextToSize(descText, contentWidth - 16);
  doc.text(splitDesc, margin + 8, 66);

  // Personality Traits
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 43);
  doc.text('Brand Personality', margin, 96);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const splitPersonality = doc.splitTextToSize(personality, contentWidth);
  doc.text(splitPersonality, margin, 104);

  // Voice and Tone
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 43);
  doc.text('Tone of Voice', margin, 122);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  const splitTone = doc.splitTextToSize(voiceTone, contentWidth);
  doc.text(splitTone, margin, 130);

  // Words to Use / Words to Avoid 2-column box
  const boxWidth = (contentWidth - 8) / 2;

  // Use box
  doc.setFillColor(240, 250, 242);
  doc.setDrawColor(180, 230, 190);
  doc.roundedRect(margin, 150, boxWidth, 56, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 120, 50);
  doc.text('✓ Words We Embrace', margin + 6, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 80, 60);
  const splitUse = doc.splitTextToSize(wordsToUse, boxWidth - 12);
  doc.text(splitUse, margin + 6, 168);

  // Avoid box
  doc.setFillColor(255, 245, 245);
  doc.setDrawColor(255, 200, 200);
  doc.roundedRect(margin + boxWidth + 8, 150, boxWidth, 56, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(190, 40, 40);
  doc.text('✗ Words We Avoid', margin + boxWidth + 14, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(90, 50, 50);
  const splitAvoid = doc.splitTextToSize(wordsToAvoid, boxWidth - 12);
  doc.text(splitAvoid, margin + boxWidth + 14, 168);

  /* =========================================================================
     PAGE 3: SECTION 02 — LOGO SYSTEM & USAGE RULES
     ========================================================================= */
  doc.addPage();
  addHeaderFooter(3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('02 — LOGO SYSTEM', margin, 30);

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 43);
  doc.text('Logo Variations & Rules', margin, 40);

  // Primary Light & Dark boxes
  const logoCardW = (contentWidth - 8) / 2;
  const logoCardH = 50;

  // Light Background Box
  doc.setFillColor(245, 247, 246);
  doc.setDrawColor(220, 225, 222);
  doc.roundedRect(margin, 48, logoCardW, logoCardH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('PRIMARY LOGO — LIGHT BACKGROUND', margin + 6, 55);

  if (logos.primary) {
    try {
      doc.addImage(logos.primary, 'PNG', margin + 12, 60, logoCardW - 24, 32, undefined, 'FAST');
    } catch {}
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 43);
    doc.text(brandName, margin + logoCardW / 2, 75, { align: 'center' });
  }

  // Dark Background Box
  doc.setFillColor(sRgb.r, sRgb.g, sRgb.b);
  doc.roundedRect(margin + logoCardW + 8, 48, logoCardW, logoCardH, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text('PRIMARY LOGO — DARK BACKGROUND', margin + logoCardW + 14, 55);

  const darkLogo = logos.darkPrimary || logos.primary;
  if (darkLogo) {
    try {
      doc.addImage(darkLogo, 'PNG', margin + logoCardW + 20, 60, logoCardW - 24, 32, undefined, 'FAST');
    } catch {}
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(brandName, margin + logoCardW + 8 + logoCardW / 2, 75, { align: 'center' });
  }

  // Logo Usage DOs & DON'Ts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 43);
  doc.text('Logo Usage Guidelines', margin, 112);

  // DOs
  doc.setFillColor(245, 250, 246);
  doc.setDrawColor(200, 230, 210);
  doc.roundedRect(margin, 118, logoCardW, 80, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 120, 50);
  doc.text('DO:', margin + 8, 128);

  const dos = [
    '• Maintain adequate clear space around the logo.',
    '• Scale proportionally without distorting proportions.',
    '• Use the approved white logo on dark backgrounds.',
    '• Ensure high contrast against background elements.',
    '• Use high-resolution SVG or vector assets for print.',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 70, 60);
  let doY = 136;
  dos.forEach((item) => {
    const lines = doc.splitTextToSize(item, logoCardW - 16);
    doc.text(lines, margin + 8, doY);
    doY += lines.length * 5 + 3;
  });

  // DON'Ts
  doc.setFillColor(255, 248, 248);
  doc.setDrawColor(255, 210, 210);
  doc.roundedRect(margin + logoCardW + 8, 118, logoCardW, 80, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(190, 40, 40);
  doc.text("DON'T:", margin + logoCardW + 16, 128);

  const donts = [
    '• Do not stretch, squeeze, or skew the logo.',
    '• Do not recolor using unapproved tint/shade colors.',
    '• Do not add drop shadows, outer glows, or bevels.',
    '• Do not place on busy, low-contrast photography.',
    '• Do not rotate or alter the orientation angle.',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 50, 50);
  let dontY = 136;
  donts.forEach((item) => {
    const lines = doc.splitTextToSize(item, logoCardW - 16);
    doc.text(lines, margin + logoCardW + 16, dontY);
    dontY += lines.length * 5 + 3;
  });

  /* =========================================================================
     PAGE 4: SECTION 03 — COLOR PALETTE & PROPORTIONS
     ========================================================================= */
  doc.addPage();
  addHeaderFooter(4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('03 — COLOR PALETTE', margin, 30);

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 43);
  doc.text('Brand Color System', margin, 40);

  // Swatch grid
  const paletteList = [
    { label: 'Primary Brand Color', hex: colors.primary || '#FF2828', usage: 'Primary calls to action, brand highlights, focal points' },
    { label: 'Secondary / Dark Neutral', hex: colors.secondary || '#28282B', usage: 'Primary headings, dark backgrounds, high-contrast UI' },
    { label: 'Brand Accent Color', hex: colors.accent || '#F2FFBD', usage: 'Subtle accents, decorative highlights, badges' },
    { label: 'Light Neutral', hex: colors.accent2 || '#F0F4F1', usage: 'Base backgrounds, clean cards, borders' },
  ];

  let colorY = 50;
  paletteList.forEach((col) => {
    const rgb = hexToRgb(col.hex);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    // Color Swatch Box
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.roundedRect(margin, colorY, 30, 26, 2, 2, 'F');
    doc.setDrawColor(210, 210, 210);
    doc.roundedRect(margin, colorY, 30, 26, 2, 2, 'D');

    // Color Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 43);
    doc.text(col.label, margin + 36, colorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(`HEX: ${col.hex.toUpperCase()}   |   RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}   |   CMYK: ${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`, margin + 36, colorY + 13);
    doc.text(`Usage: ${col.usage}`, margin + 36, colorY + 20);

    colorY += 32;
  });

  // Color Proportion Bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 43);
  doc.text('Color Distribution & Proportion', margin, colorY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text('Recommended distribution rule: 60% Light/Neutral, 30% Dark Neutral, 10% Vibrant Primary Accent.', margin, colorY + 18);

  // Visual Bar
  const barY = colorY + 24;
  const barW = contentWidth;
  const c1Rgb = hexToRgb(colors.accent2 || '#F0F4F1');
  const c2Rgb = hexToRgb(colors.secondary || '#28282B');
  const c3Rgb = hexToRgb(colors.primary || '#FF2828');

  doc.setFillColor(c1Rgb.r, c1Rgb.g, c1Rgb.b);
  doc.rect(margin, barY, barW * 0.6, 12, 'F');

  doc.setFillColor(c2Rgb.r, c2Rgb.g, c2Rgb.b);
  doc.rect(margin + barW * 0.6, barY, barW * 0.3, 12, 'F');

  doc.setFillColor(c3Rgb.r, c3Rgb.g, c3Rgb.b);
  doc.rect(margin + barW * 0.9, barY, barW * 0.1, 12, 'F');

  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, barY, barW, 12, 'D');

  /* =========================================================================
     PAGE 5: SECTION 04 — TYPOGRAPHY SYSTEM
     ========================================================================= */
  doc.addPage();
  addHeaderFooter(5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('04 — TYPOGRAPHY', margin, 30);

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 43);
  doc.text('Typographic Hierarchy', margin, 40);

  // Heading Font Card
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(margin, 48, contentWidth, 54, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('PRIMARY HEADING FONT', margin + 8, 58);

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 43);
  doc.text(fonts.heading || 'Inter', margin + 8, 70);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text('Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz', margin + 8, 80);
  doc.text('0123456789 (!@#$%^&*.,?)', margin + 8, 88);

  // Body Font Card
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(margin, 110, contentWidth, 54, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('BODY & SECONDARY FONT', margin + 8, 120);

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 43);
  doc.text(fonts.body || 'Inter', margin + 8, 132);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text('Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz', margin + 8, 142);
  doc.text('0123456789 (!@#$%^&*.,?)', margin + 8, 150);

  /* =========================================================================
     PAGE 6: SECTION 05 — CONTACT & ASSET REPOSITORY
     ========================================================================= */
  doc.addPage();
  addHeaderFooter(6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(pRgb.r, pRgb.g, pRgb.b);
  doc.text('05 — BRAND ASSETS & CONTACT', margin, 30);

  doc.setFontSize(22);
  doc.setTextColor(40, 40, 43);
  doc.text('Official Contact & Information', margin, 40);

  // Contact Details Card
  doc.setFillColor(245, 247, 246);
  doc.roundedRect(margin, 48, contentWidth, 68, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 43);
  doc.text(brandName, margin + 10, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  let contactY = 70;

  if (website) {
    doc.setFont('helvetica', 'bold');
    doc.text('Website:', margin + 10, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(website, margin + 40, contactY);
    contactY += 8;
  }
  if (email) {
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', margin + 10, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(email, margin + 40, contactY);
    contactY += 8;
  }
  if (phone) {
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', margin + 10, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(phone, margin + 40, contactY);
    contactY += 8;
  }
  if (address) {
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', margin + 10, contactY);
    doc.setFont('helvetica', 'normal');
    doc.text(address, margin + 40, contactY);
    contactY += 8;
  }

  // Final Sign-off Statement
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'For questions regarding asset licensing, press kits, or brand guideline exceptions, contact the brand management team directly.',
    margin,
    135,
    { maxWidth: contentWidth }
  );

  const filename = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-brand-guidelines.pdf`;
  doc.save(filename);
  return true;
};
