import { NextRequest, NextResponse } from 'next/server';
import { runATSInspection } from '@/lib/atsSimulator';
import { detectLayoutStructure } from '@/lib/documentParser';
import { getResumeById } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeId, text, candidateName = 'Candidate', email, phone } = body;

    let resumeText = text;
    let name = candidateName;
    let mail = email;
    let tel = phone;
    let layout = detectLayoutStructure(resumeText || '', 'text');

    if (resumeId) {
      const resume = await getResumeById(resumeId);
      if (resume) {
        resumeText = resume.rawText;
        name = resume.candidateName;
        mail = resume.email;
        tel = resume.phone;
        layout = resume.layoutStructure;
      }
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Resume text must contain at least 20 characters for ATS inspection.' },
        { status: 400 }
      );
    }

    const atsResult = runATSInspection(resumeText, layout, name, mail, tel);

    return NextResponse.json({ success: true, data: atsResult });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error running ATS inspection';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
