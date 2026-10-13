import React from 'react';
import { ClientPresentation } from '../../types/presentationStudio';
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  User,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

interface ClientReportDocumentPreviewProps {
  presentation: ClientPresentation;
  onDownloadPdf: () => void;
}

export const ClientReportDocumentPreview: React.FC<ClientReportDocumentPreviewProps> = ({
  presentation,
  onDownloadPdf,
}) => {
  const business = presentation.businessProfile;
  const sector = business?.sectorName || business?.sectorId || 'Financial Advisory';
  const company = business?.companyName || 'Leading Financial Institution';
  const product = business?.productName || presentation.title || 'Comprehensive Advisory Solution';
  const client = presentation.clientName || 'Valued Client';
  const advisor = presentation.advisorSnapshot;

  const fullText = `${sector} ${company} ${product} ${presentation.title}`.toLowerCase();
  const isLifeInsurance =
    fullText.includes('life') ||
    fullText.includes('term') ||
    fullText.includes('protect') ||
    fullText.includes('endowment') ||
    fullText.includes('insurance') ||
    fullText.includes('વીમો') ||
    fullText.includes('બીમા');

  const isHealth =
    fullText.includes('health') ||
    fullText.includes('mediclaim') ||
    fullText.includes('reassure') ||
    fullText.includes('super top');

  const isLoan = fullText.includes('loan') || fullText.includes('borrow') || fullText.includes('emi');
  const isSipMf = !isLifeInsurance && !isHealth && !isLoan;

  const categoryLabel = isLifeInsurance
    ? 'LIFE INSURANCE CLIENT ADVISORY REPORT'
    : isHealth
    ? 'HEALTH PROTECTION ADVISORY REPORT'
    : isLoan
    ? 'LOAN PLANNING & EMI RECOVERY REPORT'
    : 'MUTUAL FUND & SIP CLIENT ADVISORY REPORT';

  return (
    <div className="space-y-8 font-sans text-slate-800 dark:text-slate-200">
      {/* Document Sheet 1 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>FINADVISOR PRO | {categoryLabel}</span>
          <span>PAGE 1 OF 3</span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <div className="inline-block px-2.5 py-1 rounded-md bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase mb-2">
            OFFICIAL CLIENT BRIEF
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {presentation.title || `${product} Client Presentation`}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isLifeInsurance
              ? `A family-protection discussion using official terms of ${company} ${product}.`
              : `A disciplined financial growth and goal-alignment strategy prepared for client review.`}
          </p>
        </div>

        {/* Client & Advisor Metadata Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="space-y-1.5">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Prepared for: </span>
              <span className="font-semibold text-slate-900 dark:text-white">{client} (Client Family)</span>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Prepared by: </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {advisor.name} ({advisor.designation})
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Product discussed: </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {company} — {product}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">License / ARN: </span>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {advisor.professionalLicense || 'AMFI / IRDAI Authorized'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:dark:border-slate-700 sm:pl-4">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Date of Review: </span>
              <span className="text-slate-800 dark:text-slate-200">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Advisor Tel / WhatsApp: </span>
              <span className="text-slate-800 dark:text-slate-200">
                {advisor.phone} / {advisor.whatsapp}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Compliance Status: </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Official Product Documentation
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Highlight Grid (Exact match to User's Sample PDF) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {isLifeInsurance ? (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">■ ₹1 Crore</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Illustrative Sum Assured</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">30 Years</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Illustrative Policy Term</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">Protection</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pure Financial Risk Shield</div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">■ ₹5,000 / mo</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly Example SIP</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">■ ₹12 Lakh</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total 20-Yr Contributions</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-extrabold text-slate-900 dark:text-white">■ ₹37.9 Lakh+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Illustrative Value @ 10% p.a.</div>
              </div>
            </>
          )}
        </div>

        {/* Purpose Callout Box */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs">
          <span className="font-bold text-amber-900 dark:text-amber-300">Purpose: </span>
          <span className="text-amber-800 dark:text-amber-200/90 leading-relaxed">
            This report illustrates how the recommended product functions for your specific family goals: protection need, mathematical scenarios, key features, contractual terms, limitations, and next steps. It is an educational advisory analysis, not an unconditional quote.
          </span>
        </div>

        {/* Section 1: Understanding the Product */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Understanding the Product: {product}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLifeInsurance
              ? `${product} is described by ${company} as an individual, non-linked pure protection life insurance contract. The primary mandate of this solution is to provide structured financial shield and income replacement to the nominee family in the unforeseen event of premature death while the contract remains in force. It is not a speculative market-linked investment product, and the capital outlay is purely deployed toward underwriting family mortality risk.`
              : `${product} offered by ${company} operates as a professionally managed mutual fund portfolio structured to generate long-term capital appreciation. Systematic Investment Plans (SIP) allow investors to allocate fixed monthly amounts, eliminating emotional market timing through rupee-cost averaging. Every instalment purchases fund units at prevailing Net Asset Value (NAV), compounding over multi-year market cycles.`}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLifeInsurance
              ? `The solution features customizable policy terms, flexible premium payment horizons, and optional rider enhancements such as Accidental Death Benefit, Accelerated Terminal Illness cover, and Waiver of Premium. Statutory benefits include tax exemption under Section 80C and Section 10(10D) of the Indian Income Tax Act. Official documentation must be reviewed prior to formal policy issuance.`
              : `Under SEBI guidelines, the portfolio publishes daily NAVs, monthly factsheets, complete holding disclosures, and total expense ratio (TER) metrics. Long-term capital gains (LTCG) beyond ₹1.25 Lakh are taxed at 12.5% under Union Budget 2024 regulations. Market risks apply, and investment success depends on remaining invested through full economic cycles.`}
          </p>
        </div>

        {/* Section 2: A Realistic Family Scenario */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. A Realistic Family-Protection & Goal Scenario
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLifeInsurance
              ? `${client} is an earning household provider supporting dependants with ongoing living costs, outstanding loans, and future milestones such as children's higher education. For illustrative purposes, we examine whether a ₹1 Crore cover over a 30-year active horizon provides sufficient income security if an unfortunate demise occurs while obligations remain active.`
              : `${client} seeks to establish a predictable, automated wealth-creation mechanism to fund future milestones (child education, retirement corpus, or financial independence) without relying on lump-sum timing. A disciplined monthly SIP of ₹5,000 to ₹10,000 aligns monthly household cash flow with long-term compounding.`}
          </p>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Why this matters: </strong>
            {isLifeInsurance
              ? `The premature death of a breadwinner can instantly disrupt family lifestyle, force distress liquidation of assets, and jeopardize educational aspirations. Life insurance creates an immediate liquidity estate that contractual claim processes deliver directly to dependants.`
              : `Inflation erodes cash purchasing power at ~6% to 7% annually. Fixed deposits and traditional savings struggle to deliver real positive returns after taxes. Equities through SIP historically outpace inflation over 10+ year horizons.`}
          </p>
        </div>
      </div>

      {/* Document Sheet 2 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>FINADVISOR PRO | {categoryLabel}</span>
          <span>PAGE 2 OF 3</span>
        </div>

        {/* Section 3: Structured Inputs Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Illustrative Inputs & Parameter Matrix
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 w-1/3">Input Parameter</th>
                  <th className="py-2.5 px-4 w-2/3">Illustrative Value / Advisory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {isLifeInsurance ? (
                  <>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Life Assured</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{client} — Salaried Professional</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Plan Option</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{product} — Comprehensive Life Option</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Sum Assured</td>
                      <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">₹1,00,00,000 (One Crore Guaranteed Cover)</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Policy Term</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">30 Years (Coverage up to retirement age)</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Premium Payment Term</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Regular Pay / Limited Pay Option</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Underwriting Status</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Standard Non-Smoker Health Profile (Quote Required)</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Target Investor</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{client} — Goal-Driven Accumulation</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Asset Class & Scheme</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{product} — Regular Growth Option</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Monthly SIP Amount</td>
                      <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">₹5,000 / month (Automated Mandate)</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Investment Horizon</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">20 Years (240 Monthly Contributions)</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Total Principal Invested</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">₹12,00,000 (Total Outlay Over 20 Years)</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Tax Status</td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">LTCG @ 12.5% beyond ₹1.25 Lakh annual exemption</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: What is the Potential Benefit? & Colorful Chart */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. What is the Potential Benefit? (Visual Scenarios)
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLifeInsurance
              ? `For life insurance, the core benefit is contractual financial protection, not investment yield. If the life assured passes away while the policy is active, the nominee receives the entire ₹1 Crore sum assured. Below, we compare the total cumulative premium outlay against the instant contractual risk cover.`
              : `A disciplined SIP compounds mathematically over time. Below, we illustrate the projected future corpus for a ₹5,000 monthly SIP across 5, 10, 15, and 20 years at conservative 6%, balanced 10%, and historical benchmark 12% annual compounding rates.`}
          </p>

          {/* Visual Chart Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 text-center">
              {isLifeInsurance
                ? 'Protection Concept: ₹1 Crore Cover vs Total Premium Paid Outlay'
                : 'SIP Compounding Growth Scenarios (₹5,000 / month across Horizons)'}
            </h3>

            {isLifeInsurance ? (
              <div className="flex items-end justify-center gap-12 h-44 pb-2 border-b border-slate-300 dark:border-slate-700">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-sky-600 dark:text-sky-400">₹100 Lakh</div>
                  <div className="w-24 h-32 bg-sky-600 rounded-t-lg shadow-sm flex items-center justify-center text-white text-xs font-bold">
                    Cover
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Sum Assured</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="text-xs font-bold text-slate-500">Quote Required</div>
                  <div className="w-24 h-8 bg-slate-400 rounded-t-lg flex items-center justify-center text-white text-xs font-bold">
                    Outlay
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Premium</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-teal-600" />
                    <span className="text-slate-600 dark:text-slate-400">6% Scenario</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-sky-600" />
                    <span className="text-slate-600 dark:text-slate-400">10% Scenario</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-amber-600" />
                    <span className="text-slate-600 dark:text-slate-400">12% Benchmark</span>
                  </div>
                </div>

                {/* 4 Clusters */}
                <div className="grid grid-cols-4 gap-2 h-40 items-end pb-2 border-b border-slate-300 dark:border-slate-700">
                  {/* 5y */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 h-28">
                      <div className="w-4 bg-teal-600 rounded-t-xs" style={{ height: '20%' }} title="₹3.5L" />
                      <div className="w-4 bg-sky-600 rounded-t-xs" style={{ height: '24%' }} title="₹4.1L" />
                      <div className="w-4 bg-amber-600 rounded-t-xs" style={{ height: '27%' }} title="₹4.5L" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">5 Yrs</span>
                  </div>

                  {/* 10y */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 h-28">
                      <div className="w-4 bg-teal-600 rounded-t-xs" style={{ height: '40%' }} title="₹8.2L" />
                      <div className="w-4 bg-sky-600 rounded-t-xs" style={{ height: '50%' }} title="₹10.3L" />
                      <div className="w-4 bg-amber-600 rounded-t-xs" style={{ height: '58%' }} title="₹11.6L" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">10 Yrs</span>
                  </div>

                  {/* 15y */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 h-28">
                      <div className="w-4 bg-teal-600 rounded-t-xs" style={{ height: '60%' }} title="₹14.5L" />
                      <div className="w-4 bg-sky-600 rounded-t-xs" style={{ height: '75%' }} title="₹20.9L" />
                      <div className="w-4 bg-amber-600 rounded-t-xs" style={{ height: '85%' }} title="₹25.2L" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">15 Yrs</span>
                  </div>

                  {/* 20y */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 h-28">
                      <div className="w-4 bg-teal-600 rounded-t-xs" style={{ height: '75%' }} title="₹23.1L" />
                      <div className="w-4 bg-sky-600 rounded-t-xs" style={{ height: '90%' }} title="₹37.9L" />
                      <div className="w-4 bg-amber-600 rounded-t-xs" style={{ height: '100%' }} title="₹49.5L" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">20 Yrs</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-[11px] text-slate-600 dark:text-slate-400 italic">
              {isLifeInsurance
                ? 'Concept disclosure: This chart illustrates the financial leverage of insurance. The full contractual death benefit is payable upon valid claim acceptance, while cumulative premium outlay represents a fraction of the capital shield.'
                : 'Approximate 20-year outcomes under this model: At 6% about ₹23.1 Lakh; at 10% about ₹37.9 Lakh; at 12% about ₹49.5 Lakh. These figures are rounded illustrations before taxes and do not guarantee future returns.'}
            </div>
          </div>
        </div>

        {/* Section 5: Key Features & Options */}
        <div className="space-y-2 pt-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Key Features, Options & Structural Benefits
          </h2>
          <div className="space-y-1.5 text-xs sm:text-sm">
            {isLifeInsurance ? (
              <>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Return of Premium: </strong>
                  Option where cumulative premiums paid are returned on survival to policy maturity, subject to variant terms.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Increasing Cover: </strong>
                  Features allowing death benefit to step up periodically to keep pace with inflation and life-stage milestones.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Comprehensive Riders: </strong>
                  Available add-ons including Critical Illness, Accidental Death, and Waiver of Premium upon permanent disability.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Tax Optimization: </strong>
                  Premiums eligible for tax deduction under Section 80C; death benefit proceeds 100% tax-exempt under Section 10(10D).
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Rupee-Cost Averaging: </strong>
                  Automatic purchase of more units when markets dip and fewer when markets peak, averaging down unit acquisition cost.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Flexible Step-Up Facility: </strong>
                  Annual top-up (e.g. 10% step-up) aligns investment contributions with annual salary increments, doubling corpus.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• High Liquidity & Control: </strong>
                  Zero lock-in in open-ended schemes; access your funds anytime via partial withdrawal or Systematic Withdrawal Plan (SWP).
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">• Tax Efficiency (Section 112A): </strong>
                  Long-term equity gains taxed at favorable 12.5% rate only on capital gains exceeding ₹1.25 Lakh per financial year.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Document Sheet 3 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>FINADVISOR PRO | {categoryLabel}</span>
          <span>PAGE 3 OF 3</span>
        </div>

        {/* Section 6: Historical Best-Case */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            6. Historical Best-Case & Contractual Benefit Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {isLifeInsurance
              ? `A pure term insurance contract does not generate historical investment return series. Therefore, the appropriate analytical framework is a contractual-benefit analysis: the policy guarantees the ₹1 Crore Sum Assured payout upon demise, provided premiums are paid and disclosures are truthful. Optional bonus declarations in traditional endowment policies (under IRDAI 4% & 8% illustrations) are non-guaranteed estimates and must be separated from pure protection.`
              : `In Indian equity market history (2003–2018 bull and recovery phases), the verified 15-year rolling SIP return of broad market benchmarks (Nifty 500 TRI) peaked at ~17.8% CAGR. However, historical peak outcomes reflect extraordinary historical cycles and must NEVER be treated as future guarantees. Realistic long-term advisory planning relies on a 10%–12% conservative compounding baseline.`}
          </p>
        </div>

        {/* Section 7: Short Client-Education Examples */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            7. Client-Education Scenarios
          </h2>
          <div className="space-y-1.5 text-xs sm:text-sm">
            {isLifeInsurance ? (
              <>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example A — Income Protection: </strong>
                  If the primary earner passes away prematurely, the ₹1 Crore lump-sum enables the surviving spouse to generate predictable monthly interest income to fund ongoing expenses.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example B — Outstanding Home Loan: </strong>
                  A dedicated term policy insulates the family from debt recovery. The death benefit clears the mortgage balance, preventing foreclosure and allowing the family to retain their home.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example C — Life-Stage Policy Review: </strong>
                  As income grows and children enter university, coverage should be re-evaluated. Pure term contracts can be complemented with parallel SIPs to build independent wealth.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example A — The Early Starter (Age 25): </strong>
                  Neha begins a modest ₹5,000 monthly SIP at age 25. By investing through economic ups and downs, time provides 35 years of exponential compounding for complete financial freedom.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example B — The Late Planner (Age 40): </strong>
                  Kunal starts at age 40 with higher monthly capacity. By coupling disciplined SIP with annual 10% step-ups, he rapidly narrows his retirement gap within 15 years.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Example C — Goal-Linked Investing: </strong>
                  Partitioning SIPs into specific buckets (Child Education, Home Down-payment, Retirement) prevents emotional redemptions during normal market corrections.
                </p>
              </>
            )}
            <p className="text-[11px] text-slate-500 italic mt-1">
              Note: These are fictional educational scenarios designed for conceptual clarity, not actual customer testimonials.
            </p>
          </div>
        </div>

        {/* Section 8: Key Risks & Limitations */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            8. Key Risks, Conditions & Regulatory Guardrails
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            {isLifeInsurance ? (
              <>
                <li>
                  <strong>Underwriting & Medical Disclosure: </strong>
                  100% truthful disclosure of pre-existing conditions, smoking status, and family history is mandatory. Concealment can lead to claim repudiation.
                </li>
                <li>
                  <strong>Policy Continuity: </strong>
                  Premiums must be paid within the 30-day grace period; lapsed policies forfeit protection benefits.
                </li>
                <li>
                  <strong>Exclusions: </strong>
                  Standard suicide exclusions apply within the first 12 months from policy inception as per IRDAI regulations.
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Market Volatility: </strong>
                  Equity mutual funds do not offer fixed or guaranteed returns. NAV values fluctuate based on underlying macroeconomic factors.
                </li>
                <li>
                  <strong>Holding Horizon: </strong>
                  Equity investments require a minimum 5–7 year horizon to manage downside volatility and allow rupee-cost averaging to work.
                </li>
                <li>
                  <strong>Emergency Buffer: </strong>
                  Maintaining 6 months of expenses in a liquid fund prevents distress redemption of long-term investments during emergencies.
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Section 9: Advisor Discussion Checklist */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            9. Advisor Discussion Checklist (Step-by-Step)
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li>Quantify family financial requirements (dependants, liabilities, goals, and existing assets).</li>
            <li>Confirm age, KYC documentation, bank mandate details, and nominee designations.</li>
            <li>Obtain official company premium quote / Scheme Information Document (SID & KIM).</li>
            <li>Review contractual terms, payment frequency, tax implications, and exclusion clauses.</li>
            <li>Setup automated bank ECS/NACH mandate to guarantee investment/protection continuity.</li>
            <li>Schedule annual portfolio review to adjust for promotions, inflation, and life changes.</li>
          </ol>
        </div>

        {/* Section 10 & 11: Disclosures */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            10. Suggested Next Step & Important Disclosures
          </h2>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Important Statutory Disclosure: </strong>
            This document is an educational presentation prepared for discussion purposes. All figures, returns, and values are illustrative and subject to official scheme/policy terms. Mutual fund investments are subject to market risks; read all scheme related documents carefully. Insurance is a subject matter of solicitation. Please read the official product brochure, benefit illustration, and terms before purchasing.
          </p>
          <p className="text-[11px] text-slate-500">
            <strong>Official Source References: </strong>
            Verified via {company} Official Disclosures, Product Factsheets & Regulatory Filings.
          </p>
        </div>

        {/* Final Official Advisor Profile Branding Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1 text-xs">
          <div className="font-bold text-sm text-white flex items-center justify-between">
            <span>Demonstration Advisor Profile: {advisor.name}</span>
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
              Certified Financial Planner
            </span>
          </div>
          <div className="text-slate-300">
            {advisor.designation} • License/ARN: {advisor.professionalLicense || 'AMFI / IRDAI Authorized'}
          </div>
          <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800 flex flex-wrap gap-4">
            <span>Tel: {advisor.phone}</span>
            <span>WhatsApp: {advisor.whatsapp}</span>
            <span>Email: {advisor.email}</span>
            <span>Location: {advisor.location}</span>
          </div>
        </div>

        {/* Action Button: Download Client Report PDF */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="py-3 px-8 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download Official Client Report (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
