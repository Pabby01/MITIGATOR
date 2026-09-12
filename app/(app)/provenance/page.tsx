'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { SourceBadge, FreshnessBadge } from '@/components/shared/SourceBadge';
import { getProvenanceRecords, getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ProvenancePage() {
  const assets = getAllAssets();
  const [symbol, setSymbol] = useState('NVDAx');
  const records = getProvenanceRecords(symbol);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Provenance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Trust layer — every data point traced to its source, freshness, and verification status</p>
      </div>

      {/* Asset selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
        {assets.map((a) => (
          <button
            key={a.tokenizedAsset.symbol}
            onClick={() => setSymbol(a.tokenizedAsset.symbol)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
              symbol === a.tokenizedAsset.symbol ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {a.tokenizedAsset.symbol}
          </button>
        ))}
      </div>

      {/* Source tier legend */}
      <GlassPanel className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Source Quality Tiers</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['CANONICAL', 'PRIMARY', 'VERIFIED', 'SECONDARY', 'SOCIAL', 'UNCONFIRMED', 'CONFLICTING'] as const).map((tier) => (
            <SourceBadge key={tier} tier={tier} />
          ))}
        </div>
      </GlassPanel>

      {/* Records */}
      <div className="space-y-3">
        {records.map((record, i) => (
          <motion.div key={record.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassPanel hover className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{record.dataPoint}</p>
                    <p className="text-xs text-muted-foreground">{record.provider} · {record.endpoint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SourceBadge tier={record.sourceTier} />
                  <FreshnessBadge freshness={record.freshness} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Retrieved</p>
                  <p className="font-medium">{new Date(record.retrievedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Published</p>
                  <p className="font-medium">{new Date(record.publishedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="font-medium tabular-nums">{(record.confidence * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verification</p>
                  <p className={cn(
                    'font-medium flex items-center gap-1',
                    record.verification === 'verified' ? 'text-emerald-400' :
                    record.verification === 'partial' ? 'text-amber-400' :
                    record.verification === 'conflicting' ? 'text-red-400' : 'text-muted-foreground'
                  )}>
                    {record.verification === 'verified' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {record.verification}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {record.notes}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
