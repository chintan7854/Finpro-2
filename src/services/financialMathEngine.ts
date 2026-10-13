/**
 * Deterministic Financial Math Engine for FinAdvisor Pro
 * Validated, SEBI/IRDAI/RBI compliant calculation utilities
 * Indian Number formatting (Lakhs, Crores, ₹)
 */

export interface SipCalculationResult {
  monthlyInvestment: number;
  years: number;
  totalInvested: number;
  scenarios: Array<{
    cagrRate: number;
    projectedValue: number;
    wealthGain: number;
    multiple: number;
  }>;
  stepUpScenarios?: Array<{
    annualStepUpPercent: number;
    cagrRate: number;
    totalInvested: number;
    projectedValue: number;
  }>;
}

export interface LifeInsuranceNeedResult {
  annualHouseholdExpenses: number;
  yearsOfSupport: number;
  incomeReplacementFund: number;
  existingDebtsAndLoans: number;
  childrenEducationTarget: number;
  emergencyTransitionBuffer: number;
  grossProtectionNeed: number;
  existingLiquidAssets: number;
  existingLifeCover: number;
  netProtectionGap: number;
  suggestedTermCover: number;
}

export interface HealthCoverRecommendationResult {
  familyType: 'individual' | 'floater_family' | 'senior_parents';
  cityTier: 'tier1_metro' | 'tier2_urban' | 'tier3';
  existingCorporateCover: number;
  recommendedBaseCover: number;
  recommendedSuperTopUp: number;
  totalEffectiveShield: number;
  averageHospitalizationCost: number;
  criticalIllnessBenchmark: number;
}

export interface LoanEmiCalculationResult {
  principalAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterestPayable: number;
  totalRepayment: number;
  interestToPrincipalRatio: number;
  sipRecoveryComparison?: {
    recommendedMonthlySip: number; // typically 0.1% to 0.2% of loan or 15-20% of EMI
    estimatedSipCorpusAfterTenure: number;
    netRecoveryPercent: number;
  };
}

export interface RetirementPensionResult {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentMonthlyExpenses: number;
  assumedInflation: number;
  monthlyExpensesAtRetirement: number;
  targetRetirementCorpus: number;
  monthlySwpSafePension: number;
  monthlySipRequired: number;
}

/**
 * Format Indian Currency in Rupee symbol and Indian numbering convention (Lakh / Crore)
 */
export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));

  if (compact) {
    if (absAmount >= 10000000) {
      const cr = (absAmount / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${cr.replace(/\.00$/, '')} Cr`;
    }
    if (absAmount >= 100000) {
      const lakh = (absAmount / 100000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${lakh.replace(/\.00$/, '')} Lakh`;
    }
    if (absAmount >= 1000) {
      return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)}K`;
    }
    return `${isNegative ? '-' : ''}₹${absAmount}`;
  }

  // Full Indian number format: ##,##,###
  const numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Deterministic Monthly SIP Future Value Calculator
 * Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
 */
export function calculateSipScenarios(
  monthlyAmount: number,
  years: number,
  rates: number[] = [6, 10, 12, 14]
): SipCalculationResult {
  const safeP = Math.max(500, monthlyAmount || 5000);
  const safeYears = Math.max(1, Math.min(40, years || 15));
  const months = safeYears * 12;
  const totalInvested = safeP * months;

  const scenarios = rates.map((rate) => {
    const monthlyRate = rate / 100 / 12;
    const fv = safeP * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const roundedFv = Math.round(fv);
    return {
      cagrRate: rate,
      projectedValue: roundedFv,
      wealthGain: roundedFv - totalInvested,
      multiple: Number((roundedFv / totalInvested).toFixed(2)),
    };
  });

  return {
    monthlyInvestment: safeP,
    years: safeYears,
    totalInvested,
    scenarios,
  };
}

/**
 * Human Life Value / Comprehensive Life Insurance Need Analysis
 */
export function calculateLifeInsuranceNeed(params: {
  annualIncome: number;
  annualHouseholdExpenses?: number;
  yearsOfDependantSupport?: number;
  outstandingHomeLoan?: number;
  otherDebts?: number;
  childrenEducationGoal?: number;
  existingLifeCover?: number;
  existingLiquidAssets?: number;
}): LifeInsuranceNeedResult {
  const annualIncome = Math.max(300000, params.annualIncome || 1200000);
  const annualExpenses = params.annualHouseholdExpenses || Math.round(annualIncome * 0.6);
  const yearsSupport = params.yearsOfDependantSupport || 15; // years until youngest child achieves financial independence

  // 1. Income replacement fund (present value assumption taking 2-3% real return)
  // Simplified realistic heuristic: 10x - 12x annual expenses
  const incomeReplacementFund = annualExpenses * yearsSupport * 0.75; // discount factor for investment

  // 2. Liabilities
  const debts = (params.outstandingHomeLoan || 0) + (params.otherDebts || 0);

  // 3. Children's future milestone reserves
  const childrenEducation = params.childrenEducationGoal || 3000000;

  // 4. Immediate transition buffer
  const emergencyTransitionBuffer = Math.round(annualExpenses * 0.5);

  const grossNeed = incomeReplacementFund + debts + childrenEducation + emergencyTransitionBuffer;
  const existingCover = params.existingLifeCover || 0;
  const existingAssets = params.existingLiquidAssets || 0;

  const netGap = Math.max(0, grossNeed - existingCover - existingAssets);

  // Round up to nearest 5 or 10 Lakhs
  const suggestedCover = Math.ceil(netGap / 500000) * 500000;

  return {
    annualHouseholdExpenses: annualExpenses,
    yearsOfSupport: yearsSupport,
    incomeReplacementFund: Math.round(incomeReplacementFund),
    existingDebtsAndLoans: debts,
    childrenEducationTarget: childrenEducation,
    emergencyTransitionBuffer,
    grossProtectionNeed: Math.round(grossNeed),
    existingLiquidAssets: existingAssets,
    existingLifeCover: existingCover,
    netProtectionGap: Math.round(netGap),
    suggestedTermCover: Math.max(5000000, suggestedCover), // Minimum ₹50 Lakhs
  };
}

/**
 * Deterministic Loan EMI Calculator
 * Formula: E = P * r * (1 + r)^n / [ (1 + r)^n - 1 ]
 */
export function calculateLoanEmi(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): LoanEmiCalculationResult {
  const P = Math.max(100000, principal || 3500000);
  const rate = Math.max(4, annualInterestRate || 8.5);
  const years = Math.max(1, tenureYears || 20);
  const months = years * 12;

  const monthlyRate = rate / 100 / 12;
  const emiFactor = Math.pow(1 + monthlyRate, months);
  const emi = Math.round((P * monthlyRate * emiFactor) / (emiFactor - 1));

  const totalRepayment = emi * months;
  const totalInterest = totalRepayment - P;

  // SIP Recovery strategy: Investing 0.15% of loan amount monthly at 12% returns
  const sipRecoveryMonthly = Math.round(P * 0.0015);
  const sipRecoveryResult = calculateSipScenarios(sipRecoveryMonthly, years, [12]);
  const estimatedSipCorpus = sipRecoveryResult.scenarios[0].projectedValue;

  return {
    principalAmount: P,
    annualInterestRate: rate,
    tenureYears: years,
    tenureMonths: months,
    monthlyEmi: emi,
    totalInterestPayable: totalInterest,
    totalRepayment,
    interestToPrincipalRatio: Number((totalInterest / P).toFixed(2)),
    sipRecoveryComparison: {
      recommendedMonthlySip: sipRecoveryMonthly,
      estimatedSipCorpusAfterTenure: estimatedSipCorpus,
      netRecoveryPercent: Math.min(150, Math.round((estimatedSipCorpus / totalInterest) * 100)),
    },
  };
}

/**
 * Retirement Corpus & SWP Monthly Pension Calculator
 */
export function calculateRetirementPlan(params: {
  currentAge?: number;
  retirementAge?: number;
  lifeExpectancy?: number;
  currentMonthlyExpenses?: number;
  assumedInflation?: number;
}): RetirementPensionResult {
  const currentAge = params.currentAge || 35;
  const retAge = params.retirementAge || 55;
  const lifeExp = params.lifeExpectancy || 85;
  const expenses = params.currentMonthlyExpenses || 60000;
  const inflation = (params.assumedInflation || 6.5) / 100;

  const yearsToRetire = Math.max(1, retAge - currentAge);
  const postRetirementYears = Math.max(5, lifeExp - retAge);

  // Future monthly expenses at retirement
  const futureMonthlyExpenses = Math.round(expenses * Math.pow(1 + inflation, yearsToRetire));
  const futureAnnualExpenses = futureMonthlyExpenses * 12;

  // Assuming real return of 2% in retirement (post-tax debt/hybrid return minus inflation)
  const realReturn = 0.02;
  const annuityFactor = (1 - Math.pow(1 + realReturn, -postRetirementYears)) / realReturn;
  const targetCorpus = Math.round(futureAnnualExpenses * annuityFactor);

  // Monthly SIP required at assumed 12% equity CAGR
  const equityMonthlyRate = 0.12 / 12;
  const monthsAccumulation = yearsToRetire * 12;
  const denom = ((Math.pow(1 + equityMonthlyRate, monthsAccumulation) - 1) / equityMonthlyRate) * (1 + equityMonthlyRate);
  const monthlySipRequired = Math.round(targetCorpus / denom);

  // Safe SWP withdrawal rate of 6% annual from corpus
  const monthlySwp = Math.round((targetCorpus * 0.06) / 12);

  return {
    currentAge,
    retirementAge: retAge,
    lifeExpectancy: lifeExp,
    currentMonthlyExpenses: expenses,
    assumedInflation: Number((inflation * 100).toFixed(1)),
    monthlyExpensesAtRetirement: futureMonthlyExpenses,
    targetRetirementCorpus: targetCorpus,
    monthlySwpSafePension: monthlySwp,
    monthlySipRequired,
  };
}
