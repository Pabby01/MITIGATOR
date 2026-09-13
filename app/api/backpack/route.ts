import { NextRequest, NextResponse } from 'next/server';
import {
  getBackpackSecurities,
  getBackpackMarketSessions,
  getCurrentMarketSessionStatus,
  getBackpackRFQQuote,
  submitBackpackMintRedeem,
  getUserMintRedeemHistory,
} from '@/lib/services/backpack-securities-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'securities';
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const quantity = Number(searchParams.get('quantity') || 10);
    const side = (searchParams.get('side') as 'buy' | 'sell') || 'buy';
    const userAddress = searchParams.get('userAddress') || 'guest';

    if (action === 'securities') {
      const securities = await getBackpackSecurities();
      return NextResponse.json({ securities });
    }

    if (action === 'sessions') {
      const sessionStatus = await getCurrentMarketSessionStatus();
      const rawSessions = await getBackpackMarketSessions();
      return NextResponse.json({ sessionStatus, rawSessions });
    }

    if (action === 'rfq') {
      const quote = await getBackpackRFQQuote(symbol, quantity, side);
      return NextResponse.json({ quote });
    }

    if (action === 'history') {
      const history = getUserMintRedeemHistory(userAddress);
      return NextResponse.json({ history });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (err: any) {
    console.error('[API Backpack GET Error]:', err);
    return NextResponse.json({ error: 'Failed to fetch Backpack data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userAddress = 'guest', symbol, quantity, cashAmountUsd } = body;

    if (action === 'mint' || action === 'redeem') {
      if (!symbol || !quantity || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid symbol or quantity' }, { status: 400 });
      }

      const request = await submitBackpackMintRedeem({
        type: action,
        userAddress,
        symbol,
        quantity,
        cashAmountUsd: cashAmountUsd || quantity * 100,
      });

      return NextResponse.json({ success: true, request });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[API Backpack POST Error]:', err);
    return NextResponse.json({ error: 'Failed to process Backpack request' }, { status: 500 });
  }
}
