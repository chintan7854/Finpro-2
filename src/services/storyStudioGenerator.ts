import { LanguageCode, AdvisorProfile } from '../types';
import {
  StoryFinancialTopicId,
  StoryAngleId,
  StoryPersonaId,
  StoryLengthId,
  StoryCtaStrategyId,
  GeneratedStoryResult,
} from '../types/storyStudio';
import { getStoryStudioI18n } from '../i18n/storyStudioI18n';

export interface StoryGenerationRequest {
  topicId: StoryFinancialTopicId;
  topicTitle: string;
  angleId: StoryAngleId;
  angleTitle: string;
  personaId: StoryPersonaId;
  personaTitle: string;
  lengthId: StoryLengthId;
  ctaStrategyId: StoryCtaStrategyId;
  ctaTitle: string;
  language: LanguageCode;
  advisorProfile: AdvisorProfile;
}

export async function generateViralStory(
  request: StoryGenerationRequest
): Promise<GeneratedStoryResult> {
  const {
    topicId,
    topicTitle,
    angleId,
    angleTitle,
    personaId,
    personaTitle,
    lengthId,
    ctaStrategyId,
    ctaTitle,
    language,
    advisorProfile,
  } = request;

  // 1. Attempt Server-Side Gemini API call
  try {
    const res = await fetch('/api/generate-story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId,
        topicTitle,
        angleId,
        angleTitle,
        personaId,
        personaTitle,
        lengthId,
        ctaStrategyId,
        ctaTitle,
        language,
        advisorProfile: {
          advisorName: advisorProfile.advisorName,
          designation: advisorProfile.designation,
          phoneNumber: advisorProfile.phoneNumber,
          professionalDetails: advisorProfile.professionalDetails,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        const formattedPayload = assembleFormattedWhatsAppPayload({
          title: d.title,
          hook: d.hook,
          storyParagraphs: d.storyParagraphs || [],
          takeaways: d.takeaways || [],
          forwardAppeal: d.forwardAppeal,
          ctaSignature: d.ctaSignature,
          advisorProfile,
        });

        return {
          id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          topicId,
          angleId,
          personaId,
          lengthId,
          ctaStrategyId,
          language,
          createdAt: new Date().toISOString(),
          title: d.title,
          hook: d.hook,
          storyParagraphs: d.storyParagraphs || [],
          takeaways: d.takeaways || [],
          forwardAppeal: d.forwardAppeal,
          ctaSignature: d.ctaSignature,
          fullFormattedPayload: formattedPayload,
          source: 'ai_api',
        };
      }
    }
  } catch (err) {
    console.info('Backend story API endpoint unavailable, using high-fidelity local engine', err);
  }

  // 2. High-Fidelity Multilingual Local Generator Fallback
  return generateLocalViralStory(request);
}

/**
 * Assembles WhatsApp-optimized markdown payload
 */
export function assembleFormattedWhatsAppPayload(params: {
  title: string;
  hook: string;
  storyParagraphs: string[];
  takeaways: string[];
  forwardAppeal: string;
  ctaSignature: string;
  advisorProfile: AdvisorProfile;
}): string {
  const { title, hook, storyParagraphs, takeaways, forwardAppeal, ctaSignature, advisorProfile } = params;

  const rawPhone = (advisorProfile.phoneNumber || '').replace(/[^0-9]/g, '');
  const waLink = rawPhone ? `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}` : '';

  const parts: string[] = [];

  // Title
  parts.push(`*${title.toUpperCase()}* 🚀`);
  if (hook) {
    parts.push(`_${hook}_`);
  }
  parts.push(''); // Empty line

  // Body Paragraphs
  storyParagraphs.forEach((para) => {
    parts.push(para);
    parts.push('');
  });

  // Takeaways
  if (takeaways && takeaways.length > 0) {
    parts.push('💡 *Key Financial Takeaways:*');
    takeaways.forEach((t, i) => {
      const icon = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i] || '•';
      parts.push(`${icon} ${t}`);
    });
    parts.push('');
  }

  // Forward Appeal
  if (forwardAppeal) {
    parts.push(`📲 *${forwardAppeal}*`);
    parts.push('');
  }

  // Advisor Signature Block
  parts.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  parts.push('📞 *Plan Your Financial Freedom Today:*');
  parts.push(`*${advisorProfile.advisorName || 'Financial Wealth Advisor'}*`);
  parts.push(`_${advisorProfile.designation || 'Certified Financial Planner'}_`);
  if (advisorProfile.professionalDetails) {
    parts.push(`📋 ${advisorProfile.professionalDetails}`);
  }
  if (advisorProfile.phoneNumber) {
    parts.push(`📱 Mobile: ${advisorProfile.phoneNumber}`);
  }
  if (waLink) {
    parts.push(`💬 WhatsApp Direct: ${waLink}`);
  }
  if (ctaSignature && !ctaSignature.includes(advisorProfile.advisorName)) {
    parts.push(`🎯 ${ctaSignature}`);
  }

  return parts.join('\n');
}

/**
 * Built-in high-fidelity local narrative generator
 * Supports Gujarati, Hindi, and English with deep cultural grounding
 */
function generateLocalViralStory(request: StoryGenerationRequest): GeneratedStoryResult {
  const {
    topicId,
    topicTitle,
    angleId,
    personaId,
    lengthId,
    ctaStrategyId,
    language,
    advisorProfile,
  } = request;

  const i18n = getStoryStudioI18n(language);
  const isGu = language === 'gu';
  const isHi = language === 'hi';

  const advisorName = advisorProfile.advisorName || (isGu ? 'રાજેશ શર્મા' : isHi ? 'राजेश शर्मा' : 'Rajesh Sharma');
  const cleanPhone = (advisorProfile.phoneNumber || '').replace(/[^0-9]/g, '') || '919825012345';
  const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;

  let title = '';
  let hook = '';
  let storyParagraphs: string[] = [];
  let takeaways: string[] = [];
  let forwardAppeal = '';
  let ctaSignature = '';

  if (isGu) {
    // Gujarati Local Generation
    if (angleId === 'duo_journey') {
      title = `રમેશ અને સુરેશ: એક જ પગાર, બે અલગ નિર્ણયો અને ₹૧.૨ કરોડનું અંતર 📈`;
      hook = `૨૦૧૨માં બે મિત્રોએ એક જ કંપનીમાં ₹૩૫,૦૦૦ના સરખા પગારથી નોકરી શરૂ કરી. ૧૨ વર્ષ પછી એક પાસે કરોડોની સંપત્તિ છે અને બીજો હજુ લોનના હપ્તા ભરે છે.`;
      storyParagraphs = [
        `સુરેશ દર મહિને બોનસ આવતા જ નવો ફોન લેતો અને દિવાળી પર મોટો ખર્ચ કરતો. તે હંમેશા કહેતો: "હજુ તો ઉંમર નાની છે, બચત પછી કરીશું." બીજી તરફ, રમેશે તેના ફાઇનાન્શિયલ એડવાઇઝરની સલાહથી દર મહિને માત્ર ₹૫,૦૦૦ની Step-Up SIP શરૂ કરી, જેમાં દર વર્ષે પગાર વધારા સાથે ૧૦% વધારો કર્યો.`,
        `આજે ૧૨ વર્ષ પછી, સુરેશના ખાતામાં હજુ પણ મહિનાના અંતે માત્ર ₹૧૫,૦૦૦ જ બચે છે અને ક્રેડિટ કાર્ડનું બિલ તેને પરેશાન કરે છે. જ્યારે રમેશના મ્યુચ્યુઅલ ફંડ પોર્ટફોલિયોનું મૂલ્ય ₹૪૮ લાખ વટાવી ગયું છે!`,
        lengthId === 'deep'
          ? `આ તફાવત કોઈ નસીબનો નહોતો, પરંતુ ૧૨ વર્ષના શિસ્તબદ્ધ ચક્રવૃદ્ધિ વ્યાજનો હતો. રમેશે ક્યારેય માર્કેટ ટાઇમ કરવાનો પ્રયાસ ન કર્યો; તેણે માત્ર સમયને પોતાનું કામ કરવા દીધું.`
          : `સૌથી મોટી વાત એ છે કે રમેશે ક્યારેય પોતાની જરૂરિયાતો મારી નહોતી, માત્ર બચત પહેલા કરી અને બાકીના પૈસા ખર્ચ્યા.`,
      ];
      takeaways = [
        `દર મહિને ₹૫,૦૦૦ની Step-Up SIP ૧૫ વર્ષમાં ૧૨% વળતર સાથે ₹૫૦ લાખથી વધુનું ભંડોળ બનાવી શકે છે.`,
        `ખર્ચ કર્યા પછી વધે તે બચાવવા કરતાં, પહેલા બચત અલગ કરીને બાકીનું ખર્ચવાની આદત કેળવો.`,
        `રોકાણ શરૂ કરવા માટે 'યોગ્ય સમય' ક્યારેય નથી આવતો; આજે જ શ્રેષ્ઠ સમય છે.`,
      ];
    } else if (angleId === 'cost_of_delay') {
      title = `માત્ર ૩ વર્ષ મોડું કરવાની કિંમત: ₹૨૮ લાખનું અદ્રશ્ય નુકસાન! ⏳`;
      hook = `"હું આવતા વર્ષે દિવાળી પછી SIP શરૂ કરીશ" - આ એક વાક્ય તમારા પરિવાર પાસેથી લાખો રૂપિયા છીનવી લે છે.`;
      storyParagraphs = [
        `૩૦ વર્ષના અમિતે વિચાર્યું કે હજુ તો ઘણી ઉંમર છે, રોકાણ ૩૩ વર્ષે કરીશું. તેના સહકર્મી પ્રિયાએ ૩૦ વર્ષની ઉંમરે જ ₹૧૦,૦૦૦ની માસિક SIP શરૂ કરી દીધી.`,
        `જ્યારે બંને ૫૦ વર્ષની ઉંમરે પહોંચ્યા, ત્યારે અમિતે પ્રિયા જેટલું જ ભંડોળ મેળવવા માટે દર મહિને ₹૧૮,૫૦૦ જમા કરાવવા પડ્યા! માત્ર ૩ વર્ષ મોડું કરવાને કારણે અમિતને પોતાના ખિસ્સામાંથી ₹૧૨ લાખ વધુ રોકવા પડ્યા અને છતાં ₹૨૮ લાખનું રિટર્ન ગુમાવ્યું.`,
      ];
      takeaways = [
        `Compounding માં 'કેટલા પૈસા રોકો છો' તેના કરતાં 'કેટલા વર્ષ માટે રોકો છો' તે ૧૦ ગણું વધુ મહત્વનું છે.`,
        `૩ વર્ષનો વિલંબ ભવિષ્યના ૧૫ વર્ષની મહેનત જેટલો મોંઘો સાબિત થાય છે.`,
      ];
    } else {
      title = `સપનાનું ઘર કે મોંઘવારીનો બોજ? સાચી નાણાકીય આઝાદીનું રહસ્ય 🏡`;
      hook = `દરેક મધ્યમવર્ગીય પરિવારનું સપનું હોય છે કે પોતાનું ઘર હોય અને બાળકોનું ભવિષ્ય સુરક્ષિત રહે. પણ શું તમારું આયોજન મોંઘવારી સામે ટકી શકશે?`;
      storyParagraphs = [
        `આજે જે એન્જિનિયરિંગ કે મેડિકલનો અભ્યાસ ₹૧૫ લાખમાં થાય છે, તે ૧૫ વર્ષ પછી ૧૦% શિક્ષણ મોંઘવારીને કારણે ₹૬૨ લાખનો થશે! માત્ર બેંક FD કે સેવિંગ્સ એકાઉન્ટમાં પૈસા રાખવાથી આ રકમ ક્યારેય ભેગી નહીં થાય.`,
        `જ્યારે તમે દર મહિને યોગ્ય એસેટ એલોકેશન સાથે ઇક્વિટી અને ડેટમાં નાણાં રોકો છો, ત્યારે તમે મોંઘવારીને સરળતાથી હરાવી શકો છો. તમારા પરિવારની ખુશીઓ કોઈ લોન પર નિર્ભર ન રહેવી જોઈએ.`,
      ];
      takeaways = [
        `શિક્ષણ અને આરોગ્યની મોંઘવારી સામાન્ય મોંઘવારી કરતાં બમણી ઝડપે (૧૦-૧૨%) વધે છે.`,
        `સાચો ટર્મ પ્લાન અને ઇક્વિટી SIP પરિવારને સાચી સુરક્ષા અને સંપત્તિ બંને આપે છે.`,
      ];
    }

    forwardAppeal =
      ctaStrategyId === 'viral_forward'
        ? 'તમારા પરિવારના વોટ્સએપ ગ્રૂપમાં અને ખાસ મિત્રોને આ વાર્તા જરૂર મોકલો જેથી તેઓ પણ સમયસર જાગૃત બને.'
        : ctaStrategyId === 'portfolio_audit'
        ? 'જો તમારી પાસે જૂની LIC પોલિસી કે ફંડ્સ હોય તો તેનું ૧૦૦% ગોપનીય ફ્રી રિવ્યુ કરાવો.'
        : 'તમારા બાળકના શિક્ષણ કે રિટાયરમેન્ટનું પર્સનલ રોડમેપ બનાવવા આજે જ મને વોટ્સએપ કરો.';

    ctaSignature = `આજે જ સલાહ લો: ${advisorName} | સંપર્ક: ${advisorProfile.phoneNumber || '+91 98250 12345'}`;
  } else if (isHi) {
    // Hindi Local Generation
    title = `रमेश और सुरेश की कहानी: एक जैसी सैलरी लेकिन ₹1 करोड़ का फर्क! 📊`;
    hook = `2014 में दो दोस्तों ने ₹30,000 की नौकरी से शुरुआत की। आज 10 साल बाद एक के पास फाइनेंशियल फ्रीडम है और दूसरा ईएमआई के चक्रव्यूह में फंसा है।`;
    storyParagraphs = [
      `सुरेश हर बोनस में नया फोन खरीदता और कहता: "अभी तो उम्र ही क्या है, बचत बाद में करेंगे।" दूसरी तरफ रमेश ने अपने फाइनेंशियल एडवाइजर की सलाह से पहले दिन से ₹5,000 की स्टेप-अप SIP शुरू की।`,
      `आज 10 साल बाद सुरेश क्रेडिट कार्ड के न्यूनतम भुगतान (Minimum Due) के जाल में है, जबकि रमेश का पोर्टफोलियो ₹45 लाख का आंकड़ा पार कर चुका है!`,
      lengthId === 'deep'
        ? `यह कोई जादू नहीं, बल्कि समय और चक्रवृद्धि ब्याज (Compounding) की शक्ति है। जब आप पैसे के लिए काम करने के बजाय पैसे को अपने लिए काम पर लगाते हैं, तब असली दौलत बनती है।`
        : `सच्ची अमीरी दिखावे में नहीं, बल्कि बैंक बैलेंस और मन की शांति में होती है।`,
    ];
    takeaways = [
      `खर्च करने के बाद जो बचे उसे बचाने के बजाय, पहले बचत अलग करें और बाकी खर्च करें।`,
      `सालाना 10% स्टेप-अप SIP आपके वेल्थ कॉर्पस को दोगुना तेजी से बढ़ाती है।`,
      `शुरुआत करने का सबसे अच्छा समय 10 साल पहले था, और दूसरा सबसे अच्छा समय 'आज' है।`,
    ];
    forwardAppeal = 'यह कहानी अपने 3 दोस्तों और परिवारजनों को जरूर फॉरवर्ड करें जिन्हें समय की कीमत समझनी चाहिए।';
    ctaSignature = `वित्तीय मार्गदर्शन के लिए संपर्क करें: ${advisorName} | व्हाट्सएप: ${advisorProfile.phoneNumber || '+91 98250 12345'}`;
  } else {
    // English Local Generation
    if (angleId === 'duo_journey') {
      title = `Ramesh vs Suresh: Same Salary, Two Choices, and a ₹1.2 Crore Wealth Gap 📈`;
      hook = `In 2012, two close friends joined the same IT company earning ₹35,000/month. 12 years later, one is financially independent while the other is trapped in EMIs.`;
      storyParagraphs = [
        `Suresh believed in living in the moment. Every Diwali bonus went into the latest gadget, weekend luxury dining, and zero liquid cushion. "I'm only 26, retirement is 30 years away," he often joked at the office cafeteria.`,
        `Ramesh took a quiet, different route. On the advice of his certified financial advisor, he started a disciplined ₹6,000 monthly Step-Up SIP, increasing it by 10% with every annual increment, while securing his family with a pure ₹1 Crore term plan.`,
        lengthId === 'deep'
          ? `Fast forward to today: Suresh has upgraded his lifestyle but carries three active loans and zero emergency liquidity. Meanwhile, Ramesh's mutual fund corpus has crossed ₹54 Lakhs, quietly compounding toward a ₹2 Crore milestone without a single day of financial anxiety.`
          : `The difference was never their income—it was their discipline and understanding of compound interest over time.`,
      ];
      takeaways = [
        `A ₹6,000 Step-Up SIP compounding at 12.5% over 15 years builds over ₹50 Lakhs from a modest monthly allocation.`,
        `Always invest first and spend what is left, rather than spending first and saving the crumbs.`,
        `Market volatility is an opportunity for SIP investors, not a threat.`,
      ];
    } else if (angleId === 'cost_of_delay') {
      title = `The Brutal Cost of Waiting: How a 3-Year Delay Destroys ₹28 Lakhs in Wealth ⏳`;
      hook = `"I'll start my investments after Diwali / next financial year." This single innocent sentence is the costliest phrase in personal finance.`;
      storyParagraphs = [
        `Meet Amit (age 27) and Priya (age 24). Priya started investing ₹10,000 a month in diversified equity funds immediately. Amit waited just 3 years until age 27 to start the exact same SIP.`,
        `By age 47, even though Amit invested diligently for 20 years, Priya's corpus stood higher by an astonishing ₹28.5 Lakhs! To match Priya, Amit would have had to invest nearly double the monthly amount every single month.`,
      ];
      takeaways = [
        `Time in the market matters far more than timing the market.`,
        `Delaying by 3 years costs more wealth than 15 years of future extra contributions combined.`,
      ];
    } else {
      title = `Silent Wealth Killer: Why Your Bank Fixed Deposit Is Losing Money Every Day 💸`;
      hook = `Do you feel safe keeping ₹20 Lakhs in fixed deposits earning 6.5% interest? What looks like 'safety' is actually guaranteed slow wealth erosion.`;
      storyParagraphs = [
        `Consider this math: If your FD earns 6.8% interest and you are in the 30% tax bracket, your post-tax return drops to 4.76%. Meanwhile, real household and medical inflation is running at 7% to 8%.`,
        `Every single year, your purchasing power quietly drops by 2% to 3%. In 15 years, what costs ₹20 Lakhs today will require ₹55 Lakhs. Real wealth preservation requires productive equity capital and tax-efficient hybrid planning.`,
      ];
      takeaways = [
        `Post-tax FD returns fail to beat real education and healthcare inflation.`,
        `Asset allocation across equity SIPs, debt, and sovereign gold protects purchasing power.`,
      ];
    }

    forwardAppeal =
      ctaStrategyId === 'viral_forward'
        ? 'Forward this to 3 friends or family members who need this eye-opening reminder today.'
        : ctaStrategyId === 'portfolio_audit'
        ? 'Send your existing policy and mutual fund portfolio for a 100% confidential, zero-cost health audit.'
        : 'Drop a message on WhatsApp to craft your customized life-milestone roadmap today.';

    ctaSignature = `Consult: ${advisorName} (${advisorProfile.designation || 'CFP'}) | WhatsApp: ${advisorProfile.phoneNumber || '+91 98250 12345'}`;
  }

  const formattedPayload = assembleFormattedWhatsAppPayload({
    title,
    hook,
    storyParagraphs,
    takeaways,
    forwardAppeal,
    ctaSignature,
    advisorProfile,
  });

  return {
    id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    topicId,
    angleId,
    personaId,
    lengthId,
    ctaStrategyId,
    language,
    createdAt: new Date().toISOString(),
    title,
    hook,
    storyParagraphs,
    takeaways,
    forwardAppeal,
    ctaSignature,
    fullFormattedPayload: formattedPayload,
    source: 'local_engine',
  };
}
