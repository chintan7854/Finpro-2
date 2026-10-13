import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  ClientPresentation,
  ClientQuestionnaire,
  PresentationMode,
  PresentationSlide,
} from '../../types/presentationStudio';
import {
  POPULAR_TOPIC_INSPIRATIONS,
  PopularTopicInspiration,
} from '../../constants/presentationQuestionnaire';
import {
  generateClientPresentation,
  generateLocalPresentation,
  createAdvisorSnapshot,
  regenerateSlide,
  sanitizeClientPresentation,
} from '../../services/presentationGenerator';
import {
  exportToPptx,
  exportToPdf,
  exportSlideAsPng,
  generateWhatsAppPitchText,
} from '../../services/presentationExport';
import { SlideCard } from './SlideCard';
import { QuestionnaireForm } from './QuestionnaireForm';
import { SlidePresenterModal } from './SlidePresenterModal';
import { SlideEditorModal } from './SlideEditorModal';
import { ClientReportDocumentPreview } from './ClientReportDocumentPreview';
import {
  Sparkles,
  Presentation,
  FileText,
  Download,
  Share2,
  Play,
  Printer,
  History,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  User,
  Globe,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { LanguageCode } from '../../types';

import { AdvisorSectorCompanySelector } from './AdvisorSectorCompanySelector';
import { AdvisorBusinessProfile } from '../../constants/advisorSectorsData';

const STORAGE_KEY = 'finadvisor_client_presentations_v2';

const INITIAL_BUSINESS_PROFILE: AdvisorBusinessProfile = {
  sectorId: 'sip_mf_distributor',
  sectorName: 'SIP / Mutual Fund Distributor',
  companyId: 'hdfc_mutual_fund',
  companyName: 'HDFC Mutual Fund',
  productName: 'HDFC Flexi Cap Fund — Regular Plan, Growth Option',
  advisorRole: 'Mutual Fund Distributor',
  authorizationIdentifier: 'ARN-184920',
  needsVerification: false,
};

const INITIAL_QUESTIONNAIRE: ClientQuestionnaire = {
  topicPrompt: '',
  clientName: '',
  clientRelationship: '',
  clientGoals: '',
  clientBudget: '',
  clientBudgetStatus: 'estimate',
  clientConcerns: '',
  hesitationReasons: '',
  preferredStyle: '',
  emphasisPoints: '',
  additionalNotes: '',
};

export const PresentationStudioView: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const { profile, consumeCredit } = useAdvisor();

  // Active view tab: 'create' | 'deck' | 'library' | 'ideas'
  const [activeTab, setActiveTab] = useState<'create' | 'deck' | 'library' | 'ideas'>('create');

  // Core Inputs
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [presentationMode, setPresentationMode] = useState<PresentationMode>('detailed');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(language);
  const [businessProfile, setBusinessProfile] = useState<AdvisorBusinessProfile>(INITIAL_BUSINESS_PROFILE);
  const [questionnaire, setQuestionnaire] = useState<ClientQuestionnaire>(INITIAL_QUESTIONNAIRE);

  // Active Presentation state
  const [activePresentation, setActivePresentation] = useState<ClientPresentation | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Modals state
  const [isPresenterOpen, setIsPresenterOpen] = useState<boolean>(false);
  const [editingSlide, setEditingSlide] = useState<PresentationSlide | null>(null);
  const [viewLayoutMode, setViewLayoutMode] = useState<'report_document' | 'slide_deck'>('report_document');

  // Saved Presentations history
  const [savedPresentations, setSavedPresentations] = useState<ClientPresentation[]>([]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<'success' | 'error' | 'info'>('info');
  const [readyFile, setReadyFile] = useState<{ url: string; filename: string; mimeType: string } | null>(null);

  // DOM refs for PDF rasterization and image capture
  const activeSlideRef = useRef<HTMLDivElement>(null);
  const hiddenSlidesContainerRef = useRef<HTMLDivElement>(null);

  // Listen for file downloads to provide instant direct link fallback
  useEffect(() => {
    const handleFileReady = (event: any) => {
      if (event?.detail) {
        setReadyFile(event.detail);
      }
    };
    window.addEventListener('finadvisor:file-ready', handleFileReady);
    return () => window.removeEventListener('finadvisor:file-ready', handleFileReady);
  }, []);

  // Keep selected language in sync with app language if user changes it
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed
            .filter(
              (p: any) => p && typeof p === 'object' && Array.isArray(p.slides) && p.slides.length > 0
            )
            .map(sanitizeClientPresentation);
          if (valid.length > 0) {
            setSavedPresentations(valid);
            if (!activePresentation) {
              setActivePresentation(valid[0]);
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to load presentation history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (pres: ClientPresentation) => {
    setSavedPresentations((prev) => {
      const filtered = prev.filter((p) => p.id !== pres.id);
      const updated = [pres, ...filtered].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist presentation history:', err);
      }
      return updated;
    });
  };

  const deleteFromHistory = (id: string) => {
    setSavedPresentations((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (activePresentation?.id === id) {
      const remaining = savedPresentations.filter((p) => p.id !== id);
      setActivePresentation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handle Quick Topic Fill
  const handleUseInspirationTopic = (topic: PopularTopicInspiration) => {
    setTopicPrompt(topic.suggestedPrompt);
    setActiveTab('create');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Handle Generate Presentation
  const handleGenerate = async () => {
    const comp = businessProfile.companyName?.trim() || '';
    const prod = businessProfile.productName?.trim() || '';
    const sect = businessProfile.sectorName?.trim() || '';

    // Smart fallback if product name is empty: synthesize or pick from catalog
    const effectiveBusinessProfile: AdvisorBusinessProfile = {
      ...businessProfile,
      productName: prod || (comp ? `${comp} Flagship ${sect || 'Solution'}` : `${sect || 'Tailored Financial'} Solution`),
    };

    let finalPrompt = topicPrompt.trim();
    if (!finalPrompt) {
      if (comp && effectiveBusinessProfile.productName) {
        finalPrompt = `${comp} — ${effectiveBusinessProfile.productName}`;
      } else if (comp) {
        finalPrompt = `${comp} — ${sect || 'Advisory Plan'}`;
      } else if (sect) {
        finalPrompt = `${sect} — Comprehensive Advisory Strategy`;
      } else {
        finalPrompt = 'Comprehensive Financial Planning & Investment Strategy';
      }
    }

    setIsGenerating(true);
    setExportNotice(null);
    setNoticeType('info');
    try {
      consumeCredit();
      const generated = await generateClientPresentation({
        topicPrompt: finalPrompt,
        mode: presentationMode,
        language: selectedLanguage,
        clientName: clientName.trim() || undefined,
        businessProfile: effectiveBusinessProfile,
        questionnaire: {
          ...questionnaire,
          topicPrompt: finalPrompt,
          clientName: clientName.trim() || undefined,
        },
        advisorProfile: profile,
      });

      setActivePresentation(generated);
      setActiveSlideIndex(0);
      saveToHistory(generated);
      setActiveTab('deck');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.warn('API presentation generation failed, activating deterministic local fallback:', err);
      try {
        const fallbackPres = generateLocalPresentation({
          topicPrompt: finalPrompt,
          subjectId: 'custom_financial_presentation',
          subjectTitle: finalPrompt,
          subCategoryTitle: 'Advisory Blueprint',
          mode: presentationMode,
          language: selectedLanguage,
          clientName: clientName.trim() || undefined,
          questionnaire: {
            ...questionnaire,
            topicPrompt: finalPrompt,
            clientName: clientName.trim() || undefined,
          },
          advisorSnapshot: createAdvisorSnapshot(profile, effectiveBusinessProfile),
          businessProfile: effectiveBusinessProfile,
        });

        setActivePresentation(fallbackPres);
        setActiveSlideIndex(0);
        saveToHistory(fallbackPres);
        setActiveTab('deck');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr: any) {
        console.error('All presentation generation options failed:', fallbackErr);
        setNoticeType('error');
        setExportNotice(
          selectedLanguage === 'gu'
            ? 'પ્રસ્તુતિ જનરેટ કરવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.'
            : selectedLanguage === 'hi'
            ? 'प्रेजेंटेशन जनरेट करने में समस्या आई। कृपया पुनः प्रयास करें।'
            : 'Unable to generate presentation. Please check inputs and try again.'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PPTX Export
  const handleExportPptx = async () => {
    if (!activePresentation) return;
    setExportNotice(
      selectedLanguage === 'gu'
        ? 'પાવરપોઇન્ટ (.pptx) ફાઇલ તૈયાર થઈ રહી છે...'
        : selectedLanguage === 'hi'
        ? 'पावरपॉइंट (.pptx) फ़ाइल तैयार की जा रही है...'
        : 'Generating PowerPoint (.pptx)...'
    );
    try {
      await exportToPptx(activePresentation);
      setExportNotice(
        selectedLanguage === 'gu'
          ? 'પાવરપોઇન્ટ (.pptx) ફાઇલ સફળતાપૂર્વક ડાઉનલોડ થઈ ગઈ!'
          : selectedLanguage === 'hi'
          ? 'पावरपॉइंट (.pptx) फ़ाइल सफलतापूर्वक डाउनलोड हो गई!'
          : 'PowerPoint file (.pptx) downloaded successfully!'
      );
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err: any) {
      console.error('PPTX export error:', err);
      setExportNotice(
        selectedLanguage === 'gu'
          ? `PPTX ડાઉનલોડ કરવામાં ભૂલ: ${err?.message || 'કૃપા કરીને ફરી પ્રયાસ કરો.'}`
          : `Failed to generate PPTX: ${err?.message || 'Please try again.'}`
      );
      setTimeout(() => setExportNotice(null), 6000);
    }
  };

  // Handle PDF Export
  const handleExportPdf = async () => {
    if (!activePresentation) return;
    setExportNotice(
      selectedLanguage === 'gu'
        ? 'હાઇ-ક્વોલિટી PDF તૈયાર થઈ રહી છે...'
        : selectedLanguage === 'hi'
        ? 'हाई-क्वालिटी PDF तैयार की जा रही है...'
        : 'Generating high-resolution PDF...'
    );
    try {
      // Find slides either in offscreen container or active deck
      let slideNodes: HTMLElement[] = [];
      if (hiddenSlidesContainerRef.current) {
        slideNodes = Array.from(
          hiddenSlidesContainerRef.current.querySelectorAll<HTMLElement>('[data-slide-number]')
        );
      }
      if (slideNodes.length === 0 && activeSlideRef.current) {
        slideNodes = [activeSlideRef.current];
      }

      await exportToPdf(slideNodes, activePresentation.title, activePresentation);
      setExportNotice(
        selectedLanguage === 'gu'
          ? 'PDF દસ્તાવેજ સફળતાપૂર્વક ડાઉનલોડ થઈ ગયો!'
          : selectedLanguage === 'hi'
          ? 'PDF दस्तावेज़ सफलतापूर्वक डाउनलोड हो गया!'
          : 'PDF document downloaded successfully!'
      );
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err: any) {
      console.error('PDF export error:', err);
      // Fallback directly to vector presentation if rasterization had an issue
      try {
        await exportToPdf([], activePresentation.title, activePresentation);
        setExportNotice(
          selectedLanguage === 'gu'
            ? 'PDF દસ્તાવેજ સફળતાપૂર્વક ડાઉનલોડ થઈ ગયો!'
            : 'PDF document downloaded successfully!'
        );
        setTimeout(() => setExportNotice(null), 4000);
      } catch (fallbackErr: any) {
        setExportNotice(
          selectedLanguage === 'gu'
            ? 'PDF ડાઉનલોડમાં સમસ્યા આવી. કૃપા કરીને Print બટન પર ક્લિક કરીને "Save as PDF" કરો.'
            : 'Issue during download. You can also click the Print button and choose "Save as PDF".'
        );
        setTimeout(() => setExportNotice(null), 6000);
      }
    }
  };

  // Handle PNG Download of active slide
  const handleDownloadActiveSlidePng = async () => {
    if (!activePresentation || !activeSlideRef.current) return;
    setExportNotice(
      selectedLanguage === 'gu'
        ? 'સ્લાઇડ ઈમેજ (PNG) ડાઉનલોડ થઈ રહી છે...'
        : 'Exporting slide image (PNG)...'
    );
    try {
      const slide = activePresentation.slides[activeSlideIndex];
      await exportSlideAsPng(activeSlideRef.current, slide.slideNumber, slide.title);
      setExportNotice(
        selectedLanguage === 'gu'
          ? `સ્લાઇડ #${slide.slideNumber} સફળતાપૂર્વક PNG ઈમેજ તરીકે સેવ થઈ ગઈ!`
          : `Slide #${slide.slideNumber} saved as PNG image!`
      );
      setTimeout(() => setExportNotice(null), 3500);
    } catch (err: any) {
      console.error('PNG export error:', err);
      setExportNotice(
        selectedLanguage === 'gu'
          ? 'ઈમેજ ડાઉનલોડ કરવામાં સમસ્યા આવી.'
          : 'Failed to export image.'
      );
      setTimeout(() => setExportNotice(null), 5000);
    }
  };

  // Handle WhatsApp Share
  const handleShareWhatsApp = () => {
    if (!activePresentation) return;
    const pitch = generateWhatsAppPitchText(activePresentation);
    const encoded = encodeURIComponent(pitch);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Single Slide Update
  const handleSaveSlideEdit = (updatedSlide: PresentationSlide) => {
    if (!activePresentation) return;
    const updatedSlides = activePresentation.slides.map((s, idx) =>
      idx === activeSlideIndex ? updatedSlide : s
    );
    const updatedPres: ClientPresentation = {
      ...activePresentation,
      slides: updatedSlides,
      updatedAt: new Date().toISOString(),
    };
    setActivePresentation(updatedPres);
    saveToHistory(updatedPres);
  };

  // Handle Single Slide AI Regeneration
  const handleRegenerateSlideWithAI = async (refinementPrompt: string) => {
    if (!activePresentation) return;
    setExportNotice('Regenerating slide with AI...');
    try {
      const currentSlide = activePresentation.slides[activeSlideIndex];
      const refreshedSlide = await regenerateSlide({
        presentation: activePresentation,
        slide: currentSlide,
        refinementPrompt,
        advisorProfile: profile,
      });
      const updatedSlides = activePresentation.slides.map((s, idx) =>
        idx === activeSlideIndex ? refreshedSlide : s
      );
      const updatedPres: ClientPresentation = {
        ...activePresentation,
        slides: updatedSlides,
        updatedAt: new Date().toISOString(),
      };
      setActivePresentation(updatedPres);
      saveToHistory(updatedPres);
      setExportNotice('Slide updated with AI enhancement!');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (err) {
      console.error('Slide regeneration failed:', err);
      setExportNotice('Failed to regenerate slide.');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO PRESENTATION STUDIO
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Any Topic & Universal Support
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                PPTX • PDF • WhatsApp Images
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Client Presentation Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mt-1">
              Describe any financial, insurance, or investment topic in your own words. Generate structured, client-ready slides with accurate calculations, visual charts, and auto-applied branding.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('create');
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Deck</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'create'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Create Presentation</span>
          </button>

          <button
            onClick={() => setActiveTab('deck')}
            disabled={!activePresentation}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              activeTab === 'deck'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              2. Slide Deck & Exports{' '}
              {activePresentation ? `(${activePresentation.slides.length})` : ''}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'library'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved History ({savedPresentations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'ideas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span>Topic Ideas & Prompts</span>
          </button>
        </div>
      </div>

      {/* Export status notice toast with direct link and print fallback */}
      {(exportNotice || readyFile) && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl border animate-fade-in ${
            noticeType === 'error'
              ? 'bg-rose-950/95 text-rose-100 border-rose-700/80 shadow-rose-950/30'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2">
            {noticeType === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            )}
            <span className="leading-snug">
              {exportNotice || (selectedLanguage === 'gu' ? 'દસ્તાવેજ ડાઉનલોડ માટે તૈયાર છે!' : selectedLanguage === 'hi' ? 'दस्तावेज़ डाउनलोड के लिए तैयार है!' : 'Document ready for download!')}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            {noticeType !== 'error' && readyFile && (
              <a
                href={readyFile.url}
                download={readyFile.filename}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 shadow-xs transition-all text-xs"
                title="Direct Download Link"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {selectedLanguage === 'gu' ? 'સાચવો / ડાઉનલોડ' : selectedLanguage === 'hi' ? 'डाउनलोड करें' : 'Download'} ({readyFile.filename.length > 20 ? readyFile.filename.slice(-18) : readyFile.filename})
                </span>
              </a>
            )}

            {noticeType !== 'error' && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center space-x-1.5 transition-all text-xs cursor-pointer"
                title="Print directly or save as clean PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {selectedLanguage === 'gu' ? 'પ્રિન્ટ / Save PDF' : selectedLanguage === 'hi' ? 'प्रिंट / Save PDF' : 'Print / Save PDF'}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                setExportNotice(null);
                setReadyFile(null);
                setNoticeType('info');
              }}
              className="text-slate-400 hover:text-white p-1 ml-1 cursor-pointer"
              title="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: CREATE PRESENTATION */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Universal Sector, Company & Product Selection (Step 1 to 4) */}
          <AdvisorSectorCompanySelector
            businessProfile={businessProfile}
            onChange={(updated) => setBusinessProfile(updated)}
            language={selectedLanguage}
            onAutoPopulateTopic={(suggestedPrompt) => {
              setTopicPrompt(suggestedPrompt);
            }}
          />

          {/* Section 1: Simple Presentation Creation (Large Text Box) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm">
            <div className="mb-3">
              <label
                htmlFor="topic-prompt-input"
                className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight"
              >
                What presentation would you like to create?
              </label>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Describe any topic, purpose, client needs, and specific requirements in your own words. No predefined categories or templates required.
              </p>
            </div>

            {/* Large Text Box */}
            <div className="relative">
              <textarea
                id="topic-prompt-input"
                rows={5}
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="Describe your presentation here in your own words...&#10;&#10;Examples:&#10;• 'Create a client presentation on why a 35-year-old software engineer should buy Pure Term Insurance + Mutual Fund SIP instead of traditional endowment policies, with 15-year compounding comparison.'&#10;• 'Explain why our family needs a ₹1 Crore Super Top-up Health Insurance, deductibles, cashless claims, and medical inflation in India.'&#10;• 'Car insurance Zero Depreciation vs Standard policy claim payout differences with bumper and plastic part repair math.'&#10;• 'Retirement planning at age 55 with 7% inflation and Systematic Withdrawal Plan (SWP) monthly pension.'"
                className="w-full text-sm sm:text-base p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all leading-relaxed"
              />
              {topicPrompt.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setTopicPrompt('')}
                  className="absolute bottom-3 right-3 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Inspiration Chips */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>One-Click Topic Inspirations (Click to populate):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOPIC_INSPIRATIONS.map((insp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseInspirationTopic(insp)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-left flex items-center gap-1.5"
                  >
                    <span className="font-semibold">{insp.title}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      ({insp.category})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Name & Language Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  Client Name (Optional)
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Rajesh Patel, Priya Sharma (or leave blank)"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  Presentation Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLanguage('en');
                      setLanguage('en');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedLanguage === 'en'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLanguage('gu');
                      setLanguage('gu');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedLanguage === 'gu'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    ગુજરાતી
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLanguage('hi');
                      setLanguage('hi');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      selectedLanguage === 'hi'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Optional General Questionnaire & Presentation Mode */}
          <QuestionnaireForm
            questionnaire={questionnaire}
            onChange={(updated) => setQuestionnaire(updated)}
            presentationMode={presentationMode}
            onModeChange={(m) => setPresentationMode(m)}
            language={selectedLanguage}
          />

          {/* Master Advisor Profile Auto-Branding Card */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-3">
              <img
                src={
                  profile.profilePhoto ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'
                }
                alt={profile.advisorName}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {profile.advisorName}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Auto-Applied
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  {profile.designation} • {profile.phoneNumber} • {profile.email}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                  Compliance Disclaimer & Contact CTA automatically included on final slide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 self-end sm:self-auto bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>SEBI & AMFI Compliant Standards</span>
            </div>
          </div>

          {/* Action Button: Generate Client Presentation */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 sm:py-4.5 px-6 rounded-2xl font-extrabold text-base sm:text-lg text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-600 shadow-xl shadow-emerald-900/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {selectedLanguage === 'gu'
                      ? 'પ્રોફેશનલ ક્લાયન્ટ પ્રેઝન્ટેશન તૈયાર થઈ રહી છે...'
                      : selectedLanguage === 'hi'
                      ? 'व्यावसायिक क्लाइंट प्रेजेंटेशन तैयार हो रही है...'
                      : 'Generating Professional Client Presentation...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span>
                    {selectedLanguage === 'gu'
                      ? 'ક્લાયન્ટ પ્રેઝન્ટેશન જનરેટ કરો (Generate Presentation)'
                      : selectedLanguage === 'hi'
                      ? 'क्लाइंट प्रेजेंटेशन जनरेट करें (Generate Presentation)'
                      : 'Generate Client Presentation'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              Instant generation • Single-product focus • PPTX & PDF exports • Private advisor notes never shown to client
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SLIDE DECK & EXPORTS */}
      {activeTab === 'deck' && activePresentation && (
        <div className="space-y-6">
          {/* Deck Control Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {activePresentation.mode.toUpperCase()} DECK
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {activePresentation.slides.length} Slides
                </span>
                {activePresentation.clientName && (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    For: {activePresentation.clientName}
                  </span>
                )}
                {activePresentation.businessProfile?.companyName && (
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                    🏢 {activePresentation.businessProfile.companyName}
                  </span>
                )}
                {activePresentation.businessProfile?.productName && (
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    📦 {activePresentation.businessProfile.productName}
                  </span>
                )}
                {activePresentation.businessProfile?.advisorRole && (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
                    Role: {activePresentation.businessProfile.advisorRole}
                  </span>
                )}
                {(activePresentation.historicalScenarioMode === 'historical_best_case' ||
                  activePresentation.questionnaireSnapshot?.historicalScenarioMode === 'historical_best_case') && (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    ⭐ Historical Best-Case Analysis
                  </span>
                )}
                {(activePresentation.historicalScenarioMode === 'historical_and_contractual' ||
                  activePresentation.questionnaireSnapshot?.historicalScenarioMode === 'historical_and_contractual') && (
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    ⭐ Historical + Contractual Analysis
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {activePresentation.source === 'ai_api' ? '⚡ AI Tailored' : '🛡️ Advisory Engine'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {activePresentation.title}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Primary: Client Report PDF Export (Master Prompt Section 2) */}
              <button
                type="button"
                onClick={handleExportPdf}
                className="px-4 py-2 text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl shadow-md shadow-emerald-900/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                title="Download High-Resolution Client Report PDF"
              >
                <Download className="w-4 h-4 text-white" />
                <span>
                  {selectedLanguage === 'gu'
                    ? 'ગ્રાહક રિપોર્ટ PDF ડાઉનલોડ કરો'
                    : selectedLanguage === 'hi'
                    ? 'क्लाइंट रिपोर्ट PDF डाउनलोड करें'
                    : 'Download Client Report (PDF)'}
                </span>
              </button>

              {/* Fullscreen Presenter */}
              <button
                type="button"
                onClick={() => setIsPresenterOpen(true)}
                className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Present</span>
              </button>

              {/* PPTX Export (Preserved from existing studio) */}
              <button
                type="button"
                onClick={handleExportPptx}
                className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center space-x-1.5"
                title="Download PowerPoint Presentation (.pptx)"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>PPTX</span>
              </button>

              {/* Single Slide Image */}
              <button
                type="button"
                onClick={handleDownloadActiveSlidePng}
                className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center space-x-1.5"
                title="Download this slide as WhatsApp image"
              >
                <Download className="w-3.5 h-3.5 text-teal-500" />
                <span>Image</span>
              </button>

              {/* WhatsApp Share */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-all flex items-center space-x-1.5"
                title="Share presentation summary on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              {/* Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center space-x-1.5"
                title="Print slides (optimized for black and white & color)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* View Mode Toggle: Client Report Document vs Slide Deck */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setViewLayoutMode('report_document')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewLayoutMode === 'report_document'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Client Report View (A4 Document)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayoutMode('slide_deck')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewLayoutMode === 'slide_deck'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Slide Deck View (Presentation Slides)</span>
              </button>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">
              {viewLayoutMode === 'report_document'
                ? '📄 Dense, high-density editorial document'
                : '📊 16:9 meeting slide cards'}
            </span>
          </div>

          {viewLayoutMode === 'report_document' ? (
            <ClientReportDocumentPreview
              presentation={activePresentation}
              onDownloadPdf={handleExportPdf}
            />
          ) : (
            <div className="space-y-4">
              {/* Slide Navigator Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {activePresentation.slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                      activeSlideIndex === idx
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>#{idx + 1}</span>
                    <span className="hidden sm:inline font-medium text-[11px] truncate max-w-[120px]">
                      {s.badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Slide Display Area */}
              <div className="relative">
                <div ref={activeSlideRef}>
                  <SlideCard
                    slide={activePresentation.slides[activeSlideIndex] || activePresentation.slides[0]}
                    advisorSnapshot={activePresentation.advisorSnapshot}
                    totalSlides={activePresentation.slides.length}
                    onEdit={() => setEditingSlide(activePresentation.slides[activeSlideIndex] || activePresentation.slides[0])}
                    onRegenerate={() =>
                      handleRegenerateSlideWithAI(
                        'Make this slide more impactful, specific, and client-friendly'
                      )
                    }
                  />
                </div>

                {/* Prev / Next Slide Arrows */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSlideIndex === 0}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Slide</span>
                  </button>

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Slide {activeSlideIndex + 1} of {activePresentation.slides.length}
                  </span>

                  <button
                    onClick={() =>
                      setActiveSlideIndex((prev) =>
                        Math.min(activePresentation.slides.length - 1, prev + 1)
                      )
                    }
                    disabled={activeSlideIndex === activePresentation.slides.length - 1}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED HISTORY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Presentation History ({savedPresentations.length})
            </h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New</span>
            </button>
          </div>

          {savedPresentations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <Presentation className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                No Presentations Saved Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Create your first presentation by typing your topic in the large text box. It will automatically be saved here.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-4 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs"
              >
                Create Presentation Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPresentations.map((pres) => (
                <div
                  key={pres.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {pres.mode.toUpperCase()} • {pres.slides.length} SLIDES
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(pres.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">
                      {pres.title}
                    </h3>

                    {pres.clientName && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                        Client: {pres.clientName}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {pres.slides[0]?.keyTakeaway || 'Financial Advisory Presentation'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActivePresentation(pres);
                        setActiveSlideIndex(0);
                        setActiveTab('deck');
                      }}
                      className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <Presentation className="w-3.5 h-3.5" />
                      <span>Open Deck</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={async () => {
                          setExportNotice('Downloading PowerPoint (.pptx)...');
                          try {
                            await exportToPptx(pres);
                            setExportNotice('PowerPoint (.pptx) downloaded successfully!');
                            setTimeout(() => setExportNotice(null), 3000);
                          } catch (err: any) {
                            setExportNotice(`Export failed: ${err?.message || 'Please try again.'}`);
                            setTimeout(() => setExportNotice(null), 5000);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Download PPTX"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                      <button
                        onClick={async () => {
                          setExportNotice('Generating and downloading PDF...');
                          try {
                            await exportToPdf([], pres.title, pres);
                            setExportNotice('PDF document downloaded successfully!');
                            setTimeout(() => setExportNotice(null), 3000);
                          } catch (err: any) {
                            setExportNotice(`PDF export failed: ${err?.message || 'Please try again.'}`);
                            setTimeout(() => setExportNotice(null), 5000);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                      <button
                        onClick={() => deleteFromHistory(pres.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-colors"
                        title="Delete Presentation"
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

      {/* TAB 4: TOPIC IDEAS & PROMPTS GALLERY */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Popular Financial & Insurance Presentation Ideas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click &quot;Use This Topic&quot; on any card below to auto-fill the creation box with high-authority prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POPULAR_TOPIC_INSPIRATIONS.map((insp, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {insp.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Ready Prompt</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {insp.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {insp.description}
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 italic line-clamp-3">
                    &quot;{insp.suggestedPrompt}&quot;
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleUseInspirationTopic(insp)}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
                  >
                    <span>Use This Topic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Offscreen container for full PDF rendering of all slides */}
      {activePresentation && (
        <div
          ref={hiddenSlidesContainerRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '1280px',
            opacity: 1,
            pointerEvents: 'none',
            zIndex: -9999,
            overflow: 'hidden',
          }}
        >
          {activePresentation.slides.map((slide) => (
            <div key={slide.id} style={{ width: '1280px', height: '720px', marginBottom: '24px' }}>
              <SlideCard
                slide={slide}
                advisorSnapshot={activePresentation.advisorSnapshot}
                totalSlides={activePresentation.slides.length}
                isPrintMode={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Presenter Modal */}
      {isPresenterOpen && activePresentation && (
        <SlidePresenterModal
          presentation={activePresentation}
          initialSlideIndex={activeSlideIndex}
          onClose={() => setIsPresenterOpen(false)}
        />
      )}

      {/* Slide Editor Modal */}
      {editingSlide && activePresentation && (
        <SlideEditorModal
          slide={editingSlide}
          onSave={handleSaveSlideEdit}
          onRegenerateWithAI={handleRegenerateSlideWithAI}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
};
