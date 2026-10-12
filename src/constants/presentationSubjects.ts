import { PresentationSubject, PresentationGroupCategory } from '../types/presentationStudio';

export const PRESENTATION_GROUP_LABELS: Record<PresentationGroupCategory, { en: string; gu: string; hi: string }> = {
  wealth: { en: 'Wealth & Mutual Funds', gu: 'સંપત્તિ અને મ્યુચ્યુઅલ ફંડ', hi: 'वेल्थ और म्यूचुअल फंड्स' },
  retirement: { en: 'Retirement & Pension', gu: 'નિવૃત્તિ અને પેન્શન આયોજન', hi: 'रिटायरमेंट और पेंशन' },
  insurance: { en: 'Life & Term Insurance', gu: 'જીવન અને ટર્મ ઈન્સ્યોરન્સ', hi: 'लाइफ और टर्म इंश्योरेंस' },
  tax: { en: 'Tax Optimization', gu: 'ટેક્સ બચત અને પ્લાનિંગ', hi: 'टैक्स बचत और प्लानिंग' },
  children: { en: "Children's Future Planning", gu: 'બાળકોનું ભવિષ્ય અને અભ્યાસ', hi: 'बच्चों का भविष्य और शिक्षा' },
  borrowing: { en: 'Loans & Real Estate', gu: 'લોન, વ્યાજ અને રિયલ એસ્ટેટ', hi: 'लोन और रियल एस्टेट' },
  estate: { en: 'Estate & Succession', gu: 'વારસાઈ અને એસ્ટેટ પ્લાનિંગ', hi: 'उत्तराधिकार और एस्टेट' },
  nri_hni: { en: 'HNI & NRI Advisory', gu: 'HNI અને NRI ફાઇનાન્સ', hi: 'HNI और NRI एडवाइजरी' },
  fixed_income: { en: 'Fixed Income & Gold', gu: 'ફિક્સ આવક અને ગોલ્ડ', hi: 'फिक्स्ड इनकम और गोल्ड' },
  business: { en: 'Business & Keyman', gu: 'બિઝનેસ અને પ્રોફેશનલ્સ', hi: 'बिजनेस और प्रोफेशनल्स' },
};

export const PRESENTATION_SUBJECTS_LIST: PresentationSubject[] = [
  // 1. SIP (Systematic Investment Plan)
  {
    id: 'sip_mastery',
    title: 'SIP Power: Compounding & Discipline',
    titleGu: 'SIP પાવર: ચક્રવૃદ્ધિ શક્તિ અને નિયમિતતા',
    titleHi: 'एसआईपी की ताकत: कंपाउंडिंग और अनुशासन',
    group: 'wealth',
    iconName: 'TrendingUp',
    shortDesc: 'Why small regular investments beat timing the market through Rupee Cost Averaging.',
    shortDescGu: 'રૂપિયા કોસ્ટ એવરેજિંગ દ્વારા બજારના ઉતાર-ચઢાવને સંપત્તિમાં ફેરવવાની ચાવી.',
    shortDescHi: 'रुपया कॉस्ट एवरेजिंग के जरिए बाजार के उतार-चढ़ाव में वेल्थ क्रिएशन की कला।',
    subcategories: [
      { id: 'sip_power_compounding', title: 'Power of Starting Early (The 10-Year Delay Cost)', description: 'Demonstrating how a 5-year delay can cost up to 50% of the terminal corpus.' },
      { id: 'sip_rupee_cost_averaging', title: 'Rupee Cost Averaging During Market Corrections', description: 'Why falling markets are blessing in disguise for systematic buyers.' },
      { id: 'sip_goal_based', title: 'Goal-Based SIP Architecture', description: 'Tagging individual SIPs with exact life milestones.' },
    ],
  },

  // 2. Step-up SIP
  {
    id: 'step_up_sip',
    title: 'Step-Up / Top-Up SIP Strategy',
    titleGu: 'સ્ટેપ-અપ SIP: વાર્ષિક આવક વૃદ્ધિ સાથે બમણી સંપત્તિ',
    titleHi: 'स्टेप-अप एसआईपी: आय में बढ़ोतरी के साथ दोगुनी वेल्थ',
    group: 'wealth',
    iconName: 'Zap',
    shortDesc: 'Increasing SIP by 10% each year to double your final retirement or milestone corpus.',
    subcategories: [
      { id: 'step_up_annual_10', title: '10% Annual Step-up Compounding Advantage', description: 'Compare flat ₹10k/mo vs 10% annual increment over 20 years.' },
      { id: 'step_up_salary_hike', title: 'Aligning Investment Growth with Salary Increments', description: 'Automating savings increments before lifestyle inflation strikes.' },
    ],
  },

  // 3. Multi-Cap & Flexi-Cap Strategies
  {
    id: 'flexi_cap_funds',
    title: 'Flexi-Cap & Multi-Cap Mutual Funds',
    titleGu: 'ફ્લેક્સી-કેપ અને મલ્ટી-કેપ ફંડ વ્યૂહરચના',
    titleHi: 'फ्लेक्सी-कैप और मल्टी-कैप म्यूचुअल फंड स्ट्रैटेजी',
    group: 'wealth',
    iconName: 'PieChart',
    shortDesc: 'Dynamic asset allocation across Large, Mid, and Small caps for balanced risk-adjusted alpha.',
    subcategories: [
      { id: 'flexi_cap_all_weather', title: 'All-Weather Market Allocation Strategy', description: 'Letting fund managers adjust across market capitalizations.' },
      { id: 'mid_small_cap_blend', title: 'Balancing Core Stability and Satellite Growth', description: 'Combining 65% large-cap core with 35% mid/small-cap growth.' },
    ],
  },

  // 4. Index Investing vs Active Funds
  {
    id: 'index_vs_active',
    title: 'Active Funds vs Index ETFs',
    titleGu: 'એક્ટિવ ફંડ્સ વિરુદ્ધ ઈન્ડેક્સ ફંડ્સ (નિફ્ટી 50)',
    titleHi: 'एक्टिव फंड्स बनाम इंडेक्स फंड्स (निफ्टी 50)',
    group: 'wealth',
    iconName: 'BarChart2',
    shortDesc: 'A factual comparison of tracking error, alpha generation, and expense ratios in India.',
    subcategories: [
      { id: 'index_low_cost', title: 'Low Cost Passive Indexing Principles', description: 'Nifty 50 and Nifty Next 50 fundamentals.' },
      { id: 'active_alpha_midcaps', title: 'Where Active Management Still Outperforms in India', description: 'Mid-cap and small-cap alpha generation evidence.' },
    ],
  },

  // 5. Systematic Withdrawal Plan (SWP)
  {
    id: 'swp_tax_efficient',
    title: 'SWP: Tax-Efficient Monthly Cash Flow',
    titleGu: 'SWP: કર-કાર્યક્ષમ નિયમિત પેન્શન અને માસિક આવક',
    titleHi: 'SWP: टैक्स-एफिशिएंट नियमित मासिक पेंशन और कैश फ्लो',
    group: 'wealth',
    iconName: 'ArrowDownCircle',
    shortDesc: 'Generating monthly cash flows superior to bank FDs with lower capital gains tax leakage.',
    subcategories: [
      { id: 'swp_vs_fd_tax', title: 'SWP vs Traditional Bank FD Interest Tax Drag', description: 'Compare 30% slab FD tax vs 12.5% equity LTCG on capital portion only.' },
      { id: 'swp_corpus_preservation', title: 'Sustainable 6% - 8% Withdrawal Rates', description: 'Withdrawing without eroding capital over 25+ retirement years.' },
    ],
  },

  // 6. Asset Allocation & Rebalancing
  {
    id: 'asset_allocation_rules',
    title: 'Asset Allocation & Portfolio Rebalancing',
    titleGu: 'એસેટ એલોકેશન અને પોર્ટફોલિયો રિબેલેન્સિંગ',
    titleHi: 'एसेट एलोकेशन और पोर्टफोलियो रीबैलेंसिंग',
    group: 'wealth',
    iconName: 'Sliders',
    shortDesc: 'The proven rule: asset allocation drives 90% of returns, not individual stock picking.',
    subcategories: [
      { id: 'rebalancing_equity_debt', title: 'Annual Rebalancing to Lock Profits', description: 'Taking gains from high-flying equity into debt and vice versa.' },
      { id: 'age_based_allocation', title: 'Age & Risk Tailored Equity/Debt/Gold Splits', description: 'Creating bulletproof 60:30:10 or 70:20:10 portfolios.' },
    ],
  },

  // 7. Small-Cap Investing & Volatility Management
  {
    id: 'small_cap_volatility',
    title: 'Small-Cap Investing: High Growth & Risk Control',
    titleGu: 'સ્મોલ-કેપ રોકાણ: ઊંચી વૃદ્ધિ અને જોખમ નિયંત્રણ',
    titleHi: 'स्मॉल-कैप निवेश: उच्च रिटर्न और जोखिम नियंत्रण',
    group: 'wealth',
    iconName: 'Award',
    shortDesc: 'Navigating long-term multi-bagger small caps without panicking during market drawdowns.',
    subcategories: [
      { id: 'small_cap_time_horizon', title: 'Why Small Caps Need 7+ Years Horizon', description: 'Historical 5-year rolling returns vs short-term noise.' },
      { id: 'sip_in_small_caps', title: 'SIP vs Lumpsum in High Beta Categories', description: 'Smoothening volatile cycles through systematic allocation.' },
    ],
  },

  // 8. Emergency Fund Architecture
  {
    id: 'emergency_fund_setup',
    title: 'Emergency Fund: The Financial Shock Absorber',
    titleGu: 'ઇમરજન્સી ફંડ: આકસ્મિક સંકટ સામે અભેદ્ય કવચ',
    titleHi: 'इमरजेंसी फंड: आपातकालीन संकट में सुरक्षा ढाल',
    group: 'wealth',
    iconName: 'ShieldAlert',
    shortDesc: 'Why keeping 6–12 months of mandatory expenses in liquid funds prevents debt and panic selling.',
    subcategories: [
      { id: 'emergency_size_calculation', title: 'Calculating Realistic 6-Month Burn Rate', description: 'Including EMIs, insurance premiums, utilities, and grocery.' },
      { id: 'parking_liquid_funds', title: 'Where to Park: Liquid Funds vs Savings Account', description: 'Instant redemption T+0 features with better post-tax returns.' },
    ],
  },

  // 9. Retirement Planning & Corpus Calculation
  {
    id: 'retirement_corpus_math',
    title: 'Retirement Planning: Living 30 Years With Dignity',
    titleGu: 'નિવૃત્તિ આયોજન: ફુગાવા સામે ૩૦ વર્ષનું ગૌરવપૂર્ણ જીવન',
    titleHi: 'रिटायरमेंट प्लानिंग: महंगाई के खिलाफ 30 साल की आत्मनिर्भरता',
    group: 'retirement',
    iconName: 'Clock',
    shortDesc: 'Inflation-adjusted retirement roadmap ensuring you never outlive your money.',
    subcategories: [
      { id: 'retirement_inflation_drag', title: 'The Silent Killer: 7% Healthcare & Lifestyle Inflation', description: 'How ₹50,000/mo today becomes ₹2,00,000/mo in 20 years.' },
      { id: 'target_corpus_formula', title: 'Calculating Your Target Corpus (25x - 30x Rule)', description: 'Step-by-step corpus estimation based on current living standards.' },
    ],
  },

  // 10. NPS (National Pension System)
  {
    id: 'nps_architecture',
    title: 'NPS Tier 1 & 2: Pension + Triple Tax Benefit',
    titleGu: 'NPS: વધારાનો ટેક્સ લાભ અને પેન્શન આયોજન',
    titleHi: 'एनपीएस: अतिरिक्त टैक्स बचत और सुरक्षित पेंशन',
    group: 'retirement',
    iconName: 'Landmark',
    shortDesc: 'Optimizing the additional ₹50,000 deduction under 80CCD(1B) and low expense ratios.',
    subcategories: [
      { id: 'nps_tax_saving_80ccd', title: 'Section 80CCD(1B) Exclusive ₹50,000 Benefit', description: 'Instant ₹15,600+ tax saving for 30% slab earners.' },
      { id: 'nps_asset_choice', title: 'Active Choice (75% Equity) vs Auto Life Cycle', description: 'Maximizing long term equity exposure in retirement funds.' },
    ],
  },

  // 11. Early Retirement & FIRE Movement
  {
    id: 'fire_financial_independence',
    title: 'FIRE: Financial Independence, Retire Early',
    titleGu: 'FIRE વ્યૂહરચના: ૪૫ વર્ષે નાણાકીય આઝાદી અને નિવૃત્તિ',
    titleHi: 'FIRE रणनीति: 45 की उम्र में वित्तीय आजादी और रिटायरमेंट',
    group: 'retirement',
    iconName: 'Flame',
    shortDesc: 'A systematic framework to achieve financial freedom by age 40 to 50.',
    subcategories: [
      { id: 'fire_savings_rate', title: 'High Savings Rate (50%+ Cash Flow Allocation)', description: 'Cutting wasteful lifestyle bloat to accelerate compounding.' },
      { id: 'passive_income_streams', title: 'Building 3 Parallel Passive Cash Flow Engines', description: 'Dividends, SWP, and rental yield architecture.' },
    ],
  },

  // 12. Senior Citizen Financial Blueprint
  {
    id: 'senior_citizen_planning',
    title: 'Senior Citizen Cash Flow & Capital Safety',
    titleGu: 'સિનિયર સિટીઝન ફાઇનાન્સ: મૂડી સુરક્ષા અને નિયમિત આવક',
    titleHi: 'सीनियर सिटीजन फाइनेंस: पूंजी सुरक्षा और नियमित मासिक आय',
    group: 'retirement',
    iconName: 'Shield',
    shortDesc: 'Balancing SCSS, PMVVY alternatives, debt mutual funds, and medical reserves for retirees.',
    subcategories: [
      { id: 'scss_vs_debt_funds', title: 'SCSS (Senior Citizen Savings Scheme) Comparison', description: 'Evaluating 8.2% guaranteed return against liquidity constraints.' },
      { id: 'health_contingency_fund', title: 'Segregating Medical Corpus from Living Corpus', description: 'Preventing unexpected hospital bills from disturbing cash flow.' },
    ],
  },

  // 13. Pure Term Insurance
  {
    id: 'term_life_insurance',
    title: 'Pure Term Life Insurance: 100x Income Shield',
    titleGu: 'પ્યોર ટર્મ ઇન્સ્યોરન્સ: પરિવાર માટે ૧૦૦ ગણી સુરક્ષા',
    titleHi: 'प्योर टर्म इंश्योरेंस: परिवार के लिए मजबूत वित्तीय सुरक्षा',
    group: 'insurance',
    iconName: 'ShieldCheck',
    shortDesc: 'Why ₹1 Crore to ₹3 Crore pure term cover is mandatory for every earning breadwinner.',
    subcategories: [
      { id: 'term_cover_calculation', title: 'Human Life Value (HLV) Calculation Formula', description: 'Covering 15x-20x annual income plus all outstanding loans.' },
      { id: 'term_vs_endowment', title: 'Term Insurance vs Traditional Endowment LIC Policies', description: 'Separate insurance from investment: buy term, invest difference in SIP.' },
    ],
  },

  // 14. MWP Act (Married Women Property Act)
  {
    id: 'mwp_act_protection',
    title: 'MWP Act 1874: Creditor-Proof Life Insurance',
    titleGu: 'MWP એક્ટ: દેવાદારો અને બેંકથી સુરક્ષિત પોલિસી',
    titleHi: 'MWP एक्ट: लेनदारों और कोर्ट से सुरक्षित जीवन बीमा',
    group: 'insurance',
    iconName: 'Lock',
    shortDesc: 'Protecting term insurance proceeds strictly for wife and children, legally immune from creditors.',
    subcategories: [
      { id: 'mwp_business_protection', title: 'Why Every Business Owner Needs MWP Endorsement', description: 'Ensuring family retains 100% claim payout even during business liquidation.' },
      { id: 'mwp_beneficiary_rules', title: 'Non-Attachable Trust Creation Simplified', description: 'Irrevocable designation of wife and children as sole trustees and beneficiaries.' },
    ],
  },

  // 15. Comprehensive Health Insurance
  {
    id: 'health_mediclaim_guide',
    title: 'Comprehensive Health Insurance & Super Top-Up',
    titleGu: 'આરોગ્ય વીમો (મેડિક્લેમ) અને સુપર ટોપ-અપ ગાઇડ',
    titleHi: 'हेल्थ इंश्योरेंस (मेडिक्लेम) और सुपर टॉप-अप रणनीति',
    group: 'insurance',
    iconName: 'HeartPulse',
    shortDesc: 'Beating 14% annual medical inflation with modern cashless, no-room-rent capping policies.',
    subcategories: [
      { id: 'super_topup_cost_saving', title: 'Base ₹5L + ₹20L Super Top-up Strategy', description: 'Getting ₹25L total coverage at 40% lower premium than single ₹25L base policy.' },
      { id: 'policy_fine_print', title: 'Crucial Clauses: No Room Rent Capping & No Co-pay', description: 'Avoiding proportionate deduction traps during hospital billing.' },
    ],
  },

  // 16. Critical Illness & Disability Riders
  {
    id: 'critical_illness_cover',
    title: 'Critical Illness & Disability Protection',
    titleGu: 'ક્રિટિકલ ઇલનેસ કવર: કેન્સર, હાર્ટ એટેક સામે લમ્પસમ સહાય',
    titleHi: 'क्रिटिकल इलनेस कवर: गंभीर बीमारी में लम्पसम सुरक्षा',
    group: 'insurance',
    iconName: 'Activity',
    shortDesc: 'Lump-sum payouts upon diagnosis of major illnesses to cover lifestyle loss and income cessation.',
    subcategories: [
      { id: 'mediclaim_vs_critical', title: 'How Critical Illness Differs from Standard Mediclaim', description: 'Mediclaim pays hospital bills; critical illness replaces lost salary during recuperation.' },
      { id: 'top_critical_conditions', title: 'Coverage for Heart Attack, Stroke, Cancer & Renal Failure', description: 'Ensuring financial survival when working becomes impossible.' },
    ],
  },

  // 17. Old vs New Tax Regime
  {
    id: 'tax_regime_comparison',
    title: 'New vs Old Tax Regime: Which Saves More?',
    titleGu: 'જૂની વિરુદ્ધ નવી ટેક્સ વ્યવસ્થા: કઈ સૌથી વધુ કર બચાવશે?',
    titleHi: 'न्यू बनाम ओल्ड टैक्स रिजीम: किसमें होगी सबसे ज्यादा बचत?',
    group: 'tax',
    iconName: 'Receipt',
    shortDesc: 'A transparent mathematical breakdown comparing deductions vs concessional tax slabs.',
    subcategories: [
      { id: 'tax_breakeven_math', title: 'The ₹3.75 Lakh Deduction Breakeven Threshold', description: 'When to choose Old Regime (80C, 80D, HRA, Home Loan) vs New 115BAC.' },
      { id: 'salaried_tax_optim', title: 'Year-End Restructuring for Salaried & Professionals', description: 'Balancing Standard Deduction, NPS, and home loan interest.' },
    ],
  },

  // 18. ELSS Mutual Funds
  {
    id: 'elss_tax_saving_mastery',
    title: 'ELSS: 3-Year Lock-In with Equity Growth',
    titleGu: 'ELSS મ્યુચ્યુઅલ ફંડ: ૩ વર્ષનો લોક-ઇન અને ટેક્સ બચત',
    titleHi: 'ईएलएसएस म्यूचुअल फंड्स: 3 साल का लॉक-इन और इक्विटी ग्रोथ',
    group: 'tax',
    iconName: 'PiggyBank',
    shortDesc: 'Comparing ELSS with PPF and Tax FD: why the shortest lock-in generates maximum wealth.',
    subcategories: [
      { id: 'elss_vs_ppf_fd', title: 'ELSS (3 Yrs) vs Tax FD (5 Yrs) vs PPF (15 Yrs)', description: 'Historical 12-14% compounding vs 7.1% fixed return comparison.' },
      { id: 'sip_in_elss', title: 'Systematic Tax Planning Throughout the Financial Year', description: 'Avoiding March panic by spreading Section 80C into 12 easy monthly SIPs.' },
    ],
  },

  // 19. Capital Gains Harvesting & Optimization
  {
    id: 'capital_gains_harvesting',
    title: 'LTCG Tax Harvesting & Exemption Rules',
    titleGu: 'કેપિટલ ગેઇન્સ હાર્વેસ્ટિંગ: વાર્ષિક ₹૧.૨૫ લાખ સુધી ટેક્સ ફ્રી ગેઇન',
    titleHi: 'कैपिटल गेन्स टैक्स हार्वेस्टिंग: टैक्स-फ्री मुनाफे की रणनीति',
    group: 'tax',
    iconName: 'FileSpreadsheet',
    shortDesc: 'Utilizing Section 112A annual ₹1.25 Lakh exemption to legally reset cost acquisition bases.',
    subcategories: [
      { id: 'ltcg_125k_harvesting', title: 'Annual Tax-Free LTCG Profit Booking & Re-investment', description: 'Resetting buy price annually without paying a single rupee of tax.' },
      { id: 'loss_setoff_rules', title: 'Setting Off Short-Term Capital Losses against Long-Term Gains', description: 'Minimizing overall income tax liability legally.' },
    ],
  },

  // 20. Higher Education Planning
  {
    id: 'child_higher_education',
    title: "Child's Higher Education: Beating 10% College Inflation",
    titleGu: 'બાળકના ઉચ્ચ શિક્ષણનું આયોજન: એન્જિનિયરિંગ, મેડિકલ અને MBA',
    titleHi: 'बच्चे की उच्च शिक्षा का नियोजन: कॉलेज और डिग्री फंड',
    group: 'children',
    iconName: 'GraduationCap',
    shortDesc: 'Building a ₹30 Lakh to ₹75 Lakh education fund so your child starts life debt-free.',
    subcategories: [
      { id: 'education_cost_projection', title: 'Future Value of Degrees (MBA, MBBS, Engineering in 2035)', description: 'Factoring in 10% domestic education inflation.' },
      { id: 'equity_to_debt_glidepath', title: 'Target Date Glide-Path (Shifting Equity to Liquid 2 Yrs Prior)', description: 'Preventing sudden market corrections when admission fees are due.' },
    ],
  },

  // 21. Sukanya Samriddhi Yojana (SSY)
  {
    id: 'sukanya_samriddhi_ssy',
    title: 'Sukanya Samriddhi Yojana: Sovereign Guarantee',
    titleGu: 'સુકન્યા સમૃદ્ધિ યોજના: દીકરીના ઉજ્જવળ ભવિષ્ય માટે શ્રેષ્ઠ',
    titleHi: 'सुकन्या समृद्धि योजना: बेटी के भविष्य के लिए सुरक्षित विकल्प',
    group: 'children',
    iconName: 'Heart',
    shortDesc: 'Triple EEE tax exemption with highest sovereign interest rates for girls under 10 years.',
    subcategories: [
      { id: 'ssy_eee_benefit', title: 'EEE Status: Exempt at Deposit, Accrual, and Withdrawal', description: 'Zero tax on maturity corpus at age 21.' },
      { id: 'ssy_plus_equity_blend', title: 'The Winning Combo: 50% SSY + 50% Child Equity Fund', description: 'Balancing government safety with inflation-beating equity wealth.' },
    ],
  },

  // 22. Foreign Education & Dollar Expenses
  {
    id: 'foreign_education_planning',
    title: 'Study Abroad & US/UK Dollar Education Fund',
    titleGu: 'વિદેશ અભ્યાસ પ્લાનિંગ: ડોલર ફુગાવા સામે રોકાણ',
    titleHi: 'विदेश में पढ़ाई का नियोजन: डॉलर और विदेशी मुद्रा हेजिंग',
    group: 'children',
    iconName: 'Globe',
    shortDesc: 'Hedging against 4% rupee depreciation when planning international college education.',
    subcategories: [
      { id: 'currency_depreciation_impact', title: 'Factoring Currency Depreciation into Target Corpus', description: 'Why a $100k degree requires international equity or larger rupee corpus.' },
      { id: 'lrs_rbi_remittance_rules', title: 'LRS (Liberalised Remittance Scheme) & TCS Implications', description: 'Navigating 5% TCS on foreign education remittances.' },
    ],
  },

  // 23. Home Loan Prepayment vs SIP
  {
    id: 'home_loan_vs_sip',
    title: 'Home Loan Prepayment vs Parallel SIP',
    titleGu: 'હોમ લોન પ્રી-પેમેન્ટ વિરુદ્ધ સમાંતર SIP: ક્યાં વધુ ફાયદો?',
    titleHi: 'होम लोन प्री-पेमेंट बनाम पैरेलल एसआईपी: समझदारी भरा चुनाव',
    group: 'borrowing',
    iconName: 'Home',
    shortDesc: 'A mathematical proof: how investing 10% of EMI in an equity SIP can recover 100% of interest.',
    subcategories: [
      { id: 'interest_recovery_sip', title: 'The Zero-Cost Home Loan Blueprint', description: 'Starting a SIP equal to 10-15% of your EMI to fully offset paid interest.' },
      { id: 'prepayment_timing_math', title: 'Prepaying Principal in Initial 5 Years vs Later Stages', description: 'When prepayment makes mathematical sense and when it kills liquidity.' },
    ],
  },

  // 24. Credit Score & CIBIL Optimization
  {
    id: 'cibil_credit_score_repair',
    title: 'CIBIL & Credit Score Optimization (750+ Club)',
    titleGu: 'CIBIL ક્રેડિટ સ્કોર સુધારો: ઓછા વ્યાજ દરે લોનની ચાવી',
    titleHi: 'सिबिल क्रेडिट स्कोर सुधार: कम ब्याज दर पर लोन पाने की कुंजी',
    group: 'borrowing',
    iconName: 'Gauge',
    shortDesc: 'How a 780+ CIBIL score saves ₹5 Lakhs to ₹12 Lakhs on home loan interest rates.',
    subcategories: [
      { id: 'credit_utilization_ratio', title: 'Keeping Credit Utilization Below 30%', description: 'The fastest levers to jump from 680 to 760+.' },
      { id: 'handling_errors_settlements', title: 'Resolving Disputed Defaults and Settlement Tags', description: 'Why settled accounts hurt your borrowing credibility for 7 years.' },
    ],
  },

  // 25. Debt Snowball vs Avalanche
  {
    id: 'debt_freedom_framework',
    title: 'Debt-Free Roadmap: Snowball vs Avalanche',
    titleGu: 'દેવા મુક્તિ અભિયાન: સ્નોબોલ વિરુદ્ધ એવાલાંચ પદ્ધતિ',
    titleHi: 'कर्ज मुक्ति का रोडमैप: स्नोबॉल बनाम एवलांच रणनीति',
    group: 'borrowing',
    iconName: 'CreditCard',
    shortDesc: 'Eliminating expensive credit card balances and personal loans step-by-step.',
    subcategories: [
      { id: 'avalanche_high_interest', title: 'Avalanche Method: Attacking 36-42% Credit Card Debts', description: 'Minimizing total interest outflow mathematically.' },
      { id: 'debt_consolidation_options', title: 'Consolidating High-Interest Debt into Lower Rate Facilities', description: 'Replacing multiple unsecured loans with a single structured plan.' },
    ],
  },

  // 26. Sovereign Gold Bonds (SGB) vs Digital Gold
  {
    id: 'sgb_gold_strategy',
    title: 'Sovereign Gold Bonds (SGB) & Gold Allocation',
    titleGu: 'સોવરિન ગોલ્ડ બોન્ડ (SGB): ૨.૫% વ્યાજ અને ટેક્સ ફ્રી રિટર્ન',
    titleHi: 'सॉवरेन गोल्ड बॉन्ड्स (SGB): 2.5% अतिरिक्त ब्याज और टैक्स-फ्री सोना',
    group: 'fixed_income',
    iconName: 'Coins',
    shortDesc: 'Why SGBs and Gold ETFs beat physical jewelry making charges and storage lockers.',
    subcategories: [
      { id: 'sgb_tax_free_maturity', title: 'Zero Capital Gains Tax on 8-Year Maturity', description: 'The only gold investment with government-backed 2.5% annual coupon.' },
      { id: 'gold_allocation_percentage', title: 'Maintaining 5% to 10% Gold as Portfolio Crisis Hedge', description: 'Portfolio performance during geo-political shocks and market crashes.' },
    ],
  },

  // 27. Public Provident Fund (PPF)
  {
    id: 'ppf_sovereign_safety',
    title: 'PPF: The Sovereign 15-Year Wealth Pillar',
    titleGu: 'PPF (પબ્લિક પ્રોવિડન્ટ ફંડ): ૧૫ વર્ષનું સલામત રોકાણ',
    titleHi: 'पीपीएफ (पब्लिक प्रॉविडेंट फंड): 15 साल का सुरक्षित निवेश स्तंभ',
    group: 'fixed_income',
    iconName: 'Shield',
    shortDesc: 'Guaranteed government interest with EEE tax exemption and legal court immunity.',
    subcategories: [
      { id: 'ppf_extension_rules', title: 'Extending PPF in 5-Year Blocks with / without Contribution', description: 'Creating tax-free withdrawal pipelines in retirement.' },
      { id: 'ppf_attachment_immunity', title: 'Immunity from Court Attachment & Creditor Claims', description: 'The absolute safest debt instrument in Indian jurisprudence.' },
    ],
  },

  // 28. Corporate Fixed Deposits & High Yield Bonds
  {
    id: 'corporate_bonds_fd',
    title: 'Corporate FDs & AAA Rated Bonds',
    titleGu: 'કોર્પોરેટ FD અને બોન્ડ્સ: બેંક કરતા ૧-૨% વધુ વ્યાજ',
    titleHi: 'कॉर्पोरेट एफडी और बॉन्ड्स: बैंक से 1-2% ज्यादा रिटर्न',
    group: 'fixed_income',
    iconName: 'TrendingUp',
    shortDesc: 'Selecting CRISIL / ICRA AAA-rated corporate issuers to safely enhance fixed yield.',
    subcategories: [
      { id: 'credit_rating_safeguards', title: 'Why Only AAA and AA+ Issuers Must Be Selected', description: 'Avoiding default traps in sub-investment grade company papers.' },
      { id: 'taxation_of_bond_yields', title: 'Post-Tax Yield Realities for High Tax Bracket Investors', description: 'Comparing corporate FD interest vs arbitrage funds.' },
    ],
  },

  // 29. RBI Floating Rate Savings Bonds
  {
    id: 'rbi_floating_bonds',
    title: 'RBI Floating Rate Savings Bonds (FRSB)',
    titleGu: 'RBI ફ્લોટિંગ રેટ બોન્ડ્સ: નેશનલ સેવિંગ્સ સિક્યોરિટી',
    titleHi: 'आरबीआई फ्लोटिंग रेट बॉन्ड्स: 100% सरकारी सुरक्षा',
    group: 'fixed_income',
    iconName: 'Landmark',
    shortDesc: '100% sovereign safety offering 35 bps spread over prevailing National Savings Certificate rate.',
    subcategories: [
      { id: 'rbi_interest_rate_reset', title: 'Semi-Annual Coupon Reset Linked to NSC Rate', description: 'Automatic upward adjustment when market interest rates rise.' },
      { id: 'suitability_for_retirees', title: 'Ideal Safe Income Bucket for Ultra-Conservative Seniors', description: 'Zero default risk with sovereign backing.' },
    ],
  },

  // 30. Will Drafting & Estate Planning
  {
    id: 'will_drafting_estate',
    title: 'Will Drafting: Protecting Your Family Legacy',
    titleGu: 'વિલ (વસિયતનામું) આયોજન: પરિવારમાં વિવાદ મુક્ત વારસો',
    titleHi: 'वसीयत (विल) और उत्तराधिकार: विवाद-मुक्त संपत्ति हस्तांतरण',
    group: 'estate',
    iconName: 'FileText',
    shortDesc: 'Ensuring your assets pass seamlessly to rightful heirs without painful legal disputes.',
    subcategories: [
      { id: 'nomination_vs_will', title: 'Nominee vs Legal Heir: The Critical Difference', description: 'Why a nominee is merely a custodian, not the ultimate legal owner.' },
      { id: 'drafting_registration_tips', title: 'Drafting an Unambiguous Will & Medical Fitness Certificate', description: 'Preventing family contention and probate delays.' },
    ],
  },

  // 31. Family Living Trust
  {
    id: 'private_family_trust',
    title: 'Private Family Trusts: Asset Protection & Succession',
    titleGu: 'પ્રાઇવેટ ફેમિલી ટ્રસ્ટ: સંપત્તિ સંરક્ષણ અને સુરક્ષિત વારસો',
    titleHi: 'प्राइवेट फैमिली ट्रस्ट: संपत्ति सुरक्षा और पारिवारिक उत्तराधिकार',
    group: 'estate',
    iconName: 'Lock',
    shortDesc: 'Ring-fencing wealth from litigation, business insolvency, and marital breakdowns.',
    subcategories: [
      { id: 'trust_ring_fencing', title: 'Separating Personal Wealth from Business Liabilities', description: 'Creating an unbreachable protective legal wall.' },
      { id: 'special_child_protection', title: 'Providing for Dependents with Special Needs or Minor Children', description: 'Appointing institutional trustees for uninterrupted care.' },
    ],
  },

  // 32. Joint Holding & Transmission of Assets
  {
    id: 'asset_transmission_smooth',
    title: 'Joint Holdings & Smooth Transmission',
    titleGu: 'સંયુક્ત ખાતા અને નોમિનેશન: સરળ ટ્રાન્સમિશન પ્રક્રિયા',
    titleHi: 'जॉइंट होल्डिंग और नामांकन: आसान संपत्ति हस्तांतरण',
    group: 'estate',
    iconName: 'Users',
    shortDesc: 'Structuring Either or Survivor holdings and updating KYC/MF Central records across all folios.',
    subcategories: [
      { id: 'either_or_survivor_rule', title: 'Either or Survivor Clauses on All Bank & Demat Accounts', description: 'Preventing frozen accounts during emotional crises.' },
      { id: 'mf_central_nominee_audit', title: 'Complete Multi-Folio Centralized Nomination Audit', description: 'Ensuring 100% of mutual funds, insurance, and bank accounts are registered.' },
    ],
  },

  // 33. NRI Investment in India (NRE / NRO)
  {
    id: 'nri_investment_nre_nro',
    title: 'NRI Investing in India: NRE / NRO Architecture',
    titleGu: 'NRI રોકાણ માર્ગદર્શિકા: NRE/NRO ખાતા દ્વારા ભારતમાં સંપત્તિ',
    titleHi: 'एनआरआई निवेश गाइड: NRE/NRO के जरिए भारत में ग्रोथ',
    group: 'nri_hni',
    iconName: 'Globe',
    shortDesc: 'Helping non-resident Indians capitalize on India’s multi-trillion dollar growth story.',
    subcategories: [
      { id: 'nre_vs_nro_taxation', title: 'NRE (Tax-Free Repatriable) vs NRO (Local Income) Accounts', description: 'Tax residency rules and TDS optimization under DTAA.' },
      { id: 'nri_mutual_fund_kyc', title: 'Simplified NRI Mutual Fund KYC & In-Country Management', description: 'Navigating FATCA/CRS compliance for US/Canada/Gulf investors.' },
    ],
  },

  // 34. HNI Family Office & Multi-Asset Allocation
  {
    id: 'hni_family_office',
    title: 'HNI Multi-Asset Wealth & Capital Preservation',
    titleGu: 'HNI ફેમિલી ઓફિસ: મલ્ટી-એસેટ વેલ્થ અને મૂડી સંરક્ષણ',
    titleHi: 'एचएनआई वेल्थ मैनेजमेंट: मल्टी-एसेट एलोकेशन और ग्रोथ',
    group: 'nri_hni',
    iconName: 'Award',
    shortDesc: 'Structuring ₹5 Crore+ portfolios across Equities, Private Debt, PMS/AIF, and Offshore assets.',
    subcategories: [
      { id: 'pms_aif_vs_mutual_funds', title: 'PMS / Category II & III AIFs vs Classic Mutual Funds', description: 'Evaluating concentrated risk, hurdle rates, and high fee drag.' },
      { id: 'downside_risk_hedging', title: 'Downside Protection Strategies for High Net Worth Families', description: 'Preserving generational wealth against tail-risk events.' },
    ],
  },

  // 35. Keyman Insurance for Businesses
  {
    id: 'keyman_insurance_business',
    title: 'Keyman Insurance: Protecting Business Continuity',
    titleGu: 'કીમેન ઇન્સ્યોરન્સ: બિઝનેસ પાર્ટનર અને મુખ્ય વ્યક્તિ સુરક્ષા',
    titleHi: 'कीमैन इंश्योरेंस: बिजनेस की निरंतरता और वित्तीय सुरक्षा',
    group: 'business',
    iconName: 'Briefcase',
    shortDesc: 'Protecting private limited companies and partnerships against the demise of critical leaders.',
    subcategories: [
      { id: 'keyman_business_deduction', title: 'Tax Deductibility of Premium as Legitimate Business Expense', description: 'Offsetting corporate income tax under Section 37(1).' },
      { id: 'loan_repayment_protection', title: 'Safeguarding Bank Overdrafts & Corporate Guarantees', description: 'Preventing bank recalls of credit lines upon founder loss.' },
    ],
  },

  // 36. Partnership & Buy-Sell Agreement Funding
  {
    id: 'partnership_buy_sell',
    title: 'Partnership Buy-Sell Agreement Funding',
    titleGu: 'ભાગીદારી પેઢી બાય-સેલ એગ્રીમેન્ટ: વિવાદ રહિત સમાધાન',
    titleHi: 'पार्टनरशिप बाय-सेल एग्रीमेंट: विवाद-रहित समाधान',
    group: 'business',
    iconName: 'Users',
    shortDesc: 'Cross-insurance funding to enable surviving partners to buy out deceased partner’s shares.',
    subcategories: [
      { id: 'cross_purchase_funding', title: 'Cross-Purchase Insurance Mechanism', description: 'Providing instant cash to surviving partners without selling firm assets.' },
      { id: 'fair_market_valuation_clause', title: 'Valuation Formula & Pre-Agreed Buyout Mechanics', description: 'Preventing legal entanglements with surviving family members.' },
    ],
  },

  // 37. Financial Planning for Doctors & Medical Clinics
  {
    id: 'doctors_clinic_wealth',
    title: 'Wealth & Liability Blueprint for Medical Doctors',
    titleGu: 'ડોક્ટર્સ અને ક્લિનિક ઓનર્સ માટે સ્પેશિયલ ફાઇનાન્સ પ્લાનિંગ',
    titleHi: 'डॉक्टर्स और क्लिनिक मालिकों के लिए विशेष वित्तीय ब्लूप्रिंट',
    group: 'business',
    iconName: 'HeartPulse',
    shortDesc: 'Custom planning for medical practitioners managing irregular fee flows and malpractice risks.',
    subcategories: [
      { id: 'professional_indemnity_cover', title: 'Professional Indemnity Insurance Integration', description: 'Protecting personal assets against consumer court and malpractice claims.' },
      { id: 'clinic_equipment_depreciation_tax', title: 'Equipment Depreciation & Medical Surplus SIP Strategy', description: 'Deploying hospital cash flow into tax-efficient wealth compounding.' },
    ],
  },

  // 38. Corporate Gratuity Trust Structuring
  {
    id: 'corporate_gratuity_trust',
    title: 'Corporate Gratuity Trust & Employee Retention',
    titleGu: 'કોર્પોરેટ ગ્રેચ્યુઇટી ટ્રસ્ટ: કર્મચારી સુરક્ષા અને ટેક્સ છૂટ',
    titleHi: 'कॉर्पोरेट ग्रैच्युटी ट्रस्ट: टैक्स छूट और बेहतर फंड मैनेजमेंट',
    group: 'business',
    iconName: 'Landmark',
    shortDesc: 'Funding statutory gratuity liabilities through approved trusts to obtain corporate tax deductions.',
    subcategories: [
      { id: 'gratuity_acturial_funding', title: 'Actuarial Valuation Compliance & Corporation Tax Deduction', description: 'Transforming future liability into tax-deductible current expense.' },
      { id: 'group_gratuity_yield', title: 'Earning Higher Yields on Gratuity Corpus', description: 'Beating typical low-yield bank deposits with structured group funds.' },
    ],
  },

  // 39. REITs (Real Estate Investment Trusts)
  {
    id: 'reits_commercial_real_estate',
    title: 'REITs: Fractional Commercial Real Estate',
    titleGu: 'REITs: નાના રોકાણમાં કમર્શિયલ રિયલ એસ્ટેટ અને નિયમિત ભાડું',
    titleHi: 'REITs: छोटे निवेश में कमर्शियल रियल एस्टेट और नियमित किराया',
    group: 'wealth',
    iconName: 'Home',
    shortDesc: 'Participating in Grade-A office parks with liquid demat units and quarterly dividend payouts.',
    subcategories: [
      { id: 'reit_dividend_yield_growth', title: '6-7% Dividend Yield + Long Term Capital Appreciation', description: 'Quarterly distributions backed by MNC lease contracts.' },
      { id: 'reit_vs_physical_flat', title: 'REITs vs Buying a Physical Rental Flat', description: 'Zero tenant disputes, zero maintenance headaches, and instant liquidity.' },
    ],
  },

  // 40. Rent vs Buy: The Real Estate Math
  {
    id: 'rent_vs_buy_decision',
    title: 'Rent vs Buy: An Unbiased Financial Analysis',
    titleGu: 'ભાડે રહેવું કે ઘર ખરીદવું? વાસ્તવિક નાણાકીય સરખામણી',
    titleHi: 'किराए पर रहें या घर खरीदें? निष्पक्ष वित्तीय विश्लेषण',
    group: 'borrowing',
    iconName: 'Building',
    shortDesc: 'Comparing 25-year total net worth of owning a home vs renting and investing EMI differences.',
    subcategories: [
      { id: 'rental_yield_vs_emi_interest', title: '2.5% Rental Yield vs 8.5% Home Loan Interest Rate', description: 'Why living on rent and investing savings often builds 2x larger net worth.' },
      { id: 'emotional_vs_financial_aspect', title: 'When Buying a Home Makes Sense (Lifestyle Stability)', description: 'Balancing psychological security with financial opportunity cost.' },
    ],
  },

  // 41. Wedding & Marriage Milestone Planning
  {
    id: 'child_marriage_fund',
    title: 'Children’s Marriage Fund: Stress-Free Celebrations',
    titleGu: 'બાળકોના લગ્ન પ્રસંગનું આયોજન: ઋણમુક્ત ભવ્ય ઉજવણી',
    titleHi: 'बच्चों के विवाह का वित्तीय नियोजन: तनाव-मुक्त आयोजन',
    group: 'children',
    iconName: 'HeartHandshake',
    shortDesc: 'Planning 10–15 years in advance so family celebrations do not require costly personal loans.',
    subcategories: [
      { id: 'wedding_inflation_budget', title: 'Factoring 8-10% Social Event & Jewelry Inflation', description: 'Realistic budgeting for wedding venues, jewelry, and catering.' },
      { id: 'gold_plus_equity_blend_wedding', title: '50% SGB Gold + 50% Hybrid Mutual Funds', description: 'Securing the gold quantity target alongside growing the cash corpus.' },
    ],
  },

  // 42. Arbitrage Funds: Low-Risk Tax-Friendly Parking
  {
    id: 'arbitrage_funds_parking',
    title: 'Arbitrage Funds: FD Alternative for High Tax Slabs',
    titleGu: 'આર્બિટ્રાજ ફંડ્સ: ૩૦% ટેક્સ સ્લેબ માટે ઉત્તમ ટૂંકા ગાળાનું રોકાણ',
    titleHi: 'आर्बिट्राज फंड्स: 30% टैक्स स्लैब के लिए एफडी का बेहतर विकल्प',
    group: 'wealth',
    iconName: 'Scale',
    shortDesc: 'Enjoying debt-like safety with equity taxation (12.5% LTCG / 20% STCG instead of 30% slab rate).',
    subcategories: [
      { id: 'arbitrage_risk_free_spread', title: 'How Cash-Futures Spread Locks in Risk-Free Returns', description: 'Zero directional equity exposure with market-neutral positioning.' },
      { id: 'tax_arbitrage_advantage', title: 'Net In-Hand Return Comparison vs Bank Fixed Deposit', description: 'Saving up to 1.5% - 2.5% net yield after tax.' },
    ],
  },
];
