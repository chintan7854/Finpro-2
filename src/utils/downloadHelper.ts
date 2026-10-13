/**
 * Universal Fail-Safe File Downloader for FinAdvisor Pro
 * Handles Blobs, Data URLs, and strings with cross-origin & sandboxed iframe protection.
 */

export interface ExportedFileInfo {
  url: string;
  filename: string;
  mimeType: string;
  timestamp: number;
}

let lastExportedFile: ExportedFileInfo | null = null;

export function getLastExportedFile(): ExportedFileInfo | null {
  return lastExportedFile;
}

export function downloadFile(
  data: Blob | string,
  filename: string,
  mimeType: string = 'application/octet-stream'
): boolean {
  try {
    let url: string;
    let isCreatedUrl = false;

    if (typeof data === 'string') {
      if (data.startsWith('data:') || data.startsWith('blob:') || data.startsWith('http')) {
        url = data;
      } else {
        const blob = new Blob([data], { type: mimeType });
        url = URL.createObjectURL(blob);
        isCreatedUrl = true;
      }
    } else if (data instanceof Blob) {
      url = URL.createObjectURL(data);
      isCreatedUrl = true;
    } else {
      console.error('Invalid data supplied to downloadFile');
      return false;
    }

    const cleanFilename = (filename || 'download')
      .replace(/[^a-zA-Z0-9_\-\.\u0900-\u097F\u0A80-\u0AFF]/g, '_')
      .substring(0, 80);

    lastExportedFile = {
      url,
      filename: cleanFilename,
      mimeType,
      timestamp: Date.now(),
    };

    // Notify any listening components in case iframe sandbox blocks automated downloads
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('finadvisor:file-ready', {
          detail: lastExportedFile,
        })
      );
    }

    const link = document.createElement('a');
    link.style.position = 'fixed';
    link.style.top = '-9999px';
    link.style.left = '-9999px';
    link.style.opacity = '0';
    link.setAttribute('download', cleanFilename);
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        // Keep object URL alive for 45 seconds so user can click manual download chip if needed
        if (isCreatedUrl) {
          setTimeout(() => {
            try {
              URL.revokeObjectURL(url);
            } catch {
              // ignore
            }
          }, 45000);
        }
      } catch (cleanupErr) {
        console.warn('Cleanup error in downloadFile:', cleanupErr);
      }
    }, 1000);

    return true;
  } catch (err) {
    console.error('downloadFile failed:', err);
    return false;
  }
}

/**
 * Converts an HTML Canvas to a downloaded PNG image safely
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement | null, filename: string): boolean {
  if (!canvas) {
    console.warn('Canvas is null or undefined');
    return false;
  }

  try {
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, filename, 'image/png');
        } else {
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            downloadFile(dataUrl, filename, 'image/png');
          } catch (dataUrlErr) {
            console.error('Canvas toDataURL failed:', dataUrlErr);
          }
        }
      }, 'image/png');
      return true;
    }

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    return downloadFile(dataUrl, filename, 'image/png');
  } catch (err) {
    console.error('downloadCanvasAsPng failed:', err);
    return false;
  }
}
