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
  Share2,
  Send,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets } from '@/lib/mock-data';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { CommunityPost } from '@/lib/services/community-service';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const assets = getAllAssets();
  const { connected, shortAddress, setIsModalOpen } = useSolanaWallet();
  const [symbol, setSymbol] = useState('NVDAx');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New post compose state
  const [newContent, setNewContent] = useState('');
  const [newSentiment, setNewSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [newType, setNewType] = useState<'Trade Idea' | 'Analysis' | 'Question'>('Trade Idea');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: {
            symbol,
            author: shortAddress || 'Solana Trader',
            authorAddress: shortAddress,
            handle: `${shortAddress} · Verified Onchain`,
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
        }
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, engagement: { ...p.engagement, likes: p.engagement.likes + 1 } } : p))
    );

    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'like',
          symbol,
          postId,
        }),
      });
    } catch (err) {
      console.warn('Failed to like post:', err);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Decentralized stock signals, research ideas, and real-time sentiment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
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
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
              symbol === a.tokenizedAsset.symbol
                ? 'border-primary/40 bg-primary/15 text-primary font-semibold shadow-xs'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-card/40'
            )}
          >
            {a.tokenizedAsset.symbol}
          </button>
        ))}
      </div>

      {/* AI consensus */}
      {sentimentData && (
        <GlassPanel className="p-5 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold">AI Sentiment Consensus — {symbol}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-semibold">{sentimentData.bullishPct}% Bullish</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-red-400 font-semibold">{sentimentData.bearishPct}% Bearish</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/80 bg-card/40 p-3">
              <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-1">Consensus</p>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.consensus}</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/40 p-3">
              <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-1">Divergence</p>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.disagreement}</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-card/40 p-3">
              <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase mb-1">Narratives</p>
              <p className="text-xs text-foreground/90 leading-relaxed">{sentimentData.narratives}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            Social signals are sentiment indicators, not audited financial disclosures.
          </div>
        </GlassPanel>
      )}

      {/* Interactive Compose Box */}
      <GlassPanel className="p-4 border border-border/80">
        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Post to {symbol} Board
            </span>
            <div className="flex items-center gap-2">
              {/* Type Select */}
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="bg-card/60 border border-border text-xs rounded-lg px-2 py-1 text-foreground outline-none"
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
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                    newSentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-muted-foreground'
                  )}
                >
                  Bull
                </button>
                <button
                  type="button"
                  onClick={() => setNewSentiment('bearish')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                    newSentiment === 'bearish' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-muted-foreground'
                  )}
                >
                  Bear
                </button>
                <button
                  type="button"
                  onClick={() => setNewSentiment('neutral')}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
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
                  : 'Connect wallet to post on the community board...'
              }
              className="flex-1 bg-background/50 border border-border/80 rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            {connected ? (
              <button
                type="submit"
                disabled={isSubmitting || !newContent.trim()}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Post
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Wallet className="h-3.5 w-3.5" /> Connect
              </button>
            )}
          </div>
        </form>
      </GlassPanel>

      {/* Posts Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-mono">
            Loading real-time community feed...
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassPanel hover className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center font-bold text-xs">
                        {post.author.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium">{post.author}</p>
                          {post.verified && <CheckCircle2 className="h-3 w-3 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{post.handle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-card border border-border">
                        {post.type}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                          post.sentiment === 'bullish'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : post.sentiment === 'bearish'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-zinc-500/10 text-zinc-400'
                        )}
                      >
                        {post.sentiment}
                      </span>
                      <SourceBadge tier={post.sourceTier} />
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-foreground">{post.content}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5" />
                      <span>{post.engagement.likes}</span>
                    </button>
                    <span>{post.engagement.replies} replies</span>
                    <span>{post.engagement.reposts} reposts</span>
                    {post.evidenceAttached && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Evidence Linked
                      </span>
                    )}
                    <span className="ml-auto text-[11px] font-mono">
                      {new Date(post.postedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
