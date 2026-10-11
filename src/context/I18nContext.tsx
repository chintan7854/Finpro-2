import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LanguageInfo, FinancialSubjectId } from '../types';
import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  FINANCIAL_SUBJECT_TITLES,
  DEFAULT_CTAS,
  DEFAULT_DISCLAIMERS
} from '../i18n/translations';

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  getSubjectTitle: (subjectId: FinancialSubjectId, targetLang?: LanguageCode) => string;
  getDefaultCta: (lang?: LanguageCode) => string;
  getDefaultDisclaimer: (lang?: LanguageCode) => string;
  supportedLanguages: LanguageInfo[];
}

const STORAGE_KEY = 'finadvisor_app_language';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en'; // English is required default
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const getSubjectTitle = (subjectId: FinancialSubjectId, targetLang?: LanguageCode): string => {
    const lang = targetLang || language;
    const titles = FINANCIAL_SUBJECT_TITLES[subjectId];
    if (titles) {
      return titles[lang] || titles.en || subjectId;
    }
    // Check localStorage custom subjects
    try {
      const customStr = localStorage.getItem('finadvisor_custom_subjects');
      if (customStr) {
        const customs = JSON.parse(customStr);
        const found = customs.find((c: any) => c.id === subjectId);
        if (found && found.title) {
          return found.title;
        }
      }
    } catch {
      // ignore
    }
    return subjectId;
  };

  const getDefaultCta = (lang?: LanguageCode): string => {
    const target = lang || language;
    return DEFAULT_CTAS[target] || DEFAULT_CTAS.en;
  };

  const getDefaultDisclaimer = (lang?: LanguageCode): string => {
    const target = lang || language;
    return DEFAULT_DISCLAIMERS[target] || DEFAULT_DISCLAIMERS.en;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getSubjectTitle,
        getDefaultCta,
        getDefaultDisclaimer,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
