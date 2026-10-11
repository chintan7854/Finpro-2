export type SimulatorCategoryId =
  | 'all'
  | 'quizzes'
  | 'inflation'
  | 'strategies'
  | 'behavioral'
  | 'rules';

export interface SimulatorMetadata {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  category: 'quizzes' | 'inflation' | 'strategies' | 'behavioral' | 'rules';
  badge: string;
  iconName: string;
  keyTakeaway: string;
}

export interface ClientLeadModalState {
  isOpen: boolean;
  simulatorTitle: string;
  calculatedSummary: string;
  takeaway: string;
}
