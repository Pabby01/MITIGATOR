'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { cn } from '@/lib/utils';

type ViewMode = 'cards' | 'table' | '3d';

export default function MarketDiscoveryPage() {
  const assets = getAllAssets();
  const [view, setView] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  const sectors = ['all', ...Array.from(new Set(assets.map((a) => a.tokenizedAsset.underlying.sector)))];
  const filtered = assets.filter((a) => {
    const matchSearch = a.tokenizedAsset.symbol.toLowerCase().includes(search.toLowerCase()) || a.tokenizedAsset.name.toLowerCase().includes(search.toLowerCase());
    const matchSector = sectorFilter === 'all' || a.tokenizedAsset.underlying.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Discover and analyze tokenized stocks on Solana</p>
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

      {/* 3D view placeholder */}
      {view === '3d' && (
        <GlassPanel className="p-12 flex flex-col items-center justify-center min-h-[400px]">
          <Globe className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">3D Market Map — Interactive WebGL visualization of the tokenized stock universe</p>
          <p className="text-xs text-muted-foreground mt-2">Coming soon with the full 3D market map experience</p>
        </GlassPanel>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-sm">No assets found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
