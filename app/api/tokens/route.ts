import { NextRequest, NextResponse } from 'next/server';
import { getTokensAssetProfile, getAssetVariantComparison } from '@/lib/services/tokens-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'profile';
    const symbol = searchParams.get('symbol') || 'NVDAx';

    if (action === 'variants') {
      const variants = await getAssetVariantComparison(symbol);
      return NextResponse.json({ symbol, variants });
    }

    const profile = await getTokensAssetProfile(symbol);
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch Tokens.xyz asset profile' },
      { status: 500 }
    );
  }
}
