import { NextRequest, NextResponse } from 'next/server';
import { getLiveProvenanceRecords } from '@/lib/services/provenance-service';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'NVDAx';

    const records = await getLiveProvenanceRecords(symbol);
    return NextResponse.json({
      symbol,
      records,
    });
  } catch (error: any) {
    console.error('[API Provenance GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch provenance records' }, { status: 500 });
  }
}
