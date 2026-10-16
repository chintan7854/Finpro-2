import React, { useState, useRef, useEffect } from 'react';
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
  Image as ImageIcon,
  Crop as CropIcon,
  Layers,
  Star,
  Copy,
  Trash2,
  Eye,
  Plus,
  ChevronDown,
  Building,
  CheckCircle2,
  AlertCircle,
  Palette,
} from 'lucide-react';
import { LanguageCode, AdvisorProfile } from '../types';
import { ImageCropModal } from './profile/ImageCropModal';
import { BackgroundRemovalModal } from './profile/BackgroundRemovalModal';
import { ManageProfilesModal } from './profile/ManageProfilesModal';
import { ProfilePreviewModal } from './profile/ProfilePreviewModal';
import { optimizeImage } from '../services/imageOptimizer';

const COUNTRY_CODES = [
  { code: '+91', country: 'India (भारत)', flag: '🇮🇳' },
  { code: '+1', country: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

const BRAND_COLOR_PRESETS = [
  { hex: '#059669', name: 'Emerald Green' },
  { hex: '#2563eb', name: 'Royal Blue' },
  { hex: '#0f766e', name: 'Deep Teal' },
  { hex: '#7c3aed', name: 'Vibrant Purple' },
  { hex: '#dc2626', name: 'Crimson' },
  { hex: '#d97706', name: 'Warm Amber' },
  { hex: '#0f172a', name: 'Midnight Slate' },
];

export const ProfileView: React.FC = () => {
  const { language, t, getDefaultCta, getDefaultDisclaimer } = useI18n();
  const {
    profile,
    profiles,
    activeProfileId,
    defaultProfileId,
    switchActiveProfile,
    createProfile,
    updateProfile,
    duplicateProfile,
    renameProfile,
    setDefaultProfile,
    deleteProfile,
    resetProfileSettings,
    resetToDefaultProfile,
  } = useAdvisor();

  // Mode: editing an existing profile or creating a new profile
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form Fields
  const [profileName, setProfileName] = useState<string>('');
  const [advisorName, setAdvisorName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [achievement, setAchievement] = useState<string>('');
  const [qualifications, setQualifications] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [officeAddress, setOfficeAddress] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [professionalDetails, setProfessionalDetails] = useState<string>('');

  // Photos & Visual Assets
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [originalProfilePhoto, setOriginalProfilePhoto] = useState<string>('');
  const [croppedProfilePhoto, setCroppedProfilePhoto] = useState<string>('');
  const [noBgProfilePhoto, setNoBgProfilePhoto] = useState<string>('');
  const [photoBackgroundMode, setPhotoBackgroundMode] = useState<'with_bg' | 'without_bg'>('with_bg');

  // Logo
  const [logo, setLogo] = useState<string>('');
  const [originalLogo, setOriginalLogo] = useState<string>('');
  const [croppedLogo, setCroppedLogo] = useState<string>('');

  // Branding
  const [brandName, setBrandName] = useState<string>('');
  const [brandColor, setBrandColor] = useState<string>('#059669');
  const [defaultCTA, setDefaultCTA] = useState<string>('');
  const [defaultDisclaimer, setDefaultDisclaimer] = useState<string>('');
  const [brandingPrefs, setBrandingPrefs] = useState(profile.brandingPreferences);

  // Notifications and Modals
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modals state
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  const [cropTarget, setCropTarget] = useState<'photo' | 'logo'>('photo');
  const [imageToCrop, setImageToCrop] = useState<string>('');

  const [isBgRemovalModalOpen, setIsBgRemovalModalOpen] = useState<boolean>(false);
  const [isManageProfilesOpen, setIsManageProfilesOpen] = useState<boolean>(false);
  const [previewProfileData, setPreviewProfileData] = useState<AdvisorProfile | null>(null);

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Populate form based on active profile or blank for create-mode
  const loadProfileIntoForm = (prof: AdvisorProfile) => {
    setIsCreatingNew(false);
    setProfileName(prof.profileName || '');
    setAdvisorName(prof.advisorName || '');
    setDesignation(prof.designation || '');
    setAchievement(prof.achievement || '');
    setQualifications(prof.qualifications || '');
    setCountryCode(prof.countryCode || '+91');
    setPhoneNumber(prof.phoneNumber || '');
    setWhatsappNumber(prof.whatsappNumber || '');
    setEmail(prof.email || '');
    setLocation(prof.location || '');
    setOfficeAddress(prof.officeAddress || '');
    setWebsite(prof.website || '');
    setProfessionalDetails(prof.professionalDetails || '');
    setProfilePhoto(prof.profilePhoto || '');
    setOriginalProfilePhoto(prof.originalProfilePhoto || prof.profilePhoto || '');
    setCroppedProfilePhoto(prof.croppedProfilePhoto || '');
    setNoBgProfilePhoto(prof.noBgProfilePhoto || '');
    setPhotoBackgroundMode(prof.photoBackgroundMode || 'with_bg');
    setLogo(prof.logo || '');
    setOriginalLogo(prof.originalLogo || prof.logo || '');
    setCroppedLogo(prof.croppedLogo || '');
    setBrandName(prof.brandName || '');
    setBrandColor(prof.brandColor || '#059669');
    setDefaultCTA(prof.defaultCTA || getDefaultCta(language));
    setDefaultDisclaimer(prof.defaultDisclaimer || getDefaultDisclaimer(language));
    setBrandingPrefs(prof.brandingPreferences);
    setValidationError(null);
  };

  const loadBlankCreateForm = () => {
    setIsCreatingNew(true);
    setProfileName('');
    setAdvisorName('');
    setDesignation('');
    setAchievement('');
    setQualifications('');
    setCountryCode('+91');
    setPhoneNumber('');
    setWhatsappNumber('');
    setEmail('');
    setLocation('');
    setOfficeAddress('');
    setWebsite('');
    setProfessionalDetails('');
    setProfilePhoto('');
    setOriginalProfilePhoto('');
    setCroppedProfilePhoto('');
    setNoBgProfilePhoto('');
    setPhotoBackgroundMode('with_bg');
    setLogo('');
    setOriginalLogo('');
    setCroppedLogo('');
    setBrandName('');
    setBrandColor('#059669');
    setDefaultCTA(getDefaultCta(language));
    setDefaultDisclaimer(getDefaultDisclaimer(language));
    setBrandingPrefs(profile.brandingPreferences);
    setValidationError(null);
  };

  // Sync with active profile when it changes from outside
  useEffect(() => {
    if (!isCreatingNew) {
      loadProfileIntoForm(profile);
    }
  }, [profile.id]);

  // Handle Photo upload -> optimize and open crop editor immediately
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      optimizeImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.90 })
        .then((optimizedUri) => {
          setOriginalProfilePhoto(optimizedUri);
          setImageToCrop(optimizedUri);
          setCropTarget('photo');
          setIsCropModalOpen(true);
        })
        .catch(() => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const rawUri = reader.result as string;
            setOriginalProfilePhoto(rawUri);
            setImageToCrop(rawUri);
            setCropTarget('photo');
            setIsCropModalOpen(true);
          };
          reader.readAsDataURL(file);
        });
    }
  };

  // Handle Logo upload -> optimize and open crop/position editor immediately
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      optimizeImage(file, { maxWidth: 800, maxHeight: 800, preserveTransparency: true, quality: 0.90 })
        .then((optimizedUri) => {
          setOriginalLogo(optimizedUri);
          setImageToCrop(optimizedUri);
          setCropTarget('logo');
          setIsCropModalOpen(true);
        })
        .catch(() => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const rawUri = reader.result as string;
            setOriginalLogo(rawUri);
            setImageToCrop(rawUri);
            setCropTarget('logo');
            setIsCropModalOpen(true);
          };
          reader.readAsDataURL(file);
        });
    }
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!advisorName.trim()) {
      setValidationError('Advisor Full Name is required.');
      return;
    }
    if (!designation.trim()) {
      setValidationError('Professional Designation is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError('Mobile Number is required.');
      return;
    }

    const payload: Partial<AdvisorProfile> = {
      profileName: profileName.trim() || `${advisorName.trim()} — Profile`,
      advisorName: advisorName.trim(),
      designation: designation.trim(),
      achievement: achievement.trim(),
      qualifications: qualifications.trim(),
      countryCode,
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
      email: email.trim(),
      location: location.trim(),
      officeAddress: officeAddress.trim(),
      website: website.trim(),
      professionalDetails: professionalDetails.trim(),
      profilePhoto:
        photoBackgroundMode === 'without_bg' && noBgProfilePhoto
          ? noBgProfilePhoto
          : croppedProfilePhoto || profilePhoto || originalProfilePhoto,
      originalProfilePhoto,
      croppedProfilePhoto,
      noBgProfilePhoto,
      photoBackgroundMode,
      logo: croppedLogo || logo || originalLogo,
      originalLogo,
      croppedLogo,
      brandName: brandName.trim(),
      brandColor,
      defaultCTA: defaultCTA.trim(),
      defaultDisclaimer: defaultDisclaimer.trim(),
      brandingPreferences: brandingPrefs,
    };

    if (isCreatingNew) {
      const created = createProfile(payload);
      setIsCreatingNew(false);
      loadProfileIntoForm(created);
    } else {
      updateProfile(payload, profile.id);
    }

    setSavedBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSavedBanner(false), 4000);
  };

  // Quick Action: Copy Mobile to WhatsApp
  const handleCopyMobileToWhatsapp = () => {
    setWhatsappNumber(phoneNumber);
  };

  // Presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=320&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=320&q=80',
  ];

  const currentDisplayPhoto =
    photoBackgroundMode === 'without_bg' && noBgProfilePhoto
      ? noBgProfilePhoto
      : croppedProfilePhoto || profilePhoto || originalProfilePhoto;

  const currentDisplayLogo = croppedLogo || logo || originalLogo;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 md:pb-16">
      {/* Top Banner: Master Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>{t('profile.title')}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Multi-Profile System
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage independent advisor profiles, branding assets, free background removal, and website-wide identities.
          </p>
        </div>

        {/* Global Manage Profiles Button */}
        <button
          type="button"
          onClick={() => setIsManageProfilesOpen(true)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 shadow-xs transition-colors shrink-0"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Manage All Profiles ({profiles.length})</span>
        </button>
      </div>

      {/* Success Banner */}
      {savedBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center space-x-2.5 shadow-sm animate-in fade-in duration-200">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully! Applied across all website modules.</span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-sm font-semibold flex items-center space-x-2.5 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SECTION A: ACTIVE PROFILE SELECTOR & QUICK SWITCHER */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 rounded-3xl border-2 border-emerald-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              Active Advisor Profile
            </span>
            {profile.isDefault && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center space-x-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>Default</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewProfileData(profile)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preview Card & Branding</span>
            </button>

            <button
              type="button"
              onClick={() => duplicateProfile(profile.id)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1 shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-600" />
              <span>Duplicate Profile</span>
            </button>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <select
              value={isCreatingNew ? 'create_new_action' : activeProfileId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'create_new_action') {
                  loadBlankCreateForm();
                } else if (val === 'manage_profiles_action') {
                  setIsManageProfilesOpen(true);
                } else {
                  setIsCreatingNew(false);
                  switchActiveProfile(val);
                }
              }}
              className="w-full text-xs sm:text-sm font-bold text-slate-900 py-3.5 px-4 pr-10 rounded-2xl bg-white border-2 border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none cursor-pointer shadow-xs"
            >
              <optgroup label="Saved Advisor Profiles">
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.profileName || p.advisorName || 'Advisor Profile'}
                    {p.id === activeProfileId ? ' (Active)' : ''}
                    {p.id === defaultProfileId ? ' ★ Default' : ''}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Actions">
                <option value="create_new_action">+ Create New Profile (Empty Form)</option>
                <option value="manage_profiles_action">⚙️ Manage All Profiles...</option>
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-emerald-700 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={loadBlankCreateForm}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Profile</span>
          </button>
        </div>

        {isCreatingNew && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span className="font-semibold">
              Currently creating a fresh advisor profile. All fields below start empty.
            </span>
            <button
              type="button"
              onClick={() => loadProfileIntoForm(profile)}
              className="text-amber-800 font-bold underline hover:text-amber-900 ml-2"
            >
              Cancel & Return to {profile.profileName}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: VISUAL ASSETS (PHOTO & LOGO) WITH BACKGROUND REMOVAL */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Visual Branding Assets & Photo Background</span>
            </h2>
            <span className="text-xs text-slate-500">
              Permanently Free In-Browser Background Removal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* 1. PROFILE PHOTO CARD */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  {t('profile.photo')}
                </label>
                {/* Background Mode Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    photoBackgroundMode === 'without_bg'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {photoBackgroundMode === 'without_bg'
                    ? 'Without Background (Transparent)'
                    : 'With Background'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Photo Preview Container */}
                <div
                  className="relative group shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md flex items-center justify-center bg-slate-100"
                  style={
                    photoBackgroundMode === 'without_bg'
                      ? {
                          backgroundImage:
                            'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                          backgroundSize: '12px 12px',
                          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
                        }
                      : {}
                  }
                >
                  {currentDisplayPhoto ? (
                    <img
                      src={currentDisplayPhoto}
                      alt="Advisor Portrait"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    title="Change Photo"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>

                {/* Upload & Crop Buttons */}
                <div className="space-y-2 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('profile.photoUpload')}</span>
                    </button>

                    {currentDisplayPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageToCrop(originalProfilePhoto || currentDisplayPhoto);
                          setCropTarget('photo');
                          setIsCropModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs"
                      >
                        <CropIcon className="w-3.5 h-3.5 text-slate-600" />
                        <span>Crop & Position</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    JPG or PNG. High resolution portrait for professional posters.
                  </p>
                </div>
              </div>

              {/* BACKGROUND PREFERENCE SELECTOR (WITH BG vs WITHOUT BG) */}
              {currentDisplayPhoto && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Background Mode:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPhotoBackgroundMode('with_bg')}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        photoBackgroundMode === 'with_bg'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <span className="text-xs">With Background</span>
                      {photoBackgroundMode === 'with_bg' && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (noBgProfilePhoto) {
                          setPhotoBackgroundMode('without_bg');
                        } else {
                          setIsBgRemovalModalOpen(true);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        photoBackgroundMode === 'without_bg'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <span className="text-xs flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        <span>Without Background</span>
                      </span>
                      {photoBackgroundMode === 'without_bg' && (
                        <Check className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setIsBgRemovalModalOpen(true)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {noBgProfilePhoto ? 'Adjust / Retest Background Removal' : 'Generate Free Transparent Cutout'}
                      </span>
                    </button>

                    {originalProfilePhoto && originalProfilePhoto !== currentDisplayPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setCroppedProfilePhoto('');
                          setProfilePhoto(originalProfilePhoto);
                        }}
                        className="text-slate-500 hover:text-slate-800 font-semibold flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restore Original</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Avatar Presets */}
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Or pick a preset avatar:
                </span>
                <div className="flex space-x-2">
                  {avatarPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setProfilePhoto(preset);
                        setOriginalProfilePhoto(preset);
                        setCroppedProfilePhoto('');
                        setNoBgProfilePhoto('');
                        setPhotoBackgroundMode('with_bg');
                      }}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                        currentDisplayPhoto === preset
                          ? 'border-emerald-600 ring-2 ring-emerald-400/30'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. COMPANY / AGENCY LOGO CARD */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  {t('profile.logo')}
                </label>
                <span className="text-[10px] font-medium text-slate-400">
                  Transparent PNG Recommended
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Logo Preview Container */}
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-xs">
                  {currentDisplayLogo ? (
                    <img
                      src={currentDisplayLogo}
                      alt="Company Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('profile.logoUpload')}</span>
                    </button>

                    {currentDisplayLogo && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageToCrop(originalLogo || currentDisplayLogo);
                          setCropTarget('logo');
                          setIsCropModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 shadow-2xs"
                      >
                        <CropIcon className="w-3.5 h-3.5 text-slate-600" />
                        <span>Adjust Position</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] pt-1">
                    {currentDisplayLogo && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogo('');
                          setOriginalLogo('');
                          setCroppedLogo('');
                        }}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Remove Logo
                      </button>
                    )}

                    {originalLogo && originalLogo !== currentDisplayLogo && (
                      <button
                        type="button"
                        onClick={() => setCroppedLogo('')}
                        className="text-slate-500 hover:text-slate-800 font-semibold"
                      >
                        Restore Original
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Accent Color */}
              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Brand Accent Colour:
                </span>
                <div className="flex items-center space-x-2">
                  {BRAND_COLOR_PRESETS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setBrandColor(color.hex)}
                      className={`w-7 h-7 rounded-xl transition-transform ${
                        brandColor === color.hex ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-7 h-7 rounded-xl border border-slate-300 cursor-pointer p-0 bg-transparent"
                    title="Custom Hex Color"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ADVISOR IDENTITY */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Profile Identity & Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Profile Label / Name *
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Chintan Raval — Main Profile"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Shown in the top profile switcher dropdown.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.name')} *
              </label>
              <input
                type="text"
                required
                value={advisorName}
                onChange={(e) => setAdvisorName(e.target.value)}
                placeholder="e.g. Chintan Raval"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
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
                placeholder="e.g. Certified Financial Planner (CFP) & Wealth Architect"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Educational Qualifications
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. CFP, NISM V-A & X-A, MBA (Finance), B.Com"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
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
                placeholder="e.g. Managing ₹140+ Cr AUM • 1,200+ Satisfied Families • 15+ Yrs Market Experience"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTACT & OFFICIAL CREDENTIALS */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Contact Details & Regulatory Registrations</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country Code + Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.phone')} *
              </label>
              <div className="flex space-x-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="text-xs font-bold p-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 98250 78540"
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* WhatsApp with Copy Button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('profile.whatsapp')} *
                </label>
                <button
                  type="button"
                  onClick={handleCopyMobileToWhatsapp}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800"
                >
                  Same as Mobile
                </button>
              </div>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g. +91 98250 78540"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
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
                placeholder="e.g. chintan.raval@finadvisorpro.in"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.location')} (City & State)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ahmedabad & Mumbai, India"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Office / Advisory Address
              </label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                placeholder="e.g. 402 Corporate Wealth Tower, S.G. Highway, Ahmedabad 380054"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.website')} / Advisory Portal
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://finadvisorpro.in"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('profile.professionalDetails')} (AMFI / ARN / RIA / IRDAI)
              </label>
              <input
                type="text"
                value={professionalDetails}
                onChange={(e) => setProfessionalDetails(e.target.value)}
                placeholder="e.g. AMFI Reg. ARN-184920 | NISM Series V-A | IRDAI Lic. 6749320"
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: LANGUAGE-AWARE DEFAULT CTA & DISCLAIMER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Call-to-Action & Compliance Disclaimer</span>
            </h2>
            <span className="text-xs text-slate-500">Language: {language.toUpperCase()}</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('profile.defaultCTA')}
              </label>
              <button
                type="button"
                onClick={() => setDefaultCTA(getDefaultCta(language))}
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('profile.defaultDisclaimer')}
              </label>
              <button
                type="button"
                onClick={() => setDefaultDisclaimer(getDefaultDisclaimer(language))}
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

        {/* SECTION 5: AUTOMATIC PERSONAL BRANDING TOGGLES */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{t('profile.brandingSettings')}</span>
            </h2>
            <span className="text-xs text-slate-400">Controls automated embedding in generated content</span>
          </div>

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

        {/* ACTION BAR FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => resetProfileSettings(profile.id)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              title="Resets CTA, disclaimers, and branding toggles to default without clearing personal information"
            >
              Reset Branding Settings
            </button>

            {profiles.length > 1 && !isCreatingNew && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete profile "${profile.profileName}"?`)) {
                    deleteProfile(profile.id);
                  }
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800"
              >
                Delete This Profile
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {isCreatingNew && (
              <button
                type="button"
                onClick={() => loadProfileIntoForm(profile)}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isCreatingNew ? 'Create & Activate Profile' : t('profile.save')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* MODALS */}
      {/* 1. Image Cropper Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={imageToCrop}
        title={cropTarget === 'photo' ? 'Crop & Adjust Profile Photo' : 'Adjust Company Logo'}
        subtitle={
          cropTarget === 'photo'
            ? 'Zoom, reposition, and choose the best portrait aspect ratio'
            : 'Position and zoom logo without distorting aspect ratio'
        }
        isLogo={cropTarget === 'logo'}
        hasOriginal={
          cropTarget === 'photo'
            ? Boolean(originalProfilePhoto)
            : Boolean(originalLogo)
        }
        onApply={(croppedUri) => {
          if (cropTarget === 'photo') {
            setCroppedProfilePhoto(croppedUri);
            setProfilePhoto(croppedUri);
          } else {
            setCroppedLogo(croppedUri);
            setLogo(croppedUri);
          }
          setIsCropModalOpen(false);
        }}
        onCancel={() => setIsCropModalOpen(false)}
        onReplaceFile={(file) => {
          const isTargetLogo = cropTarget === 'logo';
          optimizeImage(file, {
            maxWidth: isTargetLogo ? 800 : 1200,
            maxHeight: isTargetLogo ? 800 : 1200,
            preserveTransparency: isTargetLogo,
            quality: 0.90,
          })
            .then((optimizedUri) => {
              setImageToCrop(optimizedUri);
              if (cropTarget === 'photo') {
                setOriginalProfilePhoto(optimizedUri);
              } else {
                setOriginalLogo(optimizedUri);
              }
            })
            .catch(() => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const rawUri = reader.result as string;
                setImageToCrop(rawUri);
                if (cropTarget === 'photo') {
                  setOriginalProfilePhoto(rawUri);
                } else {
                  setOriginalLogo(rawUri);
                }
              };
              reader.readAsDataURL(file);
            });
        }}
        onRestoreOriginal={() => {
          if (cropTarget === 'photo' && originalProfilePhoto) {
            setImageToCrop(originalProfilePhoto);
          } else if (cropTarget === 'logo' && originalLogo) {
            setImageToCrop(originalLogo);
          }
        }}
        onRemove={() => {
          if (cropTarget === 'photo') {
            setProfilePhoto('');
            setCroppedProfilePhoto('');
            setOriginalProfilePhoto('');
            setNoBgProfilePhoto('');
          } else {
            setLogo('');
            setCroppedLogo('');
            setOriginalLogo('');
          }
          setIsCropModalOpen(false);
        }}
      />

      {/* 2. Background Removal Modal (With BG / Without BG) */}
      <BackgroundRemovalModal
        isOpen={isBgRemovalModalOpen}
        originalPhoto={originalProfilePhoto || profilePhoto}
        currentMode={photoBackgroundMode}
        savedTransparentPhoto={noBgProfilePhoto}
        onApply={(mode, transparentUri) => {
          setPhotoBackgroundMode(mode);
          if (transparentUri) {
            setNoBgProfilePhoto(transparentUri);
          }
          setIsBgRemovalModalOpen(false);
        }}
        onCancel={() => setIsBgRemovalModalOpen(false)}
      />

      {/* 3. Manage Profiles Modal */}
      <ManageProfilesModal
        isOpen={isManageProfilesOpen}
        profiles={profiles}
        activeProfileId={activeProfileId}
        defaultProfileId={defaultProfileId}
        onClose={() => setIsManageProfilesOpen(false)}
        onSelectActive={(id) => {
          switchActiveProfile(id);
        }}
        onSetDefault={(id) => {
          setDefaultProfile(id);
        }}
        onEdit={(id) => {
          switchActiveProfile(id);
        }}
        onCreateNew={() => {
          loadBlankCreateForm();
        }}
        onDuplicate={(id) => {
          duplicateProfile(id);
        }}
        onRename={(id, newName) => {
          renameProfile(id, newName);
        }}
        onDelete={(id) => {
          deleteProfile(id);
        }}
        onPreview={(p) => {
          setPreviewProfileData(p);
        }}
      />

      {/* 4. Profile Preview Modal */}
      {previewProfileData && (
        <ProfilePreviewModal
          isOpen={Boolean(previewProfileData)}
          profile={previewProfileData}
          onClose={() => setPreviewProfileData(null)}
          isActive={previewProfileData.id === activeProfileId}
          onSelectActive={() => {
            switchActiveProfile(previewProfileData.id);
          }}
        />
      )}
    </div>
  );
};
