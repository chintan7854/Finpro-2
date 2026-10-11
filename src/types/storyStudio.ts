import { LanguageCode } from './index';

export type StoryFinancialTopicId =
  | 'sip_wealth'
  | 'step_up_sip'
  | 'stocks_vs_mf'
  | 'gold_vs_equity'
  | 'fd_vs_inflation'
  | 'real_estate_reits'
  | 'sgb_digital_gold'
  | 'asset_allocation'
  | 'term_insurance'
  | 'health_insurance'
  | 'super_topup'
  | 'emergency_fund'
  | 'endowment_reality'
  | 'personal_accident'
  | 'child_education'
  | 'daughter_future'
  | 'retirement_planning'
  | 'swp_income'
  | 'nps_scheme'
  | 'post_office_vs_mf'
  | 'senior_citizen'
  | 'home_loan_prepay'
  | 'credit_card_trap'
  | 'debt_freedom'
  | 'cibil_score'
  | 'budgeting_rule'
  | 'lifestyle_inflation'
  | 'elss_tax'
  | 'capital_gains'
  | 'will_nomination';

export type StoryAngleId =
  | 'reality_check'
  | 'inspirational'
  | 'cost_of_delay'
  | 'duo_journey'
  | 'family_bond';

export type StoryPersonaId =
  | 'young_pros'
  | 'parents'
  | 'pre_retirees'
  | 'business_owners'
  | 'women';

export type StoryLengthId =
  | 'short'
  | 'standard'
  | 'deep';

export type StoryCtaStrategyId =
  | 'viral_forward'
  | 'portfolio_audit'
  | 'goal_consultation';

export interface StoryPillarConfig {
  id: StoryFinancialTopicId;
  category: 'wealth' | 'protection' | 'retirement' | 'debt' | 'tax_estate';
  icon: string;
}

export interface StoryAngleConfig {
  id: StoryAngleId;
  icon: string;
}

export interface StoryPersonaConfig {
  id: StoryPersonaId;
  icon: string;
  ageRange: string;
}

export interface StoryLengthConfig {
  id: StoryLengthId;
  wordCount: string;
  badge: string;
}

export interface StoryCtaConfig {
  id: StoryCtaStrategyId;
  icon: string;
}

export interface GeneratedStoryResult {
  id: string;
  topicId: StoryFinancialTopicId;
  angleId: StoryAngleId;
  personaId: StoryPersonaId;
  lengthId: StoryLengthId;
  ctaStrategyId: StoryCtaStrategyId;
  language: LanguageCode;
  createdAt: string;
  title: string;
  hook: string;
  storyParagraphs: string[];
  takeaways: string[];
  forwardAppeal: string;
  ctaSignature: string;
  fullFormattedPayload: string;
  source: 'ai_api' | 'local_engine';
}

export interface StoryLibraryItem {
  id: string;
  title: string;
  topicId: StoryFinancialTopicId;
  topicLabel: string;
  language: LanguageCode;
  languageLabel: string;
  lengthId: StoryLengthId;
  createdAt: string;
  payload: string;
  result: GeneratedStoryResult;
}
