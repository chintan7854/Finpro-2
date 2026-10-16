import React, { useState } from 'react';
import {
  X,
  Plus,
  Check,
  Copy,
  Edit3,
  Trash2,
  Star,
  Eye,
  User,
  AlertTriangle,
  Sparkles,
  Layers,
  Calendar,
  Building,
} from 'lucide-react';
import { AdvisorProfile } from '../../types';

interface ManageProfilesModalProps {
  isOpen: boolean;
  profiles: AdvisorProfile[];
  activeProfileId: string;
  defaultProfileId: string;
  onClose: () => void;
  onSelectActive: (id: string) => void;
  onSetDefault: (id: string) => void;
  onEdit: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onPreview: (profile: AdvisorProfile) => void;
}

export const ManageProfilesModal: React.FC<ManageProfilesModalProps> = ({
  isOpen,
  profiles,
  activeProfileId,
  defaultProfileId,
  onClose,
  onSelectActive,
  onSetDefault,
  onEdit,
  onCreateNew,
  onDuplicate,
  onRename,
  onDelete,
  onPreview,
}) => {
  const [profileToDelete, setProfileToDelete] = useState<AdvisorProfile | null>(null);
  const [profileToRename, setProfileToRename] = useState<AdvisorProfile | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.profileName || '').toLowerCase().includes(q) ||
      (p.advisorName || '').toLowerCase().includes(q) ||
      (p.designation || '').toLowerCase().includes(q)
    );
  });

  const handleStartRename = (prof: AdvisorProfile) => {
    setProfileToRename(prof);
    setRenameValue(prof.profileName || prof.advisorName || 'Advisor Profile');
  };

  const handleConfirmRename = () => {
    if (profileToRename && renameValue.trim()) {
      onRename(profileToRename.id, renameValue.trim());
      setProfileToRename(null);
    }
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      onDelete(profileToDelete.id);
      setProfileToDelete(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Manage Advisor Profiles ({profiles.length})
              </h3>
              <p className="text-xs text-slate-500">
                Switch, duplicate, set default, or customize independent advisor brandings
              </p>
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

        {/* Toolbar */}
        <div className="p-4 sm:px-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search profiles by name or designation..."
            className="text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none flex-1"
          />

          <button
            type="button"
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Profile</span>
          </button>
        </div>

        {/* Profiles List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <User className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No profiles found</p>
              <p className="text-xs text-slate-400">Try a different search or create a new profile.</p>
            </div>
          ) : (
            filteredProfiles.map((prof) => {
              const isActive = prof.id === activeProfileId;
              const isDefault = prof.id === defaultProfileId || Boolean(prof.isDefault);
              const displayPhoto =
                prof.photoBackgroundMode === 'without_bg' && prof.noBgProfilePhoto
                  ? prof.noBgProfilePhoto
                  : prof.croppedProfilePhoto || prof.profilePhoto;
              const displayLogo = prof.croppedLogo || prof.logo;

              return (
                <div
                  key={prof.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start sm:items-center space-x-3.5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        {displayPhoto ? (
                          <img
                            src={displayPhoto}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      {prof.photoBackgroundMode === 'without_bg' && (
                        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-indigo-600 text-[8px] font-bold text-white shadow-xs">
                          PNG
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {prof.profileName || prof.advisorName || 'Untitled Profile'}
                        </h4>

                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Active
                          </span>
                        )}

                        {isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center space-x-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>Default</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 truncate">
                        <span className="font-semibold text-slate-800">{prof.advisorName || 'No Name'}</span>
                        {prof.designation ? ` • ${prof.designation}` : ''}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
                        {prof.phoneNumber && <span>📞 {prof.phoneNumber}</span>}
                        {prof.location && <span>📍 {prof.location}</span>}
                        {prof.updatedAt && (
                          <span>
                            Updated {new Date(prof.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Make Active */}
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => onSelectActive(prof.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Set Active
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Current Active</span>
                      </span>
                    )}

                    {/* Set Default */}
                    {!isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefault(prof.id)}
                        title="Set as Default on Login"
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}

                    {/* Preview */}
                    <button
                      type="button"
                      onClick={() => onPreview(prof)}
                      title="Preview Branding"
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(prof.id);
                        onClose();
                      }}
                      title="Edit Profile"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => onDuplicate(prof.id)}
                      title="Duplicate Profile"
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Rename */}
                    <button
                      type="button"
                      onClick={() => handleStartRename(prof)}
                      title="Rename Profile Label"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold"
                    >
                      Abc
                    </button>

                    {/* Delete (prevent if only 1 profile) */}
                    {profiles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProfileToDelete(prof)}
                        title="Delete Profile"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {profiles.length} Independent Profile{profiles.length !== 1 ? 's' : ''} Configured
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>

      {/* Rename Dialog */}
      {profileToRename && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Rename Profile Label</h4>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full text-xs font-medium p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="e.g. Rajesh Sharma — Mutual Funds"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setProfileToRename(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {profileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-rose-200">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Confirm Deletion</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">{profileToDelete.profileName || profileToDelete.advisorName}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setProfileToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
