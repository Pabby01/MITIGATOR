'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Brain, ShieldCheck, TrendingUp } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge } from '@/components/shared/SourceBadge';
import { getAllAssets, getCommunityPosts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function CommunityPage() {
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState('NVDAx');
  const posts = getCommunityPosts(symbol);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Stock-specific discussion, sentiment, and AI-generated consensus</p>
      </div>

      {/* Asset selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
        {assets.map((a) => (
          <button
            key={a.tokenizedAsset.symbol}
            onClick={() => setSymbol(a.tokenizedAsset.symbol)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
              symbol === a.tokenizedAsset.symbol ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {a.tokenizedAsset.symbol}
          </button>
        ))}
      </div>

      {/* AI consensus */}
      <GlassPanel className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg bg-primary/10 p-1.5"><Brain className="h-4 w-4 text-primary" /></div>
          <h2 className="text-sm font-semibold">AI Community Analysis — {symbol}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-1">Consensus</p>
            <p className="text-sm">Bullish — 68% of posts express positive sentiment on {symbol}. Key narrative: Blackwell GPU cycle.</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-amber-400 tracking-widest uppercase mb-1">Disagreement</p>
            <p className="text-sm">Valuation concern — 22% of posts cite P/E of 67 as stretched. Counter: AI demand cycle justifies premium.</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-red-400 tracking-widest uppercase mb-1">Emerging Narratives</p>
            <p className="text-sm">Supply chain constraints, export restriction impact, data center capex acceleration.</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-amber-400" />
          AI consensus is derived from social signals, not verified fact. Always check source tiers.
        </div>
      </GlassPanel>

      {/* Warning */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
        <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">Community posts are social signals, not verified financial facts. Check source tier and evidence before acting.</p>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post: any, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassPanel hover className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">{post.author}</p>
                      {post.verified && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{post.handle} · {post.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-card border border-border">{post.type}</span>
                  <span className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                    post.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' :
                    post.sentiment === 'bearish' ? 'bg-red-500/10 text-red-400' :
                    'bg-zinc-500/10 text-zinc-400'
                  )}>{post.sentiment}</span>
                  <SourceBadge tier={post.sourceTier} />
                </div>
              </div>
              <p className="text-sm leading-relaxed">{post.content}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.engagement.likes} likes</span>
                <span>{post.engagement.replies} replies</span>
                <span>{post.engagement.reposts} reposts</span>
                {post.evidenceAttached && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Evidence</span>}
                <span className="ml-auto">{new Date(post.postedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Compose */}
      <GlassPanel className="p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <input
            placeholder={`Share your analysis on ${symbol}...`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Post</button>
        </div>
      </GlassPanel>
    </div>
  );
}
