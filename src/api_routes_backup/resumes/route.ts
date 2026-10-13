import { NextRequest, NextResponse } from 'next/server';
import { getResumes, saveResume } from '@/lib/db';
import { parseResumeBuffer } from '@/lib/documentParser';
import { Resume } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const resumes = await getResumes(userId);
    return NextResponse.json({ success: true, data: resumes });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, title, candidateName, userId, fileType = 'text' } = body;

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Resume text must be at least 20 characters long.' },
        { status: 400 }
      );
    }

    const parsed = await parseResumeBuffer(Buffer.from(text, 'utf-8'), 'text', 'manual_paste.txt');

    const newResume: Resume = {
      id: `res-${Date.now()}`,
      userId: userId || 'user-demo-seeker',
      title: title || `${candidateName || parsed.candidateName} - Resume`,
      candidateName: candidateName || parsed.candidateName,
      email: parsed.email,
      phone: parsed.phone,
      location: parsed.location,
      linkedin: parsed.linkedin,
      github: parsed.github,
      summary: parsed.summary,
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
      rawText: text,
      extractedTextOrder: parsed.extractedTextOrder,
      layoutStructure: parsed.layoutStructure,
      fileType: fileType as 'pdf' | 'docx' | 'text',
      fileName: 'Pasted_Resume.txt',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveResume(newResume);
    return NextResponse.json({ success: true, data: newResume });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save resume';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
