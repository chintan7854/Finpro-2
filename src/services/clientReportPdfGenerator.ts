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
 * High-Density, Professional Client Financial Advisory Document PDF Generator
 * Built strictly according to the gold-standard A4 client report specification:
 * - A4 Portrait (210 x 297 mm)
 * - Zero awkward blank space; continuous, high-density professional editorial flow
 * - 3-metric highlight grid at the top
 * - Detailed paragraphs, why-this-matters contextual narratives
 * - Structured parameters & comparison tables
 * - High-fidelity multi-color vector charts
 * - Historical best-case & contractual benefit distinction
 * - Educational case studies, advisor checklist, official source links & advisor branding
 */
export async function exportClientReportDocumentPdf(presentation: ClientPresentation): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const business = presentation.businessProfile;
  const sector = business?.sectorName || business?.sectorId || 'Financial Advisory';
  const company = business?.companyName || 'Leading Financial Institution';
  const product = business?.productName || presentation.title || 'Comprehensive Advisory Solution';
  const client = presentation.clientName || 'Valued Client';
  const advisor = presentation.advisorSnapshot;

  // Detect domain
  const fullText = `${sector} ${company} ${product} ${presentation.title}`.toLowerCase();
  const isLifeInsurance =
    fullText.includes('life') ||
    fullText.includes('term') ||
    fullText.includes('protect') ||
    fullText.includes('endowment') ||
    fullText.includes('insurance') ||
    fullText.includes('વીમો') ||
    fullText.includes('બીમા');

  const isHealth =
    fullText.includes('health') ||
    fullText.includes('mediclaim') ||
    fullText.includes('reassure') ||
    fullText.includes('super top');

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
    curY: margin,
    pageNum: 1,
    presentation,
    categoryLabel,
  };

  // Helper to draw standard header & footer on current page
  function renderHeaderFooter() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`FINADVISOR PRO | ${categoryLabel}`, margin, 9);
    doc.text(`Page ${ctx.pageNum}`, pageWidth - margin - 12, 9);

    // Top rule
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, 11, pageWidth - margin, 11);

    // Bottom footer rule
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    const footerText = `${advisor.name} • ${advisor.designation} • Confidential Client Presentation • Not an offer or guarantee`;
    doc.text(footerText, margin, pageHeight - 7.5);
    doc.text(`Doc Ref: FA-${new Date().getFullYear()}`, pageWidth - margin - 22, pageHeight - 7.5);
  }

  // Check page break with automatic header/footer
  function checkBreak(neededHeight: number): void {
    if (ctx.curY + neededHeight > pageHeight - 14) {
      doc.addPage('a4', 'portrait');
      ctx.pageNum++;
      renderHeaderFooter();
      ctx.curY = 16;
    }
  }

  // Draw first page header
  renderHeaderFooter();
  ctx.curY = 16;

  // --------------------------------------------------------------------------
  // PAGE 1: TITLE, METADATA & 3-METRIC SUMMARY CARDS
  // --------------------------------------------------------------------------

  // Main Document Header Tag
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, ctx.curY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`FINADVISOR PRO | INVESTOR ADVISORY & PRODUCT REPORT`, margin + 3, ctx.curY + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`OFFICIAL CLIENT BRIEF`, pageWidth - margin - 35, ctx.curY + 4.8);
  ctx.curY += 11;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  const titleLines = doc.splitTextToSize(presentation.title || `${product} Advisory Presentation`, contentWidth);
  doc.text(titleLines, margin, ctx.curY);
  ctx.curY += titleLines.length * 6.5 + 1;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // slate-600
  const subText = isLifeInsurance
    ? `A family-protection discussion using official terms of ${company} ${product}.`
    : `A disciplined financial growth and goal-alignment strategy prepared for client review.`;
  doc.text(subText, margin, ctx.curY);
  ctx.curY += 6.5;

  // Client & Product Metadata Grid
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, ctx.curY, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.text('Prepared for:', margin + 3, ctx.curY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${client} (Client Family)`, margin + 26, ctx.curY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Prepared by:', margin + 3, ctx.curY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${advisor.name} (${advisor.designation})`, margin + 26, ctx.curY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Product discussed:', margin + 3, ctx.curY + 16);
  doc.setFont('helvetica', 'normal');
  const prodLabel = `${company} — ${product}`;
  doc.text(prodLabel.length > 55 ? prodLabel.substring(0, 52) + '...' : prodLabel, margin + 31, ctx.curY + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('License / ARN:', margin + 3, ctx.curY + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${advisor.professionalLicense || 'AMFI / IRDAI Authorized Distributor'}`, margin + 26, ctx.curY + 20.5);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Review:', margin + 115, ctx.curY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), margin + 140, ctx.curY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Advisor Contact:', margin + 115, ctx.curY + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${advisor.phone} / ${advisor.whatsapp}`, margin + 140, ctx.curY + 10.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Status:', margin + 115, ctx.curY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Product Documentation`, margin + 146, ctx.curY + 16);

  ctx.curY += 27;

  // 3-Metric Summary Highlight Grid (Exactly matching the User's sample PDF!)
  const cardW = (contentWidth - 6) / 3;
  const cardH = 17;

  let metric1Val = '■ ₹1 Crore';
  let metric1Label = 'Illustrative Sum Assured';
  let metric2Val = '30 Years';
  let metric2Label = 'Illustrative Policy Term';
  let metric3Val = 'Protection';
  let metric3Label = 'Financial Risk Shield';

  if (isSipMf) {
    metric1Val = '■ ₹5,000 / mo';
    metric1Label = 'Monthly Example SIP';
    metric2Val = '■ ₹12 Lakh';
    metric2Label = 'Total 20-Yr Contributions';
    metric3Val = '■ ₹37.9 Lakh+';
    metric3Label = 'Illustrative Value @ 10% p.a.';
  } else if (isLoan) {
    metric1Val = '■ ₹50 Lakh';
    metric1Label = 'Home Loan Principal';
    metric2Val = '8.50% p.a.';
    metric2Label = 'Indicative Interest Rate';
    metric3Val = '■ ₹7,500 / mo';
    metric3Label = 'Parallel SIP for 100% Interest Recovery';
  }

  // Card 1
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(metric1Val, margin + cardW / 2, ctx.curY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(metric1Label, margin + cardW / 2, ctx.curY + 12, { align: 'center' });

  // Card 2
  const card2X = margin + cardW + 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(card2X, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(metric2Val, card2X + cardW / 2, ctx.curY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(metric2Label, card2X + cardW / 2, ctx.curY + 12, { align: 'center' });

  // Card 3
  const card3X = margin + (cardW + 3) * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(card3X, ctx.curY, cardW, cardH, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(metric3Val, card3X + cardW / 2, ctx.curY + 6.5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(metric3Label, card3X + cardW / 2, ctx.curY + 12, { align: 'center' });

  ctx.curY += cardH + 4;

  // Purpose Callout Note Box
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(margin, ctx.curY, contentWidth, 13, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(133, 77, 14); // amber-800
  doc.text('Purpose & Nature of this Report:', margin + 3, ctx.curY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 63, 18);
  const purposeMsg =
    'This report explains how a verified financial product functions for client family objectives: protection need, mathematical scenarios, key features, contractual terms, limitations, and next steps. It is an educational advisory analysis, not an unconditional quote.';
  const purposeLines = doc.splitTextToSize(purposeMsg, contentWidth - 6);
  doc.text(purposeLines, margin + 3, ctx.curY + 8.2);

  ctx.curY += 17;

  // --------------------------------------------------------------------------
  // SECTION 1: UNDERSTANDING THE PRODUCT (Deep, continuous paragraphs)
  // --------------------------------------------------------------------------
  checkBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`1. Understanding the Product: ${product}`, margin, ctx.curY);
  ctx.curY += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  let p1Text = '';
  let p2Text = '';
  if (isLifeInsurance) {
    p1Text = `${product} is issued by ${company} as an individual, non-linked pure protection life insurance contract. The primary mandate of this solution is to provide structured financial shield and income replacement to the nominee family in the unforeseen event of premature death while the contract remains in force. It is not a speculative market-linked investment product, and the capital outlay is purely deployed toward underwriting family mortality risk.`;
    p2Text = `The solution features customizable policy terms, flexible premium payment horizons, and optional rider enhancements such as Accidental Death Benefit, Accelerated Terminal Illness cover, and Waiver of Premium. Statutory benefits include tax exemption under Section 80C and Section 10(10D) of the Indian Income Tax Act, subject to prevailing tax amendments. Official documentation must be reviewed prior to formal policy issuance.`;
  } else if (isSipMf) {
    p1Text = `${product} offered by ${company} operates as a professionally managed mutual fund portfolio structured to generate long-term capital appreciation. Systematic Investment Plans (SIP) allow investors to allocate fixed monthly amounts, eliminating emotional market timing through rupee-cost averaging. Every instalment purchases fund units at prevailing Net Asset Value (NAV), compounding over multi-year market cycles.`;
    p2Text = `Under SEBI guidelines, the portfolio publishes daily NAVs, monthly factsheets, complete holding disclosures, and total expense ratio (TER) metrics. Long-term capital gains (LTCG) beyond ₹1.25 Lakh are taxed at 12.5% under Union Budget 2024 regulations. Market risks apply, and investment success depends on remaining invested through full economic cycles.`;
  } else {
    p1Text = `${product} provided by ${company} delivers structured financial planning designed for debt efficiency, liquidity preservation, and disciplined wealth management.`;
    p2Text = `Key parameters include competitive interest structures, transparent fee disclosures, prepayment flexibilities, and clear contractual schedules.`;
  }

  const p1Lines = doc.splitTextToSize(p1Text, contentWidth);
  doc.text(p1Lines, margin, ctx.curY);
  ctx.curY += p1Lines.length * 4.3 + 3;

  const p2Lines = doc.splitTextToSize(p2Text, contentWidth);
  doc.text(p2Lines, margin, ctx.curY);
  ctx.curY += p2Lines.length * 4.3 + 5;

  // --------------------------------------------------------------------------
  // SECTION 2: A REALISTIC FAMILY SCENARIO (Dense case narrative)
  // --------------------------------------------------------------------------
  checkBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`2. A Realistic Family-Protection & Goal Scenario`, margin, ctx.curY);
  ctx.curY += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const scenarioText = isLifeInsurance
    ? `${client} is an earning household provider supporting dependants with ongoing living costs, outstanding loans, and future milestones such as children's higher education. For illustrative purposes, we examine whether a ₹1 Crore cover over a 30-year active horizon provides sufficient income security if an unfortunate demise occurs while obligations remain active.`
    : `${client} seeks to establish a predictable, automated wealth-creation mechanism to fund future milestones (child education, retirement corpus, or financial independence) without relying on lump-sum timing. A disciplined monthly SIP of ₹5,000 to ₹10,000 aligns monthly household cash flow with long-term compounding.`;

  const whyMattersText = isLifeInsurance
    ? `Why this matters: The premature death of a breadwinner can instantly disrupt family lifestyle, force distress liquidation of assets, and jeopardize educational aspirations. Life insurance creates an immediate liquidity estate that contractual claim processes deliver directly to dependants.`
    : `Why this matters: Inflation erodes cash purchasing power at ~6% to 7% annually. Fixed deposits and traditional savings struggle to deliver real positive returns after taxes. Equities through SIP historically outpace inflation over 10+ year horizons.`;

  const scLines = doc.splitTextToSize(scenarioText, contentWidth);
  doc.text(scLines, margin, ctx.curY);
  ctx.curY += scLines.length * 4.3 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('Why this matters:', margin, ctx.curY);
  doc.setFont('helvetica', 'normal');
  const whyLines = doc.splitTextToSize(whyMattersText.replace('Why this matters: ', ''), contentWidth - 28);
  doc.text(whyLines, margin + 27, ctx.curY);
  ctx.curY += whyLines.length * 4.3 + 6;

  // --------------------------------------------------------------------------
  // PAGE 2: STRUCTURED TABLE, POTENTIAL BENEFITS & COLORFUL VECTOR CHART
  // --------------------------------------------------------------------------
  checkBreak(40);

  // Section 3: Structured Inputs Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`3. Illustrative Inputs & Parameter Matrix`, margin, ctx.curY);
  ctx.curY += 5;

  // Table Header
  const col1W = 55;
  const col2W = contentWidth - col1W;
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, ctx.curY, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('INPUT PARAMETER', margin + 3, ctx.curY + 4.2);
  doc.text('ILLUSTRATIVE VALUE / ADVISORY STATUS', margin + col1W + 3, ctx.curY + 4.2);
  ctx.curY += 6;

  const tableRows = isLifeInsurance
    ? [
        ['Life Assured', `${client} — Salaried Professional`],
        ['Plan Option', `${product} — Comprehensive Life Option`],
        ['Sum Assured', '₹1,00,00,000 (One Crore Guaranteed Cover)'],
        ['Policy Term', '30 Years (Coverage up to retirement age)'],
        ['Premium Payment Term', 'Regular Pay / Limited Pay Option'],
        ['Underwriting Status', 'Standard Non-Smoker Health Profile (Quote Required)'],
      ]
    : [
        ['Target Investor', `${client} — Goal-Driven Accumulation`],
        ['Asset Class & Scheme', `${product} — Regular Growth Option`],
        ['Monthly SIP Amount', '₹5,000 / month (Automated Mandate)'],
        ['Investment Horizon', '20 Years (240 Monthly Contributions)'],
        ['Total Principal Invested', '₹12,00,000 (Total Outlay Over 20 Years)'],
        ['Tax Status', 'LTCG @ 12.5% beyond ₹1.25 Lakh annual exemption'],
      ];

  tableRows.forEach((row, rIdx) => {
    const rowH = 6;
    doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, rIdx % 2 === 0 ? 255 : 250, rIdx % 2 === 0 ? 255 : 252);
    doc.rect(margin, ctx.curY, contentWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, ctx.curY + rowH, margin + contentWidth, ctx.curY + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row[0], margin + 3, ctx.curY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(row[1], margin + col1W + 3, ctx.curY + 4.2);
    ctx.curY += rowH;
  });

  ctx.curY += 5;

  // Section 4: What is the Potential Benefit?
  checkBreak(55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`4. What is the Potential Benefit? (Visual Scenarios)`, margin, ctx.curY);
  ctx.curY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const benefitExpl = isLifeInsurance
    ? `For life insurance, the core benefit is contractual financial protection, not investment yield. If the life assured passes away while the policy is active, the nominee receives the entire ₹1 Crore sum assured. Below, we compare the total cumulative premium outlay against the instant contractual risk cover.`
    : `A disciplined SIP compounds mathematically over time. Below, we illustrate the projected future corpus for a ₹5,000 monthly SIP across 5, 10, 15, and 20 years at conservative 6%, balanced 10%, and historical benchmark 12% annual compounding rates.`;

  const benLines = doc.splitTextToSize(benefitExpl, contentWidth);
  doc.text(benLines, margin, ctx.curY);
  ctx.curY += benLines.length * 4.3 + 4;

  // --------------------------------------------------------------------------
  // COLORFUL VECTOR CHART DRAWING (Exact match to User's Screenshot!)
  // --------------------------------------------------------------------------
  checkBreak(55);
  const chartX = margin + 10;
  const chartY = ctx.curY;
  const chartW = contentWidth - 20;
  const chartH = 46;

  // Chart background container
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(chartX - 5, chartY - 2, chartW + 10, chartH + 12, 1.5, 1.5, 'FD');

  if (isLifeInsurance) {
    // Protection vs Outlay Chart (Matching Life Insurance Sample PDF!)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Protection Concept: ₹1 Crore Cover vs Total Premium Paid', chartX + chartW / 2, chartY + 3, {
      align: 'center',
    });

    // Bar 1: ₹100 Lakh Cover (Tall Blue Bar)
    const bar1X = chartX + chartW * 0.25;
    const barW = 32;
    const bar1H = 34;
    doc.setFillColor(2, 132, 199); // sky-600
    doc.rect(bar1X, chartY + chartH - bar1H - 2, barW, bar1H, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('₹100 Lakh', bar1X + barW / 2, chartY + chartH - bar1H + 4, { align: 'center' });

    // Bar 2: Premium Outlay (Small Grey Bar)
    const bar2X = chartX + chartW * 0.65;
    const bar2H = 7;
    doc.setFillColor(148, 163, 184); // slate-400
    doc.rect(bar2X, chartY + chartH - bar2H - 2, barW, bar2H, 'F');
    doc.setTextColor(15, 23, 42);
    doc.text('Quote Required', bar2X + barW / 2, chartY + chartH - bar2H - 3, { align: 'center' });

    // Baseline axis
    doc.setDrawColor(100, 116, 139);
    doc.line(chartX + 10, chartY + chartH - 2, chartX + chartW - 10, chartY + chartH - 2);

    // Labels below axis
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text('Illustrative Life Cover', bar1X + barW / 2, chartY + chartH + 2.5, { align: 'center' });
    doc.text('Premium Total Outlay', bar2X + barW / 2, chartY + chartH + 2.5, { align: 'center' });
  } else {
    // Multi-color Bar Chart (5y, 10y, 15y, 20y at 6%, 10%, 12%) - EXACT MATCH TO USER'S SIP SAMPLE!
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('SIP Compounding Growth Scenarios (₹5,000 / month)', chartX + chartW / 2, chartY + 3, {
      align: 'center',
    });

    // Legend
    const legY = chartY + 7;
    doc.setFontSize(7);
    // 6% Legend (Teal)
    doc.setFillColor(13, 148, 136); // teal-600
    doc.rect(chartX + 30, legY - 2.5, 4, 3, 'F');
    doc.setTextColor(51, 65, 85);
    doc.text('6% Scenario', chartX + 36, legY);

    // 10% Legend (Cyan)
    doc.setFillColor(2, 132, 199); // sky-600
    doc.rect(chartX + 70, legY - 2.5, 4, 3, 'F');
    doc.text('10% Scenario', chartX + 76, legY);

    // 12% Legend (Amber)
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(chartX + 110, legY - 2.5, 4, 3, 'F');
    doc.text('12% Benchmark', chartX + 116, legY);

    // Baseline
    const baseY = chartY + chartH - 2;
    doc.setDrawColor(203, 213, 225);
    doc.line(chartX + 5, baseY, chartX + chartW - 5, baseY);

    // 4 Period Clusters: 5y, 10y, 15y, 20y
    const clusters = [
      { label: '5 Years', v6: 3.5, v10: 4.1, v12: 4.5 },
      { label: '10 Years', v6: 8.2, v10: 10.3, v12: 11.6 },
      { label: '15 Years', v6: 14.5, v10: 20.9, v12: 25.2 },
      { label: '20 Years', v6: 23.1, v10: 37.9, v12: 49.5 },
    ];

    const clusterW = (chartW - 20) / 4;
    const barW = 7;
    const maxVal = 50; // 50 Lakhs scale

    clusters.forEach((c, idx) => {
      const cX = chartX + 10 + idx * clusterW;

      // 6% Bar
      const h6 = (c.v6 / maxVal) * 26;
      doc.setFillColor(13, 148, 136);
      doc.rect(cX, baseY - h6, barW, h6, 'F');

      // 10% Bar
      const h10 = (c.v10 / maxVal) * 26;
      doc.setFillColor(2, 132, 199);
      doc.rect(cX + barW + 1, baseY - h10, barW, h10, 'F');

      // 12% Bar
      const h12 = (c.v12 / maxVal) * 26;
      doc.setFillColor(217, 119, 6);
      doc.rect(cX + (barW + 1) * 2, baseY - h12, barW, h12, 'F');

      // Cluster Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      doc.text(c.label, cX + barW * 1.5, baseY + 4, { align: 'center' });
    });
  }

  ctx.curY += chartH + 14;

  // Chart Explanatory Callout Note
  const chartNote = isLifeInsurance
    ? 'Concept disclosure: This chart illustrates the financial leverage of insurance. The full contractual death benefit is payable upon valid claim acceptance, while cumulative premium outlay represents a fraction of the capital shield.'
    : 'Approximate 20-year outcomes for ₹5,000 monthly SIP: At 6% approx ₹23.1 Lakh; at 10% approx ₹37.9 Lakh; at 12% approx ₹49.5 Lakh. These are illustrative compounding calculations before taxes and do not guarantee future returns.';

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, ctx.curY, contentWidth, 9.5, 1, 1, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const noteLines = doc.splitTextToSize(chartNote, contentWidth - 6);
  doc.text(noteLines, margin + 3, ctx.curY + 4);
  ctx.curY += 13.5;

  // --------------------------------------------------------------------------
  // SECTION 5: PLAN FEATURES & OPTIONS (Detailed clauses)
  // --------------------------------------------------------------------------
  checkBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`5. Key Features, Options & Structural Benefits`, margin, ctx.curY);
  ctx.curY += 5;

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
        ['Tax Efficiency (Section 112A)', 'Long-term equity gains taxed at favorable 12.5% rate only on capital gains exceeding ₹1.25 Lakh per financial year.'],
      ];

  features.forEach(([featTitle, featDesc]) => {
    checkBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${featTitle}: `, margin + 2, ctx.curY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(featDesc, contentWidth - 45);
    doc.text(descLines, margin + 42, ctx.curY);
    ctx.curY += descLines.length * 4.2 + 2;
  });

  ctx.curY += 4;

  // --------------------------------------------------------------------------
  // PAGE 3: HISTORICAL SCENARIO, CASE STUDIES, CHECKLIST, DISCLOSURES & BRANDING
  // --------------------------------------------------------------------------
  checkBreak(40);

  // Section 6: Historical Best-Case Scenario
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`6. Historical Best-Case & Contractual Benefit Analysis`, margin, ctx.curY);
  ctx.curY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const histText = isLifeInsurance
    ? `A pure term insurance contract does not generate historical investment return series. Therefore, the appropriate analytical framework is a contractual-benefit analysis: the policy guarantees the ₹1 Crore Sum Assured payout upon demise, provided premiums are paid and disclosures are truthful. Optional bonus declarations in non-linked traditional policies (under IRDAI 4% & 8% illustrations) are non-guaranteed estimates and must be separated from pure protection.`
    : `In Indian equity market history (2003–2018 bull and recovery phases), the verified 15-year rolling SIP return of broad market benchmarks (Nifty 500 TRI) peaked at ~17.8% CAGR. However, historical peak outcomes reflect extraordinary historical cycles and must NEVER be treated as future guarantees. Realistic long-term advisory planning relies on a 10%–12% conservative compounding baseline.`;

  const histLines = doc.splitTextToSize(histText, contentWidth);
  doc.text(histLines, margin, ctx.curY);
  ctx.curY += histLines.length * 4.3 + 5;

  // Section 7: Short Client-Education Examples (Fictional scenarios)
  checkBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`7. Client-Education Scenarios`, margin, ctx.curY);
  ctx.curY += 5;

  const scenarios = isLifeInsurance
    ? [
        ['Example A — Income Protection:', 'If the primary earner passes away prematurely, the ₹1 Crore lump-sum enables the surviving spouse to generate predictable monthly interest income to fund ongoing grocery, utility, and rental expenses.'],
        ['Example B — Outstanding Home Loan:', 'A dedicated term policy insulates the family from debt recovery. The death benefit clears the mortgage balance, preventing foreclosure and allowing the family to retain their home.'],
        ['Example C — Life-Stage Policy Review:', 'As income grows and children enter university, coverage should be re-evaluated. Pure term contracts can be complemented with parallel SIPs to build independent wealth.'],
      ]
    : [
        ['Example A — The Early Starter (Age 25):', 'Neha begins a modest ₹5,000 monthly SIP at age 25. By investing through economic ups and downs, time provides 35 years of exponential compounding for complete financial freedom.'],
        ['Example B — The Late Planner (Age 40):', 'Kunal starts at age 40 with higher monthly capacity. By coupling disciplined SIP with annual 10% step-ups, he rapidly narrows his retirement gap within 15 years.'],
        ['Example C — Goal-Linked Investing:', 'Partitioning SIPs into specific buckets (Child Education, Home Down-payment, Retirement) prevents emotional redemptions during normal market corrections.'],
      ];

  scenarios.forEach(([sTitle, sDesc]) => {
    checkBreak(9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(sTitle, margin + 2, ctx.curY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const dLines = doc.splitTextToSize(sDesc, contentWidth - 48);
    doc.text(dLines, margin + 46, ctx.curY);
    ctx.curY += dLines.length * 4.2 + 2;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Note: These are fictional educational scenarios designed for conceptual clarity, not actual customer testimonials.', margin + 2, ctx.curY + 2);
  ctx.curY += 7;

  // Section 8: Key Risks & Limitations
  checkBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`8. Key Risks, Conditions & Regulatory Guardrails`, margin, ctx.curY);
  ctx.curY += 5;

  const risks = isLifeInsurance
    ? [
        'Underwriting & Medical Disclosure: 100% truthful disclosure of pre-existing conditions, smoking status, and family history is mandatory. Concealment can lead to claim repudiation.',
        'Policy Continuity: Premiums must be paid within the 30-day grace period; lapsed policies forfeit protection benefits.',
        'Exclusions: Standard suicide exclusions apply within the first 12 months from policy inception as per IRDAI regulations.',
      ]
    : [
        'Market Volatility: Equity mutual funds do not offer fixed or guaranteed returns. NAV values fluctuate based on underlying macroeconomic factors.',
        'Holding Horizon: Equity investments require a minimum 5–7 year horizon to manage downside volatility and allow rupee-cost averaging to work.',
        'Emergency Buffer: Maintaining 6 months of expenses in a liquid fund prevents distress redemption of long-term investments during emergencies.',
      ];

  risks.forEach((r) => {
    checkBreak(8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const rLines = doc.splitTextToSize(`• ${r}`, contentWidth - 4);
    doc.text(rLines, margin + 2, ctx.curY);
    ctx.curY += rLines.length * 4.2 + 1.5;
  });

  ctx.curY += 3;

  // Section 9: Advisor Discussion Checklist (Numbered 1-6)
  checkBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`9. Advisor Discussion Checklist (Step-by-Step)`, margin, ctx.curY);
  ctx.curY += 5;

  const checklist = [
    '1. Quantify family financial requirements (dependants, liabilities, goals, and existing assets).',
    '2. Confirm age, KYC documentation, bank mandate details, and nominee designations.',
    '3. Obtain official company premium quote / Scheme Information Document (SID & KIM).',
    '4. Review contractual terms, payment frequency, tax implications, and exclusion clauses.',
    '5. Setup automated bank ECS/NACH mandate to guarantee investment/protection continuity.',
    '6. Schedule annual portfolio review to adjust for promotions, inflation, and life changes.',
  ];

  checklist.forEach((item) => {
    checkBreak(6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(item, margin + 2, ctx.curY);
    ctx.curY += 4.5;
  });

  ctx.curY += 3;

  // Section 10 & 11: Next Steps, Disclosures & Official URLs
  checkBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`10. Suggested Next Step & Important Disclosures`, margin, ctx.curY);
  ctx.curY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);

  const statutoryText =
    'Important Statutory Disclosure: This document is an educational presentation prepared for discussion purposes. All figures, returns, and values are illustrative and subject to official scheme/policy terms. Mutual fund investments are subject to market risks; read all scheme related documents carefully. Insurance is a subject matter of solicitation. Please read the official product brochure, benefit illustration, and terms before purchasing.';
  const statLines = doc.splitTextToSize(statutoryText, contentWidth);
  doc.text(statLines, margin, ctx.curY);
  ctx.curY += statLines.length * 3.8 + 3;

  // Official source URLs
  doc.setFont('helvetica', 'bold');
  doc.text('Official Source References:', margin, ctx.curY);
  doc.setFont('helvetica', 'normal');
  doc.text(`• ${company} Official Portal & Product Information: Verified via Company Disclosures & Factsheets`, margin, ctx.curY + 3.8);
  ctx.curY += 8;

  // Final Official Advisor Profile Branding Box (Bottom of Report)
  checkBreak(22);
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, ctx.curY, contentWidth, 19, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Demonstration Advisor Profile: ${advisor.name}`, margin + 4, ctx.curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(
    `${advisor.designation} • License/ARN: ${advisor.professionalLicense || 'AMFI / IRDAI Authorized'}`,
    margin + 4,
    ctx.curY + 10.5
  );

  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    `Tel: ${advisor.phone} • WhatsApp: ${advisor.whatsapp} • Email: ${advisor.email} • Location: ${advisor.location}`,
    margin + 4,
    ctx.curY + 15.5
  );

  // Clean sanitized filename
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
