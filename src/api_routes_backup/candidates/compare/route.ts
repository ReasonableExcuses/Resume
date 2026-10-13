import { NextRequest, NextResponse } from 'next/server';
import { compareCandidates, getJobDescriptions } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeIds, jobDescriptionId } = body;

    if (!resumeIds || !Array.isArray(resumeIds) || resumeIds.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please select at least 2 candidates to compare.' },
        { status: 400 }
      );
    }

    const jobs = await getJobDescriptions();
    const jobId = jobDescriptionId || jobs[0].id;

    const comparison = await compareCandidates(resumeIds, jobId);

    return NextResponse.json({ success: true, data: comparison });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error executing candidate comparison';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
