// Ultra High-Definition Canvas Composition Engine for Greetings Studio
// 100% Background Immunity: Source artwork pixels are NEVER modified, filtered, or darkened.
// Supports Vertical Portrait (1024×1536 px, 2:3 ratio) and custom aspect ratios at HD & 4K resolutions.
// Pure client-side HTML5 Canvas 2D engine - Zero API tokens, Zero external costs, Zero latency.

import { BackgroundPreset } from '../constants/greetingsData';

export type GreetingAspectRatio = 'portrait_2_3' | 'story_9_16' | 'square_1_1' | 'source_auto';
export type FooterStyle = 'frosted_glass' | 'solid_card' | 'minimal_banner' | 'elegant_classic' | 'floating_badge';
export type PhotoShape = 'circle' | 'squircle' | 'diamond' | 'gold_shield' | 'oval';
export type TypographyTheme = 'gold' | 'pearl' | 'rose_gold' | 'saffron';
export type PhotoAnchor = 'top_center' | 'top_left' | 'top_right' | 'center' | 'center_left' | 'center_right';
export type TextAnchor = 'top' | 'middle' | 'bottom';
export type TextBackplate = 'none' | 'subtle_badge' | 'frosted_box';

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
  profilePhoto?: HTMLImageElement | null;
  showSocialIcons?: boolean;
}

export interface GreetingCanvasOptions {
  canvas: HTMLCanvasElement;
  resolution: 'hd' | '4k';
  aspectRatio: GreetingAspectRatio;
  bgImage: HTMLImageElement | null;
  bgPreset: BackgroundPreset;
  // Customer Photo Layer
  hasCustomerPhoto: boolean;
  customerPhoto: HTMLImageElement | null;
  customerPhotoShape?: PhotoShape;
  customerPhotoScale?: number; // 0.6 to 1.5
  customerPhotoAnchor?: PhotoAnchor;
  photoOffsetX?: number; // normalized -0.5 to 0.5
  photoOffsetY?: number; // normalized -0.5 to 0.5
  // Occasion & Typography Layer
  occasionType: 'birthday' | 'anniversary' | 'festivals' | 'days';
  occasionIcon: string;
  showOccasionIcon?: boolean;
  title: string;
  recipientName: string;
  salutation: string;
  message: string;
  signature?: string;
  typographyTheme?: TypographyTheme;
  titleScale?: number; // 0.8 to 1.4
  messageScale?: number; // 0.8 to 1.4
  textAnchor?: TextAnchor;
  textAlign?: 'center' | 'left' | 'right';
  textBackplate?: TextBackplate;
  textOffsetY?: number; // normalized -0.3 to 0.3
  // Advisor Layer
  advisor: AdvisorBrandingData;
  footerStyle?: FooterStyle;
  showAdvisorCard?: boolean;
  advisorCardOffsetY?: number; // normalized offset
}

/**
 * Computes exact canvas width and height respecting background image natural dimensions
 */
export function getCanvasDimensions(
  aspectRatio: GreetingAspectRatio,
  resolution: 'hd' | '4k',
  bgImage?: HTMLImageElement | null
): { width: number; height: number; cssAspect: string } {
  const is4K = resolution === '4k';

  // If source_auto is requested and bgImage is available with natural dimensions, preserve exact aspect ratio!
  if (aspectRatio === 'source_auto' && bgImage && bgImage.complete && bgImage.naturalWidth > 0 && bgImage.naturalHeight > 0) {
    const nw = bgImage.naturalWidth;
    const nh = bgImage.naturalHeight;
    const mult = is4K ? (nw < 2000 ? 2 : 1) : (nw > 2000 ? 0.5 : 1);
    const width = Math.round(nw * mult);
    const height = Math.round(nh * mult);
    return {
      width,
      height,
      cssAspect: `${nw} / ${nh}`,
    };
  }

  switch (aspectRatio) {
    case 'portrait_2_3':
      // 2:3 Vertical Portrait (Default Standard - matching 1024x1536)
      return {
        width: is4K ? 2048 : 1024,
        height: is4K ? 3072 : 1536,
        cssAspect: '2 / 3',
      };
    case 'story_9_16':
      // 9:16 Vertical Mobile Story / WhatsApp Status
      return {
        width: is4K ? 2160 : 1080,
        height: is4K ? 3840 : 1920,
        cssAspect: '9 / 16',
      };
    case 'square_1_1':
      // 1:1 Square Feed Post
      return {
        width: is4K ? 2160 : 1080,
        height: is4K ? 2160 : 1080,
        cssAspect: '1 / 1',
      };
    case 'source_auto':
    default:
      return {
        width: is4K ? 2048 : 1024,
        height: is4K ? 3072 : 1536,
        cssAspect: '2 / 3',
      };
  }
}

/**
 * Text wrapping helper supporting multi-lingual scripts (English, Gujarati, Hindi)
 */
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

/**
 * Fallback gradient when background image is loading or unavailable
 */
function drawProceduralBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  preset: BackgroundPreset
) {
  const grad = ctx.createRadialGradient(
    width / 2,
    height * 0.35,
    width * 0.1,
    width / 2,
    height * 0.5,
    width * 0.95
  );
  grad.addColorStop(0, preset.secondaryColor || '#1e293b');
  grad.addColorStop(0.5, preset.themeColor || '#0f172a');
  grad.addColorStop(1, '#020617');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative subtle particles
  ctx.save();
  const seedCount = 65;
  for (let i = 0; i < seedCount; i++) {
    const x = ((Math.sin(i * 997) + 1) / 2) * width;
    const y = ((Math.cos(i * 613) + 1) / 2) * (height * 0.85);
    const radius = 3 + (i % 6) * 3;
    const alpha = 0.08 + (i % 5) * 0.04;

    ctx.fillStyle = i % 2 === 0 ? preset.accentColor || '#fbbf24' : '#fde047';
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Main High-Resolution Canvas Render Function with 100% Background Immunity
 */
export function renderGreetingCard(options: GreetingCanvasOptions): Promise<void> {
  return new Promise((resolve) => {
    const {
      canvas,
      resolution,
      aspectRatio = 'portrait_2_3',
      bgImage,
      bgPreset,
      hasCustomerPhoto,
      customerPhoto,
      customerPhotoShape = 'circle',
      customerPhotoScale = 1.0,
      customerPhotoAnchor = 'top_center',
      photoOffsetX = 0,
      photoOffsetY = 0,
      occasionIcon,
      showOccasionIcon = true,
      title,
      recipientName,
      salutation,
      message,
      advisor,
      footerStyle = 'frosted_glass',
      showAdvisorCard = true,
      advisorCardOffsetY = 0,
      typographyTheme = 'gold',
      titleScale = 1.0,
      messageScale = 1.0,
      textAnchor = 'middle',
      textAlign = 'center',
      textBackplate = 'none',
      textOffsetY = 0,
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    const { width, height } = getCanvasDimensions(aspectRatio, resolution, bgImage);
    canvas.width = width;
    canvas.height = height;

    // Base scale referenced to 1024px width
    const scale = width / 1024;
    const goldColor = '#e2b34a';

    ctx.clearRect(0, 0, width, height);

    // =========================================================================
    // LAYER 0: ABSOLUTE BACKGROUND IMMUNITY (ZERO MODIFICATIONS / ZERO SCRIM)
    // The source background pixels remain 100% untouched and pristine.
    // =========================================================================
    let drawnImage = false;
    if (bgImage && bgImage.complete && bgImage.naturalWidth > 0 && bgImage.naturalHeight > 0) {
      try {
        const imgW = bgImage.naturalWidth;
        const imgH = bgImage.naturalHeight;
        const imgAspect = imgW / imgH;
        const targetAspect = width / height;

        // If dimensions match within 1%, draw full image without any crop
        if (Math.abs(imgAspect - targetAspect) < 0.02) {
          ctx.drawImage(bgImage, 0, 0, width, height);
        } else {
          // Precise center cover crop preserving exact aspect ratio without distortion
          let sx = 0;
          let sy = 0;
          let sWidth = imgW;
          let sHeight = imgH;

          if (imgAspect > targetAspect) {
            sWidth = imgH * targetAspect;
            sx = (imgW - sWidth) / 2;
          } else {
            sHeight = imgW / targetAspect;
            sy = Math.max(0, (imgH - sHeight) * 0.3);
          }
          ctx.drawImage(bgImage, sx, sy, sWidth, sHeight, 0, 0, width, height);
        }
        drawnImage = true;
      } catch (err) {
        console.warn('Canvas background draw fallback:', err);
      }
    }

    if (!drawnImage) {
      drawProceduralBackground(ctx, width, height, bgPreset);
    }

    // =========================================================================
    // LAYER 1: CLIENT PHOTO (OPTIONAL, FRAMED WITH GOLD ACCENT)
    // Placed on its own isolated layer.
    // =========================================================================
    const outerMargin = 40 * scale;
    const footerHeight = (footerStyle === 'minimal_banner' ? 140 : 185) * scale;
    const footerY = height - footerHeight - outerMargin + (advisorCardOffsetY * height);

    if (hasCustomerPhoto && customerPhoto && customerPhoto.complete && customerPhoto.naturalWidth > 0) {
      const baseRadius = 88 * scale;
      const photoRadius = baseRadius * customerPhotoScale;

      // Determine anchor position
      let photoCenterX = width / 2;
      let photoCenterY = 220 * scale;

      switch (customerPhotoAnchor) {
        case 'top_left':
          photoCenterX = outerMargin + photoRadius + 30 * scale;
          photoCenterY = 200 * scale;
          break;
        case 'top_right':
          photoCenterX = width - outerMargin - photoRadius - 30 * scale;
          photoCenterY = 200 * scale;
          break;
        case 'center':
          photoCenterX = width / 2;
          photoCenterY = height * 0.4;
          break;
        case 'center_left':
          photoCenterX = outerMargin + photoRadius + 40 * scale;
          photoCenterY = height * 0.42;
          break;
        case 'center_right':
          photoCenterX = width - outerMargin - photoRadius - 40 * scale;
          photoCenterY = height * 0.42;
          break;
        case 'top_center':
        default:
          photoCenterX = width / 2;
          photoCenterY = 230 * scale;
          break;
      }

      // Add fine-tune offsets
      photoCenterX += photoOffsetX * width;
      photoCenterY += photoOffsetY * height;

      // Subtle drop shadow behind the portrait badge to isolate it from background
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 24 * scale;
      ctx.shadowOffsetY = 8 * scale;

      // Base shape fill (protects from background transparency)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      if (customerPhotoShape === 'squircle') {
        const boxSize = photoRadius * 2;
        ctx.roundRect(photoCenterX - boxSize / 2, photoCenterY - boxSize / 2, boxSize, boxSize, 28 * scale);
      } else if (customerPhotoShape === 'diamond') {
        ctx.save();
        ctx.translate(photoCenterX, photoCenterY);
        ctx.rotate(Math.PI / 4);
        const dSize = photoRadius * 1.5;
        ctx.rect(-dSize / 2, -dSize / 2, dSize, dSize);
        ctx.restore();
      } else if (customerPhotoShape === 'gold_shield') {
        const sw = photoRadius * 1.9;
        const sh = photoRadius * 2.15;
        ctx.roundRect(photoCenterX - sw / 2, photoCenterY - sh / 2, sw, sh, [sw / 2, sw / 2, 28 * scale, 28 * scale]);
      } else {
        // Standard circle / oval
        ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();

      // Clip and Draw Customer Image
      ctx.save();
      ctx.beginPath();
      if (customerPhotoShape === 'squircle') {
        const boxSize = photoRadius * 2;
        ctx.roundRect(photoCenterX - boxSize / 2, photoCenterY - boxSize / 2, boxSize, boxSize, 28 * scale);
      } else if (customerPhotoShape === 'diamond') {
        ctx.save();
        ctx.translate(photoCenterX, photoCenterY);
        ctx.rotate(Math.PI / 4);
        const dSize = photoRadius * 1.5;
        ctx.rect(-dSize / 2, -dSize / 2, dSize, dSize);
        ctx.restore();
      } else if (customerPhotoShape === 'gold_shield') {
        const sw = photoRadius * 1.9;
        const sh = photoRadius * 2.15;
        ctx.roundRect(photoCenterX - sw / 2, photoCenterY - sh / 2, sw, sh, [sw / 2, sw / 2, 28 * scale, 28 * scale]);
      } else {
        ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      }
      ctx.clip();

      const cpW = customerPhoto.naturalWidth;
      const cpH = customerPhoto.naturalHeight;
      const cpAspect = cpW / cpH;
      let cpSw = cpW;
      let cpSh = cpH;
      let cpSx = 0;
      let cpSy = 0;
      if (cpAspect > 1) {
        cpSw = cpH;
        cpSx = (cpW - cpSw) / 2;
      } else {
        cpSh = cpW;
        cpSy = (cpH - cpSh) / 2;
      }

      ctx.drawImage(
        customerPhoto,
        cpSx,
        cpSy,
        cpSw,
        cpSh,
        photoCenterX - photoRadius * 1.05,
        photoCenterY - photoRadius * 1.05,
        photoRadius * 2.1,
        photoRadius * 2.1
      );
      ctx.restore();

      // Outer Gold Frame Ring
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 5 * scale;
      ctx.beginPath();
      if (customerPhotoShape === 'squircle') {
        const boxSize = photoRadius * 2;
        ctx.roundRect(photoCenterX - boxSize / 2, photoCenterY - boxSize / 2, boxSize, boxSize, 28 * scale);
      } else if (customerPhotoShape === 'gold_shield') {
        const sw = photoRadius * 1.9;
        const sh = photoRadius * 2.15;
        ctx.roundRect(photoCenterX - sw / 2, photoCenterY - sh / 2, sw, sh, [sw / 2, sw / 2, 28 * scale, 28 * scale]);
      } else {
        ctx.arc(photoCenterX, photoCenterY, photoRadius + 2 * scale, 0, Math.PI * 2);
      }
      ctx.stroke();

      // Delicate inner accent ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      if (customerPhotoShape === 'circle') {
        ctx.arc(photoCenterX, photoCenterY, photoRadius - 2 * scale, 0, Math.PI * 2);
      }
      ctx.stroke();
    }

    // =========================================================================
    // LAYER 2: OCCASION BADGE, TITLE, RECIPIENT & WISHES TYPOGRAPHY
    // =========================================================================
    ctx.save();

    // Determine baseline text area
    let textStartY = height * 0.48;
    if (textAnchor === 'top') {
      textStartY = 160 * scale;
    } else if (textAnchor === 'bottom') {
      textStartY = footerY - 320 * scale;
    } else if (hasCustomerPhoto && customerPhotoAnchor === 'top_center') {
      textStartY = height * 0.44;
    }
    textStartY += textOffsetY * height;

    let textCenterX = width / 2;
    if (textAlign === 'left') {
      textCenterX = outerMargin + 30 * scale;
      ctx.textAlign = 'left';
    } else if (textAlign === 'right') {
      textCenterX = width - outerMargin - 30 * scale;
      ctx.textAlign = 'right';
    } else {
      ctx.textAlign = 'center';
    }

    // Optional Soft Text Backplate (local pill/box behind text for high-contrast readability)
    if (textBackplate !== 'none') {
      const boxW = width * 0.88;
      const boxH = 340 * scale;
      const boxX = (width - boxW) / 2;
      const boxY = textStartY - 50 * scale;

      ctx.save();
      if (textBackplate === 'frosted_box') {
        ctx.fillStyle = 'rgba(10, 15, 30, 0.75)';
        ctx.strokeStyle = 'rgba(226, 179, 74, 0.4)';
        ctx.lineWidth = 2 * scale;
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1 * scale;
      }
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 24 * scale);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    let cursorY = textStartY;

    // 1. Occasion Icon
    if (showOccasionIcon && occasionIcon) {
      ctx.font = `${52 * scale}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(occasionIcon, textCenterX, cursorY);
      cursorY += 46 * scale;
    }

    // 2. Occasion Title
    const titleFontSize = Math.round(36 * scale * titleScale);
    ctx.font = `900 ${titleFontSize}px "Plus Jakarta Sans", "Noto Sans Gujarati", "Noto Sans Devanagari", sans-serif`;
    ctx.textBaseline = 'alphabetic';

    // Title gradient fill based on selected typography theme
    let textGrad = ctx.createLinearGradient(
      textCenterX - 250 * scale,
      cursorY,
      textCenterX + 250 * scale,
      cursorY
    );
    if (typographyTheme === 'pearl') {
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.5, '#f8fafc');
      textGrad.addColorStop(1, '#e2e8f0');
    } else if (typographyTheme === 'rose_gold') {
      textGrad.addColorStop(0, '#ffe4e6');
      textGrad.addColorStop(0.5, '#fda4af');
      textGrad.addColorStop(1, '#f43f5e');
    } else if (typographyTheme === 'saffron') {
      textGrad.addColorStop(0, '#ffedd5');
      textGrad.addColorStop(0.5, '#f59e0b');
      textGrad.addColorStop(1, '#d97706');
    } else {
      // Default royal gold gradient
      textGrad.addColorStop(0, '#fef08a');
      textGrad.addColorStop(0.5, '#fde047');
      textGrad.addColorStop(1, '#ca8a04');
    }

    ctx.fillStyle = textGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 16 * scale;
    ctx.shadowOffsetY = 4 * scale;
    ctx.fillText(title.toUpperCase(), textCenterX, cursorY);
    ctx.shadowBlur = 0;
    cursorY += 26 * scale;

    // Golden Divider Accent Line
    if (textAlign === 'center') {
      const dividerW = 160 * scale;
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 2.5 * scale;
      ctx.beginPath();
      ctx.moveTo(textCenterX - dividerW / 2, cursorY);
      ctx.lineTo(textCenterX + dividerW / 2, cursorY);
      ctx.stroke();

      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(textCenterX, cursorY, 4 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    cursorY += 34 * scale;

    // 3. Salutation / Recipient Name
    const salutationFontSize = Math.round(30 * scale * messageScale);
    ctx.font = `bold ${salutationFontSize}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
    const displayText = salutation || (recipientName ? `Dear ${recipientName}` : '');

    if (displayText) {
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 12 * scale;
      ctx.shadowOffsetY = 3 * scale;
      ctx.fillText(displayText, textCenterX, cursorY);
      ctx.shadowBlur = 0;
      cursorY += salutationFontSize * 1.4;
    }

    // 4. Heartfelt Greeting Message Body
    const bodyBaseSize = 23 * scale * messageScale;
    const bodyLineHeight = bodyBaseSize * 1.55;
    ctx.font = `500 ${Math.round(bodyBaseSize)}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#f8fafc';

    const maxTextWidth = (width - outerMargin * 2) * (textAlign === 'center' ? 0.85 : 0.9);
    const lines = wrapText(ctx, message, maxTextWidth);

    const availableVerticalRoom = footerY - 20 * scale - cursorY;
    let effectiveLineHeight = bodyLineHeight;
    if (lines.length * bodyLineHeight > availableVerticalRoom && lines.length > 0) {
      effectiveLineHeight = Math.max(bodyBaseSize * 1.2, availableVerticalRoom / lines.length);
    }

    for (const line of lines) {
      if (cursorY + effectiveLineHeight > footerY - 10 * scale) {
        break; // Guard against overflowing into the advisor card
      }
      if (line === '') {
        cursorY += effectiveLineHeight * 0.5;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowBlur = 12 * scale;
        ctx.shadowOffsetY = 3 * scale;
        ctx.fillText(line, textCenterX, cursorY);
        ctx.shadowBlur = 0;
        cursorY += effectiveLineHeight;
      }
    }

    ctx.restore();

    // =========================================================================
    // LAYER 3: ADVISOR BRANDING CARD (ISOLATED BOTTOM BAR)
    // Professional credentials, photo, ARN, phone, WhatsApp & best compliments
    // =========================================================================
    if (showAdvisorCard) {
      ctx.save();
      const footerWidth = width - outerMargin * 2;
      const footerX = outerMargin;

      // Card Background Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 20 * scale;
      ctx.shadowOffsetY = 8 * scale;

      if (footerStyle === 'solid_card') {
        // Deep Midnight Navy Solid
        ctx.fillStyle = '#080d1a';
        ctx.beginPath();
        ctx.roundRect(footerX, footerY, footerWidth, footerHeight, 18 * scale);
        ctx.fill();

        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 2.5 * scale;
        ctx.stroke();
      } else if (footerStyle === 'minimal_banner') {
        // Compact Clean Banner
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(footerX, footerY, footerWidth, footerHeight, 28 * scale);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
      } else if (footerStyle === 'elegant_classic') {
        // Classic Royal Gold Framed Card
        ctx.fillStyle = 'rgba(8, 12, 24, 0.96)';
        ctx.beginPath();
        ctx.roundRect(footerX, footerY, footerWidth, footerHeight, 16 * scale);
        ctx.fill();

        ctx.strokeStyle = `${goldColor}cc`;
        ctx.lineWidth = 3 * scale;
        ctx.strokeRect(footerX, footerY, footerWidth, footerHeight);
      } else if (footerStyle === 'floating_badge') {
        // Minimal floating badge
        ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
        ctx.beginPath();
        ctx.roundRect(footerX, footerY, footerWidth, footerHeight, 32 * scale);
        ctx.fill();

        ctx.strokeStyle = `${goldColor}88`;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      } else {
        // Default Frosted Glass
        ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
        ctx.beginPath();
        ctx.roundRect(footerX, footerY, footerWidth, footerHeight, 20 * scale);
        ctx.fill();

        ctx.strokeStyle = `${goldColor}99`;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // Reset shadow

      // Advisor Avatar / Photo
      const isCompact = footerStyle === 'minimal_banner';
      const advPhotoRadius = (isCompact ? 42 : 50) * scale;
      const advPhotoCenterX = footerX + advPhotoRadius + 24 * scale;
      const advPhotoCenterY = footerY + footerHeight / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(advPhotoCenterX, advPhotoCenterY, advPhotoRadius, 0, Math.PI * 2);
      ctx.clip();

      let drewAdvisorImg = false;
      if (advisor.profilePhoto && advisor.profilePhoto.complete && advisor.profilePhoto.naturalWidth > 0) {
        try {
          const apW = advisor.profilePhoto.naturalWidth;
          const apH = advisor.profilePhoto.naturalHeight;
          const apAspect = apW / apH;
          let apSw = apW;
          let apSh = apH;
          let apSx = 0;
          let apSy = 0;
          if (apAspect > 1) {
            apSw = apH;
            apSx = (apW - apSw) / 2;
          } else {
            apSh = apW;
            apSy = (apH - apSh) / 2;
          }
          ctx.drawImage(
            advisor.profilePhoto,
            apSx,
            apSy,
            apSw,
            apSh,
            advPhotoCenterX - advPhotoRadius,
            advPhotoCenterY - advPhotoRadius,
            advPhotoRadius * 2,
            advPhotoRadius * 2
          );
          drewAdvisorImg = true;
        } catch {
          drewAdvisorImg = false;
        }
      }

      if (!drewAdvisorImg) {
        // Elegant Monogram Initials
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(
          advPhotoCenterX - advPhotoRadius,
          advPhotoCenterY - advPhotoRadius,
          advPhotoRadius * 2,
          advPhotoRadius * 2
        );

        ctx.fillStyle = '#fde047';
        ctx.font = `bold ${Math.round(26 * scale)}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = (advisor.advisorName || 'FA')
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        ctx.fillText(initials, advPhotoCenterX, advPhotoCenterY);
      }
      ctx.restore();

      // Gold Ring around Avatar
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 3.5 * scale;
      ctx.beginPath();
      ctx.arc(advPhotoCenterX, advPhotoCenterY, advPhotoRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Advisor Information Columns
      const infoX = advPhotoCenterX + advPhotoRadius + 22 * scale;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      const advNameSize = Math.round((isCompact ? 22 : 26) * scale);
      const subSize = Math.round((isCompact ? 14 : 16) * scale);
      const metaSize = Math.round((isCompact ? 13 : 15) * scale);

      // Line 1: Advisor Name
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${advNameSize}px "Plus Jakarta Sans", "Noto Sans Gujarati", sans-serif`;
      const advNameText = advisor.advisorName || 'Financial Advisor';
      ctx.fillText(advNameText, infoX, footerY + (isCompact ? 36 : 42) * scale);

      // Line 2: Designation & Firm Name
      ctx.fillStyle = '#fde047';
      ctx.font = `600 ${subSize}px "Plus Jakarta Sans", sans-serif`;
      const designationLine = [
        advisor.designation || 'AMFI Registered MFD & Wealth Architect',
        advisor.firmName,
      ]
        .filter(Boolean)
        .join(' • ');
      ctx.fillText(designationLine, infoX, footerY + (isCompact ? 60 : 72) * scale);

      // Line 3: AMFI ARN & Registration Details
      ctx.fillStyle = '#94a3b8';
      ctx.font = `500 ${metaSize}px "Plus Jakarta Sans", monospace`;
      const regLine = [
        advisor.arnNumber ? `ARN: ${advisor.arnNumber}` : 'AMFI Registered MFD',
        advisor.euinNumber ? `EUIN: ${advisor.euinNumber}` : null,
        'Certified Partner',
      ]
        .filter(Boolean)
        .join(' | ');
      ctx.fillText(regLine, infoX, footerY + (isCompact ? 84 : 102) * scale);

      // Line 4: Contact Details (Phone, WhatsApp, Website)
      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${subSize}px "Plus Jakarta Sans", monospace`;
      const contactText = `📞 / 💬 ${advisor.phoneNumber || '+91 98765 43210'}`;
      ctx.fillText(contactText, infoX, footerY + (isCompact ? 108 : 134) * scale);

      if (advisor.website || advisor.email) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = `500 ${metaSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(
          advisor.website || advisor.email || '',
          infoX + 310 * scale,
          footerY + (isCompact ? 108 : 134) * scale
        );
      }

      // Right Compliments & Trust Badge
      const badgeRightX = footerX + footerWidth - 28 * scale;
      ctx.textAlign = 'right';

      ctx.fillStyle = goldColor;
      ctx.font = `bold ${Math.round((isCompact ? 18 : 22) * scale)}px "Noto Sans Gujarati", "Noto Sans Devanagari", "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('હાર્દિક શુભેચ્છાઓ સહ', badgeRightX, footerY + (isCompact ? 38 : 52) * scale);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `600 ${Math.round((isCompact ? 13 : 15) * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('With Best Compliments', badgeRightX, footerY + (isCompact ? 62 : 82) * scale);

      // Verified Stamp Pill
      ctx.fillStyle = 'rgba(234, 179, 8, 0.16)';
      ctx.strokeStyle = '#eab30866';
      ctx.lineWidth = 1.5 * scale;
      const pillW = (isCompact ? 185 : 210) * scale;
      const pillH = (isCompact ? 28 : 32) * scale;
      const pillX = badgeRightX - pillW;
      const pillY = footerY + (isCompact ? 84 : 106) * scale;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 16 * scale);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${Math.round((isCompact ? 12 : 14) * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('TRUSTED WEALTH PARTNER', pillX + pillW / 2, pillY + pillH / 2 + 5 * scale);

      ctx.restore();
    }

    resolve();
  });
}
