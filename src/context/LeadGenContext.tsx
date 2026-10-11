import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useClientCrm } from './ClientCrmContext';

export type LeadSource = 'whatsapp_forward' | 'social_media' | 'referral' | 'poster' | 'seminar' | 'other';
export type LeadInterest =
  | 'sip'
  | 'mutual_funds'
  | 'tax_saving'
  | 'retirement'
  | 'child_education'
  | 'term_insurance'
  | 'health_insurance'
  | 'portfolio_review';
export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'converted' | 'lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  interest: LeadInterest;
  status: LeadStatus;
  potentialAmount?: number;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface LeadGenContextType {
  leads: Lead[];
  totalLeadsCount: number;
  hotLeadsCount: number;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertToClient: (leadId: string) => void;
}

const STORAGE_KEY = 'finadvisor_leads';

const SEED_LEADS: Lead[] = [
  {
    id: 'lead_1',
    name: 'Vijay Trivedi',
    phone: '+91 97241 11223',
    email: 'vijay.t@example.com',
    source: 'whatsapp_forward',
    interest: 'sip',
    status: 'new',
    potentialAmount: 15000,
    notes: 'Saw the Ramesh vs Suresh WhatsApp story. Wants to start a ₹15,000 Step-up SIP.',
    followUpDate: '2026-10-11',
    createdAt: '2026-10-08T09:30:00.000Z',
  },
  {
    id: 'lead_2',
    name: 'Neha Soni',
    phone: '+91 98980 44556',
    email: 'neha.soni@example.com',
    source: 'poster',
    interest: 'child_education',
    status: 'contacted',
    potentialAmount: 25000,
    notes: 'Inquired about 15-year education inflation planner for daughter.',
    followUpDate: '2026-10-12',
    createdAt: '2026-10-05T14:15:00.000Z',
  },
  {
    id: 'lead_3',
    name: 'Haresh Desai',
    phone: '+91 99245 77889',
    email: 'haresh.desai@example.com',
    source: 'referral',
    interest: 'retirement',
    status: 'meeting_scheduled',
    potentialAmount: 5000000,
    notes: 'Planning retirement corpus. Inquired about SWP cashflow setup.',
    followUpDate: '2026-10-14',
    createdAt: '2026-10-02T11:00:00.000Z',
  },
  {
    id: 'lead_4',
    name: 'Anand Verma',
    phone: '+91 98112 33445',
    email: 'anand.verma@example.com',
    source: 'social_media',
    interest: 'tax_saving',
    status: 'new',
    potentialAmount: 150000,
    notes: 'Inquired about 80C ELSS mutual funds vs traditional insurance policies.',
    followUpDate: '2026-10-10',
    createdAt: '2026-10-09T16:00:00.000Z',
  },
];

const LeadGenContext = createContext<LeadGenContextType | undefined>(undefined);

export const LeadGenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addClient } = useClientCrm();

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load leads from localStorage', e);
    }
    return SEED_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.warn('Failed to save leads to localStorage', e);
    }
  }, [leads]);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const convertToClient = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Add to CRM clients
    addClient({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      category: lead.interest === 'sip' ? 'sip_investor' : lead.interest === 'retirement' ? 'retiree' : 'retail',
      monthlySipAmount: lead.interest === 'sip' ? (lead.potentialAmount || 10000) : undefined,
      totalAum: lead.potentialAmount,
      notes: `Converted from lead pipeline (${lead.source}). Original notes: ${lead.notes || 'None'}`,
      status: 'active',
    });

    // Mark lead as converted
    updateLead(leadId, { status: 'converted' });
  };

  const hotLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <LeadGenContext.Provider
      value={{
        leads,
        totalLeadsCount: leads.length,
        hotLeadsCount,
        addLead,
        updateLead,
        deleteLead,
        convertToClient,
      }}
    >
      {children}
    </LeadGenContext.Provider>
  );
};

export function useLeadGen(): LeadGenContextType {
  const context = useContext(LeadGenContext);
  if (!context) {
    throw new Error('useLeadGen must be used within a LeadGenProvider');
  }
  return context;
}
