import React, { useState, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import {
  User,
  Upload,
  Camera,
  Check,
  ShieldCheck,
  Award,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  FileBadge,
  Sliders,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { LanguageCode } from '../types';

export const ProfileView: React.FC = () => {
  const { language, supportedLanguages, t, getDefaultCta, getDefaultDisclaimer } = useI18n();
  const { profile, updateProfile, resetToDefaultProfile } = useAdvisor();

  // Local form state
  const [advisorName, setAdvisorName] = useState(profile.advisorName);
  const [designation, setDesignation] = useState(profile.designation);
  const [achievement, setAchievement] = useState(profile.achievement);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsappNumber);
  const [email, setEmail] = useState(profile.email);
  const [location, setLocation] = useState(profile.location);
  const [website, setWebsite] = useState(profile.website);
  const [professionalDetails, setProfessionalDetails] = useState(profile.professionalDetails);
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto);
  const [logo, setLogo] = useState(profile.logo);
  const [defaultCTA, setDefaultCTA] = useState(profile.defaultCTA);
  const [defaultDisclaimer, setDefaultDisclaimer] = useState(profile.defaultDisclaimer);

  // Branding Toggles
  const [brandingPrefs, setBrandingPrefs] = useState(profile.brandingPreferences);

  const [savedBanner, setSavedBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sample Avatar Presets for quick testing
  const avatarPresets = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=320&q=80',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      advisorName,
      designation,
      achievement,
      phoneNumber,
      whatsappNumber,
      email,
      location,
      website,
      professionalDetails,
      profilePhoto,
      logo,
      defaultCTA,
      defaultDisclaimer,
      brandingPreferences: brandingPrefs,
    });

    setSavedBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSavedBanner(false), 4000);
  };

  // Helper to sync CTA and disclaimer with current language if advisor wants
  const handleResetCtaToLanguage = () => {
    setDefaultCTA(getDefaultCta(language));
  };

  const handleResetDisclaimerToLanguage = () => {
    setDefaultDisclaimer(getDefaultDisclaimer(language));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('profile.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-2.5 shadow-sm animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t('profile.savedSuccess')}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Photos & Master Identity */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Identity & Visual Assets</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {t('profile.photo')}
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative group shrink-0">
                  <img
                    src={profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80'}
                    alt="Advisor"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('profile.photoUpload')}</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    JPG or PNG. Embedded directly into generated poster cards.
                  </p>
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or pick a preset avatar:
                </span>
                <div className="flex space-x-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfilePhoto(preset)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                        profilePhoto === preset ? 'border-emerald-600 ring-2 ring-emerald-400/30' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {t('profile.logo')}
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {logo ? (
                    <img src={logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t('profile.logoUpload')}</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Transparent PNG recommended for card headers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Fields: Name, Designation, Achievement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.name')} *
              </label>
              <input
                type="text"
                required
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                placeholder="e.g. Rajesh V. Sharma"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.designation')} *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Certified Financial Planner (CFP) & MFD"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.achievement')}
              </label>
              <input
                type="text"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                placeholder="e.g. MDRT Qualifier 2024 • Managing ₹140+ Cr AUM • 1,200+ Families"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Official Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Contact & Professional Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.phone')} *
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98250 12345"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.whatsapp')} *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98250 12345"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@finwealthadvisors.in"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.location')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ahmedabad & Mumbai, India"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.website')}
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://finwealthadvisors.in"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.professionalDetails')}
              </label>
              <input
                type="text"
                value={professionalDetails}
                onChange={(e) => setProfessionalDetails(e.target.value)}
                placeholder="AMFI Reg. ARN-184920 | NISM Series V-A"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Language-Aware Default CTA & Disclaimer */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Language-Aware Call-to-Action & Disclaimers</span>
          </h2>

          {/* Default CTA */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('profile.defaultCTA')}
              </label>
              <button
                type="button"
                onClick={handleResetCtaToLanguage}
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to {language.toUpperCase()} Default</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={defaultCTA}
              onChange={(e) => setDefaultCTA(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Default Disclaimer */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('profile.defaultDisclaimer')}
              </label>
              <button
                type="button"
                onClick={handleResetDisclaimerToLanguage}
                className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to {language.toUpperCase()} Default</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={defaultDisclaimer}
              onChange={(e) => setDefaultDisclaimer(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Profile Branding Automation Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>{t('profile.brandingSettings')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              { id: 'autoApplyBranding', label: t('profile.autoApplyBranding') },
              { id: 'autoApplyPhoto', label: t('profile.autoApplyPhoto') },
              { id: 'autoApplyName', label: t('profile.autoApplyName') },
              { id: 'autoApplyDesignation', label: t('profile.autoApplyDesignation') },
              { id: 'autoApplyContact', label: t('profile.autoApplyContact') },
              { id: 'autoApplyDefaultCta', label: t('profile.autoApplyCTA') },
              { id: 'autoApplyDisclaimer', label: t('profile.autoApplyDisclaimer') },
            ].map((toggle) => {
              const checked = Boolean((brandingPrefs as any)[toggle.id]);
              return (
                <label
                  key={toggle.id}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      setBrandingPrefs({
                        ...brandingPrefs,
                        [toggle.id]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {toggle.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={resetToDefaultProfile}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Reset to Sample Advisor Profile
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all"
          >
            {t('profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
};
