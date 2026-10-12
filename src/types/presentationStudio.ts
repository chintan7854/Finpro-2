import { LanguageCode } from './index';

export type PresentationMode = 'quick' | 'detailed' | 'personalized';

export type PresentationGroupCategory =
  | 'wealth'
  | 'retirement'
  | 'insurance'
  | 'tax'
  | 'children'
  | 'borrowing'
  | 'estate'
  | 'nri_hni'
  | 'fixed_income'
  | 'business';

export interface PresentationSubCategory {
  id: string;
  title: string;
  titleGu?: string;
  titleHi?: string;
  description: string;
  keyMetricHighlight?: string;
}

export interface PresentationSubject {
  id: string;
  title: string;
  titleGu: string;
  titleHi: string;
  group: PresentationGroupCategory;
  iconName: string;
  shortDesc: string;
  shortDescGu?: string;
  shortDescHi?: string;
  subcategories: PresentationSubCategory[];
  isCustom?: boolean;
}

export interface ClientQuestionnaire {
  // Main Prompt
  topicPrompt?: string; // Content of "What presentation would you like to create?"

  // 1. How do you know the client, and for how long?
  clientRelationship?: string;

  // 2. What are the client's known needs, goals, and priorities?
  clientGoals?: string;

  // 3. What is the client's approximate annual income or investment budget, if known?
  clientBudget?: string;
  clientBudgetStatus?: 'verified' | 'estimate'; // Clearly distinguish verified information from advisor estimates

  // 4. What concerns or objections has the client expressed?
  clientConcerns?: string;

  // 5. If the client hesitates or declines, what reasons has the client given, and what other reasons do you suspect?
  hesitationReasons?: string;

  // 6. What presentation style might the client prefer?
  preferredStyle?: string;

  // 7. Which points, examples, comparisons, or calculations deserve more emphasis?
  emphasisPoints?: string;

  // 8. Any additional instructions or notes?
  additionalNotes?: string; // Strictly private notes, NEVER visible on client slides

  // Optional client identity
  clientName?: string;

  // Legacy compatibility fields if needed
  clientProfile?: string;
  primaryGoal?: string;
  investmentHorizon?: string;
  riskAppetite?: string;
  monthlyCapacity?: string;
  primaryConcern?: string;
  presentationTone?: string;
  advisorPrivateNotes?: string;
}

export interface SlideMetric {
  label: string;
  value: string;
  helper?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface SlideChartData {
  type: 'bar' | 'donut' | 'line' | 'milestones';
  title: string;
  labels: string[];
  values: number[];
  secondaryValues?: number[];
  unit?: string;
  explanation?: string;
}

export interface SlideComparisonTable {
  headers: [string, string, string];
  rows: Array<{
    parameter: string;
    optionA: string;
    optionB: string;
    advantageFor?: 'A' | 'B' | 'neutral';
  }>;
}

export interface SlideRealWorldExample {
  persona: string;
  situation: string;
  strategyApplied: string;
  financialOutcome: string;
}

export interface PresentationSlide {
  id: string;
  slideNumber: number;
  slideType: 'cover' | 'context' | 'concept' | 'calculation' | 'comparison' | 'roadmap' | 'risks' | 'conclusion';
  badge: string;
  title: string;
  subtitle: string;
  keyTakeaway: string;
  bulletPoints: string[];
  metrics?: SlideMetric[];
  chartData?: SlideChartData;
  comparisonTable?: SlideComparisonTable;
  realWorldExample?: SlideRealWorldExample;
  risksAndLimitations?: string[];
  assumptions?: string[];
  callToAction?: string;
}

export interface AdvisorPresentationSnapshot {
  name: string;
  designation: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  website: string;
  professionalLicense: string;
  achievement: string;
  photo?: string;
  logo?: string;
  disclaimer: string;
  defaultCtaText: string;
}

export interface ClientPresentation {
  id: string;
  title: string;
  subjectId: string;
  subjectTitle: string;
  subCategoryTitle: string;
  mode: PresentationMode;
  language: LanguageCode;
  createdAt: string;
  updatedAt: string;
  clientName?: string;
  advisorPrivateNotes?: string; // Stored securely in presentation record for advisor review, NEVER rendered on slides
  questionnaireSnapshot?: Partial<ClientQuestionnaire>;
  advisorSnapshot: AdvisorPresentationSnapshot;
  slides: PresentationSlide[];
  source: 'ai_api' | 'local_engine';
}
