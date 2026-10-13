import { NextRequest, NextResponse } from 'next/server';
import { addChatMessage, getResumeById, getAnalyses } from '@/lib/db';
import { answerResumeQuestion } from '@/lib/ragEngine';
import { SAMPLE_RESUMES } from '@/lib/sampleData';
import { ChatMessage, Resume } from '@/lib/types';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // In our db helper, we can return messages from session
    return NextResponse.json({ success: true, sessionId: id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching messages';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await context.params;
    const body = await req.json();
    const { text, resumeId } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Question text is required.' }, { status: 400 });
    }

    let resume: Resume | null = null;
    if (resumeId) {
      resume = await getResumeById(resumeId);
    }
    if (!resume) {
      resume = SAMPLE_RESUMES[0];
    }

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    await addChatMessage(sessionId, userMsg);

    // 2. Run RAG grounding
    const { answer, citations, isUnsupportedWarning } = await answerResumeQuestion(text, resume);

    // 3. Add assistant message
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-a`,
      sender: 'assistant',
      text: answer,
      citations,
      isUnsupportedWarning,
      timestamp: new Date().toISOString(),
    };
    await addChatMessage(sessionId, assistantMsg);

    return NextResponse.json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error handling message';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
