/**
 * Client-side image optimization and compression utility
 * Keeps advisor portraits and logos crisp and high-DPI while drastically reducing
 * base64 memory footprints (from 10MB+ down to ~80KB-200KB) to prevent browser
 * storage quota issues (QuotaExceededError).
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/webp' | 'image/png';
  preserveTransparency?: boolean;
}

/**
 * Loads an image source into an HTMLImageElement safely
 */
export function loadImage(src: string | Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrlToRevoke: string | null = null;

    img.onload = () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
      reject(err);
    };

    if (typeof src === 'string') {
      img.src = src;
    } else {
      objectUrlToRevoke = URL.createObjectURL(src);
      img.src = objectUrlToRevoke;
    }
  });
}

/**
 * Optimizes an image (dataUrl, File, or Blob) to fit within max bounds and compressed quality
 */
export async function optimizeImage(
  source: string | Blob | File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.88,
    preserveTransparency = false,
  } = options;

  try {
    const img = await loadImage(source);
    let { width, height } = img;

    if (!width || !height) {
      width = img.naturalWidth || 800;
      height = img.naturalHeight || 800;
    }

    // Calculate scale factor to maintain aspect ratio
    const scale = Math.min(1, maxWidth / width, maxHeight / height);
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      if (typeof source === 'string') return source;
      return '';
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // If opaque photo, fill white background to avoid dark borders
    if (!preserveTransparency) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Determine target format
    let targetFormat = options.format;
    if (!targetFormat) {
      targetFormat = preserveTransparency ? 'image/webp' : 'image/jpeg';
    }

    // Try target format, with graceful fallback to png if webp not supported
    try {
      const dataUrl = canvas.toDataURL(targetFormat, quality);
      // Verify canvas produced desired format
      if (dataUrl.startsWith(`data:${targetFormat}`)) {
        return dataUrl;
      }
    } catch {}

    // Fallback
    return canvas.toDataURL(preserveTransparency ? 'image/png' : 'image/jpeg', quality);
  } catch (err) {
    console.warn('Image optimization fallback to source:', err);
    if (typeof source === 'string') return source;
    return '';
  }
}

/**
 * Strips huge base64 data URLs from an object for safe localStorage caching,
 * while leaving URL references intact.
 */
export function sanitizeProfileForLocalStorage<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const clone: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.startsWith('data:image/') && value.length > 25000) {
      // Keep only first 200 chars as placeholder or truncate if needed,
      // but better: keep a compact thumbnail or placeholder marker
      // So localStorage doesn't hit QuotaExceededError
      clone[key] = value.substring(0, 100) + '...[cached_in_indexeddb]';
    } else if (value && typeof value === 'object') {
      clone[key] = sanitizeProfileForLocalStorage(value);
    } else {
      clone[key] = value;
    }
  }

  return clone as T;
}
