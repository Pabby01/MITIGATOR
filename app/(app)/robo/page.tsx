'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldCheck, Zap, AlertTriangle, Lock } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { RiskBadge } from '@/components/shared/SourceBadge';
import { getRoboProfiles } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function RoboPage() {
  const profiles = getRoboProfiles();
  const [selected, setSelected] = useState('robo-balanced');
  const [maxPosition, setMaxPosition] = useState(25);
  const [maxDailyLoss, setMaxDailyLoss] = useState(5);
  const [maxSlippage, setMaxSlippage] = useState(0.5);
  const [minConfidence, setMinConfidence] = useState(75);
  const [humanApproval, setHumanApproval] = useState(true);
  const [aiTrading, setAiTrading] = useState(false);

  const profile = profiles.find((p) => p.id === selected) || profiles[0];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Robo Advisor</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Automated portfolio builder with safety controls</p>
      </div>

      {/* Safety banner */}
      <div className={cn(
        'flex items-center gap-3 rounded-lg border p-4',
        aiTrading ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'
      )}>
        <ShieldCheck className={cn('h-5 w-5', aiTrading ? 'text-amber-400' : 'text-emerald-400')} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {aiTrading ? 'AI Live Trading: Enabled' : 'AI Live Trading: Disabled (Default)'}
          </p>
          <p className="text-xs text-muted-foreground">
            {aiTrading
              ? 'AI will execute trades automatically within your safety parameters. Human approval is recommended.'
              : 'AI recommends strategies. You review and approve every trade. Enable at your own risk.'}
          </p>
        </div>
        <button
          onClick={() => setAiTrading(!aiTrading)}
          className={cn('relative h-6 w-11 rounded-full transition-colors', aiTrading ? 'bg-amber-500' : 'bg-emerald-500')}
        >
          <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform', aiTrading ? 'translate-x-5' : 'translate-x-0.5')} />
        </button>
      </div>

      {/* Profile selection */}
      <div>
        <h2 className="text-sm font-semibold tracking-wide mb-3">Investment Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {profiles.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setSelected(p.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'rounded-lg border p-4 text-left transition-colors',
                selected === p.id ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-border/80'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Bot className={cn('h-4 w-4', selected === p.id ? 'text-primary' : 'text-muted-foreground')} />
                <RiskBadge level={p.riskLevel} />
              </div>
              <p className="text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-emerald-400">+{p.expectedReturn}%</span>
                <span className="text-red-400">{p.maxDrawdown}%</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Allocation */}
      <GlassPanel className="p-5">
        <h2 className="text-sm font-semibold tracking-wide mb-4">{profile.name} Allocation</h2>
        <div className="space-y-3">
          {profile.allocation.map((a) => (
            <div key={a.symbol}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{a.symbol}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{a.weight}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${a.weight}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Safety controls */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Safety Controls</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-muted-foreground">Max Position Size: {maxPosition}%</label>
            <input type="range" min="5" max="50" step="5" value={maxPosition} onChange={(e) => setMaxPosition(parseInt(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Max Daily Loss: {maxDailyLoss}%</label>
            <input type="range" min="1" max="20" step="1" value={maxDailyLoss} onChange={(e) => setMaxDailyLoss(parseInt(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Max Slippage: {maxSlippage.toFixed(2)}%</label>
            <input type="range" min="0.1" max="2" step="0.05" value={maxSlippage} onChange={(e) => setMaxSlippage(parseFloat(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Min Confidence: {minConfidence}%</label>
            <input type="range" min="50" max="95" step="5" value={minConfidence} onChange={(e) => setMinConfidence(parseInt(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Human Approval Required</p>
              <p className="text-xs text-muted-foreground">Require manual confirmation before each trade</p>
            </div>
            <button onClick={() => setHumanApproval(!humanApproval)} className={cn('relative h-5 w-9 rounded-full transition-colors', humanApproval ? 'bg-primary' : 'bg-border')}>
              <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', humanApproval ? 'translate-x-4' : 'translate-x-0.5')} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Event Blackout</p>
              <p className="text-xs text-muted-foreground">Pause trading around earnings and major events</p>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allowed Assets</p>
              <p className="text-xs text-muted-foreground">Restrict to verified tokenized stocks only</p>
            </div>
            <span className="text-xs text-muted-foreground">NVDAx, AAPLx, AMZNx, SPYx, QQQx</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Allowed Venues</p>
              <p className="text-xs text-muted-foreground">Restrict to approved execution venues</p>
            </div>
            <span className="text-xs text-muted-foreground">Jupiter, Orca, xChange</span>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
        AI recommends. Risk engine evaluates. You approve. Wallet signs. AI never has direct control of your wallet.
      </div>
    </div>
  );
}
