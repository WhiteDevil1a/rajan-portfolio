import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './FileDropzone.module.scss';

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  acceptedFormats?: string[];
  multiple?: boolean;
  maxSizeBytes?: number;
  headline?: string;
  selectButtonText?: string;
  helperText?: string;
  isProcessing?: boolean;
  processingProgress?: number;
  processingMessage?: string;
  onTrySample?: () => void;
  sampleButtonText?: string;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  accept = '*/*',
  acceptedFormats = ['PNG', 'JPG', 'WebP', 'SVG'],
  multiple = false,
  maxSizeBytes = 50 * 1024 * 1024,
  headline = 'Drop your files here',
  selectButtonText = 'Select Files',
  helperText = 'or drop files here · paste with Ctrl+V',
  isProcessing = false,
  processingProgress,
  processingMessage = 'Processing files...',
  onTrySample,
  sampleButtonText = 'Try a sample file',
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${Math.round(bytes / (1024 * 1024))} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const validateAndEmit = useCallback(
    (fileList: FileList | File[]) => {
      setErrorMessage(null);
      const incoming = Array.from(fileList);
      if (incoming.length === 0) return;

      const validFiles: File[] = [];

      for (const file of incoming) {
        // Disallow folders (folders often have size 0 or 4096 and missing extension/type)
        if (!file.type && file.size % 4096 === 0 && file.size === 0) {
          setErrorMessage('Folders are not supported. Please select individual files.');
          return;
        }

        // Size validation
        if (file.size > maxSizeBytes) {
          setErrorMessage(
            `"${file.name}" exceeds the maximum allowed file size of ${formatFileSize(maxSizeBytes)}.`
          );
          return;
        }

        // Extension / MIME validation if accept specified
        if (accept && accept !== '*/*') {
          const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
          const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
          const fileMime = file.type.toLowerCase();

          const isMatch = acceptedTypes.some((type) => {
            if (type.startsWith('.')) {
              return type === fileExt;
            }
            if (type.endsWith('/*')) {
              return fileMime.startsWith(type.replace('/*', ''));
            }
            return type === fileMime;
          });

          if (!isMatch) {
            setErrorMessage(
              `"${file.name}" has an unsupported format. Supported formats: ${acceptedFormats.join(', ')}.`
            );
            return;
          }
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [accept, acceptedFormats, maxSizeBytes, multiple, onFilesSelected]
  );

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndEmit(e.dataTransfer.files);
    }
  };

  // File input change handler (reset value after selection so same file can be re-selected)
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndEmit(e.target.files);
      // Reset input value to allow selecting the same file consecutively
      e.target.value = '';
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  // Clipboard paste support (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Don't intercept paste inside inputs or textareas
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        validateAndEmit(e.clipboardData.files);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [validateAndEmit]);

  return (
    <div className={`${styles.dropzoneWrapper} ${className}`}>
      <div
        ref={dropzoneRef}
        className={`${styles.dropzone} ${isDragOver ? styles.dragOver : ''} ${
          isProcessing ? styles.processing : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className={styles.hiddenInput}
          aria-label={headline}
          id="file-dropzone-input"
        />

        {isProcessing ? (
          <div className={styles.processingState} aria-live="polite">
            <div className={styles.spinner} />
            <h3 className={styles.processingTitle}>{processingMessage}</h3>
            {typeof processingProgress === 'number' && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.min(100, Math.max(0, processingProgress))}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.idleState}>
            <div className={styles.iconCircle}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.uploadIcon}
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h3 className={styles.headline}>{headline}</h3>

            {/* Large Primary Action Button */}
            <button
              type="button"
              className={styles.primarySelectBtn}
              onClick={handleSelectClick}
              aria-controls="file-dropzone-input"
            >
              {selectButtonText}
            </button>

            <p className={styles.helperText}>{helperText}</p>

            {/* Badges / Chips */}
            <div className={styles.badgesRow}>
              {acceptedFormats.length > 0 && (
                <div className={styles.formatChips}>
                  {acceptedFormats.map((fmt) => (
                    <span key={fmt} className={styles.formatChip}>
                      {fmt}
                    </span>
                  ))}
                </div>
              )}

              <span className={styles.maxSizeBadge}>Max {formatFileSize(maxSizeBytes)}</span>

              <span className={styles.privacyLockBadge}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Files stay in browser
              </span>
            </div>

            {onTrySample && (
              <button
                type="button"
                className={styles.sampleBtn}
                onClick={onTrySample}
              >
                {sampleButtonText}
              </button>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert" aria-live="polite">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
          <button
            type="button"
            className={styles.dismissErrorBtn}
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
