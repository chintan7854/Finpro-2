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
  Info
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, supportedLanguages, t } = useI18n();
  const { subscription, resetToDefaultProfile } = useAdvisor();

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

      {/* SECTION 2: Future Subscription Architecture & Credits */}
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
