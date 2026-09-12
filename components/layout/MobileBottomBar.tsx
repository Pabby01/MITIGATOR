'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Brain,
  Zap,
  Wallet,
  Menu,
  X,
  ShieldCheck,
  Bot,
  FlaskConical,
  Cpu,
  ScrollText,
  Bell,
  Settings,
  Users,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { useSolanaWallet } from '@/lib/services/solana-wallet';

const PRIMARY_MOBILE_TABS = [
  { href: '/discover', label: 'Overview', icon: LayoutDashboard },
  { href: '/market', label: 'Markets', icon: TrendingUp },
  { href: '/intelligence', label: 'Intel', icon: Brain },
  { href: '/execution', label: 'Trade', icon: Zap },
  { href: '/portfolio', label: 'Vault', icon: Wallet },
];

const MORE_TOOLS = [
  { href: '/risk', label: 'Risk Radar & Stress Tests', icon: ShieldCheck, desc: 'Real-time VaR, peg deviations & circuit breakers' },
  { href: '/agents', label: 'Autonomous AI Agents', icon: Bot, desc: 'HedgeBot, SEC Sentinel & Sentient Traders' },
  { href: '/robo', label: 'Robo Advisor', icon: Bot, desc: 'Automated delta-neutral rebalancing engine' },
  { href: '/strategies', label: 'Yield Strategies', icon: Cpu, desc: 'Tokenized stock vaults & liquidity loops' },
  { href: '/paper', label: 'Paper Trading Sandbox', icon: FlaskConical, desc: 'Zero-risk simulated order execution' },
  { href: '/provenance', label: 'Legal & Custody Vault', icon: ScrollText, desc: 'SPV backing verification & audits' },
  { href: '/community', label: 'Community Alpha', icon: Users, desc: 'Top trader sentiment & verified leaderboards' },
  { href: '/alerts', label: 'Risk Alerts', icon: Bell, desc: 'Volatility surges & liquidation warnings' },
  { href: '/settings', label: 'Settings & RPC', icon: Settings, desc: 'Customize feeds, slippage & keys' },
];

export function MobileBottomBar({ onOpenWallet }: { onOpenWallet?: () => void }) {
  const pathname = usePathname();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const { connected, shortAddress, balanceSol } = useSolanaWallet();

  const isMoreActive = MORE_TOOLS.some((t) => pathname.startsWith(t.href));

  return (
    <>
      {/* Fixed bottom navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 dark:bg-card/85 backdrop-blur-2xl border-t border-border/80 px-2 py-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] safe-area-bottom"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {PRIMARY_MOBILE_TABS.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== '/discover' && pathname.startsWith(tab.href));
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all select-none',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-110 stroke-[2.25]')} />
                  {active && (
                    <motion.div
                      layoutId="mobileTabGlow"
                      className="absolute -inset-1 rounded-full bg-primary/20 blur-sm -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </div>
                <span className={cn('text-[10px] mt-1 font-medium tracking-tight', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>
                  {tab.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="mobileTabPill"
                    className="h-1 w-3 rounded-full bg-primary mt-0.5"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            );
          })}

          {/* More Drawer Trigger */}
          <button
            onClick={() => setMoreSheetOpen(true)}
            className={cn(
              'relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all select-none',
              isMoreActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Menu className={cn('h-5 w-5 transition-transform', isMoreActive && 'scale-110 stroke-[2.25]')} />
              {isMoreActive && (
                <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm -z-10" />
              )}
            </div>
            <span className={cn('text-[10px] mt-1 font-medium tracking-tight', isMoreActive ? 'text-primary font-semibold' : 'text-muted-foreground')}>
              More
            </span>
            {isMoreActive && <div className="h-1 w-3 rounded-full bg-primary mt-0.5" />}
          </button>
        </div>
      </nav>

      {/* Slide-Up Drawer for More Tools */}
      <AnimatePresence>
        {moreSheetOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreSheetOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-h-[85vh] bg-card border-t border-border rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Grab handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-border" />
              </div>

              {/* Sheet Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/70">
                <div className="flex items-center gap-2.5">
                  <BrandLogo size={24} glow />
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">MITIGATOR Terminal</h3>
                    <p className="text-[11px] text-muted-foreground">All Suite Tools & Diagnostics</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setMoreSheetOpen(false)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground bg-muted/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Wallet status banner */}
              <div className="px-5 pt-3 pb-2">
                <button
                  onClick={() => {
                    setMoreSheetOpen(false);
                    onOpenWallet?.();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                      <Wallet className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {connected ? shortAddress : 'Connect Solana Wallet'}
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        {connected ? `${balanceSol.toFixed(2)} SOL Available` : 'Click to connect or use Demo Mode'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Scrollable list of modules */}
              <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1.5 pb-8 scrollbar-thin">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 pt-1 pb-0.5">
                  Advanced Modules
                </p>
                {MORE_TOOLS.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreSheetOpen(false)}
                      className={cn(
                        'flex items-center gap-3.5 p-3 rounded-xl transition-all text-left border',
                        active
                          ? 'border-primary/40 bg-primary/10 text-foreground'
                          : 'border-transparent hover:border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className={cn(
                        'p-2 rounded-lg',
                        active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs font-semibold leading-tight', active && 'text-primary')}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-60" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
