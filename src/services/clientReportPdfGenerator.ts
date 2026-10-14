import { jsPDF } from 'jspdf';
import { ClientPresentation } from '../types/presentationStudio';
import { downloadFile } from '../utils/downloadHelper';

interface PdfContext {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  curY: number;
  pageNum: number;
  presentation: ClientPresentation;
  categoryLabel: string;
}

/**
 * Text & Character Sanitizer
 * Replaces Mojibake artifacts, non-Latin or unsupported Unicode glyphs,
 * and standardizes Indian currency notation and punctuation for Type-1 PDF fonts.
 */
export function sanitizePdfText(input: unknown): string {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') {
    if (typeof input === 'number') return String(input);
    if (typeof input === 'object') {
      // Prevent [object Object]
      const obj = input as Record<string, unknown>;
      if (typeof obj.text === 'string') return sanitizePdfText(obj.text);
      if (typeof obj.label === 'string') return sanitizePdfText(obj.label);
      if (typeof obj.name === 'string') return sanitizePdfText(obj.name);
      return '';
    }
    return String(input);
  }

  let text = input;

  // Fix Mojibake artifacts from UTF-8 conversions
  text = text
    .replace(/â‚¹/g, 'Rs. ')
    .replace(/â€“/g, '-')
    .replace(/â€”/g, '-')
    .replace(/â€˜/g, "'")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€¢/g, '•')
    .replace(/â– /g, '•');

  // Replace standard unicode Rupee symbol with clean Rs. in Type-1 font text streams
  text = text.replace(/₹\s*/g, 'Rs. ');

  // Standardize quotes and hyphens
  text = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u25AA\u25A0\u25CF]/g, '•')
    .replace(/\u00A0/g, ' '); // non-breaking space

  // Clean trailing and excess whitespace
  return text.trim();
}

/**
 * Format numerical amounts in Indian numbering system (e.g. 1,00,000 / 12.5 Lakh)
 */
export function formatIndianCurrency(amount: number | string): string {
  if (typeof amount === 'string') {
    const cleanStr = amount.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleanStr);
    if (isNaN(parsed)) return amount;
    amount = parsed;
  }

  if (isNaN(amount)) return 'Rs. 0';

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `Rs. ${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `Rs. ${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} Lakh`;
  }

  // Format with Indian grouping
  const parts = amount.toFixed(0).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `Rs. ${formatted}`;
}

/**
 * Core PDF Document Builder
 * Generates an ultra-premium, continuous, high-density client advisory report
 * conforming strictly to the Gold-Standard A4 editorial financial report specifications.
 */
export function generateClientReportPdfDocument(presentation: ClientPresentation): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  const bottomLimit = pageHeight - 14; // 283mm

  const business = presentation.businessProfile;
  const sector = sanitizePdfText(business?.sectorName || business?.sectorId || 'Financial Advisory');
  const company = sanitizePdfText(business?.companyName || 'Leading Financial Institution');
  const product = sanitizePdfText(business?.productName || presentation.title || 'Comprehensive Advisory Solution');
  const client = sanitizePdfText(presentation.clientName || 'Valued Client');
  const advisor = presentation.advisorSnapshot || {
    name: 'Certified Financial Advisor',
    designation: 'Senior Financial Consultant',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'advisor@finadvisor.pro',
    location: 'India',
    professionalLicense: 'AMFI / IRDAI Authorized',
  };

  // Detect domain
  const fullText = `${sector} ${company} ${product} ${presentation.title || ''}`.toLowerCase();
  const isLifeInsurance =
    fullText.includes('life') ||
    fullText.includes('term') ||
    fullText.includes('protect') ||
    fullText.includes('endowment') ||
    fullText.includes('insurance') ||
    fullText.includes('lic') ||
    fullText.includes('jeevan');

  const isHealth =
    fullText.includes('health') ||
    fullText.includes('mediclaim') ||
    fullText.includes('care') ||
    fullText.includes('reassure');

  const isLoan = fullText.includes('loan') || fullText.includes('borrow') || fullText.includes('emi');
  const isSipMf = !isLifeInsurance && !isHealth && !isLoan;

  const categoryLabel = isLifeInsurance
    ? 'LIFE INSURANCE CLIENT ADVISORY REPORT'
    : isHealth
    ? 'HEALTH PROTECTION ADVISORY REPORT'
    : isLoan
    ? 'LOAN PLANNING & EMI RECOVERY REPORT'
    : 'MUTUAL FUND & SIP CLIENT ADVISORY REPORT';

  const ctx: PdfContext = {
    doc,
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    curY: 16,
    pageNum: 1,
  presentation,
    categoryLabel,
  };

  /**
   * Safe Page break handler:
   * Only triggers a new page if the requested height exceeds the printable area.
   */
  function ensureSpace(neededHeight: number): void {
    if (ctx.curY + neededHeight > bottomLimit) {
      doc.addPage('a4', 'portrait');
      ctx.pageNum++;
      ctx.curY = 16;
    }
  }

  /**
   * Continuous Line-by-Line Paragraph Flow Engine
   * Eliminates large blank gaps by flowing text line-by-line across pages.
   */
  function flowParagraph(
    text: string,
    fontSize: number = 8.5,
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    color: [number, number, number] = [30, 41, 59],
    indent: number = 0,
    lineHeight: number = 4.2
  ): void {
    const clean = sanitizePdfText(text);
    if (!clean) return;

    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);

    const lines = doc.splitTextToSize(clean, contentWidth - indent);
    for (const line of lines) {
      if (ctx.curY + lineHeight > bottomLimit) {
        doc.addPage('a4', 'portrait');
        ctx.pageNum++;
        ctx.curY = 16;
        doc.setFont('helvetica', fontStyle);
        doc.setFontSize(fontSize);
        doc.setTextColor(color[0], color[1], color[2]);
      }
      doc.text(line, margin + indent, ctx.curY);
      ctx.curY += lineHeight;
    }
    ctx.curY += 1.5; // compact gap after paragraph
  }

  /**
   * Section Heading Renderer (prevents orphaned headings)
   */
  function printSectionHeading(numAndTitle: string): void {
    ensureSpace(16); // Heading + at least 2 lines of text
    ctx.curY += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(sanitizePdfText(numAndTitle), margin, ctx.curY);
    ctx.curY += 5;
  }

  // --------------------------------------------------------------------------
  // PAGE 1: OFFICIAL CLIENT REPORT HEADER BANNER
  // --------------------------------------------------------------------------
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, ctx.curY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`FINADVISOR PRO | ${categoryLabel}`, margin + 3, ctx.curY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`OFFICIAL CLIENT BRIEF`, pageWidth - margin - 35, ctx.curY + 4.8);
  ctx.curY += 11;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);
  const rawTitle = presentation.title || `${company} ${product} Advisory Presentation`;
  const titleLines = doc.splitTextToSize(sanitizePdfText(rawTitle), contentWidth);
  doc.text(titleLines, margin, ctx.curY);
  ctx.curY += titleLines.length * 6.5 + 1;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const subText = isLifeInsurance
    ? `A family-protection discussion using official terms of ${company} ${product}.`
    : `A disciplined financial growth and goal-alignment strategy prepared for client review.`;
  const coverSubtitle = presentation.slides[0]?.subtitle;
  doc.text(sanitizePdfText(coverSubtitle || subText), margin, ctx.curY);
  ctx.curY += 6;

  // Metadata Grid Box (Compact & Pristine)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  const metaBoxH = 22;
  doc.roundedRect(margin, ctx.curY, contentWidth, metaBoxH, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared for:', margin + 3, ctx.curY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${client} (Client Family)`, margin + 25, ctx.curY + 4.8);

  doc.setFont('helvetica', 'bold');
  doc.text('Prepared by:', margin + 3, ctx.curY + 9.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${sanitizePdfText(advisor.name)} (${sanitizePdfText(advisor.designation)})`, margin + 25, ctx.curY + 9.8);

  doc.setFont('helvetica', 'bold');
  doc.text('Product:', margin + 3, ctx.curY + 14.8);
  doc.setFont('helvetica', 'normal');
  const prodLabel = `${company} - ${product}`;
  doc.text(prodLabel.length > 52 ? prodLabel.substring(0, 50) + '...' : prodLabel, margin + 25, ctx.curY + 14.8);

  doc.setFont('helvetica', 'bold');
  doc.text('License/ARN:', margin + 3, ctx.curY + 19.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${sanitizePdfText(advisor.professionalLicense || 'AMFI / IRDAI Authorized Distributor')}`, margin + 25, ctx.curY + 19.5);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.text('Review Date:', margin + 115, ctx.curY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    margin + 138,
    ctx.curY + 4.8
  );

  doc.setFont('helvetica', 'bold');
  doc.text('Contact:', margin + 115, ctx.curY + 9.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${sanitizePdfText(advisor.phone)} / ${sanitizePdfText(advisor.whatsapp)}`, margin + 138, ctx.curY + 9.8);

  doc.setFont('helvetica', 'bold');
  doc.text('Compliance:', margin + 115, ctx.curY + 14.8);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Product Documentation', margin + 138, ctx.curY + 14.8);

  ctx.curY += metaBoxH + 3.5;

  // --------------------------------------------------------------------------
  // 3-METRIC SUMMARY HIGHLIGHT CARDS (Extracted dynamically from presentation!)
  // --------------------------------------------------------------------------
  let m1Val = isLifeInsurance ? 'Rs. 1 Crore' : 'Rs. 5,000 / mo';
  let m1Label = isLifeInsurance ? 'Illustrative Sum Assured' : 'Monthly Example SIP';
  let m2Val = isLifeInsurance ? '30 Years' : 'Rs. 12 Lakh';
  let m2Label = isLifeInsurance ? 'Illustrative Policy Term' : 'Total 20-Yr Contributions';
  let m3Val = isLifeInsurance ? 'Protection' : 'Rs. 37.9 Lakh+';
  let m3Label = isLifeInsurance ? 'Financial Risk Shield' : 'Illustrative Value @ 10% p.a.';

  // Extract from actual slides if available
  const allSlideMetrics = (presentation.slides || []).flatMap((s) => s.metrics || []);
  if (allSlideMetrics.length >= 1 && allSlideMetrics[0].value) {
    m1Val = sanitizePdfText(allSlideMetrics[0].value);
    m1Label = sanitizePdfText(allSlideMetrics[0].label);
  }
  if (allSlideMetrics.length >= 2 && allSlideMetrics[1].value) {
    m2Val = sanitizePdfText(allSlideMetrics[1].value);
    m2Label = sanitizePdfText(allSlideMetrics[1].label);
  }
  if (allSlideMetrics.length >= 3 && allSlideMetrics[2].value) {
    m3Val = sanitizePdfText(allSlideMetrics[2].value);
    m3Label = sanitizePdfText(allSlideMetrics[2].label);
  }

  const cardW = (contentWidth - 6) / 3;
  const cardH = 16;

  // Card 1
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(m1Val, margin + cardW / 2, ctx.curY + 6.2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(m1Label, margin + cardW / 2, ctx.curY + 11.8, { align: 'center' });

  // Card 2
  const card2X = margin + cardW + 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(card2X, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(m2Val, card2X + cardW / 2, ctx.curY + 6.2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(m2Label, card2X + cardW / 2, ctx.curY + 11.8, { align: 'center' });

  // Card 3
  const card3X = margin + (cardW + 3) * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(card3X, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(m3Val, card3X + cardW / 2, ctx.curY + 6.2, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(m3Label, card3X + cardW / 2, ctx.curY + 11.8, { align: 'center' });

  ctx.curY += cardH + 3.5;

  // Purpose Callout Note Box
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(margin, ctx.curY, contentWidth, 11.5, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(133, 77, 14); // amber-800
  doc.text('Purpose & Nature of this Report:', margin + 3, ctx.curY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 63, 18);
  const purposeMsg =
    'This report explains how a verified financial product functions for client family objectives: protection need, mathematical scenarios, key features, contractual terms, limitations, and next steps. It is an educational advisory analysis, not an unconditional quote.';
  const purposeLines = doc.splitTextToSize(purposeMsg, contentWidth - 6);
  doc.text(purposeLines, margin + 3, ctx.curY + 7.5);
  ctx.curY += 14;

  // --------------------------------------------------------------------------
  // SECTION 1: UNDERSTANDING THE PRODUCT (Deep continuous text flow)
  // --------------------------------------------------------------------------
  printSectionHeading(`1. Understanding the Product: ${product}`);

  let p1Text = '';
  let p2Text = '';
  if (isLifeInsurance) {
    p1Text = `${product} is issued by ${company} as an individual, non-linked pure protection life insurance contract. The primary mandate of this solution is to provide structured financial shield and income replacement to the nominee family in the unforeseen event of premature death while the contract remains in force. It is not a speculative market-linked investment product, and the capital outlay is purely deployed toward underwriting family mortality risk.`;
    p2Text = `The solution features customizable policy terms, flexible premium payment horizons, and optional rider enhancements such as Accidental Death Benefit, Accelerated Terminal Illness cover, and Waiver of Premium. Statutory benefits include tax exemption under Section 80C and Section 10(10D) of the Indian Income Tax Act, subject to prevailing tax amendments. Official documentation must be reviewed prior to formal policy issuance.`;
  } else if (isSipMf) {
    p1Text = `${product} offered by ${company} operates as a professionally managed mutual fund portfolio structured to generate long-term capital appreciation. Systematic Investment Plans (SIP) allow investors to allocate fixed monthly amounts, eliminating emotional market timing through rupee-cost averaging. Every instalment purchases fund units at prevailing Net Asset Value (NAV), compounding over multi-year market cycles.`;
    p2Text = `Under SEBI guidelines, the portfolio publishes daily NAVs, monthly factsheets, complete holding disclosures, and total expense ratio (TER) metrics. Long-term capital gains (LTCG) beyond Rs. 1.25 Lakh are taxed at 12.5% under Union Budget 2024 regulations. Market risks apply, and investment success depends on remaining invested through full economic cycles.`;
  } else {
    p1Text = `${product} provided by ${company} delivers structured financial planning designed for debt efficiency, liquidity preservation, and disciplined wealth management.`;
    p2Text = `Key parameters include competitive interest structures, transparent fee disclosures, prepayment flexibilities, and clear contractual schedules.`;
  }

  flowParagraph(p1Text);
  flowParagraph(p2Text);

  // --------------------------------------------------------------------------
  // SECTION 2: A REALISTIC FAMILY SCENARIO (Continuous narrative)
  // --------------------------------------------------------------------------
  printSectionHeading('2. A Realistic Family-Protection & Goal Scenario');

  const scenarioText = isLifeInsurance
    ? `${client} is an earning household provider supporting dependants with ongoing living costs, outstanding loans, and future milestones such as children's higher education. For illustrative purposes, we examine whether a Rs. 1 Crore cover over a 30-year active horizon provides sufficient income security if an unfortunate demise occurs while obligations remain active.`
    : `${client} seeks to establish a predictable, automated wealth-creation mechanism to fund future milestones (child education, retirement corpus, or financial independence) without relying on lump-sum timing. A disciplined monthly SIP of Rs. 5,000 to Rs. 10,000 aligns monthly household cash flow with long-term compounding.`;

  const whyMattersText = isLifeInsurance
    ? `Why this matters: The premature death of a breadwinner can instantly disrupt family lifestyle, force distress liquidation of assets, and jeopardize educational aspirations. Life insurance creates an immediate liquidity estate that contractual claim processes deliver directly to dependants.`
    : `Why this matters: Inflation erodes cash purchasing power at ~6% to 7% annually. Fixed deposits and traditional savings struggle to deliver real positive returns after taxes. Equities through SIP historically outpace inflation over 10+ year horizons.`;

  flowParagraph(scenarioText);
  flowParagraph(whyMattersText, 8.5, 'normal', [15, 23, 42]);

  // --------------------------------------------------------------------------
  // SECTION 3: STRUCTURED INPUTS & PARAMETER MATRIX (Table with safe pagination)
  // --------------------------------------------------------------------------
  printSectionHeading('3. Illustrative Inputs & Parameter Matrix');

  const col1W = 55;
  const col2W = contentWidth - col1W;

  const defaultRows = isLifeInsurance
    ? [
        ['Life Assured', `${client} - Salaried Professional`],
        ['Plan Option', `${product} - Comprehensive Life Option`],
        ['Sum Assured', 'Rs. 1,00,00,000 (One Crore Guaranteed Cover)'],
        ['Policy Term', '30 Years (Coverage up to retirement age)'],
        ['Premium Payment Term', 'Regular Pay / Limited Pay Option'],
        ['Underwriting Status', 'Standard Non-Smoker Health Profile (Quote Required)'],
      ]
    : [
        ['Target Investor', `${client} - Goal-Driven Accumulation`],
        ['Asset Class & Scheme', `${product} - Regular Growth Option`],
        ['Monthly SIP Amount', 'Rs. 5,000 / month (Automated Mandate)'],
        ['Investment Horizon', '20 Years (240 Monthly Contributions)'],
        ['Total Principal Invested', 'Rs. 12,00,000 (Total Outlay Over 20 Years)'],
        ['Tax Status', 'LTCG @ 12.5% beyond Rs. 1.25 Lakh annual exemption'],
      ];

  // Draw table header
  ensureSpace(12);
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, ctx.curY, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('INPUT PARAMETER', margin + 3, ctx.curY + 3.8);
  doc.text('ILLUSTRATIVE VALUE / ADVISORY STATUS', margin + col1W + 3, ctx.curY + 3.8);
  ctx.curY += 5.5;

  defaultRows.forEach((row, rIdx) => {
    ensureSpace(6);
    const rowH = 5.8;
    doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, rIdx % 2 === 0 ? 255 : 250, rIdx % 2 === 0 ? 255 : 252);
    doc.rect(margin, ctx.curY, contentWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, ctx.curY + rowH, margin + contentWidth, ctx.curY + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(sanitizePdfText(row[0]), margin + 3, ctx.curY + 4.1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(sanitizePdfText(row[1]), margin + col1W + 3, ctx.curY + 4.1);
    ctx.curY += rowH;
  });

  ctx.curY += 3;

  // --------------------------------------------------------------------------
  // SECTION 4: WHAT IS THE POTENTIAL BENEFIT? (Visual Scenarios & Vector Chart)
  // --------------------------------------------------------------------------
  printSectionHeading('4. What is the Potential Benefit? (Visual Scenarios)');

  const benefitExpl = isLifeInsurance
    ? `For life insurance, the core benefit is contractual financial protection, not investment yield. If the life assured passes away while the policy is active, the nominee receives the entire Rs. 1 Crore sum assured. Below, we compare the total cumulative premium outlay against the instant contractual risk cover.`
    : `A disciplined SIP compounds mathematically over time. Below, we illustrate the projected future corpus for a Rs. 5,000 monthly SIP across 5, 10, 15, and 20 years at conservative 6%, balanced 10%, and historical benchmark 12% annual compounding rates.`;

  flowParagraph(benefitExpl);

  // High-Fidelity Vector Chart (Atomic 44mm block)
  ensureSpace(46);
  const chartX = margin + 10;
  const chartY = ctx.curY;
  const chartW = contentWidth - 20;
  const chartH = 40;

  // Chart Container
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(chartX - 5, chartY - 2, chartW + 10, chartH + 8, 1.5, 1.5, 'FD');

  if (isLifeInsurance) {
    // Protection vs Outlay Chart
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Protection Concept: Rs. 1 Crore Cover vs Total Premium Paid', chartX + chartW / 2, chartY + 3, {
      align: 'center',
    });

    const bar1X = chartX + chartW * 0.25;
    const barW = 32;
    const bar1H = 28;
    doc.setFillColor(2, 132, 199); // sky-600
    doc.rect(bar1X, chartY + chartH - bar1H - 2, barW, bar1H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Rs. 100 Lakh', bar1X + barW / 2, chartY + chartH - bar1H + 4, { align: 'center' });

    const bar2X = chartX + chartW * 0.65;
    const bar2H = 7;
    doc.setFillColor(148, 163, 184); // slate-400
    doc.rect(bar2X, chartY + chartH - bar2H - 2, barW, bar2H, 'F');
    doc.setTextColor(15, 23, 42);
    doc.text('Quote Required', bar2X + barW / 2, chartY + chartH - bar2H - 2.5, { align: 'center' });

    // Baseline
    doc.setDrawColor(100, 116, 139);
    doc.line(chartX + 10, chartY + chartH - 2, chartX + chartW - 10, chartY + chartH - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Illustrative Life Cover', bar1X + barW / 2, chartY + chartH + 2.5, { align: 'center' });
    doc.text('Premium Total Outlay', bar2X + barW / 2, chartY + chartH + 2.5, { align: 'center' });
  } else {
    // Compounding Growth Bar Chart (5y, 10y, 15y, 20y at 6%, 10%, 12%)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('SIP Compounding Growth Scenarios (Rs. 5,000 / month)', chartX + chartW / 2, chartY + 3, {
      align: 'center',
    });

    // Legend
    const legY = chartY + 7;
    doc.setFontSize(7);
    doc.setFillColor(13, 148, 136); // teal-600
    doc.rect(chartX + 30, legY - 2.5, 4, 3, 'F');
    doc.setTextColor(51, 65, 85);
    doc.text('6% Scenario', chartX + 36, legY);

    doc.setFillColor(2, 132, 199); // sky-600
    doc.rect(chartX + 70, legY - 2.5, 4, 3, 'F');
    doc.text('10% Scenario', chartX + 76, legY);

    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(chartX + 110, legY - 2.5, 4, 3, 'F');
    doc.text('12% Benchmark', chartX + 116, legY);

    const baseY = chartY + chartH - 2;
    doc.setDrawColor(203, 213, 225);
    doc.line(chartX + 5, baseY, chartX + chartW - 5, baseY);

    const clusters = [
      { label: '5 Years', v6: 3.5, v10: 4.1, v12: 4.5 },
      { label: '10 Years', v6: 8.2, v10: 10.3, v12: 11.6 },
      { label: '15 Years', v6: 14.5, v10: 20.9, v12: 25.2 },
      { label: '20 Years', v6: 23.1, v10: 37.9, v12: 49.5 },
    ];

    const clusterW = (chartW - 20) / 4;
    const barW = 7;
    const maxVal = 50;

    clusters.forEach((c, idx) => {
      const cX = chartX + 10 + idx * clusterW;

      // 6% Bar
      const h6 = (c.v6 / maxVal) * 22;
      doc.setFillColor(13, 148, 136);
      doc.rect(cX, baseY - h6, barW, h6, 'F');

      // 10% Bar
      const h10 = (c.v10 / maxVal) * 22;
      doc.setFillColor(2, 132, 199);
      doc.rect(cX + barW + 1, baseY - h10, barW, h10, 'F');

      // 12% Bar
      const h12 = (c.v12 / maxVal) * 22;
      doc.setFillColor(217, 119, 6);
      doc.rect(cX + (barW + 1) * 2, baseY - h12, barW, h12, 'F');

      // Cluster Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(c.label, cX + barW * 1.5, baseY + 3.8, { align: 'center' });
    });
  }

  ctx.curY += chartH + 10;

  // Chart Explanatory Callout Note
  const chartNote = isLifeInsurance
    ? 'Concept disclosure: This chart illustrates the financial leverage of insurance. The full contractual death benefit is payable upon valid claim acceptance, while cumulative premium outlay represents a fraction of the capital shield.'
    : 'Approximate 20-year outcomes for Rs. 5,000 monthly SIP: At 6% approx Rs. 23.1 Lakh; at 10% approx Rs. 37.9 Lakh; at 12% approx Rs. 49.5 Lakh. These are illustrative compounding calculations before taxes and do not guarantee future returns.';

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, ctx.curY, contentWidth, 8.5, 1, 1, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const noteLines = doc.splitTextToSize(chartNote, contentWidth - 6);
  doc.text(noteLines, margin + 3, ctx.curY + 3.5);
  ctx.curY += 11.5;

  // --------------------------------------------------------------------------
  // SECTION 5: PLAN FEATURES & OPTIONS (Detailed clauses)
  // --------------------------------------------------------------------------
  printSectionHeading('5. Key Features, Options & Structural Benefits');

  const features = isLifeInsurance
    ? [
        ['Return of Premium Option', 'Option where cumulative premiums paid are returned on survival to policy maturity, subject to variant terms.'],
        ['Increasing Cover Flexibility', 'Features allowing death benefit to step up periodically to keep pace with inflation and life-stage milestones.'],
        ['Comprehensive Riders', 'Available add-ons including Critical Illness, Accidental Death, and Waiver of Premium upon permanent disability.'],
        ['Tax Optimization', 'Premiums eligible for tax deduction under Section 80C; death benefit proceeds 100% tax-exempt under Section 10(10D).'],
      ]
    : [
        ['Rupee-Cost Averaging', 'Automatic purchase of more units when markets dip and fewer when markets peak, averaging down unit acquisition cost.'],
        ['Flexible Step-Up Facility', 'Annual top-up (e.g. 10% step-up) aligns investment contributions with annual salary increments, doubling corpus.'],
        ['High Liquidity & Control', 'Zero lock-in in open-ended schemes; access your funds anytime via partial withdrawal or Systematic Withdrawal Plan (SWP).'],
        ['Tax Efficiency (Section 112A)', 'Long-term equity gains taxed at favorable 12.5% rate only on capital gains exceeding Rs. 1.25 Lakh per financial year.'],
      ];

  features.forEach(([featTitle, featDesc]) => {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${sanitizePdfText(featTitle)}: `, margin + 2, ctx.curY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(sanitizePdfText(featDesc), contentWidth - 45);
    doc.text(descLines, margin + 42, ctx.curY);
    ctx.curY += descLines.length * 4.1 + 1.5;
  });

  ctx.curY += 2;

  // --------------------------------------------------------------------------
  // SECTION 6: HISTORICAL BEST-CASE & CONTRACTUAL BENEFIT ANALYSIS
  // --------------------------------------------------------------------------
  printSectionHeading('6. Historical Best-Case & Contractual Benefit Analysis');

  const hist = presentation.historicalAnalysis;
  const histText = isLifeInsurance
    ? `A pure term insurance contract does not generate historical investment return series. Therefore, the appropriate analytical framework is a contractual-benefit analysis: the policy guarantees the Rs. 1 Crore Sum Assured payout upon demise, provided premiums are paid and disclosures are truthful. Optional bonus declarations in non-linked traditional policies (under IRDAI 4% & 8% illustrations) are non-guaranteed estimates and must be separated from pure protection.`
    : (hist?.description ||
      `In Indian equity market history (2003-2018 bull and recovery phases), the verified 15-year rolling SIP return of broad market benchmarks (Nifty 500 TRI) peaked at ~17.8% CAGR. However, historical peak outcomes reflect extraordinary historical cycles and must NEVER be treated as future guarantees. Realistic long-term advisory planning relies on a 10%-12% conservative compounding baseline.`);

  flowParagraph(histText);

  // --------------------------------------------------------------------------
  // SECTION 7: CLIENT-EDUCATION SCENARIOS (Continuous flow)
  // --------------------------------------------------------------------------
  printSectionHeading('7. Client-Education Scenarios');

  const scenarios = isLifeInsurance
    ? [
        ['Example A - Income Protection:', 'If the primary earner passes away prematurely, the Rs. 1 Crore lump-sum enables the surviving spouse to generate predictable monthly interest income to fund ongoing grocery, utility, and rental expenses.'],
        ['Example B - Outstanding Home Loan:', 'A dedicated term policy insulates the family from debt recovery. The death benefit clears the mortgage balance, preventing foreclosure and allowing the family to retain their home.'],
        ['Example C - Life-Stage Policy Review:', 'As income grows and children enter university, coverage should be re-evaluated. Pure term contracts can be complemented with parallel SIPs to build independent wealth.'],
      ]
    : [
        ['Example A - The Early Starter (Age 25):', 'Neha begins a modest Rs. 5,000 monthly SIP at age 25. By investing through economic ups and downs, time provides 35 years of exponential compounding for complete financial freedom.'],
        ['Example B - The Late Planner (Age 40):', 'Kunal starts at age 40 with higher monthly capacity. By coupling disciplined SIP with annual 10% step-ups, he rapidly narrows his retirement gap within 15 years.'],
        ['Example C - Goal-Linked Investing:', 'Partitioning SIPs into specific buckets (Child Education, Home Down-payment, Retirement) prevents emotional redemptions during normal market corrections.'],
      ];

  scenarios.forEach(([sTitle, sDesc]) => {
    ensureSpace(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(sanitizePdfText(sTitle), margin + 2, ctx.curY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const dLines = doc.splitTextToSize(sanitizePdfText(sDesc), contentWidth - 48);
    doc.text(dLines, margin + 46, ctx.curY);
    ctx.curY += dLines.length * 4.1 + 1.5;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Note: These are fictional educational scenarios designed for conceptual clarity, not actual customer testimonials.', margin + 2, ctx.curY + 2);
  ctx.curY += 6;

  // --------------------------------------------------------------------------
  // SECTION 8: KEY RISKS, CONDITIONS & REGULATORY GUARDRAILS
  // --------------------------------------------------------------------------
  printSectionHeading('8. Key Risks, Conditions & Regulatory Guardrails');

  const risks = isLifeInsurance
    ? [
        'Underwriting & Medical Disclosure: 100% truthful disclosure of pre-existing conditions, smoking status, and family history is mandatory. Concealment can lead to claim repudiation.',
        'Policy Continuity: Premiums must be paid within the 30-day grace period; lapsed policies forfeit protection benefits.',
        'Exclusions: Standard suicide exclusions apply within the first 12 months from policy inception as per IRDAI regulations.',
      ]
    : [
        'Market Volatility: Equity mutual funds do not offer fixed or guaranteed returns. NAV values fluctuate based on underlying macroeconomic factors.',
        'Holding Horizon: Equity investments require a minimum 5-7 year horizon to manage downside volatility and allow rupee-cost averaging to work.',
        'Emergency Buffer: Maintaining 6 months of expenses in a liquid fund prevents distress redemption of long-term investments during emergencies.',
      ];

  risks.forEach((r) => {
    ensureSpace(7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const rLines = doc.splitTextToSize(`• ${sanitizePdfText(r)}`, contentWidth - 4);
    doc.text(rLines, margin + 2, ctx.curY);
    ctx.curY += rLines.length * 4.1 + 1.2;
  });

  ctx.curY += 2;

  // --------------------------------------------------------------------------
  // SECTION 9: ADVISOR DISCUSSION CHECKLIST
  // --------------------------------------------------------------------------
  printSectionHeading('9. Advisor Discussion Checklist (Step-by-Step)');

  const checklist = [
    '1. Quantify family financial requirements (dependants, liabilities, goals, and existing assets).',
    '2. Confirm age, KYC documentation, bank mandate details, and nominee designations.',
    '3. Obtain official company premium quote / Scheme Information Document (SID & KIM).',
    '4. Review contractual terms, payment frequency, tax implications, and exclusion clauses.',
    '5. Setup automated bank ECS/NACH mandate to guarantee investment/protection continuity.',
    '6. Schedule annual portfolio review to adjust for promotions, inflation, and life changes.',
  ];

  checklist.forEach((item) => {
    ensureSpace(5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(sanitizePdfText(item), margin + 2, ctx.curY);
    ctx.curY += 4.3;
  });

  ctx.curY += 2;

  // --------------------------------------------------------------------------
  // SECTION 10: STATUTORY DISCLOSURES & OFFICIAL SOURCE REFERENCES
  // --------------------------------------------------------------------------
  printSectionHeading('10. Suggested Next Step & Important Disclosures');

  const statutoryText =
    'Important Statutory Disclosure: This document is an educational presentation prepared for discussion purposes. All figures, returns, and values are illustrative and subject to official scheme/policy terms. Mutual fund investments are subject to market risks; read all scheme related documents carefully. Insurance is a subject matter of solicitation. Please read the official product brochure, benefit illustration, and terms before purchasing.';
  flowParagraph(statutoryText, 7.5, 'normal', [100, 116, 139]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Official Source References:', margin, ctx.curY);
  doc.setFont('helvetica', 'normal');
  doc.text(`• ${company} Official Portal & Product Information: Verified via Company Disclosures & Factsheets`, margin, ctx.curY + 3.8);
  ctx.curY += 8;

  // --------------------------------------------------------------------------
  // FINAL OFFICIAL ADVISOR PROFILE BRANDING BOX
  // --------------------------------------------------------------------------
  ensureSpace(20);
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, ctx.curY, contentWidth, 18, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Demonstration Advisor Profile: ${sanitizePdfText(advisor.name)}`, margin + 4, ctx.curY + 5.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${sanitizePdfText(advisor.designation)} • License/ARN: ${sanitizePdfText(advisor.professionalLicense || 'AMFI / IRDAI Authorized')}`,
    margin + 4,
    ctx.curY + 9.8
  );

  doc.setTextColor(148, 163, 184);
  doc.text(
    `Tel: ${sanitizePdfText(advisor.phone)} • WhatsApp: ${sanitizePdfText(advisor.whatsapp)} • Email: ${sanitizePdfText(advisor.email)} • Location: ${sanitizePdfText(advisor.location)}`,
    margin + 4,
    ctx.curY + 14.5
  );

  // --------------------------------------------------------------------------
  // PASS 2: CRISP RUNNING HEADERS & FOOTERS (WITH EXACT "PAGE X OF Y")
  // --------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Running Header (Pages 2 onwards)
    if (p > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`FINADVISOR PRO | ${categoryLabel}`, margin, 9);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 20, 9);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 11, pageWidth - margin, 11);
    }

    // Running Footer (All pages)
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    const footerText = `${sanitizePdfText(advisor.name)} • ${sanitizePdfText(advisor.designation)} • Confidential Client Presentation • Not an offer or guarantee`;
    doc.text(footerText, margin, pageHeight - 7.5);
    doc.text(`Page ${p} of ${totalPages} | Doc Ref: FA-${new Date().getFullYear()}`, pageWidth - margin - 45, pageHeight - 7.5);
  }

  return doc;
}

/**
 * High-Density, Professional Client Financial Advisory Document PDF Generator
 * Built strictly according to the gold-standard A4 client report specification.
 */
export async function exportClientReportDocumentPdf(presentation: ClientPresentation): Promise<void> {
  const doc = generateClientReportPdfDocument(presentation);

  const business = presentation.businessProfile;
  const company = sanitizePdfText(business?.companyName || 'Advisory');
  const product = sanitizePdfText(business?.productName || presentation.title || 'Report');

  const sanitized = (presentation.title || `${company}_${product}_Client_Report`)
    .replace(/[^a-zA-Z0-9_\u0900-\u097F\u0A80-\u0AFF]/g, '_')
    .substring(0, 45);

  try {
    const blob = doc.output('blob');
    const downloaded = downloadFile(blob, `${sanitized}_Report.pdf`, 'application/pdf');
    if (!downloaded) {
      doc.save(`${sanitized}_Report.pdf`);
    }
  } catch (err) {
    console.warn('Direct blob PDF export fallback:', err);
    doc.save(`${sanitized}_Report.pdf`);
  }
}
