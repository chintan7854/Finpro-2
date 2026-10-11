import {
  FinancialSubjectId,
  LanguageCode,
  CreativeThemeId,
  ThemePosterData,
} from '../types';
import {
  THEME_STYLES,
  wrapText,
  loadImage,
  drawCreativeSubjectBackground,
} from './posterRenderer';

export const FONT_STACK = '"Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';

export interface ThemePosterRenderConfig {
  themeId: CreativeThemeId;
  format?: 'post_1_1'; // Strictly Square 1:1 format only
  colorTheme: string;
  backgroundStyle?: 'subject_art' | 'aurora_mesh' | 'fintech_grid' | 'wealth_constellation' | 'minimalist';
  backgroundSeed?: number;
  subjectId: FinancialSubjectId;
  subjectTitle: string;
  language: LanguageCode;
  data: ThemePosterData;
  advisorName: string;
  advisorDesignation: string;
  advisorAchievement?: string;
  advisorPhone: string;
  advisorCredentials?: string;
  advisorPhoto?: string;
  advisorLogo?: string;
}

export async function renderThemePosterToCanvas(
  canvas: HTMLCanvasElement,
  config: ThemePosterRenderConfig
): Promise<void> {
  // Strictly Square (1:1 - 1080x1080) for all 25 creative themes
  const isStatus = false;
  const width = 1080;
  const height = 1080;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const theme = (THEME_STYLES as any)[config.colorTheme] || THEME_STYLES.emerald;

  // 1. Procedural Creative Background
  drawCreativeSubjectBackground(
    ctx,
    width,
    height,
    {
      subjectId: config.subjectId,
      backgroundSeed: config.backgroundSeed,
      backgroundStyle: config.backgroundStyle,
    },
    theme,
    isStatus
  );

  // 2. Preload Images
  const [photoImg, logoImg] = await Promise.all([
    config.advisorPhoto ? loadImage(config.advisorPhoto) : null,
    config.advisorLogo ? loadImage(config.advisorLogo) : null,
  ]);

  const margin = 48;
  const contentWidth = width - margin * 2;
  const pillY = 52; // Lowered from 38 to 52 for clean top margin
  const pillHeight = 44;

  // 3. Top Header Bar: Subject Pill & Topic / Badge
  ctx.save();
  const badgeText = (config.data.badgeText || config.subjectTitle).toUpperCase();
  const pillPaddingX = 22;
  ctx.font = `bold 19px ${FONT_STACK}`;
  const pillWidth = ctx.measureText(badgeText).width + pillPaddingX * 2;

  ctx.fillStyle = theme.accent + '26';
  ctx.strokeStyle = theme.accent + '80';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(margin, pillY, pillWidth, pillHeight, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = theme.accentLight;
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, margin + pillPaddingX, pillY + pillHeight / 2);

  if (logoImg) {
    const logoSize = 52;
    ctx.drawImage(logoImg, width - margin - logoSize, pillY - 4, logoSize, logoSize);
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = `bold 18px ${FONT_STACK}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('FINADVISOR PRO', width - margin, pillY + pillHeight / 2);
    ctx.textAlign = 'left';
  }
  ctx.restore();

  // Move title down: 36px clear breathing space below pill badge (Permanent layout setting)
  let cursorY = pillY + pillHeight + 34; // 52 + 44 + 34 = 130px

  // 4. Headline (Auto-positioned cleanly below pill with textBaseline = 'top' & 1.36 line-height for Indian language scripts)
  ctx.save();
  const headlineSize = 42;
  ctx.font = `900 ${headlineSize}px ${FONT_STACK}`;
  ctx.fillStyle = theme.textColor;
  ctx.textBaseline = 'top';
  const headlineLines = wrapText(ctx, config.data.headline, contentWidth);
  const headlineLineHeight = headlineSize * 1.36;

  const maxHeadlineLines = 2;
  for (let i = 0; i < Math.min(headlineLines.length, maxHeadlineLines); i++) {
    ctx.fillText(headlineLines[i], margin, cursorY + i * headlineLineHeight);
  }
  cursorY += Math.min(headlineLines.length, maxHeadlineLines) * headlineLineHeight + 20;
  ctx.restore();

  // 5. Subheadline (With generous breathing space so it never touches headline or card)
  if (config.data.subheadline) {
    ctx.save();
    const subSize = 22;
    ctx.font = `600 ${subSize}px ${FONT_STACK}`;
    ctx.fillStyle = theme.subtextColor;
    ctx.textBaseline = 'top';
    const subLines = wrapText(ctx, config.data.subheadline, contentWidth);
    const subLineHeight = subSize * 1.42;

    const maxSubLines = 2;
    for (let i = 0; i < Math.min(subLines.length, maxSubLines); i++) {
      ctx.fillText(subLines[i], margin, cursorY + i * subLineHeight);
    }
    cursorY += Math.min(subLines.length, maxSubLines) * subLineHeight + 24;
    ctx.restore();
  } else {
    cursorY += 12;
  }

  // Calculate available space for middle theme card
  const footerHeight = 135;
  const ctaHeight = 56;
  const bottomReserve = footerHeight + ctaHeight + 24;
  const themeCardHeight = height - cursorY - bottomReserve;

  // 6. Draw Theme-Specific Canvas Elements
  drawThemeSpecificLayout(
    ctx,
    config.themeId,
    config.data.themeSpecific || {},
    margin,
    cursorY,
    contentWidth,
    themeCardHeight,
    theme,
    isStatus
  );

  // 7. Call To Action Ribbon (Clean centering)
  const ctaY = height - footerHeight - ctaHeight - 14;
  ctx.save();
  ctx.fillStyle = theme.ctaBg;
  ctx.beginPath();
  ctx.roundRect(margin, ctaY, contentWidth, ctaHeight, 18);
  ctx.fill();

  ctx.fillStyle = theme.ctaText;
  const ctaFontSize = 23;
  ctx.font = `bold ${ctaFontSize}px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`👉  ${config.data.ctaText}`, width / 2, ctaY + ctaHeight / 2);
  ctx.textAlign = 'left';
  ctx.restore();

  // 8. Advisor Footer Branding Block (Clean and bold)
  const footerTop = height - footerHeight - 4;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, footerTop);
  ctx.lineTo(width - margin, footerTop);
  ctx.stroke();

  const advisorInfoY = footerTop + 20;
  const photoSize = 92;
  const photoX = margin;
  const photoY = advisorInfoY;

  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
    ctx.restore();

    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 32px ${FONT_STACK}`;
    ctx.textAlign = 'center';
    const initials = config.advisorName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    ctx.fillText(initials || 'FA', photoX + photoSize / 2, photoY + photoSize / 2 + 11);
    ctx.textAlign = 'left';
  }

  const textLeft = photoX + photoSize + 22;
  const textMaxWidth = width - margin - textLeft;

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 30px ${FONT_STACK}`;
  ctx.fillText(config.advisorName, textLeft, advisorInfoY + 26);

  // Designation
  ctx.fillStyle = theme.accentLight;
  ctx.font = `600 18px ${FONT_STACK}`;
  const desLines = wrapText(ctx, config.advisorDesignation, textMaxWidth);
  ctx.fillText(desLines[0] || '', textLeft, advisorInfoY + 52);

  // Phone / WhatsApp
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 22px ${FONT_STACK}`;
  ctx.fillText(`📱 WhatsApp / Call: ${config.advisorPhone}`, textLeft, advisorInfoY + 80);

  // Achievement / Milestone & Credentials
  const credItems = [config.advisorAchievement, config.advisorCredentials].filter(Boolean);
  if (credItems.length > 0) {
    const credText = credItems.join(' • ');
    ctx.fillStyle = '#fde68a';
    ctx.font = `500 16px ${FONT_STACK}`;
    const credLines = wrapText(ctx, credText, textMaxWidth);
    ctx.fillText(credLines[0] || credText, textLeft, advisorInfoY + 104);
  }
  ctx.restore();
}

/**
 * Dedicated Renderer for each of the 25 themes
 */
function drawThemeSpecificLayout(
  ctx: CanvasRenderingContext2D,
  themeId: CreativeThemeId,
  spec: Record<string, any>,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: typeof THEME_STYLES.emerald,
  isStatus: boolean
) {
  ctx.save();
  ctx.textBaseline = 'top';

  switch (themeId) {
    // 01. Split Screen: Option A vs Option B
    case 'split_comparison': {
      const boxH = (h - 36) / 2;

      // Option A Card
      ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, boxH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.leftTitle || 'Path A: Delay & Low Return', x + 28, y + 42);

      const aBullets = spec.leftBullets || [];
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      aBullets.slice(0, 3).forEach((b: string, i: number) => {
        ctx.fillText(`❌  ${b}`, x + 28, y + 88 + i * 42);
      });

      // VS Badge in Center
      const midY = y + boxH + 6;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + w / 2, midY + 12, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = `900 20px ${FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText('VS', x + w / 2, midY + 19);
      ctx.textAlign = 'left';

      // Option B Card
      const yB = y + boxH + 34;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.beginPath();
      ctx.roundRect(x, yB, w, boxH - 6, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.rightTitle || 'Path B: Disciplined Monthly SIP', x + 28, yB + 42);

      const bBullets = spec.rightBullets || [];
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      bBullets.slice(0, 3).forEach((b: string, i: number) => {
        ctx.fillText(`✅  ${b}`, x + 28, yB + 88 + i * 42);
      });
      break;
    }

    // 02. Myth vs Reality
    case 'myth_vs_reality': {
      const cardH = (h - 26) / 2;

      // Myth (Red cross banner)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, cardH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.mythTitle || '❌ COMMON PUBLIC MYTH', x + 28, y + 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const mythLines = wrapText(ctx, spec.mythText || '', w - 56);
      mythLines.slice(0, 4).forEach((line, i) => {
        ctx.fillText(line, x + 28, y + 88 + i * 36);
      });

      // Reality (Emerald green check banner)
      const realityY = y + cardH + 18;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
      ctx.beginPath();
      ctx.roundRect(x, realityY, w, cardH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.realityTitle || '✅ FACTUAL FINANCIAL REALITY', x + 28, realityY + 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const realityLines = wrapText(ctx, spec.realityText || '', w - 56);
      realityLines.slice(0, 4).forEach((line, i) => {
        ctx.fillText(line, x + 28, realityY + 88 + i * 36);
      });
      break;
    }

    // 03. Before vs After Scenario
    case 'before_after': {
      const halfH = (h - 24) / 2;

      // Before
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, halfH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.beforeTitle || '⚠️ WITHOUT PROFESSIONAL PLANNING', x + 28, y + 42);

      const bPoints = spec.beforePoints || [];
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `600 24px ${FONT_STACK}`;
      bPoints.slice(0, 3).forEach((p: string, i: number) => {
        ctx.fillText(`• ${p}`, x + 28, y + 86 + i * 40);
      });

      // After
      const afterY = y + halfH + 16;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.beginPath();
      ctx.roundRect(x, afterY, w, halfH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.afterTitle || '🌟 WITH STRUCTURED PLANNING', x + 28, afterY + 42);

      const aPoints = spec.afterPoints || [];
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      aPoints.slice(0, 3).forEach((p: string, i: number) => {
        ctx.fillText(`✔ ${p}`, x + 28, afterY + 86 + i * 40);
      });
      break;
    }

    // 04. Checklist / Scorecard
    case 'checklist_scorecard': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const items = spec.checklistItems || [];
      const itemH = Math.min((h - 50) / Math.max(items.length, 1), 64);
      items.slice(0, 5).forEach((item: string, i: number) => {
        const itemY = y + 24 + i * itemH;

        // Checkbox box
        ctx.fillStyle = `${theme.accent}33`;
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(x + 24, itemY - 2, 36, 36, 9);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 22px ${FONT_STACK}`;
        ctx.fillText('✓', x + 34, itemY + 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 24px ${FONT_STACK}`;
        const lines = wrapText(ctx, item.replace(/^✅\s*/, ''), w - 110);
        ctx.fillText(lines[0] || item, x + 76, itemY + 24);
      });

      if (spec.scoringGuide) {
        ctx.fillStyle = '#fde68a';
        ctx.font = `bold 22px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.fillText(spec.scoringGuide, x + w / 2, y + h - 20);
        ctx.textAlign = 'left';
      }
      break;
    }

    // 05. Interactive Poll / Pick One
    case 'interactive_poll': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const options = spec.options || [];
      const optH = Math.min((h - 40) / Math.max(options.length, 1), 74);
      options.slice(0, 4).forEach((opt: any, i: number) => {
        const optY = y + 20 + i * optH;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 20, optY, w - 40, optH - 12, 16);
        ctx.fill();
        ctx.stroke();

        // Option Key Pill
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.roundRect(x + 32, optY + 8, 44, optH - 28, 10);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = `bold 22px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.fillText(opt.key || `${i + 1}`, x + 54, optY + (optH - 28) / 2 + 15);
        ctx.textAlign = 'left';

        // Option Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 24px ${FONT_STACK}`;
        const lines = wrapText(ctx, opt.text || '', w - 130);
        ctx.fillText(lines[0] || opt.text, x + 92, optY + (optH - 28) / 2 + 15);
      });
      break;
    }

    // 06. Step-by-Step Roadmap
    case 'step_roadmap': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const steps = spec.steps || [];
      const stepH = Math.min((h - 40) / Math.max(steps.length, 1), 80);
      steps.slice(0, 4).forEach((st: any, i: number) => {
        const sY = y + 20 + i * stepH;

        // Step number circle
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(x + 52, sY + 28, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = `900 20px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.fillText(st.step || `0${i + 1}`, x + 52, sY + 35);
        ctx.textAlign = 'left';

        // Title
        ctx.fillStyle = theme.accentLight;
        ctx.font = `bold 25px ${FONT_STACK}`;
        ctx.fillText(st.title || '', x + 96, sY + 24);

        // Desc
        ctx.fillStyle = '#cbd5e1';
        ctx.font = `500 21px ${FONT_STACK}`;
        const dLines = wrapText(ctx, st.desc || '', w - 130);
        ctx.fillText(dLines[0] || '', x + 96, sY + 50);
      });
      break;
    }

    // 07. Number Breakdown / Math Proof
    case 'number_breakdown': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 26);
      ctx.fill();
      ctx.stroke();

      // Giant Big Number
      ctx.fillStyle = '#fde68a';
      ctx.font = `900 74px ${FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText(spec.bigNumber || '₹1.5 CRORE', x + w / 2, y + 78);

      ctx.fillStyle = theme.accentLight;
      ctx.font = `bold 26px ${FONT_STACK}`;
      ctx.fillText(spec.bigNumberLabel || 'Target Wealth Corpus', x + w / 2, y + 118);
      ctx.textAlign = 'left';

      // Math Proof Lines
      const calcs = spec.calculations || [];
      const calcY = y + 140;
      calcs.slice(0, 4).forEach((c: string, i: number) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(x + 24, calcY + i * 54, w - 48, 44, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 23px ${FONT_STACK}`;
        ctx.fillText(c, x + 40, calcY + i * 54 + 30);
      });
      break;
    }

    // 08. Curiosity Hook: Did You Know?
    case 'curiosity_hook': {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = `bold 30px ${FONT_STACK}`;
      ctx.fillText('💡 DID YOU KNOW?', x + 30, y + 44);

      const hookLines = wrapText(ctx, spec.questionHook || '', w - 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 26px ${FONT_STACK}`;
      hookLines.slice(0, 3).forEach((l, i) => {
        ctx.fillText(l, x + 30, y + 86 + i * 36);
      });

      const examples = spec.examples || [];
      const exY = y + 195;
      examples.slice(0, 3).forEach((ex: string, i: number) => {
        ctx.fillStyle = `${theme.accent}24`;
        ctx.beginPath();
        ctx.roundRect(x + 24, exY + i * 54, w - 48, 44, 12);
        ctx.fill();

        ctx.fillStyle = '#6ee7b7';
        ctx.font = `bold 23px ${FONT_STACK}`;
        ctx.fillText(`• ${ex}`, x + 40, exY + i * 54 + 30);
      });
      break;
    }

    // 09. Dos and Don'ts Card
    case 'dos_and_donts': {
      const halfW = (w - 20) / 2;

      // DOs (Left side)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, halfW, h, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('✅ DO THIS', x + 20, y + 44);

      const dos = spec.dos || [];
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 22px ${FONT_STACK}`;
      dos.slice(0, 3).forEach((d: string, i: number) => {
        const lines = wrapText(ctx, d.replace(/^✅\s*/, ''), halfW - 36);
        ctx.fillText(`✔ ${lines[0] || d}`, x + 16, y + 90 + i * 72);
        if (lines[1]) ctx.fillText(lines[1], x + 34, y + 90 + i * 72 + 28);
      });

      // DON'Ts (Right side)
      const xRight = x + halfW + 20;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(xRight, y, halfW, h, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('❌ AVOID THIS', xRight + 20, y + 44);

      const donts = spec.donts || [];
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 22px ${FONT_STACK}`;
      donts.slice(0, 3).forEach((d: string, i: number) => {
        const lines = wrapText(ctx, d.replace(/^❌\s*/, ''), halfW - 36);
        ctx.fillText(`✖ ${lines[0] || d}`, xRight + 16, y + 90 + i * 72);
        if (lines[1]) ctx.fillText(lines[1], xRight + 34, y + 90 + i * 72 + 28);
      });
      break;
    }

    // 10. Client Case Study / Story Flow
    case 'case_study': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const blocks = [
        { title: '🔴 The Challenge / Problem', text: spec.problem || '' },
        { title: '🟡 The Tailored Action Plan', text: spec.action || '' },
        { title: '🟢 The Transformational Result', text: spec.outcome || '' },
      ];

      const blockH = (h - 40) / 3;
      blocks.forEach((b, i) => {
        const bY = y + 16 + i * (blockH + 8);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.roundRect(x + 18, bY, w - 36, blockH, 16);
        ctx.fill();

        ctx.fillStyle = theme.accentLight;
        ctx.font = `bold 24px ${FONT_STACK}`;
        ctx.fillText(b.title, x + 34, bY + 32);

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 22px ${FONT_STACK}`;
        const lines = wrapText(ctx, b.text, w - 74);
        lines.slice(0, 2).forEach((l, li) => {
          ctx.fillText(l, x + 34, bY + 66 + li * 28);
        });
      });
      break;
    }

    // 11. Mindset / Philosophy Quote
    case 'philosophy_quote': {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = `900 85px Georgia, serif`;
      ctx.fillText('“', x + 35, y + 70);

      const quoteLines = wrapText(ctx, spec.quote || '', w - 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = `italic 700 30px Georgia, ${FONT_STACK}`;
      quoteLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 45, y + 110 + i * 40);
      });

      if (spec.author) {
        ctx.fillStyle = theme.accentLight;
        ctx.font = `bold 24px ${FONT_STACK}`;
        ctx.textAlign = 'right';
        ctx.fillText(`— ${spec.author}`, x + w - 45, y + h - 30);
        ctx.textAlign = 'left';
      }
      break;
    }

    // 12. Cost of Delay / Time Impact
    case 'cost_of_delay': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('⏳ THE COST OF WAITING 5-10 YEARS', x + 30, y + 44);

      const items = [spec.personA, spec.personB, spec.mathGap];
      items.filter(Boolean).slice(0, 3).forEach((item, i) => {
        const iY = y + 72 + i * 76;
        ctx.fillStyle = i === 2 ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(x + 20, iY, w - 40, 66, 14);
        ctx.fill();

        ctx.fillStyle = i === 2 ? '#fca5a5' : '#ffffff';
        ctx.font = `600 22px ${FONT_STACK}`;
        const lines = wrapText(ctx, item, w - 74);
        lines.slice(0, 2).forEach((l, li) => {
          ctx.fillText(l, x + 34, iY + 34 + li * 26);
        });
      });
      break;
    }

    // 13. Top 3 Costly Mistakes
    case 'top_mistakes': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const mistakes = spec.mistakes || [];
      const mH = (h - 40) / 3;
      mistakes.slice(0, 3).forEach((m: any, i: number) => {
        const mY = y + 16 + i * (mH + 8);

        ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.roundRect(x + 20, mY, w - 40, mH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f87171';
        ctx.font = `bold 25px ${FONT_STACK}`;
        ctx.fillText(`⚠️ MISTAKE ${m.num || `0${i + 1}`}: ${m.title || ''}`, x + 35, mY + 34);

        ctx.fillStyle = '#ffffff';
        ctx.font = `500 22px ${FONT_STACK}`;
        const lines = wrapText(ctx, m.detail || '', w - 78);
        lines.slice(0, 2).forEach((l, li) => {
          ctx.fillText(l, x + 35, mY + 66 + li * 26);
        });
      });
      break;
    }

    // 14. Direct Q&A / FAQ Format
    case 'direct_faq': {
      const halfH = (h - 24) / 2;

      // Question Bubble
      ctx.fillStyle = 'rgba(59, 130, 246, 0.14)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, halfH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#93c5fd';
      ctx.font = `bold 26px ${FONT_STACK}`;
      ctx.fillText('❓ CLIENT QUESTION', x + 28, y + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const qLines = wrapText(ctx, spec.question || '', w - 56);
      qLines.slice(0, 3).forEach((l, i) => {
        ctx.fillText(l, x + 28, y + 84 + i * 34);
      });

      // Answer Bubble
      const ansY = y + halfH + 16;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, ansY, w, halfH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = `bold 26px ${FONT_STACK}`;
      ctx.fillText('💡 ADVISOR DIRECT ANSWER', x + 28, ansY + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const aLines = wrapText(ctx, spec.answer || '', w - 56);
      aLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 28, ansY + 84 + i * 34);
      });
      break;
    }

    // 15. Golden Rule / Principle of the Week
    case 'golden_rule': {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.1)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = `bold 30px ${FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText(spec.ruleName || 'THE GOLDEN RULE', x + w / 2, y + 44);
      ctx.textAlign = 'left';

      const sections = spec.sections || [];
      const sH = (h - 90) / Math.max(sections.length, 1);
      sections.slice(0, 3).forEach((sec: any, i: number) => {
        const sY = y + 68 + i * sH;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(x + 20, sY, w - 40, sH - 12, 14);
        ctx.fill();

        ctx.fillStyle = '#fde68a';
        ctx.font = `bold 24px ${FONT_STACK}`;
        ctx.fillText(sec.title || '', x + 35, sY + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = `500 21px ${FONT_STACK}`;
        const lns = wrapText(ctx, sec.desc || '', w - 74);
        ctx.fillText(lns[0] || '', x + 35, sY + 60);
      });
      break;
    }

    // 16. Visual Analogy / Metaphor
    case 'visual_analogy': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = theme.accentLight;
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(spec.analogyObject || 'Everyday Metaphor', x + 30, y + 46);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const compLines = wrapText(ctx, spec.comparison || '', w - 60);
      compLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 30, y + 92 + i * 34);
      });

      if (spec.advisoryLesson) {
        const lesY = y + 175;
        ctx.fillStyle = `${theme.accent}24`;
        ctx.beginPath();
        ctx.roundRect(x + 20, lesY, w - 40, h - (lesY - y) - 20, 16);
        ctx.fill();

        ctx.fillStyle = '#a7f3d0';
        ctx.font = `bold 23px ${FONT_STACK}`;
        ctx.fillText('💡 FINANCIAL ADVISORY LESSON:', x + 35, lesY + 34);

        ctx.fillStyle = '#ffffff';
        ctx.font = `500 21px ${FONT_STACK}`;
        const lesLines = wrapText(ctx, spec.advisoryLesson, w - 70);
        lesLines.slice(0, 3).forEach((l, li) => {
          ctx.fillText(l, x + 35, lesY + 68 + li * 28);
        });
      }
      break;
    }

    // 17. Self-Audit / Mirror Question
    case 'self_audit': {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#a5b4fc';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('🪞 HONEST MIRROR QUESTION', x + 30, y + 44);

      const qLines = wrapText(ctx, spec.primaryQuestion || '', w - 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 25px ${FONT_STACK}`;
      qLines.slice(0, 3).forEach((l, i) => {
        ctx.fillText(l, x + 30, y + 88 + i * 34);
      });

      const cps = spec.checkpoints || [];
      const cpY = y + 195;
      cps.slice(0, 3).forEach((c: string, i: number) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(x + 20, cpY + i * 62, w - 40, 52, 14);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = `600 22px ${FONT_STACK}`;
        ctx.fillText(c, x + 35, cpY + i * 62 + 33);
      });
      break;
    }

    // 18. Cheat Sheet / Summary Card
    case 'cheat_sheet': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const items = spec.items || [];
      const rowH = (h - 30) / Math.max(items.length, 1);
      items.slice(0, 5).forEach((item: any, i: number) => {
        const rY = y + 16 + i * rowH;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.roundRect(x + 16, rY, w - 32, rowH - 8, 12);
        ctx.fill();

        ctx.fillStyle = theme.accentLight;
        ctx.font = `bold 23px ${FONT_STACK}`;
        ctx.fillText(item.label || '', x + 30, rY + rowH / 2 + 5);

        ctx.fillStyle = '#ffffff';
        ctx.font = `700 23px ${FONT_STACK}`;
        ctx.textAlign = 'right';
        ctx.fillText(item.formula || '', x + w - 30, rY + rowH / 2 + 5);
        ctx.textAlign = 'left';
      });
      break;
    }

    // 19. Market Psychology / Emotion Cycle
    case 'market_psychology': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde68a';
      ctx.font = `bold 27px ${FONT_STACK}`;
      ctx.fillText('📊 THE 4 STAGES OF INVESTOR EMOTION', x + 25, y + 42);

      const stages = spec.cycleStages || [];
      const sH = (h - 110) / 4;
      stages.slice(0, 4).forEach((st: string, i: number) => {
        const sY = y + 62 + i * sH;
        ctx.fillStyle = i >= 2 ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)';
        ctx.beginPath();
        ctx.roundRect(x + 20, sY, w - 40, sH - 10, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 23px ${FONT_STACK}`;
        ctx.fillText(st, x + 35, sY + 34);
      });

      if (spec.advisorAdvice) {
        ctx.fillStyle = theme.accentLight;
        ctx.font = `bold 22px ${FONT_STACK}`;
        const lines = wrapText(ctx, spec.advisorAdvice, w - 50);
        ctx.fillText(lines[0] || '', x + 25, y + h - 18);
      }
      break;
    }

    // 20. Timeline / Age-Wise Blueprint
    case 'age_blueprint': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      const tracks = spec.tracks || [];
      const tH = (h - 30) / Math.max(tracks.length, 1);
      tracks.slice(0, 4).forEach((tr: any, i: number) => {
        const tY = y + 16 + i * tH;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(x + 18, tY, w - 36, tH - 8, 14);
        ctx.fill();

        // Decade Pill
        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.roundRect(x + 30, tY + 12, 130, 36, 10);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = `bold 20px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.fillText(tr.ageGroup || '', x + 95, tY + 37);
        ctx.textAlign = 'left';

        // Focus
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 22px ${FONT_STACK}`;
        const fLines = wrapText(ctx, tr.focus || '', w - 210);
        ctx.fillText(fLines[0] || '', x + 180, tY + 37);
      });
      break;
    }

    // 21. Resource Recommendation
    case 'resource_recommendation': {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = theme.accentLight;
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText(`🌟 ${spec.resourceTitle || 'Essential Habit'}`, x + 30, y + 46);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const wLines = wrapText(ctx, spec.whyItWorks || '', w - 60);
      wLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 30, y + 96 + i * 34);
      });

      if (spec.impact) {
        ctx.fillStyle = '#fde68a';
        ctx.font = `bold 24px ${FONT_STACK}`;
        const iLines = wrapText(ctx, spec.impact, w - 60);
        ctx.fillText(iLines[0] || spec.impact, x + 30, y + h - 35);
      }
      break;
    }

    // 22. Urgent Reminder / Deadline Alert
    case 'urgent_reminder': {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = `900 28px ${FONT_STACK}`;
      ctx.fillText(`⏰ ${spec.reminderHeader || 'TIME-SENSITIVE DEADLINE'}`, x + 30, y + 46);

      const pts = spec.actionPoints || [];
      const ptH = (h - 75) / Math.max(pts.length, 1);
      pts.slice(0, 4).forEach((pt: string, i: number) => {
        const pY = y + 70 + i * ptH;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(x + 20, pY, w - 40, ptH - 8, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 23px ${FONT_STACK}`;
        const lns = wrapText(ctx, pt, w - 74);
        ctx.fillText(lns[0] || pt, x + 35, pY + ptH / 2 + 5);
      });
      break;
    }

    // 23. Hidden Cost / Iceberg Concept
    case 'hidden_cost': {
      const topH = (h - 30) * 0.38;
      const botH = (h - 30) * 0.62;

      // Tip of the Iceberg
      ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, topH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold 26px ${FONT_STACK}`;
      ctx.fillText('🧊 VISIBLE SURFACE COST (What People See)', x + 25, y + 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 23px ${FONT_STACK}`;
      const topLines = wrapText(ctx, spec.tipOfIceberg || '', w - 54);
      topLines.slice(0, 2).forEach((l, i) => {
        ctx.fillText(l, x + 25, y + 76 + i * 32);
      });

      // Underwater Sunk Cost
      const botY = y + topH + 18;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, botY, w, botH, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = `bold 26px ${FONT_STACK}`;
      ctx.fillText('⚓ HIDDEN UNDERWATER DAMAGE (What Sinks Families)', x + 25, botY + 38);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 23px ${FONT_STACK}`;
      const botLines = wrapText(ctx, spec.sunkenIceberg || '', w - 54);
      botLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 25, botY + 78 + i * 32);
      });
      break;
    }

    // 24. Advisor's Personal Take / Unpopular Opinion
    case 'advisor_opinion': {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 26);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('🎙️ CANDID FIDUCIARY OPINION', x + 30, y + 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = `600 24px ${FONT_STACK}`;
      const oLines = wrapText(ctx, spec.opinionText || '', w - 60);
      oLines.slice(0, 4).forEach((l, i) => {
        ctx.fillText(l, x + 30, y + 90 + i * 34);
      });

      if (spec.advisorAdvice) {
        const adviceBoxH = 82;
        const adviceBoxY = y + h - adviceBoxH - 18;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 20, adviceBoxY, w - 40, adviceBoxH, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde68a';
        ctx.font = `bold 21px ${FONT_STACK}`;
        ctx.textBaseline = 'top';
        const aLines = wrapText(ctx, spec.advisorAdvice, w - 68);
        aLines.slice(0, 2).forEach((l, i) => {
          ctx.fillText(l, x + 34, adviceBoxY + 14 + i * 28);
        });
      }
      break;
    }

    // 25. Direct Call-to-Action / Offer Card
    case 'direct_cta_offer':
    default: {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = `bold 28px ${FONT_STACK}`;
      ctx.fillText('🎯 WHAT IS INCLUDED IN YOUR 1-ON-1 REVIEW:', x + 30, y + 44);

      const offers = spec.offerIncludes || [];
      const ofH = (h - 90) / Math.max(offers.length, 1);
      offers.slice(0, 4).forEach((of: string, i: number) => {
        const oY = y + 68 + i * ofH;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(x + 20, oY, w - 40, ofH - 8, 12);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `600 23px ${FONT_STACK}`;
        const lns = wrapText(ctx, of, w - 70);
        ctx.fillText(lns[0] || of, x + 35, oY + ofH / 2 + 5);
      });

      if (spec.offerTerms) {
        ctx.fillStyle = '#fde68a';
        ctx.font = `bold 22px ${FONT_STACK}`;
        ctx.textAlign = 'center';
        ctx.fillText(spec.offerTerms, x + w / 2, y + h - 18);
        ctx.textAlign = 'left';
      }
      break;
    }
  }

  ctx.restore();
}
