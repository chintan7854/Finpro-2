import { QuizQuestion, QuizTopic } from '../types/financeQuiz';
import { AdvisorProfile, LanguageCode } from '../types';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
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

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * 9:16 Vertical Question Image (1080 × 1920)
 * NEVER reveals the correct answer.
 */
export async function renderVerticalQuestionImage(
  topicTitle: string,
  topicNum: number,
  question: QuizQuestion,
  advisor: AdvisorProfile,
  language: LanguageCode = 'en'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Dark Premium Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  bgGrad.addColorStop(0, '#090d16'); // slate-950
  bgGrad.addColorStop(0.3, '#064e3b'); // emerald-950
  bgGrad.addColorStop(0.7, '#022c22'); // deep emerald
  bgGrad.addColorStop(1, '#0f172a'); // slate-900
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Subtle ambient glow
  ctx.save();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.09)';
  ctx.beginPath();
  ctx.arc(950, 300, 420, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(100, 1400, 380, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer decorative border
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1008, 1848);

  // 2. Header Strip
  let curY = 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(70, curY, 940, 80, 20);
  ctx.fill();

  ctx.fillStyle = '#34d399'; // emerald-400
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('FINADVISOR PRO · FINANCE QUIZ SERIES', 105, curY + 48);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`TOPIC #${topicNum}`, 975, curY + 48);
  ctx.textAlign = 'left';

  // 3. Topic Banner
  curY += 120;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillText('FINANCIAL LITERACY CHALLENGE', 70, curY);

  curY += 40;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px system-ui, -apple-system, sans-serif';
  const topicLines = wrapText(ctx, topicTitle, 940);
  for (const line of topicLines.slice(0, 2)) {
    ctx.fillText(line, 70, curY);
    curY += 50;
  }

  // 4. Question Box
  curY += 25;
  const qBoxTop = curY;
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  const qLines = wrapText(ctx, question.questionText, 860);
  const qBoxHeight = Math.max(180, qLines.length * 44 + 60);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.beginPath();
  ctx.roundRect(70, qBoxTop, 940, qBoxHeight, 24);
  ctx.fill();

  // Question Title badge
  if (question.questionTitle) {
    ctx.fillStyle = '#065f46';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(`📌 ${question.questionTitle.toUpperCase()}`, 105, qBoxTop + 45);
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  let qTextY = question.questionTitle ? qBoxTop + 85 : qBoxTop + 65;
  for (const line of qLines) {
    ctx.fillText(line, 105, qTextY);
    qTextY += 42;
  }

  // 5. Four Options (A, B, C, D)
  curY = qBoxTop + qBoxHeight + 35;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optBoxHeight = 110;

  for (let i = 0; i < 4; i++) {
    const y = curY + i * (optBoxHeight + 18);
    const optText = question.options[i];

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(70, y, 940, optBoxHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Circle Badge for letter
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(130, y + optBoxHeight / 2, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(optionLetters[i], 130, y + optBoxHeight / 2 + 9);
    ctx.textAlign = 'left';

    // Option Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 26px system-ui, -apple-system, sans-serif';
    const optLines = wrapText(ctx, optText, 760);
    let optY = optLines.length > 1 ? y + 42 : y + 62;
    for (const l of optLines.slice(0, 2)) {
      ctx.fillText(l, 185, optY);
      optY += 34;
    }
  }

  // 6. Interactive Participation Callout
  const calloutY = curY + 4 * (optBoxHeight + 18) + 15;
  ctx.fillStyle = 'rgba(52, 211, 153, 0.12)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(70, calloutY, 940, 75, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('💬 Reply with your answer or test your family members!', 540, calloutY + 46);
  ctx.textAlign = 'left';

  // 7. Footer: Advisor Branding
  const footerY = 1690;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(70, footerY, 940, 165, 24);
  ctx.fill();
  ctx.stroke();

  if (advisor.profilePhoto) {
    try {
      const avatarImg = await loadImage(advisor.profilePhoto);
      if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(155, footerY + 82, 52, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatarImg, 103, footerY + 30, 104, 104);
        ctx.restore();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(155, footerY + 82, 52, 0, Math.PI * 2);
        ctx.stroke();
      }
    } catch {
      // ignore
    }
  }

  const advX = advisor.profilePhoto ? 235 : 110;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.fillText(advisor.advisorName || 'Financial Advisor', advX, footerY + 60);

  ctx.fillStyle = '#34d399';
  ctx.font = '600 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(advisor.designation || 'Certified Financial Planner', advX, footerY + 95);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px system-ui, -apple-system, sans-serif';
  const detail = advisor.professionalDetails ? `${advisor.professionalDetails} · ` : '';
  ctx.fillText(`${detail}📞 ${advisor.phoneNumber}`, advX, footerY + 128);

  return canvas.toDataURL('image/png');
}

/**
 * 9:16 Vertical Answer Image (1080 × 1920)
 * Reveals correct answer, calculations, explanation, takeaway & disclaimer.
 */
export async function renderVerticalAnswerImage(
  topicTitle: string,
  topicNum: number,
  question: QuizQuestion,
  advisor: AdvisorProfile,
  language: LanguageCode = 'en'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background Gradient (Deep Navy to Forest Emerald)
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
  bgGrad.addColorStop(0, '#022c22'); // deep emerald
  bgGrad.addColorStop(0.4, '#090d16'); // slate-950
  bgGrad.addColorStop(0.8, '#064e3b'); // emerald-950
  bgGrad.addColorStop(1, '#0f172a'); // slate-900
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Border
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1008, 1848);

  // 1. Top Header Banner
  let curY = 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(70, curY, 940, 80, 20);
  ctx.fill();

  ctx.fillStyle = '#10b981'; // emerald-500
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('FINADVISOR PRO · OFFICIAL ANSWER & RATIONALE', 105, curY + 48);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`TOPIC #${topicNum}`, 975, curY + 48);
  ctx.textAlign = 'left';

  // 2. Question Summary
  curY += 120;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillText('QUESTION OVERVIEW', 70, curY);

  curY += 36;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  const qLines = wrapText(ctx, question.questionText, 940);
  for (const l of qLines.slice(0, 2)) {
    ctx.fillText(l, 70, curY);
    curY += 38;
  }

  // 3. Big Correct Answer Box
  curY += 25;
  const letters = ['A', 'B', 'C', 'D'];
  const correctLetter = letters[question.correctIndex];
  const correctText = question.options[question.correctIndex];

  ctx.fillStyle = '#065f46'; // emerald-800
  ctx.strokeStyle = '#34d399'; // emerald-400
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(70, curY, 940, 150, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#a7f3d0';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('VERIFIED CORRECT ANSWER', 110, curY + 45);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Option ${correctLetter}: ${correctText}`, 110, curY + 95);

  // 4. Step-by-Step Calculation Box
  curY += 180;
  if (question.stepByStepCalculations && question.stepByStepCalculations.length > 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const calcBoxH = Math.min(320, question.stepByStepCalculations.length * 60 + 60);
    ctx.roundRect(70, curY, 940, calcBoxH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('📐 STEP-BY-STEP FINANCIAL CALCULATIONS', 105, curY + 40);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    let calcY = curY + 80;
    for (const step of question.stepByStepCalculations.slice(0, 4)) {
      const stepLines = wrapText(ctx, step, 870);
      for (const sl of stepLines.slice(0, 2)) {
        ctx.fillText(sl, 105, calcY);
        calcY += 32;
      }
    }
    curY += calcBoxH + 25;
  }

  // 5. Detailed Explanation Box
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  const expBoxH = 360;
  ctx.beginPath();
  ctx.roundRect(70, curY, 940, expBoxH, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fbbf24'; // amber-400
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('💡 DETAILED FINANCIAL RATIONALE', 105, curY + 42);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '400 24px system-ui, -apple-system, sans-serif';
  const expLines = wrapText(ctx, question.explanation, 870);
  let expY = curY + 85;
  for (const el of expLines.slice(0, 5)) {
    ctx.fillText(el, 105, expY);
    expY += 36;
  }

  // Common trap / rule of thumb inside explanation box
  if (question.financialTakeaway || question.ruleOfThumb) {
    const takeawayText = question.financialTakeaway || question.ruleOfThumb || '';
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.beginPath();
    ctx.roundRect(95, curY + 260, 890, 80, 14);
    ctx.fill();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('KEY TAKEAWAY: ' + takeawayText.slice(0, 75), 115, curY + 310);
  }

  // 6. Statutory Disclaimer
  const disclaimerY = 1630;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 16px system-ui, -apple-system, sans-serif';
  const discText = question.disclaimer || 'Mutual fund investments are subject to market risks, read all scheme related documents carefully. Projections are estimates and not guaranteed.';
  const discLines = wrapText(ctx, discText, 940);
  let dY = disclaimerY;
  for (const dl of discLines.slice(0, 2)) {
    ctx.fillText(dl, 70, dY);
    dY += 24;
  }

  // 7. Footer: Advisor Branding
  const footerY = 1690;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(70, footerY, 940, 165, 24);
  ctx.fill();
  ctx.stroke();

  if (advisor.profilePhoto) {
    try {
      const avatarImg = await loadImage(advisor.profilePhoto);
      if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(155, footerY + 82, 52, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatarImg, 103, footerY + 30, 104, 104);
        ctx.restore();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(155, footerY + 82, 52, 0, Math.PI * 2);
        ctx.stroke();
      }
    } catch {
      // ignore
    }
  }

  const advX = advisor.profilePhoto ? 235 : 110;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
  ctx.fillText(advisor.advisorName || 'Financial Advisor', advX, footerY + 60);

  ctx.fillStyle = '#34d399';
  ctx.font = '600 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(advisor.designation || 'Certified Financial Planner', advX, footerY + 95);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px system-ui, -apple-system, sans-serif';
  const detail = advisor.professionalDetails ? `${advisor.professionalDetails} · ` : '';
  ctx.fillText(`${detail}📞 ${advisor.phoneNumber}`, advX, footerY + 128);

  return canvas.toDataURL('image/png');
}

/**
 * Copies a PNG DataURL to clipboard
 */
export async function copyCanvasImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard write error', err);
  }
  return false;
}
