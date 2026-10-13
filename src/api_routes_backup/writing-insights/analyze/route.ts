import { NextRequest, NextResponse } from 'next/server';
import { analyzeWritingPatterns } from '@/lib/writingAnalyzer';
import { getResumeById, getJobDescriptionById } from '@/lib/db';
import { SAMPLE_JOBS } from '@/lib/sampleData';
import { Resume, JobDescription } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeId, text, jobText, jobDescriptionId } = body;

    let resume: Resume | null = null;
    let job: JobDescription | null = null;

    if (resumeId) {
      resume = await getResumeById(resumeId);
    }

    if (!resume) {
      if (!text || text.trim().length < 20) {
        return NextResponse.json(
          { success: false, error: 'Resume text or valid resumeId is required.' },
          { status: 400 }
        );
      }
      resume = {
        id: 'temp-res',
        userId: 'temp',
        title: 'Temporary Resume',
        candidateName: 'Candidate',
        summary: '',
        skills: [],
        experience: [],
        education: [],
        rawText: text,
        extractedTextOrder: text,
        layoutStructure: {
          detectedColumns: 1,
          hasTables: false,
          hasTextBoxes: false,
          hasHeaderFooterContact: false,
          unusualCharacters: [],
          fontCount: 2,
          pageCount: 1,
          isScannedOrImage: false,
          readingOrderRisk: 'low',
        },
        fileType: 'text',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    if (jobDescriptionId) {
      job = await getJobDescriptionById(jobDescriptionId);
    }

    if (!job) {
      job = {
        id: 'temp-job',
        title: 'Target Role',
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: [],
        rawText: jobText || SAMPLE_JOBS[0].rawText,
        createdAt: new Date().toISOString(),
      };
    }

    const insights = analyzeWritingPatterns(resume, job);

    return NextResponse.json({ success: true, data: insights });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error analyzing writing signals';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
