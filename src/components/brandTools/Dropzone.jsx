import React from 'react';
import FileDropzone from '@src/components/tools/FileDropzone';

/**
 * Dropzone adapter delegating to the new FileDropzone component.
 * Provides backwards compatibility while elevating every tool to the new design system.
 */
function Dropzone({
  onFilesSelected,
  accept = '*/*',
  multiple = false,
  title = 'Drop your files here',
  subtitle = 'or drop files here · paste with Ctrl+V',
  maxSizeBytes = 50 * 1024 * 1024,
}) {
  return (
    <FileDropzone
      onFilesSelected={(files) => {
        if (!files || files.length === 0) return;
        onFilesSelected(multiple ? files : files[0]);
      }}
      accept={accept}
      multiple={multiple}
      headline={title}
      helperText={subtitle}
      maxSizeBytes={maxSizeBytes}
    />
  );
}

export default Dropzone;
