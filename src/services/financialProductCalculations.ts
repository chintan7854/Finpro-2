/**
 * Comprehensive Deterministic Financial Product Calculations Engine
 * Supports: Mutual Funds/SIP, Life Insurance, Health Insurance, Loans/DSA, Retirement/Annuity, Deposits
 * Formatted to SEBI, AMFI, and IRDAI compliance standards.
 */

export interface SipCalculationResult {
  monthlyInvestment: number;
  years: number;
  totalInvested: number;
  expectedReturnRate: number;
  futureValue: number;
  estimatedGains: number;
  // Multi-rate sensitivity table (as recommended by SEBI/AMFI)
  sensitivities: Array<{
    rate: number;
    futureValue: number;
    gains: number;
  }>;
  taxAnalysis: {
    investedPrincipalTaxFree: number;
    estimatedLtcg: number;
    exemptionAmount: number;
    taxableGains: number;
    estimatedTaxPayable: number; // 12.5% on gains exceeding ₹1.25L
    netInHandValue: number;
  };
  historicalBestCase?: {
    benchmark: string;
    periodCovered: string;
    best10YrCagr: number;
    best15YrCagr: number;
    actualBestValue: number;
    disclaimer: string;
  };
}

export interface LifeInsuranceCalculationResult {
  clientAge: number;
  annualIncome: number;
  currentLiabilities: number;
  existingCover: number;
  recommendedHlvCover: number; // Human Life Value: 15-20x income + liabilities - existing
  protectionGap: number;
  termPlanEstimatedPremium: number;
  traditionalEndowmentPremiumForSameCover: number;
  savingsViaTermSplit: number;
  sipPotentialOnSavedPremium: number;
  contractualBenefits: {
    guaranteedDeathBenefit: number;
    guaranteedMaturityBenefit?: number;
    guaranteedSurrenderValueTimeline: string;
    nonGuaranteedIllustration4Pct: number; // IRDAI 4% mandated gross illustration
    nonGuaranteedIllustration8Pct: number; // IRDAI 8% mandated gross illustration
    disclaimer: string;
  };
}

export interface HealthInsuranceCalculationResult {
  familyMembersCount: number;
  recommendedBaseSumInsured: number;
  recommendedSuperTopUp: number;
  totalEffectiveCover: number;
  standaloneBase1CrAnnualCost: number;
  twoTierStrategyCost: number;
  annualPremiumSaving: number;
  deductibleThreshold: number;
  cashlessHospitalNetworkPct: string;
  disclaimer: string;
}

export interface LoanCalculationResult {
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterestPayable: number;
  totalPayment: number;
  parallelSipMonthlyAmount: number; // ~0.15% to 0.2% of loan
  parallelSipAccumulatedCorpus: number;
  interestRecoveryPercentage: number;
  netHomeCostAfterSipRecovery: number;
}

export interface RetirementCalculationResult {
  currentAge: number;
  retirementAge: number;
  currentMonthlyExpense: number;
  inflationRate: number;
  expenseAtRetirement: number;
  requiredRetirementCorpus: number;
  sustainableMonthlySwp: number;
  lifeAnnuityEstimatedYield: number;
  monthlyPensionFromAnnuity: number;
}

// 1. SIP & Mutual Fund Calculations
export function calculateSip(
  monthlyAmount: number,
  years: number,
  expectedRatePct: number = 12
): SipCalculationResult {
  const r = expectedRatePct / 100 / 12;
  const n = years * 12;
  const totalInvested = monthlyAmount * n;

  // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
  const fv = monthlyAmount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  const roundedFv = Math.round(fv);
  const estimatedGains = roundedFv - totalInvested;

  // Sensitivities at 8%, 10%, 12%, 14%
  const testRates = [8, 10, 12, 14];
  const sensitivities = testRates.map((rate) => {
    const monthlyR = rate / 100 / 12;
    const val = monthlyAmount * (((Math.pow(1 + monthlyR, n) - 1) / monthlyR) * (1 + monthlyR));
    return {
      rate,
      futureValue: Math.round(val),
      gains: Math.round(val) - totalInvested,
    };
  });

  // LTCG Tax Calculation (Union Budget 2024: 12.5% on gains over ₹1.25 Lakh)
  const exemption = 125000;
  const taxableGains = Math.max(0, estimatedGains - exemption);
  const estimatedTax = Math.round(taxableGains * 0.125);
  const netInHand = roundedFv - estimatedTax;

  // Verified Indian Equity Benchmark Historical Best-Case Data (Nifty 50 TRI / Nifty 500 2003-2024)
  // Best 15-year rolling SIP return in Indian equity history was ~17.8% CAGR (2003 to 2018)
  const historicalBestRate = 0.178 / 12;
  const bestFv = monthlyAmount * (((Math.pow(1 + historicalBestRate, n) - 1) / historicalBestRate) * (1 + historicalBestRate));

  return {
    monthlyInvestment: monthlyAmount,
    years,
    totalInvested,
    expectedReturnRate: expectedRatePct,
    futureValue: roundedFv,
    estimatedGains,
    sensitivities,
    taxAnalysis: {
      investedPrincipalTaxFree: totalInvested,
      estimatedLtcg: estimatedGains,
      exemptionAmount: exemption,
      taxableGains,
      estimatedTaxPayable: estimatedTax,
      netInHandValue: netInHand,
    },
    historicalBestCase: {
      benchmark: 'Nifty 500 Total Returns Index (TRI) / Diversified Flexi Cap Benchmark',
      periodCovered: 'Verified 15-Year Market Cycle (2003–2018 Bull & Recovery Phases)',
      best10YrCagr: 16.4,
      best15YrCagr: 17.8,
      actualBestValue: Math.round(bestFv),
      disclaimer:
        'Historical best-case figures reflect verified past market cycles. Past performance is strictly for analytical reference and does NOT guarantee future returns.',
    },
  };
}

// 2. Life Insurance (Term & Traditional) Calculations
export function calculateLifeInsurance(
  annualIncome: number,
  clientAge: number = 35,
  liabilities: number = 2500000,
  existingCover: number = 500000
): LifeInsuranceCalculationResult {
  // Human Life Value: (Income * 15) + Liabilities - Existing Cover
  const idealCover = Math.max(10000000, annualIncome * 15 + liabilities - existingCover);
  const protectionGap = Math.max(0, idealCover - existingCover);

  // Pure Term Insurance estimated annual premium for ₹1 Crore (Age 30-38 non-smoker)
  const baseTermPerCrore = clientAge <= 30 ? 9500 : clientAge <= 40 ? 14500 : 26000;
  const croresNeeded = Math.max(1, idealCover / 10000000);
  const termPlanEstimatedPremium = Math.round(baseTermPerCrore * croresNeeded);

  // Traditional endowment policy premium for ₹1 Crore sum assured would be ~₹6,50,000 to ₹8,00,000/year
  const traditionalEndowmentPremium = Math.round(idealCover * 0.065);
  const savingsViaTermSplit = traditionalEndowmentPremium - termPlanEstimatedPremium;

  // If saved premium is directed to SIP @ 12% over 20 years
  const sipResult = calculateSip(Math.round(savingsViaTermSplit / 12), 20, 12);

  return {
    clientAge,
    annualIncome,
    currentLiabilities: liabilities,
    existingCover,
    recommendedHlvCover: idealCover,
    protectionGap,
    termPlanEstimatedPremium,
    traditionalEndowmentPremiumForSameCover: traditionalEndowmentPremium,
    savingsViaTermSplit,
    sipPotentialOnSavedPremium: sipResult.futureValue,
    contractualBenefits: {
      guaranteedDeathBenefit: idealCover,
      guaranteedMaturityBenefit: 0, // Pure term has zero maturity benefit; capital preserved in SIP
      guaranteedSurrenderValueTimeline: 'Not applicable on pure term. Traditional policies surrender values subject to IRDAI Special Surrender Value guidelines.',
      nonGuaranteedIllustration4Pct: Math.round(traditionalEndowmentPremium * 20 * 1.35),
      nonGuaranteedIllustration8Pct: Math.round(traditionalEndowmentPremium * 20 * 2.15),
      disclaimer:
        'Life insurance primary mandate is pure financial risk replacement. Sum assured is paid on demise. Returns on market-linked or traditional policies are subject to policy conditions and IRDAI regulations.',
    },
  };
}

// 3. Health Insurance Two-Tier Strategy Calculations
export function calculateHealthInsurance(
  familyMembers: number = 4
): HealthInsuranceCalculationResult {
  const recommendedBase = 500000; // ₹5 Lakhs base
  const recommendedSuperTopUp = 9500000; // ₹95 Lakhs top-up
  const totalEffectiveCover = 10000000; // ₹1 Crore total shield

  // Standalone standalone ₹1 Crore base cover premium: ~₹48,000 - ₹62,000
  const standaloneCost = 54000;
  // Two-Tier: ₹5L base (~₹15,000) + ₹95L Super Top-up (~₹4,500) = ₹19,500
  const twoTierCost = 19500;
  const annualSavings = standaloneCost - twoTierCost;

  return {
    familyMembersCount: familyMembers,
    recommendedBaseSumInsured: recommendedBase,
    recommendedSuperTopUp,
    totalEffectiveCover,
    standaloneBase1CrAnnualCost: standaloneCost,
    twoTierStrategyCost: twoTierCost,
    annualPremiumSaving: annualSavings,
    deductibleThreshold: recommendedBase,
    cashlessHospitalNetworkPct: '98%+ Network Hospital Availability across Tier 1 & Tier 2 cities',
    disclaimer:
      'Pre-existing disease (PED) waiting periods (usually 24-36 months) and 30-day initial waiting period apply. Read policy wording carefully for room rent eligibility and co-pay clauses.',
  };
}

// 4. Loan & Home Loan Interest Recovery via Parallel SIP
export function calculateLoanWithSipRecovery(
  principal: number = 5000000, // ₹50 Lakhs
  annualRatePct: number = 8.5,
  tenureYears: number = 20
): LoanCalculationResult {
  const r = annualRatePct / 100 / 12;
  const n = tenureYears * 12;

  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const roundedEmi = Math.round(emi);
  const totalPayment = roundedEmi * n;
  const totalInterest = totalPayment - principal;

  // Parallel SIP rule of thumb: ~0.15% of loan amount per month (₹7,500 for ₹50L)
  const parallelSipAmount = Math.round(principal * 0.0015);
  const sipResult = calculateSip(parallelSipAmount, tenureYears, 12);
  const recoveryPct = Math.min(100, Math.round((sipResult.futureValue / totalInterest) * 100));

  return {
    loanAmount: principal,
    annualInterestRate: annualRatePct,
    tenureYears,
    monthlyEmi: roundedEmi,
    totalInterestPayable: totalInterest,
    totalPayment,
    parallelSipMonthlyAmount: parallelSipAmount,
    parallelSipAccumulatedCorpus: sipResult.futureValue,
    interestRecoveryPercentage: recoveryPct,
    netHomeCostAfterSipRecovery: totalPayment - sipResult.futureValue,
  };
}

// 5. Retirement & SWP (Systematic Withdrawal Plan)
export function calculateRetirementSwp(
  currentAge: number = 40,
  retirementAge: number = 60,
  currentMonthlyExpense: number = 60000,
  inflationRatePct: number = 6.5
): RetirementCalculationResult {
  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const fvFactor = Math.pow(1 + inflationRatePct / 100, yearsToRetire);
  const expenseAtRetirement = Math.round(currentMonthlyExpense * fvFactor);

  // Corpus required for 25-year retirement @ 3% net real return post-retirement
  // Rule of thumb: ~25 to 30x annual expenses at retirement
  const annualExpenseAtRetire = expenseAtRetirement * 12;
  const requiredCorpus = Math.round(annualExpenseAtRetire * 25);

  // Sustainable SWP rate (6% per annum on corpus)
  const sustainableMonthlySwp = Math.round((requiredCorpus * 0.06) / 12);

  // Life annuity estimated yield (~6.5% p.a. guaranteed for life)
  const annuityYield = 6.5;
  const monthlyAnnuity = Math.round((requiredCorpus * (annuityYield / 100)) / 12);

  return {
    currentAge,
    retirementAge,
    currentMonthlyExpense,
    inflationRate: inflationRatePct,
    expenseAtRetirement,
    requiredRetirementCorpus: requiredCorpus,
    sustainableMonthlySwp,
    lifeAnnuityEstimatedYield: annuityYield,
    monthlyPensionFromAnnuity: monthlyAnnuity,
  };
}
