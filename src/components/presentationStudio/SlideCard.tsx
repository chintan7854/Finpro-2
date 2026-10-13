import React from 'react';
import { PresentationSlide, AdvisorPresentationSnapshot } from '../../types/presentationStudio';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';

interface SlideCardProps {
  slide: PresentationSlide;
  advisorSnapshot: AdvisorPresentationSnapshot;
  totalSlides: number;
  onEdit?: () => void;
  onRegenerate?: () => void;
  isPrintMode?: boolean;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  advisorSnapshot,
  totalSlides,
  onEdit,
  onRegenerate,
  isPrintMode = false,
}) => {
  return (
    <div
      data-slide-number={slide.slideNumber}
      className={`relative w-full bg-white rounded-2xl border border-slate-200/90 shadow-md flex flex-col justify-between overflow-hidden transition-all ${
        isPrintMode ? 'min-h-[580px] p-6' : 'min-h-[560px] p-5 sm:p-7'
      } print:border-slate-800 print:shadow-none print:break-after-page`}
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 print:border-black print:text-black">
              {slide.badge}
            </span>
            <span className="text-xs font-semibold text-slate-500 print:text-black">
              Slide {slide.slideNumber} of {totalSlides}
            </span>
          </div>

          {!isPrintMode && (onEdit || onRegenerate) && (
            <div className="flex items-center space-x-2 print:hidden">
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  title="Regenerate this individual slide with AI"
                >
                  ⚡ Regenerate
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
                  title="Edit slide contents"
                >
                  ✏️ Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* Slide Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight print:text-black">
          {slide.title}
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-600 mb-3 italic print:text-slate-800">
          {slide.subtitle}
        </p>

        {/* Executive Takeaway Highlight */}
        {slide.keyTakeaway && (
          <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50/60 border-l-4 border-emerald-600 text-slate-800 text-xs sm:text-sm font-semibold print:bg-slate-100 print:border-black print:text-black">
            <span className="text-emerald-800 font-bold uppercase text-[10px] tracking-wider block mb-0.5 print:text-black">
              Executive Key Insight:
            </span>
            {typeof slide.keyTakeaway === 'string'
              ? slide.keyTakeaway
              : (slide.keyTakeaway as any)?.text || (slide.keyTakeaway as any)?.point || String(slide.keyTakeaway || '')}
          </div>
        )}
      </div>

      {/* Middle Body Grid: Left content, Right visuals */}
      <div className="my-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-start flex-1">
        {/* Left Column: Bullet Points & Content (7 Cols) */}
        <div className="md:col-span-7 space-y-2.5">
          {slide.bulletPoints && slide.bulletPoints.length > 0 && (
            <div className="space-y-2">
              {slide.bulletPoints.map((bullet: any, idx) => {
                const bulletText =
                  typeof bullet === 'string'
                    ? bullet
                    : bullet?.text || bullet?.point || bullet?.description || String(bullet || '');
                return (
                  <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-800 print:text-black leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0 print:text-black" />
                    <span>{bulletText}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Real World Example if present */}
          {slide.realWorldExample && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 print:border-black">
              <span className="font-bold text-slate-900 block">
                Case Scenario: {slide.realWorldExample.persona}
              </span>
              <p className="text-slate-600"><strong>Situation:</strong> {slide.realWorldExample.situation}</p>
              <p className="text-emerald-700 font-medium"><strong>Strategy & Outcome:</strong> {slide.realWorldExample.financialOutcome}</p>
            </div>
          )}

          {/* Risks & Limitations */}
          {slide.risksAndLimitations && slide.risksAndLimitations.length > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 print:bg-white print:border-black print:text-black">
              <span className="font-bold flex items-center space-x-1 mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1 print:text-black" />
                Risk Factor & Regulatory Guardrails:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {slide.risksAndLimitations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Visuals / Charts / Metrics / Comparison (5 Cols) */}
        <div className="md:col-span-5 space-y-3">
          {/* Metrics Cards */}
          {slide.metrics && slide.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {slide.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 print:border-black print:bg-white"
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider print:text-black">
                    {metric.label}
                  </p>
                  <p className="text-base sm:text-lg font-black text-emerald-700 print:text-black">
                    {metric.value}
                  </p>
                  {metric.helper && (
                    <p className="text-[10px] text-slate-500 italic truncate print:text-black">
                      {metric.helper}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SVG Chart Rendering */}
          {slide.chartData && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 print:border-black print:bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 print:text-black truncate">
                  {slide.chartData.title}
                </span>
                {slide.chartData.unit && (
                  <span className="text-[10px] font-semibold text-slate-500 print:text-black">
                    ({slide.chartData.unit})
                  </span>
                )}
              </div>

              {/* Bar Chart */}
              {slide.chartData.type === 'bar' && (
                <div className="space-y-2">
                  {(slide.chartData.labels || []).map((label, i) => {
                    const val = slide.chartData?.values?.[i] ?? 0;
                    const maxVal = Math.max(...(slide.chartData?.values || [100]), 1);
                    const pct = Math.max(2, Math.min(100, Math.round((val / maxVal) * 100)));
                    const secVal = slide.chartData?.secondaryValues?.[i];

                    return (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 print:text-black">
                          <span>{label}</span>
                          <span>
                            {typeof val === 'number' && val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : val}
                            {slide.chartData?.unit ? ` ${slide.chartData.unit}` : ''}
                            {secVal !== undefined && (
                              <span className="text-slate-500 text-[10px] ml-1">
                                (Base: {secVal})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex print:border print:border-black">
                          <div
                            className="h-full bg-emerald-600 rounded-full print:bg-black"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Donut / Allocation Breakdown */}
              {slide.chartData.type === 'donut' && (
                <div className="space-y-1.5">
                  <div className="w-full h-3.5 rounded-full overflow-hidden flex border border-slate-200 print:border-black">
                    {(slide.chartData.labels || []).map((_, i) => {
                      const colors = [
                        'bg-emerald-600 print:bg-black',
                        'bg-teal-500 print:bg-slate-700',
                        'bg-indigo-600 print:bg-slate-500',
                        'bg-amber-500 print:bg-slate-300',
                      ];
                      const val = slide.chartData?.values?.[i] || 0;
                      return (
                        <div
                          key={i}
                          className={`h-full ${colors[i % colors.length]}`}
                          style={{ width: `${val}%` }}
                          title={`${slide.chartData?.labels?.[i]}: ${val}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    {(slide.chartData.labels || []).map((l, i) => (
                      <div key={i} className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 print:bg-black shrink-0" />
                        <span className="text-slate-700 print:text-black truncate">
                          {l}: <strong>{slide.chartData?.values?.[i]}%</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones Roadmap */}
              {slide.chartData.type === 'milestones' && (
                <div className="relative pl-3 border-l-2 border-emerald-500 space-y-2 print:border-black">
                  {slide.chartData.labels.map((label, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white print:bg-black print:border-black" />
                      <p className="text-xs font-bold text-slate-800 print:text-black">
                        {label}
                      </p>
                      <p className="text-[10px] text-emerald-700 print:text-black font-semibold">
                        Progress: {slide.chartData?.values[idx]}%
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {slide.chartData.explanation && (
                <p className="text-[10px] text-slate-500 mt-2 italic print:text-black">
                  {slide.chartData.explanation}
                </p>
              )}
            </div>
          )}

          {/* Comparison Table */}
          {slide.comparisonTable && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 text-[11px] print:border-black">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold print:bg-slate-200 print:text-black">
                  <tr>
                    <th className="p-1.5">{slide.comparisonTable.headers?.[0] || 'Parameter'}</th>
                    <th className="p-1.5 text-emerald-800 print:text-black">{slide.comparisonTable.headers?.[1] || 'Recommended Option'}</th>
                    <th className="p-1.5 text-slate-600 print:text-black">{slide.comparisonTable.headers?.[2] || 'Traditional Alternative'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {(slide.comparisonTable.rows || []).map((row: any, idx) => {
                    const isArr = Array.isArray(row);
                    const param = isArr ? row[0] : row?.parameter;
                    const optA = isArr ? row[1] : row?.optionA;
                    const optB = isArr ? row[2] : row?.optionB;
                    const isAdvA = !isArr && row?.advantageFor === 'A';
                    return (
                      <tr key={idx} className={isAdvA ? 'bg-emerald-50/40 print:bg-white' : ''}>
                        <td className="p-1.5 font-medium text-slate-700 print:text-black">{param}</td>
                        <td className="p-1.5 font-bold text-emerald-700 print:text-black">{optA}</td>
                        <td className="p-1.5 text-slate-600 print:text-black">{optB}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Call to action card if present on final slide */}
          {slide.callToAction && (
            <div className="p-3 rounded-xl bg-emerald-900 text-white space-y-1.5 shadow-xs print:bg-slate-100 print:text-black print:border print:border-black">
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 print:text-black">
                Personalized Financial Consultation
              </p>
              <p className="text-xs sm:text-sm font-bold">
                {typeof slide.callToAction === 'string'
                  ? slide.callToAction
                  : (slide.callToAction as any)?.text ||
                    (slide.callToAction as any)?.message ||
                    (slide.callToAction as any)?.cta ||
                    'Schedule your personalized 1-on-1 portfolio consultation.'}
              </p>
              {typeof slide.callToAction === 'object' &&
                Boolean(
                  (slide.callToAction as any)?.phone ||
                    (slide.callToAction as any)?.whatsapp ||
                    (slide.callToAction as any)?.advisorName ||
                    (slide.callToAction as any)?.email
                ) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 border-t border-emerald-800/80 text-[11px] text-emerald-200">
                    {(slide.callToAction as any).advisorName && (
                      <span className="font-semibold">{(slide.callToAction as any).advisorName}</span>
                    )}
                    {(slide.callToAction as any).role && (
                      <span className="opacity-80">({(slide.callToAction as any).role})</span>
                    )}
                    {(slide.callToAction as any).phone && (
                      <span>📞 {(slide.callToAction as any).phone}</span>
                    )}
                    {(slide.callToAction as any).whatsapp && (
                      <span>💬 {(slide.callToAction as any).whatsapp}</span>
                    )}
                    {(slide.callToAction as any).email && (
                      <span>✉️ {(slide.callToAction as any).email}</span>
                    )}
                    {(slide.callToAction as any).license && (
                      <span className="text-[10px] opacity-75">
                        [{(slide.callToAction as any).license}]
                      </span>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer: Advisor Profile, Contact & Disclaimer */}
      <div className="pt-2.5 border-t border-slate-200 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-600 print:border-black print:text-black">
        <div className="flex items-center space-x-2">
          {advisorSnapshot.photo && (
            <img
              src={advisorSnapshot.photo}
              alt={advisorSnapshot.name}
              crossOrigin="anonymous"
              onError={(e) => {
                // If remote photo fails to load or violates CORS, hide smoothly
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
              className="w-7 h-7 rounded-full object-cover border border-emerald-500 print:border-black"
            />
          )}
          <div>
            <span className="font-bold text-slate-900 print:text-black">
              {advisorSnapshot.name}
            </span>
            <span className="text-slate-500 print:text-black ml-1">
              • {advisorSnapshot.designation}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-800 print:text-black">
            📞 {advisorSnapshot.phone}
          </span>
          <span className="font-semibold text-emerald-700 print:text-black">
            💬 WhatsApp: {advisorSnapshot.whatsapp}
          </span>
          {advisorSnapshot.professionalLicense && (
            <span className="text-slate-500 print:text-black">
              [{advisorSnapshot.professionalLicense.substring(0, 32)}]
            </span>
          )}
        </div>
      </div>

      {/* Statutory Disclaimer Band */}
      <div className="mt-1 text-[9px] text-slate-400 italic line-clamp-1 print:text-black">
        {typeof slide.assumptions?.[0] === 'string'
          ? slide.assumptions[0]
          : (slide.assumptions?.[0] as any)?.text ||
            (typeof advisorSnapshot.disclaimer === 'string'
              ? advisorSnapshot.disclaimer
              : (advisorSnapshot.disclaimer as any)?.text ||
                'Past performance does not guarantee future results. Terms subject to official documents.')}
      </div>
    </div>
  );
};
