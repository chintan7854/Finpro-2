import React, { useState } from 'react';
import { useLeadGen, Lead, LeadSource, LeadInterest, LeadStatus } from '../../context/LeadGenContext';
import { useAdvisor } from '../../context/AdvisorContext';
import {
  TrendingUp,
  UserPlus,
  Search,
  MessageCircle,
  Phone,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Trash2,
  X,
  Clock,
  Target,
  Send,
} from 'lucide-react';

interface LeadGenerationViewProps {
  onNavigateToGreetings: (tab: 'birthday' | 'anniversary' | 'festivals', recipientName: string) => void;
  onNavigate: (view: string) => void;
}

export const LeadGenerationView: React.FC<LeadGenerationViewProps> = ({
  onNavigateToGreetings,
  onNavigate,
}) => {
  const { leads, addLead, updateLead, deleteLead, convertToClient } = useLeadGen();
  const { profile } = useAdvisor();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [interestFilter, setInterestFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('+91 ');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formSource, setFormSource] = useState<LeadSource>('whatsapp_forward');
  const [formInterest, setFormInterest] = useState<LeadInterest>('sip');
  const [formStatus, setFormStatus] = useState<LeadStatus>('new');
  const [formAmount, setFormAmount] = useState<string>('15000');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formFollowUp, setFormFollowUp] = useState<string>('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // Pipeline counts
  const newCount = leads.filter((l) => l.status === 'new').length;
  const contactedCount = leads.filter((l) => l.status === 'contacted').length;
  const meetingCount = leads.filter((l) => l.status === 'meeting_scheduled').length;
  const convertedCount = leads.filter((l) => l.status === 'converted').length;
  const totalPotential = leads.reduce((acc, l) => acc + (l.potentialAmount || 0), 0);

  const filteredLeads = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (interestFilter !== 'all' && l.interest !== interestFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.notes && l.notes.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    addLead({
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || undefined,
      source: formSource,
      interest: formInterest,
      status: formStatus,
      potentialAmount: formAmount ? parseFloat(formAmount) : undefined,
      notes: formNotes.trim() || undefined,
      followUpDate: formFollowUp || undefined,
    });

    setIsAddModalOpen(false);
  };

  const getInterestLabel = (interest: LeadInterest) => {
    switch (interest) {
      case 'sip': return 'Monthly SIP';
      case 'mutual_funds': return 'Mutual Funds Lumpsum';
      case 'tax_saving': return '80C ELSS Tax Saving';
      case 'retirement': return 'Retirement / SWP';
      case 'child_education': return 'Child Higher Education';
      case 'term_insurance': return 'Pure Term Insurance';
      case 'health_insurance': return 'Health Cover';
      case 'portfolio_review': return 'Portfolio Health Check';
    }
  };

  const getIntroMessage = (lead: Lead) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;

    const interestLabel = getInterestLabel(lead.interest);
    const msg = `નમસ્તે ${lead.name},\n\nહું ${profile.advisorName} (${profile.designation || 'Certified Financial Planner'}).\n\nતમે ${interestLabel} અંગે રસ દર્શાવ્યો હતો. આપના પરિવારના નાણાકીય લક્ષ્યાંકો મુજબ યોગ્ય રોડમેપ અને ગણતરી સમજવા માટે આજે આપણે ૧૦ મિનિટ વાત કરી શકીએ?\n\nઆપનો અનુકૂળ સમય જણાવશો.\n\nઆભાર,\n${profile.advisorName}\n📱 ${profile.phoneNumber}`;

    return `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-emerald-500/20">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold tracking-wide backdrop-blur-md">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lead Acquisition Pipeline</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('story-studio')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
              >
                Create Viral Story Lead Magnet
              </button>

              <button
                onClick={() => {
                  setFormName('');
                  setFormPhone('+91 ');
                  setFormEmail('');
                  setFormNotes('');
                  setFormFollowUp('');
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/30 flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Capture Lead</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Client Inquiries & Lead Conversion Engine
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Capture interested investors who respond to your WhatsApp stories, posters, and referrals. Follow up with 1-click tailored pitches and convert them into long-term SIP clients.
          </p>

          {/* Pipeline Funnel Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-emerald-200 font-semibold block">New Inquiries</span>
              <span className="text-xl sm:text-2xl font-black text-white">{newCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-teal-200 font-semibold block">In Discussions</span>
              <span className="text-xl sm:text-2xl font-black text-teal-300">{contactedCount + meetingCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-emerald-300 font-semibold block">Converted to Clients</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">{convertedCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-emerald-200 font-semibold block">Potential Pipeline</span>
              <span className="text-base sm:text-lg font-black text-white">{formatCurrency(totalPotential)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, phone..."
              className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'new', label: 'New Inquiries' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'meeting_scheduled', label: 'Meeting Scheduled' },
              { id: 'converted', label: 'Converted' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* LEADS LIST */}
        {filteredLeads.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <Target className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No leads match your filter. Click &ldquo;Capture Lead&rdquo; above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => {
              const introUrl = getIntroMessage(lead);

              return (
                <div
                  key={lead.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-2xl transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-black text-slate-900 truncate">{lead.name}</h4>

                      {/* Status Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          lead.status === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800'
                            : lead.status === 'meeting_scheduled'
                            ? 'bg-indigo-100 text-indigo-800'
                            : lead.status === 'converted'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                        {getInterestLabel(lead.interest)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>📱 {lead.phone}</span>
                      {lead.potentialAmount ? (
                        <span className="font-bold text-emerald-700">
                          Potential: {formatCurrency(lead.potentialAmount)}
                        </span>
                      ) : null}
                      {lead.source && (
                        <span className="text-[11px] text-slate-400">Source: {lead.source.replace('_', ' ')}</span>
                      )}
                      {lead.followUpDate && (
                        <span className="text-[11px] text-amber-700 font-semibold">
                          Follow-up: {lead.followUpDate}
                        </span>
                      )}
                    </div>

                    {lead.notes && (
                      <p className="text-[11px] text-slate-600 italic line-clamp-1">{lead.notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {/* 1-Click WhatsApp Pitch Outreach */}
                    <a
                      href={introUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Pitch on WA</span>
                    </a>

                    {/* Convert to Client button */}
                    {lead.status !== 'converted' ? (
                      <button
                        onClick={() => {
                          convertToClient(lead.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Convert</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
                        ✓ Converted
                      </span>
                    )}

                    {/* Status Changer */}
                    <select
                      value={lead.status}
                      onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}
                      className="px-2 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="meeting_scheduled">Meeting</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>

                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-base">Capture Investor Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prospect Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. વિજયભાઈ ત્રિવેદી (Vijay Trivedi)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 97241 11223"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Financial Interest</label>
                  <select
                    value={formInterest}
                    onChange={(e) => setFormInterest(e.target.value as LeadInterest)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="sip">Monthly SIP</option>
                    <option value="mutual_funds">Mutual Funds Lumpsum</option>
                    <option value="tax_saving">80C Tax Saving ELSS</option>
                    <option value="retirement">Retirement / SWP</option>
                    <option value="child_education">Child Higher Education</option>
                    <option value="term_insurance">Pure Term Insurance</option>
                    <option value="health_insurance">Health Insurance</option>
                    <option value="portfolio_review">Portfolio Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as LeadSource)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="whatsapp_forward">WhatsApp Story / Forward</option>
                    <option value="social_media">Social Media (LinkedIn/FB/Insta)</option>
                    <option value="poster">Branded Poster</option>
                    <option value="referral">Client Referral</option>
                    <option value="seminar">Investor Awareness Seminar</option>
                    <option value="other">Other Inbound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Potential Monthly / Lump Sum (₹)</label>
                  <input
                    type="number"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="15000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={formFollowUp}
                  onChange={(e) => setFormFollowUp(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Query Details</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Client questions, time to call..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
