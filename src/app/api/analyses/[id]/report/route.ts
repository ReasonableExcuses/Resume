import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisById } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const analysis = await getAnalysisById(id);
    if (!analysis) {
      return NextResponse.json({ success: false, error: 'Analysis not found' }, { status: 404 });
    }

    const report = {
      meta: {
        platform: 'Smart Resume Analyzer',
        analysisId: analysis.id,
        generatedAt: new Date().toISOString(),
        candidate: analysis.candidateName,
        targetRole: analysis.targetJobTitle,
        company: analysis.targetCompany,
      },
      summary: {
        overallJobMatchScore: analysis.overallMatchScore,
        atsCompatibilityScore: analysis.atsResult.score,
        atsStatus: analysis.atsResult.status,
        writingReviewScore: analysis.writingInsights.reviewScore,
      },
      categoryScores: analysis.categoryScores,
      skills: {
        matched: analysis.skillAnalysis.skills.filter((s) => s.status === 'strong').map((s) => s.skill),
        partial: analysis.skillAnalysis.skills.filter((s) => s.status === 'partial').map((s) => s.skill),
        missing: analysis.skillAnalysis.skills.filter((s) => s.status === 'missing').map((s) => s.skill),
        transferable: analysis.skillAnalysis.skills.filter((s) => s.status === 'transferable').map((s) => s.skill),
      },
      experience: analysis.experienceAnalysis,
      topRecommendations: analysis.recommendations,
      atsFindings: analysis.atsResult.findings,
      recruiterQuestions: analysis.writingInsights.recruiterVerificationQuestions,
      disclaimer: analysis.writingInsights.disclaimer,
    };

    return NextResponse.json({ success: true, data: report });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error generating report';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
