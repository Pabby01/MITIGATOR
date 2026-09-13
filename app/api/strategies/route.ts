import { NextRequest, NextResponse } from 'next/server';
import {
  getMarketplaceStrategies,
  getUserSubscriptions,
  toggleFollowStrategy,
  copyStrategy,
  deployPaperStrategy,
  createCustomStrategy,
  deleteCustomStrategy,
  cancelCopyStrategy,
} from '@/lib/services/strategies-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('address') || 'guest';

    const strategies = await getMarketplaceStrategies();
    const subscriptions = getUserSubscriptions(userAddress);

    return NextResponse.json({
      strategies,
      subscriptions,
    });
  } catch (error: any) {
    console.error('[API Strategies GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userAddress = 'guest', strategyId, allocationUsd = 2500, strategyData } = body;

    if (action === 'create') {
      if (!strategyData || !strategyData.name) {
        return NextResponse.json({ error: 'Missing strategy data' }, { status: 400 });
      }
      const newStrat = await createCustomStrategy({
        name: strategyData.name,
        creator: userAddress.length > 8 ? `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}` : userAddress,
        description: strategyData.description || 'Custom user rule-based strategy.',
        riskLevel: strategyData.riskLevel || 'moderate',
        roi: strategyData.roi || 24.5,
        drawdown: strategyData.drawdown || 6.5,
        sharpe: strategyData.sharpe || 1.65,
        winRate: strategyData.winRate || 72,
        volatility: strategyData.volatility || 18,
        tradeFrequency: strategyData.tradeFrequency || 3.5,
        holdingPeriod: strategyData.holdingPeriod || '3-10 days',
        concentration: strategyData.concentration || 25,
        methodology: strategyData.methodology || 'Rule-based quantitative model.',
        targetAssets: strategyData.targetAssets || ['NVDAx', 'AAPLx'],
      });
      return NextResponse.json({ success: true, strategy: newStrat });
    }

    if (!strategyId) {
      return NextResponse.json({ error: 'Missing strategyId' }, { status: 400 });
    }

    if (action === 'follow') {
      const isFollowing = await toggleFollowStrategy(userAddress, strategyId);
      return NextResponse.json({ success: true, isFollowing });
    }

    if (action === 'copy') {
      const result = await copyStrategy(userAddress, strategyId, allocationUsd);
      return NextResponse.json(result);
    }

    if (action === 'paper') {
      const result = await deployPaperStrategy(userAddress, strategyId, allocationUsd);
      return NextResponse.json(result);
    }

    if (action === 'delete') {
      const success = await deleteCustomStrategy(strategyId);
      return NextResponse.json({ success });
    }

    if (action === 'cancel_copy') {
      const success = await cancelCopyStrategy(userAddress, strategyId);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API Strategies POST Error]:', error);
    return NextResponse.json({ error: 'Failed to execute strategy action' }, { status: 500 });
  }
}
