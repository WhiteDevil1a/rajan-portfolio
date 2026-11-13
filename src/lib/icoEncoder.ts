/**
 * icoEncoder.ts
 *
 * Client-side ICO file encoder creating standard multi-resolution ICO containers
 * holding PNG images (16x16, 32x32, 48x48).
 * 100% in-browser, zero dependencies, public domain / MIT compatible.
 */

export interface IcoImageInput {
  size: number;
  pngBlob: Blob;
}

export async function createIcoFile(images: IcoImageInput[]): Promise<Blob> {
  const count = images.length;
  // Header: 6 bytes
  // Directory entries: 16 bytes * count
  const headerSize = 6 + 16 * count;

  const pngBuffers: ArrayBuffer[] = [];
  let totalDataSize = 0;

  for (const img of images) {
    const buf = await img.pngBlob.arrayBuffer();
    pngBuffers.push(buf);
    totalDataSize += buf.byteLength;
  }

  const totalSize = headerSize + totalDataSize;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Type (1 for .ico)
  view.setUint16(4, count, true); // Image count

  let currentOffset = headerSize;

  for (let i = 0; i < count; i += 1) {
    const img = images[i];
    const pngBuf = pngBuffers[i];
    const entryOffset = 6 + i * 16;

    // ICONDIRENTRY
    view.setUint8(entryOffset + 0, img.size >= 256 ? 0 : img.size); // Width
    view.setUint8(entryOffset + 1, img.size >= 256 ? 0 : img.size); // Height
    view.setUint8(entryOffset + 2, 0); // Color count (0 for 32-bit PNG)
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes (1)
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel (32)
    view.setUint32(entryOffset + 8, pngBuf.byteLength, true); // Size of image data
    view.setUint32(entryOffset + 12, currentOffset, true); // Offset of image data

    // Copy PNG bytes into buffer
    new Uint8Array(buffer, currentOffset, pngBuf.byteLength).set(new Uint8Array(pngBuf));
    currentOffset += pngBuf.byteLength;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}
