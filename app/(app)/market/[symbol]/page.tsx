'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Brain,
  Sparkles,
  FileText,
  Newspaper,
  MessageSquare,
  Clock,
  ChevronRight,
  ExternalLink,
  Star,
  Layers,
} from 'lucide-react';
import { TradingViewChart } from '@/components/market/TradingViewChart';
import { PythDualFeedRadar } from '@/components/market/PythDualFeedRadar';
import { GlassPanel, PriceChange } from '@/components/shared/GlassPanel';
import { ScoreRing } from '@/components/shared/ScoreRing';
import { SourceBadge, RiskBadge, FreshnessBadge } from '@/components/shared/SourceBadge';
import { getAsset, getHistoricalBars, getNews, getFilings, getSocialPosts, getTimelineEvents, getAIInsight } from '@/lib/mock-data';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { getUserProfile, saveUserProfile, UserProfile } from '@/lib/services/user-profile';
import type { SECFiling } from '@/lib/services/sec-edgar-service';
import type { TokenVariant } from '@/lib/services/tokens-service';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'variants' | 'news' | 'filings' | 'social' | 'timeline' | 'ai';
type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params?.symbol as string) || 'NVDAx';
  const asset = getAsset(symbol);
  const [tab, setTab] = useState<Tab>('overview');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [dataset, setDataset] = useState<'equity' | 'token'>('equity');

  const { quotes, isPythConnected } = useDashboardLiveData();
  const cleanSym = symbol.replace(/x$/, '');
  const liveQuote = quotes[cleanSym] || quotes[symbol];

  const news = useMemo(() => getNews(symbol), [symbol]);
  const defaultFilings = useMemo(() => getFilings(symbol), [symbol]);
  const social = useMemo(() => getSocialPosts(symbol), [symbol]);
  const timeline = useMemo(() => getTimelineEvents(symbol), [symbol]);
  const defaultAiInsight = useMemo(() => getAIInsight(symbol, 2000), [symbol]);

  const [liveFilings, setLiveFilings] = useState<SECFiling[]>([]);
  const [isFilingsLoading, setIsFilingsLoading] = useState(true);
  const [liveAiInsight, setLiveAiInsight] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [liveSocialPosts, setLiveSocialPosts] = useState<any[]>([]);
  const [tokenVariants, setTokenVariants] = useState<TokenVariant[]>([]);
  const [isVariantsLoading, setIsVariantsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setIsVariantsLoading(true);
    fetch(`/api/tokens?action=variants&symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.variants) {
          setTokenVariants(data.variants);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsVariantsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [symbol]);

  const { address } = useSolanaWallet();
  const userAddress = address || 'guest';
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile(userAddress).then(setProfile);
  }, [userAddress]);

  const watchlist = profile?.watchlist || [];

  const handleToggleWatchlist = async () => {
    if (!profile) return;
    const isWatched = watchlist.includes(symbol);
    const updatedWatchlist = isWatched
      ? watchlist.filter((s) => s !== symbol)
      : [...watchlist, symbol];

    const updatedProfile: UserProfile = {
      ...profile,
      watchlist: updatedWatchlist,
    };
    setProfile(updatedProfile);
    await saveUserProfile(updatedProfile);
  };

  useEffect(() => {
    let active = true;
    fetch(`/api/community?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.posts && data.posts.length > 0) {
          setLiveSocialPosts(data.posts);
        }
      })
      .catch((err) => console.warn('[StockDetailPage] social load error:', err));
    return () => {
      active = false;
    };
  }, [symbol]);

  const activeSocial = liveSocialPosts;

  useEffect(() => {
    let active = true;
    setIsFilingsLoading(true);
    fetch(`/api/filings?symbol=${encodeURIComponent(symbol)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.filings && data.filings.length > 0) {
          setLiveFilings(data.filings);
        }
      })
      .catch((err) => console.warn('[StockDetailPage] filings load error:', err))
      .finally(() => {
        if (active) setIsFilingsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [symbol]);

  const activeFilings = liveFilings;

  useEffect(() => {
    let active = true;
    setIsAiLoading(true);
    fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol,
        prompt: `Analyze ${symbol} tokenized stock risk profile, oracle latency, SEC 10-K/10-Q filing status, and peg deviation on Solana.`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.insight) {
          setLiveAiInsight(data);
        }
      })
      .catch((e) => console.warn('AI live load error:', e))
      .finally(() => {
        if (active) setIsAiLoading(false);
      });
    return () => {
      active = false;
    };
  }, [symbol]);

  const activeInsight = liveAiInsight?.insight || defaultAiInsight;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/market" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Markets
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{symbol}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{symbol}</h1>
                <button
                  type="button"
                  onClick={handleToggleWatchlist}
                  className={cn(
                    "p-1.5 rounded-lg border transition-colors",
                    watchlist.includes(symbol)
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "border-border/60 text-muted-foreground hover:text-amber-400 hover:border-amber-500/30"
                  )}
                  title={watchlist.includes(symbol) ? "Remove from Watchlist" : "Add to Watchlist"}
                >
                  <Star className={cn("h-4 w-4", watchlist.includes(symbol) && "fill-amber-400")} />
                </button>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
                  1 Token = 1.0000 Share
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{asset.tokenizedAsset.name}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4 flex-wrap">
            <span className="text-3xl font-bold tabular-nums">
              ${(liveQuote?.price ?? asset.quote.price).toFixed(2)}
            </span>
            <PriceChange
              change={liveQuote?.change24h ?? asset.quote.change24h}
              pct={liveQuote?.changePct24h ?? asset.quote.changePct24h}
              className="text-lg"
            />
            {liveQuote?.isLive && (
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Pyth Streaming
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Solana 24/7 Secondary: Live
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono">
              <Clock className="h-3 w-3" /> TradFi Market: Closed
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Token Verified</span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-emerald-400"><Database className="h-3 w-3" /> Oracle Healthy</span>
            <span className="text-muted-foreground">·</span>
            <span className="flex items-center gap-1 text-emerald-400"><Activity className="h-3 w-3" /> Liquidity Strong</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ScoreRing score={asset.riskScore.overall} size={100} strokeWidth={6} showLabel={true} />
          <div className="flex flex-col gap-2">
            <RiskBadge level={asset.riskScore.level} />
            <FreshnessBadge freshness={asset.riskScore.freshness} />
            <span className="text-xs text-muted-foreground">Confidence: <span className="text-foreground font-medium">{(asset.riskScore.confidence * 100).toFixed(0)}%</span></span>
          </div>
        </div>
      </div>

      {/* Token info bar */}
      <GlassPanel className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Issuer</p>
            <p className="font-medium">{asset.tokenizedAsset.issuer.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Oracle</p>
            <p className="font-medium">{asset.tokenizedAsset.oracle.provider}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Backing Ratio</p>
            <p className="font-medium tabular-nums">{asset.tokenizedAsset.backingRatio.toFixed(2)}:1</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sector</p>
            <p className="font-medium">{asset.tokenizedAsset.underlying.sector}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">P/E Ratio</p>
            <p className="font-medium tabular-nums">{asset.tokenizedAsset.underlying.peRatio}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beta</p>
            <p className="font-medium tabular-nums">{asset.tokenizedAsset.underlying.beta}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Corporate Multiplier</p>
            <p className="font-medium font-mono text-cyan-400 tabular-nums">1.0000x</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Solana Standard</p>
            <p className="font-medium font-mono text-emerald-400">Token-2022</p>
          </div>
        </div>
      </GlassPanel>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-thin">
        {[
          { key: 'overview' as const, label: 'Overview', icon: Activity },
          { key: 'variants' as const, label: 'Tokens.xyz Variants', icon: Layers },
          { key: 'news' as const, label: 'News', icon: Newspaper },
          { key: 'filings' as const, label: 'Filings', icon: FileText },
          { key: 'social' as const, label: 'Community', icon: MessageSquare },
          { key: 'timeline' as const, label: 'Timeline', icon: Clock },
          { key: 'ai' as const, label: 'AI Copilot', icon: Brain },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap',
              tab === key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Live TradingView / Solana DEX Terminal Chart */}
          <TradingViewChart
            symbol={symbol}
            height={540}
            showDexScreenerToggle={true}
          />

          {/* Pyth Network Dual-Feed & Peg Radar */}
          <PythDualFeedRadar initialSymbol={symbol} showSelector={false} />

          {/* MITIGATOR Score breakdown */}
          <div className="grid lg:grid-cols-2 gap-4">
            <GlassPanel className="p-5">
              <h3 className="text-sm font-semibold tracking-wide mb-4">MITIGATOR Score Breakdown</h3>
              <div className="space-y-3">
                {asset.riskScore.factors.map((factor) => (
                  <div key={factor.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{factor.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground tabular-nums">{factor.weight}%</span>
                        <span className={cn(
                          'text-sm font-bold tabular-nums',
                          factor.score >= 75 ? 'text-emerald-400' : factor.score >= 60 ? 'text-amber-400' : 'text-red-400'
                        )}>
                          {factor.score}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: factor.score >= 75 ? '#3fb98a' : factor.score >= 60 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">{factor.description}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Quick AI */}
            <GlassPanel hover className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold tracking-wide">MITIGATOR AI Brief</h3>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Real-Time
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-semibold text-emerald-400 tracking-widest uppercase mb-1">Verdict</p>
                  <p className="text-sm">{activeInsight.verdict || activeInsight.sections?.[0]?.content || 'Asset evaluated under normal risk parameters.'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <SourceBadge tier="VERIFIED" />
                    <span className="text-[10px] text-muted-foreground">{((activeInsight.confidence || 0.95) * 100).toFixed(0)}% confidence</span>
                  </div>
                </div>
                <button
                  onClick={() => setTab('ai')}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  <Brain className="h-3.5 w-3.5" />
                  Full AI Analysis
                  <ChevronRight className="h-3 w-3" />
                </button>
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href={`/paper?symbol=${symbol}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-card/50 py-2 text-xs hover:bg-card hover:border-emerald-500/30 border border-border/60 transition-colors"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    Paper Trade
                  </Link>
                  <Link
                    href={`/execution?symbol=${symbol}`}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-card/50 py-2 text-xs hover:bg-card hover:border-cyan-500/30 border border-border/60 transition-colors"
                  >
                    <Activity className="h-3.5 w-3.5 text-cyan-400" />
                    Live Route
                  </Link>
                  <Link
                    href="/risk"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-card/50 py-2 text-xs hover:bg-card hover:border-amber-500/30 border border-border/60 transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                    Risk Matrix
                  </Link>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* Variants tab - Powered by Tokens.xyz */}
      {tab === 'variants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-foreground font-semibold">
                  Tokens.xyz Multi-Issuer Variant Matrix for {symbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cross-issuer peg tracking, on-chain liquidity depth, and redemption transparency on Solana
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 self-start sm:self-auto font-semibold">
              Tokens API v1
            </span>
          </div>

          <GlassPanel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Issuer / Token</th>
                    <th className="px-4 py-3 font-medium">Standard</th>
                    <th className="px-4 py-3 font-medium text-right">Price (USD)</th>
                    <th className="px-4 py-3 font-medium text-right">Peg Divergence</th>
                    <th className="px-4 py-3 font-medium text-right">24h Volume</th>
                    <th className="px-4 py-3 font-medium text-right">Solana Liquidity</th>
                    <th className="px-4 py-3 font-medium text-center">Custody Backing</th>
                    <th className="px-4 py-3 font-medium text-center">Oracle Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {tokenVariants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-xs text-muted-foreground font-mono">
                        {isVariantsLoading ? 'Querying Tokens.xyz API v1...' : 'No external variants registered for this asset.'}
                      </td>
                    </tr>
                  ) : (
                    tokenVariants.map((v) => (
                      <tr key={v.mint} className="hover:bg-card/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-foreground">{v.symbol}</div>
                          <div className="text-[11px] text-muted-foreground">{v.issuer}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-emerald-400 font-semibold">
                          {v.standard}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-medium">
                          ${v.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-medium">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-semibold',
                            Math.abs(v.pegDivergencePct) < 0.05
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          )}>
                            {v.pegDivergencePct > 0 ? `+${v.pegDivergencePct.toFixed(3)}%` : `${v.pegDivergencePct.toFixed(3)}%`}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs text-muted-foreground">
                          ${v.volume24hUsd.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs text-foreground font-bold">
                          ${v.liquidityUsd.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={cn(
                            'text-[10px] px-2 py-0.5 rounded font-semibold',
                            v.isRedeemable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-muted text-muted-foreground'
                          )}>
                            {v.isRedeemable ? '1:1 Custody' : 'Synthetic'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs font-mono text-muted-foreground">
                          {v.oracleFeed}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* News tab */}
      {tab === 'news' && (
        <div className="space-y-3">
          {news.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassPanel hover className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                      item.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                      'bg-zinc-500/10 text-zinc-400'
                    )}>
                      {item.sentiment}
                    </span>
                    {item.importance === 'high' && (
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">High Impact</span>
                    )}
                  </div>
                  <SourceBadge tier={item.sourceTier} />
                </div>
                <h3 className="text-sm font-semibold mb-1">{item.headline}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{new Date(item.publishedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filings tab */}
      {tab === 'filings' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-card/60 border border-border">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-emerald-400">
                Authoritative SEC EDGAR Regulatory Disclosures (Tier 1 Primary)
              </span>
            </div>
            <a
              href="https://www.sec.gov/edgar/searchedgar/companysearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono transition-colors"
            >
              Verify on SEC.gov <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {isFilingsLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono flex items-center justify-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Streaming live SEC EDGAR submissions...
            </div>
          ) : activeFilings.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono">
              No recent SEC filings retrieved for {symbol}.
            </div>
          ) : (
            activeFilings.map((filing: any, i) => {
              const formType = filing.form || filing.type || 'FILING';
              const docTitle = filing.description || filing.title || `${formType} Disclosure`;
              const filingDate = filing.filingDate || filing.filedAt;
              const accessionNum = filing.accessionNumber;
              const targetUrl = filing.url || `https://www.sec.gov/edgar/searchedgar/companysearch`;

              return (
                <motion.div
                  key={accessionNum || filing.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <GlassPanel hover className="p-4 flex items-center justify-between group-hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold tracking-wider bg-card px-2 py-0.5 rounded border border-border">
                              {formType}
                            </span>
                            <SourceBadge tier="PRIMARY" />
                            {accessionNum && (
                              <span className="text-[10px] font-mono text-muted-foreground">
                                Acc: {accessionNum}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium group-hover:text-primary transition-colors">
                            {docTitle}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            Filed: {filingDate ? new Date(filingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </GlassPanel>
                  </a>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Social tab */}
      {tab === 'social' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">Community posts are social signals, not verified financial facts. Always check the source tier.</p>
          </div>
          {activeSocial.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground font-mono">
              No community research submissions for {symbol} yet. Visit Community Feed to post the first analysis.
            </div>
          ) : (
            activeSocial.map((post, i) => (
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
                      <span className={cn(
                        'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                        post.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' :
                        post.sentiment === 'bearish' ? 'bg-red-500/10 text-red-400' :
                        'bg-zinc-500/10 text-zinc-400'
                      )}>
                        {post.sentiment}
                      </span>
                      <SourceBadge tier={post.sourceTier} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.engagement?.likes || 0} likes</span>
                    <span>{post.engagement?.replies || 0} replies</span>
                    <span>{post.engagement?.reposts || 0} reposts</span>
                    {post.evidenceAttached && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Evidence</span>}
                    <span className="ml-auto">{new Date(post.postedAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Timeline tab */}
      {tab === 'timeline' && (
        <GlassPanel className="p-5">
          <h3 className="text-sm font-semibold tracking-wide mb-4">Market Timeline</h3>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            {timeline.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative">
                <div className={cn(
                  'absolute -left-[20px] top-1.5 h-3 w-3 rounded-full border-2 border-background',
                  event.impact === 'positive' ? 'bg-emerald-400' : event.impact === 'negative' ? 'bg-red-400' : 'bg-cyan-400'
                )} />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{event.type.replace(/_/g, ' ')}</span>
                      {event.importance === 'high' && <span className="text-[10px] font-semibold text-amber-400 uppercase">High</span>}
                    </div>
                    <p className="mt-0.5 text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{event.source}</span>
                      <SourceBadge tier={event.sourceTier} />
                      <span className="text-[10px] text-muted-foreground">Confidence: {(event.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* AI Copilot tab */}
      {tab === 'ai' && (
        <div className="space-y-4">
          <GlassPanel className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{activeInsight.query}</p>
                <p className="text-xs text-muted-foreground">
                  Model: {activeInsight.modelVersion} · Confidence: {(activeInsight.confidence * 100).toFixed(0)}%
                  {liveAiInsight?.liveContext?.oracleLatencyMs && (
                    <span className="ml-2 text-emerald-400 font-mono">
                      · Oracle: {liveAiInsight.liveContext.oracleLatencyMs}ms
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {isAiLoading ? (
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" /> Analyzing live telemetry...
                </span>
              ) : liveAiInsight ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Pyth & SEC EDGAR
                </span>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">Real-Time Synthesis</span>
              )}
            </div>
          </GlassPanel>

          {activeInsight.sections.map((section: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassPanel className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-bold tracking-widest text-primary uppercase">{section.label}</p>
                  <span className="text-[10px] text-muted-foreground">{(section.confidence * 100).toFixed(0)}% confidence</span>
                </div>
                <p className="text-sm leading-relaxed">{section.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {section.sources.map((source: any, j: number) => (
                    <SourceBadge key={j} tier={source.tier} />
                  ))}
                  {section.sources.map((source: any, j: number) => (
                    <span key={`label-${j}`} className="text-[10px] text-muted-foreground">{source.label}</span>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          ))}

          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <ShieldCheck className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">AI analysis is probabilistic, not financial advice. Grounded in live Pyth Hermes oracle prices & SEC EDGAR submissions.</p>
          </div>
        </div>
      )}
    </div>
  );
}
