import { NextRequest, NextResponse } from 'next/server';
import { getLiveSECFilings } from '@/lib/services/sec-edgar-service';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const filings = await getLiveSECFilings(symbol);

    return NextResponse.json({
      symbol,
      filings,
      source: 'SEC EDGAR Submissions (Tier 1 Primary)',
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('[API Filings GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch SEC filings' }, { status: 500 });
  }
}
