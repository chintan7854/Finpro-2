import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { MAIN_FINANCIAL_SUBJECTS } from '../constants/subjects';
import { CREATIVE_THEMES_LIST, getDefaultThemeData } from '../constants/creativeThemes';
import {
  FinancialSubjectId,
  CreativeThemeId,
  CreativeThemeDefinition,
  ThemePosterData,
  LanguageCode,
} from '../types';
import { renderThemePosterToCanvas } from '../utils/themePosterRenderer';
import { VideoStatusMaker } from './VideoStatusMaker';
import {
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  Video,
  Layers,
  Palette,
  Shuffle,
  ShieldCheck,
  Filter,
  Search,
  ExternalLink,
  Smartphone,
  CheckSquare,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Sliders,
  ChevronDown,
  Compass,
  Globe,
  PlusCircle,
} from 'lucide-react';
import { AddCustomSubjectModal } from './AddCustomSubjectModal';

interface ThemePostersStudioProps {
  initialSubjectId?: FinancialSubjectId;
  initialThemeId?: CreativeThemeId;
  onNavigateToStandardStudio?: () => void;
}

export const ThemePostersStudio: React.FC<ThemePostersStudioProps> = ({
  initialSubjectId,
  initialThemeId = 'split_comparison',
  onNavigateToStandardStudio,
}) => {
  const { language, setLanguage, supportedLanguages, getSubjectTitle } = useI18n();
  const { profile, consumeCredit, allSubjects, customSubjects } = useAdvisor();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Poster Language State
  const [contentLanguage, setContentLanguage] = useState<LanguageCode>(language);

  // Subject and Theme Selection
  const [selectedSubjectId, setSelectedSubjectId] = useState<FinancialSubjectId>(
    initialSubjectId || 'sip_mutual_fund'
  );
  const [selectedThemeId, setSelectedThemeId] = useState<CreativeThemeId>(initialThemeId);
  const [themeFilterCategory, setThemeFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeThemeDef = CREATIVE_THEMES_LIST.find((t) => t.id === selectedThemeId) || CREATIVE_THEMES_LIST[0];

  // Poster Render Controls - Strictly 1:1 Square Format (1080 x 1080 px)
  const format: 'post_1_1' = 'post_1_1';
  const [colorTheme, setColorTheme] = useState<string>(activeThemeDef.colorTheme || 'deep_navy');
  const [backgroundStyle, setBackgroundStyle] = useState<'subject_art' | 'aurora_mesh' | 'fintech_grid' | 'wealth_constellation' | 'minimalist'>('subject_art');
  const [backgroundSeed, setBackgroundSeed] = useState<number>(() => Math.floor(Math.random() * 99999) + 1);
  const [variationNonce, setVariationNonce] = useState<number>(() => Math.floor(Math.random() * 500) + 1);

  // Advisor Identity Overrides for this Poster
  const [advisorName, setAdvisorName] = useState<string>(profile.advisorName);
  const [advisorDesignation, setAdvisorDesignation] = useState<string>(profile.designation);
  const [advisorAchievement, setAdvisorAchievement] = useState<string>(profile.achievement || '');
  const [advisorPhone, setAdvisorPhone] = useState<string>(profile.phoneNumber);

  // Content Data for the current theme
  const [themeData, setThemeData] = useState<ThemePosterData>(() =>
    getDefaultThemeData(initialThemeId, initialSubjectId || 'sip_mutual_fund', profile.advisorName, profile.phoneNumber, 1, language)
  );

  // UI state
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showVideoMaker, setShowVideoMaker] = useState<boolean>(false);
  const [exportedCanvasImage, setExportedCanvasImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'theme_select' | 'customize'>('theme_select');

  const activeSubjectTitle = getSubjectTitle(selectedSubjectId, contentLanguage);

  // Language switch handler: Updates both app language and regenerates theme content in chosen local language
  const handleSelectLanguage = (newLang: LanguageCode) => {
    setContentLanguage(newLang);
    setLanguage(newLang);
    const nextSeed = variationNonce + 1;
    setVariationNonce(nextSeed);
    const title = getSubjectTitle(selectedSubjectId, newLang);
    const fresh = getDefaultThemeData(selectedThemeId, selectedSubjectId, advisorName, advisorPhone, nextSeed, newLang, title);
    setThemeData(fresh);
  };

  // When theme changes: switch to that theme's distinct signature background color and generate fresh content
  const handleSelectTheme = (theme: CreativeThemeDefinition) => {
    setSelectedThemeId(theme.id);
    setColorTheme(theme.colorTheme); // Instantly apply this theme's unique background color!
    const nextSeed = variationNonce + 1;
    setVariationNonce(nextSeed);
    const title = getSubjectTitle(selectedSubjectId, contentLanguage);
    const fresh = getDefaultThemeData(theme.id, selectedSubjectId, advisorName, advisorPhone, nextSeed, contentLanguage, title);
    setThemeData(fresh);
    setBackgroundSeed((prev) => prev + 1);
  };

  // When subject changes: generate fresh, subject-tailored content with new seed
  const handleSelectSubject = (sid: FinancialSubjectId) => {
    setSelectedSubjectId(sid);
    const nextSeed = variationNonce + 1;
    setVariationNonce(nextSeed);
    const title = getSubjectTitle(sid, contentLanguage);
    const fresh = getDefaultThemeData(selectedThemeId, sid, advisorName, advisorPhone, nextSeed, contentLanguage, title);
    setThemeData(fresh);
    setBackgroundSeed((prev) => prev + 1);
  };

  // Fresh Content Generator: Calls backend /api/generate-theme-poster with high entropy, or local varied engine
  const handleGenerateWithAi = async () => {
    setIsAiGenerating(true);
    const nextSeed = variationNonce + 1;
    setVariationNonce(nextSeed);
    setBackgroundSeed((prev) => prev + Math.floor(Math.random() * 500) + 1);

    try {
      const response = await fetch('/api/generate-theme-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: selectedThemeId,
          themeName: activeThemeDef.name,
          subjectId: selectedSubjectId,
          subjectTitle: activeSubjectTitle,
          contentLanguage: contentLanguage,
          variationSeed: nextSeed,
          advisorProfile: {
            advisorName,
            designation: advisorDesignation,
            achievement: advisorAchievement,
            phoneNumber: advisorPhone,
          },
        }),
      });

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setThemeData({
          headline: resJson.data.headline || themeData.headline,
          subheadline: resJson.data.subheadline || themeData.subheadline,
          badgeText: resJson.data.badgeText || themeData.badgeText,
          ctaText: resJson.data.ctaText || themeData.ctaText,
          themeSpecific: resJson.data.themeSpecific || themeData.themeSpecific,
        });
        consumeCredit();
      } else {
        // High-variety local engine fallback with guaranteed novel variation
        const fresh = getDefaultThemeData(selectedThemeId, selectedSubjectId, advisorName, advisorPhone, nextSeed, contentLanguage);
        setThemeData(fresh);
      }
    } catch (e) {
      console.warn('Theme AI generation fallback:', e);
      const fresh = getDefaultThemeData(selectedThemeId, selectedSubjectId, advisorName, advisorPhone, nextSeed, contentLanguage);
      setThemeData(fresh);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Render poster on canvas
  const renderCurrentPoster = async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    try {
      await renderThemePosterToCanvas(canvasRef.current, {
        themeId: selectedThemeId,
        format,
        colorTheme,
        backgroundStyle,
        backgroundSeed,
        subjectId: selectedSubjectId,
        subjectTitle: activeSubjectTitle,
        language: contentLanguage,
        data: themeData,
        advisorName,
        advisorDesignation,
        advisorAchievement,
        advisorPhone,
        advisorCredentials: profile.professionalDetails,
        advisorPhoto: profile.profilePhoto,
        advisorLogo: profile.logo,
      });
    } catch (e) {
      console.error('Error rendering theme poster:', e);
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    renderCurrentPoster();
  }, [
    selectedThemeId,
    selectedSubjectId,
    contentLanguage,
    format,
    colorTheme,
    backgroundStyle,
    backgroundSeed,
    themeData,
    advisorName,
    advisorDesignation,
    advisorAchievement,
    advisorPhone,
    profile,
  ]);

  // Download high-resolution square PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const safeTitle = `${activeThemeDef.indexNumber}-${selectedThemeId}-${selectedSubjectId}`;
    link.download = `${safeTitle}-square-1x1.png`;
    link.href = dataUrl;
    link.click();
  };

  // Open animated video status maker
  const handleMakeVideo = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    setExportedCanvasImage(dataUrl);
    setShowVideoMaker(true);
  };

  // Filter themes
  const filteredThemes = CREATIVE_THEMES_LIST.filter((theme) => {
    const matchesCategory =
      themeFilterCategory === 'all' || theme.category === themeFilterCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.indexNumber.includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold tracking-wide uppercase flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>25 Creative Psychological Themes</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
              Strictly Square (1:1 - 1080×1080)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Theme-Based Poster Creator
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Choose any financial subject and combine it with 25 battle-tested visual frameworks: comparisons, checklists, myth busters, math proofs, or roadmaps.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onNavigateToStandardStudio && (
            <button
              onClick={onNavigateToStandardStudio}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/20 flex items-center space-x-1.5"
            >
              <span>Classic Poster Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Language Selector Bar - Multi-Language Theme Generation */}
      <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-xs space-y-2.5 bg-gradient-to-r from-indigo-50/40 via-white to-emerald-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
                <span>Theme Content Language / ભાષા પસંદ કરો</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any language to generate posters and themes in your preferred regional language (Default: English).
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-750 border border-indigo-200 self-start sm:self-auto">
            Active: {supportedLanguages.find((l) => l.code === contentLanguage)?.nativeLabel} ({contentLanguage.toUpperCase()})
          </span>
        </div>

        {/* Quick Language Chips */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          {supportedLanguages.map((l) => {
            const isActive = contentLanguage === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelectLanguage(l.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-500/40'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                <span>{l.nativeLabel}</span>
                <span className={`text-[10px] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Financial Subject */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Step 1: Choose Financial Subject ({allSubjects.length} Available)</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center space-x-1 transition-all shadow-2xs hover:scale-102"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'gu' ? '+ કસ્ટમ સબ્જેક્ટ' : '+ Custom Subject'}</span>
            </button>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Selected: {activeSubjectTitle}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50/50">
          {allSubjects.map((sub) => {
            const isSelected = selectedSubjectId === sub.id;
            const isCustom = sub.isCustom;
            const title = sub.customTitle || getSubjectTitle(sub.id, contentLanguage);
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSelectSubject(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? isCustom
                      ? 'bg-indigo-600 text-white shadow-xs scale-102 ring-2 ring-indigo-500/40'
                      : 'bg-emerald-600 text-white shadow-xs scale-102 ring-2 ring-emerald-600/30'
                    : isCustom
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isCustom && <span className="text-[10px] bg-indigo-200/50 px-1 rounded text-indigo-900 font-bold">★ CUSTOM</span>}
                <span>{title}</span>
                {sub.companyOrSector && (
                  <span className={`text-[10px] opacity-75 hidden sm:inline ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                    ({sub.companyOrSector})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal for adding custom company/sector financial subjects */}
      <AddCustomSubjectModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubjectAddedAndSelected={(id) => handleSelectSubject(id)}
      />

      {/* Main Studio Workspace: Left Controls & Right Live Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Theme Gallery & Editor Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Tabs for Theme Explorer vs Customize */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('theme_select')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'theme_select'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>1. Choose Theme ({CREATIVE_THEMES_LIST.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'customize'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>2. Customize Text & Branding</span>
            </button>
          </div>

          {/* TAB 1: 25 THEMES GALLERY */}
          {activeTab === 'theme_select' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Step 2: Select Visual Theme ({CREATIVE_THEMES_LIST.length} Available)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any theme to generate the dedicated layout instantly.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search themes..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'all', label: 'All (25)' },
                  { id: 'comparison', label: 'Comparisons (5)' },
                  { id: 'action', label: 'Action & Checklists (5)' },
                  { id: 'education', label: 'Education & Proofs (6)' },
                  { id: 'mindset', label: 'Mindset & Psychology (5)' },
                  { id: 'alerts', label: 'Alerts & Conversion (4)' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setThemeFilterCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      themeFilterCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredThemes.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative group flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            #{theme.indexNumber}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                            {theme.badge}
                          </span>
                        </div>

                        <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-950' : 'text-slate-900'}`}>
                          {theme.name}
                        </h4>

                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-snug">
                          {theme.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold">
                        <span className="text-slate-400 capitalize">{theme.categoryLabel}</span>
                        <span className={`font-bold flex items-center space-x-1 ${isSelected ? 'text-indigo-700' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                          <span>{isSelected ? 'Active Theme' : 'Select'}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('customize')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Customize Selected Theme (#{activeThemeDef.indexNumber})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOMIZE TEXT, STYLING & ADVISOR BRANDING */}
          {activeTab === 'customize' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              {/* Theme Summary Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                    Active Theme #{activeThemeDef.indexNumber}
                  </span>
                  <h3 className="text-xs font-extrabold text-indigo-950 truncate">
                    {activeThemeDef.name}
                  </h3>
                  <p className="text-[11px] text-indigo-800 line-clamp-2">
                    {activeThemeDef.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isAiGenerating}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 shrink-0 disabled:opacity-60 active:scale-98 transition-all"
                  title="Generate a completely fresh, unique variation for this topic"
                >
                  {isAiGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>✨ Generate Fresh AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Format Lock & 25 Distinct Color Palettes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Image Aspect Ratio (Strictly 1:1)
                  </label>
                  <div className="p-2.5 rounded-xl text-xs font-bold border border-emerald-500 bg-emerald-50 text-emerald-900 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <span>🖼️ Square Post (1:1)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      1080 × 1080 px
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Theme Color Palette (25 Palettes)
                  </label>
                  <select
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="deep_navy">🌊 #01 Deep Oceanic Navy & Cyan</option>
                    <option value="crimson_ruby">🔴 #02 Velvet Crimson Ruby</option>
                    <option value="charcoal_steel">⚙️ #03 Charcoal Steel & Ice Blue</option>
                    <option value="forest_emerald">🌲 #04 Forest Emerald & Mint</option>
                    <option value="electric_indigo">⚡ #05 Electric Indigo & Violet</option>
                    <option value="cyber_teal">💎 #06 Cyber Nordic Teal</option>
                    <option value="imperial_gold">👑 #07 Imperial Amber Gold</option>
                    <option value="sunset_amber">🌅 #08 Sunset Amber & Tangerine</option>
                    <option value="jade_contrast">🍃 #09 Jade Contrast & Pine</option>
                    <option value="sapphire_blue">🔷 #10 Royal Sapphire Blue</option>
                    <option value="obsidian_purple">🔮 #11 Obsidian Twilight Amethyst</option>
                    <option value="burgundy_wine">🍷 #12 Bordeaux Burgundy Wine</option>
                    <option value="danger_vermilion">🚨 #13 Alert Vermilion & Crimson</option>
                    <option value="atlantic_cyan">🌊 #14 Atlantic Cyan & Slate</option>
                    <option value="luxurious_bronze">🏛️ #15 Luxurious Bronze & Champagne</option>
                    <option value="pacific_ocean">🏝️ #16 Pacific Ocean Turquoise</option>
                    <option value="amethyst_twilight">🌌 #17 Twilight Orchid Amethyst</option>
                    <option value="carbon_monochrome">⬛ #18 Technical Carbon & Platinum</option>
                    <option value="cosmic_slate">🌠 #19 Cosmic Cobalt Slate</option>
                    <option value="evergreen_moss">🌿 #20 Highland Evergreen & Lime</option>
                    <option value="warm_copper">🍂 #21 Warm Copper & Roasted Ochre</option>
                    <option value="scarlet_flame">🔥 #22 Scarlet Neon Flame</option>
                    <option value="polar_iceberg">🧊 #23 Polar Iceberg Depth</option>
                    <option value="plum_velvet">🍇 #24 Royal Plum Velvet</option>
                    <option value="emerald_crown">❇️ #25 British Racing Emerald</option>
                  </select>
                </div>
              </div>

              {/* Language Selection in Customize Tab */}
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Content Language</span>
                    <span className="text-[10px] text-slate-500">Switching regenerates copy in this language</span>
                  </div>
                </div>
                <select
                  value={contentLanguage}
                  onChange={(e) => handleSelectLanguage(e.target.value as LanguageCode)}
                  className="text-xs font-bold py-1.5 px-3 rounded-lg border border-indigo-200 bg-white text-indigo-900 shadow-2xs focus:ring-1 focus:ring-indigo-500"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.label})
                    </option>
                  ))}
                </select>
              </div>

              {/* Background Art Generator */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Procedural Art Background</span>
                    <span className="text-[10px] text-slate-500 block">Seed #{backgroundSeed}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBackgroundSeed((prev) => prev + Math.floor(Math.random() * 800) + 1)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center space-x-1 shadow-2xs"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>🎲 Randomize Background</span>
                </button>
              </div>

              {/* Editable Text Fields */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Poster Text Customization
                </h4>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={themeData.headline}
                    onChange={(e) => setThemeData({ ...themeData, headline: e.target.value })}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                    Supporting Subheadline
                  </label>
                  <input
                    type="text"
                    value={themeData.subheadline}
                    onChange={(e) => setThemeData({ ...themeData, subheadline: e.target.value })}
                    className="w-full text-xs font-medium p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      Top Pill Tag
                    </label>
                    <input
                      type="text"
                      value={themeData.badgeText}
                      onChange={(e) => setThemeData({ ...themeData, badgeText: e.target.value })}
                      className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      Call To Action (CTA)
                    </label>
                    <input
                      type="text"
                      value={themeData.ctaText}
                      onChange={(e) => setThemeData({ ...themeData, ctaText: e.target.value })}
                      className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Advisor Branding on the Poster */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advisor Branding on Image</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Protected Footer Safe Zone
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
                      className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white"
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
                      className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      Professional Role / Title
                    </label>
                    <input
                      type="text"
                      value={advisorDesignation}
                      onChange={(e) => setAdvisorDesignation(e.target.value)}
                      className="w-full text-xs font-bold p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                      Milestone / Achievement Line
                    </label>
                    <input
                      type="text"
                      value={advisorAchievement}
                      onChange={(e) => setAdvisorAchievement(e.target.value)}
                      placeholder="e.g. MDRT 2024 • 500+ Families"
                      className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Canvas Preview & High-Res Export */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-100/80 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between w-full max-w-sm mb-2.5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 flex items-center space-x-1.5">
              <span>Theme #{activeThemeDef.indexNumber}: {activeThemeDef.name}</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {isRendering ? 'Rendering...' : 'High-Res Canvas'}
            </span>
          </div>

          {/* Canvas Wrapper - Strictly Square (1:1) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black flex items-center justify-center w-[300px] h-[300px] sm:w-[380px] sm:h-[380px]">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 w-full max-w-sm">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-98 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Square PNG</span>
            </button>

            <button
              type="button"
              onClick={handleMakeVideo}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 active:scale-98 transition-transform"
            >
              <Video className="w-3.5 h-3.5 text-amber-300" />
              <span>Make Video Status 🎬</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3">
            PNG output resolution: 1080 × 1080 px (Square 1:1 format)
          </p>
        </div>
      </div>

      {/* Embedded Video Status Maker Modal */}
      {showVideoMaker && exportedCanvasImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowVideoMaker(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              ✕
            </button>
            <VideoStatusMaker
              initialImageSrc={exportedCanvasImage}
              defaultTitle={`${activeThemeDef.name} - ${activeSubjectTitle}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
