import { FinancialSubject, FinancialSubjectId } from '../types';

export const MAIN_FINANCIAL_SUBJECTS: FinancialSubject[] = [
  { id: 'sip_mutual_fund', key: 'sip_mutual_fund', iconName: 'TrendingUp', category: 'wealth' },
  { id: 'retirement_planning', key: 'retirement_planning', iconName: 'Clock', category: 'planning' },
  { id: 'emergency_fund', key: 'emergency_fund', iconName: 'ShieldAlert', category: 'planning' },
  { id: 'tax_planning', key: 'tax_planning', iconName: 'FileSpreadsheet', category: 'tax' },
  { id: 'income_tax', key: 'income_tax', iconName: 'Receipt', category: 'tax' },
  { id: 'insurance_planning', key: 'insurance_planning', iconName: 'Umbrella', category: 'protection' },
  { id: 'health_insurance', key: 'health_insurance', iconName: 'HeartPulse', category: 'protection' },
  { id: 'term_insurance', key: 'term_insurance', iconName: 'ShieldCheck', category: 'protection' },
  { id: 'investment_planning', key: 'investment_planning', iconName: 'PieChart', category: 'wealth' },
  { id: 'personal_loan', key: 'personal_loan', iconName: 'CreditCard', category: 'borrowing' },
  { id: 'home_loan', key: 'home_loan', iconName: 'Home', category: 'borrowing' },
  { id: 'credit_score', key: 'credit_score', iconName: 'Gauge', category: 'borrowing' },
  { id: 'child_education', key: 'child_education', iconName: 'GraduationCap', category: 'planning' },
  { id: 'elss_tax_saving', key: 'elss_tax_saving', iconName: 'PiggyBank', category: 'tax' },
  { id: 'budgeting_cash_flow', key: 'budgeting_cash_flow', iconName: 'Wallet', category: 'planning' },
  { id: 'nps_pension', key: 'nps_pension', iconName: 'Landmark', category: 'planning' },
  { id: 'gold_debt_fixed_income', key: 'gold_debt_fixed_income', iconName: 'Coins', category: 'wealth' },
  // 7 New Fixed Financial Subjects:
  { id: 'sgb_gold_investment', key: 'sgb_gold_investment', iconName: 'Coins', category: 'wealth' },
  { id: 'mediclaim_super_topup', key: 'mediclaim_super_topup', iconName: 'HeartPulse', category: 'protection' },
  { id: 'reits_real_estate', key: 'reits_real_estate', iconName: 'Home', category: 'wealth' },
  { id: 'debt_loan_prepayment', key: 'debt_loan_prepayment', iconName: 'CreditCard', category: 'borrowing' },
  { id: 'post_office_savings', key: 'post_office_savings', iconName: 'Landmark', category: 'planning' },
  { id: 'senior_citizen_pension', key: 'senior_citizen_pension', iconName: 'Clock', category: 'planning' },
  { id: 'corporate_fd_bonds', key: 'corporate_fd_bonds', iconName: 'TrendingUp', category: 'wealth' },
];

export const TODAY_SUGGESTED_TOPICS = [
  {
    subjectId: 'sip_mutual_fund' as FinancialSubjectId,
    tag: 'Trending Strategy',
    badge: 'High Engagement',
    en: {
      headline: 'Market Volatility & Why Stopping Your SIP Destroys Long-term Compounding',
      teaser: 'Show clients how rupee-cost averaging turns market dips into discount accumulation phases.'
    },
    hi: {
      headline: 'बाजार के उतार-चढ़ाव में एसआईपी क्यों नहीं रोकनी चाहिए?',
      teaser: 'क्लाइंट्स को बताएं कि कैसे मार्केट गिरावट में ज्यादा यूनिट्स जमा होती हैं।'
    },
    gu: {
      headline: 'બજારના ઘટાડામાં એસઆઈપી બંધ કરવાની ભૂલ શા માટે ન કરવી જોઈએ?',
      teaser: 'ગ્રાહકોને સમજાવો કે કેવી રીતે કરેક્શન દરમિયાન વધુ યુનિટ્સ એકત્રિત થાય છે.'
    }
  },
  {
    subjectId: 'elss_tax_saving' as FinancialSubjectId,
    tag: 'Tax Season Guide',
    badge: 'Timely Topic',
    en: {
      headline: 'Section 80C Comparison: Why ELSS Has the Shortest Lock-in & Equity Edge',
      teaser: 'Compare ELSS (3-yr lock-in) with PPF (15-yr) and Tax Saver FDs (5-yr) to guide smart year-end savers.'
    },
    hi: {
      headline: 'टैक्स सेविंग ईएलएसएस: पीपीएफ और एफडी से बेहतर रिटर्न क्यों?',
      teaser: 'केवल ३ साल का लॉक-इन और इक्विटी ग्रोथ का अनोखा संयोजन समझाएं।'
    },
    gu: {
      headline: 'કલમ 80C ટેક્સ બચત: શા માટે ELSS સૌથી સ્માર્ટ વિકલ્પ છે?',
      teaser: 'માત્ર ૩ વર્ષનો લોક-ઇન અને લાંબા ગાળાના ઉત્કૃષ્ટ વેલ્થ ક્રિએશન લાભ.'
    }
  },
  {
    subjectId: 'health_insurance' as FinancialSubjectId,
    tag: 'Protection First',
    badge: 'Essential',
    en: {
      headline: 'Why a ₹5 Lakh Corporate Mediclaim is Not Enough in 2026',
      teaser: 'Medical inflation runs at 14% annually in India. Educate clients on Super Top-up policies.'
    },
    hi: {
      headline: 'कंपनी का ५ लाख का हेल्थ इंश्योरेंस आज के समय में काफी क्यों नहीं है?',
      teaser: 'मेडिकल महंगाई और सुपर टॉप-अप पॉलिसियों की अहमियत अपने क्लाइंट्स को समझाएं।'
    },
    gu: {
      headline: 'કંપનીનો ૫ લાખનો મેડિક્લેમ કેમ પૂરતો નથી? સુપર ટોપ-અપ શા માટે જરૂરી?',
      teaser: 'તબીબી મોંઘવારીના યુગમાં પરિવારની સુરક્ષા માટે મહત્ત્વની સલાહ.'
    }
  }
];
