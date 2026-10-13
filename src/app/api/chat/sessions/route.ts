import { NextRequest, NextResponse } from 'next/server';
import { getChatSession } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeId, userId = 'user-demo-seeker' } = body;

    if (!resumeId) {
      return NextResponse.json({ success: false, error: 'resumeId is required' }, { status: 400 });
    }

    const session = await getChatSession(resumeId, userId);
    return NextResponse.json({ success: true, data: session });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error creating or getting chat session';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
