import React, { useState } from 'react';
import { useAdvisor } from '../context/AdvisorContext';
import { useI18n } from '../context/I18nContext';
import { validateFinancialSubject } from '../utils/financeSubjectValidator';
import {
  X,
  PlusCircle,
  AlertTriangle,
  Building2,
  Tag,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  HeartPulse,
  CreditCard,
  Clock,
  Trash2,
} from 'lucide-react';
import { CustomFinancialSubject, FinancialSubjectId } from '../types';

interface AddCustomSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubjectAddedAndSelected?: (subjectId: FinancialSubjectId) => void;
}

const POPULAR_FINANCE_COMPANIES = [
  { label: 'HDFC Life', sector: 'HDFC Life Insurance' },
  { label: 'SBI Mutual Fund', sector: 'SBI Mutual Fund AMC' },
  { label: 'ICICI Prudential', sector: 'ICICI Prudential Life & AMC' },
  { label: 'Tata AIA', sector: 'Tata AIA Life Insurance' },
  { label: 'LIC of India', sector: 'Life Insurance Corporation' },
  { label: 'Nippon India MF', sector: 'Nippon India Mutual Fund' },
  { label: 'Motilal Oswal', sector: 'Motilal Oswal Wealth & AMC' },
  { label: 'Star Health', sector: 'Star Health & Allied Insurance' },
  { label: 'Bajaj Finserv', sector: 'Bajaj Finserv / Allianz' },
  { label: 'Kotak Mahindra', sector: 'Kotak Mutual Fund & Securities' },
  { label: 'Doctors Wealth', sector: 'Medical Professionals Financial Planning' },
  { label: 'NRI Investments', sector: 'NRI Wealth & FEMA Tax Planning' },
];

export const AddCustomSubjectModal: React.FC<AddCustomSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubjectAddedAndSelected,
}) => {
  const { customSubjects, addCustomSubject, deleteCustomSubject } = useAdvisor();
  const { language } = useI18n();

  const [title, setTitle] = useState('');
  const [companyOrSector, setCompanyOrSector] = useState('');
  const [category, setCategory] = useState<'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning'>('wealth');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleQuickPreset = (company: string, sector: string) => {
    setCompanyOrSector(sector);
    if (!title) {
      setTitle(`${company} Advisory Strategy`);
    }
    setValidationError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Financial Validation
    const validation = validateFinancialSubject(title, companyOrSector);
    if (!validation.isValid) {
      const msg = language === 'gu'
        ? (validation.errorMessageGu || validation.errorMessage)
        : (validation.errorMessage || validation.errorMessageGu);
      setValidationError(msg || 'Only finance-related subjects are permitted.');
      return;
    }

    // 2. Add to Advisor Context
    const result = addCustomSubject({
      title: title.trim(),
      companyOrSector: companyOrSector.trim() || undefined,
      category,
    });

    if (!result.success) {
      setValidationError(
        language === 'gu'
          ? (result.errorGu || result.error || 'આ સબ્જેક્ટ ઉમેરી શકાયો નથી.')
          : (result.error || result.errorGu || 'Could not add this subject.')
      );
      return;
    }

    // 3. Auto-select and close
    if (result.subject && onSubjectAddedAndSelected) {
      onSubjectAddedAndSelected(result.subject.id);
    }
    setTitle('');
    setCompanyOrSector('');
    setValidationError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'gu' ? 'કસ્ટમ ફાઇનાન્સ સબ્જેક્ટ ઉમેરો' : 'Add Custom Financial Subject'}
              </h3>
              <p className="text-xs text-emerald-200/80">
                {language === 'gu'
                  ? 'કંપની સ્પેસિફિક કે સેક્ટર મુજબ કસ્ટમ વિષય બનાવો (માત્ર ફાઇનાન્સ માન્ય)'
                  : 'Tailored for specific AMC, insurance firms, or advisor niches'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between Create New and Manage Existing */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'create'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'gu' ? 'નવો સબ્જેક્ટ બનાવો' : 'Create New Subject'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'manage'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>
              {language === 'gu' ? `મારા કસ્ટમ સબ્જેક્ટ (${customSubjects.length})` : `My Custom Subjects (${customSubjects.length})`}
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'create' ? (
            <form onSubmit={handleSave} className="space-y-4">
              {/* Financial Restriction Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === 'gu' ? 'મહત્વપૂર્ણ નિયમ: ' : 'Strict Domain Rule: '}
                  </span>
                  <span>
                    {language === 'gu'
                      ? 'અહીં ફક્ત ફાઇનાન્સ, રોકાણ, વીમા, ટેક્સ, બેંકિંગ અથવા નાણાકીય કંપનીઓને લગતા સબ્જેક્ટ જ ઉમેરી શકાય છે. "ઘરેલુ ઉપચાર" જેવા અન્ય વિષયો સ્વીકારવામાં આવશે નહીં.'
                      : 'Only financial planning, investment, insurance, tax, loan, or finance corporate subjects are permitted. Non-financial topics will be blocked.'}
                  </span>
                </div>
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-xs text-red-900 flex items-start space-x-3 animate-in shake duration-200">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-red-800">
                      {language === 'gu' ? 'સબ્જેક્ટ અમાન્ય છે (રિજેક્ટ)' : 'Invalid Subject (Rejected)'}
                    </p>
                    <p className="leading-relaxed">{validationError}</p>
                  </div>
                </div>
              )}

              {/* Quick Company / Sector Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {language === 'gu'
                      ? 'ઝડપી કંપની / સેક્ટર પસંદગી (Quick Fill)'
                      : 'Quick Company / Sector Presets'}
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  {POPULAR_FINANCE_COMPANIES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleQuickPreset(item.label, item.sector)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-semibold text-slate-700 border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs"
                    >
                      +{item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'gu' ? 'કસ્ટમ સબ્જેક્ટનું શીર્ષક (Title) *' : 'Custom Subject Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={
                    language === 'gu'
                      ? 'દા.ત. HDFC Life Sanchay Plus ગેરંટીડ પ્લાન અથવા NRI વેલ્થ પ્લાનિંગ'
                      : 'e.g. HDFC Life Sanchay Plus Plan, SBI Multi-Cap Strategy, Doctors Wealth Planning'
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {language === 'gu'
                    ? 'દાખલ કરેલ વિષય ફાઇનાન્સ અથવા રોકાણ કંપની સાથે જોડાયેલો હોવો જોઈએ.'
                    : 'Must mention finance terms or a financial company.'}
                </p>
              </div>

              {/* Company or Sector (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'gu' ? 'કંપની અથવા સેક્ટર (ઓપ્શનલ)' : 'Company or Financial Sector (Optional)'}
                </label>
                <input
                  type="text"
                  value={companyOrSector}
                  onChange={(e) => setCompanyOrSector(e.target.value)}
                  placeholder="e.g. HDFC Life, Tata AIA, Mutual Fund AMC, Private Wealth"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'gu' ? 'નાણાકીય કેટેગરી (Category)' : 'Financial Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'wealth', label: 'Wealth / Growth', icon: TrendingUp },
                    { id: 'protection', label: 'Protection / Insurance', icon: HeartPulse },
                    { id: 'tax', label: 'Tax Saving', icon: FileSpreadsheet },
                    { id: 'planning', label: 'Retirement & Goals', icon: Clock },
                    { id: 'borrowing', label: 'Loan & Debt Free', icon: CreditCard },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {language === 'gu' ? 'રદ કરો (Cancel)' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {language === 'gu' ? 'સબ્જેક્ટ સેવ કરો અને પસંદ કરો' : 'Add & Select Subject'}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Manage Existing Custom Subjects */
            <div className="space-y-3">
              {customSubjects.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No custom subjects added yet.</p>
                </div>
              ) : (
                customSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 bg-white flex items-center justify-between gap-3 shadow-2xs transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          CUSTOM
                        </span>
                        {sub.companyOrSector && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 truncate">
                            {sub.companyOrSector}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {sub.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {onSubjectAddedAndSelected && (
                        <button
                          type="button"
                          onClick={() => {
                            onSubjectAddedAndSelected(sub.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                        >
                          {language === 'gu' ? 'પસંદ કરો' : 'Select'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteCustomSubject(sub.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete custom subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
