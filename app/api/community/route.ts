import { NextRequest, NextResponse } from 'next/server';
import {
  getCommunityPosts,
  createCommunityPost,
  toggleLikeCommunityPost,
  toggleRepostCommunityPost,
  getPostComments,
  createPostComment,
  toggleLikeComment,
  getUserProfile,
  updateUserProfile,
  toggleFollowUser,
  computeCommunitySentiment,
} from '@/lib/services/community-service';
import { getLivePythPrice } from '@/lib/services/pyth-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // 1. Get Comments for a specific post
    if (action === 'get_comments') {
      const postId = searchParams.get('postId');
      if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
      const comments = await getPostComments(postId);
      return NextResponse.json({ comments });
    }

    // 2. Get User Profile
    if (action === 'get_profile') {
      const handle = searchParams.get('handle') || searchParams.get('address');
      if (!handle) return NextResponse.json({ error: 'Missing handle or address' }, { status: 400 });
      const profile = await getUserProfile(handle);
      return NextResponse.json({ profile });
    }

    // Default: Get posts and live computed sentiment for symbol
    const symbol = searchParams.get('symbol') || 'NVDAx';
    const [posts, livePyth] = await Promise.all([
      getCommunityPosts(symbol),
      getLivePythPrice(symbol).catch(() => null),
    ]);

    const sentiment = computeCommunitySentiment(posts, symbol, {
      price: livePyth?.price,
      changePct: livePyth?.changePct24h,
      volume: livePyth?.volume24h,
      dayHigh: livePyth?.dayHigh,
      dayLow: livePyth?.dayLow,
      source: livePyth?.source,
    });

    return NextResponse.json({
      symbol,
      posts,
      sentiment,
      market: livePyth,
    });
  } catch (error: any) {
    console.error('[API Community GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch community data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, symbol, postId, post, userAddress, comment, targetHandle, updates } = body;

    // 1. Toggle like on post
    if (action === 'like') {
      if (!symbol || !postId) {
        return NextResponse.json({ error: 'Missing symbol or postId' }, { status: 400 });
      }
      const result = await toggleLikeCommunityPost(symbol, postId, userAddress || 'guest');
      return NextResponse.json({ success: true, ...result });
    }

    // 2. Toggle repost on post
    if (action === 'repost') {
      if (!symbol || !postId) {
        return NextResponse.json({ error: 'Missing symbol or postId' }, { status: 400 });
      }
      const result = await toggleRepostCommunityPost(symbol, postId, userAddress || 'guest');
      return NextResponse.json({ success: true, ...result });
    }

    // 3. Create comment on post
    if (action === 'create_comment') {
      if (!postId || !comment || !comment.content) {
        return NextResponse.json({ error: 'Invalid comment payload' }, { status: 400 });
      }
      const newComment = await createPostComment(
        {
          postId,
          parentId: comment.parentId,
          author: comment.author || 'Solana Trader',
          authorAddress: comment.authorAddress,
          handle: comment.handle || '@trader',
          avatar: comment.avatar,
          verified: !!comment.verified,
          content: String(comment.content).slice(0, 500).trim(),
        },
        symbol || 'NVDAx'
      );
      return NextResponse.json({ success: true, comment: newComment });
    }

    // 4. Toggle like on comment
    if (action === 'like_comment') {
      const { commentId } = body;
      if (!postId || !commentId) {
        return NextResponse.json({ error: 'Missing postId or commentId' }, { status: 400 });
      }
      const result = await toggleLikeComment(postId, commentId, userAddress || 'guest');
      return NextResponse.json({ success: true, ...result });
    }

    // 5. Update user profile
    if (action === 'update_profile') {
      if (!userAddress || !updates) {
        return NextResponse.json({ error: 'Missing userAddress or updates' }, { status: 400 });
      }
      const updated = await updateUserProfile(userAddress, updates);
      return NextResponse.json({ success: true, profile: updated });
    }

    // 6. Toggle follow user
    if (action === 'toggle_follow') {
      if (!targetHandle) {
        return NextResponse.json({ error: 'Missing targetHandle' }, { status: 400 });
      }
      const result = await toggleFollowUser(targetHandle, userAddress || 'guest');
      return NextResponse.json({ success: true, ...result });
    }

    // Default: Create new community post
    const postData = post || body;

    if (!postData || !postData.symbol || !postData.content) {
      return NextResponse.json({ error: 'Invalid post content' }, { status: 400 });
    }

    const sanitizedContent = String(postData.content).slice(0, 1000).trim();
    if (!sanitizedContent) {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }

    const created = await createCommunityPost({
      symbol: postData.symbol,
      author: postData.author || 'Solana Trader',
      authorAddress: postData.authorAddress,
      handle: postData.handle || '@trader',
      avatar: postData.avatar,
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
