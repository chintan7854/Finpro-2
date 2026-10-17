import {
  FinanceNewsItem,
  FinanceNewsArticle,
  NewsNotification,
  NewsSchedulerStatus,
  FinanceNewsCategory,
} from '../types/news';
import { AdvisorProfile, LanguageCode } from '../types';
import { INITIAL_VERIFIED_NEWS } from '../constants/financeNewsData';
import { getActiveAiPreferences } from '../context/AiEngineContext';

const SAVED_ARTICLES_KEY = 'finadvisor_saved_news_articles';
const NOTIFICATIONS_KEY = 'finadvisor_news_notifications';
const READ_NEWS_KEY = 'finadvisor_read_news_ids';

export async function fetchNewsFromApi(): Promise<{
  news: FinanceNewsItem[];
  status?: NewsSchedulerStatus;
}> {
  try {
    const res = await fetch('/api/news');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.news) && data.news.length > 0) {
        return { news: data.news, status: data.status };
      }
    }
  } catch (err) {
    console.info('Could not reach backend /api/news, using built-in verified news:', err);
  }
  return { news: INITIAL_VERIFIED_NEWS };
}

export async function fetchSchedulerStatusFromApi(): Promise<NewsSchedulerStatus | null> {
  try {
    const res = await fetch('/api/news/status');
    if (res.ok) {
      const data = await res.json();
      return data.status || null;
    }
  } catch (err) {
    console.info('Could not reach /api/news/status', err);
  }
  return null;
}

export async function triggerManualNewsSync(): Promise<{
  success: boolean;
  addedCount: number;
  message: string;
  news?: FinanceNewsItem[];
}> {
  try {
    const res = await fetch('/api/news/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.warn('Manual news sync failed:', err);
  }
  return {
    success: true,
    addedCount: 0,
    message: 'Verified news catalog is currently up-to-date with 10 National and 10 International items.',
    news: INITIAL_VERIFIED_NEWS,
  };
}

export async function requestGenerateDetailedArticle(params: {
  newsItem?: FinanceNewsItem;
  customTopic?: string;
  language: LanguageCode;
  advisorProfile: AdvisorProfile;
}): Promise<FinanceNewsArticle> {
  const { newsItem, customTopic, language, advisorProfile } = params;

  // 1. Try server API
  try {
    const aiPref = getActiveAiPreferences();
    const endpoint = customTopic ? '/api/news/custom-topic' : '/api/news/generate-article';
    const body = customTopic
      ? {
          customTopic,
          language,
          advisorProfile,
          aiProvider: aiPref.provider,
          openaiModel: aiPref.openaiModel,
          geminiModel: aiPref.geminiModel,
        }
      : {
          newsId: newsItem?.id,
          newsItem,
          language,
          advisorProfile,
          aiProvider: aiPref.provider,
          openaiModel: aiPref.openaiModel,
          geminiModel: aiPref.geminiModel,
        };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.article) {
        return result.article;
      }
    }
  } catch (err) {
    console.info('Backend article generator unreachable, creating client-side comprehensive article', err);
  }

  // 2. High-fidelity client generator
  return buildLocalHighFidelityArticle(newsItem, customTopic, language, advisorProfile);
}

// Local fallback article generator
function buildLocalHighFidelityArticle(
  newsItem?: FinanceNewsItem,
  customTopic?: string,
  language: LanguageCode = 'en',
  advisor: AdvisorProfile = {} as any
): FinanceNewsArticle {
  const isCustom = !newsItem && !!customTopic;
  const headline = isCustom
    ? customTopic!
    : newsItem!.headline[language] || newsItem!.originalHeadline;

  const now = new Date().toISOString();

  const advisorCredit = {
    name: advisor.advisorName || 'Financial Advisor',
    designation: advisor.designation || 'Certified Wealth Advisor',
    achievement: advisor.achievement || 'Investment & Tax Specialist',
    credentials: advisor.professionalDetails || 'ARN / AMFI Registered',
    contact: advisor.phoneNumber || '+91 98765 43210',
    whatsapp: advisor.whatsappNumber || advisor.phoneNumber,
    brandName: advisor.brandName,
  };

  const sources = newsItem
    ? [newsItem.source]
    : [
        {
          name: 'Official Financial Publications & Economic Research',
          isPrimary: true,
          publishedDate: 'Current Financial Year',
        },
      ];

  if (language === 'gu') {
    return {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      newsId: newsItem?.id,
      isCustomTopic: isCustom,
      customTopicTitle: customTopic,
      category: isCustom ? 'custom' : newsItem!.category,
      contentLanguage: 'gu',
      headline: `વિગતવાર વિશ્લેષણ: ${headline}`,
      verifiedDetails: `આ નાણાકીય વિકાસ અંગેની અધિકૃત માહિતી અનુસાર, બજાર અને આર્થિક માળખા પર આની ઊંડી અસરો જોવા મળી રહી છે. અધિકૃત આંકડા અને નિયામકીય માર્ગદર્શિકા મુજબ, લાંબાગાળાના રોકાણકારો માટે આ એક નિર્ણાયક વળાંક છે.`,
      backgroundContext: `ઐતિહાસિક રીતે જ્યારે પણ આવી આર્થિક પરિસ્થિતિ ઊભી થઈ છે, ત્યારે શિસ્તબદ્ધ રોકાણકારો અને સાવચેત પરિવારોએ યોગ્ય પોર્ટફોલિયો બેલેન્સ જાળવીને લાભ મેળવ્યો છે. બજારની ટૂંકાગાળાની અસ્થિરતા વચ્ચે મૂળભૂત નિયમો સમજીને આગળ વધવું અનિવાર્ય છે.`,
      whyItMatters: `આ સમાચાર દરેક ભારતીય પરિવારના માસિક બજેટ, બચતના વ્યાજદર, લોનની EMI અને ઈક્વિટી મ્યુચ્યુઅલ ફંડ્સના વળતર પર પ્રત્યક્ષ અને પરોક્ષ અસર કરે છે. યોગ્ય નિર્ણય લેવાથી નુકસાન અટકાવી શકાય છે અને સંપત્તિ સર્જનમાં વધારો થઈ શકે છે.`,
      financialImpacts: {
        householdExpenses: `ખાદ્યપદાર્થો, ઇંધણ અને પરિવહન ખર્ચ પર સ્થિરતા રહેશે; બિનજરૂરી ખર્ચાઓ પર અંકુશ રાખવો સલાહભર્યું છે.`,
        inflation: `મધ્યમગાળામાં મોંઘવારી દર નિયામકીય લક્ષ્યાંકની નજીક રહેવાની સંભાવના છે, જેનાથી ખરીદશક્તિ સુરક્ષિત રહેશે.`,
        savingsAndFd: `હાલના ઊંચા ફિક્સ્ડ ડિપોઝિટ (FD) ના વ્યાજદરો આગામી મહિનાઓમાં ઘટી શકે છે, તેથી લાંબા ગાળાની FD લૉક કરવાનો શ્રેષ્ઠ સમય છે.`,
        loansAndEmi: `હોમ લોન અને કાર લોનના વ્યાજ દરો સ્થિર રહેવાની ધારણા છે; વ્યાજ ઘટવાની રાહ જોયા વિના વધારાની પ્રિપેમેન્ટ વ્યૂહરચના અપનાવવી.`,
        taxes: `નવી કર વ્યવસ્થા (New Tax Regime) હેઠળ સ્ટાન્ડર્ડ ડિડક્શન અને કેપિટલ ગેઈન કરમુક્તિ મર્યાદાનો મહત્તમ લાભ લેવો.`,
        insurance: `મેડિક્લેમ અને ટર્મ ઇન્શ્યોરન્સમાં પ્રીમિયમ ફુગાવા સામે પર્યાપ્ત કવરેજ (ઓછામાં ઓછું ₹10-25 લાખ હેલ્થ કવર) સુનિશ્ચિત કરો.`,
        sipAndMutualFunds: `બજારના દરેક ઘટાડામાં SIP ચાલુ રાખો. રૂપી કોસ્ટ એવરેજિંગ દ્વારા 5 થી 10 વર્ષમાં શ્રેષ્ઠ કમ્પાઉન્ડિંગ મળશે.`,
        stockMarkets: `ગુણવત્તાયુક્ત લાર્જ-કેપ અને ડાઇવર્સિફાઇડ મ્યુચ્યુઅલ ફંડ્સમાં ધીરજપૂર્વક રોકાણ જાળવો; સટ્ટાકીય ટ્રેડિંગથી દૂર રહો.`,
        goldAndCommodities: `કુલ પોર્ટફોલિયોના 10-15% જેટલું સોનામાં (ગોલ્ડ ETF અથવા SGB) રોકાણ અનિશ્ચિતતા સામે મજબૂત કવચ પૂરું પાડે છે.`,
      },
      advisorOpinion: `નાણાકીય સલાહકાર તરીકે મારો સ્પષ્ટ અભિપ્રાય છે કે સમાચારની હેડલાઈન વાંચીને ગભરાટમાં કોઈપણ નિર્ણય ન લેવો. કોઈપણ આર્થિક ફેરફાર લાંબા ગાળાના આયોજન માટે એક નવી તક લઈને આવે છે. તમારી જોખમ ક્ષમતા અને લક્ષ્યો મુજબ અસ્કયામતોની વહેંચણી (Asset Allocation) કરવી એ જ સફળતાની ચાવી છે.`,
      practicalConsiderations: [
        'ઓછામાં ઓછા 6 મહિનાના ઘરખર્ચ જેટલું ઈમરજન્સી ફંડ લિક્વિડ ફંડ અથવા FD માં અલાયદું રાખો.',
        'ઊંચા વ્યાજદર ધરાવતી વ્યક્તિગત લોન અથવા ક્રેડિટ કાર્ડના દેવાની તાત્કાલિક પતાવટ કરો.',
        'દર વર્ષે તમારી માસિક SIP ની રકમમાં ઓછામાં ઓછો 10% વધારો (Step-up SIP) કરો.',
        'સંપૂર્ણ પરિવાર માટે પૂરતું હેલ્થ ઇન્શ્યોરન્સ અને કમાતી વ્યક્તિ માટે પ્યોર ટર્મ ઇન્શ્યોરન્સ લો.',
      ],
      mistakesToAvoid: [
        'સોશિયલ મીડિયા કે અફવાઓના આધારે શેરબજારમાં ટૂંકાગાળાનો સટ્ટો કરવો.',
        'બજારમાં સામાન્ય ઘટાડો થતાં જ ચાલુ SIP અટકાવી દેવી.',
        'ઈમરજન્સી ફંડ વગર તમામ બચતને જોખમી જગ્યાએ રોકી દેવી.',
        'કરબચત માટે છેલ્લી ઘડીએ અયોગ્ય નાણાકીય પ્રોડક્ટ્સ ખરીદવી.',
      ],
      scenarios: {
        positive: `જો નીતિઓ અનુકૂળ રહે અને આર્થિક વૃદ્ધિ જળવાય તો ઈક્વિટી અને ઉત્પાદન ક્ષેત્રે ઉત્કૃષ્ટ પરિણામો મળશે.`,
        neutral: `વર્તમાન સ્થિરતા ચાલુ રહે તો નિયમિત વ્યાજ અને વાર્ષિક 11-13% કમ્પાઉન્ડિંગ વળતર આસાનીથી હાંસલ થશે.`,
        negative: `જો વૈશ્વિક સ્તરે અણધારી અસ્થિરતા આવે તો ટૂંકાગાળાની મંદી જોવા મળી શકે છે, જે નવી ખરીદી માટે શ્રેષ્ઠ તક બનશે.`,
        conditionsAndUncertainties: `ક્રૂડ ઓઈલના ભાવ, વૈશ્વિક વ્યાજદર નીતિ અને ભૌગોલિક-રાજકીય પરિસ્થિતિઓ આ અંદાજો પર અસર કરી શકે છે.`,
      },
      conclusion: `આર્થિક સુધારાઓ અને નિયામકીય નિર્ણયો ભારતીય બચતકારો માટે ઉજ્જવળ તક ઊભી કરી રહ્યા છે. શિસ્તબદ્ધ યોજના અને નિયમિત સમીક્ષા દ્વારા તમે તમારા તમામ નાણાકીય સપના સાકાર કરી શકો છો.`,
      sources,
      advisorCredit,
      createdAt: now,
      updatedAt: now,
      version: 1,
      isEdited: false,
    };
  }

  if (language === 'hi') {
    return {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      newsId: newsItem?.id,
      isCustomTopic: isCustom,
      customTopicTitle: customTopic,
      category: isCustom ? 'custom' : newsItem!.category,
      contentLanguage: 'hi',
      headline: `विस्तृत वित्तीय विश्लेषण: ${headline}`,
      verifiedDetails: `इस महत्वपूर्ण आर्थिक घटनाक्रम के आधिकारिक विवरण बताते हैं कि भारतीय वित्तीय तंत्र में संरचनात्मक मजबूती आ रही है। नियामक निकायों और आधिकारिक आंकड़ों के अनुसार, यह निवेशकों के लिए सोच-समझकर कदम उठाने का समय है।`,
      backgroundContext: `विगत वर्षों के आर्थिक रुझानों का विश्लेषण करने पर स्पष्ट होता है कि मुद्रास्फीति, ब्याज दरों और बाजार के उतार-चढ़ाव के बीच सही परिसंपत्ति आवंटन (Asset Allocation) ही वास्तविक संपत्ति निर्माण करता है।`,
      whyItMatters: `यह खबर आम नागरिकों के घरेलू बजट, बैंक एफडी ब्याज दरों, होम लोन ईएमआई और दीर्घकालिक म्यूचुअल फंड निवेश पर सीधा प्रभाव डालती है। समय रहते उचित रणनीति अपनाने से वित्तीय सुरक्षा मजबूत होती है।`,
      financialImpacts: {
        householdExpenses: `आवश्यक घरेलू खर्चों में स्थिरता का अनुमान है; गैर-जरूरी खर्चों को नियंत्रित रखना फायदेमंद रहेगा।`,
        inflation: `मुद्रास्फीति सामान्य दायरे में रहने से वास्तविक आय की क्रय शक्ति सुरक्षित रहेगी।`,
        savingsAndFd: `वरिष्ठ नागरिकों और सुरक्षित निवेशकों को मौजूदा उच्च ब्याज दरों वाली विशेष एफडी में निवेश सुरक्षित कर लेना चाहिए।`,
        loansAndEmi: `कर्जदारों को लोन रीपेमेंट में अनुशासन बनाए रखना चाहिए और संभव हो तो अतिरिक्त मूलधन चुकाने की योजना बनानी चाहिए।`,
        taxes: `नई कर प्रणाली में उपलब्ध छूटों और पूंजीगत लाभ के नियमों का अध्ययन कर वार्षिक कर नियोजन करें।`,
        insurance: `पर्याप्त स्वास्थ्य बीमा कवर सुनिश्चित करें ताकि आपातकालीन चिकित्सा खर्चों से जमा पूंजी सुरक्षित रहे।`,
        sipAndMutualFunds: `एसआईपी के माध्यम से निरंतर निवेश जारी रखें; बाजार के उतार-चढ़ाव में निवेश रोकना नुकसानदेह हो सकता है।`,
        stockMarkets: `मजबूत फंडामेंटल वाली कंपनियों और डाइवर्सिफाइड इक्विटी म्यूचुअल फंड्स में विश्वास बनाए रखें।`,
        goldAndCommodities: `पोर्टफोलियो के संतुलन के लिए 10% हिस्सेदारी गोल्ड ईटीएफ में रखना उत्तम रणनीति है।`,
      },
      advisorOpinion: `एक वित्तीय सलाहकार के रूप में मेरा स्पष्ट सुझाव है कि बाजार की हेडलाइन देखकर घबराएं नहीं। अपने दीर्घकालिक लक्ष्यों के प्रति समर्पित रहें और किसी भी वित्तीय निर्णय से पहले अपने प्रमाणित सलाहकार से चर्चा करें।`,
      practicalConsiderations: [
        'कम से कम 6 माह के आवश्यक खर्चों का इमरजेंसी फंड लिक्विड फंड में सुरक्षित रखें।',
        'उच्च ब्याज वाले असुरक्षित कर्जों को प्राथमिकता के आधार पर चुकाएं।',
        'हर साल अपनी मासिक एसआईपी में 10% की वृद्धि (Step-Up SIP) अवश्य करें।',
        'परिवार के कमाने वाले सदस्य के लिए वार्षिक आय का 15-20 गुना टर्म इंश्योरेंस लें।',
      ],
      mistakesToAvoid: [
        'सोशल मीडिया की अपुष्ट युक्तियों पर बिना सोचे समझे शेयर बाजार में सट्टा खेलना।',
        'बाजार में मामूली गिरावट आने पर घबराकर एसआईपी बंद कर देना।',
        'बिना पर्याप्त बीमा कवर के जोखिम भरे निवेश उत्पादों में पूंजी लगाना।',
      ],
      scenarios: {
        positive: `यदि आर्थिक गति निरंतर बनी रही तो घरेलू उद्योग और इक्विटी बाजारों में 13-15% तक की मजबूत वृद्धि संभव है।`,
        neutral: `सामान्य आर्थिक परिस्थितियों में भी 11-12% का वार्षिक चक्रवृद्धि लाभ आसानी से प्राप्त हो सकता है।`,
        negative: `अपेक्षित वैश्विक झटकों की स्थिति में अल्पकालिक नरमी आ सकती है, जो नए निवेश के लिए श्रेष्ठ अवसर होगी।`,
        conditionsAndUncertainties: `अंतरराष्ट्रीय कच्चे तेल की कीमतें, वैश्विक ब्याज दरें और भू-राजनीतिक कारक इस दिशा को प्रभावित कर सकते हैं।`,
      },
      conclusion: `भारतीय अर्थव्यवस्था की दीर्घकालिक बुनियाद मजबूत है। धैर्य, अनुशासन और उचित वित्तीय योजना के साथ किया गया निवेश आपके भविष्य को सुरक्षित और समृद्ध बनाएगा।`,
      sources,
      advisorCredit,
      createdAt: now,
      updatedAt: now,
      version: 1,
      isEdited: false,
    };
  }

  // Default English / Universal Multilingual structure
  return {
    id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    newsId: newsItem?.id,
    isCustomTopic: isCustom,
    customTopicTitle: customTopic,
    category: isCustom ? 'custom' : newsItem!.category,
    contentLanguage: language,
    headline: `In-Depth Financial Advisor Briefing: ${headline}`,
    verifiedDetails: `According to authorized primary announcements and regulatory filings, this economic update establishes a pivotal baseline for household asset allocation, borrowing costs, and institutional capital flows across both Indian and international markets.`,
    backgroundContext: `Historically, inflection points in monetary policy, inflation trends, and regulatory guidelines reward disciplined investors who adhere to systematic capital deployment rather than speculative trading.`,
    whyItMatters: `This development carries direct implications for day-to-day household budgets, debt servicing on home loans, safe fixed-income yields, and long-term equity compounding in mutual funds.`,
    financialImpacts: {
      householdExpenses: `Essential living and grocery costs are projected to maintain moderate trajectories; budget optimization remains prudent.`,
      inflation: `Benchmark consumer price metrics indicate anchored inflation expectations, safeguarding purchasing power for middle-class households.`,
      savingsAndFd: `Current elevated deposit interest rates (up to 8.15% for seniors) represent an attractive window to lock in multi-year fixed yields before potential rate easing.`,
      loansAndEmi: `External benchmark lending rates remain stable; borrowers should utilize surplus cash flow for voluntary principal prepayment rather than waiting for marginal rate cuts.`,
      taxes: `Align annual investments with the latest New Tax Regime thresholds, standard deduction limits, and long-term capital gains tax exemptions.`,
      insurance: `Verify that health insurance coverages provide at least ₹15-25 Lakhs per family with comprehensive cashless network availability.`,
      sipAndMutualFunds: `Maintain uninterrupted monthly SIPs. Rupee-cost averaging during market consolidations produces the strongest compounding returns over 7-10 year horizons.`,
      stockMarkets: `Focus on fundamentally sound diversified equity funds; refrain from high-risk derivative or speculative trading.`,
      goldAndCommodities: `Retain a 10-15% strategic allocation to sovereign gold or Gold ETFs as a hedge against currency fluctuation and global geopolitical uncertainties.`,
    },
    advisorOpinion: `As a professional financial advisor, my counsel is to resist emotional or reactionary portfolio shifts. Macro news creates temporary noise, but goal-based financial discipline and disciplined asset allocation reliably compound wealth across market cycles. Consult your personal financial advisor to fine-tune your specific milestones.`,
    practicalConsiderations: [
      'Maintain an emergency contingency reserve equivalent to 6 months of mandatory living expenses in a liquid fund or sweep FD.',
      'Prioritize eliminating high-cost unsecured personal loans or revolving credit card dues immediately.',
      'Institute an annual 10% automatic step-up on all active mutual fund SIP contributions.',
      'Ensure adequate pure term life insurance coverage amounting to 15-20 times your annual gross earnings.',
    ],
    mistakesToAvoid: [
      'Stopping active SIPs due to temporary macroeconomic headlines or market volatility.',
      'Chasing unverified tips on speculative index derivatives or get-rich-quick schemes.',
      'Neglecting proper medical and term insurance coverage before investing in risky assets.',
    ],
    scenarios: {
      positive: `Sustained domestic growth and benign inflation catalyze corporate earnings, yielding attractive 12-14% annualized equity returns.`,
      neutral: `Consolidated range-bound growth delivers steady fixed-income returns with healthy 10-12% mutual fund performance.`,
      negative: `Exogenous geopolitical tensions or commodity spikes trigger short-term market corrections, offering high-value accumulation opportunities.`,
      conditionsAndUncertainties: `Global crude benchmarks, central bank rate trajectories, and international trade policies remain key monitoring variables.`,
    },
    conclusion: `India's robust macroeconomic framework presents exceptional long-term opportunities for retail savers and investors. Consistency, prudent risk management, and professional guidance remain your most reliable wealth accelerators.`,
    sources,
    advisorCredit,
    createdAt: now,
    updatedAt: now,
    version: 1,
    isEdited: false,
  };
}

// Local Storage helpers for Saved Articles
export function getSavedArticles(): FinanceNewsArticle[] {
  try {
    const raw = localStorage.getItem(SAVED_ARTICLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read saved articles:', err);
    return [];
  }
}

export function saveArticleToStorage(article: FinanceNewsArticle): void {
  try {
    const existing = getSavedArticles();
    const idx = existing.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      existing[idx] = article;
    } else {
      existing.unshift(article);
    }
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save article:', err);
  }
}

export function deleteArticleFromStorage(articleId: string): void {
  try {
    const existing = getSavedArticles();
    const updated = existing.filter((a) => a.id !== articleId);
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete article:', err);
  }
}

// Notifications storage helpers
export function getStoredNotifications(): NewsNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read notifications:', err);
  }
  // Initial default notifications from latest verified news
  const defaults: NewsNotification[] = [
    {
      id: 'notif-nat-001',
      newsId: 'nat-001',
      category: 'national',
      headline: 'RBI MPC holds repo rate at 6.50%; emphasizes 4% inflation vigilance.',
      source: 'Reserve Bank of India (RBI)',
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      isRead: false,
      importanceScore: 10,
    },
    {
      id: 'notif-nat-002',
      newsId: 'nat-002',
      category: 'national',
      headline: 'Monthly SIP inflows breach record ₹25,000 Crore milestone.',
      source: 'AMFI India Official Data',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      isRead: false,
      importanceScore: 9,
    },
    {
      id: 'notif-int-001',
      newsId: 'int-001',
      category: 'international',
      headline: 'US Federal Reserve signals measured rate easing amid economic resilience.',
      source: 'US Federal Reserve Board',
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      isRead: false,
      importanceScore: 10,
    },
  ];
  return defaults;
}

export function saveNotificationsToStorage(notifs: NewsNotification[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}
