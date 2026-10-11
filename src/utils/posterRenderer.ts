import { FinancialSubjectId, LanguageCode } from '../types';

export interface PosterConfig {
  format: 'status_9_16' | 'post_1_1';
  theme: 'emerald' | 'navy' | 'gold' | 'midnight' | 'crimson' | 'indigo';
  backgroundStyle?: 'subject_art' | 'aurora_mesh' | 'fintech_grid' | 'wealth_constellation' | 'minimalist';
  backgroundSeed?: number; // Seed to generate fresh creative backgrounds on every click
  showSubjectBadge?: boolean; // Toggle to show or hide the top category badge
  customSubjectBadgeText?: string; // Custom text for the pill badge
  subjectId: FinancialSubjectId;
  subjectTitle: string;
  language: LanguageCode;
  headline: string;
  subheadline: string;
  bulletPoints: string[];
  ctaText: string;
  disclaimer: string;
  advisorName: string;
  advisorDesignation: string;
  advisorAchievement?: string;
  advisorPhone: string;
  advisorCredentials?: string;
  advisorPhoto?: string;
  advisorLogo?: string;
}

// Background gradients & accents per theme
export const THEME_STYLES: Record<string, {
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  accent: string;
  accentLight: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  ctaBg: string;
  ctaText: string;
}> = {
  // 25 Dedicated Theme Color Palettes (One unique signature palette per theme)
  deep_navy: {
    bgStart: '#0a192f',
    bgMid: '#0f2744',
    bgEnd: '#030b17',
    accent: '#00e5ff',
    accentLight: '#7dd3fc',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    ctaBg: '#0284c7',
    ctaText: '#ffffff',
  },
  crimson_ruby: {
    bgStart: '#4a0418',
    bgMid: '#2b040e',
    bgEnd: '#120106',
    accent: '#ff4d6d',
    accentLight: '#fda4af',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fecdd3',
    ctaBg: '#e11d48',
    ctaText: '#ffffff',
  },
  charcoal_steel: {
    bgStart: '#181c24',
    bgMid: '#11141a',
    bgEnd: '#090b0e',
    accent: '#38bdf8',
    accentLight: '#94a3b8',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    ctaBg: '#2563eb',
    ctaText: '#ffffff',
  },
  forest_emerald: {
    bgStart: '#033624',
    bgMid: '#012417',
    bgEnd: '#00140c',
    accent: '#10b981',
    accentLight: '#86efac',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#bbf7d0',
    ctaBg: '#059669',
    ctaText: '#ffffff',
  },
  electric_indigo: {
    bgStart: '#1e1b4b',
    bgMid: '#141133',
    bgEnd: '#09071c',
    accent: '#818cf8',
    accentLight: '#c7d2fe',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#e0e7ff',
    ctaBg: '#4f46e5',
    ctaText: '#ffffff',
  },
  cyber_teal: {
    bgStart: '#042f2e',
    bgMid: '#021e1d',
    bgEnd: '#01100f',
    accent: '#14b8a6',
    accentLight: '#5eead4',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#99f6e4',
    ctaBg: '#0d9488',
    ctaText: '#ffffff',
  },
  imperial_gold: {
    bgStart: '#2d1c00',
    bgMid: '#1c1100',
    bgEnd: '#0c0700',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    cardBg: 'rgba(251, 191, 36, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fde68a',
    ctaBg: '#d97706',
    ctaText: '#ffffff',
  },
  sunset_amber: {
    bgStart: '#431407',
    bgMid: '#260a03',
    bgEnd: '#120401',
    accent: '#fb923c',
    accentLight: '#fdba74',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fed7aa',
    ctaBg: '#ea580c',
    ctaText: '#ffffff',
  },
  jade_contrast: {
    bgStart: '#022c22',
    bgMid: '#011a14',
    bgEnd: '#000d0a',
    accent: '#34d399',
    accentLight: '#a7f3d0',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#d1fae5',
    ctaBg: '#059669',
    ctaText: '#ffffff',
  },
  sapphire_blue: {
    bgStart: '#0c2340',
    bgMid: '#07172b',
    bgEnd: '#020912',
    accent: '#60a5fa',
    accentLight: '#93c5fd',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#bfdbfe',
    ctaBg: '#2563eb',
    ctaText: '#ffffff',
  },
  obsidian_purple: {
    bgStart: '#1e1035',
    bgMid: '#120921',
    bgEnd: '#090312',
    accent: '#c084fc',
    accentLight: '#e9d5ff',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#f3e8ff',
    ctaBg: '#9333ea',
    ctaText: '#ffffff',
  },
  burgundy_wine: {
    bgStart: '#3b0724',
    bgMid: '#240316',
    bgEnd: '#12010a',
    accent: '#f43f5e',
    accentLight: '#fda4af',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fecdd3',
    ctaBg: '#be123c',
    ctaText: '#ffffff',
  },
  danger_vermilion: {
    bgStart: '#360707',
    bgMid: '#220303',
    bgEnd: '#110101',
    accent: '#ef4444',
    accentLight: '#fca5a5',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fecaca',
    ctaBg: '#dc2626',
    ctaText: '#ffffff',
  },
  atlantic_cyan: {
    bgStart: '#0c2538',
    bgMid: '#071926',
    bgEnd: '#020d14',
    accent: '#06b6d4',
    accentLight: '#67e8f9',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#cffafe',
    ctaBg: '#0891b2',
    ctaText: '#ffffff',
  },
  luxurious_bronze: {
    bgStart: '#362208',
    bgMid: '#211403',
    bgEnd: '#0f0800',
    accent: '#fbbf24',
    accentLight: '#fde68a',
    cardBg: 'rgba(251, 191, 36, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fef3c7',
    ctaBg: '#b45309',
    ctaText: '#ffffff',
  },
  pacific_ocean: {
    bgStart: '#083344',
    bgMid: '#04202b',
    bgEnd: '#010f14',
    accent: '#22d3ee',
    accentLight: '#a5f3fc',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#cffafe',
    ctaBg: '#0284c7',
    ctaText: '#ffffff',
  },
  amethyst_twilight: {
    bgStart: '#2e1065',
    bgMid: '#1c093e',
    bgEnd: '#0c031c',
    accent: '#a855f7',
    accentLight: '#d8b4fe',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#e9d5ff',
    ctaBg: '#7c3aed',
    ctaText: '#ffffff',
  },
  carbon_monochrome: {
    bgStart: '#181d24',
    bgMid: '#0f1217',
    bgEnd: '#07090b',
    accent: '#94a3b8',
    accentLight: '#e2e8f0',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    ctaBg: '#334155',
    ctaText: '#ffffff',
  },
  cosmic_slate: {
    bgStart: '#1e2238',
    bgMid: '#121524',
    bgEnd: '#080a12',
    accent: '#818cf8',
    accentLight: '#c7d2fe',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#e0e7ff',
    ctaBg: '#4338ca',
    ctaText: '#ffffff',
  },
  evergreen_moss: {
    bgStart: '#063e26',
    bgMid: '#032717',
    bgEnd: '#01140a',
    accent: '#84cc16',
    accentLight: '#bef264',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#d9f99d',
    ctaBg: '#16a34a',
    ctaText: '#ffffff',
  },
  warm_copper: {
    bgStart: '#3e1f0c',
    bgMid: '#271206',
    bgEnd: '#130802',
    accent: '#eab308',
    accentLight: '#fde047',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fef08a',
    ctaBg: '#ca8a04',
    ctaText: '#ffffff',
  },
  scarlet_flame: {
    bgStart: '#3f0713',
    bgMid: '#26030a',
    bgEnd: '#130104',
    accent: '#ff0055',
    accentLight: '#fda4af',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fecdd3',
    ctaBg: '#e11d48',
    ctaText: '#ffffff',
  },
  polar_iceberg: {
    bgStart: '#031e36',
    bgMid: '#011221',
    bgEnd: '#00070e',
    accent: '#38bdf8',
    accentLight: '#bae6fd',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#e0f2fe',
    ctaBg: '#0284c7',
    ctaText: '#ffffff',
  },
  plum_velvet: {
    bgStart: '#3b0736',
    bgMid: '#240321',
    bgEnd: '#120110',
    accent: '#e879f9',
    accentLight: '#f5d0fe',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fae8ff',
    ctaBg: '#a21caf',
    ctaText: '#ffffff',
  },
  emerald_crown: {
    bgStart: '#02331f',
    bgMid: '#012113',
    bgEnd: '#000f08',
    accent: '#10b981',
    accentLight: '#6ee7b7',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#a7f3d0',
    ctaBg: '#047857',
    ctaText: '#ffffff',
  },

  // Legacy aliases
  emerald: {
    bgStart: '#064e3b',
    bgMid: '#022c22',
    bgEnd: '#0f172a',
    accent: '#10b981',
    accentLight: '#34d399',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#94a3b8',
    ctaBg: '#059669',
    ctaText: '#ffffff',
  },
  navy: {
    bgStart: '#0f172a',
    bgMid: '#1e293b',
    bgEnd: '#0a0f1d',
    accent: '#38bdf8',
    accentLight: '#7dd3fc',
    cardBg: 'rgba(255, 255, 255, 0.07)',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    ctaBg: '#0284c7',
    ctaText: '#ffffff',
  },
  gold: {
    bgStart: '#291b00',
    bgMid: '#171100',
    bgEnd: '#090800',
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    cardBg: 'rgba(251, 191, 36, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fde68a',
    ctaBg: '#d97706',
    ctaText: '#ffffff',
  },
  midnight: {
    bgStart: '#18181b',
    bgMid: '#09090b',
    bgEnd: '#030712',
    accent: '#a855f7',
    accentLight: '#c084fc',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    textColor: '#ffffff',
    subtextColor: '#a1a1aa',
    ctaBg: '#9333ea',
    ctaText: '#ffffff',
  },
  crimson: {
    bgStart: '#4c0519',
    bgMid: '#2d0612',
    bgEnd: '#0f172a',
    accent: '#fb7185',
    accentLight: '#fda4af',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fecdd3',
    ctaBg: '#e11d48',
    ctaText: '#ffffff',
  },
  indigo: {
    bgStart: '#1e1b4b',
    bgMid: '#0f172a',
    bgEnd: '#020617',
    accent: '#6366f1',
    accentLight: '#818cf8',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#c7d2fe',
    ctaBg: '#4f46e5',
    ctaText: '#ffffff',
  },
  teal: {
    bgStart: '#042f2e',
    bgMid: '#115e59',
    bgEnd: '#021817',
    accent: '#14b8a6',
    accentLight: '#5eead4',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#99f6e4',
    ctaBg: '#0d9488',
    ctaText: '#ffffff',
  },
  charcoal: {
    bgStart: '#1e293b',
    bgMid: '#0f172a',
    bgEnd: '#020617',
    accent: '#38bdf8',
    accentLight: '#94a3b8',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    textColor: '#ffffff',
    subtextColor: '#cbd5e1',
    ctaBg: '#2563eb',
    ctaText: '#ffffff',
  },
  forest: {
    bgStart: '#064e3b',
    bgMid: '#022c22',
    bgEnd: '#051b14',
    accent: '#10b981',
    accentLight: '#86efac',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#bbf7d0',
    ctaBg: '#047857',
    ctaText: '#ffffff',
  },
  amber: {
    bgStart: '#451a03',
    bgMid: '#291b00',
    bgEnd: '#140c00',
    accent: '#f59e0b',
    accentLight: '#fcd34d',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fef3c7',
    ctaBg: '#d97706',
    ctaText: '#ffffff',
  },
  slate_blue: {
    bgStart: '#1e1b4b',
    bgMid: '#1e293b',
    bgEnd: '#090d16',
    accent: '#818cf8',
    accentLight: '#a5b4fc',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#e0e7ff',
    ctaBg: '#4338ca',
    ctaText: '#ffffff',
  },
  wine: {
    bgStart: '#4c0519',
    bgMid: '#3b0764',
    bgEnd: '#1a052b',
    accent: '#e879f9',
    accentLight: '#f0abfc',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    textColor: '#ffffff',
    subtextColor: '#fae8ff',
    ctaBg: '#c026d3',
    ctaText: '#ffffff',
  },
};

// Deterministic PRNG for procedural background variety
export function createPRNG(seed: number) {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s = 12345;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Helper: load image safely into HTMLImageElement
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Text word wrapping utility for Canvas 2D
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws creative, procedural, topic-specific background art
 * Ensures the poster never feels like a repetitive template!
 */
export function drawCreativeSubjectBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: { subjectId: any; backgroundSeed?: number; backgroundStyle?: string },
  theme: typeof THEME_STYLES.emerald,
  isStatus: boolean
) {
  const seed = config.backgroundSeed || 42;
  const rng = createPRNG(seed);
  const style = config.backgroundStyle || 'subject_art';

  // 1. Base Gradient with seed-shifted angle
  const gradAngle = rng() * 0.4 - 0.2; // Slight natural angle variation
  const grad = ctx.createLinearGradient(0, 0, width * (1 + gradAngle), height);
  grad.addColorStop(0, theme.bgStart);
  grad.addColorStop(0.5, theme.bgMid);
  grad.addColorStop(1, theme.bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Randomized Organic Light Blooms
  const bloomCount = 3;
  for (let b = 0; b < bloomCount; b++) {
    const bX = width * (0.2 + rng() * 0.6);
    const bY = height * (0.15 + rng() * 0.7);
    const bRadius = (isStatus ? 350 : 250) + rng() * 150;
    const rad = ctx.createRadialGradient(bX, bY, 30, bX, bY, bRadius);
    const alpha = b === 0 ? '2c' : '18';
    rad.addColorStop(0, `${theme.accent}${alpha}`);
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Subject-Specific Creative Vector Artwork
  ctx.save();

  const sid = config.subjectId;

  if (style === 'subject_art') {
    // -------------------------------------------------------------
    // CATEGORY A: SIP, Mutual Funds & Investment Planning
    // -------------------------------------------------------------
    if (sid === 'sip_mutual_fund' || sid === 'investment_planning' || sid === 'elss_tax_saving') {
      // Magnificent Compounding Growth Curve with glowing gradient fill
      const curveStart = height * (isStatus ? 0.82 : 0.78);
      const curvePeak = height * (isStatus ? 0.38 + rng() * 0.08 : 0.32 + rng() * 0.06);

      // Gradient under the chart curve
      const chartGrad = ctx.createLinearGradient(0, curvePeak, 0, height);
      chartGrad.addColorStop(0, `${theme.accent}1f`);
      chartGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(0, curveStart);
      ctx.bezierCurveTo(
        width * 0.35, curveStart - 20,
        width * 0.65, curveStart - (curveStart - curvePeak) * 0.5,
        width, curvePeak
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = chartGrad;
      ctx.fill();

      // Main glowing trendline stroke
      ctx.strokeStyle = `${theme.accentLight}66`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, curveStart);
      ctx.bezierCurveTo(
        width * 0.35, curveStart - 20,
        width * 0.65, curveStart - (curveStart - curvePeak) * 0.5,
        width, curvePeak
      );
      ctx.stroke();

      // Milestone Nodes on the compounding curve
      [0.28, 0.52, 0.76, 0.96].forEach((pos, idx) => {
        const nx = width * pos;
        const ny = curveStart - (curveStart - curvePeak) * Math.pow(pos, 2.2);

        // Vertical guide line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx, height - 200);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing node ring
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(nx, ny, 11, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Subtle Watermark Floating Rupee & Compounding symbols
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.font = 'bold 120px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('₹', width - 80, height * 0.32);
      ctx.font = 'bold 80px system-ui, sans-serif';
      ctx.fillText('% CAGR', width - 100, height * 0.44);
      ctx.textAlign = 'left';
    }

    // -------------------------------------------------------------
    // CATEGORY B: Personal Loan, Home Loan & Credit Score
    // -------------------------------------------------------------
    else if (sid === 'personal_loan' || sid === 'home_loan' || sid === 'credit_score') {
      if (sid === 'home_loan') {
        // Architectural Blueprint House Contour Grid
        const houseX = width * 0.65;
        const houseY = height * (isStatus ? 0.45 : 0.4);
        const houseSize = isStatus ? 220 : 180;

        ctx.strokeStyle = `${theme.accent}30`;
        ctx.lineWidth = 2;
        // Roof triangle
        ctx.beginPath();
        ctx.moveTo(houseX, houseY - houseSize * 0.6);
        ctx.lineTo(houseX + houseSize * 0.6, houseY);
        ctx.lineTo(houseX - houseSize * 0.6, houseY);
        ctx.closePath();
        ctx.stroke();
        // House base box
        ctx.strokeRect(houseX - houseSize * 0.5, houseY, houseSize, houseSize * 0.7);

        // Blueprint technical measurement lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(houseX - houseSize * 0.7, houseY - houseSize * 0.7);
        ctx.lineTo(houseX + houseSize * 0.7, houseY - houseSize * 0.7);
        ctx.moveTo(houseX - houseSize * 0.7, houseY + houseSize * 0.8);
        ctx.lineTo(houseX + houseSize * 0.7, houseY + houseSize * 0.8);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        // Financial Balance Scale & Credit Score Meter Arc
        const meterX = width * 0.8;
        const meterY = height * (isStatus ? 0.42 : 0.38);
        const meterRadius = isStatus ? 140 : 110;

        // Radial credit score arc
        ctx.strokeStyle = `${theme.accent}25`;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(meterX, meterY, meterRadius, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        ctx.strokeStyle = theme.accentLight;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(meterX, meterY, meterRadius, Math.PI * 0.8, Math.PI * 1.7);
        ctx.stroke();

        // Speedometer center needle
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(meterX, meterY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Credit Health Text watermark
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.font = 'bold 70px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('750+ CIBIL', width - 70, height * 0.34);
        ctx.font = 'bold 90px system-ui, sans-serif';
        ctx.fillText('% EMI', width - 80, height * 0.48);
        ctx.textAlign = 'left';
      }
    }

    // -------------------------------------------------------------
    // CATEGORY C: Health & Term Insurance Planning
    // -------------------------------------------------------------
    else if (sid === 'health_insurance' || sid === 'term_insurance' || sid === 'insurance_planning') {
      if (sid === 'health_insurance') {
        // Glowing ECG Heartbeat Lifeline wave
        const ecgY = height * (isStatus ? 0.46 : 0.42);
        ctx.strokeStyle = `${theme.accentLight}50`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(0, ecgY);
        ctx.lineTo(width * 0.3, ecgY);
        ctx.lineTo(width * 0.36, ecgY - 25);
        ctx.lineTo(width * 0.42, ecgY + 30);
        ctx.lineTo(width * 0.48, ecgY - 90); // High pulse peak
        ctx.lineTo(width * 0.54, ecgY + 60);
        ctx.lineTo(width * 0.6, ecgY - 15);
        ctx.lineTo(width * 0.66, ecgY);
        ctx.lineTo(width, ecgY);
        ctx.stroke();

        // Medical Cross / Shield watermark
        const crossX = width * 0.78;
        const crossY = height * (isStatus ? 0.36 : 0.32);
        ctx.strokeStyle = `${theme.accent}33`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(crossX, crossY, 65, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `${theme.accent}20`;
        ctx.fillRect(crossX - 10, crossY - 35, 20, 70);
        ctx.fillRect(crossX - 35, crossY - 10, 70, 20);
      } else {
        // Majestic Protection Shield Watermark
        const shieldX = width * 0.78;
        const shieldY = height * (isStatus ? 0.42 : 0.38);
        const sW = isStatus ? 130 : 105;
        const sH = isStatus ? 170 : 135;

        ctx.strokeStyle = `${theme.accent}33`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shieldX, shieldY - sH * 0.5);
        ctx.lineTo(shieldX + sW * 0.5, shieldY - sH * 0.35);
        ctx.lineTo(shieldX + sW * 0.5, shieldY + sH * 0.15);
        ctx.quadraticCurveTo(shieldX, shieldY + sH * 0.55, shieldX, shieldY + sH * 0.55);
        ctx.quadraticCurveTo(shieldX - sW * 0.5, shieldY + sH * 0.15, shieldX - sW * 0.5, shieldY + sH * 0.15);
        ctx.lineTo(shieldX - sW * 0.5, shieldY - sH * 0.35);
        ctx.closePath();
        ctx.stroke();

        // Shield core glow
        const shieldRad = ctx.createRadialGradient(shieldX, shieldY, 10, shieldX, shieldY, sW * 0.7);
        shieldRad.addColorStop(0, `${theme.accent}1a`);
        shieldRad.addColorStop(1, 'transparent');
        ctx.fillStyle = shieldRad;
        ctx.fill();
      }
    }

    // -------------------------------------------------------------
    // CATEGORY D: Retirement & Pension Planning
    // -------------------------------------------------------------
    else if (sid === 'retirement_planning' || sid === 'nps_pension') {
      // Golden Horizon Sunrise Arc
      const sunX = width * 0.5;
      const sunY = height * (isStatus ? 0.62 : 0.55);
      const sunR = isStatus ? 280 : 220;

      // Concentric life milestone rings
      [0.6, 0.85, 1.1].forEach((factor) => {
        ctx.strokeStyle = `${theme.accent}1e`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * factor, Math.PI, Math.PI * 2);
        ctx.stroke();
      });

      // Radiant sunrise rays
      for (let r = 0; r < 8; r++) {
        const angle = Math.PI + (Math.PI / 7) * r;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * (sunR * 0.5), sunY + Math.sin(angle) * (sunR * 0.5));
        ctx.lineTo(sunX + Math.cos(angle) * (sunR * 1.2), sunY + Math.sin(angle) * (sunR * 1.2));
        ctx.stroke();
      }

      // Freedom & Golden Years text watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.font = 'bold 85px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('AGE 60+', width - 80, height * 0.38);
      ctx.font = 'bold 55px system-ui, sans-serif';
      ctx.fillText('FINANCIAL FREEDOM', width - 80, height * 0.46);
      ctx.textAlign = 'left';
    }

    // -------------------------------------------------------------
    // CATEGORY E: Tax Planning & Income Tax
    // -------------------------------------------------------------
    else if (sid === 'tax_planning' || sid === 'income_tax') {
      // Modern Financial Ledger & 80C Shield Matrix
      const matrixX = width * 0.72;
      const matrixY = height * (isStatus ? 0.42 : 0.38);

      ctx.strokeStyle = `${theme.accent}24`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(matrixX - 120, matrixY - 60 + i * 40);
        ctx.lineTo(matrixX + 120, matrixY - 60 + i * 40);
        ctx.stroke();
      }
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.moveTo(matrixX - 120 + j * 80, matrixY - 70);
        ctx.lineTo(matrixX - 120 + j * 80, matrixY + 70);
        ctx.stroke();
      }

      // Large 80C & Tax Save Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.font = 'bold 110px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('80C', width - 80, height * 0.34);
      ctx.font = 'bold 70px system-ui, sans-serif';
      ctx.fillText('TAX SAVED', width - 80, height * 0.46);
      ctx.textAlign = 'left';
    }

    // -------------------------------------------------------------
    // CATEGORY F: Child Education, Emergency Fund, Gold & Others
    // -------------------------------------------------------------
    else {
      // General Wealth Constellation & Geometric Node Network
      const nodeCount = 9;
      const nodes: { x: number; y: number }[] = [];
      for (let n = 0; n < nodeCount; n++) {
        nodes.push({
          x: width * (0.15 + rng() * 0.7),
          y: height * (0.2 + rng() * 0.5),
        });
      }

      ctx.strokeStyle = `${theme.accent}1c`;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < width * 0.4) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.fillStyle = theme.accentLight;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // 4. Subtle Fintech Lattice Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const gridSpacing = 90;
  for (let x = gridSpacing; x < width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = gridSpacing; y < height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Main Poster Canvas Renderer Engine
 */
export async function renderPosterToCanvas(
  canvas: HTMLCanvasElement,
  config: PosterConfig
): Promise<void> {
  const isStatus = config.format === 'status_9_16';
  const width = isStatus ? 1080 : 1080;
  const height = isStatus ? 1920 : 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const theme = THEME_STYLES[config.theme] || THEME_STYLES.emerald;

  // 1. Draw Creative Subject-Specific Procedural Background
  drawCreativeSubjectBackground(ctx, width, height, config, theme, isStatus);

  // 2. Preload images (photo and logo)
  const [photoImg, logoImg] = await Promise.all([
    config.advisorPhoto ? loadImage(config.advisorPhoto) : null,
    config.advisorLogo ? loadImage(config.advisorLogo) : null,
  ]);

  // Layout Metrics
  const margin = 60;
  const contentWidth = width - margin * 2;
  let cursorY = isStatus ? 100 : 70;

  // 3. Header Bar: Subject Pill & Topic Tag (Customizable & Removable!)
  const showBadge = config.showSubjectBadge !== false;
  const activeBadgeText = (config.customSubjectBadgeText || config.subjectTitle).toUpperCase();

  ctx.save();
  const pillHeight = 44;
  if (showBadge && activeBadgeText.trim().length > 0) {
    const pillPaddingX = 24;
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    const pillWidth = ctx.measureText(activeBadgeText).width + pillPaddingX * 2;

    ctx.fillStyle = theme.accent + '26'; // 15% opacity
    ctx.strokeStyle = theme.accent + '80'; // 50% opacity
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(margin, cursorY, pillWidth, pillHeight, 22);
    ctx.fill();
    ctx.stroke();

    // Pill text centered vertically
    ctx.fillStyle = theme.accentLight;
    ctx.textBaseline = 'middle';
    ctx.fillText(activeBadgeText, margin + pillPaddingX, cursorY + pillHeight / 2);
  }

  // Logo on top right if present
  if (logoImg) {
    const logoSize = 60;
    ctx.drawImage(logoImg, width - margin - logoSize, cursorY - 8, logoSize, logoSize);
  } else {
    // Brand mark badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('FINADVISOR PRO', width - margin, cursorY + pillHeight / 2);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // Move title lower: generous breathing room below pill
  cursorY += pillHeight + (isStatus ? 48 : 36);

  // 4. Headline (Auto-sized, Clean, Bold & 1.36 line-height to protect Indian language scripts)
  ctx.save();
  const headlineSize = isStatus ? 46 : 38;
  ctx.font = `800 ${headlineSize}px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif`;
  ctx.fillStyle = theme.textColor;
  ctx.textBaseline = 'top';
  const headlineLines = wrapText(ctx, config.headline, contentWidth);
  const headlineLineHeight = headlineSize * 1.36;

  for (let i = 0; i < Math.min(headlineLines.length, 3); i++) {
    ctx.fillText(headlineLines[i], margin, cursorY + i * headlineLineHeight);
  }
  cursorY += Math.min(headlineLines.length, 3) * headlineLineHeight + (isStatus ? 28 : 22);
  ctx.restore();

  // 5. Subheadline
  if (config.subheadline) {
    ctx.save();
    const subSize = isStatus ? 25 : 21;
    ctx.font = `500 ${subSize}px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif`;
    ctx.fillStyle = theme.subtextColor;
    ctx.textBaseline = 'top';
    const subLines = wrapText(ctx, config.subheadline, contentWidth);
    const subLineHeight = subSize * 1.42;

    for (let i = 0; i < Math.min(subLines.length, isStatus ? 3 : 2); i++) {
      ctx.fillText(subLines[i], margin, cursorY + i * subLineHeight);
    }
    cursorY += Math.min(subLines.length, isStatus ? 3 : 2) * subLineHeight + (isStatus ? 36 : 28);
    ctx.restore();
  } else {
    cursorY += isStatus ? 20 : 12;
  }

  // 6. Middle Educational Content Card (Key Highlights / Takeaways)
  if (config.bulletPoints && config.bulletPoints.length > 0) {
    const cardTop = cursorY;
    const cardPadding = 32;
    const availableCardHeight = isStatus ? 480 : 270;

    // Card background
    ctx.save();
    ctx.fillStyle = theme.cardBg;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(margin, cardTop, contentWidth, availableCardHeight, 28);
    ctx.fill();
    ctx.stroke();

    // Card Label
    ctx.fillStyle = theme.accentLight;
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('FINANCIAL EDUCATION INSIGHTS', margin + cardPadding, cardTop + 24);

    let bulletY = cardTop + 68;
    const bulletFontSize = isStatus ? 24 : 20;
    ctx.font = `600 ${bulletFontSize}px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif`;
    const bulletLineHeight = bulletFontSize * 1.42;

    const maxBullets = isStatus ? Math.min(3, config.bulletPoints.length) : Math.min(2, config.bulletPoints.length);

    for (let b = 0; b < maxBullets; b++) {
      const bulletText = config.bulletPoints[b];
      // Draw bullet icon circle
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(margin + cardPadding + 10, bulletY + 12, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.textBaseline = 'top';
      const bLines = wrapText(ctx, bulletText, contentWidth - cardPadding * 2 - 36);
      for (let l = 0; l < Math.min(bLines.length, 2); l++) {
        ctx.fillText(bLines[l], margin + cardPadding + 32, bulletY + l * bulletLineHeight);
      }
      bulletY += Math.min(bLines.length, 2) * bulletLineHeight + (isStatus ? 24 : 14);
    }
    ctx.restore();

    cursorY = cardTop + availableCardHeight + (isStatus ? 36 : 28);
  }

  // 7. Call To Action Ribbon
  ctx.save();
  const ctaHeight = isStatus ? 76 : 60;
  ctx.fillStyle = theme.ctaBg;
  ctx.beginPath();
  ctx.roundRect(margin, cursorY, contentWidth, ctaHeight, 20);
  ctx.fill();

  // CTA Text & Icon
  ctx.fillStyle = theme.ctaText;
  const ctaFontSize = isStatus ? 26 : 22;
  ctx.font = `bold ${ctaFontSize}px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`👉  ${config.ctaText}`, width / 2, cursorY + (isStatus ? 48 : 38));
  ctx.textAlign = 'left';
  ctx.restore();

  cursorY += ctaHeight + (isStatus ? 40 : 25);

  // 8. Master Advisor Footer Branding Block (100% Protected Single Source of Truth)
  const footerHeight = isStatus ? 220 : 180;
  const footerTop = height - footerHeight - (isStatus ? 80 : 35);

  ctx.save();
  // Footer separator line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, footerTop);
  ctx.lineTo(width - margin, footerTop);
  ctx.stroke();

  const advisorInfoY = footerTop + 35;
  const photoSize = isStatus ? 130 : 100;
  const photoX = margin;
  const photoY = advisorInfoY;

  // Draw Advisor Photo in circle
  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // Photo border
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Stylized monogram avatar
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const initials = config.advisorName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    ctx.fillText(initials || 'FA', photoX + photoSize / 2, photoY + photoSize / 2 + 13);
    ctx.textAlign = 'left';
  }

  // Advisor Text Details
  const textLeft = photoX + photoSize + 28;
  const textMaxWidth = width - margin - textLeft;

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isStatus ? 36 : 28}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.advisorName, textLeft, advisorInfoY + (isStatus ? 34 : 26));

  // Designation
  ctx.fillStyle = theme.accentLight;
  ctx.font = `600 ${isStatus ? 22 : 18}px system-ui, -apple-system, sans-serif`;
  const desigLines = wrapText(ctx, config.advisorDesignation, textMaxWidth);
  ctx.fillText(desigLines[0] || '', textLeft, advisorInfoY + (isStatus ? 68 : 52));

  // Phone / WhatsApp
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isStatus ? 26 : 22}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`📱 WhatsApp / Call: ${config.advisorPhone}`, textLeft, advisorInfoY + (isStatus ? 108 : 82));

  // Achievement / Milestone & Credentials
  const credItems = [config.advisorAchievement, config.advisorCredentials].filter(Boolean);
  if (credItems.length > 0) {
    const credText = credItems.join(' • ');
    ctx.fillStyle = '#fde68a';
    ctx.font = `500 ${isStatus ? 18 : 15}px system-ui, -apple-system, sans-serif`;
    const credLines = wrapText(ctx, credText, textMaxWidth);
    ctx.fillText(credLines[0] || credText, textLeft, advisorInfoY + (isStatus ? 138 : 106));
  }
  ctx.restore();

  // 9. Compliance Disclaimer at Bottom
  if (config.disclaimer) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = `italic ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    const discLines = wrapText(ctx, config.disclaimer, contentWidth);
    ctx.fillText(discLines[0] || config.disclaimer, width / 2, height - (isStatus ? 30 : 15));
    ctx.textAlign = 'left';
    ctx.restore();
  }
}
