import React, { useState } from 'react';
import { useClientCrm, ClientProfile, ClientCategory, ClientStatus } from '../../context/ClientCrmContext';
import {
  Users,
  UserPlus,
  Search,
  Cake,
  Heart,
  Phone,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Calendar,
  Trash2,
  Edit2,
  X,
  Check,
  Building,
  DollarSign,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

interface ClientCrmViewProps {
  onNavigateToGreetings: (tab: 'birthday' | 'anniversary' | 'festivals', recipientName: string) => void;
  onNavigate: (view: string) => void;
}

export const ClientCrmView: React.FC<ClientCrmViewProps> = ({
  onNavigateToGreetings,
  onNavigate,
}) => {
  const {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getUpcomingBirthdays,
    getUpcomingAnniversaries,
  } = useClientCrm();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<ClientProfile | null>(null);

  // Add/Edit Form State
  const [formName, setFormName] = useState<string>('');
  const [formPhone, setFormPhone] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formCategory, setFormCategory] = useState<ClientCategory>('sip_investor');
  const [formBirthDate, setFormBirthDate] = useState<string>('');
  const [formAnniversaryDate, setFormAnniversaryDate] = useState<string>('');
  const [formFolio, setFormFolio] = useState<string>('');
  const [formSip, setFormSip] = useState<string>('');
  const [formAum, setFormAum] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('Ahmedabad');
  const [formNotes, setFormNotes] = useState<string>('');

  const upcomingBirthdays = getUpcomingBirthdays(30);
  const upcomingAnniversaries = getUpcomingAnniversaries(30);

  // Overall Stats
  const totalSip = clients.reduce((acc, c) => acc + (c.monthlySipAmount || 0), 0);
  const totalAum = clients.reduce((acc, c) => acc + (c.totalAum || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const filteredClients = clients.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.folioOrArn && c.folioOrArn.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openAddModal = () => {
    setEditingClient(null);
    setFormName('');
    setFormPhone('+91 ');
    setFormEmail('');
    setFormCategory('sip_investor');
    setFormBirthDate('');
    setFormAnniversaryDate('');
    setFormFolio('');
    setFormSip('');
    setFormAum('');
    setFormCity('Ahmedabad');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (client: ClientProfile) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormPhone(client.phone);
    setFormEmail(client.email || '');
    setFormCategory(client.category);
    setFormBirthDate(client.birthDate || '');
    setFormAnniversaryDate(client.anniversaryDate || '');
    setFormFolio(client.folioOrArn || '');
    setFormSip(client.monthlySipAmount ? client.monthlySipAmount.toString() : '');
    setFormAum(client.totalAum ? client.totalAum.toString() : '');
    setFormCity(client.city || '');
    setFormNotes(client.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const payload = {
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || undefined,
      category: formCategory,
      birthDate: formBirthDate || undefined,
      anniversaryDate: formAnniversaryDate || undefined,
      folioOrArn: formFolio.trim() || undefined,
      monthlySipAmount: formSip ? parseFloat(formSip) : undefined,
      totalAum: formAum ? parseFloat(formAum) : undefined,
      city: formCity.trim() || undefined,
      notes: formNotes.trim() || undefined,
      status: 'active' as ClientStatus,
    };

    if (editingClient) {
      updateClient(editingClient.id, payload);
    } else {
      addClient(payload);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold tracking-wide backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Advisor Client Relationship CRM</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigateToGreetings('festivals', '')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all"
              >
                Send Festival Wishes
              </button>

              <button
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/30 flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Client</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Client Portfolio & Milestone CRM
          </h1>

          <p className="text-indigo-200/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Manage your client accounts, track monthly SIP volumes, and automate relationship touches for birthdays and anniversaries with 1-click personalized posters.
          </p>

          {/* Quick Stats Grid */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-indigo-200 font-semibold block">Total Clients</span>
              <span className="text-xl sm:text-2xl font-black text-white">{clients.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-emerald-300 font-semibold block">Monthly SIP Book</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{formatCurrency(totalSip)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <span className="text-[11px] text-indigo-200 font-semibold block">Total AUM Tracked</span>
              <span className="text-lg sm:text-xl font-black text-white">{formatCurrency(totalAum)}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
              <span className="text-[11px] text-amber-200 font-semibold block">Milestones (30 Days)</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                {upcomingBirthdays.length + upcomingAnniversaries.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* UPCOMING MILESTONES BANNER (Birthdays & Anniversaries) */}
      {(upcomingBirthdays.length > 0 || upcomingAnniversaries.length > 0) && (
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cake className="w-5 h-5 text-amber-600 animate-bounce" />
              <h3 className="font-black text-amber-950 text-sm sm:text-base">
                Upcoming Client Milestones this Month
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800">
              {upcomingBirthdays.length} Birthdays • {upcomingAnniversaries.length} Anniversaries
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingBirthdays.map(({ client, daysUntil }) => (
              <div
                key={`bday_${client.id}`}
                className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">🎂</span>
                    <span className="font-bold text-xs text-slate-900 truncate">{client.name}</span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    {daysUntil === 0 ? 'Today! 🎉' : `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToGreetings('birthday', client.name)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 transition-all active:scale-95"
                >
                  Send Card
                </button>
              </div>
            ))}

            {upcomingAnniversaries.map(({ client, daysUntil }) => (
              <div
                key={`anni_${client.id}`}
                className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">💍</span>
                    <span className="font-bold text-xs text-slate-900 truncate">{client.name}</span>
                  </div>
                  <span className="text-[11px] text-rose-700 font-semibold">
                    {daysUntil === 0 ? 'Today! 💐' : `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToGreetings('anniversary', client.name)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shrink-0 transition-all active:scale-95"
                >
                  Send Card
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, folio, city..."
              className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Clients' },
              { id: 'sip_investor', label: 'SIP Investors' },
              { id: 'hni', label: 'HNI Clients' },
              { id: 'retiree', label: 'Retirees / SWP' },
              { id: 'retail', label: 'Retail' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* CLIENTS LIST */}
        {filteredClients.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No clients match your filter. Click &ldquo;Add Client&rdquo; above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredClients.map((client) => {
              const cleanPhone = client.phone.replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`;

              return (
                <div
                  key={client.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-2xl transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-black text-slate-900 truncate">{client.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {client.category.replace('_', ' ')}
                      </span>
                      {client.city && (
                        <span className="text-[11px] text-slate-400 font-medium">📍 {client.city}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>📱 {client.phone}</span>
                      {client.monthlySipAmount ? (
                        <span className="font-bold text-emerald-700">
                          SIP: {formatCurrency(client.monthlySipAmount)}/mo
                        </span>
                      ) : null}
                      {client.totalAum ? (
                        <span>AUM: {formatCurrency(client.totalAum)}</span>
                      ) : null}
                      {client.folioOrArn && (
                        <span className="font-mono text-[11px] text-slate-400">Folio: {client.folioOrArn}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center space-x-1"
                      title="Open WhatsApp chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onNavigateToGreetings('birthday', client.name)}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center space-x-1"
                      title="Generate Birthday Wish"
                    >
                      <Cake className="w-4 h-4" />
                      <span className="hidden sm:inline">Greeting</span>
                    </button>

                    <button
                      onClick={() => openEditModal(client)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs"
                      title="Edit Client"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${client.name}?`)) {
                          deleteClient(client.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 text-xs transition-colors"
                      title="Delete Client"
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

      {/* ADD / EDIT CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingClient ? 'Edit Client Record' : 'Add New Client Profile'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. અમિતભાઈ પટેલ (Amit Patel)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    placeholder="+91 98251 23456"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ClientCategory)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sip_investor">SIP Investor</option>
                    <option value="hni">HNI Client</option>
                    <option value="retiree">Retiree / SWP</option>
                    <option value="retail">Retail Client</option>
                    <option value="nri">NRI Investor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Birth Date (for Greetings)</label>
                  <input
                    type="date"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Anniversary Date</label>
                  <input
                    type="date"
                    value={formAnniversaryDate}
                    onChange={(e) => setFormAnniversaryDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly SIP (₹)</label>
                  <input
                    type="number"
                    value={formSip}
                    onChange={(e) => setFormSip(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total AUM (₹)</label>
                  <input
                    type="number"
                    value={formAum}
                    onChange={(e) => setFormAum(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Folio / ARN ID</label>
                  <input
                    type="text"
                    value={formFolio}
                    onChange={(e) => setFormFolio(e.target.value)}
                    placeholder="e.g. MF-109283"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Ahmedabad"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Advisor Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key goals, family members, risk tolerance..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/30"
                >
                  {editingClient ? 'Save Changes' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
