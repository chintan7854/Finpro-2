import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { MAIN_FINANCIAL_SUBJECTS } from '../constants/subjects';
import { SUBJECT_ADVISOR_SUGGESTIONS } from '../constants/advisorSubjectSuggestions';
import { AddCustomSubjectModal } from './AddCustomSubjectModal';
import {
  FinancialSubjectId,
  ContentType,
  ArticleLength,
  AudienceType,
  LanguageCode,
  GeneratedContent
} from '../types';
import { generateAdvisorContent } from '../services/contentGenerator';
import {
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  FileText,
  MessageCircle,
  Share2,
  Video,
  Sliders,
  AlertCircle,
  HelpCircle,
  Check,
  User,
  Award,
  Phone,
  RotateCcw,
  Tag,
  PlusCircle,
} from 'lucide-react';

interface CreateContentViewProps {
  initialSubjectId?: FinancialSubjectId;
  onContentGenerated: (content: GeneratedContent) => void;
}

export const CreateContentView: React.FC<CreateContentViewProps> = ({
  initialSubjectId,
  onContentGenerated,
}) => {
  const { language, setLanguage, supportedLanguages, t, getSubjectTitle, getDefaultCta, getDefaultDisclaimer } = useI18n();
  const { profile, updateProfile, consumeCredit, allSubjects, customSubjects } = useAdvisor();

  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Form State
  const [selectedSubject, setSelectedSubject] = useState<FinancialSubjectId>(
    initialSubjectId || 'sip_mutual_fund'
  );
  const [sameAsAppLanguage, setSameAsAppLanguage] = useState<boolean>(true);
  const [contentLanguage, setContentLanguage] = useState<LanguageCode>(language);
  const [contentType, setContentType] = useState<ContentType>('all_in_one');
  const [articleLength, setArticleLength] = useState<ArticleLength>('medium');
  const [audience, setAudience] = useState<AudienceType>('general_public');

  // Per-Subject Advisor Identity State (Prefilled from Profile)
  const [advisorName, setAdvisorName] = useState<string>(profile.advisorName);
  const [designation, setDesignation] = useState<string>(profile.designation);
  const [achievement, setAchievement] = useState<string>(profile.achievement || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber);
  const [updateMasterProfile, setUpdateMasterProfile] = useState<boolean>(false);

  // Keep identity inputs synced if profile changes initially
  useEffect(() => {
    setAdvisorName(profile.advisorName);
    setDesignation(profile.designation);
    setAchievement(profile.achievement || '');
    setPhoneNumber(profile.phoneNumber);
  }, [profile.id]);

  // Branding Toggles (Default ON)
  const [useAdvisorProfile, setUseAdvisorProfile] = useState<boolean>(true);
  const [useDefaultCta, setUseDefaultCta] = useState<boolean>(true);
  const [customCta, setCustomCta] = useState<string>('');
  const [useDefaultDisclaimer, setUseDefaultDisclaimer] = useState<boolean>(true);

  // Loading State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync content language when sameAsAppLanguage is checked and app language changes
  useEffect(() => {
    if (sameAsAppLanguage) {
      setContentLanguage(language);
    }
  }, [language, sameAsAppLanguage]);

  const activeContentLang = sameAsAppLanguage ? language : contentLanguage;
  const currentAppLangInfo = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  // Subject-specific suggestions
  const suggestions = SUBJECT_ADVISOR_SUGGESTIONS[selectedSubject] || SUBJECT_ADVISOR_SUGGESTIONS.default;

  const handleResetToProfile = () => {
    setAdvisorName(profile.advisorName);
    setDesignation(profile.designation);
    setAchievement(profile.achievement || '');
    setPhoneNumber(profile.phoneNumber);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      // If user opted to update their master profile permanently:
      if (updateMasterProfile) {
        updateProfile({
          advisorName: advisorName.trim(),
          designation: designation.trim(),
          achievement: achievement.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      }

      const result = await generateAdvisorContent({
        subjectId: selectedSubject,
        subjectTitle: getSubjectTitle(selectedSubject, activeContentLang),
        contentType,
        articleLength,
        audience,
        contentLanguage: activeContentLang,
        advisorProfile: profile,
        useDefaultCta,
        useDefaultDisclaimer,
        customCta: useDefaultCta ? undefined : customCta,
        customAdvisorName: useAdvisorProfile ? advisorName : 'Financial Advisor',
        customDesignation: useAdvisorProfile ? designation : 'Certified Financial Planner',
        customAchievement: useAdvisorProfile ? achievement : undefined,
        customContact: useAdvisorProfile ? phoneNumber : undefined,
      });

      // Deduct credit
      consumeCredit();

      onContentGenerated(result);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err?.message || 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('content.createTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('content.createSubtitle')}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Main Financial Subject Selection */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>{t('content.subject')}</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center space-x-1.5 transition-all shadow-2xs hover:scale-102"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'gu' ? '+ કસ્ટમ સબ્જેક્ટ ઉમેરો' : '+ Add Custom Subject'}</span>
            </button>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {getSubjectTitle(selectedSubject, activeContentLang)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Select from {allSubjects.length} financial pillars ({customSubjects.length} custom, {MAIN_FINANCIAL_SUBJECTS.length} fixed), or add your company/sector customized topic.
        </p>

        {/* Financial Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50/50">
          {allSubjects.map((item) => {
            const isSelected = selectedSubject === item.id;
            const isCustom = item.isCustom;
            const title = item.customTitle || getSubjectTitle(item.id, activeContentLang);
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedSubject(item.id)}
                className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col justify-between ${
                  isSelected
                    ? isCustom
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                    : isCustom
                    ? 'bg-indigo-50/60 text-slate-800 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'text-white/80'
                      : isCustom
                      ? 'text-indigo-600 font-extrabold'
                      : 'text-slate-400'
                  }`}>
                    {isCustom ? '★ CUSTOM' : item.category}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="line-clamp-2 leading-snug">{title}</span>
                {item.companyOrSector && (
                  <span className={`text-[10px] mt-1 font-medium truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                    🏢 {item.companyOrSector}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Subject Modal */}
      <AddCustomSubjectModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubjectAddedAndSelected={(id) => setSelectedSubject(id)}
      />

      {/* STEP 2: Language Configuration (Application Language vs Content Language) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
            2
          </span>
          <span>Language System</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Current Application Language Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('content.appLanguage')}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">
                {currentAppLangInfo.nativeLabel} ({currentAppLangInfo.label})
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-semibold">
                UI Active
              </span>
            </div>
          </div>

          {/* Content Language Control */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('content.contentLanguage')}
            </span>

            {/* Checkbox: Same as Application Language */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer mb-2.5">
              <input
                type="checkbox"
                checked={sameAsAppLanguage}
                onChange={(e) => {
                  setSameAsAppLanguage(e.target.checked);
                  if (e.target.checked) {
                    setContentLanguage(language);
                  }
                }}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
              />
              <span>{t('content.sameAsAppLang')}</span>
            </label>

            {!sameAsAppLanguage && (
              <select
                value={contentLanguage}
                onChange={(e) => setContentLanguage(e.target.value as LanguageCode)}
                className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* STEP 3: Format, Length & Target Audience */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
            3
          </span>
          <span>Content Format & Tone</span>
        </label>

        {/* Content Type Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('content.type')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { id: 'all_in_one', label: t('content.type.all_in_one'), icon: Layers },
              { id: 'deep_article', label: t('content.type.deep_article'), icon: FileText },
              { id: 'whatsapp', label: t('content.type.whatsapp'), icon: MessageCircle },
              { id: 'social_media', label: t('content.type.social_media'), icon: Share2 },
              { id: 'video_script', label: t('content.type.video_script'), icon: Video },
            ].map((f) => {
              const isSelected = contentType === f.id;
              const Icon = f.icon;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setContentType(f.id as ContentType)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="line-clamp-1">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Article Length */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('content.articleLength')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'short', label: t('content.length.short') },
              { id: 'medium', label: t('content.length.medium') },
              { id: 'long', label: t('content.length.long') },
            ].map((l) => {
              const isSelected = articleLength === l.id;
              return (
                <button
                  type="button"
                  key={l.id}
                  onClick={() => setArticleLength(l.id as ArticleLength)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t('content.audience')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'general_public', label: t('content.audience.general_public') },
              { id: 'salaried', label: t('content.audience.salaried') },
              { id: 'business_owners', label: t('content.audience.business_owners') },
              { id: 'young_earners', label: t('content.audience.young_earners') },
              { id: 'retirees', label: t('content.audience.retirees') },
            ].map((a) => {
              const isSelected = audience === a.id;
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setAudience(a.id as AudienceType)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 4: Advisor Branding, Subject-Specific Designation & Achievement */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <label className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
              4
            </span>
            <span>Advisor Identity & Credentials for This Content</span>
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetToProfile}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center space-x-1"
              title="Reset fields to match default Master Profile"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset from Profile</span>
            </button>
          </div>
        </div>

        {/* Master Profile Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
          <input
            type="checkbox"
            id="useAdvisorProfile"
            checked={useAdvisorProfile}
            onChange={(e) => setUseAdvisorProfile(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 mt-0.5"
          />
          <div className="flex-1">
            <label htmlFor="useAdvisorProfile" className="text-xs font-bold text-slate-900 block cursor-pointer">
              {t('content.useAdvisorProfile')}
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Include advisor personal branding, contacts, and credentials in the generated marketing material.
            </p>
          </div>
        </div>

        {useAdvisorProfile && (
          <div className="space-y-4 pt-1">
            {/* Advisor Name and Phone Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Advisor Name</span>
                </label>
                <input
                  type="text"
                  value={advisorName}
                  onChange={(e) => setAdvisorName(e.target.value)}
                  placeholder="e.g. Rajesh V. Sharma"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp / Phone Number</span>
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98250 12345"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Professional Designation with Subject-Specific Quick Suggestions */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Professional Designation (Subject Specific)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Editable for this subject
                </span>
              </div>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. AMFI-Registered Mutual Fund Distributor"
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-emerald-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
              />

              {/* 1-Click Designation Chips */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  💡 1-Click Suggestions for {getSubjectTitle(selectedSubject, activeContentLang)}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.designations.map((desig, idx) => {
                    const isCurrent = designation.trim() === desig.trim();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDesignation(desig)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all text-left flex items-center space-x-1 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                            : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/60 hover:border-emerald-300'
                        }`}
                      >
                        {isCurrent && <Check className="w-3 h-3 text-white" />}
                        <span>{desig}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Milestone Achievement with Subject-Specific Quick Suggestions */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Key Achievement / Milestone (Builds Instant Trust)</span>
                </label>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Editable for this subject
                </span>
              </div>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g. Managing 500+ Active SIP Accounts • 12+ Years Experience"
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-amber-300 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
              />

              {/* 1-Click Achievement Chips */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  💡 1-Click Achievements for {getSubjectTitle(selectedSubject, activeContentLang)}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.achievements.map((ach, idx) => {
                    const isCurrent = achievement.trim() === ach.trim();
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAchievement(ach)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all text-left flex items-center space-x-1 ${
                          isCurrent
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60 hover:border-amber-300'
                        }`}
                      >
                        {isCurrent && <Check className="w-3 h-3 text-white" />}
                        <span>{ach}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Checkbox: Also save to Master Profile */}
            <div className="flex items-center space-x-2.5 pt-1 px-1">
              <input
                type="checkbox"
                id="updateMasterProfile"
                checked={updateMasterProfile}
                onChange={(e) => setUpdateMasterProfile(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="updateMasterProfile" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Also save this Designation & Achievement as default in my Master Profile
              </label>
            </div>
          </div>
        )}

        {/* Toggle 2: Use Default CTA */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="useDefaultCta"
              checked={useDefaultCta}
              onChange={(e) => setUseDefaultCta(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 mt-0.5"
            />
            <div className="flex-1">
              <label htmlFor="useDefaultCta" className="text-xs font-bold text-slate-900 block cursor-pointer">
                {t('content.useDefaultCta')}
              </label>
              <p className="text-[11px] text-emerald-800 font-medium italic mt-0.5">
                "{profile.defaultCTA || getDefaultCta(activeContentLang)}"
              </p>
            </div>
          </div>

          {!useDefaultCta && (
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                {t('content.customCta')}
              </label>
              <input
                type="text"
                value={customCta}
                onChange={(e) => setCustomCta(e.target.value)}
                placeholder="e.g. Schedule a 15-minute retirement audit today."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Toggle 3: Use Default Disclaimer */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
          <input
            type="checkbox"
            id="useDefaultDisclaimer"
            checked={useDefaultDisclaimer}
            onChange={(e) => setUseDefaultDisclaimer(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500 mt-0.5"
          />
          <div className="flex-1">
            <label htmlFor="useDefaultDisclaimer" className="text-xs font-bold text-slate-900 block cursor-pointer">
              {t('content.useDefaultDisclaimer')}
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              "{profile.defaultDisclaimer || getDefaultDisclaimer(activeContentLang)}"
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Button: GENERATE CONTENT */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-base sm:text-lg flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-[0.99] ${
            isGenerating
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30 hover:shadow-emerald-600/40'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : 'animate-pulse'}`} />
          <span>
            {isGenerating ? t('content.generating') : t('content.generateBtn')}
          </span>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2">
          Cost: 1 Credit • Single consolidated request returns Article, WhatsApp status, caption, script & poster.
        </p>
      </div>
    </div>
  );
};
