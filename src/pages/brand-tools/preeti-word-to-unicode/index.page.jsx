import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { TOOLS_BY_ID } from '@src/data/tools';
import { convertDocx } from '@src/lib/nepali/docxConverter';
import { preetiToUnicode } from '@src/lib/nepali/preeti';
import { detectPreetiHeuristic } from '@src/lib/nepali/legacy-fonts';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

const toolMeta = TOOLS_BY_ID['preeti-word-to-unicode'];

export default function PreetiWordToUnicodePage() {
  const [activeTab, setActiveTab] = useState('docx'); // 'docx' | 'text'

  // Options state
  const [targetFont, setTargetFont] = useState('Mangal');
  const [fontSizeDelta, setFontSizeDelta] = useState(0);
  const [digits, setDigits] = useState('nepali');
  const [manualOverrideAll, setManualOverrideAll] = useState(false);

  // File processing state
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Result state
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [plainText, setPlainText] = useState('');
  const [stats, setStats] = useState(null);
  const [heuristicHint, setHeuristicHint] = useState(null);

  // Preview state
  const [originalSampleText, setOriginalSampleText] = useState('');
  const [previewFontFaceLoaded, setPreviewFontFaceLoaded] = useState(false);
  const [customFontName, setCustomFontName] = useState('');
  const [copied, setCopied] = useState(false);

  // Text tab state
  const [rawTextInput, setRawTextInput] = useState('');
  const [convertedTextOutput, setConvertedTextOutput] = useState('');

  const fileInputRef = useRef(null);
  const customFontInputRef = useRef(null);

  // Text tab live converter
  useEffect(() => {
    if (rawTextInput) {
      const u = preetiToUnicode(rawTextInput);
      setConvertedTextOutput(u);
    } else {
      setConvertedTextOutput('');
    }
  }, [rawTextInput]);

  // Handle file drop / selection
  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setErrorMessage('');
    setConvertedBlob(null);
    setPlainText('');
    setStats(null);
    setHeuristicHint(null);

    // Guard against old .doc binary format
    if (selectedFile.name.endsWith('.doc') && !selectedFile.name.endsWith('.docx')) {
      setErrorMessage(
        'The legacy binary .doc format cannot be read directly. Please open your file in Microsoft Word, WPS Office, or LibreOffice, click "File → Save As", and choose "Word Document (.docx)" before uploading.',
      );
      return;
    }

    if (!selectedFile.name.endsWith('.docx')) {
      setErrorMessage('Please select a valid Microsoft Word (.docx) document.');
      return;
    }

    // Guard against files > 50 MB
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50 MB safety limit. Please split the file into smaller sections.');
      return;
    }

    setFile(selectedFile);
  }, []);

  // Run the document conversion
  const handleConvert = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(15);
    setProgressMessage('Reading document package...');
    setErrorMessage('');

    const options = {
      targetFont,
      fontSizeDelta: Number(fontSizeDelta),
      digits,
      manualOverrideAll,
    };

    try {
      const buffer = await file.arrayBuffer();

      // Check if Web Worker can be used
      let result = null;
      if (typeof Worker !== 'undefined') {
        try {
          const worker = new Worker(new URL('../../../workers/docxConverter.worker.ts', import.meta.url));

          result = await new Promise((resolve, reject) => {
            worker.onmessage = (e) => {
              const { type, outputBuffer, plainText: pt, stats: st, progress: pr, message, error } = e.data;
              if (type === 'progress') {
                setProgress(pr);
                setProgressMessage(message);
              } else if (type === 'success') {
                const blob = new Blob([outputBuffer], {
                  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });
                worker.terminate();
                resolve({ docxBlob: blob, plainText: pt, stats: st });
              } else if (type === 'error') {
                worker.terminate();
                reject(new Error(error || 'Worker conversion failed'));
              }
            };
            worker.onerror = (err) => {
              worker.terminate();
              reject(err);
            };
            worker.postMessage({ buffer, options }, [buffer]);
          });
        } catch {
          // Direct fallback if worker initialization fails
          setProgress(50);
          setProgressMessage('Processing XML nodes directly...');
          result = await convertDocx(buffer, options);
        }
      } else {
        // Fallback for non-worker environments
        setProgress(50);
        setProgressMessage('Processing XML nodes directly...');
        result = await convertDocx(buffer, options);
      }

      setProgress(100);
      setProgressMessage('Conversion complete!');

      setConvertedBlob(result.docxBlob);
      setPlainText(result.plainText);
      setStats(result.stats);
      setOriginalSampleText(result.stats.sampleText || '');

      // Check heuristic hint if no legacy fonts were identified
      if (!result.stats.legacyFontFound && !manualOverrideAll) {
        const heuristic = detectPreetiHeuristic(result.stats.sampleText || '');
        if (heuristic.isLikelyPreeti) {
          setHeuristicHint(
            'We noticed your document text looks like Preeti, but the font family name inside Word was not marked as Preeti. Enable "Convert all text regardless of font name" below to convert it.',
          );
        }
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to convert document. Please ensure the file is a valid .docx file.');
    } finally {
      setIsProcessing(false);
    }
  }, [file, targetFont, fontSizeDelta, digits, manualOverrideAll]);

  // Download converted .docx
  const handleDownloadDocx = useCallback(() => {
    if (!convertedBlob || !file) return;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    const baseName = file.name.replace(/\.docx$/i, '');
    a.href = url;
    a.download = `${baseName}-unicode.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [convertedBlob, file]);

  // Download plain text
  const handleDownloadTxt = useCallback(() => {
    if (!plainText || !file) return;
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = file.name.replace(/\.docx$/i, '');
    a.href = url;
    a.download = `${baseName}-unicode.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [plainText, file]);

  // Copy plain text
  const handleCopyText = useCallback(() => {
    if (!plainText) return;
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [plainText]);

  // Local font loader for preview (FontFace API in memory only)
  const handleLocalFontUpload = useCallback(async (e) => {
    const fontFile = e.target.files?.[0];
    if (!fontFile) return;

    try {
      const fontBuffer = await fontFile.arrayBuffer();
      const fontName = 'LocalPreetiPreview';
      const fontFace = new FontFace(fontName, fontBuffer);
      await fontFace.load();
      document.fonts.add(fontFace);
      setCustomFontName(fontName);
      setPreviewFontFaceLoaded(true);
    } catch {
      alert('Unable to load font file. Please provide a valid .ttf or .otf font.');
    }
  }, []);

  return (
    <ToolLayout
      toolId="preeti-word-to-unicode"
      number={toolMeta.number}
      category={toolMeta.category}
      title={toolMeta.title}
      subtitle={toolMeta.description}
      seoTitle={toolMeta.seoTitle}
      seoDescription={toolMeta.seoDescription}
      howItWorks={[
        {
          title: 'Upload your Word Document (.docx)',
          desc: 'Drag and drop your .docx file into the secure dropzone. Processing is 100% in-browser; your document never leaves your device.',
        },
        {
          title: 'Select target Unicode font and options',
          desc: 'Choose your preferred Devanagari font (Mangal, Nirmala UI, Noto Sans Devanagari), adjust font size (+0 to +2 pt), and set digit formatting.',
        },
        {
          title: 'Inspect the Conversion Report',
          desc: 'Review detected legacy fonts, paragraph counts, converted character statistics, and any unmapped glyph warnings.',
        },
        {
          title: 'Side-by-side preview and verification',
          desc: 'Compare original and converted text side-by-side. Optionally load your local Preeti font file for exact legacy rendering in your browser.',
        },
        {
          title: 'Download your converted Word file',
          desc: 'Download the clean <name>-unicode.docx file ready to open in Microsoft Word, Google Docs, LibreOffice, or on mobile without any repair warnings.',
        },
      ]}
      features={[
        '100% Private Client-Side Conversion: No file or text is ever sent across a network or stored on a server.',
        'Full OpenXML Formatting Retention: Preserves tables, bold, italic, colors, font sizes, margins, headers, footers, and footnotes.',
        'Cross-Run Boundary Alignment: Accurately converts words split across multiple formatting runs without corrupting choti-ikar (ि) or reph (र्).',
        'Complex-Script Typography: Generates valid w:rFonts with w:hint="cs", mirrors complex-script size w:szCs, bold w:bCs, and sets w:lang="ne-NP".',
        'Non-Text Preservation: Images, vector drawings, margins, and page setup remain byte-identical.',
        'Font Detection & Safety: Automatically identifies Preeti font names and warns if unsupported fonts (like Kantipur) are detected.',
        'Side-by-Side Preview: Live comparison panel with optional local Preeti font loader for visual verification.',
      ]}
      longDescription={`### Why does my Nepali Word file look like English letters? (किन मेरो नेपाली फाइल अङ्ग्रेजी अक्षर जस्तो देखिन्छ?)

Preeti is a legacy font created decades before Unicode became the global computing standard. Because older operating systems lacked native support for South Asian complex scripts, Preeti operated by mapping Nepali Devanagari glyphs over ordinary standard English ASCII keyboard positions. For example, pressing the English letter **s** was designed to display the shape of **क**, **v** displayed **ख**, and **c** displayed **अ**.

While this allowed documents to be printed on computers where the Preeti font file was manually installed, the underlying document file does not store actual Devanagari letters. Instead, it stores raw English characters. When such a file is opened on a modern smartphone, viewed inside Google Docs, emailed to a colleague, or opened on any device lacking that exact font, the computer displays the raw ASCII text: "sfo{no" instead of "कार्यालय", or "g]kfn" instead of "नेपाल".

### How this Converter Works without Breaking Formatting

Unlike simple web converters that require you to copy-paste unformatted text, this tool operates directly on the **Microsoft Word OpenXML (.docx)** package format using JSZip and standard XML DOM parsers.

1. **Style Tree Resolution:** The converter inspects \`word/styles.xml\` and resolves the complete style hierarchy from document defaults through \`basedOn\` inheritance to character styles.
2. **Contiguous Run Clustering:** In Microsoft Word, words are frequently split across multiple run elements (for instance, when a spell-check boundary occurs or part of a word is italicized). Our engine groups adjacent legacy runs within each paragraph into a unified cluster, resolving complex multi-character conjuncts and inverted matras like choti-ikar (**ि**) before redistributing the Unicode text back onto the original runs.
3. **Complex-Script Attributes:** Devanagari script is classified by Microsoft Word as complex script. The engine mirrors all formatting tags to complex script equivalents (\`w:szCs\`, \`w:bCs\`, \`w:iCs\`) and explicitly flags \`w:hint="cs"\` with Nepali language tag \`w:lang="ne-NP"\`.
4. **Non-Text Integrity:** Tables, vector drawings, embedded images, section settings, and document metadata remain byte-identical, ensuring your converted document opens cleanly in Microsoft Word and LibreOffice without repair dialogs.`}
      faqs={toolMeta.faq}
      relatedToolIds={['preeti-to-unicode', 'nepali-unicode-typing', 'nepali-date-converter']}
    >
      <div className={styles.toolCard} style={{ padding: '2rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(40,40,43,0.1)', paddingBottom: '0.75rem' }}>
          <button
            type="button"
            className={activeTab === 'docx' ? styles.controlBtnActive : styles.controlBtn}
            onClick={() => setActiveTab('docx')}
          >
            📄 Word Document (.docx)
          </button>
          <button
            type="button"
            className={activeTab === 'text' ? styles.controlBtnActive : styles.controlBtn}
            onClick={() => setActiveTab('text')}
          >
            ✏️ Direct Text / .txt
          </button>
        </div>

        {/* Tab 1: Word Document Converter */}
        {activeTab === 'docx' && (
          <div>
            {/* Options Panel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                backgroundColor: 'rgba(40, 40, 43, 0.03)',
                padding: '1.25rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Target Unicode Font
                </label>
                <select
                  className={styles.selectInput}
                  style={{ width: '100%' }}
                  value={targetFont}
                  onChange={(e) => setTargetFont(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="Mangal">Mangal (Recommended for Word)</option>
                  <option value="Nirmala UI">Nirmala UI (Windows 10/11 default)</option>
                  <option value="Noto Sans Devanagari">Noto Sans Devanagari (Google)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: 'rgba(40,40,43,0.6)', marginTop: '0.2rem', display: 'block' }}>
                  Viewing device must support the selected font.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Font Size Adjustment
                </label>
                <select
                  className={styles.selectInput}
                  style={{ width: '100%' }}
                  value={fontSizeDelta}
                  onChange={(e) => setFontSizeDelta(Number(e.target.value))}
                  disabled={isProcessing}
                >
                  <option value={0}>Same size (+0 pt)</option>
                  <option value={1}>Enlarge slightly (+1 pt)</option>
                  <option value={2}>Enlarge clearly (+2 pt)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: 'rgba(40,40,43,0.6)', marginTop: '0.2rem', display: 'block' }}>
                  Compensates for Preeti glyph size differences.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Numeral Conversion
                </label>
                <select
                  className={styles.selectInput}
                  style={{ width: '100%' }}
                  value={digits}
                  onChange={(e) => setDigits(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="nepali">Nepali Numerals (०-९)</option>
                  <option value="ascii">Standard English Digits (0-9)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={manualOverrideAll}
                    onChange={(e) => setManualOverrideAll(e.target.checked)}
                    disabled={isProcessing}
                  />
                  <span>Convert ALL text (Manual override)</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: '#c0392b', marginTop: '0.2rem' }}>
                  Use only if document fonts were stripped or marked as Arial.
                </span>
              </div>
            </div>

            {/* Dropzone */}
            <div
              style={{
                border: '2px dashed rgba(40, 40, 43, 0.2)',
                borderRadius: '8px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: file ? 'rgba(255, 40, 40, 0.02)' : 'transparent',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.files?.[0]) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
              {file ? (
                <div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--brandColor)' }}>{file.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(40,40,43,0.6)', marginTop: '0.25rem' }}>
                    {(file.size / 1024).toFixed(1)} KB · Ready to convert
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(40,40,43,0.5)', marginTop: '0.5rem' }}>
                    Click or drop another file to replace
                  </div>
                </div>
              ) : (
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>Drop your Preeti .docx file here</strong>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(40,40,43,0.6)', marginTop: '0.35rem' }}>
                    or click to browse your computer (up to 50 MB)
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#fde8e8',
                  color: '#9b1c1c',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                }}
              >
                <strong>Notice:</strong> {errorMessage}
              </div>
            )}

            {/* Heuristic Notice */}
            {heuristicHint && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                }}
              >
                <strong>Recommendation:</strong> {heuristicHint}
              </div>
            )}

            {/* Convert Button */}
            {file && !convertedBlob && !isProcessing && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  type="button"
                  className={styles.controlBtnActive}
                  style={{ fontSize: '1rem', padding: '0.75rem 2.5rem', borderRadius: '6px' }}
                  onClick={handleConvert}
                >
                  Convert to Unicode Devanagari (.docx)
                </button>
              </div>
            )}

            {/* Progress Indicator */}
            {isProcessing && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {progressMessage} ({progress}%)
                </div>
                <div
                  style={{
                    height: '8px',
                    width: '100%',
                    backgroundColor: 'rgba(40,40,43,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      backgroundColor: 'var(--brandColor)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Conversion Success & Actions */}
            {convertedBlob && stats && (
              <div style={{ marginTop: '2rem' }}>
                <div
                  style={{
                    backgroundColor: '#def7ec',
                    border: '1px solid #bcf0da',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, color: '#03543f', fontSize: '1.1rem' }}>
                      ✓ Document Successfully Converted
                    </h4>
                    <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#046c4e' }}>
                      Processed {stats.paragraphsProcessed} paragraphs, converted {stats.runsConverted} runs ({stats.charactersConverted} characters).
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={styles.controlBtnActive}
                      style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem' }}
                      onClick={handleDownloadDocx}
                    >
                      ⬇ Download Converted .docx
                    </button>
                    <button
                      type="button"
                      className={styles.controlBtn}
                      style={{ border: '1px solid rgba(40,40,43,0.2)' }}
                      onClick={handleDownloadTxt}
                    >
                      Export .txt
                    </button>
                    <button
                      type="button"
                      className={styles.controlBtn}
                      style={{ border: '1px solid rgba(40,40,43,0.2)' }}
                      onClick={handleCopyText}
                    >
                      {copied ? '✓ Copied' : 'Copy All Text'}
                    </button>
                  </div>
                </div>

                {/* Conversion Report Panel */}
                <details
                  style={{
                    backgroundColor: 'rgba(40, 40, 43, 0.02)',
                    border: '1px solid rgba(40, 40, 43, 0.1)',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                    📊 View Full Conversion Report
                  </summary>

                  <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Detected Fonts in Document:</strong>
                      <ul style={{ margin: '0.5rem 0 0 1.25rem' }}>
                        {Object.entries(stats.fontsDetected).map(([fontName, info]) => (
                          <li key={fontName}>
                            <code>{fontName || '(Default Font)'}</code>: {info.count} characters ({info.converted ? 'Converted' : 'Untouched'})
                          </li>
                        ))}
                      </ul>
                    </div>

                    {stats.unmappedCharacters.length > 0 && (
                      <div style={{ marginTop: '0.75rem', color: '#b91c1c' }}>
                        <strong>Unmapped Characters (preserved as-is):</strong>
                        <ul style={{ margin: '0.5rem 0 0 1.25rem' }}>
                          {stats.unmappedCharacters.slice(0, 10).map((unmapped, idx) => (
                            <li key={idx}>
                              Character &quot;{unmapped.char}&quot; (code {unmapped.codePoint}) in paragraph {unmapped.paragraphIndex + 1}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>

                {/* Side-by-Side Preview Panel */}
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Side-by-Side Preview</h4>
                    <div>
                      <button
                        type="button"
                        className={styles.controlBtn}
                        style={{ fontSize: '0.78rem', border: '1px solid rgba(40,40,43,0.2)' }}
                        onClick={() => customFontInputRef.current?.click()}
                      >
                        {previewFontFaceLoaded ? '✓ Preeti Font Loaded' : 'Load Preeti font for exact preview (.ttf)'}
                      </button>
                      <input
                        ref={customFontInputRef}
                        type="file"
                        accept=".ttf,.otf"
                        style={{ display: 'none' }}
                        onChange={handleLocalFontUpload}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(40,40,43,0.6)', marginBottom: '0.35rem' }}>
                        Original Document Content {previewFontFaceLoaded ? '(Rendered with loaded Preeti font)' : '(Raw ASCII without font)'}
                      </div>
                      <textarea
                        readOnly
                        rows={10}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(40,40,43,0.15)',
                          fontFamily: previewFontFaceLoaded ? customFontName : 'monospace',
                          fontSize: '0.9rem',
                          backgroundColor: '#fafafa',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                        value={originalSampleText || '(No sample extracted)'}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(40,40,43,0.6)', marginBottom: '0.35rem' }}>
                        Converted Unicode Devanagari Output
                      </div>
                      <textarea
                        readOnly
                        rows={10}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(40,40,43,0.15)',
                          fontFamily: 'var(--font-nepali), "Noto Sans Devanagari", Mangal, sans-serif',
                          fontSize: '0.95rem',
                          backgroundColor: '#ffffff',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                        value={plainText.slice(0, 3000)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Direct Text Converter */}
        {activeTab === 'text' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(40,40,43,0.7)' }}>
                Type or paste Preeti text for instant Unicode conversion.
              </span>
              <Link href="/brand-tools/preeti-to-unicode" style={{ fontSize: '0.85rem', color: 'var(--brandColor)', fontWeight: 600 }}>
                Open Dedicated Two-Way Preeti Text Tool →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Input Preeti Text
                </label>
                <textarea
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(40,40,43,0.15)',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Type or paste Preeti text here (e.g. g]kfn)..."
                  value={rawTextInput}
                  onChange={(e) => setRawTextInput(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Converted Unicode Devanagari Output
                </label>
                <textarea
                  readOnly
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(40,40,43,0.15)',
                    fontFamily: 'var(--font-nepali), "Noto Sans Devanagari", Mangal, sans-serif',
                    fontSize: '0.95rem',
                    backgroundColor: '#fafafa',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Unicode output appears here..."
                  value={convertedTextOutput}
                />
              </div>
            </div>

            {convertedTextOutput && (
              <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                <button
                  type="button"
                  className={styles.controlBtnActive}
                  onClick={() => {
                    navigator.clipboard.writeText(convertedTextOutput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy Converted Text'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
