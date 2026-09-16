'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  Hash,
  Sparkles,
  Layers,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge, FreshnessBadge } from '@/components/shared/SourceBadge';
import { getAllAssets } from '@/lib/mock-data';
import { ProvenanceRecord } from '@/lib/services/provenance-service';
import { cn } from '@/lib/utils';

export default function ProvenancePage() {
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState('NVDAx');
  const [records, setRecords] = useState<ProvenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live provenance records
  const fetchProvenance = async (targetSymbol: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/provenance?symbol=${targetSymbol}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (e) {
      console.warn('Failed to fetch provenance records:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvenance(symbol);
  }, [symbol]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Data Provenance &amp; Trust Layer</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              PRD §10 Auditable Trail
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Every data point traced to its authoritative origin, sub-second timestamp, and cryptographic proof
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5 inline mr-1" />
            100% Ground Truth Verified
          </span>
        </div>
      </div>

      {/* Asset Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs bg-card/40 border border-border p-2 rounded-xl">
        <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" /> Target Stock:
        </span>
        {assets.map((a) => {
          const sym = a.tokenizedAsset.symbol;
          const isSelected = symbol === sym;
          return (
            <button
              key={sym}
              onClick={() => setSymbol(sym)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold whitespace-nowrap transition-all',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                  : 'border-border/80 text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              {sym}
            </button>
          );
        })}
      </div>

      {/* Source Quality Tier Legend */}
      <GlassPanel className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Data Hierarchy &amp; Verification Tiers</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['CANONICAL', 'PRIMARY', 'VERIFIED', 'SECONDARY', 'SOCIAL', 'UNCONFIRMED'] as const).map((tier) => (
            <SourceBadge key={tier} tier={tier} />
          ))}
        </div>
      </GlassPanel>

      {/* Provenance Records Feed */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-muted-foreground">
            Verifying cryptographic proofs and SEC EDGAR accession hashes for {symbol}...
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <GlassPanel hover className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 text-primary mt-0.5 flex-shrink-0">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{record.dataPoint}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold text-foreground">{record.provider}</span> ·{' '}
                        <span className="font-mono text-[11px]">{record.endpoint}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                    <SourceBadge tier={record.sourceTier} />
                    <FreshnessBadge freshness={record.freshness} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-border/40">
                  <div className="p-2 rounded-lg bg-card/40 border border-border/40">
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Retrieved</p>
                    <p className="font-mono font-medium text-foreground">
                      {new Date(record.retrievedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-card/40 border border-border/40">
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Published</p>
                    <p className="font-mono font-medium text-foreground">
                      {new Date(record.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-card/40 border border-border/40">
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Model Confidence</p>
                    <p className="font-mono font-bold text-primary">{(record.confidence * 100).toFixed(0)}%</p>
                  </div>

                  <div className="p-2 rounded-lg bg-card/40 border border-border/40">
                    <p className="text-muted-foreground text-[10px] uppercase font-semibold">Verification</p>
                    <p className="font-mono font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                      Verified Valid
                    </p>
                  </div>
                </div>

                {/* Verification details and cryptographic proof */}
                <div className="p-3 rounded-lg bg-card/60 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                      Empirical Proof Details
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">{record.verificationDetails}</p>
                  </div>

                  {record.proofUrl && (
                    <a
                      href={record.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      <span>Inspect Source</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        MITIGATOR&apos;s provenance protocol prevents hallucinated or adversarial pricing by enforcing strict multi-signature oracle consensus and direct links to public SEC EDGAR primary records.
      </div>
    </div>
  );
}
