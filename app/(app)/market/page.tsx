'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Search,
  LayoutGrid,
  Table,
  Globe,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { GlassPanel, PriceChange } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getAllAssets } from '@/lib/mock-data';
import { useDashboardLiveData } from '@/lib/hooks/useDashboardLiveData';
import { cn } from '@/lib/utils';

const MarketUniverse = dynamic(
  () => import('@/components/three/MarketUniverse').then((m) => m.MarketUniverse),
  {
    ssr: false,
    loading: () => (
      <div className="h-[580px] w-full rounded-2xl bg-card/20 border border-border/50 animate-pulse flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="font-mono text-xs">Initializing WebGL 3D Market Universe...</p>
      </div>
    ),
  }
);

type ViewMode = 'cards' | 'table' | '3d';

export default function MarketDiscoveryPage() {
  const assets = getAllAssets();
  const { quotes, isPythConnected } = useDashboardLiveData();
  const [view, setView] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  // Merge live Pyth prices into assets
  const liveAssets = assets.map((a) => {
    const rawSym = a.tokenizedAsset.symbol.replace(/x$/, '');
    const liveQ = quotes[rawSym];
    if (liveQ && liveQ.price > 0) {
      return {
        ...a,
        quote: {
          ...a.quote,
          price: liveQ.price,
          change24h: liveQ.change24h,
          changePct24h: liveQ.changePct24h,
        },
      };
    }
    return a;
  });

  const sectors = ['all', ...Array.from(new Set(liveAssets.map((a) => a.tokenizedAsset.underlying.sector)))];
  const filtered = liveAssets.filter((a) => {
    const matchSearch =
      a.tokenizedAsset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.tokenizedAsset.name.toLowerCase().includes(search.toLowerCase());
    const matchSector = sectorFilter === 'all' || a.tokenizedAsset.underlying.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover and analyze tokenized stocks on Solana</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-card/60 backdrop-blur border border-border/80 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <span className={cn('h-2 w-2 rounded-full', isPythConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')} />
          <span className="font-semibold text-foreground">
            {isPythConnected ? 'Pyth Hermes: Connected' : 'Oracle Syncing'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokenized stocks..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none"
          >
            {sectors.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Sectors' : s}</option>
            ))}
          </select>
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {[
              { mode: 'cards' as const, icon: LayoutGrid },
              { mode: 'table' as const, icon: Table },
              { mode: '3d' as const, icon: Globe },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className={cn(
                  'p-2 transition-colors',
                  view === mode ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards view */}
      {view === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset, i) => (
            <motion.div
              key={asset.tokenizedAsset.symbol}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/market/${asset.tokenizedAsset.symbol}`}>
                <GlassPanel hover className="p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold">
                        {asset.tokenizedAsset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{asset.tokenizedAsset.symbol}</p>
                        <p className="text-xs text-muted-foreground">{asset.tokenizedAsset.name}</p>
                      </div>
                    </div>
                    <RiskBadge level={asset.riskScore.level} />
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold tabular-nums">${asset.quote.price.toFixed(2)}</p>
                      <PriceChange change={asset.quote.change24h} pct={asset.quote.changePct24h} className="text-sm" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">MITIGATOR</p>
                      <p className={cn(
                        'text-2xl font-bold tabular-nums',
                        asset.riskScore.overall >= 75 ? 'text-emerald-400' : asset.riskScore.overall >= 60 ? 'text-amber-400' : 'text-red-400'
                      )}>
                        {asset.riskScore.overall}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-card/50 p-2">
                      <p className="text-muted-foreground">Liquidity</p>
                      <p className="font-medium tabular-nums">{asset.liquidityScore}</p>
                    </div>
                    <div className="rounded-lg bg-card/50 p-2">
                      <p className="text-muted-foreground">Sentiment</p>
                      <p className="font-medium tabular-nums">{asset.sentimentScore}</p>
                    </div>
                    <div className="rounded-lg bg-card/50 p-2">
                      <p className="text-muted-foreground">Volatility</p>
                      <p className="font-medium tabular-nums">{asset.volatility}%</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Token Verified
                    </span>
                    <span className="text-muted-foreground">· Oracle Healthy</span>
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <GlassPanel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                  <th className="text-left font-medium px-4 py-3">Asset</th>
                  <th className="text-right font-medium px-4 py-3">Price</th>
                  <th className="text-right font-medium px-4 py-3">24h Change</th>
                  <th className="text-right font-medium px-4 py-3">Score</th>
                  <th className="text-center font-medium px-4 py-3">Risk</th>
                  <th className="text-right font-medium px-4 py-3">Liquidity</th>
                  <th className="text-right font-medium px-4 py-3">Volatility</th>
                  <th className="text-center font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((asset) => (
                  <tr key={asset.tokenizedAsset.symbol} className="border-b border-border/50 hover:bg-card/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/market/${asset.tokenizedAsset.symbol}`} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                          {asset.tokenizedAsset.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{asset.tokenizedAsset.symbol}</p>
                          <p className="text-xs text-muted-foreground">{asset.tokenizedAsset.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">${asset.quote.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <PriceChange change={asset.quote.change24h} pct={asset.quote.changePct24h} className="text-xs" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-bold tabular-nums', asset.riskScore.overall >= 75 ? 'text-emerald-400' : asset.riskScore.overall >= 60 ? 'text-amber-400' : 'text-red-400')}>
                        {asset.riskScore.overall}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center"><RiskBadge level={asset.riskScore.level} /></td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{asset.liquidityScore}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{asset.volatility}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Open
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* 3D view */}
      {view === '3d' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-base font-semibold">3D Tokenized Stock Galaxy</h2>
              <p className="text-xs text-muted-foreground">
                Orbital node visualization of live Solana assets. Node size reflects liquidity; color reflects MITIGATOR Risk Score. Click any node badge to inspect.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Low Risk</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> High Risk</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-border/70 bg-card/20 shadow-2xl h-[580px] w-full">
            <MarketUniverse className="w-full h-full" interactive={true} />
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-sm">No assets found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
