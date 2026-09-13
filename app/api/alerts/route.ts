import { NextRequest, NextResponse } from 'next/server';
import {
  getUserAlerts,
  createUserAlert,
  deleteUserAlert,
  toggleUserAlert,
  evaluateLiveAlerts,
} from '@/lib/services/alerts-service';
import { getLivePythPrice } from '@/lib/services/pyth-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('address') || 'guest';

    // Fetch live prices for quick evaluation
    const [nvda, tsla, aapl, msft] = await Promise.all([
      getLivePythPrice('NVDAx').catch(() => ({ price: 184.22 })),
      getLivePythPrice('TSLAx').catch(() => ({ price: 218.45 })),
      getLivePythPrice('AAPLx').catch(() => ({ price: 224.30 })),
      getLivePythPrice('MSFTx').catch(() => ({ price: 428.10 })),
    ]);

    const livePrices: Record<string, number> = {
      NVDAx: nvda.price,
      NVDA: nvda.price,
      TSLAx: tsla.price,
      TSLA: tsla.price,
      AAPLx: aapl.price,
      AAPL: aapl.price,
      MSFTx: msft.price,
      MSFT: msft.price,
    };

    const { alerts, newlyTriggeredCount } = await evaluateLiveAlerts(userAddress, livePrices);

    return NextResponse.json({
      alerts,
      newlyTriggeredCount,
      livePrices,
    });
  } catch (error: any) {
    console.error('[API Alerts GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'create', userAddress = 'guest', alertId, alert } = body;

    if (action === 'delete') {
      if (!alertId) {
        return NextResponse.json({ error: 'Missing alertId' }, { status: 400 });
      }
      await deleteUserAlert(userAddress, alertId);
      return NextResponse.json({ success: true, deletedId: alertId });
    }

    if (action === 'toggle') {
      if (!alertId) {
        return NextResponse.json({ error: 'Missing alertId' }, { status: 400 });
      }
      const updated = await toggleUserAlert(userAddress, alertId);
      return NextResponse.json({ success: true, alert: updated });
    }

    if (action === 'create') {
      if (!alert || !alert.symbol || alert.threshold === undefined) {
        return NextResponse.json({ error: 'Invalid alert payload' }, { status: 400 });
      }

      const created = await createUserAlert({
        userAddress,
        type: alert.type || 'price',
        symbol: alert.symbol,
        condition: alert.condition || 'above',
        threshold: parseFloat(alert.threshold),
        currentValue: alert.currentValue || 0,
        active: true,
        notes: alert.notes || '',
      });

      return NextResponse.json({ success: true, alert: created });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API Alerts POST Error]:', error);
    return NextResponse.json({ error: 'Failed to process alert action' }, { status: 500 });
  }
}
