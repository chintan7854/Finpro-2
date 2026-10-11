import {
  CreativeThemeDefinition,
  CreativeThemeId,
  FinancialSubjectId,
  ThemePosterData,
} from '../types';

export const CREATIVE_THEMES_LIST: CreativeThemeDefinition[] = [
  {
    id: 'split_comparison',
    indexNumber: '01',
    name: 'Split Screen: Option A vs Option B',
    description: 'Side-by-side head-to-head comparison of two financial paths, decisions, or investment alternatives.',
    category: 'comparison',
    categoryLabel: 'Comparisons',
    iconName: 'Split',
    badge: 'Comparison',
    suggestedPrompt: 'Compare two distinct financial choices side by side with concrete numbers and consequences.',
    colorTheme: 'deep_navy',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'myth_vs_reality',
    indexNumber: '02',
    name: 'Myth vs Reality',
    description: 'Common public misconception on top contrasted with solid factual financial truth below.',
    category: 'comparison',
    categoryLabel: 'Comparisons',
    iconName: 'HelpCircle',
    badge: 'Fact Check',
    suggestedPrompt: 'Bust a dangerous common financial misconception with factual advisory truth.',
    colorTheme: 'crimson_ruby',
    backgroundStyle: 'aurora_mesh',
  },
  {
    id: 'before_after',
    indexNumber: '03',
    name: 'Before vs After Scenario',
    description: 'The stressful chaos of unmanaged money contrasted with the confidence of structured financial planning.',
    category: 'comparison',
    categoryLabel: 'Comparisons',
    iconName: 'ArrowRightLeft',
    badge: 'Transformation',
    suggestedPrompt: 'Contrast the stressful chaos of unmanaged money with the peace of planned finances.',
    colorTheme: 'charcoal_steel',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'checklist_scorecard',
    indexNumber: '04',
    name: 'Checklist / Scorecard',
    description: '4-5 actionable check-points where users self-assess their family readiness with tick marks.',
    category: 'action',
    categoryLabel: 'Action & Checklists',
    iconName: 'CheckSquare',
    badge: 'Self-Check',
    suggestedPrompt: 'Create a 4-point self-assessment audit checklist for financial readiness.',
    colorTheme: 'forest_emerald',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'interactive_poll',
    indexNumber: '05',
    name: 'Interactive Poll / Pick One',
    description: '2 to 4 relatable choices (A, B, C, D) inviting followers to vote and reply on WhatsApp.',
    category: 'mindset',
    categoryLabel: 'Engagement',
    iconName: 'Vote',
    badge: 'High Engagement',
    suggestedPrompt: 'Offer 4 clear relatable choices to spark WhatsApp replies and consultations.',
    colorTheme: 'electric_indigo',
    backgroundStyle: 'wealth_constellation',
  },
  {
    id: 'step_roadmap',
    indexNumber: '06',
    name: 'Step-by-Step Roadmap',
    description: 'A 3-4 milestone sequential flowchart guiding clients clearly toward their financial milestone.',
    category: 'action',
    categoryLabel: 'Action & Checklists',
    iconName: 'Milestone',
    badge: 'Roadmap',
    suggestedPrompt: 'A simple sequential 3-4 milestone flowchart toward financial security.',
    colorTheme: 'cyber_teal',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'number_breakdown',
    indexNumber: '07',
    name: 'Number Breakdown / Math Proof',
    description: 'One giant hero wealth figure supported by a transparent 3-line mathematical proof.',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'Hash',
    badge: 'Math Proof',
    suggestedPrompt: 'Lead with one giant aspirational wealth corpus and prove how small monthly disciplined steps reach it.',
    colorTheme: 'imperial_gold',
    backgroundStyle: 'wealth_constellation',
  },
  {
    id: 'curiosity_hook',
    indexNumber: '08',
    name: 'Curiosity Hook: Did You Know?',
    description: 'A shocking financial rule or eye-opening statistic framed as an intriguing curiosity hook.',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'Lightbulb',
    badge: 'Curiosity Hook',
    suggestedPrompt: 'Hook readers with an eye-opening statistic or lesser-known compounding/tax law.',
    colorTheme: 'sunset_amber',
    backgroundStyle: 'aurora_mesh',
  },
  {
    id: 'dos_and_donts',
    indexNumber: '09',
    name: "Dos and Don'ts Card",
    description: 'Clear green checkmarks for wise moves versus red crosses for destructive money blunders.',
    category: 'action',
    categoryLabel: 'Action & Checklists',
    iconName: 'CheckCheck',
    badge: 'Action Rules',
    suggestedPrompt: 'Clear green checkmarks for wise moves versus red crosses for destructive blunders.',
    colorTheme: 'jade_contrast',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'case_study',
    indexNumber: '10',
    name: 'Client Case Study / Story Flow',
    description: 'Problem ➔ Action Taken ➔ Final Result in a compelling 3-phase real life turnaround narrative.',
    category: 'action',
    categoryLabel: 'Action & Checklists',
    iconName: 'TrendingUp',
    badge: 'Case Study',
    suggestedPrompt: 'A 3-stage mini narrative: Real Family Dilemma -> Tailored Strategy -> Life-Changing Outcome.',
    colorTheme: 'sapphire_blue',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'philosophy_quote',
    indexNumber: '11',
    name: 'Mindset / Philosophy Quote',
    description: 'Deep financial wisdom quote that shifts impulsive short-term thinking into patient long-term wealth.',
    category: 'mindset',
    categoryLabel: 'Mindset',
    iconName: 'Quote',
    badge: 'Wisdom',
    suggestedPrompt: 'A timeless quote on wealth, patience, compounding, and financial discipline.',
    colorTheme: 'obsidian_purple',
    backgroundStyle: 'wealth_constellation',
  },
  {
    id: 'cost_of_delay',
    indexNumber: '12',
    name: 'Cost of Delay / Time Impact',
    description: 'Quantifying the massive financial gap created by delaying action today versus waiting for tomorrow.',
    category: 'comparison',
    categoryLabel: 'Comparisons',
    iconName: 'Clock',
    badge: 'Urgent Math',
    suggestedPrompt: 'Quantify the massive financial gap created by delaying an investment by just 5 or 10 years.',
    colorTheme: 'burgundy_wine',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'top_mistakes',
    indexNumber: '13',
    name: 'Top 3 Costly Mistakes',
    description: 'Urgent warning exposing the 3 biggest wealth-destroying mistakes ordinary investors commit.',
    category: 'alerts',
    categoryLabel: 'Alerts & Mistakes',
    iconName: 'AlertTriangle',
    badge: 'Warning',
    suggestedPrompt: 'Highlight the 3 biggest wealth-destroying mistakes retail investors commit.',
    colorTheme: 'danger_vermilion',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'direct_faq',
    indexNumber: '14',
    name: 'Direct Q&A / FAQ Format',
    description: '1 frequently asked burning client question answered with a direct, crisp 2-line practical solution.',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'MessageSquare',
    badge: 'Direct FAQ',
    suggestedPrompt: 'Answer the single most frequent, confusing question clients ask advisors.',
    colorTheme: 'atlantic_cyan',
    backgroundStyle: 'aurora_mesh',
  },
  {
    id: 'golden_rule',
    indexNumber: '15',
    name: 'Golden Rule / Principle of the Week',
    description: 'Timeless core financial principle or formula framed with high-authority presentation.',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'Award',
    badge: 'Core Principle',
    suggestedPrompt: 'Showcase a foundational money law (Rule of 72, 50/30/20, 100 Minus Age).',
    colorTheme: 'luxurious_bronze',
    backgroundStyle: 'minimalist',
  },
  {
    id: 'visual_analogy',
    indexNumber: '16',
    name: 'Visual Analogy / Metaphor',
    description: 'Explaining complex financial mechanisms using everyday relatable life objects (helmet, seeds, fitness).',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'Compass',
    badge: 'Analogy',
    suggestedPrompt: 'Explain an abstract financial mechanism using an unmistakable everyday life object.',
    colorTheme: 'pacific_ocean',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'self_audit',
    indexNumber: '17',
    name: 'Self-Audit / Mirror Question',
    description: 'A deep, thought-provoking mirror question compelling the reader to evaluate their true financial reality.',
    category: 'mindset',
    categoryLabel: 'Mindset',
    iconName: 'UserCheck',
    badge: 'Self-Audit',
    suggestedPrompt: 'Ask a thought-provoking mirror question that makes the reader pause and assess family security.',
    colorTheme: 'amethyst_twilight',
    backgroundStyle: 'aurora_mesh',
  },
  {
    id: 'cheat_sheet',
    indexNumber: '18',
    name: 'Cheat Sheet / Summary Card',
    description: 'A dense, saveable 1-page reference cheat sheet summarizing key rules, ratios, and benchmarks.',
    category: 'education',
    categoryLabel: 'Education & Proofs',
    iconName: 'Layers',
    badge: 'Cheat Sheet',
    suggestedPrompt: 'A saveable, high-density reference sheet with key rules and milestones.',
    colorTheme: 'carbon_monochrome',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'market_psychology',
    indexNumber: '19',
    name: 'Market Psychology / Emotion Cycle',
    description: 'Visual emotional cycle guide helping investors navigate fear, greed, and panic dips with discipline.',
    category: 'mindset',
    categoryLabel: 'Mindset',
    iconName: 'Activity',
    badge: 'Psychology',
    suggestedPrompt: 'Guide investors through fear and greed market dips with steady advisory calm.',
    colorTheme: 'cosmic_slate',
    backgroundStyle: 'wealth_constellation',
  },
  {
    id: 'age_blueprint',
    indexNumber: '20',
    name: 'Timeline / Age-Wise Blueprint',
    description: 'Decade-wise roadmap prioritizing exact financial goals for 20s, 30s, 40s, and 50s.',
    category: 'action',
    categoryLabel: 'Action & Checklists',
    iconName: 'Calendar',
    badge: 'Life Blueprint',
    suggestedPrompt: 'Map out the single most critical financial priority for each decade of life.',
    colorTheme: 'evergreen_moss',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'resource_recommendation',
    indexNumber: '21',
    name: 'Resource Recommendation',
    description: 'High-impact financial habit, mental model, or essential tool recommended by a certified fiduciary.',
    category: 'alerts',
    categoryLabel: 'Alerts & Mistakes',
    iconName: 'BookOpen',
    badge: 'Top Resource',
    suggestedPrompt: 'Recommend a high-impact financial habit, mental model, or classic principle.',
    colorTheme: 'warm_copper',
    backgroundStyle: 'wealth_constellation',
  },
  {
    id: 'urgent_reminder',
    indexNumber: '22',
    name: 'Urgent Reminder / Deadline Alert',
    description: 'Time-critical reminder on key financial deadlines, tax filing, or compounding opportunities.',
    category: 'alerts',
    categoryLabel: 'Alerts & Mistakes',
    iconName: 'Bell',
    badge: 'Urgent Alert',
    suggestedPrompt: 'A time-critical financial deadline reminder that prevents costly regret.',
    colorTheme: 'scarlet_flame',
    backgroundStyle: 'fintech_grid',
  },
  {
    id: 'hidden_cost',
    indexNumber: '23',
    name: 'Hidden Cost / Iceberg Concept',
    description: 'The visible surface cost compared to the enormous submerged hidden costs silently sinking savings.',
    category: 'comparison',
    categoryLabel: 'Comparisons',
    iconName: 'EyeOff',
    badge: 'Iceberg Truth',
    suggestedPrompt: 'Expose the hidden, underwater costs that quietly erode lifetime household savings.',
    colorTheme: 'polar_iceberg',
    backgroundStyle: 'subject_art',
  },
  {
    id: 'advisor_opinion',
    indexNumber: '24',
    name: "Advisor's Personal Take / Unpopular Opinion",
    description: 'A candid, refreshing, bold fiduciary perspective cutting through popular social media myths.',
    category: 'mindset',
    categoryLabel: 'Mindset',
    iconName: 'Megaphone',
    badge: 'Contrarian Take',
    suggestedPrompt: 'Deliver a blunt, refreshing, honest fiduciary truth that social media influencers ignore.',
    colorTheme: 'plum_velvet',
    backgroundStyle: 'aurora_mesh',
  },
  {
    id: 'direct_cta_offer',
    indexNumber: '25',
    name: 'Direct Call-to-Action / Offer Card',
    description: 'A professional, high-trust personal invitation for a confidential 1-on-1 financial portfolio review.',
    category: 'alerts',
    categoryLabel: 'Conversion',
    iconName: 'CalendarCheck',
    badge: 'Direct Invitation',
    suggestedPrompt: 'An open, welcoming, high-trust invitation for a confidential 1-on-1 portfolio review.',
    colorTheme: 'emerald_crown',
    backgroundStyle: 'wealth_constellation',
  },
];

/**
 * Returns dynamic theme-specific financial content with unique variations on every call.
 * Fully supports multilingual content generation (Gujarati, Hindi, English, etc.)
 */
export function getDefaultThemeData(
  themeId: CreativeThemeId,
  subjectId: FinancialSubjectId,
  advisorName: string = 'Financial Advisor',
  advisorPhone: string = '+91 98765 43210',
  variationSeed: number = 0,
  lang: string = 'en',
  customTitle?: string
): ThemePosterData {
  const seed = variationSeed || Math.floor(Math.random() * 1000);
  const variant = seed % 3;

  // Resolve custom subject title if not explicitly passed
  let resolvedSubjectName = customTitle;
  if (!resolvedSubjectName && typeof subjectId === 'string' && subjectId.startsWith('custom_')) {
    try {
      const stored = localStorage.getItem('finadvisor_custom_subjects');
      if (stored) {
        const list = JSON.parse(stored);
        const item = list.find((c: any) => c.id === subjectId);
        if (item) resolvedSubjectName = item.title;
      }
    } catch {
      // ignore
    }
  }

  // Gujarati Language Kit
  if (lang === 'gu') {
    switch (themeId) {
      case 'myth_vs_reality': {
        const guVariants = [
          {
            head: 'નાણાકીય ભ્રમણા vs કડવી વાસ્તવિકતા: આ ભૂલ ક્યારેય ન કરો!',
            sub: 'અધૂરી માહિતી અને અફવાઓ સામાન્ય પરિવારોને લાખો રૂપિયાનું નુકસાન કરાવે છે.',
            mythTitle: '❌ લોકપ્રિય જાહેર ભ્રમણા',
            myth: '"મ્યુચ્યુઅલ ફંડ કે શેરબજારમાં રોકાણ કરવા માટે એકસાથે ₹૫ લાખ જેવી મોટી રકમ જોઈએ."',
            realityTitle: '✅ વાસ્તવિક નાણાકીય સત્ય',
            reality: '"દર મહિને માત્ર ₹૧,૦૦૦ થી ₹૫,૦૦૦ ની શિસ્તબદ્ધ SIP ચક્રવૃદ્ધિ લાભ આપી ૧૫-૨૦ વર્ષમાં કરોડો રૂપિયાનું ભંડોળ બનાવે છે."',
          },
          {
            head: 'બજાર ઘટાડાનો ભ્રમ: મંદી એ ખરેખર સંપત્તિ સર્જનની તક છે!',
            sub: 'બજારના ઉતાર-ચઢાવને સમજનારા જ લાંબા ગાળે સાચા સંપત્તિ સર્જક બને છે.',
            mythTitle: '❌ સામાન્ય ભય અને અફવા',
            myth: '"જ્યારે શેરબજાર ૧૦% ઘટે ત્યારે નુકસાનથી બચવા માટે ચાલુ SIP તરત રોકી દેવી જોઈએ."',
            realityTitle: '✅ અનુભવી સલાહકારનું સત્ય',
            reality: '"બજારનો ઘટાડો એ ડિસ્કાઉન્ટ સેલ છે! ઘટાડામાં SIP વધુ યુનિટ્સ ખરીદે છે, જે ભવિષ્યમાં તમારા વળતરને બમણું કરે છે."',
          },
          {
            head: 'વીમા અંગેની મોટી ગેરસમજ: રોકાણ અને વીમાનું ખોટું મિશ્રણ',
            sub: 'શા માટે પરંપરાગત પોલિસીઓ ઓછું રક્ષણ અને નબળું વળતર આપે છે તે જાણો.',
            mythTitle: '❌ સામાન્ય લોકોની ગેરસમજ',
            myth: '"જે પોલિસીમાં પ્રીમિયમ પાછું મળે અને બોનસ આવે એ જ વીમો સૌથી શ્રેષ્ઠ કહેવાય."',
            realityTitle: '✅ યોગ્ય નાણાકીય આયોજન',
            reality: '"પ્યોર ટર્મ ઇન્સ્યોરન્સ ૧/૧૦ માં ખર્ચે ૨૦ ગણું વધુ કવર આપે છે. બાકીની રકમ ડાઇવર્સિફાઇડ SIP માં રોકવાથી કરોડોનું ભંડોળ બને છે."',
          },
        ];
        const gv = guVariants[variant];
        return {
          headline: gv.head,
          subheadline: gv.sub,
          badgeText: 'મિથ્યા માન્યતા vs વાસ્તવિક સત્ય',
          ctaText: 'સાચું નાણાકીય માર્ગદર્શન મેળવવા આજે જ WhatsApp કરો',
          themeSpecific: {
            mythTitle: gv.mythTitle,
            mythText: gv.myth,
            realityTitle: gv.realityTitle,
            realityText: gv.reality,
          },
        };
      }

      case 'split_comparison': {
        const guSplits = [
          {
            head: 'વિકલ્પ A vs વિકલ્પ B: તમે કયા નાણાકીય માર્ગ પર છો?',
            sub: 'આજે લીધેલો નાનો નિર્ણય આગામી ૧૫ વર્ષમાં કરોડો રૂપિયાનો તફાવત સર્જે છે.',
            lTitle: 'માર્ગ A: વિલંબ અને સામાન્ય વ્યાજ',
            lBullets: ['સામાન્ય ૩-૪% ના ખાતામાં નાણાં જમા પડી રહે છે', 'બજાર ઘટવાની રાહ જોવામાં વર્ષો બગડે છે', 'નિવૃત્તિ સમયે ₹૪૦+ લાખની મોટી અછત સર્જાય છે'],
            rTitle: 'માર્ગ B: દર મહિને શિસ્તબદ્ધ SIP',
            rBullets: ['ઇક્વિટીમાં ઓટોમેટેડ ચક્રવૃદ્ધિ વૃદ્ધિનો લાભ', 'બજારના દરેક ઘટાડામાં યુનિટ્સનો સરેરાશ ફાયદો', 'લક્ષ્યાંક મુજબ ₹૧.૨+ કરોડનું મજબૂત ભંડોળ પ્રાપ્ત'],
          },
          {
            head: 'પરંપરાગત FD vs ઇક્વિટી SIP: ૧૫ વર્ષનું વાસ્તવિક સત્ય',
            sub: 'ટેક્સ અને મોંઘવારી બાદ ફિક્સ્ડ ડિપોઝિટ સામે શિસ્તબદ્ધ રોકાણની સરખામણી.',
            lTitle: 'માર્ગ A: પરંપરાગત ફિક્સ ડિપોઝિટ',
            lBullets: ['ટેક્સ કપાત પહેલાં માત્ર ૬.૫% સામાન્ય વ્યાજ', 'મોંઘવારી બાદ વાસ્તવિક વળતર શૂન્ય સમાન', 'સંપત્તિ ઝડપથી વધવાનો કોઈ અવકાશ નથી'],
            rTitle: 'માર્ગ B: ડાઇવર્સિફાઇડ ઇક્વિટી પોર્ટફોલિયો',
            rBullets: ['ઐતિહાસિક ૧૨-૧૪% લાંબા ગાળાનું મજબૂત CAGR', 'ટેક્સ-કાર્યક્ષમ મૂડી વૃદ્ધિનો મોટો લાભ', 'પરંપરાગત બચત કરતાં ૨.૮ ગણી વધુ સંપત્તિ'],
          },
        ];
        const gv = guSplits[variant % guSplits.length];
        return {
          headline: gv.head,
          subheadline: gv.sub,
          badgeText: 'આમને સામને સરખામણી',
          ctaText: 'તમારા લક્ષ્ય માટે કયો માર્ગ યોગ્ય છે તે જાણવા મેસેજ કરો',
          themeSpecific: {
            leftTitle: gv.lTitle,
            leftBullets: gv.lBullets,
            rightTitle: gv.rTitle,
            rightBullets: gv.rBullets,
          },
        };
      }

      case 'before_after': {
        return {
          headline: 'નાણાકીય આયોજન વિના vs શિસ્તબદ્ધ આયોજન સાથે',
          subheadline: 'સામાન્ય પરિવારો યોગ્ય સલાહકારના માર્ગદર્શનથી કરોડપતિ બની શકે છે.',
          badgeText: 'આયોજન પહેલાં vs પછી',
          ctaText: 'તમારા પરિવારના આયોજન માટે આજે જ સંપર્ક કરો',
          themeSpecific: {
            beforeTitle: '⚠️ આયોજન વગર: વિલંબ અને ચિંતા',
            beforePoints: ['પૈસા ક્યાં વપરાઈ ગયા તે સમજાતું નથી', 'મોંઘવારી સામે બચત ઘટી રહી છે', 'નિવૃત્તિ સમયે પૈસા ખૂટી જવાનો મોટો ડર'],
            afterTitle: '🌟 શિસ્તબદ્ધ SIP અને યોગ્ય વીમો',
            afterPoints: ['દર મહિને ઓટોમેટેડ સંપત્તિ સર્જન', 'સંપૂર્ણ આર્થિક સુરક્ષા અને ઇમરજન્સી ફંડ', 'સમયસર ₹૧+ કરોડના લક્ષ્યાંકની સિદ્ધિ'],
          },
        };
      }

      case 'number_breakdown': {
        return {
          headline: 'માત્ર ₹૫,૦૦૦ ની SIP થી ₹૧.૫ કરોડનું ભંડોળ કેવી રીતે બને?',
          subheadline: 'ચક્રવૃદ્ધિ વ્યાજની શક્તિ સામાન્ય રોકાણને વિશાળ સંપત્તિમાં ફેરવે છે.',
          badgeText: 'વાસ્તવિક ગણતરી અને પુરાવો',
          ctaText: 'તમારા બાળકોના ભવિષ્ય માટે આજે જ પ્લાનિંગ શરૂ કરો',
          themeSpecific: {
            bigNumber: '₹૧.૫ કરોડ',
            bigNumberLabel: '૨૦ વર્ષ બાદ લક્ષિત સંપત્તિ',
            calculations: [
              'માસિક રોકાણ: ₹૫,૦૦૦ દર મહિને',
              'કુલ જમા રકમ: માત્ર ₹૧૨ લાખ',
              'અંદાજિત ચક્રવૃદ્ધિ નફો: ₹૧.૩૮+ કરોડ',
              'સંપત્તિ ગુણાકાર: રોકાણથી ૧૨ ગણો વધારો',
            ],
          },
        };
      }

      case 'top_mistakes': {
        return {
          headline: 'રોકાણકારો દ્વારા થતી ૩ સૌથી મોટી અને ગંભીર ભૂલો',
          subheadline: 'આ ૩ ભૂલોથી બચીને લાખો રૂપિયાનું નુકસાન અટકાવો.',
          badgeText: 'સામાન્ય ગંભીર ભૂલો',
          ctaText: 'તમારો પોર્ટફોલિયો તપાસવા આજે જ WhatsApp કરો',
          themeSpecific: {
            mistakes: [
              { num: '૦૧', title: 'બજાર ઘટાડામાં ગભરાઈને SIP રોકવી', detail: 'ઘટાડો એ ડિસ્કાઉન્ટ છે, તેમાં રોકાણ ચાલુ રાખવાથી વધુ વળતર મળે છે.' },
              { num: '૦૨', title: 'વીમો અને રોકાણ ભેગા કરવા', detail: 'પરંપરાગત પોલિસીઓ ઓછું વળતર આપે છે. પ્યોર ટર્મ પ્લાન શ્રેષ્ઠ છે.' },
              { num: '૦૩', title: 'ઇમરજન્સી ફંડ વગર રોકાણ કરવું', detail: 'ઓછામાં ઓછું ૬ મહિનાના ખર્ચ જેટલું ઇમરજન્સી ફંડ હોવું અનિવાર્ય છે.' },
            ],
          },
        };
      }
    }
  }

  // Hindi Language Kit
  if (lang === 'hi') {
    switch (themeId) {
      case 'myth_vs_reality': {
        return {
          headline: 'वित्तीय भ्रम बनाम ठोस हकीकत: इस गलतफहमी से बचें!',
          subheadline: 'अधूरी जानकारी के कारण आम परिवार हर साल लाखों रुपये का नुकसान उठाते हैं।',
          badgeText: 'भ्रम बनाम हकीकत',
          ctaText: 'सच्ची वित्तीय सलाह के लिए आज ही WhatsApp करें',
          themeSpecific: {
            mythTitle: '❌ आम जनता का भ्रम',
            myth: '"म्यूचुअल फंड में निवेश शुरू करने के लिए एक साथ ₹5 लाख जैसी बड़ी रकम की जरूरत होती है।"',
            realityTitle: '✅ ठोस वित्तीय सच्चाई',
            reality: '"हर महीने मात्र ₹1,000 से ₹5,000 की अनुशासित SIP कम्पाउंडिंग की ताकत से 15-20 वर्षों में करोड़ों का फंड बनाती है।"',
          },
        };
      }
      case 'split_comparison': {
        return {
          headline: 'रास्ता A बनाम रास्ता B: आप किस वित्तीय राह पर चल रहे हैं?',
          subheadline: 'आज का छोटा सा फैसला अगले 15 वर्षों में करोड़ों रुपये का अंतर पैदा करता है।',
          badgeText: 'विकल्पों की आमने-सामने तुलना',
          ctaText: 'अपने लक्ष्यों के लिए सही राह चुनने हेतु संपर्क करें',
          themeSpecific: {
            leftTitle: 'रास्ता A: देरी और सामान्य बचत',
            leftBullets: ['3-4% के सामान्य खाते में पैसा सड़ना', 'बाजार गिरने के इंतजार में समय गंवाना', 'रिटायरमेंट पर फंड की भारी कमी'],
            rightTitle: 'रास्ता B: अनुशासित मासिक SIP',
            rightBullets: ['इक्विटी में ऑटोमेटेड कम्पाउंडिंग ग्रोथ', 'हर गिरावट में सस्ते यूनिट्स का फायदा', 'लक्ष्य के अनुसार ₹1.2+ करोड़ का कोष'],
          },
        };
      }
    }
  }

  switch (themeId) {
    case 'split_comparison': {
      const variants = [
        {
          head: 'Option A vs Option B: Which Financial Path Are You On?',
          sub: 'Small financial choices made today create massive wealth divergence over 15 years.',
          lTitle: 'Path A: Delay & Low Return',
          lBullets: ['Funds languish in 3-4% accounts', 'Waiting for market timing dips', 'Retirement shortfall of ₹40+ Lakhs'],
          rTitle: 'Path B: Disciplined Monthly SIP',
          rBullets: ['Automated equity compounding', 'Rupee-cost averaging in all dips', 'Goal target of ₹1.2+ Crore achieved'],
        },
        {
          head: 'Traditional FD vs Equity SIP: The 15-Year Reality Check',
          sub: 'Comparing fixed deposits after tax & inflation versus disciplined systematic investing.',
          lTitle: 'Path A: Fixed Deposit Savings',
          lBullets: ['6.5% interest before tax deductions', 'Post-tax real return barely beats inflation', 'Zero wealth compounding acceleration'],
          rTitle: 'Path B: Diversified Equity Portfolio',
          rBullets: ['Historical 12-14% long-term CAGR', 'Tax-efficient capital gains compounding', 'Creates 2.8x higher total wealth'],
        },
        {
          head: 'Lifestyle Upgrades vs Wealth Creation: Choose Your Trajectory',
          sub: 'How you deploy your salary increments determines whether you work for money or money works for you.',
          lTitle: 'Path A: Upgrading Liabilities',
          lBullets: ['Bigger car EMI taking 40% income', 'Credit card revolving balances', 'High lifestyle stress & zero safety net'],
          rTitle: 'Path B: 10% Annual SIP Step-Up',
          rBullets: ['Reinvesting salary hikes into SIP', '6-month emergency cushion funded', 'Financial independence reached 8 years early'],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'SIDE-BY-SIDE COMPARISON',
        ctaText: 'WhatsApp me to review which path suits your goals',
        themeSpecific: {
          leftTitle: v.lTitle,
          leftBullets: v.lBullets,
          rightTitle: v.rTitle,
          rightBullets: v.rBullets,
        },
      };
    }

    case 'myth_vs_reality': {
      const variants = [
        {
          head: 'Financial Myth vs Ground Reality: Stop Believing This!',
          sub: 'Common misconceptions cost ordinary Indian families lakhs in lost wealth.',
          myth: '"I need a large lump sum like ₹5 Lakhs to start investing in Mutual Funds."',
          reality: '"Starting with just ₹1,000 to ₹5,000 every month via disciplined SIP leverages compounding and creates multi-crore wealth over 15-20 years."',
        },
        {
          head: 'Market Crash Myth: Why Corrections Are Actually Discounts',
          sub: 'Understanding market volatility separates successful wealth creators from panic sellers.',
          myth: '"When stock markets drop 10%, I should stop my SIP to prevent losses."',
          reality: '"Market corrections are festival discounts. Your SIP buys more units at lower NAV, accelerating your future wealth multiplier."',
        },
        {
          head: 'Insurance Myth: Mixing Investment with Life Cover',
          sub: 'Why traditional endowment policies cost families double for half the protection.',
          myth: '"I should buy insurance policies that return all my money with a bonus."',
          reality: '"Pure Term Insurance gives 20x higher cover at 1/10th the cost. Invest the difference in diversified SIPs to create real wealth."',
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'MYTH VS REALITY CHECK',
        ctaText: 'Message me to separate financial myths from truth',
        themeSpecific: {
          mythTitle: '❌ THE POPULAR PUBLIC MYTH',
          mythText: v.myth,
          realityTitle: '✅ THE FACTUAL FINANCIAL REALITY',
          realityText: v.reality,
        },
      };
    }

    case 'before_after': {
      const variants = [
        {
          head: 'Before vs After: The Real Impact of Structured Planning',
          sub: 'See how life transforms when your hard-earned money has a clear fiduciary roadmap.',
          bPoints: ['No emergency reserve; high credit debt in crises', 'Random insurance policies mixed with investment', 'Constant anxiety about child education costs'],
          aPoints: ['6-Month liquid emergency cushion in place', 'Pure Term Insurance protecting family livelihood', 'Automated SIPs aligned with exact milestone dates'],
        },
        {
          head: 'Portfolio Overhaul: From Random Holdings to Institutional Precision',
          sub: 'Restructuring chaotic investments into a focused, low-cost wealth machine.',
          bPoints: ['14 different mutual funds duplicating stock holdings', 'High expense ratios silently eating 2% annually', 'Zero clear asset allocation strategy'],
          aPoints: ['Consolidated into 4 high-conviction funds', 'Optimized tax efficiency saving ₹50,000+ per year', 'Annual rebalancing protecting downside risk'],
        },
        {
          head: 'Debt-Free Freedom: From EMI Overload to Wealth Accumulation',
          sub: 'Transforming household cash flow through strategic liability management.',
          bPoints: ['Personal loans at 14% draining monthly cash flow', 'Zero surplus available at the end of the month', 'Feeling trapped in the monthly paycheck cycle'],
          aPoints: ['High-interest loans consolidated and paid off', 'Surplus redirected into automated growth SIPs', 'Clear retirement corpus growing on autopilot'],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'TRANSFORMATION BLUEPRINT',
        ctaText: 'Let us build your stress-free financial roadmap today',
        themeSpecific: {
          beforeTitle: '⚠️ BEFORE PROFESSIONAL PLANNING',
          beforePoints: v.bPoints,
          afterTitle: '🌟 AFTER STRUCTURED PLANNING',
          afterPoints: v.aPoints,
        },
      };
    }

    case 'checklist_scorecard': {
      const variants = [
        [
          '✅ 6 months of household expenses safely in an Emergency Fund',
          '✅ Pure Term Life Insurance equal to 15x-20x annual income',
          '✅ Separate Family Health Insurance (Min ₹10L - ₹25L cover)',
          '✅ Dedicated monthly SIP for retirement & child future goals',
          '✅ Zero high-interest personal loan or credit card rolling debt',
        ],
        [
          '✅ Will / nomination updated across all bank & demat accounts',
          '✅ Emergency liquid funds accessible within 1 hour',
          '✅ Health super top-up policy active for senior parents',
          '✅ Retirement corpus mapped with inflation-adjusted targets',
          '✅ Annual SIP step-up configured at +10% yearly rate',
        ],
        [
          '✅ Debt-to-income ratio strictly below 35% of take-home pay',
          '✅ Portfolio asset allocation audited within the last 12 months',
          '✅ Critical illness cover active alongside base health policy',
          '✅ Tax-saving ELSS investments planned before year-end rush',
          '✅ Children higher education fund growing in dedicated equity SIP',
        ],
      ];
      return {
        headline: 'Financial Health Scorecard: How Ready Are You for 2026?',
        subheadline: 'Give yourself 1 point for each box you can confidently tick today.',
        badgeText: 'FAMILY READINESS SCORECARD',
        ctaText: 'Score under 4? Contact me today for a complimentary review',
        themeSpecific: {
          checklistItems: variants[variant],
          scoringGuide: '4-5 Ticks: Financially Resilient  •  Under 3: Vulnerable to Emergencies',
        },
      };
    }

    case 'interactive_poll': {
      const variants = [
        {
          head: 'Quick Poll: If You Received ₹10 Lakhs Bonus Today, What Would You Do?',
          sub: 'Reply with your choice on WhatsApp to see what top wealth creators do.',
          opts: [
            { key: 'A', text: 'Invest in a diversified equity SIP for child future' },
            { key: 'B', text: 'Prepay home loan and reduce monthly EMI burden' },
            { key: 'C', text: 'Create an emergency FD & boost family health cover' },
            { key: 'D', text: 'Upgrade car or take an international luxury vacation' },
          ],
        },
        {
          head: 'Investor Poll: What is Your #1 Financial Priority for the Next 5 Years?',
          sub: 'Vote A, B, C or D to receive tailored educational guidance.',
          opts: [
            { key: 'A', text: 'Achieving complete freedom from all home & personal debt' },
            { key: 'B', text: 'Securing ₹1+ Crore corpus for child overseas education' },
            { key: 'C', text: 'Building an early retirement corpus generating passive income' },
            { key: 'D', text: 'Protecting family against sudden medical and critical shocks' },
          ],
        },
        {
          head: 'Market Poll: When Stock Markets Drop 10%, What Is Your First Instinct?',
          sub: 'Your emotional reaction determines your long-term investment returns.',
          opts: [
            { key: 'A', text: 'Buy aggressively! Market corrections are festive discounts.' },
            { key: 'B', text: 'Do nothing and let my monthly SIP run uninterrupted.' },
            { key: 'C', text: 'Feel anxious and pause my SIP until markets recover.' },
            { key: 'D', text: 'Panic and sell everything to protect whatever cash is left.' },
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'COMMUNITY POLL / PICK ONE',
        ctaText: 'WhatsApp your option (A, B, C or D) to get personalized advice',
        themeSpecific: {
          options: v.opts,
        },
      };
    }

    case 'step_roadmap': {
      const variants = [
        [
          { step: '01', title: 'Shield Defense', desc: 'Build 6-month liquid emergency fund + Pure Term & Health Cover' },
          { step: '02', title: 'Debt Elimination', desc: 'Clear high-interest personal loans & optimize home loan EMIs' },
          { step: '03', title: 'Wealth Compounding', desc: 'Disciplined Monthly SIP in equity funds with 10% annual step-up' },
          { step: '04', title: 'Goal Autopilot', desc: 'Earmark child higher education and achieve early retirement corpus' },
        ],
        [
          { step: '01', title: 'Cash Flow Audit', desc: 'Identify money leaks and automate a mandatory 20% first-day savings rule' },
          { step: '02', title: 'Asset Allocation', desc: 'Structure balanced portfolio across equity, debt, gold, and liquid cash' },
          { step: '03', title: 'Tax Optimization', desc: 'Utilize 80C, 80D, and NPS deduction to keep more of your earnings' },
          { step: '04', title: 'Passive Income', desc: 'Create dividend and systematic withdrawal streams for lifetime freedom' },
        ],
        [
          { step: '01', title: 'Risk Insulation', desc: 'Ensure family health insurance cannot be wiped out by sudden hospitalization' },
          { step: '02', title: 'Foundation SIP', desc: 'Set up core index and flexi-cap mutual funds for 10+ year compounding' },
          { step: '03', title: 'Milestone Earmarking', desc: 'Tag specific funds for child college, home purchase, and retirement' },
          { step: '04', title: 'Legacy & Succession', desc: 'Update nominations and create clear family asset documentation' },
        ],
      ];
      return {
        headline: '4-Step Proven Roadmap to Complete Financial Independence',
        subheadline: 'Follow this sequential blueprint to build generational wealth safely.',
        badgeText: 'STEP-BY-STEP FLOWCHART',
        ctaText: 'Book a session to identify your current step and next move',
        themeSpecific: {
          steps: variants[variant],
        },
      };
    }

    case 'number_breakdown': {
      const variants = [
        {
          head: 'The Math Proof: How ₹5,000/Month Can Create ₹1.5 Crores',
          sub: 'You do not need magic; you only need consistency and compounding time.',
          num: '₹1.50 CRORE',
          label: 'Target Wealth Corpus Created',
          calcs: [
            'Monthly Investment: ₹5,000 per month (Automated SIP)',
            'Time Horizon: 20 Years of uninterrupted compounding',
            'Expected Long-term CAGR: ~12% in diversified equities',
            'Total Amount Invested: ₹12 Lakhs ➔ Wealth Gain: ₹1.38+ Crores!',
          ],
        },
        {
          head: 'The Power of Step-Up: How ₹10,000/Month Reaches ₹3.8 Crores',
          sub: 'Increasing your SIP by just 10% every year doubles your final wealth.',
          num: '₹3.82 CRORE',
          label: 'Final Corpus with 10% Annual Step-Up',
          calcs: [
            'Initial Investment: ₹10,000/mo stepped up +10% yearly',
            'Time Horizon: 20 Years aligned with salary increments',
            'Compounding Growth: ~12% average long-term equity return',
            'Ordinary SIP: ₹1.0 Cr vs Step-Up SIP: ₹3.82 Crores (Nearly 4x!)',
          ],
        },
        {
          head: 'Emergency Reserve Math: How ₹3 Lakhs Protects ₹50 Lakhs',
          sub: 'Why having liquid emergency funds saves you from distress debt.',
          num: '₹3.00 LAKHS',
          label: 'Liquid Emergency Cushion Required',
          calcs: [
            'Monthly Household Expenses: ₹50,000 x 6 Months',
            'Stored in: Instant Liquid Funds & Sweep-in Fixed Deposits',
            'Prevents: Liquidating investments during market downturns',
            'Saves: ₹4+ Lakhs in predatory 14% personal loan interest',
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'NUMBER BREAKDOWN & MATH PROOF',
        ctaText: 'Calculate your personalized target corpus with me today',
        themeSpecific: {
          bigNumber: v.num,
          bigNumberLabel: v.label,
          calculations: v.calcs,
        },
      };
    }

    case 'curiosity_hook': {
      const variants = [
        {
          head: 'Did You Know? The "Rule of 72" Tells You Exactly When Money Doubles',
          sub: 'A simple mental math formula that every smart investor should memorize.',
          hook: 'Did you know how long your money takes to double in different assets?',
          ex: [
            'At 4% in a Savings Account: 72 ÷ 4 = 18 Years to double',
            'At 7% in a Traditional FD: 72 ÷ 7 = 10.3 Years to double',
            'At 12% in an Equity SIP: 72 ÷ 12 = Only 6 Years to double!',
          ],
        },
        {
          head: 'Did You Know? Inflation at 6% Halves Your Money in Just 12 Years',
          sub: 'The silent thief that eats cash sitting idle in bank accounts.',
          hook: 'Did you know that keeping cash "safe" in savings guarantees a loss?',
          ex: [
            '₹10 Lakhs today will feel like ₹5 Lakhs in purchasing power by 2038',
            'School fees and medical costs inflate at 10-12% annually',
            'Only equity compounding beats lifestyle inflation over 10+ years',
          ],
        },
        {
          head: 'Did You Know? 80% of Wealth is Created in the Last 5 Years',
          sub: 'Why compounding hockey-stick growth rewards patience.',
          hook: 'Did you know why Warren Buffett made 90% of his wealth after age 60?',
          ex: [
            'Years 1 to 5: Growth feels slow and linear',
            'Years 6 to 12: Returns start generating their own returns',
            'Years 13 to 20: Exponential explosion where interest dwarfs capital',
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'DID YOU KNOW? 💡',
        ctaText: 'Ask me how your current savings rate stacks up against inflation',
        themeSpecific: {
          questionHook: v.hook,
          examples: v.ex,
        },
      };
    }

    case 'dos_and_donts': {
      const variants = [
        {
          dos: [
            'Start SIP early and step-up by 10% every year',
            'Separate Life Insurance (Term plan) from Investments',
            'Rebalance asset allocation once every 12 months',
          ],
          donts: [
            'Never stop your SIP when stock markets experience a dip',
            'Avoid trading based on unsolicited social media tips',
            'Never use emergency reserves for discretionary luxuries',
          ],
        },
        {
          dos: [
            'Build 6-month emergency fund before investing in equity',
            'Choose pure term cover equal to 15x-20x annual income',
            'Invest with a written 10-year goal roadmap',
          ],
          donts: [
            'Do not lock money into 20-year endowment insurance policies',
            'Do not borrow personal loans to invest in speculative assets',
            'Avoid checking daily portfolio NAV during market corrections',
          ],
        },
        {
          dos: [
            'Automate monthly SIP debits right after salary day',
            'Audit mutual fund scheme overlaps once a year',
            'Keep adequate family health insurance with super top-up',
          ],
          donts: [
            'Do not wait for the "ideal market timing" to start',
            'Do not withdraw long-term retirement funds for short-term vacations',
            'Never invest without clear family nomination updates',
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: "The Smart Investor's Dos & Don'ts Checklist",
        subheadline: 'Mastering personal finance is more about avoiding mistakes than finding tricks.',
        badgeText: "DOS & DON'TS CARD",
        ctaText: 'Reach out to ensure your portfolio follows these essential rules',
        themeSpecific: {
          dos: v.dos,
          donts: v.donts,
        },
      };
    }

    case 'case_study': {
      const variants = [
        {
          head: 'Client Story: How Rahul (Age 34) Restructured His Wealth in 90 Days',
          prob: 'The Challenge: Paying ₹45,000/mo across 4 ULIPs and high loan EMI with zero clear retirement savings.',
          act: 'The Strategy: Surrendered low-yield policies, secured ₹2 Cr pure Term Cover, and redirected ₹25,000 into structured diversified SIPs.',
          res: 'The Result: Monthly savings increased by ₹18,000; projected retirement corpus boosted to ₹4.2 Crores on track.',
        },
        {
          head: 'Case Study: How Priya (Age 42) Funded Her Daughter Harvard Dream',
          prob: 'The Challenge: Only 6 years left until college with savings scattered across low-yielding traditional deposits.',
          act: 'The Strategy: Structured a balanced international equity & debt allocation with automated disciplined contributions.',
          res: 'The Result: Met the targeted ₹65 Lakh higher education corpus without liquidating retirement savings.',
        },
        {
          head: 'Case Study: How Ankit (Age 29) Cleared ₹8 Lakhs Debt & Started Investing',
          prob: 'The Challenge: Revolving credit card balances eating 30% of salary every month with high financial anxiety.',
          act: 'The Strategy: Implemented debt avalanche method, eliminated debt in 14 months, and established ₹15,000/mo SIP.',
          res: 'The Result: Zero debt, 6-month emergency reserve created, and on track to achieve ₹1 Crore by age 40.',
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: 'Real-life turnaround showing the immense power of fiduciary guidance.',
        badgeText: 'CLIENT SUCCESS STORY',
        ctaText: 'Schedule your private 1-on-1 portfolio review today',
        themeSpecific: {
          problem: v.prob,
          action: v.act,
          outcome: v.res,
        },
      };
    }

    case 'philosophy_quote': {
      const variants = [
        {
          q: '"The stock market is a device for transferring money from the impatient to the patient."',
          auth: 'Warren Buffett',
          refl: 'True financial freedom is not about showing wealth through luxury; it is about buying your freedom, peace of mind, and time.',
        },
        {
          q: '"Do not save what is left after spending, but spend what is left after saving."',
          auth: 'Warren Buffett',
          refl: 'Pay your future self first before paying all other bills. That single habit guarantees long-term wealth.',
        },
        {
          q: '"Compound interest is the eighth wonder of the world. He who understands it, earns it; he who does not, pays it."',
          auth: 'Albert Einstein',
          refl: 'Time in the market is vastly more powerful than timing the market. Start early and let compounding do the heavy lifting.',
        },
      ];
      const v = variants[variant];
      return {
        headline: 'Timeless Mindset: Shifting Short-Term Noise into Long-Term Wealth',
        subheadline: 'Perspective for navigating market volatility and uncertain economic cycles.',
        badgeText: 'MINDSET & PHILOSOPHY',
        ctaText: 'Stay disciplined with personalized fiduciary guidance',
        themeSpecific: {
          quote: v.q,
          author: v.auth,
          reflection: v.refl,
        },
      };
    }

    case 'cost_of_delay': {
      const variants = [
        {
          head: 'The Cost of Delay: Waiting 5 Years Can Cost You ₹65+ Lakhs!',
          pA: 'Investor A (Starts at Age 25): Invests ₹10,000/mo for 10 years and stops. Wealth at age 60: ₹2.5+ Crores!',
          pB: 'Investor B (Starts at Age 35): Invests ₹10,000/mo for 25 years continuously. Wealth at age 60: Only ₹1.8 Crores!',
          gap: 'Investor A invested LESS money (₹12L vs ₹30L) but created ₹70+ Lakhs MORE wealth purely because of 10 extra compounding years.',
        },
        {
          head: 'Retirement Dilemma: Delaying 7 Years Doubles Your Monthly Burden',
          pA: 'Starting at Age 30: Requires only ₹8,500/month to accumulate a ₹2.5 Crore retirement corpus at age 55.',
          pB: 'Starting at Age 37: Requires ₹22,000/month to accumulate the exact same corpus due to lost compounding years.',
          gap: 'A 7-year delay requires nearly 3x higher monthly commitment from your household income.',
        },
        {
          head: 'Child Higher Education: Why Waiting Until Class 10th is Costly',
          pA: 'Start at Child Birth: ₹5,000/month in equity SIP comfortably funds a ₹45 Lakh higher education corpus by age 18.',
          pB: 'Start at Age 14: Requires ₹55,000/month in distress savings to meet the same target in just 4 years.',
          gap: 'Starting early makes education funding effortless; delaying turns it into a financial crisis.',
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: 'Compounding rewards those who start, not those who wait for the "right time".',
        badgeText: 'COST OF DELAY WARNING',
        ctaText: 'Do not lose another year of compounding — start your SIP today',
        themeSpecific: {
          personA: v.pA,
          personB: v.pB,
          mathGap: v.gap,
        },
      };
    }

    case 'top_mistakes': {
      const variants = [
        [
          { num: '01', title: 'Mixing Insurance with Investment', detail: 'Endowment policies offer ~5% return while providing inadequate life cover.' },
          { num: '02', title: 'Pausing SIPs During Market Dips', detail: 'Market corrections are festival discounts for buying more units at lower NAV.' },
          { num: '03', title: 'Ignoring the Silent Thief: Inflation', detail: 'Leaving long-term money in 3% savings accounts guarantees loss of purchasing power.' },
        ],
        [
          { num: '01', title: 'Over-Diversifying Into 15+ Mutual Funds', detail: 'Holding too many funds creates duplicate holdings and dilutes overall performance.' },
          { num: '02', title: 'Relying Solely on Employer Health Cover', detail: 'Job changes or retirement leave your family completely uninsured when needed most.' },
          { num: '03', title: 'Investing Without Earmarked Goal Horizons', detail: 'Without clear timelines, investors withdraw long-term wealth for impulsive short-term wants.' },
        ],
        [
          { num: '01', title: 'Trading on Unsolicited Telegram/Finfluencer Tips', detail: 'Speculative trading without fiduciary audit destroys hard-earned family savings.' },
          { num: '02', title: 'Delaying Retirement Planning Until Age 45', detail: 'Compounding window shrinks drastically, forcing severe lifestyle compromises later.' },
          { num: '03', title: 'Failing to Update Legal Nominees', detail: 'Neglecting nominee documentation causes immense legal hardship for family in crises.' },
        ],
      ];
      return {
        headline: 'Top 3 Costly Mistakes That Quietly Destroy Family Wealth',
        subheadline: 'Are you unknowingly making one of these common financial blunders?',
        badgeText: '3 COSTLY MISTAKES TO AVOID',
        ctaText: 'Let us audit your current portfolio to eliminate these blunders',
        themeSpecific: {
          mistakes: variants[variant],
        },
      };
    }

    case 'direct_faq': {
      const variants = [
        {
          q: 'Q: "Markets are touching all-time highs. Should I pause my SIP and wait for a crash?"',
          ans: 'A: Absolutely NOT. In a growing economy, all-time highs are normal milestones. SIP automatically buys fewer units when markets are high and more units when markets dip, perfecting Rupee Cost Averaging without timing guesswork.',
        },
        {
          q: 'Q: "How much Term Insurance cover does my family actually need?"',
          ans: 'A: The thumb rule is 15x to 20x your current annual gross income plus any outstanding home loans. For someone earning ₹15 Lakhs/year, minimum recommended pure term life cover is ₹2.5 to ₹3.0 Crores.',
        },
        {
          q: 'Q: "Should I prepay my home loan early or invest the surplus into an equity SIP?"',
          ans: 'A: If your home loan interest is ~8.5% and equity SIP CAGR is 12-14%, a hybrid approach is best: maintain your regular SIP while using yearly bonuses for loan prepayments to maximize net net worth.',
        },
      ];
      const v = variants[variant];
      return {
        headline: 'Direct Advisor Q&A: Clear Answers to Burning Money Questions',
        subheadline: 'Straight, candid advice from your personal certified financial fiduciary.',
        badgeText: 'ADVISOR FAQ OF THE WEEK',
        ctaText: 'Have a financial query? WhatsApp me directly for clear guidance',
        themeSpecific: {
          question: v.q,
          answer: v.ans,
        },
      };
    }

    case 'golden_rule': {
      const variants = [
        {
          name: 'THE 50 / 30 / 20 BUDGETING FORMULA',
          secs: [
            { title: '50% For Needs', desc: 'Rent/EMI, groceries, utilities, school fees, and essential medicine.' },
            { title: '30% For Wants', desc: 'Dining out, vacations, streaming subscriptions, and lifestyle hobbies.' },
            { title: '20% For Future Freedom', desc: 'Automated SIPs, emergency fund reserve, and retirement investments.' },
          ],
        },
        {
          name: 'THE RULE OF 72: WEALTH DOUBLING FORMULA',
          secs: [
            { title: 'Divide 72 by Interest Rate', desc: 'Tells you the exact number of years needed to double your money.' },
            { title: 'At 6% Fixed Deposit', desc: '72 ÷ 6 = 12 Years to double your invested capital.' },
            { title: 'At 12% Equity SIP', desc: '72 ÷ 12 = Only 6 Years to double (Multiplies 4x faster over 24 years!).' },
          ],
        },
        {
          name: 'THE 100 MINUS AGE ASSET ALLOCATION RULE',
          secs: [
            { title: 'Equity Allocation %', desc: 'Subtract your current age from 100 to determine maximum equity exposure.' },
            { title: 'At Age 30', desc: '100 - 30 = 70% in growth equity funds and 30% in stable debt assets.' },
            { title: 'At Age 50', desc: '100 - 50 = 50% in equity and 50% in capital protection instruments.' },
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: `The Golden Rule of Wealth: ${v.name}`,
        subheadline: 'Master your monthly cash flow with this rock-solid framework.',
        badgeText: 'GOLDEN RULE OF MONEY',
        ctaText: 'Message me to calculate your optimal asset allocation',
        themeSpecific: {
          ruleName: v.name,
          sections: v.secs,
        },
      };
    }

    case 'visual_analogy': {
      const variants = [
        {
          obj: '🪖 The Helmet Analogy: Why Term Insurance Matters',
          comp: 'You do not buy a helmet hoping to fall; you wear it because the road is unpredictable. You do not ask for a "return of money" if you reach home safely without a crash.',
          les: 'Similarly, pure Term Insurance is low-cost protection against life unforeseen emergencies. Do not buy insurance expecting investment returns; buy it to ensure your family never compromises their lifestyle.',
        },
        {
          obj: '🌳 The Banyan Tree Analogy: The Nature of SIP Compounding',
          comp: 'When you plant a banyan seed, nothing happens for months. If you dig it up every week to check if it has grown, it dies. But if you water it quietly, it eventually shelters generations.',
          les: 'Your SIP works identically. Do not panic and exit when markets dip; let the roots spread so compounding can build a canopy of financial freedom for your family.',
        },
        {
          obj: '🧯 The Fire Extinguisher: The Purpose of Emergency Funds',
          comp: 'You never buy a fire extinguisher expecting it to produce a high financial dividend; you install it so a small spark does not burn down your entire home.',
          les: 'An emergency fund is not an investment; it is the fire extinguisher of your family finances. It protects your long-term wealth from being liquidated in panic.',
        },
      ];
      const v = variants[variant];
      return {
        headline: v.obj,
        subheadline: 'Understanding financial principles through simple everyday analogies.',
        badgeText: 'VISUAL FINANCIAL METAPHOR',
        ctaText: 'Reach out to build a rock-solid financial foundation today',
        themeSpecific: {
          analogyObject: v.obj,
          comparison: v.comp,
          advisoryLesson: v.les,
        },
      };
    }

    case 'self_audit': {
      const variants = [
        {
          head: 'Mirror Question: If Salary Stopped Tomorrow, How Long Would You Survive?',
          sub: 'A moment of honest self-reflection for every working professional.',
          q: 'If active income paused tomorrow morning, for how many months could your household continue living without taking loans or selling assets?',
          cps: [
            '• Less than 1 Month: Danger Zone — Highly vulnerable to sudden job loss or medical emergency',
            '• 1 to 3 Months: Fragile — Urgent need to build dedicated liquid reserves',
            '• 6 to 12 Months: Resilient — Strong foundation to withstand any economic storm',
          ],
        },
        {
          head: 'Mirror Question: Are You Investing for Wealth, or Just Showing Wealth?',
          sub: 'Distinguishing between asset ownership and liability display.',
          q: 'If nobody could see your car, your watch, or your phone, would you still make the same purchasing decisions?',
          cps: [
            '• Real Wealth: Assets that generate passive cash flow and freedom of time',
            '• Fake Wealth: Depreciating liabilities bought on high-interest EMIs to impress others',
            '• Fiduciary Goal: Shift capital from status symbols into compounding equity',
          ],
        },
        {
          head: 'Mirror Question: Is Your Family Protected if You Don Not Return Home Tonight?',
          sub: 'The one tough question every primary breadwinner must answer honestly.',
          q: 'If the unthinkable happens, will your family be able to pay school fees and rent without financial dependence on relatives?',
          cps: [
            '• True Protection: Pure Term Insurance equal to 20x annual household income',
            '• Clean Paperwork: Clear nominations and shared financial password documentation',
            '• Peace of Mind: Knowing your loved ones are completely insulated from debt',
          ],
        },
      ];
      const v = variants[variant];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'HONEST SELF-AUDIT QUESTION',
        ctaText: 'Contact me today to build a bulletproof emergency survival cushion',
        themeSpecific: {
          primaryQuestion: v.q,
          checkpoints: v.cps,
        },
      };
    }

    case 'cheat_sheet': {
      const variants = [
        [
          { label: 'Emergency Fund', formula: '6x to 9x Monthly Fixed Living Expenses' },
          { label: 'Life Insurance Cover', formula: '15x to 20x Annual Gross Income (Pure Term)' },
          { label: 'Health Insurance', formula: 'Min ₹10L - ₹25L Base Cover + Super Top-up' },
          { label: 'Max Home Loan EMI', formula: 'Should not exceed 35% of Net Monthly Take-Home' },
          { label: 'Annual SIP Step-Up', formula: 'Increase SIP amount by +10% with every yearly salary hike' },
        ],
        [
          { label: 'Equity Allocation Rule', formula: '100 Minus Age in Growth Equities' },
          { label: 'Debt Allocation Rule', formula: 'Equal to current age in stable Debt/Fixed Income' },
          { label: 'Retirement Corpus Target', formula: '30x to 35x of Projected Annual Post-Retirement Expenses' },
          { label: 'Child Higher Education', formula: 'Inflate current college fee at 10% CAGR over remaining years' },
          { label: 'Rebalancing Frequency', formula: 'Audit asset allocation strictly once every 12 months' },
        ],
        [
          { label: 'Tax Saving 80C Limit', formula: '₹1.50 Lakhs (Prioritize ELSS for 3-year lock-in & equity growth)' },
          { label: 'Health Insurance 80D', formula: 'Up to ₹25,000 for self/family + ₹50,000 for senior parents' },
          { label: 'NPS 80CCD(1B)', formula: 'Additional ₹50,000 tax deduction exclusively for retirement' },
          { label: 'Credit Card Utilization', formula: 'Keep total credit utilization strictly under 30% of card limit' },
          { label: 'Personal Loan Rule', formula: 'Avoid unsecured debt for non-appreciating lifestyle assets' },
        ],
      ];
      return {
        headline: 'One-Page Cheat Sheet: Essential Financial Metrics Every Family Needs',
        subheadline: 'Save this card for reference whenever making key financial decisions.',
        badgeText: 'POCKET CHEAT SHEET',
        ctaText: 'Download and save this card • Contact me for personalized planning',
        themeSpecific: {
          items: variants[variant],
        },
      };
    }

    case 'market_psychology': {
      const variants = [
        {
          head: 'The Emotional Cycle of an Investor: Where Are You Standing?',
          sub: 'Markets move in cycles, but wealth is destroyed by emotional overreaction.',
          stages: [
            '1. Optimism & Greed: "Markets are flying! Let me invest everything!"',
            '2. Euphoria (The Peak): "This time it is different, risk is gone!"',
            '3. Anxiety & Panic (The Dip): "Markets crashed! Should I sell to protect what is left?"',
            '4. Despondency (The Bottom): "I am never investing in equities again!"',
          ],
          adv: 'The Secret of Wealth: Buy aggressively at Stage 3 & 4 when others panic; remain disciplined at Stage 1 & 2.',
        },
        {
          head: 'Managing Market Volatility: Noise vs Long-Term Fundamentals',
          sub: 'Why the biggest risk in investing is looking at your portfolio too often.',
          stages: [
            '1. Daily News Headlines: Speculators react to geopolitical and rate noise',
            '2. Temporary Drawdowns: Indian market history shows 10-15% corrections happen every year',
            '3. Recovery & Expansion: Corporate earnings drive markets to new all-time highs',
            '4. The Compounding Winner: The investor who automated their SIP and did nothing',
          ],
          adv: 'Fiduciary Rule: In investing, activity is often the enemy of returns. Patience is the greatest alpha.',
        },
      ];
      const v = variants[variant % variants.length];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'INVESTOR PSYCHOLOGY GUIDE',
        ctaText: 'Work with a certified advisor to remove emotional panic from your investments',
        themeSpecific: {
          cycleStages: v.stages,
          advisorAdvice: v.adv,
        },
      };
    }

    case 'age_blueprint': {
      const variants = [
        [
          { ageGroup: 'In Your 20s', focus: 'Build habits, start ₹2,000+ monthly SIP, get personal health cover, avoid EMI traps' },
          { ageGroup: 'In Your 30s', focus: 'Secure 20x Term Plan, aggressively fund child higher education, step-up equity SIPs' },
          { ageGroup: 'In Your 40s', focus: 'Accelerate retirement corpus, prepay expensive debt, rebalance asset allocation' },
          { ageGroup: 'In Your 50s', focus: 'Shift capital toward low-risk debt funds, build guaranteed post-retirement income' },
        ],
        [
          { ageGroup: 'Early Career', focus: 'Focus on skill growth, automate 20% first-day savings, build emergency reserve' },
          { ageGroup: 'Family Formation', focus: 'Lock low-cost 30-year term insurance, map family goals, buy family floater health cover' },
          { ageGroup: 'Peak Earning', focus: 'Maximize tax efficiency, eliminate home loan interest burden, avoid lifestyle inflation' },
          { ageGroup: 'Pre-Retirement', focus: 'Consolidate assets, de-risk equity exposure into SWP funds, create updated estate will' },
        ],
      ];
      return {
        headline: 'Age-Wise Financial Priorities: What You Should Focus On Right Now',
        subheadline: 'Align your investment focus with your exact current life stage.',
        badgeText: 'DECADE-WISE BLUEPRINT',
        ctaText: 'Get your customized age-appropriate portfolio asset allocation',
        themeSpecific: {
          tracks: variants[variant % variants.length],
        },
      };
    }

    case 'resource_recommendation': {
      const variants = [
        {
          head: 'Recommended Financial Habit: The "First-Day Auto-Debit" Rule',
          sub: 'One simple behavioral shift that automatically makes wealth creation inevitable.',
          res: 'The "First-Day SIP" Automation Principle',
          why: 'Most people spend first and try to save whatever is left at the end of the month — which is usually zero. By scheduling your SIP auto-debit on the 1st to 5th of every month (immediately after salary credits), you treat your future wealth as your #1 non-negotiable bill.',
          imp: 'Result: Over 10 years, this single automated habit creates ₹35+ Lakhs without feeling like a sacrifice.',
        },
        {
          head: 'Recommended Mental Model: The "10-10-10" Decision Rule',
          sub: 'How high-net-worth investors avoid impulsive financial regret.',
          res: 'The 10-10-10 Time Horizon Framework',
          why: 'Before committing to an expensive impulse purchase or pulling out of investments in a dip, ask: How will I feel about this decision in 10 minutes? In 10 months? In 10 years? Short-term impulses vanish, but long-term discipline builds generational security.',
          imp: 'Result: Prevents lifestyle creep and preserves critical compounding capital.',
        },
      ];
      const v = variants[variant % variants.length];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'ADVISOR TOP RECOMMENDATION',
        ctaText: 'WhatsApp me to automate your First-Day SIP setup today',
        themeSpecific: {
          resourceTitle: v.res,
          whyItWorks: v.why,
          impact: v.imp,
        },
      };
    }

    case 'urgent_reminder': {
      const variants = [
        {
          head: 'Urgent Alert: Review Your Tax Saving & Health Cover Before Year End!',
          sub: 'Last-minute rush leads to bad investment choices that lock your capital in low-yield products.',
          header: 'Avoid the March Panic Trap',
          pts: [
            '1. Do not lock money into low-yield products just to save tax under 80C',
            '2. Utilize ELSS Mutual Funds for shortest 3-year lock-in and superior equity growth',
            '3. Review Section 80D health insurance tax deductions for self and senior parents',
            '4. Optimize NPS (National Pension Scheme) for additional ₹50,000 tax deduction under 80CCD(1B)',
          ],
        },
        {
          head: 'Urgent Reminder: Annual Portfolio Rebalancing & Nomination Check',
          sub: 'Is your investment allocation still aligned with your family time horizon?',
          header: 'Annual Fiduciary Health Audit',
          pts: [
            '1. Review equity vs debt ratio after major market movements',
            '2. Ensure bank, mutual fund, and demat account nominees are fully verified',
            '3. Check whether your term insurance cover matches your current annual salary',
            '4. Re-evaluate emergency liquid reserve against rising monthly expenses',
          ],
        },
      ];
      const v = variants[variant % variants.length];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'TIME-SENSITIVE REMINDER ⏰',
        ctaText: 'Message me today to finish your financial review smoothly',
        themeSpecific: {
          reminderHeader: v.header,
          actionPoints: v.pts,
        },
      };
    }

    case 'hidden_cost': {
      const variants = [
        {
          head: 'The Iceberg Concept: What You See vs What It Really Costs You',
          sub: 'Surface costs are small; the sunken hidden costs under the water are staggering.',
          top: 'Visible on Top: "I am saving ₹1,500/month by not buying pure term and health insurance."',
          bot: 'Hidden Beneath the Surface: In a single critical hospitalization, savings of 10 years are wiped out in 7 days, forcing emergency personal loans at 14% interest.',
        },
        {
          head: 'The Hidden Cost of Cash: The Iceberg of Silent Inflation',
          sub: 'Why leaving money in low-yield accounts is a guaranteed wealth destroyer.',
          top: 'Visible on Top: "My bank balance never drops; I feel 100% safe seeing the exact number."',
          bot: 'Hidden Beneath the Surface: At 7% inflation, that exact number buys 50% fewer groceries, medicines, and school books every decade. Uninvested cash silently decays.',
        },
      ];
      const v = variants[variant % variants.length];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'THE ICEBERG FINANCIAL TRUTH 🧊',
        ctaText: 'Let us uncover the hidden wealth leaks in your family finances',
        themeSpecific: {
          tipOfIceberg: v.top,
          sunkenIceberg: v.bot,
        },
      };
    }

    case 'advisor_opinion': {
      const variants = [
        {
          head: 'Unpopular Opinion: Real Estate & Gold Are NOT Your Whole Financial Plan',
          sub: 'A candid reality check that high-net-worth investors understand.',
          op: '"Putting 90% of your net worth into physical real estate locks your capital in illiquid, high-tax, rental-yield-poor assets (2-3%). True family resilience requires liquid, inflation-beating financial assets that can be accessed in 24 hours without distress sales."',
          adv: 'Diversification is not about owning 3 flats in the same city; it is about owning equity, debt, gold, and liquid cash in balanced proportions.',
        },
        {
          head: 'Unpopular Opinion: Chasing Top Returns Matters Less Than Staying Invested',
          sub: 'Why behavioral discipline beats complex financial algorithms every single time.',
          op: '"Investors waste hundreds of hours searching for the #1 top-performing mutual fund of the year, only to panic and sell during the next 10% market dip. An average fund held for 20 years creates 5x more wealth than the best fund held for 2 years."',
          adv: 'Fiduciary Insight: Your investment behavior and emotional discipline are responsible for 90% of your ultimate financial freedom.',
        },
      ];
      const v = variants[variant % variants.length];
      return {
        headline: v.head,
        subheadline: v.sub,
        badgeText: 'CANDID ADVISOR OPINION 💡',
        ctaText: 'Discuss your asset allocation directly with me on WhatsApp',
        themeSpecific: {
          opinionText: v.op,
          advisorAdvice: v.adv,
        },
      };
    }

    case 'direct_cta_offer':
    default: {
      const variants = [
        [
          '🎯 Overlap Audit: Check whether your mutual fund schemes are duplicating holdings',
          '🛡️ Risk & Protection Audit: Verify whether life and health covers are truly adequate',
          '📈 Retirement & Child Education Gap Analysis with exact milestone numbers',
          '💡 Tax Optimization Strategy to keep more of your earned returns legally',
        ],
        [
          '📊 Asset Allocation Review: Balance equity, fixed income, and liquid reserves',
          '🔍 Hidden Fee & Expense Ratio Scan across your existing policy holdings',
          '⏱️ Financial Independence Timeline calculation tailored to your current savings',
          '📱 Direct WhatsApp Access for ongoing financial questions and guidance',
        ],
      ];
      return {
        headline: 'Complimentary 1-on-1 Comprehensive Financial Portfolio Review',
        subheadline: 'Get an objective, professional fiduciary checkup of your family investments.',
        badgeText: 'SPECIAL ADVISORY INVITATION 🎯',
        ctaText: 'Book your confidential 1-on-1 review slot on WhatsApp today',
        themeSpecific: {
          offerIncludes: variants[variant % variants.length],
          offerTerms: '100% Confidential  •  Zero Obligation  •  Tailored Fiduciary Guidance',
        },
      };
    }
  }
}
