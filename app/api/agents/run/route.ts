import { NextRequest, NextResponse } from 'next/server';
import { runAgentLive, AGENTS_REGISTRY } from '@/lib/services/agents-service';

export async function GET() {
  return NextResponse.json({
    agents: AGENTS_REGISTRY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId = 'risk', symbol = 'NVDAx' } = body;

    const result = await runAgentLive(agentId, symbol);
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('[API Agents Run Error]:', error);
    return NextResponse.json({ error: 'Failed to run agent' }, { status: 500 });
  }
}
