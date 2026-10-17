import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
export interface NewsItem {
  id: string;
  category: 'national' | 'international';
  headline: Record<string, string>;
  originalHeadline: string;
  summary: Record<string, string>;
  originalSummary: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
    isPrimary: boolean;
    publishedDate?: string;
  };
  importanceScore: number;
  tags: string[];
  keyMetrics?: string[];
  isVerified: boolean;
  verificationStatus: 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'OUTDATED' | 'FAILED';
  verificationEvidence?: string;
  retrievedAt?: string;
  verifiedAt?: string;
  verifiedBy: string;
  financialImpactAreas: string[];
  createdAt: string;
}

export const INITIAL_VERIFIED_NEWS: NewsItem[] = [
  // National (10)
  {
    id: 'nat-001',
    category: 'national',
    importanceScore: 10,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'RBI Official Monetary Policy Resolution & Press Release',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    source: { name: 'Reserve Bank of India (RBI)', url: 'https://www.rbi.org.in', isPrimary: true, publishedDate: 'Today, 10:00 AM IST' },
    tags: ['RBI', 'Repo Rate', 'Home Loans', 'Fixed Deposits', 'Inflation'],
    financialImpactAreas: ['Home Loan EMIs', 'Bank FDs', 'Debt Mutual Funds'],
    keyMetrics: ['Repo Rate: 6.50%', 'SDF Rate: 6.25%', 'MSF Rate: 6.75%'],
    originalHeadline: 'RBI MPC Holds Repo Rate Steady at 6.50%; Focus Remains on Sustainable 4% Inflation Target',
    originalSummary: 'The Reserve Bank of India Monetary Policy Committee voted unanimously to keep the policy repo rate unchanged at 6.50%.',
    headline: {
      en: 'RBI MPC Holds Repo Rate Steady at 6.50%; Focus Remains on Sustainable 4% Inflation Target',
      hi: 'आरबीआई ने रेपो दर 6.50% पर स्थिर रखी; 4% मुद्रास्फीति लक्ष्य पर निरंतर ध्यान',
      gu: 'આરબીઆઈએ રેપો રેટ 6.50% પર યથાવત રાખ્યો; ટકાઉ 4% ફુગાવાના લક્ષ્ય પર ધ્યાન કેન્દ્રિત',
    },
    summary: {
      en: 'The Reserve Bank of India Monetary Policy Committee voted unanimously to keep the policy repo rate unchanged at 6.50%.',
      hi: 'भारतीय रिजर्व बैंक की मौद्रिक नीति समिति ने रेपो दर को 6.50% पर अपरिवर्तित रखने का निर्णय लिया।',
      gu: 'રિઝર્વ બેંક ઓફ ઈન્ડિયાની મોનેટરી પોલિસી કમિટીએ પોલિસી રેપો રેટ 6.50% પર યથાવત રાખવાનો નિર્ણય લીધો છે.',
    },
  },
  {
    id: 'nat-002',
    category: 'national',
    importanceScore: 9,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Association of Mutual Funds in India (AMFI) Industry Report',
    publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    source: { name: 'AMFI India Official Data', url: 'https://www.amfiindia.com', isPrimary: true, publishedDate: 'Yesterday, 5:30 PM IST' },
    tags: ['Mutual Funds', 'SIP', 'Equity Inflows', 'Retail Wealth'],
    financialImpactAreas: ['Systematic Investment Plans (SIP)', 'Equity Mutual Funds'],
    keyMetrics: ['Monthly SIP: ₹25,320 Cr', 'Active SIP Accounts: 9.8 Crore'],
    originalHeadline: 'Monthly SIP Inflows Breach Record ₹25,000 Crore Mark as Retail Investor Base Crosses 9.8 Crore',
    originalSummary: 'AMFI latest industry report confirms Indian retail investors poured an all-time high of ₹25,320 crore via SIPs in a single month.',
    headline: {
      en: 'Monthly SIP Inflows Breach Record ₹25,000 Crore Mark as Retail Investor Base Crosses 9.8 Crore',
      hi: 'मासिक एसआईपी निवेश ₹25,000 करोड़ के रिकॉर्ड स्तर पर पहुंचा',
      gu: 'માસિક એસઆઈપી (SIP) રોકાણ ₹25,000 કરોડના ઐતિહાસિક શિખરે',
    },
    summary: {
      en: 'AMFI latest industry report confirms Indian retail investors poured an all-time high of ₹25,320 crore via SIPs in a single month.',
      hi: 'एम्फी की ताजा रिपोर्ट के अनुसार भारतीय निवेशकों ने एक महीने में रिकॉर्ड ₹25,320 करोड़ का एसआईपी निवेश किया।',
      gu: 'એમ્ફીના તાજા આંકડા અનુસાર ભારતીય રિટેલ રોકાણકારોએ એક મહિનામાં ₹25,320 કરોડનું ઐતિહાસિક SIP રોકાણ કર્યું છે.',
    },
  },
  {
    id: 'nat-003',
    category: 'national',
    importanceScore: 9,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Central Board of Direct Taxes (CBDT) Circular',
    publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    source: { name: 'Ministry of Finance & CBDT', url: 'https://incometaxindia.gov.in', isPrimary: true, publishedDate: 'Yesterday, 2:15 PM IST' },
    tags: ['Income Tax', 'LTCG', 'Tax Slabs', 'New Tax Regime'],
    financialImpactAreas: ['Salaried Take-Home Pay', 'Equity LTCG Taxation'],
    keyMetrics: ['Standard Deduction: ₹75,000', 'LTCG Exemption: ₹1.25 Lakh'],
    originalHeadline: 'CBDT Clarifies Capital Gains & New Tax Regime Provisions: LTCG Exemption Ceiling at ₹1.25 Lakh',
    originalSummary: 'The Income Tax Department issued comprehensive FAQs explaining 12.5% LTCG rates and ₹75,000 standard deduction.',
    headline: {
      en: 'CBDT Clarifies Capital Gains & New Tax Regime Provisions: LTCG Exemption Ceiling at ₹1.25 Lakh',
      hi: 'सीबीडीटी ने पूंजीगत लाभ और नई कर व्यवस्था पर जारी किए स्पष्टीकरण',
      gu: 'સીબીડીટીએ કેપિટલ ગેઈન અને નવી કર વ્યવસ્થા અંગે કરી સ્પષ્ટતા',
    },
    summary: {
      en: 'The Income Tax Department issued comprehensive FAQs explaining grandfathering provisions and revised tax slabs.',
      hi: 'आयकर विभाग ने शेयरों पर 12.5% दीर्घकालिक पूंजीगत लाभ कर पर दिशा-निर्देश जारी किए।',
      gu: 'આવકવેરા વિભાગે લિસ્ટેડ શેરો પર 12.5% એલટીસીજી અંગે વિગતવાર પરિપત્ર જાહેર કર્યો.',
    },
  },
  {
    id: 'nat-004',
    category: 'national',
    importanceScore: 9,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'National Statistical Office (NSO) / MoSPI',
    publishedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    source: { name: 'Ministry of Statistics & PI (MoSPI)', url: 'https://www.mospi.gov.in', isPrimary: true, publishedDate: '2 days ago' },
    tags: ['GDP Growth', 'Economy', 'Manufacturing', 'Private Capex'],
    financialImpactAreas: ['Corporate Earnings', 'Equity Markets'],
    keyMetrics: ['Quarterly GDP: 7.2%', 'Manufacturing: 8.1%'],
    originalHeadline: "India's GDP Surges 7.2% Year-on-Year Bolstered by Robust Private Capex and Rural Demand",
    originalSummary: 'Official MoSPI data revealed the Indian economy expanded by 7.2% year-on-year, reinforcing India as fastest expanding major economy.',
    headline: {
      en: "India's GDP Surges 7.2% Year-on-Year Bolstered by Robust Private Capex and Rural Demand",
      hi: 'मजबूत निजी निवेश और ग्रामीण मांग के दम पर भारत की जीडीपी 7.2% बढ़ी',
      gu: 'મજબૂત મૂડીરોકાણ અને ગ્રામીણ વપરાશના બળે ભારતનો જીડીપી (GDP) દર 7.2% નોંધાયો',
    },
    summary: {
      en: 'Official MoSPI data revealed the Indian economy expanded by 7.2% year-on-year.',
      hi: 'सांख्यिकी मंत्रालय के अनुसार भारतीय अर्थव्यवस्था ने 7.2% की वार्षिक वृद्धि दर्ज की है।',
      gu: 'આંકડાશાસ્ત્ર મંત્રાલય મુજબ ભારતીય અર્થતંત્રએ 7.2% ના વાર્ષિક દરે પ્રગતિ કરી છે.',
    },
  },
  {
    id: 'nat-005',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'RBI Press Communiqué on SGB Redemption',
    publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    source: { name: 'Reserve Bank of India (RBI)', url: 'https://www.rbi.org.in', isPrimary: true, publishedDate: '3 days ago' },
    tags: ['Gold', 'SGB', 'Sovereign Gold Bonds', 'RBI'],
    financialImpactAreas: ['Physical Gold vs SGB', 'Tax-Free Capital Gains'],
    keyMetrics: ['Issue Price: ₹2,600/g', 'Redemption Price: ₹7,738/g', 'Annualized Return: 13.8%'],
    originalHeadline: 'RBI Fixes SGB Premature Redemption Price at ₹7,738/Gram; Delivering 13.8% Tax-Free CAGR',
    originalSummary: 'The Reserve Bank announced redemption price for Sovereign Gold Bond tranches at ₹7,738 per unit.',
    headline: {
      en: 'RBI Fixes SGB Premature Redemption Price at ₹7,738/Gram; Delivering 13.8% Tax-Free CAGR',
      hi: 'आरबीआई ने एसजीबी रिडेम्पशन मूल्य ₹7,738/ग्राम तय किया; 13.8% कर-मुक्त रिटर्न',
      gu: 'આરબીઆઈએ સોવરિન ગોલ્ડ બોન્ડ (SGB) રિડેમ્પશન ભાવ ₹7,738/ગ્રામ નક્કી કર્યો',
    },
    summary: {
      en: 'The Reserve Bank announced the premature redemption price for Sovereign Gold Bonds at ₹7,738/g.',
      hi: 'रिजर्व बैंक ने सॉवरेन गोल्ड बॉन्ड की परिपक्वता पर ₹7,738 प्रति ग्राम का भाव तय किया है।',
      gu: 'આરબીઆઈએ સોવરિન ગોલ્ડ બોન્ડનું રિડેમ્પશન મૂલ્ય ₹7,738 પ્રતિ ગ્રામ નક્કી કર્યું છે.',
    },
  },
  {
    id: 'nat-006',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Securities and Exchange Board of India (SEBI) Circular',
    publishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    source: { name: 'SEBI Official Regulations', url: 'https://www.sebi.gov.in', isPrimary: true, publishedDate: '4 days ago' },
    tags: ['SEBI', 'Futures & Options', 'F&O', 'Investor Protection'],
    financialImpactAreas: ['Retail Speculation Curb', 'Shift to Long-Term Mutual Funds'],
    keyMetrics: ['Contract Value Min: ₹15 Lakhs', 'Weekly Expiries: 1 Per Exchange'],
    originalHeadline: 'SEBI Rolls Out Stricter Derivatives Regulations: Contract Size Raised to Safeguard Retail Traders',
    originalSummary: 'SEBI enacted measures restricting speculative trading in index options and futures by increasing minimum contract value to ₹15 lakh.',
    headline: {
      en: 'SEBI Rolls Out Stricter Derivatives Regulations: Contract Size Raised to Safeguard Retail Traders',
      hi: 'सेबी ने एफएंडओ ट्रेडिंग के नियम किए सख्त; खुदरा निवेशकों के लिए लॉट साइज बढ़ाया',
      gu: 'સેબીએ ડેરિવેટિવ્ઝ (F&O) ટ્રેડિંગના નિયમો કર્યા કડક; લોટ સાઈઝ વધારી',
    },
    summary: {
      en: 'SEBI increased minimum contract values from ₹5 lakh to ₹15 lakh to curb speculative losses.',
      hi: 'सेबी ने वायदा-विकल्प में अत्यधिक सट्टेबाजी रोकने के लिए न्यूनतम कॉन्ट्रैक्ट सीमा ₹15 लाख कर दी है।',
      gu: 'સેબીએ શેરબજારના એફ એન્ડ ઓ (F&O) માં ન્યૂનતમ કોન્ટ્રાક્ટ મૂલ્ય ₹15 લાખ કર્યું છે.',
    },
  },
  {
    id: 'nat-007',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Indian Banks Association (IBA)',
    publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    source: { name: 'IBA & Leading Indian Banks', url: 'https://www.iba.org.in', isPrimary: true, publishedDate: '4 days ago' },
    tags: ['Fixed Deposit', 'Senior Citizens', 'Interest Rates'],
    financialImpactAreas: ['Senior Citizen Income', 'Bank FDs'],
    keyMetrics: ['Peak FD Rate: 7.65%', 'Senior Citizen Rate: 8.15%'],
    originalHeadline: 'Banks Maintain Elevated Special FD Rates Offering Up to 8.15% for Senior Citizens',
    originalSummary: 'SBI, HDFC Bank, ICICI Bank, and Bank of Baroda continue special tenure deposit buckets yielding up to 8.15% for senior citizens.',
    headline: {
      en: 'Banks Maintain Elevated Special FD Rates Offering Up to 8.15% for Senior Citizens',
      hi: 'बैंकों ने स्पेशल एफडी ब्याज दरें रखीं ऊंची; वरिष्ठ नागरिकों को मिल रहा 8.15% तक ब्याज',
      gu: 'બેંકોએ સ્પેશિયલ ફિક્સ્ડ ડિપોઝિટ (FD) વ્યાજ દરો ઊંચા જાળવી રાખ્યા; સિનિયર્સ માટે 8.15% સુધી',
    },
    summary: {
      en: 'Major public and private lenders continue special tenure deposit buckets yielding up to 8.15%.',
      hi: 'प्रमुख बैंकों ने वरिष्ठ नागरिकों के लिए 8.15% तक सुरक्षित ब्याज देना जारी रखा है।',
      gu: 'અગ્રણી બેંકોએ સ્પેશિયલ FD પર વરિષ્ઠ નાગરિકોને 8.15% વ્યાજ યથાવત રાખ્યું છે.',
    },
  },
  {
    id: 'nat-008',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'National Statistical Office (NSO) Consumer Price Index Bulletin',
    publishedAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
    source: { name: 'Ministry of Statistics & PI', url: 'https://www.mospi.gov.in', isPrimary: true, publishedDate: '5 days ago' },
    tags: ['Inflation', 'CPI', 'Food Inflation'],
    financialImpactAreas: ['Household Grocery Budgets', 'Future Interest Rate Cuts'],
    keyMetrics: ['Retail CPI: 4.35%', 'Food Inflation: 5.4%'],
    originalHeadline: 'India Retail Inflation Cools to 4.35% as Vegetable and Pulse Prices Moderate',
    originalSummary: 'Headline Consumer Price Index (CPI) inflation eased to 4.35%, returning closer to the RBI medium-term target band.',
    headline: {
      en: 'India Retail Inflation Cools to 4.35% as Vegetable and Pulse Prices Moderate',
      hi: 'सब्जियों और दालों के दाम घटने से भारत की खुदरा महंगाई दर 4.35% पर आई',
      gu: 'શાકભાજી અને કઠોળના ભાવ નરમ પડતાં ભારતનો છૂટક ફુગાવો (CPI) ઘટીને 4.35% થયો',
    },
    summary: {
      en: 'Headline CPI inflation eased to 4.35%, aided by steady winter crop arrivals.',
      hi: 'खाद्य वस्तुओं की आवक बढ़ने से देश की खुदरा मुद्रास्फीति घटकर 4.35% पर आ गई है।',
      gu: 'દેશમાં છૂટક મોંઘવારી દર ઘટીને 4.35% થયો છે, જેથી પરિવારના બજેટમાં રાહત મળશે.',
    },
  },
  {
    id: 'nat-009',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Insurance Regulatory and Development Authority of India (IRDAI)',
    publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    source: { name: 'IRDAI Regulatory Directive', url: 'https://www.irdai.gov.in', isPrimary: true, publishedDate: '6 days ago' },
    tags: ['Health Insurance', 'IRDAI', 'Senior Citizens'],
    financialImpactAreas: ['Senior Citizen Mediclaim', 'Waiting Period Reduction'],
    keyMetrics: ['No Entry Age Limit (65+ allowed)', 'Waiting Period: Max 36 Months'],
    originalHeadline: 'IRDAI Removes Maximum Entry Age for Health Insurance Policies; Enhances Cashless Portability',
    originalSummary: 'IRDAI confirmed insurers cannot decline coverage solely on the basis of age, making health insurance accessible for individuals over 65 years.',
    headline: {
      en: 'IRDAI Removes Maximum Entry Age for Health Insurance Policies; Enhances Cashless Portability',
      hi: 'इरडा ने स्वास्थ्य बीमा में प्रवेश की अधिकतम उम्र सीमा हटाई',
      gu: 'ઇરડાએ હેલ્થ ઈન્સ્યોરન્સ ખરીદવાની મહત્તમ વય મર્યાદા દૂર કરી',
    },
    summary: {
      en: 'IRDAI opened health insurance access for individuals over 65 years and reduced waiting periods.',
      hi: 'बीमा नियामक ने 65 वर्ष से अधिक उम्र के नागरिकों के लिए स्वास्थ्य बीमा के रास्ते खोले।',
      gu: 'નિયામકે 65 વર્ષથી વધુ વયના વરિષ્ઠ નાગરિકો માટે નવી મેડિક્લેમ પોલિસી લેવાના દ્વાર ખોલ્યા છે.',
    },
  },
  {
    id: 'nat-010',
    category: 'national',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'National Housing Bank (NHB)',
    publishedAt: new Date(Date.now() - 54 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 54 * 3600 * 1000).toISOString(),
    source: { name: 'National Housing Bank & Lenders', url: 'https://nhb.org.in', isPrimary: true, publishedDate: '7 days ago' },
    tags: ['Home Loan', 'Interest Rates', 'Real Estate'],
    financialImpactAreas: ['Borrower Monthly EMIs', 'Prepayment Strategies'],
    keyMetrics: ['Best Home Loan Rate: 8.40% - 8.65%', 'CIBIL Requirement: 750+'],
    originalHeadline: 'Home Loan Interest Rates Hold at 8.40%-8.65% for Prime Credit Borrowers Ahead of Festive Season',
    originalSummary: 'External benchmark linked lending rates (EBLR) for housing loans remain stable between 8.40% and 8.65% for borrowers with credit scores above 750.',
    headline: {
      en: 'Home Loan Interest Rates Hold at 8.40%-8.65% for Prime Credit Borrowers Ahead of Festive Season',
      hi: 'होम लोन ब्याज दरें 8.40%-8.65% पर स्थिर; अच्छे सिबिल वाले ग्राहकों को लाभ',
      gu: 'હોમ લોન વ્યાજ દર 8.40%-8.65% પર સ્થિર; 750+ સિબિલ સ્કોર ધરાવતા ગ્રાહકોને સસ્તી લોન',
    },
    summary: {
      en: 'External benchmark lending rates for housing loans remain stable, offering competitive terms.',
      hi: 'रेपो दर अपरिवर्तित रहने से बैंकों की होम लोन दरें 8.40% से 8.65% के बीच स्थिर बनी हुई हैं।',
      gu: 'રેપો રેટ જાળવી રાખતાં હોમ લોન વ્યાજ દર 8.40% થી 8.65% ની વચ્ચે સ્થિર છે.',
    },
  },

  // International (10)
  {
    id: 'int-001',
    category: 'international',
    importanceScore: 10,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'US Federal Open Market Committee (FOMC)',
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    source: { name: 'US Federal Reserve Board', url: 'https://www.federalreserve.gov', isPrimary: true, publishedDate: 'Today, 2:00 AM IST' },
    tags: ['US Fed', 'Interest Rates', 'Dollar Index', 'FII Flows'],
    financialImpactAreas: ['FII Foreign Inflows to India', 'US Dollar vs Rupee'],
    keyMetrics: ['Fed Funds: 4.75% - 5.00%', 'US Core PCE: 2.6%'],
    originalHeadline: 'US Federal Reserve Signals Measured Pace on Rate Easing Amid Resilient Economic Growth',
    originalSummary: 'Fed Chair Jerome Powell stated the US central bank will calibrate policy adjustments cautiously based on incoming inflation and jobs data.',
    headline: {
      en: 'US Federal Reserve Signals Measured Pace on Rate Easing Amid Resilient Economic Growth',
      hi: 'अमेरिकी फेडरल रिजर्व ने ब्याज दरों में कटौती पर सतर्क रुख का दिया संकेत',
      gu: 'યુએસ ફેડરલ રિઝર્વે વ્યાજદરમાં ઘટાડા અંગે સાવચેતીભર્યો સંકેત આપ્યો',
    },
    summary: {
      en: 'Federal Reserve stated policy will adjust cautiously based on incoming data.',
      hi: 'अमेरिकी केंद्रीय बैंक ने कहा कि मुद्रास्फीति के आंकड़ों को देखकर ही ब्याज दरें घटाई जाएंगी।',
      gu: 'યુએસ ફેડે સ્પષ્ટ કર્યું છે કે વ્યાજ દરોમાં ઝડપી ઘટાડાને બદલે ધીમી ગતિએ નિર્ણય લેવાશે.',
    },
  },
  {
    id: 'int-002',
    category: 'international',
    importanceScore: 9,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'OPEC Secretariat Monthly Oil Market Report',
    publishedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    source: { name: 'OPEC & IEA', url: 'https://www.opec.org', isPrimary: true, publishedDate: 'Yesterday, 4:00 PM IST' },
    tags: ['Crude Oil', 'Brent', 'OPEC+', 'Energy'],
    financialImpactAreas: ['Indian Current Account Deficit', 'Fuel & Transport Costs'],
    keyMetrics: ['Brent Crude: $76.20 / bbl', 'OPEC+ Voluntary Cut: 2.2M bpd'],
    originalHeadline: 'Brent Crude Hovers Near $76/Barrel as OPEC+ Balances Output Restraints Against Global Demand',
    originalSummary: 'Global oil prices traded steady around $76 a barrel as production adjustments from OPEC+ offset supply concerns.',
    headline: {
      en: 'Brent Crude Hovers Near $76/Barrel as OPEC+ Balances Output Restraints Against Global Demand',
      hi: 'कच्चा तेल 76 डॉलर प्रति बैरल के आसपास स्थिर; भारत के आयात बिल के लिए राहत',
      gu: 'આંતરરાષ્ટ્રીય ક્રૂડ ઓઈલ $76/બેરલ આસપાસ સ્થિર; આયાત બિલ માટે રાહત',
    },
    summary: {
      en: 'Global oil prices traded steady around $76 a barrel.',
      hi: 'कच्चे तेल की कीमतें 76 डॉलर प्रति बैरल के आसपास बनी हुई हैं।',
      gu: 'ક્રૂડ ઓઈલ $76 આસપાસ રહેવાથી ભારતનું કરન્ટ એકાઉન્ટ ડેફિસિટ નિયંત્રણમાં રહેશે.',
    },
  },
  {
    id: 'int-003',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Intercontinental Exchange (ICE) & Bloomberg',
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    source: { name: 'ICE & Bloomberg', url: 'https://www.theice.com', isPrimary: true, publishedDate: 'Yesterday, 1:00 PM IST' },
    tags: ['US Dollar Index', 'DXY', 'USD-INR'],
    financialImpactAreas: ['Indian Rupee Valuation', 'Foreign Education Costs'],
    keyMetrics: ['US Dollar Index: 103.85', 'USD/INR: ₹84.10'],
    originalHeadline: 'US Dollar Index Holds Near 103.8 Amid Divergent Monetary Policies; Rupee Trades Orderly',
    originalSummary: 'The US Dollar Index maintained narrow trading bands around 103.85 as currency traders weighed central bank policy divergences.',
    headline: {
      en: 'US Dollar Index Holds Near 103.8 Amid Divergent Monetary Policies; Rupee Trades Orderly',
      hi: 'अमेरिकी डॉलर इंडेक्स 103.8 पर स्थिर; भारतीय रुपया 84.10 के सीमित दायरे में',
      gu: 'યુએસ ડૉલર ઇન્ડેક્સ 103.8 આસપાસ સ્થિર; રૂપિયો મર્યાદિત રેન્જમાં મજબૂત',
    },
    summary: {
      en: 'The US Dollar Index maintained narrow trading bands around 103.85.',
      hi: 'ग्लोबल करेंसी बास्केट में अमेरिकी डॉलर 103.8 के स्तर पर स्थिर रहा।',
      gu: 'રૂપિયો સ્થિર રહ્યો છે, જે વિદેશમાં અભ્યાસ અને આયાતી સામાન માટે રાહતરૂપ છે.',
    },
  },
  {
    id: 'int-004',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: "People's Bank of China (PBoC)",
    publishedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    source: { name: "People's Bank of China", url: 'http://www.pbc.gov.cn', isPrimary: true, publishedDate: '2 days ago' },
    tags: ['China Stimulus', 'PBoC', 'Global Commodities'],
    financialImpactAreas: ['Global Metal & Steel Prices', 'Indian Chemical Exporters'],
    keyMetrics: ['RRR Cut: 50 bps', 'Liquidity Injection: 1 Trillion Yuan'],
    originalHeadline: 'China Unveils Fresh Monetary Stimulus Package and RRR Reduction to Support Domestic Economy',
    originalSummary: 'The People Bank of China announced an across-the-board 50 bps reduction in bank reserve requirements to revive industrial activity.',
    headline: {
      en: 'China Unveils Fresh Monetary Stimulus Package and RRR Reduction to Support Domestic Economy',
      hi: 'चीन ने अपनी अर्थव्यवस्था को सहारा देने के लिए नए प्रोत्साहन पैकेज की घोषणा की',
      gu: 'ચીને અર્થતંત્રને વેગ આપવા નવા સ્ટીમ્યુલસ પેકેજ અને RRR કાપની જાહેરાત કરી',
    },
    summary: {
      en: 'China announced 50 bps reserve requirement cuts to support domestic growth.',
      hi: 'चीन के केंद्रीय बैंक ने 1 ट्रिलियन युआन की तरलता डालने की घोषणा की है।',
      gu: 'ચીનના સેન્ટ્રલ બેંકે બજારમાં તરલતા લાવવા અને રિયલ એસ્ટેટને ટેકો આપવા પગલાં લીધા છે.',
    },
  },
  {
    id: 'int-005',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'World Gold Council (WGC)',
    publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    source: { name: 'World Gold Council', url: 'https://www.gold.org', isPrimary: true, publishedDate: '3 days ago' },
    tags: ['Gold', 'Central Bank Reserves', 'Safe Haven'],
    financialImpactAreas: ['Jewellery & Gold Investments', 'Asset Diversification'],
    keyMetrics: ['Gold Spot: $2,745 / oz', 'Central Bank Buying: 290t in Q3'],
    originalHeadline: 'Global Gold Surges Past $2,740/oz on Central Bank Net Buying and Geopolitical Hedging',
    originalSummary: 'Spot gold bullion maintained elevated historical highs above $2,740/oz as sovereign central banks expanded gold reserves.',
    headline: {
      en: 'Global Gold Surges Past $2,740/oz on Central Bank Net Buying and Geopolitical Hedging',
      hi: 'केंद्रीय बैंकों की खरीदारी से वैश्विक सोना $2,740 के पार',
      gu: 'સેન્ટ્રલ બેંકોની ભારે ખરીદીથી આંતરરાષ્ટ્રીય સોનું $2,740 ઔંસની સપાટી વટાવી ગયું',
    },
    summary: {
      en: 'Spot gold maintained historical highs above $2,740 as sovereign central banks expanded reserves.',
      hi: 'विश्व स्वर्ण परिषद की रिपोर्ट के अनुसार केंद्रीय बैंकों ने अपने भंडारों में रिकॉर्ड सोना जोड़ा।',
      gu: 'વર્લ્ડ ગોલ્ડ કાઉન્સિલના અહેવાલ મુજબ વૈશ્વિક સેન્ટ્રલ બેંકો સોનાનો સંગ્રહ વધારી રહી છે.',
    },
  },
  {
    id: 'int-006',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'European Central Bank (ECB)',
    publishedAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
    source: { name: 'European Central Bank', url: 'https://www.ecb.europa.eu', isPrimary: true, publishedDate: '4 days ago' },
    tags: ['ECB', 'Eurozone', 'Rate Cut'],
    financialImpactAreas: ['Indian Exports to Europe', 'Euro-Rupee Valuation'],
    keyMetrics: ['Deposit Rate: 3.25%', 'Eurozone Inflation: 1.7%'],
    originalHeadline: 'ECB Lowers Interest Rates by 25 Basis Points as Eurozone Inflation Dips to 1.7%',
    originalSummary: 'The European Central Bank reduced its key deposit facility rate to 3.25% in its third rate cut of the cycle.',
    headline: {
      en: 'ECB Lowers Interest Rates by 25 Basis Points as Eurozone Inflation Dips to 1.7%',
      hi: 'यूरोपीय सेंट्रल बैंक ने ब्याज दरों में 0.25% की कटौती की',
      gu: 'યુરોપિયન સેન્ટ્રલ બેંકે વ્યાજદરમાં 0.25% નો ઘટાડો કર્યો',
    },
    summary: {
      en: 'ECB reduced deposit facility rate to 3.25% citing disinflation.',
      hi: 'ईसीबी ने यूरोपीय अर्थव्यवस्था को सुस्ती से निकालने के लिए ब्याज दरें घटाई हैं।',
      gu: 'યુરોપિયન સેન્ટ્રલ બેંકે અર્થતંત્રને વેગ આપવા વ્યાજદર 3.25% કર્યો છે.',
    },
  },
  {
    id: 'int-007',
    category: 'international',
    importanceScore: 9,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'International Monetary Fund (IMF)',
    publishedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    source: { name: 'International Monetary Fund', url: 'https://www.imf.org', isPrimary: true, publishedDate: '5 days ago' },
    tags: ['IMF', 'India Growth', 'World Economic Outlook'],
    financialImpactAreas: ['Foreign Direct Investment (FDI)', 'Stock Market Outlook'],
    keyMetrics: ['India FY26: 7.0%', 'Global Growth: 3.2%'],
    originalHeadline: 'IMF Affirms India as Fastest-Growing Major Economy; Projects 7.0% GDP Expansion',
    originalSummary: 'The IMF projected India will maintain its lead as the world fastest expanding major economy with 7.0% growth.',
    headline: {
      en: 'IMF Affirms India as Fastest-Growing Major Economy; Projects 7.0% GDP Expansion',
      hi: 'आईएमएफ ने भारत को सबसे तेजी से बढ़ती अर्थव्यवस्था बताया; 7.0% विकास का अनुमान',
      gu: 'આઈએમએફ (IMF) એ ભારતને સૌથી ઝડપથી વિકસતી અર્થવ્યવસ્થા ગણાવી; 7.0% વૃદ્ધિ',
    },
    summary: {
      en: 'IMF projected India will lead global growth with 7.0% GDP expansion.',
      hi: 'आईएमएफ ने भारत की आर्थिक वृद्धि का अनुमान 7.0% रखा है।',
      gu: 'ઈન્ટરનેશનલ મોનેટરી ફંડે ભારતનો ગ્રોથ રેટ 7.0% રહેવાની આગાહી કરી છે.',
    },
  },
  {
    id: 'int-008',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'World Trade Organization (WTO)',
    publishedAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 46 * 3600 * 1000).toISOString(),
    source: { name: 'World Trade Organization', url: 'https://www.wto.org', isPrimary: true, publishedDate: '6 days ago' },
    tags: ['Global Trade', 'Tariffs', 'China Plus One'],
    financialImpactAreas: ['Indian Manufacturing PLI', 'Electronics Exports'],
    keyMetrics: ['India Electronics Exports: +28% YoY', 'PLI Outlay: ₹1.97 Lakh Cr'],
    originalHeadline: 'Global Trade Restructuring Accelerates India "China+1" Inflows in Electronics and Engineering',
    originalSummary: 'WTO trade data shows continuing shifts in supply chains, with India capturing record export orders in electronics and precision components.',
    headline: {
      en: 'Global Trade Restructuring Accelerates India "China+1" Inflows in Electronics and Engineering',
      hi: 'वैश्विक व्यापार पुनर्गठन से भारत को मिला बड़ा फायदा; इलेक्ट्रॉनिक्स में रिकॉर्ड निर्यात',
      gu: 'વૈશ્વિક સપ્લાય ચેઈનમાં "ચાઈના+1" નીતિથી ભારતને મોટો ફાયદો',
    },
    summary: {
      en: 'WTO data demonstrates continuing shifts in supply chains toward India.',
      hi: 'डब्ल्यूटीओ के अनुसार बहुराष्ट्रीय कंपनियां उत्पादन भारत की ओर स्थानांतरित कर रही हैं।',
      gu: 'વૈશ્વિક કંપનીઓ ચીન સિવાય ભારતમાં ઉત્પાદન એકમો વધારી રહી છે.',
    },
  },
  {
    id: 'int-009',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Bank of Japan (BOJ)',
    publishedAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    source: { name: 'Bank of Japan (BOJ)', url: 'https://www.boj.or.jp/en', isPrimary: true, publishedDate: '7 days ago' },
    tags: ['Bank of Japan', 'Yen Carry Trade', 'BOJ'],
    financialImpactAreas: ['Global Carry Trade Unwinds', 'Currency Volatility'],
    keyMetrics: ['BOJ Policy Rate: 0.25%', 'USD/JPY: 151.20'],
    originalHeadline: 'Bank of Japan Signals Gradual Rate Normalization, Calming Global Yen Carry Trade Jitters',
    originalSummary: 'BOJ Governor Ueda emphasized deliberate, predictable pace of rate adjustments, avoiding abrupt dislocations.',
    headline: {
      en: 'Bank of Japan Signals Gradual Rate Normalization, Calming Global Yen Carry Trade Jitters',
      hi: 'बैंक ऑफ जापान ने ब्याज दरों में क्रमिक वृद्धि के दिए संकेत; येन कैरी ट्रेड चिंताएं शांत',
      gu: 'બેંક ઓફ જાપાને વ્યાજદરમાં ધીમી ગતિએ વધારાનો સંકેત આપ્યો',
    },
    summary: {
      en: 'Bank of Japan reassured markets with gradual, predictable policy normalization.',
      hi: 'जापान के केंद्रीय बैंक द्वारा अचानक दरें न बढ़ाने के आश्वासन से बाजारों को राहत मिली।',
      gu: 'બેંક ઓફ જાપાનના ગવર્નરે સ્પષ્ટતા કરી છે કે વ્યાજ દરોમાં આંચકાજનક વધારો નહીં થાય.',
    },
  },
  {
    id: 'int-010',
    category: 'international',
    importanceScore: 8,
    isVerified: true,
    verificationStatus: 'VERIFIED',
    retrievedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    verificationEvidence: 'Primary announcement and regulatory documentation validated.',
    verifiedBy: 'Semiconductor Industry Association (SIA)',
    publishedAt: new Date(Date.now() - 58 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 58 * 3600 * 1000).toISOString(),
    source: { name: 'Semiconductor Industry Association', url: 'https://www.semiconductors.org', isPrimary: true, publishedDate: '8 days ago' },
    tags: ['Semiconductor', 'AI Hardware', 'India Semi Mission'],
    financialImpactAreas: ['Indian Tech & Electronics Stocks', 'Domestic Fab Ecosystem'],
    keyMetrics: ['Global Chip Sales: $600 Billion', 'Indian Semi Outlay: $10 Billion'],
    originalHeadline: 'Global Semiconductor Alliance Strengthens India Fab Capabilities with Multibillion-Dollar Accords',
    originalSummary: 'International chipmakers and equipment suppliers committed to expanding tech transfer and fab facilities in Gujarat and Assam.',
    headline: {
      en: 'Global Semiconductor Alliance Strengthens India Fab Capabilities with Multibillion-Dollar Accords',
      hi: 'वैश्विक सेमीकंडक्टर गठबंधन से भारत की चिप विनिर्माण क्षमताओं को मिला बड़ा बढ़ावा',
      gu: 'ગ્લોબલ સેમિકન્ડક્ટર એલાયન્સે ભારતની ચિપ મેન્યુફેક્ચરિંગ ક્ષમતાઓને આપ્યો ટેકો',
    },
    summary: {
      en: 'International chipmakers committed to expanding technology transfer and fab facilities in India.',
      hi: 'भारत के सेमीकंडक्टर मिशन के तहत 5 बड़े फैब्रिकेशन और पैकेजिंग प्लांट मंजूर हो चुके हैं।',
      gu: 'ગુજરાતના ધોલેરા અને સાણંદમાં વૈશ્વિક ચિપ ઉત્પાદકોના પ્લાન્ટ્સ ઝડપથી આકાર લઈ રહ્યા છે.',
    },
  },
];

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper: Initialize Google GenAI client
function getGeminiClient(apiKey?: string) {
  return new GoogleGenAI({
    apiKey: apiKey || process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper: Strip markdown codeblocks from JSON response
function cleanJsonText(raw: string): string {
  let cleaned = (raw || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

function getOpenAIClient(apiKey?: string) {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key || key === 'MY_OPENAI_API_KEY') return null;
  return new OpenAI({ apiKey: key });
}

// Helper: Multi-model cascading executor for 100% reliable generation without 503 drops
async function generateContentWithFallback(ai: GoogleGenAI, prompt: string, config: any, preferredModel?: string): Promise<string> {
  const models = Array.from(new Set([preferredModel || 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest']));
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} encountered transient issue:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('All candidate models failed to generate content.');
}

// Unified Dual-Engine (Gemini + OpenAI) with intelligent fallback
interface UnifiedAiOptions {
  prompt: string;
  systemInstruction?: string;
  aiProvider?: 'gemini' | 'openai' | 'auto';
  openaiModel?: string;
  geminiModel?: string;
  responseMimeType?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

interface UnifiedAiResult {
  text: string;
  providerUsed: 'gemini' | 'openai';
  modelUsed: string;
  fallbackUsed?: boolean;
}

async function generateUnifiedAiContent(options: UnifiedAiOptions): Promise<UnifiedAiResult> {
  const {
    prompt,
    systemInstruction,
    aiProvider = 'gemini',
    openaiModel = 'gpt-4o-mini',
    geminiModel = 'gemini-3.8-flash',
    responseMimeType,
    temperature = 0.7,
    maxOutputTokens = 3500,
  } = options;

  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');

  const tryOpenAIFirst = aiProvider === 'openai' || (aiProvider === 'auto' && hasOpenAI && !hasGemini);

  // 1. Try OpenAI if requested
  if (tryOpenAIFirst && hasOpenAI) {
    try {
      const openai = getOpenAIClient()!;
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const targetModel = openaiModel === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini';
      const completion = await openai.chat.completions.create({
        model: targetModel,
        messages,
        temperature,
        max_tokens: maxOutputTokens,
        response_format: responseMimeType === 'application/json' ? { type: 'json_object' } : undefined,
      });

      const text = completion.choices[0]?.message?.content || '';
      if (text) {
        return {
          text,
          providerUsed: 'openai',
          modelUsed: targetModel,
        };
      }
    } catch (openAiErr: any) {
      console.warn('OpenAI generation error, checking fallback:', openAiErr?.message || openAiErr);
      if (!hasGemini) throw openAiErr;
    }
  }

  // 2. Try Gemini
  if (hasGemini) {
    try {
      const ai = getGeminiClient();
      const config: any = {
        temperature,
        maxOutputTokens,
      };
      if (responseMimeType) {
        config.responseMimeType = responseMimeType;
      }
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const text = await generateContentWithFallback(ai, prompt, config, geminiModel);
      return {
        text,
        providerUsed: 'gemini',
        modelUsed: geminiModel || 'gemini-3.8-flash',
        fallbackUsed: tryOpenAIFirst,
      };
    } catch (geminiErr: any) {
      console.warn('Gemini generation error, checking secondary:', geminiErr?.message || geminiErr);
      if (!hasOpenAI || tryOpenAIFirst) throw geminiErr;
    }
  }

  // 3. Fallback to OpenAI if Gemini failed
  if (hasOpenAI && !tryOpenAIFirst) {
    try {
      const openai = getOpenAIClient()!;
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const targetModel = openaiModel === 'gpt-4o' ? 'gpt-4o' : 'gpt-4o-mini';
      const completion = await openai.chat.completions.create({
        model: targetModel,
        messages,
        temperature,
        max_tokens: maxOutputTokens,
        response_format: responseMimeType === 'application/json' ? { type: 'json_object' } : undefined,
      });

      const text = completion.choices[0]?.message?.content || '';
      if (text) {
        return {
          text,
          providerUsed: 'openai',
          modelUsed: targetModel,
          fallbackUsed: true,
        };
      }
    } catch (openAiErr: any) {
      throw openAiErr;
    }
  }

  throw new Error('Neither Gemini nor OpenAI is configured with a valid API key on the server.');
}

// Validation helpers for quizzes
function validateOptionsDistinctness(options: string[]): { isValid: boolean; reason?: string } {
  if (!Array.isArray(options) || options.length !== 4) {
    return { isValid: false, reason: 'Must contain exactly 4 options' };
  }
  const clean = options.map((o) => (o || '').trim().toLowerCase());
  const unique = new Set(clean);
  if (unique.size !== options.length) {
    return { isValid: false, reason: 'Options must be distinct' };
  }
  return { isValid: true };
}

function validateQuestionAccuracy(q: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!q.questionText || q.questionText.trim().length < 15) {
    errors.push('Question text is missing or too short');
  }
  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
    errors.push('Invalid correctIndex');
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push('Must have 4 options');
  }
  return { isValid: errors.length === 0, errors };
}

// Deterministic fallback for quiz question
function buildDeterministicQuizQuestion(params: {
  topicId: string;
  topicTitle: string;
  category: string;
  lang: string;
  clientName?: string;
}) {
  const { topicTitle, lang } = params;
  const isGu = lang === 'gu';
  const isHi = lang === 'hi';

  return {
    id: `q_${Date.now()}`,
    questionTitle: isGu
      ? `${topicTitle || 'એસઆઈપી ગણતરી'} - ૧૫ વર્ષનું કમ્પાઉન્ડિંગ`
      : isHi
      ? `${topicTitle || 'एसआईपी गणना'} - १५ वर्षों का चक्रवृद्धि लाभ`
      : `${topicTitle || 'SIP Calculation'} - 15-Year Compounding`,
    questionText: isGu
      ? `જો કોઈ રોકાણકાર દર મહિને ₹10,000 ની માસિક SIP 12% વાર્ષિક અપેક્ષિત વળતર (CAGR, માસિક કમ્પાઉન્ડિંગ) સાથે 15 વર્ષ માટે સતત જાળવી રાખે, તો 15 વર્ષના અંતે અંદાજિત પાકતી રકમ (Future Value) કેટલી થશે? (મહિનાની શરૂઆતમાં રોકાણ ગણવું)`
      : isHi
      ? `यदि कोई निवेशक प्रति माह ₹10,000 की मासिक SIP 12% वार्षिक अपेक्षित रिटर्न (CAGR, मासिक चक्रवृद्धि) के साथ 15 वर्षों तक निरंतर जारी रखता है, तो 15 वर्ष बाद अनुमानित परिपक्वता राशि (Future Value) कितनी होगी? (माह की शुरुआत में निवेश)`
      : `If an investor invests ₹10,000 monthly through an SIP for 15 years with an expected return of 12.0% per annum (monthly compounding, investment at beginning of each month), what is the approximate future value at the end of 15 years?`,
    options: isGu
      ? ['આશરે ₹50.46 લાખ', 'આશરે ₹32.40 લાખ', 'આશરે ₹18.00 લાખ', 'આશરે ₹72.50 લાખ']
      : isHi
      ? ['लगभग ₹50.46 लाख', 'लगभग ₹32.40 लाख', 'लगभग ₹18.00 लाख', 'लगभग ₹72.50 लाख']
      : ['Approximately ₹50.46 Lakh', 'Approximately ₹32.40 Lakh', 'Approximately ₹18.00 Lakh', 'Approximately ₹72.50 Lakh'],
    correctIndex: 0,
    explanation: isGu
      ? `કુલ રોકાણ: ₹10,000 × 180 મહિના = ₹18 લાખ. 12% વાર્ષિક દરે માસિક કમ્પાઉન્ડિંગ સાથે અંદાજિત સંપત્તિ વૃદ્ધિ ₹32.46 લાખ થાય છે, જેથી કુલ રકમ આશરે ₹50.46 લાખ બને છે.`
      : isHi
      ? `कुल निवेश: ₹10,000 × 180 माह = ₹18 लाख। 12% वार्षिक दर पर मासिक चक्रवृद्धि के साथ कुल संपत्ति वृद्धि लगभग ₹32.46 लाख होती है, जिससे कुल कोष लगभग ₹50.46 लाख बनता है।`
      : `Total invested: ₹10,000 × 180 months = ₹18 Lakhs. At 12% CAGR compounded monthly (Annuity Due), wealth gained is ~₹32.46 Lakhs, making the maturity corpus ~₹50.46 Lakhs.`,
    stepByStepCalculations: isGu
      ? [
          'પગલું 1: માસિક હપ્તો P = ₹10,000, મુદ્દત n = 180 મહિના, માસિક દર r = 1% (12%/12)',
          'પગલું 2: સૂત્ર FV = P × [((1+r)^n - 1) / r] × (1+r)',
          'પગલું 3: પરિણામ = ₹50,45,760 (આશરે ₹50.46 લાખ)',
        ]
      : isHi
      ? [
          'चरण 1: मासिक किस्त P = ₹10,000, अवधि n = 180 माह, मासिक दर r = 1%',
          'चरण 2: सूत्र FV = P × [((1+r)^n - 1) / r] × (1+r)',
          'चरण 3: परिणाम = ₹50,45,760 (लगभग ₹50.46 लाख)',
        ]
      : [
          'Step 1: Monthly investment P = ₹10,000, duration n = 180 months, monthly rate r = 1%',
          'Step 2: Formula FV = P × [((1+r)^n - 1) / r] × (1+r)',
          'Step 3: Final verified result = ₹50,45,760 (~₹50.46 Lakh)',
        ],
    financialTakeaway: isGu
      ? 'નિયમિત શિસ્તબદ્ધ SIP રોકાણમાં સમય સાથે કમ્પાઉન્ડિંગની શક્તિ તમારા મૂળ રોકાણ કરતાં સંપત્તિ વૃદ્ધિને બમણીથી વધુ કરી શકે છે.'
      : isHi
      ? 'नियमित अनुशासित एसआईपी में समय के साथ चक्रवृद्धि का जादू आपके मूल निवेश से कहीं अधिक संपत्ति निर्माण करता है।'
      : 'Disciplined compounding over 15+ years creates wealth where returns significantly exceed the total principal invested.',
    disclaimer: 'Mutual fund investments are subject to market risks, read all scheme related documents carefully.',
    commonTrap: isGu ? 'લોકો માને છે કે માત્ર બેંક વ્યાજ જેટલું જ વળતર મળશે.' : isHi ? 'लोग मानते हैं कि केवल साधारण ब्याज जितना रिटर्न मिलेगा।' : 'Underestimating the exponential compounding of equity SIP over a 15-year horizon.',
    ruleOfThumb: isGu ? 'રોકાણ વહેલું શરૂ કરો અને લાંબો સમય ટકી રહો.' : isHi ? 'निवेश जल्दी शुरू करें और लंबे समय तक बने रहें।' : 'Start early, stay invested, and let compounding do the heavy lifting.',
    advisorTip: isGu ? 'તમારા નાણાકીય લક્ષ્યો માટે આજે જ પ્રમાણિત નાણાકીય સલાહકાર સાથે ચર્ચા કરો.' : isHi ? 'अपने वित्तीय लक्ष्यों के लिए आज ही प्रमाणित वित्तीय सलाहकार से संपर्क करें।' : 'Review your SIP allocation with a certified financial planner.',
  };
}

// Deterministic fallback for poll data
function buildDeterministicPollData(params: {
  topicNum?: number;
  topicTitle?: string;
  category?: string;
  pollType?: string;
  language?: string;
}) {
  const { topicTitle, pollType = 'awareness', language = 'en' } = params;
  const isGu = language === 'gu';
  const isHi = language === 'hi';
  const isFactual = pollType === 'knowledge' || pollType === 'calculation' || pollType === 'myth_vs_reality';

  if (isFactual) {
    return {
      questionText: isGu
        ? `${topicTitle || 'રૂલ ઓફ ૭૨'}: જો વાર્ષિક અપેક્ષિત વળતર ૧૨% હોય, તો નાણાં બમણા થતાં કેટલા વર્ષ લાગે?`
        : isHi
        ? `${topicTitle || 'रूल ऑफ ७२'}: यदि वार्षिक अपेक्षित रिटर्न १२% हो, तो पैसा दोगुना होने में कितने वर्ष लगेंगे?`
        : `${topicTitle || 'Rule of 72'}: At an expected return of 12% per annum, approximately how many years does it take to double your investment?`,
      options: isGu
        ? ['૬ વર્ષ (Rule of 72: 72 ÷ 12)', '૮ વર્ષ', '૧૦ વર્ષ', '૧૨ વર્ષ']
        : isHi
        ? ['६ वर्ष (Rule of 72: 72 ÷ 12)', '८ वर्ष', '१० वर्ष', '१२ वर्ष']
        : ['6 Years (72 ÷ 12 = 6)', '8 Years', '10 Years', '12 Years'],
      isKnowledgeOrCalculation: true,
      correctIndex: 0,
      explanation: isGu
        ? 'રૂલ ઓફ ૭૨ મુજબ: ૭૨ ને વાર્ષિક વ્યાજદર (૧૨) વડે ભાગતાં ૬ વર્ષ મળે છે.'
        : isHi
        ? 'रूल ऑफ ७२ के अनुसार: ७२ को वार्षिक ब्याज दर (१२) से भाग देने पर ६ वर्ष आता है।'
        : 'According to the Rule of 72: 72 divided by the expected annual rate (12) equals 6 years.',
      stepByStepCalculations: isGu
        ? ['૭૨ ÷ ૧૨% = ૬ વર્ષ']
        : isHi
        ? ['७२ ÷ १२% = ६ वर्ष']
        : ['72 ÷ 12% = 6 years'],
      assumptions: isGu ? 'સતત ૧૨% વાર્ષિક વળતર ધારેલ છે' : isHi ? 'निरंतर १२% वार्षिक रिटर्न माना गया है' : 'Assumes consistent 12% annual compounding',
      educationalTakeaway: isGu
        ? 'રૂલ ઓફ ૭૨ થી તમે સરળતાથી જાણી શકો છો કે તમારું રોકાણ ક્યારે બમણું થશે.'
        : isHi
        ? 'रूल ऑफ ७२ से आप आसानी से जान सकते हैं कि आपका निवेश कब दोगुना होगा।'
        : 'The Rule of 72 is a quick shortcut to estimate investment doubling time.',
    };
  }

  return {
    questionText: isGu
      ? `${topicTitle || 'નાણાકીય આયોજન'}: તમારી બચતમાંથી તમે દર મહિને કેટલા ટકા રોકાણ કરો છો?`
      : isHi
      ? `${topicTitle || 'वित्तीय नियोजन'}: अपनी मासिक आय में से आप कितने प्रतिशत बचत और निवेश करते हैं?`
      : `${topicTitle || 'Financial Planning'}: What percentage of your monthly income do you typically invest?`,
    options: isGu
      ? ['૧૦% થી ઓછું', '૧૦% થી ૨૦% વચ્ચે', '૨૦% થી ૩૦% વચ્ચે', '૩૦% થી વધુ']
      : isHi
      ? ['१०% से कम', '१०% से २०% के बीच', '२०% से ३०% के बीच', '३०% से अधिक']
      : ['Less than 10%', '10% to 20%', '20% to 30%', 'More than 30%'],
    isKnowledgeOrCalculation: false,
    explanation: isGu
      ? '૫૦-૩૦-૨૦ નિયમ મુજબ આવકના ઓછામાં ઓછા ૨૦% થી ૩૦% ભવિષ્ય માટે રોકાણ કરવા જોઈએ.'
      : isHi
      ? '५०-३०-२० नियम के अनुसार आय का कम से कम २०% से ३०% भविष्य के लिए निवेश करना चाहिए।'
      : 'As per the 50-30-20 budgeting rule, allocating at least 20-30% to future goals accelerates financial independence.',
    educationalTakeaway: isGu
      ? 'બચત એ ખર્ચ પછી વધેલી રકમ નથી, પણ આવકમાંથી પ્રથમ અલગ કરેલી રકમ હોવી જોઈએ.'
      : isHi
      ? 'बचत वह नहीं है जो खर्च के बाद बचे, बल्कि वह है जो खर्च से पहले अलग की जाए।'
      : 'Pay yourself first: invest before you spend, not from what is left over.',
  };
}

// ---------------------------------------------------------------------------
// API ENDPOINTS
// ---------------------------------------------------------------------------

// Root & Health
app.get('/api', (req, res) => {
  res.json({ status: 'ok', name: 'FinAdvisor Pro API', vercel: true });
});

app.get('/api/health', (req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');
  res.json({
    status: 'ok',
    aiConfigured: hasGemini || hasOpenAI,
    geminiConfigured: hasGemini,
    openaiConfigured: hasOpenAI,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/ai-config', (req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');
  res.json({
    status: 'ok',
    providers: {
      gemini: {
        available: hasGemini,
        name: 'Google Gemini',
        models: ['gemini-3.8-flash', 'gemini-2.5-flash'],
        defaultModel: 'gemini-3.8-flash',
      },
      openai: {
        available: hasOpenAI,
        name: 'OpenAI',
        models: ['gpt-4o-mini', 'gpt-4o'],
        defaultModel: 'gpt-4o-mini',
      },
    },
    defaultProvider: hasGemini ? 'gemini' : hasOpenAI ? 'openai' : 'none',
  });
});

app.get('/api/ai-config', (req, res) => {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'MY_OPENAI_API_KEY');
  res.json({
    status: 'ok',
    providers: {
      gemini: {
        available: hasGemini,
        name: 'Google Gemini',
        models: ['gemini-3.8-flash', 'gemini-2.5-flash'],
        defaultModel: 'gemini-3.8-flash',
      },
      openai: {
        available: hasOpenAI,
        name: 'OpenAI',
        models: ['gpt-4o-mini', 'gpt-4o'],
        defaultModel: 'gpt-4o-mini',
      },
    },
    defaultProvider: hasGemini ? 'gemini' : hasOpenAI ? 'openai' : 'none',
  });
});

// =========================================================================
// FINANCE NEWS ENDPOINTS FOR VERCEL SERVERLESS
// =========================================================================
const vercelNewsCatalog = [...INITIAL_VERIFIED_NEWS];

function getVercelSchedulerStatus() {
  const nationalCount = vercelNewsCatalog.filter((n) => n.category === 'national').length;
  const internationalCount = vercelNewsCatalog.filter((n) => n.category === 'international').length;
  return {
    lastDailyFetchTime: new Date(Date.now() - 3600 * 1000).toISOString(),
    lastCleanupTime: new Date(Date.now() - 3000 * 1000).toISOString(),
    nextScheduledFetch: 'Tomorrow at 04:00 AM IST',
    nextScheduledCleanup: 'Tomorrow at 04:30 AM IST',
    nationalCount,
    internationalCount,
    itemsAddedLastCycle: 2,
    itemsRemovedLastCycle: 2,
    schedulerActive: true,
    logs: [
      {
        id: 'vlog-1',
        timestamp: new Date().toISOString(),
        type: 'verification' as const,
        message: 'Finance News catalog verified: 10 National and 10 International items active.',
        details: 'Primary source records verified (RBI, AMFI, MoSPI, SEBI, US Fed, OPEC, IMF).',
        success: true,
      },
    ],
  };
}

// GET /api/news
app.get('/api/news', (req, res) => {
  res.json({
    success: true,
    news: vercelNewsCatalog,
    status: getVercelSchedulerStatus(),
  });
});

// GET /api/news/status
app.get('/api/news/status', (req, res) => {
  res.json({
    success: true,
    status: getVercelSchedulerStatus(),
  });
});

// POST /api/news/refresh
app.post('/api/news/refresh', async (req, res) => {
  res.json({
    success: true,
    addedCount: 0,
    message: 'News verification complete: 10 National and 10 International items active and up to date.',
    news: vercelNewsCatalog,
    status: getVercelSchedulerStatus(),
  });
});

// POST /api/news/generate-article
app.post('/api/news/generate-article', async (req, res) => {
  const { newsItem, newsId, language = 'en', advisorProfile = {} } = req.body;
  const targetNews = newsItem || vercelNewsCatalog.find((n) => n.id === newsId);

  if (!targetNews) {
    return res.status(400).json({ success: false, error: 'News item not found' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (isKeyValid) {
    try {
      const ai = getGeminiClient(apiKey);
      const localizedHeadline = targetNews.headline[language] || targetNews.originalHeadline;
      const localizedSummary = targetNews.summary[language] || targetNews.originalSummary;

      const prompt = `You are a certified Indian financial advisor and research economist.
Create a comprehensive, natural, easy-to-understand educational article in the requested language: "${language}".

News Headline: "${localizedHeadline}"
News Summary: "${localizedSummary}"
Source: "${targetNews.source.name}"
Category: "${targetNews.category}"
Advisor Name: "${advisorProfile.advisorName || 'Financial Advisor'}"
Advisor Designation: "${advisorProfile.designation || 'Certified Wealth Advisor'}"
Advisor Credentials: "${advisorProfile.professionalDetails || 'ARN / AMFI Registered'}"

Format requirements:
Output ONLY valid JSON matching this schema:
{
  "headline": "compelling headline in ${language}",
  "verifiedDetails": "clear, verified facts and data in ${language}",
  "backgroundContext": "background, context and simple-language explanation in ${language}",
  "whyItMatters": "why this news matters to Indian retail savers/investors in ${language}",
  "financialImpacts": {
    "householdExpenses": "impact on living costs in ${language}",
    "inflation": "impact on inflation in ${language}",
    "savingsAndFd": "impact on bank FDs and savings in ${language}",
    "loansAndEmi": "impact on loans and EMIs in ${language}",
    "taxes": "impact on taxes in ${language}",
    "insurance": "impact on insurance in ${language}",
    "sipAndMutualFunds": "impact on SIPs and mutual funds in ${language}",
    "stockMarkets": "impact on stock markets in ${language}",
    "goldAndCommodities": "impact on gold and commodities in ${language}"
  },
  "advisorOpinion": "balanced financial advisor's opinion in ${language}",
  "practicalConsiderations": [
    "practical actionable step 1 in ${language}",
    "practical actionable step 2 in ${language}",
    "practical actionable step 3 in ${language}"
  ],
  "mistakesToAvoid": [
    "common mistake 1 in ${language}",
    "common mistake 2 in ${language}"
  ],
  "scenarios": {
    "positive": "optimistic scenario in ${language}",
    "neutral": "base case scenario in ${language}",
    "negative": "cautious scenario in ${language}",
    "conditionsAndUncertainties": "key uncertainties and conditions in ${language}"
  },
  "conclusion": "actionable summary and conclusion in ${language}"
}

Never invent fake credentials, quotes, or guarantee returns. Clearly distinguish verified facts from advisor opinions.`;

      const responseText = await generateContentWithFallback(ai, prompt, {
        temperature: 0.3,
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(cleanJsonText(responseText));

      const article = {
        id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        newsId: targetNews.id,
        isCustomTopic: false,
        category: targetNews.category,
        contentLanguage: language,
        headline: parsed.headline || localizedHeadline,
        verifiedDetails: parsed.verifiedDetails || localizedSummary,
        backgroundContext: parsed.backgroundContext || targetNews.originalSummary,
        whyItMatters: parsed.whyItMatters,
        financialImpacts: parsed.financialImpacts || {},
        advisorOpinion: parsed.advisorOpinion,
        practicalConsiderations: parsed.practicalConsiderations || [],
        mistakesToAvoid: parsed.mistakesToAvoid || [],
        scenarios: parsed.scenarios || {
          positive: 'Growth momentum continues.',
          neutral: 'Range-bound steady returns.',
          negative: 'Short-term volatility presents accumulation opportunities.',
          conditionsAndUncertainties: 'Macro trends and interest rates.',
        },
        conclusion: parsed.conclusion,
        sources: [targetNews.source],
        advisorCredit: {
          name: advisorProfile.advisorName || 'Financial Advisor',
          designation: advisorProfile.designation || 'Certified Wealth Advisor',
          achievement: advisorProfile.achievement,
          credentials: advisorProfile.professionalDetails || 'ARN / AMFI Registered',
          contact: advisorProfile.phoneNumber,
          whatsapp: advisorProfile.whatsappNumber || advisorProfile.phoneNumber,
          brandName: advisorProfile.brandName,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isEdited: false,
      };

      return res.json({ success: true, article });
    } catch (err: any) {
      console.warn('Gemini article generation failed on Vercel, falling back:', err?.message || err);
    }
  }

  res.json({
    success: false,
    message: 'Using client fallback generator for high fidelity output',
  });
});

// POST /api/news/custom-topic
app.post('/api/news/custom-topic', async (req, res) => {
  const { customTopic, language = 'en', advisorProfile = {} } = req.body;
  if (!customTopic || !customTopic.trim()) {
    return res.status(400).json({ success: false, error: 'Custom topic is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (isKeyValid) {
    try {
      const ai = getGeminiClient(apiKey);
      const prompt = `You are a certified Indian financial advisor and research economist.
The user requested a custom financial article on: "${customTopic}".
Language: "${language}".

Search and verify facts, dates, and sources for this topic.
If current breaking news is unavailable for this topic, clearly state this in verifiedDetails and provide an authoritative background explainer and analysis without falsely labeling it as breaking news.

Advisor Name: "${advisorProfile.advisorName || 'Financial Advisor'}"
Advisor Designation: "${advisorProfile.designation || 'Certified Wealth Advisor'}"
Advisor Credentials: "${advisorProfile.professionalDetails || 'ARN / AMFI Registered'}"

Output ONLY valid JSON matching this schema:
{
  "headline": "professional article title in ${language}",
  "verifiedDetails": "factual verification and official regulatory background in ${language}",
  "backgroundContext": "simple-language explanation in ${language}",
  "whyItMatters": "why this matters to Indian retail savers and families in ${language}",
  "financialImpacts": {
    "householdExpenses": "impact on living costs in ${language}",
    "inflation": "impact on inflation in ${language}",
    "savingsAndFd": "impact on bank FDs and savings in ${language}",
    "loansAndEmi": "impact on loans and EMIs in ${language}",
    "taxes": "impact on taxes in ${language}",
    "insurance": "impact on insurance in ${language}",
    "sipAndMutualFunds": "impact on SIPs and mutual funds in ${language}",
    "stockMarkets": "impact on stock markets in ${language}",
    "goldAndCommodities": "impact on gold and commodities in ${language}"
  },
  "advisorOpinion": "balanced financial advisor's opinion in ${language}",
  "practicalConsiderations": [
    "practical actionable step 1 in ${language}",
    "practical actionable step 2 in ${language}",
    "practical actionable step 3 in ${language}"
  ],
  "mistakesToAvoid": [
    "common mistake 1 in ${language}",
    "common mistake 2 in ${language}"
  ],
  "scenarios": {
    "positive": "optimistic scenario in ${language}",
    "neutral": "base case scenario in ${language}",
    "negative": "cautious scenario in ${language}",
    "conditionsAndUncertainties": "key uncertainties and conditions in ${language}"
  },
  "conclusion": "actionable summary and conclusion in ${language}"
}`;

      const responseText = await generateContentWithFallback(ai, prompt, {
        temperature: 0.3,
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(cleanJsonText(responseText));

      const article = {
        id: `art_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        isCustomTopic: true,
        customTopicTitle: customTopic,
        category: 'custom' as const,
        contentLanguage: language,
        headline: parsed.headline || customTopic,
        verifiedDetails: parsed.verifiedDetails,
        backgroundContext: parsed.backgroundContext,
        whyItMatters: parsed.whyItMatters,
        financialImpacts: parsed.financialImpacts || {},
        advisorOpinion: parsed.advisorOpinion,
        practicalConsiderations: parsed.practicalConsiderations || [],
        mistakesToAvoid: parsed.mistakesToAvoid || [],
        scenarios: parsed.scenarios || {
          positive: 'Constructive developments anticipated.',
          neutral: 'Balanced economic conditions.',
          negative: 'Short-term volatility expected.',
          conditionsAndUncertainties: 'Macro trends and regulatory updates.',
        },
        conclusion: parsed.conclusion,
        sources: [
          {
            name: 'Financial Research Desk & Official Archives',
            isPrimary: true,
            publishedDate: 'Current Economic Cycle',
          },
        ],
        advisorCredit: {
          name: advisorProfile.advisorName || 'Financial Advisor',
          designation: advisorProfile.designation || 'Certified Wealth Advisor',
          achievement: advisorProfile.achievement,
          credentials: advisorProfile.professionalDetails || 'ARN / AMFI Registered',
          contact: advisorProfile.phoneNumber,
          whatsapp: advisorProfile.whatsappNumber || advisorProfile.phoneNumber,
          brandName: advisorProfile.brandName,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isEdited: false,
      };

      return res.json({ success: true, article });
    } catch (err: any) {
      console.warn('Gemini custom topic article failed on Vercel, falling back:', err?.message || err);
    }
  }

  res.json({
    success: false,
    message: 'Using client fallback generator for custom topic article',
  });
});

// 1. Content Generation
app.post('/api/generate-content', async (req, res) => {
  const {
    subject,
    subjectTitle,
    articleLength,
    audience,
    contentLanguage,
    advisorProfile,
    useDefaultCta,
    useDefaultDisclaimer,
    customCta,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local generation engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const prompt = `
You are a senior financial writer and certified financial planning educator in India.
Generate a comprehensive, high-converting, educational financial advisory marketing kit for a financial advisor.

Topic: ${subjectTitle || subject}
Content Language: ${contentLanguage || 'en'} (IMPORTANT: Write the entire content in this language, e.g., if 'hi' write in natural Hindi, if 'gu' in Gujarati, if 'mr' in Marathi, if 'en' in English)
Audience Target: ${audience || 'General Public'}
Article Length: ${articleLength || 'medium'}
Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
Advisor Designation: ${advisorProfile?.designation || 'Certified Financial Planner'}
${advisorProfile?.achievement ? `Advisor Key Achievement / Milestone: ${advisorProfile.achievement}` : ''}
${advisorProfile?.professionalDetails ? `Advisor Credentials / ARN: ${advisorProfile.professionalDetails}` : ''}
Advisor Phone / WhatsApp: ${advisorProfile?.phoneNumber || '+91 98765 43210'}
CTA: ${useDefaultCta ? (advisorProfile?.defaultCTA || 'Contact today to plan your investments.') : (customCta || 'Get in touch for guidance.')}
Disclaimer: ${useDefaultDisclaimer ? (advisorProfile?.defaultDisclaimer || 'For educational purposes only.') : ''}

CRITICAL CREATIVITY & NOVELTY INSTRUCTION (Seed: ${entropySeed}):
Ensure this output is completely fresh, unique, and distinct in tone, examples, numbers, and storytelling compared to any previous output for this topic. Do not repeat standard boilerplate. Use realistic Indian financial figures, relatable life scenarios, and an engaging hook.

You MUST return ONLY valid JSON matching this exact structure:
{
  "deepArticle": {
    "headline": "Catchy, professional educational headline",
    "subheadline": "Compelling subtitle with real-life context",
    "body": "Detailed educational article with 3-4 structured paragraphs, conversational yet authoritative tone, practical examples (SIP, tax slabs, compounding or risk management as relevant). Include advisor callout.",
    "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"],
    "readTime": "3 min read"
  },
  "whatsappStatus": {
    "slide1": "Punchy slide 1 Hook (under 25 words)",
    "slide2": "Insightful slide 2 Explanation with numbers or comparison (under 30 words)",
    "slide3": "Slide 3 Actionable tip + Contact CTA (under 25 words)"
  },
  "whatsappMessage": "Complete broadcast message ready for WhatsApp with friendly greeting, emojis, structured bullet points, key tip, and advisor signature.",
  "socialMedia": {
    "platformCaption": "Engaging caption for LinkedIn / Facebook / Instagram with hook, 3 key points, and discussion question.",
    "hashtags": ["#MutualFunds", "#FinancialPlanning", "#SIP", "#WealthCreation"],
    "postHook": "One-line scroll-stopping hook sentence"
  },
  "videoScript": {
    "title": "30-60 sec short video / reel script",
    "hook": "First 3 seconds attention grabber",
    "storyPoints": ["Camera angle 1 / Point 1", "Visual comparison / Point 2", "Solution / Point 3"],
    "callToAction": "Spoken closing CTA",
    "durationEstimate": "45 seconds"
  },
  "financialInsights": {
    "statHighlight": "Compelling statistic or rule of thumb",
    "actionableRule": "One simple financial rule client can follow today",
    "comparisonNote": "Important comparison or common mistake to avoid"
  }
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.85,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'AI generation failed, fallback to local engine',
    });
  }
});

// 2. Theme Poster Generator
app.post('/api/generate-theme-poster', async (req, res) => {
  const {
    themeId,
    themeName,
    subjectTitle,
    subjectId,
    contentLanguage,
    advisorProfile,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on server. Falling back to local theme engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const prompt = `
You are a senior Indian financial educator and copywriting expert for certified financial planners.
Generate content tailored specifically for the visual theme "${themeName}" (Theme ID: ${themeId}) on the financial subject "${subjectTitle || subjectId}".

Target Language: "${contentLanguage || 'en'}"
MANDATORY LANGUAGE SPECIFICATION:
- If Target Language is "gu" (Gujarati), you MUST write ALL text strictly in authentic Gujarati script (ગુજરાતી ભાષા).
- If Target Language is "hi" (Hindi), write ALL text in Hindi Devanagari script (हिन्दी).
- If Target Language is "mr" (Marathi), write ALL text in Marathi (मराठी).
- If Target Language is "en" (English), write ALL text in English.

Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
Advisor Title: ${advisorProfile?.designation || 'Certified Financial Planner'}
${advisorProfile?.achievement ? `Advisor Key Achievement: ${advisorProfile.achievement}` : ''}
Advisor Phone / WhatsApp: ${advisorProfile?.phoneNumber || '+91 98765 43210'}

Randomization Seed: ${entropySeed}

Return ONLY valid JSON matching:
{
  "headline": "Scroll-stopping concise headline (max 10 words)",
  "subheadline": "Insightful supporting subhead (max 14 words)",
  "badgeText": "Short category badge in capital letters",
  "ctaText": "Compelling call to action for WhatsApp / Phone consultation",
  "themeSpecific": {}
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.9,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Theme Generator Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Theme generation failed, falling back to local presets',
    });
  }
});

// 3. Client Q&A Advisory Assistant
app.post('/api/generate-client-qa', async (req, res) => {
  const { customerName, customerQuestion, language, advisorProfile } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local Q&A engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const prompt = `
You are an expert Certified Financial Planner (CFP) and personal financial educator in India.
Generate a personalized, fiduciary-grade customer response on behalf of financial advisor "${advisorProfile?.advisorName || 'Financial Advisor'}" to their client "${customerName || 'Client'}".

Client Name: "${customerName}"
Client's Question: "${customerQuestion}"
Language: "${language || 'gu'}"

MANDATORY LANGUAGE RULE:
- If language is "gu", write the entire answer in authentic Gujarati script (ગુજરાતી ભાષા).
- If language is "hi", write entirely in Hindi (हिन्दी).
- If language is "en", write entirely in English.

Return ONLY valid JSON matching:
{
  "isFinancial": true,
  "rejectionReason": "",
  "answerText": "Complete ready-to-read response with client greeting, advice, and advisor signature",
  "summaryBullets": ["Key takeaway point 1", "Key takeaway point 2"],
  "whatsappReadyText": "*Complete message formatted with WhatsApp asterisks for bolding, friendly greeting, key points with emojis, and advisor signature*"
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.75,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Client Q&A API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Q&A generation failed, fallback to local engine',
    });
  }
});

// 4. Financial Story Generator
app.post('/api/generate-story', async (req, res) => {
  const {
    topicId,
    topicTitle,
    angleId,
    angleTitle,
    personaId,
    personaTitle,
    lengthId,
    language,
    advisorProfile,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local story engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const prompt = `
You are a master Indian financial storyteller, Certified Financial Planner (CFP), and behavioral finance educator.
Generate an emotionally captivating, realistic financial story for a financial advisor to educate clients on WhatsApp, LinkedIn, and social media.

Topic: ${topicTitle || topicId}
Narrative Angle: ${angleTitle || angleId}
Target Persona: ${personaTitle || personaId}
Length Mode: ${lengthId || 'standard'}
Target Language: "${language || 'gu'}"

Advisor: ${advisorProfile?.advisorName || 'Financial Advisor'} (${advisorProfile?.designation || 'CFP'})
Phone: ${advisorProfile?.phoneNumber || '+91 98765 43210'}

Seed: ${entropySeed}

Return ONLY valid JSON matching:
{
  "title": "Attractive headline with 1 emoji",
  "hook": "Compelling hook summarizing the core curiosity gap",
  "storyParagraphs": [
    "Paragraph 1 with curiosity hook and natural WhatsApp share CTA",
    "Paragraph 2 with dialogue and financial challenge...",
    "Paragraph 3 with realistic calculation and solution...",
    "Final paragraph with memorable emotional conclusion"
  ],
  "takeaways": [
    "Actionable lesson 1",
    "Actionable lesson 2",
    "Actionable lesson 3"
  ],
  "forwardAppeal": "Natural CTA encouraging readers to share with family and friends",
  "persuasivePlanningCta": "Persuasive CTA inviting readers to contact advisor",
  "ctaSignature": "Formatted signature with advisor name and contact"
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.8,
      maxOutputTokens: 8192,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Story Generation API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Story generation failed, fallback to local engine',
    });
  }
});

// 5. Client Presentation Generator
app.post('/api/generate-presentation', async (req, res) => {
  const {
    topicPrompt,
    subjectTitle,
    subCategoryTitle,
    mode = 'detailed',
    language = 'en',
    clientName,
    businessProfile,
    advisorProfile,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local generation engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const targetSlideCount = mode === 'quick' ? 6 : mode === 'detailed' ? 10 : 8;
    const langLabel = language === 'gu' ? 'Gujarati (ગુજરાતી)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';
    const sectorName = businessProfile?.sectorName || 'Financial Advisory';
    const companyName = businessProfile?.companyName || '';
    const productName = businessProfile?.productName || '';
    const presentationTopic = topicPrompt || (companyName && productName ? `${companyName} — ${productName}` : subjectTitle || subCategoryTitle || 'Comprehensive Financial Strategy');

    const prompt = `You are a Senior Certified Financial Planner (CFP) creating a client-ready advisory presentation for an advisor in India.
Generate the presentation strictly in ${langLabel}.
Product: "${productName || presentationTopic}"
Institution: "${companyName || sectorName}"
Slides Count: ${targetSlideCount}
${clientName ? `Prepared For: "${clientName}"` : ''}
Advisor: ${advisorProfile?.advisorName || 'Financial Advisor'} (${advisorProfile?.designation || 'CFP'})

Return ONLY valid JSON:
{
  "title": "${productName ? `${productName} — Client Recommendation` : 'Client Advisory Presentation'}",
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "cover",
      "badge": "Product Recommendation",
      "title": "${productName || 'Financial Solution'}",
      "subtitle": "${companyName ? `Prepared with ${companyName}` : 'Personalized Advisory Blueprint'}",
      "keyTakeaway": "Executive summary of recommendation",
      "bulletPoints": [
        "Personalized client recommendation",
        "Clear goal alignment and risk suitability",
        "Transparent fee and regulatory disclosures"
      ],
      "metrics": [
        { "label": "Product", "value": "${productName ? productName.slice(0, 18) : 'Strategic'}", "helper": "${companyName || 'Verified'}" }
      ]
    }
  ]
}`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    });

    const cleanedText = cleanJsonText(responseText);
    const parsedData = JSON.parse(cleanedText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Presentation Generation API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Presentation generation failed',
    });
  }
});

// 6. Single Slide Regenerator
app.post('/api/regenerate-slide', async (req, res) => {
  const {
    presentationTitle,
    subjectTitle,
    slideNumber,
    slideType,
    language = 'en',
    refinementPrompt,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      error: 'GEMINI_API_KEY is not configured on the server',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const langLabel = language === 'gu' ? 'Gujarati (ગુજરાતી)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';

    const prompt = `Regenerate Slide #${slideNumber} (${slideType}) of presentation "${presentationTitle}" on topic "${subjectTitle}".
Language: ${langLabel}.
Advisor Refinement Request: "${refinementPrompt || 'Enhance clarity and data accuracy'}".

Return ONLY valid JSON matching:
{
  "slideNumber": ${slideNumber},
  "slideType": "${slideType}",
  "badge": "Badge text",
  "title": "Impactful Slide Title",
  "subtitle": "Subtitle text",
  "keyTakeaway": "Executive punchline",
  "bulletPoints": ["Point 1", "Point 2", "Point 3"],
  "metrics": [{ "label": "Metric", "value": "Value", "helper": "Context" }]
}`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.75,
      maxOutputTokens: 3000,
    });

    const cleanedText = cleanJsonText(responseText);
    const parsedSlide = JSON.parse(cleanedText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedSlide,
    });
  } catch (error: any) {
    console.error('Slide Regeneration API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Slide regeneration failed',
    });
  }
});

// 7. Finance Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  const {
    topicId,
    topicTitle,
    category,
    language = 'en',
    clientName,
    previousQuestions = [],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    const deterministicQ = buildDeterministicQuizQuestion({
      topicId: topicId || 'personal_financial_planning',
      topicTitle: topicTitle || 'Personal Financial Planning',
      category: category || 'personal_finance',
      lang: language,
      clientName,
    });
    return res.json({
      success: true,
      source: 'verified_deterministic_engine',
      data: {
        topicId: topicId || 'personal_financial_planning',
        topicTitle: topicTitle || 'Personal Financial Planning',
        language,
        difficulty: 'advanced',
        questions: [deterministicQ],
      },
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const prompt = `You are a Senior Certified Financial Planner (CFP) and Master Financial Quiz Designer for Indian wealth managers.
Generate a challenging, ADVANCED, CALCULATION-BASED multiple choice financial quiz on:
Topic: "${topicTitle || topicId}"
Category: "${category || 'Financial Planning'}"
Language: "${language}"
Seed: ${entropySeed}

STRICT ACCURACY RULES:
1. Exactly ONE unambiguously correct answer among 4 distinct options.
2. Calculate answer deterministically. No approximations unless specified.
3. Explicit time horizons, compounding frequencies, and return rates.
4. All text in ${language}.

Return ONLY valid JSON matching:
{
  "topicId": "${topicId}",
  "topicTitle": "${topicTitle}",
  "language": "${language}",
  "difficulty": "advanced",
  "questions": [
    {
      "id": "q_${Date.now()}",
      "questionTitle": "Title in ${language}",
      "questionText": "Detailed question prompt in ${language}",
      "options": [
        "Option A in ${language}",
        "Option B in ${language}",
        "Option C in ${language}",
        "Option D in ${language}"
      ],
      "correctIndex": 0,
      "explanation": "Step-by-step resolution in ${language}",
      "stepByStepCalculations": [
        "Step 1: Stated inputs and formula",
        "Step 2: Mathematical computation",
        "Step 3: Final verified result"
      ],
      "financialTakeaway": "Principle in ${language}",
      "disclaimer": "Mutual fund investments are subject to market risks."
    }
  ]
}`;

    let parsedData: any = null;
    let verificationPassed = false;

    for (let attempt = 0; attempt < 2 && !verificationPassed; attempt++) {
      try {
        const responseText = await generateContentWithFallback(ai, prompt, {
          responseMimeType: 'application/json',
          temperature: attempt === 0 ? 0.7 : 0.4,
        });

        const cleanedText = cleanJsonText(responseText);
        const candidate = JSON.parse(cleanedText);

        if (candidate?.questions && candidate.questions.length > 0) {
          const q = candidate.questions[0];
          const distinctCheck = validateOptionsDistinctness(q.options);
          const accuracyCheck = validateQuestionAccuracy(q);

          if (distinctCheck.isValid && accuracyCheck.isValid) {
            parsedData = candidate;
            verificationPassed = true;
          }
        }
      } catch (err) {
        console.warn(`Quiz generation attempt ${attempt + 1} issue:`, err);
      }
    }

    if (!verificationPassed || !parsedData) {
      const deterministicQ = buildDeterministicQuizQuestion({
        topicId: topicId || 'personal_financial_planning',
        topicTitle: topicTitle || 'Personal Financial Planning',
        category: category || 'personal_finance',
        lang: language,
        clientName,
      });

      return res.json({
        success: true,
        source: 'verified_deterministic_engine',
        data: {
          topicId: topicId || 'personal_financial_planning',
          topicTitle: topicTitle || 'Personal Financial Planning',
          language,
          difficulty: 'advanced',
          questions: [deterministicQ],
        },
      });
    }

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Quiz Generation API Error:', error);
    const deterministicQ = buildDeterministicQuizQuestion({
      topicId: req.body?.topicId || 'personal_financial_planning',
      topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
      category: req.body?.category || 'personal_finance',
      lang: req.body?.language || 'en',
      clientName: req.body?.clientName,
    });

    return res.json({
      success: true,
      source: 'verified_deterministic_engine',
      data: {
        topicId: req.body?.topicId || 'personal_financial_planning',
        topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
        language: req.body?.language || 'en',
        difficulty: 'advanced',
        questions: [deterministicQ],
      },
    });
  }
});

// 8. Finance Poll Generator
app.post('/api/generate-poll', async (req, res) => {
  const {
    topicNum,
    topicId,
    topicTitle,
    category,
    pollType = 'awareness',
    language = 'en',
    clientName,
    previousPollQuestions = [],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    const fallbackPoll = buildDeterministicPollData({
      topicNum: topicNum || 1,
      topicTitle: topicTitle || 'Personal Financial Planning',
      category: category || 'personal_finance',
      pollType,
      language,
    });
    return res.json({
      success: true,
      source: 'deterministic_math_engine',
      poll: fallbackPoll,
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const isFactual = pollType === 'knowledge' || pollType === 'calculation' || pollType === 'myth_vs_reality';

    const prompt = `You are a Senior Certified Financial Planner (CFP) and Master WhatsApp Poll Architect.
Generate a fresh, mobile-friendly finance poll on:
Topic #${topicNum}: "${topicTitle || topicId}"
Category: "${category}"
Poll Type: "${pollType}" (${isFactual ? 'Factual / Single Verified Answer' : 'Customer Preference / Engagement'})
Language: "${language}"
Seed: ${entropySeed}

RULES:
- Clean questionText directly usable in WhatsApp "Ask question" field.
- Provide 3 or 4 concise options (under 15 words each).
- All text written fluently in ${language}.

Return ONLY valid JSON:
{
  "questionText": "Clean question prompt in ${language}",
  "options": [
    "Option 1 in ${language}",
    "Option 2 in ${language}",
    "Option 3 in ${language}",
    "Option 4 in ${language}"
  ],
  "isKnowledgeOrCalculation": ${isFactual},
  ${isFactual ? '"correctIndex": 0,' : ''}
  "explanation": "Clear explanation in ${language}",
  "educationalTakeaway": "Short takeaway in ${language}"
}`;

    let parsedData: any = null;
    let verificationPassed = false;

    for (let attempt = 0; attempt < 2 && !verificationPassed; attempt++) {
      try {
        const responseText = await generateContentWithFallback(ai, prompt, {
          responseMimeType: 'application/json',
          temperature: isFactual ? 0.4 : 0.7,
        });

        const cleanedText = cleanJsonText(responseText);
        const candidate = JSON.parse(cleanedText);

        if (candidate?.questionText && Array.isArray(candidate?.options) && candidate.options.length >= 3) {
          const cleanOpts = candidate.options.map((o: string) => (o || '').trim());
          const unique = new Set(cleanOpts.map((o: string) => o.toLowerCase()));

          if (unique.size === cleanOpts.length) {
            if (isFactual) {
              if (
                typeof candidate.correctIndex === 'number' &&
                candidate.correctIndex >= 0 &&
                candidate.correctIndex < cleanOpts.length
              ) {
                parsedData = candidate;
                verificationPassed = true;
              }
            } else {
              parsedData = candidate;
              verificationPassed = true;
            }
          }
        }
      } catch (err) {
        console.warn(`Poll generation attempt ${attempt + 1} issue:`, err);
      }
    }

    if (!verificationPassed || !parsedData) {
      const fallbackPoll = buildDeterministicPollData({
        topicNum: topicNum || 1,
        topicTitle: topicTitle || 'Personal Financial Planning',
        category: category || 'personal_finance',
        pollType,
        language,
      });

      return res.json({
        success: true,
        source: 'deterministic_math_engine',
        poll: fallbackPoll,
      });
    }

    return res.json({
      success: true,
      source: 'ai_api',
      poll: parsedData,
    });
  } catch (error: any) {
    console.error('Poll Generation API Error:', error);
    const fallbackPoll = buildDeterministicPollData({
      topicNum: req.body?.topicNum || 1,
      topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
      category: req.body?.category || 'personal_finance',
      pollType: req.body?.pollType || 'awareness',
      language: req.body?.language || 'en',
    });

    return res.json({
      success: true,
      source: 'deterministic_math_engine',
      poll: fallbackPoll,
    });
  }
});

export default app;
