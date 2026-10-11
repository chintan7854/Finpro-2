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

    const prompt = `
You are a senior Indian financial storyteller, certified financial planner (CFP), and behavioral finance educator.
Generate an engaging, relatable, viral storytelling post for an Indian financial advisor to broadcast on WhatsApp, LinkedIn, and social groups.

Topic: ${topicTitle || topicId}
Narrative Angle: ${angleTitle || angleId}
Target Persona: ${personaTitle || personaId}
Length: ${lengthId || 'standard'}
Target Language: "${language || 'gu'}"
MANDATORY LANGUAGE SPECIFICATION:
- If Target Language is "gu" (Gujarati), compose ALL text—title, hook, paragraphs, takeaways, forward appeal, and closing—strictly and fluently in authentic Gujarati script (ગુજરાતી ભાષા).
- If Target Language is "hi" (Hindi), compose entirely in natural Hindi (हिन्दी).
- If Target Language is "en" (English), compose in crisp, engaging English.

Advisor Details:
Advisor Name: ${advisorProfile?.advisorName || 'Financial Advisor'}
Designation: ${advisorProfile?.designation || 'Certified Financial Planner'}
Credentials / ARN: ${advisorProfile?.professionalDetails || ''}
Phone: ${advisorProfile?.phoneNumber || '+91 98765 43210'}
Call to Action Style: ${ctaTitle || ctaStrategyId}

Seed: ${entropySeed}
Write authentic, relatable characters (like Ramesh & Suresh, Sharmaji & Patelbhai, young techies, middle-class parents). Use realistic Indian financial figures, compounding math, and an emotional or eye-opening perspective.

You MUST return ONLY valid JSON matching this schema:
{
  "title": "Scroll-stopping title with 1 emoji",
  "hook": "1-2 sentence compelling hook that stops the scroll",
  "storyParagraphs": [
    "Engaging narrative paragraph 1 introducing the characters and their choice",
    "Paragraph 2 with the mathematical reality and contrast years later",
    "Paragraph 3 with the underlying financial wisdom and life lesson"
  ],
  "takeaways": [
    "Actionable financial lesson 1 with concrete rule of thumb",
    "Actionable financial lesson 2",
    "Actionable financial lesson 3"
  ],
  "forwardAppeal": "One punchy sentence encouraging the reader to forward this to friends or family",
  "ctaSignature": "Closing advisory call to action with advisor contact"
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
