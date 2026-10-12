import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { TODAY_SUGGESTED_TOPICS } from '../constants/subjects';
import { AddCustomSubjectModal } from './AddCustomSubjectModal';
import {
  Sparkles,
  Calculator,
  Briefcase,
  BookmarkCheck,
  Share2,
  Copy,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Award,
  Phone,
  MessageCircle,
  MessageSquare,
  Clock,
  Zap,
  ArrowRight,
  Smartphone,
  Download,
  Layers,
  PlusCircle,
  Gift,
  Users,
  Cake,
  Heart,
  Target,
  BookOpen,
  Presentation,
} from 'lucide-react';
import { FinancialSubjectId, GeneratedContent } from '../types';
import { useClientCrm } from '../context/ClientCrmContext';
import { useLeadGen } from '../context/LeadGenContext';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectTopicForGeneration: (subjectId: FinancialSubjectId) => void;
  onViewContentDetail: (content: GeneratedContent) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectTopicForGeneration,
  onViewContentDetail,
}) => {
  const { t, language, getSubjectTitle } = useI18n();
  const { profile, subscription, contents, favoriteContents, toggleFavorite, allSubjects, customSubjects } = useAdvisor();
  const {
    followUpsDueToday,
    followUpsOverdue,
    upcomingBirthdays,
    upcomingAnniversaries,
    totalClientsCount,
  } = useClientCrm();
  const { hotLeadsCount, totalLeadsCount: totalLeadPipelineCount } = useLeadGen();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Pick suggested topic tailored to language if available
  const suggestedTopic = TODAY_SUGGESTED_TOPICS[0];
  const topicTitle =
    language === 'hi'
      ? suggestedTopic.hi.headline
      : language === 'gu'
      ? suggestedTopic.gu.headline
      : suggestedTopic.en.headline;

  const topicTeaser =
    language === 'hi'
      ? suggestedTopic.hi.teaser
      : language === 'gu'
      ? suggestedTopic.gu.teaser
      : suggestedTopic.en.teaser;

  const handleWhatsAppShare = (content: GeneratedContent) => {
    const text = encodeURIComponent(
      `${content.deepArticle.headline}\n\n${content.whatsappMessage}\n\nShared via ${content.advisorSnapshot.name}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyHeadline = (content: GeneratedContent) => {
    navigator.clipboard.writeText(`${content.deepArticle.headline}\n\n${content.deepArticle.body}`);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Advisor Master Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <img
                src={
                  profile.profilePhoto ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80'
                }
                alt={profile.advisorName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-3 ring-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-lg text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {profile.advisorName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t('dashboard.profileCard')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mb-1.5 max-w-xl">
                {profile.designation}
              </p>
              {profile.achievement && (
                <div className="flex items-center text-xs text-amber-300 font-medium">
                  <Award className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span className="truncate max-w-md">{profile.achievement}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>{t('dashboard.editProfile')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[11px] text-slate-400 mt-2 hidden sm:block">
              {profile.professionalDetails}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
          {/* Action: Client Presentation Studio (Flagship 40+ Topics) */}
          <div
            onClick={() => onNavigate('presentation-studio')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-5 shadow-lg shadow-indigo-950/20 hover:shadow-xl hover:shadow-indigo-900/30 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-indigo-400/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center text-indigo-300 border border-indigo-400/30">
                <Presentation className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-500 text-white shadow-xs animate-pulse">
                40+ PPT 📊
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-indigo-300 transition-colors">
                Presentation Studio
              </h3>
              <p className="text-xs text-indigo-200 line-clamp-1">
                Client PPTX, PDF & Deck
              </p>
            </div>
          </div>

          {/* Action 1: Create Content (Highlight) */}
          <div
            onClick={() => onNavigate('create')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white">
                AI Engine
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:translate-x-0.5 transition-transform">
                {t('dashboard.createContent')}
              </h3>
              <p className="text-xs text-emerald-100 line-clamp-1">
                Articles, WhatsApp & Social
              </p>
            </div>
          </div>

          {/* Action: Story Studio (Dedicated Viral Narrative Engine) */}
          <div
            onClick={() => onNavigate('story-studio')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-900/30 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-emerald-400/30">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-slate-950 shadow-xs animate-pulse">
                VIRAL 🚀
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Story Studio
              </h3>
              <p className="text-xs text-emerald-200 line-clamp-1">
                Viral Indian Financial Narratives & WhatsApp
              </p>
            </div>
          </div>

          {/* Action: Lead Gen & Marketing (Features #1-#10) */}
          <div
            onClick={() => onNavigate('lead-generation')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-4 sm:p-5 shadow-lg shadow-teal-950/20 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-teal-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 backdrop-blur-md flex items-center justify-center text-teal-300 border border-teal-400/30">
                <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  hotLeadsCount > 0
                    ? 'bg-rose-500 text-white font-extrabold animate-pulse'
                    : 'bg-teal-500/30 text-teal-200 border border-teal-400/30'
                }`}
              >
                {hotLeadsCount > 0 ? `${hotLeadsCount} HOT 🔥` : 'LEADS #1-10'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-teal-300 transition-colors">
                Lead Gen & Marketing
              </h3>
              <p className="text-xs text-teal-200 line-clamp-1">
                {totalLeadPipelineCount} Leads • Landing Page & QR
              </p>
            </div>
          </div>

          {/* Action: Client CRM & Directory (Features #11-#20) */}
          <div
            onClick={() => onNavigate('client-crm')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 backdrop-blur-md flex items-center justify-center text-emerald-300 border border-emerald-400/30">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  followUpsDueToday.length > 0
                    ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse'
                    : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                }`}
              >
                {followUpsDueToday.length > 0 ? `${followUpsDueToday.length} Due Today` : 'CRM PRO'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Client CRM & Leads
              </h3>
              <p className="text-xs text-emerald-200 line-clamp-1">
                {totalClientsCount} Clients • Follow-ups
              </p>
            </div>
          </div>

          {/* Action 2: Client Greetings & Festivals (NEW) */}
          <div
            onClick={() => onNavigate('greetings-studio')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-800 text-white p-4 sm:p-5 shadow-lg shadow-rose-600/25 hover:shadow-xl hover:shadow-rose-600/35 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-rose-400/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white animate-pulse">
                NEW ✨
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-amber-200 transition-colors">
                Client Greetings
              </h3>
              <p className="text-xs text-rose-100 line-clamp-1">
                Birthday, Anniversary & Festivals
              </p>
            </div>
          </div>

          {/* Action 3: Client Q&A Responder */}
          <div
            onClick={() => onNavigate('client-qa')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-500/30"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/40 text-emerald-200">
                WhatsApp Q&A
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Client Q&A
              </h3>
              <p className="text-xs text-emerald-200 line-clamp-1">
                {language === 'gu' ? 'ગ્રાહક પ્રશ્નોના જવાબ' : 'Instant Client Query Answers'}
              </p>
            </div>
          </div>

          {/* Action 3: 25 Theme Posters (Featured) */}
          <div
            onClick={() => onNavigate('theme-studio')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-indigo-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                <Layers className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white">
                25 Themes
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-indigo-300 transition-colors">
                25 Theme Posters
              </h3>
              <p className="text-xs text-indigo-200 line-clamp-1">
                Myth vs Reality, Split Screen
              </p>
            </div>
          </div>

          {/* Action 3: WhatsApp Status Studio (Direct Image Export) */}
          <div
            onClick={() => onNavigate('status-studio')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-5 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white">
                Direct PNG
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-emerald-300 transition-colors">
                {t('dashboard.statusStudio')}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                9:16 WhatsApp Status Images
              </p>
            </div>
          </div>

          {/* Action: 50 Mindset & Visual Simulators (Featured Violet Workspace) */}
          <div
            onClick={() => onNavigate('simulators')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-white p-4 sm:p-5 shadow-lg shadow-purple-950/20 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] border border-violet-500/40"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 backdrop-blur-md flex items-center justify-center text-violet-300 border border-violet-400/30">
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-violet-500 text-white shadow-xs animate-pulse">
                50 LIVE 🚀
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-white mb-1 group-hover:text-violet-300 transition-colors">
                Visual Simulators
              </h3>
              <p className="text-xs text-violet-200 line-clamp-1">
                50 Behavioral Sales Simulators
              </p>
            </div>
          </div>

          {/* Action 2: Calculators */}
          <div
            onClick={() => onNavigate('calculators')}
            className="group rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {t('dashboard.calculators')}
              </h3>
              <p className="text-xs text-slate-500">
                SIP & Retirement planning
              </p>
            </div>
          </div>

          {/* Action 3: Client Tools */}
          <div
            onClick={() => onNavigate('client-tools')}
            className="group rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                {t('dashboard.clientTools')}
              </h3>
              <p className="text-xs text-slate-500">
                Visual cheat sheets & cards
              </p>
            </div>
          </div>

          {/* Action 4: My Content */}
          <div
            onClick={() => onNavigate('my-content')}
            className="group rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700">
                {contents.length} items
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                {t('dashboard.myContent')}
              </h3>
              <p className="text-xs text-slate-500">
                Library & saved materials
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client CRM & Relationship Engine Overview (Features #11-#20) */}
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">Client CRM & Follow-ups Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {totalClientsCount} Active Records
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Features #11-#20 • Segmentation, Journey Milestones, WhatsApp Drafter, SIP & Review Alerts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('client-crm')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <span>Open Client CRM Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Metric Mini-Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60">
          <div
            onClick={() => onNavigate('client-crm')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold">
              <span>Due Today</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <p className="text-xl font-black text-white mt-1">{followUpsDueToday.length}</p>
            <p className="text-[10px] text-slate-400">Immediate calls & meetings</p>
          </div>

          <div
            onClick={() => onNavigate('client-crm')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[11px] text-rose-300 font-bold">
              <span>Overdue Follow-ups</span>
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            </div>
            <p className="text-xl font-black text-white mt-1">{followUpsOverdue.length}</p>
            <p className="text-[10px] text-slate-400">Pending action items</p>
          </div>

          <div
            onClick={() => onNavigate('client-crm')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
              <span>Upcoming Birthdays</span>
              <Cake className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-black text-white mt-1">{upcomingBirthdays.length}</p>
            <p className="text-[10px] text-slate-400">1-click greeting triggers</p>
          </div>

          <div
            onClick={() => onNavigate('client-crm')}
            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[11px] text-pink-300 font-bold">
              <span>Upcoming Anniv.</span>
              <Heart className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <p className="text-xl font-black text-white mt-1">{upcomingAnniversaries.length}</p>
            <p className="text-[10px] text-slate-400">1-click greeting triggers</p>
          </div>
        </div>
      </div>

      {/* Today's Suggested Financial Topic (One-Click Creation) */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {t('dashboard.todaysTopic')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              {suggestedTopic.tag}
            </span>
          </div>
          <span className="text-xs text-slate-500 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Updated today
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
          {topicTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-3xl leading-relaxed">
          {topicTeaser}
        </p>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onSelectTopicForGeneration(suggestedTopic.subjectId)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-sm transition-all active:scale-95"
          >
            <span>{t('dashboard.useTopicNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Target subject: <strong>{getSubjectTitle(suggestedTopic.subjectId)}</strong>
          </span>
        </div>
      </div>

      {/* Advisory Pillars & Custom Subject Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'gu'
                  ? `નાણાકીય વિષયો અને કંપની સબ્જેક્ટ્સ (${allSubjects.length})`
                  : `Financial Pillars & Custom Company Subjects (${allSubjects.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'gu'
                ? 'કોઈપણ સબ્જેક્ટ પર ક્લિક કરીને સીધું કન્ટેન્ટ જનરેટ કરો અથવા તમારો પોતાનો કસ્ટમ સબ્જેક્ટ ઉમેરો'
                : 'Click any topic to generate targeted content, or add your customized subject'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center space-x-1.5 transition-all shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>{language === 'gu' ? '+ કસ્ટમ સબ્જેક્ટ ઉમેરો' : '+ Add Custom Subject'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1">
          {allSubjects.map((sub) => {
            const isCustom = sub.isCustom;
            const title = sub.customTitle || getSubjectTitle(sub.id, language);
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectTopicForGeneration(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isCustom
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-2xs hover:scale-102'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {isCustom && (
                  <span className="text-[10px] bg-indigo-200/60 text-indigo-900 font-extrabold px-1 rounded">
                    ★ CUSTOM
                  </span>
                )}
                <span>{title}</span>
                {sub.companyOrSector && (
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ({sub.companyOrSector})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal for adding custom subjects from Dashboard */}
      <AddCustomSubjectModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubjectAddedAndSelected={(id) => onSelectTopicForGeneration(id)}
      />

      {/* Recent Generated Content & Library Preview */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {t('dashboard.recentContent')}
          </h2>
          <button
            onClick={() => onNavigate('my-content')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View All ({contents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {contents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
            <p className="text-sm text-slate-600 font-medium mb-3">
              {t('dashboard.noContentYet')}
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm hover:bg-emerald-700 transition-colors"
            >
              {t('dashboard.createContent')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contents.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {getSubjectTitle(item.subjectId)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      Lang: {item.contentLanguage.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4
                    onClick={() => onViewContentDetail(item)}
                    className="font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1 mb-1"
                  >
                    {item.deepArticle.headline}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.deepArticle.subheadline || item.deepArticle.body}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleWhatsAppShare(item)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    title={t('dashboard.shareWhatsApp')}
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleCopyHeadline(item)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                    title="Copy Article"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button
                    onClick={() => onViewContentDetail(item)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <span>{t('dashboard.viewFull')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
