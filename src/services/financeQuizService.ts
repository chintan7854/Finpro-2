import {
  QuizTopic,
  QuizQuestion,
  GeneratedQuiz,
  SavedQuizRecord,
} from '../types/financeQuiz';
import { LanguageCode, AdvisorProfile } from '../types';
import {
  THE_50_APPROVED_TOPICS,
  LOCAL_QUESTION_BANK,
  generateUniversalTopicQuestions,
} from '../constants/financeQuizData';
import {
  validateQuestionAccuracy,
  validateOptionsDistinctness,
  buildDeterministicVerifiedQuestion,
} from '../utils/financeMathEngine';

const QUIZ_STORAGE_KEY = 'finadvisor_saved_quiz_records_v1';

/**
 * Retrieves the 5 predefined permanent quizzes for a topic in the selected language.
 */
export function getPredefinedQuizzes(topic: QuizTopic, lang: LanguageCode): QuizQuestion[] {
  const bank = LOCAL_QUESTION_BANK[topic.id];
  if (bank) {
    if (bank[lang] && bank[lang].length >= 5) return bank[lang].slice(0, 5);
    if (lang === 'gu' && bank.gu && bank.gu.length >= 5) return bank.gu.slice(0, 5);
    if (lang === 'hi' && bank.hi && bank.hi.length >= 5) return bank.hi.slice(0, 5);
    if (bank.en && bank.en.length >= 5) return bank.en.slice(0, 5);
  }
  return generateUniversalTopicQuestions(topic, lang).slice(0, 5);
}

/**
 * Loads all saved AI-generated quizzes for a given topic from persistent localStorage
 */
export function getSavedQuizHistory(topicId?: string): SavedQuizRecord[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return [];
    const allRecords: SavedQuizRecord[] = JSON.parse(raw);
    if (!Array.isArray(allRecords)) return [];
    if (topicId) {
      return allRecords.filter((r) => r.topicId === topicId);
    }
    return allRecords;
  } catch (err) {
    console.warn('Failed to load quiz history from localStorage', err);
    return [];
  }
}

/**
 * Saves a new AI-generated quiz record without overwriting previous ones
 */
export function saveQuizToHistory(record: SavedQuizRecord): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    const history = getSavedQuizHistory();
    // Prepend new record
    const updated = [record, ...history.filter((r) => r.id !== record.id)];
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.warn('Failed to save quiz record to localStorage', err);
  }
}

/**
 * Mathematical & Schema Validation Engine enforcing the 9 Strict Accuracy Rules:
 * 1. Exactly ONE unambiguously correct answer (A, B, C, D).
 * 2. All 4 options are distinct and mutually exclusive (no numerical/mathematical duplicates).
 * 3. Numerical questions contain explicit assumptions (time horizon, compounding, rounding precision).
 * 4. Step-by-step calculations and explanation directly lead to the verified correct option.
 */
export function validateQuizQuestion(q: QuizQuestion): { isValid: boolean; reason?: string } {
  if (!q.questionText || q.questionText.trim().length < 15) {
    return { isValid: false, reason: 'Question text is too short or empty.' };
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return { isValid: false, reason: 'Must contain exactly 4 distinct options.' };
  }
  // Check for distinctness and numerical equivalence
  const optValidation = validateOptionsDistinctness(q.options);
  if (!optValidation.isValid) {
    return { isValid: false, reason: optValidation.reason };
  }
  if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex > 3) {
    return { isValid: false, reason: 'Invalid correct answer index (must be 0, 1, 2, or 3).' };
  }
  if (!q.explanation || q.explanation.trim().length < 20) {
    return { isValid: false, reason: 'Explanation is missing or insufficient.' };
  }

  // Strict accuracy rules check
  const accuracyResult = validateQuestionAccuracy(q);
  if (!accuracyResult.isValid) {
    return { isValid: false, reason: accuracyResult.errors.join('; ') };
  }

  return { isValid: true };
}

export interface GenerateNewAiQuizRequest {
  topic: QuizTopic;
  language: LanguageCode;
  advisorProfile?: AdvisorProfile;
  clientName?: string;
}

/**
 * Dynamically generates a genuinely NEW calculation-based AI quiz for a topic,
 * verifying math, checking duplicate history, and persisting immediately.
 * Enforces deterministic financial mathematics whenever calculation models are required.
 */
export async function generateNewAiQuiz(
  request: GenerateNewAiQuizRequest
): Promise<QuizQuestion> {
  const { topic, language, advisorProfile, clientName } = request;

  // 1. Gather all existing question texts for this topic to avoid duplication
  const predefined = getPredefinedQuizzes(topic, language);
  const saved = getSavedQuizHistory(topic.id);
  const previousQuestions = [
    ...predefined.map((p) => p.questionText),
    ...saved.map((s) => s.question.questionText),
  ];

  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          topicTitle:
            language === 'gu'
              ? topic.titleGu || topic.title
              : language === 'hi'
              ? topic.titleHi || topic.title
              : topic.title,
          category: topic.category,
          difficulty: 'advanced',
          questionCount: 1,
          language,
          clientName,
          advisorProfile: advisorProfile
            ? {
                advisorName: advisorProfile.advisorName,
                designation: advisorProfile.designation,
                phoneNumber: advisorProfile.phoneNumber,
                professionalDetails: advisorProfile.professionalDetails,
              }
            : undefined,
          previousQuestions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.questions && data.data.questions.length > 0) {
          const rawQ = data.data.questions[0];

          // Strict calculation and option validation
          const validation = validateQuizQuestion(rawQ);
          if (validation.isValid) {
            const uniqueId = `ai_quiz_${topic.id}_${Date.now()}`;
            const newQuestion: QuizQuestion = {
              id: uniqueId,
              uniqueQuizId: uniqueId,
              questionTitle: rawQ.questionTitle || `${topic.title} · Advanced Case`,
              questionText: rawQ.questionText,
              options: [rawQ.options[0], rawQ.options[1], rawQ.options[2], rawQ.options[3]],
              correctIndex: rawQ.correctIndex,
              explanation: rawQ.explanation,
              stepByStepCalculations: Array.isArray(rawQ.stepByStepCalculations) && rawQ.stepByStepCalculations.length > 0
                ? rawQ.stepByStepCalculations
                : [rawQ.explanation],
              financialTakeaway: rawQ.financialTakeaway || rawQ.ruleOfThumb || 'Disciplined compounding and regular portfolio audits build enduring wealth.',
              disclaimer: rawQ.disclaimer || 'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Projections are estimates and not guaranteed.',
              commonTrap: rawQ.commonTrap,
              ruleOfThumb: rawQ.ruleOfThumb,
              advisorTip: rawQ.advisorTip,
              isAiGenerated: true,
              generatedAt: new Date().toISOString(),
            };

            // Save to persistent storage immediately
            const record: SavedQuizRecord = {
              id: uniqueId,
              topicId: topic.id,
              topicTitle:
                language === 'gu'
                  ? topic.titleGu || topic.title
                  : language === 'hi'
                  ? topic.titleHi || topic.title
                  : topic.title,
              category: topic.category,
              language,
              difficulty: 'advanced',
              question: newQuestion,
              savedAt: new Date().toISOString(),
            };
            saveQuizToHistory(record);

            return newQuestion;
          } else {
            console.warn(`Attempt ${attempt}: Question failed strict accuracy validation (${validation.reason}). Retrying...`);
          }
        }
      }
    } catch (err) {
      console.warn(`AI generation attempt ${attempt} failed:`, err);
    }
  }

  // Deterministic Fallback: Generate an independently solved, mathematically verified question
  // with exact deterministic formulas, explicit assumptions, and verified distractors.
  const isGu = language === 'gu';
  const isHi = language === 'hi';
  const titleStr = isGu ? (topic.titleGu || topic.title) : isHi ? (topic.titleHi || topic.title) : topic.title;

  const deterministicQ = buildDeterministicVerifiedQuestion({
    topicId: topic.id,
    topicTitle: titleStr,
    category: topic.category,
    lang: language,
    clientName,
    seed: Date.now(),
  });

  const record: SavedQuizRecord = {
    id: deterministicQ.id,
    topicId: topic.id,
    topicTitle: titleStr,
    category: topic.category,
    language,
    difficulty: 'advanced',
    question: deterministicQ,
    savedAt: new Date().toISOString(),
  };
  saveQuizToHistory(record);

  return deterministicQ;
}

/**
 * WhatsApp-ready QUESTION TEXT (NEVER includes the answer)
 */
export function buildSeparateQuestionText(
  question: QuizQuestion,
  topicTitle: string,
  topicNum: number,
  advisor: AdvisorProfile,
  language: LanguageCode = 'en'
): string {
  const isGu = language === 'gu';
  const isHi = language === 'hi';

  const header = isGu
    ? `🎯 *ફાયનાન્સ ક્વિઝ ચેલેન્જ — વિષય #${topicNum}: ${topicTitle}*`
    : isHi
    ? `🎯 *फाइनेंस क्विज चैलेंज — विषय #${topicNum}: ${topicTitle}*`
    : `🎯 *FINANCE QUIZ CHALLENGE — TOPIC #${topicNum}: ${topicTitle}*`;

  const qTitle = question.questionTitle ? `\n📌 *${question.questionTitle}*\n` : '\n';

  const qBody = `❓ *સવાલ / Question:*\n${question.questionText}\n\n` +
    `*વિકલ્પો / Options:*\n` +
    `🔹 A) ${question.options[0]}\n` +
    `🔹 B) ${question.options[1]}\n` +
    `🔹 C) ${question.options[2]}\n` +
    `🔹 D) ${question.options[3]}\n\n` +
    (isGu
      ? `💬 *સાચો જવાબ શું છે? મને તમારા જવાબ સાથે રિપ્લાય કરો!*`
      : isHi
      ? `💬 *सही उत्तर क्या है? अपना जवाब लिखकर मुझे रिप्लाई करें!*`
      : `💬 *What is your answer? Reply back with your choice!*`);

  const footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *${advisor.advisorName}*\n` +
    `💼 ${advisor.designation}\n` +
    `📞 Phone / WhatsApp: ${advisor.phoneNumber}\n` +
    `${advisor.professionalDetails ? `📜 ${advisor.professionalDetails}\n` : ''}` +
    `_FinAdvisor Pro Financial Literacy Series_`;

  return `${header}${qTitle}${qBody}${footer}`;
}

/**
 * WhatsApp-ready ANSWER TEXT (Includes verified calculations & rationale)
 */
export function buildSeparateAnswerText(
  question: QuizQuestion,
  topicTitle: string,
  topicNum: number,
  advisor: AdvisorProfile,
  language: LanguageCode = 'en'
): string {
  const isGu = language === 'gu';
  const isHi = language === 'hi';
  const letters = ['A', 'B', 'C', 'D'];
  const correctLetter = letters[question.correctIndex];
  const correctText = question.options[question.correctIndex];

  const header = isGu
    ? `✅ *સત્તાવાર સાચો જવાબ અને વિગતવાર ગણતરી*\n*વિષય #${topicNum}: ${topicTitle}*`
    : isHi
    ? `✅ *आधिकारिक सही उत्तर और विस्तृत कैलकुलेशन*\n*विषय #${topicNum}: ${topicTitle}*`
    : `✅ *OFFICIAL ANSWER & DETAILED RATIONALE*\n*TOPIC #${topicNum}: ${topicTitle}*`;

  const ansBox = `\n\n🏆 *સાચો જવાબ / Correct Answer:* \n*Option ${correctLetter}: ${correctText}*\n`;

  let calcSection = '';
  if (question.stepByStepCalculations && question.stepByStepCalculations.length > 0) {
    calcSection = `\n📐 *ગણતરીના સ્ટેપ્સ / Step-by-Step Calculations:*\n` +
      question.stepByStepCalculations.map((step, idx) => `${idx + 1}. ${step}`).join('\n') + '\n';
  }

  const expSection = `\n💡 *વિગતવાર સમજૂતી / Rationale:*\n${question.explanation}\n`;

  const takeaway = question.financialTakeaway || question.ruleOfThumb
    ? `\n⭐ *મુખ્ય નાણાકીય શિસ્ત / Key Takeaway:*\n${question.financialTakeaway || question.ruleOfThumb}\n`
    : '';

  const disclaimer = `\n⚠️ _${question.disclaimer || 'Mutual fund investments are subject to market risks, read all scheme related documents carefully. Projections are estimates and not guaranteed.'}_`;

  const footer = `\n\n━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *${advisor.advisorName}*\n` +
    `💼 ${advisor.designation}\n` +
    `📞 Phone / WhatsApp: ${advisor.phoneNumber}`;

  return `${header}${ansBox}${calcSection}${expSection}${takeaway}${disclaimer}${footer}`;
}
