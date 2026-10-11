/**
 * Finance Subject Validator
 * Enforces strict financial domain compliance as demanded by user:
 * - Only topics related to financial planning, investments, insurance, taxation,
 *   banking, loans, wealth management, and finance-related companies are permitted.
 * - Non-finance topics (e.g. "ઘરેલુ ઉપચાર" / home remedies, cooking, astrology, entertainment, fitness)
 *   are strictly rejected with a clear Gujarati/English advisory notification.
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  errorMessageGu?: string;
  matchedCategory?: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning';
}

// Strictly forbidden non-financial keywords & domains
const DISALLOWED_PATTERNS: RegExp[] = [
  // Medical / Home remedies / Illness cures
  /ઘરેલુ\s*ઉપચાર/i,
  /દેશી\s*ઉપચાર/i,
  /ઘરેલું\s*નુસ્ખા/i,
  /આયુર્વેદિક\s*(નુસ્ખા|ઉપચાર|દવા)/i,
  /home\s*remed(y|ies)/i,
  /desi\s*nuskhe/i,
  /gharelu\s*upchar/i,
  /cure\s*for/i,
  /દવા(ઓ)?\b/i,
  /તાવ|ઉધરસ|શરદી|માથાનો\s*દુખાવો/i,
  /fever|cough|cold|headache|treatment/i,

  // Cooking & Food recipes
  /રસોઈ|વાનગી|રેસિપી|નાસ્તો|ખાવાનું/i,
  /recipe|cooking|kitchen|dish|food/i,

  // Astrology & Occult
  /જ્યોતિષ|કુંડળી|રાશિફળ|વાસ્તુ|શનિ|ગ્રહ/i,
  /astrology|horoscope|zodiac|vastu|kundali/i,

  // Entertainment / Movies / Sports
  /ફિલ્મ|મૂવી|સિનેમા|ગીત|અભિનેતા|અભિનેત્રી|ક્રિકેટ|મેચ/i,
  /movie|cinema|actor|actress|cricket|song|entertainment|sports/i,

  // Beauty & non-financial fitness
  /બ્યુટી\s*ટિપ્સ|સ્કિન\s*કેર|વાળ|વજન\s*ઘટાડવું|ડાયેટ/i,
  /beauty\s*tips|skin\s*care|weight\s*loss|hair\s*fall|diet\s*plan/i,

  // Jokes, Shayari & Politics
  /જોક્સ|શાયરી|ચૂંટણી|રાજકારણ/i,
  /jokes|shayari|politics|election/i,
];

// Financial companies, AMCs, insurers & institutions in India & globally
const FINANCIAL_COMPANIES: string[] = [
  'hdfc', 'sbi', 'icici', 'axis', 'kotak', 'lic', 'bajaj', 'tata', 'nippon',
  'aditya birla', 'birla', 'uti', 'motilal oswal', 'motilal', 'dsp', 'mirae asset', 'mirae',
  'edelweiss', 'max life', 'canara robeco', 'canara', 'bandhan', 'franklin', 'franklin templeton',
  'invesco', 'sundaram', 'hsbc', 'zerodha', 'groww', 'angel one', 'upstox', 'sharekhan',
  'star health', 'niva bupa', 'care health', 'care insurance', 'reliance', 'shriram',
  'mahindra finance', 'muthoot', 'manappuram', 'cholamandalam', 'l&t finance', 'l&t',
  'pnb', 'bank of baroda', 'bob', 'indusind', 'idfc', 'idfc first', 'yes bank',
  'federal bank', 'union bank', 'indian bank', 'central bank', 'rbl', 'standard chartered',
  'citi', 'dbs', 'morgan stanley', 'goldman sachs', 'jpmorgan', 'blackrock', 'vanguard',
  'pms', 'aif', 'amfi', 'irdai', 'sebi', 'rbi', 'nbfc', 'amc',
  // Gujarati representations of companies
  'એચડીએફસી', 'એસબીઆઈ', 'આઈસીઆઈસીઆઈ', 'એક્સિસ', 'કોટક', 'એલઆઈસી', 'બજાજ', 'ટાટા',
  'નિપ્પોન', 'બિરલા', 'યુટીઆઈ', 'મોતીલાલ', 'મેક્સ લાઇફ', 'સ્ટાર હેલ્થ', 'બેંક ઓફ બરોડા'
];

// Broad financial terminology in English, Gujarati, and Hindi
const FINANCIAL_TERMS: string[] = [
  // Wealth & Investment
  'sip', 'swp', 'stp', 'mutual fund', 'fund', 'equity', 'debt', 'portfolio', 'stock',
  'share', 'demat', 'trading', 'sensex', 'nifty', 'return', 'returns', 'cagr', 'nav',
  'compounding', 'wealth', 'investment', 'invest', 'investing', 'asset allocation',
  'diversification', 'rebalancing', 'dividend', 'capital', 'index fund', 'etf', 'elss',
  'sgb', 'gold', 'sovereign gold', 'digital gold', 'silver', 'reit', 'invit',
  'real estate', 'property investment', 'post office', 'mis', 'kvp', 'nsc', 'scss',
  'sukanya', 'ssy', 'ppf', 'epf', 'vpf', 'gratuity', 'bonds', 'corporate fd', 'fixed deposit',
  'recurring deposit', 'fd', 'rd',

  // Insurance & Protection
  'insurance', 'life insurance', 'term insurance', 'term plan', 'health insurance',
  'mediclaim', 'super top-up', 'top up', 'critical illness', 'accident', 'disability',
  'endowment', 'money back', 'ulip', 'guarantee', 'guaranteed return', 'annuity',
  'pension', 'nps', 'pmvvy', 'claim', 'cashless', 'sum assured', 'protection',
  'keyman', 'mwpa',

  // Taxation
  'tax', 'taxes', 'taxation', 'income tax', 'tax planning', '80c', '80d', '80ccd',
  'capital gains', 'stcg', 'ltcg', 'exemption', 'itr', 'tds', 'advance tax', 'gst',
  'tax saving', 'old regime', 'new regime',

  // Borrowing & Debt
  'loan', 'home loan', 'personal loan', 'car loan', 'education loan', 'gold loan',
  'business loan', 'mortgage', 'emi', 'interest', 'interest rate', 'repo rate',
  'prepayment', 'foreclosure', 'debt', 'debt free', 'credit', 'credit score', 'cibil',
  'credit card', 'borrowing',

  // Planning & Advisory
  'financial plan', 'financial planning', 'planner', 'advisor', 'consultant',
  'retirement', 'retirement planning', 'emergency fund', 'budget', 'budgeting',
  'cash flow', 'child education', 'marriage fund', 'financial freedom', 'fire',
  'estate planning', 'will', 'trust', 'succession', 'money', 'finance', 'financial',
  'inflation', 'purchasing power', 'rupee', 'corpu', 'corpus', 'hni', 'nri', 'esop',

  // Gujarati Financial Vocabulary
  'નાણાકીય', 'ફાઇનાન્સ', 'રોકાણ', 'બચત', 'સંપત્તિ', 'વેલ્થ', 'વીમો', 'ઇન્સ્યોરન્સ',
  'મેડિક્લેમ', 'પેન્શન', 'વ્યાજ', 'વળતર', 'રિટર્ન', 'કરવેરા', 'ટેક્સ', 'શેરબજાર',
  'શેર', 'મ્યુચ્યુઅલ ફંડ', 'એસઆઈપી', 'બોન્ડ', 'ડિબેન્ચર', 'લોન', 'ધિરાણ', 'દેવું',
  'હપ્તો', 'ઇએમઆઈ', 'ભંડોળ', 'કમાણી', 'ચક્રવૃદ્ધિ', 'નિવૃત્તિ', 'રિટાયરમેન્ટ',
  'પ્લાનિંગ', 'આયોજન', 'સોનું', 'ગોલ્ડ', 'ચાંદી', 'બેંક', 'મૂડી', 'પોર્ટફોલિયો',
  'ફંડ', 'જોખમ', 'રિસ્ક', 'સલાહકાર', 'એડવાઈઝર', 'આર્થિક', 'ક્રેડિટ', 'સિબિલ',
  'કટોકટી', 'સુકન્યા', 'જીવન વીમો', 'ટર્મ પ્લાન', 'સ્વાસ્થ્ય વીમો', 'એલોકેશન',
  'મૂડી રોકાણ', 'નફો', 'પૂંજી',

  // Hindi Financial Vocabulary
  'वित्त', 'वित्तीय', 'निवेश', 'बचत', 'धन', 'संपत्ति', 'बीमा', 'मेडिक्लेम', 'पेंशन',
  'ब्याज', 'कर्ज', 'ऋण', 'ईएमआई', 'चक्रवृद्धि', 'सोना', 'चांदी', 'बैंक', 'पूंजी'
];

/**
 * Validates a subject title and optional company/sector for financial relevance.
 */
export function validateFinancialSubject(
  subjectTitle: string,
  companyOrSector?: string
): ValidationResult {
  const cleanTitle = (subjectTitle || '').trim().toLowerCase();
  const cleanSector = (companyOrSector || '').trim().toLowerCase();
  const combinedText = `${cleanTitle} ${cleanSector}`;

  if (!cleanTitle || cleanTitle.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Subject title is required (minimum 2 characters).',
      errorMessageGu: 'કૃપા કરીને સબ્જેક્ટનું નામ દાખલ કરો (ઓછામાં ઓછા ૨ અક્ષર).',
    };
  }

  // 1. Check for strictly disallowed non-financial domains
  for (const pattern of DISALLOWED_PATTERNS) {
    if (pattern.test(cleanTitle) || pattern.test(combinedText)) {
      return {
        isValid: false,
        errorMessage:
          '❌ Only financial, investment, insurance, tax, or wealth-related subjects are allowed! Non-financial topics (like home remedies, cooking, astrology, etc.) are strictly prohibited.',
        errorMessageGu:
          '❌ આ સબ્જેક્ટ ફાઇનાન્સ સાથે સુસંગત નથી! અહીં ફક્ત ફાઇનાન્સ, રોકાણ, વીમા, ટેક્સ, લોન અથવા નાણાકીય કંપનીઓ (જેમ કે HDFC, SBI, LIC, Tata વગેરે) ને લગતા જ સબ્જેક્ટ ઉમેરી શકાય છે. (દા.ત. "ઘરેલુ ઉપચાર" જેવા બિન-નાણાકીય વિષયો અહીં માન્ય નથી).',
      };
    }
  }

  // 2. Check if text matches any financial company or institution
  const hasFinanceCompany = FINANCIAL_COMPANIES.some((comp) => {
    const regex = new RegExp(`\\b${comp}\\b`, 'i');
    return regex.test(cleanTitle) || regex.test(combinedText);
  });

  // 3. Check if text matches any recognized financial terms
  const hasFinanceTerm = FINANCIAL_TERMS.some((term) => {
    // Exact or substring match for terms
    return combinedText.includes(term.toLowerCase());
  });

  // 4. Check if common finance suffixes/prefixes are present (e.g., 'Capital', 'Wealth', 'Investments', 'Fintech', 'AMC')
  const hasFinanceKeywordMatch =
    /\b(amc|pms|aif|sip|swp|stp|fd|rd|ppf|epf|vpf|nps|sgb|reit|cibil|emi|itr|tds|nav|cagr|hni|nri)\b/i.test(combinedText) ||
    /\b(capital|wealth|finance|financial|invest|fund|funds|money|asset|assets|equity|debt|bonds|insurance|pension|tax|taxes|loan|loans|bank|banking)\b/i.test(combinedText);

  if (!hasFinanceCompany && !hasFinanceTerm && !hasFinanceKeywordMatch) {
    return {
      isValid: false,
      errorMessage:
        '⚠️ Please ensure this subject is related to finance, wealth, investment, insurance, tax, loans, or a financial company. Unrelated subjects are not permitted.',
      errorMessageGu:
        '⚠️ કૃપા કરીને ખાતરી કરો કે આ વિષય ફાઇનાન્સ, રોકાણ, વીમા, ટેક્સ, લોન, મ્યુચ્યુઅલ ફંડ અથવા કોઈ નાણાકીય કંપની સાથે સંબંધિત છે. ફાઇનાન્સ સિવાયના વિષયો અહીં ઉમેરી શકાતા નથી.',
    };
  }

  // Categorize for UI badge
  let matchedCategory: 'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning' = 'wealth';
  if (/tax|કર|80c|80d|itr|capital gain/i.test(combinedText)) {
    matchedCategory = 'tax';
  } else if (/insur|વીમ|mediclaim|health|term|claim|કવર|આયુષ્ય/i.test(combinedText)) {
    matchedCategory = 'protection';
  } else if (/loan|લોન|debt|emi|cibil|ક્રેડિટ|mortgage|ધિરાણ/i.test(combinedText)) {
    matchedCategory = 'borrowing';
  } else if (/retire|નિવૃત્તિ|child|શિક્ષણ|budget|emergency|pension|કટોકટી/i.test(combinedText)) {
    matchedCategory = 'planning';
  }

  return {
    isValid: true,
    matchedCategory,
  };
}
