import { NextRequest, NextResponse } from 'next/server';
import { getResumeById, getJobDescriptionById, saveJobDescription, saveAnalysis, getAnalyses } from '@/lib/db';
import { analyzeSkills, analyzeExperience, calculateScores, generateRecommendations } from '@/lib/matchEngine';
import { runATSInspection } from '@/lib/atsSimulator';
import { analyzeWritingPatterns } from '@/lib/writingAnalyzer';
import { AnalysisResult, JobDescription } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const analyses = await getAnalyses(userId);
    return NextResponse.json({ success: true, data: analyses });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching analyses';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeId, jobDescriptionId, jobTitle, company, jobText, userId } = body;

    if (!resumeId) {
      return NextResponse.json({ success: false, error: 'resumeId is required' }, { status: 400 });
    }

    const resume = await getResumeById(resumeId);
    if (!resume) {
      return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
    }

    let job: JobDescription | null = null;
    if (jobDescriptionId) {
      job = await getJobDescriptionById(jobDescriptionId);
    }

    if (!job) {
      if (!jobText || jobText.trim().length < 20) {
        return NextResponse.json(
          { success: false, error: 'Please provide either a valid jobDescriptionId or jobText with at least 20 characters.' },
          { status: 400 }
        );
      }

      // Extract skills from job text
      const commonTech = [
        'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL',
        'Redis', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'SQL', 'Tableau', 'Power BI', 'Snowflake',
        'A/B Testing', 'Agile', 'Scrum', 'JIRA', 'PMP', 'dbt'
      ];
      const extractedRequired = commonTech.filter((t) =>
        new RegExp(`\\b${t}\\b`, 'i').test(jobText)
      );

      job = {
        id: `job-${Date.now()}`,
        title: jobTitle || 'Target Role',
        company: company || 'Prospective Employer',
        experienceYears: 4,
        requiredSkills: extractedRequired.length > 0 ? extractedRequired : ['Communication', 'Problem Solving', 'Domain Skills'],
        preferredSkills: ['Cloud Services', 'CI/CD Pipelines'],
        responsibilities: [
          'Design and deliver core software systems.',
          'Collaborate across cross-functional product and engineering teams.',
          'Maintain high quality standards and operational reliability.',
        ],
        rawText: jobText,
        createdAt: new Date().toISOString(),
      };
      await saveJobDescription(job);
    }

    // 1. Skill analysis
    const skillAnalysis = analyzeSkills(resume, job);

    // 2. Experience analysis
    const experienceAnalysis = analyzeExperience(resume, job);

    // 3. Match score calculation
    const { overallScore, categoryScores } = calculateScores(skillAnalysis, experienceAnalysis, resume, job);

    // 4. Actionable recommendations
    const recommendations = generateRecommendations(skillAnalysis, job, resume);

    // 5. ATS Inspection
    const atsResult = runATSInspection(
      resume.rawText,
      resume.layoutStructure,
      resume.candidateName,
      resume.email,
      resume.phone
    );

    // 6. AI Writing Insights
    const writingInsights = analyzeWritingPatterns(resume, job);

    const newAnalysis: AnalysisResult = {
      id: `analysis-${Date.now()}`,
      userId: userId || resume.userId || 'user-demo-seeker',
      resumeId: resume.id,
      jobDescriptionId: job.id,
      resumeTitle: resume.title,
      candidateName: resume.candidateName,
      targetJobTitle: job.title,
      targetCompany: job.company,
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

    await saveAnalysis(newAnalysis);

    return NextResponse.json({ success: true, data: newAnalysis });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error executing analysis';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
