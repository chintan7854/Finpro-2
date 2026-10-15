import React, { useState } from 'react';
import { useFinanceNews } from '../../context/FinanceNewsContext';
import { useI18n } from '../../context/I18nContext';
import {
  Sparkles,
  X,
  Search,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface CustomNewsTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated?: () => void;
}

export const CustomNewsTopicModal: React.FC<CustomNewsTopicModalProps> = ({
  isOpen,
  onClose,
  onArticleGenerated,
}) => {
  const { generateArticleForCustomTopic, isGeneratingArticle } = useFinanceNews();
  const { language } = useI18n();

  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const popularTopics = [
    'RBI Draft Circular on Infrastructure Project Finance',
    'SEBI Consultation Paper on Mutual Fund TER Expense Caps',
    'Unified Pension Scheme (UPS) vs National Pension System (NPS)',
    'Gold Import Duty Cut Impact on Jewellery Stocks & Bullion',
    'US Tariffs and Global Supply Chain Impact on Indian IT & Pharma',
    'Real Estate Capital Gains Grandfathering under Finance Act',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a financial topic or keyword.');
      return;
    }
    setError(null);

    const article = await generateArticleForCustomTopic(topic.trim());
    if (article) {
      setTopic('');
      onClose();
      if (onArticleGenerated) {
        onArticleGenerated();
      }
    } else {
      setError('Failed to generate article for this topic. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Custom Financial News & Topic Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Generate in-depth advisor article in your selected language ({language.toUpperCase()})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter Financial Topic, Scheme, or Economic Event:
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. SEBI new index derivative rules or Impact of interest rate cut on home loans..."
                className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                disabled={isGeneratingArticle}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
          </div>

          {/* Verification guardrail disclosure */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fact-Checked & Verification Guarantee:</span>
            </div>
            <p className="leading-relaxed">
              Our engine searches authorized regulatory releases, central bank archives, and verified economic research.
              If active breaking news is unavailable for this keyword, an authentic background explainer & advisory analysis
              will be created without falsely labeling it as breaking news.
            </p>
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Suggested High-Relevance Topics:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {popularTopics.map((pt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(pt)}
                  className="text-left text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isGeneratingArticle}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeneratingArticle || !topic.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isGeneratingArticle ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Researching & Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Detailed Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
