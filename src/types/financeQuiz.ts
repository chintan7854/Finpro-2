import { LanguageCode, AdvisorProfile } from './index';

export type QuizCategory =
  | 'personal_finance'
  | 'mutual_funds'
  | 'retirement'
  | 'insurance'
  | 'tax_planning'
  | 'debt_loans'
  | 'family_milestones';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizTopic {
  id: string;
  num: number;
  category: QuizCategory;
  categoryLabel: string;
  categoryLabelGu: string;
  categoryLabelHi: string;
  title: string;
  titleGu: string;
  titleHi: string;
  titlesByLang?: Partial<Record<LanguageCode, string>>;
  iconName: string;
  difficulty: QuizDifficulty;
  shortDesc: string;
  shortDescGu?: string;
  shortDescHi?: string;
  defaultQuestionsCount: number;
}

export interface QuizQuestion {
  id: string;
  uniqueQuizId?: string;
  questionTitle?: string;
  questionText: string;
  options: [string, string, string, string]; // Exactly 4 options A, B, C, D
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  stepByStepCalculations?: string[];
  financialTakeaway?: string;
  disclaimer?: string;
  commonTrap?: string;
  ruleOfThumb?: string;
  advisorTip?: string;
  isAiGenerated?: boolean;
  questionImageUrl?: string;
  answerImageUrl?: string;
  generatedAt?: string;
}

export interface GeneratedQuiz {
  topicId: string;
  topicTitle: string;
  category: QuizCategory;
  language: LanguageCode;
  difficulty: QuizDifficulty;
  source: 'ai_api' | 'local_bank';
  generatedAt: string;
  questions: QuizQuestion[];
}

export interface SavedQuizRecord {
  id: string;
  topicId: string;
  topicTitle: string;
  category: QuizCategory;
  language: LanguageCode;
  difficulty: QuizDifficulty;
  question: QuizQuestion;
  savedAt: string;
}
