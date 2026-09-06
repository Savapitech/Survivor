export const MAX_VIDEO_UPLOAD_BYTES = 100 * 1024 * 1024;

export type AllowedVideoFormat = 'mp4' | 'webm' | 'quicktime';

function readAscii(buffer: Buffer, start: number, length: number): string {
  return buffer.subarray(start, start + length).toString('ascii');
}

function isIsoBaseMediaFile(buffer: Buffer): { mp4: boolean; mov: boolean } {
  if (buffer.length < 12) return { mp4: false, mov: false };
  const boxType = readAscii(buffer, 4, 4);
  if (boxType !== 'ftyp') return { mp4: false, mov: false };
  const brand = readAscii(buffer, 8, 4).trim().toLowerCase();
  const movBrands = ['qt', 'qt  '];
  return {
    mov: movBrands.some((b) => brand.startsWith(b)),
    mp4: !movBrands.some((b) => brand.startsWith(b)),
  };
}

function isWebm(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  );
}

export function detectVideoFormat(buffer: Buffer): AllowedVideoFormat | null {
  const iso = isIsoBaseMediaFile(buffer);
  if (iso.mp4) return 'mp4';
  if (iso.mov) return 'quicktime';
  if (isWebm(buffer)) return 'webm';
  return null;
}

export const VIDEO_FORMAT_EXTENSIONS: Record<AllowedVideoFormat, string> = {
  mp4: 'mp4',
  webm: 'webm',
  quicktime: 'mov',
};
