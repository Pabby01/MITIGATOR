'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, BellRing, Trash2, ShieldCheck } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { getAlerts, getAllAssets } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ALERT_TYPES = ['price', 'news', 'sentiment', 'risk', 'liquidity', 'price_divergence', 'corporate_action', 'earnings', 'portfolio_concentration', 'strategy', 'natural_language'];

export default function AlertsPage() {
  const existingAlerts = getAlerts();
  const assets = getAllAssets();
  const [alerts, setAlerts] = useState(existingAlerts);
  const [showCreate, setShowCreate] = useState(false);
  const [newType, setNewType] = useState('price');
  const [newSymbol, setNewSymbol] = useState('NVDAx');
  const [newThreshold, setNewThreshold] = useState(200);

  const addAlert = () => {
    setAlerts([
      {
        id: `alert-${Date.now()}`,
        type: newType as any,
        symbol: newSymbol,
        condition: 'above',
        threshold: newThreshold,
        current: 0,
        triggered: false,
        triggeredAt: null,
        createdAt: new Date().toISOString(),
        active: true,
      },
      ...alerts,
    ]);
    setShowCreate(false);
  };

  const removeAlert = (id: string) => setAlerts(alerts.filter((a) => a.id !== id));

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor price, risk, news, sentiment, and portfolio conditions</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel className="p-5">
            <h2 className="text-sm font-semibold tracking-wide mb-4">Create Alert</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Type</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none">
                  {ALERT_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Asset</label>
                <select value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none">
                  {assets.map((a) => (
                    <option key={a.tokenizedAsset.symbol} value={a.tokenizedAsset.symbol}>{a.tokenizedAsset.symbol}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Threshold</label>
                <input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg border border-border bg-card/50 px-3 py-2 text-sm outline-none tabular-nums"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={addAlert} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Create</button>
              <button onClick={() => setShowCreate(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-card/30 p-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              Natural language: "Alert me when NVDAx risk rises above 70" — type this in the search bar.
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Alert list */}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <motion.div key={alert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <GlassPanel hover className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'rounded-lg p-2',
                  alert.triggered ? 'bg-amber-500/10' : 'bg-card'
                )}>
                  {alert.triggered ? <BellRing className="h-4 w-4 text-amber-400" /> : <Bell className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {alert.symbol} — {alert.type.replace(/_/g, ' ')} {alert.condition} {alert.threshold}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Current: {alert.current} · {alert.triggered
                      ? `Triggered ${alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}`
                      : `Created ${new Date(alert.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {alert.triggered && (
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Triggered</span>
                )}
                <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No alerts configured. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
