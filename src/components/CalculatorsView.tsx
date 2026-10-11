import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  Calculator,
  TrendingUp,
  Receipt,
  Clock,
  PiggyBank,
  GraduationCap,
  Home,
  Share2,
  Check,
  Shield,
  Layers,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';

type CalcType = 'tax' | 'sip' | 'swp' | 'lumpsum' | 'retirement' | 'education' | 'homeloan';

interface CalculatorsViewProps {
  onNavigateToSimulators?: () => void;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({ onNavigateToSimulators }) => {
  const { t } = useI18n();
  const { profile } = useAdvisor();

  const [activeCalc, setActiveCalc] = useState<CalcType>('tax');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // 1. INCOME TAX CALCULATOR STATE
  const [annualGrossIncome, setAnnualGrossIncome] = useState<number>(1200000);
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [sec24HomeLoan, setSec24HomeLoan] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);

  // Calculate Indian Income Tax (Current Budget Rules)
  // New Regime
  const stdDedNew = isSalaried ? 75000 : 0;
  const taxableIncomeNew = Math.max(0, annualGrossIncome - stdDedNew);
  let taxNew = 0;
  if (taxableIncomeNew > 300000) {
    if (taxableIncomeNew <= 700000) {
      taxNew = (taxableIncomeNew - 300000) * 0.05;
    } else if (taxableIncomeNew <= 1000000) {
      taxNew = 400000 * 0.05 + (taxableIncomeNew - 700000) * 0.10;
    } else if (taxableIncomeNew <= 1200000) {
      taxNew = 400000 * 0.05 + 300000 * 0.10 + (taxableIncomeNew - 1000000) * 0.15;
    } else if (taxableIncomeNew <= 1500000) {
      taxNew = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxableIncomeNew - 1200000) * 0.20;
    } else {
      taxNew = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxableIncomeNew - 1500000) * 0.30;
    }
  }
  // Section 87A Rebate in New Regime (Up to ₹7 Lakhs taxable income, tax is 0)
  if (taxableIncomeNew <= 700000) {
    taxNew = 0;
  }
  const cessNew = taxNew * 0.04;
  const totalTaxNew = taxNew + cessNew;

  // Old Regime
  const stdDedOld = isSalaried ? 50000 : 0;
  const totalDeductionsOld = stdDedOld + Math.min(150000, sec80C) + Math.min(75000, sec80D) + Math.min(200000, sec24HomeLoan) + hraExemption;
  const taxableIncomeOld = Math.max(0, annualGrossIncome - totalDeductionsOld);
  let taxOld = 0;
  if (taxableIncomeOld > 250000) {
    if (taxableIncomeOld <= 500000) {
      taxOld = (taxableIncomeOld - 250000) * 0.05;
    } else if (taxableIncomeOld <= 1000000) {
      taxOld = 250000 * 0.05 + (taxableIncomeOld - 500000) * 0.20;
    } else {
      taxOld = 250000 * 0.05 + 500000 * 0.20 + (taxableIncomeOld - 1000000) * 0.30;
    }
  }
  // Section 87A Rebate in Old Regime (Up to ₹5 Lakhs, tax is 0)
  if (taxableIncomeOld <= 500000) {
    taxOld = 0;
  }
  const cessOld = taxOld * 0.04;
  const totalTaxOld = taxOld + cessOld;

  const taxDifference = Math.abs(totalTaxNew - totalTaxOld);
  const betterRegime = totalTaxNew <= totalTaxOld ? 'New Tax Regime' : 'Old Tax Regime';

  // 2. SIP & STEP-UP SIP STATE
  const [monthlySip, setMonthlySip] = useState<number>(10000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(15);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [enableStepUp, setEnableStepUp] = useState<boolean>(false);

  // SIP Calculation
  const totalMonths = years * 12;
  const monthlyRate = annualReturn / 12 / 100;
  let totalInvestedSip = 0;
  let maturityValueSip = 0;

  if (!enableStepUp) {
    totalInvestedSip = monthlySip * totalMonths;
    maturityValueSip =
      monthlySip *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
  } else {
    // Step-up calculation
    let currentSip = monthlySip;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        totalInvestedSip += currentSip;
        const remainingMonths = (years - y) * 12 - m;
        maturityValueSip += currentSip * Math.pow(1 + monthlyRate, remainingMonths);
      }
      currentSip += (currentSip * stepUpPercent) / 100;
    }
  }
  const sipGains = Math.max(0, maturityValueSip - totalInvestedSip);

  // 3. SWP (Systematic Withdrawal Plan) STATE
  const [swpCorpus, setSwpCorpus] = useState<number>(5000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(35000);
  const [swpReturn, setSwpReturn] = useState<number>(9);
  const [swpYears, setSwpYears] = useState<number>(15);

  let swpBalance = swpCorpus;
  let totalWithdrawn = 0;
  const swpMonthlyRate = swpReturn / 12 / 100;
  for (let m = 0; m < swpYears * 12; m++) {
    swpBalance = swpBalance * (1 + swpMonthlyRate) - monthlyWithdrawal;
    totalWithdrawn += monthlyWithdrawal;
    if (swpBalance <= 0) {
      swpBalance = 0;
      break;
    }
  }

  // 4. LUMPSUM CALCULATOR
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(500000);
  const [lumpsumReturn, setLumpsumReturn] = useState<number>(12);
  const [lumpsumYears, setLumpsumYears] = useState<number>(10);
  const lumpsumMaturity = lumpsumAmount * Math.pow(1 + lumpsumReturn / 100, lumpsumYears);
  const lumpsumGain = lumpsumMaturity - lumpsumAmount;

  // 5. CHILD EDUCATION PLANNING
  const [currentEduCost, setCurrentEduCost] = useState<number>(1500000);
  const [childAge, setChildAge] = useState<number>(5);
  const [collegeAge, setCollegeAge] = useState<number>(18);
  const eduYearsLeft = Math.max(1, collegeAge - childAge);
  const futureEduCost = currentEduCost * Math.pow(1.10, eduYearsLeft); // 10% education inflation
  const eduMonthlyRate = 0.12 / 12;
  const eduMonths = eduYearsLeft * 12;
  const reqMonthlyEduSip =
    (futureEduCost * eduMonthlyRate) /
    ((Math.pow(1 + eduMonthlyRate, eduMonths) - 1) * (1 + eduMonthlyRate));

  // 6. HOME LOAN EMI & PREPAYMENT SAVER
  const [loanAmount, setLoanAmount] = useState<number>(4000000);
  const [loanRate, setLoanRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const loanMonths = loanTenureYears * 12;
  const r = loanRate / 12 / 100;
  const emi = (loanAmount * r * Math.pow(1 + r, loanMonths)) / (Math.pow(1 + r, loanMonths) - 1);
  const totalLoanRepayment = emi * loanMonths;
  const totalInterest = totalLoanRepayment - loanAmount;

  const handleShareCalc = (title: string, details: string) => {
    const text = encodeURIComponent(
      `*${title}*\n\n${details}\n\nShared by ${profile.advisorName} (${profile.designation})\nPhone / WhatsApp: ${profile.phoneNumber}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const navTabs = [
    { id: 'tax', name: 'Income Tax (New vs Old)', icon: Receipt },
    { id: 'sip', name: 'SIP & Step-Up SIP', icon: TrendingUp },
    { id: 'swp', name: 'SWP Monthly Pension', icon: PiggyBank },
    { id: 'lumpsum', name: 'Lumpsum Wealth', icon: DollarSign },
    { id: 'education', name: 'Child Education Goal', icon: GraduationCap },
    { id: 'homeloan', name: 'Home Loan & EMI', icon: Home },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Financial Advisory Calculators
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Indian financial calculators calibrated to official Government rules and financial planning standards.
        </p>
      </div>

      {onNavigateToSimulators && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">New Feature</span>
            <h4 className="text-sm font-bold">Interactive Client Mindset Simulators</h4>
            <p className="text-xs text-indigo-200">Demonstrate the Cost of Waiting, FD Inflation Destroyer, and Step-Up Multiplier.</p>
          </div>
          <button
            onClick={onNavigateToSimulators}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shrink-0 transition-all active:scale-95 flex items-center space-x-1.5"
          >
            <span>Open Simulators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCalc(tab.id as CalcType)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* 1. INDIAN INCOME TAX CALCULATOR (NEW VS OLD REGIME) */}
      {activeCalc === 'tax' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Receipt className="w-4 h-4" />
                </span>
                <h2 className="text-base font-extrabold text-slate-900">
                  Income Tax Calculator (New Regime vs Old Regime)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Current Budget rules: Section 87A rebate (Nil tax up to ₹7.75L with ₹75k std. deduction in New Regime).
              </p>
            </div>

            <button
              onClick={() =>
                handleShareCalc(
                  'Income Tax Comparison: New vs Old Regime',
                  `Gross Income: ${formatCurrency(annualGrossIncome)}\n\nTax under New Regime: ${formatCurrency(totalTaxNew)}\nTax under Old Regime: ${formatCurrency(totalTaxOld)}\n\nRecommendation: ${betterRegime} saves ${formatCurrency(taxDifference)} in taxes!`
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Tax Audit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Annual Gross Salary / Income (₹)
                </label>
                <input
                  type="number"
                  step="25000"
                  value={annualGrossIncome}
                  onChange={(e) => setAnnualGrossIncome(Number(e.target.value))}
                  className="w-full text-xs font-bold p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSalaried"
                  checked={isSalaried}
                  onChange={(e) => setIsSalaried(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-md"
                />
                <label htmlFor="isSalaried" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Salaried Employee (Standard Deduction ₹75,000 in New / ₹50,000 in Old)
                </label>
              </div>

              {/* Deductions (applicable only for Old Regime) */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="block text-xs font-bold text-slate-800">
                  Deductions (For Old Regime Evaluation):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Section 80C (ELSS, PPF, EPF) (Max ₹1.5L)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={sec80C}
                      onChange={(e) => setSec80C(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Section 80D Health Mediclaim
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={sec80D}
                      onChange={(e) => setSec80D(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Section 24 Home Loan Interest (Max ₹2L)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={sec24HomeLoan}
                      onChange={(e) => setSec24HomeLoan(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      HRA Exemption (Rent Paid)
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={hraExemption}
                      onChange={(e) => setHraExemption(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Results Card */}
            <div className="lg:col-span-6 space-y-4">
              {/* Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                  Smart Tax Recommendation
                </span>
                <p className="text-lg font-black mt-0.5">
                  Choose {betterRegime}!
                </p>
                <p className="text-xs text-emerald-100 mt-1">
                  You save <strong>{formatCurrency(taxDifference)}</strong> per year by opting for the {betterRegime}.
                </p>
              </div>

              {/* Side-by-side Table */}
              <div className="grid grid-cols-2 gap-3">
                {/* New Regime Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  betterRegime === 'New Tax Regime'
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    New Tax Regime
                  </span>
                  <p className="text-xl font-extrabold text-slate-900">
                    {formatCurrency(totalTaxNew)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Taxable: {formatCurrency(taxableIncomeNew)}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    Std. Deduction: {formatCurrency(stdDedNew)}
                  </span>
                </div>

                {/* Old Regime Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  betterRegime === 'Old Tax Regime'
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Old Tax Regime
                  </span>
                  <p className="text-xl font-extrabold text-slate-900">
                    {formatCurrency(totalTaxOld)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Taxable: {formatCurrency(taxableIncomeOld)}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md">
                    Deductions: {formatCurrency(totalDeductionsOld)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIP & STEP-UP SIP CALCULATOR */}
      {activeCalc === 'sip' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                SIP & Step-Up Compounding Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Shows regular monthly investments and the exponential power of raising SIP by 10% each year.
              </p>
            </div>
            <button
              onClick={() =>
                handleShareCalc(
                  'SIP Wealth Compounding Audit',
                  `Monthly SIP: ${formatCurrency(monthlySip)}\nTenure: ${years} Years @ ${annualReturn}%\n${enableStepUp ? `Step-Up: ${stepUpPercent}% per year\n` : ''}Total Invested: ${formatCurrency(totalInvestedSip)}\nMaturity Value: ${formatCurrency(maturityValueSip)}\nWealth Gain: ${formatCurrency(sipGains)}`
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share SIP Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Monthly Investment</span>
                  <span className="text-emerald-700">{formatCurrency(monthlySip)}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="150000"
                  step="1000"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Expected Annual Return (%)</span>
                  <span className="text-emerald-700">{annualReturn}%</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="25"
                  step="0.5"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Time Period (Years)</span>
                  <span className="text-emerald-700">{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableStepUp}
                    onChange={(e) => setEnableStepUp(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-md"
                  />
                  <span>Enable Annual Step-Up SIP (+{stepUpPercent}% every year)</span>
                </label>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-lg">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Total Maturity Value
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {formatCurrency(maturityValueSip)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Invested</span>
                  <span className="font-bold text-slate-200">{formatCurrency(totalInvestedSip)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Wealth Gain</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(sipGains)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SWP (SYSTEMATIC WITHDRAWAL PLAN) */}
      {activeCalc === 'swp' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                SWP (Systematic Withdrawal Plan) Pension Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Calculates monthly regular cash-flow withdrawals for retirees while maintaining capital growth.
              </p>
            </div>
            <button
              onClick={() =>
                handleShareCalc(
                  'SWP Regular Monthly Cash-Flow Plan',
                  `Initial Corpus: ${formatCurrency(swpCorpus)}\nMonthly Payout: ${formatCurrency(monthlyWithdrawal)}\nDuration: ${swpYears} Years\nTotal Withdrawn: ${formatCurrency(totalWithdrawn)}\nRemaining Balance: ${formatCurrency(swpBalance)}`
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share SWP Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Initial Corpus Invested (₹)
                </label>
                <input
                  type="number"
                  step="100000"
                  value={swpCorpus}
                  onChange={(e) => setSwpCorpus(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Monthly Withdrawal Desired (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={swpReturn}
                    onChange={(e) => setSwpReturn(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={swpYears}
                    onChange={(e) => setSwpYears(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Total Money Withdrawn As Pension
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {formatCurrency(totalWithdrawn)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 block">
                  Remaining Portfolio Value
                </span>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">
                  {formatCurrency(swpBalance)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Corpus continues to earn returns while providing monthly income.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CHILD HIGHER EDUCATION PLANNING */}
      {activeCalc === 'education' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Child Higher Education Goal Planner
              </h2>
              <p className="text-xs text-slate-500">
                Accounts for 10% educational inflation and shows the exact monthly SIP needed today.
              </p>
            </div>
            <button
              onClick={() =>
                handleShareCalc(
                  'Child Education Goal Roadmap',
                  `Current Course Cost: ${formatCurrency(currentEduCost)}\nYears Left: ${eduYearsLeft} Years\nFuture Cost @ 10% Inflation: ${formatCurrency(futureEduCost)}\n\nRecommended Monthly SIP Today: ${formatCurrency(reqMonthlyEduSip)}`
                )
              }
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Education Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Degree / College Cost Today (₹)
                </label>
                <input
                  type="number"
                  step="100000"
                  value={currentEduCost}
                  onChange={(e) => setCurrentEduCost(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Child Current Age (Years)
                  </label>
                  <input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College Admission Age
                  </label>
                  <input
                    type="number"
                    value={collegeAge}
                    onChange={(e) => setCollegeAge(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950 text-white space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Target Corpus Needed at Age {collegeAge}
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {formatCurrency(futureEduCost)}
                </p>
                <span className="text-[10px] text-slate-300">
                  (Adjusted for 10% annual education inflation over {eduYearsLeft} years)
                </span>
              </div>

              <div className="pt-3 border-t border-indigo-800">
                <span className="text-[11px] font-bold text-emerald-400 block">
                  Required Monthly SIP to Achieve This
                </span>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                  {formatCurrency(reqMonthlyEduSip)} / month
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. LUMPSUM CALCULATOR */}
      {activeCalc === 'lumpsum' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Lumpsum Mutual Fund Compounding Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Shows one-time capital growth across equity or hybrid mutual funds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  One-Time Investment Amount (₹)
                </label>
                <input
                  type="number"
                  step="50000"
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={lumpsumReturn}
                    onChange={(e) => setLumpsumReturn(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={lumpsumYears}
                    onChange={(e) => setLumpsumYears(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Total Maturity Value
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {formatCurrency(lumpsumMaturity)}
              </p>
              <div className="pt-2 border-t border-slate-700 text-xs text-slate-300">
                Gain: <strong className="text-emerald-400">{formatCurrency(lumpsumGain)}</strong> on principal of {formatCurrency(lumpsumAmount)}.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. HOME LOAN EMI & PREPAYMENT SAVER */}
      {activeCalc === 'homeloan' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Home Loan EMI & Prepayment Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Shows monthly EMI and total interest paid over the loan tenure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Monthly Home Loan EMI
                </span>
                <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                  {formatCurrency(emi)} / month
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Interest Paid</span>
                  <span className="font-bold text-rose-400">{formatCurrency(totalInterest)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Repayment</span>
                  <span className="font-bold text-slate-200">{formatCurrency(totalLoanRepayment)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
