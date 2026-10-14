import {
  FinancePollTopic,
  GeneratedPoll,
  OutputBNativePoll,
  OutputCCreationGuide,
  PollCategory,
  PollGeneratorRequest,
  PollType,
  SavedPollRecord,
} from '../types/financePoll';
import { LanguageCode } from '../types';
import { POLL_CATEGORIES, POLL_TYPES } from '../constants/financePollTopics';
import {
  calculateSipFutureValue,
  calculateInflationFutureCost,
  calculateRuleOf72,
  calculateLoanEmi,
  calculateLtcgTax,
} from './financeMathEngine';

const POLL_STORAGE_KEY = 'finadvisor_saved_poll_records_v1';

// ---------------------------------------------------------------------------
// 1. CLEAN TEXT NORMALIZER FOR NATIVE WHATSAPP POLLS
// ---------------------------------------------------------------------------

/**
 * Strips markdown asterisks, underscores, backticks, HTML tags, and metadata
 * to ensure plain, pristine text for native WhatsApp poll input fields.
 */
export function cleanForWhatsAppPoll(text: string): string {
  if (!text) return '';
  return text
    .replace(/[*_~`]/g, '') // remove markdown bold, italics, code
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/^([A-D]|[1-4])[\).:\-\s]+/i, '') // remove leading 'A) ' or '1. ' prefixes if present
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// 2. OUTPUT A: READY-TO-FORWARD SHAREABLE MESSAGE
// ---------------------------------------------------------------------------

export function buildShareableMessage(
  poll: {
    questionText: string;
    options: string[];
    topicTitle: string;
    topicNum: number;
    pollTypeLabel: string;
    pollType: PollType;
  },
  advisor?: {
    advisorName?: string;
    designation?: string;
    phoneNumber?: string;
    companyName?: string;
    amfiArn?: string;
    professionalDetails?: string;
  },
  lang: LanguageCode = 'en'
): string {
  const isGu = lang === 'gu';
  const isHi = lang === 'hi';

  const letters = ['A', 'B', 'C', 'D'];

  const header = isGu
    ? `📊 *નાણાકીય પોલ — ${poll.topicTitle}*`
    : isHi
    ? `📊 *फाइनेंस पोल — ${poll.topicTitle}*`
    : `📊 *FINANCE POLL — ${poll.topicTitle.toUpperCase()}*`;

  const typeBadge = `📌 _${poll.pollTypeLabel} (#${poll.topicNum})_`;

  const qSection = `\n❓ *${poll.questionText}*\n`;

  const optionsList = poll.options
    .map((opt, idx) => `🔹 *${letters[idx]})* ${cleanForWhatsAppPoll(opt)}`)
    .join('\n');

  const cta = isGu
    ? `\n\n🗳️ *નીચેના WhatsApp પોલમાં તમારો મત આપો અથવા તમારા જવાબ સાથે રિપ્લાય કરો!*`
    : isHi
    ? `\n\n🗳️ *नीचे दिए गए व्हाट्सएप पोल में अपना वोट दें या अपने उत्तर के साथ रिप्लाई करें!*`
    : `\n\n🗳️ *Vote in the WhatsApp Poll below or reply back with your choice!*`;

  let footer = '';
  if (advisor && advisor.advisorName) {
    footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *${advisor.advisorName}*\n` +
      `${advisor.designation ? `💼 ${advisor.designation}\n` : ''}` +
      `${advisor.companyName ? `🏢 ${advisor.companyName}\n` : ''}` +
      `${advisor.phoneNumber ? `📞 WhatsApp: ${advisor.phoneNumber}\n` : ''}` +
      `${advisor.amfiArn ? `📜 ARN: ${advisor.amfiArn}\n` : ''}` +
      `_FinAdvisor Pro Financial Literacy Initiative_`;
  } else {
    footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n_FinAdvisor Pro Financial Literacy Initiative_`;
  }

  return `${header}\n${typeBadge}${qSection}\n${optionsList}${cta}${footer}`;
}

// ---------------------------------------------------------------------------
// 3. OUTPUT B: NATIVE WHATSAPP POLL DATA STRUCTURE
// ---------------------------------------------------------------------------

export function buildNativePollOutput(questionText: string, options: string[]): OutputBNativePoll {
  const cleanQ = cleanForWhatsAppPoll(questionText);
  const cleanOpts = options.map((opt) => cleanForWhatsAppPoll(opt));

  const allOptionsJoined = cleanOpts.join('\n');
  const completePollContent = `${cleanQ}\n\n${cleanOpts.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}`;

  return {
    question: cleanQ,
    options: cleanOpts,
    allOptionsJoined,
    completePollContent,
  };
}

// ---------------------------------------------------------------------------
// 4. OUTPUT C: STEP-BY-STEP CONTEXT-AWARE CREATION GUIDE
// ---------------------------------------------------------------------------

export function buildCreationGuide(
  pollType: PollType,
  optionCount: number,
  isSingleAnswerExpected: boolean,
  lang: LanguageCode = 'en'
): OutputCCreationGuide {
  const isGu = lang === 'gu';
  const isHi = lang === 'hi';

  const steps: string[] = isGu
    ? [
        'ઉપર આપેલા "Copy Question" બટન પર ક્લિક કરીને પોલનો પ્રશ્ન કોપી કરો.',
        'WhatsApp ઓપન કરો અને જે વ્યક્તિગત ચેટ, બ્રોડકાસ્ટ યાદી કે ગ્રૂપમાં પોલ મોકલવો હોય તે ખોલો.',
        'Android ફોનમાં નીચે પેપરક્લિપ (📎 Attachment) મેનૂ અથવા iPhone માં પ્લસ (+) આઇકન પર ટેપ કરો, અને ત્યાંથી "Poll" (📊) પસંદ કરો.',
        'કોપી કરેલો પ્રશ્ન "Ask question" ફિલ્ડમાં પેસ્ટ કરો.',
        `દરેક વિકલ્પને અલગથી કોપી કરવા માટે "Copy Option 1" થી "Copy Option ${optionCount}" બટનનો ઉપયોગ કરો અને WhatsApp ના દરેક વિકલ્પ બોક્સમાં એક પછી એક પેસ્ટ કરો.`,
        'જો તમે "Copy All Options" અથવા "Copy Complete Poll Content" નો ઉપયોગ કરો છો, તો લખાણને નોટ્સમાં રાખીને મેન્યુઅલી અલગ કરો; WhatsApp આપમેળે બહુવિધ લાઈનોને અલગ વિકલ્પોમાં વહેંચતું નથી.',
        isSingleAnswerExpected
          ? '"Allow multiple answers" ટોગલ બંધ (OFF) રાખો: આ એક ચોક્કસ તથ્ય/ગણતરી આધારિત પોલ હોવાથી માત્ર એક જ સાચો જવાબ માન્ય છે.'
          : '"Allow multiple answers" ટોગલ વિશે: જો તમે ગ્રાહકોને એક કરતાં વધુ પ્રાથમિકતાઓ કે વિકલ્પો પસંદ કરવાની છૂટ આપવા માંગતા હોવ તો તેને ચાલુ (ON) રાખી શકો છો.',
        'પ્રશ્ન, તમામ વિકલ્પો અને સેટિંગ્સની ચકાસણી કરો અને છેલ્લે નીચે આપેલા લીલા "Send" (એરો) બટન પર ટેપ કરો.',
        'તમારો લાઇવ અને ઇન્ટરેક્ટિવ WhatsApp પોલ પસંદ કરેલ ચેટ કે ગ્રૂપમાં તરત જ દેખાશે!',
      ]
    : isHi
    ? [
        'ऊपर दिए गए "Copy Question" बटन पर क्लिक करके पोल का प्रश्न कॉपी करें।',
        'WhatsApp खोलें और जिस व्यक्ति या ग्रुप में पोल भेजना है उसे चुनें।',
        'Android में पेपरक्लिप (📎 अटैचमेंट) या iPhone में प्लस (+) आइकन पर टैप करें और "Poll" (📊) चुनें।',
        'कॉपी किया गया प्रश्न "Ask question" फील्ड में पेस्ट करें।',
        `प्रत्येक विकल्प को अलग से कॉपी करने के लिए "Copy Option 1" से "Copy Option ${optionCount}" का उपयोग करें और WhatsApp के विकल्प बॉक्स में एक-एक करके पेस्ट करें।`,
        'यदि आप "Copy All Options" या "Copy Complete Poll Content" चुनते हैं, तो टेक्स्ट को मैन्युअली अलग करें; WhatsApp अपने आप अलग-अलग लाइनों को विकल्प बॉक्स में नहीं बांटता।',
        isSingleAnswerExpected
          ? '"Allow multiple answers" टॉगल बंद (OFF) रखें: यह तथ्यात्मक/गणना आधारित प्रश्न है जिसका केवल एक ही सही उत्तर है।'
          : '"Allow multiple answers" टॉगल: यदि आप ग्राहकों को एक से अधिक विकल्प चुनने की अनुमति देना चाहते हैं तो इसे चालू (ON) रख सकते हैं।',
        'प्रश्न, विकल्प और सेटिंग्स की दोबारा जांच करें और "Send" बटन दबाएं।',
        'आपका इंटरैक्टिव WhatsApp पोल संबंधित चैट या ग्रुप में तुरंत लाइव हो जाएगा!',
      ]
    : [
        'Click the "Copy Question" button above to copy the poll question.',
        'Open WhatsApp and navigate to the desired client chat, broadcast list, or group.',
        'Tap the attachment icon (📎 paperclip on Android) or plus icon (+) on iPhone, then select "Poll" (📊).',
        'Paste the copied question into the "Ask question" field.',
        `Use the individual "Copy Option 1" to "Copy Option ${optionCount}" buttons to copy and paste each option into its own option field in WhatsApp.`,
        'If using "Copy All Options" or "Copy Complete Poll Content", separate lines manually; WhatsApp does not automatically split text across option fields.',
        isSingleAnswerExpected
          ? 'Keep the "Allow multiple answers" toggle OFF: As a factual knowledge/calculation poll, exactly one option is correct.'
          : 'Regarding the "Allow multiple answers" toggle: You may leave it ON if you want clients to select multiple financial preferences or goals.',
        'Review the question, options, and settings, then tap Send.',
        'The interactive, clickable WhatsApp poll is now live in your selected conversation!',
      ];

  const allowMultipleRule = isSingleAnswerExpected
    ? isGu
      ? 'મહત્વપૂર્ણ: આ નોલેજ/ગણતરી પોલ માટે "Allow multiple answers" ટોગલ બંધ (OFF) રાખો.'
      : isHi
      ? 'महत्वपूर्ण: इस ज्ञान/गणना पोल के लिए "Allow multiple answers" टॉगल को बंद (OFF) रखें।'
      : 'Rule: Keep "Allow multiple answers" toggle OFF for single-answer factual polls.'
    : isGu
      ? 'સુઝાવ: આ પસંદગી/ઓપિનિયન પોલ માટે "Allow multiple answers" ટોગલ ચાલુ (ON) રાખી શકાય છે.'
      : isHi
      ? 'सुझाव: इस वरीयता/राय पोल के लिए "Allow multiple answers" टॉगल को चालू (ON) रखा जा सकता है।'
      : 'Tip: You may leave "Allow multiple answers" toggle ON for preference and opinion polls.';

  const notes = isGu
    ? 'નોંધ: WhatsApp પોલમાં સાચો જવાબ જાહેર કરશો નહીં. રસ ધરાવતા ગ્રાહકો સાથે વ્યક્તિગત ચર્ચા શરૂ કરવા માટે આ પોલનો ઉપયોગ કરો.'
    : isHi
    ? 'नोट: WhatsApp पोल में सही उत्तर सार्वजनिक न करें। इसे ग्राहकों से व्यक्तिगत वित्तीय संवाद शुरू करने का माध्यम बनाएं।'
    : 'Note: Never reveal the correct answer inside the public poll options. Use client responses as a conversation starter for personalized advisory.';

  return {
    steps,
    allowMultipleRule,
    notes,
  };
}

// ---------------------------------------------------------------------------
// 5. DETERMINISTIC HIGH-FIDELITY POLL GENERATOR (FOR LOCAL / FALLBACK)
// ---------------------------------------------------------------------------

function formatInr(val: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
}

export function buildDeterministicPoll(request: PollGeneratorRequest): GeneratedPoll {
  const { topicNum, topicId, topicTitle, category, pollType, language, advisorProfile } = request;
  const isGu = language === 'gu';
  const isHi = language === 'hi';

  const pollTypeMeta = POLL_TYPES.find((pt) => pt.id === pollType) || POLL_TYPES[0];
  const categoryMeta = POLL_CATEGORIES.find((c) => c.id === category) || POLL_CATEGORIES[0];

  const pollTypeLabel = isGu
    ? pollTypeMeta.labelGu
    : isHi
    ? pollTypeMeta.labelHi
    : pollTypeMeta.label;

  const categoryTitle = isGu
    ? categoryMeta.nameGu
    : isHi
    ? categoryMeta.nameHi
    : categoryMeta.name;

  let questionText = '';
  let options: string[] = [];
  let isKnowledgeOrCalculation = pollTypeMeta.isSingleAnswerExpected;
  let correctIndex: number | undefined = undefined;
  let explanation: string | undefined = undefined;
  let stepByStepCalculations: string[] | undefined = undefined;
  let educationalTakeaway: string | undefined = undefined;

  // Branch 1: Calculation Poll Type (Deterministic Math)
  if (pollType === 'calculation' || topicId.includes('compounding') || topicId.includes('sip')) {
    isKnowledgeOrCalculation = true;
    correctIndex = 1; // Option B is correct for variation

    const sipMonthly = 10000;
    const cagr = 12.0;
    const years = 15;
    const calc = calculateSipFutureValue(sipMonthly, cagr, years, true);
    const investedFmt = formatInr(calc.investedAmount);
    const fvFmt = formatInr(calc.futureValue);

    // Realistic traps
    const simpleInterestTrap = formatInr(
      Math.round(calc.investedAmount + calc.investedAmount * (cagr / 100) * (years / 2))
    );
    const delayedTrap = formatInr(Math.round(calc.futureValue * 0.72));
    const investedOnlyTrap = formatInr(calc.investedAmount);

    questionText = isGu
      ? `દર મહિને ₹${formatInr(sipMonthly)} ની શિસ્તબદ્ધ SIP ૧૨.૦% ના અંદાજિત વાર્ષિક વળતર પર (દર મહિનાની શરૂઆતમાં રોકાણ, માસિક ચક્રવૃદ્ધિ) ૧૫ વર્ષ (${years * 12} મહિના) માટે કરતાં નજીકના ₹૧,૦૦૦ મુજબ કુલ પરિપક્વતા ભંડોળ કેટલું બનશે?`
      : isHi
      ? `प्रतिमाह ₹${formatInr(sipMonthly)} की अनुशासित SIP 12.0% अनुमानित वार्षिक रिटर्न पर (माह की शुरुआत में निवेश, मासिक चक्रवृद्धि) 15 वर्षों (${years * 12} माह) के लिए करने पर निकटतम ₹1,000 अनुसार कुल फंड कितना बनेगा?`
      : `If you invest a disciplined monthly SIP of ₹${formatInr(sipMonthly)} at an estimated 12.0% annual CAGR (invested at start of month with monthly compounding) for 15 years (${years * 12} months), what is the final maturity corpus rounded to nearest ₹1,000?`;

    options = [
      isGu ? `₹${investedOnlyTrap} (માત્ર જમા કરેલી રકમ)` : isHi ? `₹${investedOnlyTrap} (केवल जमा मूलधन)` : `₹${investedOnlyTrap} (Principal contributions only)`,
      isGu ? `₹${fvFmt} (ચક્રવૃદ્ધિ સહિત સાચું ભંડોળ)` : isHi ? `₹${fvFmt} (चक्रवृद्धि सहित सही फंड)` : `₹${fvFmt} (Compounded Annuity Corpus)`,
      isGu ? `₹${simpleInterestTrap} (સાદા વ્યાજ મુજબ)` : isHi ? `₹${simpleInterestTrap} (साधारण ब्याज अनुमान)` : `₹${simpleInterestTrap} (Simple interest estimate)`,
      isGu ? `₹${delayedTrap} (અપૂર્ણ ગણતરી)` : isHi ? `₹${delayedTrap} (अपूर्ण गणना)` : `₹${delayedTrap} (Underestimated return)`,
    ];

    explanation = isGu
      ? `મહિનાની શરૂઆતમાં જમા થતી SIP માટે Annuity Due ફોર્મ્યુલા FV = P × [((1+r)^n - 1)/r] × (1+r) વપરાય છે. P = ₹${formatInr(sipMonthly)}, r = 12%/12 = 0.01, n = 180. કુલ રોકાણ ₹${investedFmt} સામે સંપત્તિ ₹${fvFmt} બને છે.`
      : isHi
      ? `मासिक SIP के लिए Annuity Due सूत्र FV = P × [((1+r)^n - 1)/r] × (1+r) लागू होता है। P = ₹${formatInr(sipMonthly)}, r = 12%/12 = 0.01, n = 180 माह। कुल निवेश ₹${investedFmt} के मुकाबले अंतिम फंड ₹${fvFmt} बनता है।`
      : `Monthly SIP follows the Annuity Due formula: FV = P × [((1+r)^n - 1)/r] × (1+r). Inputs: P = ₹${formatInr(sipMonthly)}, r = 12%/12 = 0.01, n = 180 months. Total contribution ₹${investedFmt} grows to ₹${fvFmt}.`;

    stepByStepCalculations = [
      `Inputs: Monthly SIP = ₹${formatInr(sipMonthly)}, Tenure = 15 Years (180 months), Expected CAGR = 12.0%`,
      `Monthly Interest Rate (r) = 12% / 12 = 1.0% = 0.01`,
      `Formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)`,
      `Total Invested Amount = ₹${investedFmt}`,
      `Verified Future Value = ₹${fvFmt}`,
    ];

    educationalTakeaway = isGu
      ? 'કમ્પાઉન્ડિંગમાં વાસ્તવિક સંપત્તિ સર્જન છેલ્લા ૫ વર્ષોમાં સૌથી ઝડપથી થાય છે.'
      : isHi
      ? 'चक्रवृद्धि में वास्तविक संपत्ति निर्माण अंतिम 5 वर्षों में सबसे तेज गति से होता है।'
      : 'In compounding, the steepest wealth accumulation occurs in the final years; early consistency is king.';
  } else if (pollType === 'myth_vs_reality') {
    isKnowledgeOrCalculation = true;
    correctIndex = 0; // Option A is the factual reality

    questionText = isGu
      ? `નાણાકીય માન્યતા વિરુદ્ધ વાસ્તવિકતા: "જ્યારે શેરબજારમાં મોટો ઘટાડો આવે ત્યારે SIP બંધ કરી દેવી જોઈએ." — આ બાબતે સાચી નાણાકીય વાસ્તવિકતા શું છે?`
      : isHi
      ? `वित्तीय भ्रम बनाम वास्तविकता: "जब शेयर बाजार में भारी गिरावट आए तो SIP बंद कर देनी चाहिए।" — इस संबंध में सही वित्तीय वास्तविकता क्या है?`
      : `Financial Myth vs Reality: "One should immediately stop or pause their SIP when the stock market experiences a sharp correction." What is the factual reality?`;

    options = [
      isGu
        ? 'ગેરમાન્યતા: ઘટાડામાં SIP ચાલુ રાખવાથી સસ્તા ભાવે વધુ યુનિટ્સ મળે છે (રૂપિયા કોસ્ટ એવરેજિંગનો સાચો લાભ)'
        : isHi
        ? 'भ्रम: मंदी में SIP जारी रखने से सस्ते भाव पर अधिक यूनिट्स मिलते हैं (रुपी कॉस्ट एवरेजिंग का वास्तविक लाभ)'
        : 'Myth: Continuing SIP during market falls buys more units at cheaper NAV (Rupee Cost Averaging advantage)',
      isGu
        ? 'વાસ્તવિકતા: બજાર ઘટે ત્યારે હંમેશા તાત્કાલિક તમામ પૈસા પાછા ખેંચી લેવા જોઈએ'
        : isHi
        ? 'वास्तविकता: बाजार गिरते ही सारा पैसा तुरंत बैंक एफडी में डाल देना चाहिए'
        : 'Reality: One should immediately exit all equity investments into cash upon any market drop',
      isGu
        ? 'બજાર વધે ત્યારે જ SIP શરૂ કરવી જોઈએ'
        : isHi
        ? 'केवल तेजी के दौर में ही SIP शुरू करनी चाहिए'
        : 'One should only run SIPs when markets are continuously making all-time highs',
      isGu
        ? 'બજારના ઘટાડાથી SIP પોર્ટફોલિયો ક્યારેય પાછો રિકવર થતો નથી'
        : isHi
        ? 'बाजार की गिरावट से SIP पोर्टफोलियो कभी दोबारा उबर नहीं पाता'
        : 'Equity corrections permanently destroy all accumulated SIP returns without recovery',
    ];

    explanation = isGu
      ? 'શેરબજારમાં ઘટાડો એ સિસ્ટમેટિક રોકાણકારો માટે સુવર્ણ અવસર છે. નીચા એનએવી પર વધુ યુનિટ્સ જમા થાય છે, જે બજાર ફરી વધે ત્યારે અસાધારણ આલ્ફા વળતર આપે છે.'
      : isHi
      ? 'बाजार की गिरावट सिस्टमैटिक निवेशकों के लिए वरदान है। सस्ते एनएवी पर अधिक यूनिट्स जमा होती हैं, जिससे रिकवरी पर अत्यधिक लाभ मिलता है।'
      : 'Market dips are the engine of Rupee Cost Averaging. Accumulating higher units at discounted NAVs supercharges compounding when markets eventually recover.';

    educationalTakeaway = isGu
      ? 'બજારમાં ટાઈમિંગ કરતાં સમય આપવો (Time in the market) હંમેશા જીતે છે.'
      : isHi
      ? 'बाजार की टाइमिंग से बेहतर बाजार में बने रहना (Time in the market) है।'
      : 'Disciplined continuity during volatility separates successful wealth creators from panic sellers.';
  } else if (pollType === 'preference') {
    isKnowledgeOrCalculation = false;

    questionText = isGu
      ? `જો તમને આજે અચાનક ₹૫,૦૦,૦૦૦ નું બોનસ કે સરપ્લસ મળે, તો તમારી સૌથી પહેલી નાણાકીય પ્રાથમિકતા શું હશે?`
      : isHi
      ? `यदि आपको आज अचानक ₹5,00,000 का अतिरिक्त बोनस या लाभ मिले, तो आपकी सबसे पहली वित्तीय प्राथमिकता क्या होगी?`
      : `If you received an unexpected ₹5,00,000 bonus or financial windfall today, what would be your immediate primary financial choice?`;

    options = [
      isGu ? 'ભવિષ્યના લક્ષ્ય માટે ઇક્વિટી મ્યુચ્યુઅલ ફંડમાં STP / એકસાથે રોકાણ' : isHi ? 'दीर्घकालिक लक्ष्य हेतु म्यूचुअल फंड में व्यवस्थित निवेश' : 'Invest towards long-term goals via Equity Mutual Funds / STP',
      isGu ? 'હાલની મોંઘી પર્સનલ લોન અથવા ક્રેડિટ કાર્ડ દેવું ઝડપથી પૂરું કરવું' : isHi ? 'मौजूदा पर्सनल लोन या क्रेडिट कार्ड कर्ज का तुरंत निपटारा' : 'Prepay existing high-interest personal loans or credit card debt',
      isGu ? '૬-૧૨ મહિનાનો પરિવાર માટે ઇમરજન્સી ફંડ અલગ રાખવો' : isHi ? 'परिवार के लिए 6-12 महीने का इमरजेंसी फंड सुरक्षित करना' : 'Fortify 6-12 months of living expenses into an Emergency Liquid Fund',
      isGu ? 'પરિવાર સાથે આંતરરાષ્ટ્રીય પ્રવાસ અથવા મોંઘી કાર ડાઉન પેમેન્ટ' : isHi ? 'परिवार के साथ वेकेशन या नई कार का डाउन पेमेंट' : 'Lifestyle upgrade: Family luxury vacation or new vehicle down payment',
    ];

    educationalTakeaway = isGu
      ? 'આ પોલ ગ્રાહકોની માનસિકતા દર્શાવે છે અને તેમને યોગ્ય એસેટ એલોકેશન સમજાવવા માટે ઉત્તમ સંવાદ શરૂ કરે છે.'
      : isHi
      ? 'यह पोल ग्राहकों की प्राथमिकताओं को समझने और सही वित्तीय योजना बनाने का शानदार अवसर देता है।'
      : 'Client choices reveal current financial stress vs milestone clarity, unlocking personalized planning dialogues.';
  } else {
    // General Awareness / Planning / Goal Awareness / Decision-Making
    isKnowledgeOrCalculation = pollTypeMeta.isSingleAnswerExpected;
    if (isKnowledgeOrCalculation) correctIndex = 0;

    questionText = isGu
      ? `"${topicTitle}" ના સંદર્ભમાં તમારા પરિવારની આર્થિક સુરક્ષા સુનિશ્ચિત કરવા માટે સૌથી મહત્વનું પગલું કયું ગણાય?`
      : isHi
      ? `"${topicTitle}" के संदर्भ में अपने परिवार की आर्थिक सुरक्षा सुनिश्चित करने के लिए सबसे महत्वपूर्ण कदम क्या है?`
      : `In the context of "${topicTitle}", which step is universally considered the foundational pillar for lasting family prosperity?`;

    options = [
      isGu
        ? 'વાર્ષિક આવકના ૧૫-૨૦ ગણો શુદ્ધ ટર્મ વીમો અને પૂરતો હેલ્થ કવર લેવો'
        : isHi
        ? 'वार्षिक आय का 15-20 गुना टर्म इंश्योरेंस और पर्याप्त हेल्थ कवर लेना'
        : 'Securing 15-20x annual income pure term cover plus comprehensive health insurance',
      isGu
        ? 'કોઈપણ લિક્વિડિટી કે ઇમરજન્સી ફંડ વિના ૧૦૦% રકમ માત્ર શેરોમાં રોકવી'
        : isHi
        ? 'बिना इमरजेंसी फंड के सारा पैसा केवल शेयर बाजार में लगाना'
        : 'Investing 100% of income into volatile stocks without an emergency liquidity cushion',
      isGu
        ? 'બચત માટે દર વર્ષે નવા ક્રેડિટ કાર્ડ્સ લેતા રહેવું'
        : isHi
        ? 'हर साल नए क्रेडिट कार्ड लेकर खर्च चलाना'
        : 'Relying on rolling credit card limits to bridge monthly cashflow shortfalls',
      isGu
        ? 'નાણાકીય નિર્ણયો માત્ર સોશિયલ મીડિયા ટિપ્સના આધારે લેવા'
        : isHi
        ? 'वित्तीय निर्णय केवल सोशल मीडिया अफवाहों के आधार पर लेना'
        : 'Making family milestone investments purely based on unverified social media tips',
    ];

    explanation = isGu
      ? 'સંપત્તિ વૃદ્ધિ કરતાં પરિવારની સુરક્ષા પ્રથમ આવે છે. ઇમરજન્સી ફંડ અને પ્યોર ટર્મ લાઇફ કવર વગરનું રોકાણ કોઈપણ અણધારી આફતમાં ભાંગી પડે છે.'
      : isHi
      ? 'संपत्ति वृद्धि से पहले सुरक्षा आवश्यक है। आपातकालीन निधि और शुद्ध टर्म कवर के बिना निवेश किसी भी संकट में बिखर जाता है।'
      : 'Protection always precedes growth. Without liquid emergency funds and adequate pure term insurance, investments must be prematurely liquidated during distress.';

    educationalTakeaway = isGu
      ? 'પહેલા સુરક્ષા દીવાલ ચણો, પછી બજારનું જોખમ લઈને વેલ્થ ક્રિએટ કરો.'
      : isHi
      ? 'पहले सुरक्षा की दीवार बनाएं, फिर बाजार से संपत्ति का निर्माण करें।'
      : 'Secure family lifestyle protection before compounding aggressive market alpha.';
  }

  const pollId = `poll_${topicId}_${pollType}_${Date.now()}`;

  const outputA = buildShareableMessage(
    {
      questionText,
      options,
      topicTitle,
      topicNum,
      pollTypeLabel,
      pollType,
    },
    advisorProfile,
    language
  );

  const outputB = buildNativePollOutput(questionText, options);

  const outputC = buildCreationGuide(
    pollType,
    options.length,
    isKnowledgeOrCalculation,
    language
  );

  return {
    id: pollId,
    topicNum,
    topicId,
    topicTitle,
    category,
    categoryTitle,
    pollType,
    pollTypeLabel,
    language,
    questionText,
    options,
    isKnowledgeOrCalculation,
    correctIndex,
    explanation,
    stepByStepCalculations,
    educationalTakeaway,
    allowMultipleAnswersRecommended: !isKnowledgeOrCalculation,
    outputA_ShareableMessage: outputA,
    outputB_NativePoll: outputB,
    outputC_CreationGuide: outputC,
    createdAt: new Date().toISOString(),
    isAiGenerated: false,
    verificationSource: 'deterministic_math_engine',
  };
}

// ---------------------------------------------------------------------------
// 6. LOCAL PERSISTENT STORAGE HELPERS
// ---------------------------------------------------------------------------

export function getSavedPollHistory(topicId?: string): SavedPollRecord[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(POLL_STORAGE_KEY);
    if (!raw) return [];
    const records: SavedPollRecord[] = JSON.parse(raw);
    if (!Array.isArray(records)) return [];
    if (topicId) {
      return records.filter((r) => r.topicId === topicId);
    }
    return records;
  } catch (err) {
    console.warn('Failed to load poll history:', err);
    return [];
  }
}

export function savePollToHistory(record: SavedPollRecord): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const history = getSavedPollHistory();
    const updated = [record, ...history.filter((r) => r.id !== record.id)];
    localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.warn('Failed to save poll record:', err);
  }
}
