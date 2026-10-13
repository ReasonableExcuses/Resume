import { NextRequest, NextResponse } from 'next/server';
import { getResumeById, deleteResume } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const resume = await getResumeById(id);
    if (!resume) {
      return NextResponse.json({ success: false, error: 'Resume not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: resume });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching resume';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteResume(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Resume not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting resume';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
