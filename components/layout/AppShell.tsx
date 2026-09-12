'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  Wallet,
  Users,
  Cpu,
  Bell,
  Settings,
  Search,
  Command,
  Activity,
  Bot,
  FlaskConical,
  ScrollText,
  ChevronLeft,
  Menu,
  X,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';

const NAV_ITEMS = [
  { href: '/discover', label: 'Overview', icon: LayoutDashboard },
  { href: '/market', label: 'Markets', icon: TrendingUp },
  { href: '/intelligence', label: 'Intelligence', icon: Brain },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/strategies', label: 'Strategies', icon: Cpu },
  { href: '/paper', label: 'Paper Trading', icon: FlaskConical },
  { href: '/agents', label: 'AI Agents', icon: Bot },
  { href: '/alerts', label: 'Alerts', icon: Bell },
];

const SECONDARY_NAV = [
  { href: '/risk', label: 'Risk Center', icon: ShieldCheck },
  { href: '/execution', label: 'Execution', icon: Zap },
  { href: '/robo', label: 'Robo Advisor', icon: Bot },
  { href: '/provenance', label: 'Provenance', icon: ScrollText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('7xKf...3pQw');
  const [walletType, setWalletType] = useState<'phantom' | 'solflare' | 'backpack' | 'demo'>('demo');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setWalletModalOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─── SIDEBAR ─── */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card/30 backdrop-blur-sm transition-all duration-200',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo size={26} glow />
            {!collapsed && <span className="text-lg font-bold tracking-tight text-foreground">MITIGATOR</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/discover' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-sm shadow-primary" />}
              </Link>
            );
          })}

          <div className="pt-4 pb-2">
            {!collapsed && <p className="px-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Tools</p>}
          </div>

          {SECONDARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                  active
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Wallet Pill */}
        <div className="border-t border-border p-2">
          <button
            onClick={() => setWalletModalOpen(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all text-left"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-3.5 w-3.5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-foreground">{walletConnected ? walletAddress : 'Connect Wallet'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  {walletConnected ? (walletType === 'demo' ? 'Demo Mode Active' : 'Solana Mainnet') : 'Disconnected'}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <div className="flex items-center gap-2">
                  <BrandLogo size={24} glow />
                  <span className="text-lg font-bold tracking-tight">MITIGATOR</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="text-muted-foreground p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
                {[...NAV_ITEMS, ...SECONDARY_NAV].map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                        active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 h-16 px-4 md:px-6 border-b border-border bg-card/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden text-muted-foreground p-1"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-muted-foreground hover:border-primary/30 transition-colors w-full max-w-md shadow-inner"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Search tokenized assets, ask AI...</span>
              <span className="ml-auto hidden md:flex items-center gap-0.5 text-[10px] rounded border border-border px-1.5 py-0.5">
                <Command className="h-2.5 w-2.5" />K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Market status */}
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">Market Open</span>
              </span>
            </div>
            {/* Data health */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-muted-foreground">Data: Live</span>
            </div>
            {/* Network */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-muted-foreground">Solana</span>
            </div>
            {/* Theme toggle */}
            <ThemeToggle />
            {/* Wallet button */}
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/25 px-3 py-1.5 text-sm hover:bg-primary/20 transition-all active:scale-95"
            >
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-primary tabular-nums">
                {walletConnected ? walletAddress : 'Connect'}
              </span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Solana Wallet Modal */}
      <AnimatePresence>
        {walletModalOpen && (
          <WalletModal
            connected={walletConnected}
            address={walletAddress}
            type={walletType}
            onClose={() => setWalletModalOpen(false)}
            onConnect={(addr, typ) => {
              setWalletAddress(addr);
              setWalletType(typ);
              setWalletConnected(true);
              setWalletModalOpen(false);
            }}
            onDisconnect={() => {
              setWalletConnected(false);
              setWalletModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WalletModal({
  connected,
  address,
  type,
  onClose,
  onConnect,
  onDisconnect,
}: {
  connected: boolean;
  address: string;
  type: string;
  onClose: () => void;
  onConnect: (addr: string, type: 'phantom' | 'solflare' | 'backpack' | 'demo') => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md hairline-card rounded-2xl p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={24} glow />
            <div>
              <h3 className="text-base font-bold">Solana Wallet</h3>
              <p className="text-xs text-muted-foreground">Select a provider to connect</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {connected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="font-mono font-medium text-foreground">{address}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="text-foreground">Solana Mainnet-Beta</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Demo Balance</span>
                <span className="font-mono text-emerald-400 font-semibold">54.20 SOL</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onDisconnect}
                className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {[
              { id: 'phantom' as const, name: 'Phantom', addr: '9xV2...8kPt', icon: '🟣' },
              { id: 'solflare' as const, name: 'Solflare', addr: '4zKp...1mQy', icon: '🟠' },
              { id: 'backpack' as const, name: 'Backpack', addr: '2hLw...9xNr', icon: '🔴' },
              { id: 'demo' as const, name: '1-Click Demo Wallet', addr: '7xKf...3pQw', icon: '⚡' },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => onConnect(w.addr, w.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-card/70 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{w.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground">{w.id === 'demo' ? 'Pre-funded simulation account' : 'Connect browser extension'}</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground text-center">
          Non-custodial. Private keys or seed phrases are never requested.
        </p>
      </motion.div>
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const assets = getAllAssetsStatic();

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl glass-panel rounded-xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tokenized assets, ask AI, jump to view..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {query === '' && (
            <>
              <p className="px-2 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Quick Actions</p>
              {[
                { label: 'Open Portfolio', href: '/portfolio', icon: Wallet },
                { label: 'Ask AI Copilot', href: '/intelligence', icon: Brain },
                { label: 'Analyze Trade', href: '/risk', icon: ShieldCheck },
                { label: 'Open Alerts', href: '/alerts', icon: Bell },
                { label: 'Start Paper Trade', href: '/paper', icon: FlaskConical },
                { label: 'Compare Execution', href: '/execution', icon: Zap },
              ].map((cmd) => (
                <Link
                  key={cmd.label}
                  href={cmd.href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-card/50 transition-colors"
                >
                  <cmd.icon className="h-4 w-4 text-muted-foreground" />
                  {cmd.label}
                </Link>
              ))}
            </>
          )}
          {query !== '' && (
            <>
              <p className="px-2 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">Assets</p>
              {assets
                .filter((a) => a.symbol.toLowerCase().includes(query.toLowerCase()) || a.name.toLowerCase().includes(query.toLowerCase()))
                .map((a) => (
                  <Link
                    key={a.symbol}
                    href={`/market/${a.symbol}`}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                        {a.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{a.symbol}</p>
                        <p className="text-xs text-muted-foreground">{a.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium tabular-nums">${a.price.toFixed(2)}</p>
                      <p className={cn('text-xs tabular-nums', a.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                        {a.changePct >= 0 ? '+' : ''}{a.changePct.toFixed(2)}%
                      </p>
                    </div>
                  </Link>
                ))}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function getAllAssetsStatic() {
  return [
    { symbol: 'NVDAx', name: 'NVIDIA Corporation', price: 184.22, changePct: 3.82 },
    { symbol: 'AAPLx', name: 'Apple Inc.', price: 226.87, changePct: 1.24 },
    { symbol: 'TSLAx', name: 'Tesla, Inc.', price: 248.5, changePct: -2.14 },
    { symbol: 'AMZNx', name: 'Amazon.com, Inc.', price: 174.33, changePct: 0.87 },
    { symbol: 'GOOGLx', name: 'Alphabet Inc.', price: 163.12, changePct: 2.05 },
    { symbol: 'SPYx', name: 'SPDR S&P 500 ETF', price: 547.63, changePct: 0.42 },
    { symbol: 'QQQx', name: 'Invesco QQQ Trust', price: 472.18, changePct: 0.91 },
  ];
}
