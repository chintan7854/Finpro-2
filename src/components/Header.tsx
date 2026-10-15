import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  Globe,
  Sparkles,
  ChevronDown,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { LanguageCode } from '../types';
import { NewsNotificationBell } from './news/NewsNotificationBell';

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { language, setLanguage, supportedLanguages, t } = useI18n();
  const { profile, subscription } = useAdvisor();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLangInfo = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLang = (code: LanguageCode) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {t('app.name')}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t('dashboard.planBadge')}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xs">
                {t('app.tagline')}
              </p>
            </div>
          </div>

          {/* Right Controls: Credits, Language Selector, Advisor Avatar */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Credits pill */}
            <div
              onClick={() => onNavigate('settings')}
              className="hidden xs:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer transition-colors"
              title={`${subscription.creditsRemaining} credits available`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                <strong className="text-slate-900">{subscription.creditsRemaining}</strong> credits
              </span>
            </div>

            {/* News Notification Bell with unread badge */}
            <NewsNotificationBell onOpenNews={() => onNavigate('finance-news')} />

            {/* Language Selector Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-900">
                  {currentLangInfo.nativeLabel}
                </span>
                <span className="text-slate-400 text-xs hidden md:inline">
                  ({currentLangInfo.label})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t('settings.language')}
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {supportedLanguages.map((lang) => {
                      const isSelected = lang.code === language;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLang(lang.code)}
                          className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="block text-sm">{lang.nativeLabel}</span>
                            <span className="block text-xs text-slate-400">{lang.label} • {lang.region}</span>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Quick Nav */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center space-x-2 p-1 rounded-full border transition-all ${
                currentView === 'profile'
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={profile.advisorName}
            >
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.advisorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
