import React, { useState } from 'react';
import JSZip from 'jszip';
import styles from '@src/styles/brandTools.module.scss';

export async function createAndDownloadZip(files, zipFilename = 'brand-assets.zip') {
  const zip = new JSZip();

  for (const item of files) {
    if (item.folder) {
      const folder = zip.folder(item.folder);
      folder.file(item.name, item.content);
    } else {
      zip.file(item.name, item.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DownloadZip({ files = [], zipFilename = 'brand-assets.zip', label = 'Download All as ZIP' }) {
  const [isZipping, setIsZipping] = useState(false);

  const handleDownload = async () => {
    if (!files || files.length === 0) return;
    try {
      setIsZipping(true);
      await createAndDownloadZip(files, zipFilename);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <button
      type="button"
      className={styles.primaryActionButton}
      onClick={handleDownload}
      disabled={isZipping || files.length === 0}
    >
      {isZipping ? 'Generating ZIP...' : `📦 ${label} (${files.length})`}
    </button>
  );
}

export default DownloadZip;
