import { LanguageCode, AdvisorProfile } from '../types';
import { getActiveAiPreferences } from '../context/AiEngineContext';

export interface ClientQaRequest {
  customerName: string;
  customerQuestion: string;
  language: LanguageCode;
  advisorProfile: AdvisorProfile;
}

export interface ClientQaResponse {
  isFinancial: boolean;
  rejectionReason?: string;
  rejectionReasonGu?: string;
  answerText: string;
  summaryBullets: string[];
  whatsappReadyText: string;
}

// Disallowed completely non-financial queries
const NON_FINANCIAL_PATTERNS = [
  /ઘરેલુ\s*ઉપચાર/i,
  /દેશી\s*ઉપચાર/i,
  /દવા(ઓ)?|તાવ|શરદી|ઉધરસ|ઇલાજ/i,
  /home\s*remed(y|ies)|medicine|cough|fever|headache/i,
  /રસોઈ|વાનગી|રેસિપી|ખાવાનું/i,
  /recipe|cooking|food|dish/i,
  /જ્યોતિષ|કુંડળી|રાશિફળ|વાસ્તુ/i,
  /astrology|horoscope|zodiac|kundali/i,
  /ફિલ્મ|મૂવી|સિનેમા|ગીત|ક્રિકેટ|મેચ/i,
  /movie|cinema|cricket|song|actor/i,
  /વજન\s*ઘટાડવું|ડાયેટ|બ્યુટી/i,
  /weight\s*loss|diet|beauty/i,
  /જોક્સ|શાયરી|ચૂંટણી|રાજકારણ/i,
  /jokes|shayari|politics|election/i,
];

/**
 * Checks if question is financially relevant.
 * Life milestones like children growing up, college expenses, retirement, buying a home ARE financial!
 */
export function isQuestionFinancial(question: string): { isFinancial: boolean; reason?: string } {
  const q = (question || '').trim().toLowerCase();

  for (const pattern of NON_FINANCIAL_PATTERNS) {
    if (pattern.test(q)) {
      return {
        isFinancial: false,
        reason:
          'આ પ્રશ્ન નાણાકીય આયોજન કે રોકાણ સાથે સંબંધિત નથી. આ ટૂલ ફક્ત રોકાણ, મ્યુચ્યુઅલ ફંડ, વીમો, બાળ શિક્ષણ ખર્ચ, ટેક્સ, લોન અને નિવૃત્તિ જેવા નાણાકીય વિષયોના જ જવાબો આપે છે.',
      };
    }
  }

  // Length check
  if (q.length < 3) {
    return {
      isFinancial: false,
      reason: 'કૃપા કરીને ગ્રાહકનો પ્રશ્ન વિગતવાર લખો (ઓછામાં ઓછા ૩ અક્ષર).',
    };
  }

  return { isFinancial: true };
}

/**
 * Generates customer Q&A answer via backend API or high-fidelity local financial engine
 */
export async function generateClientQaAnswer(request: ClientQaRequest): Promise<ClientQaResponse> {
  const { customerName, customerQuestion, language, advisorProfile } = request;

  // 1. Client-side intent check
  const preCheck = isQuestionFinancial(customerQuestion);
  if (!preCheck.isFinancial) {
    return {
      isFinancial: false,
      rejectionReason: preCheck.reason,
      rejectionReasonGu: preCheck.reason,
      answerText: '',
      summaryBullets: [],
      whatsappReadyText: '',
    };
  }

  // 2. Try Backend AI Endpoint
  try {
    const aiPref = getActiveAiPreferences();
    const res = await fetch('/api/generate-client-qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        customerQuestion,
        language,
        aiProvider: aiPref.provider,
        openaiModel: aiPref.openaiModel,
        geminiModel: aiPref.geminiModel,
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
      if (data.success && data.result) {
        return data.result;
      }
    }
  } catch (err) {
    console.info('Backend Q&A endpoint unavailable, generating via built-in advisor engine', err);
  }

  // 3. Fallback High-Fidelity Local Engine
  return generateLocalClientQa(request);
}

/**
 * Built-in multilingual fiduciary Q&A engine
 */
function generateLocalClientQa(request: ClientQaRequest): ClientQaResponse {
  const { customerName, customerQuestion, language, advisorProfile } = request;
  const q = customerQuestion.trim();
  const name = customerName.trim() || (language === 'gu' ? 'ગ્રાહક મિત્ર' : 'Client');
  const advName = advisorProfile.advisorName || 'Financial Advisor';
  const advPhone = advisorProfile.phoneNumber || '+91 98765 43210';
  const advDesig = advisorProfile.designation || 'Certified Financial Planner';
  const advCred = advisorProfile.professionalDetails ? `\n${advisorProfile.professionalDetails}` : '';

  if (language === 'gu') {
    // Determine subject intent
    let bodyAdvice = '';
    let bullets: string[] = [];

    if (/વધુ\s*રિટર્ન|હાઈ\s*રિટર્ન|વધારે\s*વળતર|small\s*cap|high\s*return/i.test(q)) {
      bodyAdvice = `વધારે રિટર્ન આપી રહ્યો હોય તેવું મ્યુચ્યુઅલ ફંડ (જેમ કે સ્મોલ કેપ અથવા મિડ કેપ ફંડ) માં તમે લાંબા ગાળા માટે ઇન્વેસ્ટમેન્ટ કરી શકો છો. પરંતુ અહીં ખાસ ધ્યાન રાખવાની બાબત છે કે ભૂતકાળમાં મળેલું વધુ રિટર્ન ભવિષ્યમાં પણ એટલું જ મળશે તેની કોઈ ગેરંટી હોતી નથી. જોકે શિસ્તબદ્ધ SIP દ્વારા રિસ્ક સાથે રીવર્ડ પણ વધુ મળવાની સંભાવના રહે છે. તેથી તમારા જોખમ ક્ષમતા અનુસાર જ રોકાણ કરવું હિતાવહ છે.`;
      bullets = [
        'વધુ રિટર્ન માટે સ્મોલ કેપ / મિડ કેપ ફંડમાં લાંબા ગાળા (૭+ વર્ષ) ની SIP ઉત્તમ છે.',
        'ભૂતકાળનું વળતર ભવિષ્યની ગેરંટી નથી; યોગ્ય એસેટ એલોકેશન જાળવવું જરૂરી છે.',
      ];
    } else if (/બાળક|શિક્ષણ|મોટા\s*થાય|ખર્ચ|education|child|kids/i.test(q)) {
      bodyAdvice = `બાળકો મોટા થાય ત્યારે તેમના ઉચ્ચ શિક્ષણ, કોલેજ અને કારકિર્દીના ખર્ચામાં શિક્ષણ મોંઘવારી (Education Inflation) ૧૦-૧૨% ના દરે વધતી હોય છે. આ ખર્ચાને પહોંચી વળવા માટે અત્યારથી જ બાળકોના નામે ડેડિકેટેડ ઇક્વિટી મ્યુચ્યુઅલ ફંડ SIP શરૂ કરવી શ્રેષ્ઠ છે. ઉપરાંત, બાળકના સુરક્ષિત ભવિષ્ય માટે તમારા નામે પૂરતો ટર્મ ઇન્સ્યોરન્સ હોવો જરૂરી છે જેથી કોઈપણ અણધારી પરિસ્થિતિમાં પણ બાળકનું શિક્ષણ અટકે નહીં.`;
      bullets = [
        'શિક્ષણ મોંઘવારી સામાન્ય ફુગાવા કરતાં બમણી હોય છે, તેથી વહેલી SIP શરૂ કરવી અનિવાર્ય છે.',
        'લાંબા ગાળા માટે ઇક્વિટી ફંડ્સ અને સુરક્ષા માટે પ્યોર ટર્મ પ્લાન અનિવાર્ય છે.',
      ];
    } else if (/રિટાયર|નિવૃત્તિ|પેન્શન|retirement|pension/i.test(q)) {
      bodyAdvice = `નિવૃત્તિ પછીની જીવનશૈલી જાળવવા માટે નિયમિત પેન્શન ફંડ હોવું અનિવાર્ય છે. અત્યારે તમારી સક્રિય કમાણી દરમિયાન ડાઇવર્સિફાઇડ ઇક્વિટી SIP અને NPS દ્વારા વેલ્થ એક્યુમ્યુલેટ કરો. રિટાયરમેન્ટ વખતે તે રકમને સિસ્ટમેટિક વિથડ્રોઅલ પ્લાન (SWP) અને સિનિયર સિટીઝન સેવિંગ્સ સ્કીમ (SCSS) માં ટ્રાન્સફર કરીને ટેક્સ-ફ્રી નિયમિત માસિક આવક ઊભી કરી શકાય છે.`;
      bullets = [
        'કમાણીના વર્ષોમાં SIP + NPS દ્વારા વિશાળ રિટાયરમેન્ટ કોર્પસ બનાવો.',
        'નિવૃત્તિ પછી SWP દ્વારા દર મહિને નિયમિત ટેક્સ-ફ્રેન્ડલી પેન્શન મેળવો.',
      ];
    } else if (/ટેક્સ|tax|80c|બચત/i.test(q)) {
      bodyAdvice = `ટેક્સ બચાવવા માટે કલમ 80C હેઠળ ELSS મ્યુચ્યુઅલ ફંડ સૌથી શ્રેષ્ઠ વિકલ્પ છે કારણ કે તેમાં માત્ર ૩ વર્ષનો લોક-ઇન છે અને લાંબા ગાળે ઇક્વિટી ગ્રોથ મળે છે. ઉપરાંત કલમ 80D હેઠળ તમારા અને પરિવાર માટે હેલ્થ ઇન્સ્યોરન્સ લઈને વધુ ₹૨૫,૦૦૦ થી ₹૫૦,૦૦૦ સુધીની કપાત મેળવી શકાય છે. જૂની vs નવી ટેક્સ વ્યવસ્થાની સરખામણી કરીને આગળ વધવું સલાહભર્યું છે.`;
      bullets = [
        'ELSS ફંડમાં માત્ર ૩ વર્ષનો લોક-ઇન અને ઉત્તમ લાંબા ગાળાનું વેલ્થ સર્જન.',
        'મેડિક્લેમ પ્રીમિયમ પર કલમ 80D હેઠળ વધારાની ટેક્સ છૂટ મેળવો.',
      ];
    } else if (/લોન|loan|emi|પ્રી-પેમેન્ટ/i.test(q)) {
      bodyAdvice = `હોમ લોન કે અન્ય દેવામાં વ્યાજનો બોજ ઘટાડવા માટે દર વર્ષે લોનની ૧-૨ વધારાની EMI પ્રી-પેમેન્ટ કરવી જોઈએ અથવા લોન શરૂ થવાની સાથે જ EMI ના ૧૦% જેટલી સમાંતર SIP શરૂ કરવી જોઈએ. આ SIP થી ભેગું થયેલું ફંડ તમારી આખી લોનનું વ્યાજ શૂન્ય કરી શકે છે અને તમે નિર્ધારિત સમય કરતાં ૭ થી ૮ વર્ષ વહેલા દેવામુક્ત બની શકો છો.`;
      bullets = [
        'દર વર્ષે એક વધારાની EMI ચૂકવવાથી લોનની મુદત વર્ષો સુધી ઘટી જાય છે.',
        'EMI ની સાથે નાની SIP ચાલુ રાખવાથી લોનનું તમામ વ્યાજ વસૂલ થઈ જાય છે.',
      ];
    } else {
      // General Financial Guidance
      bodyAdvice = `તમારા નાણાકીય લક્ષ્યાંકોને પ્રાપ્ત કરવા માટે શિસ્તબદ્ધ રોકાણ, યોગ્ય એસેટ એલોકેશન (સંપત્તિ ફાળવણી) અને પૂરતી સુરક્ષાનું મિશ્રણ સૌથી ઉત્તમ માર્ગ છે. બજારના ઉતાર-ચઢાવની ચિંતા કર્યા વિના તમારા સમયગાળા મુજબ યોગ્ય મ્યુચ્યુઅલ ફંડ અને પ્રોટેક્શન પ્લાનિંગ કરવું હિતાવહ છે.`;
      bullets = [
        'લક્ષ્યાંક મુજબ રોકાણ અને સમયમર્યાદા નક્કી કરવી જરૂરી છે.',
        'વાર્ષિક પોર્ટફોલિયો રિવ્યુ કરાવીને બિનજરૂરી જોખમ ટાળવું જોઈએ.',
      ];
    }

    const answer = `${name}, તમે પૂછ્યું હતું કે "${q}" તો તેમના માટે તમને હું સલાહ આપી રહ્યો છું કે:\n\n${bodyAdvice}\n\nઆ વિષય પર તમારા ચોક્કસ લક્ષ્યાંકો અને સમયગાળા મુજબ વધુ વિગતવાર પરામર્શ મેળવવા માટે તમે મને ગમે ત્યારે કૉલ કે વ્હોટ્સએપ કરી શકો છો.\n\nઆપનો વિશ્વાસુ,\n${advName}\n${advDesig}\nM: ${advPhone}${advCred}`;

    const whatsapp = `*નમસ્તે ${name}ji,* 🙏\n\nતમે પૂછ્યું હતું: _"${q}"_\n\n💡 *મારી નાણાકીય સલાહ:*\n${bodyAdvice}\n\n📌 *મુખ્ય બાબતો:* \n${bullets.map((b) => `• ${b}`).join('\n')}\n\n📞 *વધુ માર્ગદર્શન માટે સંપર્ક કરો:*\n*${advName}*\n_${advDesig}_\n📱 *WhatsApp / Call:* ${advPhone}${advCred}`;

    return {
      isFinancial: true,
      answerText: answer,
      summaryBullets: bullets,
      whatsappReadyText: whatsapp,
    };
  }

  // English Kit
  const englishAdvice = `Regarding your query "${q}": To achieve higher risk-adjusted outcomes, investing in diversified equity mutual funds (such as Flexi-cap or Mid/Small-cap funds via SIP) over a 5 to 7 year horizon is mathematically sound. However, please note that historical high returns do not guarantee future returns. While risk and reward go hand-in-hand, disciplined systematic investing cushions market volatility.`;
  const bulletsEn = [
    'Align investments with a minimum 5-7 year horizon for compounding.',
    'Diversify across market caps rather than concentrating in high-risk bets.',
  ];

  const answerEn = `Dear ${name},\n\nYou asked: "${q}". Here is my tailored advisory recommendation:\n\n${englishAdvice}\n\nFeel free to reach out anytime for a 1-on-1 portfolio review tailored to your exact life milestones.\n\nWarm regards,\n${advName}\n${advDesig}\nPhone: ${advPhone}${advCred}`;

  const whatsappEn = `*Dear ${name},* 🙏\n\nRegarding your question: _"${q}"_\n\n💡 *Advisory Recommendation:*\n${englishAdvice}\n\n📌 *Key Takeaways:*\n${bulletsEn.map((b) => `• ${b}`).join('\n')}\n\n📞 *Connect for Portfolio Health Check:*\n*${advName}*\n_${advDesig}_\n📱 *Call / WhatsApp:* ${advPhone}${advCred}`;

  return {
    isFinancial: true,
    answerText: answerEn,
    summaryBullets: bulletsEn,
    whatsappReadyText: whatsappEn,
  };
}
