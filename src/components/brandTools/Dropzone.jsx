import React, { useRef, useState } from 'react';
import styles from '@src/styles/brandTools.module.scss';
import clsx from 'clsx';

/**
 * Dropzone component for client-side file uploads
 */
function Dropzone({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  title = 'Click or drag & drop files here',
  subtitle = 'Processes 100% locally in your browser. Your files never leave your device.',
  maxSizeBytes = 50 * 1024 * 1024,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setError('');

    const files = Array.from(fileList);
    const validFiles = [];

    for (const file of files) {
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))} MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className={styles.dropzoneContainer}>
      <div
        className={clsx(styles.dropzone, isDragOver && styles.dropzoneActive)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload files"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <div className={styles.dropzoneIcon}>📁</div>
        <div className={styles.dropzoneTitle}>{title}</div>
        <div className={styles.dropzoneSubtitle}>{subtitle}</div>
        <div className={styles.dropzoneBtn}>Browse Files</div>
      </div>
      {error && <div className={styles.dropzoneError}>{error}</div>}
    </div>
  );
}

export default Dropzone;
