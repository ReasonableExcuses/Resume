import { NextRequest, NextResponse } from 'next/server';
import { parseResumeBuffer } from '@/lib/documentParser';
import { saveResume } from '@/lib/db';
import { Resume } from '@/lib/types';


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = (formData.get('userId') as string) || 'user-demo-seeker';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file was provided in the upload request.' }, { status: 400 });
    }

    // File size check: 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum permitted limit (10MB).' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'uploaded_document';
    const lowerName = fileName.toLowerCase();

    let fileType: 'pdf' | 'docx' | 'text' = 'text';
    if (lowerName.endsWith('.pdf')) {
      fileType = 'pdf';
    } else if (lowerName.endsWith('.docx')) {
      fileType = 'docx';
    } else if (lowerName.endsWith('.txt')) {
      fileType = 'text';
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported document format. Please upload a PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) file.',
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse resume
    const parsed = await parseResumeBuffer(buffer, fileType, fileName);

    const newResume: Resume = {
      id: `res-${Date.now()}`,
      userId,
      title: `${parsed.candidateName} - Resume`,
      candidateName: parsed.candidateName,
      email: parsed.email,
      phone: parsed.phone,
      location: parsed.location,
      linkedin: parsed.linkedin,
      github: parsed.github,
      summary: parsed.summary,
      skills: parsed.skills,
      experience: parsed.experience,
      education: parsed.education,
      rawText: parsed.rawText,
      extractedTextOrder: parsed.extractedTextOrder,
      layoutStructure: parsed.layoutStructure,
      fileType,
      fileName,
      fileSize: `${Math.round(file.size / 1024)} KB`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveResume(newResume);

    return NextResponse.json({ success: true, data: newResume });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error processing uploaded resume file';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
