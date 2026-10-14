import React, { useState, useMemo } from 'react';
import {
  Vote,
  Sparkles,
  Copy,
  Check,
  Share2,
  ExternalLink,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Eye,
  Layers,
  History,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  ALL_50_POLL_TOPICS,
  POLL_CATEGORIES,
  POLL_TYPES,
  PollCategoryMeta,
  PollTypeMeta,
} from '../../constants/financePollTopics';
import {
  FinancePollTopic,
  GeneratedPoll,
  PollCategory,
  PollType,
  SavedPollRecord,
} from '../../types/financePoll';
import {
  generatePoll,
} from '../../services/financePollService';
import {
  buildShareableMessage,
  getSavedPollHistory,
} from '../../utils/financePollEngine';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const FinancePollView: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const { profile } = useAdvisor();

  // Selection states
  const [selectedCategory, setSelectedCategory] = useState<PollCategory>('personal_finance');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('personal_financial_planning');
  const [selectedPollType, setSelectedPollType] = useState<PollType>('awareness');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [includeAdvisorBranding, setIncludeAdvisorBranding] = useState<boolean>(true);

  // Generation & Display states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPoll, setGeneratedPoll] = useState<GeneratedPoll | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI Tabs for Output (Output A, B, C or All)
  const [activeTab, setActiveTab] = useState<'all' | 'outputA' | 'outputB' | 'outputC'>('all');

  // Copy feedback tracking
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Collapsible private advisor key
  const [showAdvisorKey, setShowAdvisorKey] = useState<boolean>(false);

  // Saved history modal
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<SavedPollRecord[]>([]);

  // Translations helper
  const isGu = language === 'gu';
  const isHi = language === 'hi';

  // Filter topics by selected category and search query
  const filteredTopics = useMemo(() => {
    return ALL_50_POLL_TOPICS.filter((topic) => {
      const matchCategory = topic.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        topic.num.toString().includes(q) ||
        topic.title.toLowerCase().includes(q) ||
        (topic.titleGu && topic.titleGu.toLowerCase().includes(q)) ||
        (topic.titleHi && topic.titleHi.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  // Current topic object
  const currentTopic = useMemo(() => {
    return (
      ALL_50_POLL_TOPICS.find((t) => t.id === selectedTopicId) ||
      ALL_50_POLL_TOPICS[0]
    );
  }, [selectedTopicId]);

  // When category changes, auto-select first topic in that category
  const handleCategoryChange = (cat: PollCategory) => {
    setSelectedCategory(cat);
    const firstInCat = ALL_50_POLL_TOPICS.find((t) => t.category === cat);
    if (firstInCat) {
      setSelectedTopicId(firstInCat.id);
    }
  };

  // Copy helper with visual toast feedback
  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  // Generate Poll Handler
  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const result = await generatePoll({
        topic: currentTopic,
        category: selectedCategory,
        pollType: selectedPollType,
        language,
        advisorProfile: includeAdvisorBranding ? profile : undefined,
        clientName: clientName.trim() || undefined,
      });

      setGeneratedPoll(result);
    } catch (err: any) {
      console.error('Failed to generate poll:', err);
      setErrorMessage(
        isGu
          ? 'પોલ જનરેટ કરવામાં તકલીફ પડી. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : isHi
          ? 'पोल जनरेट करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Failed to generate poll. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Native device share
  const handleNativeShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: generatedPoll ? generatedPoll.topicTitle : 'Finance Poll',
          text,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopy(text, 'shareable-msg');
    }
  };

  // Open history modal
  const handleOpenHistory = () => {
    const list = getSavedPollHistory();
    setHistoryList(list);
    setShowHistoryModal(true);
  };

  // Restore poll from history
  const handleRestoreFromHistory = (rec: SavedPollRecord) => {
    setGeneratedPoll(rec.poll);
    setSelectedCategory(rec.poll.category);
    setSelectedTopicId(rec.poll.topicId);
    setSelectedPollType(rec.poll.pollType);
    setShowHistoryModal(false);
  };

  // Dynamic shareable message with toggleable advisor branding
  const displayShareableMessage = useMemo(() => {
    if (!generatedPoll) return '';
    return buildShareableMessage(
      {
        questionText: generatedPoll.questionText,
        options: generatedPoll.options,
        topicTitle: generatedPoll.topicTitle,
        topicNum: generatedPoll.topicNum,
        pollTypeLabel: generatedPoll.pollTypeLabel,
        pollType: generatedPoll.pollType,
      },
      includeAdvisorBranding ? profile : undefined,
      language
    );
  }, [generatedPoll, includeAdvisorBranding, profile, language]);

  return (
    <div className="space-y-6 pb-20 md:pb-12 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5" />
                {isGu ? 'વોટ્સએપ પોલ જનરેટર' : isHi ? 'व्हाट्सएप पोल जनरेटर' : 'WhatsApp Poll Studio'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                50 TOPICS · 6 CATEGORIES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isGu
                ? 'ફાયનાન્સ પોલ જનરેટર'
                : isHi
                ? 'फाइनेंस पोल जनरेटर'
                : 'Finance Poll Generator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isGu
                ? 'તમામ ૫૦ માન્ય વિષયો પર ગ્રાહકો માટે ઇન્ટરેક્ટિવ WhatsApp પોલ, તૈયાર મેસેજ અને ચોક્કસ સ્ટેપ-બાય-સ્ટેપ ગાઇડ બનાવો.'
                : isHi
                ? 'सभी 50 स्वीकृत विषयों पर ग्राहकों के लिए इंटरैक्टिव व्हाट्सएप पोल, तैयार संदेश और सटीक स्टेप-बाय-स्टेप गाइड बनाएं।'
                : 'Generate high-engagement WhatsApp Polls, shareable broadcast messages, and context-aware creation guides across all 50 approved finance topics.'}
            </p>
          </div>

          {/* Quick Actions & Language Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenHistory}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-xs font-medium text-slate-200 border border-white/15 transition-all flex items-center gap-1.5 shadow-sm"
              title="View previous generated polls"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>{isGu ? 'પોલ ઇતિહાસ' : isHi ? 'पोल इतिहास' : 'Poll History'}</span>
            </button>

            {/* Language Quick Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              {SUPPORTED_LANGUAGES.slice(0, 3).map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    language === l.code
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l.nativeLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Step 1: Configuration Matrix */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">
              {isGu
                ? 'પોલ વિષય અને પ્રકાર પસંદ કરો'
                : isHi
                ? 'पोल विषय और प्रकार चुनें'
                : 'Configure Your Finance Poll'}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {isGu ? '૫૦ માન્ય વિષયો' : isHi ? '50 स्वीकृत विषय' : '50 Approved Topics'}
          </span>
        </div>

        {/* 6 Category Pills */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {isGu ? 'કેટેગરી પસંદ કરો (૬ શ્રેણીઓ)' : isHi ? 'श्रेणी चुनें (6 श्रेणियां)' : 'Select Category (6 Categories)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {POLL_CATEGORIES.map((cat: PollCategoryMeta) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-indigo-600 block mb-1">
                    {cat.range}
                  </span>
                  <span className="text-xs font-bold line-clamp-2 leading-tight">
                    {isGu ? cat.nameGu : isHi ? cat.nameHi : cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Selector & Search */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {isGu ? 'વિષય પસંદ કરો' : isHi ? 'विषय चुनें' : 'Select Finance Topic'}
            </label>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isGu ? 'વિષય શોધો...' : isHi ? 'विषय खोजें...' : 'Filter topics...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/40">
            {filteredTopics.map((t: FinancePollTopic) => {
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500 text-indigo-950'
                      : 'bg-white/80 border-slate-200 hover:bg-white text-slate-800'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {t.num}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">
                      {isGu ? t.titleGu : isHi ? t.titleHi : t.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 10 Poll Types Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {isGu ? 'પોલ પ્રકાર (૧૦ પ્રકારો)' : isHi ? 'पोल का प्रकार (10 प्रकार)' : 'Select Poll Type (10 Varieties)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {POLL_TYPES.map((pt: PollTypeMeta) => {
              const isSelected = selectedPollType === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPollType(pt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-400/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : pt.isSingleAnswerExpected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pt.isSingleAnswerExpected
                        ? isGu ? 'સાચો જવાબ' : isHi ? 'सही उत्तर' : 'Single Answer'
                        : isGu ? 'ઓપિનિયન' : isHi ? 'राय/पसंद' : 'Opinion'}
                    </span>
                  </div>
                  <p className="text-xs font-bold leading-tight line-clamp-2">
                    {isGu ? pt.labelGu : isHi ? pt.labelHi : pt.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Client Name & Advisor Signature Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder={isGu ? 'ક્લાયન્ટનું નામ (વૈકલ્પિક)' : isHi ? 'क्लाइंट का नाम (वैकल्पिक)' : 'Client name (optional)'}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white w-full sm:w-56 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-medium shrink-0">
              <input
                type="checkbox"
                checked={includeAdvisorBranding}
                onChange={(e) => setIncludeAdvisorBranding(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500"
              />
              <span>{isGu ? 'એડવાઈઝર બ્રાન્ડિંગ સામેલ કરો' : isHi ? 'सलाहकार ब्रांडिंग शामिल करें' : 'Include Advisor Signature'}</span>
            </label>
          </div>

          {/* Primary Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isGu ? 'જનરેટ થઈ રહ્યું છે...' : isHi ? 'जनरेट हो रहा है...' : 'Generating Poll...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isGu ? 'પોલ જનરેટ કરો' : isHi ? 'पोल जनरेट करें' : 'Generate Poll'}</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* 3. Output Section: 3 Synchronized Outputs */}
      {generatedPoll ? (
        <div className="space-y-6">
          {/* Synchronized Header Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                  #{generatedPoll.topicNum}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {generatedPoll.topicTitle}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  {generatedPoll.pollTypeLabel}
                </span>
                {generatedPoll.isKnowledgeOrCalculation ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {isGu ? '૧૦૦% સચોટ ગણિત' : isHi ? 'सत्यापित गणित' : 'Verified Single Answer'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-medium flex items-center gap-1">
                    <Vote className="w-3 h-3" />
                    {isGu ? 'ગ્રાહક પ્રાથમિકતા પોલ' : isHi ? 'ग्राहक पसंद पोल' : 'Customer Preference Poll'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isGu
                  ? 'નીચેના ત્રણેય આઉટપુટ એક જ પ્રશ્ન અને વિકલ્પો સાથે 100% સુમેળ (Synchronized) ધરાવે છે.'
                  : isHi
                  ? 'नीचे दिए गए तीनों आउटपुट एक ही प्रश्न और विकल्पों के साथ 100% सिंक्रोनाइज़्ड हैं।'
                  : 'All three outputs below refer strictly to the same poll question and options.'}
              </p>
            </div>

            {/* Generate Another Poll Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGu ? 'બીજો નવો પોલ જનરેટ કરો' : isHi ? 'दूसरा नया पोल बनाएं' : 'Generate Another Poll'}</span>
            </button>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isGu ? 'ત્રણેય આઉટપુટ સાથે જુઓ (All)' : isHi ? 'तीनों आउटपुट एक साथ देखें' : 'View All 3 Synchronized Outputs'}
            </button>
            <button
              onClick={() => setActiveTab('outputA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'outputA'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              {isGu ? 'આઉટપુટ A: શેર કરવા યોગ્ય મેસેજ' : isHi ? 'आउटपुट A: शेयर योग्य संदेश' : 'Output A: Shareable Message'}
            </button>
            <button
              onClick={() => setActiveTab('outputB')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'outputB'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              {isGu ? 'આઉટપુટ B: નેટિવ WhatsApp પોલ' : isHi ? 'आउटपुट B: नेटिव व्हाट्सएप पोल' : 'Output B: Native WhatsApp Poll'}
            </button>
            <button
              onClick={() => setActiveTab('outputC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'outputC'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              {isGu ? 'આઉટપુટ C: ક્રિએશન ગાઇડ' : isHi ? 'आउटपुट C: निर्माण गाइड' : 'Output C: Creation Guide'}
            </button>
          </div>

          {/* Grid Layout of Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* OUTPUT A: Ready-to-Forward Shareable Message */}
            {(activeTab === 'all' || activeTab === 'outputA') && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                      A
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isGu ? 'તૈયાર ફોરવર્ડ મેસેજ' : isHi ? 'शेयर योग्य संदेश' : 'Ready-to-Forward Message'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Output A
                  </span>
                </div>

                {/* WhatsApp Chat Preview Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto select-all shadow-inner">
                  {displayShareableMessage}
                </div>

                {/* Output A Action Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(displayShareableMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isGu ? 'WhatsApp પર શેર' : isHi ? 'व्हाट्सएप शेयर' : 'Share on WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => handleCopy(displayShareableMessage, 'shareable-msg')}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      {copiedKey === 'shareable-msg' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isGu ? 'કોપી થયું!' : isHi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isGu ? 'મેસેજ કોપી કરો' : isHi ? 'संदेश कॉपी करें' : 'Copy Message'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleNativeShare(displayShareableMessage)}
                      className="text-xs text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1 py-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isGu ? 'ડિવાઇસ શેરિંગ' : isHi ? 'डिवाइस शेयरिंग' : 'Device Share'}</span>
                    </button>

                    <button
                      onClick={handleGenerate}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 py-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{isGu ? 'બીજો નવો બનાવો' : isHi ? 'नया बनाएं' : 'Generate Another'}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    {isGu
                      ? 'WhatsApp માં તમે જાતે પ્રાપ્તકર્તા પસંદ કરો છો. FinAdvisor Pro ક્યારેય આપમેળે મેસેજ મોકલતું નથી.'
                      : isHi
                      ? 'WhatsApp में आप स्वयं प्राप्तकर्ता चुनते हैं। यह प्रणाली कभी भी स्वतः संदेश नहीं भेजती।'
                      : 'You manually choose the chat in WhatsApp. FinAdvisor Pro never sends messages automatically.'}
                  </p>
                </div>
              </div>
            )}

            {/* OUTPUT B: Native WhatsApp Poll Content */}
            {(activeTab === 'all' || activeTab === 'outputB') && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                      B
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isGu ? 'નેટિવ WhatsApp પોલ કન્ટેન્ટ' : isHi ? 'नेटिव व्हाट्सएप पोल सामग्री' : 'Native WhatsApp Poll'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Output B
                  </span>
                </div>

                {/* 1. Poll Question Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {isGu ? 'પોલ પ્રશ્ન (Question)' : isHi ? 'पोल का प्रश्न' : 'Poll Question'}
                    </span>
                    <button
                      onClick={() => handleCopy(generatedPoll.outputB_NativePoll.question, 'q-only')}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 shadow-2xs"
                    >
                      {copiedKey === 'q-only' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">{isGu ? 'કોપી થયું!' : isHi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isGu ? 'Copy Question' : isHi ? 'Copy Question' : 'Copy Question'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 leading-snug">
                    {generatedPoll.outputB_NativePoll.question}
                  </p>
                </div>

                {/* 2. Options List with Individual Copy Buttons */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isGu ? 'વ્યક્તિગત વિકલ્પો (Individual Options)' : isHi ? 'प्रत्येक विकल्प' : 'Individual Options'}
                  </span>
                  {generatedPoll.outputB_NativePoll.options.map((opt, idx) => {
                    const optKey = `opt-${idx}`;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-800 truncate">{opt}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(opt, optKey)}
                          className="px-2 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center gap-1 shrink-0 shadow-2xs"
                          title="Copy this single option for WhatsApp"
                        >
                          {copiedKey === optKey ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Done</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{`Copy ${idx + 1}`}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Output B Multi-Copy Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopy(generatedPoll.outputB_NativePoll.allOptionsJoined, 'all-opts')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedKey === 'all-opts' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isGu ? 'કોપી થયા!' : isHi ? 'कॉपी हुए!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy All Options</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(generatedPoll.outputB_NativePoll.completePollContent, 'complete-poll')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      {copiedKey === 'complete-poll' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isGu ? 'કોપી થયું!' : isHi ? 'कॉपी हुआ!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Copy Full Poll</span>
                        </>
                      )}
                    </button>
                  </div>

                  <a
                    href="https://web.whatsapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isGu ? 'WhatsApp ઓપન કરો' : isHi ? 'WhatsApp खोलें' : 'Open WhatsApp'}</span>
                  </a>

                  <p className="text-[10px] text-slate-400 italic">
                    {isGu
                      ? 'WhatsApp આપોઆપ પોલ બનાવતું નથી. Output C માં આપેલી સરળ ૯ સ્ટેપની ગાઇડ અનુસરો.'
                      : isHi
                      ? 'WhatsApp अपने आप पोल नहीं बनाता। Output C में दिए गए 9 चरणों का पालन करें।'
                      : 'WhatsApp does not automatically create native polls. Follow the 9 steps in Output C.'}
                  </p>
                </div>
              </div>
            )}

            {/* OUTPUT C: Context-Aware Creation Guide */}
            {(activeTab === 'all' || activeTab === 'outputC') && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                      C
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isGu ? 'WhatsApp પોલ ક્રિએશન ગાઇડ' : isHi ? 'व्हाट्सएप पोल निर्माण गाइड' : 'WhatsApp Creation Guide'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                    Output C
                  </span>
                </div>

                {/* Multiple Answer Toggle Rule Badge */}
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    generatedPoll.isKnowledgeOrCalculation
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-blue-50/80 border-blue-200 text-blue-900'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-semibold text-[11px] leading-relaxed">
                    {generatedPoll.outputC_CreationGuide.allowMultipleRule}
                  </p>
                </div>

                {/* Numbered Step-by-Step Instructions (1 to 9) */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {generatedPoll.outputC_CreationGuide.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-snug">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 italic">
                  {generatedPoll.outputC_CreationGuide.notes}
                </div>
              </div>
            )}
          </div>

          {/* 4. Advisor Private Verification & Answer Key (Hidden by default, expandable) */}
          {generatedPoll.isKnowledgeOrCalculation && (
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-3">
              <button
                onClick={() => setShowAdvisorKey(!showAdvisorKey)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">
                      {isGu
                        ? '🎓 સત્તાવાર સાચો જવાબ અને વિગતવાર ગણતરી (માત્ર સલાહકાર માટે)'
                        : isHi
                        ? '🎓 आधिकारिक सही उत्तर और विस्तृत गणित (केवल सलाहकार हेतु)'
                        : '🎓 Advisor Verified Answer Key & Math Rationale (Private)'}
                    </h3>
                    <p className="text-[11px] text-emerald-700">
                      {isGu
                        ? 'આ વિગત જાહેર પોલમાં ન મોકલવી. ગ્રાહકો મત આપે તે પછી વ્યક્તિગત ચર્ચામાં ઉપયોગ કરો.'
                        : isHi
                        ? 'यह विवरण सार्वजनिक पोल में न भेजें। ग्राहकों के उत्तर देने के बाद चर्चा में उपयोग करें।'
                        : 'Private reference for advisor consultation. Keep separate from public-facing poll options.'}
                    </p>
                  </div>
                </div>
                {showAdvisorKey ? (
                  <ChevronUp className="w-5 h-5 text-emerald-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-emerald-700" />
                )}
              </button>

              {showAdvisorKey && (
                <div className="pt-3 border-t border-emerald-200/80 space-y-3 text-xs text-slate-800">
                  {typeof generatedPoll.correctIndex === 'number' && (
                    <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-xs flex items-center justify-between">
                      <span className="font-bold text-slate-700">
                        {isGu ? 'સાચો વિકલ્પ:' : isHi ? 'सही विकल्प:' : 'Verified Correct Option:'}
                      </span>
                      <span className="font-extrabold text-emerald-700">
                        Option {String.fromCharCode(65 + generatedPoll.correctIndex)}:{' '}
                        {generatedPoll.options[generatedPoll.correctIndex]}
                      </span>
                    </div>
                  )}

                  {generatedPoll.stepByStepCalculations && (
                    <div className="space-y-1.5 p-3 rounded-xl bg-white border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-1">
                        {isGu ? 'ગણતરીના સ્ટેપ્સ:' : isHi ? 'कैलकुलेशन चरण:' : 'Deterministic Calculation Steps:'}
                      </span>
                      {generatedPoll.stepByStepCalculations.map((step, idx) => (
                        <p key={idx} className="font-mono text-[11px] text-slate-700 pl-2 border-l-2 border-emerald-400">
                          {step}
                        </p>
                      ))}
                    </div>
                  )}

                  {generatedPoll.explanation && (
                    <div className="p-3 rounded-xl bg-white border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-1">
                        {isGu ? 'સમજૂતી (Rationale):' : isHi ? 'स्पष्टीकरण:' : 'Detailed Explanation:'}
                      </span>
                      <p className="text-slate-700 leading-relaxed">{generatedPoll.explanation}</p>
                    </div>
                  )}

                  {generatedPoll.educationalTakeaway && (
                    <div className="p-3 rounded-xl bg-emerald-600 text-white font-medium flex items-start gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-xs">
                          {isGu ? 'મુખ્ય નાણાકીય શિસ્ત (Takeaway):' : isHi ? 'मुख्य सीख:' : 'Key Financial Takeaway:'}
                        </span>
                        <p className="text-emerald-100 text-[11px] mt-0.5">
                          {generatedPoll.educationalTakeaway}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty State before Generation */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
            <Vote className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              {isGu
                ? 'કોઈપણ વિષય પસંદ કરી "Generate Poll" પર ક્લિક કરો'
                : isHi
                ? 'कोई भी विषय चुनकर "Generate Poll" पर क्लिक करें'
                : 'Select Your Settings & Click Generate Poll'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isGu
                ? 'તમારી પસંદગી મુજબ તાજો, ગણતરીબદ્ધ અને ત્રણ સુમેળ ધરાવતા આઉટપુટ સાથેનો પોલ AI દ્વારા તરત જ તૈયાર થશે.'
                : isHi
                ? 'आपकी पसंद के अनुसार नया, गणना-सत्यापित और तीन सिंक्रोनाइज़्ड आउटपुट वाला पोल तुरंत तैयार होगा।'
                : 'Fresh content will be dynamically generated only after you configure your parameters. No preloaded polls.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGu ? 'પોલ શરૂ કરો' : isHi ? 'पोल शुरू करें' : 'Generate First Poll'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Saved Poll History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isGu ? 'અગાઉ જનરેટ કરેલા પોલ' : isHi ? 'पहले बनाए गए पोल' : 'Generated Poll History'}
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded-lg hover:bg-slate-100"
              >
                ✕ Close
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {historyList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  {isGu ? 'હજુ સુધી કોઈ પોલ સેવ થયો નથી.' : isHi ? 'अभी तक कोई पोल सहेजा नहीं गया है।' : 'No saved polls found in history.'}
                </div>
              ) : (
                historyList.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          #{rec.topicNum}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {rec.topicTitle}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rec.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {rec.poll.questionText}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRestoreFromHistory(rec)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 transition-all shadow-2xs"
                    >
                      {isGu ? 'લોડ કરો' : isHi ? 'लोड करें' : 'Load Poll'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
