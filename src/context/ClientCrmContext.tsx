import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ClientCategory = 'sip_investor' | 'hni' | 'retail' | 'retiree' | 'nri';
export type ClientStatus = 'active' | 'prospect' | 'dormant';

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category: ClientCategory;
  birthDate?: string; // YYYY-MM-DD
  anniversaryDate?: string; // YYYY-MM-DD
  followUpDate?: string; // YYYY-MM-DD
  folioOrArn?: string;
  monthlySipAmount?: number;
  totalAum?: number;
  city?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  lastContactDate?: string;
}

export interface ClientCrmContextType {
  clients: ClientProfile[];
  totalClientsCount: number;
  followUpsDueToday: ClientProfile[];
  followUpsOverdue: ClientProfile[];
  upcomingBirthdays: { client: ClientProfile; daysUntil: number }[];
  upcomingAnniversaries: { client: ClientProfile; daysUntil: number }[];
  addClient: (client: Omit<ClientProfile, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<ClientProfile>) => void;
  deleteClient: (id: string) => void;
  getUpcomingBirthdays: (daysAhead?: number) => { client: ClientProfile; daysUntil: number }[];
  getUpcomingAnniversaries: (daysAhead?: number) => { client: ClientProfile; daysUntil: number }[];
}

const STORAGE_KEY = 'finadvisor_crm_clients';

const todayISO = new Date().toISOString().split('T')[0];

const SEED_CLIENTS: ClientProfile[] = [
  {
    id: 'cli_1',
    name: 'Amit Patel',
    phone: '+91 98251 23456',
    email: 'amit.patel@example.com',
    category: 'sip_investor',
    birthDate: '1986-10-14',
    anniversaryDate: '2012-11-20',
    followUpDate: todayISO, // Due today
    folioOrArn: 'MF-8729104',
    monthlySipAmount: 25000,
    totalAum: 1850000,
    city: 'Ahmedabad',
    notes: 'Long-term equity SIP investor. Interested in step-up SIP with 10% annual increment.',
    status: 'active',
    createdAt: '2024-01-15T10:00:00.000Z',
    lastContactDate: '2026-09-28',
  },
  {
    id: 'cli_2',
    name: 'Rajesh Shah',
    phone: '+91 98795 87654',
    email: 'rajesh.shah@example.com',
    category: 'hni',
    birthDate: '1975-10-18',
    anniversaryDate: '2001-10-12',
    followUpDate: '2026-10-08', // Overdue
    folioOrArn: 'MF-4491028',
    monthlySipAmount: 75000,
    totalAum: 8200000,
    city: 'Surat',
    notes: 'Textile business owner. Portfolio review every quarter.',
    status: 'active',
    createdAt: '2023-06-10T10:00:00.000Z',
    lastContactDate: '2026-10-02',
  },
  {
    id: 'cli_3',
    name: 'Bhavesh Mehta',
    phone: '+91 99099 34123',
    email: 'bhavesh.mehta@example.com',
    category: 'retiree',
    birthDate: '1962-12-05',
    anniversaryDate: '1988-02-14',
    followUpDate: '2026-10-20',
    folioOrArn: 'SWP-310928',
    monthlySipAmount: 0,
    totalAum: 5400000,
    city: 'Vadodara',
    notes: 'Retired PSU officer. Active SWP monthly payout of ₹35,000.',
    status: 'active',
    createdAt: '2023-11-20T10:00:00.000Z',
    lastContactDate: '2026-09-15',
  },
  {
    id: 'cli_4',
    name: 'Priti Joshi',
    phone: '+91 94280 67890',
    email: 'priti.joshi@example.com',
    category: 'retail',
    birthDate: '1992-10-25',
    anniversaryDate: '2018-12-08',
    followUpDate: todayISO, // Due today
    folioOrArn: 'MF-992014',
    monthlySipAmount: 10000,
    totalAum: 650000,
    city: 'Rajkot',
    notes: 'School teacher. Saving for daughter higher education fund.',
    status: 'active',
    createdAt: '2024-04-05T10:00:00.000Z',
    lastContactDate: '2026-10-01',
  },
  {
    id: 'cli_5',
    name: 'Suresh Nair',
    phone: '+91 98450 11223',
    email: 'suresh.nair@example.com',
    category: 'sip_investor',
    birthDate: '1988-11-02',
    anniversaryDate: '2015-05-18',
    folioOrArn: 'MF-610294',
    monthlySipAmount: 30000,
    totalAum: 2200000,
    city: 'Mumbai',
    notes: 'IT Senior Manager. Tax planning via ELSS and international fund allocation.',
    status: 'active',
    createdAt: '2024-02-10T10:00:00.000Z',
    lastContactDate: '2026-09-20',
  },
];

const ClientCrmContext = createContext<ClientCrmContextType | undefined>(undefined);

export const ClientCrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load CRM clients from localStorage', e);
    }
    return SEED_CLIENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (e) {
      console.warn('Failed to save CRM clients to localStorage', e);
    }
  }, [clients]);

  const addClient = (clientData: Omit<ClientProfile, 'id' | 'createdAt'>) => {
    const newClient: ClientProfile = {
      ...clientData,
      id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
  };

  const updateClient = (id: string, updates: Partial<ClientProfile>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const calculateDaysUntil = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length < 3) return null;

    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const now = new Date();
    const currentYear = now.getFullYear();

    let nextDate = new Date(currentYear, month, day);
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (nextDate.getTime() < todayZero.getTime()) {
      nextDate = new Date(currentYear + 1, month, day);
    }

    const diffMs = nextDate.getTime() - todayZero.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const getUpcomingBirthdays = (daysAhead: number = 30) => {
    return clients
      .map((client) => {
        const daysUntil = calculateDaysUntil(client.birthDate);
        return { client, daysUntil };
      })
      .filter((item): item is { client: ClientProfile; daysUntil: number } => {
        return item.daysUntil !== null && item.daysUntil >= 0 && item.daysUntil <= daysAhead;
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const getUpcomingAnniversaries = (daysAhead: number = 30) => {
    return clients
      .map((client) => {
        const daysUntil = calculateDaysUntil(client.anniversaryDate);
        return { client, daysUntil };
      })
      .filter((item): item is { client: ClientProfile; daysUntil: number } => {
        return item.daysUntil !== null && item.daysUntil >= 0 && item.daysUntil <= daysAhead;
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  // Follow-ups due today & overdue
  const todayStr = new Date().toISOString().split('T')[0];

  const followUpsDueToday = clients.filter(
    (c) => c.followUpDate && c.followUpDate === todayStr
  );

  const followUpsOverdue = clients.filter(
    (c) => c.followUpDate && c.followUpDate < todayStr
  );

  const upcomingBirthdays = getUpcomingBirthdays(30);
  const upcomingAnniversaries = getUpcomingAnniversaries(30);

  return (
    <ClientCrmContext.Provider
      value={{
        clients,
        totalClientsCount: clients.length,
        followUpsDueToday,
        followUpsOverdue,
        upcomingBirthdays,
        upcomingAnniversaries,
        addClient,
        updateClient,
        deleteClient,
        getUpcomingBirthdays,
        getUpcomingAnniversaries,
      }}
    >
      {children}
    </ClientCrmContext.Provider>
  );
};

export function useClientCrm(): ClientCrmContextType {
  const context = useContext(ClientCrmContext);
  if (!context) {
    throw new Error('useClientCrm must be used within a ClientCrmProvider');
  }
  return context;
}
