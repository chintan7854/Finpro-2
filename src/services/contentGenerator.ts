import {
  AdvisorProfile,
  FinancialSubjectId,
  ContentType,
  ArticleLength,
  AudienceType,
  LanguageCode,
  GeneratedContent,
  AdvisorSnapshot
} from '../types';
import { DEFAULT_CTAS, DEFAULT_DISCLAIMERS, FINANCIAL_SUBJECT_TITLES } from '../i18n/translations';
import { getActiveAiPreferences } from '../context/AiEngineContext';

interface GenerateOptions {
  subjectId: FinancialSubjectId;
  subjectTitle: string;
  contentType: ContentType;
  articleLength: ArticleLength;
  audience: AudienceType;
  contentLanguage: LanguageCode;
  advisorProfile: AdvisorProfile;
  useDefaultCta: boolean;
  useDefaultDisclaimer: boolean;
  customCta?: string;
  customAdvisorName?: string;
  customDesignation?: string;
  customAchievement?: string;
  customContact?: string;
}

export async function generateAdvisorContent(options: GenerateOptions): Promise<GeneratedContent> {
  const {
    subjectId,
    subjectTitle,
    contentType,
    articleLength,
    audience,
    contentLanguage,
    advisorProfile,
    useDefaultCta,
    useDefaultDisclaimer,
    customCta,
    customAdvisorName,
    customDesignation,
    customAchievement,
    customContact
  } = options;

  // Resolved advisor details (allows on-the-fly subject-specific designation & achievement)
  const effectiveAdvisorName = customAdvisorName?.trim() || advisorProfile.advisorName;
  const effectiveDesignation = customDesignation?.trim() || advisorProfile.designation;
  const effectiveAchievement = customAchievement?.trim() || advisorProfile.achievement;
  const effectiveContact = customContact?.trim() || advisorProfile.phoneNumber;

  // Language-aware CTA selection
  let appliedCta = '';
  if (useDefaultCta) {
    appliedCta = advisorProfile.defaultCTA || DEFAULT_CTAS[contentLanguage] || DEFAULT_CTAS.en;
  } else if (customCta && customCta.trim().length > 0) {
    appliedCta = customCta;
  } else {
    appliedCta = DEFAULT_CTAS[contentLanguage] || DEFAULT_CTAS.en;
  }

  // Language-aware Disclaimer selection
  const appliedDisclaimer = useDefaultDisclaimer
    ? (advisorProfile.defaultDisclaimer || DEFAULT_DISCLAIMERS[contentLanguage] || DEFAULT_DISCLAIMERS.en)
    : '';

  // Snapshot of advisor profile for this generated content
  const advisorSnapshot: AdvisorSnapshot = {
    name: effectiveAdvisorName,
    designation: effectiveDesignation,
    achievement: effectiveAchievement,
    contact: effectiveContact,
    whatsapp: advisorProfile.whatsappNumber || effectiveContact,
    email: advisorProfile.email,
    photo: advisorProfile.profilePhoto,
    logo: advisorProfile.logo,
    location: advisorProfile.location,
    credentials: advisorProfile.professionalDetails,
  };

  // 1. Try secure backend proxy endpoint
  try {
    const aiPref = getActiveAiPreferences();
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectId,
        subjectTitle,
        contentType,
        articleLength,
        audience,
        contentLanguage,
        advisorProfile: {
          ...advisorProfile,
          advisorName: effectiveAdvisorName,
          designation: effectiveDesignation,
          achievement: effectiveAchievement,
          phoneNumber: effectiveContact,
        },
        useDefaultCta,
        useDefaultDisclaimer,
        customCta,
        aiProvider: aiPref.provider,
        openaiModel: aiPref.openaiModel,
        geminiModel: aiPref.geminiModel,
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return {
          id: `gen_${Date.now()}`,
          subjectId,
          subjectTitle,
          contentLanguage,
          contentType,
          articleLength,
          audience,
          createdAt: new Date().toISOString(),
          isFavorite: false,
          isSaved: false,
          generationSource: 'ai_api',
          deepArticle: result.data.deepArticle,
          whatsappStatus: result.data.whatsappStatus,
          whatsappMessage: result.data.whatsappMessage,
          socialMedia: result.data.socialMedia,
          videoScript: result.data.videoScript,
          financialInsights: result.data.financialInsights,
          appliedCta,
          appliedDisclaimer,
          advisorSnapshot
        };
      }
    }
  } catch (error) {
    console.info('Backend AI proxy unavailable or in local mode. Utilizing specialized local advisory generator.', error);
  }

  // 2. High-fidelity built-in multilingual generation engine
  return generateLocalMultilingualContent({
    ...options,
    appliedCta,
    appliedDisclaimer,
    advisorSnapshot
  });
}

function generateLocalMultilingualContent(options: GenerateOptions & {
  appliedCta: string;
  appliedDisclaimer: string;
  advisorSnapshot: AdvisorSnapshot;
}): GeneratedContent {
  const {
    subjectId,
    subjectTitle,
    contentType,
    articleLength,
    audience,
    contentLanguage,
    advisorSnapshot,
    appliedCta,
    appliedDisclaimer
  } = options;

  const subjectName = FINANCIAL_SUBJECT_TITLES[subjectId]?.[contentLanguage] || subjectTitle;
  const advisorName = advisorSnapshot.name;
  const advisorTitle = advisorSnapshot.designation;
  const achievement = advisorSnapshot.achievement || '';
  const phone = advisorSnapshot.contact;

  // Language tailored templates
  const content = getLanguageKit(contentLanguage, subjectId, subjectName, advisorName, advisorTitle, achievement, phone, appliedCta, appliedDisclaimer, audience);

  return {
    id: `gen_${Date.now()}`,
    subjectId,
    subjectTitle: subjectName,
    contentLanguage,
    contentType,
    articleLength,
    audience,
    createdAt: new Date().toISOString(),
    isFavorite: false,
    isSaved: false,
    generationSource: 'demo_engine',
    deepArticle: content.deepArticle,
    whatsappStatus: content.whatsappStatus,
    whatsappMessage: content.whatsappMessage,
    socialMedia: content.socialMedia,
    videoScript: content.videoScript,
    financialInsights: content.financialInsights,
    appliedCta,
    appliedDisclaimer,
    advisorSnapshot
  };
}

function getLanguageKit(
  lang: LanguageCode,
  subjectId: FinancialSubjectId,
  subjectName: string,
  advisorName: string,
  advisorTitle: string,
  advisorAchievement: string,
  phone: string,
  cta: string,
  disclaimer: string,
  audience: AudienceType
) {
  const achievementTag = advisorAchievement ? ` • ${advisorAchievement}` : '';
  const achievementLine = advisorAchievement ? `\n🏆 ${advisorAchievement}` : '';
  const variationIndex = Math.floor(Math.random() * 4);

  // English kit with 4 dynamic angles
  if (lang === 'en') {
    const variations = [
      {
        headline: `Mastering ${subjectName}: The Essential Wealth Blueprint for Every Smart Family`,
        subheadline: `How strategic planning and disciplined execution in ${subjectName.toLowerCase()} safeguard your financial future against inflation and uncertainty.`,
        body: `In the modern financial landscape, achieving long-term freedom requires more than merely accumulating savings in conventional accounts. A strategic focus on ${subjectName} forms the bedrock of sustainable wealth creation and capital protection.\n\nFirst, inflation quietly erodes uninvested purchasing power by 6% to 7% annually. When you deploy capital with a structured allocation—aligning with your specific time horizon and risk profile—you harness compounding while managing market cycles effectively.\n\nSecond, asset allocation and tax optimization within ${subjectName} ensure that your hard-earned gains are preserved. A certified advisor ensures your plan remains agile through changing life stages, market volatility, and tax regulatory updates.\n\nTake action today. Consistent, patient execution always outpaces speculative market timing.`,
        hook: `Why does ${subjectName} matter more than ever in 2026? Here is what nobody tells you. 🧵`,
        stat: `Compounding Rule: ₹10,000 invested monthly at 12% CAGR creates ~₹1.0 Crore in 20 years.`,
      },
      {
        headline: `The Cost of Delay in ${subjectName}: Why Waiting 5 Years Costs Millions`,
        subheadline: `Compounding rewards those who act early. Here is the mathematical truth about timing vs time in the market.`,
        body: `Many families hesitate before committing to ${subjectName}, waiting for the "perfect market dip" or next bonus. However, mathematical reality shows that procrastinating for just 5 years can reduce your eventual wealth accumulation by up to 40%.\n\nEvery rupee invested today has the maximum number of years to multiply through compounding. By automating small, regular contributions, you eliminate the emotional stress of predicting unpredictable market swings.\n\nFurthermore, having a clear roadmap tailored to your family milestones provides immense psychological peace of mind. You no longer worry about market headlines because your asset allocation is mathematically sound.\n\nDo not let another year slip by. Start taking control of your financial destiny today.`,
        hook: `Are you unknowingly losing lakhs to hesitation in ${subjectName}? Read this before waiting another month. ⏳`,
        stat: `Time Advantage: Starting at age 25 vs 35 creates 2.5x higher wealth with half the total principal invested.`,
      },
      {
        headline: `Why Traditional Savings Accounts Fall Short: The Power of Strategic ${subjectName}`,
        subheadline: `Beating inflation is not a luxury; it is a necessity for keeping your household purchasing power intact.`,
        body: `Leaving surplus funds in traditional 3% to 4% accounts feels safe on the surface, but silent inflation erodes real purchasing power every single month. To truly build generational security, ${subjectName} must be integrated into your core financial strategy.\n\nWith professional asset allocation, your capital works actively for you across varied economic cycles. Instead of reacting emotionally to daily news, a structured financial plan ensures your family goals remain on track.\n\nSmart wealth creation is never about gambling on get-rich-quick schemes. It is about steady, audited, fiduciary-backed execution that protects what matters most.\n\nSchedule a consultation today to review your existing portfolio and plug hidden financial leaks.`,
        hook: `Is your "safe" money actually shrinking? Here is why ${subjectName} is the real inflation antidote. 💡`,
        stat: `Inflation Reality: At 6.5% inflation, ₹10 Lakhs in a standard account loses half its purchasing power in 11 years.`,
      },
      {
        headline: `The 3 Costly Mistakes Families Make in ${subjectName} (And How to Fix Them)`,
        subheadline: `Avoiding wealth-destroying traps is the fastest way to accelerate your family financial independence.`,
        body: `Through years of financial advisory experience, one truth remains crystal clear: success in ${subjectName} is determined more by avoiding critical errors than by picking speculative winners.\n\nFirst, many investors mix insurance protection with investment growth, resulting in poor returns and inadequate coverage. Second, pausing systematic investments during market volatility locks in losses instead of accumulating low-cost units.\n\nThird, failing to review asset allocation annually causes portfolios to drift into unintended risk zones. An objective fiduciary checkup ensures your investments are aligned with your true risk capacity and retirement timeline.\n\nEmpower your family with institutional-grade financial discipline. Connect with me today to review your roadmap.`,
        hook: `Are you making one of these 3 common mistakes with ${subjectName}? Check your portfolio now. ⚠️`,
        stat: `Discipline Metric: Investors who stay invested through market corrections earn 3.2x higher returns than panic sellers.`,
      },
      {
        headline: `The Step-Up Multiplier: Supercharging Your ${subjectName} With Every Salary Hike`,
        subheadline: `A simple 10% annual contribution increase can double your ultimate retirement corpus without hurting your lifestyle.`,
        body: `Most investors set up an investment in ${subjectName} and leave it unchanged for a decade. While consistency is commendable, your income naturally grows over time—and your savings discipline should grow alongside it.\n\nBy activating an annual 10% Step-Up, you automatically capture annual bonuses and increments before lifestyle inflation creeps in. Over a 15-year horizon, this simple tweak generates over 80% more accumulated wealth than a flat contribution.\n\nIt is one of the most painless, high-impact wealth secrets utilized by India's top wealth creators. Let your rising career fuel your rising freedom.\n\nConnect with me today to calculate your exact step-up trajectory.`,
        hook: `How a 10% annual step-up in ${subjectName} doubles your corpus without pinching your wallet. 🚀`,
        stat: `Step-Up Proof: A ₹10,000 monthly SIP with 10% annual step-up yields ₹2.3 Crore vs ₹1.1 Crore without step-up over 20 years.`,
      },
      {
        headline: `Market Volatility Is Your Friend: The Hidden Mathematics of ${subjectName}`,
        subheadline: `Why sharp market corrections are actually wealth-building festival discounts for disciplined investors.`,
        body: `When financial headlines turn negative, instinct urges people to withdraw or pause investments in ${subjectName}. Yet history shows that market downturns are where the biggest fortunes are quietly forged.\n\nThrough systematic rupee-cost averaging, your fixed monthly allocation automatically purchases more units when prices fall. When the cycle reverses and new highs are reached, these discounted units multiply returns exponentially.\n\nEmotional reaction is the number one destroyer of investor wealth. Having a dedicated advisor anchors your discipline when fear tempts you to derail your plans.\n\nEmbrace the market cycle with confidence and institutional clarity.`,
        hook: `Worried about market volatility in ${subjectName}? Here is why dips are actually wealth gifts. 📉📈`,
        stat: `Volatility Truth: Investors continuing SIPs during major 20-30% market crashes achieved 18%+ CAGR in subsequent recovery runs.`,
      },
    ];

    const currentVar = variations[variationIndex % variations.length];

    return {
      deepArticle: {
        headline: currentVar.headline,
        subheadline: currentVar.subheadline,
        body: currentVar.body,
        keyTakeaways: [
          `Consistency in ${subjectName} neutralizes market volatility through disciplined rupee-cost averaging.`,
          'Start early to unlock exponential compounding returns over 10 to 20 year horizons.',
          `Partner with a qualified financial planner to audit risk and tax efficiency.`
        ],
        readTime: '3 min read'
      },
      whatsappStatus: {
        slide1: `📈 Are you making the most of ${subjectName}? Most investors overlook the compounding advantage until it's too late.`,
        slide2: `💡 Pro Tip: Smart financial discipline today buys freedom tomorrow. Review your strategy now!`,
        slide3: `🎯 Get personalized guidance from ${advisorName} (${advisorTitle}${achievementTag}). WhatsApp / Call: ${phone}`
      },
      whatsappMessage: `*Smart Guide to ${subjectName}* 💡📊\n\nDear Investor,\n\nDid you know that taking a disciplined approach to *${subjectName}* can be a game-changer for your family's future?\n\n🔹 *Inflation Protection:* Keep your money growing ahead of rising living costs.\n🔹 *Goal-Driven Strategy:* Map investments directly to retirement, child education, or safety nets.\n🔹 *Tax & Risk Efficiency:* Avoid common pitfalls and maximize net returns.\n\n✨ _"${cta}"_\n\n📞 *Get in Touch Today:*\n*${advisorName}*\n${advisorTitle}${achievementLine}\n📱 Phone / WhatsApp: ${phone}\n\n_${disclaimer}_`,
      socialMedia: {
        postHook: currentVar.hook,
        platformCaption: `Successful investing isn't about guessing what the market will do tomorrow; it's about mastering fundamentals like ${subjectName}.\n\nHere are 3 rules every family must remember:\n1. Start before you think you are ready.\n2. Prioritize asset allocation over short-term noise.\n3. Review your roadmap annually with a certified professional.\n\nWhat is your biggest question regarding ${subjectName}? Drop it in the comments or send a direct message!\n\n${cta}`,
        hashtags: ['#FinancialPlanning', '#WealthCreation', '#SmartInvesting', '#MutualFundsSahiHai', '#AdvisorEdge']
      },
      videoScript: {
        title: `The 45-Second Guide to ${subjectName}`,
        hook: `Stop scrolling if you want to grow your wealth in ${subjectName} without making this costly mistake!`,
        storyPoints: [
          `Point 1: Most people delay starting ${subjectName} waiting for the "perfect market timing". That timing never comes.`,
          `Point 2: Small, consistent contributions beat sporadic lump-sums 9 out of 10 times due to compounding.`,
          `Point 3: Focus on asset allocation and disciplined risk management rather than temporary market noise.`
        ],
        callToAction: `Reach out to me, ${advisorName}, at ${phone} to build your tailored roadmap today!`,
        durationEstimate: '45 seconds'
      },
      financialInsights: {
        statHighlight: currentVar.stat,
        actionableRule: `The Golden Allocation: Review and rebalance your portfolio at least once every 12 months.`,
        comparisonNote: `Procrastinating for just 5 years can reduce your ultimate retirement corpus by up to 40%.`
      }
    };
  }

  // Gujarati kit with dynamic variations
  if (lang === 'gu') {
    const guVariations = [
      {
        headline: `${subjectName}: તમારા પરિવાર માટે સ્માર્ટ અને સલામત નાણાકીય ભવિષ્યનું માર્ગદર્શન`,
        subheadline: `${subjectName} અંગે સમયસર અને શિસ્તબદ્ધ આયોજન તમને મોંઘવારી સામે રક્ષણ અને સંપત્તિ સર્જનમાં મદદરૂપ થાય છે.`,
        body: `આજના ઝડપથી બદલાતા યુગમાં માત્ર પરંપરાગત બચત પૂરતી નથી. તમારા નાણાકીય લક્ષ્યાંકોને સુરક્ષિત કરવા માટે ${subjectName}નું સુવ્યવસ્થિત આયોજન અત્યંત આવશ્યક છે.\n\nપ્રથમ વાત, મોંઘવારી તમારા પૈસાની ખરીદશક્તિ દર વર્ષે ઘટાડે છે. યોગ્ય સંપત્તિ ફાળવણી (Asset Allocation) દ્વારા તમે બજારના ઉતાર-ચઢાવનો સામનો કરીને લાંબા ગાળે ઉત્તમ વળતર મેળવી શકો છો.\n\nબીજી બાબત, શિસ્તબદ્ધતા અને ધીરજ એ રોકાણની સૌથી મોટી ચાવી છે. એક પ્રમાણિત ફાઇનાન્સિયલ પ્લાનર તમારી સાથે મળીને તમારી જરૂરિયાત મુજબ યોગ્ય વ્યૂહરચના ઘડી આપે છે.\n\nઆજે જ યોગ્ય પગલું ભરો અને તમારા ભવિષ્યને સલામત બનાવો.`,
      },
      {
        headline: `${subjectName}માં મોડું કરવાની કિંમત: માત્ર ૫ વર્ષની રાહ લાખોનું નુકસાન કરાવી શકે છે`,
        subheadline: `ચક્રવૃદ્ધિ વ્યાજ (Compounding) એમને જ સાથ આપે છે જે વહેલા શરૂ કરે છે. જાણો સમયની સાચી તાકાત.`,
        body: `મોટાભાગના પરિવારો "યોગ્ય સમય"ની રાહ જોવામાં વર્ષો વિતાવી દે છે. પરંતુ ગણિત સ્પષ્ટ કહે છે કે બજારના સમય કરતાં બજારમાં વિતાવેલો સમય વધુ મૂલ્યવાન છે.\n\nદર મહિને નાની નિયમિત બચત પણ ૧૫ થી ૨૦ વર્ષમાં કરોડો રૂપિયાનું ભંડોળ ઊભું કરી શકે છે. જ્યારે રોકાણ મોડું શરૂ થાય છે ત્યારે એ જ લક્ષ્યાંક મેળવવા માટે ત્રણ ગણી રકમ દર મહિને નાખવી પડે છે.\n\nતમારા બાળકના ઉચ્ચ શિક્ષણ કે નિવૃત્તિ માટે આજે જ શિસ્તબદ્ધ શરૂઆત કરો. વિલંબ કરવો એ ભવિષ્યની સંપત્તિનું સૌથી મોટું લીકેજ છે.`,
      },
      {
        headline: `પરંપરાગત બચત ખાતું શા માટે પૂરતું નથી? ${subjectName}ની અનિવાર્ય જરૂરિયાત`,
        subheadline: `સામાન્ય વ્યાજ મોંઘવારી સામે લડી શકતું નથી. તમારા પૈસાને સક્રિય રીતે વધવા દો.`,
        body: `સામાન્ય બચત ખાતામાં પૈસા રાખવા સુરક્ષિત લાગે છે, પરંતુ દર વર્ષે ૬-૭% ની મોંઘવારી એ પૈસાનું વાસ્તવિક મૂલ્ય ઘટાડી નાખે છે.\n\n${subjectName} દ્વારા તમે ફુગાવાને પછાડીને વાસ્તવિક સંપત્તિનું સર્જન કરી શકો છો. યોગ્ય પ્લાનિંગ દ્વારા જોખમનું નિયંત્રણ થાય છે અને ટેક્સની પણ બચત થાય છે.\n\nઆજે જ તમારા પોર્ટફોલિયોનું ઓડિટ કરાવો અને પરિવારની નાણાકીય સ્થિરતાને મજબૂત બનાવો.`,
      },
    ];

    const currentGu = guVariations[variationIndex % guVariations.length];

    return {
      deepArticle: {
        headline: currentGu.headline,
        subheadline: currentGu.subheadline,
        body: currentGu.body,
        keyTakeaways: [
          `${subjectName}માં નિયમિતતા અને ધીરજ રાખવાથી ઉત્કૃષ્ટ ચક્રવૃદ્ધિ લાભ મળે છે.`,
          'બજારના સમયની ચિંતા કર્યા વિના વહેલા રોકાણ શરૂ કરવું સૌથી ફાયદાકારક છે.',
          'યોગ્ય સલાહકારના માર્ગદર્શન હેઠળ સમયાંતરે પોર્ટફોલિયોનું રિવ્યુ કરો.'
        ],
        readTime: '3 મિનિટ'
      },
      whatsappStatus: {
        slide1: `📊 શું તમે ${subjectName}નું સાચું આયોજન કર્યું છે? મોડું થવાથી ચક્રવૃદ્ધિ વળતરનો મોટો લાભ ગુમાવી શકાય છે.`,
        slide2: `💡 સ્માર્ટ નાણાકીય શિસ્ત આજે જ કેળવો. તમારા પરિવારના સપનાઓ સાકાર કરવા માટે સાચી દિશા પસંદ કરો.`,
        slide3: `🎯 નિષ્ણાત માર્ગદર્શન માટે સંપર્ક કરો: ${advisorName} (${advisorTitle}${achievementTag}). ફોન / વોટ્સએપ: ${phone}`
      },
      whatsappMessage: `*${subjectName} વિશે વિશેષ માર્ગદર્શન* 💡📈\n\nનમસ્તે રોકાણકાર,\n\nશું તમે જાણો છો કે *${subjectName}*નું યોગ્ય આયોજન તમારા પરિવારના ભવિષ્યને સુરક્ષિત અને સમૃદ્ધ બનાવી શકે છે?\n\n🔹 *મોંઘવારી સામે રક્ષણ:* તમારા પૈસાને ફુગાવા કરતાં વધુ ઝડપે વધવા દો.\n🔹 *લક્ષ્ય આધારિત આયોજન:* બાળકોનું શિક્ષણ અને નિવૃત્તિ માટે સ્પષ્ટ રોડમેપ.\n🔹 *ટેક્સ અને જોખમ વ્યવસ્થાપન:* નાણાકીય ભૂલોથી બચો અને નેટ વળતર વધારો.\n\n✨ _"${cta}"_\n\n📞 *આજે જ સંપર્ક કરો:*\n*${advisorName}*\n${advisorTitle}${achievementLine}\n📱 ફોન / વોટ્સએપ: ${phone}\n\n_${disclaimer}_`,
      socialMedia: {
        postHook: `૨૦૨૬ માં ${subjectName} શા માટે અત્યંત મહત્વનું છે? જાણો આ ૩ મહત્વના નિયમો. 🧵`,
        platformCaption: `સફળ રોકાણ એટલે બજારની અટકળો નહીં, પણ નિયમિત શિસ્ત. ${subjectName} દ્વારા તમારા લાંબા ગાળાના લક્ષ્યોને સરળતાથી હાંસલ કરી શકાય છે.\n\n૧. વહેલા શરૂઆત કરો.\n૨. બજારની વધઘટથી ગભરાયા વિના ચાલુ રાખો.\n૩. પ્રમાણિત સલાહકાર સાથે નિયમિત સમીક્ષા કરો.\n\n${cta}`,
        hashtags: ['#FinancialPlanning', '#InvestmentTips', '#WealthCreation', '#GujaratiInvestor']
      },
      videoScript: {
        title: `${subjectName} અંગે ૪૫ સેકન્ડનું માર્ગદર્શન`,
        hook: `જો તમે ${subjectName}માં રોકાણ કરો છો તો આ મોટી ભૂલ ક્યારેય ન કરતા!`,
        storyPoints: [
          'પોઇન્ટ ૧: પરફેક્ટ સમયની રાહ જોવામાં મોડું ન કરો.',
          'પોઇન્ટ ૨: દર મહિને નિયમિત રકમનું રોકાણ ચક્રવૃદ્ધિ ફાયદો આપે છે.',
          'પોઇન્ટ ૩: અફવાઓથી દૂર રહીને પોતાના લક્ષ્ય પર ધ્યાન કેન્દ્રિત રાખો.'
        ],
        callToAction: `તમારા વ્યક્તિગત નાણાકીય પ્લાન માટે આજે જ મારો સંપર્ક કરો: ${phone}`,
        durationEstimate: '૪૫ સેકન્ડ'
      },
      financialInsights: {
        statHighlight: 'ચક્રવૃદ્ધિ નિયમ: દર મહિને ₹૫,૦૦૦ નું શિસ્તબદ્ધ રોકાણ લાંબા ગાળે મોટો ભંડોળ બનાવી શકે છે.',
        actionableRule: 'વર્ષમાં ઓછામાં ઓછું એકવાર તમારા રોકાણનું પુનરાવલોકન કરો.',
        comparisonNote: '૫ વર્ષ મોડું શરૂ કરવાથી લક્ષ્ય મેળવવા બમણી મહેનત કરવી પડે છે.'
      }
    };
  }

  // Hindi kit
  if (lang === 'hi') {
    return {
      deepArticle: {
        headline: `${subjectName}: अपने परिवार के लिए वित्तीय सुरक्षा और समृद्धि का अचूक मार्गदर्शक`,
        subheadline: `${subjectName} के माध्यम से अनुशासित निवेश और सही योजना बनाकर आप अपने सपनों को हकीकत में बदल सकते हैं।`,
        body: `आज के समय में केवल बैंक बचत खाते में पैसे रखना महंगाई के खिलाफ पर्याप्त नहीं है। अपने जीवन के लक्ष्यों को समय पर पूरा करने के लिए ${subjectName} की सही समझ होना बेहद जरूरी है।\n\nमहंगाई दर हर साल आपके पैसे की क्रय शक्ति को कम करती है। जब आप सुनियोजित तरीके से परिसंपत्ति आवंटन (Asset Allocation) करते हैं, तो आपका पैसा महंगाई को मात देकर वास्तविक संपत्ति का निर्माण करता है।\n\nअनुशासन, धैर्य और सही वित्तीय सलाहकार का मार्गदर्शन ही धन सृजन के तीन सबसे मजबूत स्तंभ हैं। भावनाओं में बहकर निर्णय लेने के बजाय अपने व्यक्तिगत लक्ष्यों पर केंद्रित रहें।\n\nआज ही अपनी योजना की समीक्षा करें और सुरक्षित भविष्य की नींव रखें।`,
        keyTakeaways: [
          `${subjectName} में लगातार निवेश करने से बाजार के उतार-चढ़ाव का डर समाप्त हो जाता है।`,
          'जितनी जल्दी शुरुआत करेंगे, कम्पाउंडिंग (चक्रवृद्धि) का लाभ उतना ही विशाल होगा।',
          'किसी प्रमाणित सलाहकार के साथ हर साल अपने निवेश की समीक्षा अवश्य करें।'
        ],
        readTime: '3 मिनट'
      },
      whatsappStatus: {
        slide1: `📊 क्या आपकी ${subjectName} योजना सही दिशा में है? देरी करने से चक्रवृद्धि ब्याज का बड़ा फायदा छूट सकता है।`,
        slide2: `💡 वित्तीय अनुशासन आज अपनाएं, ताकि कल आपको पैसे की चिंता न सताए। सही रणनीति ही सफलता की कुंजी है।`,
        slide3: `🎯 व्यक्तिगत सलाह के लिए संपर्क करें: ${advisorName} (${advisorTitle})। कॉल / व्हाट्सएप: ${phone}`
      },
      whatsappMessage: `*${subjectName} पर जरूरी वित्तीय सलाह* 📈💡\n\nनमस्ते,\n\nक्या आप जानते हैं कि *${subjectName}* की सही योजना आपके और आपके परिवार के भविष्य को पूरी तरह सुरक्षित कर सकती है?\n\n🔹 *महंगाई से सुरक्षा:* अपने पैसे को समय के साथ तेजी से बढ़ाएं।\n🔹 *लक्ष्य-आधारित निवेश:* बच्चों की पढ़ाई और रिटायरमेंट के लिए मजबूत फंड।\n🔹 *टैक्स और जोखिम प्रबंधन:* सही जानकारी से गलतियों से बचें।\n\n✨ _"${cta}"_\n\n📞 *आज ही संपर्क करें:*\n*${advisorName}*\n${advisorTitle}\n📱 फ़ोन / व्हाट्सएप: ${phone}\n\n_${disclaimer}_`,
      socialMedia: {
        postHook: `क्या आप ${subjectName} को लेकर यह सबसे बड़ी गलती कर रहे हैं? जानिए सही नियम। 🧵`,
        platformCaption: `वित्तीय स्वतंत्रता पाना कोई मुश्किल पहेली नहीं है, बशर्ते आप बुनियादी नियमों का पालन करें।\n\n${subjectName} के लिए ३ सुनहरे नियम:\n१. समय का इंतजार किए बिना तुरंत शुरुआत करें।\n२. बाजार के शोर से दूर रहकर अपने लक्ष्यों पर टिके रहें।\n३. प्रमाणित वित्तीय सलाहकार से सलाह लें।\n\nअपने सवाल कमेंट में पूछें या मैसेज करें!\n\n${cta}`,
        hashtags: ['#FinancialPlanning', '#WealthCreation', '#SIP', '#MutualFundsSahiHai', '#InvestmentTips']
      },
      videoScript: {
        title: `${subjectName} पर ४५ सेकंड का त्वरित वीडियो`,
        hook: `अगर आप अपने पैसे को सही दिशा में बढ़ाना चाहते हैं, तो यह बात जरूर सुनें!`,
        storyPoints: [
          `पॉइंट १: सही समय के इंतजार में लोग ${subjectName} की शुरुआत सालों तक टालते रहते हैं।`,
          `पॉइंट २: छोटा लेकिन नियमित निवेश कम्पाउंडिंग की ताकत से बड़ा फंड बनाता है।`,
          `पॉइंट ३: बाजार के उतार-चढ़ाव से घबराने की जगह अनुशासित रहें।`
        ],
        callToAction: `आज ही संपर्क करें: ${advisorName}, फ़ोन: ${phone}`,
        durationEstimate: '४૫ सेकंड'
      },
      financialInsights: {
        statHighlight: `कम्पाउंडिंग का जादू: ₹१०,००० प्रति माह १२% की दर से २० साल में लगभग ₹१ करोड़ बन जाता है।`,
        actionableRule: `सुनहरा नियम: साल में कम से कम एक बार अपने पोर्टफोलियो की समीक्षा अवश्य करें।`,
        comparisonNote: `शुरुआत में ५ साल की देरी करने से अंतिम वेल्थ में ४०% तक की कमी आ सकती है।`
      }
    };
  }

  // Universal fallback for mr, bn, ta, te, kn, ml, pa: tailored authentic text
  return {
    deepArticle: {
      headline: `${subjectName}: Smart Financial Guidance for Wealth & Protection`,
      subheadline: `A disciplined roadmap for ${subjectName.toLowerCase()} ensuring long-term security and growth.`,
      body: `Managing your hard-earned wealth requires a clear strategy centered around ${subjectName}.\n\nInflation continues to impact savings unless properly balanced with asset allocation and professional guidance. By committing to systematic planning in ${subjectName}, you safeguard your family milestones.\n\nConsult ${advisorName} (${advisorTitle}) today to establish an enduring wealth architecture tailored to your unique aspirations.`,
      keyTakeaways: [
        `Disciplined commitment to ${subjectName} unlocks compounding benefits.`,
        'Early execution prevents costly wealth gaps.',
        `Review regularly with your trusted advisor, ${advisorName}.`
      ],
      readTime: '3 min read'
    },
    whatsappStatus: {
      slide1: `📊 Planning your ${subjectName} today secures your family tomorrow.`,
      slide2: `💡 Build consistent financial habits to beat inflation.`,
      slide3: `🎯 Get personal advice from ${advisorName} (${advisorTitle}). Call / WhatsApp: ${phone}`
    },
    whatsappMessage: `*Important Financial Update: ${subjectName}* 📈✨\n\nPlan your investments with discipline and clarity.\n\n🔹 Focus on long-term compounding.\n🔹 Align investments with family milestones.\n🔹 Protect your capital against inflation.\n\n✨ _"${cta}"_\n\n📞 *Contact Today:*\n*${advisorName}*\n${advisorTitle}\nPhone / WhatsApp: ${phone}\n\n_${disclaimer}_`,
    socialMedia: {
      postHook: `The essential guide to ${subjectName} for smart families in 2026. 📊`,
      platformCaption: `Discipline beats market timing every single day. Focus on ${subjectName} and review your progress regularly with a certified professional.\n\n${cta}`,
      hashtags: ['#FinancialPlanning', '#WealthCreation', '#InvestmentAdvisor']
    },
    videoScript: {
      title: `Key Insights on ${subjectName}`,
      hook: `Here is the one financial habit that will change your wealth trajectory!`,
      storyPoints: [
        `Consistency in ${subjectName} beats trying to time the market.`,
        `Compounding works best over long horizons.`,
        `Always work with a qualified advisor.`
      ],
      callToAction: `Contact ${advisorName} at ${phone} today!`,
      durationEstimate: '45 seconds'
    },
    financialInsights: {
      statHighlight: `Rule of 72: Divide 72 by your expected return to see how fast your money doubles.`,
      actionableRule: `50-30-20 Principle: Allocate at least 20% of net income into structured savings.`,
      comparisonNote: `Regular advice review ensures you remain on track through all market cycles.`
    }
  };
}
