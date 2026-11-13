import React, { useState } from 'react';
import ToolLayout from '@src/components/brandTools/ToolLayout';
import { preetiToUnicode, unicodeToPreeti } from '@src/lib/nepali/preeti';
import { TOOLS_BY_ID } from '@src/data/tools';
import styles from '@src/styles/brandTools.module.scss';

const toolInfo = TOOLS_BY_ID['preeti-to-unicode'];

const SAMPLE_PREETI = `g]kfn Ps ;'Gb/ / zflGtk"0f{ b]z xf] . xfdLn] cfˆgf] b]znfO{ dfof ug'{k5{ .`;

function PreetiToUnicodePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('preeti-to-unicode'); // 'preeti-to-unicode' | 'unicode-to-preeti'
  const [copied, setCopied] = useState(false);

  const handleInputChange = (val) => {
    setInputText(val);
    if (mode === 'preeti-to-unicode') {
      setOutputText(preetiToUnicode(val));
    } else {
      setOutputText(unicodeToPreeti(val));
    }
  };

  const handleSwap = () => {
    const nextMode = mode === 'preeti-to-unicode' ? 'unicode-to-preeti' : 'preeti-to-unicode';
    setMode(nextMode);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLoadSample = () => {
    if (mode === 'preeti-to-unicode') {
      setInputText(SAMPLE_PREETI);
      setOutputText(preetiToUnicode(SAMPLE_PREETI));
    } else {
      const sampleUni = 'नेपाल एक सुन्दर र शान्तिपूर्ण देश हो । हामीले आफ्नो देशलाई माया गर्नुपर्छ ।';
      setInputText(sampleUni);
      setOutputText(unicodeToPreeti(sampleUni));
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout
      toolId="preeti-to-unicode"
      number={toolInfo.number}
      category={toolInfo.category}
      title={toolInfo.title}
      subtitle={toolInfo.tagline}
      seoTitle={toolInfo.seoTitle}
      seoDescription={toolInfo.seoDescription}
      schemaType={toolInfo.schemaType}
      howItWorks={[
        { title: 'Paste or Type Preeti Text', desc: 'Paste your legacy Preeti font text into the left editor (or use the sample text).' },
        { title: 'Real-Time Unicode Conversion', desc: 'The engine reorders choti-ikar (ि) matras, places reph (र्), and produces standard Unicode.' },
        { title: 'Copy & Use Everywhere', desc: 'Copy the Unicode text. It works natively in Microsoft Word, Google Docs, Facebook, websites, and mobile.' },
      ]}
      features={[
        '100% In-browser bidirectional converter: Preeti to Unicode & Unicode to Preeti',
        'Accurate choti-ikar (ि) reordering from pre-consonant to post-consonant placement',
        'Correct reph (र्) repositioning and full support for complex conjuncts (क्ष, त्र, ज्ञ, श्र)',
        'Devanagari numerals, punctuation, and purna viram (।) mapping',
        'Swap direction with one click for converting Unicode back into Preeti font',
        'Zero character limits, no registration, and complete privacy',
      ]}
      longDescription={toolInfo.longDescription}
      faqs={toolInfo.faq}
      relatedToolIds={toolInfo.relatedIds}
    >
      <div className={styles.toolWorkspace}>
        {/* Bilingual Header & Direction Indicator */}
        <div className={styles.nepaliBilingualHeader}>
          <div className={styles.nepaliSubtitle} lang="ne">
            {mode === 'preeti-to-unicode' ? 'प्रीति देखि युनिकोड रूपान्तरण' : 'युनिकोड देखि प्रीति रूपान्तरण'}
          </div>
          <div className={styles.converterActionGroup}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleSwap}
            >
              ⇄ Swap Direction ({mode === 'preeti-to-unicode' ? 'Preeti → Unicode' : 'Unicode → Preeti'})
            </button>
            <button
              type="button"
              className={styles.miniBtn}
              onClick={handleLoadSample}
            >
              Load Example Text
            </button>
            <button
              type="button"
              className={styles.miniBtn}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Dual Textareas */}
        <div className={styles.dualEditorGrid}>
          {/* Input Box */}
          <div className={styles.editorCol}>
            <div className={styles.editorColHeader}>
              <span className={styles.editorLabel}>
                {mode === 'preeti-to-unicode' ? 'Preeti Text (Input)' : 'Unicode Nepali (Input)'}
              </span>
              <span className={styles.charCount}>
                {inputText.length} characters
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                mode === 'preeti-to-unicode'
                  ? 'Type or paste Preeti font text here (e.g. g]kfn)...'
                  : 'युनिकोड नेपाली यहाँ टाइप वा पेस्ट गर्नुहोस्...'
              }
              className={styles.nepaliTextArea}
              lang={mode === 'unicode-to-preeti' ? 'ne' : undefined}
              rows={12}
            />
          </div>

          {/* Output Box */}
          <div className={styles.editorCol}>
            <div className={styles.editorColHeader}>
              <span className={styles.editorLabel}>
                {mode === 'preeti-to-unicode' ? 'Unicode Nepali (Standard)' : 'Preeti Text (Legacy)'}
              </span>
              <button
                type="button"
                className={styles.copySmallBtn}
                onClick={handleCopy}
                disabled={!outputText}
              >
                {copied ? '✓ Copied!' : 'Copy Output'}
              </button>
            </div>
            <textarea
              readOnly
              value={outputText}
              placeholder={
                mode === 'preeti-to-unicode'
                  ? 'रूपान्तरित युनिकोड नेपाली यहाँ देखिनेछ...'
                  : 'Converted Preeti text will appear here...'
              }
              className={styles.nepaliTextArea}
              lang={mode === 'preeti-to-unicode' ? 'ne' : undefined}
              rows={12}
            />
          </div>
        </div>

        {/* Help Note */}
        <div className={styles.nepaliHelpCard}>
          <h4>Which font is this? (कुन फन्ट हो यो?)</h4>
          <p>
            If your text looks like English gibberish (for example: <code>g]kfn</code>, <code>gd:t]</code>, or <code>dfof</code>)
            when opened on a phone or computer without the Preeti font installed, it is typed in <strong>Preeti</strong>.
          </p>
          <p>
            Converting to <strong>Unicode</strong> transforms the characters into universal Devanagari (
            <span lang="ne">नेपाल, नमस्ते, माया</span>) that can be read, searched, copied, and printed on any device
            in the world without requiring any font download.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}

export default PreetiToUnicodePage;
