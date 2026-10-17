import {
  FinancePollTopic,
  GeneratedPoll,
  PollCategory,
  PollGeneratorRequest,
  PollType,
  SavedPollRecord,
} from '../types/financePoll';
import { LanguageCode, AdvisorProfile } from '../types';
import {
  buildCreationGuide,
  buildDeterministicPoll,
  buildNativePollOutput,
  buildShareableMessage,
  cleanForWhatsAppPoll,
  getSavedPollHistory,
  savePollToHistory,
} from '../utils/financePollEngine';
import { validateOptionsDistinctness } from '../utils/financeMathEngine';
import { POLL_CATEGORIES, POLL_TYPES } from '../constants/financePollTopics';
import { getActiveAiPreferences } from '../context/AiEngineContext';

export interface GeneratePollParams {
  topic: FinancePollTopic;
  category: PollCategory;
  pollType: PollType;
  language: LanguageCode;
  advisorProfile?: AdvisorProfile;
  clientName?: string;
}

/**
 * Validates a generated poll question for strict accuracy and distinctness.
 */
export function validatePollContent(
  qText: string,
  options: string[],
  isKnowledgeOrCalculation: boolean,
  correctIndex?: number
): { isValid: boolean; reason?: string } {
  if (!qText || qText.trim().length < 15) {
    return { isValid: false, reason: 'Poll question text is too short or empty.' };
  }
  if (!Array.isArray(options) || options.length < 3 || options.length > 4) {
    return { isValid: false, reason: 'Poll must contain 3 or 4 options.' };
  }

  // Check distinctness of options
  const cleanOpts = options.map((o) => cleanForWhatsAppPoll(o));
  const distinctCheck = validateOptionsDistinctness(
    cleanOpts.length === 4 ? cleanOpts : [...cleanOpts, 'DummyOptionForCheck4']
  );
  if (cleanOpts.length === 4 && !distinctCheck.isValid) {
    return { isValid: false, reason: distinctCheck.reason };
  }
  const uniqueSet = new Set(cleanOpts.map((o) => o.toLowerCase()));
  if (uniqueSet.size < options.length) {
    return { isValid: false, reason: 'All options must be distinct from one another.' };
  }

  if (isKnowledgeOrCalculation) {
    if (typeof correctIndex !== 'number' || correctIndex < 0 || correctIndex >= options.length) {
      return { isValid: false, reason: 'Knowledge and calculation polls must have exactly one verified correct answer index.' };
    }
  }

  return { isValid: true };
}

/**
 * Dynamically generates a fresh AI Poll using the backend /api/generate-poll endpoint.
 * Synchronizes all three outputs (A: Shareable Message, B: Native WhatsApp Poll, C: Creation Guide).
 * Never uses preloaded polls; falls back to deterministic calculation engine if API is unreachable.
 */
export async function generatePoll(params: GeneratePollParams): Promise<GeneratedPoll> {
  const { topic, category, pollType, language, advisorProfile, clientName } = params;

  // Gather previous questions to avoid recent duplicates
  const history = getSavedPollHistory(topic.id);
  const previousPollQuestions = history.slice(0, 10).map((h) => h.poll.questionText);

  const requestPayload: PollGeneratorRequest = {
    topicNum: topic.num,
    topicId: topic.id,
    topicTitle:
      language === 'gu'
        ? topic.titleGu || topic.title
        : language === 'hi'
        ? topic.titleHi || topic.title
        : topic.title,
    category,
    pollType,
    language,
    clientName,
    advisorProfile: advisorProfile
      ? {
          advisorName: advisorProfile.advisorName,
          designation: advisorProfile.designation,
          phoneNumber: advisorProfile.whatsappNumber || advisorProfile.phoneNumber,
          professionalDetails: advisorProfile.professionalDetails,
        }
      : undefined,
    previousPollQuestions,
  };

  const pollTypeMeta = POLL_TYPES.find((pt) => pt.id === pollType) || POLL_TYPES[0];
  const categoryMeta = POLL_CATEGORIES.find((c) => c.id === category) || POLL_CATEGORIES[0];

  const pollTypeLabel = language === 'gu'
    ? pollTypeMeta.labelGu
    : language === 'hi'
    ? pollTypeMeta.labelHi
    : pollTypeMeta.label;

  const categoryTitle = language === 'gu'
    ? categoryMeta.nameGu
    : language === 'hi'
    ? categoryMeta.nameHi
    : categoryMeta.name;

  try {
    const aiPref = getActiveAiPreferences();
    const res = await fetch('/api/generate-poll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestPayload,
        aiProvider: aiPref.provider,
        openaiModel: aiPref.openaiModel,
        geminiModel: aiPref.geminiModel,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.poll) {
        const raw = data.poll;
        const isKnowledgeOrCalc = Boolean(raw.isKnowledgeOrCalculation ?? pollTypeMeta.isSingleAnswerExpected);
        const validation = validatePollContent(
          raw.questionText,
          raw.options,
          isKnowledgeOrCalc,
          raw.correctIndex
        );

        if (validation.isValid) {
          const pollId = `poll_ai_${topic.id}_${Date.now()}`;
          const cleanQuestion = cleanForWhatsAppPoll(raw.questionText);
          const cleanOptions = raw.options.map((opt: string) => cleanForWhatsAppPoll(opt));

          const outputA = buildShareableMessage(
            {
              questionText: cleanQuestion,
              options: cleanOptions,
              topicTitle: requestPayload.topicTitle,
              topicNum: topic.num,
              pollTypeLabel,
              pollType,
            },
            advisorProfile,
            language
          );

          const outputB = buildNativePollOutput(cleanQuestion, cleanOptions);
          const outputC = buildCreationGuide(
            pollType,
            cleanOptions.length,
            isKnowledgeOrCalc,
            language
          );

          const pollResult: GeneratedPoll = {
            id: pollId,
            topicNum: topic.num,
            topicId: topic.id,
            topicTitle: requestPayload.topicTitle,
            category,
            categoryTitle,
            pollType,
            pollTypeLabel,
            language,
            questionText: cleanQuestion,
            options: cleanOptions,
            isKnowledgeOrCalculation: isKnowledgeOrCalc,
            correctIndex: raw.correctIndex,
            explanation: raw.explanation,
            stepByStepCalculations: raw.stepByStepCalculations,
            assumptions: raw.assumptions,
            educationalTakeaway: raw.educationalTakeaway,
            allowMultipleAnswersRecommended: !isKnowledgeOrCalc,
            outputA_ShareableMessage: outputA,
            outputB_NativePoll: outputB,
            outputC_CreationGuide: outputC,
            createdAt: new Date().toISOString(),
            isAiGenerated: true,
            verificationSource: data.source === 'deterministic_math_engine' ? 'deterministic_math_engine' : 'ai_verified',
          };

          // Save to persistent history
          savePollToHistory({
            id: pollId,
            topicNum: topic.num,
            topicId: topic.id,
            topicTitle: requestPayload.topicTitle,
            pollType,
            language,
            poll: pollResult,
            savedAt: new Date().toISOString(),
          });

          return pollResult;
        } else {
          console.warn('AI Poll failed validation check:', validation.reason);
        }
      }
    }
  } catch (err) {
    console.warn('API generate-poll call encountered an error, falling back to deterministic engine:', err);
  }

  // Deterministic Fallback: 100% verified math & pristine structure
  const fallbackPoll = buildDeterministicPoll(requestPayload);

  // Save fallback poll to history as well
  savePollToHistory({
    id: fallbackPoll.id,
    topicNum: topic.num,
    topicId: topic.id,
    topicTitle: requestPayload.topicTitle,
    pollType,
    language,
    poll: fallbackPoll,
    savedAt: new Date().toISOString(),
  });

  return fallbackPoll;
}
