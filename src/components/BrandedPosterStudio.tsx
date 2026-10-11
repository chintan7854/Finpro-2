import React, { useRef, useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { FinancialSubjectId, GeneratedContent, LanguageCode } from '../types';
import { renderPosterToCanvas, PosterConfig } from '../utils/posterRenderer';
import { generateAdvisorContent } from '../services/contentGenerator';
import { MAIN_FINANCIAL_SUBJECTS } from '../constants/subjects';
import { SUBJECT_ADVISOR_SUGGESTIONS } from '../constants/advisorSubjectSuggestions';
import { VideoStatusMaker } from './VideoStatusMaker';
import {
  Download,
  Share2,
  Copy,
  Check,
  Smartphone,
  Square,
  Palette,
  Sparkles,
  RefreshCw,
  Phone,
  MessageCircle,
  FileText,
  Film,
  User,
  ShieldCheck,
  Award,
  Tag,
  PlusCircle,
} from 'lucide-react';
import { AddCustomSubjectModal } from './AddCustomSubjectModal';

interface BrandedPosterStudioProps {
  content?: GeneratedContent;
  initialSubjectId?: FinancialSubjectId;
  onNavigateToThemeStudio?: () => void;
}

export const BrandedPosterStudio: React.FC<BrandedPosterStudioProps> = ({
  content,
  initialSubjectId,
  onNavigateToThemeStudio,
}) => {
  const { language, getSubjectTitle, getDefaultCta, getDefaultDisclaimer } = useI18n();
  const { profile, consumeCredit, allSubjects, customSubjects } = useAdvisor();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subject Selection in Studio
  const [selectedSubjectId, setSelectedSubjectId] = useState<FinancialSubjectId>(
    content?.subjectId || initialSubjectId || 'sip_mutual_fund'
  );

  // Studio Controls
  const [format, setFormat] = useState<'status_9_16' | 'post_1_1'>('status_9_16');
  const [theme, setTheme] = useState<'emerald' | 'navy' | 'gold' | 'midnight' | 'crimson' | 'indigo'>('emerald');
  const [showVideoMaker, setShowVideoMaker] = useState<boolean>(false);
  const [exportedCanvasImage, setExportedCanvasImage] = useState<string>('');

  // Advisor Identity Customization for the Poster
  const [advisorName, setAdvisorName] = useState<string>(
    content?.advisorSnapshot?.name || profile.advisorName
  );
  const [advisorDesignation, setAdvisorDesignation] = useState<string>(
    content?.advisorSnapshot?.designation || profile.designation
  );
  const [advisorAchievement, setAdvisorAchievement] = useState<string>(
    content?.advisorSnapshot?.achievement || profile.achievement || ''
  );
  const [advisorPhone, setAdvisorPhone] = useState<string>(
    content?.advisorSnapshot?.contact || profile.phoneNumber
  );

  // Strictly dynamic subject title (never locks to stale content)
  const activeSubjectTitle = getSubjectTitle(selectedSubjectId, content?.contentLanguage || language);

  // Creative Background Art & Category Badge Controls
  const [backgroundStyle, setBackgroundStyle] = useState<'subject_art' | 'aurora_mesh' | 'fintech_grid' | 'wealth_constellation' | 'minimalist'>('subject_art');
  const [backgroundSeed, setBackgroundSeed] = useState<number>(() => Math.floor(Math.random() * 99999) + 1);
  const [showSubjectBadge, setShowSubjectBadge] = useState<boolean>(true);
  const [customBadgeText, setCustomBadgeText] = useState<string>(activeSubjectTitle);

  const [headline, setHeadline] = useState<string>(
    content?.deepArticle.headline ||
      `Smart Guide to ${activeSubjectTitle}: Secure Your Family's Financial Freedom`
  );
  const [subheadline, setSubheadline] = useState<string>(
    content?.deepArticle.subheadline ||
      'Start early, maintain systematic discipline, and beat inflation with professional guidance.'
  );
  const [bullets, setBullets] = useState<string[]>(
    content?.deepArticle.keyTakeaways || [
      'Discipline beats market timing through Rupee-Cost Averaging.',
      'Align investments directly with family life milestones.',
      'Consult a certified financial planner for annual portfolio health-checks.'
    ]
  );
  const [ctaText, setCtaText] = useState<string>(
    content?.appliedCta || profile.defaultCTA || getDefaultCta(content?.contentLanguage || language)
  );

  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isAiRefreshing, setIsAiRefreshing] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // When changing financial subject in studio:
  const handleSubjectChange = (newSubjectId: FinancialSubjectId) => {
    setSelectedSubjectId(newSubjectId);
    const newTitle = getSubjectTitle(newSubjectId, content?.contentLanguage || language);
    setCustomBadgeText(newTitle);
    setHeadline(`Smart Guide to ${newTitle}: Secure Your Family's Financial Freedom`);
    setSubheadline(`Strategic planning and disciplined execution in ${newTitle.toLowerCase()} safeguard your financial goals.`);
    setBullets([
      `Discipline and systematic planning in ${newTitle} build long-term security.`,
      `Align investments directly with family life milestones and timelines.`,
      `Consult a certified financial planner for annual portfolio health audits.`
    ]);
    // Randomize background seed so fresh creative art is generated for the new topic!
    setBackgroundSeed(Math.floor(Math.random() * 99999) + 1);
  };

  // Generate new creative background on demand
  const handleGenerateNewBackground = () => {
    setBackgroundSeed((prev) => prev + Math.floor(Math.random() * 8000) + 1);
  };

  // AI Content Refresh Handler
  const handleAiRefresh = async () => {
    setIsAiRefreshing(true);
    try {
      const generated = await generateAdvisorContent({
        subjectId: selectedSubjectId,
        subjectTitle: getSubjectTitle(selectedSubjectId, content?.contentLanguage || language),
        contentType: 'all_in_one',
        articleLength: 'short',
        audience: 'general_public',
        contentLanguage: content?.contentLanguage || language,
        advisorProfile: profile,
        useDefaultCta: true,
        useDefaultDisclaimer: true,
      });

      setHeadline(generated.deepArticle.headline);
      setSubheadline(generated.deepArticle.subheadline);
      setBullets(generated.deepArticle.keyTakeaways);
      setCtaText(generated.appliedCta);
      consumeCredit();
    } catch (e) {
      console.error('Failed to refresh content with AI', e);
    } finally {
      setIsAiRefreshing(false);
    }
  };

  const handleOpenVideoMaker = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      setExportedCanvasImage(dataUrl);
      setShowVideoMaker(true);
    }
  };

  // Sync when content changes
  useEffect(() => {
    if (content) {
      setHeadline(content.deepArticle.headline);
      setSubheadline(content.deepArticle.subheadline);
      setBullets(content.deepArticle.keyTakeaways);
      setCtaText(content.appliedCta);
    }
  }, [content]);

  // Render poster whenever configuration changes
  const renderPoster = async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    const config: PosterConfig = {
      format,
      theme,
      backgroundStyle,
      backgroundSeed,
      showSubjectBadge,
      customSubjectBadgeText: customBadgeText,
      subjectId: selectedSubjectId,
      subjectTitle: activeSubjectTitle,
      language: content?.contentLanguage || language,
      headline,
      subheadline,
      bulletPoints: bullets,
      ctaText,
      disclaimer: content?.appliedDisclaimer || profile.defaultDisclaimer || getDefaultDisclaimer(language),
      advisorName,
      advisorDesignation,
      advisorAchievement,
      advisorPhone,
      advisorCredentials: profile.professionalDetails,
      advisorPhoto: profile.profilePhoto,
      advisorLogo: profile.logo,
    };

    try {
      await renderPosterToCanvas(canvasRef.current, config);
    } catch (e) {
      console.error('Failed to render poster', e);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    renderPoster();
  }, [
    format,
    theme,
    backgroundStyle,
    backgroundSeed,
    showSubjectBadge,
    customBadgeText,
    selectedSubjectId,
    headline,
    subheadline,
    bullets,
    ctaText,
    advisorName,
    advisorDesignation,
    advisorAchievement,
    advisorPhone,
    profile
  ]);

  // Export Download handler
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const safeSubject = activeSubjectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const fileSuffix = format === 'status_9_16' ? 'whatsapp-status' : 'social-post';
    link.download = `${safeSubject}-${fileSuffix}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard write failed, triggering download instead', err);
      handleDownloadImage();
    }
  };

  // Share to WhatsApp
  const handleWhatsAppShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if Web Share API with file support is available
    if (navigator.share && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${selectedSubjectId}-whatsapp-status.png`, {
            type: 'image/png',
          });
          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: activeSubjectTitle,
                text: `${headline}\n\nCall / WhatsApp: ${profile.phoneNumber}`,
                files: [file],
              });
              return;
            } catch (err) {
              // fallback
            }
          }
        }
        // Fallback: download image and open WhatsApp
        handleDownloadImage();
        const text = encodeURIComponent(
          `*${headline}*\n\n${ctaText}\n\nContact: ${profile.advisorName} (${profile.phoneNumber})`
        );
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      }, 'image/png');
    } else {
      handleDownloadImage();
      const text = encodeURIComponent(
        `*${headline}*\n\n${ctaText}\n\nContact: ${profile.advisorName} (${profile.phoneNumber})`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* 25 Themes Studio Switcher Banner */}
      {onNavigateToThemeStudio && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold shrink-0">
              ✨ 25 THEMES
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">
                Looking for Specific Formats? (Myth vs Reality, Split Screen, Roadmaps, Math Proofs)
              </h4>
              <p className="text-xs text-indigo-200">
                Explore our dedicated 25 Visual Theme Creator with tailored psychological templates for every financial subject.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToThemeStudio}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
          >
            <span>Open 25 Themes Studio ➔</span>
          </button>
        </div>
      )}

      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <Smartphone className="w-4 h-4" />
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              WhatsApp Status & Social Poster Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Direct PNG Export
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate high-resolution branded images with your photo, phone, and credentials ready for WhatsApp Status.
          </p>
        </div>

        {/* Primary Actions: Download, Video Maker, Copy */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleOpenVideoMaker}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center space-x-1.5 transition-colors border border-purple-200"
          >
            <Film className="w-3.5 h-3.5 text-purple-600" />
            <span>Make Video Status (15s)</span>
          </button>

          <button
            onClick={handleCopyImage}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Copy image to clipboard"
          >
            {copiedSuccess ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copiedSuccess ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Maker Modal if open */}
      {showVideoMaker && (
        <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-purple-950 flex items-center space-x-2">
              <Film className="w-4 h-4 text-purple-600" />
              <span>Convert this Branded Poster into Animated Video Status</span>
            </h3>
            <button
              onClick={() => setShowVideoMaker(false)}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              ✕ Close Video Maker
            </button>
          </div>
          <VideoStatusMaker initialImageSrc={exportedCanvasImage} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Customization Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Image Dimensions / Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('status_9_16')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  format === 'status_9_16'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp Status (9:16)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('post_1_1')}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  format === 'post_1_1'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>Square Post (1:1)</span>
              </button>
            </div>
          </div>

          {/* 2. Visual Theme & Background Gradients */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Visual Background Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'emerald', label: 'Emerald Growth', color: 'from-emerald-900 to-slate-900' },
                { id: 'navy', label: 'Navy Wealth', color: 'from-slate-900 to-sky-950' },
                { id: 'gold', label: 'Royal Gold', color: 'from-amber-950 to-slate-900' },
                { id: 'midnight', label: 'Midnight Luxe', color: 'from-purple-950 to-slate-950' },
                { id: 'crimson', label: 'Crimson Trust', color: 'from-rose-950 to-slate-900' },
                { id: 'indigo', label: 'Modern Indigo', color: 'from-indigo-950 to-slate-950' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as any)}
                  className={`p-2.5 rounded-xl border text-left text-[11px] font-semibold transition-all ${
                    theme === t.id
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-full h-3 rounded-md bg-gradient-to-r ${t.color} mb-1.5`}></div>
                  <span className="line-clamp-1 text-slate-800">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Subject Selector & AI Content Refresh */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Financial Topic Pillar ({allSubjects.length})
              </label>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-800 flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>+ Custom</span>
                </button>
                <button
                  type="button"
                  onClick={handleAiRefresh}
                  disabled={isAiRefreshing}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isAiRefreshing ? 'AI...' : 'AI Refresh'}</span>
                </button>
              </div>
            </div>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value as FinancialSubjectId)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.isCustom ? `★ [CUSTOM] ${s.customTitle || getSubjectTitle(s.id, language)}` : getSubjectTitle(s.id, language)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Switching topic automatically updates the title badge, headline, and creative background.
            </p>
          </div>

          {/* Modal for adding custom company/sector financial subjects */}
          <AddCustomSubjectModal
            isOpen={isCustomModalOpen}
            onClose={() => setIsCustomModalOpen(false)}
            onSubjectAddedAndSelected={(id) => handleSubjectChange(id)}
          />

          {/* 3B. Topic Pill Badge Controls (Addresses Red-Circle Desynchronization) */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Top Topic Badge (Pill on Image)</span>
              </label>
              <label className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSubjectBadge}
                  onChange={(e) => setShowSubjectBadge(e.target.checked)}
                  className="w-3.5 h-3.5 text-emerald-600 rounded-sm border-emerald-300 focus:ring-emerald-500"
                />
                <span>Show on Poster</span>
              </label>
            </div>

            {showSubjectBadge && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customBadgeText}
                    onChange={(e) => setCustomBadgeText(e.target.value)}
                    placeholder="e.g. PERSONAL LOAN or SIP / MUTUAL FUND"
                    className="flex-1 text-xs font-bold uppercase p-2 rounded-lg border border-emerald-300 bg-white text-emerald-950 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomBadgeText(activeSubjectTitle)}
                    className="px-2.5 py-2 rounded-lg text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 shrink-0"
                    title="Reset badge to active topic title"
                  >
                    Sync Topic
                  </button>
                </div>
                <p className="text-[10px] text-emerald-700">
                  Matches your selected financial pillar. You can also edit it or toggle it off completely.
                </p>
              </div>
            )}
          </div>

          {/* 3C. Creative Subject Background Art Generator */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-600" />
                <span>Creative Background Artwork</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateNewBackground}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center space-x-1 shadow-2xs"
              >
                <span>🎲 Generate New Background</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Art Style Mode
                </label>
                <select
                  value={backgroundStyle}
                  onChange={(e) => setBackgroundStyle(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-indigo-200 bg-white focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="subject_art">🎯 Subject Financial Art (Custom Vectors)</option>
                  <option value="aurora_mesh">🌌 Luxury Aurora Mesh (Glowing Blooms)</option>
                  <option value="fintech_grid">📊 Modern Fintech Data Grid</option>
                  <option value="wealth_constellation">✨ Wealth Constellation Nodes</option>
                  <option value="minimalist">🏛️ Minimalist Corporate Classic</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Art Pattern Seed
                </label>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-bold text-indigo-900 bg-white px-2 py-1.5 rounded-lg border border-indigo-200 flex-1 truncate">
                    #{backgroundSeed}
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateNewBackground}
                    className="p-1.5 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700"
                    title="Randomize pattern"
                  >
                    🎲
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-indigo-800">
              Each subject generates dedicated illustrations: compounding curves for SIP, house blueprints & credit gauges for loans, heartbeat lifelines & shields for insurance.
            </p>
          </div>

          {/* 4. Text Fine-Tuning */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline (Auto-sized on Image)
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Call to Action Ribbon
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Advisor Identity & Branding Fine-Tuning */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Advisor Branding on Image:</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                Live on Poster
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Advisor Name
                </label>
                <input
                  type="text"
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={advisorPhone}
                  onChange={(e) => setAdvisorPhone(e.target.value)}
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Designation for this Image
              </label>
              <input
                type="text"
                value={advisorDesignation}
                onChange={(e) => setAdvisorDesignation(e.target.value)}
                className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                Achievement / Credentials Line
              </label>
              <input
                type="text"
                value={advisorAchievement}
                onChange={(e) => setAdvisorAchievement(e.target.value)}
                placeholder="e.g. MDRT 2024 • 500+ Happy Families"
                className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Canvas Preview Container */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80">
          <div className="flex items-center justify-between w-full max-w-sm mb-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              {format === 'status_9_16' ? 'WhatsApp Status (9:16 - 1080×1920)' : 'Social Post (1:1 - 1080×1080)'}
            </span>
            <span>{isRendering ? 'Rendering...' : 'High-Res Preview'}</span>
          </div>

          {/* Canvas Wrapper */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black flex items-center justify-center transition-all ${
              format === 'status_9_16'
                ? 'w-[290px] h-[515px] sm:w-[320px] sm:h-[568px]'
                : 'w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]'
            }`}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={renderPoster}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-render</span>
            </button>
            <button
              onClick={handleDownloadImage}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-700 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
