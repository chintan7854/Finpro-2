import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { GeneratedContent } from '../types';
import {
  FileText,
  MessageCircle,
  Smartphone,
  Share2,
  Video,
  TrendingUp,
  Image as ImageIcon,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Heart,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

import { BrandedPosterStudio } from './BrandedPosterStudio';
import { VideoStatusMaker } from './VideoStatusMaker';
import { ThemePostersStudio } from './ThemePostersStudio';
import { exportCardAsImage } from '../utils/cardToImage';
import { Download, Film, Layers } from 'lucide-react';

interface ContentResultViewProps {
  content: GeneratedContent;
  onBack: () => void;
  onCreateAnother: () => void;
}

type TabType = 'article' | 'whatsapp' | 'status' | 'social' | 'video' | 'insights' | 'poster' | 'video_maker' | 'theme_studio';

export const ContentResultView: React.FC<ContentResultViewProps> = ({
  content,
  onBack,
  onCreateAnother,
}) => {
  const { t, getSubjectTitle } = useI18n();
  const { saveContent, toggleFavorite } = useAdvisor();

  const [activeTab, setActiveTab] = useState<TabType>('article');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(content.isSaved);
  const [isFavorite, setIsFavorite] = useState<boolean>(content.isFavorite);
  const [exportingCard, setExportingCard] = useState<string | null>(null);

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handleSave = () => {
    saveContent(content);
    setSavedSuccess(true);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(content.id);
    setIsFavorite(!isFavorite);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `*${content.deepArticle.headline}*\n\n${content.whatsappMessage}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadCardImage = async (
    badge: string,
    body: string,
    theme: 'emerald' | 'blue' | 'amber' | 'slate',
    id: string
  ) => {
    setExportingCard(id);
    try {
      const dataUrl = await exportCardAsImage({
        cardType: 'status_slide',
        title: content.subjectTitle,
        badgeText: badge,
        bodyText: body,
        themeColor: theme,
        advisorSnapshot: content.advisorSnapshot,
        appliedCta: content.appliedCta,
        format: 'status_9_16',
      });
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}-status.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to export card image', err);
    } finally {
      setTimeout(() => setExportingCard(null), 1500);
    }
  };

  const tabs = [
    { id: 'article', label: t('result.tabArticle'), icon: FileText },
    { id: 'whatsapp', label: t('result.tabWhatsApp'), icon: MessageCircle },
    { id: 'status', label: t('result.tabStatus'), icon: Smartphone },
    { id: 'video_maker', label: 'Video Status (Music)', icon: Film },
    { id: 'social', label: t('result.tabSocial'), icon: Share2 },
    { id: 'video', label: t('result.tabVideo'), icon: Video },
    { id: 'insights', label: t('result.tabInsights'), icon: TrendingUp },
    { id: 'theme_studio', label: '25 Theme Posters', icon: Layers },
    { id: 'poster', label: t('result.tabVisualCard'), icon: ImageIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 uppercase">
                {getSubjectTitle(content.subjectId, content.contentLanguage)}
              </span>
              <span className="text-xs text-slate-400">
                Lang: {content.contentLanguage.toUpperCase()}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold">
                {content.generationSource === 'ai_api' ? t('result.sourceAi') : t('result.sourceDemo')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Save, Favorite, Share WhatsApp, Create New */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={t('result.favorite')}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleSave}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              savedSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {savedSuccess ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('result.saved')}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>{t('result.saveContent')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppSend}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('result.shareWhatsApp')}</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}

      {/* 1. Deep Article */}
      {activeTab === 'article' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {content.deepArticle.readTime} • Educational Guide
            </span>
            <button
              onClick={() =>
                handleCopy(
                  `${content.deepArticle.headline}\n\n${content.deepArticle.subheadline}\n\n${content.deepArticle.body}\n\nKey Takeaways:\n${content.deepArticle.keyTakeaways.join('\n')}\n\nCall to Action:\n${content.appliedCta}\n\n${content.appliedDisclaimer}\n\nBy ${content.advisorSnapshot.name} (${content.advisorSnapshot.designation})\nContact: ${content.advisorSnapshot.contact}`,
                  'article'
                )
              }
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copiedTab === 'article' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">{t('result.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('result.copyText')}</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
              {content.deepArticle.headline}
            </h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
              {content.deepArticle.subheadline}
            </p>
          </div>

          <div className="prose prose-slate text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.deepArticle.body}
          </div>

          {/* Key Takeaways Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Key Client Takeaways:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {content.deepArticle.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advisor Signature Footer (Master Branding Applied) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/50 p-4 rounded-xl">
            <div>
              <p className="text-xs font-bold text-slate-900">
                {content.advisorSnapshot.name}
              </p>
              <p className="text-[11px] text-slate-600">
                {content.advisorSnapshot.designation}
                {content.advisorSnapshot.achievement && (
                  <span className="text-amber-800 font-semibold"> • {content.advisorSnapshot.achievement}</span>
                )}
                {content.advisorSnapshot.credentials && (
                  <span> • {content.advisorSnapshot.credentials}</span>
                )}
              </p>
              <p className="text-xs font-medium text-emerald-800 mt-1">
                "{content.appliedCta}"
              </p>
            </div>
            <a
              href={`tel:${content.advisorSnapshot.contact}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold inline-flex items-center space-x-1.5 self-start sm:self-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{content.advisorSnapshot.contact}</span>
            </a>
          </div>

          {content.appliedDisclaimer && (
            <p className="text-[10px] text-slate-400 italic">
              {content.appliedDisclaimer}
            </p>
          )}
        </div>
      )}

      {/* 2. WhatsApp Direct Message */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700">
              Ready-to-Send WhatsApp Broadcast
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(content.whatsappMessage, 'wa-msg')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
              >
                {copiedTab === 'wa-msg' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedTab === 'wa-msg' ? 'Copied' : 'Copy Message'}</span>
              </button>
              <button
                onClick={handleWhatsAppSend}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center space-x-1 hover:bg-emerald-700"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
            {content.whatsappMessage}
          </div>
        </div>
      )}

      {/* 3. WhatsApp Status (3 Slide Sequence) */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                WhatsApp Status Story Sequence (3 Slides)
              </h3>
              <p className="text-xs text-slate-500">
                Post these 3 slides one after another on your WhatsApp Status for optimal client engagement.
              </p>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  `Slide 1:\n${content.whatsappStatus.slide1}\n\nSlide 2:\n${content.whatsappStatus.slide2}\n\nSlide 3:\n${content.whatsappStatus.slide3}`,
                  'status'
                )
              }
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copiedTab === 'status' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy All Slides</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slide 1 */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between min-h-[250px] shadow-md border border-slate-700">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-300 uppercase">
                  Slide 1: Hook
                </span>
                <p className="text-sm font-semibold mt-4 leading-snug">
                  {content.whatsappStatus.slide1}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                <span>Story 1/3</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleCopy(content.whatsappStatus.slide1, 'slide1')}
                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  >
                    {copiedTab === 'slide1' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadCardImage('Slide 1: Hook', content.whatsappStatus.slide1, 'slate', 's1')
                    }
                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{exportingCard === 's1' ? 'Saving...' : 'PNG'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white flex flex-col justify-between min-h-[250px] shadow-md border border-emerald-800">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-300 uppercase">
                  Slide 2: Insight
                </span>
                <p className="text-sm font-semibold mt-4 leading-snug">
                  {content.whatsappStatus.slide2}
                </p>
              </div>
              <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-[11px] text-emerald-300">
                <span>Story 2/3</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleCopy(content.whatsappStatus.slide2, 'slide2')}
                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  >
                    {copiedTab === 'slide2' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadCardImage('Slide 2: Insight', content.whatsappStatus.slide2, 'emerald', 's2')
                    }
                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{exportingCard === 's2' ? 'Saving...' : 'PNG'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-teal-800 to-slate-900 text-white flex flex-col justify-between min-h-[250px] shadow-md border border-teal-700">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-amber-300 uppercase">
                  Slide 3: Action & CTA
                </span>
                <p className="text-sm font-semibold mt-4 leading-snug">
                  {content.whatsappStatus.slide3}
                </p>
              </div>
              <div className="pt-3 border-t border-teal-700 flex items-center justify-between text-[11px] text-slate-300">
                <span>Story 3/3</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleCopy(content.whatsappStatus.slide3, 'slide3')}
                    className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  >
                    {copiedTab === 'slide3' ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadCardImage('Slide 3: Action & CTA', content.whatsappStatus.slide3, 'blue', 's3')
                    }
                    className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>{exportingCard === 's3' ? 'Saving...' : 'PNG'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Social Media Post & Caption */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700">
              Social Media Post (LinkedIn / Facebook / Instagram)
            </span>
            <button
              onClick={() =>
                handleCopy(
                  `${content.socialMedia.postHook}\n\n${content.socialMedia.platformCaption}\n\n${content.socialMedia.hashtags.join(' ')}\n\nAdvisor: ${content.advisorSnapshot.name}`,
                  'social'
                )
              }
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copiedTab === 'social' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedTab === 'social' ? 'Copied' : 'Copy Post'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
            Hook: {content.socialMedia.postHook}
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {content.socialMedia.platformCaption}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {content.socialMedia.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Video / Reel Script */}
      {activeTab === 'video' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {content.videoScript.title}
              </h3>
              <p className="text-xs text-slate-500">
                Estimated Duration: {content.videoScript.durationEstimate}
              </p>
            </div>
            <button
              onClick={() =>
                handleCopy(
                  `Title: ${content.videoScript.title}\nHook: ${content.videoScript.hook}\n\nKey Points:\n${content.videoScript.storyPoints.join('\n')}\n\nCall to Action: ${content.videoScript.callToAction}`,
                  'video'
                )
              }
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copiedTab === 'video' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Script</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-900">
            <span className="font-bold block mb-1">🎬 Hook (First 3 seconds):</span>
            "{content.videoScript.hook}"
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700">Spoken Story Points:</span>
            {content.videoScript.storyPoints.map((pt, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2"
              >
                <span className="font-bold text-emerald-700 shrink-0">#{i + 1}</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <span className="font-bold block mb-0.5">Spoken Call to Action:</span>
            "{content.videoScript.callToAction}"
          </div>
        </div>
      )}

      {/* Video Status Maker (Animated Video with Music) */}
      {activeTab === 'video_maker' && (
        <VideoStatusMaker
          defaultTitle={content.deepArticle.headline}
        />
      )}

      {/* 6. Key Financial Insights */}
      {activeTab === 'insights' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Compelling Client Numbers & Financial Rules
              </h3>
              <p className="text-xs text-slate-500">
                Download each rule as a branded status card ready to forward to clients.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Stat Highlight
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {content.financialInsights.statHighlight}
                </p>
              </div>
              <button
                onClick={() =>
                  handleDownloadCardImage('Stat Highlight', content.financialInsights.statHighlight, 'blue', 'ins1')
                }
                className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 self-start"
              >
                <Download className="w-3 h-3" />
                <span>{exportingCard === 'ins1' ? 'Saving...' : 'Download Card'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Actionable Rule
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {content.financialInsights.actionableRule}
                </p>
              </div>
              <button
                onClick={() =>
                  handleDownloadCardImage('Actionable Rule', content.financialInsights.actionableRule, 'emerald', 'ins2')
                }
                className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 self-start"
              >
                <Download className="w-3 h-3" />
                <span>{exportingCard === 'ins2' ? 'Saving...' : 'Download Card'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Common Mistake to Avoid
                </span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {content.financialInsights.comparisonNote}
                </p>
              </div>
              <button
                onClick={() =>
                  handleDownloadCardImage('Common Mistake to Avoid', content.financialInsights.comparisonNote, 'amber', 'ins3')
                }
                className="mt-3 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 self-start"
              >
                <Download className="w-3 h-3" />
                <span>{exportingCard === 'ins3' ? 'Saving...' : 'Download Card'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 25 Creative Themes Studio */}
      {activeTab === 'theme_studio' && (
        <ThemePostersStudio initialSubjectId={content.subjectId} />
      )}

      {/* 7. Visual Branding Poster Card & Direct PNG Export Studio */}
      {activeTab === 'poster' && (
        <BrandedPosterStudio content={content} />
      )}

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={onCreateAnother}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t('result.generateNew')}</span>
        </button>
      </div>
    </div>
  );
};
