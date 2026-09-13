import { getSupabase, isSupabaseConfigured } from './supabase';
import type { SourceTier } from '@/types';

export interface CommunityPost {
  id: string;
  symbol: string;
  author: string;
  authorAddress?: string;
  handle: string;
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
  };
  evidenceAttached: boolean;
  postedAt: string;
}

const SEED_POSTS: Record<string, CommunityPost[]> = {
  NVDAx: [
    {
      id: 'post-nvda-1',
      symbol: 'NVDAx',
      author: 'QuantResearcher',
      authorAddress: '7xKf...3pQw',
      handle: '@quant_research · X',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: '$NVDA showing strong momentum with RSI at 62. The Blackwell cycle should drive sustained data center demand. My model suggests 15-20% upside to next resistance.',
      engagement: { likes: 342, replies: 47, reposts: 28 },
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'post-nvda-2',
      symbol: 'NVDAx',
      author: 'DegenTrader99',
      handle: '@degentrader99 · Stocktwits',
      platform: 'Stocktwits',
      verified: false,
      type: 'Analysis',
      sentiment: 'bearish',
      sourceTier: 'UNCONFIRMED',
      content: 'Not sure about this one at these levels. Valuation feels stretched. P/E of 67 is pricing in perfection.',
      engagement: { likes: 89, replies: 23, reposts: 5 },
      evidenceAttached: false,
      postedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'post-nvda-3',
      symbol: 'NVDAx',
      author: 'MacroAnalyst',
      handle: '@macro_analyst · X',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'The export restriction risk is real but overblown. Compliant variants are already shipping. Net impact to revenue is maybe 3-4%.',
      engagement: { likes: 156, replies: 31, reposts: 12 },
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
  ],
  TSLAx: [
    {
      id: 'post-tsla-1',
      symbol: 'TSLAx',
      author: 'OptimusBeta',
      handle: '@optimus_beta · X',
      platform: 'X',
      verified: true,
      type: 'Analysis',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'FSD v13 real-world intervention rates are down 70% month-over-month. Robotaxi regulatory pathway is the primary multiple driver.',
      engagement: { likes: 412, replies: 88, reposts: 45 },
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'post-tsla-2',
      symbol: 'TSLAx',
      author: 'AutoShortDesk',
      handle: '@autoshort · Reddit',
      platform: 'Reddit',
      verified: false,
      type: 'Trade Idea',
      sentiment: 'bearish',
      sourceTier: 'UNCONFIRMED',
      content: 'Auto gross margins ex-regulatory credits are compressing. Competition from BYD in Europe will impact Q3 deliveries.',
      engagement: { likes: 67, replies: 34, reposts: 3 },
      evidenceAttached: false,
      postedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  AAPLx: [
    {
      id: 'post-aapl-1',
      symbol: 'AAPLx',
      author: 'CupertinoInsider',
      handle: '@apple_insider · X',
      platform: 'X',
      verified: true,
      type: 'Trade Idea',
      sentiment: 'bullish',
      sourceTier: 'SOCIAL',
      content: 'Apple Intelligence rollout expanding to 8 additional languages in next update. Upgrades cycle starting to accelerate in Asia-Pacific.',
      engagement: { likes: 278, replies: 19, reposts: 16 },
      evidenceAttached: true,
      postedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
  ],
};

const STORAGE_KEY_PREFIX = 'mitigator_community_posts_';

/**
 * Fetch community posts for an asset
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
            platform: d.platform,
            verified: d.verified,
            type: d.type,
            sentiment: d.sentiment,
            sourceTier: d.source_tier,
            content: d.content,
            engagement: d.engagement || { likes: 0, replies: 0, reposts: 0 },
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
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${symbol}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback to seeds
  return SEED_POSTS[symbol] || SEED_POSTS['NVDAx'];
}

/**
 * Add a new user post
 */
export async function createCommunityPost(
  newPost: Omit<CommunityPost, 'id' | 'postedAt' | 'engagement'>
): Promise<CommunityPost> {
  const post: CommunityPost = {
    ...newPost,
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    postedAt: new Date().toISOString(),
    engagement: { likes: 1, replies: 0, reposts: 0 },
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
      const updated = [post, ...existing];
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${post.symbol}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Community] LocalStorage write error:', e);
    }
  }

  return post;
}

/**
 * Like a post
 */
export async function likeCommunityPost(symbol: string, postId: string): Promise<number> {
  let updatedLikes = 1;

  if (typeof window !== 'undefined') {
    try {
      const existing = await getCommunityPosts(symbol);
      const post = existing.find((p) => p.id === postId);
      if (post) {
        post.engagement.likes += 1;
        updatedLikes = post.engagement.likes;
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${symbol}`, JSON.stringify(existing));
      }
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.rpc('increment_likes', { post_id: postId });
      } catch (e) {
        console.warn('[Community] Supabase RPC increment error:', e);
      }
    }
  }

  return updatedLikes;
}

/**
 * Compute real-time sentiment consensus for an asset
 */
export function computeCommunitySentiment(posts: CommunityPost[], symbol: string) {
  if (!posts.length) {
    return {
      bullishPct: 65,
      bearishPct: 20,
      neutralPct: 15,
      consensus: `Moderate institutional accumulation observed on ${symbol}.`,
      disagreement: `Valuation multiples are contested against broader macro rates.`,
      narratives: `Token-2022 on-chain volume, corporate liquidity, product cycle demand.`,
    };
  }

  const bullish = posts.filter((p) => p.sentiment === 'bullish').length;
  const bearish = posts.filter((p) => p.sentiment === 'bearish').length;
  const total = posts.length;

  const bullishPct = Math.round((bullish / total) * 100);
  const bearishPct = Math.round((bearish / total) * 100);
  const neutralPct = Math.max(0, 100 - bullishPct - bearishPct);

  const consensus =
    bullishPct >= 60
      ? `Strong Bullish consensus — ${bullishPct}% of community posts favor upside momentum on ${symbol}.`
      : bearishPct >= 50
      ? `Cautious / Bearish tilt — ${bearishPct}% of contributors cite short-term valuation and macro headwinds.`
      : `Neutral equilibrium — Community is evenly divided between growth catalysts and risk factors.`;

  const disagreement =
    bearish > 0
      ? `${bearishPct}% of posts highlight resistance or valuation compression concerns.`
      : `Broad optimism with low dissenting signals; check oracle confidence before entering.`;

  const narratives =
    symbol === 'NVDAx'
      ? 'Blackwell GPU rollout, data center demand capex, AI compute scale.'
      : symbol === 'TSLAx'
      ? 'FSD rollout, autonomous robotaxi milestones, energy storage margins.'
      : symbol === 'AAPLx'
      ? 'Apple Intelligence ecosystem upgrades, services revenue growth, privacy moat.'
      : 'Corporate earnings cadence, dividend yield, institutional treasury backing.';

  return {
    bullishPct,
    bearishPct,
    neutralPct,
    consensus,
    disagreement,
    narratives,
  };
}
