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
import {
  saveProfilesToDB,
  loadProfilesFromDB,
  saveActiveProfileIdToDB,
  loadActiveProfileIdFromDB,
  safeSetLocalStorage,
} from '../services/advisorStorageService';

interface AdvisorContextType {
  // Active Profile (single source of truth for all modules)
  profile: AdvisorProfile;
  // Multiple Profiles management
  profiles: AdvisorProfile[];
  activeProfileId: string;
  defaultProfileId: string;
  switchActiveProfile: (profileId: string) => void;
  createProfile: (data?: Partial<AdvisorProfile>) => AdvisorProfile;
  updateProfile: (updated: Partial<AdvisorProfile>, targetProfileId?: string) => void;
  duplicateProfile: (sourceProfileId: string, customName?: string) => AdvisorProfile;
  renameProfile: (profileId: string, newName: string) => void;
  setDefaultProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => { success: boolean; error?: string };
  resetProfileSettings: (profileId?: string) => void;
  resetToDefaultProfile: () => void;

  // Subscription & credits
  subscription: SubscriptionInfo;
  consumeCredit: () => boolean;

  // Content library
  contents: GeneratedContent[];
  saveContent: (item: GeneratedContent) => void;
  toggleFavorite: (id: string) => void;
  deleteContent: (id: string) => void;
  recentContents: GeneratedContent[];
  favoriteContents: GeneratedContent[];

  // Custom subjects
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

const PROFILES_STORAGE_KEY = 'finadvisor_advisor_profiles_v2';
const ACTIVE_PROFILE_ID_KEY = 'finadvisor_active_profile_id_v2';
const DEFAULT_PROFILE_ID_KEY = 'finadvisor_default_profile_id_v2';
const LEGACY_PROFILE_STORAGE_KEY = 'finadvisor_master_profile';

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
  profileName: 'Chintan Raval — Main Wealth Profile',
  advisorName: 'Chintan Raval',
  designation: 'Certified Financial Planner (CFP) & Wealth Architect',
  achievement: 'Managing ₹140+ Cr AUM • 1,200+ Satisfied Families • 15+ Yrs Market Experience',
  qualifications: 'CFP, NISM Series V-A & X-A, MBA (Finance)',
  countryCode: '+91',
  phoneNumber: '+91 98250 78540',
  whatsappNumber: '+91 98250 78540',
  email: 'chintan.raval@finadvisorpro.in',
  location: 'Ahmedabad & Mumbai, India',
  officeAddress: '402 Corporate Wealth Tower, S.G. Highway, Ahmedabad, Gujarat 380054',
  website: 'https://finadvisorpro.in',
  professionalDetails: 'AMFI Reg. ARN-184920 | CFP Board Verified | IRDAI Lic. No. 6749320',
  profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
  originalProfilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=640&q=80',
  photoBackgroundMode: 'with_bg',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  originalLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=240&q=80',
  brandName: 'FinAdvisor Wealth Partners',
  brandColor: '#059669', // Emerald 600
  defaultCTA: DEFAULT_CTAS.en,
  defaultDisclaimer: DEFAULT_DISCLAIMERS.en,
  applicationLanguage: 'en',
  contentLanguage: 'en',
  sameAsAppLanguage: true,
  brandingPreferences: DEFAULT_BRANDING,
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const INITIAL_MUTUAL_FUNDS_PROFILE: AdvisorProfile = {
  id: 'adv_profile_mf_002',
  profileName: 'Chintan Raval — Mutual Funds & SIP Advisory',
  advisorName: 'Chintan Raval',
  designation: 'AMFI Registered Mutual Fund Distributor',
  achievement: 'Curated 2,500+ Active SIP Accounts • Top SIP Performer 2024',
  qualifications: 'NISM Mutual Fund Distributor V-A Certified',
  countryCode: '+91',
  phoneNumber: '+91 98250 78540',
  whatsappNumber: '+91 98250 78540',
  email: 'mutualfunds@finadvisorpro.in',
  location: 'Ahmedabad, Gujarat',
  officeAddress: 'Wealth Desk, S.G. Highway, Ahmedabad, Gujarat',
  website: 'https://finadvisorpro.in/mutual-funds',
  professionalDetails: 'AMFI ARN-184920 | EUIN: E382910 | Association of Mutual Funds in India',
  profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=320&q=80',
  originalProfilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80',
  photoBackgroundMode: 'with_bg',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  brandName: 'FinAdvisor SIP Solutions',
  brandColor: '#2563eb', // Royal Blue
  defaultCTA: 'Start your goal-based SIP journey today. Reply to review your fund allocation.',
  defaultDisclaimer: 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully.',
  applicationLanguage: 'en',
  contentLanguage: 'en',
  sameAsAppLanguage: true,
  brandingPreferences: DEFAULT_BRANDING,
  isDefault: false,
  createdAt: new Date().toISOString(),
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
    slide3: '📊 Stay disciplined to secure your future goals. Contact Chintan Raval, CFP at +91 98250 78540 for a complimentary portfolio review.'
  },
  whatsappMessage: `*Why Market Dips Are a Blessing for Your SIP!* 📈🌱\n\nDear Investor,\n\nAre headlines making you nervous about your mutual fund investments? Here is a gentle reminder from the desk of your financial planner:\n\n✨ *Rule of Long-term Wealth:* You cannot control the daily market, but you can control your discipline.\n\n🔹 *Lower NAV = More Units:* Every market correction lets your SIP accumulate fund units on discount.\n🔹 *Compounding Edge:* When the market recovers, every extra unit accelerates your returns.\n🔹 *Stay Invested:* Avoid the trap of panic selling or pausing contributions.\n\n📞 *Need guidance or a portfolio health-check?*\nCall / WhatsApp: +91 98250 78540\n*Chintan Raval, CFP*\n_AMFI Reg. ARN-184920_\n\n_Disclaimer: Mutual fund investments are subject to market risks. Read all scheme related documents carefully._`,
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
    name: 'Chintan Raval',
    designation: 'Certified Financial Planner (CFP) & Wealth Architect',
    contact: '+91 98250 78540',
    whatsapp: '+91 98250 78540',
    email: 'chintan.raval@finadvisorpro.in',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
    location: 'Ahmedabad & Mumbai',
    credentials: 'ARN-184920 | CFP'
  }
};

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export const AdvisorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initialize Profiles with safe backward-compatibility migration
  const [profiles, setProfiles] = useState<AdvisorProfile[]>(() => {
    try {
      // Check multi-profiles v2 storage
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...INITIAL_PROFILE,
            ...p,
            photoBackgroundMode: p.photoBackgroundMode || 'with_bg',
          }));
        }
      }

      // Check legacy single-profile storage
      const legacy = localStorage.getItem(LEGACY_PROFILE_STORAGE_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        const migrated: AdvisorProfile = {
          ...INITIAL_PROFILE,
          ...parsedLegacy,
          profileName: parsedLegacy.profileName || `${parsedLegacy.advisorName || 'Advisor'} — Main Profile`,
          isDefault: true,
          photoBackgroundMode: parsedLegacy.photoBackgroundMode || 'with_bg',
        };
        const initialList = [migrated, INITIAL_MUTUAL_FUNDS_PROFILE];
        safeSetLocalStorage(PROFILES_STORAGE_KEY, JSON.stringify(initialList));
        saveProfilesToDB(initialList);
        return initialList;
      }
    } catch (e) {
      console.warn('Failed to parse advisor profiles from storage', e);
    }

    const defaultList = [INITIAL_PROFILE, INITIAL_MUTUAL_FUNDS_PROFILE];
    safeSetLocalStorage(PROFILES_STORAGE_KEY, JSON.stringify(defaultList));
    saveProfilesToDB(defaultList);
    return defaultList;
  });

  // 2. Active Profile ID
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
      if (savedActive) {
        return savedActive;
      }
      const savedDefault = localStorage.getItem(DEFAULT_PROFILE_ID_KEY);
      if (savedDefault) {
        return savedDefault;
      }
    } catch {}
    return INITIAL_PROFILE.id;
  });

  // 3. Default Profile ID
  const [defaultProfileId, setDefaultProfileIdState] = useState<string>(() => {
    try {
      const savedDefault = localStorage.getItem(DEFAULT_PROFILE_ID_KEY);
      if (savedDefault) return savedDefault;
    } catch {}
    return INITIAL_PROFILE.id;
  });

  // Hydrate full profiles & images from IndexedDB on initial mount
  useEffect(() => {
    let isMounted = true;
    const hydrateFromIndexedDB = async () => {
      try {
        const [dbProfiles, dbActiveId] = await Promise.all([
          loadProfilesFromDB(),
          loadActiveProfileIdFromDB(),
        ]);

        if (isMounted && dbProfiles && Array.isArray(dbProfiles) && dbProfiles.length > 0) {
          setProfiles(dbProfiles);
          if (dbActiveId && dbProfiles.some((p) => p.id === dbActiveId)) {
            setActiveProfileId(dbActiveId);
          }
        }
      } catch (err) {
        console.warn('FinAdvisor IndexedDB hydration notice:', err);
      }
    };

    hydrateFromIndexedDB();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate active profile (fall back safely to first profile or initial if deleted)
  const profile: AdvisorProfile = useMemo(() => {
    const found = profiles.find((p) => p.id === activeProfileId);
    if (found) {
      // Return profile with adapted display photo based on photoBackgroundMode
      const displayPhoto =
        found.photoBackgroundMode === 'without_bg' && found.noBgProfilePhoto
          ? found.noBgProfilePhoto
          : found.croppedProfilePhoto || found.profilePhoto;

      return {
        ...found,
        profilePhoto: displayPhoto || found.profilePhoto,
      };
    }

    const defaultP = profiles.find((p) => p.id === defaultProfileId) || profiles[0] || INITIAL_PROFILE;
    return defaultP;
  }, [profiles, activeProfileId, defaultProfileId]);

  // Sync active profile to legacy storage key for 100% backward compatibility
  useEffect(() => {
    safeSetLocalStorage(LEGACY_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    safeSetLocalStorage(ACTIVE_PROFILE_ID_KEY, profile.id);
    saveActiveProfileIdToDB(profile.id);
  }, [profile]);

  // Helper to persist entire profiles array
  const persistProfiles = (updatedList: AdvisorProfile[]) => {
    setProfiles(updatedList);
    // Persist full-resolution profiles to IndexedDB (asynchronous)
    saveProfilesToDB(updatedList);
    // Persist safe cache to LocalStorage without throwing
    safeSetLocalStorage(PROFILES_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Switch Active Profile
  const switchActiveProfile = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (target) {
      setActiveProfileId(profileId);
      safeSetLocalStorage(ACTIVE_PROFILE_ID_KEY, profileId);
      safeSetLocalStorage(LEGACY_PROFILE_STORAGE_KEY, JSON.stringify(target));
      saveActiveProfileIdToDB(profileId);
    }
  };

  // Set Default Profile
  const setDefaultProfile = (profileId: string) => {
    setDefaultProfileIdState(profileId);
    safeSetLocalStorage(DEFAULT_PROFILE_ID_KEY, profileId);

    const updated = profiles.map((p) => ({
      ...p,
      isDefault: p.id === profileId,
    }));
    persistProfiles(updated);
  };

  // Create New Profile
  const createProfile = (data?: Partial<AdvisorProfile>): AdvisorProfile => {
    const newId = `adv_profile_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProfile: AdvisorProfile = {
      id: newId,
      profileName: data?.profileName || 'New Advisor Profile',
      advisorName: data?.advisorName || '',
      designation: data?.designation || '',
      achievement: data?.achievement || '',
      qualifications: data?.qualifications || '',
      countryCode: data?.countryCode || '+91',
      phoneNumber: data?.phoneNumber || '',
      whatsappNumber: data?.whatsappNumber || '',
      email: data?.email || '',
      location: data?.location || '',
      officeAddress: data?.officeAddress || '',
      website: data?.website || '',
      professionalDetails: data?.professionalDetails || '',
      profilePhoto: data?.profilePhoto || '',
      originalProfilePhoto: data?.originalProfilePhoto || '',
      croppedProfilePhoto: data?.croppedProfilePhoto || '',
      noBgProfilePhoto: data?.noBgProfilePhoto || '',
      photoBackgroundMode: data?.photoBackgroundMode || 'with_bg',
      logo: data?.logo || '',
      originalLogo: data?.originalLogo || '',
      croppedLogo: data?.croppedLogo || '',
      brandName: data?.brandName || '',
      brandColor: data?.brandColor || '#059669',
      defaultCTA: data?.defaultCTA || DEFAULT_CTAS.en,
      defaultDisclaimer: data?.defaultDisclaimer || DEFAULT_DISCLAIMERS.en,
      applicationLanguage: data?.applicationLanguage || 'en',
      contentLanguage: data?.contentLanguage || 'en',
      sameAsAppLanguage: true,
      brandingPreferences: { ...DEFAULT_BRANDING, ...(data?.brandingPreferences || {}) },
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...profiles, newProfile];
    persistProfiles(updated);
    setActiveProfileId(newId);
    return newProfile;
  };

  // Update Profile
  const updateProfile = (updated: Partial<AdvisorProfile>, targetProfileId?: string) => {
    const idToUpdate = targetProfileId || activeProfileId;
    const updatedProfiles = profiles.map((p) => {
      if (p.id === idToUpdate) {
        return {
          ...p,
          ...updated,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    persistProfiles(updatedProfiles);
  };

  // Duplicate Profile
  const duplicateProfile = (sourceProfileId: string, customName?: string): AdvisorProfile => {
    const source = profiles.find((p) => p.id === sourceProfileId) || profile;
    const newId = `adv_profile_copy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const clonedProfile: AdvisorProfile = {
      ...source,
      id: newId,
      profileName: customName || `${source.profileName || source.advisorName} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...profiles, clonedProfile];
    persistProfiles(updated);
    setActiveProfileId(newId);
    return clonedProfile;
  };

  // Rename Profile
  const renameProfile = (profileId: string, newName: string) => {
    const updated = profiles.map((p) => (p.id === profileId ? { ...p, profileName: newName } : p));
    persistProfiles(updated);
  };

  // Delete Profile
  const deleteProfile = (profileId: string): { success: boolean; error?: string } => {
    if (profiles.length <= 1) {
      return {
        success: false,
        error: 'Cannot delete the only remaining profile. At least one profile must always exist.',
      };
    }

    const updated = profiles.filter((p) => p.id !== profileId);
    persistProfiles(updated);

    // If active was deleted, switch to default or first available profile
    if (activeProfileId === profileId) {
      const fallback = updated.find((p) => p.id === defaultProfileId) || updated[0];
      setActiveProfileId(fallback.id);
    }

    // If default was deleted, set first available as default
    if (defaultProfileId === profileId) {
      setDefaultProfile(updated[0].id);
    }

    return { success: true };
  };

  // Reset Profile Settings (resets branding preferences without wiping personal identity info)
  const resetProfileSettings = (profileId?: string) => {
    const targetId = profileId || activeProfileId;
    const updated = profiles.map((p) => {
      if (p.id === targetId) {
        return {
          ...p,
          defaultCTA: DEFAULT_CTAS[p.contentLanguage || 'en'] || DEFAULT_CTAS.en,
          defaultDisclaimer: DEFAULT_DISCLAIMERS[p.contentLanguage || 'en'] || DEFAULT_DISCLAIMERS.en,
          brandingPreferences: { ...DEFAULT_BRANDING },
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    persistProfiles(updated);
  };

  // Reset to initial sample profile (for developer demo / quick reset)
  const resetToDefaultProfile = () => {
    const initialList = [INITIAL_PROFILE, INITIAL_MUTUAL_FUNDS_PROFILE];
    persistProfiles(initialList);
    setActiveProfileId(INITIAL_PROFILE.id);
    setDefaultProfile(INITIAL_PROFILE.id);
  };

  // Contents and Subjects State
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
    } catch {}
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
    safeSetLocalStorage(CUSTOM_SUBJECTS_STORAGE_KEY, JSON.stringify(updated));

    return {
      success: true,
      subject: newSubject,
    };
  };

  const deleteCustomSubject = (id: string) => {
    const updated = customSubjects.filter((c) => c.id !== id);
    setCustomSubjects(updated);
    safeSetLocalStorage(CUSTOM_SUBJECTS_STORAGE_KEY, JSON.stringify(updated));
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
      safeSetLocalStorage(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setContents((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      safeSetLocalStorage(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteContent = (id: string) => {
    setContents((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      safeSetLocalStorage(CONTENTS_STORAGE_KEY, JSON.stringify(updated));
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
      safeSetLocalStorage(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(next));
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
        profiles,
        activeProfileId,
        defaultProfileId,
        switchActiveProfile,
        createProfile,
        updateProfile,
        duplicateProfile,
        renameProfile,
        setDefaultProfile,
        deleteProfile,
        resetProfileSettings,
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
