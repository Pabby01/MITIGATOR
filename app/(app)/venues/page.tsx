'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowUpDown,
  Building2,
  BadgeCheck,
  Layers,
  Zap,
  CreditCard,
  Scale,
  X,
  ChevronRight,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PageTipSection } from '@/components/shared/PageTipSection';
import { useSolanaWallet } from '@/lib/services/solana-wallet';
import {
  getAllVenues,
  TradingVenue,
  VenueCategory,
  KYCRequirement,
} from '@/lib/services/venues-directory-service';
import { cn } from '@/lib/utils';

export default function VenuesDirectoryPage() {
  const { network } = useSolanaWallet();
  const allVenues = useMemo(() => getAllVenues(), []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [devnetOnly, setDevnetOnly] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Region tabs
  const regionTabs = [
    { id: 'all', label: 'All Regions', flag: '🌍' },
    { id: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' },
    { id: 'Global / Multi-Region', label: 'Global DeFi', flag: '🌐' },
    { id: 'North America', label: 'United States', flag: '🇺🇸' },
    { id: 'Europe', label: 'Europe (Swiss/DE)', flag: '🇪🇺' },
    { id: 'Latin America', label: 'Latin America', flag: '🌎' },
  ];

  // Category options
  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'Tokenized Stock Issuer', label: 'Tokenized Stocks' },
    { id: 'Exchange & On-Ramp', label: 'Exchanges & On-Ramps' },
    { id: 'DEX Aggregator', label: 'DEX Aggregators' },
    { id: 'RWA Protocol', label: 'RWA Protocols' },
    { id: 'Fintech & Wealth App', label: 'Wealth & Stock Apps' },
    { id: 'Derivatives & Perpetuals', label: 'Derivatives' },
  ];

  // Filter logic
  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      // Devnet toggle
      if (devnetOnly && !venue.solanaNetworks.includes('devnet')) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'Nigeria') {
          if (venue.country !== 'Nigeria') return false;
        } else if (venue.region !== selectedRegion) {
          return false;
        }
      }
      // Category filter
      if (selectedCategory !== 'all' && venue.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesTagline = venue.tagline.toLowerCase().includes(q);
        const matchesCountry = venue.country.toLowerCase().includes(q);
        const matchesAssets = venue.supportedAssets.some((a) => a.toLowerCase().includes(q));
        const matchesPayments = venue.paymentMethods.some((p) => p.toLowerCase().includes(q));
        const matchesReg = venue.regulation.status.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesCountry && !matchesAssets && !matchesPayments && !matchesReg) {
          return false;
        }
      }
      return true;
    });
  }, [allVenues, selectedRegion, selectedCategory, devnetOnly, searchQuery]);

  // Comparison toggle
  const toggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id]; // Keep maximum 3 items
      }
      return [...prev, id];
    });
  };

  const comparedVenues = useMemo(() => {
    return allVenues.filter((v) => selectedForCompare.includes(v.id));
  }, [allVenues, selectedForCompare]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 via-card/40 to-primary/5 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 border border-primary/25 text-primary">
              <Globe className="h-3.5 w-3.5" />
              <span>Solana Global & Nigerian Directory</span>
              <span className="text-muted-foreground">·</span>
              <span className={cn('font-semibold', network === 'devnet' ? 'text-amber-400' : 'text-emerald-400')}>
                Cluster: {network === 'devnet' ? 'Devnet' : 'Mainnet'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Solana Asset Venues & App Directory
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Compare rates, trading fees, KYC tiers, and deposit rails across verified Nigerian and international
              platforms trading tokenized equities, real-world assets, and crypto on Solana.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
              <span className="text-2xl font-black text-foreground">10+</span>
              <p className="text-[11px] font-medium text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <span>🇳🇬</span> Nigerian Venues
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
              <span className="text-2xl font-black text-emerald-400">12+</span>
              <p className="text-[11px] font-medium text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                <span>🌐</span> Global Protocols
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
              <span className="text-2xl font-black text-cyan-400">~400ms</span>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Solana Settlement</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── COLLAPSIBLE DIRECTORY GUIDE ─── */}
      <PageTipSection
        pageTitle="Venues Directory & Rate Comparator"
        subtitle="How to compare platforms, deposit rails, regulatory licensing, and fee structures"
        badge="Directory Guide"
        defaultOpen={false}
        storageKey="venues_directory"
        tips={[
          {
            title: 'Nigerian On-Ramps & Tokenization',
            description: 'Platforms like NectarFi, Roqqu, GetEquity, Busha, and Quidax provide instant Naira (NGN) bank transfers, SEC Nigeria compliance, and direct access to tokenized African assets like the Dangote Refinery.',
            badge: 'Nigeria Rails',
          },
          {
            title: 'Global Regulated Tokenized Equities',
            description: 'Backpack Exchange (VARA Dubai), Dinari dShares (US SEC Transfer Agent), and Backed Finance (Swiss DLT FINMA) issue 1:1 backed tokens holding actual physical shares with private bank custodians.',
            badge: 'Global RWA',
          },
          {
            title: 'Solana High-Speed Settlement',
            description: 'All listed venues settle on Solana within ~400ms using SPL and Token-2022 standards, eliminating traditional 2-day settlement clearinghouse delays.',
            badge: 'T+0 Finality',
          },
          {
            title: 'Side-by-Side Comparator',
            description: 'Click "Compare" on up to 3 platforms to evaluate Trading Fees, KYC tiers, Deposit costs, and supported equities side-by-side in a single window.',
            badge: 'Comparator',
          },
        ]}
        hackathonDefense="This directory aggregates the entire Solana stock and RWA ecosystem across Africa, Europe, the Americas, and global DeFi, proving that Solana provides cross-border capital rails connecting emerging markets to Wall Street securities."
      />

      {/* ─── CONTROLS: SEARCH & FILTERS ─── */}
      <div className="space-y-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by venue name, country (Nigeria, US), token (TSLA, Dangote), or fee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/50 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Devnet Toggle */}
          <button
            onClick={() => setDevnetOnly(!devnetOnly)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono border transition-all whitespace-nowrap',
              devnetOnly
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/30 font-semibold'
                : 'bg-card/50 border-border text-muted-foreground hover:text-foreground'
            )}
            title="Filter venues that offer Solana Devnet sandbox testing"
          >
            <span className={cn('h-2 w-2 rounded-full', devnetOnly ? 'bg-amber-400 animate-pulse' : 'bg-muted-foreground/50')} />
            <span>Devnet Compatible Only</span>
          </button>

          {/* Compare Button */}
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 animate-in fade-in"
            >
              <Scale className="h-4 w-4" />
              <span>Compare ({selectedForCompare.length})</span>
            </button>
          )}
        </div>

        {/* Region & Country Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {regionTabs.map((tab) => {
            const active = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                  active
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'bg-card/60 border border-border/80 text-muted-foreground hover:text-foreground hover:bg-card'
                )}
              >
                <span>{tab.flag}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1 rounded-lg transition-all whitespace-nowrap',
                  active
                    ? 'bg-primary/15 text-primary border border-primary/30 font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── VENUES GRID ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{filteredVenues.length}</strong> verified platforms
          </span>
          <span className="hidden sm:inline">Select up to 3 venues to compare side-by-side</span>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-border p-8">
            <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-foreground">No matching venues found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search query, selecting "All Regions", or unchecking the Devnet filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedCategory('all');
                setDevnetOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVenues.map((venue) => {
              const isCompared = selectedForCompare.includes(venue.id);

              return (
                <div
                  key={venue.id}
                  className={cn(
                    'relative rounded-2xl border bg-card/40 backdrop-blur-md p-5 flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 group',
                    isCompared ? 'border-primary ring-1 ring-primary/40 bg-card/70' : 'border-border'
                  )}
                >
                  {/* Top Bar: Official Logo, Name, Flag, & Category */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* High-res Official Logo from Company Domain with Fallback */}
                        <div className="relative h-12 w-12 rounded-xl border border-border/80 bg-background/90 p-1 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={venue.logoUrl}
                            alt={`${venue.name} official logo`}
                            className="h-8 w-8 object-contain rounded"
                            loading="lazy"
                            onError={(e) => {
                              // If image fails, replace with stylized letter badge
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.fallback-badge')) {
                                const span = document.createElement('span');
                                span.className = 'fallback-badge font-bold text-sm text-primary';
                                span.innerText = venue.name.slice(0, 2).toUpperCase();
                                parent.appendChild(span);
                              }
                            }}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {venue.name}
                            </h3>
                            <span title={venue.country} className="text-base cursor-default">
                              {venue.flag}
                            </span>
                            {venue.verifiedOfficial && (
                              <span title="Verified Official Domain" className="inline-flex items-center">
                                <BadgeCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            {venue.country} · {venue.category}
                          </p>
                        </div>
                      </div>

                      {/* Compare Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleCompare(venue.id)}
                        className={cn(
                          'p-1.5 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-1',
                          isCompared
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border/70 text-muted-foreground hover:text-foreground hover:bg-card/60'
                        )}
                        title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                      >
                        <Scale className="h-3 w-3" />
                        <span className="hidden sm:inline">{isCompared ? 'Added' : 'Compare'}</span>
                      </button>
                    </div>

                    {/* Tagline & Description */}
                    <p className="text-xs font-semibold text-foreground/90 mb-1 line-clamp-1">
                      {venue.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {venue.description}
                    </p>

                    {/* Regulation & Solana Network Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        {venue.regulation.status}
                      </span>

                      {venue.solanaNetworks.includes('devnet') && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/10 border border-amber-500/25 text-amber-400">
                          Devnet Ready
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 border border-border/60 text-muted-foreground">
                        KYC: {venue.kycRequirement.split('(')[0]}
                      </span>
                    </div>

                    {/* Rates & Pricing Comparison Table Card */}
                    <div className="rounded-xl border border-border/70 bg-card/60 p-3 space-y-2 mb-4 text-xs font-mono">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Trading Fee:</span>
                        <span className="font-semibold text-foreground">{venue.pricingAndFees.tradingFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Deposit Fee:</span>
                        <span className="text-emerald-400 font-medium">{venue.pricingAndFees.depositFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Min Trade:</span>
                        <span className="text-foreground">{venue.pricingAndFees.minTradeAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Settlement:</span>
                        <span className="text-cyan-400">{venue.solanaFeatures.settlementSpeed}</span>
                      </div>
                    </div>

                    {/* Assets & Payment Chips */}
                    <div className="space-y-2 mb-5">
                      <div className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Top Assets: </span>
                        {venue.supportedAssets.slice(0, 4).join(', ')}
                        {venue.supportedAssets.length > 4 && ` +${venue.supportedAssets.length - 4} more`}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Deposit Rails: </span>
                        {venue.paymentMethods.slice(0, 3).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Outbound to Company Website / App */}
                  <div className="pt-3 border-t border-border/70 flex items-center gap-2">
                    <a
                      href={venue.appUrl || venue.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm group-hover:shadow"
                    >
                      <span>Trade on {venue.name}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <Link
                      href={`/execution?symbol=${venue.supportedAssets[0]?.replace(/[^a-zA-Z]/g, '') || 'NVDA'}`}
                      className="px-3 py-2 rounded-xl text-xs font-medium border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                      title="Inspect liquidity route in Mitigator"
                    >
                      Mitigator Route
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── SIDE-BY-SIDE COMPARISON MODAL ─── */}
      <AnimatePresence>
        {compareModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setCompareModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto hairline-card rounded-3xl p-6 md:p-8 shadow-2xl space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/70 pb-4">
                <div className="flex items-center gap-2.5">
                  <Scale className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Platform Rate & Feature Comparison</h2>
                    <p className="text-xs text-muted-foreground">Side-by-side analysis of selected Solana venues</p>
                  </div>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 text-muted-foreground font-semibold uppercase tracking-wider w-40">
                        Feature / Metric
                      </th>
                      {comparedVenues.map((v) => (
                        <th key={v.id} className="py-3 px-4 font-bold text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <img src={v.logoUrl} alt={v.name} className="h-5 w-5 rounded object-contain" />
                            <span>{v.name}</span>
                            <span>{v.flag}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Category</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 text-foreground font-medium">
                          {v.category}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Trading Fee</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 font-mono font-bold text-primary">
                          {v.pricingAndFees.tradingFee}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Deposit Fee</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 font-mono text-emerald-400">
                          {v.pricingAndFees.depositFee}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Min Order Amount</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 font-mono text-foreground">
                          {v.pricingAndFees.minTradeAmount}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">KYC Requirement</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 text-foreground">
                          {v.kycRequirement}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Regulatory Status</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 text-foreground">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <ShieldCheck className="h-3 w-3" />
                            {v.regulation.status}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">{v.regulation.jurisdiction}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Solana Settlement</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 font-mono text-cyan-400">
                          {v.solanaFeatures.settlementSpeed}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Payment Rails</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4 text-muted-foreground">
                          {v.paymentMethods.join(' · ')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-muted-foreground">Action</td>
                      {comparedVenues.map((v) => (
                        <td key={v.id} className="py-3 px-4">
                          <a
                            href={v.appUrl || v.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <span>Open {v.name}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
