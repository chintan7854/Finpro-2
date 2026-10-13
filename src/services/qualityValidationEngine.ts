import { ClientPresentation } from '../types/presentationStudio';

export type QualitySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface QualityValidationIssue {
  id: string;
  severity: QualitySeverity;
  category:
    | 'product_identity'
    | 'data_integrity'
    | 'compliance_claims'
    | 'tables_and_charts'
    | 'advisor_branding'
    | 'layout_and_whitespace';
  message: string;
  recommendation?: string;
  slideNumber?: number;
}

export interface QualityValidationReport {
  isValid: boolean;
  score: number; // 0 to 100
  canExport: boolean;
  issues: QualityValidationIssue[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

/**
 * Universal Pre-Export Quality Validator
 * Runs prior to PPTX / PDF exports to ensure report integrity and compliance
 */
export function validatePresentationQuality(presentation: ClientPresentation): QualityValidationReport {
  const issues: QualityValidationIssue[] = [];

  // 1. Product & Company Identity Checks
  if (!presentation.title || presentation.title.trim().length < 4) {
    issues.push({
      id: 'missing_title',
      severity: 'CRITICAL',
      category: 'product_identity',
      message: 'Presentation title is missing or incomplete.',
      recommendation: 'Provide a clear, specific product or strategy title.',
    });
  }

  // Check if slides are present
  if (!presentation.slides || presentation.slides.length === 0) {
    issues.push({
      id: 'no_slides',
      severity: 'CRITICAL',
      category: 'data_integrity',
      message: 'Presentation contains zero slides.',
      recommendation: 'Generate the presentation before exporting.',
    });
    return {
      isValid: false,
      score: 0,
      canExport: false,
      issues,
      criticalCount: 1,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
    };
  }

  // 2. Regulatory & Compliance Checks (Forbidden claims)
  const forbiddenPatterns = [
    { pattern: /guaranteed return/i, msg: 'Illegal guarantee: "Guaranteed return" on market-linked investments is prohibited.' },
    { pattern: /100% risk free/i, msg: 'Unsubstantiated safety claim: "100% risk free" violates SEBI/IRDAI standards.' },
    { pattern: /guaranteed claim approval/i, msg: 'Insurance claims cannot be guaranteed by an advisor.' },
    { pattern: /guaranteed loan approval/i, msg: 'Loan approval depends solely on lender underwriting.' },
  ];

  presentation.slides.forEach((slide) => {
    const textContent = `${slide.title} ${slide.subtitle} ${slide.keyTakeaway} ${slide.bulletPoints.join(' ')}`;
    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(textContent)) {
        issues.push({
          id: `forbidden_claim_s${slide.slideNumber}`,
          severity: 'CRITICAL',
          category: 'compliance_claims',
          slideNumber: slide.slideNumber,
          message: rule.msg,
          recommendation: 'Rephrase to state hypothetical assumptions or illustrative historical values.',
        });
      }
    }

    // 3. Table & Chart Completeness Check
    if (slide.comparisonTable) {
      const rows = slide.comparisonTable.rows;
      if (!rows || rows.length === 0) {
        issues.push({
          id: `empty_table_s${slide.slideNumber}`,
          severity: 'HIGH',
          category: 'tables_and_charts',
          slideNumber: slide.slideNumber,
          message: `Slide #${slide.slideNumber} has a comparison table with no rows.`,
          recommendation: 'Populate parameters or replace with bullet points.',
        });
      }
    }

    if (slide.chartData) {
      const { labels, values } = slide.chartData;
      if (!labels || !values || labels.length === 0 || values.length === 0 || labels.length !== values.length) {
        issues.push({
          id: `inconsistent_chart_s${slide.slideNumber}`,
          severity: 'HIGH',
          category: 'tables_and_charts',
          slideNumber: slide.slideNumber,
          message: `Slide #${slide.slideNumber} chartData labels and values are mismatched or empty.`,
          recommendation: 'Ensure each chart series label matches a valid numeric value.',
        });
      }
    }

    // 4. Content Density & Excessive Whitespace
    if (slide.bulletPoints.length === 0 && !slide.metrics?.length && !slide.chartData && !slide.comparisonTable) {
      issues.push({
        id: `empty_body_s${slide.slideNumber}`,
        severity: 'MEDIUM',
        category: 'layout_and_whitespace',
        slideNumber: slide.slideNumber,
        message: `Slide #${slide.slideNumber} has minimal content and may appear sparse.`,
        recommendation: 'Add key takeaways, metrics, or illustrative calculation bullets.',
      });
    }
  });

  // 5. Advisor Branding & Mandatory Disclaimers
  if (!presentation.advisorSnapshot.name) {
    issues.push({
      id: 'missing_advisor_name',
      severity: 'HIGH',
      category: 'advisor_branding',
      message: 'Advisor name is not provided in Master Profile.',
      recommendation: 'Check Master Profile settings.',
    });
  }

  if (!presentation.advisorSnapshot.disclaimer) {
    issues.push({
      id: 'missing_disclaimer',
      severity: 'HIGH',
      category: 'compliance_claims',
      message: 'Statutory compliance disclaimer is missing from presentation.',
      recommendation: 'Ensure SEBI / IRDAI disclaimer is present on footer and final slide.',
    });
  }

  const criticalCount = issues.filter((i) => i.severity === 'CRITICAL').length;
  const highCount = issues.filter((i) => i.severity === 'HIGH').length;
  const mediumCount = issues.filter((i) => i.severity === 'MEDIUM').length;
  const lowCount = issues.filter((i) => i.severity === 'LOW').length;

  // Score calculation: 100 minus penalty
  const score = Math.max(
    0,
    100 - criticalCount * 40 - highCount * 15 - mediumCount * 5 - lowCount * 2
  );

  return {
    isValid: criticalCount === 0,
    score,
    canExport: criticalCount === 0, // Block only on critical compliance/data breakage
    issues,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
  };
}
