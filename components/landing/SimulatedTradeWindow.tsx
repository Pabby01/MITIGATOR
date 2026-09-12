'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllAssets } from '@/lib/mock-data';

export function SimulatedTradeWindow() {
  const assets = getAllAssets();
  const [selectedSymbol, setSelectedSymbol] = useState('NVDAx');
  const [orderAmount, setOrderAmount] = useState(2500);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [txSignature, setTxSignature] = useState('4zPq...8wLm');
  const [activeTab, setActiveTab] = useState<'chart' | 'depth' | 'risk'>('chart');

  // 3D Perspective Mouse Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const activeAsset = assets.find((a) => a.tokenizedAsset.symbol === selectedSymbol) || assets[0];
  const price = activeAsset.quote.price;
  const tokenAmount = (orderAmount / price).toFixed(4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; // max -6 to 6 deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max -6 to 6 deg

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
    }, 450);
  };

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono text-primary mb-4 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> INTERACTIVE SIMULATION TERMINAL
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Test the Speed. <span className="text-gradient-primary">Feel the Precision.</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Experience sub-second Solana tokenized-stock execution with live MEV-shielded liquidity routing. Hover to tilt the 3D cockpit.
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
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full max-w-5xl rounded-3xl border border-white/15 dark:border-white/10 bg-card/70 dark:bg-black/60 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Top Window Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
                  MITIGATOR EXECUTION TERMINAL • SIMULATED RUNTIME
                </span>
              </div>

              {/* Asset Selectors */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {assets.slice(0, 5).map((a) => {
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
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-card/40 hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground'
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
              {/* Left Column: Live Visual Chart & Depth */}
              <div className="lg:col-span-7 space-y-4">
                {/* Ticker & Price Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-mono text-foreground">${price.toFixed(2)}</span>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        +2.45% 24h
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activeAsset.tokenizedAsset.name} · Token-2022 Solana Mint</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-1 bg-card/60 p-1 rounded-xl border border-border/60 text-xs">
                    <button
                      onClick={() => setActiveTab('chart')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'chart' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Real-time Feed
                    </button>
                    <button
                      onClick={() => setActiveTab('depth')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'depth' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      AMM Depth
                    </button>
                    <button
                      onClick={() => setActiveTab('risk')}
                      className={cn(
                        'px-2.5 py-1 rounded-lg transition-colors font-medium',
                        activeTab === 'risk' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      Guardrails
                    </button>
                  </div>
                </div>

                {/* Animated Chart Canvas */}
                <div className="h-56 rounded-2xl bg-black/40 border border-white/10 p-4 relative overflow-hidden flex flex-col justify-between">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Animated SVG Path Wave */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                    <defs>
                      <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3fb98a" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3fb98a" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,110 Q 50,60 100,90 T 200,60 T 300,40 T 400,20 L 400,150 L 0,150 Z"
                      fill="url(#tradeGrad)"
                    />
                    <path
                      d="M 0,110 Q 50,60 100,90 T 200,60 T 300,40 T 400,20"
                      fill="none"
                      stroke="#3fb98a"
                      strokeWidth="3"
                    />
                  </svg>

                  {/* Top indicators */}
                  <div className="relative z-10 flex justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Pyth Hermes Stream: 384ms
                    </span>
                    <span>High: ${(price * 1.025).toFixed(2)}</span>
                  </div>

                  {/* Live Orderbook Mini depth bars */}
                  <div className="relative z-10 grid grid-cols-6 gap-1 pt-4">
                    {[45, 65, 30, 85, 95, 70].map((h, idx) => (
                      <div key={idx} className="flex flex-col justify-end h-16">
                        <div
                          style={{ height: `${h}%` }}
                          className={cn(
                            'rounded-sm transition-all duration-500',
                            idx < 3 ? 'bg-emerald-500/30 border-t border-emerald-400' : 'bg-red-500/30 border-t border-red-400'
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bottom metrics */}
                  <div className="relative z-10 flex justify-between text-[10px] font-mono text-muted-foreground border-t border-white/5 pt-2">
                    <span>Raydium CLMM: $3.8M Liquidity</span>
                    <span>Orca Whirlpools: $2.4M</span>
                    <span>MEV Protection: ON</span>
                  </div>
                </div>

                {/* Live Telemetry Chips */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Corporate Multiplier</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">1.0000x (No split)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Market Hours</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">Solana 24/7 Live</span>
                  </div>
                  <div className="p-3 rounded-xl bg-card/50 border border-border/60">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Backing Ratio</span>
                    <span className="text-xs font-mono font-bold text-foreground">1.00:1 Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Order Form */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4 p-5 rounded-2xl bg-card/50 border border-border/60">
                <div>
                  {/* Buy / Sell Toggle */}
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-card/80 border border-border/60 mb-4">
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
                  <div className="space-y-2 p-3.5 rounded-xl bg-background/40 border border-border/50 text-xs font-mono">
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
                      'w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg',
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
                        className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300 font-mono"
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
