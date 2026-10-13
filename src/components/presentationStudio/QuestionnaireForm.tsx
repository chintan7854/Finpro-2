import React, { useState } from 'react';
import { ClientQuestionnaire, PresentationMode } from '../../types/presentationStudio';
import {
  QUESTION_RELATIONSHIPS,
  QUESTION_GOALS,
  QUESTION_BUDGETS,
  QUESTION_CONCERNS,
  QUESTION_HESITATIONS,
  QUESTION_STYLES,
  QUESTION_EMPHASIS,
} from '../../constants/presentationQuestionnaire';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  Sparkles,
  Zap,
  BookOpen,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface QuestionnaireFormProps {
  questionnaire: ClientQuestionnaire;
  onChange: (updated: ClientQuestionnaire) => void;
  presentationMode: PresentationMode;
  onModeChange: (mode: PresentationMode) => void;
  language?: string;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaire,
  onChange,
  presentationMode,
  onModeChange,
  language = 'en',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateField = (field: keyof ClientQuestionnaire, value: any) => {
    onChange({
      ...questionnaire,
      [field]: value,
    });
  };

  const filledCount = [
    questionnaire.clientRelationship,
    questionnaire.clientGoals,
    questionnaire.clientBudget,
    questionnaire.clientConcerns,
    questionnaire.hesitationReasons,
    questionnaire.preferredStyle,
    questionnaire.emphasisPoints,
    questionnaire.additionalNotes,
  ].filter((v) => Boolean(v && v.trim())).length;

  const handleClearAll = () => {
    onChange({
      topicPrompt: questionnaire.topicPrompt,
      clientName: questionnaire.clientName,
      clientBudgetStatus: 'estimate',
      clientRelationship: '',
      clientGoals: '',
      clientBudget: '',
      clientConcerns: '',
      hesitationReasons: '',
      preferredStyle: '',
      emphasisPoints: '',
      additionalNotes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Presentation Mode Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Presentation Depth & Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the presentation length and depth suitable for your meeting
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            {presentationMode === 'quick'
              ? '⚡ 3-4 Impact Slides'
              : presentationMode === 'detailed'
              ? '📊 6-8 Comprehensive Slides'
              : '🎯 5-6 Tailored Client Slides'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Quick Mode */}
          <button
            type="button"
            onClick={() => onModeChange('quick')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              presentationMode === 'quick'
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Pitch
              </span>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-md">
                3-4 Slides
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fast, high-impact deck focusing on the core problem, single bold calculation, and direct call to action.
            </p>
          </button>

          {/* Detailed Mode */}
          <button
            type="button"
            onClick={() => onModeChange('detailed')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              presentationMode === 'detailed'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Detailed Advisory
              </span>
              <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md">
                6-8 Slides
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Executive multi-slide deck with deep concept breakdown, visual charts, comparison table, risks & roadmap.
            </p>
          </button>

          {/* Personalized Mode */}
          <button
            type="button"
            onClick={() => onModeChange('personalized')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              presentationMode === 'personalized'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Personalized Client
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                5-6 Slides
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tailored specifically to the client's objections, budget numbers, family goals, and custom priorities.
            </p>
          </button>
        </div>
      </div>

      {/* Workflow & Report Type Selector (Master Prompt Section 2) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {language === 'gu'
                ? 'રિપોર્ટ વર્કફ્લો ફોર્મેટ (Report Output Workflow)'
                : language === 'hi'
                ? 'रिपोर्ट वर्कफ़्लो प्रारूप (Report Output Workflow)'
                : 'Report Output Workflow'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'gu'
                ? 'ગ્રાહક-તૈયાર નાણાકીય પ્રોડક્ટ રિપોર્ટ ફક્ત PDF માં અથવા સ્લાઇડ ડેક'
                : language === 'hi'
                ? 'क्लाइंट-तैयार वित्तीय उत्पाद रिपोर्ट केवल PDF में या स्लाइड डेक'
                : 'Choose official Client PDF Report or interactive slide deck'}
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {(questionnaire.workflowType || 'client_report_pdf') === 'client_report_pdf'
              ? (language === 'gu' ? '📄 ક્લાયન્ટ રિપોર્ટ (PDF Only)' : '📄 Client Report (PDF Only)')
              : (language === 'gu' ? '📊 પ્રેઝન્ટેશન ડેક (PPTX / Slides)' : '📊 Slide Deck (PPTX & Slides)')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateField('workflowType', 'client_report_pdf')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              (questionnaire.workflowType || 'client_report_pdf') === 'client_report_pdf'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                {language === 'gu'
                  ? 'ગ્રાહક પ્રોડક્ટ રિપોર્ટ (PDF Deliverable)'
                  : language === 'hi'
                  ? 'क्लाइंट प्रोडक्ट रिपोर्ट (PDF Deliverable)'
                  : 'Client Product Report (PDF Deliverable)'}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                Master Prompt
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'gu'
                ? 'ગ્રાહક માટે સચોટ, વ્યવસાયિક નાણાકીય પ્રોડક્ટ રિપોર્ટ. ફાઈનલ આઉટપુટ ફક્ત PDF ફોર્મેટમાં તૈયાર થાય છે.'
                : language === 'hi'
                ? 'क्लाइंट के लिए सटीक, पेशेवर वित्तीय उत्पाद रिपोर्ट। अंतिम परिणाम केवल PDF प्रारूप में तैयार होता है।'
                : 'Structured, educational financial product advisory report delivering high-resolution client-ready PDF.'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateField('workflowType', 'standard_deck')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              questionnaire.workflowType === 'standard_deck'
                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {language === 'gu'
                  ? 'ઇન્ટરેક્ટિવ સ્લાઇડ ડેક (PPTX / Slides)'
                  : language === 'hi'
                  ? 'इंटरएक्टिव स्लाइड डेक (PPTX / Slides)'
                  : 'Interactive Slide Deck (PPTX & Slides)'}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Standard Deck
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'gu'
                ? 'મીટિંગ પ્રેઝન્ટેશન માટે સ્લાઇડ ડેક, પાવરપોઇન્ટ (.pptx) એક્સપોર્ટ અને લાઇવ પ્રસ્તુતિ મોડ સાથે.'
                : language === 'hi'
                ? 'मीटिंग प्रेजेंटेशन के लिए स्लाइड डेक, पावरपॉइंट (.pptx) एक्सपोर्ट और लाइव प्रेजेंटर मोड सहित।'
                : 'Meeting presentation slides supporting PowerPoint (.pptx) download, slide presenter mode & cards.'}
            </p>
          </button>
        </div>
      </div>

      {/* Historical Best-Case / Maximum Potential Benefit Scenario (Master Prompt Section 5) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {language === 'gu'
                ? 'ઐતિહાસિક શ્રેષ્ઠ વળતર / મહત્તમ સંભવિત લાભ દૃશ્ય (Historical Best-Case Scenario)'
                : language === 'hi'
                ? 'ऐतिहासिक सर्वश्रेष्ठ / अधिकतम संभावित लाभ परिदृश्य (Historical Best-Case Scenario)'
                : 'Historical Best-Case / Maximum Potential Benefit Scenario'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'gu'
                ? 'પસંદ કરેલા પ્રોડક્ટ માટે ચોક્કસ ઐતિહાસિક અથવા કરાર આધારિત ગણતરી પસંદ કરો (ઓપ્શનલ)'
                : language === 'hi'
                ? 'चयनित उत्पाद के लिए विशिष्ट ऐतिहासिक या संविदात्मक गणना चुनें (वैकल्पिक)'
                : 'Optional analysis tailored to product category, separating past cycles & contractual benefits'}
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            {language === 'gu' ? 'ચકાસાયેલ ડેટા અને ડિસ્ક્લેમર' : 'Verified Data & Disclaimers'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Choice A: Standard Presentation */}
          <button
            type="button"
            onClick={() => updateField('historicalScenarioMode', 'standard')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              (questionnaire.historicalScenarioMode || 'standard') === 'standard'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'gu' ? 'A. પ્રમાણભૂત રજૂઆત' : language === 'hi' ? 'A. मानक प्रस्तुति' : 'A. Standard Presentation'}
              </span>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                Default
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'gu'
                ? 'વાસ્તવિક પાયાની ગણતરીઓ (SIP: 12%, વીમો: HLV સુરક્ષા, લોન: પ્રમાણભૂત EMI).'
                : language === 'hi'
                ? 'यथार्थवादी आधारभूत गणनाएँ (SIP: 12%, बीमा: HLV सुरक्षा, ऋण: मानक EMI)।'
                : 'Realistic baseline calculations and standard suitability illustrations.'}
            </p>
          </button>

          {/* Choice B: Historical Best-Case Analysis */}
          <button
            type="button"
            onClick={() => updateField('historicalScenarioMode', 'historical_best_case')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              questionnaire.historicalScenarioMode === 'historical_best_case'
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'gu' ? 'B. ઐતિહાસિક શ્રેષ્ઠ વિશ્લેષણ' : language === 'hi' ? 'B. ऐतिहासिक सर्वश्रेष्ठ विश्लेषण' : 'B. Historical Best-Case'}
              </span>
              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded">
                Historical
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'gu'
                ? 'ચકાસાયેલ ઐતિહાસિક ટોચના બજાર ચક્ર (દા.ત. 15-વર્ષ SIP બેસ્ટ 17.8% CAGR) સાથે કડક ડિસ્ક્લેમર.'
                : language === 'hi'
                ? 'सत्यापित ऐतिहासिक शीर्ष बाजार चक्र (उदा. 15-वर्ष SIP सर्वश्रेष्ठ 17.8% CAGR) सख्त डिस्क्लेमर के साथ।'
                : 'Verified past market peak cycles (e.g. 15-yr rolling SIP @ 17.8%) with strict non-guarantee disclosures.'}
            </p>
          </button>

          {/* Choice C: Historical Best-Case Plus Maximum Contractual Benefit */}
          <button
            type="button"
            onClick={() => updateField('historicalScenarioMode', 'historical_and_contractual')}
            className={`p-3.5 rounded-xl text-left border transition-all ${
              questionnaire.historicalScenarioMode === 'historical_and_contractual'
                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'gu' ? 'C. ઐતિહાસિક + કરાર આધારિત લાભ' : language === 'hi' ? 'C. ऐतिहासिक + संविदात्मक लाभ' : 'C. Historical + Contractual'}
              </span>
              <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.5 rounded">
                Comprehensive
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'gu'
                ? 'ઐતિહાસિક વિશ્લેષણ ઉપરાંત ગેરંટીડ કરાર લાભો (વીમા સમ એશ્યોર્ડ, IRDAI બોનસ) ની અલગ સ્પષ્ટતા.'
                : language === 'hi'
                ? 'ऐतिहासिक विश्लेषण के अलावा गारंटीशुदा संविदात्मक लाभ (बीमा सम एश्योर्ड, IRDAI बोनस) का स्पष्ट पृथक्करण।'
                : 'Full historical analysis plus contractual guaranteed benefits strictly separated from non-guaranteed bonuses.'}
            </p>
          </button>
        </div>
      </div>

      {/* Optional General Questionnaire Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Optional General Questionnaire
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {filledCount > 0 ? `${filledCount}/8 Answered` : 'Optional (8 Questions)'}
                </span>
                {filledCount > 0 && (
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Insights
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every question is 100% optional. Skip all and generate directly, or provide quick client context to personalize.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hidden sm:inline">
              {isOpen ? 'Collapse Questions' : 'Customize Client Context'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>
                  Select predefined answers with 1 click or type custom answers in any box below.
                </span>
              </div>
              {filledCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear All Answers
                </button>
              )}
            </div>

            {/* Question 1: How do you know the client, and for how long? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                1. How do you know the client, and for how long? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_RELATIONSHIPS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('clientRelationship', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.clientRelationship === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.clientRelationship || ''}
                onChange={(e) => updateField('clientRelationship', e.target.value)}
                placeholder="Or type custom relationship (e.g., Met 3 years ago at Rotary club; existing tax client)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 2: What are the client's known needs, goals, and priorities? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. What are the client's known needs, goals, and priorities? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_GOALS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('clientGoals', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.clientGoals === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.clientGoals || ''}
                onChange={(e) => updateField('clientGoals', e.target.value)}
                placeholder="Or type custom goals (e.g., Daughter's US MS degree in 2030 + buying 3BHK flat in Ahmedabad)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 3: What is the client's approximate annual income or investment budget, if known? */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  3. Approximate annual income or investment budget, if known? (Optional)
                </label>
                {/* Verified vs Estimated Badge Selector */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => updateField('clientBudgetStatus', 'verified')}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                      questionnaire.clientBudgetStatus === 'verified'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ✓ Verified by Client
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('clientBudgetStatus', 'estimate')}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all ${
                      questionnaire.clientBudgetStatus !== 'verified'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    ≈ Advisor Estimate
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_BUDGETS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('clientBudget', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.clientBudget === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.clientBudget || ''}
                onChange={(e) => updateField('clientBudget', e.target.value)}
                placeholder="Or type custom budget (e.g., Annual income ~₹22 Lakhs; can commit ₹40,000/month for investments)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                Status:{' '}
                {questionnaire.clientBudgetStatus === 'verified'
                  ? 'Client-verified figure (Presentation will treat this as an actual target)'
                  : 'Advisor estimate (Presentation will present this as an illustrative recommendation)'}
              </p>
            </div>

            {/* Question 4: What concerns or objections has the client expressed? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                4. What concerns or objections has the client expressed? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_CONCERNS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('clientConcerns', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.clientConcerns === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.clientConcerns || ''}
                onChange={(e) => updateField('clientConcerns', e.target.value)}
                placeholder="Or type custom objections (e.g., Fears market correction; lost money in 2020 in speculative penny stock)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 5: If the client hesitates or declines, what reasons has the client given, and what other reasons do you suspect? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                5. If the client hesitates or declines, what reasons has the client given, and what other reasons do you suspect? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_HESITATIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('hesitationReasons', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.hesitationReasons === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.hesitationReasons || ''}
                onChange={(e) => updateField('hesitationReasons', e.target.value)}
                placeholder="Or type stated vs suspected reasons (e.g., Stated: 'No time'; Suspected: Doesn't understand the difference between term & endowment)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 6: What presentation style might the client prefer? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                6. What presentation style might the client prefer? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_STYLES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('preferredStyle', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.preferredStyle === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.preferredStyle || ''}
                onChange={(e) => updateField('preferredStyle', e.target.value)}
                placeholder="Or type preferred style (e.g., Simple visuals, avoid English technical terms, use relatable Gujarati/Hindi analogies)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 7: Which points, examples, comparisons, or calculations deserve more emphasis? */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                7. Which points, examples, comparisons, or calculations deserve more emphasis? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUESTION_EMPHASIS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('emphasisPoints', opt.value)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      questionnaire.emphasisPoints === opt.value
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {language === 'gu' && opt.labelGu ? opt.labelGu : language === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={questionnaire.emphasisPoints || ''}
                onChange={(e) => updateField('emphasisPoints', e.target.value)}
                placeholder="Or type custom emphasis (e.g., Cost of delay in starting SIP, ₹1 Cr hospital bill without Super Top-up, Zero Dep bumper repair)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Question 8: Any additional instructions or notes? (Strictly Private) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  8. Any additional instructions or notes? (Optional)
                </label>
                <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
                  🔒 Strictly Private Notes
                </span>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300/80">
                These notes guide the AI presentation engine but are <strong>never shown to the client</strong> on any slide.
              </p>
              <textarea
                rows={3}
                value={questionnaire.additionalNotes || questionnaire.advisorPrivateNotes || ''}
                onChange={(e) => {
                  updateField('additionalNotes', e.target.value);
                  updateField('advisorPrivateNotes', e.target.value);
                }}
                placeholder="Private advisor observations (e.g., Client is conservative, hesitant to take risk without wife's approval; highlight that capital is liquid)..."
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
