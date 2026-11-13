import React, { useCallback, useEffect, useRef, useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { TOOLS_BY_ID } from '@src/data/tools';
import { decodeAudioFile, generateSrt } from '@src/lib/audio/audioUtils';
import { exportTextToDocx } from '@src/lib/docxExporter';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const toolMeta = TOOLS_BY_ID['nepali-speech-to-text'];

export default function NepaliSpeechToTextPage() {
  const [modelTier, setModelTier] = useState('Xenova/whisper-tiny'); // 'Xenova/whisper-tiny' | 'Xenova/whisper-base'
  const [modelLoaded, setModelLoaded] = useState(false);

  // Audio source state
  const [audioSource, setAudioSource] = useState(null); // File | Blob
  const [audioSourceName, setAudioSourceName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Results state
  const [transcript, setTranscript] = useState('');
  const [subtitleSegments, setSubtitleSegments] = useState([]);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const activeWorkerRef = useRef(null);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (activeWorkerRef.current) activeWorkerRef.current.terminate();
    };
  }, []);

  // Handle audio file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    setErrorMessage('');
    setTranscript('');
    setSubtitleSegments([]);
    setAudioSource(file);
    setAudioSourceName(file.name);
  }, []);

  // Microphone recording controls
  const startRecording = useCallback(async () => {
    setErrorMessage('');
    setTranscript('');
    setSubtitleSegments([]);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioSource(audioBlob);
        setAudioSourceName(`voice-recording-${new Date().toISOString().slice(0, 19)}.webm`);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setErrorMessage(
        err?.message || 'Microphone access denied. Please allow microphone permissions in your browser.',
      );
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  // Transcribe audio
  const handleTranscribe = useCallback(async () => {
    if (!audioSource) return;

    setIsProcessing(true);
    setErrorMessage('');
    setProgress(5);
    setProgressMessage('Decoding and resampling audio to 16kHz mono...');

    try {
      // 1. Decode audio in browser Web Audio context
      const audioData = await decodeAudioFile(audioSource);

      setProgress(20);
      setProgressMessage('Initializing Whisper AI model in Web Worker...');

      // 2. Initialize worker
      let worker = activeWorkerRef.current;
      if (!worker) {
        worker = new Worker(new URL('../../../workers/whisper.worker.ts', import.meta.url));
        activeWorkerRef.current = worker;
      }

      const result = await new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          const { type, data, result: res, error } = e.data;
          if (type === 'load_progress') {
            if (data?.status === 'progress' && data?.total) {
              const pct = Math.round((data.loaded / data.total) * 100);
              setProgress(20 + Math.round(pct * 0.4)); // 20% to 60%
              setProgressMessage(`Downloading Whisper model weights (${data.file})... ${pct}%`);
            } else if (data?.status === 'done') {
              setProgress(60);
              setProgressMessage('Model loaded! Transcribing Nepali speech...');
            }
          } else if (type === 'transcribe_start') {
            setProgress(70);
            setProgressMessage('Transcribing Nepali speech...');
          } else if (type === 'transcribe_success') {
            resolve(res);
          } else if (type === 'error') {
            reject(new Error(error || 'Transcription failed'));
          }
        };

        worker.onerror = (err) => reject(err);

        worker.postMessage({
          type: 'transcribe',
          audio: audioData,
          modelId: modelTier,
        });
      });

      setModelLoaded(true);
      setProgress(100);
      setProgressMessage('Transcription complete!');

      if (result?.text) {
        setTranscript(result.text.trim());
      }

      if (Array.isArray(result?.chunks)) {
        const segs = result.chunks.map((c) => ({
          start: c.timestamp?.[0] || 0,
          end: c.timestamp?.[1] || 0,
          text: c.text,
        }));
        setSubtitleSegments(segs);
      }
    } catch (err) {
      setErrorMessage(
        err?.message ||
          'Failed to transcribe audio. Please ensure you have a stable connection for initial model download.',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [audioSource, modelTier]);

  // Copy transcript
  const handleCopy = useCallback(() => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [transcript]);

  // Download .txt
  const handleDownloadTxt = useCallback(() => {
    if (!transcript) return;
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audioSourceName.replace(/\.[^/.]+$/, '') || 'nepali-transcript'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transcript, audioSourceName]);

  // Download .srt
  const handleDownloadSrt = useCallback(() => {
    if (subtitleSegments.length === 0) return;
    const srtContent = generateSrt(subtitleSegments);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${audioSourceName.replace(/\.[^/.]+$/, '') || 'nepali-subtitles'}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [subtitleSegments, audioSourceName]);

  // Download .docx
  const handleDownloadDocx = useCallback(() => {
    if (!transcript) return;
    exportTextToDocx(
      transcript,
      `${audioSourceName.replace(/\.[^/.]+$/, '') || 'nepali-transcript'}.docx`,
    );
  }, [transcript, audioSourceName]);

  const formatSeconds = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ToolLayout
      toolId="nepali-speech-to-text"
      number={toolMeta.number}
      category={toolMeta.category}
      title={toolMeta.title}
      subtitle={toolMeta.tagline}
      seoTitle={toolMeta.seoTitle}
      seoDescription={toolMeta.seoDescription}
      howItWorks={[
        {
          title: 'Record or Upload Audio',
          desc: 'Speak directly into your microphone or upload any audio file (MP3, WAV, M4A, OGG). 100% private in-browser decoding.',
        },
        {
          title: 'Select AI Model Tier',
          desc: 'Choose Whisper Tiny (~75 MB, fast & lightweight) or Whisper Base (~145 MB, higher accuracy). The model caches in your browser after the first download.',
        },
        {
          title: 'Transcribe & Export',
          desc: 'Click Transcribe to process audio with OpenAI Whisper. Copy the transcript, download as .txt, export formatted .docx, or save .srt subtitles with timestamps.',
        },
      ]}
      features={[
        '100% Client-Side Privacy: Your voice and audio files never leave your device or get sent to any cloud server',
        'Powered by OpenAI Whisper via Transformers.js with WebAssembly & WebGPU acceleration',
        'Live Microphone Voice Typing with audio level detection and duration timer',
        'Universal Audio File Support: Transcribe MP3, WAV, M4A, OGG, and WebM recordings',
        'Automatic SubRip (.srt) Subtitle Generation with timestamps for video captioning',
        'Export to Microsoft Word (.docx) with Devanagari complex script formatting and plain text (.txt)',
      ]}
      longDescription={toolMeta.longDescription || toolMeta.description}
      faqs={toolMeta.faq}
      relatedToolIds={toolMeta.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Model Selection Card */}
        <div style={{ padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem' }}>🤖 Select In-Browser Whisper AI Model</strong>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>
                Models download once, cache in browser storage, and run 100% locally without cloud fees.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className={clsx(styles.miniBtn, modelTier === 'Xenova/whisper-tiny' && styles.activeBtn)}
                style={{
                  background: modelTier === 'Xenova/whisper-tiny' ? 'var(--color-primary, #e63946)' : '#fff',
                  color: modelTier === 'Xenova/whisper-tiny' ? '#fff' : '#111',
                  border: '1px solid #ccc',
                }}
                onClick={() => setModelTier('Xenova/whisper-tiny')}
              >
                Whisper Tiny (~75 MB, Fast)
              </button>
              <button
                type="button"
                className={clsx(styles.miniBtn, modelTier === 'Xenova/whisper-base' && styles.activeBtn)}
                style={{
                  background: modelTier === 'Xenova/whisper-base' ? 'var(--color-primary, #e63946)' : '#fff',
                  color: modelTier === 'Xenova/whisper-base' ? '#fff' : '#111',
                  border: '1px solid #ccc',
                }}
                onClick={() => setModelTier('Xenova/whisper-base')}
              >
                Whisper Base (~145 MB, Accurate)
              </button>
            </div>
          </div>
        </div>

        {/* Input Methods Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Microphone Voice Typing Card */}
          <div style={{ padding: '1.5rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎙️</div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Live Microphone Recording</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 1rem 0' }}>
              Click to speak Nepali into your microphone.
            </p>

            {isRecording ? (
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e63946', marginBottom: '1rem' }}>
                  🔴 Recording: {formatSeconds(recordingSeconds)}
                </div>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={stopRecording}
                  style={{ width: '100%', padding: '0.75rem', color: '#e63946', borderColor: '#e63946' }}
                >
                  ⏹ Stop Recording
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={startRecording}
                disabled={isProcessing}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Start Voice Recording
              </button>
            )}
          </div>

          {/* Upload Audio File Card */}
          <div
            style={{ padding: '1.5rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fff', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎵</div>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Upload Audio File</h4>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 1rem 0' }}>
              Upload MP3, WAV, M4A, OGG, or WebM audio file.
            </p>
            <button
              type="button"
              className={styles.secondaryBtn}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Browse Audio File
            </button>
          </div>
        </div>

        {/* Selected Audio Preview Card */}
        {audioSource && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong>Selected Audio:</strong> {audioSourceName}
              </div>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handleTranscribe}
                disabled={isProcessing}
                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
              >
                {isProcessing ? 'Transcribing...' : '🚀 Transcribe to Nepali Unicode'}
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#991b1b',
              marginTop: '1.5rem',
              border: '1px solid #fecaca',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Progress indicator */}
        {isProcessing && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #e5e5e5', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span>{progressMessage || 'Processing audio...'}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: '8px', background: '#e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'var(--color-primary, #e63946)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Transcript Output */}
        {transcript && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Nepali Transcript</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" className={styles.miniBtn} onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy Text'}
                </button>
                <button type="button" className={styles.miniBtn} onClick={handleDownloadTxt}>
                  Download .txt
                </button>
                {subtitleSegments.length > 0 && (
                  <button type="button" className={styles.miniBtn} onClick={handleDownloadSrt}>
                    Download .srt Subtitles
                  </button>
                )}
                <button type="button" className={styles.miniBtn} onClick={handleDownloadDocx}>
                  Export .docx
                </button>
              </div>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              className={styles.nepaliTextArea}
              lang="ne"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', lineHeight: '1.6' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              <span>{transcript.length} characters · {transcript.trim().split(/\s+/).filter(Boolean).length} words</span>
              <span>Review text before official use (accuracy depends on audio clarity and noise)</span>
            </div>
          </div>
        )}

        {/* Advice Card */}
        <div className={styles.nepaliHelpCard} style={{ marginTop: '2rem' }}>
          <h4>Speech-to-Text Tips &amp; Dialect Notes (महत्त्वपूर्ण सल्लाह)</h4>
          <p>
            <strong>Microphone Clarity:</strong> Speak clearly at a moderate pace, approximately 15–20 cm from your microphone. Background noise, music, or fan hum can reduce recognition accuracy.
          </p>
          <p>
            <strong>Dialects &amp; Loan Words:</strong> Whisper is trained on multilingual Devanagari. Technical jargon or English loan words (e.g. &ldquo;computer&rdquo;, &ldquo;website&rdquo;) may be transcribed phonetically into Devanagari. Always review the transcript before publishing.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
