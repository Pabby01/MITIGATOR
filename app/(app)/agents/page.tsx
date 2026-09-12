'use client';

import { motion } from 'framer-motion';
import { Bot, Activity, CheckCircle2, AlertTriangle, Clock, Database } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { getAgents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Inspect what each agent is doing, what it found, and how confident it is</p>
      </div>

      {/* Agent status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-emerald-400" /><p className="text-xs text-muted-foreground">Active</p></div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-400">{agents.filter((a) => a.status === 'active').length}</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><p className="text-xs text-muted-foreground">Idle</p></div>
          <p className="mt-1 text-2xl font-bold tabular-nums">{agents.filter((a) => a.status === 'idle').length}</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" /><p className="text-xs text-muted-foreground">Alerts</p></div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-400">{agents.reduce((s, a) => s + a.alerts, 0)}</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2"><Database className="h-4 w-4 text-cyan-400" /><p className="text-xs text-muted-foreground">Data Sources</p></div>
          <p className="mt-1 text-2xl font-bold tabular-nums">{new Set(agents.flatMap((a) => a.dataSources)).size}</p>
        </GlassPanel>
      </div>

      {/* Agent cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <motion.div key={agent.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassPanel hover className="p-5 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'rounded-lg p-2',
                    agent.status === 'active' ? 'bg-emerald-500/10' : 'bg-card'
                  )}>
                    <Bot className={cn('h-4 w-4', agent.status === 'active' ? 'text-emerald-400' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    'h-2 w-2 rounded-full',
                    agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground'
                  )} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{agent.status}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Run</span>
                  <span>{new Date(agent.lastRun).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium tabular-nums">{(agent.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alerts</span>
                  <span className={cn('font-medium', agent.alerts > 0 ? 'text-amber-400' : 'text-muted-foreground')}>{agent.alerts}</span>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">Data Sources</p>
                <div className="flex flex-wrap gap-1">
                  {agent.dataSources.map((src) => (
                    <span key={src} className="text-[10px] rounded bg-card border border-border px-1.5 py-0.5 text-muted-foreground">{src}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">Findings</p>
                <div className="space-y-1">
                  {agent.findings.map((f, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
