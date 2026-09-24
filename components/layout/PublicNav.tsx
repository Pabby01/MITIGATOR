'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

export const PUBLIC_NAV_LINKS = [
  { href: '/markets', label: 'Markets', desc: '22+ Tokenized Stocks' },
  { href: '/intelligence-platform', label: 'Intelligence', desc: 'SEC EDGAR & Signals' },
  { href: '/risk-engine', label: 'Risk Engine', desc: '8-Factor Score' },
  { href: '/smart-execution', label: 'Execution', desc: 'Jupiter v6 & DLMM' },
  { href: '/portfolio-analytics', label: 'Portfolio', desc: 'PnL & Concentration' },
  { href: '/data-provenance', label: 'Provenance', desc: '7-Tier Verification' },
];

export function PublicNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/75 border-b border-border/40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandLogo size={28} glow withText textSize="text-base sm:text-lg" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative',
                  isActive
                    ? 'text-foreground bg-secondary/70 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="public-nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Live Market Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Pyth Oracle Live</span>
          </div>

          <ThemeToggle />

          {/* THE ONLY BUTTON THAT TAKES THEM TO THE DASHBOARD */}
          <Link
            href="/discover"
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch App</span>
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-border/60 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card transition-colors shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border/50 bg-background/95 backdrop-blur-2xl px-6 py-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PUBLIC_NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all',
                      isActive
                        ? 'border-primary/40 bg-primary/10 text-foreground'
                        : 'border-border/40 bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card'
                    )}
                  >
                    <div className="text-xs font-semibold text-foreground">{link.label}</div>
                    <div className="text-[10px] text-muted-foreground">{link.desc}</div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ready to trade on-chain?</span>
              <Link
                href="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
