import { NextRequest, NextResponse } from 'next/server';
import { getPythDualFeedComparison } from '@/lib/services/pyth-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'NVDAx';

  try {
    const data = await getPythDualFeedComparison(symbol);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3, stale-while-revalidate=5',
      },
    });
  } catch (err: any) {
    console.error('[api/pyth/dual-feed] Error comparing feeds:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to compare dual feeds' },
      { status: 500 }
    );
  }
}
