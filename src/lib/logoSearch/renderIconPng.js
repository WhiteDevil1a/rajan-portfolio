/**
 * renderIconPng.js
 * Client-side SVG → PNG conversion using <canvas>.
 * No server required — runs entirely in the browser.
 */

/**
 * svgToPngBlob
 * @param {string} svgString  — raw SVG markup string
 * @param {string} hex        — brand hex (without #), used to fill the icon
 * @param {number} size       — output PNG size in pixels (square), default 512
 * @returns {Promise<Blob>}   — PNG blob suitable for URL.createObjectURL
 */
export function svgToPngBlob(svgString, hex = '000000', size = 512) {
  return new Promise((resolve, reject) => {
    // Inject the brand color into the SVG fill so the PNG matches
    const coloredSvg = svgString.replace(/<svg/, `<svg fill="#${hex}"`);

    const blob = new Blob([coloredSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // White background so the PNG isn't transparent by default
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Center the icon with 10% padding
      const pad = size * 0.1;
      ctx.drawImage(img, pad, pad, size - pad * 2, size - pad * 2);

      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error('canvas.toBlob returned null'));
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into Image element'));
    };
    img.src = url;
  });
}

/**
 * downloadFile — creates a temporary <a> element and triggers download.
 * @param {Blob|string} content — Blob for binary, string for text
 * @param {string} filename
 * @param {string} mimeType
 */
export function downloadFile(content, filename, mimeType) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
