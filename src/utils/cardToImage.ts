import { AdvisorSnapshot, FinancialSubjectId, LanguageCode } from '../types';

export interface CardExportOptions {
  cardType: 'status_slide' | 'insight_card' | 'article_quote';
  title: string;
  badgeText: string;
  bodyText: string;
  themeColor: 'emerald' | 'blue' | 'amber' | 'slate';
  advisorSnapshot: AdvisorSnapshot;
  appliedCta?: string;
  format?: 'status_9_16' | 'square_1_1';
}

function wrapText(
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
 * Renders a specific card (like the exact WhatsApp Slide or Insight Card from the app screen)
 * into a crystal-clear high-res PNG image.
 */
export async function exportCardAsImage(options: CardExportOptions): Promise<string> {
  const isStatus = options.format !== 'square_1_1';
  const width = isStatus ? 1080 : 1080;
  const height = isStatus ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const {
    badgeText,
    bodyText,
    themeColor,
    advisorSnapshot,
    appliedCta
  } = options;

  // Background gradient matching the selected card in the app
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (themeColor === 'emerald') {
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.6, '#022c22');
    grad.addColorStop(1, '#091512');
  } else if (themeColor === 'blue') {
    grad.addColorStop(0, '#0f294a');
    grad.addColorStop(0.6, '#0c1a2e');
    grad.addColorStop(1, '#050c17');
  } else if (themeColor === 'amber') {
    grad.addColorStop(0, '#3b2505');
    grad.addColorStop(0.6, '#211502');
    grad.addColorStop(1, '#0d0901');
  } else {
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.6, '#0f172a');
    grad.addColorStop(1, '#020617');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient radial glow
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.35, 80, width * 0.5, height * 0.35, 550);
  glow.addColorStop(0, themeColor === 'emerald' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.22)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let x = 60; x < width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Preload photo
  const photoImg = advisorSnapshot.photo ? await loadImage(advisorSnapshot.photo) : null;
  const logoImg = advisorSnapshot.logo ? await loadImage(advisorSnapshot.logo) : null;

  const margin = 70;
  const contentWidth = width - margin * 2;

  // Top header branding
  let topY = isStatus ? 110 : 80;
  ctx.save();
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('FINADVISOR PRO • DAILY CLIENT EDUCATION', margin, topY);

  if (logoImg) {
    ctx.drawImage(logoImg, width - margin - 70, topY - 25, 70, 70);
  }
  ctx.restore();

  topY += isStatus ? 100 : 70;

  // Central Card Box (Exact visual match to the in-app card)
  const cardTop = topY;
  const cardPadding = 50;
  const cardHeight = isStatus ? 920 : 540;

  ctx.save();
  // Card glass background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(margin, cardTop, contentWidth, cardHeight, 36);
  ctx.fill();
  ctx.stroke();

  // Badge pill (e.g. SLIDE 1: HOOK or STAT HIGHLIGHT)
  const badgePadX = 26;
  const badgeH = 46;
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  const badgeW = ctx.measureText(badgeText.toUpperCase()).width + badgePadX * 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(margin + cardPadding, cardTop + cardPadding, badgeW, badgeH, 23);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = themeColor === 'emerald' ? '#34d399' : '#38bdf8';
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText.toUpperCase(), margin + cardPadding + badgePadX, cardTop + cardPadding + badgeH / 2);

  // Main Card Body Text
  const bodyY = cardTop + cardPadding + badgeH + 45;
  const bodyFontSize = isStatus ? 44 : 34;
  ctx.font = `600 ${bodyFontSize}px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'top';

  const lines = wrapText(ctx, bodyText, contentWidth - cardPadding * 2);
  const lineHeight = bodyFontSize * 1.45;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], margin + cardPadding, bodyY + i * lineHeight);
  }

  // Card bottom tag
  ctx.font = '500 20px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('Financial Literacy Series', margin + cardPadding, cardTop + cardHeight - 35);
  ctx.restore();

  // CTA Ribbon below card if in vertical status format
  if (isStatus && appliedCta) {
    const ctaY = cardTop + cardHeight + 40;
    const ctaH = 75;
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(margin, ctaY, contentWidth, ctaH, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 25px system-ui, -apple-system, "Noto Sans Devanagari", "Noto Sans Gujarati", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`👉  ${appliedCta}`, width / 2, ctaY + 47);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  // Master Advisor Profile Signature Block at bottom
  const footerHeight = isStatus ? 240 : 170;
  const footerY = height - footerHeight - (isStatus ? 70 : 35);

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, footerY);
  ctx.lineTo(width - margin, footerY);
  ctx.stroke();

  const photoSize = isStatus ? 130 : 95;
  const photoX = margin;
  const photoY = footerY + 30;

  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const initials = advisorSnapshot.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    ctx.fillText(initials || 'FA', photoX + photoSize / 2, photoY + photoSize / 2 + 13);
    ctx.textAlign = 'left';
  }

  const textX = photoX + photoSize + 28;
  const textMaxW = width - margin - textX;

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isStatus ? 36 : 28}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(advisorSnapshot.name, textX, photoY + (isStatus ? 35 : 28));

  // Designation
  ctx.fillStyle = '#34d399';
  ctx.font = `600 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
  const desLines = wrapText(ctx, advisorSnapshot.designation, textMaxW);
  ctx.fillText(desLines[0] || '', textX, photoY + (isStatus ? 72 : 55));

  // Contact
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isStatus ? 26 : 21}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`📱 WhatsApp / Call: ${advisorSnapshot.contact}`, textX, photoY + (isStatus ? 112 : 85));

  // Achievement and credentials line
  const creds = [advisorSnapshot.achievement, advisorSnapshot.credentials].filter(Boolean).join(' • ');
  if (creds) {
    ctx.fillStyle = '#fde68a';
    ctx.font = `500 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    const credLines = wrapText(ctx, creds, textMaxW);
    ctx.fillText(credLines[0] || creds, textX, photoY + (isStatus ? 142 : 110));
  }
  ctx.restore();

  // Bottom watermark disclaimer
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = 'italic 16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('For Educational Awareness • Consult Your Certified Financial Advisor', width / 2, height - (isStatus ? 25 : 12));
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png', 1.0);
}
