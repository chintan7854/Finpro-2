export interface QuestionnaireOption {
  value: string;
  label: string;
  labelGu?: string;
  labelHi?: string;
  category?: string;
}

// 1. How do you know the client, and for how long?
export const QUESTION_RELATIONSHIPS: QuestionnaireOption[] = [
  {
    value: 'Long-time close friend / family member (5+ years)',
    label: 'Long-time friend / family member (5+ yrs)',
    labelGu: 'લાંબા સમયના અંગત મિત્ર / પરિવારજન (૫+ વર્ષ)',
    labelHi: 'पुराने पारिवारिक मित्र / रिश्तेदार (5+ वर्ष)',
  },
  {
    value: 'Existing trusted client looking to review or expand portfolio',
    label: 'Existing client expanding portfolio',
    labelGu: 'હાલના ગ્રાહક (પોર્ટફોલિયો વધારવા માંગે છે)',
    labelHi: 'मौजूदा संतुष्ट क्लाइंट (पोर्टफोलियो विस्तार)',
  },
  {
    value: 'Referred recently by an existing happy client',
    label: 'Warm referral from a happy client',
    labelGu: 'વિશ્વાસુ ક્લાયન્ટ દ્વારા મળેલ રેફરલ',
    labelHi: 'मौजूदा क्लाइंट का रेफरल',
  },
  {
    value: 'Professional / Corporate network connection (1-3 years)',
    label: 'Professional / Corporate network (1-3 yrs)',
    labelGu: 'પ્રોફેશનલ / કોર્પોરેટ નેટવર્ક કનેક્શન (૧-૩ વર્ષ)',
    labelHi: 'प्रोफेशनल / कॉरपोरेट नेटवर्क (1-3 वर्ष)',
  },
  {
    value: 'New inquiry / Social media or seminar lead (recent)',
    label: 'New inbound inquiry / Seminar lead',
    labelGu: 'નવી પૂછપરછ / સેમિનાર કે ડિજિટલ લીડ',
    labelHi: 'नया इंक्वायरी / सेमिनार लीड',
  },
  {
    value: 'Neighborhood / Community acquaintance',
    label: 'Community / Neighborhood acquaintance',
    labelGu: 'સોસાયટી / સ્થાનિક સમાજના પરિચિત',
    labelHi: 'समाज / पड़ोस के परिचित',
  },
];

// 2. What are the client's known needs, goals, and priorities?
export const QUESTION_GOALS: QuestionnaireOption[] = [
  {
    value: "Child's higher education and career milestone fund",
    label: "Child's Higher Education & Degree Fund",
    labelGu: 'બાળકના ઉચ્ચ શિક્ષણ અને કેરિયર માટે ફંડ',
    labelHi: 'बच्चे की उच्च शिक्षा और कॉलेज फंड',
  },
  {
    value: 'Inflation-proof early retirement corpus and regular pension',
    label: 'Inflation-Proof Retirement Corpus & Pension',
    labelGu: 'મોંઘવારી-મુક્ત રિટાયરમેન્ટ ફંડ અને પેન્શન',
    labelHi: 'महंगाई-मुक्त रिटायरमेंट और मासिक पेंशन',
  },
  {
    value: 'Systematic long-term wealth creation and beating inflation',
    label: 'Wealth Creation & Beating Inflation',
    labelGu: 'સંપત્તિ નિર્માણ અને ફુગાવા સામે રક્ષણ',
    labelHi: 'वेल्थ क्रिएशन और महंगाई को मात देना',
  },
  {
    value: 'Comprehensive health shield (Base + Super Top-up) for entire family',
    label: 'Family Health Shield (Base + Top-up)',
    labelGu: 'સમગ્ર પરિવાર માટે હેલ્થ શિલ્ડ (બેઝ + ટોપ-અપ)',
    labelHi: 'परिवार के लिए सम्पूर्ण हेल्थ शील्ड (बेस + टॉप-अप)',
  },
  {
    value: 'Adequate pure life protection (Term Insurance) for family dependants',
    label: 'Pure Term Insurance for dependants',
    labelGu: 'પરિવાર માટે પ્યોર ટર્મ ઇન્સ્યોરન્સ કવર',
    labelHi: 'परिवार की सुरक्षा के लिए प्योर टर्म इंश्योरेंस',
  },
  {
    value: 'Home loan pre-payment & zero-debt financial freedom',
    label: 'Home Loan Pre-payment & Debt Freedom',
    labelGu: 'હોમ લોન ઝડપથી ચૂકવી દેવા મુક્ત થવું',
    labelHi: 'होम लोन प्री-पेमेंट और कर्ज मुक्ति',
  },
  {
    value: 'Tax optimization under 80C/80D and capital gains planning',
    label: 'Tax Optimization & Capital Gains Planning',
    labelGu: 'ટેક્સ બચત અને કેપિટલ ગેઇન્સ આયોજન',
    labelHi: 'टैक्स बचत और कैपिटल गेन्स प्लानिंग',
  },
  {
    value: 'Vehicle protection, zero dep cover and comprehensive asset safety',
    label: 'Vehicle Zero Dep & Asset Protection',
    labelGu: 'વાહન માટે ઝીરો ડેપ અને સંપત્તિ સુરક્ષા',
    labelHi: 'वाहन जीरो डेप और एसेट सुरक्षा',
  },
];

// 3. What is the client's approximate annual income or investment budget, if known?
export const QUESTION_BUDGETS: QuestionnaireOption[] = [
  {
    value: 'Annual Income ₹8L–₹15L | Monthly SIP capacity ₹15,000–₹30,000',
    label: 'Income ₹8L–₹15L (SIP: ₹15k–₹30k/mo)',
    labelGu: 'વાર્ષિક આવક ₹૮L–₹૧૫L (SIP: ₹૧૫k–₹૩૦k/માસ)',
    labelHi: 'सालाना आय ₹8L–₹15L (SIP: ₹15k–₹30k/माह)',
  },
  {
    value: 'Annual Income ₹15L–₹30L | Monthly SIP capacity ₹35,000–₹75,000',
    label: 'Income ₹15L–₹30L (SIP: ₹35k–₹75k/mo)',
    labelGu: 'વાર્ષિક આવક ₹૧૫L–₹૩૦L (SIP: ₹૩૫k–₹૭૫k/માસ)',
    labelHi: 'सालाना आय ₹15L–₹30L (SIP: ₹35k–₹75k/माह)',
  },
  {
    value: 'Annual Income ₹30L–₹60L+ | Monthly capacity ₹1,00,000+',
    label: 'Income ₹30L–₹60L+ (SIP: ₹1L+/mo)',
    labelGu: 'વાર્ષિક આવક ₹૩૦L–₹૬૦L+ (ક્ષમતા ₹૧L+/માસ)',
    labelHi: 'सालाना आय ₹30L–₹60L+ (क्षमता ₹1L+/माह)',
  },
  {
    value: 'Starter / Budget conscious | Monthly savings ₹3,000–₹10,000',
    label: 'Starter Saver (₹3,000–₹10,000/mo)',
    labelGu: 'શરૂઆતી બચતકાર (₹૩,૦૦૦–₹૧૦,૦૦૦/માસ)',
    labelHi: 'शुरुआती बचत (₹3,000–₹10,000/माह)',
  },
  {
    value: 'Lump sum surplus available: ₹5 Lakh – ₹25 Lakh+',
    label: 'Lump Sum Surplus (₹5L – ₹25L+)',
    labelGu: 'એકસાથે સરપ્લસ (₹૫L – ₹૨૫L+)',
    labelHi: 'एकमुश्त सरप्लस (₹5L – ₹25L+)',
  },
  {
    value: 'Annual Insurance Premium Budget: ₹25,000 – ₹75,000',
    label: 'Insurance Premium Budget (₹25k–₹75k/yr)',
    labelGu: 'વીમા પ્રીમિયમ બજેટ (₹૨૫k–₹૭૫k/વર્ષ)',
    labelHi: 'बीमा प्रीमियम बजट (₹25k–₹75k/वर्ष)',
  },
];

// 4. What concerns or objections has the client expressed?
export const QUESTION_CONCERNS: QuestionnaireOption[] = [
  {
    value: 'Fear of stock market volatility or losing hard-earned capital',
    label: 'Fear of market crash or losing principal',
    labelGu: 'બજાર ઘટવાનો કે મૂડી ખોવાનો ડર',
    labelHi: 'मार्केट क्रैश या पूंजी डूबने का डर',
  },
  {
    value: 'Believes insurance premium is money lost if no claim is made',
    label: 'Considers insurance an expense / money lost',
    labelGu: 'વીમો ખર્ચો ગણે છે, રિટર્ન નથી મળતું એવું માને છે',
    labelHi: 'बीमा को फिजूल खर्च या नुकसान समझता है',
  },
  {
    value: 'Prefers traditional bank FDs, physical gold, or real estate',
    label: 'Prefers Bank FDs, Gold, or Real Estate',
    labelGu: 'બેંક FD, સોનું કે પ્રોપર્ટીને વધુ પ્રાધાન્ય આપે છે',
    labelHi: 'बैंक FD, सोना या रियल एस्टेट पसंद करता है',
  },
  {
    value: 'Tight cash flow / committed to EMIs, lifestyle costs and rent',
    label: 'Tight monthly cash flow / heavy EMIs',
    labelGu: 'માસિક ખર્ચાઓ અને EMI વધુ હોવાનું જણાવે છે',
    labelHi: 'मासिक ईएमआई और खर्चों की वजह से तंगी',
  },
  {
    value: 'Relies solely on employer corporate health coverage',
    label: 'Relies only on employer corporate mediclaim',
    labelGu: 'કંપનીના ગ્રુપ મેડિક્લેમ પર જ નિર્ભર છે',
    labelHi: 'केवल कंपनी के ग्रुप मेडिक्लेम पर निर्भर है',
  },
  {
    value: "Procrastination: 'I will think about it and start next month/year'",
    label: "Procrastination ('Will decide next month/year')",
    labelGu: "નિર્ણય ટાળવો ('હું આવતા મહિને વિચારીશ')",
    labelHi: "टालमटोल ('अगले महीने या साल सोचूंगा')",
  },
];

// 5. If the client hesitates or declines, what reasons has the client given, and what other reasons do you suspect?
export const QUESTION_HESITATIONS: QuestionnaireOption[] = [
  {
    value: "Stated: 'Need to discuss with spouse'; Suspected: Hesitant about long commitment",
    label: 'Stated: Family discussion | Suspected: Commitment fear',
    labelGu: 'કહે છે: પરિવાર સાથે ચર્ચા કરવી છે | શંકા: લાંબી કમિટમેન્ટનો ડર',
    labelHi: 'कहा: परिवार से बात करनी है | संदेह: लंबी अवधि का डर',
  },
  {
    value: "Stated: 'Don't have surplus funds'; Suspected: Discretionary lifestyle spending priority",
    label: 'Stated: Low funds | Suspected: Lifestyle spending priority',
    labelGu: 'કહે છે: પૈસા નથી | શંકા: બિનજરૂરી ખર્ચાઓમાં પૈસા વપરાય છે',
    labelHi: 'कहा: फंड नहीं है | संदेह: गैर-जरूरी खर्चों को प्राथमिकता',
  },
  {
    value: "Stated: 'Already have sufficient savings'; Suspected: Underestimating medical inflation & longevity",
    label: 'Stated: Already have enough | Suspected: Underestimates inflation',
    labelGu: 'કહે છે: પૂરતી બચત છે | શંકા: મોંઘવારીની ગણતરી નથી કરી',
    labelHi: 'कहा: पर्याप्त बचत है | संदेह: महंगाई का सही अंदाजा नहीं',
  },
  {
    value: "Stated: 'Bad past experience with insurance/agents'; Suspected: Fear of claim rejection or hidden fine print",
    label: 'Stated: Past bad experience | Suspected: Claim rejection fear',
    labelGu: 'કહે છે: ભૂતકાળમાં ખરાબ અનુભવ | શંકા: ક્લેમ રિજેક્શનનો ડર',
    labelHi: 'कहा: पुराना बुरा अनुभव | संदेह: क्लेम रिजेक्शन का डर',
  },
  {
    value: "Stated: 'Markets are too high right now'; Suspected: Trying to time the market instead of time in market",
    label: 'Stated: Market at all-time high | Suspected: Market timing myth',
    labelGu: 'કહે છે: બજાર ખૂબ ઊંચું છે | શંકા: માર્કેટ ટાઇમિંગની ભૂલભરેલી માન્યતા',
    labelHi: 'कहा: बाजार बहुत ऊंचा है | संदेह: टाइमिंग का भ्रम',
  },
  {
    value: "Stated: 'Need to research more'; Suspected: Information overload and confusion with financial jargon",
    label: 'Stated: Need research | Suspected: Jargon & info overload',
    labelGu: 'કહે છે: વધુ રિસર્ચ કરવું છે | શંકા: જટિલ ભાષાથી કન્ફ્યુઝન',
    labelHi: 'कहा: रिसर्च करनी है | संदेह: जटिल भाषा से असमंजस',
  },
];

// 6. What presentation style might the client prefer?
export const QUESTION_STYLES: QuestionnaireOption[] = [
  {
    value: 'Visual, story-driven, and emotional with relatable real-life Indian family examples',
    label: 'Visual & Story-Driven (Relatable Family Stories)',
    labelGu: 'વાર્તા આધારિત અને ભાવનાત્મક (વાસ્તવિક પારિવારિક ઉદાહરણો)',
    labelHi: 'कहानी-आधारित और भावनात्मक (पारिवारिक उदाहरण)',
  },
  {
    value: 'Hard data, mathematical calculations, and visual charts / graphs',
    label: 'Data-Driven (Hard Calculations & Visual Charts)',
    labelGu: 'ગણતરી અને ચાર્ટ આધારિત (આંકડાકીય વિશ્લેષણ)',
    labelHi: 'डेटा-संचालित (सटीक गणना और चार्ट्स)',
  },
  {
    value: 'Clear side-by-side comparison tables (Option A vs Option B)',
    label: 'Side-by-Side Comparison (Option A vs Option B)',
    labelGu: 'સામસામે સરખામણી કોષ્ટક (વિકલ્પ A vs વિકલ્પ B)',
    labelHi: 'आमने-सामने तुलना (विकल्प A बनाम विकल्प B)',
  },
  {
    value: 'Executive summary style: concise, fast, bottom-line focused',
    label: 'Executive Summary (Crisp, Fast, Bottom-Line)',
    labelGu: 'એક્ઝિક્યુટિવ સમરી (ટૂંકું, ઝડપી અને પરિણામલક્ષી)',
    labelHi: 'एग्जीक्यूटिव समरी (संक्षिप्त, तेज और सारगर्भित)',
  },
  {
    value: 'Beginner-friendly educational guide with zero financial jargon',
    label: 'Simple Educational Guide (Zero Jargon)',
    labelGu: 'સરળ શૈક્ષણિક માર્ગદર્શિકા (બિલકુલ અઘરી ભાષા વગર)',
    labelHi: 'सरल शिक्षाप्रद गाइड (बिना किसी जटिल शब्दावली के)',
  },
];

// 7. Which points, examples, comparisons, or calculations deserve more emphasis?
export const QUESTION_EMPHASIS: QuestionnaireOption[] = [
  {
    value: 'Cost of Delay calculation: Waiting 5 years reduces wealth by ₹40 Lakhs+',
    label: 'Cost of Delay Calculation (Waiting 5 yrs penalty)',
    labelGu: 'વિલંબનું નુકસાન: ૫ વર્ષ રાહ જોવાથી ₹૪૦ લાખનું નુકસાન',
    labelHi: 'देरी का नुकसान: 5 साल टालने पर ₹40 लाख+ का नुकसान',
  },
  {
    value: 'Real impact of 7% inflation on ₹1 Crore purchasing power over 20 years',
    label: 'Inflation Impact (₹1 Cr purchasing power drop)',
    labelGu: 'મોંઘવારીની વાસ્તવિકતા: ૨૦ વર્ષમાં ₹૧ કરોડનું ઘટતું મૂલ્ય',
    labelHi: 'महंगाई का असर: 20 साल में ₹1 करोड़ की घटती क्रयशक्ति',
  },
  {
    value: 'Term Insurance + Mutual Fund SIP vs Traditional Endowment / Money-back plan',
    label: 'Term + SIP vs Traditional Endowment Comparison',
    labelGu: 'ટર્મ + SIP વિરુદ્ધ પરંપરાગત એન્ડોવમેન્ટ પોલિસી સરખામણી',
    labelHi: 'टर्म + SIP बनाम पारंपरिक एंडोवमेंट पॉलिसी तुलना',
  },
  {
    value: 'Base Health Insurance vs 1 Crore Super Top-up cost-benefit analysis',
    label: 'Base Mediclaim vs ₹1 Cr Super Top-Up Math',
    labelGu: 'બેઝ મેડિક્લેમ વિરુદ્ધ ₹૧ કરોડ સુપર ટોપ-અપ સરખામણી',
    labelHi: 'बेस मेडिक्लेम बनाम ₹1 करोड़ सुपर टॉप-अप विश्लेषण',
  },
  {
    value: 'Power of Compounding with Step-Up SIP (increasing 10% each year)',
    label: 'Power of Compounding with 10% Step-Up SIP',
    labelGu: 'ચક્રવૃદ્ધિની તાકાત અને દર વર્ષે ૧૦% સ્ટેપ-અપ SIP',
    labelHi: 'कंपाउंडिंग की ताकत और 10% स्टेप-अप SIP',
  },
  {
    value: 'Cashless hospitalization claims process and family peace of mind',
    label: 'Cashless Hospitalization Claims & Peace of Mind',
    labelGu: 'કેશલેસ હોસ્પિટલ ક્લેમ પ્રક્રિયા અને માનસિક શાંતિ',
    labelHi: 'कैशलेस अस्पताल क्लेम और मानसिक शांति',
  },
  {
    value: 'Zero Depreciation vs Standard Comprehensive car insurance claim payout',
    label: 'Zero Dep vs Standard Car Insurance Claim Math',
    labelGu: 'ઝીરો ડેપ વિરુદ્ધ સ્ટાન્ડર્ડ કાર ઇન્સ્યોરન્સ ક્લેમ તફાવત',
    labelHi: 'जीरो डेप बनाम साधारण कार बीमा क्लेम अंतर',
  },
  {
    value: 'Home loan prepaying via parallel SIP (clearing 20-year loan in 10 years)',
    label: 'Home Loan Freedom via Parallel SIP',
    labelGu: 'હોમ લોન મુક્તિ: સમાંતર SIP દ્વારા ૨૦ વર્ષની લોન ૧૦ વર્ષમાં પૂર્ણ',
    labelHi: 'होम लोन मुक्ति: पैरेलल SIP से 20 साल का लोन 10 साल में खत्म',
  },
];

// Universal Subject Quick Inspirations for the main text box
export interface PopularTopicInspiration {
  title: string;
  category: string;
  description: string;
  suggestedPrompt: string;
}

export const POPULAR_TOPIC_INSPIRATIONS: PopularTopicInspiration[] = [
  {
    title: 'SIP & Compounding Mastery',
    category: 'Mutual Funds',
    description: 'How small monthly investments compound into Crores with Step-Up SIP.',
    suggestedPrompt: 'Create a client presentation on Systematic Investment Plan (SIP) and the Power of Compounding. Show a 15-year wealth accumulation journey with ₹15,000 monthly investment, 10% annual step-up, inflation impact, and comparison with bank fixed deposits.',
  },
  {
    title: 'Term Life + SIP vs Endowment',
    category: 'Life Insurance',
    description: 'Why separating insurance & investment yields 5x higher wealth and coverage.',
    suggestedPrompt: 'Create a persuasive client presentation comparing Pure Term Insurance + Mutual Fund SIP versus Traditional Endowment / Money-Back policies. Show mathematically how ₹5,000/month split gives ₹1.5 Crore cover plus ₹85 Lakh wealth versus ₹15 Lakh maturity in traditional plans.',
  },
  {
    title: '₹1 Crore Super Top-up Mediclaim',
    category: 'Health Insurance',
    description: 'Cover catastrophic medical inflation for family at fraction of cost.',
    suggestedPrompt: 'Create a presentation explaining why a family of 4 needs a ₹1 Crore Super Top-up Health Insurance. Explain deductible concept, corporate cover limitations, organ transplants and modern cancer treatment costs in India, and cashless hospitalization peace of mind.',
  },
  {
    title: 'Car & Motor Zero Depreciation',
    category: 'Vehicle Insurance',
    description: 'Why standard car insurance leaves owners with 40% out-of-pocket bills.',
    suggestedPrompt: 'Create a practical presentation on Car & Motor Insurance: Zero Depreciation vs Comprehensive policy. Compare bumper-to-bumper claim settlements, plastic/metal depreciation deductions, engine protection cover, return to invoice, and No Claim Bonus (NCB) protection.',
  },
  {
    title: 'Retirement Freedom at 55',
    category: 'Retirement',
    description: 'Creating an inflation-proof monthly pension via Systematic Withdrawal (SWP).',
    suggestedPrompt: 'Create a retirement planning presentation for a 40-year-old wanting to retire by 55. Calculate required retirement corpus factoring in 7% inflation, life expectancy of 85 years, medical reserves, and how an SWP generates tax-efficient monthly income without eroding capital.',
  },
  {
    title: 'Child Higher Education Corpus',
    category: 'Children Future',
    description: 'Targeting ₹50 Lakhs for engineering/MBA/abroad degrees in 12-15 years.',
    suggestedPrompt: 'Create a presentation for young parents on Child Higher Education Planning. Show current vs future college education costs (10% education inflation), why child ULIPs underperform, and an equity mutual fund roadmap to build a ₹60 Lakh corpus in 14 years.',
  },
  {
    title: 'Home Loan Freedom via SIP',
    category: 'Loans & Debt',
    description: 'Recover 100% of your home loan interest through a parallel 0.15% SIP.',
    suggestedPrompt: 'Create an eye-opening presentation on How to Make Your Home Loan Effectively Free. Show that starting a monthly SIP equal to 15% of the home loan EMI in equity funds accumulates more than the entire interest paid to the bank over a 20-year loan tenure.',
  },
  {
    title: 'Tax Saving: Old vs New Regime',
    category: 'Tax Planning',
    description: 'Optimizing taxes with ELSS 80C, 80D health deduction, and capital gains.',
    suggestedPrompt: 'Create a comprehensive tax planning presentation comparing Old Tax Regime vs New Tax Regime. Cover section 80C via ELSS (3-year lock-in vs 15-year PPF), section 80D health insurance deductions, and ₹1.25 Lakh long-term capital gains (LTCG) tax exemption.',
  },
];
