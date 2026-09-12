'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') setSearchOpen(false);
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
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            {!collapsed && <span className="text-lg font-bold tracking-tight">MITIGATOR</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors"
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
                {active && !collapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
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

        {/* Bottom: Wallet + Settings */}
        <div className="border-t border-border p-2 space-y-0.5">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
              <Wallet className="h-3.5 w-3.5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">7xKf...3pQw</p>
                <p className="text-[10px] text-muted-foreground">Connected</p>
              </div>
            )}
          </Link>
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
              className="md:hidden fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">MITIGATOR</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="text-muted-foreground">
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
              className="md:hidden text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-sm text-muted-foreground hover:border-primary/30 transition-colors w-full max-w-md"
            >
              <Search className="h-4 w-4" />
              <span>Search assets, ask AI...</span>
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
            {/* Wallet */}
            <button className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm hover:bg-primary/15 transition-colors">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-primary">7xKf...3pQw</span>
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
        className="relative w-full max-w-xl glass-panel rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, ask AI, run commands..."
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
