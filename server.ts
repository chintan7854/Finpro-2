import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  validateQuestionAccuracy,
  validateOptionsDistinctness,
  buildDeterministicVerifiedQuestion,
} from './src/utils/financeMathEngine';
import { buildDeterministicPoll } from './src/utils/financePollEngine';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

function getGeminiClient(apiKey?: string) {
  return new GoogleGenAI({
    apiKey: apiKey || process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Multi-model cascading executor for 100% reliable generation without 503 drops
function cleanJsonText(raw: string): string {
  let cleaned = (raw || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

async function generateContentWithFallback(ai: GoogleGenAI, prompt: string, config: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} encountered transient issue:`, err?.message || err);
      lastError = err;
      // Immediately try the next model
    }
  }
  throw lastError || new Error('All candidate models failed to generate content.');
}

// Health and AI status check endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    aiConfigured: hasGeminiKey,
    timestamp: new Date().toISOString()
  });
});

// Secure server-side content generation endpoint using @google/genai
app.post('/api/generate-content', async (req, res) => {
  const {
    subject,
    subjectTitle,
    contentType,
    articleLength,
    audience,
    contentLanguage,
    advisorProfile,
    brandingSettings,
    useDefaultCta,
    useDefaultDisclaimer,
    customCta
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    // Return flag so frontend seamlessly uses the high-fidelity built-in multilingual engine
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local generation engine.'
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const prompt = `
You are a senior financial writer and certified financial planning educator in India.
Generate a comprehensive, high-converting, educational financial advisory marketing kit for a financial advisor.

Topic: ${subjectTitle || subject}
Content Language: ${contentLanguage || 'en'} (IMPORTANT: Write the entire content in this language, e.g., if 'hi' write in natural Hindi, if 'gu' in Gujarati, if 'mr' in Marathi, if 'en' in English)
Audience Target: ${audience || 'General Public'}
Article Length: ${articleLength || 'medium'}
Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
Advisor Designation: ${advisorProfile?.designation || 'Certified Financial Planner'}
${advisorProfile?.achievement ? `Advisor Key Achievement / Milestone: ${advisorProfile.achievement}` : ''}
${advisorProfile?.professionalDetails ? `Advisor Credentials / ARN: ${advisorProfile.professionalDetails}` : ''}
Advisor Phone / WhatsApp: ${advisorProfile?.phoneNumber || '+91 98765 43210'}
CTA: ${useDefaultCta ? (advisorProfile?.defaultCTA || 'Contact today to plan your investments.') : (customCta || 'Get in touch for guidance.')}
Disclaimer: ${useDefaultDisclaimer ? (advisorProfile?.defaultDisclaimer || 'For educational purposes only.') : ''}

CRITICAL CREATIVITY & NOVELTY INSTRUCTION (Seed: ${entropySeed}):
Ensure this output is completely fresh, unique, and distinct in tone, examples, numbers, and storytelling compared to any previous output for this topic. Do not repeat standard boilerplate. Use realistic Indian financial figures, relatable life scenarios, and an engaging hook.

You MUST return ONLY valid JSON matching this exact structure:
{
  "deepArticle": {
    "headline": "Catchy, professional educational headline",
    "subheadline": "Compelling subtitle with real-life context",
    "body": "Detailed educational article with 3-4 structured paragraphs, conversational yet authoritative tone, practical examples (SIP, tax slabs, compounding or risk management as relevant). Include advisor callout.",
    "keyTakeaways": ["Key bullet 1", "Key bullet 2", "Key bullet 3"],
    "readTime": "3 min read"
  },
  "whatsappStatus": {
    "slide1": "Punchy slide 1 Hook (under 25 words)",
    "slide2": "Insightful slide 2 Explanation with numbers or comparison (under 30 words)",
    "slide3": "Slide 3 Actionable tip + Contact CTA (under 25 words)"
  },
  "whatsappMessage": "Complete broadcast message ready for WhatsApp with friendly greeting, emojis, structured bullet points, key tip, and advisor signature.",
  "socialMedia": {
    "platformCaption": "Engaging caption for LinkedIn / Facebook / Instagram with hook, 3 key points, and discussion question.",
    "hashtags": ["#MutualFunds", "#FinancialPlanning", "#SIP", "#WealthCreation"],
    "postHook": "One-line scroll-stopping hook sentence"
  },
  "videoScript": {
    "title": "30-60 sec short video / reel script",
    "hook": "First 3 seconds attention grabber",
    "storyPoints": ["Camera angle 1 / Point 1", "Visual comparison / Point 2", "Solution / Point 3"],
    "callToAction": "Spoken closing CTA",
    "durationEstimate": "45 seconds"
  },
  "financialInsights": {
    "statHighlight": "Compelling statistic or rule of thumb",
    "actionableRule": "One simple financial rule client can follow today",
    "comparisonNote": "Important comparison or common mistake to avoid"
  }
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.85,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'AI generation failed, fallback to local engine'
    });
  }
});

// Dedicated AI Generator for the 25 Creative Visual Poster Themes
app.post('/api/generate-theme-poster', async (req, res) => {
  const {
    themeId,
    themeName,
    subjectTitle,
    subjectId,
    contentLanguage,
    advisorProfile,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on server. Falling back to local theme engine.'
    });
  }

  try {
    const ai = getGeminiClient(apiKey);

    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const freshAngles = [
      'Focus on long-term compounding acceleration and starting early',
      'Focus on beating silent inflation and low-yield fixed deposit erosion',
      'Focus on investor behavioral traps, market panic, and staying disciplined',
      'Focus on smart tax efficiency and maximizing net take-home returns',
      'Focus on protecting family lifestyle and shielding children from financial shocks',
      'Focus on stark mathematical contrasts and eye-opening wealth numbers'
    ];
    const chosenAngle = freshAngles[Math.floor(Math.random() * freshAngles.length)];

    const prompt = `
You are a senior Indian financial educator and copywriting expert for certified financial planners.
Generate content tailored specifically for the visual theme "${themeName}" (Theme ID: ${themeId}) on the financial subject "${subjectTitle || subjectId}".

Target Language: "${contentLanguage || 'en'}"
MANDATORY LANGUAGE SPECIFICATION:
- If Target Language is "gu" (Gujarati), you MUST write ALL text—the headline, subheadline, badgeText, ctaText, titles, bullet points, explanations, takeaways—strictly and fluently in authentic Gujarati script (ગુજરાતી ભાષા).
- If Target Language is "hi" (Hindi), write ALL text in Hindi Devanagari script (हिन्दी).
- If Target Language is "mr" (Marathi), write ALL text in Marathi (मराठी).
- If Target Language is "en" (English), write ALL text in English.
Even though the framework theme name ("${themeName}") was specified in English, EVERY SINGLE STRING VALUE in the JSON output MUST BE COMPOSED 100% IN THE TARGET LANGUAGE (${contentLanguage}).

Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
Advisor Title: ${advisorProfile?.designation || 'Certified Financial Planner'}
${advisorProfile?.achievement ? `Advisor Key Achievement: ${advisorProfile.achievement}` : ''}
Advisor Phone / WhatsApp: ${advisorProfile?.phoneNumber || '+91 98765 43210'}

CRITICAL NOVELTY & DENSITY REQUIREMENT (Seed: ${entropySeed}):
Creative Angle Direction: "${chosenAngle}"
Every generation MUST be uniquely distinct, creative, and novel. Even if called multiple times for the exact same subject and theme, produce fresh numbers, fresh real-world scenarios, fresh metaphors, and punchy unique headlines.
IMPORTANT: Make the text engaging, bold, and detailed enough to comfortably fill an 80% coverage area on a 1:1 square graphic card without huge empty blank gaps. Include realistic numbers, actionable insights, and punchy wording.

Theme Format Requirement for Theme ID "${themeId}":
- If split_comparison: Provide "leftTitle", "leftBullets" (3 points), "rightTitle", "rightBullets" (3 points).
- If myth_vs_reality: Provide "mythTitle", "mythText", "realityTitle", "realityText".
- If before_after: Provide "beforeTitle", "beforePoints" (3 points), "afterTitle", "afterPoints" (3 points).
- If checklist_scorecard: Provide "checklistItems" (5 actionable checkbox points) and "scoringGuide".
- If interactive_poll: Provide "options" (array of 4 objects {key: 'A'|'B'|'C'|'D', text: string}) and "pollQuestion".
- If step_roadmap: Provide "steps" (array of 4 objects {step: '01', title: string, desc: string}).
- If number_breakdown: Provide "bigNumber" (e.g. '₹1.5 CRORE'), "bigNumberLabel", "calculations" (4 lines), "takeaway".
- If curiosity_hook: Provide "questionHook", "examples" (3 points), "revelation".
- If dos_and_donts: Provide "dos" (3 items) and "donts" (3 items).
- If case_study: Provide "problem", "action", "outcome".
- If philosophy_quote: Provide "quote", "author", "reflection".
- If cost_of_delay: Provide "personA", "personB", "mathGap", "warning".
- If top_mistakes: Provide "mistakes" (3 objects {num: '01', title: string, detail: string}).
- If direct_faq: Provide "question", "answer", "advisorTip".
- If golden_rule: Provide "ruleName", "sections" (3 objects {title: string, desc: string}), "verdict".
- If visual_analogy: Provide "analogyObject", "comparison", "advisoryLesson".
- If self_audit: Provide "primaryQuestion", "checkpoints" (3 points).
- If cheat_sheet: Provide "items" (5 objects {label: string, formula: string}).
- If market_psychology: Provide "cycleStages" (4 stages), "advisorAdvice".
- If age_blueprint: Provide "tracks" (4 objects {ageGroup: string, focus: string}).
- If resource_recommendation: Provide "resourceTitle", "whyItWorks", "impact".
- If urgent_reminder: Provide "reminderHeader", "actionPoints" (4 points).
- If hidden_cost: Provide "tipOfIceberg", "sunkenIceberg", "takeaway".
- If advisor_opinion: Provide "opinionText", "advisorAdvice".
- If direct_cta_offer: Provide "offerIncludes" (4 points), "offerTerms".

Return ONLY valid JSON matching:
{
  "headline": "Scroll-stopping concise headline (max 10 words)",
  "subheadline": "Insightful supporting subhead (max 14 words)",
  "badgeText": "Short category badge in capital letters",
  "ctaText": "Compelling call to action for WhatsApp / Phone consultation",
  "themeSpecific": {
    /* theme specific keys as defined above */
  }
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.90,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData
    });
  } catch (error: any) {
    console.error('Theme Generator Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Theme generation failed, falling back to local presets'
    });
  }
});

// AI-Powered Client Q&A Advisory Assistant
app.post('/api/generate-client-qa', async (req, res) => {
  const { customerName, customerQuestion, language, advisorProfile } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local Q&A engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);

    const prompt = `
You are an expert Certified Financial Planner (CFP) and personal financial educator in India.
Your mission is to generate a personalized, fiduciary-grade customer response on behalf of financial advisor "${advisorProfile?.advisorName || 'Financial Advisor'}" to their client "${customerName || 'Client'}".

Client Name: "${customerName}"
Client's Question: "${customerQuestion}"
Language: "${language || 'gu'}"
MANDATORY LANGUAGE RULE:
- If language is "gu", write the entire answer, greetings, advice, and bullets in authentic Gujarati script (ગુજરાતી ભાષા).
- If language is "hi", write entirely in Hindi (हिन्दी).
- If language is "en", write entirely in English.

STRICT DOMAIN & INTENT CLASSIFICATION:
1. Examine if the client's query relates to personal finance, money management, investments (SIP, mutual funds, small-cap, equity, debt, gold, FD, etc.), life milestones & family goals (e.g. child education & future expenses when kids grow up, daughter's marriage, retirement planning, house purchase down payment), loan pre-payment/EMI, insurance (life, health, mediclaim), tax savings, emergency cushion, or financial budgeting.
   CRITICAL NOTE: Family financial milestone inquiries (e.g., "when children grow up, what to do to meet their expenses", "how much to save for retirement", "is home loan prepayment better than SIP") ARE 100% VALID FINANCIAL PLANNING QUESTIONS!
2. If the question is completely non-financial (e.g. home remedies, cooking recipes, movies, cricket scores, politics, astrology, personal non-financial advice):
   Set "isFinancial": false, and explain in ${language} that this advisory system only answers financial planning inquiries.
3. If the question is financially relevant:
   Set "isFinancial": true.
   Compose a warm, professional, actionable response in ${language}.
   Structure:
   - Empathetic client greeting: e.g. in Gujarati: "${customerName}, તમે પૂછ્યું હતું કે '${customerQuestion}' તો તેમના માટે તમને હું સલાહ આપી રહ્યો છું કે..."
   - Actionable educational guidance: Practical perspective, risk-reward trade-off, why discipline matters, and prudent precautions (e.g. if small-cap / high return is asked, explain that past returns are not guaranteed, but long-term systematic SIP helps manage risk).
   - Advisor Sign-off:
     ${advisorProfile?.advisorName || 'Financial Advisor'}
     ${advisorProfile?.designation || 'Certified Financial Planner'}
     M: ${advisorProfile?.phoneNumber || '+91 98765 43210'}
     ${advisorProfile?.professionalDetails ? advisorProfile.professionalDetails : ''}

Return ONLY valid JSON matching:
{
  "isFinancial": true,
  "rejectionReason": "",
  "answerText": "Complete ready-to-read response with client greeting, advice, and advisor signature",
  "summaryBullets": ["Key takeaway point 1", "Key takeaway point 2"],
  "whatsappReadyText": "*Complete message formatted with WhatsApp asterisks for bolding, friendly greeting, key points with emojis, and advisor signature*"
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.75,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Client Q&A API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Q&A generation failed, fallback to local engine',
    });
  }
});

// Dedicated AI Viral Financial Story Generator
app.post('/api/generate-story', async (req, res) => {
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
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local story engine.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const isDeepLength = lengthId === 'deep';
    const isStandardLength = lengthId === 'standard';

    const prompt = `
You are a master Indian financial storyteller, Certified Financial Planner (CFP), and behavioral finance educator.
Generate an emotionally captivating, highly realistic, detailed, and non-repetitive financial story for a financial advisor to educate clients and broadcast on WhatsApp, LinkedIn, email, and social networks.

Topic: ${topicTitle || topicId}
Narrative Angle: ${angleTitle || angleId}
Target Persona: ${personaTitle || personaId}
Length Mode: ${lengthId || 'standard'}
Target Language: "${language || 'gu'}"

MANDATORY LANGUAGE SPECIFICATION:
- If Target Language is "gu" (Gujarati), you MUST write ALL text—title, hook, every paragraph, dialogues, financial calculations, takeaways, CTAs, and closing—strictly and fluently in authentic Gujarati script (ગુજરાતી ભાષા).
- If Target Language is "hi" (Hindi), write ALL text in natural, engaging Hindi Devanagari script (हिन्दी).
- If Target Language is "en" (English), write ALL text in compelling, high-credibility English.

STORY LENGTH & DEPTH REQUIREMENTS:
${isDeepLength ? `
CRITICAL REQUIREMENT - DEEP AUTHORITY STORY LENGTH:
- The narrative MUST be a comprehensive, long-form story of 1,500 to 2,000 words!
- Do NOT abbreviate, summarize, or produce short snippets. Provide 8 to 14 expansive, richly detailed paragraphs.
- Include natural, vivid dialogues between relatable characters (e.g., discussions over tea, family budget conversations, honest debates between friends or spouse, consultations with an advisor).
- Build relatable characters facing genuine financial dilemmas in India (EMI burdens, peer pressure, child higher education inflation, retirement anxieties, market panic, medical emergencies).
- Create meaningful conflicts, emotional turning points, and realistic financial education (SIP compounding, Step-Up SIP math, post-tax vs real inflation, asset allocation, pure protection).
- Avoid artificial melodrama, repetitive filler, and NEVER make guaranteed-return claims. Emphasize disciplined long-term investing, risk management, and patience.
` : isStandardLength ? `
- Standard length: 500 to 750 words across 5 to 7 detailed, engaging narrative paragraphs with dialogues and realistic financial figures.
` : `
- Short length: 250 to 350 words across 3 to 4 crisp, punchy paragraphs suitable for quick reading.
`}

TITLE & HOOK REQUIREMENT:
1. Start with an attractive, curiosity-driven title.
2. The FIRST PARAGRAPH must open with a powerful curiosity-driven hook that makes readers want to read the entire story.
3. Crucially, END THE FIRST PARAGRAPH with a natural CTA encouraging readers to share the story in their WhatsApp groups (e.g., in Gujarati: "👉 આગળ વાંચતા પહેલાં: જો તમારા પરિવાર કે મિત્ર વર્તુળમાં પણ કોઈ આવી જ નાણાકીય દ્વિધામાંથી પસાર થઈ રહ્યું હોય, તો આ વાર્તા હમણાં જ તમારા વોટ્સએપ ગ્રૂપમાં શેર કરો જેથી કોઈ ખોટો નિર્ણય ન લેવાય." / in Hindi: "👉 आगे पढ़ने से पहले: यदि आपके परिवार या मित्र समूह में कोई भी ऐसी ही वित्तीय दुविधा से गुजर रहा है, तो इस कहानी को अभी अपने व्हाट्सएप ग्रुप में साझा करें ताकि किसी का बड़ा नुकसान न हो।" / in English: "👉 Before reading further: If anyone in your family or friend circle is navigating similar money dilemmas, share this story in your WhatsApp group right away so they don't make the same costly mistake.")

STORY ENDING REQUIREMENT:
1. End the story with a memorable emotional conclusion that resolves the journey with wisdom, peace of mind, and financial clarity.
2. Follow the conclusion with a natural, persuasive CTA encouraging readers to share the story with friends and WhatsApp groups (in "forwardAppeal").

ADVISOR PROFILE & CONTACT CTA:
At the very end, display the Financial Advisor's available profile information:
- Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
- Designation: ${advisorProfile?.designation || 'Certified Financial Planner'}
${advisorProfile?.achievement ? `- Achievement: ${advisorProfile.achievement}` : ''}
${advisorProfile?.professionalDetails ? `- Credentials / ARN: ${advisorProfile.professionalDetails}` : ''}
${advisorProfile?.phoneNumber ? `- Mobile Number: ${advisorProfile.phoneNumber}` : ''}
${advisorProfile?.whatsappNumber ? `- WhatsApp Number: ${advisorProfile.whatsappNumber}` : ''}
${advisorProfile?.email ? `- Email: ${advisorProfile.email}` : ''}
${advisorProfile?.location ? `- Location / City: ${advisorProfile.location}` : ''}
${advisorProfile?.website ? `- Website: ${advisorProfile.website}` : ''}
- Saved Default CTA: ${advisorProfile?.defaultCTA || 'Contact today for personalized financial planning.'}
- Applicable Disclaimer: ${advisorProfile?.defaultDisclaimer || 'Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance does not guarantee future results.'}

Include a persuasive CTA inviting readers to contact the advisor for personalized financial planning.
Never invent nonexistent contact details and never omit available ones.

Seed: ${entropySeed}

You MUST return ONLY valid JSON matching this exact structure:
{
  "title": "Attractive, curiosity-driven headline with 1 emoji",
  "hook": "1-2 sentence compelling hook summarizing the core curiosity gap",
  "storyParagraphs": [
    "Paragraph 1 starting with the curiosity hook, introducing the scenario, and ending with the natural WhatsApp group share CTA",
    "Paragraph 2 with character dialogue and the emerging conflict...",
    "Paragraph 3 with realistic financial calculations and contrasting choices...",
    "Additional paragraphs continuing the deep narrative...",
    "Final paragraph with memorable emotional conclusion and financial wisdom"
  ],
  "takeaways": [
    "Concrete, actionable financial lesson 1",
    "Concrete, actionable financial lesson 2",
    "Concrete, actionable financial lesson 3",
    "Concrete, actionable financial lesson 4"
  ],
  "forwardAppeal": "Natural, compelling CTA encouraging readers to share the story with friends and WhatsApp groups",
  "persuasivePlanningCta": "Persuasive CTA inviting readers to contact the advisor for personalized financial planning",
  "ctaSignature": "Complete formatted signature block with advisor details and disclaimer"
}
`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.8,
      maxOutputTokens: 8192,
    });

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Story Generation API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Story generation failed, fallback to local engine',
    });
  }
});

// Dedicated AI Client Presentation Generator
app.post('/api/generate-presentation', async (req, res) => {
  const {
    topicPrompt,
    subjectId,
    subjectTitle,
    subCategoryTitle,
    mode = 'detailed',
    language = 'en',
    clientName,
    questionnaire,
    advisorProfile,
    businessProfile,
    historicalScenarioMode,
    workflowType,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local generation engine.'
    });
  }

  try {
    const ai = getGeminiClient(apiKey);

    const targetSlideCount = mode === 'quick' ? 6 : mode === 'detailed' ? 10 : 8;
    const langLabel = language === 'gu' ? 'Gujarati (ગુજરાતી)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';

    // Sector, Company, Product details
    const sectorName = businessProfile?.sectorName || businessProfile?.customSectorName || 'Financial Advisory';
    const companyName = businessProfile?.companyName || '';
    const productName = businessProfile?.productName || '';
    const advisorRole = businessProfile?.advisorRole || 'Independent Financial Advisor';
    const authId = businessProfile?.authorizationIdentifier || '';
    const needsVerification = businessProfile?.needsVerification || false;

    const presentationTopic = topicPrompt || (companyName && productName ? `${companyName} — ${productName}` : subjectTitle || subCategoryTitle || 'Comprehensive Financial Strategy');

    const prompt = `You are an elite Senior Certified Financial Planner (CFP) and financial advisory expert creating a client-ready, single-product advisory presentation report for a financial advisor in India.
${workflowType === 'client_report_pdf' ? 'REPORT FORMAT: Official Single-Product Financial Advisory Report intended for high-resolution client PDF distribution.' : 'REPORT FORMAT: Executive presentation slide deck for client meeting.'}

LANGUAGE REQUIREMENT:
Generate the entire presentation strictly in ${langLabel}. Ensure pristine, natural, culturally authentic professional vocabulary suitable for high-trust client discussions.

1. TARGET PRODUCT RECOMMENDATION (SINGLE PRODUCT FOCUS):
- Business Sector: "${sectorName}"
- Institution / Company: "${companyName || 'Reputed Financial Institution'}"
- Product / Scheme Selected: "${productName || 'Tailored Financial Solution'}"
${businessProfile?.productVariant ? `- Product Variant/Plan: "${businessProfile.productVariant}"` : ''}
${needsVerification ? `- Status: [Requires Verification] — do not state unverified facts as final contract terms.` : ''}
- Advisor's Distribution Role: "${advisorRole}" ${authId ? `(Identifier: ${authId})` : ''}
- Advisor's Presentation Goal & Topic: "${presentationTopic}"
- Presentation Mode: ${mode.toUpperCase()} (${targetSlideCount} slides)
${clientName ? `- Prepared For Client: "${clientName}"` : '- General Client Discussion Proposal'}

2. CLIENT PROFILE & QUESTIONNAIRE CONTEXT (DO NOT DISPLAY ADVISOR PRIVATE NOTES ON SLIDES):
${questionnaire?.clientRelationship ? `- Relationship & History: ${questionnaire.clientRelationship}` : ''}
${questionnaire?.clientGoals ? `- Client's Known Goals & Needs: ${questionnaire.clientGoals}` : ''}
${questionnaire?.clientBudget ? `- Approximate Annual Income / Investment Budget: ${questionnaire.clientBudget} (${questionnaire.clientBudgetStatus === 'verified' ? 'VERIFIED by client directly' : 'ADVISOR ESTIMATE'})` : ''}
${questionnaire?.clientConcerns ? `- Objections / Expressed Concerns: ${questionnaire.clientConcerns}` : ''}
${questionnaire?.hesitationReasons ? `- Stated Hesitations & True Concerns: ${questionnaire.hesitationReasons}` : ''}
${questionnaire?.preferredStyle ? `- Client's Preferred Presentation Style: ${questionnaire.preferredStyle}` : ''}
${questionnaire?.emphasisPoints ? `- High Priority Points / Calculations to Emphasize: ${questionnaire.emphasisPoints}` : ''}
${questionnaire?.additionalNotes ? `- Advisor Private Strategy Notes: "${questionnaire.additionalNotes}"` : ''}
${historicalScenarioMode && historicalScenarioMode !== 'standard' ? `
3. HISTORICAL BEST-CASE / MAXIMUM POTENTIAL BENEFIT SCENARIO (MANDATORY REQUIREMENT):
Mode: ${historicalScenarioMode === 'historical_and_contractual' ? 'Historical Best-Case PLUS Maximum Contractual Benefit Analysis' : 'Historical Best-Case Analysis'}
- For Investments/SIPs: Incorporate verified historical benchmark data (Nifty 50 TRI / Nifty 500 TRI), explicitly specifying dates and duration (e.g. 15-year rolling SIP return of ~17.8% during 2003-2018 cycle). You MUST clearly separate historical actual past returns from hypothetical future illustrations (12% baseline). Include statutory disclosure: "Past performance does not guarantee future results."
- For Life Insurance: Calculate and state contractual benefits strictly from official policy terms. Keep Guaranteed Sum Assured death benefit completely distinct from non-guaranteed bonuses (IRDAI 4% & 8% illustrations). NEVER describe life insurance cover as investment profit.
- For Loans / Deposits: Show guaranteed contractual rates, interest savings, or maturity values.
` : ''}

CRITICAL REPORT DESIGN RULES (INSPIRED BY GOLD-STANDARD ADVISOR PDF SAMPLES):
1. THE SELECTED PRODUCT MUST REMAIN THE CENTRAL SUBJECT of the report. Do NOT produce a generic financial literacy essay or product comparison brochure. It must read like an advisor's customized advisory report prepared after understanding the client's needs.
2. SECTOR-SPECIFIC REPORT LOGIC:
   • MUTUAL FUNDS / SIP: Use exact scheme (${productName}), plan, regular growth option. Explain investment mandate, riskometer (Very High), horizon, SIP amount, hypothetical future value scenarios (6%, 10%, 12% mathematical sensitivities), historical performance context with explicit disclosure that past returns do not guarantee future returns, costs (TER & exit load), taxation, and what the fund's published history shows vs what it does NOT show.
   • LIFE INSURANCE: Analyze protection need, income support reserve, liabilities (home loan), children's future education, existing cover, net protection gap, why term insurance fits the gap, guaranteed vs non-guaranteed benefits, riders, medical disclosures, and claims servicing checklist.
   • HEALTH INSURANCE: Analyze hospitalization impact on savings, base sum insured, room eligibility, waiting periods (initial, pre-existing disease), booster/restoration, network cashless hospitals, family cash-flow context, claim scenarios, and disclosure principles.
   • LOANS / FINANCE: Analyze loan purpose, tenure, affordability, illustrative EMI scenarios across interest rates, required documentation, and lender eligibility checks.
   • OTHER SECTORS: Intelligently adapt to the actual financial product structure (costs, liquidity, risks, regulatory checks).
3. STRICT COMPLIANCE & LEGAL SAFETY:
   • NEVER promise guaranteed returns on mutual funds, equities, or market-linked plans.
   • NEVER guarantee loan approval, claim settlement, or policy issuance.
   • DO NOT display advisor commissions in client-facing presentations.
   • Transparently state assumptions and label all projections as illustrative scenarios.
4. ADVISOR BRANDING ON FINAL SLIDE:
   Advisor: ${advisorProfile?.advisorName || 'Financial Advisor'}, ${advisorProfile?.designation || advisorRole}, Phone: ${advisorProfile?.phoneNumber || ''}, WhatsApp: ${advisorProfile?.whatsappNumber || ''}, Email: ${advisorProfile?.email || ''}, License/Identifier: ${authId || advisorProfile?.professionalDetails || ''}, Compliance Disclaimer: "${advisorProfile?.defaultDisclaimer || 'Investments are subject to market risks. Read all scheme and policy documents carefully.'}".

SLIDE STRUCTURE BLUEPRINT (${targetSlideCount} slides):
- Slide 1: Professional Cover Page — Exact Product Name ("${productName || 'Product Recommendation'}"), Institution ("${companyName}"), Client Name ("${clientName || 'Client Family'}"), Advisor Role & clear subtitle.
- Slide 2: Client Profile & The Core Need Discussed — Household income/budget context, financial priority, risk capacity, and why this discussion matters.
- Slide 3: Why This Specific Product is Being Considered — Mandate, strategy, core features, official factsheet/policy parameters.
- Slide 4: Proposal & Financial Scenarios — Tangible numbers (SIP / Premium / EMI / Sum Insured), time horizon, and realistic future value or cost scenarios.
- Slide 5: Visual Breakdown & Sensitivity Scenarios — Include structured chartData (type: 'bar', 'donut', 'line', or 'milestones') illustrating growth, asset allocation, or protection coverage.
- Slide 6: Critical Details & Product Mechanics — For MFs: TER, exit load, historical SIP facts vs limitations; For Insurance: Waiting periods, room rent, cashless network, Booster+; For Loans: Interest rates, processing fees, repayment schedule.
- Slide 7: Why This May Not Be Suitable / Risk Factors — Honest risk disclosures, underperformance, behavioural panic risk, exclusions, and suitability guardrails.
${targetSlideCount >= 8 ? `- Slide 8: Implementation Checklist & Review Schedule — Action steps before transaction (KYC, bank mandate, policy schedule review, annual review cadence).` : ''}
${targetSlideCount >= 10 ? `- Slide 9: Common Client Questions & Objective Answers — Direct answers addressing the client's stated concerns with facts and reassuring perspective.` : ''}
- Slide ${targetSlideCount}: Advisor's Personalized Recommendation, Disclosures & Contact CTA — Final advisor closing note, full credentials (${advisorRole}), phone/WhatsApp, and statutory compliance disclaimer.

You MUST respond with valid JSON matching this exact structure:
{
  "title": "${productName ? `${productName} — Client Recommendation` : 'Client Advisory Presentation'}",
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "cover",
      "badge": "Product Recommendation",
      "title": "${productName || 'Financial Solution'}",
      "subtitle": "${companyName ? `Prepared with ${companyName}` : 'Personalized Advisory Blueprint'}",
      "keyTakeaway": "Executive summary of the recommendation",
      "bulletPoints": [
        "Personalized client recommendation prepared for family discussion",
        "Clear goal alignment and objective risk suitability",
        "Transparent fee, performance, and regulatory disclosures"
      ],
      "metrics": [
        { "label": "Product", "value": "${productName ? productName.slice(0, 18) : 'Strategic'}", "helper": "${companyName || 'Verified'}" },
        { "label": "Advisory Status", "value": "${needsVerification ? 'Review Pending' : 'Suitability Match'}", "helper": "Official Terms" }
      ],
      "assumptions": ["Illustrative client report. Terms subject to official current documents."]
    }
  ]
}
Ensure each slide has valid rich elements (metrics, chartData, comparisonTable, risksAndLimitations, assumptions, or callToAction).`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    });

    const cleanedText = cleanJsonText(responseText);
    const parsedData = JSON.parse(cleanedText);

    // Normalize slides for rock-solid frontend consumption
    if (parsedData && Array.isArray(parsedData.slides)) {
      parsedData.slides = parsedData.slides.map((slide: any, idx: number) => {
        const slideNumber = slide.slideNumber || idx + 1;
        const badge = slide.badge || (
          slideNumber === 1
            ? (language === 'gu' ? 'મુખ્ય આયોજન' : language === 'hi' ? 'मुख्य योजना' : 'Overview')
            : (language === 'gu' ? `સ્લાઇડ #${slideNumber}` : language === 'hi' ? `स्लाइड #${slideNumber}` : `Slide #${slideNumber}`)
        );

        let comparisonTable = slide.comparisonTable;
        if (comparisonTable && Array.isArray(comparisonTable.rows)) {
          comparisonTable = {
            headers: Array.isArray(comparisonTable.headers) ? comparisonTable.headers : ['Parameter', 'Recommendation', 'Alternative'],
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

        let callToAction = slide.callToAction;
        if (callToAction && typeof callToAction === 'object') {
          callToAction =
            callToAction.text ||
            callToAction.message ||
            callToAction.cta ||
            (callToAction.phone || callToAction.whatsapp
              ? `Consultation: ${callToAction.advisorName || 'Financial Advisor'} (Tel: ${callToAction.phone || callToAction.whatsapp})`
              : 'Schedule your personalized 1-on-1 portfolio review today.');
        }

        const bulletPoints = Array.isArray(slide.bulletPoints)
          ? slide.bulletPoints.map((bp: any) =>
              typeof bp === 'string' ? bp : bp?.text || bp?.point || bp?.description || String(bp || '')
            )
          : [];

        const keyTakeaway =
          typeof slide.keyTakeaway === 'string'
            ? slide.keyTakeaway
            : slide.keyTakeaway?.text || slide.keyTakeaway?.point || String(slide.keyTakeaway || '');

        return {
          ...slide,
          slideNumber,
          badge: typeof badge === 'string' ? badge : String(badge || ''),
          title: typeof slide.title === 'string' ? slide.title : String(slide.title?.text || slide.title || `Slide ${slideNumber}`),
          subtitle: typeof slide.subtitle === 'string' ? slide.subtitle : String(slide.subtitle?.text || slide.subtitle || ''),
          keyTakeaway,
          bulletPoints,
          callToAction: callToAction ? String(callToAction) : undefined,
          comparisonTable,
        };
      });
    }

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Presentation Generation API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Presentation generation failed, falling back to local engine',
    });
  }
});

// Dedicated AI Single Slide Regenerator
app.post('/api/regenerate-slide', async (req, res) => {
  const {
    presentationTitle,
    subjectTitle,
    slideNumber,
    slideType,
    language = 'en',
    clientProfile,
    refinementPrompt,
    advisorProfile,
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      error: 'GEMINI_API_KEY is not configured on the server',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const langLabel = language === 'gu' ? 'Gujarati (ગુજરાતી)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';

    const prompt = `You are a Senior Certified Financial Planner (CFP).
Regenerate or enhance Slide #${slideNumber} (${slideType}) of a financial presentation titled "${presentationTitle}" on topic "${subjectTitle}".
Language: ${langLabel}.
Client Profile: ${clientProfile || 'Retail / HNI Investor'}.
Advisor's Custom Refinement Request: "${refinementPrompt || 'Make this slide more impactful, data-accurate, and engaging'}".

COMPLIANCE RULES:
- No guaranteed return claims. Identify assumptions clearly.
- Keep advisor contact and regulatory disclaimers accurate if this is the final slide.
- Return ONLY valid JSON for this single slide:
{
  "slideNumber": ${slideNumber},
  "slideType": "${slideType}",
  "badge": "Badge text",
  "title": "Impactful Slide Title",
  "subtitle": "Subtitle text",
  "keyTakeaway": "Executive punchline",
  "bulletPoints": [
    "Compelling point 1",
    "Compelling point 2",
    "Compelling point 3"
  ],
  "metrics": [
    { "label": "Metric Name", "value": "Value", "helper": "Context" }
  ],
  "chartData": {
    "type": "bar",
    "title": "Chart Title",
    "labels": ["Item A", "Item B", "Item C"],
    "values": [25, 50, 100],
    "unit": "Lakhs",
    "explanation": "Brief context"
  },
  "risksAndLimitations": ["Key realistic limitation or market consideration"],
  "assumptions": ["Key calculation baseline assumption"]
}`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.75,
      maxOutputTokens: 3000,
    });

    const cleanedText = cleanJsonText(responseText);
    const parsedSlide = JSON.parse(cleanedText);

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedSlide,
    });
  } catch (error: any) {
    console.error('Slide Regeneration API Error:', error);
    return res.json({
      success: false,
      useLocalEngine: true,
      error: error?.message || 'Slide regeneration failed',
    });
  }
});

// Dedicated AI Finance Quiz Generator (Advanced Multi-Step Calculation Engine)
app.post('/api/generate-quiz', async (req, res) => {
  const {
    topicId,
    topicTitle,
    category,
    difficulty = 'advanced',
    questionCount = 1,
    language = 'en',
    clientName,
    advisorProfile,
    previousQuestions = [],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    return res.json({
      success: false,
      useLocalEngine: true,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local quiz bank.',
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const langInstructions: Record<string, string> = {
      en: 'English (Clear, highly professional, Indian financial advisory context with Rupee values ₹)',
      hi: 'Hindi (शुद्ध, स्वाभाविक और धाराप्रवाह हिन्दी देवनागरी लिपि)',
      gu: 'Gujarati (પ્રામાણિક, શુદ્ધ અને અસ્ખલિત ગુજરાતી લિપિ)',
      mr: 'Marathi (अस्खलित आणि प्रामाणिक मराठी देवनागरी लिपी)',
      bn: 'Bengali (সহজ ও সাবলীল বাংলা লিপি)',
      ta: 'Tamil (தெளிவான மற்றும் இயல்பான தமிழ் எழுத்துரு)',
      te: 'Telugu (స్పష్టమైన మరియు సహజమైన తెలుగు లిపి)',
      kn: 'Kannada (ಸ್ಪಷ್ಟ ಮತ್ತು ನಿಖರವಾದ ಕನ್ನಡ ಲಿಪಿ)',
      ml: 'Malayalam (വ്യക്തവും സ്വാഭാവികവുമായ മലയാളം ലിപി)',
      pa: 'Punjabi (ਸਪੱਸ਼ਟ ਅਤੇ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਗੁਰਮੁਖੀ ਲਿਪੀ)',
    };

    const targetLangDesc = langInstructions[language] || `Language Code: ${language}`;

    const duplicateConstraint = Array.isArray(previousQuestions) && previousQuestions.length > 0
      ? `\nPREVIOUSLY GENERATED QUESTIONS TO AVOID (DO NOT REPEAT OR MIMIC THESE):\n${previousQuestions.slice(-10).map((q: string) => `- ${q}`).join('\n')}\nGenerate a completely FRESH scenario with DIFFERENT numbers, names, time horizons, and financial dilemmas.\n`
      : '';

    const prompt = `You are a Senior Certified Financial Planner (CFP) and Master Financial Quiz Designer for Indian wealth managers and advisors.
Generate a challenging, ADVANCED, CALCULATION-BASED multiple choice financial quiz on:
Topic: "${topicTitle || topicId}"
Category: "${category || 'Financial Planning'}"
Target Difficulty: ADVANCED (Strictly suitable for financially knowledgeable adults, investors, and advisors; NOT elementary or beginner)
Target Language: "${language}" (${targetLangDesc})
Client Scenario Target: ${clientName ? `Tailored for client "${clientName}"` : 'Realistic Indian Investor Scenario'}
Randomization Seed: ${entropySeed}
${duplicateConstraint}

THE 9 STRICT ACCURACY RULES (MANDATORY & ENFORCED VIA CODE VALIDATION):
1. Every question must have exactly ONE unambiguously correct answer among the four options A, B, C, and D.
2. Before generating options, independently solve the question and establish its verified correct answer.
3. For mathematical, financial, numerical, logical, percentage, SIP, mutual fund, compound interest, loan, tax, insurance, inflation, and investment questions, calculate the answer using reliable formulas and deterministic code. Never rely on language-model estimation for arithmetic.
4. Define all necessary assumptions, units, time periods, interest rates, compounding frequencies, payment timings, rounding rules, and calculation conventions within the question whenever they can affect the answer (e.g. "invested at the beginning of each month", "compounded monthly at 12.0% CAGR", "for exactly 15 years", "round to nearest ₹1,000").
5. If different reasonable interpretations or calculation methods produce different answers, rewrite the question to eliminate the ambiguity before generating the options.
6. Generate four distinct, plausible options. Independently calculate or verify every option against the exact question. Exactly one option must satisfy all stated conditions.
7. The correct answer must appear in exactly one option. Do not use approximate values as interchangeable answers unless the question explicitly specifies an acceptable rounding precision or tolerance.
8. For numerical questions, define the required precision and round only the final result. Ensure that the correct option matches the independently calculated result within the explicitly permitted rounding tolerance.
9. Never create two options that are mathematically equivalent, represent the same correct result, or become correct under alternative interpretations (e.g. "₹10 Lakh" and "₹10,00,000" or same numbers in different formats).

EXPLANATION & CALCULATION STEPS:
- Provide step-by-step arithmetic showing:
  * Step 1: Stated inputs and formulas used.
  * Step 2: Step-by-step intermediate calculations.
  * Step 3: Final verified result matching the correct option.
- Ensure the explanation, calculation result, and correctIndex match 100% without discrepancy.
- All text, options, explanations, calculations, and disclaimers MUST be fluently written in ${targetLangDesc}.

Return ONLY valid JSON matching this exact structure:
{
  "topicId": "${topicId}",
  "topicTitle": "${topicTitle}",
  "language": "${language}",
  "difficulty": "advanced",
  "questions": [
    {
      "id": "q_${Date.now()}",
      "questionTitle": "Concise descriptive title of this specific problem in ${language}",
      "questionText": "Detailed practical multi-step scenario with explicit numbers, assumptions, and clear question prompt in ${language}",
      "options": [
        "Option A in ${language}",
        "Option B in ${language}",
        "Option C in ${language}",
        "Option D in ${language}"
      ],
      "correctIndex": 0,
      "explanation": "Comprehensive step-by-step resolution showing the financial formulas, compounding logic, and why this option is mathematically correct in ${language}",
      "stepByStepCalculations": [
        "Step 1: Stated inputs and formula in ${language}",
        "Step 2: Mathematical computation in ${language}",
        "Step 3: Final verified result in ${language}"
      ],
      "financialTakeaway": "Actionable financial planning principle or rule of thumb in ${language}",
      "disclaimer": "Mutual fund investments are subject to market risks, read all scheme related documents carefully. Projections are estimates and not guaranteed.",
      "commonTrap": "Why uneducated investors choose the wrong option in ${language}",
      "ruleOfThumb": "Memorable rule of thumb in ${language}",
      "advisorTip": "Personal advisory consultation prompt in ${language}"
    }
  ]
}`;

    let parsedData: any = null;
    let verificationPassed = false;

    // Multi-attempt verification loop with strict accuracy checks
    for (let attempt = 0; attempt < 2 && !verificationPassed; attempt++) {
      try {
        const responseText = await generateContentWithFallback(ai, prompt, {
          responseMimeType: 'application/json',
          temperature: attempt === 0 ? 0.7 : 0.4,
        });

        const cleanedText = cleanJsonText(responseText);
        const candidate = JSON.parse(cleanedText);

        if (candidate?.questions && candidate.questions.length > 0) {
          const q = candidate.questions[0];
          
          // Strict Validation using deterministic engine
          const distinctCheck = validateOptionsDistinctness(q.options);
          const accuracyCheck = validateQuestionAccuracy(q);

          if (distinctCheck.isValid && accuracyCheck.isValid) {
            parsedData = candidate;
            verificationPassed = true;
          } else {
            console.warn(`Attempt ${attempt + 1} rejected by accuracy rules:`, distinctCheck.reason || accuracyCheck.errors.join('; '));
          }
        }
      } catch (genErr) {
        console.warn(`Generation attempt ${attempt + 1} issue:`, genErr);
      }
    }

    if (!verificationPassed || !parsedData) {
      // Deterministic calculation engine: produce 100% mathematically proven question
      const deterministicQ = buildDeterministicVerifiedQuestion({
        topicId: topicId || 'personal_financial_planning',
        topicTitle: topicTitle || 'Personal Financial Planning',
        category: category || 'personal_finance',
        lang: language || 'en',
        clientName,
        seed: Date.now(),
      });

      return res.json({
        success: true,
        source: 'verified_deterministic_engine',
        data: {
          topicId: topicId || 'personal_financial_planning',
          topicTitle: topicTitle || 'Personal Financial Planning',
          language: language || 'en',
          difficulty: 'advanced',
          questions: [deterministicQ],
        },
      });
    }

    return res.json({
      success: true,
      source: 'ai_api',
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Quiz Generation API Error:', error);
    // Even on server exception, return a verified deterministic calculation
    const deterministicQ = buildDeterministicVerifiedQuestion({
      topicId: req.body?.topicId || 'personal_financial_planning',
      topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
      category: req.body?.category || 'personal_finance',
      lang: req.body?.language || 'en',
      clientName: req.body?.clientName,
      seed: Date.now(),
    });

    return res.json({
      success: true,
      source: 'verified_deterministic_engine',
      data: {
        topicId: req.body?.topicId || 'personal_financial_planning',
        topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
        language: req.body?.language || 'en',
        difficulty: 'advanced',
        questions: [deterministicQ],
      },
    });
  }
});

// Dedicated AI Finance Poll Generator
app.post('/api/generate-poll', async (req, res) => {
  const {
    topicNum,
    topicId,
    topicTitle,
    category,
    pollType,
    language = 'en',
    clientName,
    advisorProfile,
    previousPollQuestions = [],
  } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyValid = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');

  if (!isKeyValid) {
    const fallbackPoll = buildDeterministicPoll({
      topicNum: topicNum || 1,
      topicId: topicId || 'personal_financial_planning',
      topicTitle: topicTitle || 'Personal Financial Planning',
      category: category || 'personal_finance',
      pollType: pollType || 'awareness',
      language,
      clientName,
      advisorProfile,
    });
    return res.json({
      success: true,
      source: 'deterministic_math_engine',
      poll: {
        questionText: fallbackPoll.questionText,
        options: fallbackPoll.options,
        isKnowledgeOrCalculation: fallbackPoll.isKnowledgeOrCalculation,
        correctIndex: fallbackPoll.correctIndex,
        explanation: fallbackPoll.explanation,
        stepByStepCalculations: fallbackPoll.stepByStepCalculations,
        educationalTakeaway: fallbackPoll.educationalTakeaway,
      },
    });
  }

  try {
    const ai = getGeminiClient(apiKey);
    const entropySeed = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const langInstructions: Record<string, string> = {
      en: 'English (Clear, highly professional, Indian financial advisory context with Rupee values ₹)',
      hi: 'Hindi (शुद्ध, स्वाभाविक और धाराप्रवाह हिन्दी देवनागरी लिपि)',
      gu: 'Gujarati (પ્રામાણિક, શુદ્ધ અને અસ્ખલિત ગુજરાતી લિપિ)',
      mr: 'Marathi (अस्खलित आणि प्रामाणिक मराठी देवनागरी लिपी)',
      bn: 'Bengali (সহজ ও সাবলীল বাংলা লিপি)',
      ta: 'Tamil (தெளிவான மற்றும் இயல்பான தமிழ் எழுத்துரு)',
      te: 'Telugu (స్పష్టమైన మరియు సహజమైన తెలుగు లిపి)',
      kn: 'Kannada (ಸ್ಪಷ್ಟ ಮತ್ತು ನಿಖರವಾದ ಕನ್ನಡ ಲಿಪಿ)',
      ml: 'Malayalam (വ്യക്തവും സ്വാഭാവികവുമായ മലയാളം ലിപി)',
      pa: 'Punjabi (ਸਪੱਸ਼ਟ ਅਤੇ ਸ਼ੁੱਧ ਪੰਜਾਬੀ ਗੁਰਮੁਖੀ ਲਿਪੀ)',
    };

    const targetLangDesc = langInstructions[language] || `Language Code: ${language}`;

    const duplicateConstraint = Array.isArray(previousPollQuestions) && previousPollQuestions.length > 0
      ? `\nPREVIOUSLY GENERATED POLL QUESTIONS TO AVOID (DO NOT REPEAT):\n${previousPollQuestions.slice(-10).map((q: string) => `- ${q}`).join('\n')}\nGenerate a completely FRESH scenario with DIFFERENT numbers or perspectives.\n`
      : '';

    const isFactual = pollType === 'knowledge' || pollType === 'calculation' || pollType === 'myth_vs_reality';

    const factualRules = isFactual
      ? `STRICT FACTUAL / CALCULATION ACCURACY RULES:
1. Every question must have exactly ONE unambiguously correct answer among the 3 or 4 options.
2. Before generating options, independently solve the problem and establish its verified correct answer.
3. For numerical/calculation questions (SIP, compounding, EMI, tax, inflation), define all necessary assumptions, units, time periods, compounding frequency, and rounding precision explicitly in the question text.
4. Calculate the answer using reliable formulas and deterministic code. Never rely on estimation for arithmetic.
5. Generate 3 or 4 distinct, plausible options. No two options can be mathematically equivalent or interchangeable (e.g. ₹10 Lakh vs ₹1,000,000).
6. Provide step-by-step arithmetic explanation and educational takeaway.`
      : `OPEN-ENDED CLIENT ENGAGEMENT RULES:
1. Formulate a captivating, thought-provoking question suitable for a WhatsApp poll.
2. Provide 3 or 4 distinct, realistic options reflecting different client habits, mindsets, or preferences.
3. Do not force a single correct answer; this poll is designed to spark audience conversation and engagement.
4. Provide an educational takeaway or advisory perspective.`;

    const prompt = `You are a Senior Certified Financial Planner (CFP) and Master WhatsApp Poll Architect for Indian wealth advisors.
Generate a fresh, highly engaging, mobile-friendly finance poll on:
Topic #${topicNum}: "${topicTitle || topicId}"
Category: "${category}"
Poll Type: "${pollType}" (${isFactual ? 'Factual / Single Verified Answer' : 'Customer Preference / Engagement'})
Target Language: "${language}" (${targetLangDesc})
Client Context: ${clientName ? `Tailored for client "${clientName}"` : 'Realistic Indian Investor Scenario'}
Randomization Seed: ${entropySeed}
${duplicateConstraint}

${factualRules}

CRITICAL FORMATTING RULES:
- The questionText must be clean, natural, and directly usable in WhatsApp's "Ask question" field. Do not include markdown headers or asterisks in questionText.
- Options must be concise (under 15 words each), clear, and mutually exclusive.
- All text must be fluently written in ${targetLangDesc}.

Return ONLY valid JSON matching this exact structure:
{
  "questionText": "Clean question prompt in ${language}",
  "options": [
    "Option 1 in ${language}",
    "Option 2 in ${language}",
    "Option 3 in ${language}",
    "Option 4 in ${language}"
  ],
  "isKnowledgeOrCalculation": ${isFactual},
  ${isFactual ? '"correctIndex": 0,' : ''}
  "explanation": "Clear explanation or advisory rationale in ${language}",
  ${isFactual ? '"stepByStepCalculations": ["Step 1...", "Step 2..."],' : ''}
  "assumptions": "Stated assumptions in ${language}",
  "educationalTakeaway": "Short, memorable educational takeaway or rule of thumb in ${language}"
}`;

    let parsedData: any = null;
    let verificationPassed = false;

    for (let attempt = 0; attempt < 2 && !verificationPassed; attempt++) {
      try {
        const responseText = await generateContentWithFallback(ai, prompt, {
          responseMimeType: 'application/json',
          temperature: isFactual ? 0.4 : 0.7,
        });

        const cleanedText = cleanJsonText(responseText);
        const candidate = JSON.parse(cleanedText);

        if (candidate?.questionText && Array.isArray(candidate?.options) && candidate.options.length >= 3) {
          const cleanOpts = candidate.options.map((o: string) => (o || '').trim());
          const unique = new Set(cleanOpts.map((o: string) => o.toLowerCase()));
          
          if (unique.size === cleanOpts.length) {
            if (isFactual) {
              if (
                typeof candidate.correctIndex === 'number' &&
                candidate.correctIndex >= 0 &&
                candidate.correctIndex < cleanOpts.length
              ) {
                parsedData = candidate;
                verificationPassed = true;
              }
            } else {
              parsedData = candidate;
              verificationPassed = true;
            }
          }
        }
      } catch (genErr) {
        console.warn(`Poll generation attempt ${attempt + 1} issue:`, genErr);
      }
    }

    if (!verificationPassed || !parsedData) {
      const fallbackPoll = buildDeterministicPoll({
        topicNum: topicNum || 1,
        topicId: topicId || 'personal_financial_planning',
        topicTitle: topicTitle || 'Personal Financial Planning',
        category: category || 'personal_finance',
        pollType: pollType || 'awareness',
        language,
        clientName,
        advisorProfile,
      });

      return res.json({
        success: true,
        source: 'deterministic_math_engine',
        poll: {
          questionText: fallbackPoll.questionText,
          options: fallbackPoll.options,
          isKnowledgeOrCalculation: fallbackPoll.isKnowledgeOrCalculation,
          correctIndex: fallbackPoll.correctIndex,
          explanation: fallbackPoll.explanation,
          stepByStepCalculations: fallbackPoll.stepByStepCalculations,
          educationalTakeaway: fallbackPoll.educationalTakeaway,
        },
      });
    }

    return res.json({
      success: true,
      source: 'ai_api',
      poll: parsedData,
    });
  } catch (error: any) {
    console.error('Poll Generation API Error:', error);
    const fallbackPoll = buildDeterministicPoll({
      topicNum: req.body?.topicNum || 1,
      topicId: req.body?.topicId || 'personal_financial_planning',
      topicTitle: req.body?.topicTitle || 'Personal Financial Planning',
      category: req.body?.category || 'personal_finance',
      pollType: req.body?.pollType || 'awareness',
      language: req.body?.language || 'en',
      clientName: req.body?.clientName,
      advisorProfile: req.body?.advisorProfile,
    });

    return res.json({
      success: true,
      source: 'deterministic_math_engine',
      poll: {
        questionText: fallbackPoll.questionText,
        options: fallbackPoll.options,
        isKnowledgeOrCalculation: fallbackPoll.isKnowledgeOrCalculation,
        correctIndex: fallbackPoll.correctIndex,
        explanation: fallbackPoll.explanation,
        stepByStepCalculations: fallbackPoll.stepByStepCalculations,
        educationalTakeaway: fallbackPoll.educationalTakeaway,
      },
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(import.meta.dirname || process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Financial Advisor Platform server running at http://localhost:${PORT}`);
  });
}

// Only start the standalone server if NOT running in a Vercel serverless runtime
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
