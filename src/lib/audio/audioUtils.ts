/**
 * audioUtils.ts
 *
 * Audio utilities for client-side Whisper ASR:
 * - Decodes uploaded audio files (MP3, WAV, M4A, OGG, WebM) via Web Audio API.
 * - Resamples multi-channel / arbitrary sample-rate audio to 16kHz mono Float32Array (Whisper standard).
 * - Slices long audio streams into 30-second processing chunks.
 * - Formats SubRip Subtitle (.srt) files with precise millisecond timestamps.
 *
 * 100% in-browser processing.
 */

export interface SubtitleSegment {
  start: number; // in seconds
  end: number;   // in seconds
  text: string;
}

/**
 * Format seconds into SRT timestamp format: HH:MM:SS,mmm
 * Example: 75.342 -> 00:01:15,342
 */
export function formatSrtTimestamp(seconds: number): string {
  const totalMs = Math.max(0, Math.floor(seconds * 1000));
  const ms = totalMs % 1000;
  const totalSec = Math.floor(totalMs / 1000);
  const s = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const m = totalMin % 60;
  const h = Math.floor(totalMin / 60);

  const pad = (n: number, z = 2) => String(n).padStart(z, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
}

/**
 * Generate full SubRip Subtitle (.srt) text content from segments
 */
export function generateSrt(segments: SubtitleSegment[]): string {
  if (!segments || segments.length === 0) return '';

  return segments
    .map((seg, idx) => {
      const startStr = formatSrtTimestamp(seg.start);
      const endStr = formatSrtTimestamp(seg.end);
      return `${idx + 1}\n${startStr} --> ${endStr}\n${seg.text.trim()}\n`;
    })
    .join('\n');
}

/**
 * Chunk a 16kHz Float32Array into segments of specified duration (default 30 seconds)
 */
export function chunkAudio(
  audioData: Float32Array,
  sampleRate = 16000,
  chunkSeconds = 30,
): Float32Array[] {
  const chunkSize = sampleRate * chunkSeconds;
  const chunks: Float32Array[] = [];

  for (let i = 0; i < audioData.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, audioData.length);
    chunks.push(audioData.subarray(i, end));
  }

  return chunks;
}

/**
 * Resample an AudioBuffer to 16kHz mono Float32Array using OfflineAudioContext
 */
export async function resampleTo16kMono(audioBuffer: AudioBuffer): Promise<Float32Array> {
  const targetSampleRate = 16000;

  // If already 16kHz and mono, return channel data directly
  if (audioBuffer.sampleRate === targetSampleRate && audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  const duration = audioBuffer.duration;
  const offlineCtx = new (window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext)(
    1,
    Math.ceil(duration * targetSampleRate),
    targetSampleRate,
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const resampledBuffer = await offlineCtx.startRendering();
  return resampledBuffer.getChannelData(0);
}

/**
 * Decode an audio file (File or Blob) using the browser AudioContext
 */
export async function decodeAudioFile(file: File | Blob): Promise<Float32Array> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtxClass();

  try {
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    return await resampleTo16kMono(decoded);
  } finally {
    if (audioCtx.state !== 'closed') {
      await audioCtx.close();
    }
  }
}
