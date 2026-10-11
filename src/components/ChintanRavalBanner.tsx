import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Award, BookOpen, CheckCircle } from 'lucide-react';

interface ChintanRavalBannerProps {
  compact?: boolean;
}

export const ChintanRavalBanner: React.FC<ChintanRavalBannerProps> = ({ compact = false }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#03152d] via-[#07244c] to-[#020e1f] text-white shadow-2xl border border-amber-500/30">
      {/* Ambient background glow & radial fintech grid */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Tagline & 3D Typography */}
        <div className="space-y-4 max-w-xl text-center lg:text-left">
          {/* Top slogan badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-xs uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Plan • Save • Invest • Grow
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <ShieldCheck className="w-3 h-3 mr-1 text-cyan-400" />
              Financial Freedom Architecture
            </span>
          </div>

          {/* Master 3D Metallic Nameplate */}
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight select-none">
              <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-sm mr-2.5">
                Chintan
              </span>
              <span className="bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)]">
                Raval
              </span>
            </h1>
            {/* Golden growth arrow ascending */}
            <div className="inline-flex items-center ml-2 text-amber-400 animate-pulse">
              <TrendingUp className="w-7 h-7 sm:w-9 sm:h-9" />
            </div>
          </div>

          {/* Wealth Books & Disciplined Milestones */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Personal Finance
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium">
              📈 Wealth Building
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-medium text-amber-300">
              🪙 Disciplined SIP Growth
            </span>
          </div>
        </div>

        {/* Right Side: Philosophy Plaque & Official Creator Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=180&q=80"
              alt="Chintan Raval"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg text-slate-950 font-bold">
              <Award className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-1.5">
              <h3 className="text-sm sm:text-base font-extrabold text-white">Chintan Raval</h3>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-amber-300">
              Wealth Mentor & Financial Architect
            </p>
            <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed italic">
              "A Wealthier You, A Brighter Tomorrow. Discipline Creates Real Wealth."
            </p>
            <div className="pt-1 text-[10px] text-emerald-400 font-bold tracking-wide uppercase">
              ★ Official Platform Creator & Architect
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
