import React, { useCallback, useRef } from 'react';
import styles from '@src/styles/brandTools.module.scss';

function LogoSearchInput({ value, onChange }) {
  const inputRef = useRef(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className={styles.logoSearchBar}>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search brand logos… e.g. Spotify, GitHub, Adobe"
        aria-label="Search brand logos by name"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className={styles.searchClearBtn}
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default LogoSearchInput;
