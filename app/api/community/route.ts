import { NextRequest, NextResponse } from 'next/server';
import {
  getCommunityPosts,
  createCommunityPost,
  likeCommunityPost,
  computeCommunitySentiment,
} from '@/lib/services/community-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol') || 'NVDAx';

    const posts = await getCommunityPosts(symbol);
    const sentiment = computeCommunitySentiment(posts, symbol);

    return NextResponse.json({
      symbol,
      posts,
      sentiment,
    });
  } catch (error: any) {
    console.error('[API Community GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch community posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, symbol, postId, post } = body;

    if (action === 'like') {
      if (!symbol || !postId) {
        return NextResponse.json({ error: 'Missing symbol or postId' }, { status: 400 });
      }
      const likes = await likeCommunityPost(symbol, postId);
      return NextResponse.json({ success: true, likes });
    }

    const postData = post || body;

    if (!postData || !postData.symbol || !postData.content) {
      return NextResponse.json({ error: 'Invalid post content' }, { status: 400 });
    }

    // Basic sanitization
    const sanitizedContent = String(postData.content).slice(0, 1000).trim();
    if (!sanitizedContent) {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }

    const created = await createCommunityPost({
      symbol: postData.symbol,
      author: postData.author || 'Solana Trader',
      authorAddress: postData.authorAddress,
      handle: postData.handle || '@trader · MITIGATOR',
      platform: postData.platform || 'MITIGATOR',
      verified: !!postData.verified,
      type: postData.type || 'Trade Idea',
      sentiment: postData.sentiment || 'bullish',
      sourceTier: postData.sourceTier || 'SOCIAL',
      content: sanitizedContent,
      evidenceAttached: !!postData.evidenceAttached,
    });

    return NextResponse.json({ success: true, post: created });
  } catch (error: any) {
    console.error('[API Community POST Error]:', error);
    return NextResponse.json({ error: 'Failed to process community action' }, { status: 500 });
  }
}
