import { describe, it, expect } from 'vitest';
import { formatSrtTimestamp, generateSrt, chunkAudio } from './audioUtils';

describe('audioUtils', () => {
  describe('formatSrtTimestamp', () => {
    it('formats 0 seconds properly', () => {
      expect(formatSrtTimestamp(0)).toBe('00:00:00,000');
    });

    it('formats seconds with milliseconds', () => {
      expect(formatSrtTimestamp(1.5)).toBe('00:00:01,500');
      expect(formatSrtTimestamp(75.342)).toBe('00:01:15,342');
      expect(formatSrtTimestamp(3661.025)).toBe('01:01:01,025');
    });

    it('handles negative or NaN gracefully', () => {
      expect(formatSrtTimestamp(-5)).toBe('00:00:00,000');
    });
  });

  describe('generateSrt', () => {
    it('generates standard SRT format block for subtitles', () => {
      const segments = [
        { start: 0.5, end: 3.2, text: 'नमस्ते, तपाईंलाई कस्तो छ?' },
        { start: 3.5, end: 6.8, text: 'म एकदम ठीक छु, धन्यवाद।' },
      ];

      const srt = generateSrt(segments);
      expect(srt).toContain('1\n00:00:00,500 --> 00:00:03,200\nनमस्ते, तपाईंलाई कस्तो छ?');
      expect(srt).toContain('2\n00:00:03,500 --> 00:00:06,800\nम एकदम ठीक छु, धन्यवाद।');
    });

    it('returns empty string when given empty segments', () => {
      expect(generateSrt([])).toBe('');
    });
  });

  describe('chunkAudio', () => {
    it('chunks audio array into slices of specified seconds', () => {
      const sampleRate = 16000;
      // 65 seconds of audio = 65 * 16000 = 1,040,000 samples
      const totalSamples = 65 * sampleRate;
      const audioData = new Float32Array(totalSamples);

      // Chunk by 30 seconds
      const chunks = chunkAudio(audioData, sampleRate, 30);
      expect(chunks.length).toBe(3); // 30s, 30s, 5s
      expect(chunks[0].length).toBe(30 * sampleRate);
      expect(chunks[1].length).toBe(30 * sampleRate);
      expect(chunks[2].length).toBe(5 * sampleRate);
    });

    it('returns a single chunk if audio duration is shorter than chunk size', () => {
      const sampleRate = 16000;
      const audioData = new Float32Array(10 * sampleRate); // 10s
      const chunks = chunkAudio(audioData, sampleRate, 30);
      expect(chunks.length).toBe(1);
      expect(chunks[0].length).toBe(10 * sampleRate);
    });
  });
});
