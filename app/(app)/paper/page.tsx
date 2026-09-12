'use client';

import { motion } from 'framer-motion';
import { FlaskConical, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { GlassPanel, MetricCard } from '@/components/shared/GlassPanel';
import { getPaperTrades } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function PaperTradingPage() {
  const trades = getPaperTrades();
  const balance = 100000;
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const wins = trades.filter((t) => t.pnl > 0).length;
  const winRate = (wins / trades.length) * 100;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paper Trading</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Practice with virtual funds. Simulated fees, slippage, and price impact.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs">
          <FlaskConical className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-muted-foreground">Demo Mode</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Paper Balance" value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={Wallet} />
        <MetricCard label="Total P&L" value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`} change={`${totalPnl >= 0 ? '+' : ''}${((totalPnl / balance) * 100).toFixed(2)}%`} changePct={(totalPnl / balance) * 100} icon={TrendingUp} />
        <MetricCard label="Win Rate" value={`${winRate.toFixed(0)}%`} icon={TrendingUp} />
        <MetricCard label="Open Positions" value="3" icon={FlaskConical} />
      </div>

      {/* Trade journal */}
      <GlassPanel className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold tracking-wide">Trade Journal</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground tracking-wider uppercase">
                <th className="text-left font-medium px-4 py-3">Symbol</th>
                <th className="text-center font-medium px-4 py-3">Side</th>
                <th className="text-right font-medium px-4 py-3">Amount</th>
                <th className="text-right font-medium px-4 py-3">Price</th>
                <th className="text-right font-medium px-4 py-3">Venue</th>
                <th className="text-right font-medium px-4 py-3">Fee</th>
                <th className="text-right font-medium px-4 py-3">Slippage</th>
                <th className="text-right font-medium px-4 py-3">P&L</th>
                <th className="text-center font-medium px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {trades.map((trade, i) => (
                <motion.tr key={trade.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{trade.symbol}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded', trade.side === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400')}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">${trade.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">${trade.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{trade.venue}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">${trade.fee.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{trade.slippage.toFixed(2)}%</td>
                  <td className={cn('px-4 py-3 text-right tabular-nums font-medium', trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-emerald-400 flex items-center justify-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {trade.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Strategy performance */}
      <GlassPanel className="p-5">
        <h2 className="text-sm font-semibold tracking-wide mb-4">Strategy Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Trades</p>
            <p className="text-xl font-bold tabular-nums">{trades.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Slippage</p>
            <p className="text-xl font-bold tabular-nums text-amber-400">{(trades.reduce((s, t) => s + t.slippage, 0) / trades.length).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Fees</p>
            <p className="text-xl font-bold tabular-nums text-muted-foreground">${trades.reduce((s, t) => s + t.fee, 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best Trade</p>
            <p className="text-xl font-bold tabular-nums text-emerald-400">+${Math.max(...trades.map((t) => t.pnl)).toFixed(2)}</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
