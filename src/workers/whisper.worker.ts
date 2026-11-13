/**
 * whisper.worker.ts
 *
 * Web Worker for running OpenAI Whisper Automatic Speech Recognition (ASR) via Transformers.js.
 * Operates off the main UI thread to prevent UI freezing during model loading and inference.
 *
 * 100% in-browser client-side execution.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure transformers environment
env.allowLocalModels = false;
env.useBrowserCache = true;

// Singleton transcriber instance
class WhisperPipelineManager {
  static instance: unknown = null;
  static currentModelId: string | null = null;

  static async getInstance(
    modelId = 'Xenova/whisper-tiny',
    progressCallback?: (data: unknown) => void,
  ) {
    if (!this.instance || this.currentModelId !== modelId) {
      this.currentModelId = modelId;
      this.instance = await pipeline('automatic-speech-recognition', modelId, {
        progress_callback: progressCallback,
      });
    }
    return this.instance;
  }
}

self.onmessage = async (e: MessageEvent) => {
  const { type, audio, modelId = 'Xenova/whisper-tiny' } = e.data;

  if (type === 'load') {
    try {
      await WhisperPipelineManager.getInstance(modelId, (p: unknown) => {
        self.postMessage({ type: 'load_progress', data: p });
      });
      self.postMessage({ type: 'load_complete', modelId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', error: msg });
    }
  } else if (type === 'transcribe') {
    try {
      self.postMessage({ type: 'transcribe_start' });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcriber: any = await WhisperPipelineManager.getInstance(modelId, (p: unknown) => {
        self.postMessage({ type: 'load_progress', data: p });
      });

      // Transcribe with Nepali language parameter
      const output = await transcriber(audio, {
        language: 'nepali',
        task: 'transcribe',
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      self.postMessage({
        type: 'transcribe_success',
        result: output,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', error: msg });
    }
  }
};
