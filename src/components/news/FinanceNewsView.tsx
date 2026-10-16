import React, { useState } from 'react';
import { useFinanceNews } from '../../context/FinanceNewsContext';
import { useI18n } from '../../context/I18nContext';
import { FinanceNewsItem, FinanceNewsArticle } from '../../types/news';
import { FinanceArticleReader } from './FinanceArticleReader';
import { CustomNewsTopicModal } from './CustomNewsTopicModal';
import { NewsSchedulerModal } from './NewsSchedulerModal';
import {
  Newspaper,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Globe,
  Clock,
  Bookmark,
  Calendar,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  PlusCircle,
  Activity,
  Layers,
  TrendingUp,
  FileText,
  AlertCircle,
  Copy,
  Trash2,
  Check,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const FinanceNewsView: React.FC = () => {
  const {
    newsList,
    nationalNews,
    internationalNews,
    isLoadingNews,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredNews,
    activeArticle,
    setActiveArticle,
    generateArticleForNews,
    isGeneratingArticle,
    savedArticles,
    deleteSavedArticle,
    refreshNews,
    isSyncingNews,
    syncMessage,
  } = useFinanceNews();

  const { language, supportedLanguages } = useI18n();

  const [activeTab, setActiveTab] = useState<'news' | 'saved'>('news');
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'high'>('all');
  const [generatingNewsId, setGeneratingNewsId] = useState<string | null>(null);

  const [isCustomTopicModalOpen, setIsCustomTopicModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [copiedSavedId, setCopiedSavedId] = useState<string | null>(null);

  const currentLangObj = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const renderVerificationBadge = (item: FinanceNewsItem) => {
    const status = item.verificationStatus || (item.isVerified ? 'VERIFIED' : 'UNVERIFIED');
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
            OFFICIAL PRIMARY SOURCE — VERIFIED
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="inline-flex items-center text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            PARTIALLY VERIFIED
          </span>
        );
      case 'OUTDATED':
        return (
          <span className="inline-flex items-center text-[10px] text-orange-800 bg-orange-50 px-2 py-0.5 rounded-md font-bold border border-orange-300">
            <Clock className="w-3 h-3 mr-1 text-orange-600" />
            OUTDATED SOURCE
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center text-[10px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md font-bold border border-rose-300">
            <ShieldAlert className="w-3 h-3 mr-1 text-rose-600" />
            VERIFICATION FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-bold border border-slate-300">
            <HelpCircle className="w-3 h-3 mr-1 text-slate-500" />
            UNVERIFIED
          </span>
        );
    }
  };

  // If viewing or editing a detailed article, show Article Reader
  if (activeArticle) {
    return <FinanceArticleReader article={activeArticle} onBack={() => setActiveArticle(null)} />;
  }

  const handleCreateArticleClick = async (item: FinanceNewsItem) => {
    setGeneratingNewsId(item.id);
    try {
      await generateArticleForNews(item);
    } finally {
      setGeneratingNewsId(null);
    }
  };

  const handleCopySaved = async (article: FinanceNewsArticle) => {
    try {
      await navigator.clipboard.writeText(`${article.headline}\n\n${article.whyItMatters}\n\n${article.conclusion}`);
      setCopiedSavedId(article.id);
      setTimeout(() => setCopiedSavedId(null), 2000);
    } catch {
      console.warn('Copy failed');
    }
  };

  // Filter news items by category, search, and importance
  const displayedNews = filteredNews.filter((item) => {
    if (importanceFilter === 'high') {
      return item.importanceScore >= 9;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Daily Automated 4:00 AM IST Updates & Verification Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Finance News & Advisor Insights
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Real-time, verified National & International economic developments. Transform macroeconomic headlines into
              ready-to-share client advisory articles in your selected language ({currentLangObj.nativeLabel}).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCustomTopicModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Custom Topic</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSchedulerModalOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all backdrop-blur-xs"
              title="Inspect 4:00 AM Fetch and 4:30 AM Cleanup Jobs"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Schedule Status</span>
            </button>

            <button
              type="button"
              onClick={refreshNews}
              disabled={isSyncingNews}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all disabled:opacity-50"
              title="Sync & Verify Now"
            >
              <RefreshCw className={`w-4 h-4 text-slate-300 ${isSyncingNews ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Language Notification Pill */}
        <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>
              Active Content Language:{' '}
              <strong className="text-white font-bold">{currentLangObj.nativeLabel} ({currentLangObj.label})</strong>
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              (All headlines, summaries, and generated articles follow this language)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>National: 10 Active</span>
            <span>•</span>
            <span>International: 10 Active</span>
            <span>•</span>
            <span>Saved Articles: {savedArticles.length}</span>
          </div>
        </div>
      </div>

      {/* Sync Success / Status Banner */}
      {syncMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs: Live News vs Saved Articles */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'news'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Live News Dashboard (20)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Articles ({savedArticles.length})</span>
          </button>
        </div>

        {activeTab === 'news' && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeCategory === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All ({newsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('national')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeCategory === 'national' ? 'bg-white text-amber-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              National ({nationalNews.length} Active Verified)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('international')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeCategory === 'international' ? 'bg-white text-indigo-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              International ({internationalNews.length} Active Verified)
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'news' ? (
        <div className="space-y-6">
          {/* Mobile Category Switcher & Search Bar */}
          <div className="space-y-3">
            {/* Mobile category pills */}
            <div className="sm:hidden flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                  activeCategory === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                All ({newsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('national')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                  activeCategory === 'national' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900'
                }`}
              >
                National ({nationalNews.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('international')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold ${
                  activeCategory === 'international' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-900'
                }`}
              >
                International ({internationalNews.length})
              </button>
            </div>

            {/* Search and importance filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search verified news by headline, tags, keywords, or source (e.g., RBI, SIP, Fed, Gold)..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end text-xs font-semibold">
                <span className="text-slate-400 text-[11px] hidden sm:inline">Impact:</span>
                <button
                  type="button"
                  onClick={() => setImportanceFilter(importanceFilter === 'all' ? 'high' : 'all')}
                  className={`px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 ${
                    importanceFilter === 'high'
                      ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-rose-600" />
                  <span>High Impact (9-10)</span>
                </button>
              </div>
            </div>
          </div>

          {/* News Cards Grid */}
          {displayedNews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No News Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                No items match your active filters. Try clearing your search query or switching categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setImportanceFilter('all');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedNews.map((item) => {
                const isNational = item.category === 'national';
                const localizedHeadline = item.headline[language] || item.originalHeadline;
                const localizedSummary = item.summary[language] || item.originalSummary;
                const isGeneratingThis = generatingNewsId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    {/* Top Meta info */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isNational
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            }`}
                          >
                            {isNational ? 'National Finance' : 'International Finance'}
                          </span>

                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.source.publishedDate || 'Recent'} ({new Date(item.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })})
                          </span>
                        </div>

                        {/* Importance Score Pill */}
                        <div
                          className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            item.importanceScore >= 9
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                          title={`Importance Rating: ${item.importanceScore}/10`}
                        >
                          <Activity className="w-3 h-3" />
                          <span>{item.importanceScore}/10 Impact</span>
                        </div>
                      </div>

                      {/* Source & Verification Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center space-x-1.5 text-xs">
                          {item.source.url ? (
                            <a
                              href={item.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-slate-800 hover:text-emerald-700 hover:underline inline-flex items-center space-x-1"
                              title="Visit official source website"
                            >
                              <span>{item.source.name}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600" />
                            </a>
                          ) : (
                            <span className="font-bold text-slate-800">{item.source.name}</span>
                          )}
                        </div>

                        {renderVerificationBadge(item)}
                      </div>

                      {/* Headline in currently selected language */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                        {localizedHeadline}
                      </h3>

                      {/* Summary in currently selected language */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {localizedSummary}
                      </p>

                      {/* Impact Areas & Key Metrics Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.financialImpactAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {area}
                          </span>
                        ))}
                        {item.keyMetrics &&
                          item.keyMetrics.map((km, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                            >
                              {km}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-[170px] sm:max-w-xs">{item.verifiedBy}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCreateArticleClick(item)}
                        disabled={isGeneratingThis || isGeneratingArticle}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0"
                      >
                        {isGeneratingThis ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Article...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Create Detailed Article</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Saved Articles Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Saved Finance Articles</h2>
              <p className="text-xs text-slate-500">
                Customized, editable advisory articles saved to your library for client sharing and newsletters.
              </p>
            </div>
          </div>

          {savedArticles.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Saved Articles Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Generate an article from any news card above or from a custom topic, then click "Save Article" to keep it here.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('news')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Browse News & Create Articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {article.category} • {article.contentLanguage.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(article.updatedAt || article.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{article.headline}</h4>

                    <p className="text-xs text-slate-600 line-clamp-2">{article.whyItMatters}</p>

                    {article.isEdited && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        Customized by You (v{article.version})
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
                    >
                      <span>Read & Edit</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopySaved(article)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center space-x-1"
                        title="Copy article text"
                      >
                        {copiedSavedId === article.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSavedArticle(article.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CustomNewsTopicModal
        isOpen={isCustomTopicModalOpen}
        onClose={() => setIsCustomTopicModalOpen(false)}
      />

      <NewsSchedulerModal
        isOpen={isSchedulerModalOpen}
        onClose={() => setIsSchedulerModalOpen(false)}
      />
    </div>
  );
};
