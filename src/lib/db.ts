import {
  Resume,
  JobDescription,
  AnalysisResult,
  ChatSession,
  ChatMessage,
  CandidateComparison,
} from './types';
import { SAMPLE_RESUMES, SAMPLE_JOBS, SAMPLE_ANALYSES } from './sampleData';

// In-memory store initialized with sample data
let resumesStore: Resume[] = [...SAMPLE_RESUMES];
let jobsStore: JobDescription[] = [...SAMPLE_JOBS];
let analysesStore: AnalysisResult[] = [...SAMPLE_ANALYSES];
let chatSessionsStore: ChatSession[] = [
  {
    id: 'session-alex',
    resumeId: 'res-alex-rivera',
    userId: 'user-demo-seeker',
    title: 'Resume Chat: Alex Rivera',
    createdAt: '2026-10-10T09:40:00Z',
    updatedAt: '2026-10-10T09:45:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Hello! I am your AI Resume Assistant grounded in Alex Rivera\'s resume. Ask me any question about skills, achievements, or project scope.',
        timestamp: '2026-10-10T09:40:00Z',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Does Alex have experience managing a team of more than five engineers?',
        timestamp: '2026-10-10T09:42:00Z',
      },
      {
        id: 'msg-3',
        sender: 'assistant',
        text: 'Yes. The resume explicitly documents that Alex "Mentored a cross-functional team of 6 engineers across sprint planning, comprehensive code reviews, and test-driven development practices" while serving as Senior Full-Stack Engineer at Vanguard Cloud Technologies.',
        citations: [
          {
            text: 'Mentored a cross-functional team of 6 engineers across sprint planning...',
            section: 'Professional Experience',
            page: 1,
            confidence: 0.98,
          },
        ],
        timestamp: '2026-10-10T09:42:05Z',
      },
    ],
  },
];

// Resumes
export async function getResumes(userId?: string): Promise<Resume[]> {
  if (!userId) return resumesStore;
  return resumesStore.filter((r) => r.userId === userId || r.userId === 'user-demo-seeker');
}

export async function getResumeById(id: string): Promise<Resume | null> {
  const found = resumesStore.find((r) => r.id === id);
  return found || null;
}

export async function saveResume(resume: Resume): Promise<Resume> {
  const existingIdx = resumesStore.findIndex((r) => r.id === resume.id);
  if (existingIdx >= 0) {
    resumesStore[existingIdx] = resume;
  } else {
    resumesStore.unshift(resume);
  }
  return resume;
}

export async function deleteResume(id: string): Promise<boolean> {
  const initialLen = resumesStore.length;
  resumesStore = resumesStore.filter((r) => r.id !== id);
  // Also clean up linked analyses and sessions
  analysesStore = analysesStore.filter((a) => a.resumeId !== id);
  chatSessionsStore = chatSessionsStore.filter((c) => c.resumeId !== id);
  return resumesStore.length < initialLen;
}

// Jobs
export async function getJobDescriptions(): Promise<JobDescription[]> {
  return jobsStore;
}

export async function getJobDescriptionById(id: string): Promise<JobDescription | null> {
  const found = jobsStore.find((j) => j.id === id);
  return found || null;
}

export async function saveJobDescription(job: JobDescription): Promise<JobDescription> {
  const idx = jobsStore.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    jobsStore[idx] = job;
  } else {
    jobsStore.unshift(job);
  }
  return job;
}

// Analyses
export async function getAnalyses(userId?: string): Promise<AnalysisResult[]> {
  if (!userId) return analysesStore;
  return analysesStore.filter((a) => a.userId === userId || a.userId === 'user-demo-seeker');
}

export async function getAnalysisById(id: string): Promise<AnalysisResult | null> {
  const found = analysesStore.find((a) => a.id === id);
  return found || null;
}

export async function saveAnalysis(analysis: AnalysisResult): Promise<AnalysisResult> {
  const idx = analysesStore.findIndex((a) => a.id === analysis.id);
  if (idx >= 0) {
    analysesStore[idx] = analysis;
  } else {
    analysesStore.unshift(analysis);
  }
  return analysis;
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  const initialLen = analysesStore.length;
  analysesStore = analysesStore.filter((a) => a.id !== id);
  return analysesStore.length < initialLen;
}

// Chat Sessions
export async function getChatSession(resumeId: string, userId: string): Promise<ChatSession> {
  let session = chatSessionsStore.find((s) => s.resumeId === resumeId && s.userId === userId);
  if (!session) {
    const resume = await getResumeById(resumeId);
    session = {
      id: `session-${Date.now()}`,
      resumeId,
      userId,
      title: `Resume Chat: ${resume?.candidateName || 'Candidate'}`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `Hello! I am your AI Resume Assistant grounded in ${resume?.candidateName || 'the candidate'}'s resume. You can ask me about documented technical skills, achievements, leadership, or specific qualifications.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    chatSessionsStore.push(session);
  }
  return session;
}

export async function addChatMessage(sessionId: string, message: ChatMessage): Promise<ChatSession | null> {
  const session = chatSessionsStore.find((s) => s.id === sessionId);
  if (!session) return null;
  session.messages.push(message);
  session.updatedAt = new Date().toISOString();
  return session;
}

// Candidate Comparison
export async function compareCandidates(
  resumeIds: string[],
  jobDescriptionId: string
): Promise<CandidateComparison> {
  const job = (await getJobDescriptionById(jobDescriptionId)) || SAMPLE_JOBS[0];
  const candidatesData = [];

  for (const rId of resumeIds) {
    const resume = await getResumeById(rId);
    if (!resume) continue;

    // Check if analysis already exists
    let analysis = analysesStore.find((a) => a.resumeId === rId && a.jobDescriptionId === job.id);
    if (!analysis) {
      analysis = analysesStore.find((a) => a.resumeId === rId) || SAMPLE_ANALYSES[0];
    }

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
