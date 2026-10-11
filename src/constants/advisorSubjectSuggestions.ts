import { FinancialSubjectId } from '../types';

export interface SubjectAdvisorSuggestions {
  designations: string[];
  achievements: string[];
}

export const SUBJECT_ADVISOR_SUGGESTIONS: Record<FinancialSubjectId | 'default', SubjectAdvisorSuggestions> = {
  sip_mutual_fund: {
    designations: [
      'AMFI-Registered Mutual Fund Distributor',
      'Certified Financial Planner (CFP)',
      'Wealth & Mutual Fund Consultant',
      'Systematic Investment Specialist'
    ],
    achievements: [
      'Managing 500+ Active SIP Accounts',
      '₹25+ Cr AUM Managed Across 400+ Portfolios',
      '12+ Years Wealth Creation Experience',
      'Top Performer MFD Excellence Award 2024'
    ]
  },
  retirement_planning: {
    designations: [
      'Retirement & Pension Planning Specialist',
      'Senior Wealth Architect',
      'Certified Financial Planner (CFP)',
      'Retirement Freedom & Annuity Advisor'
    ],
    achievements: [
      'Guided 300+ Pre-Retirees to Financial Freedom',
      'Helped Create ₹100+ Cr Retirement Corpi',
      '15+ Years Retirement Advisory Experience',
      'Expert in Inflation-Proof Pension Roadmaps'
    ]
  },
  emergency_fund: {
    designations: [
      'Financial Safety & Liquid Assets Planner',
      'Personal Finance & Cash Flow Consultant',
      'Family Financial Wellness Advisor'
    ],
    achievements: [
      'Helped 450+ Families Build 6-Month Safety Cushions',
      'Zero Debt & Crisis Management Specialist',
      'Advised 1,000+ Young Earners on Financial Security'
    ]
  },
  tax_planning: {
    designations: [
      'Tax Planning & Wealth Consultant',
      'Tax-Saving & Investment Strategist',
      'Personal Finance & 80C Specialist'
    ],
    achievements: [
      'Saved ₹50L+ in Client Taxes Legally via 80C & Capital Gains',
      'Audited 600+ Portfolios for Tax Optimization',
      'Old vs New Tax Regime Audit Specialist'
    ]
  },
  income_tax: {
    designations: [
      'Tax Optimization & Wealth Consultant',
      'Salaried & Business Tax Strategist',
      'Comprehensive Financial Planner'
    ],
    achievements: [
      'Guided 500+ Professionals through Tax Regime Selection',
      'Maximizing Post-Tax Net Return for HNIs & Salaried'
    ]
  },
  insurance_planning: {
    designations: [
      'Certified Risk & Protection Advisor',
      'Life & Health Insurance Specialist (IRDAI)',
      'Family Risk Management Consultant'
    ],
    achievements: [
      'MDRT Qualifier & 1,000+ Protected Lives',
      '100+ Settled Claims with 99.4% Ratio',
      '₹150+ Cr Sum Assured Arranged for Families'
    ]
  },
  health_insurance: {
    designations: [
      'Certified Health Insurance Consultant',
      'Mediclaim & Critical Illness Specialist',
      'IRDAI Licensed Health Risk Advisor'
    ],
    achievements: [
      '120+ Cashless Hospitalization Claims Assisted',
      'Protected 850+ Families from Medical Inflation',
      'Dedicated 24/7 Hospitalization Support Desk'
    ]
  },
  term_insurance: {
    designations: [
      'Pure Term Life Protection Specialist',
      'Family Financial Security Advisor',
      'IRDAI Certified Life Underwriter'
    ],
    achievements: [
      '₹200+ Cr Life Cover Arranged for Young Families',
      '100% Claim Settlement Assistance Track Record',
      'MDRT Life Member & Trusted Risk Advisor'
    ]
  },
  investment_planning: {
    designations: [
      'Holistic Wealth & Asset Allocation Advisor',
      'Certified Financial Planner (CFP)',
      'Portfolio Management & Investment Consultant'
    ],
    achievements: [
      'Managing ₹50+ Cr High Net-Worth Portfolios',
      'Risk-Adjusted Return Specialist with 14+ Years Practice',
      'Advised 750+ Families across India & NRI diaspora'
    ]
  },
  personal_loan: {
    designations: [
      'Debt Consolidation & Financial Wellness Coach',
      'Personal Finance & Cash Flow Consultant'
    ],
    achievements: [
      'Helped 200+ Borrowers Break Free from High-Interest Debt',
      'Saved ₹25L+ in Unnecessary Interest for Clients'
    ]
  },
  home_loan: {
    designations: [
      'Mortgage & Home Loan Financial Advisor',
      'Property Finance & Interest Reduction Specialist'
    ],
    achievements: [
      'Helped 150+ Homebuyers Save Years of EMI via Prepayments',
      'Facilitated ₹75+ Cr Sanctioned Home Mortgages'
    ]
  },
  credit_score: {
    designations: [
      'Credit Score & Financial Health Consultant',
      'Credit Discipline & CIBIL Optimization Coach'
    ],
    achievements: [
      'Assisted 350+ Individuals in Boosting CIBIL above 780+',
      'Zero Debt & Clean Credit Profile Strategist'
    ]
  },
  child_education: {
    designations: [
      'Child Education & Higher Studies Fund Specialist',
      'Family Milestone Wealth Planner'
    ],
    achievements: [
      'Funded 200+ Children’s Ivy League & Tier-1 College Dreams',
      '10+ Years Education Inflation Hedging Practice'
    ]
  },
  elss_tax_saving: {
    designations: [
      'ELSS & Tax-Saving Equity Specialist',
      'AMFI-Registered Mutual Fund Distributor'
    ],
    achievements: [
      'Guided ₹10+ Cr in ELSS Wealth Accumulation with 80C Benefits',
      'Triple-Advantage Equity Tax Planning Consultant'
    ]
  },
  budgeting_cash_flow: {
    designations: [
      'Personal Budgeting & Cash Flow Architect',
      'Financial Wellness & Freedom Coach'
    ],
    achievements: [
      'Trained 2,000+ Salaried Professionals on 50/30/20 Rule',
      'Turned 400+ Overspenders into Disciplined Wealth Accumulators'
    ]
  },
  nps_pension: {
    designations: [
      'National Pension System (NPS) Consultant',
      'PFRDA Retirement & Annuity Specialist'
    ],
    achievements: [
      'Authorized NPS Subscriber Advisor for Corporate & Individuals',
      'Extra 80CCD(1B) Tax Saving Strategist'
    ]
  },
  gold_debt_fixed_income: {
    designations: [
      'Fixed Income & Capital Preservation Specialist',
      'Sovereign Gold Bond & Debt Fund Advisor'
    ],
    achievements: [
      'Constructed ₹30+ Cr Stable Debt & Sovereign Gold Portfolios',
      'Guaranteed Regular Income Planner for Retirees'
    ]
  },
  sgb_gold_investment: {
    designations: [
      'Sovereign Gold Bond (SGB) & Precious Assets Consultant',
      'Digital Gold & Capital Preservation Strategist',
      'Certified Wealth & Asset Allocation Specialist'
    ],
    achievements: [
      'Advised ₹12+ Cr in Sovereign Gold Bond Tranches',
      '2.5% Annual Interest + Capital Gains Tax-Free Maturity Specialist',
      'Helped 400+ Families Replace Physical Gold with High-Yield SGBs'
    ]
  },
  mediclaim_super_topup: {
    designations: [
      'Health Protection & Super Top-Up Specialist',
      'Critical Illness & Catastrophic Risk Underwriter',
      'Certified Medical Inflation Protection Advisor'
    ],
    achievements: [
      'Arranged ₹1 Crore Health Shield Portfolios with Low Deductibles',
      '350+ Cashless Hospital Claims Settled Seamlessly',
      'Saved Clients up to 60% Premium via Smart Deductible Top-Ups'
    ]
  },
  reits_real_estate: {
    designations: [
      'Commercial Real Estate & REITs Consultant',
      'Fractional Real Estate & Dividend Yield Specialist',
      'Passive Rental Income & HNI Wealth Advisor'
    ],
    achievements: [
      'Guided 250+ Investors into High-Yield Listed REIT Portfolios',
      'Generating Consistent 6.5%-8% Annual Yields for Salaried & Retirees',
      'Commercial Real Estate Diversification Award 2024'
    ]
  },
  debt_loan_prepayment: {
    designations: [
      'Home Loan Prepayment & Debt Elimination Strategist',
      'Mortgage Optimization & Interest Saver Consultant',
      'Zero-Debt Financial Freedom Architect'
    ],
    achievements: [
      'Saved ₹18+ Cr in Cumulative Interest for Home Loan Borrowers',
      'Helped 300+ Families Become 100% Debt-Free in Under 8 Years',
      'SIP-Linked Loan Prepayment Roadmap Pioneer'
    ]
  },
  post_office_savings: {
    designations: [
      'Government Small Savings & Post Office Consultant',
      'Sukanya Samriddhi & Senior Citizen Scheme Advisor',
      'Sovereign Guaranteed Safety & Regular Income Planner'
    ],
    achievements: [
      'Structured 500+ Sukanya Samriddhi Accounts for Girl Child Education',
      'Zero-Default Government Backed Income Portfolios for 600+ Retirees',
      'Expert in PPF, NSC & Monthly Income Scheme (MIS) Compounding'
    ]
  },
  senior_citizen_pension: {
    designations: [
      'Senior Citizen Guaranteed Pension Architect',
      'Retirement Cash-Flow & SCSS Specialist',
      'Elderly Financial Wellness & Estate Advisor'
    ],
    achievements: [
      'Structured Monthly Guaranteed Pension for 450+ Senior Citizens',
      'Maximizing Post-Tax Annuity & SCSS Safety Returns',
      'Dedicated Doorstep Consultation for Senior Citizens'
    ]
  },
  corporate_fd_bonds: {
    designations: [
      'Corporate Fixed Deposit & Listed Bond Specialist',
      'Credit-Rated Fixed Income Consultant',
      'High-Yield Fixed Income & Capital Shield Advisor'
    ],
    achievements: [
      'Curated AAA/AA+ Corporate FDs Yielding up to 8.65% Safely',
      '₹45+ Cr Placed in High-Grade Listed Non-Convertible Debentures',
      'Zero-Default Track Record Across 10+ Years of Bond Advisory'
    ]
  },
  default: {
    designations: [
      'Certified Financial Planner (CFP)',
      'AMFI Registered Mutual Fund Distributor',
      'Comprehensive Wealth & Risk Advisor',
      'Senior Financial Wellness Consultant'
    ],
    achievements: [
      'Managing ₹25+ Cr AUM • 500+ Happy Families',
      '12+ Years Professional Advisory Excellence',
      'MDRT Qualifier & Certified Wealth Specialist',
      'Award-Winning Client Service Excellence 2024'
    ]
  }
};
