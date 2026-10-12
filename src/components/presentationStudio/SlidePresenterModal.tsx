import React, { useState, useEffect, useRef } from 'react';
import { ClientPresentation } from '../../types/presentationStudio';
import { SlideCard } from './SlideCard';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Play,
} from 'lucide-react';

interface SlidePresenterModalProps {
  presentation: ClientPresentation;
  initialSlideIndex?: number;
  onClose: () => void;
}

export const SlidePresenterModal: React.FC<SlidePresenterModalProps> = ({
  presentation,
  initialSlideIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlideIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = presentation.slides.length;
  const currentSlide = presentation.slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Controls Bar */}
      <div className="h-14 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Play className="w-3.5 h-3.5" />
            <span>Presenter Mode</span>
          </div>
          <span className="text-sm font-semibold text-slate-200 truncate max-w-sm sm:max-w-md">
            {presentation.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-slate-400">
            Slide {currentIndex + 1} / {totalSlides}
          </span>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
            title="Exit Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 max-w-6xl w-full mx-auto overflow-y-auto">
        {currentSlide && (
          <div className="w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-800">
            <SlideCard
              slide={currentSlide}
              advisorSnapshot={presentation.advisorSnapshot}
              totalSlides={totalSlides}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation Dock */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between text-white shrink-0">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Slide Indicators Dots / Thumbnails */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-md py-1">
          {presentation.slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-6 bg-emerald-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to Slide ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentIndex === totalSlides - 1}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
