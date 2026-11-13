import { describe, it, expect } from 'vitest';
import {
  applyGrayscale,
  applyContrast,
  calculateOtsuThreshold,
  applyBinarization,
} from './imagePreprocessing';

describe('imagePreprocessing', () => {
  it('converts RGB pixel colors to luminance grayscale', () => {
    // Pure red: 255, 0, 0, 255 -> 0.299 * 255 = 76.245 -> ~76
    const redPixel = new Uint8ClampedArray([255, 0, 0, 255]);
    applyGrayscale(redPixel);
    expect(Math.round(redPixel[0])).toBe(76);
    expect(redPixel[0]).toBe(redPixel[1]);
    expect(redPixel[1]).toBe(redPixel[2]);

    // Pure white: 255, 255, 255, 255 -> 255
    const whitePixel = new Uint8ClampedArray([255, 255, 255, 255]);
    applyGrayscale(whitePixel);
    expect(whitePixel[0]).toBe(255);
    expect(whitePixel[1]).toBe(255);
    expect(whitePixel[2]).toBe(255);
  });

  it('adjusts contrast properly', () => {
    // Pixel with mid-gray (128) should stay roughly 128
    const midPixel = new Uint8ClampedArray([128, 128, 128, 255]);
    applyContrast(midPixel, 50);
    expect(midPixel[0]).toBe(128);

    // Dark pixel (50) should become darker with increased contrast
    const darkPixel = new Uint8ClampedArray([50, 50, 50, 255]);
    applyContrast(darkPixel, 50);
    expect(darkPixel[0]).toBeLessThan(50);

    // Light pixel (200) should become lighter with increased contrast
    const lightPixel = new Uint8ClampedArray([200, 200, 200, 255]);
    applyContrast(lightPixel, 50);
    expect(lightPixel[0]).toBeGreaterThan(200);
  });

  it('calculates Otsu threshold correctly on bimodal distribution', () => {
    // Create an image with half black (0) and half white (255) pixels
    const data = new Uint8ClampedArray([
      0, 0, 0, 255,
      10, 10, 10, 255,
      20, 20, 20, 255,
      240, 240, 240, 255,
      250, 250, 250, 255,
      255, 255, 255, 255,
    ]);
    const threshold = calculateOtsuThreshold(data);
    // Otsu threshold should cleanly split the cluster between 20 and 240
    expect(threshold).toBeGreaterThanOrEqual(20);
    expect(threshold).toBeLessThan(240);
  });

  it('binarizes pixels into strictly 0 or 255', () => {
    const data = new Uint8ClampedArray([
      30, 30, 30, 255,
      220, 220, 220, 255,
    ]);
    applyBinarization(data, 128);
    // First pixel < 128 -> 0
    expect(data[0]).toBe(0);
    expect(data[1]).toBe(0);
    expect(data[2]).toBe(0);
    // Second pixel >= 128 -> 255
    expect(data[4]).toBe(255);
    expect(data[5]).toBe(255);
    expect(data[6]).toBe(255);
  });
});
