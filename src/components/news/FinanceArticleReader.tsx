import React, { useState } from 'react';
import { FinanceNewsArticle } from '../../types/news';
import { useFinanceNews } from '../../context/FinanceNewsContext';
import { useI18n } from '../../context/I18nContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Copy,
  Edit3,
  RefreshCw,
  Trash2,
  Check,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Save,
  X,
  TrendingUp,
  Landmark,
  Building2,
  Percent,
  PiggyBank,
  Wallet,
  Coins,
  ShieldAlert,
  HelpCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface FinanceArticleReaderProps {
  article: FinanceNewsArticle;
  onBack: () => void;
}

export const FinanceArticleReader: React.FC<FinanceArticleReaderProps> = ({ article, onBack }) => {
  const {
    saveCurrentArticle,
    deleteSavedArticle,
    updateSavedArticle,
    savedArticles,
    generateArticleForNews,
    generateArticleForCustomTopic,
    newsList,
    isGeneratingArticle,
  } = useFinanceNews();

  const { language, t } = useI18n();
  const { profile } = useAdvisor();

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Editable fields state
  const [editHeadline, setEditHeadline] = useState(article.headline);
  const [editVerifiedDetails, setEditVerifiedDetails] = useState(article.verifiedDetails);
  const [editBackground, setEditBackground] = useState(article.backgroundContext);
  const [editWhyItMatters, setEditWhyItMatters] = useState(article.whyItMatters);
  const [editAdvisorOpinion, setEditAdvisorOpinion] = useState(article.advisorOpinion);
  const [editConclusion, setEditConclusion] = useState(article.conclusion);

  const isSaved = savedArticles.some((a) => a.id === article.id);

  const handleCopyText = async () => {
    const fullText = `*${article.headline}*

${article.verifiedDetails}

*Why This Matters to You:*
${article.whyItMatters}

*Financial Impacts:*
• Household Expenses: ${article.financialImpacts.householdExpenses || 'N/A'}
• Inflation: ${article.financialImpacts.inflation || 'N/A'}
• Bank FDs & Savings: ${article.financialImpacts.savingsAndFd || 'N/A'}
• Home Loans & EMIs: ${article.financialImpacts.loansAndEmi || 'N/A'}
• Mutual Funds & SIP: ${article.financialImpacts.sipAndMutualFunds || 'N/A'}
• Gold & Commodities: ${article.financialImpacts.goldAndCommodities || 'N/A'}

*Financial Advisor's Perspective:*
${article.advisorOpinion}

*Actionable Takeaways:*
${article.practicalConsiderations.map((c) => `✓ ${c}`).join('\n')}

*Common Mistakes to Avoid:*
${article.mistakesToAvoid.map((m) => `⚠️ ${m}`).join('\n')}

*Summary & Advice:*
${article.conclusion}

---
*Prepared By:* ${profile.advisorName || article.advisorCredit.name}
${profile.designation || article.advisorCredit.designation}
${profile.professionalDetails || article.advisorCredit.credentials || 'Certified Financial Advisor'}
Contact: ${profile.phoneNumber || article.advisorCredit.contact}
Disclaimer: For educational purposes only. Not personalized financial advice.`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      console.warn('Clipboard write failed');
    }
  };

  const handleShareWhatsApp = () => {
    const shortText = encodeURIComponent(
      `*Finance Insights: ${article.headline}*\n\n${article.whyItMatters.slice(0, 240)}...\n\n*Advisor Opinion:*\n${article.advisorOpinion.slice(0, 180)}...\n\n_For personalized financial planning, contact ${profile.advisorName} (${profile.phoneNumber})_`
    );
    window.open(`https://api.whatsapp.com/send?text=${shortText}`, '_blank');
  };

  const handleSaveEdits = () => {
    const updated: FinanceNewsArticle = {
      ...article,
      headline: editHeadline,
      verifiedDetails: editVerifiedDetails,
      backgroundContext: editBackground,
      whyItMatters: editWhyItMatters,
      advisorOpinion: editAdvisorOpinion,
      conclusion: editConclusion,
      updatedAt: new Date().toISOString(),
      isEdited: true,
      version: (article.version || 1) + 1,
    };
    updateSavedArticle(updated);
    setIsEditing(false);
  };

  const handleConfirmRegenerate = async () => {
    setShowRegenConfirm(false);
    if (article.isCustomTopic && article.customTopicTitle) {
      await generateArticleForCustomTopic(article.customTopicTitle);
    } else if (article.newsId) {
      const newsItem = newsList.find((n) => n.id === article.newsId);
      if (newsItem) {
        await generateArticleForNews(newsItem);
      }
    }
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteSavedArticle(article.id);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save / Saved Button */}
          <button
            type="button"
            onClick={() => saveCurrentArticle(article)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isSaved
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Saved in Library' : 'Save Article'}</span>
          </button>

          {/* Edit Button */}
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Edit</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveEdits}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={() => {
              if (article.isEdited) {
                setShowRegenConfirm(true);
              } else {
                handleConfirmRegenerate();
              }
            }}
            disabled={isGeneratingArticle}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors disabled:opacity-50"
            title="Regenerate with fresh AI analysis"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isGeneratingArticle ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            title="Copy full article text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Share WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Delete Button (if saved) */}
          {isSaved && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete saved article"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Regeneration Confirmation Modal */}
      {showRegenConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Regenerate Article?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This article has manual edits. Regenerating will generate fresh analysis in your selected language and will replace unsaved manual edits. Are you sure?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRegenConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRegenerate}
                className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
              >
                Yes, Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Delete Saved Article?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This will permanently delete this saved article from your local library. You can always regenerate it anytime from the news list.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep Article
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Article Document Container */}
      <article className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 space-y-8">
        {/* Article Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                article.category === 'national'
                  ? 'bg-amber-100 text-amber-800'
                  : article.category === 'international'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {article.category === 'national'
                ? 'National Finance'
                : article.category === 'international'
                ? 'International Finance'
                : 'Custom Topic Research'}
            </span>

            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">
              Language: <strong className="text-slate-700 uppercase">{article.contentLanguage}</strong>
            </span>

            {article.isEdited && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                v{article.version} Edited
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600 font-medium">Verified by Financial Research Desk</span>
          </div>
        </div>

        {/* Headline */}
        <div>
          {isEditing ? (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Article Headline</label>
              <input
                type="text"
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                className="w-full p-3 text-lg font-bold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.headline}
            </h1>
          )}
        </div>

        {/* Section 1: Verified Details & Background Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Facts & Official Data</span>
            </div>
            {isEditing ? (
              <textarea
                value={editVerifiedDetails}
                onChange={(e) => setEditVerifiedDetails(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {article.verifiedDetails}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Background & Simple-Language Context</span>
            </div>
            {isEditing ? (
              <textarea
                value={editBackground}
                onChange={(e) => setEditBackground(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {article.backgroundContext}
              </p>
            )}
          </div>
        </div>

        {/* Section 2: Why This News Matters */}
        <div className="space-y-2 bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center space-x-2 text-emerald-950 font-bold text-base">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Why This News Matters to Your Wealth & Family</span>
          </div>
          {isEditing ? (
            <textarea
              value={editWhyItMatters}
              onChange={(e) => setEditWhyItMatters(e.target.value)}
              rows={4}
              className="w-full p-2.5 text-xs text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <p className="text-sm text-emerald-950 leading-relaxed font-normal">
              {article.whyItMatters}
            </p>
          )}
        </div>

        {/* Section 3: Potential Effects Across 9 Financial Areas */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Potential Impact Across Financial Segments</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Household Expenses */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Household Expenses</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.householdExpenses || 'Minimal direct friction.'}
              </p>
            </div>

            {/* Inflation */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Percent className="w-3.5 h-3.5 text-amber-600" />
                <span>Inflation & Purchasing Power</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.inflation || 'Anchored expectations.'}
              </p>
            </div>

            {/* Savings & FD */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <PiggyBank className="w-3.5 h-3.5 text-teal-600" />
                <span>Savings & Fixed Deposits</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.savingsAndFd || 'Competitive yields.'}
              </p>
            </div>

            {/* Loans & EMIs */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                <span>Home Loans & EMIs</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.loansAndEmi || 'Stable external benchmark rates.'}
              </p>
            </div>

            {/* Taxes */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Building2 className="w-3.5 h-3.5 text-violet-600" />
                <span>Taxes & Deductions</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.taxes || 'New tax regime optimization.'}
              </p>
            </div>

            {/* Insurance */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Insurance Coverage</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.insurance || 'Health & term cover resilience.'}
              </p>
            </div>

            {/* SIP & Mutual Funds */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>SIP & Mutual Funds</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.sipAndMutualFunds || 'Disciplined long-term compounding.'}
              </p>
            </div>

            {/* Stock Markets */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Stock Markets & Equities</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.stockMarkets || 'Focus on earnings quality.'}
              </p>
            </div>

            {/* Gold & Commodities */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 transition-colors shadow-2xs">
              <div className="flex items-center space-x-2 mb-1.5 text-slate-900 font-bold text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Gold & Commodities</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.financialImpacts.goldAndCommodities || 'Defensive strategic hedge.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Balanced Financial Advisor's Opinion */}
        <div className="space-y-3 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-3xl shadow-lg">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
            <Sparkles className="w-5 h-5" />
            <span>Balanced Financial Advisor’s Opinion</span>
          </div>
          {isEditing ? (
            <textarea
              value={editAdvisorOpinion}
              onChange={(e) => setEditAdvisorOpinion(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl"
            />
          ) : (
            <p className="text-sm text-slate-100 leading-relaxed font-normal italic">
              "{article.advisorOpinion}"
            </p>
          )}
        </div>

        {/* Section 5: Practical Considerations & Mistakes to Avoid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Practical Actionable Steps</span>
            </h4>
            <ul className="space-y-2">
              {article.practicalConsiderations.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
            <h4 className="text-sm font-bold text-rose-900 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Common Mistakes to Avoid</span>
            </h4>
            <ul className="space-y-2">
              {article.mistakesToAvoid.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <span className="text-rose-600 font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section 6: Future Scenarios & Uncertainties */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Plausible Future Scenarios & Factors</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-700 block mb-1">Bull / Optimistic Case</span>
              <p className="text-slate-600">{article.scenarios.positive}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Base / Neutral Case</span>
              <p className="text-slate-600">{article.scenarios.neutral}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-200">
              <span className="font-bold text-rose-700 block mb-1">Defensive / Cautious Case</span>
              <p className="text-slate-600">{article.scenarios.negative}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic pt-1">
            Key Variables: {article.scenarios.conditionsAndUncertainties}
          </p>
        </div>

        {/* Section 7: Conclusion & Original Sources */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900">Summary & Takeaway</h4>
          {isEditing ? (
            <textarea
              value={editConclusion}
              onChange={(e) => setEditConclusion(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {article.conclusion}
            </p>
          )}

          {article.sources && article.sources.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="font-bold">Original Source References:</span>
              {article.sources.map((src, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <span>{src.name}</span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                    </a>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 8: Final Advisor Credit Card */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-3 text-left w-full sm:w-auto">
            <img
              src={
                profile.profilePhoto ||
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'
              }
              alt={profile.advisorName || article.advisorCredit.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {profile.advisorName || article.advisorCredit.name}
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                {profile.designation || article.advisorCredit.designation}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold">
                {profile.professionalDetails || article.advisorCredit.credentials || 'ARN Registered Financial Advisor'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {(profile.phoneNumber || article.advisorCredit.contact) && (
              <a
                href={`tel:${profile.phoneNumber || article.advisorCredit.contact}`}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{profile.phoneNumber || article.advisorCredit.contact}</span>
              </a>
            )}

            {(profile.whatsappNumber || profile.phoneNumber) && (
              <a
                href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                  profile.whatsappNumber || profile.phoneNumber
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Compliance Disclaimer */}
        <p className="text-[10px] text-slate-400 text-center italic">
          Disclaimer: This analysis is compiled for client education and macro literacy. Financial products carry market risks; read all scheme documents carefully before making investment commitments.
        </p>
      </article>
    </div>
  );
};
