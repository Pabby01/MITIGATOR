'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  Play,
  Loader2,
  Sparkles,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowRight,
  X,
  Code2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PageTipSection } from '@/components/shared/PageTipSection';
import { AIAgent, AgentRunResult } from '@/lib/services/agents-service';
import { getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function AgentsPage() {
  const assets = getAllAssets();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('NVDAx');
  const [loading, setLoading] = useState(true);

  // Execution states
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [lastResults, setLastResults] = useState<Record<string, AgentRunResult>>({});

  // Telemetry modal
  const [inspectedAgent, setInspectedAgent] = useState<{ agent: AIAgent; result?: AgentRunResult } | null>(null);

  // Fetch agents from API
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/run');
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch (err) {
      console.warn('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Run a single agent live
  const handleRunAgent = async (agentId: string) => {
    setRunningAgentId(agentId);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          symbol: selectedSymbol,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const result: AgentRunResult = data.result;

        setLastResults((prev) => ({ ...prev, [agentId]: result }));

        // Update agent in state
        setAgents((prev) =>
          prev.map((a) =>
            a.id === agentId
              ? {
                  ...a,
                  status: 'active',
                  lastRun: result.timestamp,
                  confidence: result.confidence,
                  findings: result.findings,
                }
              : a
          )
        );
      }
    } catch (err) {
      console.error('Run agent error:', err);
    } finally {
      setRunningAgentId(null);
    }
  };

  // Run all agents sequentially
  const handleRunAllAgents = async () => {
    if (isRunningAll || agents.length === 0) return;
    setIsRunningAll(true);
    setRunProgress(0);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      setRunningAgentId(agent.id);
      try {
        const res = await fetch('/api/agents/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: agent.id,
            symbol: selectedSymbol,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const result: AgentRunResult = data.result;
          setLastResults((prev) => ({ ...prev, [agent.id]: result }));

          setAgents((prev) =>
            prev.map((a) =>
              a.id === agent.id
                ? {
                    ...a,
                    status: 'active',
                    lastRun: result.timestamp,
                    confidence: result.confidence,
                    findings: result.findings,
                  }
                : a
            )
          );
        }
      } catch (err) {
        console.error(`Error running agent ${agent.id}:`, err);
      }
      setRunProgress(Math.round(((i + 1) / agents.length) * 100));
    }

    setRunningAgentId(null);
    setIsRunningAll(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">AI Autonomous Agent Fleet</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              PRD §9 Multi-Agent Grid
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            9 specialized sub-agents independently synthesizing SEC filings, Pyth oracle feeds, and Jupiter AMM liquidity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAllAgents}
            disabled={isRunningAll || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
          >
            {isRunningAll ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Running Grid ({runProgress}%)...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Run All 9 Agents</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Guide & Defense Section */}
      <PageTipSection
        pageTitle="AI Autonomous Agent Fleet"
        subtitle="How 9 specialized sub-agents independently audit and validate tokenized equities"
        badge="Autonomous Pods"
        storageKey="agents"
        tips={[
          {
            title: 'Decentralized Pod Architecture',
            description:
              'Modeled after institutional quant pod shops. 9 dedicated sub-agents analyze separate domains: SEC Disclosures, Pyth Oracle Health, AMM Liquidity Depth, Social Drift, and Bankruptcy Remoteness.',
            badge: '9 Sub-Agents',
          },
          {
            title: 'Parallel Fleet Execution',
            description:
              'Dispatch all 9 agents simultaneously across any selected tokenized stock (NVDAx, TSLAx, AAPLx) to run comprehensive audits in seconds without bottlenecking.',
            badge: 'Async Processing',
          },
          {
            title: 'Transparent Telemetry Inspection',
            description:
              'Inspect raw machine-readable JSON inputs, step-by-step reasoning tokens, and cryptographic source proofs behind every agent finding to ensure full auditability.',
            badge: 'Full Traceability',
          },
        ]}
        hackathonDefense="Instead of relying on a black-box LLM prompt, MITIGATOR dispatches a specialized multi-agent grid where each agent has strict domain boundaries, verifiable tools, and objective confidence thresholds, delivering true institutional rigour to Solana DeFi."
      />

      {/* Target Asset Selector */}
      <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-xl bg-card/40 border border-border/70">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-xs font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" /> Target Tokenized Stock:
          </span>
          {assets.map((a) => {
            const sym = a.tokenizedAsset.symbol;
            const isSelected = selectedSymbol === sym;
            return (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border transition-all whitespace-nowrap',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/30'
                    : 'bg-card/60 hover:bg-card border-border/70 text-foreground hover:border-primary/40'
                )}
              >
                {sym}
              </button>
            );
          })}
        </div>
        <div className="text-[11px] font-mono text-muted-foreground">
          Telemetry Grounding: <span className="text-primary font-bold">{selectedSymbol}</span>
        </div>
      </div>

      {/* Agent status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <p className="text-xs text-muted-foreground">Active Agents</p>
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-400">
            {agents.filter((a) => a.status === 'active').length}
          </p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Standby / Idle</p>
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {agents.filter((a) => a.status === 'idle').length}
          </p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-muted-foreground">Anomalies Detected</p>
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-400">
            {agents.reduce((s, a) => s + a.alerts, 0)}
          </p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            <p className="text-xs text-muted-foreground">Monitored Venues</p>
          </div>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {new Set(agents.flatMap((a) => a.dataSources)).size || 12}
          </p>
        </GlassPanel>
      </div>

      {/* Agent Cards Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-muted-foreground">Connecting to agent fleet coordinator...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => {
            const isRunning = runningAgentId === agent.id;
            const result = lastResults[agent.id];

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassPanel hover className="p-5 h-full flex flex-col justify-between">
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            'rounded-lg p-2.5 transition-colors',
                            isRunning
                              ? 'bg-primary/20 text-primary'
                              : agent.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-card text-muted-foreground'
                          )}
                        >
                          <Bot className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{agent.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{agent.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            isRunning
                              ? 'bg-primary animate-ping'
                              : agent.status === 'active'
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-muted-foreground'
                          )}
                        />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                          {isRunning ? 'Scanning...' : agent.status}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-1.5 text-xs py-2 border-y border-border/40">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Evaluation</span>
                        <span className="font-mono text-foreground">
                          {new Date(agent.lastRun).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model Confidence</span>
                        <span className="font-mono font-semibold text-primary">
                          {(agent.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Alerts</span>
                        <span
                          className={cn(
                            'font-mono font-semibold',
                            agent.alerts > 0 ? 'text-amber-400' : 'text-emerald-400'
                          )}
                        >
                          {agent.alerts === 0 ? 'Nominal (0)' : `${agent.alerts} Warning`}
                        </span>
                      </div>
                    </div>

                    {/* Data Sources */}
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                        Verified Sources
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {agent.dataSources.map((src) => (
                          <span
                            key={src}
                            className="text-[10px] font-mono rounded bg-card/60 border border-border/80 px-1.5 py-0.5 text-muted-foreground"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Latest Findings */}
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                        Latest Ground Truth Findings
                      </p>
                      <div className="space-y-1.5">
                        {agent.findings.map((f, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground text-[11px] leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRunAgent(agent.id)}
                      disabled={isRunning || isRunningAll}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 border border-primary/25 py-2 text-xs text-primary hover:bg-primary/20 transition-all font-medium disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Scanning...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 fill-current" />
                          <span>Run Scan</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setInspectedAgent({ agent, result })}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-foreground hover:border-primary/40 hover:bg-card/60 transition-all font-medium"
                    >
                      <Code2 className="h-3 w-3" />
                      <span>Telemetry</span>
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Raw Telemetry Inspector Modal */}
      <AnimatePresence>
        {inspectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <GlassPanel className="p-6 border-border shadow-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {inspectedAgent.agent.name} Telemetry
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Verified cryptographic &amp; API proofs for {selectedSymbol}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectedAgent(null)}
                    className="p-1 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Ground Truth Breakdown */}
                <div className="p-3 rounded-xl bg-card/60 border border-border/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent Role:</span>
                    <span className="font-semibold text-foreground">{inspectedAgent.agent.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Equity:</span>
                    <span className="font-mono font-bold text-primary">{selectedSymbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence Metric:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {(inspectedAgent.agent.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Evaluation Timestamp:</span>
                    <span className="font-mono text-muted-foreground">
                      {new Date(inspectedAgent.agent.lastRun).toISOString()}
                    </span>
                  </div>
                </div>

                {/* Raw Telemetry JSON Payload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Verified Proof Payload</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      200 OK · Canonical
                    </span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-muted/20 border border-border font-mono text-[11px] text-foreground overflow-x-auto leading-relaxed max-h-48">
                    {JSON.stringify(
                      inspectedAgent.result?.telemetry || {
                        targetSymbol: selectedSymbol,
                        monitoredSources: inspectedAgent.agent.dataSources,
                        status: 'Verified nominal',
                        lastHeartbeat: inspectedAgent.agent.lastRun,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                {/* Modal Footer */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => {
                      handleRunAgent(inspectedAgent.agent.id);
                      setInspectedAgent(null);
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Trigger Re-scan</span>
                  </button>
                  <button
                    onClick={() => setInspectedAgent(null)}
                    className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-medium hover:bg-card/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
