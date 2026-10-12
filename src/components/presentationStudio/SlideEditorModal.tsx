import React, { useState } from 'react';
import { PresentationSlide } from '../../types/presentationStudio';
import { X, Sparkles, Save, Plus, Trash2 } from 'lucide-react';

interface SlideEditorModalProps {
  slide: PresentationSlide;
  onSave: (updatedSlide: PresentationSlide) => void;
  onRegenerateWithAI: (refinementPrompt: string) => Promise<void>;
  onClose: () => void;
}

export const SlideEditorModal: React.FC<SlideEditorModalProps> = ({
  slide,
  onSave,
  onRegenerateWithAI,
  onClose,
}) => {
  const [title, setTitle] = useState(slide.title);
  const [subtitle, setSubtitle] = useState(slide.subtitle);
  const [keyTakeaway, setKeyTakeaway] = useState(slide.keyTakeaway);
  const [badge, setBadge] = useState(slide.badge);
  const [bulletPoints, setBulletPoints] = useState<string[]>([...slide.bulletPoints]);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleAddBullet = () => {
    setBulletPoints([...bulletPoints, '']);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...bulletPoints];
    updated[index] = val;
    setBulletPoints(updated);
  };

  const handleRemoveBullet = (index: number) => {
    setBulletPoints(bulletPoints.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...slide,
      title: title.trim() || slide.title,
      subtitle: subtitle.trim() || slide.subtitle,
      keyTakeaway: keyTakeaway.trim() || slide.keyTakeaway,
      badge: badge.trim() || slide.badge,
      bulletPoints: bulletPoints.filter((b) => b.trim().length > 0),
    });
    onClose();
  };

  const handleTriggerRegeneration = async () => {
    if (!refinementPrompt.trim()) return;
    setIsRegenerating(true);
    try {
      await onRegenerateWithAI(refinementPrompt);
      onClose();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Slide {slide.slideNumber}: {slide.title}
            </h3>
            <p className="text-xs text-slate-500">
              Customize text, bullet points, or regenerate this slide with AI.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm text-slate-800">
          {/* Quick AI Refine Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Slide Refinement</span>
            </div>
            <p className="text-xs text-indigo-800">
              Tell the AI specifically how to enhance this slide (e.g. "Add a comparison of 10% vs 15% SIP step-up" or "Focus on tax advantages under Section 112A").
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="e.g., Focus more on healthcare inflation and compounding math"
                className="flex-1 px-3 py-2 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleTriggerRegeneration}
                disabled={isRegenerating || !refinementPrompt.trim()}
                className="px-3.5 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shrink-0 flex items-center space-x-1"
              >
                {isRegenerating ? 'Generating...' : 'Regenerate'}
              </button>
            </div>
          </div>

          {/* Badge & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slide Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slide Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subtitle / Context
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Key Takeaway */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Executive Key Insight Punchline
            </label>
            <textarea
              rows={2}
              value={keyTakeaway}
              onChange={(e) => setKeyTakeaway(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Bullet Points */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Bullet Points
              </label>
              <button
                type="button"
                onClick={handleAddBullet}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>
            <div className="space-y-2">
              {bulletPoints.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                    placeholder={`Point ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(idx)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
