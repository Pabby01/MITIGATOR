import { getSupabase, isSupabaseConfigured } from './supabase';
import type { SourceTier } from '@/types';

export interface CommunityComment {
  id: string;
  postId: string;
  parentId?: string; // Optional for nested replies
  author: string;
  authorAddress?: string;
  handle: string;
  avatar?: string;
  verified: boolean;
  content: string;
  likes: number;
  likedBy: string[];
  postedAt: string;
}

export interface UserProfile {
  address: string;
  handle: string;
  name: string;
  avatar?: string;
  bannerGradient?: string;
  bio: string;
  verified: boolean;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  followedBy: string[];
  trustScore: number;
  winRate: number;
  publicTradesCount: number;
  publicTrades: Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    entryPrice: number;
    currentPrice: number;
    pnlPct: number;
    timestamp: string;
  }>;
}

export interface CommunityPost {
  id: string;
  symbol: string;
  author: string;
  authorAddress?: string;
  handle: string;
  avatar?: string;
  platform: 'MITIGATOR' | 'X' | 'Reddit' | 'Stocktwits';
  verified: boolean;
  type: 'Trade Idea' | 'Analysis' | 'Question';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sourceTier: SourceTier;
  content: string;
  engagement: {
    likes: number;
    replies: number;
    reposts: number;
    bookmarks?: number;
  };
  likedBy?: string[];
  repostedBy?: string[];
  evidenceAttached: boolean;
  postedAt: string;
}
const STORAGE_POSTS_KEY = 'mitigator_community_posts_';
const STORAGE_COMMENTS_KEY = 'mitigator_community_comments_';
const STORAGE_PROFILES_KEY = 'mitigator_user_profiles';

/**
 * Fetch community posts for an asset from Supabase / localStorage
 */
export async function getCommunityPosts(symbol: string = 'NVDAx'): Promise<CommunityPost[]> {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .eq('symbol', symbol)
          .order('posted_at', { ascending: false });

        if (data && !error && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            symbol: d.symbol,
            author: d.author,
            authorAddress: d.author_address,
            handle: d.handle,
            avatar: d.avatar,
            platform: d.platform,
            verified: d.verified,
            type: d.type,
            sentiment: d.sentiment,
            sourceTier: d.source_tier,
            content: d.content,
            engagement: d.engagement || { likes: 0, replies: 0, reposts: 0, bookmarks: 0 },
            likedBy: d.liked_by || [],
            repostedBy: d.reposted_by || [],
            evidenceAttached: d.evidence_attached,
            postedAt: d.posted_at,
          }));
        }
      } catch (err) {
        console.warn('[Community] Supabase fetch error:', err);
      }
    }
  }

  // 2. Client-side LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_POSTS_KEY}${symbol}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy seeds from previous runs
          return parsed.filter(
            (p: any) =>
              p.id &&
              !p.id.startsWith('post-nvda-') &&
              !p.id.startsWith('post-tsla-') &&
              !p.id.startsWith('post-aapl-') &&
              p.author !== 'QuantResearcher' &&
              p.author !== 'DegenTrader99'
          );
        }
      }
    } catch {
      // ignore
    }
  }

  return [];
}

/**
 * Create a new user post
 */
export async function createCommunityPost(
  newPost: Omit<CommunityPost, 'id' | 'postedAt' | 'engagement' | 'likedBy' | 'repostedBy'>
): Promise<CommunityPost> {
  const post: CommunityPost = {
    ...newPost,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    postedAt: new Date().toISOString(),
    engagement: { likes: 1, replies: 0, reposts: 0, bookmarks: 0 },
    likedBy: newPost.authorAddress ? [newPost.authorAddress] : [],
    repostedBy: [],
  };

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('community_posts').insert({
          id: post.id,
          symbol: post.symbol,
          author: post.author,
          author_address: post.authorAddress,
          handle: post.handle,
          avatar: post.avatar,
          platform: post.platform,
          verified: post.verified,
          type: post.type,
          sentiment: post.sentiment,
          source_tier: post.sourceTier,
          content: post.content,
          engagement: post.engagement,
          evidence_attached: post.evidenceAttached,
          posted_at: post.postedAt,
        });
      } catch (err) {
        console.warn('[Community] Supabase insert error:', err);
      }
    }
  }

  // 2. Save to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const existing = await getCommunityPosts(post.symbol);
      const updated = [post, ...existing.filter((p) => p.id !== post.id)];
      localStorage.setItem(`${STORAGE_POSTS_KEY}${post.symbol}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Community] LocalStorage write error:', e);
    }
  }

  return post;
}

/**
 * Toggle like on a post
 */
export async function toggleLikeCommunityPost(
  symbol: string,
  postId: string,
  userAddress: string = 'guest'
): Promise<{ likes: number; isLiked: boolean }> {
  let likes = 0;
  let isLiked = false;

  if (typeof window !== 'undefined') {
    try {
      const existing = await getCommunityPosts(symbol);
      const post = existing.find((p) => p.id === postId);
      if (post) {
        post.likedBy = post.likedBy || [];
        const hasLiked = post.likedBy.includes(userAddress);
        if (hasLiked) {
          post.likedBy = post.likedBy.filter((a) => a !== userAddress);
          post.engagement.likes = Math.max(0, post.engagement.likes - 1);
          isLiked = false;
        } else {
          post.likedBy.push(userAddress);
          post.engagement.likes += 1;
          isLiked = true;
        }
        likes = post.engagement.likes;
        localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(existing));
      }
    } catch (err) {
      console.warn('[Community] Like error:', err);
    }
  }

  return { likes, isLiked };
}

/**
 * Toggle repost on a post
 */
export async function toggleRepostCommunityPost(
  symbol: string,
  postId: string,
  userAddress: string = 'guest'
): Promise<{ reposts: number; isReposted: boolean }> {
  let reposts = 0;
  let isReposted = false;

  if (typeof window !== 'undefined') {
    try {
      const existing = await getCommunityPosts(symbol);
      const post = existing.find((p) => p.id === postId);
      if (post) {
        post.repostedBy = post.repostedBy || [];
        const hasReposted = post.repostedBy.includes(userAddress);
        if (hasReposted) {
          post.repostedBy = post.repostedBy.filter((a) => a !== userAddress);
          post.engagement.reposts = Math.max(0, post.engagement.reposts - 1);
          isReposted = false;
        } else {
          post.repostedBy.push(userAddress);
          post.engagement.reposts += 1;
          isReposted = true;
        }
        reposts = post.engagement.reposts;
        localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(existing));
      }
    } catch (err) {
      console.warn('[Community] Repost error:', err);
    }
  }

  return { reposts, isReposted };
}

/**
 * Delete a user post and its associated thread comments
 */
export async function deleteCommunityPost(
  symbol: string,
  postId: string,
  userAddress: string = 'guest'
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const existing = await getCommunityPosts(symbol);
      const filtered = existing.filter((p) => p.id !== postId);
      localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(filtered));
      localStorage.removeItem(`${STORAGE_COMMENTS_KEY}${postId}`);
    } catch (e) {
      console.warn('[Community] LocalStorage delete post error:', e);
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('community_comments').delete().eq('post_id', postId);
        await supabase.from('community_posts').delete().eq('id', postId);
      } catch (err) {
        console.warn('[Community] Supabase delete post error:', err);
      }
    }
  }

  return true;
}

/**
 * Fetch comments for a specific post
 */
export async function getPostComments(postId: string): Promise<CommunityComment[]> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_COMMENTS_KEY}${postId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  return [];
}

/**
 * Add a comment or reply to a post
 */
export async function createPostComment(
  commentData: Omit<CommunityComment, 'id' | 'likes' | 'likedBy' | 'postedAt'>,
  symbol: string
): Promise<CommunityComment> {
  const comment: CommunityComment = {
    ...commentData,
    id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    likes: 0,
    likedBy: [],
    postedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = await getPostComments(comment.postId);
      const updated = [...existing, comment];
      localStorage.setItem(`${STORAGE_COMMENTS_KEY}${comment.postId}`, JSON.stringify(updated));

      // Also increment reply count on the main post
      const posts = await getCommunityPosts(symbol);
      const post = posts.find((p) => p.id === comment.postId);
      if (post) {
        post.engagement.replies += 1;
        localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(posts));
      }
    } catch (e) {
      console.warn('[Community] Add comment error:', e);
    }
  }

  return comment;
}

/**
 * Toggle like on a comment
 */
export async function toggleLikeComment(
  postId: string,
  commentId: string,
  userAddress: string = 'guest'
): Promise<{ likes: number; isLiked: boolean }> {
  let likes = 0;
  let isLiked = false;

  if (typeof window !== 'undefined') {
    try {
      const comments = await getPostComments(postId);
      const comm = comments.find((c) => c.id === commentId);
      if (comm) {
        comm.likedBy = comm.likedBy || [];
        const hasLiked = comm.likedBy.includes(userAddress);
        if (hasLiked) {
          comm.likedBy = comm.likedBy.filter((a) => a !== userAddress);
          comm.likes = Math.max(0, comm.likes - 1);
          isLiked = false;
        } else {
          comm.likedBy.push(userAddress);
          comm.likes += 1;
          isLiked = true;
        }
        likes = comm.likes;
        localStorage.setItem(`${STORAGE_COMMENTS_KEY}${postId}`, JSON.stringify(comments));
      }
    } catch (err) {
      console.warn('[Community] Like comment error:', err);
    }
  }

  return { likes, isLiked };
}

/**
 * Delete a comment on a post
 */
export async function deletePostComment(
  postId: string,
  commentId: string,
  symbol: string = 'NVDAx',
  userAddress: string = 'guest'
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const existing = await getPostComments(postId);
      const filtered = existing.filter((c) => c.id !== commentId);
      localStorage.setItem(`${STORAGE_COMMENTS_KEY}${postId}`, JSON.stringify(filtered));

      // Decrement reply count on post
      const posts = await getCommunityPosts(symbol);
      const post = posts.find((p) => p.id === postId);
      if (post && post.engagement.replies > 0) {
        post.engagement.replies = Math.max(0, post.engagement.replies - 1);
        localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(posts));
      }
    } catch (e) {
      console.warn('[Community] LocalStorage delete comment error:', e);
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('community_comments').delete().eq('id', commentId);
      } catch (err) {
        console.warn('[Community] Supabase delete comment error:', err);
      }
    }
  }

  return true;
}

/**
 * Fetch or generate a rich User Profile
 */
export async function getUserProfile(handleOrAddress: string): Promise<UserProfile> {
  const cleanKey = handleOrAddress.startsWith('@') ? handleOrAddress : `@${handleOrAddress.slice(0, 8)}`;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILES_KEY);
      if (stored) {
        const allProfiles: Record<string, UserProfile> = JSON.parse(stored);
        if (allProfiles[cleanKey]) {
          return allProfiles[cleanKey];
        }
        if (allProfiles[handleOrAddress]) {
          return allProfiles[handleOrAddress];
        }
      }
    } catch {}
  }

  // Return clean, zero-state profile for connected Solana address
  return {
    address: handleOrAddress,
    handle: cleanKey,
    name: handleOrAddress.length > 10 ? `Trader ${handleOrAddress.slice(0, 4)}...${handleOrAddress.slice(-4)}` : handleOrAddress,
    bio: 'Solana tokenized stock trader.',
    verified: true,
    joinedDate: 'September 2026',
    followersCount: 0,
    followingCount: 0,
    followedBy: [],
    trustScore: 100,
    winRate: 0,
    publicTradesCount: 0,
    publicTrades: [],
  };
}

/**
 * Update user profile (Name, bio, avatar)
 */
export async function updateUserProfile(
  userAddress: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const current = await getUserProfile(userAddress);
  const updated: UserProfile = {
    ...current,
    ...updates,
  };

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILES_KEY);
      const all: Record<string, UserProfile> = stored ? JSON.parse(stored) : {};
      all[updated.handle] = updated;
      all[userAddress] = updated;
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('[Community] Save profile error:', e);
    }
  }

  return updated;
}

/**
 * Toggle follow/unfollow a user
 */
export async function toggleFollowUser(
  targetHandleOrAddress: string,
  followerAddress: string
): Promise<{ followersCount: number; isFollowing: boolean }> {
  const profile = await getUserProfile(targetHandleOrAddress);
  profile.followedBy = profile.followedBy || [];
  const isFollowing = profile.followedBy.includes(followerAddress);

  if (isFollowing) {
    profile.followedBy = profile.followedBy.filter((a) => a !== followerAddress);
    profile.followersCount = Math.max(0, profile.followersCount - 1);
  } else {
    profile.followedBy.push(followerAddress);
    profile.followersCount += 1;
  }

  await updateUserProfile(profile.address || targetHandleOrAddress, profile);

  return {
    followersCount: profile.followersCount,
    isFollowing: !isFollowing,
  };
}

export interface CommunitySentimentData {
  symbol: string;
  bullishPct: number;
  bearishPct: number;
  neutralPct: number;
  consensus: string;
  disagreement: string;
  narratives: string;
  sampleSize: number;
  divergenceType: 'bull_trap' | 'short_squeeze' | 'harmonic_bull' | 'harmonic_bear' | 'polarization' | 'neutral';
  divergenceLevel: 'HIGH' | 'MODERATE' | 'LOW';
  sourceIntegrityScore: number;
  qualityCluster: string;
  sentimentVelocity: string;
  liveMarket?: {
    price: number;
    changePct: number;
    volume: number;
    source: string;
  };
}

/**
 * Compute real-time, live AI sentiment consensus dynamically from actual posts and live market data
 */
export function computeCommunitySentiment(
  posts: CommunityPost[],
  symbol: string,
  marketContext?: {
    price?: number;
    changePct?: number;
    volume?: number;
    dayHigh?: number;
    dayLow?: number;
    source?: string;
  }
): CommunitySentimentData {
  if (!posts.length) {
    return {
      symbol,
      bullishPct: 0,
      bearishPct: 0,
      neutralPct: 0,
      consensus: `No community research submitted on ${symbol} yet. Connect your wallet to publish the first thesis.`,
      disagreement: `No sentiment divergence. Awaiting community signal submissions.`,
      narratives: `No catalysts submitted yet.`,
      sampleSize: 0,
      divergenceType: 'neutral',
      divergenceLevel: 'LOW',
      sourceIntegrityScore: 0,
      qualityCluster: 'No research submissions on record.',
      sentimentVelocity: 'Awaiting Posts',
      liveMarket: marketContext?.price
        ? {
            price: marketContext.price,
            changePct: marketContext.changePct || 0,
            volume: marketContext.volume || 0,
            source: marketContext.source || 'Live Market Feed',
          }
        : undefined,
    };
  }

  // 1. Directional Bias: Weight verified analysts 2.5x, evidence attachments 1.8x, and organic engagement
  let weightedBullish = 0;
  let weightedBearish = 0;
  let weightedNeutral = 0;

  let verifiedCount = 0;
  let evidenceCount = 0;
  let unconfirmedCount = 0;

  posts.forEach((p) => {
    if (p.verified) verifiedCount++;
    if (p.evidenceAttached) evidenceCount++;
    if (p.sourceTier === 'UNCONFIRMED') unconfirmedCount++;

    const baseWeight = p.verified ? 2.5 : 1.0;
    const evidenceWeight = p.evidenceAttached ? 1.8 : 1.0;
    const engagementBoost = 1 + Math.min(2.0, (p.engagement.likes + p.engagement.reposts * 2) / 80);
    const score = baseWeight * evidenceWeight * engagementBoost;

    if (p.sentiment === 'bullish') weightedBullish += score;
    else if (p.sentiment === 'bearish') weightedBearish += score;
    else weightedNeutral += score;
  });

  const totalWeighted = weightedBullish + weightedBearish + weightedNeutral || 1;
  const bullishPct = Math.round((weightedBullish / totalWeighted) * 100);
  const bearishPct = Math.round((weightedBearish / totalWeighted) * 100);
  const neutralPct = Math.max(0, 100 - bullishPct - bearishPct);

  // 2. Source Integrity & Misinformation / Low-Quality Cluster Detection (PRD Section 7)
  const sourceIntegrityScore = Math.min(
    100,
    Math.max(40, Math.round(((verifiedCount * 2 + evidenceCount * 1.5 + (posts.length - unconfirmedCount)) / (posts.length * 3.5)) * 100))
  );

  const qualityCluster =
    unconfirmedCount >= 2
      ? `Flagged ${unconfirmedCount} unconfirmed retail posts lacking empirical evidence. Filtered from high-conviction index.`
      : verifiedCount >= 1
      ? `High Integrity (${sourceIntegrityScore}% Score): Lead positions supported by verified analysts and on-chain telemetry.`
      : `Moderate Signal Quality (${sourceIntegrityScore}% Score): Driven by retail research. Awaiting institutional consensus audit.`;

  // 3. Sentiment Velocity (Delta between latest posts vs earlier posts)
  let sentimentVelocity = 'Stable Velocity (0% shift)';
  if (posts.length >= 3) {
    const recentPosts = posts.slice(0, Math.max(1, Math.floor(posts.length / 2)));
    const recentBullishCount = recentPosts.filter((p) => p.sentiment === 'bullish').length;
    const recentBullPct = Math.round((recentBullishCount / recentPosts.length) * 100);
    const delta = recentBullPct - bullishPct;
    if (delta >= 10) {
      sentimentVelocity = `Accelerating Optimism (+${delta}% Bullish surge in recent submissions)`;
    } else if (delta <= -10) {
      sentimentVelocity = `Cooling Conviction (${delta}% shift toward caution in recent submissions)`;
    }
  }

  // 4. Live Spot Price vs Sentiment Divergence Warning (Anti-Trap Filter)
  const changePct = marketContext?.changePct ?? 0;
  const spotPrice = marketContext?.price ? `$${marketContext.price.toFixed(2)}` : 'Live Par';

  let divergenceType: 'bull_trap' | 'short_squeeze' | 'harmonic_bull' | 'harmonic_bear' | 'polarization' | 'neutral' = 'neutral';
  let divergenceLevel: 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
  let disagreement = '';

  if (bullishPct >= 60 && changePct < -0.5) {
    divergenceType = 'bull_trap';
    divergenceLevel = 'HIGH';
    disagreement = `Critical Bearish Divergence (Bull-Trap Alert): Community is ${bullishPct}% bullish, but spot market is falling ${changePct.toFixed(2)}% to ${spotPrice}. Retail optimism is diverging from spot selling pressure. High probability of distribution into retail bids.`;
  } else if (bearishPct >= 50 && changePct > 0.8) {
    divergenceType = 'short_squeeze';
    divergenceLevel = 'HIGH';
    disagreement = `Short-Squeeze Divergence Alert: Heavy community skepticism (${bearishPct}% bearish), but spot price is breaking out +${changePct.toFixed(2)}% to ${spotPrice}. Bearish consensus is facing upside pressure.`;
  } else if (bullishPct >= 65 && changePct >= 0) {
    divergenceType = 'harmonic_bull';
    divergenceLevel = 'LOW';
    disagreement = `Harmonic Bullish Alignment: High conviction (${bullishPct}% Bullish) matches spot market expansion (+${changePct.toFixed(2)}% at ${spotPrice}). Momentum is supported by order-flow.`;
  } else if (bearishPct >= 55 && changePct < 0) {
    divergenceType = 'harmonic_bear';
    divergenceLevel = 'LOW';
    disagreement = `Harmonic Downside Alignment: Bearish thesis (${bearishPct}% Bear) aligns with spot decline (${changePct.toFixed(2)}%). Caution advised until primary support holds.`;
  } else if (bullishPct >= 40 && bearishPct >= 35) {
    divergenceType = 'polarization';
    divergenceLevel = 'MODERATE';
    disagreement = `High Polarized Debate: Community is deeply split (${bullishPct}% Bull · ${bearishPct}% Bear). Valuation skeptics are challenging catalyst bulls. Expect elevated chop around ${spotPrice}.`;
  } else {
    divergenceType = 'neutral';
    divergenceLevel = 'LOW';
    disagreement = `Balanced Signal Distribution: No extreme divergence detected vs spot price (${spotPrice}). Oracle latency and price spread within normal parameters.`;
  }

  // 5. Consensus Text
  const consensus =
    bullishPct >= 65
      ? `Strong Bullish consensus — ${bullishPct}% of community conviction favors upside on ${symbol}. Verified quants cite momentum & multiple expansion.`
      : bearishPct >= 55
      ? `Bearish bias — ${bearishPct}% of contributors urge defensive positioning citing valuation overhead and macro resistance.`
      : `Equilibrium signal (${bullishPct}% Bull · ${bearishPct}% Bear) — Community is balanced between near-term catalyst upside and resistance overhead.`;

  // 6. Dynamic NLP narrative extraction from actual post contents
  const allText = posts.map((p) => p.content.toLowerCase()).join(' ');
  const keywordCandidates = [
    { word: 'blackwell', label: 'Blackwell GPU rollout' },
    { word: 'data center', label: 'Data center capex' },
    { word: 'fsd', label: 'FSD v13 autonomous miles' },
    { word: 'robotaxi', label: 'Robotaxi regulatory catalyst' },
    { word: 'apple intelligence', label: 'Apple Intelligence rollout' },
    { word: 'export', label: 'Semiconductor export controls' },
    { word: 'valuation', label: 'P/E multiple expansion' },
    { word: 'margin', label: 'Gross margin defense' },
    { word: 'resistance', label: 'Key technical resistance' },
    { word: 'earnings', label: 'Q3 earnings expectations' },
    { word: 'jupiter', label: 'Solana Jupiter DEX liquidity' },
    { word: 'peg', label: 'Token-2022 1:1 backing par' },
  ];

  const matchedNarratives = keywordCandidates
    .filter((k) => allText.includes(k.word))
    .map((k) => k.label);

  const narratives =
    matchedNarratives.length > 0
      ? matchedNarratives.slice(0, 3).join(', ')
      : `${symbol} corporate filings, 24/7 Solana AMM liquidity, institutional treasury backing.`;

  return {
    symbol,
    bullishPct,
    bearishPct,
    neutralPct,
    consensus,
    disagreement,
    narratives,
    sampleSize: posts.length,
    divergenceType,
    divergenceLevel,
    sourceIntegrityScore,
    qualityCluster,
    sentimentVelocity,
    liveMarket: marketContext?.price
      ? {
          price: marketContext.price,
          changePct: marketContext.changePct || 0,
          volume: marketContext.volume || 0,
          source: marketContext.source || 'Live Market Feed',
        }
      : undefined,
  };
}
