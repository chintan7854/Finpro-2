import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Globe,
  FileBadge,
  Sparkles,
  ShieldCheck,
  Check,
  User,
  Star,
} from 'lucide-react';
import { AdvisorProfile } from '../../types';

interface ProfilePreviewModalProps {
  isOpen: boolean;
  profile: AdvisorProfile;
  onClose: () => void;
  onSelectActive?: () => void;
  isActive?: boolean;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSelectActive,
  isActive = false,
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'poster' | 'whatsapp'>('card');

  if (!isOpen) return null;

  const displayPhoto =
    profile.photoBackgroundMode === 'without_bg' && profile.noBgProfilePhoto
      ? profile.noBgProfilePhoto
      : profile.croppedProfilePhoto || profile.profilePhoto;

  const displayLogo = profile.croppedLogo || profile.logo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {profile.profileName || 'Advisor Profile'}
                </h3>
                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Active Profile
                  </span>
                )}
                {profile.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center space-x-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span>Default</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Live Branding & Multi-Channel Placement Preview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 flex space-x-4 bg-slate-50/50">
          {[
            { id: 'card', label: 'Digital Card' },
            { id: 'poster', label: 'Poster Header & Footer' },
            { id: 'whatsapp', label: 'WhatsApp Signature' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'card' && (
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 shadow-xl overflow-hidden border border-slate-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div
                    className={`w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-emerald-500/30 shadow-lg ${
                      profile.photoBackgroundMode === 'without_bg' ? 'bg-slate-800/80' : 'bg-slate-800'
                    }`}
                  >
                    {displayPhoto ? (
                      <img
                        src={displayPhoto}
                        alt={profile.advisorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  {profile.photoBackgroundMode === 'without_bg' && (
                    <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md bg-indigo-600 text-[9px] font-bold text-white shadow-xs">
                      Transparent
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xl font-extrabold tracking-tight text-white">
                        {profile.advisorName || 'Advisor Name'}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-400">
                        {profile.designation || 'Financial Planner'}
                      </p>
                    </div>
                    {displayLogo && (
                      <div className="h-10 w-24 bg-white/10 rounded-xl p-1.5 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                        <img src={displayLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>

                  {profile.achievement && (
                    <p className="text-[11px] text-slate-300 font-medium pt-1">
                      {profile.achievement}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs text-slate-300">
                    <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{profile.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{profile.whatsappNumber || profile.phoneNumber || 'Not provided'}</span>
                    </div>
                    {profile.email && (
                      <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}
                    {profile.location && (
                      <div className="flex items-center justify-center sm:justify-start space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {profile.professionalDetails && (
                    <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-700/60 mt-2">
                      <FileBadge className="w-3 h-3 text-emerald-400 inline mr-1" />
                      <span>{profile.professionalDetails}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'poster' && (
            <div className="space-y-4">
              {/* Header preview */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                    {displayPhoto ? (
                      <img src={displayPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400 m-2.5" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{profile.advisorName}</div>
                    <div className="text-[11px] text-slate-500">{profile.designation}</div>
                  </div>
                </div>
                {displayLogo && (
                  <img src={displayLogo} alt="Logo" className="h-8 max-w-24 object-contain" />
                )}
              </div>

              {/* Poster card mock */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-2 text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                  Daily Wealth Wisdom
                </span>
                <h5 className="text-base font-extrabold">The Power of 15-Year Systematic Investing</h5>
                <p className="text-xs text-emerald-100">
                  Disciplined investing beats market timing. Stay aligned with your financial roadmap.
                </p>
              </div>

              {/* Footer preview */}
              <div className="p-3 rounded-xl bg-slate-900 text-white text-[11px] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{profile.phoneNumber}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {profile.professionalDetails?.split('|')[0] || 'Certified Wealth Advisor'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-800 space-y-3 font-mono">
              <p className="text-slate-600">
                Dear Investor, here is your monthly financial update and market analysis...
              </p>
              <div className="pt-2 border-t border-emerald-200/80 space-y-1 font-sans">
                <div className="font-bold text-slate-900">
                  Warm regards,
                  <br />
                  {profile.advisorName || 'Financial Advisor'}
                </div>
                <div className="text-xs text-emerald-800 font-semibold">{profile.designation}</div>
                {profile.achievement && (
                  <div className="text-[11px] text-slate-600">{profile.achievement}</div>
                )}
                <div className="text-xs text-slate-700 pt-1">
                  📞 Mobile / WhatsApp: {profile.whatsappNumber || profile.phoneNumber}
                </div>
                {profile.email && <div className="text-xs text-slate-700">✉️ Email: {profile.email}</div>}
                {profile.website && <div className="text-xs text-slate-700">🌐 Web: {profile.website}</div>}
                <div className="text-[10px] text-slate-500 pt-1 italic">
                  {profile.defaultDisclaimer}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
          >
            Close
          </button>

          {!isActive && onSelectActive && (
            <button
              type="button"
              onClick={() => {
                onSelectActive();
                onClose();
              }}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Make This Active Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
