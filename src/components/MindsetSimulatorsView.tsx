import React, { useState, useMemo, useRef } from 'react';
import { useAdvisor } from '../context/AdvisorContext';
import { SIMULATORS_LIST } from '../constants/simulatorsData';
import { SimulatorMetadata, SimulatorCategoryId } from '../types/simulators';
import {
  Sparkles,
  Search,
  Share2,
  TrendingUp,
  Sliders,
  AlertTriangle,
  Gauge,
  Coffee,
  X,
  Award,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const MindsetSimulatorsView: React.FC = () => {
  const { profile } = useAdvisor();

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<SimulatorCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // IN-PLACE ACCORDION EXPANSION STATE: Tracks which simulator card is open right in place
  const [expandedSimulatorId, setExpandedSimulatorId] = useState<string | null>('cost_of_delay');

  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // General Financial Sliders
  const [primaryAmount, setPrimaryAmount] = useState<number>(10000); // Monthly SIP or Principal
  const [secondaryAmount, setSecondaryAmount] = useState<number>(1000000); // Lumpsum / Corpus / Expense
  const [rateReturn, setRateReturn] = useState<number>(12); // Expected return %
  const [rateInflation, setRateInflation] = useState<number>(7); // Inflation %
  const [durationYears, setDurationYears] = useState<number>(15); // Years
  const [waitYears, setWaitYears] = useState<number>(3); // Delay years
  const [taxBracket, setTaxBracket] = useState<number>(20); // Tax %
  const [stepUpPercent, setStepUpPercent] = useState<number>(10); // Step-up %

  // Quizzes & Gauges Specific Sliders
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(45000);
  const [emergencyReserve, setEmergencyReserve] = useState<number>(270000);
  const [emiDebt, setEmiDebt] = useState<number>(25000);

  // Daily Habits / Behavioral Sliders
  const [dailyHabitCost, setDailyHabitCost] = useState<number>(120);

  // Currency Formatter
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  // Filtered List
  const filteredSimulators = useMemo(() => {
    return SIMULATORS_LIST.filter((sim) => {
      if (selectedCategory !== 'all' && sim.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          sim.title.toLowerCase().includes(q) ||
          sim.subtitle.toLowerCase().includes(q) ||
          sim.badge.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Mathematical Calculation Engines
  const calculateCompoundSip = (monthly: number, years: number, cagr: number) => {
    if (years <= 0) return 0;
    const r = cagr / 100 / 12;
    const n = Math.max(1, years * 12);
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  // Dynamic Calculated Results depending on Active Simulator
  const dynamicResults = useMemo(() => {
    // 1. Standard SIP & Delay
    const sipNow = calculateCompoundSip(primaryAmount, durationYears, rateReturn);
    const sipDelay = calculateCompoundSip(primaryAmount, Math.max(1, durationYears - waitYears), rateReturn);
    const delayLoss = Math.max(0, sipNow - sipDelay);

    // 2. Inflation & Purchasing Power
    const postTaxFdRate = Math.max(0.5, 7.0 * (1 - taxBracket / 100));
    const fdNominal = secondaryAmount * Math.pow(1 + postTaxFdRate / 100, durationYears);
    const fdRealPower = fdNominal / Math.pow(1 + rateInflation / 100, durationYears);
    const fdLoss = Math.max(0, secondaryAmount - fdRealPower);
    const futureCostOfExpense = secondaryAmount * Math.pow(1 + rateInflation / 100, durationYears);
    const purchasingPowerRetentionPct = Math.round((fdRealPower / (secondaryAmount || 1)) * 100);

    // 3. Step-Up SIP
    let stepUpCorpus = 0;
    let currentSip = primaryAmount;
    const rMonthly = rateReturn / 100 / 12;
    for (let yr = 0; yr < durationYears; yr++) {
      for (let m = 0; m < 12; m++) {
        stepUpCorpus = (stepUpCorpus + currentSip) * (1 + rMonthly);
      }
      currentSip = currentSip * (1 + stepUpPercent / 100);
    }
    const stepUpAdvantage = Math.max(0, stepUpCorpus - sipNow);

    // 4. Mathematical Rules
    const yearsToDouble = 72 / (rateReturn || 1);
    const yearsToTriple = 114 / (rateReturn || 1);
    const yearsToQuadruple = 144 / (rateReturn || 1);

    // 5. Daily Habit (Latte Factor)
    const monthlyHabit = dailyHabitCost * 30;
    const habitWealthLost = calculateCompoundSip(monthlyHabit, durationYears, rateReturn);

    // 6. Quizzes & Gauges Metrics
    const savingsRate = Math.max(0, Math.min(100, Math.round(((monthlyIncome - monthlyExpenses - emiDebt) / (monthlyIncome || 1)) * 100)));
    const debtRatio = Math.max(0, Math.min(100, Math.round((emiDebt / (monthlyIncome || 1)) * 100)));
    const emergencyMonths = Number((emergencyReserve / (monthlyExpenses || 1)).toFixed(1));
    
    // Composite Health Score (0 - 100)
    let computedHealthScore = 0;
    computedHealthScore += Math.min(35, (savingsRate / 30) * 35);
    if (debtRatio <= 30) {
      computedHealthScore += 35;
    } else if (debtRatio <= 50) {
      computedHealthScore += 35 - ((debtRatio - 30) / 20) * 20;
    } else {
      computedHealthScore += 5;
    }
    computedHealthScore += Math.min(30, (emergencyMonths / 6) * 30);
    const finalHealthScore = Math.min(100, Math.max(10, Math.round(computedHealthScore)));

    // 7. Rule of 25 & 4% SWR
    const annualLivingExp = monthlyExpenses * 12;
    const rule25Target = annualLivingExp * 25;
    const safeAnnualWithdrawal = secondaryAmount * 0.04;
    const safeMonthlyPension = safeAnnualWithdrawal / 12;

    return {
      sipNow,
      sipDelay,
      delayLoss,
      fdNominal,
      fdRealPower,
      fdLoss,
      futureCostOfExpense,
      purchasingPowerRetentionPct,
      stepUpCorpus,
      stepUpAdvantage,
      yearsToDouble,
      yearsToTriple,
      yearsToQuadruple,
      habitWealthLost,
      savingsRate,
      debtRatio,
      emergencyMonths,
      finalHealthScore,
      annualLivingExp,
      rule25Target,
      safeAnnualWithdrawal,
      safeMonthlyPension,
    };
  }, [
    primaryAmount,
    secondaryAmount,
    rateReturn,
    rateInflation,
    durationYears,
    waitYears,
    taxBracket,
    stepUpPercent,
    dailyHabitCost,
    monthlyIncome,
    monthlyExpenses,
    emergencyReserve,
    emiDebt,
  ]);

  // Helper: Format text for WhatsApp message
  const getSimulatorWhatsAppText = (sim: SimulatorMetadata) => {
    let summaryText = '';
    if (sim.id === 'cost_of_delay' || sim.category === 'behavioral') {
      summaryText = `Delaying investments by ${waitYears} years leads to a wealth loss of ${formatINR(dynamicResults.delayLoss)}. Starting a ${formatINR(primaryAmount)} monthly SIP today creates ${formatINR(dynamicResults.sipNow)} in ${durationYears} years!`;
    } else if (sim.id === 'fd_vs_inflation' || sim.category === 'inflation') {
      summaryText = `At ${rateInflation}% inflation and ${taxBracket}% tax, an investment of ${formatINR(secondaryAmount)} loses ${formatINR(dynamicResults.fdLoss)} in real purchasing power over ${durationYears} years. Real wealth requires beating inflation!`;
    } else if (sim.id === 'step_up_impact') {
      summaryText = `Adding a ${stepUpPercent}% annual Step-Up to your ${formatINR(primaryAmount)} SIP creates an extra ${formatINR(dynamicResults.stepUpAdvantage)} in final wealth (Total: ${formatINR(dynamicResults.stepUpCorpus)})!`;
    } else if (sim.id === 'latte_factor') {
      summaryText = `A daily discretionary spend of ₹${dailyHabitCost} amounts to ₹${dailyHabitCost * 30}/month. Invested at ${rateReturn}% CAGR, that accumulates to ${formatINR(dynamicResults.habitWealthLost)} in ${durationYears} years!`;
    } else if (sim.category === 'quizzes') {
      summaryText = `Your calculated Financial Health Score is ${dynamicResults.finalHealthScore}/100. Savings Rate: ${dynamicResults.savingsRate}%, Debt-to-Income: ${dynamicResults.debtRatio}%, Emergency Buffer: ${dynamicResults.emergencyMonths} months.`;
    } else if (sim.id === 'rule_of_25') {
      summaryText = `Rule of 25 Retirement Target: With monthly living expenses of ${formatINR(monthlyExpenses)}, your self-sustaining retirement corpus goal is ${formatINR(dynamicResults.rule25Target)}.`;
    } else if (sim.id.includes('rule_of_')) {
      summaryText = `At ${rateReturn}% CAGR return: Your capital doubles in ~${dynamicResults.yearsToDouble.toFixed(1)} years (Rule of 72) and quadruples in ~${dynamicResults.yearsToQuadruple.toFixed(1)} years (Rule of 144)!`;
    } else {
      summaryText = `Custom simulation for ${sim.title}: ${sim.keyTakeaway}`;
    }

    const advisorSig = `\n\n━━━━━━━━━━━━━━━━━━━━\nPrepared for you by:\n*${profile.advisorName || 'Financial Consultant'}*\n${profile.designation || 'Mutual Fund Distributor'} (${profile.professionalDetails || 'ARN Certified'})\n📱 Direct WhatsApp: ${profile.phoneNumber || ''}`;
    return `*Wealth Simulator: ${sim.title}* 📊🚀\n\n${summaryText}${advisorSig}`;
  };

  // 100% NATIVE CLIENT-SIDE HTML5 CANVAS GENERATOR
  // Zero External API calls, Zero tokens, Zero lag, Never hangs on mobile
  const generateSimulatorCanvas = (sim: SimulatorMetadata): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Helper: Rounded Rectangle
    const drawBox = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, strokeW?: number) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeW || 1;
        ctx.stroke();
      }
    };

    // Helper: Clean Word Wrapping
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 3) => {
      const words = text.split(' ');
      let line = '';
      let lineCount = 0;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, y);
          line = words[n] + ' ';
          y += lineHeight;
          lineCount++;
          if (lineCount >= maxLines - 1 && n < words.length - 1) {
            line = line + '...';
            break;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, y);
    };

    // 1. Dark Modern Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative subtle ambient glow
    ctx.fillStyle = '#6366f115';
    ctx.beginPath();
    ctx.arc(100, 100, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b5cf612';
    ctx.beginPath();
    ctx.arc(980, 200, 250, 0, Math.PI * 2);
    ctx.fill();

    // Exterior Border
    ctx.strokeStyle = '#4338ca44';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // 2. Top Header Brand Bar
    drawBox(40, 40, width - 80, 160, 20, '#131b31', '#312e81', 1.5);

    // Brand tag
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('FINADVISOR PRO  •  WEALTH MINDSET SIMULATION', 65, 78);

    // Badge
    drawBox(65, 95, 120, 28, 8, '#7c3aed');
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`#${sim.num} ${sim.badge}`.toUpperCase(), 77, 114);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(sim.title, 200, 117);

    // Subtitle
    ctx.fillStyle = '#c7d2fe';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(sim.subtitle, 65, 165);

    // 3. Side-by-Side Dual Content Panels (Inputs on Left, Results on Right)
    const cardY = 220;
    const cardW = 480;
    const cardH = 470;

    // LEFT PANEL: Simulation Inputs
    drawBox(40, cardY, cardW, cardH, 20, '#0f172aee', '#334155', 1.5);
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('⚙️ INPUT PARAMETERS', 65, cardY + 40);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(65, cardY + 55);
    ctx.lineTo(495, cardY + 55);
    ctx.stroke();

    // Input List items
    const drawInputRow = (label: string, val: string, yPos: number, highlight = false) => {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(label, 65, yPos);

      ctx.fillStyle = highlight ? '#34d399' : '#ffffff';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(val, 495, yPos);
      ctx.textAlign = 'left';
    };

    if (sim.category === 'quizzes') {
      drawInputRow('Monthly Take-Home:', formatINR(monthlyIncome), cardY + 100);
      drawInputRow('Monthly Living Expenses:', formatINR(monthlyExpenses), cardY + 160);
      drawInputRow('Total Loan/Card EMIs:', formatINR(emiDebt), cardY + 220, true);
      drawInputRow('Liquid Emergency Buffer:', formatINR(emergencyReserve), cardY + 280);
      drawInputRow('Target Savings Ratio:', '30%+ Recommended', cardY + 340);
    } else if (sim.id === 'latte_factor') {
      drawInputRow('Daily Discretionary Spend:', `₹${dailyHabitCost}/day`, cardY + 100, true);
      drawInputRow('Monthly Habit Cost:', formatINR(dailyHabitCost * 30), cardY + 160);
      drawInputRow('Compounding Horizon:', `${durationYears} Years`, cardY + 220);
      drawInputRow('Expected Growth Rate:', `${rateReturn}% p.a.`, cardY + 280);
      drawInputRow('Asset Class:', 'Diversified Equity SIP', cardY + 340);
    } else if (sim.category === 'inflation') {
      drawInputRow('Principal Corpus / Expense:', formatINR(secondaryAmount), cardY + 100);
      drawInputRow('Annual Inflation Rate:', `${rateInflation}% p.a.`, cardY + 160, true);
      drawInputRow('Investor Tax Bracket:', `${taxBracket}%`, cardY + 220);
      drawInputRow('Investment Horizon:', `${durationYears} Years`, cardY + 280);
      drawInputRow('Traditional FD Return:', '7.0% Nominal p.a.', cardY + 340);
    } else if (sim.id === 'step_up_impact') {
      drawInputRow('Starting Monthly SIP:', formatINR(primaryAmount), cardY + 100);
      drawInputRow('Annual Step-Up Increment:', `+${stepUpPercent}% / Year`, cardY + 160, true);
      drawInputRow('Investment Horizon:', `${durationYears} Years`, cardY + 220);
      drawInputRow('Expected Return (CAGR):', `${rateReturn}% p.a.`, cardY + 280);
      drawInputRow('Discipline Model:', 'Auto-increment SIP', cardY + 340);
    } else {
      drawInputRow('Monthly Investment (SIP):', formatINR(primaryAmount), cardY + 100);
      drawInputRow('Expected Return (CAGR):', `${rateReturn}% p.a.`, cardY + 160);
      drawInputRow('Total Investment Horizon:', `${durationYears} Years`, cardY + 220);
      drawInputRow('Hesitation / Delay Period:', `${waitYears} Year${waitYears > 1 ? 's' : ''}`, cardY + 280, true);
      drawInputRow('Compounding Frequency:', 'Monthly Automated', cardY + 340);
    }

    // RIGHT PANEL: Projected Results & Graphic Output
    const rightX = 560;
    drawBox(rightX, cardY, cardW, cardH, 20, '#0f172aee', '#4338ca', 1.5);
    ctx.fillStyle = '#a5b4fc';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('📊 SIMULATION IMPACT & OUTCOME', rightX + 25, cardY + 40);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX + 25, cardY + 55);
    ctx.lineTo(rightX + 455, cardY + 55);
    ctx.stroke();

    if (sim.category === 'quizzes') {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('FINANCIAL HEALTH SCORE', rightX + 25, cardY + 95);

      ctx.fillStyle = dynamicResults.finalHealthScore >= 70 ? '#34d399' : dynamicResults.finalHealthScore >= 50 ? '#fbbf24' : '#f87171';
      ctx.font = '900 64px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(`${dynamicResults.finalHealthScore}`, rightX + 25, cardY + 165);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('/ 100', rightX + 155, cardY + 165);

      // Score status
      drawBox(rightX + 25, cardY + 190, cardW - 50, 42, 10, '#1e293b');
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(
        dynamicResults.finalHealthScore >= 75
          ? '🌟 Strong & Resilient Financial Standing'
          : dynamicResults.finalHealthScore >= 50
          ? '⚠️ Moderate - Action Needed on Reserves'
          : '🚨 High Financial Vulnerability Alert',
        rightX + 40,
        cardY + 217
      );

      // Breakdown Metrics
      drawBox(rightX + 25, cardY + 250, 130, 80, 12, '#18223c');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Savings Rate', rightX + 40, cardY + 275);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(`${dynamicResults.savingsRate}%`, rightX + 40, cardY + 310);

      drawBox(rightX + 175, cardY + 250, 130, 80, 12, '#18223c');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Debt-to-Income', rightX + 190, cardY + 275);
      ctx.fillStyle = dynamicResults.debtRatio <= 30 ? '#34d399' : '#f87171';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(`${dynamicResults.debtRatio}%`, rightX + 190, cardY + 310);

      drawBox(rightX + 325, cardY + 250, 130, 80, 12, '#18223c');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Emergency Buffer', rightX + 338, cardY + 275);
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(`${dynamicResults.emergencyMonths} Mo`, rightX + 338, cardY + 310);
    } else if (sim.category === 'inflation') {
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('REAL PURCHASING POWER LOST TO INFLATION', rightX + 25, cardY + 95);

      ctx.fillStyle = '#f87171';
      ctx.font = '900 42px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.fdLoss), rightX + 25, cardY + 150);

      drawBox(rightX + 25, cardY + 180, cardW - 50, 120, 12, '#18223c');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Nominal Balance (Illusion):', rightX + 45, cardY + 215);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.fdNominal), rightX + 300, cardY + 215);

      ctx.fillStyle = '#f87171';
      ctx.font = '15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Real Value Today (Purchasing Power):', rightX + 45, cardY + 255);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.fdRealPower), rightX + 300, cardY + 255);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`Purchasing Power Retained: ${dynamicResults.purchasingPowerRetentionPct}%`, rightX + 45, cardY + 285);
    } else if (sim.id === 'step_up_impact') {
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('STEP-UP SIP WEALTH ADVANTAGE', rightX + 25, cardY + 95);

      ctx.fillStyle = '#34d399';
      ctx.font = '900 44px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(`+${formatINR(dynamicResults.stepUpAdvantage)}`, rightX + 25, cardY + 155);

      drawBox(rightX + 25, cardY + 185, cardW - 50, 120, 12, '#18223c');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Total Wealth with Step-Up:', rightX + 45, cardY + 225);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.stepUpCorpus), rightX + 45, cardY + 255);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`vs Flat SIP of ${formatINR(dynamicResults.sipNow)}`, rightX + 45, cardY + 285);
    } else {
      // Default: Behavioral Delay / Compounding Growth
      const isBehavioral = sim.category === 'behavioral';
      ctx.fillStyle = isBehavioral ? '#f87171' : '#818cf8';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(isBehavioral ? 'WEALTH SACRIFICED BY DELAYING' : 'PROJECTED COMPOUNDED WEALTH', rightX + 25, cardY + 95);

      ctx.fillStyle = isBehavioral ? '#f87171' : '#34d399';
      ctx.font = '900 44px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(isBehavioral ? dynamicResults.delayLoss : dynamicResults.sipNow), rightX + 25, cardY + 155);

      // Comparison Progress Visual Bars
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`Starting Today (${durationYears} Yrs):`, rightX + 25, cardY + 210);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.sipNow), rightX + 330, cardY + 210);

      drawBox(rightX + 25, cardY + 225, cardW - 50, 16, 8, '#1e293b');
      drawBox(rightX + 25, cardY + 225, cardW - 50, 16, 8, '#10b981');

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`Waiting ${waitYears} Year${waitYears > 1 ? 's' : ''} (${Math.max(1, durationYears - waitYears)} Yrs):`, rightX + 25, cardY + 275);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(formatINR(dynamicResults.sipDelay), rightX + 330, cardY + 275);

      const delayedBarPct = Math.max(0.15, Math.min(0.95, dynamicResults.sipDelay / (dynamicResults.sipNow || 1)));
      drawBox(rightX + 25, cardY + 290, cardW - 50, 16, 8, '#1e293b');
      drawBox(rightX + 25, cardY + 290, (cardW - 50) * delayedBarPct, 16, 8, '#f43f5e');
    }

    // 4. Behavioral Takeaway Box
    drawBox(40, 715, width - 80, 140, 16, '#181b36', '#4f46e5', 1.5);
    ctx.fillStyle = '#a5b4fc';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('💡 ADVISOR INSIGHT & KEY TAKEAWAY:', 65, 745);

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
    wrapText(sim.keyTakeaway, 65, 780, width - 130, 26, 3);

    // 5. Embedded Advisor Branding Strip
    drawBox(40, 875, width - 80, 160, 20, '#0a0f1d', '#334155', 2);

    // Avatar Circle
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(110, 955, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    const initial = profile.advisorName ? profile.advisorName.trim()[0].toUpperCase() : 'A';
    ctx.fillText(initial, 110, 967);
    ctx.textAlign = 'left';

    // Advisor Info
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(profile.advisorName || 'Authorized Financial Advisor', 180, 935);

    // Verified Badge
    drawBox(180, 948, 120, 22, 6, '#064e3b');
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('VERIFIED ADVISOR', 190, 963);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${profile.designation || 'Mutual Fund Consultant'}  •  ${profile.professionalDetails || 'ARN Certified'}`, 180, 995);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, monospace';
    ctx.fillText(`📱 WhatsApp: ${profile.phoneNumber || '+91 98251 23456'}`, 180, 1022);

    // Right side brand note
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('FinAdvisor Pro System', width - 70, 945);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Certified Client Simulation Report', width - 70, 970);
    ctx.fillText('Generated on-device for client education', width - 70, 992);
    ctx.textAlign = 'left';

    return canvas;
  };

  // 1-CLICK INSTANT IMAGE DOWNLOAD (100% Client-Side Native Canvas, Never Hangs)
  const handleDownloadImage = (sim: SimulatorMetadata) => {
    try {
      setIsExportingImage(true);
      const canvas = generateSimulatorCanvas(sim);
      const dataUrl = canvas.toDataURL('image/png');

      const fileName = `FinAdvisor_${sim.id}_${Date.now()}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      setExportSuccessMessage('Infographic image downloaded directly to your phone/device!');
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Image download error:', err);
      setExportSuccessMessage('Error creating image. Please try again.');
      setTimeout(() => setExportSuccessMessage(null), 3000);
    } finally {
      setIsExportingImage(false);
    }
  };

  // NATIVE MOBILE & WHATSAPP IMAGE SHARING
  const handleShareImageOrWhatsApp = async (sim: SimulatorMetadata) => {
    try {
      setIsExportingImage(true);
      const canvas = generateSimulatorCanvas(sim);

      // Check if Web Share API with files is supported (Standard in Mobile Chrome & Safari)
      if (navigator.share && navigator.canShare) {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });

        if (blob) {
          const file = new File([blob], `FinAdvisor_${sim.id}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `FinAdvisor Pro: ${sim.title}`,
              text: `Check out this customized simulation for ${sim.title} prepared by ${profile.advisorName}.`,
            });
            setExportSuccessMessage('Shared graphic successfully!');
            setTimeout(() => setExportSuccessMessage(null), 3000);
            return;
          }
        }
      }

      // Fallback: Download image directly to gallery/downloads and open native WhatsApp
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `FinAdvisor_${sim.id}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccessMessage('Image downloaded! Opening WhatsApp to attach and send...');
      setTimeout(() => {
        handleShareWhatsAppText(sim);
        setExportSuccessMessage(null);
      }, 1000);
    } catch (error) {
      console.warn('Share error, opening WhatsApp text fallback:', error);
      handleShareWhatsAppText(sim);
    } finally {
      setIsExportingImage(false);
    }
  };

  // WhatsApp Text Share Trigger (Opens native WhatsApp directly on mobile)
  const handleShareWhatsAppText = (sim: SimulatorMetadata) => {
    const fullMsg = getSimulatorWhatsAppText(sim);
    const encoded = encodeURIComponent(fullMsg);

    // Deep-link directly to native WhatsApp app on mobile without Chrome landing page
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?text=${encoded}`;
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  // TOGGLE EXPAND / COLLAPSE SIMULATOR CARD IN-PLACE
  const handleToggleSimulator = (simId: string) => {
    if (expandedSimulatorId === simId) {
      setExpandedSimulatorId(null);
    } else {
      setExpandedSimulatorId(simId);
      setTimeout(() => {
        const cardEl = document.getElementById(`sim-card-${simId}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 80);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      {/* -------------------------------------------------------------
          HEADER BANNER: Rich Violet / Indigo Color Theme (#6366F1 / #7C3AED)
      ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-violet-500/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>50 Live Behavioral Client Simulators</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 text-xs font-mono font-bold border border-white/10">
                100% Free On-Device Canvas • 0 API Tokens
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Mindset &amp; Visual Simulators
          </h1>

          <p className="text-indigo-200/90 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed">
            Shift investor psychology and overcome hesitation. Click any simulator card below to open its interactive controls and visual charts directly in place.
          </p>

          {/* Quick jump category tags */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('quizzes')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'quizzes'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-400/30 hover:bg-violet-500/25'
              }`}
            >
              1. Quizzes &amp; Health Gauges (1-10)
            </button>
            <button
              onClick={() => setSelectedCategory('inflation')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'inflation'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25'
              }`}
            >
              2. Inflation Realities (11-20)
            </button>
            <button
              onClick={() => setSelectedCategory('strategies')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'strategies'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25'
              }`}
            >
              3. Strategy Comparisons (21-30)
            </button>
            <button
              onClick={() => setSelectedCategory('behavioral')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'behavioral'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25'
              }`}
            >
              4. Behavioral Traps (31-40)
            </button>
            <button
              onClick={() => setSelectedCategory('rules')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedCategory === 'rules'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25'
              }`}
            >
              5. Mathematical Rules (41-50)
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {exportSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          CATEGORY FILTER MENU & SEARCH BAR
      ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Real-time Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50 simulators (e.g. FD, delay, rule 72, latte)..."
              className="w-full pl-9 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all' as SimulatorCategoryId, label: 'All 50 Tools' },
              { id: 'quizzes' as SimulatorCategoryId, label: '1. Quizzes & Gauges (10)' },
              { id: 'inflation' as SimulatorCategoryId, label: '2. Inflation Realities (10)' },
              { id: 'strategies' as SimulatorCategoryId, label: '3. Strategy Tools (10)' },
              { id: 'behavioral' as SimulatorCategoryId, label: '4. Behavioral Traps (10)' },
              { id: 'rules' as SimulatorCategoryId, label: '5. Rules & Math (10)' },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          DIRECTORY: ALL 50 SIMULATORS INTERACTIVE GRID
          EACH SIMULATOR OPENS AND CLOSES IN-PLACE (ACCORDION STYLE)
      ------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Simulator Directory ({filteredSimulators.length} Tools Available)
            </h3>
            <p className="text-xs text-slate-500">
              Tap any simulator to open its interactive visual workspace right in place. Tap again or click Close to collapse it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSimulators.map((sim) => {
            const isExpanded = expandedSimulatorId === sim.id;

            return (
              <div
                key={sim.id}
                id={`sim-card-${sim.id}`}
                className={`transition-all duration-300 rounded-3xl ${
                  isExpanded
                    ? 'col-span-full bg-slate-950 border-2 border-violet-500 shadow-2xl ring-4 ring-violet-500/20 overflow-hidden'
                    : 'bg-white hover:bg-slate-50/80 border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between p-4 group'
                }`}
              >
                {!isExpanded ? (
                  /* ---------------- COMPACT CARD (CLICK TO OPEN IN PLACE) ---------------- */
                  <div
                    onClick={() => handleToggleSimulator(sim.id)}
                    className="h-full flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-violet-100 group-hover:text-violet-900 transition-colors">
                          #{sim.num}
                        </span>
                        <span className="text-[10px] font-bold text-violet-800 bg-violet-100/80 px-2.5 py-0.5 rounded-full truncate">
                          {sim.badge}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-violet-700 line-clamp-1 transition-colors">
                        {sim.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {sim.subtitle}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-violet-600 font-bold group-hover:underline flex items-center space-x-1">
                        <span>Open Simulator</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-violet-500 transition-transform group-hover:translate-y-0.5" />
                    </div>
                  </div>
                ) : (
                  /* ---------------- EXPANDED IN-PLACE WORKBENCH ---------------- */
                  <div>
                    {/* Top Header of Expanded Simulator */}
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 border-b border-indigo-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <span className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                          #{sim.num}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-500 text-slate-950">
                              {sim.badge}
                            </span>
                            <span className="text-xs text-indigo-300 font-medium">
                              Category: {sim.category.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-xl font-black mt-1 text-white tracking-tight">
                            {sim.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Quick Close Button at Top */}
                        <button
                          onClick={() => handleToggleSimulator(sim.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition-all border border-slate-700 cursor-pointer"
                          title="Close Simulator"
                        >
                          <X className="w-4 h-4 text-rose-400" />
                          <span>Close</span>
                        </button>
                      </div>
                    </div>

                    {/* LIVE INTERACTIVE CONTROLS AND VISUAL RESULTS */}
                    <div className="bg-slate-950 text-white p-4 sm:p-7">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* LAYER A: INPUT CONTROLS (5 cols on desktop, top on mobile) */}
                        <div className="lg:col-span-5 space-y-4 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h4 className="font-extrabold text-indigo-300 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                              <Sliders className="w-3.5 h-3.5 text-violet-400" />
                              <span>Simulation Controls</span>
                            </h4>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              Live Math
                            </span>
                          </div>

                          {/* ADAPTIVE SLIDERS BASED ON CATEGORY */}
                          {sim.category === 'quizzes' ? (
                            <div className="space-y-4">
                              {/* Monthly Income Slider */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Monthly Take-Home Income</span>
                                  <span className="font-mono text-violet-300 font-bold">{formatINR(monthlyIncome)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="30000"
                                  max="500000"
                                  step="5000"
                                  value={monthlyIncome}
                                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                  <span>₹30k</span>
                                  <span>₹2.5L</span>
                                  <span>₹5L</span>
                                </div>
                              </div>

                              {/* Monthly Living Expenses Slider */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Monthly Living Expenses</span>
                                  <span className="font-mono text-indigo-300 font-bold">{formatINR(monthlyExpenses)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="15000"
                                  max="250000"
                                  step="2500"
                                  value={monthlyExpenses}
                                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                  className="w-full accent-indigo-500"
                                />
                              </div>

                              {/* Monthly Debt EMI Slider */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Total Monthly Loan / Card EMIs</span>
                                  <span className="font-mono text-rose-400 font-bold">{formatINR(emiDebt)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="150000"
                                  step="2500"
                                  value={emiDebt}
                                  onChange={(e) => setEmiDebt(Number(e.target.value))}
                                  className="w-full accent-rose-500"
                                />
                              </div>

                              {/* Liquid Emergency Reserves */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Liquid Emergency Reserves (Bank/FD)</span>
                                  <span className="font-mono text-emerald-300 font-bold">{formatINR(emergencyReserve)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="1500000"
                                  step="10000"
                                  value={emergencyReserve}
                                  onChange={(e) => setEmergencyReserve(Number(e.target.value))}
                                  className="w-full accent-emerald-500"
                                />
                                <div className="text-[10px] text-slate-400 font-semibold mt-1">
                                  Buffer: <span className="text-emerald-400 font-bold">{dynamicResults.emergencyMonths} months</span> of expenses covered
                                </div>
                              </div>
                            </div>
                          ) : sim.id === 'latte_factor' ? (
                            <div className="space-y-4">
                              {/* Daily Habit Cost */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Daily Discretionary Expense (Latte/Smoking)</span>
                                  <span className="font-mono text-rose-400 font-bold">₹{dailyHabitCost}/day</span>
                                </div>
                                <input
                                  type="range"
                                  min="50"
                                  max="500"
                                  step="10"
                                  value={dailyHabitCost}
                                  onChange={(e) => setDailyHabitCost(Number(e.target.value))}
                                  className="w-full accent-rose-500"
                                />
                                <div className="text-[11px] text-slate-400 font-semibold mt-1">
                                  Monthly Leakage: <span className="font-mono text-rose-400 font-bold">{formatINR(dailyHabitCost * 30)}/month</span>
                                </div>
                              </div>

                              {/* Horizon Years */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Compounding Horizon</span>
                                  <span className="font-mono text-violet-300 font-bold">{durationYears} Years</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="30"
                                  step="1"
                                  value={durationYears}
                                  onChange={(e) => setDurationYears(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                              </div>

                              {/* Return % */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Expected Growth Rate (CAGR)</span>
                                  <span className="font-mono text-violet-300 font-bold">{rateReturn}% p.a.</span>
                                </div>
                                <input
                                  type="range"
                                  min="8"
                                  max="16"
                                  step="0.5"
                                  value={rateReturn}
                                  onChange={(e) => setRateReturn(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                              </div>
                            </div>
                          ) : sim.category === 'inflation' ? (
                            <div className="space-y-4">
                              {/* Lumpsum Amount */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Investment Corpus / Expense</span>
                                  <span className="font-mono text-violet-300 font-bold">{formatINR(secondaryAmount)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="100000"
                                  max="10000000"
                                  step="100000"
                                  value={secondaryAmount}
                                  onChange={(e) => setSecondaryAmount(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                              </div>

                              {/* Inflation % */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Annual Inflation Rate</span>
                                  <span className="font-mono text-rose-400 font-bold">{rateInflation}% p.a.</span>
                                </div>
                                <input
                                  type="range"
                                  min="4"
                                  max="12"
                                  step="0.5"
                                  value={rateInflation}
                                  onChange={(e) => setRateInflation(Number(e.target.value))}
                                  className="w-full accent-rose-500"
                                />
                              </div>

                              {/* Tax Bracket % */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Investor Tax Bracket</span>
                                  <span className="font-mono text-amber-300 font-bold">{taxBracket}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="35"
                                  step="5"
                                  value={taxBracket}
                                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                                  className="w-full accent-amber-500"
                                />
                              </div>

                              {/* Time Horizon */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Time Horizon</span>
                                  <span className="font-mono text-indigo-300 font-bold">{durationYears} Years</span>
                                </div>
                                <input
                                  type="range"
                                  min="3"
                                  max="30"
                                  step="1"
                                  value={durationYears}
                                  onChange={(e) => setDurationYears(Number(e.target.value))}
                                  className="w-full accent-indigo-500"
                                />
                              </div>
                            </div>
                          ) : sim.id === 'step_up_impact' ? (
                            <div className="space-y-4">
                              {/* Monthly SIP Amount */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Starting Monthly SIP</span>
                                  <span className="font-mono text-emerald-400 font-bold">{formatINR(primaryAmount)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="2000"
                                  max="100000"
                                  step="1000"
                                  value={primaryAmount}
                                  onChange={(e) => setPrimaryAmount(Number(e.target.value))}
                                  className="w-full accent-emerald-500"
                                />
                              </div>

                              {/* Step-Up % */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Annual Step-Up Rate</span>
                                  <span className="font-mono text-violet-400 font-bold">+{stepUpPercent}% / Year</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="25"
                                  step="1"
                                  value={stepUpPercent}
                                  onChange={(e) => setStepUpPercent(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                              </div>

                              {/* Expected Return & Years */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-400">CAGR %</label>
                                  <input
                                    type="range"
                                    min="8"
                                    max="16"
                                    step="0.5"
                                    value={rateReturn}
                                    onChange={(e) => setRateReturn(Number(e.target.value))}
                                    className="w-full accent-violet-500"
                                  />
                                  <span className="text-xs font-mono text-violet-300 font-bold">{rateReturn}%</span>
                                </div>
                                <div>
                                  <label className="text-[11px] font-bold text-slate-400">Years</label>
                                  <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="1"
                                    value={durationYears}
                                    onChange={(e) => setDurationYears(Number(e.target.value))}
                                    className="w-full accent-indigo-500"
                                  />
                                  <span className="text-xs font-mono text-indigo-300 font-bold">{durationYears} Yrs</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* DEFAULT (Behavioral Delay / General Compounding) */
                            <div className="space-y-4">
                              {/* Monthly SIP Amount */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Monthly Investment (SIP)</span>
                                  <span className="font-mono text-emerald-400 font-bold">{formatINR(primaryAmount)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="1000"
                                  max="100000"
                                  step="1000"
                                  value={primaryAmount}
                                  onChange={(e) => setPrimaryAmount(Number(e.target.value))}
                                  className="w-full accent-emerald-500"
                                />
                              </div>

                              {/* Expected Return % */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Expected Growth (CAGR)</span>
                                  <span className="font-mono text-violet-300 font-bold">{rateReturn}% p.a.</span>
                                </div>
                                <input
                                  type="range"
                                  min="6"
                                  max="18"
                                  step="0.5"
                                  value={rateReturn}
                                  onChange={(e) => setRateReturn(Number(e.target.value))}
                                  className="w-full accent-violet-500"
                                />
                              </div>

                              {/* Total Horizon (Years) */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span>Total Time Horizon</span>
                                  <span className="font-mono text-indigo-300 font-bold">{durationYears} Years</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="35"
                                  step="1"
                                  value={durationYears}
                                  onChange={(e) => setDurationYears(Number(e.target.value))}
                                  className="w-full accent-indigo-500"
                                />
                              </div>

                              {/* Delay in Starting (Years) */}
                              <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                  <span className="text-rose-400 flex items-center space-x-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Delay in Starting (Hesitation)</span>
                                  </span>
                                  <span className="font-mono text-rose-400 font-bold">{waitYears} Year{waitYears > 1 ? 's' : ''} Delay</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max={Math.min(10, durationYears - 2)}
                                  step="1"
                                  value={waitYears}
                                  onChange={(e) => setWaitYears(Number(e.target.value))}
                                  className="w-full accent-rose-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* LAYER B: REAL-TIME VISUAL CANVAS & OUTPUT (7 cols on desktop) */}
                        <div className="lg:col-span-7 bg-slate-900/95 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
                          {sim.category === 'quizzes' ? (
                            /* Visual Gauge: Comprehensive Health Score */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">
                                    Calculated Financial Health Index
                                  </span>
                                  <div className="text-3xl sm:text-5xl font-black text-white mt-1 font-mono flex items-center space-x-2">
                                    <span className={dynamicResults.finalHealthScore >= 70 ? 'text-emerald-400' : dynamicResults.finalHealthScore >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                                      {dynamicResults.finalHealthScore}
                                    </span>
                                    <span className="text-sm sm:text-base text-slate-400 font-bold">/ 100</span>
                                  </div>
                                  <span className="text-xs text-slate-300">
                                    {dynamicResults.finalHealthScore >= 75
                                      ? '🌟 Excellent Financial Health'
                                      : dynamicResults.finalHealthScore >= 50
                                      ? '⚠️ Moderate Health - Vulnerable to Shock'
                                      : '🚨 High Financial Vulnerability'}
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                  <Gauge className="w-6 h-6" />
                                </div>
                              </div>

                              {/* Breakdown Meters */}
                              <div className="grid grid-cols-3 gap-2.5 pt-1">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block">Savings Rate</span>
                                  <span className="text-sm font-black text-emerald-400 font-mono mt-0.5 block">
                                    {dynamicResults.savingsRate}%
                                  </span>
                                  <span className="text-[9px] text-slate-500">Benchmark: 30%+</span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block">Debt-to-Income</span>
                                  <span className={`text-sm font-black font-mono mt-0.5 block ${dynamicResults.debtRatio <= 30 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {dynamicResults.debtRatio}%
                                  </span>
                                  <span className="text-[9px] text-slate-500">Safe: &lt;30%</span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block">Emergency Buffer</span>
                                  <span className="text-sm font-black text-indigo-400 font-mono mt-0.5 block">
                                    {dynamicResults.emergencyMonths} Mo
                                  </span>
                                  <span className="text-[9px] text-slate-500">Safe: 6+ Months</span>
                                </div>
                              </div>
                            </div>
                          ) : sim.category === 'inflation' ? (
                            /* Visual Gauge: FD vs Inflation Real Loss */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                                    Real Purchasing Power Lost to Inflation
                                  </span>
                                  <div className="text-2xl sm:text-4xl font-black text-rose-400 mt-1 font-mono">
                                    {formatINR(dynamicResults.fdLoss)}
                                  </div>
                                  <span className="text-xs text-slate-300">
                                    Loss in real purchasing value over {durationYears} years at {rateInflation}% inflation
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  <AlertTriangle className="w-6 h-6" />
                                </div>
                              </div>

                              <div className="space-y-2 pt-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Nominal FD Balance (Illusion):</span>
                                  <span className="font-mono text-slate-200 font-bold">{formatINR(dynamicResults.fdNominal)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-rose-400 font-bold">Real Value Today (Actual Goods):</span>
                                  <span className="font-mono text-rose-400 font-bold">{formatINR(dynamicResults.fdRealPower)}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-slate-800 pt-1">
                                  <span className="text-slate-400">Purchasing Power Retained:</span>
                                  <span className="font-mono text-amber-300 font-bold">{dynamicResults.purchasingPowerRetentionPct}%</span>
                                </div>
                              </div>
                            </div>
                          ) : sim.id === 'step_up_impact' ? (
                            /* Step-up SIP Advantage */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">
                                    Step-Up SIP Extra Wealth Created
                                  </span>
                                  <div className="text-2xl sm:text-4xl font-black text-emerald-400 mt-1 font-mono">
                                    +{formatINR(dynamicResults.stepUpAdvantage)}
                                  </div>
                                  <span className="text-xs text-slate-300">
                                    Total Corpus with +{stepUpPercent}% yearly increment: {formatINR(dynamicResults.stepUpCorpus)}
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  <TrendingUp className="w-6 h-6" />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-slate-400 block">Flat SIP Final</span>
                                  <span className="text-sm font-black text-slate-300 font-mono mt-1 block">
                                    {formatINR(dynamicResults.sipNow)}
                                  </span>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30">
                                  <span className="text-[10px] text-emerald-400 font-bold block">Step-Up SIP Final</span>
                                  <span className="text-sm font-black text-emerald-400 font-mono mt-1 block">
                                    {formatINR(dynamicResults.stepUpCorpus)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : sim.id.includes('rule_of_') ? (
                            /* Mathematical Rules: Doubling & Tripling */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-violet-400 font-mono font-bold uppercase">
                                    Rule of 72 Compounding Clock
                                  </span>
                                  <div className="text-2xl sm:text-4xl font-black text-white mt-1 font-mono">
                                    ~{dynamicResults.yearsToDouble.toFixed(1)} Years
                                  </div>
                                  <span className="text-xs text-indigo-300">
                                    Time required to double your wealth at {rateReturn}% CAGR
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                  <TrendingUp className="w-6 h-6" />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-violet-400 font-bold block">Rule of 114 (3x)</span>
                                  <span className="text-sm font-black text-white font-mono mt-1 block">
                                    ~{dynamicResults.yearsToTriple.toFixed(1)} Yrs
                                  </span>
                                  <span className="text-[9px] text-slate-400">Capital Triples</span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                                  <span className="text-[10px] text-emerald-400 font-bold block">Rule of 144 (4x)</span>
                                  <span className="text-sm font-black text-white font-mono mt-1 block">
                                    ~{dynamicResults.yearsToQuadruple.toFixed(1)} Yrs
                                  </span>
                                  <span className="text-[9px] text-slate-400">Capital Quadruples</span>
                                </div>
                              </div>
                            </div>
                          ) : sim.id === 'latte_factor' ? (
                            /* Latte Factor Opportunity Loss */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-rose-400 font-mono font-bold uppercase">
                                    Compounded Habit Opportunity Cost
                                  </span>
                                  <div className="text-2xl sm:text-4xl font-black text-rose-400 mt-1 font-mono">
                                    {formatINR(dynamicResults.habitWealthLost)}
                                  </div>
                                  <span className="text-xs text-slate-300">
                                    Wealth forfeited over {durationYears} years by spending ₹{dailyHabitCost}/day
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  <Coffee className="w-6 h-6" />
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                                <div className="flex justify-between">
                                  <span>Daily Spend:</span>
                                  <span className="font-mono text-white font-bold">₹{dailyHabitCost}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Monthly Total:</span>
                                  <span className="font-mono text-white font-bold">{formatINR(dailyHabitCost * 30)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400 font-bold">
                                  <span>If Invested at {rateReturn}% CAGR:</span>
                                  <span className="font-mono">{formatINR(dynamicResults.habitWealthLost)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Default Behavioral & Wealth Comparison View */
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">
                                    {sim.category === 'behavioral' ? 'Cost of Procrastination' : 'Projected Wealth Potential'}
                                  </span>
                                  <div className="text-2xl sm:text-4xl font-black text-white mt-1 font-mono">
                                    {sim.category === 'behavioral'
                                      ? formatINR(dynamicResults.delayLoss)
                                      : formatINR(dynamicResults.sipNow)}
                                  </div>
                                  <span className="text-xs text-indigo-300">
                                    {sim.category === 'behavioral'
                                      ? `Wealth sacrificed by waiting ${waitYears} years`
                                      : `Compounded value over ${durationYears} years at ${rateReturn}% CAGR`}
                                  </span>
                                </div>

                                <div className="p-3 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                  <TrendingUp className="w-6 h-6" />
                                </div>
                              </div>

                              {/* Dual Comparison Bars */}
                              <div className="pt-2 space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                                    <span>Starting Today ({durationYears} Yrs)</span>
                                    <span className="text-emerald-400 font-mono">{formatINR(dynamicResults.sipNow)}</span>
                                  </div>
                                  <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                                    <span>Waiting {waitYears} Year{waitYears > 1 ? 's' : ''} ({Math.max(1, durationYears - waitYears)} Yrs)</span>
                                    <span className="text-rose-400 font-mono">{formatINR(dynamicResults.sipDelay)}</span>
                                  </div>
                                  <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.max(
                                          10,
                                          Math.min(95, Math.round((dynamicResults.sipDelay / (dynamicResults.sipNow || 1)) * 100))
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Core Behavioral Insight Callout */}
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-200 mt-4">
                            <strong className="text-white block mb-0.5">Key Takeaway:</strong>
                            {sim.keyTakeaway}
                          </div>
                        </div>
                      </div>

                      {/* EMBEDDED ADVISOR BRANDING FOOTER */}
                      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center space-x-3.5">
                          {profile.profilePhoto ? (
                            <img
                              src={profile.profilePhoto}
                              alt={profile.advisorName}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-violet-400"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center font-black text-lg border-2 border-violet-400">
                              {profile.advisorName ? profile.advisorName[0] : 'A'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-black text-white text-sm sm:text-base tracking-tight">
                                {profile.advisorName || 'Authorized Financial Advisor'}
                              </h5>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                Verified Advisor
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">
                              {profile.designation || 'Mutual Fund Distributor & Financial Consultant'} • {profile.professionalDetails || 'ARN Certified'}
                            </p>
                            <p className="text-xs font-mono text-amber-300 mt-0.5 font-bold">
                              📱 WhatsApp: {profile.phoneNumber || '+91 98251 23456'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs text-slate-400">
                          <span className="text-violet-300 font-bold block">FinAdvisor Pro Visualization Engine</span>
                          <span>Prepared for informed investor decision making</span>
                        </div>
                      </div>
                    </div>

                    {/* LAYER C: ACTION FOOTER BAR */}
                    <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <Award className="w-4 h-4 text-violet-400" />
                        <span>Ready for 1-Click Client Consultation &amp; Share</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                        {/* Download Image Button (Instant Native Canvas) */}
                        <button
                          onClick={() => handleDownloadImage(sim)}
                          disabled={isExportingImage}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 border border-slate-700"
                        >
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          <span>{isExportingImage ? 'Generating Image...' : 'Download Image'}</span>
                        </button>

                        {/* Share Image on WhatsApp (Native Web Share / Direct) */}
                        <button
                          onClick={() => handleShareImageOrWhatsApp(sim)}
                          disabled={isExportingImage}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          <Share2 className="w-4 h-4 fill-white" />
                          <span>Share Image on WhatsApp</span>
                        </button>

                        {/* Share Text on WhatsApp */}
                        <button
                          onClick={() => handleShareWhatsAppText(sim)}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share Text on WhatsApp</span>
                        </button>

                        {/* Close Simulator Button */}
                        <button
                          onClick={() => handleToggleSimulator(sim.id)}
                          className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-slate-700 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                          <span>Close</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
