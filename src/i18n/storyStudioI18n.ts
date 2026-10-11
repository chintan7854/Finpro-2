import { LanguageCode } from '../types';
import {
  StoryFinancialTopicId,
  StoryAngleId,
  StoryPersonaId,
  StoryLengthId,
  StoryCtaStrategyId,
  StoryPillarConfig,
  StoryAngleConfig,
  StoryPersonaConfig,
  StoryLengthConfig,
  StoryCtaConfig,
} from '../types/storyStudio';

export const STORY_TOPICS_METADATA: StoryPillarConfig[] = [
  { id: 'sip_wealth', category: 'wealth', icon: 'TrendingUp' },
  { id: 'step_up_sip', category: 'wealth', icon: 'Zap' },
  { id: 'stocks_vs_mf', category: 'wealth', icon: 'BarChart3' },
  { id: 'gold_vs_equity', category: 'wealth', icon: 'Coins' },
  { id: 'fd_vs_inflation', category: 'wealth', icon: 'Flame' },
  { id: 'real_estate_reits', category: 'wealth', icon: 'Building' },
  { id: 'sgb_digital_gold', category: 'wealth', icon: 'Gem' },
  { id: 'asset_allocation', category: 'wealth', icon: 'PieChart' },
  { id: 'term_insurance', category: 'protection', icon: 'ShieldCheck' },
  { id: 'health_insurance', category: 'protection', icon: 'HeartPulse' },
  { id: 'super_topup', category: 'protection', icon: 'ShieldAlert' },
  { id: 'emergency_fund', category: 'protection', icon: 'LifeBuoy' },
  { id: 'endowment_reality', category: 'protection', icon: 'Scale' },
  { id: 'personal_accident', category: 'protection', icon: 'Activity' },
  { id: 'child_education', category: 'retirement', icon: 'GraduationCap' },
  { id: 'daughter_future', category: 'retirement', icon: 'Sparkles' },
  { id: 'retirement_planning', category: 'retirement', icon: 'Sunset' },
  { id: 'swp_income', category: 'retirement', icon: 'Wallet' },
  { id: 'nps_scheme', category: 'retirement', icon: 'Landmark' },
  { id: 'post_office_vs_mf', category: 'retirement', icon: 'Mailbox' },
  { id: 'senior_citizen', category: 'retirement', icon: 'Users' },
  { id: 'home_loan_prepay', category: 'debt', icon: 'Home' },
  { id: 'credit_card_trap', category: 'debt', icon: 'CreditCard' },
  { id: 'debt_freedom', category: 'debt', icon: 'Key' },
  { id: 'cibil_score', category: 'debt', icon: 'Gauge' },
  { id: 'budgeting_rule', category: 'debt', icon: 'Calculator' },
  { id: 'lifestyle_inflation', category: 'debt', icon: 'ShoppingBag' },
  { id: 'elss_tax', category: 'tax_estate', icon: 'Receipt' },
  { id: 'capital_gains', category: 'tax_estate', icon: 'FileText' },
  { id: 'will_nomination', category: 'tax_estate', icon: 'ScrollText' },
];

export const STORY_ANGLES_METADATA: StoryAngleConfig[] = [
  { id: 'reality_check', icon: 'Eye' },
  { id: 'inspirational', icon: 'Trophy' },
  { id: 'cost_of_delay', icon: 'ClockAlert' },
  { id: 'duo_journey', icon: 'GitCompare' },
  { id: 'family_bond', icon: 'HeartHandshake' },
];

export const STORY_PERSONAS_METADATA: StoryPersonaConfig[] = [
  { id: 'young_pros', icon: 'Briefcase', ageRange: '22-32 Yrs' },
  { id: 'parents', icon: 'Baby', ageRange: '30-45 Yrs' },
  { id: 'pre_retirees', icon: 'UserCheck', ageRange: '45-58 Yrs' },
  { id: 'business_owners', icon: 'Store', ageRange: '30-55 Yrs' },
  { id: 'women', icon: 'Heart', ageRange: '25-50 Yrs' },
];

export const STORY_LENGTHS_METADATA: StoryLengthConfig[] = [
  { id: 'short', wordCount: '~120 Words', badge: 'Quick Read' },
  { id: 'standard', wordCount: '~240 Words', badge: 'Viral Balance' },
  { id: 'deep', wordCount: '~380 Words', badge: 'High Authority' },
];

export const STORY_CTAS_METADATA: StoryCtaConfig[] = [
  { id: 'viral_forward', icon: 'Share2' },
  { id: 'portfolio_audit', icon: 'CheckCircle2' },
  { id: 'goal_consultation', icon: 'MessageCircle' },
];

export interface StoryStudioTranslations {
  moduleBadge: string;
  moduleTitle: string;
  moduleDescription: string;
  viewSavedStories: string;
  sectionPillar: string;
  sectionPillarDesc: string;
  searchPillarPlaceholder: string;
  allCategories: string;
  catWealth: string;
  catProtection: string;
  catRetirement: string;
  catDebt: string;
  catTaxEstate: string;
  clearFilters: string;
  sectionAngle: string;
  sectionAngleDesc: string;
  sectionPersona: string;
  sectionPersonaDesc: string;
  sectionLength: string;
  sectionLengthDesc: string;
  sectionCta: string;
  sectionCtaDesc: string;
  advisorSignatureNotice: string;
  generatingButton: string;
  generateButton: string;
  previewBadge: string;
  wordCountLabel: string;
  formattedPreviewTab: string;
  plainTextTab: string;
  shareWhatsApp: string;
  copyText: string;
  copiedSuccess: string;
  saveToLibrary: string;
  alreadySaved: string;
  savedLibraryTitle: string;
  noSavedStories: string;
  topics: Record<StoryFinancialTopicId, { title: string; subtitle: string }>;
  angles: Record<StoryAngleId, { title: string; desc: string }>;
  personas: Record<StoryPersonaId, { title: string; ageRange: string; desc: string }>;
  lengths: Record<StoryLengthId, { title: string; words: string; desc: string }>;
  ctas: Record<StoryCtaStrategyId, { title: string; hook: string }>;
}

const ENGLISH_TRANSLATIONS: StoryStudioTranslations = {
  moduleBadge: 'Viral WhatsApp Story Studio',
  moduleTitle: 'Story Studio: High-Converting Financial Tales',
  moduleDescription: 'Generate deeply engaging, relatable financial storytelling scripts crafted to be forwarded in family WhatsApp groups, LinkedIn, and client broadcast lists.',
  viewSavedStories: 'Saved Stories',
  sectionPillar: 'Select Financial Pillar (30 Core Topics)',
  sectionPillarDesc: 'Choose the core subject your story will explain through emotional storytelling.',
  searchPillarPlaceholder: 'Search topics (e.g., SIP, term insurance, delay)...',
  allCategories: 'All Topics',
  catWealth: 'Wealth & Growth',
  catProtection: 'Protection & Shield',
  catRetirement: 'Retirement & Goals',
  catDebt: 'Debt & Cashflow',
  catTaxEstate: 'Tax & Estate',
  clearFilters: 'Clear search',
  sectionAngle: 'Narrative Angle & Emotional Hook',
  sectionAngleDesc: 'The psychological framing that commands client attention from the first sentence.',
  sectionPersona: 'Target Audience Persona',
  sectionPersonaDesc: 'Tailors characters, relatable expenses, and real-life context.',
  sectionLength: 'Story Length & Depth',
  sectionLengthDesc: 'Controls word count and reading time for different broadcast channels.',
  sectionCta: 'Call-To-Action (CTA) Strategy',
  sectionCtaDesc: 'Determines what action the reader is prompted to take upon finishing.',
  advisorSignatureNotice: 'Your verified advisor branding, ARN/designation, and direct WhatsApp link are automatically embedded.',
  generatingButton: 'Crafting Viral Story...',
  generateButton: 'Generate Viral Story',
  previewBadge: 'Ready to Broadcast',
  wordCountLabel: 'Word Count',
  formattedPreviewTab: 'WhatsApp Preview',
  plainTextTab: 'Clean Text',
  shareWhatsApp: 'Share on WhatsApp',
  copyText: 'Copy Text',
  copiedSuccess: 'Copied to Clipboard!',
  saveToLibrary: 'Save to My Content',
  alreadySaved: 'Saved in Library',
  savedLibraryTitle: 'Saved Story Library',
  noSavedStories: 'No saved stories yet. Generate your first viral story above!',
  topics: {
    sip_wealth: { title: 'SIP & Compounding', subtitle: 'How small regular investments create immense wealth' },
    step_up_sip: { title: 'Step-Up SIP Accelerator', subtitle: 'Doubling corpus by increasing SIP with salary hikes' },
    stocks_vs_mf: { title: 'Direct Stocks vs Mutual Funds', subtitle: 'Why active trading loses vs disciplined asset allocation' },
    gold_vs_equity: { title: 'Physical Gold vs Equity', subtitle: 'Locker charges & making losses vs wealth multiplication' },
    fd_vs_inflation: { title: 'FD vs Silent Inflation', subtitle: 'Why bank FD is guaranteed slow loss of purchasing power' },
    real_estate_reits: { title: 'Real Estate vs Liquid Assets', subtitle: 'Illiquid EMIs and maintenance vs modern diversification' },
    sgb_digital_gold: { title: 'Sovereign Gold Bond & ETF', subtitle: 'Earning 2.5% bonus interest with zero making charges' },
    asset_allocation: { title: 'Asset Allocation Magic', subtitle: 'The secret formula that prevents market crash panic' },
    term_insurance: { title: 'Pure Term Insurance', subtitle: 'Securing family lifestyle for ₹1-2 Crore at small premium' },
    health_insurance: { title: 'Comprehensive Health Cover', subtitle: 'Why 1 hospital bill can wipe out 10 years of savings' },
    super_topup: { title: 'Super Top-Up Insurance', subtitle: 'Getting ₹25-50 Lakh cover at 70% cheaper cost' },
    emergency_fund: { title: '6-Month Emergency Cushion', subtitle: 'Shielding investments from job loss or sudden crisis' },
    endowment_reality: { title: 'Endowment & Moneyback Truth', subtitle: 'Low 4-5% return policies vs pure term + SIP combination' },
    personal_accident: { title: 'Personal Accident & Disability', subtitle: 'Protection against permanent income loss' },
    child_education: { title: 'Child Higher Education Fund', subtitle: 'Beating 10% education inflation for foreign degrees' },
    daughter_future: { title: 'Daughter Career & Future', subtitle: 'Building an unconditional wealth cushion' },
    retirement_planning: { title: 'Early Retirement Freedom', subtitle: 'Living comfortably without relying on children or pension' },
    swp_income: { title: 'SWP Monthly Pension', subtitle: 'Tax-efficient regular income that outlives you' },
    nps_scheme: { title: 'NPS National Pension System', subtitle: 'Extra ₹50,000 tax deduction + low-cost equity pension' },
    post_office_vs_mf: { title: 'Post Office Schemes vs MF', subtitle: 'Comparing safe fixed interest with growth assets' },
    senior_citizen: { title: 'Senior Citizen Wealth Safety', subtitle: 'Balancing steady regular cashflow with capital safety' },
    home_loan_prepay: { title: 'Home Loan Prepayment vs SIP', subtitle: 'Should you clear home loan early or invest in SIP?' },
    credit_card_trap: { title: 'Credit Card Minimum Due Trap', subtitle: 'How 42% annual interest quietly destroys young earners' },
    debt_freedom: { title: 'Debt Snowball to Freedom', subtitle: 'Systematic roadmap to becoming completely debt-free' },
    cibil_score: { title: 'CIBIL Score Mastery', subtitle: 'How 750+ score saves lakhs in loan interest' },
    budgeting_rule: { title: '50-30-20 Smart Budgeting', subtitle: 'Simple cashflow rule that works without sacrificing joy' },
    lifestyle_inflation: { title: 'Lifestyle Inflation Trap', subtitle: 'Why earning ₹2 Lakhs still leaves families broke' },
    elss_tax: { title: 'ELSS Tax Saving Mutual Funds', subtitle: 'Save ₹46,800 under 80C with shortest 3-year lock-in' },
    capital_gains: { title: 'New Capital Gains Rules', subtitle: 'Tax harvesting & smart withdrawal optimization' },
    will_nomination: { title: 'Will, Nomination & Succession', subtitle: 'Ensuring your wealth reaches loved ones without court battles' },
  },
  angles: {
    reality_check: { title: 'Shocking Reality Check', desc: 'Stark mathematical truths that wake clients up from complacency' },
    inspirational: { title: 'Inspirational Hero Story', desc: 'An inspiring turnaround journey from struggle to financial freedom' },
    cost_of_delay: { title: 'The Brutal Cost of Delay', desc: 'Proof that waiting 3-5 years costs lakhs in lost compounding' },
    duo_journey: { title: 'Ramesh vs Suresh Comparison', desc: 'Two friends with equal income taking different financial paths' },
    family_bond: { title: 'Family Love & Protection', desc: 'Emotional responsibility toward children, spouse, and parents' },
  },
  personas: {
    young_pros: { title: 'Young Professionals & IT', ageRange: '22-32 Yrs', desc: 'First jobbers, techies, dealing with gadgets & lifestyle inflation' },
    parents: { title: 'Responsible Parents', ageRange: '30-45 Yrs', desc: 'Focusing on child school fees, home loan EMI, family safety' },
    pre_retirees: { title: 'Pre-Retirees & Late 40s', ageRange: '45-58 Yrs', desc: 'Urgency for retirement corpus, healthcare, and daughter marriage' },
    business_owners: { title: 'Businessmen & Traders', ageRange: '30-55 Yrs', desc: 'Irregular income, working capital, keeping personal wealth separate' },
    women: { title: 'Women Investors & Homemakers', ageRange: '25-50 Yrs', desc: 'Financial independence, gold alternatives, household security' },
  },
  lengths: {
    short: { title: 'WhatsApp Status / Reel Script', words: '~120 Words', desc: 'Crisp 45-second read, perfect for status slides or fast skimming' },
    standard: { title: 'Standard Viral Broadcast', words: '~240 Words', desc: 'Optimal for WhatsApp groups, broadcast lists, and Facebook' },
    deep: { title: 'Deep Authority Article', words: '~380 Words', desc: 'High-credibility educational newsletter for LinkedIn & client emails' },
  },
  ctas: {
    viral_forward: { title: 'Viral Group Forward', hook: 'Forward this story to 3 family members or friends who need this today.' },
    portfolio_audit: { title: 'Free Portfolio Audit', hook: 'Send your existing policy/portfolio for a 100% confidential checkup.' },
    goal_consultation: { title: 'Personal Goal Roadmap', hook: 'Message me on WhatsApp to build your personalized milestone plan.' },
  },
};

const GUJARATI_TRANSLATIONS: StoryStudioTranslations = {
  ...ENGLISH_TRANSLATIONS,
  moduleBadge: 'વાયરલ વોટ્સએપ સ્ટોરી સ્ટુડિયો',
  moduleTitle: 'સ્ટોરી સ્ટુડિયો: અસરકારક નાણાકીય વાર્તાઓ',
  moduleDescription: 'પરિવારના વોટ્સએપ ગ્રૂપ, બ્રોડકાસ્ટ લિસ્ટ અને સોશિયલ મીડિયા પર વાયરલ થઈ શકે તેવી દિલચસ્પ ગુજરાતી નાણાકીય વાર્તાઓ બનાવો.',
  viewSavedStories: 'સેવ કરેલી વાર્તાઓ',
  sectionPillar: 'મુખ્ય નાણાકીય વિષય પસંદ કરો (૩૦ વિષયો)',
  sectionPillarDesc: 'તમારી વાર્તા કયા વિષય પર આધારિત હોવી જોઈએ તે પસંદ કરો.',
  searchPillarPlaceholder: 'વિષય શોધો (દા.ત. SIP, ટર્મ પ્લાન, વિલંબ)...',
  allCategories: 'બધા વિષયો',
  catWealth: 'સંપત્તિ સર્જન',
  catProtection: 'પરિવાર સુરક્ષા',
  catRetirement: 'નિવૃત્તિ અને લક્ષ્યો',
  catDebt: 'દેવું અને બજેટ',
  catTaxEstate: 'ટેક્સ અને વારસો',
  clearFilters: 'ફિલ્ટર હટાવો',
  sectionAngle: 'વાર્તાનો દ્રષ્ટિકોણ અને ઇમોશનલ હૂક',
  sectionAngleDesc: 'ગ્રાહકનું ધ્યાન તરત ખેંચી લે તેવો મનોવૈજ્ઞાનિક એંગલ પસંદ કરો.',
  sectionPersona: 'લક્ષ્ય વાચક (ઑડિયન્સ)',
  sectionPersonaDesc: 'પાત્રો અને વાર્તાનું વાતાવરણ વાચક પ્રમાણે ગોઠવાશે.',
  sectionLength: 'વાર્તાની લંબાઈ',
  sectionLengthDesc: 'વાંચવાના સમય અને માધ્યમ મુજબ સાઈઝ નક્કી કરો.',
  sectionCta: 'કોલ-ટુ-એક્શન (CTA)',
  sectionCtaDesc: 'વાર્તા વાંચ્યા પછી વાચક કયું પગલું ભરે તે નક્કી કરો.',
  advisorSignatureNotice: 'તમારું નામ, એડવાઇઝર વિગત અને સીધો વોટ્સએપ સંપર્ક આપમેળે જોડાઈ જશે.',
  generatingButton: 'વાર્તા તૈયાર થઈ રહી છે...',
  generateButton: 'વાયરલ વાર્તા બનાવો',
  previewBadge: 'વોટ્સએપ તૈયાર',
  wordCountLabel: 'શબ્દ સંખ્યા',
  formattedPreviewTab: 'વોટ્સએપ પ્રિવ્યુ',
  plainTextTab: 'પ્લેન ટેક્સ્ટ',
  shareWhatsApp: 'વોટ્સએપ પર શેર કરો',
  copyText: 'ટેક્સ્ટ કોપી કરો',
  copiedSuccess: 'કોપી થઈ ગયું!',
  saveToLibrary: 'લાઈબ્રેરીમાં સેવ કરો',
  alreadySaved: 'સેવ કરેલું છે',
  savedLibraryTitle: 'સેવ કરેલી વાર્તાઓ',
  noSavedStories: 'હજુ કોઈ વાર્તા સેવ નથી કરી. ઉપરથી નવી વાર્તા બનાવો!',
  topics: {
    sip_wealth: { title: 'SIP અને ચક્રવૃદ્ધિ વ્યાજ', subtitle: 'નાની નિયમિત બચત કરોડોનું ભંડોળ કેવી રીતે બનાવે છે' },
    step_up_sip: { title: 'Step-Up SIP ની તાકાત', subtitle: 'દર વર્ષે ૧૦% SIP વધારવાથી સંપત્તિ બમણી થાય છે' },
    stocks_vs_mf: { title: 'ડાયરેક્ટ શેર vs મ્યુચ્યુઅલ ફંડ', subtitle: 'રોજ ટ્રેડિંગનું જોખમ vs શિસ્તબદ્ધ સંપત્તિ ફાળવણી' },
    gold_vs_equity: { title: 'સોનું vs ઇક્વિટી રોકાણ', subtitle: 'ઘરેણાંના ઘડામણ ખર્ચ vs લાંબા ગાળાની સાચી સંપત્તિ' },
    fd_vs_inflation: { title: 'બેંક FD vs મોંઘવારી', subtitle: 'FD માં પૈસા રાખવાથી ખરીદશક્તિ ધીમે ધીમે કેમ ઘટે છે' },
    real_estate_reits: { title: 'રિયલ એસ્ટેટ vs લિક્વિડ ફંડ્સ', subtitle: 'લોનના મોંઘા હપ્તા vs આસાનીથી રોકડ થઈ શકે તેવું રોકાણ' },
    sgb_digital_gold: { title: 'સોવરિન ગોલ્ડ બોન્ડ (SGB)', subtitle: 'ઘડામણ ખર્ચ વગર સોનામાં ૨.૫% વધારાનું વાર્ષિક વ્યાજ' },
    asset_allocation: { title: 'એસેટ એલોકેશનનો જાદુ', subtitle: 'માર્કેટમાં કડાકો આવે ત્યારે પણ મનની શાંતિ જાળવવાનો નિયમ' },
    term_insurance: { title: 'પ્યોર ટર્મ ઇન્સ્યોરન્સ', subtitle: 'માત્ર થોડા પ્રીમિયમમાં પરિવાર માટે ₹૧ કરોડનું કવચ' },
    health_insurance: { title: 'પરિવાર માટે હેલ્થ ઇન્સ્યોરન્સ', subtitle: 'એક હોસ્પિટલ બિલ ૧૦ વર્ષની બચત કેવી રીતે ધોઈ નાખે છે' },
    super_topup: { title: 'સુપર ટોપ-અપ પોલિસી', subtitle: '૭૦% સસ્તા ખર્ચે ₹૨૫-૫૦ લાખનું મોટું હેલ્થ કવર મેળવો' },
    emergency_fund: { title: '૬ મહિનાનું ઇમરજન્સી ફંડ', subtitle: 'અચાનક સંકટ કે નોકરી જવાની સ્થિતિમાં પરિવારની ઢાલ' },
    endowment_reality: { title: 'એન્ડોવમેન્ટ પોલિસીની વાસ્તવિકતા', subtitle: '૪-૫% વળતર આપતી વીમા પોલિસી vs ટર્મ પ્લાન + SIP' },
    personal_accident: { title: 'અકસ્માત અને વિકલાંગતા કવર', subtitle: 'કમાતી વ્યક્તિની આવક અટકી જાય ત્યારે પરિવારનું રક્ષણ' },
    child_education: { title: 'બાળકોનું ઉચ્ચ શિક્ષણ આયોજન', subtitle: '૧૦% શિક્ષણ મોંઘવારીને પહોંચી વળવા સમયસર રોકાણ' },
    daughter_future: { title: 'દીકરીનું ભવિષ્ય અને આત્મનિર્ભરતા', subtitle: 'દીકરી માટે આર્થિક આઝાદીનું મજબૂત ભંડોળ' },
    retirement_planning: { title: 'નિવૃત્તિનું સુખદ આયોજન', subtitle: 'બાળકો પર બોજ બન્યા વગર ગૌરવપૂર્ણ પેન્શન જીવન' },
    swp_income: { title: 'SWP માસિક પેન્શન પ્લાન', subtitle: 'ટેક્સ બચત સાથે નિયમિત માસિક આવક મેળવવાની શ્રેષ્ઠ રીત' },
    nps_scheme: { title: 'NPS રાષ્ટ્રીય પેન્શન યોજના', subtitle: 'વધારાની ₹૫૦,૦૦૦ ની ટેક્સ છૂટ સાથે સરકારી પેન્શન સ્કીમ' },
    post_office_vs_mf: { title: 'પોસ્ટ ઓફિસ સ્કીમ vs મ્યુચ્યુઅલ ફંડ', subtitle: 'નિશ્ચિત વ્યાજ અને વૃદ્ધિકારક ફંડ્સની સાચી તુલના' },
    senior_citizen: { title: 'સીનિયર સિટીઝન માટે સલામત રોકાણ', subtitle: 'મૂડીની સલામતી સાથે નિયમિત વ્યાજ મેળવવાનું પ્લાનિંગ' },
    home_loan_prepay: { title: 'હોમ લોન પ્રી-પેમેન્ટ vs SIP', subtitle: 'લોન પહેલા પૂરી કરવી ફાયદાકારક છે કે SIP ચાલુ રાખવી?' },
    credit_card_trap: { title: 'ક્રેડિટ કાર્ડ મિનિમમ ડ્યૂનો ફંદો', subtitle: '૪૨% વાર્ષિક વ્યાજ યુવાનોને કેવી રીતે દેવાના ખાડામાં ધકેલે છે' },
    debt_freedom: { title: 'દેવામાંથી કાયમી મુક્તિનો રોડમેપ', subtitle: 'એક પછી એક લોન ચૂકવીને સંપૂર્ણ આઝાદી મેળવો' },
    cibil_score: { title: 'CIBIL સ્કોર ૭૫૦+ નું મહત્વ', subtitle: 'સારો ક્રેડિટ સ્કોર લોન વ્યાજમાં લાખો રૂપિયા કેવી રીતે બચાવે છે' },
    budgeting_rule: { title: '૫૦-૩૦-૨૦ બજેટિંગનો સુવર્ણ નિયમ', subtitle: 'શોખ પૂરા કરવાની સાથે ભવિષ્ય પણ સુરક્ષિત રાખો' },
    lifestyle_inflation: { title: 'લાઇફસ્ટાઇલ ઇન્ફ્લેશનની જાળ', subtitle: 'પગાર વધવા છતાં મહિનાના અંતે હાથ ખાલી કેમ રહે છે?' },
    elss_tax: { title: 'ELSS ટેક્સ સેવિંગ મ્યુચ્યુઅલ ફંડ', subtitle: '૮૦C હેઠળ ₹૪૬,૮૦૦ ટેક્સ બચાવો, માત્ર ૩ વર્ષ લોક-ઇન' },
    capital_gains: { title: 'નવા કેપિટલ ગેઇન્સ ટેક્સ નિયમો', subtitle: 'નફા પર ટેક્સ ઘટાડવાની કાનૂની અને સ્માર્ટ પદ્ધતિઓ' },
    will_nomination: { title: 'વિલ (વસિયતનામું) અને નોમિનેશન', subtitle: 'તમારી સંપત્તિ સરળતાથી વારસદારો સુધી પહોંચે તેની ખાતરી' },
  },
  angles: {
    reality_check: { title: 'આંખ ઉઘાડતી વાસ્તવિકતા', desc: 'ગણિત અને આંકડાઓ સાથે ગ્રાહકને વિચારવા મજબૂર કરતી વાર્તા' },
    inspirational: { title: 'પ્રેરણાદાયી સંઘર્ષની કથા', desc: 'સામાન્ય સ્થિતિમાંથી આર્થિક સમૃદ્ધિ તરફની સફર' },
    cost_of_delay: { title: 'મોડું કરવાની આકરી કિંમત', desc: 'માત્ર ૩ વર્ષ રાહ જોવાથી લાખોનું નુકસાન કેમ થાય છે તે સાબિત કરતી વાર્તા' },
    duo_journey: { title: 'રમેશ અને સુરેશની સફર', desc: 'સરખા પગારવાળા બે મિત્રોના અલગ નિર્ણયો અને ૧૨ વર્ષ પછીનું અંતર' },
    family_bond: { title: 'પરિવાર પ્રત્યેની જવાબદારી', desc: 'બાળકો, જીવનસાથી અને માતા-પિતાના ભવિષ્યની ભાવનાત્મક સુરક્ષા' },
  },
  personas: {
    young_pros: { title: 'યુવાન નોકરિયાત વર્ગ', ageRange: '૨૨-૩૨ વર્ષ', desc: 'પ્રથમ નોકરી, ગેજેટ્સ, ક્રેડિટ કાર્ડ અને શોખનું વાતાવરણ' },
    parents: { title: 'જવાબદાર માતા-પિતા', ageRange: '૩૦-૪૫ વર્ષ', desc: 'બાળકોની ફી, ઘરની લોન અને કુટુંબની સુરક્ષા' },
    pre_retirees: { title: 'નિવૃત્તિની નજીક પહોંચેલા લોકો', ageRange: '૪૫-૫૮ વર્ષ', desc: 'નિવૃત્તિ ભંડોળ, સ્વાસ્થ્ય ખર્ચ અને દીકરીના લગ્ન' },
    business_owners: { title: 'વેપારી અને ઉદ્યોગપતિઓ', ageRange: '૩૦-૫૫ વર્ષ', desc: 'અનિયમિત આવક અને અંગત સંપત્તિને સુરક્ષિત રાખવી' },
    women: { title: 'મહિલા રોકાણકારો અને ગૃહિણીઓ', ageRange: '૨૫-૫૦ વર્ષ', desc: 'આર્થિક આત્મનિર્ભરતા અને સોના સિવાયના સ્માર્ટ રોકાણો' },
  },
  lengths: {
    short: { title: 'વોટ્સએપ સ્ટેટસ / રીલ સ્ક્રિપ્ટ', words: '~૧૨૦ શબ્દો', desc: '૪૫ સેકન્ડમાં ઝડપી વાંચન માટે પરફેક્ટ' },
    standard: { title: 'સ્ટાન્ડર્ડ વાયરલ બ્રોડકાસ્ટ', words: '~૨૪૦ શબ્દો', desc: 'વોટ્સએપ ગ્રૂપ અને ફેસબુક માટે શ્રેષ્ઠ' },
    deep: { title: 'ઊંડાણપૂર્વક વિશ્લેષણ લેખ', words: '~૩૮૦ શબ્દો', desc: 'વિશેષ જ્ઞાન અને સંપૂર્ણ ગાઈડ' },
  },
  ctas: {
    viral_forward: { title: 'ગ્રૂપ ફોરવર્ડ અપીલ', hook: 'આ વાર્તા તમારા ૩ ખાસ મિત્રો અને પરિવારજનોને જરૂર મોકલો.' },
    portfolio_audit: { title: 'ફ્રી પોર્ટફોલિયો ચેકઅપ', hook: 'તમારા જૂના ફંડ્સ કે પોલિસીનું ૧૦૦% ગોપનીય રિવ્યુ કરાવો.' },
    goal_consultation: { title: 'પર્સનલ રોડમેપ પ્લાનિંગ', hook: 'તમારા બાળકના શિક્ષણ કે રિટાયરમેન્ટ માટે આજે જ વોટ્સએપ કરો.' },
  },
};

const HINDI_TRANSLATIONS: StoryStudioTranslations = {
  ...ENGLISH_TRANSLATIONS,
  moduleBadge: 'वायरल व्हाट्सएप स्टोरी स्टूडियो',
  moduleTitle: 'स्टोरी स्टूडियो: वित्तीय सफलता की प्रेरक कहानियां',
  moduleDescription: 'परिवार के व्हाट्सएप ग्रुप, लिंक्डइन और ब्रॉडकास्ट लिस्ट के लिए तैयार की गई अत्यधिक प्रभावशाली कहानियां।',
  viewSavedStories: 'सहेजी गई कहानियां',
  sectionPillar: 'मुख्य वित्तीय विषय चुनें (३० विषय)',
  sectionPillarDesc: 'अपनी कहानी का मूल वित्तीय विषय चुनें।',
  searchPillarPlaceholder: 'विषय खोजें (उदा. SIP, टर्म इंश्योरेंस, देरी)...',
  allCategories: 'सभी विषय',
  catWealth: 'धन संचय',
  catProtection: 'सुरक्षा कवच',
  catRetirement: 'रिटायरमेंट एवं लक्ष्य',
  catDebt: 'ऋण एवं बजट',
  catTaxEstate: 'टैक्स एवं वसीयत',
  clearFilters: 'फ़िल्टर हटाएं',
  sectionAngle: 'कहानी का भावनात्मक कोण (Hook)',
  sectionAngleDesc: 'वह मनोवैज्ञानिक दृष्टिकोण जो पहली पंक्ति से ध्यान आकर्षित करे।',
  sectionPersona: 'लक्षित पाठक वर्ग',
  sectionPersonaDesc: 'किरदार और जीवन की परिस्थितियां पाठक के अनुसार ढलेंगी।',
  sectionLength: 'कहानी का आकार',
  sectionLengthDesc: 'समय और माध्यम के अनुसार उपयुक्त लंबाई चुनें।',
  sectionCta: 'कॉल-टू-एक्शन (CTA)',
  sectionCtaDesc: 'कहानी के बाद पाठक से क्या कदम उठाने की अपील करनी है।',
  advisorSignatureNotice: 'आपका नाम, पदनाम और डायरेक्ट व्हाट्सएप लिंक अपने आप जुड़ जाएंगे।',
  generatingButton: 'कहानी तैयार हो रही है...',
  generateButton: 'वायरल कहानी बनाएं',
  previewBadge: 'व्हाट्सएप तैयार',
  wordCountLabel: 'शब्द संख्या',
  formattedPreviewTab: 'व्हाट्सएप पूर्वावलोकन',
  plainTextTab: 'सादा पाठ',
  shareWhatsApp: 'व्हाट्सएप पर शेयर करें',
  copyText: 'टेक्स्ट कॉपी करें',
  copiedSuccess: 'कॉपी हो गया!',
  saveToLibrary: 'लाइब्रेरी में सहेजें',
  alreadySaved: 'पहले से सहेजा गया',
  savedLibraryTitle: 'सहेजी गई कहानियां',
  noSavedStories: 'अभी कोई कहानी सहेजी नहीं गई है। ऊपर से नई कहानी बनाएं!',
  topics: {
    sip_wealth: { title: 'SIP और चक्रवृद्धि ब्याज', subtitle: 'छोटी नियमित बचत से करोड़ों का फंड कैसे बनता है' },
    step_up_sip: { title: 'स्टेप-अप SIP की ताकत', subtitle: 'हर साल १०% SIP बढ़ाने से वेल्थ दोगुनी तेजी से बढ़ती है' },
    stocks_vs_mf: { title: 'शेयर ट्रेडिंग vs म्यूचुअल फंड', subtitle: 'सट्टेबाजी का जोखिम vs अनुशासित परिसंपत्ति आवंटन' },
    gold_vs_equity: { title: 'भौतिक सोना vs इक्विटी निवेश', subtitle: 'मेकिंग चार्ज का नुकसान vs वेल्थ क्रिएशन' },
    fd_vs_inflation: { title: 'बैंक FD vs खामोश महंगाई', subtitle: 'FD में पैसे रखने से वास्तविक क्रय शक्ति कैसे घटती है' },
    real_estate_reits: { title: 'रियल एस्टेट vs लिक्विड एसेट्स', subtitle: 'भारी EMI का बोझ vs लचीला आधुनिक निवेश' },
    sgb_digital_gold: { title: 'सॉवरेन गोल्ड बॉन्ड (SGB)', subtitle: '२.५% अतिरिक्त ब्याज के साथ सोने में सुरक्षित निवेश' },
    asset_allocation: { title: 'एसेट एलोकेशन का जादू', subtitle: 'मार्केट क्रैश के दौरान भी मन की शांति देने वाला फॉर्मूला' },
    term_insurance: { title: 'प्योर टर्म इंश्योरेंस', subtitle: 'कम प्रीमियम में परिवार के लिए ₹१-२ करोड़ का सुरक्षा कवच' },
    health_insurance: { title: 'फैमिली हेल्थ इंश्योरेंस', subtitle: 'अस्पताल का एक बिल १० साल की बचत कैसे स्वाहा कर सकता है' },
    super_topup: { title: 'सुपर टॉप-अप पॉलिसी', subtitle: '७०% कम खर्च में ₹२५-५० लाख का बड़ा मेडिकल कवर' },
    emergency_fund: { title: '६ महीने का इमरजेंसी फंड', subtitle: 'अचानक संकट या नौकरी जाने की स्थिति में ढाल' },
    endowment_reality: { title: 'एंडोमेंट पॉलिसी का सच', subtitle: '४-५% रिटर्न वाली पॉलिसी vs टर्म प्लान + SIP' },
    personal_accident: { title: 'पर्सनल एक्सीडेंट कवर', subtitle: 'कमाऊ सदस्य की विकलांगता पर आय का संरक्षण' },
    child_education: { title: 'बच्चों की उच्च शिक्षा फंड', subtitle: '१०% शिक्षा महंगाई को मात देने के लिए समय पर तैयारी' },
    daughter_future: { title: 'बेटी का उज्ज्वल भविष्य', subtitle: 'बेटी के सपनों और आर्थिक आजादी की मजबूत नींव' },
    retirement_planning: { title: 'सम्मानजनक रिटायरमेंट', subtitle: 'बच्चों पर निर्भर रहे बिना स्वाभिमान से जीने का प्लान' },
    swp_income: { title: 'SWP मासिक पेंशन प्लान', subtitle: 'टैक्स बचत के साथ नियमित मासिक आय की सबसे अच्छी व्यवस्था' },
    nps_scheme: { title: 'NPS राष्ट्रीय पेंशन प्रणाली', subtitle: 'अतिरिक्त ₹५०,००० की टैक्स छूट के साथ रिटायरमेंट पेंशन' },
    post_office_vs_mf: { title: 'पोस्ट ऑफिस vs म्यूचुअल फंड', subtitle: 'फिक्स्ड ब्याज और इक्विटी ग्रोथ की सटीक तुलना' },
    senior_citizen: { title: 'वरिष्ठ नागरिकों की वेल्थ सुरक्षा', subtitle: 'पूंजी की सुरक्षा के साथ नियमित ब्याज पाने की रणनीति' },
    home_loan_prepay: { title: 'होम लोन प्रीपेमेंट vs SIP', subtitle: 'लोन पहले चुकाएं या SIP में निवेश जारी रखें?' },
    credit_card_trap: { title: 'क्रेडिट कार्ड मिनिमम ड्यू का जाल', subtitle: '४२% वार्षिक ब्याज युवाओं को कैसे कर्ज में फंसाता है' },
    debt_freedom: { title: 'कर्ज से हमेशा के लिए आजादी', subtitle: 'एक-एक करके सारे कर्ज चुकाने का व्यावहारिक रोडमैप' },
    cibil_score: { title: 'सिबिल स्कोर ७५०+ का महत्व', subtitle: 'अच्छा क्रेडिट स्कोर लोन के ब्याज में लाखों कैसे बचाता है' },
    budgeting_rule: { title: '५०-३०-२० स्मार्ट बजटिंग', subtitle: 'खुशियों से समझौता किए बिना भविष्य सुरक्षित करने का नियम' },
    lifestyle_inflation: { title: 'लाइफस्टाइल महंगाई का फंदा', subtitle: 'सैलरी बढ़ने पर भी महीने के अंत में पैसे क्यों नहीं बचते?' },
    elss_tax: { title: 'ELSS टैक्स सेवर फंड', subtitle: '८०C में ₹४६,૮૦૦ टैक्स बचाएं, सिर्फ ३ साल का लॉक-इन' },
    capital_gains: { title: 'नए कैपिटल गेन्स टैक्स नियम', subtitle: 'मुनाफे पर टैक्स घटाने की स्मार्ट और कानूनी रणनीतियां' },
    will_nomination: { title: 'वसीयत और नॉमिनेशन का महत्व', subtitle: 'आपकी मेहनत की कमाई बिना विवाद के अपनों तक पहुंचे' },
  },
  angles: {
    reality_check: { title: 'आंखें खोलने वाली सच्चाई', desc: 'गणित और आंकड़ों के साथ वास्तविकता का बोध कराने वाली कहानी' },
    inspirational: { title: 'प्रेरक सफलता की कहानी', desc: 'साधारण स्थिति से वित्तीय स्वतंत्रता की प्रेरक यात्रा' },
    cost_of_delay: { title: 'देरी करने की भारी कीमत', desc: 'सिर्फ ३ साल टालने से लाखों का नुकसान कैसे होता है' },
    duo_journey: { title: 'रमेश और सुरेश की कहानी', desc: 'एक जैसी सैलरी वाले दो दोस्तों के अलग निर्णय और परिणाम' },
    family_bond: { title: 'परिवार के प्रति जिम्मेदारी', desc: 'बच्चों, जीवनसाथी और माता-पिता के प्रति प्रेम और सुरक्षा' },
  },
  personas: {
    young_pros: { title: 'युवा पेशेवर और टेक कर्मचारी', ageRange: '२२-३२ वर्ष', desc: 'पहली नौकरी, नए गैजेट्स और लाइफस्टाइल' },
    parents: { title: 'जिम्मेदार माता-पिता', ageRange: '३०-४૫ वर्ष', desc: 'बच्चों की स्कूल फीस, होम लोन और पारिवारिक सुरक्षा' },
    pre_retirees: { title: 'रिटायरमेंट के करीब लोग', ageRange: '४૫-૫૮ वर्ष', desc: 'पेंशन फंड, मेडिकल खर्च और बेटी की शादी' },
    business_owners: { title: 'व्यापारी और उद्यमी', ageRange: '३०-૫૫ वर्ष', desc: 'अनियमित आय और पर्सनल वेल्थ को सुरक्षित रखना' },
    women: { title: 'महिला निवेशक और गृहणियां', ageRange: '२૫-૫૦ वर्ष', desc: 'वित्तीय आत्मनिर्भरता और सोने से बेहतर विकल्प' },
  },
  lengths: {
    short: { title: 'व्हाट्सएप स्टेटस / रील स्क्रिप्ट', words: '~१२० शब्द', desc: '४५ सेकंड में तेजी से पढ़ने के लिए बेहतरीन' },
    standard: { title: 'मानक वायरल ब्रॉडकास्ट', words: '~२४० शब्द', desc: 'व्हाट्सएप ग्रुप और फेसबुक के लिए उपयुक्त' },
    deep: { title: 'गहन विश्लेषण लेख', words: '~३८० शब्द', desc: 'विस्तृत ज्ञान और पूर्ण मार्गदर्शन' },
  },
  ctas: {
    viral_forward: { title: 'ग्रुप फॉरवर्ड अपील', hook: 'यह कहानी अपने ३ खास दोस्तों और परिवारजनों को जरूर भेजें।' },
    portfolio_audit: { title: 'फ्री पोर्टफोलियो समीक्षा', hook: 'अपनी पुरानी पॉलिसियों की १००% गोपनीय जांच करवाएं।' },
    goal_consultation: { title: 'पर्सनल रोडमैप परामर्श', hook: 'बच्चों की पढ़ाई या रिटायरमेंट प्लानिंग के लिए आज ही व्हाट्सएप करें।' },
  },
};

export function getStoryStudioI18n(lang: LanguageCode): StoryStudioTranslations {
  if (lang === 'gu') return GUJARATI_TRANSLATIONS;
  if (lang === 'hi') return HINDI_TRANSLATIONS;
  return ENGLISH_TRANSLATIONS;
}
