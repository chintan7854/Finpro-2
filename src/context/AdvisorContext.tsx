import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  AdvisorProfile,
  BrandingSettings,
  SubscriptionInfo,
  GeneratedContent,
  LanguageCode,
  CustomFinancialSubject,
  FinancialSubject,
} from '../types';
import { DEFAULT_CTAS, DEFAULT_DISCLAIMERS } from '../i18n/translations';
import { MAIN_FINANCIAL_SUBJECTS } from '../constants/subjects';
import { validateFinancialSubject } from '../utils/financeSubjectValidator';

interface AdvisorContextType {
  profile: AdvisorProfile;
  updateProfile: (updated: Partial<AdvisorProfile>) => void;
  resetToDefaultProfile: () => void;
  subscription: SubscriptionInfo;
  consumeCredit: () => boolean;
  contents: GeneratedContent[];
  saveContent: (item: GeneratedContent) => void;
  toggleFavorite: (id: string) => void;
  deleteContent: (id: string) => void;
  recentContents: GeneratedContent[];
  favoriteContents: GeneratedContent[];
  customSubjects: CustomFinancialSubject[];
  allSubjects: FinancialSubject[];
  addCustomSubject: (data: {
    title: string;
    companyOrSector?: string;
    category?: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning';
  }) => {
    success: boolean;
    error?: string;
    errorGu?: string;
    subject?: CustomFinancialSubject;
  };
  deleteCustomSubject: (id: string) => void;
}

const PROFILE_STORAGE_KEY = 'finadvisor_master_profile';
const CONTENTS_STORAGE_KEY = 'finadvisor_saved_contents';
const SUBSCRIPTION_STORAGE_KEY = 'finadvisor_subscription';
const CUSTOM_SUBJECTS_STORAGE_KEY = 'finadvisor_custom_subjects';

const INITIAL_CUSTOM_SUBJECTS: CustomFinancialSubject[] = [
  {
    id: 'custom_hdfc_life_sanchay',
    title: 'HDFC Life Sanchay Plus (Guaranteed Income & Wealth)',
    companyOrSector: 'HDFC Life Insurance',
    category: 'protection',
    createdAt: new Date().toISOString(),
    isCustom: true,
  },
  {
    id: 'custom_sbi_multicap_wealth',
    title: 'SBI Mutual Fund Multi-Cap Wealth Creation Strategy',
    companyOrSector: 'SBI Mutual Fund',
    category: 'wealth',
    createdAt: new Date().toISOString(),
    isCustom: true,
  },
  {
    id: 'custom_doctors_wealth_succession',
    title: 'Doctors & Clinic Owners Wealth & Tax Planning',
    companyOrSector: 'Medical Professionals Wealth',
    category: 'planning',
    createdAt: new Date().toISOString(),
    isCustom: true,
  },
];

const DEFAULT_BRANDING: BrandingSettings = {
  autoApplyBranding: true,
  autoApplyPhoto: true,
  autoApplyName: true,
  autoApplyDesignation: true,
  autoApplyContact: true,
  autoApplyDefaultCta: true,
  autoApplyDisclaimer: true,
};

const INITIAL_PROFILE: AdvisorProfile = {
  id: 'adv_master_001',
  profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
  advisorName: 'Rajesh V. Sharma',
  designation: 'Certified Financial Planner (CFP) & Mutual Fund Distributor',
  achievement: 'MDRT Qualifier 2024 • Managing ₹140+ Cr AUM • 1,200+ Satisfied Families',
  phoneNumber: '+91 98250 12345',
  whatsappNumber: '+91 98250 12345',
  email: 'rajesh.sharma@finwealthadvisors.in',
  location: 'Ahmedabad & Mumbai, India',
  website: 'https://finwealthadvisors.in',
  professionalDetails: 'AMFI Reg. ARN-184920 | NISM Series V-A Certified | IRDAI Lic. No. 6749320',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  defaultCTA: DEFAULT_CTAS.en,
  defaultDisclaimer: DEFAULT_DISCLAIMERS.en,
  applicationLanguage: 'en',
  contentLanguage: 'en',
  sameAsAppLanguage: true,
  brandingPreferences: DEFAULT_BRANDING,
  updatedAt: new Date().toISOString(),
};

const INITIAL_SUBSCRIPTION: SubscriptionInfo = {
  planId: 'pro',
  planName: 'Advisor Growth Pro',
  subscriptionStatus: 'active',
  credits: 50,
  creditsUsed: 6,
  creditsRemaining: 44,
  subscriptionStart: '2026-01-01',
  subscriptionEnd: '2027-01-01',
};

// Seed sample content for rich dashboard preview
const SAMPLE_SAVED_CONTENT: GeneratedContent = {
  id: 'demo_cnt_001',
  subjectId: 'sip_mutual_fund',
  subjectTitle: 'SIP / Mutual Fund',
  contentLanguage: 'en',
  contentType: 'all_in_one',
  articleLength: 'medium',
  audience: 'general_public',
  createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  isFavorite: true,
  isSaved: true,
  generationSource: 'demo_engine',
  deepArticle: {
    headline: 'The Power of Rupee-Cost Averaging: Why Market Corrections Are Your SIP’s Best Friend',
    subheadline: 'How emotional exits derail wealth creation and why continuing your monthly investment turns volatility into high returns.',
    body: `When equity markets experience sudden volatility or headline-grabbing pullbacks, a common reflex among retail investors is the temptation to stop or pause their Systematic Investment Plans (SIPs). However, disciplined financial planning reveals that market corrections are precisely the intervals when true wealth is quietly engineered.\n\nThrough the mathematical mechanism of Rupee-Cost Averaging, your fixed monthly allocation automatically purchases more fund units when net asset values (NAVs) decline. When the market cycle eventually turns upward, this larger accumulated basket of units accelerates compound portfolio growth.\n\nConsistent data across the last 25 years of Indian equity indices shows that investors who persevered through major downturns earned significantly superior internal rates of return (IRR) compared to peers who attempted market timing.`,
    keyTakeaways: [
      'Pausing an SIP during market dips removes the primary mathematical advantage of Rupee-Cost Averaging.',
      'A ₹10,000 monthly SIP compounding at 12% over 20 years accumulates approx ₹99.9 Lakhs on an invested capital of just ₹24 Lakhs.',
      'Consult your certified advisor before letting short-term market noise disrupt your long-term life milestones.'
    ],
    readTime: '3 min read'
  },
  whatsappStatus: {
    slide1: '📉 Worried about market volatility? Pausing your SIP right now might be the costliest mistake you make this year.',
    slide2: '💡 When markets dip, your fixed monthly SIP buys MORE mutual fund units at lower prices. This is Rupee-Cost Averaging at work!',
    slide3: '📊 Stay disciplined to secure your future goals. Contact Rajesh V. Sharma, CFP at +91 98250 12345 for a complimentary portfolio review.'
  },
  whatsappMessage: `*Why Market Dips Are a Blessing for Your SIP!* 📈🌱\n\nDear Investor,\n\nAre headlines making you nervous about your mutual fund investments? Here is a gentle reminder from the desk of your financial planner:\n\n✨ *Rule of Long-term Wealth:* You cannot control the daily market, but you can control your discipline.\n\n🔹 *Lower NAV = More Units:* Every market correction lets your SIP accumulate fund units on discount.\n🔹 *Compounding Edge:* When the market recovers, every extra unit accelerates your returns.\n🔹 *Stay Invested:* Avoid the trap of panic selling or pausing contributions.\n\n📞 *Need guidance or a portfolio health-check?*\nCall / WhatsApp: +91 98250 12345\n*Rajesh V. Sharma, CFP*\n_AMFI Reg. ARN-184920_\n\n_Disclaimer: Mutual fund investments are subject to market risks. Read all scheme related documents carefully._`,
  socialMedia: {
    postHook: 'Market timing is a myth. Disciplined time in the market is a reality. 📊',
    platformCaption: `Why do most wealth creators celebrate market corrections while novice investors panic?\n\nThe answer is simple: Rupee-Cost Averaging.\n\nWhen NAVs drop, your monthly SIP buys more fund units. Pausing your SIP during a correction is like walking out of a shopping festival right when your favorite goods are discounted 20%.\n\nDiscipline beats timing. Every single time.\n\n👇 Drop your thoughts or DM to review your long-term wealth roadmap!`,
    hashtags: ['#MutualFundsSahiHai', '#SIP', '#WealthCreation', '#FinancialPlanning', '#InvestmentAdvisory', '#CFP']
  },
  videoScript: {
    title: 'Why Pausing Your SIP in a Dip Destroys Returns',
    hook: 'If you are thinking about stopping your SIP because the market is down—STOP and listen for 45 seconds!',
    storyPoints: [
      'Imagine your favorite store putting on a 15% discount. Do you stop shopping, or do you stock up?',
      'Your monthly SIP does the exact same thing: it buys more units when prices dip.',
      'Stopping your SIP turns temporary paper losses into permanent missed opportunities.'
    ],
    callToAction: 'Stay disciplined. If you need clarity on your asset allocation, reach out to me today.',
    durationEstimate: '45 seconds'
  },
  financialInsights: {
    statHighlight: '12% Annualized SIP over 15 years turns ₹15,000/mo into ₹75.7 Lakhs.',
    actionableRule: 'The 3-Year Rule: Never judge an equity SIP in less than a 36-month cycle.',
    comparisonNote: 'Stopping SIP in down markets drops portfolio CAGR by up to 2.8% over a decade.'
  },
  appliedCta: DEFAULT_CTAS.en,
  appliedDisclaimer: DEFAULT_DISCLAIMERS.en,
  advisorSnapshot: {
    name: 'Rajesh V. Sharma',
    designation: 'Certified Financial Planner (CFP) & Mutual Fund Distributor',
    contact: '+91 98250 12345',
    whatsapp: '+91 98250 12345',
    email: 'rajesh.sharma@finwealthadvisors.in',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
    location: 'Ahmedabad & Mumbai',
    credentials: 'ARN-184920 | CFP'
  }
};

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export const AdvisorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<AdvisorProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse advisor profile from storage', e);
    }
    return INITIAL_PROFILE;
  });

  const [contents, setContents] = useState<GeneratedContent[]>(() => {
    try {
      const saved = localStorage.getItem(CONTENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse contents from storage', e);
    }
    return [SAMPLE_SAVED_CONTENT];
  });

  const [subscription, setSubscription] = useState<SubscriptionInfo>(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_SUBSCRIPTION, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return INITIAL_SUBSCRIPTION;
  });

  const [customSubjects, setCustomSubjects] = useState<CustomFinancialSubject[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_SUBJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse custom subjects', e);
    }
    return INITIAL_CUSTOM_SUBJECTS;
  });

  const addCustomSubject = (data: {
    title: string;
    companyOrSector?: string;
    category?: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning';
  }) => {
    const validation = validateFinancialSubject(data.title, data.companyOrSector);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errorMessage,
        errorGu: validation.errorMessageGu,
      };
    }

    const cleanTitle = data.title.trim();
    if (customSubjects.some((c) => c.title.toLowerCase() === cleanTitle.toLowerCase())) {
      return {
        success: false,
        error: 'A custom subject with this title already exists.',
        errorGu: 'આ નામનો સબ્જેક્ટ પહેલેથી જ ઉમેરાયેલો છે.',
      };
    }

    const newSubject: CustomFinancialSubject = {
      id: `custom_${Date.now()}_${cleanTitle.slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      title: cleanTitle,
      companyOrSector: data.companyOrSector?.trim() || undefined,
      category: data.category || validation.matchedCategory || 'wealth',
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    const updated = [newSubject, ...customSubjects];
    setCustomSubjects(updated);
    try {
      localStorage.setItem(CUSTOM_SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist custom subjects', e);
    }

    return {
      success: true,
      subject: newSubject,
    };
  };

  const deleteCustomSubject = (id: string) => {
    const updated = customSubjects.filter((c) => c.id !== id);
    setCustomSubjects(updated);
    try {
      localStorage.setItem(CUSTOM_SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete custom subject', e);
    }
  };

  const allSubjects: FinancialSubject[] = useMemo(() => {
    const customMapped: FinancialSubject[] = customSubjects.map((c) => ({
      id: c.id,
      key: c.id,
      iconName:
        c.category === 'protection'
          ? 'ShieldCheck'
          : c.category === 'tax'
          ? 'FileSpreadsheet'
          : c.category === 'borrowing'
          ? 'CreditCard'
          : c.category === 'planning'
          ? 'Clock'
          : 'TrendingUp',
      category: c.category,
      isCustom: true,
      customTitle: c.title,
      companyOrSector: c.companyOrSector,
    }));
    return [...customMapped, ...MAIN_FINANCIAL_SUBJECTS];
  }, [customSubjects]);

  const updateProfile = (updated: Partial<AdvisorProfile>) => {
    setProfileState((prev) => {
      const next = {
        ...prev,
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save profile to localStorage', e);
      }
      return next;
    });
  };

  const resetToDefaultProfile = () => {
    setProfileState(INITIAL_PROFILE);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(INITIAL_PROFILE));
    } catch (e) {
      console.error('Failed to reset profile', e);
    }
  };

  const saveContent = (item: GeneratedContent) => {
    setContents((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === item.id);
      let updated: GeneratedContent[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...item, isSaved: true };
      } else {
        updated = [{ ...item, isSaved: true }, ...prev];
      }
      try {
        localStorage.setItem(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist content', e);
      }
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setContents((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      try {
        localStorage.setItem(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist favorite toggle', e);
      }
      return updated;
    });
  };

  const deleteContent = (id: string) => {
    setContents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete content', e);
      }
      return updated;
    });
  };

  const consumeCredit = (): boolean => {
    if (subscription.creditsRemaining <= 0) {
      return false;
    }
    setSubscription((prev) => {
      const next: SubscriptionInfo = {
        ...prev,
        creditsUsed: prev.creditsUsed + 1,
        creditsRemaining: Math.max(0, prev.creditsRemaining - 1),
      };
      try {
        localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    return true;
  };

  const recentContents = contents.slice(0, 5);
  const favoriteContents = contents.filter((c) => c.isFavorite);

  return (
    <AdvisorContext.Provider
      value={{
        profile,
        updateProfile,
        resetToDefaultProfile,
        subscription,
        consumeCredit,
        contents,
        saveContent,
        toggleFavorite,
        deleteContent,
        recentContents,
        favoriteContents,
        customSubjects,
        allSubjects,
        addCustomSubject,
        deleteCustomSubject,
      }}
    >
      {children}
    </AdvisorContext.Provider>
  );
};

export const useAdvisor = (): AdvisorContextType => {
  const context = useContext(AdvisorContext);
  if (!context) {
    throw new Error('useAdvisor must be used within an AdvisorProvider');
  }
  return context;
};
