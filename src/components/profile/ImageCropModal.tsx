import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Crop as CropIcon,
  Maximize2,
  RefreshCw,
  Trash2,
  Upload,
  Sparkles,
} from 'lucide-react';

export type AspectRatioType = '1:1' | '4:5' | '3:4' | '16:9' | 'free';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  title: string;
  subtitle?: string;
  isLogo?: boolean;
  onApply: (croppedDataUrl: string) => void;
  onCancel: () => void;
  onReplaceFile?: (file: File) => void;
  onRemove?: () => void;
  onRestoreOriginal?: () => void;
  hasOriginal?: boolean;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  title,
  subtitle,
  isLogo = false,
  onApply,
  onCancel,
  onReplaceFile,
  onRemove,
  onRestoreOriginal,
  hasOriginal = false,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // degrees
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(isLogo ? 'free' : '1:1');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Reset transforms whenever modal opens with a new image
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setAspectRatio(isLogo ? 'free' : '1:1');

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageElementRef.current = img;
        drawCanvas();
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc, isLogo]);

  // Redraw when transforms or aspect ratio change
  useEffect(() => {
    if (imageElementRef.current) {
      drawCanvas();
    }
  }, [zoom, rotation, pan, aspectRatio]);

  const getAspectDimensions = useCallback(
    (containerW: number, containerH: number): { width: number; height: number } => {
      let targetRatio = 1; // width / height
      if (aspectRatio === '1:1') targetRatio = 1;
      else if (aspectRatio === '4:5') targetRatio = 4 / 5;
      else if (aspectRatio === '3:4') targetRatio = 3 / 4;
      else if (aspectRatio === '16:9') targetRatio = 16 / 9;
      else if (aspectRatio === 'free') {
        if (!imageElementRef.current) return { width: containerW * 0.85, height: containerH * 0.85 };
        targetRatio = imageElementRef.current.width / (imageElementRef.current.height || 1);
      }

      let cropW = containerW * 0.85;
      let cropH = cropW / targetRatio;

      if (cropH > containerH * 0.85) {
        cropH = containerH * 0.85;
        cropW = cropH * targetRatio;
      }

      return { width: Math.round(cropW), height: Math.round(cropH) };
    },
    [aspectRatio]
  );

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageElementRef.current;
    if (!canvas || !img || !containerRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const displayW = containerRect.width || 480;
    const displayH = containerRect.height || 360;

    // Use devicePixelRatio for crisp preview rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    canvas.style.width = `${displayW}px`;
    canvas.style.height = `${displayH}px`;

    ctx.scale(dpr, dpr);

    // Clear background
    ctx.clearRect(0, 0, displayW, displayH);

    // Save state before image draw
    ctx.save();

    // Center point
    const centerX = displayW / 2 + pan.x;
    const centerY = displayH / 2 + pan.y;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate base fit scale
    const scaleBase = Math.min(displayW / img.width, displayH / img.height) * 0.8;
    const currentScale = scaleBase * zoom;

    const imgDrawW = img.width * currentScale;
    const imgDrawH = img.height * currentScale;

    ctx.drawImage(img, -imgDrawW / 2, -imgDrawH / 2, imgDrawW, imgDrawH);
    ctx.restore();

    // Draw Crop Guide Overlay
    const { width: cropBoxW, height: cropBoxH } = getAspectDimensions(displayW, displayH);
    const cropBoxX = (displayW - cropBoxW) / 2;
    const cropBoxY = (displayH - cropBoxH) / 2;

    // Darkened outer region
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.beginPath();
    ctx.rect(0, 0, displayW, displayH);
    // Cut out crop box
    ctx.rect(cropBoxX + cropBoxW, cropBoxY, -cropBoxW, cropBoxH);
    ctx.fill();

    // Crop box outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981'; // emerald-500
    ctx.strokeRect(cropBoxX, cropBoxY, cropBoxW, cropBoxH);

    // Rule of thirds grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([4, 4]);

    // Vertical thirds
    ctx.beginPath();
    ctx.moveTo(cropBoxX + cropBoxW / 3, cropBoxY);
    ctx.lineTo(cropBoxX + cropBoxW / 3, cropBoxY + cropBoxH);
    ctx.moveTo(cropBoxX + (2 * cropBoxW) / 3, cropBoxY);
    ctx.lineTo(cropBoxX + (2 * cropBoxW) / 3, cropBoxY + cropBoxH);

    // Horizontal thirds
    ctx.moveTo(cropBoxX, cropBoxY + cropBoxH / 3);
    ctx.lineTo(cropBoxX + cropBoxW, cropBoxY + cropBoxH / 3);
    ctx.moveTo(cropBoxX, cropBoxY + (2 * cropBoxH) / 3);
    ctx.lineTo(cropBoxX + cropBoxW, cropBoxY + (2 * cropBoxH) / 3);
    ctx.stroke();

    ctx.restore();
  }, [pan, rotation, zoom, getAspectDimensions]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Apply high resolution crop
  const handleApplyCrop = () => {
    const img = imageElementRef.current;
    if (!img || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const displayW = containerRect.width || 480;
    const displayH = containerRect.height || 360;

    const { width: cropBoxW, height: cropBoxH } = getAspectDimensions(displayW, displayH);

    // Target crisp output size (e.g. 800px on smallest side)
    const targetScale = Math.max(1, 800 / Math.min(cropBoxW, cropBoxH));
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = Math.round(cropBoxW * targetScale);
    outputCanvas.height = Math.round(cropBoxH * targetScale);

    const outCtx = outputCanvas.getContext('2d');
    if (!outCtx) return;

    // Enable high quality bicubic smoothing
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';

    outCtx.save();
    outCtx.translate(outputCanvas.width / 2, outputCanvas.height / 2);

    // Replay transforms scaled to output
    outCtx.translate(pan.x * targetScale, pan.y * targetScale);
    outCtx.rotate((rotation * Math.PI) / 180);

    const scaleBase = Math.min(displayW / img.width, displayH / img.height) * 0.8;
    const currentScale = scaleBase * zoom * targetScale;

    const outImgW = img.width * currentScale;
    const outImgH = img.height * currentScale;

    outCtx.drawImage(img, -outImgW / 2, -outImgH / 2, outImgW, outImgH);
    outCtx.restore();

    let dataUrl = '';
    try {
      if (isLogo) {
        dataUrl = outputCanvas.toDataURL('image/webp', 0.88);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = outputCanvas.toDataURL('image/png', 0.88);
        }
      } else {
        dataUrl = outputCanvas.toDataURL('image/jpeg', 0.88);
      }
    } catch {
      dataUrl = outputCanvas.toDataURL('image/jpeg', 0.85);
    }
    onApply(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CropIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-72 sm:h-96 bg-slate-950 flex items-center justify-center overflow-hidden cursor-move select-none"
        >
          {/* Transparency checkerboard background */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
          <canvas ref={canvasRef} className="relative z-10" />

          {/* Drag instruction overlay badge */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none px-2.5 py-1 rounded-lg bg-black/60 text-white/90 text-[11px] font-medium backdrop-blur-xs flex items-center space-x-1.5">
            <Maximize2 className="w-3 h-3 text-emerald-400" />
            <span>Drag to reposition image</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200/80 space-y-4">
          {/* Aspect Ratio Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Crop Ratio:</span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: '1:1', label: '1:1 Square (Avatar)' },
                  { id: '4:5', label: '4:5 Portrait (Card)' },
                  { id: '3:4', label: '3:4 Classic' },
                  { id: '16:9', label: '16:9 Banner' },
                  { id: 'free', label: 'Original Ratio' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAspectRatio(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    aspectRatio === preset.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom and Rotation Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Zoom Slider */}
            <div className="flex items-center space-x-2 bg-white p-2.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation and Reset Controls */}
            <div className="flex items-center space-x-2 justify-end">
              <button
                type="button"
                onClick={() => setRotation((r) => (r - 90) % 360)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                title="Rotate 90° Counter-Clockwise"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>-90°</span>
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>+90°</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                  setPan({ x: 0, y: 0 });
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                title="Reset Pan & Zoom"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Secondary Actions (Replace, Restore Original, Remove) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
            <div className="flex flex-wrap items-center gap-2">
              {onReplaceFile && (
                <>
                  <input
                    type="file"
                    ref={replaceInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onReplaceFile(file);
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => replaceInputRef.current?.click()}
                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>
                </>
              )}

              {hasOriginal && onRestoreOriginal && (
                <button
                  type="button"
                  onClick={onRestoreOriginal}
                  className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Original Photo</span>
                </button>
              )}

              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Crop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
