import { NextRequest, NextResponse } from 'next/server';
import { getAnalysisById, deleteAnalysis } from '@/lib/db';

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
    return NextResponse.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching analysis';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await deleteAnalysis(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Analysis not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Analysis deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting analysis';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
