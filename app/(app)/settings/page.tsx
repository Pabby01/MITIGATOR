'use client';

import { useState } from 'react';
import { ShieldCheck, Wallet, Bell, Eye, Zap, Globe, Sun, Moon } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { connected, address, shortAddress, balanceSol, disconnect, setIsModalOpen } = useSolanaWallet();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [webglFallback, setWebglFallback] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Preferences, display, and safety configuration</p>
      </div>

      {/* Wallet */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide">Wallet Connection</h2>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <div>
              {connected && address ? (
                <>
                  <p className="text-sm font-medium font-mono">{shortAddress}</p>
                  <p className="text-xs text-emerald-400 font-mono">
                    {balanceSol.toFixed(3)} SOL · Solana Mainnet-Beta
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">No Wallet Connected</p>
                  <p className="text-xs text-muted-foreground">
                    Connect Phantom, Solflare, or Backpack for live trading
                  </p>
                </>
              )}
            </div>
          </div>
          {connected ? (
            <button
              onClick={() => disconnect()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 py-1.5 text-xs transition-colors shadow-xs"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </GlassPanel>

      {/* Display */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide">Display & Performance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Toggle between dark and light mode</p>
            </div>
            <ThemeToggle />
          </div>
          <ToggleRow
            label="Reduced Motion"
            desc="Minimize animations and 3D effects"
            value={reducedMotion}
            onChange={setReducedMotion}
          />
          <ToggleRow
            label="WebGL Fallback"
            desc="Use 2D fallback for low-performance devices"
            value={webglFallback}
            onChange={setWebglFallback}
          />
          <ToggleRow
            label="Auto-Refresh Data"
            desc="Automatically refresh market data every 5 seconds"
            value={autoRefresh}
            onChange={setAutoRefresh}
          />
        </div>
      </GlassPanel>

      {/* Notifications */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold tracking-wide">Notifications</h2>
        </div>
        <ToggleRow
          label="Push Notifications"
          desc="Receive alerts for triggered conditions"
          value={notifications}
          onChange={setNotifications}
        />
      </GlassPanel>

      {/* Safety */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide">Safety</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">Max Slippage Default</p>
              <p className="text-xs text-muted-foreground">Default slippage tolerance for all trades</p>
            </div>
            <span className="font-medium tabular-nums">0.50%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">Event Blackout</p>
              <p className="text-xs text-muted-foreground">Pause trading around earnings and major events</p>
            </div>
            <span className="text-emerald-400 text-xs flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Enabled</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">Human Approval</p>
              <p className="text-xs text-muted-foreground">Require manual confirmation for all trades</p>
            </div>
            <span className="text-emerald-400 text-xs flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Required</span>
          </div>
        </div>
      </GlassPanel>

      {/* Network */}
      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold tracking-wide">Network</h2>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium">Solana Mainnet</p>
            <p className="text-xs text-muted-foreground">Connected via Solana RPC</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
          </span>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/30 p-3 text-xs text-muted-foreground">
        <Zap className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
        MITIGATOR never stores your seed phrase, private key, or wallet credentials. All signing happens client-side.
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn('relative h-5 w-9 rounded-full transition-colors', value ? 'bg-primary' : 'bg-border')}
      >
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', value ? 'translate-x-4' : 'translate-x-0.5')} />
      </button>
    </div>
  );
}
