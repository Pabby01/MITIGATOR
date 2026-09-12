'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllAssets } from '@/lib/mock-data';

const SYMBOL_MAP: Record<string, { tv: string; exchange: string; name: string }> = {
  NVDAx: { tv: 'NASDAQ:NVDA', exchange: 'NASDAQ', name: 'NVIDIA Corporation' },
  AAPLx: { tv: 'NASDAQ:AAPL', exchange: 'NASDAQ', name: 'Apple Inc.' },
  TSLAx: { tv: 'NASDAQ:TSLA', exchange: 'NASDAQ', name: 'Tesla, Inc.' },
  AMZNx: { tv: 'NASDAQ:AMZN', exchange: 'NASDAQ', name: 'Amazon.com, Inc.' },
  GOOGLx: { tv: 'NASDAQ:GOOGL', exchange: 'NASDAQ', name: 'Alphabet Inc.' },
  MSFTx: { tv: 'NASDAQ:MSFT', exchange: 'NASDAQ', name: 'Microsoft Corporation' },
  SPYx: { tv: 'AMEX:SPY', exchange: 'AMEX', name: 'SPDR S&P 500 ETF Trust' },
};

export function SimulatedTradeWindow() {
  const assets = getAllAssets();
  const [selectedSymbol, setSelectedSymbol] = useState('NVDAx');
  const [orderAmount, setOrderAmount] = useState(2500);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [txSignature, setTxSignature] = useState('4zPq...8wLm');
  const [activeTab, setActiveTab] = useState<'chart' | 'depth' | 'guardrails'>('chart');
  const [mounted, setMounted] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3D Perspective Mouse Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const activeAsset = assets.find((a) => a.tokenizedAsset.symbol === selectedSymbol) || assets[0];
  const price = activeAsset.quote.price;
  const tokenAmount = (orderAmount / price).toFixed(4);
  const tvInfo = SYMBOL_MAP[selectedSymbol] || { tv: 'NASDAQ:NVDA', exchange: 'NASDAQ', name: 'NVIDIA Corp' };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // max -5 to 5 deg
    const rotateY = ((x - centerX) / centerX) * 5;  // max -5 to 5 deg

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleSimulateTrade = () => {
    setIsExecuting(true);
    setExecutionComplete(false);

    // Simulate 384ms Solana onchain finality
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionComplete(true);
      setTxSignature(`5xKf${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`);
    }, 420);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono text-primary mb-4 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> LIVE SIMULATION TERMINAL
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Test the Speed. <span className="text-gradient-primary">Feel the Precision.</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Real-time live TradingView chart feed, Solana Token-2022 order simulation, and sub-second MEV guardrails. Hover to tilt the 3D cockpit.
          </p>
        </div>

        {/* 3D Tilting Cockpit Container */}
        <div
          style={{ perspective: 1400 }}
          className="w-full flex justify-center items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            animate={{
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="w-full max-w-5xl rounded-3xl border border-white/20 dark:border-white/10 bg-card/85 dark:bg-black/70 backdrop-blur-2xl shadow-2xl p-5 sm:p-7 relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Top Window Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
                  MITIGATOR EXECUTION TERMINAL • LIVE MARKET COCKPIT
                </span>
              </div>

              {/* Asset Selectors */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {assets.slice(0, 6).map((a) => {
                  const sym = a.tokenizedAsset.symbol;
                  const isSelected = sym === selectedSymbol;
                  return (
                    <button
                      key={sym}
                      onClick={() => {
                        setSelectedSymbol(sym);
                        setExecutionComplete(false);
                      }}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all',
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                          : 'bg-card/50 hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Chart & Terminal */}
              <div className="lg:col-span-7 space-y-4">
                {/* Ticker Header & Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold font-mono text-foreground">${price.toFixed(2)}</span>
                      <span className={cn(
                        'text-xs font-mono font-semibold px-2 py-0.5 rounded border',
                        activeAsset.quote.changePct24h >= 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      )}>
                        {activeAsset.quote.changePct24h >= 0 ? '+' : ''}{activeAsset.quote.changePct24h.toFixed(2)}% 24h
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {tvInfo.name} ({tvInfo.exchange}) · Token-2022 Solana Mint
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 text-xs">
                    <button
                      onClick={() => setActiveTab('chart')}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'chart' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <TrendingUp className="h-3 w-3" /> Live Chart
                    </button>
                    <button
                      onClick={() => setActiveTab('depth')}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'depth' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <BarChart3 className="h-3 w-3" /> AMM Depth
                    </button>
                    <button
                      onClick={() => setActiveTab('guardrails')}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'guardrails' ? 'bg-primary text-primary-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <ShieldCheck className="h-3 w-3" /> Guardrails
                    </button>
                  </div>
                </div>

                {/* Viewport Box */}
                <div className="h-80 rounded-2xl bg-card/60 dark:bg-black/50 border border-border/80 overflow-hidden relative shadow-inner flex flex-col">
                  {activeTab === 'chart' && (
                    <div className="relative w-full h-full">
                      {mounted && (
                        <iframe
                          key={`${selectedSymbol}-${isDark ? 'dark' : 'light'}`}
                          src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tvInfo.tv)}&interval=D&theme=${isDark ? 'dark' : 'light'}&style=1&timezone=Etc%2FUTC&studies=%5B%5D&hide_top_toolbar=0&hide_legend=0&hide_side_toolbar=1&allow_symbol_change=0&save_image=0&details=0&calendar=0&hotlist=0&locale=en`}
                          className="w-full h-full border-0"
                          title={`Live TradingView Chart for ${selectedSymbol}`}
                          loading="lazy"
                        />
                      )}
                      {/* Floating Badge */}
                      <div className="absolute top-2.5 right-2.5 pointer-events-none z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background/90 backdrop-blur-md border border-border/80 text-[10px] font-mono text-emerald-400 shadow-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        TRADINGVIEW REAL-TIME
                      </div>
                    </div>
                  )}

                  {activeTab === 'depth' && (
                    <div className="p-5 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/40 pb-2">
                        <span>Raydium CLMM Orderbook Depth</span>
                        <span className="text-emerald-400">Spread: 0.04%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-2 flex-1 items-center">
                        {/* Bids */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Bids (Buy Orders)</span>
                          {[
                            { p: (price - 0.05).toFixed(2), size: '1,420', w: '85%' },
                            { p: (price - 0.12).toFixed(2), size: '2,890', w: '95%' },
                            { p: (price - 0.25).toFixed(2), size: '940', w: '60%' },
                            { p: (price - 0.40).toFixed(2), size: '3,200', w: '100%' },
                          ].map((b, i) => (
                            <div key={i} className="relative flex justify-between text-xs font-mono p-1 rounded bg-emerald-500/5">
                              <div
                                className="absolute inset-0 bg-emerald-500/15 rounded pointer-events-none"
                                style={{ width: b.w }}
                              />
                              <span className="relative z-10 text-emerald-400 font-semibold">${b.p}</span>
                              <span className="relative z-10 text-muted-foreground">{b.size}</span>
                            </div>
                          ))}
                        </div>

                        {/* Asks */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-red-400 font-bold">Asks (Sell Orders)</span>
                          {[
                            { p: (price + 0.06).toFixed(2), size: '1,120', w: '70%' },
                            { p: (price + 0.15).toFixed(2), size: '2,450', w: '90%' },
                            { p: (price + 0.30).toFixed(2), size: '820', w: '50%' },
                            { p: (price + 0.45).toFixed(2), size: '2,900', w: '95%' },
                          ].map((a, i) => (
                            <div key={i} className="relative flex justify-between text-xs font-mono p-1 rounded bg-red-500/5">
                              <div
                                className="absolute inset-0 bg-red-500/15 rounded pointer-events-none"
                                style={{ width: a.w }}
                              />
                              <span className="relative z-10 text-red-400 font-semibold">${a.p}</span>
                              <span className="relative z-10 text-muted-foreground">{a.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-muted-foreground border-t border-border/40 pt-2">
                        <span>Total Bid: $4.2M USDC</span>
                        <span>Total Ask: $3.9M USDC</span>
                        <span className="text-cyan-400">Orca Whirlpool: Balanced</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'guardrails' && (
                    <div className="p-5 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/40 pb-2">
                        <span>Pre-Trade Guardrail Matrix</span>
                        <span className="text-emerald-400">Status: Protected</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                        <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                          <span className="text-muted-foreground block text-[10px] uppercase font-mono">Oracle Feed Freshness</span>
                          <span className="text-sm font-bold font-mono text-emerald-400">384ms (Pyth Hermes)</span>
                          <p className="text-[11px] text-muted-foreground mt-1">Confidence interval ±$0.02</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                          <span className="text-muted-foreground block text-[10px] uppercase font-mono">MEV Sandwich Guard</span>
                          <span className="text-sm font-bold font-mono text-cyan-400">Private Jito Bundle</span>
                          <p className="text-[11px] text-muted-foreground mt-1">Zero frontrunning slippage</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                          <span className="text-muted-foreground block text-[10px] uppercase font-mono">Market Session</span>
                          <span className="text-sm font-bold font-mono text-foreground">Solana 24/7 Extended</span>
                          <p className="text-[11px] text-muted-foreground mt-1">Off-market divergence: 0.03%</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                          <span className="text-muted-foreground block text-[10px] uppercase font-mono">Corporate Multiplier</span>
                          <span className="text-sm font-bold font-mono text-amber-400">1.0000x (No split)</span>
                          <p className="text-[11px] text-muted-foreground mt-1">Inspected onchain</p>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground text-center border-t border-border/40 pt-2">
                        Automated slippage ceiling capped at 0.05% with Jupiter smart route.
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Telemetry Chips */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-card/60 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Corporate Multiplier</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">1.0000x (No split)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card/60 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Market Hours</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">Solana 24/7 Live</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card/60 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Backing Ratio</span>
                    <span className="text-xs font-mono font-bold text-foreground">1.00:1 Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Order Form */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-card/60 border border-border/60">
                <div>
                  {/* Buy / Sell Toggle */}
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 mb-4">
                    <button
                      onClick={() => setTradeAction('buy')}
                      className={cn(
                        'py-1.5 rounded-lg text-xs font-semibold transition-all',
                        tradeAction === 'buy' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-muted-foreground'
                      )}
                    >
                      Buy {selectedSymbol}
                    </button>
                    <button
                      onClick={() => setTradeAction('sell')}
                      className={cn(
                        'py-1.5 rounded-lg text-xs font-semibold transition-all',
                        tradeAction === 'sell' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-muted-foreground'
                      )}
                    >
                      Sell {selectedSymbol}
                    </button>
                  </div>

                  {/* Trade Size Input */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Order Size (USDC)</span>
                      <span className="font-mono text-primary font-medium">${orderAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-background/60 font-mono text-sm">
                      <span className="text-muted-foreground">$</span>
                      <input
                        type="number"
                        value={orderAmount}
                        onChange={(e) => setOrderAmount(Math.max(50, parseInt(e.target.value) || 0))}
                        className="bg-transparent flex-1 outline-none font-bold"
                      />
                      <span className="text-xs text-muted-foreground">USDC</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex gap-2 mb-4">
                    {[500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setOrderAmount(amt)}
                        className={cn(
                          'flex-1 py-1 rounded-lg text-[11px] font-mono transition-colors border',
                          orderAmount === amt
                            ? 'bg-primary/15 border-primary text-primary font-bold'
                            : 'border-border/60 hover:bg-card text-muted-foreground'
                        )}
                      >
                        ${amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>

                  {/* Order Summary Specs */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-background/50 border border-border/50 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tokens:</span>
                      <span className="font-bold text-foreground">{tokenAmount} {selectedSymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slippage Ceiling:</span>
                      <span className="text-emerald-400">0.05% Cap</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Routing Layer:</span>
                      <span className="text-cyan-400">Raydium + Jupiter Aggregator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas (Solana):</span>
                      <span className="text-muted-foreground">&lt;0.000005 SOL ($0.0008)</span>
                    </div>
                  </div>
                </div>

                {/* Execute Button & Confirmation */}
                <div>
                  <button
                    onClick={handleSimulateTrade}
                    disabled={isExecuting}
                    className={cn(
                      'w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer',
                      tradeAction === 'buy'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
                    )}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Simulating Solana Finality...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Simulate {tradeAction === 'buy' ? 'Buy' : 'Sell'} ({tokenAmount} {selectedSymbol})
                      </>
                    )}
                  </button>

                  {/* Execution Toast Notification */}
                  <AnimatePresence>
                    {executionComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-400 font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span>Finalized in 384ms ({txSignature})</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold">Slot 291.8M</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
