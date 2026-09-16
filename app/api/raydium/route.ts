import { NextRequest, NextResponse } from 'next/server';
import {
  getRaydiumSwapQuote,
  getRaydiumAutoFee,
  buildRaydiumSwapTransaction,
} from '@/lib/services/raydium-service';
import { PYTH_FEED_IDS } from '@/lib/services/pyth-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'quote';
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const amount = Number(searchParams.get('amount') || '2000');
    const slippageBps = Number(searchParams.get('slippageBps') || '50');

    if (action === 'fee') {
      const fee = await getRaydiumAutoFee();
      return NextResponse.json({ priorityFeeMicroLamports: fee });
    }

    const refPrice = PYTH_FEED_IDS[symbol]?.fallbackPrice || 218.29;
    const quote = await getRaydiumSwapQuote(symbol, amount, slippageBps, refPrice);

    return NextResponse.json({ quote });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Raydium quote failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { computeResult, walletPubkey, priorityFeeMicroLamports } = body;

    if (!walletPubkey) {
      return NextResponse.json({ error: 'walletPubkey is required' }, { status: 400 });
    }

    const result = await buildRaydiumSwapTransaction(
      computeResult,
      walletPubkey,
      priorityFeeMicroLamports || 50_000
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to construct Raydium transaction' },
      { status: 500 }
    );
  }
}
