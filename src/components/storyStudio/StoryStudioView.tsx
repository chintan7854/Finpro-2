import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  Sparkles,
  Search,
  Share2,
  Copy,
  Check,
  Bookmark,
  TrendingUp,
  Zap,
  BarChart3,
  Coins,
  Flame,
  Building,
  Gem,
  PieChart,
  ShieldCheck,
  HeartPulse,
  ShieldAlert,
  LifeBuoy,
  Scale,
  Activity,
  GraduationCap,
  Sunset,
  Wallet,
  Landmark,
  Mailbox,
  Users,
  Home,
  CreditCard,
  Key,
  Gauge,
  Calculator,
  ShoppingBag,
  Receipt,
  FileText,
  ScrollText,
  Eye,
  Trophy,
  ClockAlert,
  GitCompare,
  HeartHandshake,
  Briefcase,
  Baby,
  UserCheck,
  Store,
  Heart,
  CheckCircle2,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Trash2,
  X,
  MessageSquare,
} from 'lucide-react';
import {
  StoryFinancialTopicId,
  StoryAngleId,
  StoryPersonaId,
  StoryLengthId,
  StoryCtaStrategyId,
  GeneratedStoryResult,
  StoryLibraryItem,
} from '../../types/storyStudio';
import {
  getStoryStudioI18n,
  STORY_TOPICS_METADATA,
  STORY_ANGLES_METADATA,
  STORY_PERSONAS_METADATA,
  STORY_LENGTHS_METADATA,
  STORY_CTAS_METADATA,
} from '../../i18n/storyStudioI18n';
import { generateViralStory } from '../../services/storyStudioGenerator';

const STORAGE_KEY_STORY_LIBRARY = 'my_content_library';

export const StoryStudioView: React.FC = () => {
  const { language } = useI18n();
  const { profile, saveContent } = useAdvisor();

  // Reactive Localization object strictly mapped to active language
  const t = useMemo(() => getStoryStudioI18n(language), [language]);

  // Form State
  const [selectedTopic, setSelectedTopic] = useState<StoryFinancialTopicId>('sip_wealth');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedAngle, setSelectedAngle] = useState<StoryAngleId>('duo_journey');
  const [selectedPersona, setSelectedPersona] = useState<StoryPersonaId>('young_pros');
  const [selectedLength, setSelectedLength] = useState<StoryLengthId>('standard');
  const [selectedCta, setSelectedCta] = useState<StoryCtaStrategyId>('viral_forward');

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStory, setCurrentStory] = useState<GeneratedStoryResult | null>(null);
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [savedState, setSavedState] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'whatsapp' | 'clean'>('whatsapp');

  // Library Drawer State
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [savedLibrary, setSavedLibrary] = useState<StoryLibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORY_LIBRARY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse story library', e);
    }
    return [];
  });

  // Persist library
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORY_LIBRARY, JSON.stringify(savedLibrary));
    } catch (e) {
      console.warn('Failed to save story library', e);
    }
  }, [savedLibrary]);

  // Topic Icons Resolver
  const getTopicIcon = (iconName: string) => {
    const iconClass = 'w-4 h-4 shrink-0';
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'BarChart3': return <BarChart3 className={iconClass} />;
      case 'Coins': return <Coins className={iconClass} />;
      case 'Flame': return <Flame className={iconClass} />;
      case 'Building': return <Building className={iconClass} />;
      case 'Gem': return <Gem className={iconClass} />;
      case 'PieChart': return <PieChart className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'HeartPulse': return <HeartPulse className={iconClass} />;
      case 'ShieldAlert': return <ShieldAlert className={iconClass} />;
      case 'LifeBuoy': return <LifeBuoy className={iconClass} />;
      case 'Scale': return <Scale className={iconClass} />;
      case 'Activity': return <Activity className={iconClass} />;
      case 'GraduationCap': return <GraduationCap className={iconClass} />;
      case 'Sparkles': return <Sparkles className={iconClass} />;
      case 'Sunset': return <Sunset className={iconClass} />;
      case 'Wallet': return <Wallet className={iconClass} />;
      case 'Landmark': return <Landmark className={iconClass} />;
      case 'Mailbox': return <Mailbox className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'Home': return <Home className={iconClass} />;
      case 'CreditCard': return <CreditCard className={iconClass} />;
      case 'Key': return <Key className={iconClass} />;
      case 'Gauge': return <Gauge className={iconClass} />;
      case 'Calculator': return <Calculator className={iconClass} />;
      case 'ShoppingBag': return <ShoppingBag className={iconClass} />;
      case 'Receipt': return <Receipt className={iconClass} />;
      case 'FileText': return <FileText className={iconClass} />;
      case 'ScrollText': return <ScrollText className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  // Filtered topics list based on category & search
  const filteredTopics = useMemo(() => {
    return STORY_TOPICS_METADATA.filter((topic) => {
      // Category match
      if (selectedCategory !== 'all' && topic.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const localized = t.topics[topic.id];
        const matchTitle = localized?.title.toLowerCase().includes(q) || false;
        const matchSubtitle = localized?.subtitle.toLowerCase().includes(q) || false;
        const matchId = topic.id.toLowerCase().includes(q);
        return matchTitle || matchSubtitle || matchId;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, t.topics]);

  // Handle Generate Action
  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setCopiedState(false);
    setSavedState(false);

    try {
      const activeTopicData = t.topics[selectedTopic];
      const activeAngleData = t.angles[selectedAngle];
      const activePersonaData = t.personas[selectedPersona];
      const activeCtaData = t.ctas[selectedCta];

      const result = await generateViralStory({
        topicId: selectedTopic,
        topicTitle: activeTopicData?.title || selectedTopic,
        angleId: selectedAngle,
        angleTitle: activeAngleData?.title || selectedAngle,
        personaId: selectedPersona,
        personaTitle: activePersonaData?.title || selectedPersona,
        lengthId: selectedLength,
        ctaStrategyId: selectedCta,
        ctaTitle: activeCtaData?.title || selectedCta,
        language,
        advisorProfile: profile,
      });

      setCurrentStory(result);

      // Check if already in saved library
      const exists = savedLibrary.some((item) => item.id === result.id);
      setSavedState(exists);

      // Scroll to result smoothly
      setTimeout(() => {
        const resultEl = document.getElementById('story-result-card');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err) {
      console.error('Failed to generate story', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Click WhatsApp Share Action
  const handleShareToWhatsApp = () => {
    if (!currentStory) return;
    const textPayload = currentStory.fullFormattedPayload;
    const encoded = encodeURIComponent(textPayload);
    const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;

    // Attempt direct window open; mobile browsers automatically route to WhatsApp app
    const opened = window.open(webUrl, '_blank');
    if (!opened) {
      // Fallback for mobile native scheme
      window.location.href = `whatsapp://send?text=${encoded}`;
    }
  };

  // 1-Click Copy Text Action
  const handleCopyText = () => {
    if (!currentStory) return;
    navigator.clipboard.writeText(currentStory.fullFormattedPayload);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Save to My Content Action
  const handleSaveToMyContent = () => {
    if (!currentStory) return;

    // 1. Add to my_content_library in localStorage
    const libraryItem: StoryLibraryItem = {
      id: currentStory.id,
      title: currentStory.title,
      topicId: currentStory.topicId,
      topicLabel: t.topics[currentStory.topicId]?.title || currentStory.topicId,
      language: currentStory.language,
      languageLabel: language,
      lengthId: currentStory.lengthId,
      createdAt: currentStory.createdAt,
      payload: currentStory.fullFormattedPayload,
      result: currentStory,
    };

    setSavedLibrary((prev) => [libraryItem, ...prev.filter((i) => i.id !== currentStory.id)]);
    setSavedState(true);

    // 2. Also save to general AdvisorContext so it seamlessly appears in "My Content" view
    try {
      saveContent({
        id: currentStory.id,
        subjectId: currentStory.topicId as any,
        subjectTitle: t.topics[currentStory.topicId]?.title || currentStory.topicId,
        contentType: 'whatsapp',
        articleLength: currentStory.lengthId === 'deep' ? 'long' : currentStory.lengthId === 'short' ? 'short' : 'medium',
        audience: 'general_public',
        contentLanguage: currentStory.language,
        createdAt: currentStory.createdAt,
        isFavorite: false,
        isSaved: true,
        generationSource: currentStory.source === 'ai_api' ? 'ai_api' : 'demo_engine',
        appliedDisclaimer: '',
        deepArticle: {
          headline: currentStory.title,
          subheadline: currentStory.hook,
          body: currentStory.storyParagraphs.join('\n\n'),
          keyTakeaways: currentStory.takeaways,
          readTime: currentStory.lengthId === 'deep' ? '4 min read' : '2 min read',
        },
        whatsappStatus: {
          slide1: currentStory.hook,
          slide2: currentStory.storyParagraphs[0] || '',
          slide3: currentStory.ctaSignature,
        },
        whatsappMessage: currentStory.fullFormattedPayload,
        socialMedia: {
          postHook: currentStory.hook,
          platformCaption: currentStory.storyParagraphs.join('\n\n'),
          hashtags: ['#FinancialWisdom', '#WealthPlanning', '#InvestmentAdvisory'],
        },
        videoScript: {
          title: currentStory.title,
          hook: currentStory.hook,
          storyPoints: currentStory.takeaways,
          callToAction: currentStory.forwardAppeal,
          durationEstimate: '60 seconds',
        },
        financialInsights: {
          statHighlight: currentStory.takeaways[0] || 'Discipline creates wealth.',
          actionableRule: currentStory.forwardAppeal,
          comparisonNote: currentStory.ctaSignature,
        },
        appliedCta: currentStory.ctaSignature,
        advisorSnapshot: {
          name: profile.advisorName,
          designation: profile.designation,
          contact: profile.phoneNumber,
          whatsapp: profile.phoneNumber,
          credentials: profile.professionalDetails,
        },
      });
    } catch (e) {
      console.warn('Could not sync to main advisor content', e);
    }
  };

  // Delete an item from the library
  const handleDeleteFromLibrary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedLibrary((prev) => prev.filter((item) => item.id !== id));
  };

  // Load a saved story from the library into view
  const handleLoadSavedStory = (item: StoryLibraryItem) => {
    setCurrentStory(item.result);
    setSelectedTopic(item.topicId);
    setSelectedLength(item.lengthId);
    setShowLibraryModal(false);
    setSavedState(true);
    setTimeout(() => {
      const resultEl = document.getElementById('story-result-card');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // Word count helper
  const wordCount = useMemo(() => {
    if (!currentStory) return 0;
    const text = currentStory.storyParagraphs.join(' ') + ' ' + currentStory.hook;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [currentStory]);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* -------------------------------------------------------------
          HEADER BANNER: Emerald-Accent Glassmorphism Styling
      ------------------------------------------------------------- */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-2xl border border-emerald-500/30">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{t.moduleBadge}</span>
            </div>

            {/* Quick button to view Saved Stories */}
            <button
              onClick={() => setShowLibraryModal(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition-all active:scale-95"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.viewSavedStories}</span>
              {savedLibrary.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                  {savedLibrary.length}
                </span>
              )}
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.moduleTitle}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed">
            {t.moduleDescription}
          </p>

          {/* Quick Badges */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-semibold">
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              30 Core Financial Pillars
            </div>
            <div className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20">
              5 Psychological Angles
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              1-Click WhatsApp Direct
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/10">
              Zero-Token Saved Library
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          FORM GRID: 5 Interactive Controls
      ------------------------------------------------------------- */}
      <div className="space-y-8">
        {/* CONTROL 1: FINANCIAL PILLAR (30 CORE TOPICS) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>{t.sectionPillar}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.sectionPillarDesc}</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPillarPlaceholder}
                className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: t.allCategories },
              { id: 'wealth', label: t.catWealth },
              { id: 'protection', label: t.catProtection },
              { id: 'retirement', label: t.catRetirement },
              { id: 'debt', label: t.catDebt },
              { id: 'tax_estate', label: t.catTaxEstate },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Grid of 30 Topics */}
          {filteredTopics.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No topics match &ldquo;{searchQuery}&rdquo;.
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="ml-2 text-emerald-600 font-bold hover:underline"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredTopics.map((item) => {
                const isSelected = selectedTopic === item.id;
                const localized = t.topics[item.id] || { title: item.id, subtitle: '' };

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTopic(item.id)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-150 flex items-start space-x-3 group ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {getTopicIcon(item.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-emerald-950' : 'text-slate-900'
                        }`}
                      >
                        {localized.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {localized.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* CONTROLS 2 & 3: ANGLE & PERSONA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CONTROL 2: STORY ANGLE & EMOTIONAL HOOK */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                <span>{t.sectionAngle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.sectionAngleDesc}</p>
            </div>

            <div className="space-y-2">
              {STORY_ANGLES_METADATA.map((angle) => {
                const isSelected = selectedAngle === angle.id;
                const localized = t.angles[angle.id] || { title: angle.id, desc: '' };

                return (
                  <button
                    key={angle.id}
                    onClick={() => setSelectedAngle(angle.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {angle.id === 'reality_check' ? <Eye className="w-4 h-4" /> :
                       angle.id === 'inspirational' ? <Trophy className="w-4 h-4" /> :
                       angle.id === 'cost_of_delay' ? <ClockAlert className="w-4 h-4" /> :
                       angle.id === 'duo_journey' ? <GitCompare className="w-4 h-4" /> :
                       <HeartHandshake className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{localized.title}</h4>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{localized.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CONTROL 3: TARGET PERSONA / AUDIENCE */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>{t.sectionPersona}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.sectionPersonaDesc}</p>
            </div>

            <div className="space-y-2">
              {STORY_PERSONAS_METADATA.map((persona) => {
                const isSelected = selectedPersona === persona.id;
                const localized = t.personas[persona.id] || { title: persona.id, ageRange: '', desc: '' };

                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {persona.id === 'young_pros' ? <Briefcase className="w-4 h-4" /> :
                       persona.id === 'parents' ? <Baby className="w-4 h-4" /> :
                       persona.id === 'pre_retirees' ? <UserCheck className="w-4 h-4" /> :
                       persona.id === 'business_owners' ? <Store className="w-4 h-4" /> :
                       <Heart className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-bold text-slate-900">{localized.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold">
                            {localized.ageRange}
                          </span>
                        </div>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{localized.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* CONTROLS 4 & 5: LENGTH & CTA STRATEGY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CONTROL 4: STORY LENGTH & TOKEN CONSTRAINT */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>{t.sectionLength}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.sectionLengthDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {STORY_LENGTHS_METADATA.map((len) => {
                const isSelected = selectedLength === len.id;
                const localized = t.lengths[len.id] || { title: len.id, words: '', desc: '' };

                return (
                  <button
                    key={len.id}
                    onClick={() => setSelectedLength(len.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {len.badge}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-2">{localized.title}</h4>
                      <p className="text-[11px] font-mono font-bold text-emerald-700 mt-0.5">{localized.words}</p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">{localized.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* CONTROL 5: VIRAL CALL-TO-ACTION (CTA) STRATEGY */}
          <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                <span>{t.sectionCta}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.sectionCtaDesc}</p>
            </div>

            <div className="space-y-2">
              {STORY_CTAS_METADATA.map((cta) => {
                const isSelected = selectedCta === cta.id;
                const localized = t.ctas[cta.id] || { title: cta.id, hook: '' };

                return (
                  <button
                    key={cta.id}
                    onClick={() => setSelectedCta(cta.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cta.id === 'viral_forward' ? <Share2 className="w-4 h-4" /> :
                       cta.id === 'portfolio_audit' ? <CheckCircle2 className="w-4 h-4" /> :
                       <MessageCircle className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{localized.title}</h4>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 italic mt-0.5">{localized.hook}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-emerald-400 font-bold flex items-center justify-center sm:justify-start space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Language: {language.toUpperCase()} • Ready to Generate</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {t.advisorSignatureNotice}
            </p>
          </div>

          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? t.generatingButton : t.generateButton}</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          OUTPUT CARD & ACTIONS
      ------------------------------------------------------------- */}
      {currentStory && (
        <section
          id="story-result-card"
          className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          {/* Card Top Banner */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                  {t.previewBadge}
                </span>
                <span className="text-xs text-slate-400">
                  {currentStory.language.toUpperCase()} • {t.wordCountLabel}: ~{wordCount} words
                </span>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setPreviewTab('whatsapp')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    previewTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.formattedPreviewTab}
                </button>
                <button
                  onClick={() => setPreviewTab('clean')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    previewTab === 'clean' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.plainTextTab}
                </button>
              </div>
            </div>

            <h3 className="text-lg sm:text-2xl font-black mt-3 text-white tracking-tight">
              {currentStory.title}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-300 italic mt-1 font-medium">
              &ldquo;{currentStory.hook}&rdquo;
            </p>
          </div>

          {/* Card Content Area */}
          <div className="p-5 sm:p-8">
            {previewTab === 'whatsapp' ? (
              /* Simulated WhatsApp Message Bubble */
              <div className="max-w-2xl mx-auto bg-emerald-50/50 rounded-2xl p-4 sm:p-6 border border-emerald-200/70 shadow-inner space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-slate-800">
                <div className="font-bold text-slate-900 border-b border-emerald-200/80 pb-2">
                  *{currentStory.title.toUpperCase()}* 🚀
                  <div className="font-normal italic text-slate-600 mt-1">_{currentStory.hook}_</div>
                </div>

                <div className="space-y-3">
                  {currentStory.storyParagraphs.map((para, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {currentStory.takeaways && currentStory.takeaways.length > 0 && (
                  <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-950 block">💡 *Key Financial Takeaways:*</span>
                    {currentStory.takeaways.map((point, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-800">
                        <span className="font-bold text-emerald-700 shrink-0">{['1️⃣', '2️⃣', '3️⃣'][idx] || '•'}</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentStory.forwardAppeal && (
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-900 text-xs font-semibold">
                    📲 *{currentStory.forwardAppeal}*
                  </div>
                )}

                {/* Simulated Advisor WhatsApp Signature */}
                <div className="pt-3 border-t border-emerald-200/80 text-xs space-y-1 text-slate-700">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  </div>
                  <div className="font-bold text-slate-900">
                    *{profile.advisorName || 'Financial Wealth Advisor'}*
                  </div>
                  <div className="text-slate-600 italic">
                    _{profile.designation || 'Certified Financial Planner'}_
                  </div>
                  {profile.professionalDetails && (
                    <div className="text-[11px] text-slate-500">
                      📋 {profile.professionalDetails}
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <div className="font-mono text-emerald-700 font-bold">
                      📱 Mobile: {profile.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Clean Reading View */
              <div className="max-w-2xl mx-auto space-y-4 text-sm text-slate-700 leading-relaxed">
                {currentStory.storyParagraphs.map((para, i) => (
                  <p key={i} className="text-base text-slate-800 leading-relaxed">
                    {para}
                  </p>
                ))}

                <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">Key Takeaways</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
                    {currentStory.takeaways.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* DEDICATED BOTTOM ACTION BAR */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              1-Click actions for instant client broadcast & zero-token storage
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* PRIMARY ACTION: Share to WhatsApp */}
              <button
                onClick={handleShareToWhatsApp}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 fill-white" />
                <span>{t.shareWhatsApp}</span>
              </button>

              {/* ACTION: Copy Text */}
              <button
                onClick={handleCopyText}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200/90 shadow-2xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                {copiedState ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{t.copiedSuccess}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>{t.copyText}</span>
                  </>
                )}
              </button>

              {/* ACTION: Save to My Content */}
              <button
                onClick={handleSaveToMyContent}
                disabled={savedState}
                className={`flex-1 sm:flex-none px-4 py-3 rounded-2xl font-bold text-xs shadow-2xs flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer ${
                  savedState
                    ? 'bg-slate-200 text-slate-500 cursor-default'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {savedState ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>{t.alreadySaved}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    <span>{t.saveToLibrary}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------
          MODAL / DRAWER: SAVED STORIES LIBRARY
      ------------------------------------------------------------- */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {t.savedLibraryTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Stored locally in browser for zero-token instant retrieval
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {savedLibrary.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>{t.noSavedStories}</p>
                </div>
              ) : (
                savedLibrary.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadSavedStory(item)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer flex items-start justify-between group shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {item.topicLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.result.hook}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(item.payload);
                          setCopiedState(true);
                          setTimeout(() => setCopiedState(false), 2000);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                        title="Copy Text"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteFromLibrary(item.id, e)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 text-xs transition-colors"
                        title="Delete from Library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowLibraryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
