export type UserRole = 'job_seeker' | 'recruiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isDemo?: boolean;
  avatar?: string;
  title?: string;
  company?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string[];
  technologies?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
}

export interface LayoutStructure {
  detectedColumns: number;
  hasTables: boolean;
  hasTextBoxes: boolean;
  hasHeaderFooterContact: boolean;
  unusualCharacters: string[];
  fontCount: number;
  pageCount: number;
  isScannedOrImage: boolean;
  readingOrderRisk: 'low' | 'medium' | 'high';
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
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
  fileType: 'pdf' | 'docx' | 'text';
  fileSize?: string;
  fileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company?: string;
  location?: string;
  experienceYears?: number;
  requiredSkills: string[];
  preferredSkills: string[];
  educationRequirement?: string;
  responsibilities: string[];
  rawText: string;
  createdAt: string;
}

export interface SkillMatchItem {
  skill: string;
  status: 'strong' | 'partial' | 'missing' | 'transferable';
  evidenceInResume?: string;
  requiredByJob: boolean;
  importance: 'critical' | 'preferred';
  rationale: string;
}

export interface SkillAnalysis {
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  transferableCount: number;
  skills: SkillMatchItem[];
}

export interface ExperienceAnalysis {
  relevanceScore: number; // 0 - 100
  documentedYears: number;
  requiredYears: number;
  keyAchievements: string[];
  unsupportedClaims: string[];
  missingExperienceAreas: string[];
  summary: string;
}

export interface Recommendation {
  id: string;
  category: 'skill_gap' | 'impact_metric' | 'formatting' | 'positioning' | 'clarification';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionableStep: string;
  exampleDiff?: {
    original: string;
    suggested: string;
  };
}

export interface CategoryScores {
  requiredSkills: number; // weight 35%
  workExperience: number; // weight 25%
  responsibilities: number; // weight 15%
  educationCertifications: number; // weight 10%
  projectEvidence: number; // weight 15%
}

export type ATSFindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'passed';

export interface ATSFinding {
  id: string;
  title: string;
  severity: ATSFindingSeverity;
  evidence: string;
  whyItMatters: string;
  recommendedFix: string;
  confidence: 'verified' | 'probable' | 'unable_to_verify';
}

export interface LayoutCheckItem {
  name: string;
  status: 'passed' | 'warning' | 'failed' | 'unverifiable';
  details: string;
}

export interface ATSResult {
  score: number; // 0 - 100
  status: 'pass' | 'warning' | 'critical';
  findings: ATSFinding[];
  textExtractionPreview: {
    originalPreview: string;
    extractedOrder: string;
    extractedWordCount: number;
  };
  layoutChecks: LayoutCheckItem[];
  suggestedHeadings: string[];
  singleColumnGuidance: string;
}

export interface WritingObservation {
  id: string;
  type: 'generic_buzzword' | 'vague_metric' | 'repetitive_syntax' | 'unsupported_superlative';
  severity: 'low' | 'medium' | 'high';
  flaggedText: string;
  context: string;
  reason: string;
  suggestion: string;
}

export interface PhraseOverlapItem {
  phrase: string;
  overlapType: 'exact_job_match' | 'standard_industry_term' | 'potential_overfit';
  count: number;
  relevanceExplanation: string;
}

export interface VerificationQuestion {
  id: string;
  topic: string;
  flaggedResumeStatement: string;
  recruiterQuestion: string;
  suggestedLookout: string;
}

export interface WritingInsightsResult {
  reviewScore: number; // 0 - 100 (higher = more specific, grounded writing)
  phraseOverlapScore: number; // 0 - 100 (% overlap index)
  buzzwordDensity: number; // %
  observations: WritingObservation[];
  phraseOverlapItems: PhraseOverlapItem[];
  recruiterVerificationQuestions: VerificationQuestion[];
  disclaimer: string;
}

export interface Citation {
  text: string;
  section: string;
  page?: number;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  timestamp: string;
  isUnsupportedWarning?: boolean;
}

export interface ChatSession {
  id: string;
  resumeId: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  resumeId: string;
  jobDescriptionId: string;
  resumeTitle: string;
  candidateName: string;
  targetJobTitle: string;
  targetCompany?: string;
  overallMatchScore: number; // 0 - 100
  categoryScores: CategoryScores;
  skillAnalysis: SkillAnalysis;
  experienceAnalysis: ExperienceAnalysis;
  recommendations: Recommendation[];
  atsResult: ATSResult;
  writingInsights: WritingInsightsResult;
  isDemo?: boolean;
  createdAt: string;
}

export interface CandidateComparison {
  id: string;
  jobTitle: string;
  jobDescriptionId: string;
  candidates: {
    resumeId: string;
    candidateName: string;
    overallScore: number;
    atsScore: number;
    writingScore: number;
    matchedSkillsCount: number;
    totalRequiredSkills: number;
    missingSkills: string[];
    experienceYears: number;
    verificationsCount: number;
    summaryNotes: string;
  }[];
  createdAt: string;
}
