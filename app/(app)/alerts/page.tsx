'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  BellRing,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { getAllAssets } from '@/lib/mock-data';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { UserAlert } from '@/lib/services/alerts-service';
import { cn } from '@/lib/utils';

const ALERT_TYPES = [
  { id: 'price', label: 'Price Target (USD)' },
  { id: 'risk', label: 'MITIGATOR Risk Deterioration' },
  { id: 'peg_divergence', label: 'Token-2022 Peg Divergence (%)' },
  { id: 'liquidity', label: 'Liquidity & Slippage Spike (%)' },
];

export default function AlertsPage() {
  const assets = getAllAssets();
  const { address } = useSolanaWallet();
  const userAddress = address || 'guest';

  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState('price');
  const [newSymbol, setNewSymbol] = useState('NVDAx');
  const [newCondition, setNewCondition] = useState<'above' | 'below'>('above');
  const [newThreshold, setNewThreshold] = useState(190);
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch alerts from API
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alerts?address=${userAddress}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.warn('Failed to fetch alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [userAddress]);

  // Create alert
  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          userAddress,
          alert: {
            type: newType,
            symbol: newSymbol,
            condition: newCondition,
            threshold: newThreshold,
            currentValue: 0,
            notes: newNotes || `${newSymbol} ${newCondition} ${newThreshold}`,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alert) {
          setAlerts((prev) => [data.alert, ...prev]);
          setShowCreate(false);
          setNewNotes('');
          setStatusMessage(`Alert created for ${newSymbol}`);
          setTimeout(() => setStatusMessage(null), 3500);
        }
      }
    } catch (e) {
      console.error('Create alert failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete alert
  const handleDeleteAlert = async (id: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          userAddress,
          alertId: id,
        }),
      });

      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error('Delete alert failed:', e);
    }
  };

  // Toggle active alert
  const handleToggleAlert = async (id: string) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          userAddress,
          alertId: id,
        }),
      });

      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
        );
      }
    } catch (e) {
      console.error('Toggle alert failed:', e);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Toast message */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Alerts Surveillance</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              Live Pyth Monitored
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Automated alerts for price breakouts, risk deterioration, depeg deviations, and corporate filings
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Create Alert Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassPanel className="p-5 border-border shadow-xl">
              <h2 className="text-sm font-semibold tracking-wide mb-4 flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" />
                Configure Surveillance Alert
              </h2>

              <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
                <div className="grid md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Alert Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs outline-none text-foreground font-medium"
                    >
                      {ALERT_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Asset</label>
                    <select
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs outline-none text-foreground font-medium"
                    >
                      {assets.map((a) => (
                        <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>
                          {a.tokenizedAsset.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Condition</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value as any)}
                      className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs outline-none text-foreground font-medium"
                    >
                      <option value="above">Rises Above (&gt;=)</option>
                      <option value="below">Falls Below (&lt;=)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted-foreground block mb-1 font-medium">Threshold Target</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={newThreshold}
                      onChange={(e) => setNewThreshold(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs outline-none tabular-nums font-mono font-bold text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1 font-medium">Trigger Notes (Optional)</label>
                  <input
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Notify before earnings or when price crosses 20-day SMA"
                    className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs outline-none text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>Save Alert</span>
                  </button>
                </div>
              </form>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts Feed */}
      {loading ? (
        <div className="p-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-muted-foreground">Syncing alerts surveillance feed...</p>
        </div>
      ) : alerts.length === 0 ? (
        <GlassPanel className="p-12 text-center space-y-3">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
          <h3 className="text-base font-bold text-foreground">No Surveillance Alerts Active</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Set real-time alerts for price movements, oracle depeg events, and MITIGATOR risk changes.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create First Alert</span>
          </button>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GlassPanel hover className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'rounded-xl p-2.5 flex-shrink-0 mt-0.5',
                      alert.triggered
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : alert.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-card text-muted-foreground border border-border'
                    )}
                  >
                    {alert.triggered ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-foreground">{alert.symbol}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-card border border-border uppercase font-semibold text-muted-foreground">
                        {alert.type.replace(/_/g, ' ')}
                      </span>
                      {alert.triggered ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                          TRIGGERED
                        </span>
                      ) : alert.active ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          SURVEILLANCE ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-muted text-muted-foreground">
                          PAUSED
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-foreground font-medium mt-1">
                      Trigger when {alert.symbol} {alert.condition === 'above' ? '≥' : '≤'}{' '}
                      <span className="font-mono font-bold text-primary">
                        {alert.type === 'price' ? `$${alert.threshold}` : alert.threshold}
                      </span>
                      {alert.currentValue > 0 && (
                        <span className="text-muted-foreground font-mono ml-2">
                          (Current: {alert.type === 'price' ? `$${alert.currentValue.toFixed(2)}` : alert.currentValue})
                        </span>
                      )}
                    </p>

                    {alert.notes && <p className="text-xs text-muted-foreground mt-0.5">{alert.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                      alert.active
                        ? 'border-border hover:bg-card text-foreground'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    )}
                  >
                    {alert.active ? 'Pause' : 'Resume'}
                  </button>

                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-lg border border-border hover:border-red-500/40 text-muted-foreground hover:text-red-400 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        Alert surveillance runs continuously against sub-second Pyth Hermes streaming feeds and SEC EDGAR filing disclosures.
      </div>
    </div>
  );
}
