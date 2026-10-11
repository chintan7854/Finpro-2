import React, { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  generateClientQaAnswer,
  ClientQaResponse,
  isQuestionFinancial,
} from '../services/clientQaGenerator';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Share2,
  AlertTriangle,
  Send,
  HelpCircle,
  User,
  ShieldCheck,
  RefreshCw,
  Phone,
  BookmarkCheck,
  Edit3,
} from 'lucide-react';
import { LanguageCode } from '../types';

export const ClientQaView: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useI18n();
  const { profile, consumeCredit } = useAdvisor();

  const [customerName, setCustomerName] = useState<string>('Amit Patel');
  const [customerQuestion, setCustomerQuestion] = useState<string>('How to get higher wealth and returns through disciplined investing?');
  const [qaLanguage, setQaLanguage] = useState<LanguageCode>(language);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [qaResult, setQaResult] = useState<ClientQaResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableText, setEditableText] = useState<string>('');

  // Sample quick question presets
  const COMMON_PRESETS = [
    {
      label: 'Higher Returns & SIP Strategy',
      name: 'Amit Patel',
      question: 'How to get higher returns in mutual funds? Where should I invest?',
    },
    {
      label: 'Child Higher Education Planning',
      name: 'Bhavesh Mehta',
      question: 'What is the best way to plan for my child’s future higher education expenses?',
    },
    {
      label: 'Retirement Guaranteed Pension',
      name: 'Suresh Nair',
      question: 'How can I generate a guaranteed monthly income of ₹50,000 post-retirement using SWP?',
    },
    {
      label: 'Home Loan Prepayment vs SIP',
      name: 'Jayesh Shah',
      question: 'Is it better to prepay my ongoing home loan or continue my mutual fund SIPs?',
    },
    {
      label: 'Should I pause SIP during crash?',
      name: 'Rajesh Sharma',
      question: 'The market is correcting down recently. Should I pause my monthly SIP for a few months?',
    },
  ];

  const handleSelectPreset = (preset: typeof COMMON_PRESETS[0]) => {
    setCustomerName(preset.name);
    setCustomerQuestion(preset.question);
    setErrorMsg(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Strict financial check
    const check = isQuestionFinancial(customerQuestion);
    if (!check.isFinancial) {
      setErrorMsg(
        check.reason ||
          'આ પ્રશ્ન નાણાકીય આયોજન સાથે સંબંધિત નથી. કૃપા કરીને રોકાણ, વીમા કે નાણાકીય લક્ષ્યાંકોનો પ્રશ્ન પૂછો.'
      );
      setQaResult(null);
      return;
    }

    setIsGenerating(true);
    try {
      consumeCredit();
      const response = await generateClientQaAnswer({
        customerName: customerName.trim(),
        customerQuestion: customerQuestion.trim(),
        language: qaLanguage,
        advisorProfile: profile,
      });

      if (!response.isFinancial) {
        setErrorMsg(
          response.rejectionReasonGu ||
            response.rejectionReason ||
            'આ પ્રશ્ન નાણાકીય આયોજન સાથે સંબંધિત નથી.'
        );
        setQaResult(null);
      } else {
        setQaResult(response);
        setEditableText(response.whatsappReadyText || response.answerText);
        setIsEditing(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'જવાબ બનાવવામાં ક્ષતિ આવી. ફરી પ્રયત્ન કરો.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editableText : qaResult?.whatsappReadyText || qaResult?.answerText || '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const textToSend = isEditing ? editableText : qaResult?.whatsappReadyText || qaResult?.answerText || '';
    if (!textToSend) return;

    const encoded = encodeURIComponent(textToSend);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Page Title */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Client Q&A Advisory Responder
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  WhatsApp Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                ગ્રાહકના પ્રશ્નનો વ્યાવસાયિક જવાબ તરત જ બનાવો અને એક ક્લિકમાં WhatsApp પર મોકલો.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form & Response Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>ગ્રાહકનો પ્રશ્ન દાખલ કરો</span>
              </h2>
              {/* Language Selector */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] text-slate-400 font-semibold">ભાષા:</span>
                <select
                  value={qaLanguage}
                  onChange={(e) => setQaLanguage(e.target.value as LanguageCode)}
                  className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:ring-1 focus:ring-emerald-500"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeLabel} ({l.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                લોકપ્રિય ગ્રાહક પ્રશ્નો (Quick Click):
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {COMMON_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-[11px] font-semibold text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>કસ્ટમરનું નામ (Customer Name) *</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="દા.ત. અમિતભાઈ, સુરેશભાઈ, પ્રિયાબેન"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Customer Question */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>કસ્ટમરે પૂછેલો પ્રશ્ન (Customer Question) *</span>
                </label>
                <textarea
                  rows={3}
                  value={customerQuestion}
                  onChange={(e) => setCustomerQuestion(e.target.value)}
                  placeholder="દા.ત. વધુ રિટર્ન માટે શું કરવું? અથવા બાળકો મોટા થાય તો તેમના ભવિષ્યના ખર્ચા માટે શું પ્લાનિંગ કરવું?"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 ફક્ત નાણાકીય, રોકાણ, વીમો, ટેક્સ કે ભવિષ્યના લક્ષ્યાંકોને લગતા પ્રશ્નો જ માન્ય રહેશે.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">પ્રશ્ન સ્વીકાર્ય નથી: </span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating || !customerQuestion.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'AI દ્વારા જવાબ તૈયાર થઈ રહ્યો છે...' : 'ગ્રાહક માટે જવાબ જનરેટ કરો'}
                </span>
              </button>
            </form>
          </div>

          {/* Advisor Signature Snapshot */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-slate-900 font-bold">
              <span>જવાબના અંતે જોડાશે (Advisor Signature):</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                પ્રોફાઇલમાંથી સ્વચાલિત
              </span>
            </div>
            <p className="font-semibold text-slate-800">{profile.advisorName}</p>
            <p className="text-slate-500">{profile.designation}</p>
            <p className="text-slate-600">📱 M: {profile.phoneNumber}</p>
            {profile.professionalDetails && (
              <p className="text-[11px] text-slate-400">{profile.professionalDetails}</p>
            )}
          </div>
        </div>

        {/* Right Preview: Generated WhatsApp Bubble */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp જવાબ પૂર્વાવલોકન (Response Preview)</span>
              </h2>
              {qaResult && (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center space-x-1"
                    title="Edit response before copying"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Done Editing' : 'Edit'}</span>
                  </button>
                </div>
              )}
            </div>

            {!qaResult ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">કોઈ પ્રશ્ન દાખલ કરો</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    ડાબી બાજુ તમારા ગ્રાહકનું નામ અને તેમનો પ્રશ્ન દાખલ કરીને બટન દબાવો. AI ગ્રાહકના નામે વ્યક્તિગત સલાહ સાથે તૈયાર જવાબ આપશે.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* WhatsApp Chat Bubble */}
                <div className="p-4 rounded-2xl bg-[#e7ffdb] border border-[#b8f59f] text-slate-900 text-xs sm:text-sm font-medium shadow-2xs space-y-3 font-sans">
                  {isEditing ? (
                    <textarea
                      rows={12}
                      value={editableText}
                      onChange={(e) => setEditableText(e.target.value)}
                      className="w-full p-3 rounded-xl border border-emerald-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {qaResult.whatsappReadyText || qaResult.answerText}
                    </div>
                  )}

                  <div className="text-right text-[10px] text-emerald-800 font-semibold pt-1">
                    ✓✓ Ready to send on WhatsApp
                  </div>
                </div>

                {/* Key Points Summary Pill List */}
                {qaResult.summaryBullets && qaResult.summaryBullets.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      મુખ્ય સારાંશ (Advisory Highlights):
                    </span>
                    {qaResult.summaryBullets.map((b, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons: Copy & WhatsApp Send */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>કોપી થઈ ગયું! (Copied)</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>કોપી કરો (Copy Text)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>WhatsApp પર મોકલો</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
