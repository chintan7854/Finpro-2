import { LanguageCode } from './index';

export type FinanceNewsCategory = 'national' | 'international';

export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'OUTDATED' | 'FAILED';

export interface NewsSource {
  name: string;
  url?: string;
  isPrimary: boolean;
  publishedDate?: string;
  publisherType?: 'central_bank' | 'regulator' | 'government' | 'financial_press' | 'international_agency';
}

export interface FinanceNewsItem {
  id: string;
  category: FinanceNewsCategory;
  headline: Record<LanguageCode, string>;
  originalHeadline: string;
  summary: Record<LanguageCode, string>;
  originalSummary: string;
  publishedAt: string;
  source: NewsSource;
  importanceScore: number; // 1 - 10
  tags: string[];
  keyMetrics?: string[];
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationEvidence?: string;
  retrievedAt?: string;
  verifiedAt?: string;
  verifiedBy: string;
  financialImpactAreas: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface FinancialImpactBreakdown {
  householdExpenses?: string;
  inflation?: string;
  savingsAndFd?: string;
  loansAndEmi?: string;
  taxes?: string;
  insurance?: string;
  sipAndMutualFunds?: string;
  stockMarkets?: string;
  goldAndCommodities?: string;
}

export interface ScenarioBreakdown {
  positive: string;
  neutral: string;
  negative: string;
  conditionsAndUncertainties: string;
}

export interface AdvisorCreditInfo {
  name: string;
  designation: string;
  achievement?: string;
  credentials?: string;
  contact?: string;
  whatsapp?: string;
  photo?: string;
  brandName?: string;
}

export interface FinanceNewsArticle {
  id: string;
  newsId?: string; // Optional if created from custom topic
  isCustomTopic?: boolean;
  customTopicTitle?: string;
  category: FinanceNewsCategory | 'custom';
  contentLanguage: LanguageCode;
  headline: string;
  verifiedDetails: string;
  backgroundContext: string;
  whyItMatters: string;
  financialImpacts: FinancialImpactBreakdown;
  advisorOpinion: string;
  practicalConsiderations: string[];
  mistakesToAvoid: string[];
  scenarios: ScenarioBreakdown;
  conclusion: string;
  sources: NewsSource[];
  advisorCredit: AdvisorCreditInfo;
  createdAt: string;
  updatedAt: string;
  version: number;
  isEdited: boolean;
}

export interface NewsNotification {
  id: string;
  newsId?: string;
  headline: string;
  category: FinanceNewsCategory;
  timestamp: string;
  isRead: boolean;
  source: string;
  importanceScore?: number;
}

export interface NewsSchedulerLog {
  id: string;
  timestamp: string;
  type: 'fetch' | 'cleanup' | 'manual_sync' | 'error' | 'verification';
  message: string;
  details?: string;
  success: boolean;
}

export interface NewsSchedulerStatus {
  lastDailyFetchTime: string | null;
  lastCleanupTime: string | null;
  nextScheduledFetch: string;
  nextScheduledCleanup: string;
  nationalCount: number;
  internationalCount: number;
  itemsAddedLastCycle: number;
  itemsRemovedLastCycle: number;
  schedulerActive: boolean;
  logs: NewsSchedulerLog[];
}
