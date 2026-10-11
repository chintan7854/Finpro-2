import React from 'react';
import { useI18n } from '../context/I18nContext';
import {
  LayoutDashboard,
  Sparkles,
  Calculator,
  BookmarkCheck,
  UserCheck,
  Gauge
} from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { t } = useI18n();

  const navItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'simulators',
      label: 'Simulators',
      icon: Gauge,
      isSimulators: true,
    },
    {
      id: 'create',
      label: t('nav.createContent'),
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'calculators',
      label: t('nav.calculators'),
      icon: Calculator,
    },
    {
      id: 'my-content',
      label: t('nav.myContent'),
      icon: BookmarkCheck,
    },
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: UserCheck,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg md:hidden">
      <div className="grid grid-cols-6 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-col items-center justify-center -top-3 group active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-emerald-500/30'
                    : 'bg-emerald-600 text-white shadow-emerald-500/25 group-hover:bg-emerald-700'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className={`text-[9px] font-semibold mt-0.5 truncate max-w-[54px] text-center ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          // Distinct Rich Violet / Indigo Theme for Simulators (#6366F1 / #7C3AED)
          if (item.isSimulators) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 transition-all ${
                  isActive
                    ? 'text-violet-600 font-bold'
                    : 'text-indigo-500/80 hover:text-indigo-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5] text-violet-600' : 'stroke-2 text-indigo-500'}`} />
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-violet-600 ring-1 ring-white" />
                </div>
                <span className={`text-[9px] truncate max-w-[54px] text-center ${
                  isActive ? 'text-violet-700 font-extrabold' : 'text-indigo-600/90 font-semibold'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[9px] font-medium truncate max-w-[54px] text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
