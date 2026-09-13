'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  MessageSquare,
  Brain,
  ShieldCheck,
  TrendingUp,
  Heart,
  Repeat,
  Bookmark,
  Share2,
  Send,
  Sparkles,
  Wallet,
  Info,
  User,
  Trash2,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets } from '@/lib/mock-data';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { CommunityPost } from '@/lib/services/community-service';
import { PostThreadModal } from '@/components/community/PostThreadModal';
import { UserProfileModal } from '@/components/community/UserProfileModal';
import { SentimentExplainerModal } from '@/components/community/SentimentExplainerModal';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const assets = getAllAssets();
  const { connected, shortAddress, address, setIsModalOpen } = useSolanaWallet();
  const userAddr = address || shortAddress || 'guest';
  const [symbol, setSymbol] = useState('NVDAx');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedThreadPost, setSelectedThreadPost] = useState<CommunityPost | null>(null);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);

  const [selectedProfileHandle, setSelectedProfileHandle] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  // New post compose state
  const [newContent, setNewContent] = useState('');
  const [newSentiment, setNewSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [newType, setNewType] = useState<'Trade Idea' | 'Analysis' | 'Question'>('Trade Idea');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bookmarks local state
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Fetch posts from API
  const fetchPosts = async (targetSymbol: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/community?symbol=${targetSymbol}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setSentimentData(data.sentiment || null);
      }
    } catch (err) {
      console.warn('Failed to load community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(symbol);
  }, [symbol]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    if (!connected) {
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const authorDisplay = shortAddress || 'Solana Trader';
      const handleDisplay = shortAddress ? `@${shortAddress.slice(0, 6)}` : '@trader';

      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: {
            symbol,
            author: authorDisplay,
            authorAddress: address || shortAddress,
            handle: handleDisplay,
            platform: 'MITIGATOR',
            verified: true,
            type: newType,
            sentiment: newSentiment,
            sourceTier: 'SOCIAL',
            content: newContent.trim(),
            evidenceAttached: true,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.post) {
          setPosts((prev) => [data.post, ...prev]);
          setNewContent('');
          // Refetch sentiment dynamically
          fetchPosts(symbol);
        }
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          p.likedBy = p.likedBy || [];
          const userLiked = p.likedBy.includes(userAddr);
          const nextLiked = userLiked ? p.likedBy.filter((a) => a !== userAddr) : [...p.likedBy, userAddr];
          return {
            ...p,
            engagement: {
              ...p.engagement,
              likes: userLiked ? Math.max(0, p.engagement.likes - 1) : p.engagement.likes + 1,
            },
            likedBy: nextLiked,
          };
        }
        return p;
      })
    );

    // If modal open, sync selected post
    if (selectedThreadPost && selectedThreadPost.id === postId) {
      setSelectedThreadPost((prev) => {
        if (!prev) return null;
        const userLiked = (prev.likedBy || []).includes(userAddr);
        return {
          ...prev,
          engagement: {
            ...prev.engagement,
            likes: userLiked ? Math.max(0, prev.engagement.likes - 1) : prev.engagement.likes + 1,
          },
          likedBy: userLiked
            ? (prev.likedBy || []).filter((a) => a !== userAddr)
            : [...(prev.likedBy || []), userAddr],
        };
      });
    }

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          symbol,
          postId,
          userAddress: userAddr,
        }),
      });
    } catch (err) {
      console.warn('Failed to like post:', err);
    }
  };

  const handleRepost = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          p.repostedBy = p.repostedBy || [];
          const userReposted = p.repostedBy.includes(userAddr);
          const nextReposted = userReposted
            ? p.repostedBy.filter((a) => a !== userAddr)
            : [...p.repostedBy, userAddr];
          return {
            ...p,
            engagement: {
              ...p.engagement,
              reposts: userReposted
                ? Math.max(0, p.engagement.reposts - 1)
                : p.engagement.reposts + 1,
            },
            repostedBy: nextReposted,
          };
        }
        return p;
      })
    );

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'repost',
          symbol,
          postId,
          userAddress: userAddr,
        }),
      });
    } catch (err) {
      console.warn('Failed to repost:', err);
    }
  };

  const handleToggleBookmark = (postId: string) => {
    setBookmarkedIds((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const openThread = (post: CommunityPost) => {
    setSelectedThreadPost(post);
    setIsThreadModalOpen(true);
  };

  const openProfile = (handle: string) => {
    setSelectedProfileHandle(handle);
    setIsProfileModalOpen(true);
  };

  const openMyProfile = () => {
    if (connected && (address || shortAddress)) {
      openProfile(address || shortAddress);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleDeletePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && !window.confirm('Delete this trade idea thesis?')) return;

    setPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_post',
          symbol,
          postId,
          userAddress: userAddr,
        }),
      });
    } catch (err) {
      console.warn('Failed to delete post:', err);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Community Feed
            <span className="text-xs font-mono font-normal text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              X-Interactive
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Decentralized stock signals, peer-reviewed theses, and live NLP sentiment consensus
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openMyProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-card/60 hover:bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-primary" />
            <span>My Profile</span>
          </button>

          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Solana Social Layer
          </span>
        </div>
      </div>

      {/* Asset selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
        {assets.map((a) => (
          <button
            key={a.tokenizedAsset.symbol}
            onClick={() => setSymbol(a.tokenizedAsset.symbol)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-colors cursor-pointer',
              symbol === a.tokenizedAsset.symbol
                ? 'border-primary/40 bg-primary/15 text-primary font-semibold shadow-xs'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-card/40'
            )}
          >
            {a.tokenizedAsset.symbol}
          </button>
        ))}
      </div>

      {/* AI Sentiment Consensus Panel */}
      {sentimentData && (
        <GlassPanel className="p-5 border-primary/25 bg-card/70 relative">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                  AI Sentiment Consensus — {symbol}
                </h2>
                {/* Interactive Explainer Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsExplainerOpen(true)}
                  className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  title="What is AI Sentiment Consensus? Click to learn how it works"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Real-time Market Grounding Telemetry */}
              {sentimentData.liveMarket && (
                <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-card/90 border border-border/80">
                  <span className="text-muted-foreground">Spot:</span>
                  <span className="text-foreground font-bold">${sentimentData.liveMarket.price.toFixed(2)}</span>
                  <span
                    className={cn(
                      'font-semibold',
                      sentimentData.liveMarket.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}
                  >
                    {sentimentData.liveMarket.changePct >= 0 ? '+' : ''}
                    {sentimentData.liveMarket.changePct.toFixed(2)}%
                  </span>
                  {sentimentData.liveMarket.volume > 0 && (
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      · Vol {(sentimentData.liveMarket.volume / 1e6).toFixed(1)}M
                    </span>
                  )}
                </div>
              )}

              {/* Sentiment Ratio */}
              <div className="flex items-center gap-2 text-xs font-mono">
                {sentimentData.sampleSize === 0 ? (
                  <span className="text-muted-foreground font-medium px-2.5 py-0.5 rounded bg-card/90 border border-border/80">
                    0 Submissions (Awaiting First Post)
                  </span>
                ) : (
                  <>
                    <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {sentimentData.bullishPct}% Bullish
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                      {sentimentData.bearishPct}% Bearish
                    </span>
                    {sentimentData.neutralPct > 0 && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-zinc-400 font-medium">{sentimentData.neutralPct}% Neutral</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {/* 1. Directional Bias */}
            <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase font-mono">
                  1. Directional Bias
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">2.5x Quant Weight</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.consensus}</p>
            </div>

            {/* 2. Divergence Warning (Anti-Trap) */}
            <div
              className={cn(
                'rounded-xl p-3.5 space-y-1 transition-all',
                sentimentData.divergenceType === 'bull_trap'
                  ? 'border border-red-500/40 bg-red-500/10'
                  : sentimentData.divergenceType === 'short_squeeze'
                  ? 'border border-amber-500/40 bg-amber-500/10'
                  : sentimentData.divergenceType === 'harmonic_bull'
                  ? 'border border-emerald-500/40 bg-emerald-500/10'
                  : 'border border-amber-500/30 bg-amber-500/5'
              )}
            >
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    'text-[10px] font-bold tracking-widest uppercase font-mono',
                    sentimentData.divergenceType === 'bull_trap'
                      ? 'text-red-400'
                      : sentimentData.divergenceType === 'short_squeeze'
                      ? 'text-amber-400'
                      : sentimentData.divergenceType === 'harmonic_bull'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  )}
                >
                  2. Divergence Warning
                </p>
                <span
                  className={cn(
                    'text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold tracking-wider',
                    sentimentData.divergenceType === 'bull_trap'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                      : sentimentData.divergenceType === 'short_squeeze'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : sentimentData.divergenceType === 'harmonic_bull'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {sentimentData.divergenceType === 'bull_trap'
                    ? 'BULL-TRAP ALERT'
                    : sentimentData.divergenceType === 'short_squeeze'
                    ? 'SQUEEZE RISK'
                    : sentimentData.divergenceType === 'harmonic_bull'
                    ? 'HARMONIC ALIGNED'
                    : 'ANTI-TRAP FILTER'}
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.disagreement}</p>
            </div>

            {/* 3. Key Catalysts */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-mono">
                  3. Key Catalysts
                </p>
                <span className="text-[10px] text-cyan-300/80 font-mono">NLP Mined</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.narratives}</p>
            </div>
          </div>

          {/* Telemetry & Quality Cluster Status Row */}
          <div className="mt-3.5 grid sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span>{sentimentData.qualityCluster}</span>
            </div>
            <div className="flex items-center justify-start sm:justify-end gap-3 font-mono">
              <span className="text-zinc-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                {sentimentData.sentimentVelocity}
              </span>
              <button
                onClick={() => setIsExplainerOpen(true)}
                className="text-primary hover:underline text-[11px] cursor-pointer"
              >
                How it works &rarr;
              </button>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Interactive Compose Box */}
      <GlassPanel className="p-4 border border-border/80">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Post thesis to {symbol} Board
            </span>
            <div className="flex items-center gap-2">
              {/* Type Select */}
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="bg-card/80 border border-border text-xs rounded-lg px-2.5 py-1 text-foreground outline-none"
              >
                <option value="Trade Idea">Trade Idea</option>
                <option value="Analysis">Analysis</option>
                <option value="Question">Question</option>
              </select>

              {/* Sentiment Select */}
              <div className="flex items-center rounded-lg border border-border p-0.5 bg-card/60 text-xs">
                <button
                  type="button"
                  onClick={() => setNewSentiment('bullish')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                    newSentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-muted-foreground'
                  )}
                >
                  Bull
                </button>
                <button
                  type="button"
                  onClick={() => setNewSentiment('bearish')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                    newSentiment === 'bearish' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-muted-foreground'
                  )}
                >
                  Bear
                </button>
                <button
                  type="button"
                  onClick={() => setNewSentiment('neutral')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                    newSentiment === 'neutral' ? 'bg-zinc-500/20 text-zinc-300 font-bold' : 'text-muted-foreground'
                  )}
                >
                  Neutral
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={
                connected
                  ? `Share your thesis, technical level, or risk alert on ${symbol}...`
                  : 'Connect Solana wallet to post and build your verified quant profile...'
              }
              className="flex-1 bg-background/50 border border-border/80 rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            {connected ? (
              <button
                type="submit"
                disabled={isSubmitting || !newContent.trim()}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" /> Post
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Wallet className="h-3.5 w-3.5" /> Connect
              </button>
            )}
          </div>
        </form>
      </GlassPanel>

      {/* Posts Feed (X Style) */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-mono animate-pulse">
            Loading real-time community feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl">
            No posts for {symbol} yet. Be the first to share an analysis!
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => {
              const userAddress = address || shortAddress || 'guest';
              const isLiked = post.likedBy ? post.likedBy.includes(userAddress) : false;
              const isReposted = post.repostedBy ? post.repostedBy.includes(userAddress) : false;
              const isBookmarked = bookmarkedIds[post.id] || false;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassPanel
                    hover
                    className="p-4 transition-colors cursor-pointer group"
                    onClick={() => openThread(post)}
                  >
                    {/* Author & Header */}
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProfile(post.handle);
                          }}
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-xs text-foreground hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                        >
                          {post.author.slice(0, 2).toUpperCase()}
                        </button>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openProfile(post.handle);
                              }}
                              className="text-sm font-bold text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
                            >
                              {post.author}
                            </button>
                            {post.verified && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProfile(post.handle);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono cursor-pointer"
                          >
                            {post.handle}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-card border border-border">
                          {post.type}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                            post.sentiment === 'bullish'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : post.sentiment === 'bearish'
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30'
                          )}
                        >
                          {post.sentiment}
                        </span>
                        <SourceBadge tier={post.sourceTier} />
                        {(post.authorAddress === userAddr || (userAddr === 'guest' && !post.authorAddress)) && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePost(post.id, e)}
                            className="p-1 rounded text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete this post"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed text-foreground/90 pl-13">
                      {post.content}
                    </p>

                    {/* Meta & Evidence row */}
                    <div className="pl-13 pt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      {post.evidenceAttached && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Evidence Linked
                        </span>
                      )}
                      <span>·</span>
                      <span>
                        {new Date(post.postedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Interactive Action Icons (Like, Reply, Repost, Bookmark) */}
                    <div className="pl-13 pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 mt-3">
                      {/* Reply Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openThread(post);
                        }}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group/btn"
                      >
                        <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        <span>{post.engagement.replies}</span>
                      </button>

                      {/* Repost Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRepost(post.id);
                        }}
                        className={cn(
                          'flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer group/btn',
                          isReposted && 'text-emerald-400 font-bold'
                        )}
                      >
                        <Repeat className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        <span>{post.engagement.reposts}</span>
                      </button>

                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={cn(
                          'flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer group/btn',
                          isLiked && 'text-rose-500 font-bold'
                        )}
                      >
                        <Heart
                          className={cn(
                            'h-4 w-4 group-hover/btn:scale-110 transition-transform',
                            isLiked && 'fill-rose-500 text-rose-500'
                          )}
                        />
                        <span>{post.engagement.likes}</span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(post.id);
                        }}
                        className={cn(
                          'flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group/btn',
                          isBookmarked && 'text-primary font-bold'
                        )}
                      >
                        <Bookmark
                          className={cn(
                            'h-4 w-4 group-hover/btn:scale-110 transition-transform',
                            isBookmarked && 'fill-primary text-primary'
                          )}
                        />
                      </button>
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      {/* 1. Post Thread View Modal */}
      <PostThreadModal
        isOpen={isThreadModalOpen}
        onClose={() => setIsThreadModalOpen(false)}
        post={selectedThreadPost}
        onLikePost={(pid) => handleLike(pid)}
        onRepostPost={(pid) => handleRepost(pid)}
        onOpenProfile={(h) => {
          setIsThreadModalOpen(false);
          openProfile(h);
        }}
        currentUserAddress={address || shortAddress}
        isWalletConnected={connected}
        onOpenWalletModal={() => {
          setIsThreadModalOpen(false);
          setIsModalOpen(true);
        }}
      />

      {/* 2. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        handleOrAddress={selectedProfileHandle}
        currentUserAddress={address || shortAddress}
        onPostClick={(post) => {
          setIsProfileModalOpen(false);
          openThread(post);
        }}
      />

      {/* 3. AI Sentiment Consensus Explainer Modal */}
      <SentimentExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
        symbol={symbol}
      />
    </div>
  );
}
