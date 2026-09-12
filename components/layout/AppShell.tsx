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
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';
import { useSolanaWallet, WalletProviderType } from '@/lib/services/solana-wallet';

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

  const { connected, shortAddress, walletType, isModalOpen, setIsModalOpen } = useSolanaWallet();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background ambient-page-bg selection:bg-primary/20 selection:text-primary">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border bg-card/30 backdrop-blur-sm transition-all duration-200 z-20',
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
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/50"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav Links */}
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
                    ? 'bg-primary/10 text-primary font-medium shadow-sm'
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
                    ? 'bg-primary/10 text-primary font-medium shadow-sm'
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
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all text-left"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-3.5 w-3.5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-foreground">
                  {connected ? shortAddress : 'Connect Wallet'}
                </p>
                <p className={cn("text-[10px] font-mono", connected ? "text-emerald-400" : "text-muted-foreground")}>
                  {connected ? `${walletType?.toUpperCase()} Connected` : 'Disconnected'}
                </p>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile drawer (fallback if user taps header menu) */}
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

      {/* ─── MAIN CONTENT VIEWPORT ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 h-16 px-4 md:px-6 border-b border-border bg-card/30 backdrop-blur-sm flex-shrink-0 z-10">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden text-muted-foreground p-1 hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-muted-foreground hover:border-primary/30 transition-colors w-full max-w-md shadow-inner"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Search AAPL, NVDA, ask AI agent...</span>
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
              <span className="text-muted-foreground">Pyth & Jup: Live</span>
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
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all active:scale-95",
                connected
                  ? "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
              )}
            >
              <Wallet className="h-3.5 w-3.5" />
              <span className="font-semibold tabular-nums">
                {connected ? shortAddress : 'Connect Wallet'}
              </span>
            </button>
          </div>
        </header>

        {/* Content viewport: with mobile bottom bar padding (pb-24 on mobile, pb-0 on md+) */}
        <main className="flex-1 overflow-y-auto scrollbar-thin relative pb-24 md:pb-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="relative z-0">
            {children}
          </div>
        </main>
      </div>

      {/* Native Mobile App Bottom Navigation Bar */}
      <MobileBottomBar onOpenWallet={() => setIsModalOpen(true)} />

      {/* Command palette */}
      <AnimatePresence>
        {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Solana Wallet Modal with Live Injected Providers ONLY */}
      <AnimatePresence>
        {isModalOpen && (
          <WalletModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function WalletModal({ onClose }: { onClose: () => void }) {
  const {
    connected,
    address,
    shortAddress,
    walletType,
    balanceSol,
    balanceUsdc,
    isInstalled,
    connect,
    disconnect,
    connecting,
    error,
  } = useSolanaWallet();

  const [selectedType, setSelectedType] = useState<WalletProviderType | null>(null);

  const handleSelectWallet = async (type: WalletProviderType) => {
    setSelectedType(type);
    const success = await connect(type);
    if (success) {
      onClose();
    }
  };

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
              <h3 className="text-base font-bold">Connect Solana Wallet</h3>
              <p className="text-xs text-muted-foreground">Select your browser extension</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {connected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Solana Mainnet-Beta Connected ({walletType?.toUpperCase()})
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Address</span>
                <span className="font-mono font-medium text-foreground text-xs">{shortAddress}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Full Pubkey</span>
                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">{address}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Live SOL Balance</span>
                <span className="font-mono text-emerald-400 font-bold">{balanceSol.toFixed(4)} SOL</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
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
              {
                id: 'phantom' as const,
                name: 'Phantom',
                icon: '🟣',
                installed: isInstalled('phantom'),
                subtext: isInstalled('phantom') ? 'Browser extension detected' : 'Click to install Phantom',
              },
              {
                id: 'solflare' as const,
                name: 'Solflare',
                icon: '🟠',
                installed: isInstalled('solflare'),
                subtext: isInstalled('solflare') ? 'Browser extension detected' : 'Click to install Solflare',
              },
              {
                id: 'backpack' as const,
                name: 'Backpack',
                icon: '🔴',
                installed: isInstalled('backpack'),
                subtext: isInstalled('backpack') ? 'Browser extension detected' : 'Click to install Backpack',
              },
            ].map((w) => (
              <button
                key={w.id}
                disabled={connecting}
                onClick={() => handleSelectWallet(w.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/70 hover:border-primary/50 hover:bg-card/70 transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{w.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{w.name}</p>
                      {w.installed ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                          Detected
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          Not Detected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{w.subtext}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {connecting && selectedType === w.id ? (
                    <span className="text-xs text-primary animate-pulse">Connecting...</span>
                  ) : (
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground text-center">
          Non-custodial & secure. Real Solana Mainnet-Beta connection.
        </p>
      </motion.div>
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const assets = getAllAssetsStatic();

  const filtered = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase())
  );

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
        className="relative w-full max-w-lg hairline-card rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stock tokens, or jump to route..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching tokenized assets found
            </div>
          ) : (
            filtered.map((a) => (
              <Link
                key={a.symbol}
                href={`/market/${a.symbol}`}
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-muted/60 flex items-center justify-center font-bold text-xs">
                    {a.symbol[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{a.symbol}</p>
                    <p className="text-[10px] text-muted-foreground">{a.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-semibold">${a.price.toFixed(2)}</p>
                  <p className={cn('text-[10px] font-mono', a.change24h >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {a.change24h >= 0 ? '+' : ''}{a.change24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function getAllAssetsStatic() {
  return [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 232.45, change24h: 1.28 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 119.82, change24h: 3.42 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.5, change24h: -0.85 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 448.9, change24h: 0.64 },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 186.3, change24h: 2.15 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 179.6, change24h: 0.45 },
    { symbol: 'META', name: 'Meta Platforms, Inc.', price: 504.2, change24h: 1.9 },
    { symbol: 'COIN', name: 'Coinbase Global, Inc.', price: 224.1, change24h: -2.3 },
  ];
}
