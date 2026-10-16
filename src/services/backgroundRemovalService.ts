import { removeBackground } from '@imgly/background-removal';
import { optimizeImage } from './imageOptimizer';

export interface BackgroundRemovalProgress {
  phase: 'idle' | 'downloading_model' | 'processing' | 'finishing' | 'fallback' | 'done' | 'error';
  percent: number;
  message: string;
}

export interface BackgroundRemovalResult {
  success: boolean;
  transparentImageUri?: string;
  error?: string;
  engineUsed: 'onnx_local_ai' | 'canvas_local_segmenter';
}

/**
 * Permanently Free, In-Browser Local Background Removal.
 * Runs 100% locally on device via open-source ONNX Runtime WebAssembly/WebGPU.
 * Zero paid APIs, Zero cloud uploads, Zero per-image fees, Zero telemetry.
 */
export async function removeImageBackgroundLocally(
  imageSource: string | Blob | File,
  onProgress?: (p: BackgroundRemovalProgress) => void
): Promise<BackgroundRemovalResult> {
  const updateProgress = (phase: BackgroundRemovalProgress['phase'], percent: number, message: string) => {
    if (onProgress) {
      onProgress({ phase, percent: Math.min(100, Math.max(0, percent)), message });
    }
  };

  try {
    updateProgress('downloading_model', 10, 'Initializing free local AI segmentation engine...');

    const blobResult = await removeBackground(imageSource, {
      progress: (key: string, current: number, total: number) => {
        let percent = 20;
        if (total > 0) {
          percent = Math.round(20 + (current / total) * 70);
        }
        if (key.includes('fetch')) {
          updateProgress('downloading_model', percent, `Downloading local AI model (${percent}%)...`);
        } else {
          updateProgress('processing', percent, 'Isolating portrait & refining edge transparency...');
        }
      },
      output: {
        format: 'image/png',
        quality: 0.9,
      },
    });

    updateProgress('finishing', 95, 'Optimizing transparent portrait...');

    // Convert and optimize to lightweight transparent portrait
    const transparentDataUri = await blobToDataUrl(blobResult);
    const optimized = await optimizeImage(transparentDataUri, {
      maxWidth: 800,
      maxHeight: 800,
      preserveTransparency: true,
      quality: 0.88,
    });

    updateProgress('done', 100, 'Background removed successfully!');
    return {
      success: true,
      transparentImageUri: optimized,
      engineUsed: 'onnx_local_ai',
    };
  } catch (onnxErr: any) {
    console.warn('Local ONNX model error, attempting high-precision local Canvas segmentation fallback:', onnxErr);

    updateProgress('fallback', 50, 'Applying local high-fidelity edge segmentation fallback...');
    try {
      const fallbackDataUri = await performCanvasLocalSegmentation(imageSource);
      const optimized = await optimizeImage(fallbackDataUri, {
        maxWidth: 800,
        maxHeight: 800,
        preserveTransparency: true,
        quality: 0.88,
      });

      updateProgress('done', 100, 'Background isolated successfully via local segmenter!');
      return {
        success: true,
        transparentImageUri: optimized,
        engineUsed: 'canvas_local_segmenter',
      };
    } catch (fallbackErr: any) {
      console.error('All local background removal options encountered an error:', fallbackErr);
      updateProgress('error', 0, 'Could not remove background locally. Please check your image format.');
      return {
        success: false,
        error: onnxErr?.message || 'Local background removal failed on this device.',
        engineUsed: 'onnx_local_ai',
      };
    }
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function loadImageElement(src: string | Blob | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;

    if (typeof src === 'string') {
      img.src = src;
    } else {
      img.src = URL.createObjectURL(src);
    }
  });
}

/**
 * Intelligent local canvas segmentation fallback
 * Analyzes the corners/perimeter of the portrait image and creates smooth alpha transparency
 */
async function performCanvasLocalSegmentation(imageSource: string | Blob | File): Promise<string> {
  const img = await loadImageElement(imageSource);
  const maxDim = 800;
  let targetW = img.naturalWidth || img.width || 800;
  let targetH = img.naturalHeight || img.height || 800;
  if (targetW > maxDim || targetH > maxDim) {
    const scale = Math.min(maxDim / targetW, maxDim / targetH);
    targetW = Math.max(1, Math.round(targetW * scale));
    targetH = Math.max(1, Math.round(targetH * scale));
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0, targetW, targetH);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Sample corner background colors (top-left, top-right, bottom-left, bottom-right)
  const samplePoints = [
    { x: 5, y: 5 },
    { x: canvas.width - 5, y: 5 },
    { x: Math.floor(canvas.width / 2), y: 5 },
    { x: 5, y: Math.floor(canvas.height / 2) },
    { x: canvas.width - 5, y: Math.floor(canvas.height / 2) },
  ];

  const bgColors: { r: number; g: number; b: number }[] = [];
  for (const pt of samplePoints) {
    const idx = (pt.y * canvas.width + pt.x) * 4;
    bgColors.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
  }

  // Calculate average background color
  const avgBg = bgColors.reduce(
    (acc, c) => ({ r: acc.r + c.r / bgColors.length, g: acc.g + c.g / bgColors.length, b: acc.b + c.b / bgColors.length }),
    { r: 0, g: 0, b: 0 }
  );

  const colorTolerance = 45;
  const featherBand = 25;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Euclidean color distance from background
    const dist = Math.sqrt(
      Math.pow(r - avgBg.r, 2) + Math.pow(g - avgBg.g, 2) + Math.pow(b - avgBg.b, 2)
    );

    if (dist < colorTolerance) {
      data[i + 3] = 0; // Completely transparent
    } else if (dist < colorTolerance + featherBand) {
      const alphaFraction = (dist - colorTolerance) / featherBand;
      data[i + 3] = Math.round(data[i + 3] * alphaFraction);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
