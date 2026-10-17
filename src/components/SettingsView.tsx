import React from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { LanguageCode } from '../types';
import {
  Globe,
  Zap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Check,
  CreditCard,
  Layers,
  Info,
  Bot,
  Cpu,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAiEngine, AiProvider, OpenAiModel, GeminiModel } from '../context/AiEngineContext';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, supportedLanguages, t } = useI18n();
  const { subscription, resetToDefaultProfile } = useAdvisor();
  const {
    provider,
    setProvider,
    openaiModel,
    setOpenaiModel,
    geminiModel,
    setGeminiModel,
    serverConfig,
    isLoadingConfig,
    refreshServerStatus,
  } = useAiEngine();

  const handleResetData = () => {
    if (window.confirm(t('settings.resetDemoConfirm'))) {
      resetToDefaultProfile();
      alert('Profile reset to sample default data.');
    }
  };

  const planTiers = [
    {
      id: 'free',
      name: 'Free Starter',
      credits: '10 Credits/mo',
      features: ['Basic Templates', 'English & Hindi', 'Standard Branding'],
      current: subscription.planId === 'free',
    },
    {
      id: 'pro',
      name: 'Advisor Pro',
      credits: '50 Credits/mo',
      features: ['All 10 Indian Languages', 'All 17 Financial Subjects', 'WhatsApp Broadcast Engine', 'Poster Cards'],
      current: subscription.planId === 'pro',
      badge: 'Current Plan',
    },
    {
      id: 'business',
      name: 'Agency & Team',
      credits: '200 Credits/mo',
      features: ['Multi-Advisor Profiles', 'Custom Domain', 'CRM Sync (Phase 2)', 'White-labeling'],
      current: subscription.planId === 'business',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* SECTION 1: Application Language Switching (All 10 Indian Languages) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Globe className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t('settings.language')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.appLanguageDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {supportedLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {lang.code.toUpperCase()}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <div>
                  <span className="block text-base font-bold text-slate-900">
                    {lang.nativeLabel}
                  </span>
                  <span className="block text-[11px] text-slate-500 truncate">
                    {lang.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: AI Content Generation Engine & Model Switcher (Gemini & OpenAI) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  AI Content Generation Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Dual-Engine Switching
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Switch between Google Gemini (Paid API Key) and OpenAI (GPT-4o) anytime. Changes are saved permanently.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refreshServerStatus()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 self-start sm:self-auto transition-colors"
            title="Refresh connection status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingConfig ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>

        {/* Server Keys Status Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bot className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800">Google Gemini API</span>
                <span className="block text-[11px] text-slate-500">Server environment key</span>
              </div>
            </div>
            {serverConfig?.geminiAvailable ? (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                <span>Standby / Fallback</span>
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="block text-xs font-bold text-slate-800">OpenAI API (GPT-4o)</span>
                <span className="block text-[11px] text-slate-500">Server environment key</span>
              </div>
            </div>
            {serverConfig?.openaiAvailable ? (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full" title="Set OPENAI_API_KEY in server environment to enable live OpenAI calls">
                <AlertCircle className="w-3 h-3" />
                <span>Configured on Server</span>
              </span>
            )}
          </div>
        </div>

        {/* Primary Engine Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Select Active AI Provider (મુખ્ય AI એન્જિન પસંદ કરો):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Gemini */}
            <button
              type="button"
              onClick={() => setProvider('gemini')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                provider === 'gemini'
                  ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  {provider === 'gemini' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900">Google Gemini</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fast, natively multilingual for all 10 Indian languages. Powered by paid Gemini API key.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-800">Primary Engine</span>
                <span className="text-slate-400">Gemini 3.8 / 2.5</span>
              </div>
            </button>

            {/* Option 2: OpenAI */}
            <button
              type="button"
              onClick={() => setProvider('openai')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                provider === 'openai'
                  ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  {provider === 'openai' && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900">OpenAI GPT</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Industry-leading reasoning with GPT-4o & GPT-4o-mini. Powered by OpenAI API key.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-indigo-800">Primary Engine</span>
                <span className="text-slate-400">{openaiModel.toUpperCase()}</span>
              </div>
            </button>

            {/* Option 3: Auto-Fallback */}
            <button
              type="button"
              onClick={() => setProvider('auto')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                provider === 'auto'
                  ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  {provider === 'auto' && (
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-slate-900">Auto Protection</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Automatic failover protection. If Gemini or OpenAI encounters rate limit or downtime, the other takes over seamlessly.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-amber-800">Zero-Downtime</span>
                <span className="text-slate-400">Gemini ⇄ OpenAI</span>
              </div>
            </button>
          </div>
        </div>

        {/* Model Selection Specifics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* OpenAI Model Selection */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="block text-xs font-bold text-slate-700">
              OpenAI Model Preference:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOpenaiModel('gpt-4o-mini')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  openaiModel === 'gpt-4o-mini'
                    ? 'bg-white border-indigo-500 font-bold text-indigo-900 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block font-bold">GPT-4o Mini</span>
                <span className="block text-[10px] text-slate-400 font-normal">Super fast & economical</span>
              </button>
              <button
                type="button"
                onClick={() => setOpenaiModel('gpt-4o')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  openaiModel === 'gpt-4o'
                    ? 'bg-white border-indigo-500 font-bold text-indigo-900 shadow-2xs ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block font-bold">GPT-4o</span>
                <span className="block text-[10px] text-slate-400 font-normal">Deep reasoning & details</span>
              </button>
            </div>
          </div>

          {/* Gemini Model Selection */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="block text-xs font-bold text-slate-700">
              Gemini Model Preference:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGeminiModel('gemini-3.8-flash')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  geminiModel === 'gemini-3.8-flash'
                    ? 'bg-white border-emerald-500 font-bold text-emerald-900 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block font-bold">Gemini 3.8 Flash</span>
                <span className="block text-[10px] text-slate-400 font-normal">Latest speed & accuracy</span>
              </button>
              <button
                type="button"
                onClick={() => setGeminiModel('gemini-2.5-flash')}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                  geminiModel === 'gemini-2.5-flash'
                    ? 'bg-white border-emerald-500 font-bold text-emerald-900 shadow-2xs ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="block font-bold">Gemini 2.5 Flash</span>
                <span className="block text-[10px] text-slate-400 font-normal">Standard production model</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informative Note for the User */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              કન્ટેન્ટ જનરેશન માટે એપીઆઈ સ્વિચિંગ સંપૂર્ણ સક્રિય છે:
            </p>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              તમે જ્યારે પણ ઇચ્છો ત્યારે અહીંથી અથવા ઉપરના હેડર બારમાંથી <strong>Google Gemini</strong> અને <strong>OpenAI GPT</strong> વચ્ચે સ્વિચ કરી શકો છો. તમારી પસંદગી પરમેનેન્ટ સેવ રહેશે અને તમામ સ્ટોરી, ફાઇનાન્સ ન્યૂઝ વિશ્લેષણ, થીમ પોસ્ટર, પ્રશ્નોત્તરી (Q&amp;A) અને પ્રસ્તુતિ જનરેશનમાં તે જ એન્જિનનો ઉપયોગ થશે.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Future Subscription Architecture & Credits */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t('settings.subscription')} & Credits Architecture
            </h2>
            <p className="text-xs text-slate-500">
              {t('settings.creditsDesc')}
            </p>
          </div>
        </div>

        {/* Current Active Credits Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Tier
            </span>
            <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
              {subscription.planName}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Status: {subscription.subscriptionStatus.toUpperCase()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Credits Remaining
            </span>
            <span className="text-lg font-extrabold text-emerald-900 mt-0.5 block">
              {subscription.creditsRemaining} / {subscription.credits}
            </span>
            <span className="text-[11px] text-emerald-700">
              Auto-renews monthly
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Usage This Cycle
            </span>
            <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">
              {subscription.creditsUsed} Kits
            </span>
            <span className="text-[11px] text-slate-500">
              Multi-channel kits generated
            </span>
          </div>
        </div>

        {/* Tier Architecture Preview */}
        <div>
          <span className="block text-xs font-bold text-slate-700 mb-3">
            Available SaaS Tiers (Phase 1 Ready Architecture)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {planTiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  tier.current
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-slate-900">{tier.name}</h3>
                    {tier.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mb-3">
                    {tier.credits}
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block text-center">
                    {tier.current ? 'Current Active Tier' : 'Available in Upgrade'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: System Data & Maintenance */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('settings.resetDemo')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset advisor profile, credentials, and settings to the default template state.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
