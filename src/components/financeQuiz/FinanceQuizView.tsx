import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  THE_50_APPROVED_TOPICS,
  QUIZ_CATEGORIES,
} from '../../constants/financeQuizData';
import {
  QuizTopic,
  QuizCategory,
  QuizDifficulty,
  QuizQuestion,
  SavedQuizRecord,
} from '../../types/financeQuiz';
import {
  getPredefinedQuizzes,
  getSavedQuizHistory,
  generateNewAiQuiz,
  buildSeparateQuestionText,
  buildSeparateAnswerText,
} from '../../services/financeQuizService';
import {
  renderVerticalQuestionImage,
  renderVerticalAnswerImage,
  copyCanvasImageToClipboard,
} from '../../utils/quizCanvasRenderer';
import { downloadFile } from '../../utils/downloadHelper';
import {
  HelpCircle,
  Search,
  Sparkles,
  BookOpen,
  Share2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Filter,
  MessageSquare,
  FileText,
  Eye,
  CheckCircle2,
  Layers,
  History,
  ShieldCheck,
  Calculator,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { LanguageCode } from '../../types';

export const FinanceQuizView: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useI18n();
  const { profile, consumeCredit } = useAdvisor();

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | 'all'>('all');

  // Active Selected Topic
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic>(THE_50_APPROVED_TOPICS[0]);

  // Quiz Selection: Predefined (0-4) vs Saved AI Quiz (record ID)
  const [activeQuizType, setActiveQuizType] = useState<'predefined' | 'ai'>('predefined');
  const [activePredefinedIndex, setActivePredefinedIndex] = useState<number>(0);
  const [activeSavedRecordId, setActiveSavedRecordId] = useState<string | null>(null);

  // AI Generation State
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState<boolean>(false);
  const [aiGenError, setAiGenError] = useState<string | null>(null);

  // Saved AI Quiz History for the current topic
  const [topicAiHistory, setTopicAiHistory] = useState<SavedQuizRecord[]>([]);

  // Generated Images (9:16 Vertical)
  const [questionImageUrl, setQuestionImageUrl] = useState<string | null>(null);
  const [answerImageUrl, setAnswerImageUrl] = useState<string | null>(null);
  const [isRenderingImages, setIsRenderingImages] = useState<boolean>(false);

  // Active View Tab for Images: 'question_image' | 'answer_image' | 'both'
  const [activeImageTab, setActiveImageTab] = useState<'question' | 'answer'>('question');

  // Copy Feedback State
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Helper to get localized title for a topic
  const getTopicTitle = (topic: QuizTopic, lang: LanguageCode = language) => {
    if (lang === 'gu') return topic.titleGu || topic.title;
    if (lang === 'hi') return topic.titleHi || topic.title;
    return topic.title;
  };

  // Helper to get localized category label
  const getCategoryLabel = (cat: QuizCategory, lang: LanguageCode = language) => {
    const item = QUIZ_CATEGORIES.find((c) => c.id === cat);
    if (!item) return cat;
    if (lang === 'gu') return item.labelGu;
    if (lang === 'hi') return item.labelHi;
    return item.label;
  };

  // Filtered Topics list
  const filteredTopics = useMemo(() => {
    return THE_50_APPROVED_TOPICS.filter((t) => {
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && t.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const enTitle = t.title.toLowerCase();
        const guTitle = (t.titleGu || '').toLowerCase();
        const hiTitle = (t.titleHi || '').toLowerCase();
        const numStr = `#${t.num}`;
        return enTitle.includes(q) || guTitle.includes(q) || hiTitle.includes(q) || numStr.includes(q);
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  // Load Predefined Quizzes for active topic
  const predefinedQuizzes = useMemo(() => {
    return getPredefinedQuizzes(selectedTopic, language);
  }, [selectedTopic, language]);

  // Refresh Saved AI Quiz History for current topic
  const refreshAiHistory = () => {
    const records = getSavedQuizHistory(selectedTopic.id);
    setTopicAiHistory(records);
    return records;
  };

  useEffect(() => {
    const records = refreshAiHistory();
    // Default to predefined index 0 on topic change
    setActiveQuizType('predefined');
    setActivePredefinedIndex(0);
    setActiveSavedRecordId(records.length > 0 ? records[0].id : null);
  }, [selectedTopic, language]);

  // Determine current active question object
  const currentQuestion: QuizQuestion = useMemo(() => {
    if (activeQuizType === 'ai' && activeSavedRecordId) {
      const found = topicAiHistory.find((r) => r.id === activeSavedRecordId);
      if (found) return found.question;
    }
    return predefinedQuizzes[activePredefinedIndex] || predefinedQuizzes[0];
  }, [activeQuizType, activeSavedRecordId, activePredefinedIndex, topicAiHistory, predefinedQuizzes]);

  // Generate BOTH Question Image & Answer Image whenever currentQuestion changes
  useEffect(() => {
    let isCancelled = false;
    async function generateBothImages() {
      if (!currentQuestion) return;
      setIsRenderingImages(true);
      try {
        const topicTitle = getTopicTitle(selectedTopic);

        // 1. Render Question Image (9:16 Vertical)
        const qUrl = await renderVerticalQuestionImage(
          topicTitle,
          selectedTopic.num,
          currentQuestion,
          profile,
          language
        );

        // 2. Render Answer Image (9:16 Vertical)
        const aUrl = await renderVerticalAnswerImage(
          topicTitle,
          selectedTopic.num,
          currentQuestion,
          profile,
          language
        );

        if (!isCancelled) {
          setQuestionImageUrl(qUrl);
          setAnswerImageUrl(aUrl);
        }
      } catch (err) {
        console.warn('Failed to render question/answer images:', err);
      } finally {
        if (!isCancelled) {
          setIsRenderingImages(false);
        }
      }
    }

    generateBothImages();
    return () => {
      isCancelled = true;
    };
  }, [currentQuestion, selectedTopic, profile, language]);

  // Handler: Generate New AI Quiz
  const handleGenerateNewAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    setAiGenError(null);
    try {
      consumeCredit();
      const newQuestion = await generateNewAiQuiz({
        topic: selectedTopic,
        language,
        advisorProfile: profile,
      });

      const updatedHistory = refreshAiHistory();
      setActiveQuizType('ai');
      setActiveSavedRecordId(newQuestion.id);
    } catch (err: any) {
      console.error('Error generating AI quiz:', err);
      setAiGenError(err?.message || 'Failed to generate new AI quiz. Please retry.');
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  // Handler: Copy text helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Handler: Copy image to clipboard
  const handleCopyImage = async (dataUrl: string | null, label: string) => {
    if (!dataUrl) return;
    const ok = await copyCanvasImageToClipboard(dataUrl);
    if (ok) {
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 3000);
    } else {
      // Fallback: download if browser restricts clipboard image write
      downloadFile(dataUrl, `${label}.png`, 'image/png');
      setCopyFeedback(`${label} (Downloaded)`);
      setTimeout(() => setCopyFeedback(null), 3000);
    }
  };

  // Handler: Download TXT file
  const handleDownloadTxt = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    downloadFile(blob, filename, 'text/plain');
  };

  // Generated Text Objects
  const questionText = useMemo(() => {
    return buildSeparateQuestionText(
      currentQuestion,
      getTopicTitle(selectedTopic),
      selectedTopic.num,
      profile,
      language
    );
  }, [currentQuestion, selectedTopic, profile, language]);

  const answerText = useMemo(() => {
    return buildSeparateAnswerText(
      currentQuestion,
      getTopicTitle(selectedTopic),
      selectedTopic.num,
      profile,
      language
    );
  }, [currentQuestion, selectedTopic, profile, language]);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              FINADVISOR PRO · 50 APPROVED FINANCE QUIZZES
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Finance Quiz Studio
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Advanced calculation-based financial questions with dual 9:16 Question & Answer vertical graphics for WhatsApp broadcasts.
            </p>
          </div>

          {/* Dynamic Language Selector Dropdown */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col gap-2 shrink-0">
            <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌐</span> Active Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-slate-900/90 text-white font-medium text-sm rounded-xl px-3.5 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all cursor-pointer"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400">
              Preserves local Unicode scripts & numerals
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Studio Layout: Left Topic Browser & Right Active Quiz Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): 50 Topics Browser */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>The 50 Approved Topics</span>
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredTopics.length} Available
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics (e.g. SIP, Inflation, #15)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Topics
              </button>
              {QUIZ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getCategoryLabel(cat.id)}
                </button>
              ))}
            </div>

            {/* Scrollable Topics List */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredTopics.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/30'
                        : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                          #{topic.num}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/40">
                          {getCategoryLabel(topic.category)}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {getTopicTitle(topic)}
                      </h3>
                    </div>

                    <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 mt-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Active Quiz Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Topic Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  <span>TOPIC #{selectedTopic.num}</span>
                  <span>·</span>
                  <span>{getCategoryLabel(selectedTopic.category)}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {getTopicTitle(selectedTopic)}
                </h2>
              </div>

              {/* High-Visibility "Generate New AI Quiz" Button */}
              <button
                onClick={handleGenerateNewAiQuiz}
                disabled={isGeneratingAiQuiz}
                className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-60"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingAiQuiz ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAiQuiz ? 'Formulating New AI Quiz...' : 'Generate New AI Quiz 🎯'}</span>
              </button>
            </div>

            {aiGenError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{aiGenError}</span>
              </div>
            )}

            {/* Quiz Selector: 5 Predefined Quizzes + Generated AI Quizzes */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Select Quiz:</span>
                <div className="flex items-center gap-1.5">
                  {predefinedQuizzes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveQuizType('predefined');
                        setActivePredefinedIndex(idx);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        activeQuizType === 'predefined' && activePredefinedIndex === idx
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Quiz {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved AI Quizzes for this Topic */}
              {topicAiHistory.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> AI Quizzes:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                    {topicAiHistory.map((rec, i) => (
                      <button
                        key={rec.id}
                        onClick={() => {
                          setActiveQuizType('ai');
                          setActiveSavedRecordId(rec.id);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all whitespace-nowrap ${
                          activeQuizType === 'ai' && activeSavedRecordId === rec.id
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                        }`}
                      >
                        AI #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. DUAL GRAPHIC IMAGES (9:16 VERTICAL QUESTION & ANSWER CARDS) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Dual 9:16 Vertical Cards (Question & Answer)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Separate high-resolution graphics generated together (1080 × 1920 px)
                </p>
              </div>

              {/* Tab Switcher between Question Card & Answer Card */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setActiveImageTab('question')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeImageTab === 'question'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Question Card (9:16)
                </button>
                <button
                  onClick={() => setActiveImageTab('answer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeImageTab === 'answer'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Answer Card (9:16)
                </button>
              </div>
            </div>

            {/* Active Graphic Preview Frame (9:16 Aspect Ratio) */}
            <div className="relative mx-auto max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-slate-800">
              {isRenderingImages ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <RefreshCw className="w-7 h-7 animate-spin text-emerald-500" />
                  <span className="text-xs font-semibold">Generating 9:16 graphics...</span>
                </div>
              ) : activeImageTab === 'question' ? (
                questionImageUrl ? (
                  <img
                    src={questionImageUrl}
                    alt="Question Card (9:16 Vertical)"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-slate-500">
                    Preparing question image...
                  </div>
                )
              ) : answerImageUrl ? (
                <img
                  src={answerImageUrl}
                  alt="Answer Card (9:16 Vertical)"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-slate-500">
                  Preparing answer image...
                </div>
              )}
            </div>

            {/* Independent Image Action Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <button
                onClick={() =>
                  downloadFile(
                    questionImageUrl || '',
                    `Question_${selectedTopic.id}_${language}.png`,
                    'image/png'
                  )
                }
                disabled={!questionImageUrl}
                className="px-3 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Question</span>
              </button>

              <button
                onClick={() => handleCopyImage(questionImageUrl, 'Question Image')}
                disabled={!questionImageUrl}
                className="px-3 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Question Image</span>
              </button>

              <button
                onClick={() =>
                  downloadFile(
                    answerImageUrl || '',
                    `Answer_${selectedTopic.id}_${language}.png`,
                    'image/png'
                  )
                }
                disabled={!answerImageUrl}
                className="px-3 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Download Answer</span>
              </button>

              <button
                onClick={() => handleCopyImage(answerImageUrl, 'Answer Image')}
                disabled={!answerImageUrl}
                className="px-3 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copy Answer Image</span>
              </button>
            </div>

            {copyFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{copyFeedback} copied successfully!</span>
              </div>
            )}
          </div>

          {/* 4. SEPARATE QUESTION AND ANSWER TEXT PANELS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* PANEL A: QUESTION TEXT (Never includes Answer) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4>Question Text (WhatsApp Ready)</h4>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  No Answer Revealed
                </span>
              </div>

              {/* Textarea Preview */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 font-mono text-xs text-slate-800 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {questionText}
              </div>

              {/* Action Buttons for Question Text */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(questionText, 'Question Text')}
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={() =>
                    handleDownloadTxt(
                      questionText,
                      `Question_${selectedTopic.id}_${language}.txt`
                    )
                  }
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>

                <button
                  onClick={() => {
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(questionText)}`;
                    window.open(url, '_blank');
                  }}
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* PANEL B: ANSWER TEXT (Includes Step-by-Step Calculations & Takeaway) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4>Answer Text & Calculations</h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Full Rationale
                </span>
              </div>

              {/* Textarea Preview */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 font-mono text-xs text-slate-800 max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                {answerText}
              </div>

              {/* Action Buttons for Answer Text */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => handleCopyText(answerText, 'Answer Text')}
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={() =>
                    handleDownloadTxt(
                      answerText,
                      `Answer_${selectedTopic.id}_${language}.txt`
                    )
                  }
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>

                <button
                  onClick={() => {
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(answerText)}`;
                    window.open(url, '_blank');
                  }}
                  className="px-2.5 py-2 rounded-xl font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
