export type LanguageCode =
  | 'en'
  | 'hi'
  | 'gu'
  | 'mr'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  region: string;
}

export type FixedFinancialSubjectId =
  | 'sip_mutual_fund'
  | 'retirement_planning'
  | 'emergency_fund'
  | 'tax_planning'
  | 'income_tax'
  | 'insurance_planning'
  | 'health_insurance'
  | 'term_insurance'
  | 'investment_planning'
  | 'personal_loan'
  | 'home_loan'
  | 'credit_score'
  | 'child_education'
  | 'elss_tax_saving'
  | 'budgeting_cash_flow'
  | 'nps_pension'
  | 'gold_debt_fixed_income'
  // 7 New Fixed Financial Subjects:
  | 'sgb_gold_investment'
  | 'mediclaim_super_topup'
  | 'reits_real_estate'
  | 'debt_loan_prepayment'
  | 'post_office_savings'
  | 'senior_citizen_pension'
  | 'corporate_fd_bonds';

export type FinancialSubjectId = FixedFinancialSubjectId | (string & {});

export interface FinancialSubject {
  id: FinancialSubjectId;
  key: string;
  iconName: string;
  category: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning';
  isCustom?: boolean;
  customTitle?: string;
  companyOrSector?: string;
}

export interface CustomFinancialSubject {
  id: string;
  title: string;
  category: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning';
  companyOrSector?: string;
  createdAt: string;
  isCustom: true;
}

export type ContentType =
  | 'all_in_one'
  | 'deep_article'
  | 'whatsapp'
  | 'social_media'
  | 'video_script';

export type ArticleLength = 'short' | 'medium' | 'long';

export type AudienceType =
  | 'general_public'
  | 'salaried'
  | 'business_owners'
  | 'young_earners'
  | 'retirees';

export interface BrandingSettings {
  autoApplyBranding: boolean;
  autoApplyPhoto: boolean;
  autoApplyName: boolean;
  autoApplyDesignation: boolean;
  autoApplyContact: boolean;
  autoApplyDefaultCta: boolean;
  autoApplyDisclaimer: boolean;
}

export interface AdvisorProfile {
  id: string;
  profileName: string;
  userId?: string;
  profilePhoto: string;
  originalProfilePhoto?: string;
  croppedProfilePhoto?: string;
  noBgProfilePhoto?: string;
  photoBackgroundMode?: 'with_bg' | 'without_bg';
  advisorName: string;
  designation: string;
  achievement: string;
  qualifications?: string;
  countryCode?: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  location: string;
  officeAddress?: string;
  website: string;
  professionalDetails: string;
  logo: string;
  originalLogo?: string;
  croppedLogo?: string;
  brandName?: string;
  brandColor?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  defaultCTA: string;
  defaultDisclaimer: string;
  applicationLanguage: LanguageCode;
  contentLanguage: LanguageCode;
  sameAsAppLanguage: boolean;
  brandingPreferences: BrandingSettings;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export type SubscriptionPlanId = 'free' | 'basic' | 'pro' | 'premium' | 'business';

export interface SubscriptionInfo {
  planId: SubscriptionPlanId;
  planName: string;
  subscriptionStatus: 'active' | 'trial' | 'expired';
  credits: number;
  creditsUsed: number;
  creditsRemaining: number;
  subscriptionStart: string;
  subscriptionEnd: string;
}

export interface DeepArticle {
  headline: string;
  subheadline: string;
  body: string;
  keyTakeaways: string[];
  readTime: string;
}

export interface WhatsAppStatus {
  slide1: string;
  slide2: string;
  slide3: string;
}

export interface SocialMediaPost {
  platformCaption: string;
  hashtags: string[];
  postHook: string;
}

export interface VideoScript {
  title: string;
  hook: string;
  storyPoints: string[];
  callToAction: string;
  durationEstimate: string;
}

export interface FinancialInsights {
  statHighlight: string;
  actionableRule: string;
  comparisonNote: string;
}

export interface AdvisorSnapshot {
  name: string;
  designation: string;
  achievement?: string;
  contact: string;
  whatsapp: string;
  email?: string;
  photo?: string;
  logo?: string;
  location?: string;
  credentials?: string;
}

export interface GeneratedContent {
  id: string;
  subjectId: FinancialSubjectId;
  subjectTitle: string;
  contentLanguage: LanguageCode;
  contentType: ContentType;
  articleLength: ArticleLength;
  audience: AudienceType;
  createdAt: string;
  isFavorite: boolean;
  isSaved: boolean;
  generationSource: 'ai_api' | 'demo_engine';
  deepArticle: DeepArticle;
  whatsappStatus: WhatsAppStatus;
  whatsappMessage: string;
  socialMedia: SocialMediaPost;
  videoScript: VideoScript;
  financialInsights: FinancialInsights;
  appliedCta: string;
  appliedDisclaimer: string;
  advisorSnapshot: AdvisorSnapshot;
}

export type CreativeThemeId =
  | 'split_comparison'
  | 'myth_vs_reality'
  | 'before_after'
  | 'checklist_scorecard'
  | 'interactive_poll'
  | 'step_roadmap'
  | 'number_breakdown'
  | 'curiosity_hook'
  | 'dos_and_donts'
  | 'case_study'
  | 'philosophy_quote'
  | 'cost_of_delay'
  | 'top_mistakes'
  | 'direct_faq'
  | 'golden_rule'
  | 'visual_analogy'
  | 'self_audit'
  | 'cheat_sheet'
  | 'market_psychology'
  | 'age_blueprint'
  | 'resource_recommendation'
  | 'urgent_reminder'
  | 'hidden_cost'
  | 'advisor_opinion'
  | 'direct_cta_offer';

export type CreativeThemeCategory = 'comparison' | 'action' | 'education' | 'mindset' | 'alerts';

export interface CreativeThemeDefinition {
  id: CreativeThemeId;
  indexNumber: string; // '01', '02', etc.
  name: string;
  description: string;
  category: CreativeThemeCategory;
  categoryLabel: string;
  iconName: string;
  badge: string;
  suggestedPrompt: string;
  colorTheme: string;
  backgroundStyle: 'subject_art' | 'aurora_mesh' | 'fintech_grid' | 'wealth_constellation' | 'minimalist';
}

export interface ThemePosterData {
  headline: string;
  subheadline: string;
  badgeText: string;
  ctaText: string;
  themeSpecific: Record<string, any>;
}

