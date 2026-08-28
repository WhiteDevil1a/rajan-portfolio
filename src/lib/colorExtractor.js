/**
 * Browser-side dominant color palette extractor using HTML5 Canvas.
 * No server uploads, zero external dependencies.
 */
import { colorDistance, rgbToCmyk, rgbToHex, rgbToHsl } from './colorUtils';

export const extractColorsFromImage = (imageSource, maxColors = 8) =>
  new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down for fast local processing
        const maxDim = 150;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        const colorBuckets = [];

        // Sample every 2nd pixel
        for (let i = 0; i < imageData.length; i += 8) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          // Skip transparent or near-transparent pixels
          if (a < 128) continue;

          // Skip pure black and pure white extremes if we want distinct colors, but allow them if dominant
          const currentRgb = { r, g, b };
          let matched = false;

          // Threshold for clustering similar colors
          const threshold = 36;
          for (let j = 0; j < colorBuckets.length; j += 1) {
            const bucket = colorBuckets[j];
            if (colorDistance(bucket.rgb, currentRgb) < threshold) {
              bucket.count += 1;
              bucket.rTotal += r;
              bucket.gTotal += g;
              bucket.bTotal += b;
              matched = true;
              break;
            }
          }

          if (!matched) {
            colorBuckets.push({
              rgb: currentRgb,
              count: 1,
              rTotal: r,
              gTotal: g,
              bTotal: b,
            });
          }
        }

        // Compute average RGB for each bucket
        const processedBuckets = colorBuckets.map((bucket) => {
          const avgR = Math.round(bucket.rTotal / bucket.count);
          const avgG = Math.round(bucket.gTotal / bucket.count);
          const avgB = Math.round(bucket.bTotal / bucket.count);
          const hex = rgbToHex(avgR, avgG, avgB);
          const hsl = rgbToHsl(avgR, avgG, avgB);
          const cmyk = rgbToCmyk(avgR, avgG, avgB);

          // Calculate saturation and lightness vibrancy score
          const saturationBonus = (hsl.s / 100) * 1.5;
          const balancedLightness = 1 - Math.abs(hsl.l - 50) / 50;
          const vibrancy = saturationBonus + balancedLightness;

          return {
            hex,
            rgb: { r: avgR, g: avgG, b: avgB },
            hsl,
            cmyk,
            count: bucket.count,
            vibrancy,
            score: bucket.count * (1 + vibrancy * 0.5),
          };
        });

        // Sort primarily by frequency and vibrancy score
        processedBuckets.sort((a, b) => b.score - a.score);

        // Filter out near-duplicates in final list
        const uniqueColors = [];
        for (let i = 0; i < processedBuckets.length; i += 1) {
          const candidate = processedBuckets[i];
          const isDuplicate = uniqueColors.some(
            (existing) => colorDistance(existing.rgb, candidate.rgb) < 28,
          );
          if (!isDuplicate) {
            uniqueColors.push(candidate);
          }
          if (uniqueColors.length >= maxColors) break;
        }

        resolve(uniqueColors);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for color extraction.'));
      };

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageSource);
      } else {
        reject(new Error('Invalid image source provided.'));
      }
    } catch (err) {
      reject(err);
    }
  });
