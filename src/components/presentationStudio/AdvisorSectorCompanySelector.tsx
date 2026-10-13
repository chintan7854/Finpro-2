import React, { useState, useMemo } from 'react';
import {
  SECTORS_40_LIST,
  ADVISOR_ROLES,
  KNOWN_COMPANY_PRODUCTS_CATALOG,
  AdvisorBusinessProfile,
  SectorDefinition,
} from '../../constants/advisorSectorsData';
import { LanguageCode } from '../../types';
import {
  Briefcase,
  Building2,
  Package,
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';

interface AdvisorSectorCompanySelectorProps {
  businessProfile: AdvisorBusinessProfile;
  onChange: (updated: AdvisorBusinessProfile) => void;
  language?: LanguageCode;
  onAutoPopulateTopic?: (suggestedPrompt: string) => void;
}

export const AdvisorSectorCompanySelector: React.FC<AdvisorSectorCompanySelectorProps> = ({
  businessProfile,
  onChange,
  language = 'en',
  onAutoPopulateTopic,
}) => {
  const [sectorSearch, setSectorSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  // Selected Sector
  const selectedSector = useMemo(() => {
    return SECTORS_40_LIST.find((s) => s.id === businessProfile.sectorId);
  }, [businessProfile.sectorId]);

  // Filtered Sectors
  const filteredSectors = useMemo(() => {
    const q = sectorSearch.trim().toLowerCase();
    if (!q) return SECTORS_40_LIST;
    return SECTORS_40_LIST.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameGu.toLowerCase().includes(q) ||
        s.nameHi.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
    );
  }, [sectorSearch]);

  // Available Companies for selected sector
  const availableCompanies = useMemo(() => {
    if (!selectedSector) return [];
    const companies = [...selectedSector.sampleCompanies];
    if (companySearch.trim()) {
      const q = companySearch.trim().toLowerCase();
      return companies.filter((c) => c.toLowerCase().includes(q));
    }
    return companies;
  }, [selectedSector, companySearch]);

  // Catalog Products for selected company
  const catalogProducts = useMemo(() => {
    const cName = businessProfile.companyName || '';
    // Look up exact or fuzzy match in KNOWN_COMPANY_PRODUCTS_CATALOG
    for (const [key, list] of Object.entries(KNOWN_COMPANY_PRODUCTS_CATALOG)) {
      if (cName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cName.toLowerCase())) {
        return list;
      }
    }
    return [];
  }, [businessProfile.companyName]);

  const handleSelectSector = (sector: SectorDefinition) => {
    onChange({
      ...businessProfile,
      sectorId: sector.id,
      sectorName: sector.name,
      customSectorName: undefined,
      companyId: '',
      companyName: sector.sampleCompanies[0] || '',
      productName: '',
      advisorRole: businessProfile.advisorRole || sector.defaultRole,
    });
    setIsSectorDropdownOpen(false);
  };

  const handleSelectCustomSector = () => {
    onChange({
      ...businessProfile,
      sectorId: 'other_custom',
      sectorName: 'Other / Custom Sector',
      customSectorName: businessProfile.customSectorName || '',
      companyId: 'custom_company',
      companyName: '',
      productName: '',
      advisorRole: businessProfile.advisorRole || 'Independent Financial Advisor',
    });
    setIsSectorDropdownOpen(false);
  };

  const handleSelectCompany = (compName: string) => {
    onChange({
      ...businessProfile,
      companyId: compName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      companyName: compName,
      customCompanyName: undefined,
      productName: '', // reset product to let advisor pick relevant product
    });
    setIsCompanyDropdownOpen(false);
  };

  const handleSelectProduct = (prodName: string) => {
    onChange({
      ...businessProfile,
      productName: prodName,
    });
    setIsProductDropdownOpen(false);
  };

  // Helper to auto-generate a high-converting topic prompt based on sector + company + product
  const handleAutoSuggestPrompt = () => {
    if (!onAutoPopulateTopic) return;
    const sName = businessProfile.sectorName;
    const cName = businessProfile.companyName;
    const pName = businessProfile.productName || 'flagship solution';

    let prompt = `Create a client-ready, single-product advisory recommendation for ${cName} — ${pName}. Explain why this specific product fits the client's family goals, calculate realistic scenarios with transparent assumptions, outline core benefits, waiting periods/costs, and explain how to apply with full compliance disclosures.`;

    if (sName.toLowerCase().includes('mutual fund') || sName.toLowerCase().includes('sip')) {
      prompt = `Create a personalized mutual fund SIP proposal for ${cName} — ${pName}. Explain the investment objective, riskometer (Very High), 15-year compounding comparison (6%, 10%, 12%), rupee-cost averaging, expense ratio & exit load, and why past performance is not a guarantee.`;
    } else if (sName.toLowerCase().includes('health')) {
      prompt = `Prepare a personalized family health insurance report for ${cName} — ${pName}. Cover hospitalization protection, room rent rules, waiting periods, pre-existing disease terms, cashless network hospitals, and family budget affordability.`;
    } else if (sName.toLowerCase().includes('life')) {
      prompt = `Prepare a personalized life insurance client planning report discussing ${cName} — ${pName}. Analyze family income protection, liabilities, cover gap analysis, policy term, guaranteed vs non-guaranteed benefits, and claims continuity checklist.`;
    } else if (sName.toLowerCase().includes('loan')) {
      prompt = `Prepare a comprehensive loan advisory report for ${cName} — ${pName}. Include loan purpose, affordability, illustrative EMI calculations across interest rate assumptions, required documents, and lender approval steps.`;
    }

    onAutoPopulateTopic(prompt);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Universal Sector, Company & Product Selection
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  40+ Universal Sectors
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target one specific verified product from top Indian financial institutions. Creates a tailored, client-ready advisory report.
              </p>
            </div>
          </div>

          {(businessProfile.companyName || businessProfile.productName) && onAutoPopulateTopic && (
            <button
              type="button"
              onClick={handleAutoSuggestPrompt}
              className="text-xs px-3 py-1.5 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center space-x-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Fill Topic Box With Product Details</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: 4-Step Selection Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* STEP 1: BUSINESS SECTOR */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Business Sector</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSectorDropdownOpen(!isSectorDropdownOpen);
                setIsCompanyDropdownOpen(false);
                setIsProductDropdownOpen(false);
              }}
              className="w-full text-left p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-between transition-all focus:ring-2 focus:ring-emerald-500"
            >
              <span className="truncate">
                {businessProfile.sectorId === 'other_custom'
                  ? businessProfile.customSectorName || 'Custom / Other Sector'
                  : selectedSector?.name || 'Select Business Sector (40)'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Sector Dropdown Modal */}
            {isSectorDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-2.5 space-y-2 max-h-80 overflow-y-auto">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={sectorSearch}
                    onChange={(e) => setSectorSearch(e.target.value)}
                    placeholder="Search 40 business sectors..."
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  {filteredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => handleSelectSector(sector)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        businessProfile.sectorId === sector.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="truncate">
                        {language === 'gu' ? sector.nameGu : language === 'hi' ? sector.nameHi : sector.name}
                      </span>
                      {businessProfile.sectorId === sector.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                      )}
                    </button>
                  ))}

                  {/* Other / Custom Option */}
                  <button
                    type="button"
                    onClick={handleSelectCustomSector}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-t border-slate-100 dark:border-slate-800 pt-2"
                  >
                    + Other / Custom Sector (Type Manually)
                  </button>
                </div>
              </div>
            )}
          </div>

          {businessProfile.sectorId === 'other_custom' && (
            <input
              type="text"
              value={businessProfile.customSectorName || ''}
              onChange={(e) =>
                onChange({
                  ...businessProfile,
                  customSectorName: e.target.value,
                })
              }
              placeholder="Enter Custom Sector Name..."
              className="w-full text-xs p-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-slate-800 text-slate-900 dark:text-white mt-1"
            />
          )}
        </div>

        {/* STEP 2: COMPANY / PLATFORM */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Company / Platform</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
                setIsSectorDropdownOpen(false);
                setIsProductDropdownOpen(false);
              }}
              className="w-full text-left p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-between transition-all focus:ring-2 focus:ring-emerald-500"
            >
              <span className="truncate">
                {businessProfile.companyName || 'Select Company / Brand'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Company Dropdown */}
            {isCompanyDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-2.5 space-y-2 max-h-72 overflow-y-auto">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  {availableCompanies.map((cName) => (
                    <button
                      key={cName}
                      type="button"
                      onClick={() => handleSelectCompany(cName)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        businessProfile.companyName === cName
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{cName}</span>
                      {businessProfile.companyName === cName && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                      )}
                    </button>
                  ))}

                  {/* Custom Company Option */}
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        ...businessProfile,
                        companyId: 'custom_company',
                        companyName: '',
                      });
                      setIsCompanyDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-t border-slate-100 dark:border-slate-800 pt-2"
                  >
                    + Enter Other Company Name
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick text input for custom or edited company name */}
          <input
            type="text"
            value={businessProfile.companyName}
            onChange={(e) =>
              onChange({
                ...businessProfile,
                companyName: e.target.value,
              })
            }
            placeholder="e.g. HDFC Mutual Fund, LIC, Star Health"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 mt-1"
          />
        </div>

        {/* STEP 3: PRODUCT / SCHEME SELECTION */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Product / Scheme Name</span>
          </label>

          <div className="relative">
            {catalogProducts.length > 0 ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProductDropdownOpen(!isProductDropdownOpen);
                    setIsSectorDropdownOpen(false);
                    setIsCompanyDropdownOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-between transition-all focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="truncate">
                    {businessProfile.productName || 'Select Known Scheme / Product'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                </button>

                {isProductDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-2.5 space-y-1 max-h-72 overflow-y-auto">
                    <p className="text-[11px] font-bold text-slate-500 uppercase px-2 mb-1">
                      Verified Catalog for {businessProfile.companyName}:
                    </p>
                    {catalogProducts.map((pName) => (
                      <button
                        key={pName}
                        type="button"
                        onClick={() => handleSelectProduct(pName)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          businessProfile.productName === pName
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{pName}</span>
                        {businessProfile.productName === pName && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Custom or specific product text input */}
            <input
              type="text"
              value={businessProfile.productName}
              onChange={(e) =>
                onChange({
                  ...businessProfile,
                  productName: e.target.value,
                })
              }
              placeholder="e.g. HDFC Flexi Cap Fund, ReAssure 2.0, Home Loan Maxgain"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 mt-1"
            />
          </div>

          {/* Product Details: Variant, Term, Needs Verification toggle */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
              <input
                type="checkbox"
                checked={businessProfile.needsVerification || false}
                onChange={(e) =>
                  onChange({
                    ...businessProfile,
                    needsVerification: e.target.checked,
                  })
                }
                className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium text-amber-700 dark:text-amber-400">
                Mark as &quot;Requires Verification&quot;
              </span>
            </label>
          </div>
        </div>

        {/* STEP 4: ADVISOR ROLE & IDENTIFIER */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
            <span>Advisor Role / Channel</span>
          </label>

          <select
            value={businessProfile.advisorRole}
            onChange={(e) =>
              onChange({
                ...businessProfile,
                advisorRole: e.target.value,
              })
            }
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {ADVISOR_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={businessProfile.authorizationIdentifier || ''}
            onChange={(e) =>
              onChange({
                ...businessProfile,
                authorizationIdentifier: e.target.value,
              })
            }
            placeholder="ARN / IRDAI License / DSA Code (Optional)"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 mt-1"
          />
        </div>
      </div>

      {/* Selected Recommendation Summary Ribbon */}
      {(businessProfile.companyName || businessProfile.productName) && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400">Target Product Selected: </span>
              <strong className="text-emerald-950 dark:text-emerald-200 text-sm">
                {businessProfile.companyName || 'Institution'} —{' '}
                {businessProfile.productName || 'Product Recommendation'}
              </strong>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {businessProfile.advisorRole}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Product will remain the central focus of the client presentation</span>
          </div>
        </div>
      )}
    </div>
  );
};
