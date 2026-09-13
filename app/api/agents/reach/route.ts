import { NextRequest, NextResponse } from 'next/server';
import {
  crawlFinancialNews,
  getAgentReachReport,
} from '@/lib/services/agent-reach-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const action = searchParams.get('action') || 'report';

    if (action === 'news') {
      const news = await crawlFinancialNews(symbol, 8);
      return NextResponse.json({ news });
    }

    const report = await getAgentReachReport(symbol);
    return NextResponse.json({ report });
  } catch (err: any) {
    console.error('[API AgentReach Error]:', err);
    return NextResponse.json({ error: 'Failed to crawl web intelligence' }, { status: 500 });
  }
}
