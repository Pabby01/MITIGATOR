import { NextRequest, NextResponse } from 'next/server';
import {
  getPaperPortfolio,
  executePaperTrade,
  closePaperPosition,
  resetPaperPortfolio,
} from '@/lib/services/paper-trading-service';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('address') || 'guest';

    const portfolio = await getPaperPortfolio(userAddress);
    return NextResponse.json(portfolio);
  } catch (error: any) {
    console.error('[API Paper GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch paper portfolio' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'execute', userAddress = 'guest', tradeId, symbol, side, amountUsd, venue } = body;

    if (action === 'reset') {
      const portfolio = await resetPaperPortfolio(userAddress);
      return NextResponse.json({ success: true, portfolio });
    }

    if (action === 'close') {
      if (!tradeId) {
        return NextResponse.json({ error: 'Missing tradeId' }, { status: 400 });
      }
      const success = await closePaperPosition(userAddress, tradeId);
      const updated = await getPaperPortfolio(userAddress);
      return NextResponse.json({ success, portfolio: updated });
    }

    if (!symbol || !side || !amountUsd) {
      return NextResponse.json({ error: 'Missing required trade fields' }, { status: 400 });
    }

    if (amountUsd <= 0 || amountUsd > 100000) {
      return NextResponse.json({ error: 'Invalid order amount (min $1, max $100,000)' }, { status: 400 });
    }

    const trade = await executePaperTrade({
      userAddress,
      symbol,
      side,
      amountUsd,
      venue,
    });

    const updatedPortfolio = await getPaperPortfolio(userAddress);

    return NextResponse.json({
      success: true,
      trade,
      portfolio: updatedPortfolio,
    });
  } catch (error: any) {
    console.error('[API Paper POST Error]:', error);
    return NextResponse.json({ error: 'Failed to execute paper trade' }, { status: 500 });
  }
}
