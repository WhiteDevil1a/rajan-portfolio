import React, { useState, useRef, useEffect } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { transliterateWord, transliterateText } from '@src/lib/nepali/transliteration';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['nepali-unicode-typing'];

// Traditional Nepali on-screen keyboard layout keys
const ON_SCREEN_KEYBOARD = [
  ['१', '२', '३', '४', '५', '६', '७', '८', '९', '०', '।'],
  ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
  ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
  ['प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श'],
  ['ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ', 'श्र'],
  ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', '्', 'ं', 'ँ'],
];

function NepaliUnicodeTypingPage() {
  const [content, setContent] = useState('');
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [mode, setMode] = useState('phonetic'); // 'phonetic' | 'keyboard'
  const [fontSize, setFontSize] = useState(18);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef(null);

  // Push to history for undo/redo
  const updateContent = (newText) => {
    setContent(newText);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newText);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(next);
    }
  };

  // Phonetic transliteration on space / enter / punctuation
  const handleKeyDown = (e) => {
    if (mode !== 'phonetic') return;

    if (e.key === ' ' || e.key === 'Enter' || e.key === '.' || e.key === ',') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const caretPos = textarea.selectionStart;
      const textBefore = content.substring(0, caretPos);
      const textAfter = content.substring(caretPos);

      // Find the last typed roman word before caret
      const match = textBefore.match(/([a-zA-Z]+)$/);
      if (match) {
        e.preventDefault();
        const romanWord = match[1];
        const nepaliWord = transliterateWord(romanWord);
        const replacedBefore = textBefore.substring(0, textBefore.length - romanWord.length) + nepaliWord;

        const separator = e.key === 'Enter' ? '\n' : e.key === '.' ? '।' : e.key;
        const newTotal = replacedBefore + separator + textAfter;

        updateContent(newTotal);

        setTimeout(() => {
          const newPos = replacedBefore.length + separator.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
    }
  };

  const handleInsertChar = (ch) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updateContent(content + ch);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = content.substring(0, start) + ch + content.substring(end);
    updateContent(newText);
    setTimeout(() => {
      textarea.setSelectionRange(start + ch.length, start + ch.length);
      textarea.focus();
    }, 0);
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nepali-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Word and character counts
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <ToolLayout
      toolId="nepali-unicode-typing"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Choose Input Mode', desc: 'Select Romanized / Phonetic mode to type in English letters (e.g. "namaste"), or open the on-screen keyboard.' },
        { title: 'Press Space to Convert', desc: 'In phonetic mode, typing a word and pressing Space or Enter instantly transforms it into Devanagari script.' },
        { title: 'Copy or Download .txt', desc: 'Copy formatted Unicode text or download it as a UTF-8 text file ready for Word, websites, and social media.' },
      ]}
      features={[
        'Dual typing modes: Romanized / Phonetic transliteration and Traditional on-screen keyboard',
        'Word and character counter with undo and redo history support',
        'Touch-optimized responsive on-screen keyboard usable on mobile viewports down to 360px',
        'Adjustable editor font size for comfortable drafting',
        'Instant UTF-8 plain text download (.txt)',
        '100% Client-side execution — completely private and secure',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Bilingual Header */}
        <div className={styles.nepaliBilingualHeader}>
          <div className={styles.nepaliSubtitle} lang="ne">
            नेपाली युनिकोड टाइपिङ (रोमनाइज्ड र परम्परागत किबोर्ड)
          </div>

          <div className={styles.converterActionGroup}>
            <div className={styles.scaleButtons}>
              <button
                type="button"
                className={mode === 'phonetic' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => setMode('phonetic')}
              >
                Phonetic (namaste → नमस्ते)
              </button>
              <button
                type="button"
                className={mode === 'keyboard' ? styles.controlBtnActive : styles.controlBtn}
                onClick={() => {
                  setMode('keyboard');
                  setShowKeyboard(true);
                }}
              >
                Traditional Keyboard
              </button>
            </div>
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => setShowKeyboard(!showKeyboard)}
            >
              ⌨️ {showKeyboard ? 'Hide' : 'Show'} On-Screen Keyboard
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.typingToolbar}>
          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo"
            >
              ↶ Undo
            </button>
            <button
              type="button"
              className={styles.toolIconBtn}
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo"
            >
              ↷ Redo
            </button>
          </div>

          <div className={styles.toolbarGroup}>
            <label className={styles.toolbarLabel}>Font Size:</label>
            <input
              type="range"
              min="14"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className={styles.sliderControl}
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'rgba(40,40,43,0.7)' }}>{fontSize}px</span>
          </div>

          <div className={styles.toolbarGroup}>
            <span className={styles.metricsBadge}>
              {wordCount} words · {charCount} chars
            </span>
          </div>

          <div className={styles.toolbarGroup}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleCopy}
              disabled={!content}
            >
              {copied ? '✓ Copied!' : 'Copy Text'}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleDownloadTxt}
              disabled={!content}
            >
              ⬇ Download .txt
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === 'phonetic'
              ? 'Type in Romanized English and press Space (e.g. type "mero nepal" -> मेरो नेपाल)...'
              : 'Type using keyboard or the on-screen keys below...'
          }
          style={{ fontSize: `${fontSize}px` }}
          className={styles.nepaliEditorMain}
          lang="ne"
          rows={14}
        />

        {/* On-screen Keyboard */}
        {showKeyboard && (
          <div className={styles.onScreenKeyboardWrap}>
            <div className={styles.keyboardHeader}>
              <span>Traditional Nepali On-Screen Keyboard</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowKeyboard(false)}
              >
                ✕ Close
              </button>
            </div>
            <div className={styles.keyboardGrid}>
              {ON_SCREEN_KEYBOARD.map((row, rIdx) => (
                <div key={rIdx} className={styles.keyboardRow}>
                  {row.map((char) => (
                    <button
                      key={char}
                      type="button"
                      className={styles.keyBtn}
                      onClick={() => handleInsertChar(char)}
                      lang="ne"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export default NepaliUnicodeTypingPage;
