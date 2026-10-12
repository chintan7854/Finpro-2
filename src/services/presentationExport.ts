import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { ClientPresentation } from '../types/presentationStudio';

export async function exportToPptx(presentation: ClientPresentation): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = presentation.advisorSnapshot?.name || 'Financial Advisor';
  pptx.company = 'FinAdvisor Pro';
  pptx.title = presentation.title || 'Client Presentation';

  const emeraldDark = '064E3B';
  const emeraldLight = '10B981';
  const slateDark = '0F172A';
  const textMuted = '64748B';

  (presentation.slides || []).forEach((slide) => {
    const s = pptx.addSlide();

    // Background header band
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: '100%',
      h: 0.9,
      fill: { color: slide.slideType === 'cover' ? emeraldDark : slateDark },
    });

    // Badge
    if (slide.badge) {
      s.addText(slide.badge.toUpperCase(), {
        x: 0.8,
        y: 0.15,
        w: 8.0,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: emeraldLight,
        charSpacing: 2,
      });
    }

    // Title
    s.addText(slide.title || 'Financial Strategy', {
      x: 0.8,
      y: 0.38,
      w: 11.5,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: 'FFFFFF',
    });

    // Subtitle / Punchline box
    if (slide.subtitle) {
      s.addText(slide.subtitle, {
        x: 0.8,
        y: 1.1,
        w: 11.5,
        h: 0.4,
        fontSize: 13,
        italic: true,
        color: '334155',
      });
    }

    // Executive takeaway callout box
    if (slide.keyTakeaway) {
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.6,
        w: 11.7,
        h: 0.8,
        fill: { color: 'F1F5F9' },
        line: { color: 'CBD5E1', width: 1 },
        rectRadius: 0.1,
      });

      s.addText(`KEY INSIGHT: ${slide.keyTakeaway}`, {
        x: 1.0,
        y: 1.7,
        w: 11.3,
        h: 0.6,
        fontSize: 11.5,
        bold: true,
        color: slateDark,
      });
    }

    // Content area: Bullets
    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      const bulletItems = slide.bulletPoints.map((bp) => ({
        text: bp,
        options: { fontSize: 13, color: '1E293B', bullet: true, breakLine: true, paraSpaceAfter: 8 },
      }));

      s.addText(bulletItems, {
        x: 0.8,
        y: 2.6,
        w: 7.2,
        h: 3.2,
        valign: 'top',
      });
    }

    // Side area: Metrics or Callouts
    if (slide.metrics && slide.metrics.length > 0) {
      slide.metrics.slice(0, 3).forEach((m, idx) => {
        const topY = 2.6 + idx * 1.1;
        s.addShape(pptx.ShapeType.roundRect, {
          x: 8.4,
          y: topY,
          w: 4.1,
          h: 0.95,
          fill: { color: 'F8FAFC' },
          line: { color: '059669', width: 1.5 },
          rectRadius: 0.08,
        });

        s.addText(m.label.toUpperCase(), {
          x: 8.6,
          y: topY + 0.08,
          w: 3.7,
          h: 0.25,
          fontSize: 9,
          bold: true,
          color: textMuted,
        });

        s.addText(m.value, {
          x: 8.6,
          y: topY + 0.32,
          w: 3.7,
          h: 0.35,
          fontSize: 16,
          bold: true,
          color: emeraldDark,
        });

        if (m.helper) {
          s.addText(m.helper, {
            x: 8.6,
            y: topY + 0.65,
            w: 3.7,
            h: 0.22,
            fontSize: 9,
            italic: true,
            color: '64748B',
          });
        }
      });
    }

    // Assumptions / Disclaimer on bottom
    const footerDisclaimer = slide.assumptions?.[0] || presentation.advisorSnapshot?.disclaimer || '';
    if (footerDisclaimer) {
      s.addText(footerDisclaimer, {
        x: 0.8,
        y: 6.3,
        w: 11.7,
        h: 0.45,
        fontSize: 8,
        color: textMuted,
        italic: true,
      });
    }

    // Advisor Branding Line on bottom
    const advisorSnap = presentation.advisorSnapshot;
    if (advisorSnap) {
      s.addText(
        `${advisorSnap.name || ''} • ${advisorSnap.designation || ''} • Tel: ${advisorSnap.phone || ''} • WhatsApp: ${advisorSnap.whatsapp || ''}`,
        {
          x: 0.8,
          y: 6.8,
          w: 11.7,
          h: 0.3,
          fontSize: 9,
          bold: true,
          color: slateDark,
        }
      );
    }
  });

  const sanitizedFileName = (presentation.title || 'Client_Presentation')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 40) || 'Client_Presentation';

  try {
    // Primary writeFile call
    await pptx.writeFile({ fileName: `${sanitizedFileName}.pptx` });
  } catch (writeErr) {
    console.warn('pptx.writeFile failed, attempting blob fallback:', writeErr);
    // Browser fallback: write to blob and download via standard anchor tag
    const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedFileName}.pptx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

// Robust element rasterizer options that ignore external cross-origin font/image hangs
const RASTERIZE_OPTIONS = {
  quality: 0.95,
  pixelRatio: 1.5,
  backgroundColor: '#FFFFFF',
  cacheBust: false,
  skipFonts: true, // Prevents html-to-image crashing on Google Fonts or cross-origin stylesheets
  filter: (node: HTMLElement) => {
    // Avoid rasterizing hidden buttons or invisible regeneration bars
    if (node.classList && node.classList.contains('print:hidden')) {
      return false;
    }
    return true;
  },
};

export async function exportToPdf(slideElements: HTMLElement[], presentationTitle: string): Promise<void> {
  if (!slideElements || slideElements.length === 0) {
    throw new Error('No slide elements found to export');
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let renderedCount = 0;

  for (let i = 0; i < slideElements.length; i++) {
    const el = slideElements[i];
    if (renderedCount > 0) pdf.addPage('a4', 'landscape');

    try {
      const dataUrl = await toPng(el, RASTERIZE_OPTIONS);
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      renderedCount++;
    } catch (err) {
      console.warn(`Rasterize slide ${i + 1} with skipFonts failed, trying fallback:`, err);
      try {
        // Fallback retry with base canvas or minimal rasterization
        const dataUrl = await toPng(el, {
          quality: 0.85,
          pixelRatio: 1,
          backgroundColor: '#FFFFFF',
          skipFonts: true,
        });
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        renderedCount++;
      } catch (retryErr) {
        console.error(`Slide ${i + 1} could not be rasterized:`, retryErr);
      }
    }
  }

  if (renderedCount === 0) {
    throw new Error('Unable to render presentation slides into PDF.');
  }

  const sanitized = (presentationTitle || 'Client_Presentation')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 40) || 'Client_Presentation';

  try {
    pdf.save(`${sanitized}.pdf`);
  } catch (saveErr) {
    // Browser fallback via blob URL if direct save fails in sandboxed iframe
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitized}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

export async function exportSlideAsPng(slideElement: HTMLElement, slideNumber: number, title: string): Promise<void> {
  if (!slideElement) throw new Error('Slide element is required');

  let dataUrl: string;
  try {
    dataUrl = await toPng(slideElement, {
      ...RASTERIZE_OPTIONS,
      quality: 1,
      pixelRatio: 2,
    });
  } catch (err) {
    console.warn('PNG export high-res failed, retrying standard resolution:', err);
    dataUrl = await toPng(slideElement, {
      quality: 0.9,
      pixelRatio: 1,
      backgroundColor: '#FFFFFF',
      skipFonts: true,
    });
  }

  const cleanTitle = (title || 'Slide')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 30);

  const link = document.createElement('a');
  link.download = `Slide_${slideNumber}_${cleanTitle}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateWhatsAppPitchText(presentation: ClientPresentation): string {
  const firstSlide = presentation.slides?.[0];
  const lastSlide = presentation.slides?.[presentation.slides.length - 1];

  return `📊 *${presentation.title}*
${presentation.clientName ? `_Prepared especially for ${presentation.clientName}_\n` : ''}
🎯 *Executive Summary:*
${firstSlide?.keyTakeaway || 'A customized, goal-based strategic financial roadmap.'}

📌 *Key Strategic Highlights:*
${firstSlide?.bulletPoints?.slice(0, 3).map((b) => `• ${b}`).join('\n') || ''}

💡 *Next Step:*
${lastSlide?.callToAction || 'Schedule your personalized 1-on-1 portfolio consultation.'}

━━━━━━━━━━━━━━━━━━━━
👨‍💼 *${presentation.advisorSnapshot?.name || 'Financial Advisor'}*
📜 ${presentation.advisorSnapshot?.designation || ''}
📱 Phone/WhatsApp: ${presentation.advisorSnapshot?.whatsapp || presentation.advisorSnapshot?.phone || ''}
${presentation.advisorSnapshot?.professionalLicense ? `🛡️ ${presentation.advisorSnapshot.professionalLicense}` : ''}

_${presentation.advisorSnapshot?.disclaimer || ''}_`;
}
