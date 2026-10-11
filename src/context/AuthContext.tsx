import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount, SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types/auth';
import { AdvisorProfile } from '../types';

interface LoginResult {
  success: boolean;
  error?: string;
  isExpired?: boolean;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isExpired: boolean;
  loginWithCredentials: (username: string, pass: string) => LoginResult;
  loginWithGoogle: (email: string, name?: string) => LoginResult;
  loginWithMobile: (phoneNumber: string, otp: string) => LoginResult;
  logout: () => void;
  updateCurrentUserProfile: (profile: Partial<AdvisorProfile>) => void;
  upgradePlan: (planId: 'starter' | 'pro_growth' | 'elite_enterprise') => void;
  subscriptionPlans: SubscriptionPlan[];
  daysRemaining: number | null;
}

const AUTH_STORAGE_KEY = 'finadvisor_auth_user_v1';
const USERS_REGISTRY_KEY = 'finadvisor_users_registry_v1';

// Pre-configured accounts specified by user
const INITIAL_CONFIGURED_USERS: Record<string, {
  pass: string;
  name: string;
  role: 'super_admin' | 'advisor';
  neverExpires: boolean;
  designation: string;
  phone: string;
  achievement: string;
  details: string;
}> = {
  Chintan: {
    pass: 'Ch#7854',
    name: 'Chintan Raval',
    role: 'super_admin',
    neverExpires: true,
    designation: 'Certified Financial Planner & Wealth Architect',
    phone: '+91 98250 78540',
    achievement: 'Managing ₹100+ Cr Portfolios • Creator of FinAdvisor Pro',
    details: 'AMFI ARN-184502 • CFP Board Verified • 15+ Years Wealth Experience',
  },
  Brijesh: {
    pass: '123',
    name: 'Brijesh Trivedi',
    role: 'advisor',
    neverExpires: false,
    designation: 'Certified Financial Planner & Mutual Fund Advisor',
    phone: '+91 99800 12345',
    achievement: 'Helping 500+ Families Achieve Financial Freedom',
    details: 'AMFI ARN-154201 • Insurance & Wealth Specialist',
  },
  Hardik: {
    pass: '123',
    name: 'Hardik Patel',
    role: 'advisor',
    neverExpires: false,
    designation: 'Mutual Fund Distributor & Retirement Strategist',
    phone: '+91 98980 12345',
    achievement: 'Constructed ₹35+ Cr Disciplined SIP Portfolios',
    details: 'AMFI ARN-168920 • NISM VA Certified',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved auth user', e);
    }
    return null;
  });

  // Helper to load or initialize users registry from localStorage
  const getUsersRegistry = (): Record<string, UserAccount> => {
    try {
      const raw = localStorage.getItem(USERS_REGISTRY_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return {};
  };

  const saveUsersRegistry = (reg: Record<string, UserAccount>) => {
    try {
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(reg));
    } catch (e) {
      console.error('Failed to save user registry', e);
    }
  };

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Check if current user is expired
  const isExpired = Boolean(
    currentUser &&
    currentUser.expiresAt !== null &&
    Date.now() > currentUser.expiresAt
  );

  // Compute days remaining
  const daysRemaining = (currentUser && currentUser.expiresAt !== null)
    ? Math.max(0, Math.ceil((currentUser.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  // 1. Credentials Login (Chintan, Brijesh, Hardik or registered custom)
  const loginWithCredentials = (usernameInput: string, passInput: string): LoginResult => {
    const usernameTrimmed = usernameInput.trim();
    const passTrimmed = passInput.trim();

    // Check predefined users first (case insensitive username matching)
    const predefinedKey = Object.keys(INITIAL_CONFIGURED_USERS).find(
      (k) => k.toLowerCase() === usernameTrimmed.toLowerCase()
    );

    if (predefinedKey) {
      const config = INITIAL_CONFIGURED_USERS[predefinedKey];
      if (config.pass !== passTrimmed) {
        return { success: false, error: 'ખોટો પાસવર્ડ (Incorrect Password). ફરી પ્રયત્ન કરો.' };
      }

      const registry = getUsersRegistry();
      const existing = registry[predefinedKey];

      let expiresAt: number | null = null;
      if (!config.neverExpires) {
        // If logged in previously, retain expiration. If first time, set 7 days from now.
        if (existing?.expiresAt) {
          expiresAt = existing.expiresAt;
        } else {
          expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
        }
      }

      // Check if expired
      if (expiresAt !== null && Date.now() > expiresAt) {
        return {
          success: false,
          isExpired: true,
          error: `તમારું આઈડી (${predefinedKey}) ૭ દિવસ પછી એક્સપાયર થઈ ગયું છે. આગળ ચાલુ રાખવા માટે એડમિન ચિંતન રાવલનો સંપર્ક કરો.`,
        };
      }

      const userAccount: UserAccount = {
        username: predefinedKey,
        displayName: config.name,
        role: config.role,
        authMethod: 'credentials',
        firstLoginAt: existing?.firstLoginAt || Date.now(),
        expiresAt,
        planId: config.neverExpires ? 'lifetime_vip' : 'pro_growth',
        planName: config.neverExpires ? 'Lifetime VIP Super Admin' : 'Pro Growth (7-Day Trial)',
        profile: existing?.profile || {
          advisorName: config.name,
          designation: config.designation,
          phoneNumber: config.phone,
          achievement: config.achievement,
          professionalDetails: config.details,
          profilePhoto: predefinedKey === 'Chintan'
            ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
      };

      registry[predefinedKey] = userAccount;
      saveUsersRegistry(registry);
      setCurrentUser(userAccount);

      return { success: true };
    }

    // Check custom registered users in registry
    const registry = getUsersRegistry();
    const existingUser = registry[usernameTrimmed];
    if (existingUser) {
      if (existingUser.expiresAt !== null && Date.now() > existingUser.expiresAt) {
        return {
          success: false,
          isExpired: true,
          error: 'તમારો ૭ દિવસનો ટ્રાયલ સમયગાળો પૂર્ણ થઈ ગયો છે. એડમિન ચિંતન રાવલનો સંપર્ક કરો.',
        };
      }
      setCurrentUser(existingUser);
      return { success: true };
    }

    return {
      success: false,
      error: `યુઝર '${usernameTrimmed}' મળ્યો નથી. માન્ય યુઝર દાખલ કરો: Chintan, Brijesh અથવા Hardik.`,
    };
  };

  // 2. Google Sign-In (One-click with Gmail)
  const loginWithGoogle = (emailInput: string, nameInput?: string): LoginResult => {
    const email = emailInput.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { success: false, error: 'કૃપા કરીને માન્ય Gmail સરનામું દાખલ કરો.' };
    }

    const registry = getUsersRegistry();
    const existing = registry[email];

    const username = email.split('@')[0];
    const displayName = nameInput || username.charAt(0).toUpperCase() + username.slice(1);

    const expiresAt = existing?.expiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (Date.now() > expiresAt) {
      return {
        success: false,
        isExpired: true,
        error: `આ Gmail (${email}) નો ૭ દિવસનો ફ્રી ટ્રાયલ પૂર્ણ થઈ ગયો છે. આગળ ચાલુ રાખવા માટે એડમિન ચિંતન રાવલનો સંપર્ક કરો.`,
      };
    }

    const userAccount: UserAccount = {
      username,
      displayName,
      email,
      role: 'advisor',
      authMethod: 'google',
      firstLoginAt: existing?.firstLoginAt || Date.now(),
      expiresAt,
      planId: 'pro_growth',
      planName: 'Pro Growth (7-Day Trial)',
      profile: existing?.profile || {
        advisorName: displayName,
        designation: 'Certified Financial Advisor',
        phoneNumber: '+91 98765 43210',
        achievement: 'Helping Investors Build Long-Term Wealth',
        professionalDetails: `Google Verified Account (${email})`,
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      },
    };

    registry[email] = userAccount;
    saveUsersRegistry(registry);
    setCurrentUser(userAccount);

    return { success: true };
  };

  // 3. Mobile Number OTP Login
  const loginWithMobile = (phoneInput: string, otpInput: string): LoginResult => {
    const cleanPhone = phoneInput.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'કૃપા કરીને ૧૦ આંકડાનો માન્ય મોબાઈલ નંબર દાખલ કરો.' };
    }

    if (otpInput.trim() !== '123456' && otpInput.trim() !== '7854' && otpInput.trim() !== '1234') {
      return { success: false, error: 'ખોટો OTP. કૃપા કરીને સ્ક્રીન પર આપેલો ૬-આંકડાનો OTP દાખલ કરો.' };
    }

    const key = `mobile_${cleanPhone.slice(-10)}`;
    const registry = getUsersRegistry();
    const existing = registry[key];

    const expiresAt = existing?.expiresAt || (Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (Date.now() > expiresAt) {
      return {
        success: false,
        isExpired: true,
        error: `આ મોબાઈલ નંબર (${cleanPhone}) નો ૭ દિવસનો ફ્રી ટ્રાયલ સમાપ્ત થઈ ગયો છે. આગળ ચાલુ રાખવા માટે એડમિન ચિંતન રાવલનો સંપર્ક કરો.`,
      };
    }

    const displayName = `Advisor ${cleanPhone.slice(-4)}`;
    const userAccount: UserAccount = {
      username: key,
      displayName,
      phoneNumber: `+91 ${cleanPhone.slice(-10)}`,
      role: 'advisor',
      authMethod: 'mobile_otp',
      firstLoginAt: existing?.firstLoginAt || Date.now(),
      expiresAt,
      planId: 'pro_growth',
      planName: 'Pro Growth (7-Day Trial)',
      profile: existing?.profile || {
        advisorName: displayName,
        designation: 'Mutual Fund & Wealth Consultant',
        phoneNumber: `+91 ${cleanPhone.slice(-10)}`,
        achievement: 'Smart Wealth & Financial Planning',
        professionalDetails: `Mobile Verified (+91 ${cleanPhone.slice(-10)})`,
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      },
    };

    registry[key] = userAccount;
    saveUsersRegistry(registry);
    setCurrentUser(userAccount);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Update profile for current user and save to registry
  const updateCurrentUserProfile = (updatedProfile: Partial<AdvisorProfile>) => {
    if (!currentUser) return;

    const updatedAccount: UserAccount = {
      ...currentUser,
      displayName: updatedProfile.advisorName || currentUser.displayName,
      profile: {
        ...currentUser.profile,
        ...updatedProfile,
      },
    };

    setCurrentUser(updatedAccount);

    // Save to user registry
    const registry = getUsersRegistry();
    registry[currentUser.username] = updatedAccount;
    saveUsersRegistry(registry);
  };

  // Upgrade or switch plan
  const upgradePlan = (planId: 'starter' | 'pro_growth' | 'elite_enterprise') => {
    if (!currentUser) return;
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[1];

    const updatedAccount: UserAccount = {
      ...currentUser,
      planId: plan.id,
      planName: `${plan.name} (Active Paid)`,
      // Extend expiration by 30 days
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    setCurrentUser(updatedAccount);
    const registry = getUsersRegistry();
    registry[currentUser.username] = updatedAccount;
    saveUsersRegistry(registry);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isExpired,
        loginWithCredentials,
        loginWithGoogle,
        loginWithMobile,
        logout,
        updateCurrentUserProfile,
        upgradePlan,
        subscriptionPlans: SUBSCRIPTION_PLANS,
        daysRemaining,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
