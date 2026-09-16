'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Wallet, Bell, Eye, Zap, Globe, Sun, Moon, User } from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import { getUserProfile, saveUserProfile, UserProfile } from '@/lib/services/user-profile';
import { isSupabaseConfigured } from '@/lib/services/supabase';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { connected, address, shortAddress, balanceSol, network, setNetwork, disconnect, setIsModalOpen } = useSolanaWallet();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [webglFallback, setWebglFallback] = useState(false);

  // Profile states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('Solana Trader');
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [maxOrderSize, setMaxOrderSize] = useState(5000);
  const [maxSlippage, setMaxSlippage] = useState(0.5);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    getUserProfile(address || 'guest').then((p) => {
      setProfile(p);
      setDisplayName(p.displayName);
      setRiskTolerance(p.riskTolerance);
      setMaxOrderSize(p.maxOrderSizeUsd);
      setMaxSlippage(p.maxSlippagePct);
    });
  }, [address]);

  const handleSaveProfile = async () => {
    const updated: UserProfile = {
      walletAddress: address || 'guest',
      displayName,
      riskTolerance,
      maxOrderSizeUsd: maxOrderSize,
      maxSlippagePct: maxSlippage,
      watchlist: profile?.watchlist || ['NVDAx', 'TSLAx', 'AAPLx'],
      notifications: profile?.notifications || {
        pegDeviation: true,
        secFilings: true,
        riskDeterioration: true,
      },
      createdAt: profile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveUserProfile(updated);
    setProfile(updated);
    setSaveStatus('Saved & Synced');
    setTimeout(() => setSaveStatus(null), 3000);
  };

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
                    {balanceSol.toFixed(3)} SOL · {network === 'devnet' ? 'Solana Devnet' : 'Solana Mainnet'}
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

      {/* User Profile & Persona */}
      <GlassPanel className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold tracking-wide">Trader Profile & Risk Persona</h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isSupabaseActive ? 'Supabase Sync Active' : 'Client Storage (Encrypted Local)'}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Trader Alias / Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Satoshi.sol"
              className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Risk Persona</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}
                className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="conservative">Conservative (Preservation)</option>
                <option value="balanced">Balanced (Alpha & Guardrails)</option>
                <option value="aggressive">Aggressive (Degen Sizing)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Max Order Size Cap</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={maxOrderSize}
                  onChange={(e) => setMaxOrderSize(Number(e.target.value))}
                  className="w-full rounded-lg bg-background/60 border border-border pl-7 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1">Max Slippage Cap</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={maxSlippage}
                  onChange={(e) => setMaxSlippage(Number(e.target.value))}
                  className="w-full rounded-lg bg-background/60 border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
                <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {saveStatus ? <span className="text-emerald-400 font-medium">{saveStatus}</span> : 'Profile preferences govern pre-trade execution guardrails.'}
            </span>
            <button
              onClick={handleSaveProfile}
              className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 text-xs transition-colors shadow-xs"
            >
              Save Profile
            </button>
          </div>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold tracking-wide">Solana Cluster & Network</h2>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Configurable in .env or switch live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setNetwork('devnet')}
            className={cn(
              "flex items-start justify-between p-3 rounded-xl border text-left transition-all",
              network === 'devnet'
                ? "border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30"
                : "border-border hover:border-border/80 bg-card/40"
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Solana Devnet</span>
                {network === 'devnet' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">Active</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Recommended for testing, airdrops & simulated orders</p>
              <p className="text-[10px] font-mono text-amber-400/80 mt-1">USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU</p>
            </div>
            <span className={cn("h-2 w-2 rounded-full mt-1 flex-shrink-0", network === 'devnet' ? "bg-amber-400 animate-pulse" : "bg-muted")} />
          </button>

          <button
            type="button"
            onClick={() => setNetwork('mainnet-beta')}
            className={cn(
              "flex items-start justify-between p-3 rounded-xl border text-left transition-all",
              network === 'mainnet-beta'
                ? "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                : "border-border hover:border-border/80 bg-card/40"
            )}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Solana Mainnet</span>
                {network === 'mainnet-beta' && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">Active</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Live production trading with real capital & tokenized shares</p>
              <p className="text-[10px] font-mono text-emerald-400/80 mt-1">USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</p>
            </div>
            <span className={cn("h-2 w-2 rounded-full mt-1 flex-shrink-0", network === 'mainnet-beta' ? "bg-emerald-400 animate-pulse" : "bg-muted")} />
          </button>
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
