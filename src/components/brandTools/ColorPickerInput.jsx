import React, { useState } from 'react';
import { isValidHex, normalizeHex } from '@src/lib/colorUtils';
import styles from '@src/styles/brandTools.module.scss';

function ColorPickerInput({ label, value, onChange, id, showCopy = true }) {
  const [copied, setCopied] = useState(false);
  const normalized = normalizeHex(value || '#000000');

  const handleTextChange = (e) => {
    const val = e.target.value;
    onChange(val);
  };

  const handleBlur = () => {
    if (isValidHex(value)) {
      onChange(normalizeHex(value));
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(normalized);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={styles.formGroup}>
      {label && <label htmlFor={id || label}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Color Swatch / Native Picker */}
        <label
          htmlFor={`${id || label}-picker`}
          style={{
            display: 'inline-block',
            width: '38px',
            height: '38px',
            borderRadius: '6px',
            background: normalized,
            border: '1px solid rgba(40, 40, 43, 0.18)',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
          title="Click to choose color"
        >
          <input
            id={`${id || label}-picker`}
            type="color"
            value={normalized.slice(0, 7)}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            style={{
              opacity: 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </label>

        {/* HEX Input */}
        <input
          id={id || label}
          type="text"
          value={value || ''}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className={styles.textInput}
          placeholder="#HEX"
          maxLength={7}
          style={{ fontFamily: 'monospace', textTransform: 'uppercase', flex: 1 }}
        />

        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className={styles.btnSecondary}
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.75rem' }}
            title="Copy HEX code"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ColorPickerInput;
