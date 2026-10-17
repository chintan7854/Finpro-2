import { AdvisorProfile, LanguageCode } from '../types';
import {
  ClientPresentation,
  ClientQuestionnaire,
  PresentationMode,
  PresentationSlide,
  AdvisorPresentationSnapshot,
} from '../types/presentationStudio';
import { PRESENTATION_SUBJECTS_LIST } from '../constants/presentationSubjects';

import { AdvisorBusinessProfile } from '../constants/advisorSectorsData';
import { getActiveAiPreferences } from '../context/AiEngineContext';

export interface GeneratePresentationRequest {
  topicPrompt?: string;
  subjectId?: string;
  subCategoryId?: string;
  mode: PresentationMode;
  language: LanguageCode;
  clientName?: string;
  questionnaire: ClientQuestionnaire;
  advisorProfile: AdvisorProfile;
  businessProfile?: AdvisorBusinessProfile;
}

export function createAdvisorSnapshot(profile?: AdvisorProfile, businessProfile?: AdvisorBusinessProfile): AdvisorPresentationSnapshot {
  const p = profile || ({} as any);
  return {
    name: p.advisorName || 'Financial Advisor',
    designation: businessProfile?.advisorRole || p.designation || 'Certified Financial Planner & AMFI Registered Distributor',
    phone: p.phoneNumber || '+91 98250 12345',
    whatsapp: p.whatsappNumber || p.phoneNumber || '+91 98250 12345',
    email: p.email || 'advisor@finwealthadvisors.in',
    location: p.location || 'India',
    website: p.website || '',
    professionalLicense: businessProfile?.authorizationIdentifier || p.professionalDetails || 'AMFI Registered Mutual Fund Distributor',
    achievement: p.achievement || 'Managing High-Trust Client Portfolios',
    photo: p.profilePhoto,
    logo: p.logo,
    disclaimer:
      p.defaultDisclaimer ||
      'Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns.',
    defaultCtaText:
      p.defaultCTA ||
      'Schedule your confidential 1-on-1 financial portfolio review today.',
  };
}

export function sanitizePresentationSlide(s: any, idx?: number, language?: LanguageCode): PresentationSlide {
  const slideNumber = typeof s?.slideNumber === 'number' ? s.slideNumber : (idx !== undefined ? idx + 1 : 1);
  const badge = typeof s?.badge === 'string' && s.badge.trim()
    ? s.badge.trim()
    : slideNumber === 1
    ? (language === 'gu' ? 'મુખ્ય આયોજન' : language === 'hi' ? 'मुख्य योजना' : 'Overview')
    : (language === 'gu' ? `સ્લાઇડ #${slideNumber}` : language === 'hi' ? `स्लाइड #${slideNumber}` : `Slide #${slideNumber}`);

  let callToAction = s?.callToAction;
  if (callToAction && typeof callToAction === 'object') {
    callToAction =
      callToAction.text ||
      callToAction.message ||
      callToAction.cta ||
      (callToAction.phone || callToAction.whatsapp
        ? `Consultation: ${callToAction.advisorName || 'Financial Advisor'} (Tel: ${callToAction.phone || callToAction.whatsapp})`
        : 'Schedule your personalized 1-on-1 portfolio review today.');
  }

  const bulletPoints = Array.isArray(s?.bulletPoints)
    ? s.bulletPoints.map((bp: any) => {
        if (typeof bp === 'string') return bp;
        if (bp && typeof bp === 'object') {
          return bp.text || bp.point || bp.description || bp.title || Object.values(bp).filter(v => typeof v === 'string').join(' - ');
        }
        return String(bp || '');
      })
    : [];

  const keyTakeaway = typeof s?.keyTakeaway === 'string'
    ? s.keyTakeaway
    : s?.keyTakeaway?.text || s?.keyTakeaway?.point || String(s?.keyTakeaway || '');

  const title = typeof s?.title === 'string' ? s.title : String(s?.title?.text || s?.title || `Slide ${slideNumber}`);
  const subtitle = typeof s?.subtitle === 'string' ? s.subtitle : String(s?.subtitle?.text || s?.subtitle || '');

  let comparisonTable = s?.comparisonTable;
  if (comparisonTable && Array.isArray(comparisonTable.rows)) {
    comparisonTable = {
      headers: Array.isArray(comparisonTable.headers) ? comparisonTable.headers : ['Feature', 'Recommended', 'Alternative'],
      rows: comparisonTable.rows.map((row: any) => {
        if (Array.isArray(row)) {
          return {
            parameter: String(row[0] || ''),
            optionA: String(row[1] || ''),
            optionB: String(row[2] || ''),
          };
        }
        return {
          parameter: typeof row?.parameter === 'string' ? row.parameter : String(row?.parameter?.text || row?.parameter || ''),
          optionA: typeof row?.optionA === 'string' ? row.optionA : String(row?.optionA?.text || row?.optionA || ''),
          optionB: typeof row?.optionB === 'string' ? row.optionB : String(row?.optionB?.text || row?.optionB || ''),
        };
      }),
    };
  }

  const risksAndLimitations = Array.isArray(s?.risksAndLimitations)
    ? s.risksAndLimitations.map((r: any) => typeof r === 'string' ? r : String(r?.text || r?.risk || ''))
    : undefined;

  const assumptions = Array.isArray(s?.assumptions)
    ? s.assumptions.map((a: any) => typeof a === 'string' ? a : String(a?.text || ''))
    : undefined;

  const metrics = Array.isArray(s?.metrics)
    ? s.metrics.map((m: any) => ({
        label: typeof m?.label === 'string' ? m.label : String(m?.label?.text || m?.label || ''),
        value: typeof m?.value === 'string' || typeof m?.value === 'number' ? String(m.value) : String(m?.value?.text || m?.value || ''),
        helper: m?.helper ? (typeof m.helper === 'string' ? m.helper : String(m?.helper?.text || m?.helper || '')) : undefined,
      }))
    : undefined;

  return {
    ...s,
    id: s?.id || `slide_${slideNumber}_${Date.now()}_${idx ?? 0}`,
    slideNumber,
    badge,
    title,
    subtitle,
    keyTakeaway,
    bulletPoints,
    metrics,
    risksAndLimitations,
    assumptions,
    comparisonTable,
    callToAction: callToAction ? String(callToAction) : undefined,
  };
}

export function sanitizeClientPresentation(pres: any): ClientPresentation {
  if (!pres || typeof pres !== 'object') return pres;
  const slides = Array.isArray(pres.slides)
    ? pres.slides.map((s: any, idx: number) => sanitizePresentationSlide(s, idx, pres.language))
    : [];
  return {
    ...pres,
    slides,
  };
}

export async function generateClientPresentation(
  params: GeneratePresentationRequest
): Promise<ClientPresentation> {
  const {
    topicPrompt,
    subjectId = 'custom_financial_presentation',
    subCategoryId,
    mode,
    language,
    clientName,
    questionnaire = {} as any,
    advisorProfile,
    businessProfile,
  } = params;

  const foundSubject = PRESENTATION_SUBJECTS_LIST.find((s) => s.id === subjectId);
  const companyAndProduct = businessProfile?.companyName && businessProfile?.productName
    ? `${businessProfile.companyName} — ${businessProfile.productName}`
    : businessProfile?.productName || businessProfile?.companyName || '';

  const subjectTitle =
    topicPrompt?.trim()
      ? topicPrompt.trim().slice(0, 60) + (topicPrompt.trim().length > 60 ? '...' : '')
      : companyAndProduct
      ? companyAndProduct
      : language === 'gu'
      ? foundSubject?.titleGu || foundSubject?.title || 'નાણાકીય આયોજન'
      : language === 'hi'
      ? foundSubject?.titleHi || foundSubject?.title || 'वित्तीय नियोजन'
      : foundSubject?.title || 'Financial Advisory';

  const subCat = foundSubject?.subcategories.find((sc) => sc.id === subCategoryId);
  const subCategoryTitle = subCat?.title || 'Tailored Financial Blueprint';

  const advisorSnapshot = createAdvisorSnapshot(advisorProfile, businessProfile);

  // Try calling the AI backend endpoint with 10-second fail-safe timeout
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 50000) : null;

    const aiPref = getActiveAiPreferences();
    const response = await fetch('/api/generate-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller?.signal,
      body: JSON.stringify({
        topicPrompt: topicPrompt?.trim() || undefined,
        subjectId,
        subjectTitle,
        subCategoryTitle,
        mode,
        language,
        aiProvider: aiPref.provider,
        openaiModel: aiPref.openaiModel,
        geminiModel: aiPref.geminiModel,
        clientName: clientName?.trim() || questionnaire.clientName?.trim() || undefined,
        businessProfile,
        historicalScenarioMode: questionnaire.historicalScenarioMode || 'standard',
        workflowType: questionnaire.workflowType || 'client_report_pdf',
        questionnaire: {
          clientRelationship: questionnaire.clientRelationship,
          clientGoals: questionnaire.clientGoals,
          clientBudget: questionnaire.clientBudget,
          clientBudgetStatus: questionnaire.clientBudgetStatus,
          clientConcerns: questionnaire.clientConcerns,
          hesitationReasons: questionnaire.hesitationReasons,
          preferredStyle: questionnaire.preferredStyle,
          emphasisPoints: questionnaire.emphasisPoints,
          historicalScenarioMode: questionnaire.historicalScenarioMode,
          workflowType: questionnaire.workflowType,
          additionalNotes: questionnaire.additionalNotes || questionnaire.advisorPrivateNotes,
        },
        advisorProfile: {
          advisorName: advisorSnapshot.name,
          designation: advisorSnapshot.designation,
          phoneNumber: advisorSnapshot.phone,
          whatsappNumber: advisorSnapshot.whatsapp,
          email: advisorSnapshot.email,
          location: advisorSnapshot.location,
          professionalDetails: advisorSnapshot.professionalLicense,
          defaultDisclaimer: advisorSnapshot.disclaimer,
          defaultCTA: advisorSnapshot.defaultCtaText,
        },
      }),
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data.slides) && result.data.slides.length > 0) {
        const formattedSlides: PresentationSlide[] = result.data.slides.map((s: any, idx: number) => {
          const slideNumber = s.slideNumber || idx + 1;
          const badge = s.badge || (
            slideNumber === 1
              ? (language === 'gu' ? 'મુખ્ય આયોજન' : language === 'hi' ? 'मुख्य योजना' : 'Overview')
              : (language === 'gu' ? `સ્લાઇડ #${slideNumber}` : language === 'hi' ? `स्लाइड #${slideNumber}` : `Slide #${slideNumber}`)
          );

          let comparisonTable = s.comparisonTable;
          if (comparisonTable && Array.isArray(comparisonTable.rows)) {
            comparisonTable = {
              headers: Array.isArray(comparisonTable.headers) ? comparisonTable.headers : ['Feature', 'Recommended', 'Alternative'],
              rows: comparisonTable.rows.map((row: any) => {
                if (Array.isArray(row)) {
                  return {
                    parameter: String(row[0] || ''),
                    optionA: String(row[1] || ''),
                    optionB: String(row[2] || ''),
                  };
                }
                return row;
              }),
            };
          }

          return sanitizePresentationSlide({
            ...s,
            id: `slide_${slideNumber}_${Date.now()}_${idx}`,
            slideNumber,
            badge,
            comparisonTable,
          }, idx, language);
        });

        return {
          id: `pres_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          title: result.data.title || `${subjectTitle} - Presentation`,
          subjectId,
          subjectTitle,
          subCategoryTitle,
          mode,
          language,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          clientName: clientName?.trim() || questionnaire.clientName?.trim() || undefined,
          historicalScenarioMode: questionnaire.historicalScenarioMode || 'standard',
          workflowType: questionnaire.workflowType || 'client_report_pdf',
          advisorPrivateNotes:
            questionnaire.additionalNotes?.trim() ||
            questionnaire.advisorPrivateNotes?.trim() ||
            undefined,
          questionnaireSnapshot: questionnaire,
          businessProfile,
          advisorSnapshot,
          slides: formattedSlides,
          source: 'ai_api',
        };
      }
    }
  } catch (err) {
    console.warn('Backend presentation API unreachable, activating deterministic local engine:', err);
  }

  // Fallback to local presentation generator engine
  return generateLocalPresentation({
    topicPrompt,
    subjectId,
    subjectTitle,
    subCategoryTitle,
    mode,
    language,
    clientName: clientName?.trim() || questionnaire.clientName?.trim() || undefined,
    questionnaire,
    advisorSnapshot,
    businessProfile,
  });
}

// Local fallback engine generating comprehensive, accurate slides
export function generateLocalPresentation(opts: {
  topicPrompt?: string;
  subjectId: string;
  subjectTitle: string;
  subCategoryTitle: string;
  mode: PresentationMode;
  language: LanguageCode;
  clientName?: string;
  questionnaire: ClientQuestionnaire;
  advisorSnapshot: AdvisorPresentationSnapshot;
  businessProfile?: AdvisorBusinessProfile;
}): ClientPresentation {
  const {
    topicPrompt,
    subjectId,
    mode,
    language,
    clientName,
    questionnaire,
    advisorSnapshot,
    businessProfile,
  } = opts;

  const isGu = language === 'gu';
  const isHi = language === 'hi';

  const companyName = businessProfile?.companyName || '';
  const productName = businessProfile?.productName || '';

  const promptText = (topicPrompt || opts.subjectTitle || `${companyName} ${productName}`).toLowerCase();

  // Detect domain
  const isTermLife =
    promptText.includes('term') ||
    promptText.includes('endowment') ||
    promptText.includes('life insurance') ||
    promptText.includes('જીવન વીમો') ||
    promptText.includes('જીવન બીમા');
  const isHealth =
    promptText.includes('health') ||
    promptText.includes('mediclaim') ||
    promptText.includes('reassure') ||
    promptText.includes('top-up') ||
    promptText.includes('top up') ||
    promptText.includes('મેડિક્લેમ') ||
    promptText.includes('સ્વાસ્થ્ય');
  const isCarInsurance =
    promptText.includes('car') ||
    promptText.includes('vehicle') ||
    promptText.includes('motor') ||
    promptText.includes('zero dep') ||
    promptText.includes('ગાડી') ||
    promptText.includes('વાહન');
  const isRetirement =
    promptText.includes('retirement') ||
    promptText.includes('pension') ||
    promptText.includes('swp') ||
    promptText.includes('નિવૃત્તિ') ||
    promptText.includes('પેન્શન');
  const isChild =
    promptText.includes('child') ||
    promptText.includes('education') ||
    promptText.includes('marriage') ||
    promptText.includes('બાળક') ||
    promptText.includes('શિક્ષણ');
  const isTax =
    promptText.includes('tax') ||
    promptText.includes('80c') ||
    promptText.includes('80d') ||
    promptText.includes('ટેક્સ') ||
    promptText.includes('કર બચત');
  const isLoan =
    promptText.includes('loan') ||
    promptText.includes('home loan') ||
    promptText.includes('debt') ||
    promptText.includes('હોમ લોન') ||
    promptText.includes('કરજ');

  // Derive presentation titles
  let presTitle = 'Strategic Financial Advisory Blueprint';
  if (productName && companyName) {
    presTitle = `${productName} — ${companyName}`;
  } else if (productName) {
    presTitle = `${productName} — Recommendation`;
  } else if (topicPrompt && topicPrompt.trim().length > 5) {
    presTitle = topicPrompt.trim().slice(0, 65) + (topicPrompt.trim().length > 65 ? '...' : '');
  } else if (isTermLife) {
    presTitle = isGu ? 'ટર્મ ઇન્સ્યોરન્સ + SIP વિરુદ્ધ પરંપરાગત પોલિસી' : isHi ? 'प्योर टर्म इंश्योरेंस + SIP बनाम पारंपरिक एंडोवमेंट' : 'Pure Term Life + Mutual Fund SIP Blueprint';
  } else if (isHealth) {
    presTitle = isGu ? '₹૧ કરોડ ફેમિલી સુપર ટોપ-અપ મેડિક્લેમ આયોજન' : isHi ? '₹1 करोड़ पारिवारिक सुपर टॉप-अप मेडिक्लेम सुरक्षा' : 'Family Health Protection & ₹1 Crore Super Top-up';
  } else if (isCarInsurance) {
    presTitle = isGu ? 'કાર ઇન્સ્યોરન્સ: ઝીરો ડેપ્રિશિયેશન વિરુદ્ધ સ્ટાન્ડર્ડ' : isHi ? 'कार व वाहन बीमा: जीरो डेप्रिसिएशन बनाम साधारण पॉलिसी' : 'Vehicle Insurance: Zero Depreciation vs Standard Policy';
  } else if (isRetirement) {
    presTitle = isGu ? '૫૫ વર્ષે નિવૃત્તિ અને મોંઘવારી-મુક્ત પેન્શન' : isHi ? '55 की उम्र में रिटायरमेंट और महंगाई-मुक्त मासिक पेंशन' : 'Retirement Freedom: Inflation-Proof Wealth & Pension';
  } else if (isTax) {
    presTitle = isGu ? 'નવી વિરુદ્ધ જૂની ટેક્સ વ્યવસ્થા અને કર બચત' : isHi ? 'नई बनाम पुरानी टैक्स व्यवस्था और स्मार्ट टैक्स प्लानिंग' : 'Tax Optimization: Old vs New Regime & Capital Gains';
  } else if (isLoan) {
    presTitle = isGu ? 'હોમ લોન ફ્રીડમ: સમાંતર SIP દ્વારા વ્યાજ મુક્તિ' : isHi ? 'होम लोन मुक्ति: पैरेलल SIP से ब्याज की 100% रिकवरी' : 'Home Loan Freedom: Recover 100% Interest via SIP';
  } else {
    presTitle = isGu ? 'SIP અને ચક્રવૃદ્ધિ શક્તિ: ૧૫ વર્ષનો વેલ્થ રોડમેપ' : isHi ? 'SIP और चक्रवृद्धि की शक्ति: 15 वर्षों का वेल्थ रोडमैप' : 'SIP & Compounding: 15-Year Wealth Creation Roadmap';
  }

  const clientHeader = clientName ? `Exclusively Prepared for ${clientName}` : 'Strategic Advisory Presentation';
  const clientHeaderGu = clientName ? `${clientName} માટે ખાસ તૈયાર કરેલ નાણાકીય આયોજન` : 'વ્યૂહાત્મક નાણાકીય સલાહકાર પ્રસ્તુતિ';
  const clientHeaderHi = clientName ? `${clientName} के लिए विशेष रूप से तैयार वित्तीय रोडमैप` : 'रणनीतिक वित्तीय परामर्श प्रेजेंटेशन';

  const slides: PresentationSlide[] = [];

  // Slide 1: Cover
  slides.push({
    id: `slide_1_${Date.now()}`,
    slideNumber: 1,
    slideType: 'cover',
    badge: isGu ? 'વ્યક્તિગત નાણાકીય બ્લુપ્રિન્ટ' : isHi ? 'व्यक्तिगत वित्तीय ब्लूप्रिंट' : 'Strategic Action Plan',
    title: presTitle,
    subtitle: isGu ? clientHeaderGu : isHi ? clientHeaderHi : clientHeader,
    keyTakeaway: isGu
      ? 'સુઆયોજિત શિસ્તબદ્ધ માળખું અને સાચી નાણાકીય સમજ દ્વારા લક્ષ્યોને સમયસર પૂર્ણ કરવાનો રોડમેપ.'
      : isHi
      ? 'नियोजित वित्तीय अनुशासन और सही समझ के साथ लक्ष्यों को सुरक्षित रूप से हासिल करने का रोडमैप।'
      : 'A structured, evidence-based roadmap tailored to protect family assets and accelerate wealth.',
    bulletPoints: [
      isGu
        ? `મુખ્ય ઉદ્દેશ્ય: ${questionnaire.clientGoals || 'સંપત્તિ નિર્માણ અને પારિવારિક આર્થિક સુરક્ષા'}`
        : isHi
        ? `प्रमुख उद्देश्य: ${questionnaire.clientGoals || 'वेल्थ क्रिएशन और पारिवारिक वित्तीय सुरक्षा'}`
        : `Strategic Goal: ${questionnaire.clientGoals || 'Wealth Accumulation & Comprehensive Family Security'}`,
      isGu
        ? `બજેટ ફાળવણી: ${questionnaire.clientBudget || 'માસિક નિયમિત બચત'}`
        : isHi
        ? `बजट आवंटन: ${questionnaire.clientBudget || 'मासिक अनुशासित बचत'}`
        : `Budget Allocation: ${questionnaire.clientBudget || 'Monthly Disciplined Allocation'}`,
      isGu
        ? `પદ્ધતિ: ${questionnaire.preferredStyle || 'સરળ, ગણતરી અને વાસ્તવિક આંકડાઓ સાથે'}`
        : isHi
        ? `शैली: ${questionnaire.preferredStyle || 'सरल, सटीक गणना और आंकड़ों के साथ'}`
        : `Style: ${questionnaire.preferredStyle || 'Data-driven, transparent, and goal-oriented'}`,
    ],
    metrics: [
      {
        label: isGu ? 'આયોજન ધોરણ' : isHi ? 'योजना ढांचा' : 'Framework',
        value: isTermLife ? 'Risk + Alpha' : isHealth ? '100% Cashless' : isCarInsurance ? 'Zero Dep' : 'Goal-Based',
        helper: isGu ? 'પારદર્શક માળખું' : isHi ? 'पारदर्शी मॉडल' : 'Transparent Model',
      },
      {
        label: isGu ? 'બજેટ સ્થિતિ' : isHi ? 'बजट स्थिति' : 'Budget Basis',
        value: questionnaire.clientBudgetStatus === 'verified' ? 'Verified ✓' : 'Estimate ≈',
        helper: questionnaire.clientBudgetStatus === 'verified' ? 'Client Confirmed' : 'Advisor Projection',
      },
    ],
    assumptions: [
      isGu
        ? 'આ પ્રસ્તુતિ શિક્ષણ અને આયોજન હેતુ માટે છે. વાસ્તવિક પરિણામો બજાર નિયમોને આધીન છે.'
        : isHi
        ? 'यह प्रेजेंटेशन शिक्षा और परामर्श उद्देश्य के लिए है। बाजार रिटर्न जोखिमों के अधीन हैं।'
        : 'Illustrative presentation strictly for financial planning. Market-linked products are subject to market conditions.',
    ],
  });

  // Slide 2: Context & Challenge
  let s2Title = 'The Hidden Reality: Inflation, Risk & Cost of Inaction';
  let s2Subtitle = 'Why doing nothing or sticking to traditional habits erodes purchasing power';
  let s2Bullets = [
    'Inflation (6.5%–7.5%) erodes purchasing power every single year if surplus is left in savings accounts or low-yield instruments.',
    'Under-insurance leaves family financial dependants exposed to catastrophic lifestyle downgrade in sudden emergencies.',
    'A 5-year delay in taking action can cost 40%–50% in terminal wealth accumulation due to lost compounding cycles.',
  ];
  let s2Metrics = [
    { label: 'Inflation Drag', value: '7.0% p.a.', helper: 'Lifestyle Cost Surge' },
    { label: '5-Yr Inaction Cost', value: '₹35L – ₹50L', helper: 'Lost Alpha & Cover' },
  ];

  if (isTermLife) {
    s2Title = isGu ? 'જીવન વીમાની વાસ્તવિકતા: કવરેજ વિરુદ્ધ રોકાણ' : isHi ? 'जीवन बीमा की हकीकत: सुरक्षा बनाम निवेश' : 'The Insurance Trap: Mixing Protection & Investment';
    s2Subtitle = isGu ? 'શા માટે પરંપરાગત પોલિસીઓ પૂરતું કવર કે સારું વળતર બંનેમાંથી કશું આપતી નથી' : isHi ? 'पारंपरिक पॉलिसियों में न पर्याप्त सुरक्षा मिलती है न बेहतर रिटर्न' : 'Why traditional endowment plans fail to deliver adequate cover or beat inflation';
    s2Bullets = [
      'Traditional endowment/money-back plans give only 5%–5.5% returns, which is lower than medical and education inflation.',
      'A ₹10 Lakh sum assured provides barely 1 year of family expense replacement in case of an untimely event.',
      'Pure Term Insurance costs barely 10% of traditional policies for 10x higher coverage, freeing up 90% money for high-growth mutual fund SIP.',
    ];
    s2Metrics = [
      { label: 'Traditional Yield', value: '5.2% p.a.', helper: 'Negative Real Return' },
      { label: 'Coverage Deficit', value: '85% Short', helper: 'Family Need vs Policy' },
    ];
  } else if (isHealth) {
    s2Title = isGu ? 'મેડિકલ ફુગાવો: એક બીમારી આખી જિંદગીની બચત ખતમ કરી શકે છે' : isHi ? 'मेडिकल महंगाई: एक गंभीर बीमारी जीवन भर की बचत खत्म कर सकती है' : 'Medical Inflation: The #1 Threat to Lifetime Savings';
    s2Bullets = [
      'Healthcare costs in India are inflating at 14%–15% annually—double the general CPI inflation rate.',
      'Treating critical illnesses like cancer or heart bypass in private hospitals now easily costs ₹15 Lakhs to ₹35 Lakhs.',
      'Corporate group mediclaim ends the day you switch jobs, retire, or face layoffs, leaving you uncovered at peak vulnerability.',
    ];
    s2Metrics = [
      { label: 'Medical Inflation', value: '14.0% p.a.', helper: 'Fastest Rising Expense' },
      { label: 'Corporate Cover Gap', value: '₹3L – ₹5L', helper: 'Grossly Inadequate' },
    ];
  } else if (isCarInsurance) {
    s2Title = isGu ? 'વાહન વીમામાં છુપાયેલ કપાત: સ્ટાન્ડર્ડ પોલિસીના નુકસાન' : isHi ? 'वाहन बीमा की असलियत: साधारण पॉलिसी में भारी जेब खर्च' : 'The Depreciation Trap: Out-of-Pocket Claims on Standard Policies';
    s2Bullets = [
      'Standard car insurance deducts 50% on rubber, plastic, and nylon parts during claim settlements.',
      'Glass and fiber parts face 30% depreciation, forcing vehicle owners to pay 35%–45% of repair bills from pocket.',
      'Zero Depreciation (Bumper-to-Bumper) add-on pays 100% parts replacement value without depreciation deductions.',
    ];
    s2Metrics = [
      { label: 'Plastic Depr.', value: '50% Cut', helper: 'Standard Claim Loss' },
      { label: 'Out-of-Pocket', value: '~40% Bill', helper: 'Without Zero Dep' },
    ];
  }

  slides.push({
    id: `slide_2_${Date.now()}`,
    slideNumber: 2,
    slideType: 'context',
    badge: isGu ? 'વાસ્તવિક સ્થિતિ' : isHi ? 'वास्तविक स्थिति' : 'Context & Need',
    title: s2Title,
    subtitle: s2Subtitle,
    keyTakeaway: isGu
      ? 'આયોજનના અભાવે સામાન્ય પરિવારો મોંઘવારી અને અણધાર્યા ખર્ચાઓ સામે બચત ગુમાવી બેસે છે.'
      : isHi
      ? 'नियोजन की कमी से आम परिवार महंगाई और अप्रत्याशित संकटों के सामने अपनी पूंजी गंवा देते हैं।'
      : 'Inaction carries a heavy hidden cost in compounding loss and unmitigated risk exposure.',
    bulletPoints: s2Bullets,
    metrics: s2Metrics,
  });

  // Slide 3: Core Solution / Strategy
  slides.push({
    id: `slide_3_${Date.now()}`,
    slideNumber: 3,
    slideType: 'concept',
    badge: isGu ? 'વ્યૂહાત્મક ઉકેલ' : isHi ? 'रणनीतिक समाधान' : 'The Solution Framework',
    title: isTermLife
      ? 'Separate Protection from Investment (Term Life + SIP)'
      : isHealth
      ? 'The Two-Tier Health Shield: Base Cover + Super Top-up'
      : isCarInsurance
      ? 'Comprehensive Zero Depreciation & Add-on Engine'
      : isRetirement
      ? 'The 3-Bucket Retirement & Systematic Withdrawal Engine'
      : 'Disciplined Asset Allocation & Systematic Investing Model',
    subtitle: 'Structuring your capital for maximum compounding, liquidity, and safety',
    keyTakeaway: 'Separating protection from wealth growth creates 5x greater financial security.',
    bulletPoints: [
      'Clarity of Purpose: Every Rupee has a designated role—either pure risk shield or inflation-beating growth.',
      'Automated Discipline: Monthly automated allocations prevent emotional errors and market-timing anxiety.',
      'Periodic Rebalancing: Annual audits ensure your plan adapts to salary hikes, life stages, and market movements.',
    ],
    chartData: {
      type: 'donut',
      title: 'Optimal Allocation Distribution',
      labels: isTermLife
        ? ['Mutual Fund SIP (Growth)', 'Pure Term Cover (Shield)', 'Liquid Emergency Reserve']
        : isHealth
        ? ['Super Top-up (₹95L Cover)', 'Base Health (₹5L Deductible)', 'Emergency Cash Buffer']
        : ['Equity Mutual Funds', 'Fixed Income / Debt', 'Gold / Sovereign Hedge'],
      values: isTermLife ? [85, 10, 5] : isHealth ? [60, 30, 10] : [65, 25, 10],
      unit: '%',
      explanation: 'Optimized allocation aligned with risk tolerance and liquidity requirements.',
    },
  });

  // Slide 4: Calculations & Realistic Projections
  slides.push({
    id: `slide_4_${Date.now()}`,
    slideNumber: 4,
    slideType: 'calculation',
    badge: isGu ? 'આંકડાકીય વિશ્લેષણ' : isHi ? 'सटीक गणित और आंकड़े' : 'Financial Mathematics',
    title: isTermLife
      ? 'Mathematical Proof: ₹5,000/Month Comparison'
      : isHealth
      ? 'Cost vs Coverage: ₹1 Crore Cover at Fraction of Cost'
      : isCarInsurance
      ? 'Claim Settlement Math: ₹1,00,000 Accident Repair Bill'
      : isRetirement
      ? 'Retirement Corpus & Monthly SWP Pension Math'
      : 'Compounding Curve: 5, 10, and 15-Year Growth Projections',
    subtitle: 'Transparent, assumption-backed mathematical breakdown',
    keyTakeaway: 'Small systematic contributions compound into exponential wealth over 10–15 years.',
    bulletPoints: isTermLife
      ? [
          'Traditional Policy: ₹60,000/yr for 20 yrs gives ₹15 Lakhs cover and ~₹22 Lakhs maturity (5.2% CAGR).',
          'Term + SIP Split: ₹8,000/yr buys ₹1.5 Crore Term Cover. Remaining ₹52,000/yr in SIP grows to ~₹52 Lakhs (@ 12% CAGR).',
          'Net Benefit: 10x higher life cover (₹1.5 Cr vs ₹15L) PLUS ₹30 Lakhs more cash wealth!',
        ]
      : isHealth
      ? [
          'Base ₹1 Crore Standalone Policy costs ~₹45,000 – ₹60,000 annual premium.',
          'Super Top-up Strategy: ₹5 Lakhs Base (or Employer cover) + ₹95 Lakhs Super Top-up costs only ~₹12,000 – ₹16,000/year.',
          'Save 65% on premium while holding full ₹1 Crore hospital coverage for family.',
        ]
      : isCarInsurance
      ? [
          'On a ₹1,00,000 accident repair with bumper, headlamp & metal damage:',
          'Standard Policy Payout: Customer pays ~₹38,000 out of pocket due to plastic/metal depreciation.',
          'Zero Dep Policy Payout: Customer pays only ₹1,000 – ₹2,000 mandatory excess. Net saving: ₹36,000 in a single claim.',
        ]
      : [
          '5 Years: ₹6.0 Lakhs Invested → Estimated Corpus ~₹8.25 Lakhs (Growth: +₹2.25L)',
          '10 Years: ₹12.0 Lakhs Invested → Estimated Corpus ~₹23.25 Lakhs (Growth: +₹11.25L)',
          '15 Years: ₹18.0 Lakhs Invested → Estimated Corpus ~₹50.50 Lakhs (Growth: +₹32.50L)',
        ],
    chartData: {
      type: 'bar',
      title: 'Wealth / Benefit Comparison Over Time',
      labels: ['Year 5', 'Year 10', 'Year 15'],
      values: [8.25, 23.25, 50.5],
      secondaryValues: [6.0, 12.0, 18.0],
      unit: '₹ Lakhs',
      explanation: 'Primary bar: Total Value | Secondary bar: Capital invested (Based on ₹10k/mo @ 12% CAGR illustration).',
    },
    assumptions: [
      'Projections assume 12% CAGR for equity mutual funds for illustrative purposes only. Mutual funds are subject to market risks.',
    ],
  });

  if (mode === 'detailed') {
    // Slide 5: Comparison Table
    slides.push({
      id: `slide_5_${Date.now()}`,
      slideNumber: 5,
      slideType: 'comparison',
      badge: isGu ? 'તુલનાત્મક વિશ્લેષણ' : isHi ? 'तुलनात्मक विश्लेषण' : 'Side-by-Side Comparison',
      title: 'Evaluating Alternatives: Why This Approach Is Superior',
      subtitle: 'Comparing traditional methods against modern evidence-based advisory',
      keyTakeaway: 'The proposed structure delivers superior net returns, lower drag, and full liquidity.',
      bulletPoints: [
        'Higher Flexibility: No surrender penalties or multi-year lock-in traps.',
        'Tax Transparency: Optimized under current income tax and capital gains frameworks.',
      ],
      comparisonTable: {
        headers: ['Feature / Parameter', 'Proposed Plan', 'Traditional Route'],
        rows: [
          {
            parameter: 'Net Growth / Alpha',
            optionA: '11%–13% CAGR (Historical)',
            optionB: '5%–6% Fixed (Negative post-tax)',
            advantageFor: 'A',
          },
          {
            parameter: 'Inflation Protection',
            optionA: 'Yes (Beats 7% Inflation)',
            optionB: 'No (Loses purchasing power)',
            advantageFor: 'A',
          },
          {
            parameter: 'Liquidity & Access',
            optionA: 'High (Redeem anytime / SWP)',
            optionB: 'Rigid (Heavy surrender penalties)',
            advantageFor: 'A',
          },
          {
            parameter: 'Transparency',
            optionA: '100% Daily NAV & Portfolio disclosure',
            optionB: 'Opaque bonus declarations',
            advantageFor: 'A',
          },
        ],
      },
    });

    // Slide 6: Risks & Mitigations
    slides.push({
      id: `slide_6_${Date.now()}`,
      slideNumber: 6,
      slideType: 'risks',
      badge: 'Risk Guardrails',
      title: 'Understanding Risks, Limitations & Prudent Safeguards',
      subtitle: 'How disciplined planning insulates your family against volatility and surprises',
      keyTakeaway: 'Risk is not eliminated by avoiding markets; it is managed through asset allocation.',
      bulletPoints: [
        'Market Volatility: Equity returns are non-linear; holding periods must exceed 5–7 years to ride cycles.',
        'Emergency Buffer: Maintaining 6 months of living expenses in liquid funds prevents forced redemptions.',
        'No Guaranteed Returns: Market products fluctuate; success relies on systematic discipline over time.',
      ],
      risksAndLimitations: [
        'Short-term market corrections can lead to temporary drawdowns in equity values.',
        'Policy terms, deductibles, and waiting periods apply for insurance contracts.',
      ],
      assumptions: ['Assumptions: Client maintains consistent cash flow and adheres to planned horizon.'],
    });

    // Slide 7: Action Roadmap
    slides.push({
      id: `slide_7_${Date.now()}`,
      slideNumber: 7,
      slideType: 'roadmap',
      badge: 'Execution Roadmap',
      title: 'Implementation Roadmap: The First 90 Days',
      subtitle: 'Clear, milestone-based execution without confusion or paperwork hassles',
      keyTakeaway: 'Automating the process today eliminates willpower friction and guarantees consistency.',
      bulletPoints: [
        'Phase 1 (Week 1): Paperless KYC verification, risk profiling & mandate setup.',
        'Phase 2 (Month 1): First systematic allocation executes; emergency buffer established.',
        'Phase 3 (Annual Audit): Portfolio rebalancing and automated 10% annual step-up.',
      ],
      chartData: {
        type: 'milestones',
        title: 'Milestone Progress Roadmap',
        labels: ['Setup & KYC', 'Mandate Live', 'First Quarter', 'Annual Audit'],
        values: [25, 50, 75, 100],
        unit: '%',
        explanation: 'Your advisor provides continuous monitoring and quarterly performance reviews.',
      },
    });
  } else if (mode === 'personalized') {
    // Slide 5: Personalized Objection Handling & FAQ
    slides.push({
      id: `slide_5_${Date.now()}`,
      slideNumber: 5,
      slideType: 'concept',
      badge: 'Direct Answers',
      title: 'Addressing Key Questions & Practical Considerations',
      subtitle: 'Honest answers to common concerns before making any financial commitment',
      keyTakeaway: 'Informed decisions backed by math always triumph over emotional hesitation.',
      bulletPoints: [
        questionnaire.clientConcerns
          ? `Addressing Concern: "${questionnaire.clientConcerns.slice(0, 90)}..." — We tackle this with structured diversification and emergency reserves.`
          : 'Market Volatility: Corrections are buying opportunities under SIP rupee-cost averaging.',
        'Commitment Flexibility: You can pause, increase, or decrease your allocation anytime without penalty.',
        'Emergency Access: Your money remains in your name with direct bank linkage and daily portfolio visibility.',
      ],
      metrics: [
        { label: 'Control & Ownership', value: '100% Direct', helper: 'In Your Own Name' },
        { label: 'Flexibility', value: 'Anytime Pause', helper: 'Zero Exit Penalties' },
      ],
    });
  }

  // Historical Best-Case / Maximum Potential Benefit Scenario Slide (Master Prompt Section 5)
  if (
    questionnaire.historicalScenarioMode === 'historical_best_case' ||
    questionnaire.historicalScenarioMode === 'historical_and_contractual'
  ) {
    const isContractual = questionnaire.historicalScenarioMode === 'historical_and_contractual';
    const histSlideNum = slides.length + 1;

    if (isTermLife) {
      slides.push({
        id: `slide_hist_${Date.now()}`,
        slideNumber: histSlideNum,
        slideType: 'concept',
        badge: isGu ? 'કરાર આધારિત લાભ વિશ્લેષણ' : isHi ? 'संविदात्मक लाभ विश्लेषण' : 'Contractual Benefit Analysis',
        title: isGu
          ? 'મહત્તમ કરાર આધારિત સુરક્ષા વિ. બિન-ગેરંટીડ બોનસ'
          : isHi
          ? 'अधिकतम संविदात्मक सुरक्षा बनाम गैर-गारंटीशुदा बोनस'
          : 'Contractual Guaranteed Cover vs Non-Guaranteed Benefits',
        subtitle: isGu
          ? 'પૉલિસીના સત્તાવાર નિયમો મુજબ ગેરંટીડ સમ એશ્યોર્ડ અને IRDAI ગાઈડલાઈન્સ'
          : 'Guaranteed Sum Assured under official policy terms & IRDAI illustrations',
        keyTakeaway: isGu
          ? 'જીવન વીમો એ કુટુંબના નાણાકીય જોખમનું રિપ્લેસમેન્ટ છે, ક્યારેય રોકાણ નફો નથી.'
          : 'Life insurance is pure financial risk replacement and protection, NEVER an investment profit tool.',
        bulletPoints: [
          isGu
            ? 'ગેરંટીડ ડેથ બેનિફિટ (સમ એશ્યોર્ડ): ₹1,00,00,000 (કરમુક્ત કલમ 10(10D) હેઠળ ઉપલબ્ધ).'
            : 'Guaranteed Sum Assured: ₹1,00,00,000 death benefit guaranteed by insurance contract.',
          isGu
            ? 'પ્યોર ટર્મ પ્લાનમાં કોઈ મેચ્યોરિટી નથી; બચત પ્રીમિયમ SIP માં ફાળવીને સંપત્તિનું સર્જન થાય છે.'
            : 'Pure term plan has ₹0 maturity return; premium savings are preserved via parallel SIP.',
          isContractual
            ? (isGu
                ? 'બિન-ગેરંટીડ બોનસ (ટ્રેડિશનલ પૉલિસી): IRDAI 4% અને 8% અનુમાન માત્ર કાલ્પનિક ચિત્રણ છે.'
                : 'Non-guaranteed returns (Traditional endowment): IRDAI 4% & 8% illustrations are hypothetical.')
            : (isGu
                ? 'વાર્ષિક પ્રીમિયમ વય અને આરોગ્ય આધારિત છે; મેડિકલ ઘોષણા 100% સચોટ હોવી અનિવાર્ય છે.'
                : 'Annual premium depends on age, smoking status, and mandatory truthful health disclosures.'),
        ],
        metrics: [
          { label: isGu ? 'ગેરંટીડ કવર' : 'Guaranteed Cover', value: '₹1.00 Cr', helper: 'Contractual' },
          { label: isGu ? 'ટર્મ પ્રીમિયમ' : 'Term Premium', value: '₹14,500/yr', helper: 'Approximate' },
          { label: isGu ? 'સ્પ્લિટ SIP સંભાવના' : 'Split SIP Potential', value: '₹1.98 Cr @ 20y', helper: 'Market Linked' },
        ],
        assumptions: [
          'Statutory Disclosure: Life cover is guaranteed upon valid premium payments and subject to 100% accurate disclosures. Sum assured is paid on demise.',
        ],
      });
    } else {
      // SIP / Mutual Fund / Wealth default
      slides.push({
        id: `slide_hist_${Date.now()}`,
        slideNumber: histSlideNum,
        slideType: 'concept',
        badge: isGu ? 'ઐતિહાસિક શ્રેષ્ઠ વળતર વિશ્લેષણ' : isHi ? 'ऐतिहासिक सर्वश्रेष्ठ विश्लेषण' : 'Historical Best-Case Analysis',
        title: isGu
          ? 'ઐતિહાસિક શ્રેષ્ઠ બજાર ચક્ર અને વાસ્તવિક પાયાનું વિશ્લેષણ'
          : isHi
          ? 'ऐतिहासिक सर्वश्रेष्ठ बाजार चक्र एवं आधारभूत विश्लेषण'
          : 'Historical Best-Case Market Cycles vs Realistic Baseline',
        subtitle: isGu
          ? 'નિફ્ટી 500 TRI / ફ્લેક્સી કેપ ઇન્ડેક્સનો ચકાસાયેલ 15-વર્ષનો શ્રેષ્ઠ ટ્રેક રેકોર્ડ'
          : 'Verified 15-Year Indian equity benchmark data (Nifty 500 Total Returns Index)',
        keyTakeaway: isGu
          ? 'ઐતિહાસિક ટોચનું વળતર એ માત્ર સંદર્ભ માટે છે, તે ભવિષ્યની કોઈ ગેરંટી નથી.'
          : 'Historical best-case outcomes reflect verified past market cycles and are NEVER a future guarantee.',
        bulletPoints: [
          isGu
            ? 'ચકાસાયેલ ઐતિહાસિક શ્રેષ્ઠ 15-વર્ષ SIP CAGR: ~17.8% (2003 થી 2018 ભારતનું ઐતિહાસિક તેજી અને રિકવરી ચક્ર).'
            : 'Verified 15-Year Rolling SIP Historical Best: ~17.8% CAGR across 2003–2018 Indian market cycle.',
          isGu
            ? 'રૂઢિચુસ્ત આયોજન માટે 12.0% વાર્ષિક વળતર આધાર માનવામાં આવે છે, જે ફુગાવા સામે સંપત્તિનું સર્જન કરે છે.'
            : 'Realistic baseline planning benchmark: 12.0% CAGR illustrative compounding assumption.',
          isContractual
            ? (isGu
                ? 'કરાર આધારિત સ્થિતિ: મ્યુચ્યુઅલ ફંડ બજાર-લિંક્ડ છે; તેમાં કોઈ નિશ્ચિત નફાની ગેરંટી નથી.'
                : 'Contractual status: Mutual funds are market-linked instruments without guaranteed minimum returns.')
            : (isGu
                ? 'સમયગાળો અને શિસ્ત: બજારની વોલેટિલિટીને પાર કરવા 7 થી 10+ વર્ષનો સમયગાળો અનિવાર્ય છે.'
                : 'Duration & Discipline: Equity compounding requires remaining invested through 7-10+ year complete cycles.'),
        ],
        metrics: [
          { label: isGu ? 'ઐતિહાસિક શ્રેષ્ઠ (15-yr)' : 'Historical Best (15-yr)', value: '17.8% CAGR', helper: 'Nifty 500 TRI' },
          { label: isGu ? 'આયોજન બેઝલાઇન' : 'Planning Baseline', value: '12.0% CAGR', helper: 'Illustrative' },
          { label: isGu ? 'ગેરંટીડ વળતર' : 'Guaranteed Returns', value: '0% (Market Linked)', helper: 'SEBI Regulated' },
        ],
        chartData: {
          type: 'bar',
          title: isGu ? 'ઐતિહાસિક શ્રેષ્ઠ વિ. પ્રમાણભૂત દૃશ્ય (₹10,000/માસિક - 15 વર્ષ)' : 'Historical Best vs Baseline Scenarios (₹10,000/mo - 15 Yrs)',
          labels: ['Total Invested', 'Baseline @ 12%', 'Historical Peak @ 17.8%'],
          values: [1800000, 5045000, 9350000],
          unit: '₹',
          explanation: isGu
            ? 'ઐતિહાસિક ટોચ 2003-2018 દરમિયાન નોંધાઈ હતી. વાસ્તવિક રોકાણ આયોજન માટે 12% નો ઉપયોગ સલાહભર્યો છે.'
            : 'Historical best occurred during 2003-2018 bull phase. 12% baseline remains the recommended planning basis.',
        },
        assumptions: [
          'Mandatory Compliance: Mutual fund investments are subject to market risks. Read all scheme related documents carefully. Past performance does not guarantee future results.',
        ],
      });
    }
  }

  // Final Slide: Conclusion & Advisor Contact CTA
  const finalNum = slides.length + 1;
  slides.push({
    id: `slide_${finalNum}_${Date.now()}`,
    slideNumber: finalNum,
    slideType: 'conclusion',
    badge: isGu ? 'સંપર્ક અને આગળનું પગલું' : isHi ? 'संपर्क और अगला कदम' : 'Your Trusted Advisor',
    title: isGu ? 'તમારા નાણાકીય ભવિષ્યની શરૂઆત આજે જ કરો' : isHi ? 'अपने वित्तीय भविष्य की शुरुआत आज ही करें' : 'Partnering for Your Lifelong Financial Freedom',
    subtitle: `${advisorSnapshot.name} • ${advisorSnapshot.designation}`,
    keyTakeaway: 'The single biggest risk in personal finance is delay. Take the first step today.',
    bulletPoints: [
      `Advisor: ${advisorSnapshot.name} (${advisorSnapshot.designation})`,
      `Direct Call & WhatsApp: ${advisorSnapshot.phone} / ${advisorSnapshot.whatsapp}`,
      `Email & Location: ${advisorSnapshot.email} • ${advisorSnapshot.location}`,
      `Professional License / ARN: ${advisorSnapshot.professionalLicense}`,
    ],
    callToAction: advisorSnapshot.defaultCtaText,
    assumptions: [advisorSnapshot.disclaimer],
  });

  return {
    id: `pres_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: presTitle,
    subjectId,
    subjectTitle: presTitle,
    subCategoryTitle: opts.subCategoryTitle,
    mode,
    language,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientName: clientName?.trim() || undefined,
    historicalScenarioMode: questionnaire.historicalScenarioMode || 'standard',
    workflowType: questionnaire.workflowType || 'client_report_pdf',
    advisorPrivateNotes:
      questionnaire.additionalNotes?.trim() ||
      questionnaire.advisorPrivateNotes?.trim() ||
      undefined,
    questionnaireSnapshot: questionnaire,
    businessProfile,
    advisorSnapshot,
    slides,
    source: 'local_engine',
  };
}

export async function regenerateSlide(params: {
  presentation: ClientPresentation;
  slide: PresentationSlide;
  refinementPrompt?: string;
  advisorProfile: AdvisorProfile;
}): Promise<PresentationSlide> {
  const { presentation, slide, refinementPrompt, advisorProfile } = params;

  try {
    const aiPref = getActiveAiPreferences();
    const response = await fetch('/api/regenerate-slide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presentationTitle: presentation.title,
        subjectTitle: presentation.subjectTitle,
        slideNumber: slide.slideNumber,
        slideType: slide.slideType,
        language: presentation.language,
        aiProvider: aiPref.provider,
        openaiModel: aiPref.openaiModel,
        geminiModel: aiPref.geminiModel,
        clientProfile: presentation.questionnaireSnapshot?.clientProfile || 'Retail / HNI Client',
        refinementPrompt: refinementPrompt || 'Make this slide sharper, more client-friendly, and data-accurate',
        advisorProfile: {
          advisorName: advisorProfile.advisorName,
          designation: advisorProfile.designation,
          phoneNumber: advisorProfile.phoneNumber,
          whatsappNumber: advisorProfile.whatsappNumber,
          email: advisorProfile.email,
          defaultDisclaimer: advisorProfile.defaultDisclaimer,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return {
          ...result.data,
          id: slide.id,
          slideNumber: slide.slideNumber,
        };
      }
    }
  } catch (err) {
    console.warn('API slide regeneration failed, applying local refinement:', err);
  }

  // Local fallback: update title or takeaway
  return {
    ...slide,
    subtitle: refinementPrompt ? `Refined: ${refinementPrompt.slice(0, 50)}...` : slide.subtitle,
    keyTakeaway: refinementPrompt
      ? `${slide.keyTakeaway} (${refinementPrompt})`
      : slide.keyTakeaway,
  };
}
