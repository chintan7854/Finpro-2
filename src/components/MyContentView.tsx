import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { GeneratedContent } from '../types';
import {
  BookmarkCheck,
  Search,
  Heart,
  MessageCircle,
  Copy,
  Trash2,
  ExternalLink,
  Filter,
  Check,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface MyContentViewProps {
  onSelectContent: (content: GeneratedContent) => void;
  onCreateNew: () => void;
}

export const MyContentView: React.FC<MyContentViewProps> = ({
  onSelectContent,
  onCreateNew,
}) => {
  const { t, getSubjectTitle } = useI18n();
  const { contents, toggleFavorite, deleteContent } = useAdvisor();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = contents.filter((item) => {
    if (filterFavorites && !item.isFavorite) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = getSubjectTitle(item.subjectId, item.contentLanguage).toLowerCase();
    const headline = item.deepArticle.headline.toLowerCase();
    const body = item.deepArticle.body.toLowerCase();
    return title.includes(q) || headline.includes(q) || body.includes(q);
  });

  const handleCopy = (item: GeneratedContent) => {
    navigator.clipboard.writeText(`${item.deepArticle.headline}\n\n${item.whatsappMessage}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsApp = (item: GeneratedContent) => {
    const text = encodeURIComponent(
      `*${item.deepArticle.headline}*\n\n${item.whatsappMessage}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('myContent.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('myContent.subtitle')}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('content.generateBtn')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('myContent.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterFavorites(false)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              !filterFavorites
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('myContent.all')} ({contents.length})
          </button>
          <button
            onClick={() => setFilterFavorites(true)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
              filterFavorites
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-white' : ''}`} />
            <span>{t('myContent.favoritesOnly')}</span>
          </button>
        </div>
      </div>

      {/* Content Cards List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600">
            {t('myContent.noSaved')}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">
                    {getSubjectTitle(item.subjectId, item.contentLanguage)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                    Lang: {item.contentLanguage.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        item.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteContent(item.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3
                  onClick={() => onSelectContent(item)}
                  className="font-bold text-base text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                >
                  {item.deepArticle.headline}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {item.deepArticle.subheadline || item.deepArticle.body}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Branded as: <strong>{item.advisorSnapshot.name}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleWhatsApp(item)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => onSelectContent(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>View Full Kit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
