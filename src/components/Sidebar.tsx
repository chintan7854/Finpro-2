import React from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  LayoutDashboard,
  Sparkles,
  Calculator,
  Briefcase,
  BookmarkCheck,
  UserCheck,
  Settings,
  Zap,
  Phone,
  ShieldCheck,
  Smartphone,
  Layers,
  MessageSquare,
  Users,
  Target,
  Gift,
  BookOpen,
  Gauge,
  Presentation,
  HelpCircle,
  Vote,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { t } = useI18n();
  const { profile, subscription } = useAdvisor();

  const navigation = [
    { id: 'dashboard', name: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'finance-poll', name: 'Finance Poll Generator', icon: Vote, badge: '50 POLLS', isViolet: true },
    { id: 'finance-quiz', name: 'Finance Quiz Studio', icon: HelpCircle, badge: '50 QUIZ', isEmerald: true },
    { id: 'presentation-studio', name: 'Presentation Studio', icon: Presentation, badge: '40+ PPT', isIndigo: true },
    { id: 'story-studio', name: 'Viral Story Studio', icon: BookOpen, badge: 'HOT' },
    { id: 'create', name: t('nav.createContent'), icon: Sparkles, badge: 'AI' },
    { id: 'theme-studio', name: '25 Theme Posters', icon: Layers, badge: '25 Themes' },
    { id: 'greetings-studio', name: 'Greetings Studio', icon: Gift, badge: 'CARDS' },
    { id: 'client-crm', name: 'Client CRM & Dates', icon: Users, badge: 'CRM' },
    { id: 'lead-generation', name: 'Lead Pipeline', icon: Target },
    { id: 'client-qa', name: 'Client Q&A (WhatsApp)', icon: MessageSquare, badge: 'NEW' },
    { id: 'status-studio', name: t('nav.statusStudio'), icon: Smartphone, badge: 'PNG' },
    { id: 'calculators', name: t('nav.calculators'), icon: Calculator },
    { id: 'simulators', name: 'Mindset Simulators', icon: Gauge, badge: '50 LIVE', isViolet: true },
    { id: 'client-tools', name: t('nav.clientTools'), icon: Briefcase },
    { id: 'my-content', name: t('nav.myContent'), icon: BookmarkCheck },
    { id: 'profile', name: t('nav.profile'), icon: UserCheck },
    { id: 'settings', name: t('nav.settings'), icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 shrink-0">
      {/* Advisor Quick Card */}
      <div
        onClick={() => onNavigate('profile')}
        className="p-3.5 mb-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white cursor-pointer group hover:shadow-md transition-all"
      >
        <div className="flex items-center space-x-3 mb-2.5">
          <div className="relative">
            <img
              src={profile.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80'}
              alt={profile.advisorName}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold truncate group-hover:text-emerald-300 transition-colors">
              {profile.advisorName}
            </h4>
            <p className="text-[11px] text-slate-300 truncate">
              {profile.designation}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-emerald-400">
          <span className="truncate max-w-[140px]">{profile.professionalDetails || 'ARN Verified'}</span>
          <span className="font-semibold underline text-slate-300 group-hover:text-white">Edit</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          const isVioletItem = (item as any).isViolet;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? isVioletItem
                    ? 'bg-violet-50 text-violet-900 font-bold border border-violet-200/80 shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                  : isVioletItem
                  ? 'text-indigo-900 hover:bg-violet-50/60 hover:text-violet-700'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${
                  isActive
                    ? isVioletItem ? 'text-violet-600' : 'text-emerald-600'
                    : isVioletItem ? 'text-violet-500' : 'text-slate-400'
                }`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                  isVioletItem
                    ? 'bg-violet-100 text-violet-800 border border-violet-200'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Subscription & Credit Summary */}
      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-900">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{subscription.planName}</span>
            </span>
            <span className="text-emerald-700">{subscription.creditsRemaining} Left</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{
                width: `${Math.min(100, (subscription.creditsRemaining / subscription.credits) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>{subscription.creditsUsed} generated this month</span>
          </p>
        </div>
      </div>
    </aside>
  );
};
