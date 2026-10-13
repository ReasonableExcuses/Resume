import {
  Resume,
  JobDescription,
  AnalysisResult,
  ChatSession,
  ChatMessage,
  CandidateComparison,
} from './types';
import { SAMPLE_RESUMES, SAMPLE_JOBS, SAMPLE_ANALYSES } from './sampleData';
import { analyzeSkills, analyzeExperience, calculateScores, generateRecommendations } from './matchEngine';
import { runATSInspection } from './atsSimulator';
import { analyzeWritingPatterns } from './writingAnalyzer';
import { answerResumeQuestion } from './ragEngine';

const STORAGE_KEYS = {
  ANALYSES: 'sra_analyses_records',
  RESUMES: 'sra_resumes_records',
  SESSIONS: 'sra_chat_sessions',
};

// Initialize localStorage with sample data if empty
export function initClientDatabase() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.RESUMES)) {
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(SAMPLE_RESUMES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYSES)) {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(SAMPLE_ANALYSES));
  }
}

// Resumes
export async function clientGetResumes(): Promise<Resume[]> {
  if (typeof window === 'undefined') return SAMPLE_RESUMES;
  const stored = localStorage.getItem(STORAGE_KEYS.RESUMES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return SAMPLE_RESUMES;
    }
  }
  return SAMPLE_RESUMES;
}

export async function clientGetResumeById(id: string): Promise<Resume | null> {
  const list = await clientGetResumes();
  return list.find((r) => r.id === id) || SAMPLE_RESUMES.find((r) => r.id === id) || null;
}

export async function clientSaveResume(resume: Resume): Promise<Resume> {
  const list = await clientGetResumes();
  const filtered = list.filter((r) => r.id !== resume.id);
  const updated = [resume, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(updated));
  }
  return resume;
}

// Analyses
export async function clientGetAnalyses(): Promise<AnalysisResult[]> {
  if (typeof window === 'undefined') return SAMPLE_ANALYSES;
  const stored = localStorage.getItem(STORAGE_KEYS.ANALYSES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return SAMPLE_ANALYSES;
    }
  }
  return SAMPLE_ANALYSES;
}

export async function clientGetAnalysisById(id: string): Promise<AnalysisResult | null> {
  const list = await clientGetAnalyses();
  return list.find((a) => a.id === id) || SAMPLE_ANALYSES.find((a) => a.id === id) || null;
}

export async function clientSaveAnalysis(analysis: AnalysisResult): Promise<AnalysisResult> {
  const list = await clientGetAnalyses();
  const filtered = list.filter((a) => a.id !== analysis.id);
  const updated = [analysis, ...filtered];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(updated));
  }
  return analysis;
}

export async function clientDeleteAnalysis(id: string): Promise<boolean> {
  const list = await clientGetAnalyses();
  const updated = list.filter((a) => a.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(updated));
  }
  return true;
}

// Run Analysis Workflow directly on client
export async function clientRunAnalysis(
  resume: Resume,
  jobTitle: string,
  company: string,
  jobText: string
): Promise<AnalysisResult> {
  const job: JobDescription = {
    id: `job-${Date.now()}`,
    title: jobTitle,
    company: company || 'Prospective Employer',
    experienceYears: 4,
    requiredSkills: [
      'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker'
    ].filter((s) => new RegExp(`\\b${s}\\b`, 'i').test(jobText)),
    preferredSkills: ['Kubernetes', 'Redis', 'CI/CD'],
    responsibilities: [
      'Design, architect, and deliver production applications.',
      'Maintain reliable systems and high operational standards.',
    ],
    rawText: jobText,
    createdAt: new Date().toISOString(),
  };

  if (job.requiredSkills.length === 0) {
    job.requiredSkills = ['Communication', 'Domain Problem Solving', 'Software Architecture'];
  }

  const skillAnalysis = analyzeSkills(resume, job);
  const experienceAnalysis = analyzeExperience(resume, job);
  const { overallScore, categoryScores } = calculateScores(skillAnalysis, experienceAnalysis, resume, job);
  const recommendations = generateRecommendations(skillAnalysis, job, resume);
  const atsResult = runATSInspection(
    resume.rawText,
    resume.layoutStructure,
    resume.candidateName,
    resume.email,
    resume.phone
  );
  const writingInsights = analyzeWritingPatterns(resume, job);

  const newAnalysis: AnalysisResult = {
    id: `analysis-${Date.now()}`,
    userId: resume.userId || 'user-demo-seeker',
    resumeId: resume.id,
    jobDescriptionId: job.id,
    resumeTitle: resume.title,
    candidateName: resume.candidateName,
    targetJobTitle: jobTitle,
    targetCompany: company,
    overallMatchScore: overallScore,
    categoryScores,
    skillAnalysis,
    experienceAnalysis,
    recommendations,
    atsResult,
    writingInsights,
    isDemo: false,
    createdAt: new Date().toISOString(),
  };

  await clientSaveAnalysis(newAnalysis);
  return newAnalysis;
}

// Chat Q&A directly on client
export async function clientAnswerQuestion(
  question: string,
  resumeId: string
): Promise<{ answer: string; citations: any[]; isUnsupportedWarning: boolean }> {
  const resume = (await clientGetResumeById(resumeId)) || SAMPLE_RESUMES[0];
  return await answerResumeQuestion(question, resume);
}

// Compare candidates directly on client
export async function clientCompareCandidates(
  resumeIds: string[],
  jobId: string
): Promise<CandidateComparison> {
  const job = SAMPLE_JOBS.find((j) => j.id === jobId) || SAMPLE_JOBS[0];
  const candidatesData = [];

  for (const rId of resumeIds) {
    const resume = await clientGetResumeById(rId);
    if (!resume) continue;

    const analysis =
      (await clientGetAnalysisById(`analysis-${rId}`)) ||
      SAMPLE_ANALYSES.find((a) => a.resumeId === rId) ||
      SAMPLE_ANALYSES[0];

    const missing = analysis.skillAnalysis.skills
      .filter((s) => s.requiredByJob && s.status === 'missing')
      .map((s) => s.skill);

    candidatesData.push({
      resumeId: resume.id,
      candidateName: resume.candidateName,
      overallScore: analysis.overallMatchScore,
      atsScore: analysis.atsResult.score,
      writingScore: analysis.writingInsights.reviewScore,
      matchedSkillsCount: analysis.skillAnalysis.matchedCount,
      totalRequiredSkills: job.requiredSkills.length,
      missingSkills: missing,
      experienceYears: analysis.experienceAnalysis.documentedYears,
      verificationsCount: analysis.writingInsights.recruiterVerificationQuestions.length,
      summaryNotes: analysis.experienceAnalysis.summary,
    });
  }

  return {
    id: `comp-${Date.now()}`,
    jobTitle: job.title,
    jobDescriptionId: job.id,
    candidates: candidatesData,
    createdAt: new Date().toISOString(),
  };
}
