/**
 * Standard QR Code Generator utility using the 'qrcode' library with Canvas, SVG,
 * custom foreground/background colors, and centered brand logo embedding.
 */
import QRCode from 'qrcode';

/**
 * Renders QR code to an HTML5 Canvas with custom colors, margins, and optional logo.
 */
export const renderQrToCanvas = async (canvas, text, options = {}) => {
  const {
    foreground = '#000000',
    background = '#FFFFFF',
    size = 512,
    margin = 2,
    ecLevel = 'H',
    logo = null,
  } = options;

  if (!canvas) return;

  try {
    await QRCode.toCanvas(canvas, text || 'https://rajanbhatta.com.np', {
      width: size,
      margin,
      errorCorrectionLevel: logo ? 'H' : ecLevel,
      color: {
        dark: foreground,
        light: background,
      },
    });

    // Draw Logo if provided
    if (logo) {
      const ctx = canvas.getContext('2d');
      await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const logoSize = Math.round(size * 0.22);
          const logoX = Math.round((size - logoSize) / 2);
          const logoY = Math.round((size - logoSize) / 2);
          const pad = Math.round(logoSize * 0.08);

          // Logo background badge
          ctx.fillStyle = background;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2, pad * 1.5);
          } else {
            ctx.rect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2);
          }
          ctx.fill();

          ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = logo;
      });
    }
  } catch (err) {
    console.error('QR Canvas generation error:', err);
  }
};

/**
 * Generates SVG string for the QR code.
 */
export const generateQrSvgString = (text, options = {}) => {
  const {
    foreground = '#000000',
    background = '#FFFFFF',
    size = 512,
    margin = 2,
    ecLevel = 'M',
  } = options;

  let svgString = '';
  QRCode.toString(
    text || 'https://rajanbhatta.com.np',
    {
      type: 'svg',
      width: size,
      margin,
      errorCorrectionLevel: ecLevel,
      color: {
        dark: foreground,
        light: background,
      },
    },
    (err, string) => {
      if (!err && string) {
        svgString = string;
      }
    },
  );

  return svgString;
};
