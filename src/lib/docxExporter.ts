/**
 * docxExporter.ts
 *
 * Lightweight client-side helper to export Unicode Devanagari text as a valid Microsoft Word (.docx) file.
 * Generates an OpenXML ZIP package with complex script typography (Mangal font, ne-NP language)
 * that opens cleanly in Microsoft Word, LibreOffice, and Google Docs without repair warnings.
 *
 * 100% in-browser processing via JSZip.
 */

import JSZip from 'jszip';

export async function exportTextToDocx(
  text: string,
  fileName = 'extracted-nepali.docx',
): Promise<void> {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );

  // 2. _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );

  // 3. word/_rels/document.xml.rels
  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`,
  );

  // Escape XML characters
  const escapeXml = (unsafe: string) =>
    unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  // Split text into paragraphs
  const paragraphs = text.split(/\r?\n/);
  const pXml = paragraphs
    .map((p) => {
      const cleanP = escapeXml(p);
      return `<w:p>
  <w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="Mangal" w:hAnsi="Mangal" w:cs="Mangal" w:hint="cs"/>
      <w:sz w:val="24"/>
      <w:szCs w:val="24"/>
      <w:lang w:val="ne-NP" w:bidi="ne-NP"/>
    </w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Mangal" w:hAnsi="Mangal" w:cs="Mangal" w:hint="cs"/>
      <w:sz w:val="24"/>
      <w:szCs w:val="24"/>
      <w:lang w:val="ne-NP" w:bidi="ne-NP"/>
    </w:rPr>
    <w:t xml:space="preserve">${cleanP}</w:t>
  </w:r>
</w:p>`;
    })
    .join('\n');

  // 4. word/document.xml
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
${pXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`,
  );

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
