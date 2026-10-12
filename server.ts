import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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
async function generateContentWithFallback(ai: GoogleGenAI, prompt: string, config: any) {
  const models = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
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
  } = req.body;

  try {
    const ai = getGeminiClient();

    const targetSlideCount = mode === 'quick' ? 4 : mode === 'detailed' ? 8 : 6;
    const langLabel = language === 'gu' ? 'Gujarati (ગુજરાતી)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English';

    const presentationTopic = topicPrompt || subjectTitle || subCategoryTitle || 'Comprehensive Financial Strategy';

    const prompt = `You are an elite Senior Certified Financial Planner (CFP) and financial advisory expert creating a client-ready, multi-slide advisory presentation for an independent financial advisor in India.

LANGUAGE REQUIREMENT:
Generate the entire presentation strictly in ${langLabel}. Ensure pristine, natural, culturally authentic financial vocabulary suitable for high-trust client discussions.

1. ADVISOR'S PRESENTATION GOAL & TOPIC REQUEST:
"${presentationTopic}"
Mode: ${mode.toUpperCase()} (${targetSlideCount} slides)
${clientName ? `Prepared Specifically For Client: "${clientName}"` : 'General Client Advisory Deck'}

2. OPTIONAL CLIENT CONTEXT & QUESTIONNAIRE INSIGHTS (IF PROVIDED):
${questionnaire?.clientRelationship ? `- Relationship & History: ${questionnaire.clientRelationship}` : ''}
${questionnaire?.clientGoals ? `- Client's Known Goals & Needs: ${questionnaire.clientGoals}` : ''}
${questionnaire?.clientBudget ? `- Approximate Annual Income / Investment Budget: ${questionnaire.clientBudget} (${questionnaire.clientBudgetStatus === 'verified' ? 'VERIFIED by client directly' : 'ADVISOR ESTIMATE'})` : ''}
${questionnaire?.clientConcerns ? `- Objections / Expressed Concerns: ${questionnaire.clientConcerns}` : ''}
${questionnaire?.hesitationReasons ? `- Stated Hesitations & Suspected True Reasons: ${questionnaire.hesitationReasons}` : ''}
${questionnaire?.preferredStyle ? `- Client's Preferred Presentation Style: ${questionnaire.preferredStyle}` : ''}
${questionnaire?.emphasisPoints ? `- High Priority Points / Calculations to Emphasize: ${questionnaire.emphasisPoints}` : ''}
${questionnaire?.additionalNotes ? `- Advisor Private Strategy Notes: "${questionnaire.additionalNotes}"` : ''}

CRITICAL RULES & SEBI / IRDAI COMPLIANCE:
1. STRICT CLIENT PRIVACY: NEVER render raw questionnaire questions, advisor secret notes, or "Suspected reasons" text on the client slides. Use them ONLY to smartly tailor the tone, counter objections gently, and frame solutions convincingly.
2. NO ILLEGAL GUARANTEES: Never state guaranteed returns on mutual funds, equities, or market-linked plans. Transparently state assumptions (e.g., "Assumed 12% CAGR equity SIP illustration for 15 years", "Assumed 7% inflation rate").
3. COLORFUL YET CRISP IN BLACK-AND-WHITE PRINT: Ensure all slide metrics, tables, and charts are high contrast, readable, and structured.
4. UNIVERSAL TOPIC INTELLIGENCE: Accurately cover the requested topic — whether SIP, Mutual Funds, Retirement, Term Life, Health Mediclaim, Car/Vehicle Zero-Depreciation insurance, Tax Planning (Old vs New Regime), Home Loans, or Commercial Insurance. Provide accurate Indian market math, terms, and regulatory realities.
5. ADVISOR BRANDING ON FINAL SLIDE: Integrate the Advisor's details: ${advisorProfile?.advisorName || 'Financial Advisor'}, ${advisorProfile?.designation || 'CFP'}, Phone: ${advisorProfile?.phoneNumber || ''}, WhatsApp: ${advisorProfile?.whatsappNumber || ''}, Email: ${advisorProfile?.email || ''}, License/ARN: ${advisorProfile?.professionalDetails || ''}, and compliance disclaimer: "${advisorProfile?.defaultDisclaimer || 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully.'}".

SLIDE STRUCTURE BLUEPRINT (${targetSlideCount} slides):
- Slide 1 (Cover): Inspiring title matching the advisor's request, client objective, and executive summary punchline.
- Slide 2 (The Core Reality & Challenge): Why this matters today, impact of inflation/inaction/risks, 3 crisp bullet points, and 2-3 key metrics.
- Slide 3 (Core Solution / Strategy): Framework breakdown with visual chartData (type: 'bar', 'donut', 'line', or 'milestones' with labels, values, unit, and explanation).
- Slide 4 (Realistic Mathematical Projections): Clear, accurate calculations with transparent assumptions, comparisons or compounding numbers.
${mode === 'detailed' ? `- Slide 5 (Option Comparison Matrix): A structured comparisonTable with headers [Parameter, Option A, Option B] and 3-4 rows showing pros/cons.
- Slide 6 (Risks, Limitations & Prudent Mitigations): Real-world limitations, liquidity, market cycles, and how the advisor mitigates them.
- Slide 7 (Action Roadmap / Step-by-Step): Concrete milestone roadmap (e.g. Month 1 setup, Year 1 review, Milestone checks).` : ''}
${mode === 'personalized' ? `- Slide 5 (Direct Objection Handlers & Personalized FAQ): Respectfully address the client's stated concerns with facts and reassuring perspective.` : ''}
- Slide ${targetSlideCount} (Clear Next Steps & Advisor Contact): Step-by-step action plan, compelling CTA, full advisor credentials, and compliance disclaimer.

You MUST respond with valid JSON matching this exact structure:
{
  "title": "Presentation Main Title",
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "cover",
      "badge": "Short Badge (e.g. Strategic Plan)",
      "title": "Slide Title",
      "subtitle": "Clear Subtitle",
      "keyTakeaway": "1-sentence executive punchline",
      "bulletPoints": [
        "Crisp point 1",
        "Crisp point 2",
        "Crisp point 3"
      ],
      "metrics": [
        { "label": "Target Horizon", "value": "10-15 Yrs", "helper": "Compound cycle" },
        { "label": "Expected Benchmark", "value": "12% CAGR", "helper": "Illustrative basis" }
      ],
      "assumptions": ["Assumed 12% CAGR equity growth for illustrative purposes"]
    }
  ]
}
Each slide should have appropriate properties (metrics, chartData, comparisonTable, risksAndLimitations, assumptions, or callToAction).`;

    const responseText = await generateContentWithFallback(ai, prompt, {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 8192,
    });

    const parsedData = JSON.parse(responseText);

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

  try {
    const ai = getGeminiClient();
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

    const parsedSlide = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'ai_api',
      slide: parsedSlide,
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

// Setup Vite in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  app.use(express.static(path.resolve(process.cwd(), 'public')));

  if (!isProd) {
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

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
