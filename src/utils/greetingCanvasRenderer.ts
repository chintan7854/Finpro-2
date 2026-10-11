// Ultra High-Definition Canvas Rendering Engine for Greetings Studio
// Supports 1080p and 4K (2160p) resolution, Custom Backgrounds, Customer Photo, and Complete Advisor Branding Footer.
// 100% Client-Side HTML5 Canvas - Zero API Calls & Zero Latency.

import { BackgroundPreset } from '../constants/greetingsData';

export interface AdvisorBrandingData {
  advisorName: string;
  designation: string;
  firmName?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  email?: string;
  website?: string;
  arnNumber?: string;
  euinNumber?: string;
  profilePhotoUrl?: string;
  showSocialIcons?: boolean;
}

export interface GreetingCanvasOptions {
  canvas: HTMLCanvasElement;
  resolution: 'hd' | '4k'; // 1080 or 2160
  bgImage: HTMLImageElement | null;
  bgPreset: BackgroundPreset;
  bgDarkness: number; // 0.1 to 0.8
  hasCustomerPhoto: boolean;
  customerPhoto: HTMLImageElement | null;
  customerPhotoShape?: 'circle' | 'square_rounded' | 'diamond';
  occasionType: 'birthday' | 'anniversary' | 'festivals' | 'days';
  occasionIcon: string;
  title: string;
  recipientName: string;
  salutation: string;
  message: string;
  signature: string;
  advisor: AdvisorBrandingData;
}

// Helper to wrap text cleanly with line breaks
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

// Procedural texture drawing if image fails or before image loads
function drawProceduralBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  preset: BackgroundPreset
) {
  const grad = ctx.createRadialGradient(
    width / 2,
    height * 0.4,
    width * 0.1,
    width / 2,
    height * 0.5,
    width * 0.85
  );
  grad.addColorStop(0, preset.secondaryColor || '#1e293b');
  grad.addColorStop(0.5, preset.themeColor || '#0f172a');
  grad.addColorStop(1, '#020617');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative procedural particles (bokeh & sparkles)
  ctx.save();
  const seedCount = preset.patternType === 'confetti' ? 70 : 45;
  for (let i = 0; i < seedCount; i++) {
    const x = ((Math.sin(i * 997) + 1) / 2) * width;
    const y = ((Math.cos(i * 613) + 1) / 2) * (height * 0.75);
    const radius = 3 + (i % 7) * 4;
    const alpha = 0.08 + (i % 5) * 0.05;

    ctx.fillStyle = i % 2 === 0 ? preset.accentColor : '#fde047';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Main Canvas Render Function
export function renderGreetingCard(options: GreetingCanvasOptions): Promise<void> {
  return new Promise((resolve) => {
    const {
      canvas,
      resolution,
      bgImage,
      bgPreset,
      bgDarkness,
      hasCustomerPhoto,
      customerPhoto,
      customerPhotoShape = 'circle',
      occasionIcon,
      title,
      recipientName,
      salutation,
      message,
      advisor,
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    const size = resolution === '4k' ? 2160 : 1080;
    canvas.width = size;
    canvas.height = size;
    const scale = size / 1080; // normalized scale factor

    ctx.clearRect(0, 0, size, size);

    // -------------------------------------------------------------
    // 1. BACKGROUND IMAGE OR PROCEDURAL BACKDROP
    // -------------------------------------------------------------
    let drawnImage = false;
    if (bgImage && bgImage.complete && bgImage.naturalWidth > 0) {
      try {
        const imgAspect = bgImage.naturalWidth / bgImage.naturalHeight;
        let sWidth = bgImage.naturalWidth;
        let sHeight = bgImage.naturalHeight;
        let sx = 0;
        let sy = 0;

        if (imgAspect > 1) {
          sWidth = bgImage.naturalHeight;
          sx = (bgImage.naturalWidth - sWidth) / 2;
        } else {
          sHeight = bgImage.naturalWidth;
          sy = (bgImage.naturalHeight - sHeight) / 2;
        }

        ctx.drawImage(bgImage, sx, sy, sWidth, sHeight, 0, 0, size, size);
        drawnImage = true;
      } catch (err) {
        console.warn('Canvas image cross-origin draw fallback:', err);
      }
    }

    if (!drawnImage) {
      drawProceduralBackground(ctx, size, size, bgPreset);
    }

    // -------------------------------------------------------------
    // 2. VIGNETTE & CONTRAST OVERLAY
    // -------------------------------------------------------------
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.15, Math.min(0.85, bgDarkness))})`;
    ctx.fillRect(0, 0, size, size);

    // Vignette gradient for cinematic focus
    const vignette = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.35,
      size / 2,
      size / 2,
      size * 0.75
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, size, size);

    // -------------------------------------------------------------
    // 3. ELEGANT GOLDEN FRAMES & CORNER FLOURISHES
    // -------------------------------------------------------------
    const outerPad = 32 * scale;
    const innerPad = 48 * scale;
    const goldColor = '#e2b34a';

    // Outer thin gold frame
    ctx.strokeStyle = `${goldColor}aa`;
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(outerPad, outerPad, size - outerPad * 2, size - outerPad * 2);

    // Inner accented gold frame
    ctx.strokeStyle = `${goldColor}55`;
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeRect(innerPad, innerPad, size - innerPad * 2, size - innerPad * 2);

    // Corner Ornaments
    const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(0, 0, 7 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(14 * scale, 0);
      ctx.lineTo(44 * scale, 0);
      ctx.moveTo(0, 14 * scale);
      ctx.lineTo(0, 44 * scale);
      ctx.stroke();

      ctx.restore();
    };

    drawCornerOrnament(innerPad, innerPad, 0);
    drawCornerOrnament(size - innerPad, innerPad, Math.PI / 2);
    drawCornerOrnament(size - innerPad, size - innerPad, Math.PI);
    drawCornerOrnament(innerPad, size - innerPad, -Math.PI / 2);

    // -------------------------------------------------------------
    // 4. TOP OCCASION BADGE & ICON
    // -------------------------------------------------------------
    const topY = 120 * scale;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glowing halo behind icon
    const iconGlow = ctx.createRadialGradient(
      size / 2,
      topY,
      10 * scale,
      size / 2,
      topY,
      70 * scale
    );
    iconGlow.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
    iconGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = iconGlow;
    ctx.beginPath();
    ctx.arc(size / 2, topY, 70 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Occasion Icon
    ctx.font = `${64 * scale}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(occasionIcon || '✨', size / 2, topY);

    // Occasion Title (e.g. "HAPPY BIRTHDAY" or "SHUBH DEEPAVALI")
    const titleY = topY + 68 * scale;
    ctx.font = `900 ${36 * scale}px "Plus Jakarta Sans", "Noto Sans Gujarati", "Noto Sans Devanagari", sans-serif`;

    // Golden text fill
    const textGrad = ctx.createLinearGradient(
      size / 2 - 250 * scale,
      titleY,
      size / 2 + 250 * scale,
      titleY
    );
    textGrad.addColorStop(0, '#fef08a');
    textGrad.addColorStop(0.5, '#fde047');
    textGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = textGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12 * scale;
    ctx.fillText(title.toUpperCase(), size / 2, titleY);
    ctx.shadowBlur = 0;

    // Golden decorative divider
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(size / 2 - 160 * scale, titleY + 28 * scale);
    ctx.lineTo(size / 2 + 160 * scale, titleY + 28 * scale);
    ctx.stroke();

    // Central small diamond on divider
    ctx.fillStyle = goldColor;
    ctx.beginPath();
    ctx.arc(size / 2, titleY + 28 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // -------------------------------------------------------------
    // 5. CUSTOMER PHOTO OR SPACIOUS CELEBRATORY EMBLEM
    // -------------------------------------------------------------
    let contentStartY = titleY + 60 * scale;

    if (hasCustomerPhoto && customerPhoto && customerPhoto.complete && customerPhoto.naturalWidth > 0) {
      const photoCenterY = titleY + 140 * scale;
      const photoRadius = 88 * scale;

      // Glow behind photo
      const photoGlow = ctx.createRadialGradient(
        size / 2,
        photoCenterY,
        photoRadius * 0.5,
        size / 2,
        photoCenterY,
        photoRadius * 1.35
      );
      photoGlow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
      photoGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = photoGlow;
      ctx.beginPath();
      ctx.arc(size / 2, photoCenterY, photoRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Draw Customer Photo Clipped
      ctx.save();
      ctx.beginPath();
      if (customerPhotoShape === 'square_rounded') {
        const boxSize = photoRadius * 1.9;
        const cornerR = 24 * scale;
        const bx = size / 2 - boxSize / 2;
        const by = photoCenterY - boxSize / 2;
        ctx.roundRect(bx, by, boxSize, boxSize, cornerR);
      } else {
        ctx.arc(size / 2, photoCenterY, photoRadius, 0, Math.PI * 2);
      }
      ctx.clip();

      // Cover-crop customer photo
      const cpAspect = customerPhoto.naturalWidth / customerPhoto.naturalHeight;
      let cpSw = customerPhoto.naturalWidth;
      let cpSh = customerPhoto.naturalHeight;
      let cpSx = 0;
      let cpSy = 0;
      if (cpAspect > 1) {
        cpSw = customerPhoto.naturalHeight;
        cpSx = (customerPhoto.naturalWidth - cpSw) / 2;
      } else {
        cpSh = customerPhoto.naturalWidth;
        cpSy = (customerPhoto.naturalHeight - cpSh) / 2;
      }

      ctx.drawImage(
        customerPhoto,
        cpSx,
        cpSy,
        cpSw,
        cpSh,
        size / 2 - photoRadius,
        photoCenterY - photoRadius,
        photoRadius * 2,
        photoRadius * 2
      );
      ctx.restore();

      // Ornate Outer Gold Ring
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      ctx.arc(size / 2, photoCenterY, photoRadius + 3 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Fine Inner Ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.arc(size / 2, photoCenterY, photoRadius - 2 * scale, 0, Math.PI * 2);
      ctx.stroke();

      contentStartY = photoCenterY + photoRadius + 42 * scale;
    } else {
      // Without customer photo: add decorative balance
      contentStartY = titleY + 70 * scale;
    }

    // -------------------------------------------------------------
    // 6. RECIPIENT NAME & SALUTATION
    // -------------------------------------------------------------
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // Salutation (e.g. "Dear Rajeshbhai Patel," or "Respected Doctor,")
    if (salutation) {
      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${30 * scale}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(salutation, size / 2, contentStartY);
      contentStartY += 46 * scale;
    } else if (recipientName) {
      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${34 * scale}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(`Dear ${recipientName}`, size / 2, contentStartY);
      contentStartY += 48 * scale;
    }

    // -------------------------------------------------------------
    // 7. HEARTFELT GREETING BODY TEXT (MULTI-LINE WRAPPED)
    // -------------------------------------------------------------
    ctx.fillStyle = '#f8fafc';
    const bodyFontSize = hasCustomerPhoto ? 24 * scale : 27 * scale;
    const bodyLineHeight = hasCustomerPhoto ? 38 * scale : 42 * scale;
    ctx.font = `500 ${bodyFontSize}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;

    const maxTextWidth = (size - innerPad * 2) * 0.88;
    const lines = wrapText(ctx, message, maxTextWidth);

    // Limit maximum lines to prevent overflowing bottom footer
    const maxAllowedLines = hasCustomerPhoto ? 7 : 9;
    const renderLines = lines.slice(0, maxAllowedLines);

    let textY = contentStartY + 14 * scale;
    for (const line of renderLines) {
      if (line === '') {
        textY += 18 * scale;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8 * scale;
        ctx.fillText(line, size / 2, textY);
        ctx.shadowBlur = 0;
        textY += bodyLineHeight;
      }
    }

    // -------------------------------------------------------------
    // 8. ADVISOR COMPLETE BRANDING FOOTER (BOTTOM STRIP)
    // -------------------------------------------------------------
    const footerHeight = 190 * scale;
    const footerY = size - footerHeight - outerPad;
    const footerWidth = size - outerPad * 2;
    const footerX = outerPad;

    // Footer Background Card (Executive Dark Charcoal Glassmorphism)
    ctx.fillStyle = 'rgba(10, 15, 30, 0.92)';
    ctx.beginPath();
    ctx.roundRect(footerX, footerY, footerWidth, footerHeight, [0, 0, 16 * scale, 16 * scale]);
    ctx.fill();

    // Top Gold Accent Line
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(footerX, footerY);
    ctx.lineTo(footerX + footerWidth, footerY);
    ctx.stroke();

    // Advisor Profile Photo (Left)
    const advPhotoRadius = 52 * scale;
    const advPhotoCenterX = footerX + 75 * scale;
    const advPhotoCenterY = footerY + footerHeight / 2;

    let drawnAdvPhoto = false;
    const advPhoto = options.bgImage; // check if advisor has image passed
    // If advisor profile photo exists in advisor data, it can be drawn
    // We draw an avatar placeholder or photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(advPhotoCenterX, advPhotoCenterY, advPhotoRadius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(
      advPhotoCenterX - advPhotoRadius,
      advPhotoCenterY - advPhotoRadius,
      advPhotoRadius * 2,
      advPhotoRadius * 2
    );

    // Initials fallback in case photo is missing
    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${32 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initials = (advisor.advisorName || 'FA')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
    ctx.fillText(initials, advPhotoCenterX, advPhotoCenterY);

    ctx.restore();

    // Gold Ring around Advisor Photo
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    ctx.arc(advPhotoCenterX, advPhotoCenterY, advPhotoRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Text Information Column
    const infoX = advPhotoCenterX + advPhotoRadius + 24 * scale;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Advisor Name
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${28 * scale}px "Plus Jakarta Sans", "Noto Sans Gujarati", sans-serif`;
    const advNameText = advisor.advisorName || 'Financial Advisor';
    ctx.fillText(advNameText, infoX, footerY + 44 * scale);

    // Designation & Firm Name
    ctx.fillStyle = '#fde047';
    ctx.font = `600 ${18 * scale}px "Plus Jakarta Sans", sans-serif`;
    const designationLine = [
      advisor.designation || 'Mutual Fund Distributor & Wealth Planner',
      advisor.firmName,
    ]
      .filter(Boolean)
      .join(' • ');
    ctx.fillText(designationLine, infoX, footerY + 74 * scale);

    // AMFI ARN & Registration Details
    ctx.fillStyle = '#94a3b8';
    ctx.font = `500 ${16 * scale}px "Plus Jakarta Sans", monospace`;
    const regLine = [
      advisor.arnNumber ? `ARN: ${advisor.arnNumber}` : 'AMFI Registered MFD',
      advisor.euinNumber ? `EUIN: ${advisor.euinNumber}` : null,
      'APMI / Certified',
    ]
      .filter(Boolean)
      .join(' | ');
    ctx.fillText(regLine, infoX, footerY + 104 * scale);

    // Phone / WhatsApp & Website
    ctx.fillStyle = '#38bdf8';
    ctx.font = `bold ${18 * scale}px "Plus Jakarta Sans", monospace`;
    const contactText = `📞 / 💬 ${advisor.phoneNumber || '+91 98765 43210'}`;
    ctx.fillText(contactText, infoX, footerY + 138 * scale);

    if (advisor.website || advisor.email) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `500 ${16 * scale}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(advisor.website || advisor.email || '', infoX + 320 * scale, footerY + 138 * scale);
    }

    // Right Compliments Badge
    const badgeRightX = footerX + footerWidth - 36 * scale;
    ctx.textAlign = 'right';

    ctx.fillStyle = goldColor;
    ctx.font = `bold ${22 * scale}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('હાર્દિક શુભેચ્છાઓ સહ', badgeRightX, footerY + 54 * scale);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `600 ${16 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('With Best Compliments', badgeRightX, footerY + 84 * scale);

    // Verified Stamp Pill
    ctx.fillStyle = 'rgba(234, 179, 8, 0.15)';
    ctx.strokeStyle = '#eab30866';
    ctx.lineWidth = 1.5 * scale;
    const pillW = 210 * scale;
    const pillH = 32 * scale;
    const pillX = badgeRightX - pillW;
    const pillY = footerY + 108 * scale;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 16 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.font = `bold ${14 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('TRUSTED WEALTH PARTNER', pillX + pillW / 2, pillY + 21 * scale);

    resolve();
  });
}
