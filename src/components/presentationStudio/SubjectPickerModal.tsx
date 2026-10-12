import React, { useState, useMemo } from 'react';
import {
  PresentationSubject,
  PresentationGroupCategory,
  PresentationSubCategory,
} from '../../types/presentationStudio';
import {
  PRESENTATION_SUBJECTS_LIST,
  PRESENTATION_GROUP_LABELS,
} from '../../constants/presentationSubjects';
import { useAdvisor } from '../../context/AdvisorContext';
import { useI18n } from '../../context/I18nContext';
import {
  Search,
  X,
  Plus,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Receipt,
  GraduationCap,
  Home,
  FileText,
  Globe,
  Coins,
  Briefcase,
  Check,
} from 'lucide-react';

interface SubjectPickerModalProps {
  selectedSubjectId: string;
  selectedSubCategoryId?: string;
  onSelect: (subjectId: string, subCategoryId?: string) => void;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<PresentationGroupCategory, any> = {
  wealth: TrendingUp,
  retirement: Clock,
  insurance: ShieldCheck,
  tax: Receipt,
  children: GraduationCap,
  borrowing: Home,
  estate: FileText,
  nri_hni: Globe,
  fixed_income: Coins,
  business: Briefcase,
};

export const SubjectPickerModal: React.FC<SubjectPickerModalProps> = ({
  selectedSubjectId,
  selectedSubCategoryId,
  onSelect,
  onClose,
}) => {
  const { customSubjects, addCustomSubject } = useAdvisor();
  const { language } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string>(selectedSubjectId || 'sip_mastery');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'wealth' | 'tax' | 'protection' | 'borrowing' | 'planning'>('wealth');

  // Convert custom subjects from context into presentation subjects
  const formattedCustomSubjects: PresentationSubject[] = useMemo(() => {
    return (customSubjects || []).map((cs) => {
      let group: PresentationGroupCategory = 'wealth';
      if (cs.category === 'protection') group = 'insurance';
      else if (cs.category === 'planning') group = 'retirement';
      else if (cs.category === 'tax') group = 'tax';
      else if (cs.category === 'borrowing') group = 'borrowing';

      return {
        id: cs.id,
        title: cs.title,
        titleGu: cs.title,
        titleHi: cs.title,
        group,
        iconName: 'Sparkles',
        shortDesc: cs.companyOrSector ? `${cs.companyOrSector} Custom Strategy` : 'Custom Advisor Advisory Topic',
        subcategories: [
          { id: `${cs.id}_core`, title: 'Core Strategy & Solution', description: 'Custom solution mapped to client requirements.' },
          { id: `${cs.id}_details`, title: 'Detailed Terms & Projections', description: 'Detailed financial milestones and calculations.' },
        ],
        isCustom: true,
      };
    });
  }, [customSubjects]);

  const allSubjects = useMemo(() => {
    return [...PRESENTATION_SUBJECTS_LIST, ...formattedCustomSubjects];
  }, [formattedCustomSubjects]);

  const filteredSubjects = useMemo(() => {
    return allSubjects.filter((subj) => {
      const matchesGroup = activeGroup === 'all' || subj.group === activeGroup;
      const title = language === 'gu' ? subj.titleGu : language === 'hi' ? subj.titleHi : subj.title;
      const matchesSearch =
        !searchTerm.trim() ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subj.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subj.subcategories.some((sc) => sc.title.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [allSubjects, activeGroup, searchTerm, language]);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    const res = addCustomSubject({
      title: customTitle.trim(),
      category: customCategory,
    });
    if (res.success && res.subject) {
      onSelect(res.subject.id, `${res.subject.id}_core`);
      setIsAddingCustom(false);
      setCustomTitle('');
      onClose();
    }
  };

  const groupKeys = Object.keys(PRESENTATION_GROUP_LABELS) as PresentationGroupCategory[];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                40+ Financial Subjects
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Choose Presentation Topic & Subcategory
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any pre-configured subject or create a custom topic.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Group Filters */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3 shrink-0">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across 40+ subjects (SIP, Retirement, Term Insurance, Tax, Child, Loans, Estate...)"
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsAddingCustom(!isAddingCustom)}
              className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center space-x-1 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Topic</span>
            </button>
          </div>

          {/* Custom Subject Form Inline */}
          {isAddingCustom && (
            <form onSubmit={handleCreateCustom} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-wrap gap-2 items-center text-xs">
              <span className="font-bold text-emerald-900">New Topic:</span>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. HDFC Life Sanchay or Real Estate Land Asset Allocation"
                className="flex-1 min-w-[200px] px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                autoFocus
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="px-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
              >
                <option value="wealth">Wealth & MF</option>
                <option value="planning">Retirement</option>
                <option value="protection">Insurance</option>
                <option value="tax">Tax Saving</option>
                <option value="borrowing">Loans</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
              >
                Save & Select
              </button>
            </form>
          )}

          {/* Group Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveGroup('all')}
              className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                activeGroup === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Topics ({allSubjects.length})
            </button>
            {groupKeys.map((g) => {
              const label =
                language === 'gu'
                  ? PRESENTATION_GROUP_LABELS[g].gu
                  : language === 'hi'
                  ? PRESENTATION_GROUP_LABELS[g].hi
                  : PRESENTATION_GROUP_LABELS[g].en;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeGroup === g
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjects List & Subcategories */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No financial topics match "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredSubjects.map((subj) => {
              const isSelected = selectedSubjectId === subj.id;
              const isExpanded = expandedSubjectId === subj.id;
              const displayTitle = language === 'gu' ? subj.titleGu : language === 'hi' ? subj.titleHi : subj.title;
              const Icon = CATEGORY_ICONS[subj.group] || TrendingUp;

              return (
                <div
                  key={subj.id}
                  className={`pt-3 first:pt-0 rounded-2xl transition-all ${
                    isSelected ? 'ring-2 ring-emerald-500/80 bg-emerald-50/20 p-3' : ''
                  }`}
                >
                  <div
                    onClick={() => setExpandedSubjectId(isExpanded ? '' : subj.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {displayTitle}
                          </h4>
                          {subj.isCustom && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Custom
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {subj.shortDesc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {subj.subcategories.length} subtopics
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(subj.id, subj.subcategories[0]?.id);
                          onClose();
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>

                  {/* Subcategories accordion */}
                  {isExpanded && (
                    <div className="mt-3 pl-11 pr-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {subj.subcategories.map((sc) => {
                        const isSubSelected = isSelected && selectedSubCategoryId === sc.id;
                        return (
                          <div
                            key={sc.id}
                            onClick={() => {
                              onSelect(subj.id, sc.id);
                              onClose();
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSubSelected
                                ? 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold'
                                : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-emerald-300 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {sc.title}
                              </span>
                              {isSubSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {sc.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
