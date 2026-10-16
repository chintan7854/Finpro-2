import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Eye,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import {
  removeImageBackgroundLocally,
  BackgroundRemovalProgress,
} from '../../services/backgroundRemovalService';

interface BackgroundRemovalModalProps {
  isOpen: boolean;
  originalPhoto: string;
  currentMode: 'with_bg' | 'without_bg';
  savedTransparentPhoto?: string;
  onApply: (mode: 'with_bg' | 'without_bg', transparentPhotoUri?: string) => void;
  onCancel: () => void;
}

export const BackgroundRemovalModal: React.FC<BackgroundRemovalModalProps> = ({
  isOpen,
  originalPhoto,
  currentMode,
  savedTransparentPhoto,
  onApply,
  onCancel,
}) => {
  const [selectedMode, setSelectedMode] = useState<'with_bg' | 'without_bg'>(currentMode);
  const [transparentResult, setTransparentResult] = useState<string | undefined>(
    savedTransparentPhoto
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<BackgroundRemovalProgress>({
    phase: 'idle',
    percent: 0,
    message: '',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRemoval = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    const result = await removeImageBackgroundLocally(originalPhoto, (p) => {
      setProgress(p);
    });

    setIsProcessing(false);

    if (result.success && result.transparentImageUri) {
      setTransparentResult(result.transparentImageUri);
      setSelectedMode('without_bg');
    } else {
      setErrorMsg(result.error || 'Failed to remove background locally.');
    }
  };

  const handleSaveAndApply = () => {
    onApply(selectedMode, transparentResult);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Photo Background Settings
              </h3>
              <p className="text-xs text-slate-500">
                Choose between original background or 100% free local transparent portrait
              </p>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Permanently Free Privacy Guarantee Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">100% Free In-Browser AI — Zero Paid APIs</span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Background removal runs entirely locally on your device via open-source ONNX WebAssembly.
                Your photo is never sent to external paid clouds or third-party servers.
              </p>
            </div>
          </div>

          {/* Mode Selector Cards (OPTION A vs OPTION B) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OPTION A: With Background */}
            <div
              onClick={() => setSelectedMode('with_bg')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedMode === 'with_bg'
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Option A
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      Original
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedMode === 'with_bg' ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {selectedMode === 'with_bg' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">With Background</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Retains your natural uploaded photo background. Ideal for office or studio portraits.
                  </p>
                </div>

                {/* Preview Thumbnail */}
                <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img
                    src={originalPhoto}
                    alt="Original With Background"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 mt-3 text-[11px] text-slate-500 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero AI processing required</span>
              </div>
            </div>

            {/* OPTION B: Without Background */}
            <div
              onClick={() => {
                if (transparentResult) {
                  setSelectedMode('without_bg');
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                selectedMode === 'without_bg'
                  ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm cursor-pointer'
                  : transparentResult
                  ? 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Option B
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Transparent</span>
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedMode === 'without_bg'
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300'
                    }`}
                  >
                    {selectedMode === 'without_bg' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">Without Background</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Isolates your face & shoulders into a transparent PNG for seamless poster embedding.
                  </p>
                </div>

                {/* Preview or Action box */}
                <div
                  className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  }}
                >
                  {transparentResult ? (
                    <img
                      src={transparentResult}
                      alt="Transparent Portrait"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <Cpu className="w-6 h-6 text-indigo-600 mx-auto" />
                      <p className="text-xs font-medium text-slate-600">
                        Transparent cutout not generated yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button inside Card */}
              <div className="pt-3 border-t border-slate-200/60 mt-3">
                {!transparentResult ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleStartRemoval}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Free Cutout</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleStartRemoval}
                    className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-process Cutout</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-900">
                <span className="flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>{progress.message || 'Processing image locally in browser...'}</span>
                </span>
                <span>{progress.percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-indigo-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-indigo-700">
                First run may take a few seconds while the browser caches the lightweight model locally.
              </p>
            </div>
          )}

          {/* Error message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply {selectedMode === 'without_bg' ? 'Without Background' : 'With Background'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
