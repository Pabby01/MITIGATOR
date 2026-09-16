import { NextRequest, NextResponse } from 'next/server';
import { getMeteoraDlmmPair, getMeteoraDlmmQuote } from '@/lib/services/meteora-service';
import { PYTH_FEED_IDS } from '@/lib/services/pyth-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'quote';
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const amount = Number(searchParams.get('amount') || '2000');
    const slippageBps = Number(searchParams.get('slippageBps') || '50');

    if (action === 'pair') {
      const pair = await getMeteoraDlmmPair(symbol);
      return NextResponse.json({ pair });
    }

    const refPrice = PYTH_FEED_IDS[symbol]?.fallbackPrice || 218.29;
    const quote = await getMeteoraDlmmQuote(symbol, amount, slippageBps, refPrice);

    return NextResponse.json({ quote });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Meteora DLMM service error' },
      { status: 500 }
    );
  }
}
