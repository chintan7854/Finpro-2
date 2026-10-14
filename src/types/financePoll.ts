import { LanguageCode } from './index';

export type PollCategory =
  | 'personal_finance'      // 1–10: Personal Finance and Savings
  | 'investment_wealth'     // 11–20: Investment and Wealth Creation
  | 'insurance_protection'  // 21–30: Insurance and Family Protection
  | 'loans_management'      // 31–38: Loans and Financial Management
  | 'retirement_future'     // 39–45: Retirement and Future Planning
  | 'tax_security';         // 46–50: Tax, Security and Financial Awareness

export type PollType =
  | 'awareness'             // Financial Awareness
  | 'knowledge'             // Financial Knowledge (Single verified correct answer)
  | 'planning'              // Financial Planning
  | 'investment_awareness'  // Investment Awareness
  | 'insurance_awareness'   // Insurance Awareness
  | 'myth_vs_reality'       // Financial Myth vs Reality (Single verified correct answer)
  | 'preference'            // Customer Preference (Open-ended / Multiple reasonable answers)
  | 'goal_awareness'        // Financial Goal Awareness
  | 'calculation'           // Financial Calculation (Single verified correct answer with deterministic math)
  | 'decision_making';      // Financial Decision-Making

export interface FinancePollTopic {
  num: number;
  id: string;
  category: PollCategory;
  categoryName: string;
  categoryNameGu: string;
  categoryNameHi: string;
  title: string;
  titleGu: string;
  titleHi: string;
  description: string;
  descriptionGu?: string;
  descriptionHi?: string;
}

export interface OutputBNativePoll {
  question: string;
  options: string[];
  allOptionsJoined: string;
  completePollContent: string;
}

export interface OutputCCreationGuide {
  steps: string[];
  allowMultipleRule: string;
  notes: string;
}

export interface GeneratedPoll {
  id: string;
  topicNum: number;
  topicId: string;
  topicTitle: string;
  category: PollCategory;
  categoryTitle: string;
  pollType: PollType;
  pollTypeLabel: string;
  language: LanguageCode;
  
  // Core Question & Options
  questionText: string;
  options: string[]; // 3 or 4 options
  
  // Knowledge / Calculation Verification Metadata
  isKnowledgeOrCalculation: boolean;
  correctIndex?: number; // 0..3 (only for single-answer knowledge/calculation/myth)
  explanation?: string;
  stepByStepCalculations?: string[];
  assumptions?: string;
  educationalTakeaway?: string;
  
  // Recommended WhatsApp poll toggle setting
  allowMultipleAnswersRecommended: boolean;
  
  // Three Synchronized Outputs
  outputA_ShareableMessage: string;
  outputB_NativePoll: OutputBNativePoll;
  outputC_CreationGuide: OutputCCreationGuide;
  
  createdAt: string;
  isAiGenerated: boolean;
  verificationSource?: 'ai_verified' | 'deterministic_math_engine' | 'expert_curated';
}

export interface SavedPollRecord {
  id: string;
  topicNum: number;
  topicId: string;
  topicTitle: string;
  pollType: PollType;
  language: LanguageCode;
  poll: GeneratedPoll;
  savedAt: string;
}

export interface PollGeneratorRequest {
  topicNum: number;
  topicId: string;
  topicTitle: string;
  category: PollCategory;
  pollType: PollType;
  language: LanguageCode;
  clientName?: string;
  advisorProfile?: {
    advisorName: string;
    designation: string;
    phoneNumber: string;
    professionalDetails?: string;
    companyName?: string;
    amfiArn?: string;
  };
  previousPollQuestions?: string[];
}
