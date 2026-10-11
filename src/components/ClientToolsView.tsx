import React from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  Briefcase,
  Share2,
  PieChart,
  ShieldAlert,
  Zap,
  CheckCircle,
  HelpCircle,
  HeartPulse
} from 'lucide-react';

export const ClientToolsView: React.FC = () => {
  const { t } = useI18n();
  const { profile } = useAdvisor();

  const cheatSheets = [
    {
      id: 'rule_50_30_20',
      title: 'The 50-30-20 Golden Budget Rule',
      subtitle: 'Framework for salaried professionals and first-time budgeters',
      icon: PieChart,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      bullets: [
        '50% Needs: Groceries, utilities, rent, loan EMIs, school fees.',
        '30% Wants: Vacations, dining out, gadgets, lifestyle upgrades.',
        '20% Investments: Systematic SIPs, emergency fund, retirement.'
      ],
      whatsappText: `*The 50-30-20 Budgeting Rule* 📊\n\nStruggling to balance spending and savings? Here is the global golden rule:\n\n1️⃣ 50% Needs: Rent, groceries, EMIs\n2️⃣ 30% Wants: Lifestyle, dining, trips\n3️⃣ 20% Investments: SIPs, PF, Goals\n\nPlan your finances with discipline.\n- ${profile.advisorName} (${profile.designation})\nPhone: ${profile.phoneNumber}`
    },
    {
      id: 'emergency_fund_ratio',
      title: 'The 6-Month Emergency Safety Shield',
      subtitle: 'Liquid protection before starting high-risk equity investments',
      icon: ShieldAlert,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      bullets: [
        'Hold 6 times your mandatory monthly expenses in liquid instruments.',
        'Park 50% in high-yield sweep-in savings and 50% in overnight/liquid mutual funds.',
        'Never lock emergency funds into equity mutual funds or real estate.'
      ],
      whatsappText: `*The 6-Month Emergency Shield* 🛡️\n\nBefore you invest in the stock market, ask yourself:\nIf income stops tomorrow, do you have 6 months of living expenses safely stored?\n\nKeep emergency reserves liquid and easily accessible.\n- ${profile.advisorName} (${profile.designation})\nPhone: ${profile.phoneNumber}`
    },
    {
      id: 'rule_of_72',
      title: 'The Rule of 72: Doubling Your Money',
      subtitle: 'Quick mental math to show clients how fast capital multiplies',
      icon: Zap,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      bullets: [
        'Formula: 72 ÷ Expected Annual Return % = Years to Double Money.',
        '@ 6% (Fixed Deposit): 72 ÷ 6 = 12 Years to double.',
        '@ 12% (Equity Mutual Fund): 72 ÷ 12 = Only 6 Years to double!'
      ],
      whatsappText: `*The Rule of 72: How Fast Does Your Money Double?* 📈\n\nFormula: 72 ÷ Return Rate = Years to Double\n\n🔹 At 6% (Traditional FD): Takes 12 years\n🔹 At 12% (Equity SIP): Takes only 6 years!\n\nBeat inflation with the right asset allocation.\n- ${profile.advisorName} (${profile.designation})\nPhone: ${profile.phoneNumber}`
    },
    {
      id: 'mediclaim_rule',
      title: 'Health Insurance: Base + Super Top-up',
      subtitle: 'How to get ₹50 Lakhs protection at 1/3rd of the cost',
      icon: HeartPulse,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      bullets: [
        'Take a ₹5 Lakh Base Mediclaim policy with no room-rent capping.',
        'Attach a ₹45 Lakh Super Top-up policy with a ₹5 Lakh deductible.',
        'Saves up to 65% in annual premiums while giving ₹50 Lakh cover!'
      ],
      whatsappText: `*Smart Healthcare Cover Strategy* 🏥✨\n\nHow to get a ₹50 Lakh family health cover for the price of ₹10 Lakhs:\n\n1. Base Policy: ₹5 Lakhs\n2. Super Top-Up: ₹45 Lakhs (with ₹5L deductible)\n\nProtect your family against medical inflation without overpaying.\n- ${profile.advisorName} (${profile.designation})\nPhone: ${profile.phoneNumber}`
    }
  ];

  const handleShare = (text: string) => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('clientTools.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('clientTools.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cheatSheets.map((sheet) => {
          const Icon = sheet.icon;
          return (
            <div
              key={sheet.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${sheet.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => handleShare(sheet.whatsappText)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {sheet.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-3">
                  {sheet.subtitle}
                </p>

                <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {sheet.bullets.map((b, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Branded with your profile</span>
                <span className="font-semibold text-slate-600">Client Ready</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
