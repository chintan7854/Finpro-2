import React, { useState } from 'react';
import { useAiEngine, AiProvider } from '../../context/AiEngineContext';
import { Sparkles, Bot, Zap, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface AiProviderSwitcherProps {
  compact?: boolean;
  onNavigateToSettings?: () => void;
}

export const AiProviderSwitcher: React.FC<AiProviderSwitcherProps> = ({
  compact = false,
  onNavigateToSettings,
}) => {
  const { provider, setProvider, serverConfig, openaiModel } = useAiEngine();
  const [isOpen, setIsOpen] = useState(false);

  const options: {
    id: AiProvider;
    name: string;
    subtext: string;
    icon: typeof Bot;
    color: string;
    activeBorder: string;
  }[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      subtext: 'Fast, Cost-Effective & Multilingual',
      icon: Bot,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      activeBorder: 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20',
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      subtext: `Model: ${openaiModel.toUpperCase()}`,
      icon: Zap,
      color: 'text-indigo-700 bg-indigo-50 border-indigo-300',
      activeBorder: 'border-indigo-500 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20',
    },
    {
      id: 'auto',
      name: 'Auto-Fallback',
      subtext: 'Primary + Instant Backup Protection',
      icon: RefreshCw,
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      activeBorder: 'border-amber-500 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/20',
    },
  ];

  const currentOption = options.find((o) => o.id === provider) || options[0];
  const CurrentIcon = currentOption.icon;

  if (compact) {
    return (
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all shadow-2xs hover:shadow-xs ${currentOption.color}`}
          title="Click to switch AI Engine (Gemini / OpenAI)"
        >
          <CurrentIcon className="w-3.5 h-3.5" />
          <span>{currentOption.name}</span>
          <span className="text-[10px] opacity-70">▼</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select Active AI Engine
              </span>
            </div>
            <div className="space-y-1">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = provider === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setProvider(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-slate-100 font-bold text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-slate-700" />
                      <div>
                        <span className="block text-slate-900 font-semibold">{opt.name}</span>
                        <span className="block text-[10px] text-slate-400">{opt.subtext}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = provider === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setProvider(opt.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isSelected
                ? opt.activeBorder
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.name}</span>
            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 ml-1" />}
          </button>
        );
      })}
    </div>
  );
};
