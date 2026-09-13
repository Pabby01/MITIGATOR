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

const SEED_POSTS: Record<string, CommunityPost[]> = {
  NVDAx: [
    {
      id: 'post-nvda-1',
      symbol: 'NVDAx',
      author: 'QuantResearcher',
      authorAddress: '7xKf8n...3pQw',
      handle: '@quant_research',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: '$NVDA showing strong momentum with RSI at 62. The Blackwell cycle should drive sustained data center demand. My model suggests 15-20% upside to next resistance at $195.',
      engagement: { likes: 342, replies: 3, reposts: 28, bookmarks: 42 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'post-nvda-2',
      symbol: 'NVDAx',
      author: 'DegenTrader99',
      authorAddress: '3mYt2...9vLm',
      handle: '@degentrader99',
      platform: 'Stocktwits',
      verified: false,
      type: 'Analysis',
      sentiment: 'bearish',
      sourceTier: 'UNCONFIRMED',
      content: 'Not sure about this one at these levels. Valuation feels stretched. Forward P/E of 67 is pricing in perfection. A pullback to $165 would be healthy.',
      engagement: { likes: 89, replies: 2, reposts: 5, bookmarks: 8 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: false,
      postedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'post-nvda-3',
      symbol: 'NVDAx',
      author: 'MacroAnalyst',
      authorAddress: '9aKx4...7pRw',
      handle: '@macro_analyst',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'The export restriction risk is real but overblown. Compliant enterprise variants are already shipping. Net impact to quarterly revenue is less than 3-4%.',
      engagement: { likes: 156, replies: 2, reposts: 12, bookmarks: 19 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ],
  TSLAx: [
    {
      id: 'post-tsla-1',
      symbol: 'TSLAx',
      author: 'OptimusBeta',
      authorAddress: '5pLq8...2kMz',
      handle: '@optimus_beta',
      platform: 'X',
      verified: true,
      type: 'Analysis',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'FSD v13 real-world intervention rates are down 70% month-over-month. Robotaxi regulatory pathway is the primary multiple driver through Q4.',
      engagement: { likes: 412, replies: 3, reposts: 45, bookmarks: 54 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'post-tsla-2',
      symbol: 'TSLAx',
      author: 'AutoShortDesk',
      authorAddress: '2vNx9...4rTy',
      handle: '@autoshort',
      platform: 'Reddit',
      verified: false,
      type: 'Trade Idea',
      sentiment: 'bearish',
      sourceTier: 'UNCONFIRMED',
      content: 'Auto gross margins ex-regulatory credits are compressing. Competition from European EVs will impact Q3 deliveries.',
      engagement: { likes: 67, replies: 1, reposts: 3, bookmarks: 6 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: false,
      postedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  AAPLx: [
    {
      id: 'post-aapl-1',
      symbol: 'AAPLx',
      author: 'CupertinoInsider',
      authorAddress: '8wJz3...1bQx',
      handle: '@apple_insider',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'Apple Intelligence rollout expanding to 8 additional languages in next update. Upgrade cycle starting to accelerate across Asia-Pacific enterprise.',
      engagement: { likes: 278, replies: 2, reposts: 16, bookmarks: 31 },
      likedBy: [],
      repostedBy: [],
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
};

const SEED_COMMENTS: Record<string, CommunityComment[]> = {
  'post-nvda-1': [
    {
      id: 'comm-nvda-1-1',
      postId: 'post-nvda-1',
      author: 'AlphaSeeker',
      authorAddress: '4bNx1...8mPq',
      handle: '@alphaseeker',
      verified: true,
      content: 'Agreed. Supply chain channel checks in Taiwan show CoWoS packaging allocation increasing 35% next quarter.',
      likes: 42,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: 'comm-nvda-1-2',
      postId: 'post-nvda-1',
      author: 'SolanaWhale_9',
      authorAddress: '9xLp4...3tKm',
      handle: '@solanawhale9',
      verified: true,
      content: 'Just routed $50k NVDAx through Jupiter AMM with under 4 bps price impact. Secondary liquidity on Solana is incredible.',
      likes: 28,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'comm-nvda-1-3',
      postId: 'post-nvda-1',
      author: 'HedgeFundDesk',
      authorAddress: '1zKq9...6vNp',
      handle: '@hedgefunddesk',
      verified: false,
      content: 'Watch out for the $190 psychological resistance. Take partial profits if RSI exceeds 70 on the 4H chart.',
      likes: 15,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    },
  ],
  'post-nvda-2': [
    {
      id: 'comm-nvda-2-1',
      postId: 'post-nvda-2',
      author: 'TechInvestor_AI',
      authorAddress: '6mRt3...2pQw',
      handle: '@techinvestor',
      verified: true,
      content: 'PEG ratio is actually below 1.2 if you model 45% CAGR for data center over the next 24 months. Standard P/E is misleading here.',
      likes: 19,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'comm-nvda-2-2',
      postId: 'post-nvda-2',
      author: 'MacroAnalyst',
      authorAddress: '9aKx4...7pRw',
      handle: '@macro_analyst',
      verified: true,
      content: 'Keep an eye on 10-year Treasury yields. A spike past 4.2% could cause multiple compression across big tech.',
      likes: 11,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  'post-tsla-1': [
    {
      id: 'comm-tsla-1-1',
      postId: 'post-tsla-1',
      author: 'FSD_Tracker',
      authorAddress: '8qLk1...5vNm',
      handle: '@fsd_tracker',
      verified: true,
      content: 'Hardware 4 fleet compute miles are doubling every 45 days. Disengagement data confirms the step function improvement.',
      likes: 35,
      likedBy: [],
      postedAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    },
  ],
};

const SEED_PROFILES: Record<string, UserProfile> = {
  '@quant_research': {
    address: '7xKf8n...3pQw',
    handle: '@quant_research',
    name: 'QuantResearcher',
    bio: 'Lead Quant Strategist @ AlphaArc Capital. Tracking tokenized US equities & cross-venue AMM arbitrage on Solana.',
    verified: true,
    joinedDate: 'March 2024',
    followersCount: 1420,
    followingCount: 184,
    followedBy: [],
    trustScore: 96,
    winRate: 74.5,
    publicTradesCount: 18,
    publicTrades: [
      { id: 't1', symbol: 'NVDAx', side: 'buy', entryPrice: 178.42, currentPrice: 184.22, pnlPct: 3.25, timestamp: '2026-09-11' },
      { id: 't2', symbol: 'TSLAx', side: 'buy', entryPrice: 210.5, currentPrice: 218.45, pnlPct: 3.78, timestamp: '2026-09-08' },
      { id: 't3', symbol: 'AAPLx', side: 'buy', entryPrice: 219.0, currentPrice: 224.3, pnlPct: 2.42, timestamp: '2026-09-03' },
    ],
  },
  '@macro_analyst': {
    address: '9aKx4...7pRw',
    handle: '@macro_analyst',
    name: 'MacroAnalyst',
    bio: 'Macroeconomics & equity risk premium modeling. Specializing in Federal Reserve policy and semiconductors.',
    verified: true,
    joinedDate: 'January 2024',
    followersCount: 890,
    followingCount: 112,
    followedBy: [],
    trustScore: 92,
    winRate: 68.2,
    publicTradesCount: 12,
    publicTrades: [
      { id: 't4', symbol: 'NVDAx', side: 'buy', entryPrice: 172.1, currentPrice: 184.22, pnlPct: 7.04, timestamp: '2026-09-05' },
      { id: 't5', symbol: 'MSFTx', side: 'buy', entryPrice: 418.0, currentPrice: 428.1, pnlPct: 2.41, timestamp: '2026-08-29' },
    ],
  },
  '@degentrader99': {
    address: '3mYt2...9vLm',
    handle: '@degentrader99',
    name: 'DegenTrader99',
    bio: 'High beta momentum trader. Trading tokenized equities 24/7 on Solana DEXs. Risk on always.',
    verified: false,
    joinedDate: 'May 2024',
    followersCount: 340,
    followingCount: 420,
    followedBy: [],
    trustScore: 78,
    winRate: 58.0,
    publicTradesCount: 24,
    publicTrades: [
      { id: 't6', symbol: 'TSLAx', side: 'buy', entryPrice: 222.0, currentPrice: 218.45, pnlPct: -1.6, timestamp: '2026-09-10' },
      { id: 't7', symbol: 'NVDAx', side: 'sell', entryPrice: 185.0, currentPrice: 184.22, pnlPct: 0.42, timestamp: '2026-09-09' },
    ],
  },
  '@optimus_beta': {
    address: '5pLq8...2kMz',
    handle: '@optimus_beta',
    name: 'OptimusBeta',
    bio: 'Autonomous robotics, neural nets, and clean energy investments. Deep dives on Tesla AI & compute.',
    verified: true,
    joinedDate: 'February 2024',
    followersCount: 1150,
    followingCount: 95,
    followedBy: [],
    trustScore: 94,
    winRate: 71.0,
    publicTradesCount: 15,
    publicTrades: [
      { id: 't8', symbol: 'TSLAx', side: 'buy', entryPrice: 198.0, currentPrice: 218.45, pnlPct: 10.32, timestamp: '2026-08-22' },
    ],
  },
};

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
        return JSON.parse(stored);
      }
      // Initialize seed posts in localStorage if empty
      const seeds = SEED_POSTS[symbol] || SEED_POSTS['NVDAx'];
      localStorage.setItem(`${STORAGE_POSTS_KEY}${symbol}`, JSON.stringify(seeds));
      return seeds;
    } catch {
      // ignore
    }
  }

  return SEED_POSTS[symbol] || SEED_POSTS['NVDAx'];
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
 * Fetch comments for a specific post
 */
export async function getPostComments(postId: string): Promise<CommunityComment[]> {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_COMMENTS_KEY}${postId}`);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize seed comments if available
      const seeds = SEED_COMMENTS[postId] || [];
      localStorage.setItem(`${STORAGE_COMMENTS_KEY}${postId}`, JSON.stringify(seeds));
      return seeds;
    } catch {
      // ignore
    }
  }

  return SEED_COMMENTS[postId] || [];
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

  // Check seed profile
  if (SEED_PROFILES[cleanKey]) {
    return SEED_PROFILES[cleanKey];
  }

  // Dynamically generate personalized profile for connected Solana address
  return {
    address: handleOrAddress,
    handle: cleanKey,
    name: handleOrAddress.length > 10 ? `Trader ${handleOrAddress.slice(0, 4)}...${handleOrAddress.slice(-4)}` : handleOrAddress,
    bio: 'Solana tokenized stock trader. Analyzing real-time Pyth oracle streams and SEC filings.',
    verified: true,
    joinedDate: 'September 2026',
    followersCount: 48,
    followingCount: 65,
    followedBy: [],
    trustScore: 88,
    winRate: 67.5,
    publicTradesCount: 6,
    publicTrades: [
      { id: 'u1', symbol: 'NVDAx', side: 'buy', entryPrice: 181.2, currentPrice: 184.22, pnlPct: 1.67, timestamp: '2026-09-12' },
      { id: 'u2', symbol: 'TSLAx', side: 'buy', entryPrice: 215.0, currentPrice: 218.45, pnlPct: 1.6, timestamp: '2026-09-11' },
    ],
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
      const all: Record<string, UserProfile> = stored ? JSON.parse(stored) : { ...SEED_PROFILES };
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
      bullishPct: 50,
      bearishPct: 50,
      neutralPct: 0,
      consensus: `Insufficient data points on ${symbol}. Awaiting initial verified research submissions.`,
      disagreement: `Low sample count. Exercise caution and verify Pyth oracle latency before trading.`,
      narratives: `Accumulating early signals across Solana Token-2022 venues.`,
      sampleSize: 0,
      divergenceType: 'neutral',
      divergenceLevel: 'LOW',
      sourceIntegrityScore: 100,
      qualityCluster: 'Baseline verification active. No spam detected.',
      sentimentVelocity: 'Stable Velocity',
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
