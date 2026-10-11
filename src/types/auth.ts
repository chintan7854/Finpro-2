import { AdvisorProfile } from './index';

export type AuthMethod = 'credentials' | 'google' | 'mobile_otp';

export interface UserAccount {
  username: string;
  displayName: string;
  role: 'super_admin' | 'advisor' | 'trial_advisor';
  authMethod: AuthMethod;
  email?: string;
  phoneNumber?: string;
  firstLoginAt?: number;
  expiresAt: number | null; // null = never expire
  isExpired?: boolean;
  planId: 'starter' | 'pro_growth' | 'elite_enterprise' | 'lifetime_vip';
  planName: string;
  profile: Partial<AdvisorProfile>;
}

export interface SubscriptionPlan {
  id: 'starter' | 'pro_growth' | 'elite_enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  maxCreditsPerMonth: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'સ્ટાર્ટર પ્લાન (Starter)',
    tagline: 'નવા એડવાઈઝર્સ અને સ્વતંત્ર એજન્ટ્સ માટે અનુકૂળ',
    monthlyPrice: 299,
    yearlyPrice: 2499,
    features: [
      'રોજના ૩ બ્રાન્ડેડ સોશિયલ પોસ્ટર્સ',
      'મલ્ટી-લેંગ્વેજ આર્ટિકલ અને WhatsApp કન્ટેન્ટ',
      'બેઝિક પ્રોફાઇલ અને વૉટ્સએપ શેરિંગ',
      'માસિક ૧૦૦ AI ક્રેડિટ્સ',
    ],
    maxCreditsPerMonth: 100,
  },
  {
    id: 'pro_growth',
    name: 'પ્રો ગ્રોથ પ્લાન (Pro Growth)',
    tagline: 'સૌથી વધુ લોકપ્રિય - સક્રિય MFDs અને વેલ્થ મેનેજર્સ માટે',
    monthlyPrice: 699,
    yearlyPrice: 4999,
    popular: true,
    features: [
      'તમામ ૨૫ થીમ આધારિત પોસ્ટર્સ (Myth vs Reality, Comparison વગેરે)',
      'Client Q&A એડવાઇઝરી રિસ્પોન્ડર (WhatsApp Ready)',
      'કસ્ટમ કંપની અને સેક્ટર સબ્જેક્ટ્સ ઉમેરવાની સુવિધા',
      'ડાયરેક્ટ ૯:૧૬ અને ૧:૧ PNG ડાઉનલોડ',
      'માસિક ૫૦૦ AI ક્રેડિટ્સ',
    ],
    maxCreditsPerMonth: 500,
  },
  {
    id: 'elite_enterprise',
    name: 'એલિટ એન્ટરપ્રાઇઝ (Elite Enterprise)',
    tagline: 'મોટી ફાઇનાન્સિયલ ટીમો, બ્રોકરેજ અને લીડિંગ MFDs માટે',
    monthlyPrice: 1299,
    yearlyPrice: 8999,
    features: [
      'અનલિમિટેડ AI કન્ટેન્ટ અને પોસ્ટર્સ',
      'વિડીયો સ્ટેટસ મેકર સુવિધા',
      '૪K હાઈ-રેઝોલ્યુશન એક્સપોર્ટ અને વૉટરમાર્ક-ફ્રી',
      'પ્રાયોરિટી WhatsApp સપોર્ટ અને ડેડિકેટેડ ટ્રેનિંગ',
      'મલ્ટી-યુઝર એક્સેસ સપોર્ટ',
    ],
    maxCreditsPerMonth: 9999,
  },
];
