import { ATSResult, ATSFinding, LayoutCheckItem, LayoutStructure } from './types';

export function runATSInspection(
  rawText: string,
  layout: LayoutStructure,
  candidateName: string,
  email?: string,
  phone?: string
): ATSResult {
  const findings: ATSFinding[] = [];
  const layoutChecks: LayoutCheckItem[] = [];

  let deductions = 0;

  // 1. Text extraction & unreadability check
  if (rawText.trim().length < 100 || layout.isScannedOrImage) {
    deductions += 40;
    findings.push({
      id: 'ats-ocr-unreadable',
      title: 'Scanned Image or Low Selectable Text Detected',
      severity: 'critical',
      evidence: `Extracted only ${rawText.trim().length} characters from the document.`,
      whyItMatters:
        'Standard ATS parsers cannot read rasterized images or non-selectable scanned PDFs without OCR, resulting in blank candidate profiles.',
      recommendedFix:
        'Generate the PDF directly from Microsoft Word, Google Docs, or LaTeX using "Save as PDF" rather than scanning physical paper.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Selectable Text Verification',
      status: 'failed',
      details: 'Document appears to be image-based or has minimal selectable text.',
    });
  } else {
    findings.push({
      id: 'ats-text-extract-pass',
      title: 'Clean Selectable Text Extracted',
      severity: 'passed',
      evidence: `${rawText.split(/\s+/).length} words recovered in linear sequence.`,
      whyItMatters: 'Applicant tracking systems can ingest all text without skipping essential credentials.',
      recommendedFix: 'No changes needed.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Selectable Text Verification',
      status: 'passed',
      details: 'Full document text is selectable and machine-readable.',
    });
  }

  // 2. Multi-column layout check
  if (layout.detectedColumns > 1 || layout.readingOrderRisk === 'high' || layout.readingOrderRisk === 'medium') {
    deductions += 15;
    findings.push({
      id: 'ats-multi-column',
      title: 'Multi-Column Layout Detected',
      severity: 'medium',
      evidence: `${layout.detectedColumns}-column structure detected with potential horizontal parsing order risk.`,
      whyItMatters:
        'Legacy ATS parsers (e.g. older versions of Taleo or Workday) read horizontally across pages, occasionally merging job titles in column A with skills in column B.',
      recommendedFix:
        'Consider adopting a single-column linear layout to guarantee uniform reading order across all recruitment software.',
      confidence: 'probable',
    });
    layoutChecks.push({
      name: 'Multi-Column Reading Order',
      status: 'warning',
      details: 'Multi-column elements may cause text streams to interleave during parsing.',
    });
  } else {
    findings.push({
      id: 'ats-single-column-pass',
      title: 'Single-Column Layout Verified',
      severity: 'passed',
      evidence: 'Single vertical content flow identified.',
      whyItMatters: 'Guarantees reliable chronological ingestion without column jumping bugs.',
      recommendedFix: 'Retain single column structure.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Multi-Column Reading Order',
      status: 'passed',
      details: 'Single-column structure ensures optimal top-to-bottom reading.',
    });
  }

  // 3. Contact information extraction
  if (!email || !phone) {
    deductions += 20;
    findings.push({
      id: 'ats-missing-contact',
      title: 'Essential Contact Details Incompletely Extracted',
      severity: 'high',
      evidence: `Email: ${email || 'Not Found'}, Phone: ${phone || 'Not Found'}.`,
      whyItMatters:
        'Recruiters search candidate databases by contact details. If email or phone are placed inside graphical text boxes or raster margins, they may not populate the candidate record.',
      recommendedFix:
        'Place your email address and phone number in the top body text, outside of isolated header/footer margin bands.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Contact Information Parsing',
      status: 'failed',
      details: 'One or more essential contact fields could not be extracted with certainty.',
    });
  } else {
    findings.push({
      id: 'ats-contact-pass',
      title: 'Contact Information Parsed Successfully',
      severity: 'passed',
      evidence: `Extracted candidate name (${candidateName}), email (${email}), and phone (${phone}).`,
      whyItMatters: 'Recruiter ATS will automatically populate your candidate profile without manual data entry.',
      recommendedFix: 'Contact data structure is well configured.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Contact Information Parsing',
      status: 'passed',
      details: 'Name, email, and phone successfully linked to profile.',
    });
  }

  // 4. Tables and Text Boxes Check
  if (layout.hasTables || layout.hasTextBoxes) {
    deductions += 10;
    findings.push({
      id: 'ats-tables-detected',
      title: 'Tables or Graphical Frames Detected',
      severity: 'medium',
      evidence: 'Tabular structures or frame elements identified in the document layout.',
      whyItMatters:
        'Some parsers strip table borders and read cell contents in unpredictable sequences, or drop floating frames entirely.',
      recommendedFix:
        'Replace table-based skill grids with bullet points, comma-separated lists, or bold subheadings.',
      confidence: 'probable',
    });
    layoutChecks.push({
      name: 'Tables & Floating Text Boxes',
      status: 'warning',
      details: 'Tables or frame boundaries found. Simple bullet lists are safer for parsing.',
    });
  } else {
    findings.push({
      id: 'ats-tables-clean',
      title: 'No Problematic Tables or Frames',
      severity: 'passed',
      evidence: 'Clean text paragraphs and bullet structures throughout.',
      whyItMatters: 'Zero risk of dropped cell contents or broken grid borders.',
      recommendedFix: 'Continue using simple bulleted lists.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Tables & Floating Text Boxes',
      status: 'passed',
      details: 'No floating frames or nested table grids detected.',
    });
  }

  // 5. Section headings check
  const standardHeadings = ['summary', 'experience', 'education', 'skills'];
  const lowerText = rawText.toLowerCase();
  const missingHeadings: string[] = [];

  for (const h of standardHeadings) {
    if (!lowerText.includes(h)) {
      missingHeadings.push(h.toUpperCase());
    }
  }

  if (missingHeadings.length > 0) {
    deductions += 10;
    findings.push({
      id: 'ats-nonstandard-headings',
      title: 'Non-Standard Section Headings',
      severity: 'low',
      evidence: `Could not identify explicit sections for: ${missingHeadings.join(', ')}.`,
      whyItMatters:
        'Applicant tracking systems use keyword patterns like "WORK EXPERIENCE" or "EDUCATION" to categorize dates and job titles.',
      recommendedFix:
        `Rename creative headings to standard titles (e.g. use "WORK EXPERIENCE" instead of "MY JOURNEY").`,
      confidence: 'probable',
    });
    layoutChecks.push({
      name: 'Section Heading Recognition',
      status: 'warning',
      details: `Missing common section titles: ${missingHeadings.join(', ')}.`,
    });
  } else {
    findings.push({
      id: 'ats-headings-pass',
      title: 'Standard Section Headings Recognized',
      severity: 'passed',
      evidence: 'Recognized: SUMMARY, WORK EXPERIENCE, EDUCATION, and SKILLS.',
      whyItMatters: 'Enables automatic section mapping in Workday, Greenhouse, Taleo, and Lever.',
      recommendedFix: 'Maintain standard headings.',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Section Heading Recognition',
      status: 'passed',
      details: 'Standard headings detected and mapped to appropriate resume schema.',
    });
  }

  // 6. Character encoding / unusual glyphs
  if (layout.unusualCharacters.length > 0) {
    deductions += 5;
    findings.push({
      id: 'ats-unusual-chars',
      title: 'Special Symbols or Custom Glyphs Detected',
      severity: 'low',
      evidence: `Found unusual glyphs: ${layout.unusualCharacters.join(' ')}`,
      whyItMatters:
        'Non-standard bullets (e.g. customized arrows, stars, or emojis) can decode as corrupt boxes (e.g. ? or □).',
      recommendedFix: 'Use standard round bullets (•) or hyphens (-).',
      confidence: 'verified',
    });
    layoutChecks.push({
      name: 'Character Encoding & Bullets',
      status: 'warning',
      details: 'Unusual glyphs found that may decode as corrupt characters.',
    });
  } else {
    layoutChecks.push({
      name: 'Character Encoding & Bullets',
      status: 'passed',
      details: 'Standard UTF-8 character encoding and clean bullet typography.',
    });
  }

  const score = Math.max(20, Math.min(100, 100 - deductions));
  const status = score >= 85 ? 'pass' : score >= 70 ? 'warning' : 'critical';

  return {
    score,
    status,
    findings,
    textExtractionPreview: {
      originalPreview: rawText.slice(0, 400) + '...',
      extractedOrder: rawText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n')
        .slice(0, 500) + '...',
      extractedWordCount: rawText.split(/\s+/).filter(Boolean).length,
    },
    layoutChecks,
    suggestedHeadings: [
      'Professional Summary',
      'Core Technical Skills',
      'Professional Experience',
      'Education & Credentials',
      'Relevant Projects',
    ],
    singleColumnGuidance:
      'To achieve 95%+ ATS compatibility: Use a single-column layout, standard margins (0.5 to 1 inch), standard Arial/Calibri/Helvetica fonts (10-12pt), and avoid tables, text boxes, and icons.',
  };
}
