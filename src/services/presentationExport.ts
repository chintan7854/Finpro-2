import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { ClientPresentation, PresentationSlide, AdvisorPresentationSnapshot } from '../types/presentationStudio';
import { downloadFile } from '../utils/downloadHelper';

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
    const hasSideContent = (slide.metrics && slide.metrics.length > 0) || (slide.comparisonTable && slide.comparisonTable.headers?.length);
    const bulletsWidth = hasSideContent ? 7.2 : 11.7;

    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      const bulletItems = slide.bulletPoints.map((bp) => ({
        text: bp,
        options: { fontSize: 13, color: '1E293B', bullet: true, breakLine: true, paraSpaceAfter: 8 },
      }));

      s.addText(bulletItems, {
        x: 0.8,
        y: 2.6,
        w: bulletsWidth,
        h: 3.4,
        valign: 'top',
      });
    }

    // Side area: Metrics Cards
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

    // Native PowerPoint Comparison Table if present
    if (slide.comparisonTable && slide.comparisonTable.headers?.length && (!slide.metrics || slide.metrics.length === 0)) {
      const headerRow = slide.comparisonTable.headers.map((h) => ({
        text: h,
        options: { bold: true, fill: { color: '0F172A' }, color: 'FFFFFF', fontSize: 10 },
      }));

      const bodyRows = (slide.comparisonTable.rows || []).slice(0, 5).map((row, rIdx) => [
        {
          text: String(row.parameter || ''),
          options: {
            fontSize: 9.5,
            fill: { color: rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
            color: '1E293B',
            bold: true,
          },
        },
        {
          text: String(row.optionA || ''),
          options: {
            fontSize: 9.5,
            fill: { color: rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
            color: '1E293B',
          },
        },
        {
          text: String(row.optionB || ''),
          options: {
            fontSize: 9.5,
            fill: { color: rIdx % 2 === 0 ? 'FFFFFF' : 'F8FAFC' },
            color: '1E293B',
          },
        },
      ]);

      s.addTable([headerRow, ...bodyRows], {
        x: 8.4,
        y: 2.6,
        w: 4.1,
        autoPage: false,
        border: { pt: 0.5, color: 'CBD5E1' },
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
    const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
    downloadFile(
      blob,
      `${sanitizedFileName}.pptx`,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  } catch (writeErr) {
    console.warn('pptx.write to blob failed, attempting writeFile fallback:', writeErr);
    await pptx.writeFile({ fileName: `${sanitizedFileName}.pptx` });
  }
}

// 1px transparent SVG data URL so failed images never throw CORS errors
const TRANSPARENT_1PX_DATA_URL =
  'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';

// Robust element rasterizer options that skip external cross-origin font/image hangs
const RASTERIZE_OPTIONS = {
  quality: 0.95,
  pixelRatio: 1.5,
  backgroundColor: '#FFFFFF',
  cacheBust: false,
  skipFonts: true, // Prevents html-to-image crashing on Google Fonts or cross-origin stylesheets
  imagePlaceholder: TRANSPARENT_1PX_DATA_URL, // Prevents html-to-image crashing on external profile pictures
  onImageErrorHandler: () => TRANSPARENT_1PX_DATA_URL,
  filter: (node: HTMLElement) => {
    // Avoid rasterizing hidden buttons or invisible regeneration bars
    if (node.classList && (node.classList.contains('print:hidden') || node.classList.contains('no-export'))) {
      return false;
    }
    return true;
  },
};

/**
 * Vector Slide Renderer using jsPDF
 * Guaranteed to succeed without relying on DOM canvas or browser layout
 */
function renderVectorSlide(
  doc: jsPDF,
  slide: PresentationSlide,
  advisor: AdvisorPresentationSnapshot | undefined,
  slideIndex: number,
  totalSlides: number
) {
  const pageWidth = doc.internal.pageSize.getWidth(); // ~297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~210mm

  // 1. Top Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, 10, pageWidth - 20, 24, 'F');

  // Badge pill
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.roundedRect(14, 14, 38, 7, 2, 2, 'F');
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text((slide.badge || 'ADVISORY').toUpperCase(), 17, 19);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const safeTitle = (slide.title || 'Financial Strategy').substring(0, 75);
  doc.text(safeTitle, 58, 20);

  // Slide Counter
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.text(`Slide ${slideIndex + 1} of ${totalSlides}`, pageWidth - 35, 19);

  // Subtitle
  let curY = 40;
  if (slide.subtitle) {
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'italic');
    doc.text(slide.subtitle, 14, curY);
    curY += 8;
  }

  // Key Takeaway callout box
  if (slide.keyTakeaway) {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.4);
    doc.roundedRect(14, curY, pageWidth - 28, 14, 2, 2, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`KEY INSIGHT: ${slide.keyTakeaway}`, 18, curY + 9);
    curY += 18;
  }

  // Two columns: Left (Bullets & Insights) - width ~160, Right (Metrics/Table) - width ~100
  const hasSide = (slide.metrics && slide.metrics.length > 0) || (slide.comparisonTable && slide.comparisonTable.headers?.length);
  const leftX = 14;
  const leftW = hasSide ? 155 : pageWidth - 28;
  let bulletY = curY + 4;

  // Bullets
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    slide.bulletPoints.forEach((point) => {
      doc.setFillColor(5, 150, 105);
      doc.circle(leftX + 2, bulletY - 1.5, 1.2, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(point, leftW - 8);
      doc.text(lines, leftX + 6, bulletY);
      bulletY += lines.length * 5 + 3;
    });
  }

  // Case scenario
  if (slide.realWorldExample && bulletY < 165) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(leftX, bulletY, leftW, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Case: ${slide.realWorldExample.persona}`, leftX + 4, bulletY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Outcome: ${slide.realWorldExample.financialOutcome}`, leftX + 4, bulletY + 11);
    bulletY += 22;
  }

  // Right Column: Metrics & Comparison Table
  if (hasSide) {
    const rightX = leftX + leftW + 8;
    const rightW = pageWidth - rightX - 14;
    let rightY = curY + 4;

    if (slide.metrics && slide.metrics.length > 0) {
      slide.metrics.slice(0, 3).forEach((m) => {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(5, 150, 105);
        doc.setLineWidth(0.5);
        doc.roundedRect(rightX, rightY, rightW, 16, 2, 2, 'FD');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text(m.label.toUpperCase(), rightX + 4, rightY + 5);
        doc.setTextColor(6, 78, 59);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text(m.value, rightX + 4, rightY + 11.5);
        if (m.helper) {
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'italic');
          doc.text(m.helper, rightX + 4, rightY + 15);
        }
        rightY += 19;
      });
    }

    // Comparison Table
    if (slide.comparisonTable && slide.comparisonTable.headers?.length) {
      const tableHeaders = slide.comparisonTable.headers;
      const tableRows = slide.comparisonTable.rows || [];
      const colCount = tableHeaders.length;
      const colW = rightW / colCount;
      let tblY = rightY + 2;

      // Header row
      doc.setFillColor(15, 23, 42);
      doc.rect(rightX, tblY, rightW, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      tableHeaders.forEach((h, ci) => {
        doc.text(h, rightX + ci * colW + 2, tblY + 4.2);
      });
      tblY += 6;

      // Data rows
      tableRows.slice(0, 4).forEach((row, ri) => {
        doc.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 255 : 250, ri % 2 === 0 ? 255 : 252);
        doc.rect(rightX, tblY, rightW, 6, 'F');
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(String(row.parameter || ''), rightX + 2, tblY + 4.2);
        doc.text(String(row.optionA || ''), rightX + colW + 2, tblY + 4.2);
        doc.text(String(row.optionB || ''), rightX + 2 * colW + 2, tblY + 4.2);
        tblY += 6;
      });
    }
  }

  // Footer bar
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 16, pageWidth - 14, pageHeight - 16);

  if (advisor) {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    const advisorInfo = `${advisor.name || 'Financial Advisor'} • ${advisor.designation || 'Wealth & Insurance Consultant'} • Tel: ${advisor.phone || ''} • WhatsApp: ${advisor.whatsapp || ''}`;
    doc.text(advisorInfo, 14, pageHeight - 11);
  }

  const disclaimer = slide.assumptions?.[0] || advisor?.disclaimer || 'Mutual fund investments and insurance plans are subject to market risks. Read all scheme related documents carefully.';
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.text(disclaimer.substring(0, 140), 14, pageHeight - 7);
}

import { exportClientReportDocumentPdf } from './clientReportPdfGenerator';
export { exportClientReportDocumentPdf };

/**
 * Universal Fail-Safe PDF Exporter
 * Permanently upgraded to deliver the High-Density, Editorial Client Advisory Document PDF
 * strictly conforming to the golden standard (A4 portrait, zero wasted space, 3 metrics,
 * structured tables, colorful vector charts, case studies, checklist, and disclosures).
 */
export async function exportToPdf(
  slideElements: HTMLElement[],
  presentationTitle: string,
  presentationData?: ClientPresentation
): Promise<void> {
  // If presentationData is provided, generate the Golden-Standard Client Advisory Document PDF
  if (presentationData) {
    return await exportClientReportDocumentPdf(presentationData);
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let renderedCount = 0;

  // Attempt DOM image rasterization if elements are provided
  if (slideElements && slideElements.length > 0) {
    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i];

      try {
        const dataUrl = await toPng(el, RASTERIZE_OPTIONS);
        if (renderedCount > 0) pdf.addPage('a4', 'landscape');
        pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        renderedCount++;
      } catch (err) {
        console.warn(`Rasterize slide ${i + 1} with skipFonts failed, trying fallback:`, err);
        try {
          const dataUrl = await toPng(el, {
            quality: 0.85,
            pixelRatio: 1,
            backgroundColor: '#FFFFFF',
            skipFonts: true,
            imagePlaceholder: TRANSPARENT_1PX_DATA_URL,
            onImageErrorHandler: () => TRANSPARENT_1PX_DATA_URL,
          });
          if (renderedCount > 0) pdf.addPage('a4', 'landscape');
          pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
          renderedCount++;
        } catch (retryErr) {
          console.warn(`Slide ${i + 1} could not be rasterized:`, retryErr);
        }
      }
    }
  }

  if (renderedCount === 0) {
    throw new Error('Unable to render PDF document.');
  }

  const sanitized = (presentationTitle || 'Client_Presentation')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 40) || 'Client_Presentation';

  try {
    const blob = pdf.output('blob');
    const downloaded = downloadFile(blob, `${sanitized}.pdf`, 'application/pdf');
    if (!downloaded) {
      pdf.save(`${sanitized}.pdf`);
    }
  } catch (saveErr) {
    console.warn('Blob PDF download failed, using direct pdf.save fallback:', saveErr);
    pdf.save(`${sanitized}.pdf`);
  }
}

export async function exportSlideAsPng(slideElement: HTMLElement, slideNumber: number, title: string): Promise<void> {
  if (!slideElement) throw new Error('Slide element is required');

  let dataUrl: string | undefined;
  try {
    dataUrl = await toPng(slideElement, {
      ...RASTERIZE_OPTIONS,
      quality: 1,
      pixelRatio: 2,
    });
  } catch (err) {
    console.warn('PNG export high-res failed, retrying standard resolution:', err);
    try {
      dataUrl = await toPng(slideElement, {
        quality: 0.9,
        pixelRatio: 1,
        backgroundColor: '#FFFFFF',
        skipFonts: true,
        imagePlaceholder: TRANSPARENT_1PX_DATA_URL,
      });
    } catch (retryErr) {
      console.error('All PNG rasterization failed:', retryErr);
    }
  }

  const cleanTitle = (title || 'Slide')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 30);

  if (!dataUrl) {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = '#064E3B';
      ctx.fillRect(0, 0, 1280, 100);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(`SLIDE #${slideNumber} • FINANCIAL ADVISORY`, 60, 42);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText((title || 'Financial Advisory Slide').substring(0, 65), 60, 82);

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(60, 130, 1160, 530);

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 26px system-ui, sans-serif';
      ctx.fillText(title || 'Financial Strategy Insight', 90, 190);

      ctx.fillStyle = '#64748B';
      ctx.font = 'italic 18px system-ui, sans-serif';
      ctx.fillText('Customized advisory recommendation prepared for client review.', 90, 230);

      dataUrl = canvas.toDataURL('image/png', 1.0);
    }
  }

  if (dataUrl) {
    downloadFile(dataUrl, `Slide_${slideNumber}_${cleanTitle}.png`, 'image/png');
  } else {
    throw new Error('Unable to render slide image');
  }
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
${typeof lastSlide?.callToAction === 'string'
  ? lastSlide.callToAction
  : (lastSlide?.callToAction as any)?.text ||
    (lastSlide?.callToAction as any)?.message ||
    (lastSlide?.callToAction as any)?.cta ||
    'Schedule your personalized 1-on-1 portfolio consultation.'}

━━━━━━━━━━━━━━━━━━━━
👨‍💼 *${presentation.advisorSnapshot?.name || 'Financial Advisor'}*
📜 ${presentation.advisorSnapshot?.designation || ''}
📱 Phone/WhatsApp: ${presentation.advisorSnapshot?.whatsapp || presentation.advisorSnapshot?.phone || ''}
${presentation.advisorSnapshot?.professionalLicense ? `🛡️ ${presentation.advisorSnapshot.professionalLicense}` : ''}

_${presentation.advisorSnapshot?.disclaimer || ''}_`;
}
