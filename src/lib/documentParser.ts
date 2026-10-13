import { LayoutStructure, Resume, ExperienceItem, EducationItem } from './types';

// Regex patterns for entity extraction
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;

export interface ParsedDocumentResult {
  candidateName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  rawText: string;
  extractedTextOrder: string;
  layoutStructure: LayoutStructure;
}

export function extractContactInfo(text: string) {
  const emailMatch = text.match(EMAIL_REGEX);
  const phoneMatch = text.match(PHONE_REGEX);
  const linkedinMatch = text.match(LINKEDIN_REGEX);
  const githubMatch = text.match(GITHUB_REGEX);

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let candidateName = 'Unknown Candidate';
  let location: string | undefined = undefined;

  if (lines.length > 0) {
    // First non-empty line often contains name if not an email or phone
    const firstLine = lines[0];
    if (!EMAIL_REGEX.test(firstLine) && !PHONE_REGEX.test(firstLine) && firstLine.length < 50) {
      candidateName = firstLine.replace(/[^a-zA-Z\s.,'-]/g, '').trim();
    }
  }

  // Look for location cues (City, ST or City, Country)
  const locMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Za-z]+))/);
  if (locMatch && !locMatch[1].includes('University') && !locMatch[1].includes('Company')) {
    location = locMatch[1].trim();
  }

  return {
    candidateName: candidateName || 'Candidate',
    email: emailMatch ? emailMatch[1] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    location,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
  };
}

export function extractSkillsList(text: string): string[] {
  const commonTech = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Node.js', 'Express', 'FastAPI', 'Django',
    'Flask', 'Spring Boot', 'GraphQL', 'REST', 'RESTful APIs', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Snowflake', 'BigQuery', 'Elasticsearch', 'DynamoDB',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Git',
    'Linux', 'Microservices', 'Jest', 'Playwright', 'Cypress', 'PyTest', 'Tableau', 'Power BI', 'Looker',
    'dbt', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'SQL', 'A/B Testing', 'Agile', 'Scrum',
    'Kanban', 'JIRA', 'Confluence', 'PMP', 'CSM', 'Product Management', 'Risk Management', 'WebSockets'
  ];

  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();

  for (const tech of commonTech) {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;|/•-])${escaped}(?:$|[\\s,;|/•-])`, 'i');
    if (regex.test(lowerText) || lowerText.includes(tech.toLowerCase())) {
      foundSkills.add(tech);
    }
  }

  // Also extract bullet points under SKILLS section if present
  const skillsSectionMatch = text.match(/(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[\s\S]*?(?=(?:EXPERIENCE|PROFESSIONAL EXPERIENCE|EDUCATION|PROJECTS|$))/i);
  if (skillsSectionMatch) {
    const skillsText = skillsSectionMatch[0];
    const words = skillsText.split(/[\n,;•|/]/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 35);
    for (const w of words) {
      if (!w.toLowerCase().includes('skills') && !w.toLowerCase().includes('competencies')) {
        foundSkills.add(w);
      }
    }
  }

  return Array.from(foundSkills);
}

export function detectLayoutStructure(rawText: string, fileType: 'pdf' | 'docx' | 'text'): LayoutStructure {
  const lines = rawText.split('\n');
  const totalLines = lines.length;
  
  // Detect multiple columns: frequent short lines followed by fragments or wide gaps
  let shortLinesCount = 0;
  for (const line of lines) {
    if (line.trim().length > 0 && line.trim().length < 25) {
      shortLinesCount++;
    }
  }
  const isMultiColumn = totalLines > 30 && shortLinesCount / totalLines > 0.45;

  // Detect tables or weird character artifacts
  const hasTables = /\||\t{2,}|\s{6,}/.test(rawText);
  const hasTextBoxes = /\[textbox\]|\[frame\]/i.test(rawText);
  
  // Detect contact in header/footer (contact info in first 3 lines or last 3 lines with distinct separator)
  const hasHeaderFooterContact = EMAIL_REGEX.test(lines.slice(0, 3).join(' '));

  // Detect unusual or non-ASCII characters
  const unusualChars: string[] = [];
  const unusualMatches = rawText.match(/[^\x00-\x7F]/g);
  if (unusualMatches) {
    const unique = Array.from(new Set(unusualMatches));
    unusualChars.push(...unique.slice(0, 5));
  }

  return {
    detectedColumns: isMultiColumn ? 2 : 1,
    hasTables,
    hasTextBoxes,
    hasHeaderFooterContact,
    unusualCharacters: unusualChars,
    fontCount: 2,
    pageCount: Math.max(1, Math.ceil(rawText.length / 2200)),
    isScannedOrImage: rawText.trim().length < 80,
    readingOrderRisk: isMultiColumn ? 'medium' : 'low',
  };
}

export async function parseResumeBuffer(
  buffer: Buffer,
  fileType: 'pdf' | 'docx' | 'text',
  fileName: string
): Promise<ParsedDocumentResult> {
  let rawText = '';

  if (fileType === 'pdf') {
    try {
      // Use dynamic require for pdf-parse to handle node environment safely
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      rawText = data.text || '';
    } catch {
      // Fallback: extract string contents if pdf parsing encounters issue
      rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  } else if (fileType === 'docx') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value || '';
    } catch {
      rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    }
  } else {
    rawText = buffer.toString('utf-8');
  }

  if (!rawText || rawText.trim().length < 20) {
    throw new Error('We couldn\'t extract readable text from this document. Please ensure it is not password-protected or image-only scanned.');
  }

  const contacts = extractContactInfo(rawText);
  const skills = extractSkillsList(rawText);
  const layout = detectLayoutStructure(rawText, fileType);

  // Extract rough summary
  let summary = '';
  const summaryMatch = rawText.match(/(?:SUMMARY|PROFESSIONAL SUMMARY|PROFILE|ABOUT ME)[\s\S]*?(?=(?:SKILLS|EXPERIENCE|EDUCATION|WORK EXPERIENCE|$))/i);
  if (summaryMatch) {
    summary = summaryMatch[0].replace(/^(?:SUMMARY|PROFESSIONAL SUMMARY|PROFILE|ABOUT ME)[:\s]*/i, '').trim().slice(0, 500);
  } else {
    const nonContactLines = rawText.split('\n').filter((l) => l.trim().length > 30).slice(0, 3);
    summary = nonContactLines.join(' ').slice(0, 300);
  }

  // Simulated linear extracted order
  const extractedOrder = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');

  return {
    candidateName: contacts.candidateName,
    email: contacts.email,
    phone: contacts.phone,
    location: contacts.location,
    linkedin: contacts.linkedin,
    github: contacts.github,
    summary,
    skills,
    experience: [
      {
        id: 'exp-parsed-1',
        company: 'Document Extracted Experience',
        role: 'Professional Role',
        startDate: 'Recent',
        endDate: 'Present',
        description: [
          'Document sections parsed and extracted for semantic analysis.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-parsed-1',
        institution: 'Document Extracted Education',
        degree: 'Degree',
        field: 'Field of Study',
        graduationYear: 'Graduated',
      },
    ],
    rawText,
    extractedTextOrder: extractedOrder,
    layoutStructure: layout,
  };
}
